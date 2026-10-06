import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'theme';

  constructor() {
    const saved = localStorage.getItem(this.storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      this.enableDark();
    } else {
      this.enableLight();
    }
  }

  get isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  toggleTheme(): void {
    if (this.isDarkMode) {
      this.enableLight();
    } else {
      this.enableDark();
    }
  }

  private enableDark(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem(this.storageKey, 'dark');
  }

  private enableLight(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem(this.storageKey, 'light');
  }
}
