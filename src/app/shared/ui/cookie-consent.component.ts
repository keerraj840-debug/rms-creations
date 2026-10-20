import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieConsentService } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- Cookie Banner (Shown when user has not yet decided) -->
    @if (!consentService.hasDecided()) {
      <div
        role="region"
        aria-label="Privacy & Cookie Preferences"
        class="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      >
        <div class="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="flex-1 space-y-1.5 text-stone-700 dark:text-stone-300 text-sm">
            <div class="flex items-center gap-2 font-medium text-stone-900 dark:text-white">
              <i class="fa-solid fa-shield-halved text-amber-600 dark:text-amber-400" aria-hidden="true"></i>
              <span>Your Privacy & Cookie Choices</span>
            </div>
            <p class="leading-relaxed text-xs md:text-sm text-stone-600 dark:text-stone-400">
              We use essential browser storage for shopping cart, secure authentication, and theme preferences. With your consent, we also use aggregated Google Analytics to improve your gifting journey. Under India's Digital Personal Data Protection Act, 2023, you have full control over non-essential tracking.
            </p>
            <div class="flex items-center gap-3 text-xs pt-0.5">
              <a
                routerLink="/privacy"
                class="text-amber-700 dark:text-amber-400 underline hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
              >
                Privacy Policy
              </a>
              <span class="text-stone-400 dark:text-stone-600">•</span>
              <a
                routerLink="/policy"
                [queryParams]="{ tab: 'cookies' }"
                class="text-amber-700 dark:text-amber-400 underline hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end pt-2 lg:pt-0">
            <button
              type="button"
              (click)="consentService.openPreferences()"
              class="px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Preferences
            </button>
            <button
              type="button"
              (click)="consentService.rejectNonEssential()"
              class="px-4 py-2 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-200/80 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Essential Only
            </button>
            <button
              type="button"
              (click)="consentService.acceptAll()"
              class="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Detailed Preferences Modal -->
    @if (consentService.showPreferencesModal()) {
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      >
        <div class="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 overflow-hidden">
          <div class="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <i class="fa-solid fa-sliders text-sm" aria-hidden="true"></i>
              </div>
              <h2 id="cookie-preferences-title" class="text-base font-semibold text-stone-900 dark:text-white">
                Cookie & Storage Preferences
              </h2>
            </div>
            <button
              type="button"
              (click)="consentService.closePreferences()"
              class="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Close preferences"
            >
              <i class="fa-solid fa-xmark text-lg" aria-hidden="true"></i>
            </button>
          </div>

          <div class="py-4 space-y-4 max-h-[60vh] overflow-y-auto text-sm">
            <!-- Essential storage item -->
            <div class="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-stone-900 dark:text-white flex items-center gap-1.5">
                  <span>Strictly Essential</span>
                  <span class="text-[11px] font-normal uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">Always On</span>
                </span>
                <input
                  type="checkbox"
                  checked
                  disabled
                  aria-label="Strictly essential cookies (always active)"
                  class="h-4 w-4 rounded text-amber-600 opacity-60 cursor-not-allowed"
                />
              </div>
              <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Necessary for basic platform operation: shopping cart items, secure Supabase authentication sessions, and light/dark theme preference. Cannot be disabled.
              </p>
            </div>

            <!-- Analytics item -->
            <div class="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60">
              <div class="flex items-center justify-between mb-1">
                <label for="pref-analytics-toggle" class="font-medium text-stone-900 dark:text-white cursor-pointer">
                  Google Analytics 4
                </label>
                <input
                  id="pref-analytics-toggle"
                  type="checkbox"
                  [(ngModel)]="analyticsChoice"
                  class="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 dark:border-stone-600 dark:bg-stone-700 cursor-pointer"
                />
              </div>
              <p class="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Helps us understand website traffic, popular gift hampers, and checkout funnel performance using privacy-preserving aggregated data. No personally identifiable details are sold or shared for cross-site advertising.
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              (click)="consentService.rejectNonEssential()"
              class="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Reject All Non-Essential
            </button>
            <div class="flex items-center gap-2">
              <button
                type="button"
                (click)="saveCustomChoices()"
                class="px-4 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class CookieConsentComponent {
  public consentService = inject(CookieConsentService);
  public analyticsChoice: boolean = false;

  constructor() {
    this.analyticsChoice = this.consentService.preferences().analytics;
  }

  public saveCustomChoices(): void {
    this.consentService.saveCustom(this.analyticsChoice);
  }
}
