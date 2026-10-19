import { Component, OnDestroy, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { CheckoutService } from '../services/checkout.service';
import { CartService } from '../services/cart.service';
import { isWithinDateWindow } from './shop-page.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14100E] text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300">

        <!-- 1. HIGH-IMPACT HERO WITH SMART FINDER CATCH -->
        <section class="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#FFFDFC] to-[#FAF7F2] dark:from-[#14100E] dark:via-[#191412] dark:to-[#14100E] pt-6 sm:pt-10 pb-8 sm:pb-12 border-b border-[#EADFD2]/70 dark:border-white/10">
          <!-- Subtle Luxury Ambient Glow -->
          <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/20 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
          <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/15 dark:bg-[#DD8776]/5 blur-3xl"></div>

          <div class=" mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            <!-- Hero Top Row: Headline + Live 16:9 Showcase Banner -->
            <div class="grid items-center gap-6 lg:grid-cols-12 lg:gap-8">

              <!-- Left Hero Pitch -->
              <div class="lg:col-span-7 space-y-4">
                <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/70 dark:border-white/10 bg-white/90 dark:bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] shadow-2xs backdrop-blur-md">
                  <span class="inline-block h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  Handmade Gift Hampers &bull; All-India Delivery
                </div>

                <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#57251C] dark:text-[#F4F1ED] leading-[1.15]">
                  Beautiful Gift Hampers <br class="hidden sm:inline" />
                  <span class="font-serif italic font-normal text-[#C56D5B] dark:text-[#EB9D8E] underline decoration-[#EB9D8E] decoration-wavy decoration-1 underline-offset-8">
                    Made with Love
                  </span>
                </h1>

                <p class="max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9]">
                  Special gift hampers for Diwali, Birthdays, Weddings, Anniversaries &amp; Return Gifts. Packed with chocolates, dry fruits, sweets &amp; custom greeting cards. Starting at just ₹99.
                </p>

                <!-- Quick Action Buttons -->
                <div class="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    routerLink="/shop"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/15 transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <i class="fa-solid fa-gift text-xs"></i>
                    <span>See All Hampers</span>
                  </a>

                  <a
                    routerLink="/build-hamper"
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-[#57251C]/35 dark:border-white/20 bg-white dark:bg-[#251F1C] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#57251C] dark:text-[#F4F1ED] transition-all duration-300 hover:border-[#9C4738] hover:text-[#9C4738] active:scale-95 shadow-2xs cursor-pointer"
                  >
                    <i class="fa-solid fa-wand-magic-sparkles text-xs text-[#9C4738] dark:text-[#EB9D8E]"></i>
                    <span>Make Your Own Hamper &rarr;</span>
                  </a>
                </div>
              </div>

              <!-- Right 16:9 Live Visual Showcase -->
              <div class="lg:col-span-5 w-full">
                <div class="relative overflow-hidden rounded-2xl border-2 border-white dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1E1916] shadow-lg group">
                  <a [routerLink]="currentSlide.route" class="block relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      [src]="currentSlide.image"
                      [alt]="currentSlide.title"
                      (error)="onBannerImageError($event)"
                      class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                      <span class="inline-block w-fit rounded-full bg-[#9C4738] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1">
                        Featured Collection
                      </span>
                      <h2 class="font-serif text-sm sm:text-base font-bold leading-tight drop-shadow-xs">{{ currentSlide.title }}</h2>
                      <p class="text-[11px] text-white/90 line-clamp-1 mt-0.5">{{ currentSlide.description }}</p>
                      <span class="mt-1.5 text-xs font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore Collection &rarr;
                      </span>
                    </div>
                  </a>

                  <!-- Slide Controls if multiple -->
                  <div *ngIf="topOfferSlides.length > 1" class="absolute bottom-2.5 right-2.5 flex items-center gap-2 z-10 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 text-xs">
                    <button type="button" (click)="prevSlide(); $event.stopPropagation()" class="text-white hover:text-amber-300 font-bold px-1 cursor-pointer">‹</button>
                    <span class="text-[10px] text-white font-mono">{{ activeSlideIndex + 1 }}/{{ topOfferSlides.length }}</span>
                    <button type="button" (click)="nextSlide(); $event.stopPropagation()" class="text-white hover:text-amber-300 font-bold px-1 cursor-pointer">›</button>
                  </div>
                </div>
              </div>

            </div>

            <!-- SMART GIFTING FINDER (THE INSTANT CONVERSION HOOK) -->
            <div class="bg-white dark:bg-[#1E1916] rounded-2xl border-2 border-[#EADFD2] dark:border-white/10 p-4 sm:p-5 shadow-sm space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADFD2]/60 dark:border-white/10 pb-3">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-[#9C4738]/10 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-xs">
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </span>
                  <div>
                    <h2 class="font-serif font-bold text-sm sm:text-base text-[#2E2825] dark:text-[#F4F1ED]">
                      Find the Right Gift in Seconds
                    </h2>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                      Choose who you are gifting for and your budget to see the best hampers.
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E]">
                  <i class="fa-solid fa-bolt"></i>
                  <span>Quick Filter</span>
                </div>
              </div>

              <!-- 3 Interactive Selectors: Recipient, Budget, Occasion -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">

                <!-- 1. Who are you gifting for? -->
                <div class="space-y-1.5">
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                    1. Who is it for?
                  </label>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      *ngFor="let r of [
                        { id: 'all', label: 'All' },
                        { id: 'her', label: 'For Her' },
                        { id: 'him', label: 'For Him' },
                        { id: 'kids', label: 'Kids & Family' }
                      ]"
                      (click)="selectedRecipient = r.id; applyFinderFilter()"
                      class="px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer"
                      [ngClass]="selectedRecipient === r.id ? 'bg-[#9C4738] text-white border-[#9C4738] font-bold shadow-2xs' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#D9C3B9] hover:border-[#9C4738]/50'"
                    >
                      {{ r.label }}
                    </button>
                  </div>
                </div>

                <!-- 2. What is your budget? -->
                <div class="space-y-1.5">
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                    2. Select Budget
                  </label>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      *ngFor="let b of [
                        { id: 'all', label: 'All Budgets' },
                        { id: 'under-200', label: 'Under ₹200' },
                        { id: '200-500', label: '₹200 - ₹500' },
                        { id: 'above-500', label: '₹500+' }
                      ]"
                      (click)="selectedBudget = b.id; applyFinderFilter()"
                      class="px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer"
                      [ngClass]="selectedBudget === b.id ? 'bg-[#9C4738] text-white border-[#9C4738] font-bold shadow-2xs' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#D9C3B9] hover:border-[#9C4738]/50'"
                    >
                      {{ b.label }}
                    </button>
                  </div>
                </div>

                <!-- 3. Celebration Occasion -->
                <div class="space-y-1.5">
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                    3. Occasion
                  </label>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      *ngFor="let o of [
                        { id: 'all', label: 'All' },
                        { id: 'diwali', label: 'Diwali 🪔' },
                        { id: 'return-gifts', label: 'Return Gifts' }
                      ]"
                      (click)="selectedOccasion = o.id; applyFinderFilter()"
                      class="px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer"
                      [ngClass]="selectedOccasion === o.id ? 'bg-[#9C4738] text-white border-[#9C4738] font-bold shadow-2xs' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#D9C3B9] hover:border-[#9C4738]/50'"
                    >
                      {{ o.label }}
                    </button>
                  </div>
                </div>

              </div>

              <!-- Finder Action Bar -->
              <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#EADFD2]/60 dark:border-white/10">
                <div class="text-xs text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-2">
                  <span>Showing: <strong class="text-[#2E2825] dark:text-[#F4F1ED]">{{ filteredBestsellers.length }} curated matches</strong></span>
                  <button
                    *ngIf="selectedRecipient !== 'all' || selectedBudget !== 'all' || selectedOccasion !== 'all'"
                    (click)="resetFinder()"
                    class="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>

                <div class="flex items-center gap-2.5">
                  <button
                    type="button"
                    (click)="navigateToShopWithFilter()"
                    class="px-4 py-2 rounded-xl bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View All Matches in Shop</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>

                  <a
                    routerLink="/build-hamper"
                    class="px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#9C4738] dark:text-[#EB9D8E] text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                    <span>Make Custom Hamper</span>
                  </a>
                </div>
              </div>

            </div>

            <!-- Trust Highlights Strip -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-center">
              <div class="p-2.5 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-2xs flex items-center justify-center gap-2">
                <i class="fa-solid fa-truck-fast text-[#9C4738] dark:text-[#EB9D8E] text-sm"></i>
                <span class="text-xs font-bold text-[#4A3C31] dark:text-[#D9C3B9]">Safe Pan-India Delivery</span>
              </div>
              <div class="p-2.5 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-2xs flex items-center justify-center gap-2">
                <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i>
                <span class="text-xs font-bold text-[#4A3C31] dark:text-[#D9C3B9]">WhatsApp Support</span>
              </div>
              <div class="p-2.5 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-2xs flex items-center justify-center gap-2">
                <i class="fa-solid fa-shield-heart text-[#9C4738] dark:text-[#EB9D8E] text-sm"></i>
                <span class="text-xs font-bold text-[#4A3C31] dark:text-[#D9C3B9]">Safe Gift Packaging</span>
              </div>
              <div class="p-2.5 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-2xs flex items-center justify-center gap-2">
                <i class="fa-solid fa-indian-rupee-sign text-[#9C4738] dark:text-[#EB9D8E] text-sm"></i>
                <span class="text-xs font-bold text-[#4A3C31] dark:text-[#D9C3B9]">Cash on Delivery Available</span>
              </div>
            </div>

          </div>
        </section>

        <!-- CART CONFIRMATION TOAST -->
        <div
          *ngIf="addedCartToast"
          class="fixed bottom-5 right-5 z-50 bg-[#57251C] text-white px-4 py-3 rounded-2xl shadow-xl border border-amber-300/30 flex items-center gap-3 animate-fade-in"
        >
          <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">
            <i class="fa-solid fa-check"></i>
          </div>
          <div>
            <div class="text-xs font-bold">Added to Cart!</div>
            <div class="text-[11px] text-stone-300 truncate max-w-xs">{{ addedCartToast }}</div>
          </div>
          <a routerLink="/cart" class="ml-2 px-3 py-1 bg-[#C56D5B] hover:bg-[#9C4738] rounded-xl text-xs font-bold transition">
            View Cart &rarr;
          </a>
        </div>

        <!-- 2. SMART BESTSELLERS & CURATED MATCHES SECTION -->
        <section class=" mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">

          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EADFD2]/70 dark:border-white/10 pb-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                <span class="text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E]">
                  Customer Favorites
                </span>
              </div>
              <h2 class="font-serif text-xl sm:text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED] mt-0.5">
                Trending Hampers &amp; Quick Gifts
              </h2>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                Instant 1-tap add to cart with verified pricing and guaranteed safe packaging.
              </p>
            </div>

            <!-- Quick Filter Tabs -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              <button
                type="button"
                *ngFor="let tab of ['All', 'Diwali Festive', 'Under ₹200', 'Girls & Boys', 'Pooja Kits']"
                (click)="activeTab = tab; applyTabFilter(tab)"
                class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition cursor-pointer"
                [ngClass]="activeTab === tab ? 'bg-[#9C4738] text-white border-[#9C4738] font-bold shadow-2xs' : 'bg-white dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:border-[#9C4738]/50'"
              >
                {{ tab }}
              </button>
            </div>
          </div>

          <!-- Product Grid -->
          <div *ngIf="filteredBestsellers.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            <div
              *ngFor="let prod of filteredBestsellers"
              class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] p-3 sm:p-3.5 shadow-2xs transition duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#9C4738]/60"
            >
              <div>
                <!-- Image Container with Badge -->
                <div class="relative aspect-square overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800">
                  <a [routerLink]="['/product', prod.id]" class="block w-full h-full">
                    <img
                      [src]="prod.image"
                      [alt]="prod.name"
                      class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </a>
                  <span class="absolute top-2 left-2 rounded-md bg-[#57251C]/90 text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    {{ prod.badge || 'Bestseller' }}
                  </span>
                </div>

                <!-- Product Info -->
                <div class="pt-2.5 space-y-1">
                  <span class="text-[9px] font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] block truncate">
                    {{ prod.category }}
                  </span>
                  <h3 class="font-serif text-xs sm:text-sm font-bold text-[#2E2825] dark:text-[#F4F1ED] line-clamp-1 group-hover:text-[#9C4738] transition">
                    <a [routerLink]="['/product', prod.id]">{{ prod.name }}</a>
                  </h3>
                  <p class="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1">
                    {{ prod.description || 'Authentic partitioned gift bundle' }}
                  </p>
                </div>
              </div>

              <!-- Price & Quick Add Button -->
              <div class="pt-2 mt-2 border-t border-[#EADFD2]/60 dark:border-white/5 flex items-center justify-between gap-1">
                <div>
                  <span class="font-mono text-xs sm:text-sm font-extrabold text-[#9C4738] dark:text-[#EB9D8E]">
                    ₹{{ prod.price }}
                  </span>
                  <span *ngIf="prod.originalPrice" class="ml-1 text-[10px] text-stone-400 line-through">
                    ₹{{ prod.originalPrice }}
                  </span>
                </div>

                <button
                  type="button"
                  (click)="addBestsellerToCart(prod)"
                  class="px-3 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] hover:bg-[#9C4738] hover:text-white text-[#9C4738] dark:text-[#EB9D8E] text-[11px] font-bold transition shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <i class="fa-solid fa-cart-plus text-[10px]"></i>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty Matches Fallback -->
          <div *ngIf="filteredBestsellers.length === 0" class="p-8 text-center bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 space-y-2">
            <p class="text-xs font-bold text-stone-600 dark:text-stone-300">No hampers match this exact combination.</p>
            <button (click)="resetFinder()" class="text-xs font-bold text-[#9C4738] hover:underline cursor-pointer">
              Reset Filters to View All Hampers
            </button>
          </div>

          <!-- View All Button -->
          <div class="text-center pt-2">
            <a
              routerLink="/shop"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#9C4738] text-[#9C4738] dark:text-[#EB9D8E] hover:bg-[#9C4738] hover:text-white text-xs font-bold uppercase tracking-wider transition shadow-2xs cursor-pointer"
            >
              <span>Explore Complete 50+ Hamper Catalog</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </a>
          </div>

        </section>

        <!-- 3. BUILD YOUR OWN HAMPER SPOTLIGHT -->
        <section class="bg-[#57251C] text-white py-10 sm:py-12 my-6">
          <div class=" mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid items-center gap-6 lg:grid-cols-12">

              <div class="lg:col-span-8 space-y-3">
                <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider text-[#D9C3B9]">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> Custom Hamper Studio
                </span>

                <h2 class="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFDFC]">
                  Build Your Own Gift Box
                </h2>

                <p class="text-xs sm:text-sm text-[#D9C3B9] leading-relaxed max-w-xl">
                  Handpick dry fruits, sweets, diyas, and greeting cards. See live pricing and checkout instantly.
                </p>

                <!-- Sample Inclusions Chips -->
                <div class="flex items-center gap-2 flex-wrap pt-1 text-xs">
                  <span class="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">🪔 Pooja Diya ₹49</span>
                  <span class="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">🌰 Almonds ₹20</span>
                  <span class="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">🍬 Besan Ladoo ₹10</span>
                  <span class="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">🕯️ Essence Candle ₹10</span>
                  <span class="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15">💌 Custom Card ₹50</span>
                </div>

                <div class="pt-2">
                  <a
                    routerLink="/build-hamper"
                    class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#57251C] hover:bg-stone-100 text-xs sm:text-sm font-bold uppercase tracking-wider shadow transition cursor-pointer"
                  >
                    <span>Start Curating &rarr;</span>
                  </a>
                </div>
              </div>

              <!-- Mini Box Visual -->
              <div class="lg:col-span-4">
                <div class="p-5 rounded-2xl bg-white/5 border border-white/15 text-center space-y-3">
                  <div class="w-12 h-12 rounded-xl bg-white/10 mx-auto flex items-center justify-center text-xl text-white">
                    <i class="fa-solid fa-gift"></i>
                  </div>
                  <h3 class="font-serif font-bold text-sm text-white">How It Works</h3>
                  <div class="text-xs text-stone-300 space-y-2 text-left">
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-white/15 text-white font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                      <span>Pick items &amp; occasion</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-white/15 text-white font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                      <span>Add free personalized message</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-5 h-5 rounded-full bg-white/15 text-white font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                      <span>Checkout or order via WhatsApp</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 4. CATEGORIES BROWSER -->
        <section class=" mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5">
          <div class="flex items-center justify-between border-b border-[#EADFD2]/70 dark:border-white/10 pb-3">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E]">
                Collections Catalog
              </span>
              <h2 class="font-serif text-xl sm:text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED] mt-0.5">
                Browse by Gifting Category
              </h2>
            </div>
            <a routerLink="/shop" class="text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline">
              View All &rarr;
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              *ngFor="let cat of displayCategories"
              [routerLink]="cat.route"
              [queryParams]="cat.queryParams"
              class="group relative overflow-hidden rounded-2xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] p-4 shadow-2xs hover:shadow-md hover:border-[#9C4738]/50 transition duration-300"
            >
              <div class="overflow-hidden rounded-xl aspect-[16/10] bg-stone-100 dark:bg-stone-800">
                <img [src]="cat.image" [alt]="cat.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div class="mt-3 flex items-center justify-between">
                <h3 class="font-serif font-bold text-sm sm:text-base text-[#2E2825] dark:text-[#F4F1ED] group-hover:text-[#9C4738] transition">
                  {{ cat.name }}
                </h3>
                <span *ngIf="cat.badge" class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#9C4738]/10 text-[#9C4738] dark:text-[#EB9D8E]">
                  {{ cat.badge }}
                </span>
              </div>
              <p class="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">
                {{ cat.description }}
              </p>
              <span class="inline-flex items-center gap-1 text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] mt-2 group-hover:translate-x-1 transition-transform">
                Explore Collection &rarr;
              </span>
            </a>
          </div>
        </section>

        <!-- 5. DIRECT CONCIERGE & BULK ORDERS CALLOUT -->
        <section class=" mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div class="rounded-3xl border border-[#EADFD2] dark:border-white/10 bg-gradient-to-r from-[#FAF7F2] via-white to-[#FAF7F2] dark:from-[#1E1916] dark:via-[#251F1C] dark:to-[#1E1916] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="space-y-2 text-center md:text-left">
              <span class="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp Support &amp; Bulk Orders
              </span>
              <h3 class="font-serif text-lg sm:text-xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                Planning Corporate Gifts, Wedding Favours, or Bulk Orders?
              </h3>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] max-w-xl">
                Enjoy personalized branding, custom ribbon packaging, and special discount pricing on bulk orders. Connect directly with our team for quick quotes.
              </p>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <a
                href="https://wa.me/919284905118?text=Hello%20RMS%20Creations,%20I%20would%20like%20to%20inquire%20about%20gift%20hampers"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow transition-all cursor-pointer"
              >
                <i class="fa-brands fa-whatsapp text-sm"></i>
                <span>Chat on WhatsApp</span>
              </a>

              <a
                routerLink="/contact"
                class="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#4A3C31] dark:text-[#F4F1ED] text-xs font-bold transition cursor-pointer"
              >
                <span>Contact Studio</span>
              </a>
            </div>
          </div>
        </section>

      </div>
    </app-site-layout>
  `
})
export class HomePageComponent implements OnInit, OnDestroy {
  activeSlideIndex = 0;
  private autoRotateTimer?: number;
  private platformId = inject(PLATFORM_ID);
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  public readonly checkoutService = inject(CheckoutService);
  public readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Smart Gifting Finder State
  selectedRecipient: string = 'all';
  selectedBudget: string = 'all';
  selectedOccasion: string = 'all';
  activeTab: string = 'All';

  // Products & Collections
  bestsellers: any[] = [];
  filteredBestsellers: any[] = [];
  displayCategories: any[] = [];
  addedCartToast: string = '';

  topOfferSlides: {
    title: string;
    description: string;
    image: string;
    route: string;
  }[] = [];

  ngOnInit() {
    this.startAutoRotate();
    this.seo.setPageMetadata({
      title: 'RMS Creations — Handcrafted Luxury Gift Hampers',
      description: 'Handcrafted gift hampers for Diwali, birthdays, weddings, baby showers and special celebrations. Instant online order and custom hamper studio.',
      keywords: 'gift hampers, custom hampers, Diwali hampers, wedding return gifts, birthday gifts, luxury gift boxes',
      slug: ''
    });
    this.seo.setBreadcrumbSchema([
      { name: 'Home', url: '/' }
    ]);

    this.seo.setFaqSchema([
      {
        question: 'How do I build a custom gift hamper with RMS Creations?',
        answer: 'You can use our interactive Build Hamper Studio to handpick dry fruits, sweets, pooja diyas, and greeting cards. See live pricing and checkout directly online or order via WhatsApp.'
      },
      {
        question: 'Where does RMS Creations deliver in India?',
        answer: 'We deliver handcrafted gift hampers across Navi Mumbai, Mumbai, Thane, Maharashtra, and pan-India with secure partitioned protective packaging to ensure your goodies arrive fresh and undamaged.'
      },
      {
        question: 'Can I add a personalized gift message to my order?',
        answer: 'Yes! A complimentary customized greeting card is included with every order. You can enter your message during checkout or inside the Hamper Studio.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, major Credit/Debit cards, and Cash on Delivery (COD).'
      }
    ]);

    this.loadLiveBanners();
    this.loadBestsellers();
    this.loadCategories();
  }

  get currentSlide() {
    return this.topOfferSlides[this.activeSlideIndex] || this.topOfferSlides[0] || {
      title: 'RMS Handcrafted Hampers',
      description: 'Curated luxury hampers for festive celebrations & milestones.',
      image: 'assets/banners/banner.png',
      route: '/shop'
    };
  }

  async loadBestsellers() {
    try {
      const [pRes, cRes] = await Promise.all([
        this.supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('selling_price', { ascending: true })
          .limit(20),
        this.supabase
          .from('categories')
          .select('*')
      ]);

      const activeCatMap = new Map<number, any>();
      if (cRes.data) {
        cRes.data.forEach((c: any) => {
          if (c.is_active && isWithinDateWindow(c.from_date, c.to_date)) {
            activeCatMap.set(Number(c.id), c);
          }
        });
      }

      if (pRes.data && pRes.data.length > 0) {
        this.bestsellers = pRes.data
          .filter((p: any) => {
            if (!p.is_active) return false;
            if (!isWithinDateWindow(p.from_date, p.to_date)) return false;
            if (p.category_id && !activeCatMap.has(Number(p.category_id))) return false;
            return true;
          })
          .map((p: any) => {
            const cat = activeCatMap.get(Number(p.category_id));
            const rawPrice = Number(p.price || 0);
            const rawSellingPrice = Number(p.selling_price || 0);
            let finalPrice = rawSellingPrice || rawPrice || 149;
            let originalPrice: number | undefined = undefined;

            if (rawPrice > 0 && rawSellingPrice > 0 && rawPrice > rawSellingPrice) {
              finalPrice = rawSellingPrice;
              originalPrice = rawPrice;
            }

            return {
              id: p.id,
              name: p.name,
              category: cat?.name || 'Gift Hamper',
              categoryId: p.category_id,
              price: finalPrice,
              originalPrice: originalPrice,
              image: (p.images && p.images[0]) || 'assets/banners/banner.png',
              badge: p.badge || (p.is_featured ? 'Bestseller' : 'Popular'),
              description: p.description || ''
            };
          });

        this.filteredBestsellers = [...this.bestsellers];
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  // Smart Gifting Finder Filter Logic
  applyFinderFilter() {
    this.filteredBestsellers = this.bestsellers.filter(p => {
      // 1. Recipient filter
      if (this.selectedRecipient === 'her') {
        const n = (p.name + ' ' + p.category).toLowerCase();
        if (!n.includes('girl') && !n.includes('glam') && !n.includes('pastel') && !n.includes('charm')) {
          // If not female-oriented, skip unless it's unisex chocolate/sweets
          if (!n.includes('chocolate') && !n.includes('pooja')) return false;
        }
      } else if (this.selectedRecipient === 'him') {
        const n = (p.name + ' ' + p.category).toLowerCase();
        if (!n.includes('boy') && !n.includes('urban') && !n.includes('style') && !n.includes('milestone')) {
          if (!n.includes('chocolate') && !n.includes('dry fruit')) return false;
        }
      } else if (this.selectedRecipient === 'kids') {
        const n = (p.name + ' ' + p.category).toLowerCase();
        if (!n.includes('girl') && !n.includes('boy') && !n.includes('mini') && !n.includes('chocolate')) {
          return false;
        }
      }

      // 2. Budget filter
      if (this.selectedBudget === 'under-200' && p.price > 200) return false;
      if (this.selectedBudget === '200-500' && (p.price < 200 || p.price > 500)) return false;
      if (this.selectedBudget === 'above-500' && p.price <= 500) return false;

      // 3. Occasion filter
      if (this.selectedOccasion === 'diwali') {
        const n = (p.name + ' ' + p.category).toLowerCase();
        if (!n.includes('diwali') && !n.includes('pooja') && !n.includes('ganpati') && !n.includes('festive') && !n.includes('sweet')) {
          return false;
        }
      } else if (this.selectedOccasion === 'return-gifts') {
        const n = (p.name + ' ' + p.category).toLowerCase();
        if (!n.includes('return') && !n.includes('favour') && !n.includes('mini') && !n.includes('treat')) {
          return false;
        }
      }

      return true;
    });

    this.cdr.markForCheck();
  }

  applyTabFilter(tab: string) {
    if (tab === 'All') {
      this.filteredBestsellers = [...this.bestsellers];
    } else if (tab === 'Diwali Festive') {
      this.filteredBestsellers = this.bestsellers.filter(p => {
        const n = (p.name + ' ' + p.category).toLowerCase();
        return n.includes('diwali') || n.includes('pooja') || n.includes('festive') || n.includes('ganpati');
      });
    } else if (tab === 'Under ₹200') {
      this.filteredBestsellers = this.bestsellers.filter(p => p.price <= 200);
    } else if (tab === 'Girls & Boys') {
      this.filteredBestsellers = this.bestsellers.filter(p => {
        const n = (p.name + ' ' + p.category).toLowerCase();
        return n.includes('girl') || n.includes('boy');
      });
    } else if (tab === 'Pooja Kits') {
      this.filteredBestsellers = this.bestsellers.filter(p => {
        const n = (p.name + ' ' + p.category).toLowerCase();
        return n.includes('pooja') || n.includes('diya') || n.includes('ganpati');
      });
    }
    this.cdr.markForCheck();
  }

  resetFinder() {
    this.selectedRecipient = 'all';
    this.selectedBudget = 'all';
    this.selectedOccasion = 'all';
    this.activeTab = 'All';
    this.filteredBestsellers = [...this.bestsellers];
    this.cdr.markForCheck();
  }

  navigateToShopWithFilter() {
    const queryParams: any = {};
    if (this.selectedBudget !== 'all') {
      queryParams.budget = this.selectedBudget;
    }
    if (this.selectedRecipient === 'her') {
      queryParams.category = 'Girls Hampers';
    } else if (this.selectedRecipient === 'him') {
      queryParams.category = 'Boys Hampers';
    }
    if (this.selectedOccasion === 'diwali') {
      queryParams.category = 'Diwali 2026';
    } else if (this.selectedOccasion === 'return-gifts') {
      queryParams.category = 'Event Favours & Return Gifts';
    }
    this.router.navigate(['/shop'], { queryParams });
  }

  addBestsellerToCart(prod: any) {
    this.cartService.addToCart({
      id: `prod-${prod.id}`,
      productId: prod.id,
      title: prod.name,
      price: prod.price,
      image: prod.image,
      category: prod.category
    }, 1);

    this.addedCartToast = prod.name;
    setTimeout(() => {
      if (this.addedCartToast === prod.name) {
        this.addedCartToast = '';
        this.cdr.markForCheck();
      }
    }, 3000);
    this.cdr.markForCheck();
  }

  async loadCategories() {
    try {
      const { data } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (data && data.length > 0) {
        this.displayCategories = data
          .filter((c: any) => c.is_active && isWithinDateWindow(c.from_date, c.to_date))
          .map((c: any) => {
            const lower = c.name.toLowerCase();
            const badge = lower.includes('diwali') ? 'Active Festival' :
              lower.includes('ganpati') ? 'Festive' :
                lower.includes('friendship') || lower.includes('raksha') ? 'Seasonal' :
                  lower.includes('girl') || lower.includes('boy') ? 'Popular' : 'Featured';
            return {
              id: c.id,
              name: c.name,
              image: c.image || 'assets/banners/banner.png',
              description: c.description || 'Artisanal gift hamper curation.',
              route: '/shop',
              queryParams: { category: c.name },
              badge: badge
            };
          });
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadLiveBanners() {
    try {
      const { data } = await this.supabase
        .from('banner_images')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (data && data.length > 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const activeBanners = data.filter((b: any) => {
          if (!b.is_active) return false;
          if (b.from_date && b.from_date > todayStr) return false;
          if (b.to_date && b.to_date < todayStr) return false;
          return true;
        });

        if (activeBanners.length > 0) {
          this.topOfferSlides = activeBanners.map((b: any) => ({
            title: b.name,
            description: b.description || 'Thoughtfully styled gift hampers for celebrations and treasured moments.',
            image: b.image || 'assets/banners/banner.png',
            route: b.navigate_to_url_on_click || '/shop'
          }));
          this.activeSlideIndex = 0;
        } else {
          this.setDefaultSlides();
        }
      } else {
        this.setDefaultSlides();
      }
    } catch {
      this.setDefaultSlides();
    } finally {
      this.cdr.markForCheck();
    }
  }

  private setDefaultSlides() {
    this.topOfferSlides = [
      {
        title: 'Diwali Festive Hampers 2026',
        description: 'Authentic pooja kits, premium dry fruits & luxury sweets curated with festive elegance.',
        image: 'assets/banners/banner.png',
        route: '/shop'
      },
      {
        title: 'Bespoke Personalized Hampers',
        description: 'Design your own hamper with live simulation and personalized greeting card.',
        image: 'assets/hampers/chocolate_hamper/chocolate.jpeg',
        route: '/build-hamper'
      }
    ];
  }

  onBannerImageError(event: any) {
    if (event?.target) {
      event.target.src = 'assets/banners/banner.png';
    }
  }

  ngOnDestroy() {
    this.stopAutoRotate();
    this.seo.removeJsonLd('faq-json-ld');
    this.seo.removeJsonLd('breadcrumbs-json-ld');
  }

  private startAutoRotate() {
    if (isPlatformBrowser(this.platformId)) {
      this.autoRotateTimer = window.setInterval(() => {
        this.nextSlide();
        this.cdr.markForCheck();
      }, 6000);
    }
  }

  private stopAutoRotate() {
    if (isPlatformBrowser(this.platformId) && this.autoRotateTimer) {
      window.clearInterval(this.autoRotateTimer);
    }
  }

  nextSlide() {
    if (this.topOfferSlides.length === 0) return;
    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.topOfferSlides.length;
    this.cdr.markForCheck();
  }

  prevSlide() {
    if (this.topOfferSlides.length === 0) return;
    this.activeSlideIndex = (this.activeSlideIndex - 1 + this.topOfferSlides.length) % this.topOfferSlides.length;
    this.cdr.markForCheck();
  }

  goToSlide(index: number) {
    this.activeSlideIndex = index;
    this.stopAutoRotate();
    this.startAutoRotate();
    this.cdr.markForCheck();
  }
}
