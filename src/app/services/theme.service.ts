import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'theme';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem(this.storageKey);
      const prefersDark = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
      if (saved === 'dark' || (!saved && prefersDark)) {
        this.enableDark();
      } else {
        this.enableLight();
      }
    }
  }

  get isDarkMode(): boolean {
    if (!this.isBrowser) return false;
    return document.documentElement.classList.contains('dark');
  }

  toggleTheme(): void {
    if (!this.isBrowser) return;
    if (this.isDarkMode) {
      this.enableLight();
    } else {
      this.enableDark();
    }
  }

  private enableDark(): void {
    if (!this.isBrowser) return;
    document.documentElement.classList.add('dark');
    localStorage.setItem(this.storageKey, 'dark');
  }

  private enableLight(): void {
    if (!this.isBrowser) return;
    document.documentElement.classList.remove('dark');
    localStorage.setItem(this.storageKey, 'light');
  }
}
