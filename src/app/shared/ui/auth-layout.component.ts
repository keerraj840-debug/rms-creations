import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#FBFBFA] dark:bg-[#1E1916] flex items-center justify-center p-4 antialiased transition-colors duration-200">
      
      <div class="w-full max-w-5xl bg-white dark:bg-[#251F1C] rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-[#EADFD2]/60 dark:border-white/10 transition-colors duration-200">
        
        <!-- Left Side: Form Area -->
        <div class="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-[#251F1C] relative z-10 order-2 md:order-1 transition-colors duration-200">
          
          <div class="flex items-center gap-2 mb-10 justify-between w-full">
            <a routerLink="/" class="flex items-center gap-2 group" title="Return to store">
              <img src="assets/logo.png" alt="RMS Logo" class="w-8 h-8 object-contain transition-transform group-hover:scale-105"/>
              <span class="font-bold text-xl text-[#2E2825] dark:text-[#F4F1ED] tracking-tight group-hover:text-[#9C4738] dark:group-hover:text-[#DD8776] transition-colors">RMS Creations</span>
            </a>
            
            <div class="flex items-center gap-2">
              <a routerLink="/" class="text-[11px] font-semibold text-[#8B6E57] dark:text-[#C5A393] hover:text-[#57251C] dark:hover:text-[#F4F1ED] transition-colors hidden sm:inline-block">
                ← Store
              </a>
              <button (click)="themeService.toggleTheme()" class="p-1.5 rounded-xl hover:bg-[#F7F6F3] dark:hover:bg-white/10 focus:outline-none transition-colors" aria-label="Toggle theme">
                <svg *ngIf="!themeService.isDarkMode" class="w-5 h-5 text-[#2E2825]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m8.66-12.34l-.71.71M5.05 18.95l-.71.71M21 12h-1M4 12H3m15.66 4.66l-.71-.71M5.05 5.05l-.71-.71" />
                </svg>
                <svg *ngIf="themeService.isDarkMode" class="w-5 h-5 text-[#F4F1ED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="w-full max-w-sm mx-auto">
            <h1 class="text-3xl font-bold tracking-tight text-[#1C1917] dark:text-[#F4F1ED] mb-2 font-serif">{{ title }}</h1>
            <p class="text-sm text-[#7A6C5E] dark:text-[#C5A393] mb-8">{{ subtitle }}</p>

            <!-- Auth Error Banner -->
            <div *ngIf="errorMessage" class="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <svg class="h-4 w-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>

            <!-- Success Banner -->
            <div *ngIf="successMessage" class="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <svg class="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Content -->
            <ng-content></ng-content>
          </div>

        </div>

        <!-- Right Side: Illustration Area -->
        <div class="hidden md:flex w-full md:w-1/2 bg-[#F4F1ED] dark:bg-[#1E1916] flex-col items-center justify-center p-12 relative overflow-hidden border-l border-[#EADFD2]/50 dark:border-white/10 transition-colors duration-200">
          
          <div class="text-center mb-10 z-10">
            <p class="text-[#8B6E57] dark:text-[#DD8776] font-semibold text-xs uppercase tracking-widest mb-2">{{ imageSubtitle }}</p>
            <h2 class="text-3xl font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">{{ imageTitle }}</h2>
          </div>

          <div class="relative z-10 w-full max-w-md aspect-square flex items-center justify-center">
             <img [src]="imageSrc" alt="Authentication Illustration" class="w-full h-full object-contain drop-shadow-xl dark:opacity-90" />
          </div>

          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div class="absolute bottom-0 left-0 w-80 h-80 bg-[#EADFD2]/40 dark:bg-[#57251C]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

        </div>

      </div>
    </div>
  `
})


export class AuthLayoutComponent {
  constructor(public themeService: ThemeService) {}

  @Input() title = '';
  @Input() subtitle = '';
  @Input() imageSrc = '';
  @Input() imageTitle = '';
  @Input() imageSubtitle = '';
  @Input() errorMessage: string | null = null;
  @Input() successMessage: string | null = null;
}
