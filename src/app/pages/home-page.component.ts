import { Component, OnDestroy, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { CheckoutService } from '../services/checkout.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell">
      
      <!-- HERO SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] dark:from-[#14100E] dark:via-[#191412] dark:to-[#1E1916] py-16 md:py-24">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 dark:bg-[#DD8776]/10 blur-3xl"></div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid items-center gap-12 lg:grid-cols-12">
            <!-- Left Content Column -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/70 dark:border-[#3D302A] bg-[#FFFDFC]/90 dark:bg-[#1E1916]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#EB9D8E] shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
                Bespoke Luxury Gifting
              </div>

              <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] dark:text-[#F4F1ED] sm:text-5xl lg:text-6xl leading-[1.15]">
                Handcrafted Gifts for <br />
                <span class="font-serif italic font-normal text-[#C56D5B] dark:text-[#EB9D8E] underline decoration-[#EB9D8E] decoration-wavy decoration-1 underline-offset-8">Every Special Moment</span>
              </h1>

              <p class="mt-5 max-w-xl text-base leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-lg">
                Thoughtfully assembled gift hampers for birthdays, festive celebrations, and treasured milestones. Made with love and delivered with care.
              </p>

              <!-- CTA Group -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  routerLink="/shop"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/15 transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer"
                >
                  <i class="fa-solid fa-gift text-base"></i>
                  <span>Shop Now</span>
                </a>

                <a 
                  routerLink="/gallery" 
                  class="inline-flex items-center justify-center rounded-full border border-[#57251C]/35 dark:border-[#3D302A] bg-[#FFFDFC]/80 dark:bg-[#251F1C]/80 px-8 py-4 text-xs sm:text-sm font-bold text-[#57251C] dark:text-[#F4F1ED] backdrop-blur-sm transition-all duration-300 hover:border-[#57251C] dark:hover:border-[#EB9D8E] hover:bg-[#F7F6F3] dark:hover:bg-[#322924] active:scale-95"
                >
                  <span>Explore Lookbook</span>
                </a>
              </div>

              <!-- Trust Badges -->
              <div class="mt-8 flex flex-wrap gap-2.5 border-t border-[#D9C3B9]/50 dark:border-[#3D302A] pt-5 text-xs font-medium text-[#57251C]/80 dark:text-[#D9C3B9]">
                <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/60 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#1E1916] px-3.5 py-1.5 shadow-sm">
                  <i class="fa-solid fa-wand-magic-sparkles text-[#9C4738] dark:text-[#EB9D8E]"></i>
                  <span>100% Customized Gifting</span>
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/60 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#1E1916] px-3.5 py-1.5 shadow-sm">
                  <i class="fa-brands fa-whatsapp text-emerald-600"></i>
                  <span>Direct Concierge on WhatsApp</span>
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/60 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#1E1916] px-3.5 py-1.5 shadow-sm">
                  <i class="fa-solid fa-gift text-[#9C4738] dark:text-[#EB9D8E]"></i>
                  <span>Premium Luxury Packaging</span>
                </span>
              </div>
            </div>

            <!-- Right Visual Column -->
            <div class="relative lg:col-span-5">
              <div class="group relative mx-auto max-w-md lg:max-w-none">
                <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#EB9D8E] to-[#DD8776] opacity-35 blur-xl transition duration-500 group-hover:opacity-55"></div>
                <img 
                  src="assets/banners/banner.png" 
                  alt="Gift hamper showcase" 
                  class="relative h-auto w-full rounded-[2rem] border-8 border-[#FFFDFC] dark:border-[#251F1C] object-cover shadow-2xl transition duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SEASONAL FESTIVE SPOTLIGHT BANNER (DATABASE-DRIVEN) -->
      <section *ngIf="seasonalBanner" class="relative bg-gradient-to-r from-[#57251C] via-[#9C4738] to-[#C56D5B] py-6 text-[#FFFDFC] shadow-md transition-all">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4 text-center md:text-left">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-md shadow-sm border border-white/20">
                <i [class]="'fa-solid ' + (seasonalBanner.icon || 'fa-sparkles') + ' text-white'"></i>
              </div>
              <div>
                <span class="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FFFDFC]">
                  {{ seasonalBanner.badge }}
                </span>
                <h2 class="font-serif text-lg sm:text-xl font-bold text-[#FFFDFC] mt-1">
                  {{ seasonalBanner.title }}
                </h2>
                <p class="text-xs text-[#D9C3B9] mt-0.5">
                  {{ seasonalBanner.description }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <a 
                [routerLink]="seasonalBanner.route" 
                class="inline-flex items-center gap-2 rounded-full bg-[#FFFDFC] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#57251C] shadow-lg hover:bg-[#F7F6F3] hover:scale-105 transition-all active:scale-95"
              >
                <span>{{ seasonalBanner.buttonText }}</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- VALUE PROPOSITION GRID -->
      <section class="py-12 md:py-16 bg-[#FFFDFC] dark:bg-[#14100E] border-b border-[#D9C3B9]/20 dark:border-[#3D302A]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/12 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/25">
              The RMS Standard
            </span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#57251C] dark:text-[#F4F1ED]">
              Bespoke, Thoughtful & Seamlessly Ordered
            </h2>
          </div>

          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div class="group rounded-3xl border border-[#D9C3B9]/40 dark:border-[#3D302A] bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] dark:from-[#1E1916] dark:to-[#191412] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B]/40 hover:shadow-lg">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] text-xl text-[#9C4738] dark:text-[#EB9D8E] border border-[#D9C3B9]/40 dark:border-[#3D302A] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#57251C] group-hover:text-white"><i class="fa-solid fa-gift"></i></div>
              <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">Curated Selection</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">Choose from thoughtfully styled hampers tailored to every recipient and milestone.</p>
            </div>

            <div class="group rounded-3xl border border-[#D9C3B9]/40 dark:border-[#3D302A] bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] dark:from-[#1E1916] dark:to-[#191412] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B]/40 hover:shadow-lg">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] text-xl text-[#9C4738] dark:text-[#EB9D8E] border border-[#D9C3B9]/40 dark:border-[#3D302A] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#57251C] group-hover:text-white"><i class="fa-solid fa-heart"></i></div>
              <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">Artisanal Finishing</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">Neat partitioned presentation with satin ribbons, custom tags, and luxury touch.</p>
            </div>

            <div class="group rounded-3xl border border-[#D9C3B9]/40 dark:border-[#3D302A] bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] dark:from-[#1E1916] dark:to-[#191412] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B]/40 hover:shadow-lg">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] text-xl text-emerald-600 border border-[#D9C3B9]/40 dark:border-[#3D302A] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#57251C] group-hover:text-white"><i class="fa-brands fa-whatsapp"></i></div>
              <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">Direct Concierge</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">Instant, personalized assistance and customization ideas directly on WhatsApp.</p>
            </div>

            <div class="group rounded-3xl border border-[#D9C3B9]/40 dark:border-[#3D302A] bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] dark:from-[#1E1916] dark:to-[#191412] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B]/40 hover:shadow-lg">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] text-xl text-[#9C4738] dark:text-[#EB9D8E] border border-[#D9C3B9]/40 dark:border-[#3D302A] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#57251C] group-hover:text-white"><i class="fa-solid fa-truck-fast"></i></div>
              <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">Safe Delivery</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">Reliable, secure packaging delivered in pristine condition across Maharashtra & India.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- BESTSELLERS & BUDGET COLLECTIONS SECTION -->
      <section class="py-14 md:py-20 bg-[#FAF7F2] dark:bg-[#161210] border-b border-[#D9C3B9]/30 dark:border-[#3D302A]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/25">
                <i class="fa-solid fa-crown text-amber-500"></i> Customer Favorites
              </span>
              <h2 class="mt-3 font-serif text-2xl sm:text-4xl font-bold text-[#57251C] dark:text-[#F4F1ED]">
                Bestsellers &amp; Budget Collections
              </h2>
              <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">
                Handpicked hampers with instant Add to Cart and seamless checkout.
              </p>
            </div>
            <a 
              routerLink="/shop" 
              class="inline-flex items-center gap-2 rounded-full border border-[#57251C]/30 dark:border-[#3D302A] bg-white dark:bg-[#251F1C] px-5 py-2.5 text-xs font-bold text-[#57251C] dark:text-[#F4F1ED] hover:bg-[#57251C] hover:text-white dark:hover:bg-[#C56D5B] transition shadow-sm"
            >
              <span>Explore Full Catalog</span>
              <span>&rarr;</span>
            </a>
          </div>

          <!-- Quick Budget Collection Tags -->
          <div class="flex flex-wrap gap-2.5 mb-8">
            <a routerLink="/shop" [queryParams]="{ budget: 'under-200' }" class="rounded-full bg-white dark:bg-[#251F1C] px-4 py-2 text-xs font-semibold text-[#57251C] dark:text-[#F4F1ED] border border-[#D9C3B9]/50 dark:border-[#3D302A] hover:border-[#C56D5B] hover:text-[#9C4738] transition shadow-sm">
              🎁 Pocket Hampers under ₹200
            </a>
            <a routerLink="/shop" [queryParams]="{ budget: '200-500' }" class="rounded-full bg-white dark:bg-[#251F1C] px-4 py-2 text-xs font-semibold text-[#57251C] dark:text-[#F4F1ED] border border-[#D9C3B9]/50 dark:border-[#3D302A] hover:border-[#C56D5B] hover:text-[#9C4738] transition shadow-sm">
              ✨ Classic Bundles ₹200 - ₹500
            </a>
            <a routerLink="/shop" [queryParams]="{ budget: 'above-500' }" class="rounded-full bg-white dark:bg-[#251F1C] px-4 py-2 text-xs font-semibold text-[#57251C] dark:text-[#F4F1ED] border border-[#D9C3B9]/50 dark:border-[#3D302A] hover:border-[#C56D5B] hover:text-[#9C4738] transition shadow-sm">
              👑 Luxury Hampers ₹500+
            </a>
          </div>

          <!-- Product Grid -->
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div 
              *ngFor="let prod of bestsellers" 
              class="group relative flex flex-col overflow-hidden rounded-[2rem] border border-[#D9C3B9]/50 dark:border-[#3D302A] bg-white dark:bg-[#1E1916] p-4 shadow-md transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#C56D5B]/60"
            >
              <div class="relative aspect-square overflow-hidden rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C]">
                <img 
                  [src]="prod.image" 
                  [alt]="prod.name" 
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span class="absolute top-2.5 left-2.5 rounded-full bg-[#57251C]/90 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {{ prod.badge || 'Bestseller' }}
                </span>
              </div>

              <div class="flex flex-1 flex-col pt-4">
                <span class="text-[11px] font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E]">{{ prod.category }}</span>
                <h3 class="font-serif text-base font-bold text-[#57251C] dark:text-[#F4F1ED] mt-1 line-clamp-1 group-hover:text-[#9C4738] transition">
                  <a [routerLink]="['/product', prod.id]">{{ prod.name }}</a>
                </h3>
                <p class="text-xs text-[#57251C]/70 dark:text-[#D9C3B9] mt-1 line-clamp-2 leading-relaxed">
                  {{ prod.description }}
                </p>

                <div class="mt-auto pt-4 flex items-center justify-between border-t border-[#D9C3B9]/30 dark:border-[#3D302A]/50">
                  <div>
                    <span class="font-serif text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">₹{{ prod.price }}</span>
                    <span *ngIf="prod.originalPrice" class="ml-1.5 text-xs text-[#9D7B6C] line-through">₹{{ prod.originalPrice }}</span>
                  </div>
                  <button 
                    type="button"
                    (click)="addBestsellerToCart(prod)"
                    class="inline-flex items-center gap-1.5 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#9C4738] dark:hover:bg-[#DD8776] transition shadow active:scale-95 cursor-pointer"
                  >
                    <i class="fa-solid fa-cart-plus"></i>
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURED SHOWCASE CAROUSEL -->
      <section class="bg-[#F7F6F3] dark:bg-[#191412] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#3D302A]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span class="inline-block rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/25">Seasonal Curation</span>
              <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C] dark:text-[#F4F1ED]">Popular Celebrations</h2>
            </div>
            <div class="flex items-center gap-3">
              <button 
                type="button" 
                (click)="prevSlide()" 
                class="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C3B9] dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#251F1C] text-[#57251C] dark:text-[#F4F1ED] shadow-sm transition hover:bg-[#57251C] dark:hover:bg-[#C56D5B] hover:text-[#FFFDFC] active:scale-95"
                aria-label="Previous Slide"
              >
                ←
              </button>
              <button 
                type="button" 
                (click)="nextSlide()" 
                class="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C3B9] dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#251F1C] text-[#57251C] dark:text-[#F4F1ED] shadow-sm transition hover:bg-[#57251C] dark:hover:bg-[#C56D5B] hover:text-[#FFFDFC] active:scale-95"
                aria-label="Next Slide"
              >
                →
              </button>
            </div>
          </div>

          <!-- Carousel Container -->
          <div class="overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#1E1916] shadow-xl">
            <div class="grid items-center gap-0 lg:grid-cols-12">
              <div class="relative overflow-hidden lg:col-span-5">
                <img 
                  [src]="currentSlide.image" 
                  [alt]="currentSlide.title" 
                  class="h-[380px] w-full object-cover transition-all duration-700 ease-out hover:scale-105 lg:h-[460px]" 
                />
              </div>
              <div class="flex flex-col justify-center p-8 lg:col-span-7 lg:p-12">
                <span class="w-fit rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-3 py-1 text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/25">Season Spotlight</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C] dark:text-[#F4F1ED] lg:text-3xl">{{ currentSlide.title }}</h3>
                <p class="mt-4 text-sm leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] lg:text-base">{{ currentSlide.description }}</p>
                
                <div class="mt-8 flex flex-wrap gap-4">
                  <a [routerLink]="currentSlide.route" class="rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] dark:hover:bg-[#DD8776]">View Collection</a>
                  <a routerLink="/contact" class="rounded-full border border-[#57251C]/35 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#251F1C] px-7 py-3.5 text-xs sm:text-sm font-bold text-[#57251C] dark:text-[#F4F1ED] transition hover:bg-[#F7F6F3] dark:hover:bg-[#322924]">Contact Studio</a>
                </div>

                <!-- Slide Indicators -->
                <div class="mt-8 flex gap-2">
                  <button 
                    *ngFor="let slide of topOfferSlides; let index = index" 
                    type="button" 
                    (click)="goToSlide(index)" 
                    class="h-2 rounded-full transition-all duration-300" 
                    [class.w-8]="activeSlideIndex === index" 
                    [class.w-2]="activeSlideIndex !== index" 
                    [class.bg-[#57251C]]="activeSlideIndex === index" 
                    [class.dark:bg-[#EB9D8E]]="activeSlideIndex === index"
                    [class.bg-[#D9C3B9]]="activeSlideIndex !== index" 
                    [class.dark:bg-[#3D302A]]="activeSlideIndex !== index"
                    [attr.aria-label]="'Go to slide ' + (index + 1)"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CATEGORIES BROWSER (EDITORIAL DARK SECTION) -->
      <section class="bg-[#57251C] py-14 md:py-20 text-[#FFFDFC]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <span class="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#EB9D8E] border border-white/15">
              The RMS Catalog
            </span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFDFC]">Browse by Category</h2>
            <p class="mt-3 text-sm leading-relaxed text-[#D9C3B9]">Explore our specialized hamper lines crafted for every occasion.</p>
          </div>

          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <a 
              *ngFor="let cat of displayCategories" 
              [routerLink]="cat.route" 
              class="group relative overflow-hidden rounded-3xl border border-[#D9C3B9]/20 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-[#DD8776]/50 hover:bg-white/10"
            >
              <div class="overflow-hidden rounded-2xl">
                <img [src]="cat.image" [alt]="cat.name" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div class="mt-6 flex items-center justify-between">
                <h3 class="font-serif text-xl font-bold text-[#FFFDFC]">{{ cat.name }}</h3>
                <span *ngIf="cat.badge" class="rounded-full bg-[#C56D5B] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  {{ cat.badge }}
                </span>
              </div>
              <p class="mt-2 text-xs leading-relaxed text-[#D9C3B9] line-clamp-2">{{ cat.description }}</p>
              <span class="mt-4 inline-flex items-center text-xs font-bold text-[#DD8776] group-hover:underline">Explore Collection &rarr;</span>
            </a>
          </div>

          <!-- Custom Consult Banner -->
          <div class="mt-14 grid items-center gap-8 rounded-[2.5rem] border border-[#D9C3B9]/25 bg-gradient-to-r from-[#9C4738]/30 via-[#57251C]/60 to-[#9C4738]/20 p-8 lg:grid-cols-12 lg:p-12">
            <div class="lg:col-span-9">
              <span class="rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#EB9D8E] border border-white/15">Build Your Own Hamper Studio</span>
              <h3 class="mt-4 font-serif text-2xl font-bold text-[#FFFDFC] lg:text-3xl">Design your personalized gift hamper with live simulation</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#D9C3B9]">Choose your favorite catalogue goodies, request custom non-catalogue items with reference photos, preview your hamper composition in real time, and request a personalized quotation from our team.</p>
              <a 
                routerLink="/build-hamper" 
                class="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFFDFC] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#57251C] shadow-xl transition-all duration-300 hover:bg-[#F7F6F3] hover:scale-105 cursor-pointer"
              >
                <i class="fa-solid fa-wand-magic-sparkles text-lg text-[#9C4738]"></i>
                <span>Launch Hamper Studio &rarr;</span>
              </a>
            </div>
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
  public readonly checkoutService = inject(CheckoutService);
  public readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);

  seasonalBanner: {
    id: number;
    badge: string;
    title: string;
    description: string;
    route: string;
    buttonText: string;
    icon: string;
  } | null = null;

  bestsellers: any[] = [];
  displayCategories: any[] = [];

  topOfferSlides: {
    title: string;
    description: string;
    image: string;
    route: string;
  }[] = [];

  addBestsellerToCart(prod: any) {
    this.cartService.addToCart({
      id: `prod-${prod.id}`,
      productId: prod.id,
      title: prod.name,
      price: prod.price,
      image: prod.image,
      category: prod.category
    }, 1);
  }

  ngOnInit() {
    this.startAutoRotate();
    this.seo.setPageMetadata({
      title: 'Custom Gift Hampers for Every Occasion',
      description: 'Discover beautiful custom gift hampers for birthdays, festivals, anniversaries and special celebrations from RMS Gift Hampers.',
      keywords: 'gift hampers, custom gift hampers, birthday hampers, festival hampers, luxury gifts',
      slug: ''
    });
    this.loadLiveBanners();
    this.loadBestsellers();
    this.loadCategories();
  }

  get currentSlide() {
    return this.topOfferSlides[this.activeSlideIndex] || this.topOfferSlides[0] || {
      title: 'RMS Luxury Hampers',
      description: 'Handcrafted luxury hampers for every celebration.',
      image: 'assets/banners/banner.png',
      route: '/hampers'
    };
  }

  async loadBestsellers() {
    try {
      const [pRes, cRes] = await Promise.all([
        this.supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('id', { ascending: true })
          .limit(8),
        this.supabase
          .from('categories')
          .select('id, name')
      ]);

      const catMap = new Map<number, string>();
      if (cRes.data) {
        cRes.data.forEach((c: any) => catMap.set(Number(c.id), c.name));
      }

      if (pRes.data && pRes.data.length > 0) {
        this.bestsellers = pRes.data.map((p: any) => {
          const price = p.selling_price || p.price || parseInt(p.name.match(/₹(\d+)/)?.[1] || '199', 10);
          return {
            id: p.id,
            name: p.name,
            category: catMap.get(Number(p.category_id)) || 'Gift Hamper',
            price: price,
            originalPrice: Math.round(price * 1.25),
            image: (p.images && p.images[0]) || 'assets/banners/banner.png',
            badge: p.badge || 'Bestseller',
            description: p.description || ''
          };
        });
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadCategories() {
    try {
      const { data } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (data && data.length > 0) {
        this.displayCategories = data.map((c: any) => {
          const lower = c.name.toLowerCase();
          const route = lower.includes('ganpati') ? '/ganpati-hampers' :
                        lower.includes('return gift') ? '/return-gifts' :
                        lower.includes('girl') ? '/hampers/girls-hampers' :
                        lower.includes('boy') ? '/hampers/boys-hampers' :
                        lower.includes('chocolate') ? '/hampers/chocolate-hamper' :
                        lower.includes('friendship') ? '/top-offers/friendship-day' :
                        lower.includes('raksha') ? '/top-offers/rakshabandhan' :
                        '/shop';
          const badge = lower.includes('ganpati') ? 'Festive' :
                        lower.includes('friendship') || lower.includes('raksha') ? 'Seasonal' :
                        lower.includes('girl') || lower.includes('boy') ? 'Bestseller' : '';
          return {
            id: c.id,
            name: c.name,
            image: c.image || 'assets/banners/banner.png',
            description: c.description || 'Artisanal gift hamper curation.',
            route: route,
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
            description: b.name.includes('Ganesh') ? 
              'Ready pooja kits starting from ₹99. Contains Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum & Dry Fruits in a strong partitioned box.' : 
              'Thoughtfully styled hampers for special celebrations and treasured moments.',
            image: b.image || 'assets/banners/banner.png',
            route: b.navigate_to_url_on_click || '/hampers'
          }));
          this.activeSlideIndex = 0;

          // Determine seasonal spotlight banner
          const seasonal = activeBanners.find((b: any) => 
            b.name.toLowerCase().includes('ganesh') || 
            b.name.toLowerCase().includes('ganpati') || 
            b.name.toLowerCase().includes('raksha') || 
            b.name.toLowerCase().includes('friendship') ||
            b.name.toLowerCase().includes('festive')
          );

          if (seasonal) {
            const isGanpati = seasonal.name.toLowerCase().includes('gan');
            const isRakhi = seasonal.name.toLowerCase().includes('raksha');
            this.seasonalBanner = {
              id: seasonal.id,
              badge: isGanpati ? 'Ganesh Utsav Special' : isRakhi ? 'Raksha Bandhan Special' : 'Seasonal Special',
              title: seasonal.name,
              description: isGanpati 
                ? 'Clean pooja items in strong partitioned boxes with zero spilling. Special discounted rates for housing societies!'
                : 'Limited-edition festive specials and heartfelt gift hampers assembled for your celebrations.',
              route: seasonal.navigate_to_url_on_click || '/shop',
              buttonText: isGanpati ? 'View Ganpati Boxes' : 'View Collection',
              icon: isGanpati ? 'fa-om' : isRakhi ? 'fa-hands-holding-child' : 'fa-sparkles'
            };
          } else {
            this.seasonalBanner = null;
          }
        } else {
          this.seasonalBanner = null;
          this.topOfferSlides = [{
            title: 'RMS Luxury Hampers',
            description: 'Handcrafted luxury hampers for every celebration.',
            image: 'assets/banners/banner.png',
            route: '/hampers'
          }];
        }
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    this.stopAutoRotate();
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
    // Reset timer on manual action for smooth experience
    this.stopAutoRotate();
    this.startAutoRotate();
    this.cdr.markForCheck();
  }
}