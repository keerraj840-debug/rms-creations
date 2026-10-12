import { Component, Input, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderTrackingService } from './order-tracking.service';
import { ThemeService } from '../services/theme.service';
import { CheckoutService } from '../services/checkout.service';
import { CartService } from '../services/cart.service';
import { CheckoutModalComponent } from './ui/checkout-modal.component';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, NgClass, NgIf, NgFor, FormsModule, CheckoutModalComponent],
  template: `
    <!-- Main Shell -->
    <div class="flex min-h-screen flex-col bg-[#F7F6F3] dark:bg-[#14100E] font-sans text-[#57251C] dark:text-[#F4F1ED] selection:bg-[#EB9D8E] selection:text-[#57251C] transition-colors duration-200">
      
      <!-- Top Announcement Bar (Brand Banner) -->
      <aside aria-label="Announcement" class="relative z-50 bg-gradient-to-r from-[#57251C] via-[#9C4738] to-[#C56D5B] px-4 py-2 text-center text-xs font-semibold text-[#FFFDFC] shadow-sm sm:text-sm">
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <i class="fa-solid fa-gift text-[#EB9D8E]"></i>
          <span><strong>Handcrafted Luxury Hampers:</strong> Bespoke gift curations, celebration treats &amp; pooja essentials!</span>
          <a routerLink="/shop" class="rounded-full bg-white/20 px-3 py-0.5 font-bold text-[#FFFDFC] hover:bg-white/30 transition">Explore Catalogue &rarr;</a>
        </div>
      </aside>

      <!-- Sticky Luxury Glassmorphism Header -->
      <header 
        class="sticky top-0 z-40 w-full border-b border-[#D9C3B9]/45 dark:border-[#3D302A] bg-[#FFFDFC]/92 dark:bg-[#1C1816]/95 backdrop-blur-md transition-all duration-300"
        [ngClass]="{
          'shadow-md shadow-[#57251C]/5 py-1 bg-[#FFFDFC]/96 dark:bg-[#1C1816]/98': isScrolled, 
          'py-2 bg-[#FFFDFC]/88 dark:bg-[#1C1816]/90': !isScrolled
        }"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                Shop All
              </a>
              <a 
                routerLink="/build-hamper" 
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full" 
                class="relative inline-flex items-center gap-1.5 text-sm font-bold text-[#9C4738] dark:text-[#EB9D8E] transition-colors hover:text-[#57251C] dark:hover:text-[#F4F1ED] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                <span>Build a Hamper</span>
              </a>
              <a 
                routerLink="/gallery" 
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full" 
                class="relative text-sm font-medium text-[#57251C]/80 dark:text-[#D9C3B9] transition-colors hover:text-[#9C4738] dark:hover:text-[#EB9D8E] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Lookbook
              </a>
              <a 
                routerLink="/my-orders" 
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full" 
                class="relative text-sm font-medium text-[#57251C]/80 dark:text-[#D9C3B9] transition-colors hover:text-[#9C4738] dark:hover:text-[#EB9D8E] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                My Orders
              </a>
              <a 
                routerLink="/contact" 
                routerLinkActive="text-[#9C4738] dark:text-[#EB9D8E] font-bold after:w-full" 
                class="relative text-sm font-medium text-[#57251C]/80 dark:text-[#D9C3B9] transition-colors hover:text-[#9C4738] dark:hover:text-[#EB9D8E] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Contact
              </a>
            </nav>

            <!-- Header Action Controls -->
            <div class="flex items-center gap-2.5 sm:gap-4">
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

              <!-- Shop Now CTA Button -->
              <a
                routerLink="/shop"
                class="items-center justify-center gap-1.5 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-sm shadow-[#57251C]/20 transition-all hover:-translate-y-0.5 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:shadow-md active:scale-95 inline-flex"
              >
                <i class="fa-solid fa-gift text-xs"></i>
                <span>Shop Gifts</span>
              </a>

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
          [ngClass]="isMobileMenuOpen ? 'max-h-[550px] opacity-100' : 'max-h-0 opacity-0'"
        >
          <nav class="flex flex-col space-y-1 px-4 pb-6 pt-3 sm:px-6">
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
            <a routerLink="/my-orders" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">My Orders &amp; Tracking</a>
            <a routerLink="/my-account" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">My Account &amp; Address</a>
            <a routerLink="/contact" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] dark:bg-[#251F1C] text-[#9C4738] dark:text-[#EB9D8E] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] dark:text-[#F4F1ED] transition-colors hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] hover:text-[#9C4738]">Contact Us</a>
            
            <div class="pt-3">
              <button
                type="button"
                (click)="openWhatsapp('Mobile menu')"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] px-4 py-3.5 text-base font-semibold text-[#FFFDFC] shadow-md transition-all hover:bg-[#9C4738] active:scale-95"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.551 4.195 1.597 6.02L.055 24l6.105-1.602c1.745.952 3.712 1.455 5.871 1.455 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm3.896 17.266c-.183.513-1.045.962-1.464 1.002-.42.04-1.001.077-2.923-.717-2.316-.957-3.805-3.32-3.921-3.475-.116-.155-.936-1.246-.936-2.378 0-1.132.585-1.688.794-1.921.209-.233.456-.291.608-.291.152 0 .304 0 .436.007.14.008.33.025.517.47.195.467.666 1.632.724 1.748.058.116.097.252.019.408-.078.155-.116.252-.233.388-.116.136-.245.298-.348.396-.115.109-.239.229-.107.457.132.228.588.973 1.259 1.573.864.773 1.603 1.012 1.832 1.127.228.116.363.097.498-.058.136-.155.585-.68.74-.913.155-.233.228-.155.443.058.558.214.724.348 1.267.504 1.344.155.077.33.078.503-.131z"/>
                </svg>
                Chat on WhatsApp
              </button>
            </div>
          </nav>
        </div>
      </header>

      <!-- Main Outlet Container -->
      <main class="w-full flex-grow pb-16 md:pb-0">
        <ng-content></ng-content>
      </main>

      <!-- Editorial Luxury Footer -->
      <footer class="mt-auto border-t border-[#57251C] bg-[#57251C] text-[#FFFDFC] pb-16 md:pb-0">
        <div class="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            
            <!-- Brand Info Column -->
            <div class="flex flex-col md:col-span-2">
              <a routerLink="/" class="flex items-center gap-3 mb-4 transition-transform hover:scale-102">
                <img src="assets/logo.png" alt="RMS Logo" class="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-[#D9C3B9]/40" />
                <span class="font-serif text-2xl font-bold tracking-tight text-[#FFFDFC]">RMS Gift Hampers</span>
              </a>
              <p class="max-w-md text-sm leading-relaxed text-[#D9C3B9]/90">
                Handcrafted, bespoke gift hampers for birthdays, festive celebrations, anniversaries, and corporate milestones. Curated with devotion and delivered with care across India.
              </p>
              
              <!-- Social Links -->
              <div class="mt-6 flex gap-3">
                <a 
                  href="https://www.instagram.com/rmsgifthampers?igsh=dWF2N2I4YW45dmx1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-full bg-white/10 p-2.5 text-[#D9C3B9] transition-all hover:bg-[#C56D5B] hover:text-white hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" /></svg>
                </a>
              </div>
            </div>
            
            <!-- Quick Links Column -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#EB9D8E]">Discover</h3>
              <ul class="mt-4 space-y-3 text-sm font-medium text-[#D9C3B9]">
                <li><a routerLink="/" class="transition-colors hover:text-[#FFFDFC]">Home</a></li>
                <li><a routerLink="/shop" class="text-white font-bold hover:text-[#DD8776] flex items-center gap-1.5"><i class="fa-solid fa-gift text-xs"></i> Shop All Gifts</a></li>
                <li><a routerLink="/build-hamper" class="text-white font-bold hover:text-[#DD8776] flex items-center gap-1.5"><i class="fa-solid fa-wand-magic-sparkles text-xs"></i> Build Your Own Hamper</a></li>
                <li><a routerLink="/my-custom-hampers" class="transition-colors hover:text-[#FFFDFC]">Custom Hamper Consultations</a></li>
                <li><a routerLink="/gallery" class="transition-colors hover:text-[#FFFDFC]">Lookbook &amp; Gallery</a></li>
                <li><a routerLink="/cart" class="transition-colors hover:text-[#FFFDFC]">Shopping Cart ({{ cartService.totalItemsCount }})</a></li>
                <li><a routerLink="/my-orders" class="transition-colors hover:text-[#FFFDFC]">Track My Orders</a></li>
                <li><a routerLink="/my-account" class="transition-colors hover:text-[#FFFDFC]">My Account & Profile</a></li>
                <li><a routerLink="/contact" class="transition-colors hover:text-[#FFFDFC]">Contact Studio</a></li>
              </ul>
            </div>
            
            <!-- Contact Info Column -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#EB9D8E]">Get in Touch</h3>
              <ul class="mt-4 space-y-3 text-sm text-[#D9C3B9]">
                <li class="flex items-center gap-3">
                  <svg class="h-5 w-5 text-[#DD8776] shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.12-1.22.569l-1.218 2.321c-3.218-1.55-5.83-4.162-7.38-7.38l2.321-1.218c.45-.236.647-.73.569-1.22l-.541-3.413C10.231 2.601 9.78 2.25 9.264 2.25H7.875A2.25 2.25 0 005.625 4.5c0 1.25.13 2.474.382 3.65z" /></svg>
                  <a href="tel:+919284905118" class="font-semibold text-[#FFFDFC] hover:text-[#DD8776] transition-colors">+91 92849 05118</a>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="h-5 w-5 text-[#DD8776] shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  <a href="mailto:rmsgifthampers@gmail.com" class="font-semibold text-[#FFFDFC] hover:text-[#DD8776] transition-colors break-all">rmsgifthampers&#64;gmail.com</a>
                </li>
                <li class="pt-2">
                  <a 
                    href="https://wa.me/919284905118" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="group inline-flex items-center gap-1.5 font-bold text-[#DD8776] transition-colors hover:text-white"
                  >
                    <span>Message on WhatsApp</span>
                    <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>
          
          <!-- Copyright & Bottom Info -->
          <div class="mt-16 flex flex-col items-center justify-between border-t border-[#D9C3B9]/20 pt-8 sm:flex-row gap-4">
            <p class="text-sm text-[#D9C3B9]/70">
              © 2026 RMS Gift Hampers. All Rights Reserved.
            </p>
            <div class="flex items-center gap-6 text-sm text-[#D9C3B9]/70 sm:mt-0">
              <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
              <button 
                type="button" 
                (click)="toggleTrackerModal()" 
                class="hover:text-[#EB9D8E] text-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 font-semibold"
              >
                <i class="fa-solid fa-lock text-[10px]"></i>
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      <!-- OPTIONAL FLOATING ORDER TRACKER BADGE FOR OPERATORS (DESKTOP ONLY) -->
      <div class="fixed bottom-5 right-5 z-40 hidden lg:block">
        <button 
          type="button"
          (click)="toggleTrackerModal()"
          class="flex items-center gap-2 rounded-full bg-[#57251C] px-4 py-2.5 text-xs font-semibold text-[#FFFDFC] shadow-xl ring-2 ring-[#D9C3B9]/40 transition hover:bg-[#9C4738] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span class="flex h-2 w-2 rounded-full bg-[#EB9D8E] animate-pulse"></span>
          <span>{{ isAdminAuthenticated ? 'Captured Enquiries' : 'Admin Access' }}</span>
          <span *ngIf="orderCount > 0" class="rounded-full bg-[#C56D5B] px-2 py-0.5 text-[10px] font-bold text-white">{{ orderCount }}</span>
        </button>
      </div>

      <!-- ADMIN LOGIN MODAL -->
      <div 
        *ngIf="showAdminLoginModal" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        (click)="closeAdminLoginModal()"
      >
        <div class="w-full max-w-md rounded-3xl bg-[#FFFDFC] dark:bg-[#1E1916] p-6 shadow-2xl border border-[#D9C3B9]/50 dark:border-[#3D302A] text-[#57251C] dark:text-[#F4F1ED]" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-[#D9C3B9]/30 dark:border-[#3D302A] pb-4">
            <div>
              <h3 class="text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">Admin Login</h3>
              <p class="text-xs text-[#9D7B6C] dark:text-[#C5A393]">Only the admin can view enquiries or export the sheet.</p>
            </div>
            <button (click)="closeAdminLoginModal()" class="rounded-full bg-[#F7F6F3] dark:bg-[#251F1C] p-2 text-[#9D7B6C] dark:text-[#D9C3B9] hover:text-[#57251C] dark:hover:text-[#FFFDFC]"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="mt-4 space-y-3">
            <input
              [(ngModel)]="adminUsername"
              type="email"
              class="w-full rounded-xl border border-[#D9C3B9]/60 dark:border-[#3D302A] bg-white dark:bg-[#251F1C] px-3 py-2.5 text-sm outline-none focus:border-[#C56D5B] text-[#57251C] dark:text-[#F4F1ED]"
              placeholder="Email"
            />
            <input
              [(ngModel)]="adminPassword"
              type="password"
              class="w-full rounded-xl border border-[#D9C3B9]/60 dark:border-[#3D302A] bg-white dark:bg-[#251F1C] px-3 py-2.5 text-sm outline-none focus:border-[#C56D5B] text-[#57251C] dark:text-[#F4F1ED]"
              placeholder="Password"
            />
            <p *ngIf="adminLoginError" class="text-sm text-red-600 dark:text-red-400">{{ adminLoginError }}</p>
          </div>

          <div class="mt-6 flex gap-3">
            <button 
              (click)="submitAdminLogin()"
              class="w-full rounded-xl bg-[#57251C] dark:bg-[#C56D5B] py-3 text-sm font-bold text-[#FFFDFC] shadow hover:bg-[#9C4738] dark:hover:bg-[#DD8776] transition"
            >
              Login
            </button>
            <button 
              (click)="closeAdminLoginModal()"
              class="rounded-xl border border-[#D9C3B9] dark:border-[#3D302A] px-4 py-3 text-sm font-semibold text-[#57251C] dark:text-[#F4F1ED] hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- TRACKER MODAL DRAWER -->
      <div 
        *ngIf="isTrackerModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        (click)="toggleTrackerModal()"
      >
        <div class="max-w-lg w-full rounded-3xl bg-[#FFFDFC] dark:bg-[#1E1916] p-6 shadow-2xl border border-[#D9C3B9]/50 dark:border-[#3D302A] text-[#57251C] dark:text-[#F4F1ED]" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-[#D9C3B9]/30 dark:border-[#3D302A] pb-4">
            <div>
              <h3 class="text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">Tracked Customer Orders</h3>
              <p class="text-xs text-[#9D7B6C] dark:text-[#C5A393]">Recorded sessions during this visit</p>
            </div>
            <button (click)="toggleTrackerModal()" class="rounded-full bg-[#F7F6F3] dark:bg-[#251F1C] p-2 text-[#9D7B6C] dark:text-[#D9C3B9] hover:text-[#57251C] dark:hover:text-[#FFFDFC]"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="mt-4 max-h-60 overflow-y-auto space-y-2">
            <div *ngFor="let item of trackerOrders" class="rounded-xl bg-[#F7F6F3] dark:bg-[#251F1C] p-3 text-xs flex justify-between items-center border border-[#D9C3B9]/30 dark:border-[#3D302A]">
              <div>
                <p class="font-bold text-[#57251C] dark:text-[#F4F1ED]">{{ item.title }}</p>
                <p class="text-[#9D7B6C] dark:text-[#C5A393]">{{ item.page }} • {{ item.category }}</p>
              </div>
              <span class="text-[10px] text-[#9D7B6C] dark:text-[#C5A393] font-mono">{{ item.timestamp  }}</span>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button 
              (click)="downloadOrderSheet()" 
              class="w-full rounded-xl bg-[#57251C] dark:bg-[#C56D5B] py-3 text-xs font-bold text-[#FFFDFC] shadow hover:bg-[#9C4738] dark:hover:bg-[#DD8776] transition"
            >
              Export Order Sheet (.CSV)
            </button>
          </div>
        </div>
      </div>

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

      <!-- Global Customer Checkout & Free UPI / COD Modal -->
      <app-checkout-modal></app-checkout-modal>

    </div>
  `
})
export class SiteLayoutComponent {
  @Input() title = '';

  public readonly themeService = inject(ThemeService);
  public readonly checkoutService = inject(CheckoutService);
  public readonly cartService = inject(CartService);
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly router = inject(Router);
  
  isMobileMenuOpen = false;
  isScrolled = false;
  isTrackerModalOpen = false;
  showAdminLoginModal = false;
  isAdminAuthenticated = false;
  adminUsername = '';
  adminPassword = '';
  adminLoginError = '';

  private readonly adminAuthStorageKey = 'rms-admin-auth';
  private readonly adminEmail = 'rmsgifthampers@gmail.com';
  private readonly adminPasswordValue = 'RMS@1234';

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(this.adminAuthStorageKey);
      this.isAdminAuthenticated = stored === 'true';
    }

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
    this.trackOrder('General enquiry', 'Website', sourcePage, url);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }

  trackOrder(title: string, category: string, page: string, link: string) {
    this.orderTracker.recordOrder({
      title,
      category,
      page,
      link
    });
  }

  toggleTrackerModal() {
    if (!this.isAdminAuthenticated) {
      this.showAdminLoginModal = true;
      this.isTrackerModalOpen = false;
      this.adminLoginError = '';
      return;
    }

    this.isTrackerModalOpen = !this.isTrackerModalOpen;
  }

  closeAdminLoginModal() {
    this.showAdminLoginModal = false;
    this.adminLoginError = '';
    this.adminUsername = '';
    this.adminPassword = '';
  }

  submitAdminLogin() {
    if (this.adminUsername.trim() === this.adminEmail && this.adminPassword === this.adminPasswordValue) {
      this.isAdminAuthenticated = true;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.adminAuthStorageKey, 'true');
      }
      this.adminLoginError = '';
      this.showAdminLoginModal = false;
      this.isTrackerModalOpen = true;
      this.adminUsername = '';
      this.adminPassword = '';
      return;
    }

    this.adminLoginError = 'Invalid username or password.';
  }

  downloadOrderSheet() {
    if (!this.isAdminAuthenticated) {
      this.showAdminLoginModal = true;
      this.isTrackerModalOpen = false;
      this.adminLoginError = '';
      return;
    }

    this.orderTracker.downloadOrders();
  }

  get orderCount(): number {
    return this.orderTracker.getOrders().length;
  }

  get trackerOrders() {
    return this.orderTracker.getOrders();
  }
}