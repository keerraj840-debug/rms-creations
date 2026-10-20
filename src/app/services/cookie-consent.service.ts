import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageService } from './local-storage.service';

export interface CookiePreferences {
  essential: boolean; // Always true (auth, cart session, theme)
  analytics: boolean; // GA4 tracking
  timestamp: string;
  version: string;
}

const STORAGE_KEY = 'rms_cookie_consent_v1';
const CURRENT_VERSION = '1.0';
const GA_MEASUREMENT_ID = 'G-RMSCREATION';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly localStorage = inject(LocalStorageService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Has the user made a choice yet?
   */
  public hasDecided = signal<boolean>(false);

  /**
   * Current user cookie preferences
   */
  public preferences = signal<CookiePreferences>({
    essential: true,
    analytics: false,
    timestamp: '',
    version: CURRENT_VERSION
  });

  /**
   * Controls visibility of the detailed customization dialog
   */
  public showPreferencesModal = signal<boolean>(false);

  constructor() {
    this.initConsent();
  }

  private initConsent(): void {
    if (!this.isBrowser) return;

    try {
      const stored = this.localStorage.getItem<CookiePreferences>(STORAGE_KEY);
      if (stored && typeof stored === 'object' && 'analytics' in stored) {
        this.preferences.set(stored);
        this.hasDecided.set(true);
        this.applyTrackingPreferences(stored.analytics);
      } else {
        // By default until explicit affirmative consent is given (DPDP Act 2023 requirement),
        // analytics is disabled
        this.hasDecided.set(false);
        this.applyTrackingPreferences(false);
      }
    } catch {
      this.hasDecided.set(false);
      this.applyTrackingPreferences(false);
    }
  }

  /**
   * Accept all cookies including analytics
   */
  public acceptAll(): void {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: true,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION
    };
    this.savePreferences(prefs);
  }

  /**
   * Reject non-essential cookies (keep essential only)
   */
  public rejectNonEssential(): void {
    const prefs: CookiePreferences = {
      essential: true,
      analytics: false,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION
    };
    this.savePreferences(prefs);
  }

  /**
   * Save custom user choices
   */
  public saveCustom(analytics: boolean): void {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      timestamp: new Date().toISOString(),
      version: CURRENT_VERSION
    };
    this.savePreferences(prefs);
    this.showPreferencesModal.set(false);
  }

  /**
   * Open the preferences modal (can be invoked from footer or policy page)
   */
  public openPreferences(): void {
    this.showPreferencesModal.set(true);
  }

  /**
   * Close the preferences modal without modifying saved preferences
   */
  public closePreferences(): void {
    this.showPreferencesModal.set(false);
  }

  private savePreferences(prefs: CookiePreferences): void {
    if (this.isBrowser) {
      try {
        this.localStorage.setItem(STORAGE_KEY, prefs);
      } catch (e) {
        console.warn('Unable to persist cookie consent', e);
      }
    }
    this.preferences.set(prefs);
    this.hasDecided.set(true);
    this.applyTrackingPreferences(prefs.analytics);
  }

  /**
   * Dynamically disables or enables Google Analytics 4 based on consent
   */
  private applyTrackingPreferences(analyticsAllowed: boolean): void {
    if (!this.isBrowser || typeof window === 'undefined') return;

    const gaDisableKey = `ga-disable-${GA_MEASUREMENT_ID}` as keyof Window;
    (window as any)[gaDisableKey] = !analyticsAllowed;

    const win = window as any;
    if (typeof win.gtag === 'function') {
      win.gtag('consent', 'update', {
        analytics_storage: analyticsAllowed ? 'granted' : 'denied'
      });
    }
  }
}
