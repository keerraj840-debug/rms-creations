import { Component, Input, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service';
import { CheckoutService } from '../services/checkout.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { CheckoutModalComponent } from './ui/checkout-modal.component';
import { PwaService } from '../services/pwa.service';
import { PwaInstallBannerComponent } from './ui/pwa-install-banner.component';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgClass, NgIf, FormsModule, CheckoutModalComponent, PwaInstallBannerComponent],
  template: `
    <!-- Main Shell -->
    <div
      class="flex flex-col bg-[#F7F6F3] dark:bg-[#14100E] font-sans text-[#57251C] dark:text-[#F4F1ED] selection:bg-[#EB9D8E] selection:text-[#57251C] transition-colors duration-200"
      [ngClass]="hideFooter ? 'min-h-screen lg:h-screen lg:overflow-hidden' : 'min-h-screen'"
    >
      <!-- Sticky Luxury Glassmorphism Header -->
      <header
        class="sticky top-0 z-40 w-full shrink-0 border-b border-[#D9C3B9]/45 dark:border-[#3D302A] bg-[#FFFDFC]/92 dark:bg-[#1C1816]/95 backdrop-blur-md transition-all duration-300"
        [ngClass]="{
          'shadow-md shadow-[#57251C]/5 py-1 bg-[#FFFDFC]/96 dark:bg-[#1C1816]/98': isScrolled,
          'py-2 bg-[#FFFDFC]/88 dark:bg-[#1C1816]/90': !isScrolled
        }"
      >
        <div class="mx-auto  px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between sm:h-18">

            <!-- Logo Section -->
            <a routerLink="/" class="group flex items-center gap-3 transition-transform hover:scale-102">
              <div class="relative">
                <img
                  src="assets/logo.png"
                  alt="RMS Logo"
                  class="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-[#D9C3B9]/60 dark:ring-[#57251C] transition-all group-hover:ring-[#C56D5B] sm:h-12 sm:w-12"
                />
                <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#1B4D3E] ring-2 ring-[#FFFDFC] dark:ring-[#1C1816]" title="Online & Ready to assist"></span>
              </div>
              <div class="flex flex-col justify-center">
                <span class="text-[10px] font-bold uppercase tracking-[0.35em] text-[#9D7B6C] dark:text-[#C5A393] sm:text-xs leading-none mb-1">RMS</span>
                <span class="font-serif text-base font-bold tracking-tight text-[#57251C] dark:text-[#F4F1ED] sm:text-lg leading-none group-hover:text-[#9C4738] dark:group-hover:text-[#EB9D8E] transition-colors">Gift Hampers</span>
              </div>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex md:items-center md:gap-5 lg:gap-7">
              <a
                routerLink="/"
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full"
                [routerLinkActiveOptions]="{ exact: true }"
                class="relative text-sm font-medium text-[#57251C]/80 dark:text-[#D9C3B9] transition-colors hover:text-[#9C4738] dark:hover:text-[#EB9D8E] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Home
              </a>
              <a
                routerLink="/shop"
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full"
                class="relative text-sm font-medium text-[#57251C]/80 dark:text-[#D9C3B9] transition-colors hover:text-[#9C4738] dark:hover:text-[#EB9D8E] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                All Hampers
              </a>
              <a
                routerLink="/build-hamper"
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full"
                class="relative inline-flex items-center gap-1.5 text-sm font-bold text-[#9C4738] dark:text-[#EB9D8E] transition-colors hover:text-[#57251C] dark:hover:text-[#F4F1ED] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                <span>Customize Hamper</span>
              </a>
              <a
                routerLink="/gallery"
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full"
                class="relative text-sm font-medium text-[#57251C]/80 dark:text-[#D9C3B9] transition-colors hover:text-[#9C4738] dark:hover:text-[#EB9D8E] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Hamper Gallery
              </a>
              <a
                routerLink="/my-orders"
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full"
                class="relative text-sm font-medium text-[#57251C]/80 dark:text-[#D9C3B9] transition-colors hover:text-[#9C4738] dark:hover:text-[#EB9D8E] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Track Order
              </a>
              <a
                routerLink="/contact"
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full"
                class="relative text-sm font-medium text-[#57251C]/80 dark:text-[#D9C3B9] transition-colors hover:text-[#9C4738] dark:hover:text-[#EB9D8E] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Contact Us
              </a>
            </nav>

            <!-- Header Action Controls -->
            <div class="flex items-center gap-2.5 sm:gap-4">
              <!-- Desktop PWA Install Button -->
              <button
                *ngIf="!pwaService.isInstalled()"
                type="button"
                (click)="pwaService.promptInstall()"
                class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#9C4738]/30 bg-[#9C4738]/10 hover:bg-[#9C4738] text-[#9C4738] hover:text-white dark:border-[#EB9D8E]/30 dark:bg-[#EB9D8E]/10 dark:hover:bg-[#EB9D8E] dark:text-[#EB9D8E] dark:hover:text-[#1C1816] text-xs font-semibold shadow-xs transition cursor-pointer"
                title="Install RMS App"
                aria-label="Install App on Device"
              >
                <i class="fa-solid fa-download text-xs"></i>
                <span>Install App</span>
              </button>

              <!-- Dark / Light Theme Switcher Button -->
              <button
                type="button"
                (click)="themeService.toggleTheme()"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9C3B9]/50 bg-[#FFFDFC]/90 text-[#57251C] shadow-sm transition hover:border-[#C56D5B] hover:text-[#9C4738] dark:border-[#3D302A] dark:bg-[#251F1C] dark:text-[#F4F1ED]"
                [title]="themeService.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                aria-label="Toggle Theme"
              >
                <svg *ngIf="!themeService.isDarkMode" class="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg *ngIf="themeService.isDarkMode" class="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>

              <!-- Cart Button with Live Counter Badge -->
              <a
                routerLink="/cart"
                class="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#D9C3B9]/50 bg-[#FFFDFC]/90 text-[#57251C] shadow-sm transition hover:border-[#C56D5B] hover:text-[#9C4738] dark:border-[#3D302A] dark:bg-[#251F1C] dark:text-[#F4F1ED]"
                title="View Cart"
                aria-label="View Shopping Cart"
              >
                <i class="fa-solid fa-cart-shopping text-xs"></i>
                <span
                  *ngIf="cartService.totalItemsCount > 0"
                  class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C56D5B] text-[9px] font-extrabold text-white ring-2 ring-[#FFFDFC] dark:ring-[#1C1816]"
                >
                  {{ cartService.totalItemsCount }}
                </span>
              </a>

              <!-- User Account / Profile Dropdown -->
              <div class="relative">
                <!-- Click-outside backdrop to cleanly close dropdown without mouseleave flickering -->
                <div
                  *ngIf="isUserMenuOpen"
                  class="fixed inset-0 z-40 bg-transparent"
                  (click)="closeUserMenu()"
                ></div>

                <button
                  type="button"
                  (click)="toggleUserMenu($event)"
                  class="relative z-50 flex h-9 w-9 items-center justify-center rounded-full border border-[#D9C3B9]/50 bg-[#FFFDFC]/90 text-[#57251C] shadow-sm transition hover:border-[#C56D5B] hover:text-[#9C4738] dark:border-[#3D302A] dark:bg-[#251F1C] dark:text-[#F4F1ED] cursor-pointer active:scale-95"
                  [title]="(authService.currentUser$ | async) ? 'My Profile & Account' : 'Sign In'"
                  aria-label="User Account"
                >
                  <i *ngIf="!(authService.currentUser$ | async)" class="fa-regular fa-user text-xs"></i>
                  <div *ngIf="authService.currentUser$ | async as user" class="w-full h-full rounded-full bg-gradient-to-tr from-[#9C4738] to-[#BA5E4E] text-white flex items-center justify-center text-[11px] font-bold">
                    {{ (user.name || user.email || 'U').charAt(0).toUpperCase() }}
                  </div>
                </button>

                <!-- User Profile Dropdown Menu -->
                <div
                  *ngIf="isUserMenuOpen"
                  (click)="$event.stopPropagation()"
                  class="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-24px)] rounded-2xl bg-[#FFFDFC] dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-2xl py-3 px-3 z-50 animate-in fade-in duration-150"
                >
                  <ng-container *ngIf="authService.currentUser$ | async as user; else guestMenu">
                    <div class="px-2 pb-2.5 border-b border-[#EADFD2]/60 dark:border-white/10">
                      <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ user.name || 'Valued Customer' }}</p>
                      <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] truncate font-mono">{{ user.email }}</p>
                    </div>

                    <div class="py-1.5 space-y-0.5 text-xs">
                      <a routerLink="/my-account" (click)="closeUserMenu()" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-white/5 font-semibold transition cursor-pointer">
                        <i class="fa-regular fa-user text-[#9C4738] text-xs"></i>
                        <span>My Account Dashboard</span>
                      </a>
                      <a routerLink="/my-orders" (click)="closeUserMenu()" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-white/5 font-semibold transition cursor-pointer">
                        <i class="fa-solid fa-truck-fast text-[#9C4738] text-xs"></i>
                        <span>My Orders &amp; Tracking</span>
                      </a>
                      <a routerLink="/my-custom-hampers" (click)="closeUserMenu()" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-white/5 font-semibold transition cursor-pointer">
                        <i class="fa-solid fa-wand-magic-sparkles text-[#9C4738] text-xs"></i>
                        <span>My Bespoke Hampers</span>
                      </a>
                      <a *ngIf="user.role === 'admin'" routerLink="/admin" (click)="closeUserMenu()" class="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-white/5 font-semibold transition cursor-pointer">
                        <i class="fa-solid fa-gauge text-xs"></i>
                        <span>Store Management</span>
                      </a>
                    </div>

                    <div class="pt-1.5 border-t border-[#EADFD2]/60 dark:border-white/10">
                      <button
                        type="button"
                        (click)="logout()"
                        class="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                      >
                        <i class="fa-solid fa-right-from-bracket text-xs"></i>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </ng-container>

                  <ng-template #guestMenu>
                    <div class="space-y-1 text-xs">
                      <a routerLink="/login" (click)="closeUserMenu()" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#57251C] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-white/5 transition cursor-pointer">
                        <i class="fa-solid fa-arrow-right-to-bracket text-[#9C4738]"></i>
                        <span>Sign In</span>
                      </a>
                      <a routerLink="/register" (click)="closeUserMenu()" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#7A6C5E] dark:text-[#C5A393] hover:bg-[#FAF7F2] dark:hover:bg-white/5 transition cursor-pointer">
                        <i class="fa-solid fa-user-plus text-xs"></i>
                        <span>Create Account</span>
                      </a>
                    </div>
                  </ng-template>
                </div>
              </div>

              <!-- Mobile Hamburger Button -->
              <button
                type="button"
                (click)="toggleMenu()"
                [attr.aria-expanded]="isMobileMenuOpen"
                aria-label="Toggle mobile menu"
                class="inline-flex items-center justify-center rounded-xl p-2.5 text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738] focus:outline-none focus:ring-2 focus:ring-[#C56D5B] md:hidden"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path [class.hidden]="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  <path [class.hidden]="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation Menu Dropdown -->
        <div
          class="border-t border-[#D9C3B9]/30 dark:border-[#3D302A] bg-[#FFFDFC]/98 dark:bg-[#1C1816]/98 backdrop-blur-xl md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          [ngClass]="isMobileMenuOpen ? 'max-h-[650px] opacity-100' : 'max-h-0 opacity-0'"
        >
          <nav class="flex flex-col space-y-1 px-4 pb-6 pt-3 sm:px-6">

            <!-- Mobile PWA Quick Install Banner -->
            <div *ngIf="!pwaService.isInstalled()" class="p-1 mb-2">
              <button
                type="button"
                (click)="pwaService.promptInstall(); closeMenu()"
                class="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] text-white shadow-md text-xs font-bold cursor-pointer transition active:scale-98"
              >
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-download"></i>
                  <span>Install RMS Creations App</span>
                </span>
                <span class="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-mono tracking-wider">Web App</span>
              </button>
            </div>

            <!-- Customer Identity Banner on Mobile -->
            <div *ngIf="authService.currentUser$ | async as user" class="p-3 mb-2 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 flex items-center justify-between">
              <div class="min-w-0 pr-2">
                <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ user.name || 'Valued Customer' }}</p>
                <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] truncate font-mono">{{ user.email }}</p>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] uppercase">{{ user.role }}</span>
            </div>

            <a routerLink="/" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" [routerLinkActiveOptions]="{ exact: true }" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">Home</a>
            <a routerLink="/shop" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">
              <span class="flex items-center gap-2"><i class="fa-solid fa-gift text-xs text-[#9C4738] dark:text-[#EB9D8E]"></i> Shop All Gifts</span>
              <span class="rounded-full bg-[#C56D5B]/20 text-[#9C4738] dark:text-[#EB9D8E] px-2 py-0.5 text-[10px] font-bold">Catalogue</span>
            </a>
            <a routerLink="/build-hamper" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">
              <span class="flex items-center gap-2"><i class="fa-solid fa-wand-magic-sparkles text-xs text-[#9C4738]"></i> Build Your Own Hamper</span>
            </a>
            <a routerLink="/gallery" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">Lookbook &amp; Gallery</a>
            <a routerLink="/cart" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">
              <span class="flex items-center gap-2"><i class="fa-solid fa-cart-shopping text-xs text-[#9C4738] dark:text-[#EB9D8E]"></i> Shopping Cart</span>
              <span *ngIf="cartService.totalItemsCount > 0" class="rounded-full bg-[#9C4738] text-white px-2 py-0.5 text-[10px] font-bold">{{ cartService.totalItemsCount }} items</span>
            </a>
            <a [routerLink]="(authService.currentUser$ | async) ? '/my-account' : '/login'" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">
              <span class="flex items-center gap-2"><i class="fa-regular fa-user text-xs text-[#9C4738] dark:text-[#EB9D8E]"></i> {{ (authService.currentUser$ | async) ? 'My Account' : 'Sign In / Register' }}</span>
            </a>
            <a routerLink="/my-orders" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">My Orders &amp; Tracking</a>
            <a routerLink="/contact" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">Contact Us</a>
            <a routerLink="/terms" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] transition">
              <i class="fa-solid fa-scale-balanced text-xs"></i>
              <span>Customer Policies &amp; Trust</span>
            </a>

            <!-- Sign Out in Mobile Drawer -->
            <div *ngIf="authService.currentUser$ | async" class="pt-2 border-t border-[#D9C3B9]/30 dark:border-[#3D302A]">
              <button
                type="button"
                (click)="logout()"
                class="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 px-4 py-3 text-sm font-bold transition hover:bg-rose-100 cursor-pointer"
              >
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>Sign Out of Account</span>
              </button>
            </div>

            <div class="pt-3">
              <button
                type="button"
                (click)="openWhatsapp('Mobile menu')"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] px-4 py-3.5 text-base font-semibold text-[#FFFDFC] shadow-md transition-all hover:bg-[#9C4738] active:scale-95"
              >
                <i class="fa-brands fa-whatsapp text-lg text-emerald-400"></i>
                Chat on WhatsApp
              </button>
            </div>
          </nav>
        </div>
      </header>

      <!-- Main Outlet Container -->
      <main class="w-full flex-grow flex flex-col min-h-0" [ngClass]="hideFooter ? 'pb-0 overflow-hidden' : 'pb-16 md:pb-0'">
        <ng-content></ng-content>
      </main>

      <!-- Editorial Luxury Footer -->
      <footer *ngIf="!hideFooter" class="mt-auto border-t border-[#57251C] bg-[#57251C] text-[#FFFDFC] pb-16 md:pb-0">
        <div class="mx-auto  px-4 pb-8 pt-12 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

            <!-- Brand Info Column (4 cols) -->
            <div class="flex flex-col lg:col-span-4">
              <a routerLink="/" class="flex items-center gap-3 mb-3 transition-transform hover:scale-102">
                <img src="assets/logo.png" alt="RMS Logo" class="h-11 w-11 rounded-full object-cover shadow-xs ring-2 ring-[#D9C3B9]/40" />
                <span class="font-serif text-xl font-bold tracking-tight text-[#FFFDFC]">RMS Gift Hampers</span>
              </a>
              <p class="text-xs leading-relaxed text-[#D9C3B9]/90 max-w-sm">
                Handcrafted, bespoke gift hampers for birthdays, festive celebrations, anniversaries, and return gifts. Partitioned presentation, satin ribbons, and safe delivery across India.
              </p>

              <!-- Social Links -->
              <div class="mt-4 flex gap-3">
                <a
                  href="https://www.instagram.com/rmsgifthampers?igsh=dWF2N2I4YW45dmx1"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-full bg-white/10 p-2 text-[#D9C3B9] transition-all hover:bg-[#C56D5B] hover:text-white hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" /></svg>
                </a>
              </div>
            </div>

            <!-- Quick Links / Discover (3 cols) -->
            <div class="lg:col-span-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#EB9D8E]">Quick Links</h3>
              <ul class="mt-3 space-y-2 text-xs font-medium text-[#D9C3B9]">
                <li><a routerLink="/" class="transition-colors hover:text-[#FFFDFC]">Home</a></li>
                <li><a routerLink="/shop" class="text-white font-bold hover:text-[#DD8776] flex items-center gap-1.5"><i class="fa-solid fa-gift text-xs"></i> All Gift Hampers</a></li>
                <li><a routerLink="/build-hamper" class="text-white font-bold hover:text-[#DD8776] flex items-center gap-1.5"><i class="fa-solid fa-wand-magic-sparkles text-xs"></i> Customize Hamper</a></li>
                <li><a routerLink="/gallery" class="transition-colors hover:text-[#FFFDFC]">Hamper Gallery</a></li>
                <li><a routerLink="/my-orders" class="transition-colors hover:text-[#FFFDFC]">Track My Order</a></li>
              </ul>
            </div>

            <!-- Trust Highlights Column (3 cols) -->
            <div class="lg:col-span-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#EB9D8E]">Why RMS Creations</h3>
              <ul class="mt-3 space-y-2 text-xs font-medium text-[#D9C3B9]">
                <li class="flex items-center gap-2"><i class="fa-solid fa-circle-check text-emerald-400 text-xs"></i> 100% Quality Checked Items</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-truck-fast text-[#EB9D8E] text-xs"></i> Safe Delivery Across India</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-box text-amber-400 text-xs"></i> Premium Gift Packaging</li>
                <li class="flex items-center gap-2"><i class="fa-solid fa-wallet text-emerald-400 text-xs"></i> Cash on Delivery Available</li>
              </ul>
            </div>

            <!-- Contact & Studio Column (2 cols) -->
            <div class="lg:col-span-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#EB9D8E]">Help &amp; Support</h3>
              <ul class="mt-3 space-y-2 text-xs text-[#D9C3B9]">
                <li>
                  <a href="tel:+919284905118" class="font-semibold text-[#FFFDFC] hover:text-[#DD8776] transition-colors flex items-center gap-1.5">
                    <i class="fa-solid fa-phone text-xs text-[#DD8776]"></i> Call: +91 92849 05118
                  </a>
                </li>
                <li>
                  <a href="mailto:supportrmsgifthampers@gmail.com" class="font-semibold text-[#FFFDFC] hover:text-[#DD8776] transition-colors break-all flex items-center gap-1.5">
                    <i class="fa-solid fa-envelope text-xs text-[#DD8776]"></i> Email: supportrmsgifthampers&#64;gmail.com
                  </a>
                </li>
                <li class="pt-1">
                  <a
                    href="https://wa.me/919284905118"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:text-white transition-colors"
                  >
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                    <span>Chat on WhatsApp</span>
                  </a>
                </li>
                <li class="pt-2 border-t border-white/10">
                  <a
                    routerLink="/admin"
                    class="hover:text-[#EB9D8E] text-[11px] text-white/60 transition-colors inline-flex items-center gap-1.5 font-semibold"
                  >
                    <i class="fa-solid fa-lock text-[10px]"></i>
                    <span>Store Management</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <!-- Copyright & Bottom Info -->
          <div class="mt-8 flex flex-col items-center justify-between border-t border-[#D9C3B9]/20 pt-6 sm:flex-row gap-4">
            <p class="text-xs text-[#D9C3B9]/70">
              © 2026 RMS Gift Hampers. All Rights Reserved. &bull; Navi Mumbai, Maharashtra, India.
            </p>
            <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#D9C3B9]/80 font-medium">
              <a routerLink="/terms" class="hover:text-white transition-colors">Terms</a>
              <span>&bull;</span>
              <a routerLink="/privacy" class="hover:text-white transition-colors">Privacy</a>
              <span>&bull;</span>
              <a routerLink="/shipping-policy" class="hover:text-white transition-colors">Shipping</a>
              <span>&bull;</span>
              <a routerLink="/refund-policy" class="hover:text-white transition-colors">Refunds</a>
              <span>&bull;</span>
              <a routerLink="/grievance" class="hover:text-white transition-colors">Grievance</a>
              <span>&bull;</span>
              <button
                *ngIf="!pwaService.isInstalled()"
                type="button"
                (click)="pwaService.promptInstall()"
                class="hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs text-[#EB9D8E] font-bold cursor-pointer"
              >
                <i class="fa-solid fa-download text-xs text-[#EB9D8E]"></i>
                <span>Install App</span>
              </button>
              <span *ngIf="!pwaService.isInstalled()">&bull;</span>
              <span class="text-[10px] text-[#D9C3B9]/60 font-mono">v{{ pwaService.currentVersion() }}</span>
            </div>
          </div>
        </div>
      </footer>

      <!-- FLOATING TOAST NOTIFICATION FOR CART -->
      <aside
        *ngIf="cartService.toastMessage$ | async as toastMsg"
        aria-live="polite"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-[#57251C] dark:bg-[#1E1916] text-[#FFFDFC] px-5 py-3 shadow-2xl border border-[#EB9D8E]/40 ring-2 ring-black/10 backdrop-blur-md"
      >
        <i class="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
        <span class="text-xs sm:text-sm font-medium">{{ toastMsg }}</span>
        <a routerLink="/cart" class="rounded-full bg-[#C56D5B] px-3 py-1 text-xs font-bold text-white hover:bg-[#9C4738] transition ml-1">
          Cart &rarr;
        </a>
      </aside>

      <!-- APP-LIKE STICKY MOBILE BOTTOM NAVIGATION BAR -->
      <nav
        *ngIf="!hideBottomNav"
        aria-label="Mobile Bottom Navigation"
        class="fixed bottom-0 inset-x-0 z-40 bg-[#FFFDFC]/95 dark:bg-[#1C1816]/95 backdrop-blur-xl border-t border-[#D9C3B9]/45 dark:border-[#3D302A] px-2 py-1.5 md:hidden flex items-center justify-around shadow-lg"
      >
        <!-- Home -->
        <a
          routerLink="/"
          routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] text-[#57251C]/75 dark:text-[#D9C3B9] transition active:scale-95"
        >
          <i class="fa-solid fa-house text-base mb-0.5"></i>
          <span>Home</span>
        </a>

        <!-- Shop -->
        <a
          routerLink="/shop"
          routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold"
          class="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] text-[#57251C]/75 dark:text-[#D9C3B9] transition active:scale-95"
        >
          <i class="fa-solid fa-gift text-base mb-0.5"></i>
          <span>Shop</span>
        </a>

        <!-- Custom Hamper Studio (Center Prominent) -->
        <a
          routerLink="/build-hamper"
          routerLinkActive="scale-105"
          class="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] text-[#9C4738] dark:text-[#EB9D8E] font-bold transition active:scale-95 -mt-3.5"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9C4738] to-[#BA5E4E] text-white flex items-center justify-center shadow-md ring-3 ring-[#FFFDFC] dark:ring-[#1C1816]">
            <i class="fa-solid fa-wand-magic-sparkles text-sm"></i>
          </div>
          <span class="mt-0.5">Build</span>
        </a>

        <!-- Cart -->
        <a
          routerLink="/cart"
          routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold"
          class="relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] text-[#57251C]/75 dark:text-[#D9C3B9] transition active:scale-95"
        >
          <div class="relative">
            <i class="fa-solid fa-bag-shopping text-base mb-0.5"></i>
            <span
              *ngIf="cartService.totalItemsCount > 0"
              class="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#C56D5B] text-[9px] font-extrabold text-white ring-1 ring-white"
            >
              {{ cartService.totalItemsCount }}
            </span>
          </div>
          <span>Cart</span>
        </a>

        <!-- My Orders -->
        <a
          routerLink="/my-orders"
          routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold"
          class="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] text-[#57251C]/75 dark:text-[#D9C3B9] transition active:scale-95"
        >
          <i class="fa-solid fa-truck-fast text-base mb-0.5"></i>
          <span>Orders</span>
        </a>
      </nav>

      <!-- FLOATING LUXURY Chat with Us BUTTON -->
      <aside
        class="fixed z-30 transition-all duration-300"
        [ngClass]="hideBottomNav ? 'bottom-5 right-5' : 'bottom-16 md:bottom-6 right-4 sm:right-6'"
      >
        <a
          href="https://wa.me/919284905118?text=Hello%20RMS%20Creations!%20I%20would%20like%20to%20inquire%20about%20gift%20hampers."
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20 ring-4 ring-emerald-500/20"
          aria-label="Direct Chat with Us"
          title="Direct Chat with Us"
        >
          <i class="fa-brands fa-whatsapp text-lg sm:text-xl text-white"></i>
          <span class="hidden sm:inline text-xs font-bold tracking-wide">Chat with Us</span>
          <span class="relative flex h-2 w-2 sm:hidden">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </a>
      </aside>

      <!-- LEGAL & COMPLIANCE MODAL -->
      <div
        *ngIf="showLegalModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        (click)="closeLegalModal()"
      >
        <div class="w-full max-w-lg rounded-3xl bg-[#FFFDFC] dark:bg-[#1E1916] p-6 shadow-2xl border border-[#D9C3B9]/50 dark:border-[#3D302A] text-[#57251C] dark:text-[#F4F1ED] space-y-4 max-h-[85vh] overflow-y-auto" (click)="$event.stopPropagation()">

          <div class="flex items-center justify-between border-b border-[#D9C3B9]/30 dark:border-[#3D302A] pb-3">
            <h3 class="text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">
              <span *ngIf="legalModalType === 'unsubscribe'">Unsubscribe from Marketing</span>
              <span *ngIf="legalModalType === 'dmca'">DMCA Copyright Agent Notice</span>
              <span *ngIf="legalModalType === 'privacy'">Privacy Policy & Data Security</span>
              <span *ngIf="legalModalType === 'terms'">Terms of Service & Age Gate</span>
            </h3>
            <button (click)="closeLegalModal()" class="rounded-full bg-[#F7F6F3] dark:bg-[#251F1C] p-2 text-[#9D7B6C] dark:text-[#D9C3B9] hover:text-[#57251C] dark:hover:text-[#FFFDFC] cursor-pointer">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Unsubscribe Content -->
          <div *ngIf="legalModalType === 'unsubscribe'" class="space-y-3 text-xs leading-relaxed text-[#4A3C31] dark:text-[#C5A393]">
            <p>You can opt out of receiving promotional emails, catalog updates, or marketing notifications at any time.</p>
            <div class="p-3 bg-[#F7F6F3] dark:bg-[#251F1C] rounded-xl border border-[#D9C3B9]/30 space-y-2">
              <label class="block font-bold text-[#57251C] dark:text-[#F4F1ED]">Enter your registered email address:</label>
              <input type="email" [(ngModel)]="unsubscribeEmail" placeholder="name@example.com" class="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1C1917] border border-[#D9C3B9] text-xs outline-none" />
              <button (click)="submitUnsubscribe()" class="w-full py-2.5 rounded-xl bg-[#9C4738] text-white font-bold text-xs shadow hover:bg-[#7E3528] cursor-pointer">
                Confirm Unsubscribe
              </button>
              <p *ngIf="unsubscribeSuccess" class="text-xs text-emerald-600 font-bold">✓ Successfully unsubscribed from marketing emails.</p>
            </div>
            <p class="text-[10px] opacity-80">
              Note: Transactional emails regarding active purchases, receipts, and consultations will still be sent.
            </p>
          </div>

          <!-- DMCA Content -->
          <div *ngIf="legalModalType === 'dmca'" class="space-y-3 text-xs leading-relaxed text-[#4A3C31] dark:text-[#C5A393]">
            <p><strong>DMCA Copyright Designated Agent Disclosure</strong></p>
            <p>RMS Creations respects intellectual property rights. If you believe your copyrighted material is appearing on this website without authorization, please notify our Designated Copyright Agent:</p>
            <div class="p-3 bg-[#F7F6F3] dark:bg-[#251F1C] rounded-xl border border-[#D9C3B9]/30 space-y-1">
              <p><strong>Designated Agent:</strong> Copyright Manager, Legal Dept.</p>
              <p><strong>Postal Address:</strong> RMS Creations Studio, Plot 42, Sector 15, Vashi, Navi Mumbai, MH 400703, India</p>
              <p><strong>Email:</strong> rmsgifthampers&#64;gmail.com</p>
              <p><strong>Phone:</strong> +91 92849 05118</p>
            </div>
            <p class="text-[10px] opacity-80">
              Notices must include your contact details, identification of copyrighted work, URL of infringing material, and a statement made under penalty of perjury.
            </p>
          </div>

          <!-- Privacy Policy Content -->
          <div *ngIf="legalModalType === 'privacy'" class="space-y-3 text-xs leading-relaxed text-[#4A3C31] dark:text-[#C5A393]">
            <p><strong>Privacy Policy & Data Security</strong></p>
            <p>RMS Creations collects user information strictly for order processing, custom hamper consultations, and account management. We do not sell personal data to third parties.</p>
            <p><strong>Fonts & Session Replay:</strong> Website fonts are self-hosted locally without transmitting IP data to third-party font servers. Session replay tracking is disabled or masked on all sensitive inputs.</p>
          </div>

          <!-- Terms Content -->
          <div *ngIf="legalModalType === 'terms'" class="space-y-3 text-xs leading-relaxed text-[#4A3C31] dark:text-[#C5A393]">
            <p><strong>Terms of Service & Age Restrictions</strong></p>
            <p>You must be at least 18 years of age to register an account or place orders on RMS Creations.</p>
            <p>All hamper customizations, pricing tiers, and delivery terms are subject to availability and confirmation.</p>
          </div>

        </div>
      </div>

      <!-- Global Customer Checkout & Order Modal -->
      <app-checkout-modal></app-checkout-modal>

      <!-- PWA Installation & Smart Update Notification System -->
      <app-pwa-install-banner></app-pwa-install-banner>

    </div>
  `
})
export class SiteLayoutComponent {
  @Input() title = '';
  @Input() hideFooter = false;
  @Input() hideBottomNav = false;

  public readonly themeService = inject(ThemeService);
  public readonly checkoutService = inject(CheckoutService);
  public readonly cartService = inject(CartService);
  public readonly authService = inject(AuthService);
  public readonly pwaService = inject(PwaService);
  private readonly router = inject(Router);

  newsletterEmail = '';
  newsletterSubscribed = false;

  showLegalModal = false;
  legalModalType: 'unsubscribe' | 'dmca' | 'privacy' | 'terms' = 'privacy';
  unsubscribeEmail = '';
  unsubscribeSuccess = false;

  openLegalModal(type: 'unsubscribe' | 'dmca' | 'privacy' | 'terms') {
    this.legalModalType = type;
    this.showLegalModal = true;
    this.unsubscribeSuccess = false;
  }

  closeLegalModal() {
    this.showLegalModal = false;
  }

  submitUnsubscribe() {
    if (!this.unsubscribeEmail || !this.unsubscribeEmail.includes('@')) return;
    this.unsubscribeSuccess = true;
  }

  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  isScrolled = false;

  toggleUserMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;
  }

  async logout() {
    this.closeMenu();
    this.closeUserMenu();
    try {
      await this.authService.signOut();
    } catch (err) {
      console.warn('Sign-out completed with warning:', err);
    } finally {
      this.router.navigate(['/login']);
    }
  }

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 10;
    }
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMenu() {
    this.isMobileMenuOpen = false;
  }

  openQuickOrder() {
    this.checkoutService.open({
      title: 'RMS Festive Gift Hamper',
      price: 999,
      category: 'Festive Hampers'
    });
  }

  openWhatsapp(sourcePage: string = 'General') {
    const url = 'https://wa.me/919284905118?text=Hello%20RMS%20Creations,%20I%20would%20like%20to%20know%20more!';
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }
}
