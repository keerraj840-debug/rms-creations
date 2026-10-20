import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { APP_VERSION } from '../../environments/version';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;

  // Reactive state signals
  readonly currentVersion = signal<string>(APP_VERSION);
  readonly updateVersion = signal<string>('');
  readonly canInstall = signal<boolean>(false);
  readonly isInstalled = signal<boolean>(false);
  readonly isIos = signal<boolean>(false);
  readonly showInstallGuide = signal<boolean>(false);
  readonly showUpdateBanner = signal<boolean>(false);
  readonly isUpdateInstalling = signal<boolean>(false);
  readonly isOffline = signal<boolean>(false);

  constructor() {
    if (this.isBrowser) {
      this.initPwa();
    }
  }

  private initPwa(): void {
    // 1. Detect if running as installed standalone PWA
    const isStandalone =
      (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
      Boolean((window.navigator as unknown as { standalone?: boolean })?.standalone) ||
      Boolean(typeof document !== 'undefined' && document.referrer?.includes('android-app://'));

    this.isInstalled.set(isStandalone);

    // 2. Detect iOS device for manual "Add to Home Screen" instructions
    const userAgent = (window.navigator?.userAgent || '').toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    this.isIos.set(isAppleDevice && isSafari && !isStandalone);

    // 3. Online/offline connection status
    this.isOffline.set(!window.navigator?.onLine);
    if (typeof window.addEventListener === 'function') {
      window.addEventListener('online', () => this.isOffline.set(false));
      window.addEventListener('offline', () => this.isOffline.set(true));

      // 4. Capture native browser beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault();
        this.deferredPrompt = e as BeforeInstallPromptEvent;
        
        // Check cooldown from previous dismissal
        try {
          const dismissedUntil = localStorage?.getItem('rms_pwa_dismissed_until');
          if (!dismissedUntil || Date.now() > Number(dismissedUntil)) {
            this.canInstall.set(true);
          }
        } catch {
          this.canInstall.set(true);
        }
      });

      // 5. Track when the app is successfully installed
      window.addEventListener('appinstalled', () => {
        this.isInstalled.set(true);
        this.canInstall.set(false);
        this.deferredPrompt = null;
        try {
          localStorage?.removeItem('rms_pwa_dismissed_until');
        } catch {}
      });
    }

    // 6. Register Service Worker and monitor updates
    this.registerServiceWorker();

    // 7. Check for version updates via version.json
    this.checkVersionUpdate();
  }

  private registerServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          this.swRegistration = reg;

          // If a new worker is found waiting to activate
          if (reg.waiting) {
            this.handleWaitingServiceWorker();
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  this.handleWaitingServiceWorker();
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });

      // Reload when the new service worker takes over control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }

  private handleWaitingServiceWorker(): void {
    this.showUpdateBanner.set(true);
    if (!this.updateVersion()) {
      this.updateVersion.set('Latest');
    }
  }

  /**
   * Fetches the latest published version descriptor from the server.
   */
  async checkVersionUpdate(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      // Force non-cached request
      const response = await fetch(`/version.json?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.version && data.version !== this.currentVersion()) {
          this.updateVersion.set(data.version);
          this.showUpdateBanner.set(true);

          // Proactively trigger SW update check
          if (this.swRegistration) {
            this.swRegistration.update().catch(() => {});
          }
        }
      }
    } catch {
      // Offline or network error - safe to ignore
    }
  }

  /**
   * Trigger native or guided installation.
   */
  async promptInstall(): Promise<'accepted' | 'dismissed' | 'guided'> {
    if (this.deferredPrompt) {
      const promptEvent = this.deferredPrompt;
      this.deferredPrompt = null;
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        this.canInstall.set(false);
        this.isInstalled.set(true);
        return 'accepted';
      } else {
        this.canInstall.set(false);
        this.dismissInstallPrompt(7); // 7-day cooldown
        return 'dismissed';
      }
    }

    // If on iOS or browsers without native prompt, display the visual guide
    this.showInstallGuide.set(true);
    return 'guided';
  }

  /**
   * Apply pending update immediately.
   */
  applyUpdate(): void {
    this.isUpdateInstalling.set(true);
    if (this.swRegistration?.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      // Fallback reload if controllerchange doesn't trigger in 1s
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      window.location.reload();
    }
  }

  /**
   * Dismiss the install prompt banner with an optional cooldown (in days).
   */
  dismissInstallPrompt(cooldownDays = 3): void {
    this.canInstall.set(false);
    if (this.isBrowser) {
      const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
      localStorage.setItem('rms_pwa_dismissed_until', String(Date.now() + cooldownMs));
    }
  }

  /**
   * Dismiss the update banner temporarily.
   */
  dismissUpdateBanner(): void {
    this.showUpdateBanner.set(false);
  }

  /**
   * Toggle the iOS / Device installation step-by-step modal guide.
   */
  toggleInstallGuide(show?: boolean): void {
    this.showInstallGuide.set(show !== undefined ? show : !this.showInstallGuide());
  }
}
