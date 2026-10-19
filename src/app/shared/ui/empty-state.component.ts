import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="py-12 px-6 flex flex-col items-center justify-center text-center animate-fadeIn">
      <!-- Icon Container -->
      <div class="w-16 h-16 rounded-2xl bg-[#F3E7DC] dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 flex items-center justify-center text-[#8B6E57] dark:text-[#DD8776] mb-4 shadow-sm">
        <!-- Box / Products Icon -->
        <svg *ngIf="icon === 'box'" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>

        <!-- Search Icon -->
        <svg *ngIf="icon === 'search'" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <!-- Cart / Orders Icon -->
        <svg *ngIf="icon === 'cart'" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>

        <!-- Users Icon -->
        <svg *ngIf="icon === 'users'" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>

        <!-- Folder / Categories Icon -->
        <svg *ngIf="icon === 'folder'" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>

        <!-- Alert / Error Icon -->
        <svg *ngIf="icon === 'alert'" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>

        <!-- Default / Info Icon -->
        <svg *ngIf="icon === 'info'" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Title -->
      <h3 class="text-base md:text-lg font-bold text-[#4A3C31] dark:text-[#F4F1ED] font-serif mb-1">
        {{ title }}
      </h3>

      <!-- Description -->
      <p class="text-xs md:text-sm text-[#7A6C5E] dark:text-[#C5A393] max-w-sm mb-5 leading-relaxed">
        {{ description }}
      </p>

      <!-- Action Button -->
      <div *ngIf="actionText">
        <a *ngIf="actionRouterLink" 
           [routerLink]="actionRouterLink"
           class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-sm hover:-translate-y-0.5 transition-all duration-300"
           [ngClass]="getButtonClass()">
          <span *ngIf="actionIcon === 'plus'" class="text-sm leading-none">+</span>
          {{ actionText }}
        </a>

        <button *ngIf="!actionRouterLink"
                type="button"
                (click)="actionClick.emit()"
                class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                [ngClass]="getButtonClass()">
          <span *ngIf="actionIcon === 'plus'" class="text-sm leading-none">+</span>
          <span *ngIf="actionIcon === 'refresh'" class="text-sm leading-none">↺</span>
          {{ actionText }}
        </button>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon: 'box' | 'search' | 'cart' | 'users' | 'folder' | 'info' | 'alert' = 'box';
  @Input() title: string = 'No items found';
  @Input() description: string = 'There are no records to display.';
  @Input() actionText?: string;
  @Input() actionRouterLink?: any[] | string | null;
  @Input() actionIcon?: 'plus' | 'refresh' | 'none' = 'none';
  @Input() actionVariant: 'primary' | 'secondary' | 'outline' = 'primary';

  @Output() actionClick = new EventEmitter<void>();

  getButtonClass(): string {
    switch (this.actionVariant) {
      case 'secondary':
        return 'bg-white text-[#4A3C31] hover:bg-[#FDFBF7] border border-[#EADFD2] dark:bg-[#2E2825] dark:text-[#F4F1ED] dark:border-white/10 dark:hover:bg-white/5';
      case 'outline':
        return 'bg-transparent border-2 border-[#EADFD2] hover:border-[#4A3C31] text-[#4A3C31] dark:border-white/20 dark:hover:border-white/40 dark:text-[#F4F1ED]';
      case 'primary':
      default:
        return 'bg-[#4A3C31] text-[#FDFBF7] hover:bg-[#3B2F2F] dark:bg-[#DD8776] dark:text-[#1C1917] dark:hover:bg-[#EB9D8E] hover:shadow-md';
    }
  }
}
