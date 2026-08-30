import { Component, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell">
      
      <!-- HERO SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] py-16 md:py-24">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 blur-3xl"></div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid items-center gap-12 lg:grid-cols-12">
            <!-- Left Content Column -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/70 bg-[#FFFDFC]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
                Bespoke Luxury Gifting
              </div>

              <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] sm:text-5xl lg:text-6xl leading-[1.15]">
                Handcrafted Gifts for <br />
                <span class="font-serif italic font-normal text-[#C56D5B] underline decoration-[#EB9D8E] decoration-wavy decoration-1 underline-offset-8">Every Special Moment</span>
              </h1>

              <p class="mt-5 max-w-xl text-base leading-relaxed text-[#57251C]/80 sm:text-lg">
                Thoughtfully assembled gift hampers for birthdays, festive celebrations, and treasured milestones. Made with love and delivered with care.
              </p>

              <!-- CTA Group -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20want%20to%20order%20a%20custom%20hamper." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/15 transition-all duration-300 hover:bg-[#9C4738] hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  <span>💬 Order on WhatsApp</span>
                </a>

                <a 
                  routerLink="/gallery" 
                  class="inline-flex items-center justify-center rounded-full border border-[#57251C]/35 bg-[#FFFDFC]/80 px-8 py-4 text-xs sm:text-sm font-bold text-[#57251C] backdrop-blur-sm transition-all duration-300 hover:border-[#57251C] hover:bg-[#F7F6F3] active:scale-95"
                >
                  <span>Explore Lookbook</span>
                </a>
              </div>

              <!-- Trust Badges -->
              <div class="mt-8 flex flex-wrap gap-2.5 border-t border-[#D9C3B9]/50 pt-5 text-xs font-medium text-[#57251C]/80">
                <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/60 bg-[#FFFDFC] px-3.5 py-1.5 shadow-sm">
                  ✨ 100% Customized Gifting
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/60 bg-[#FFFDFC] px-3.5 py-1.5 shadow-sm">
                  💬 Direct Concierge on WhatsApp
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/60 bg-[#FFFDFC] px-3.5 py-1.5 shadow-sm">
                  🎀 Premium Luxury Packaging
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
                  class="relative h-auto w-full rounded-[2rem] border-8 border-[#FFFDFC] object-cover shadow-2xl transition duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- GANESH UTSAV FESTIVE SPOTLIGHT BANNER -->
      <section class="relative bg-gradient-to-r from-[#57251C] via-[#9C4738] to-[#C56D5B] py-6 text-[#FFFDFC] shadow-md">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4 text-center md:text-left">
              <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-md shadow-sm border border-white/20">
                🌺
              </div>
              <div>
                <span class="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FFFDFC]">
                  Ganesh Utsav 2026 Special
                </span>
                <h2 class="font-serif text-lg sm:text-xl font-bold text-[#FFFDFC] mt-1">
                  Ganpati Pooja Kits & Dry Fruit Hampers Starting at ₹99!
                </h2>
                <p class="text-xs text-[#D9C3B9] mt-0.5">
                  Clean pooja items in strong partitioned boxes with zero spilling. Special discounted rates for housing societies!
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0">
              <a 
                routerLink="/ganpati-hampers" 
                class="inline-flex items-center gap-2 rounded-full bg-[#FFFDFC] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#57251C] shadow-lg hover:bg-[#F7F6F3] hover:scale-105 transition-all active:scale-95"
              >
                <span>View Ganpati Boxes</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- VALUE PROPOSITION GRID -->
      <section class="py-12 md:py-16 bg-[#FFFDFC]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/12 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">
              The RMS Standard
            </span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#57251C]">
              Bespoke, Thoughtful & Seamlessly Ordered
            </h2>
          </div>

          <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div class="group rounded-3xl border border-[#D9C3B9]/40 bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B]/40 hover:shadow-lg">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] text-2xl border border-[#D9C3B9]/40 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#57251C] group-hover:text-white">🎁</div>
              <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C]">Curated Selection</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75">Choose from thoughtfully styled hampers tailored to every recipient and milestone.</p>
            </div>

            <div class="group rounded-3xl border border-[#D9C3B9]/40 bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B]/40 hover:shadow-lg">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] text-2xl border border-[#D9C3B9]/40 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#57251C] group-hover:text-white">💖</div>
              <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C]">Artisanal Finishing</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75">Neat partitioned presentation with satin ribbons, custom tags, and luxury touch.</p>
            </div>

            <div class="group rounded-3xl border border-[#D9C3B9]/40 bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B]/40 hover:shadow-lg">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] text-2xl border border-[#D9C3B9]/40 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#57251C] group-hover:text-white">💬</div>
              <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C]">Direct Concierge</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75">Instant, personalized assistance and customization ideas directly on WhatsApp.</p>
            </div>

            <div class="group rounded-3xl border border-[#D9C3B9]/40 bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#C56D5B]/40 hover:shadow-lg">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7F6F3] text-2xl border border-[#D9C3B9]/40 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#57251C] group-hover:text-white">📦</div>
              <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C]">Safe Delivery</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75">Reliable, secure packaging delivered in pristine condition across Maharashtra & India.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURED SHOWCASE CAROUSEL -->
      <section class="bg-[#F7F6F3] py-12 md:py-16 border-t border-[#D9C3B9]/40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">Seasonal Curation</span>
              <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">Popular Celebrations</h2>
            </div>
            <div class="flex items-center gap-3">
              <button 
                type="button" 
                (click)="prevSlide()" 
                class="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C3B9] bg-[#FFFDFC] text-[#57251C] shadow-sm transition hover:bg-[#57251C] hover:text-[#FFFDFC] active:scale-95"
                aria-label="Previous Slide"
              >
                ←
              </button>
              <button 
                type="button" 
                (click)="nextSlide()" 
                class="flex h-11 w-11 items-center justify-center rounded-full border border-[#D9C3B9] bg-[#FFFDFC] text-[#57251C] shadow-sm transition hover:bg-[#57251C] hover:text-[#FFFDFC] active:scale-95"
                aria-label="Next Slide"
              >
                →
              </button>
            </div>
          </div>

          <!-- Carousel Container -->
          <div class="overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] shadow-xl">
            <div class="grid items-center gap-0 lg:grid-cols-12">
              <div class="relative overflow-hidden lg:col-span-5">
                <img 
                  [src]="topOfferSlides[activeSlideIndex].image" 
                  [alt]="topOfferSlides[activeSlideIndex].title" 
                  class="h-[380px] w-full object-cover transition-all duration-700 ease-out hover:scale-105 lg:h-[460px]" 
                />
              </div>
              <div class="flex flex-col justify-center p-8 lg:col-span-7 lg:p-12">
                <span class="w-fit rounded-full bg-[#C56D5B]/15 px-3 py-1 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">Season Spotlight</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C] lg:text-3xl">{{ topOfferSlides[activeSlideIndex].title }}</h3>
                <p class="mt-4 text-sm leading-relaxed text-[#57251C]/80 lg:text-base">{{ topOfferSlides[activeSlideIndex].description }}</p>
                
                <div class="mt-8 flex flex-wrap gap-4">
                  <a [routerLink]="topOfferSlides[activeSlideIndex].route" class="rounded-full bg-[#57251C] px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738]">View Collection</a>
                  <a href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20to%20check%20the%20latest%20offers." target="_blank" rel="noopener noreferrer" class="rounded-full border border-[#57251C]/35 bg-[#FFFDFC] px-7 py-3.5 text-xs sm:text-sm font-bold text-[#57251C] transition hover:bg-[#F7F6F3]">Inquire on WhatsApp</a>
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
                    [class.bg-[#D9C3B9]]="activeSlideIndex !== index" 
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
            <a routerLink="/girls" class="group relative overflow-hidden rounded-3xl border border-[#D9C3B9]/20 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-[#DD8776]/50 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/hampers/girls_hampers/girls_hamper_199.png" alt="Girls hampers" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 font-serif text-xl font-bold text-[#FFFDFC]">Girls Hampers</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#D9C3B9]">Charming keepsakes, beauty treats, and aesthetic surprises.</p>
              <span class="mt-4 inline-flex items-center text-xs font-bold text-[#DD8776] group-hover:underline">Explore Collection →</span>
            </a>

            <a routerLink="/boys" class="group relative overflow-hidden rounded-3xl border border-[#D9C3B9]/20 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-[#DD8776]/50 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/hampers/boys_hampers/boys_hamper_199.png" alt="Boys hampers" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 font-serif text-xl font-bold text-[#FFFDFC]">Boys Hampers</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#D9C3B9]">Refined essentials, practical keepsakes, and modern styling.</p>
              <span class="mt-4 inline-flex items-center text-xs font-bold text-[#DD8776] group-hover:underline">Explore Collection →</span>
            </a>

            <a routerLink="/hampers" class="group relative overflow-hidden rounded-3xl border border-[#D9C3B9]/20 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-[#DD8776]/50 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/hampers/chocolate_hamper/chocolate.jpeg" alt="Chocolate hampers" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 font-serif text-xl font-bold text-[#FFFDFC]">Gourmet & Chocolates</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#D9C3B9]">Artisanal chocolates, gourmet sweets, and luxury food pairings.</p>
              <span class="mt-4 inline-flex items-center text-xs font-bold text-[#DD8776] group-hover:underline">Explore Collection →</span>
            </a>

            <a routerLink="/return-gifts" class="group relative overflow-hidden rounded-3xl border border-[#D9C3B9]/20 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-[#DD8776]/50 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/return_gift/birthday_return_gift/birthday_return_gift.jpg" alt="Return gifts" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 font-serif text-xl font-bold text-[#FFFDFC]">Event Favours & Return Gifts</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#D9C3B9]">Thoughtful favor bundles for weddings, baby showers & celebrations.</p>
              <span class="mt-4 inline-flex items-center text-xs font-bold text-[#DD8776] group-hover:underline">Explore Favours →</span>
            </a>

            <a routerLink="/gallery" class="group relative overflow-hidden rounded-3xl border border-[#D9C3B9]/20 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-[#DD8776]/50 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/gallery/girls_199.jpeg" alt="Gallery collections" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 font-serif text-xl font-bold text-[#FFFDFC]">Lookbook Gallery</h3>
              <p class="mt-2 text-xs leading-relaxed text-[#D9C3B9]">Real customer photos and completed hamper commissions.</p>
              <span class="mt-4 inline-flex items-center text-xs font-bold text-[#DD8776] group-hover:underline">View Gallery →</span>
            </a>

            <a routerLink="/ganpati-hampers" class="group relative overflow-hidden rounded-3xl border border-[#DD8776]/40 bg-gradient-to-b from-[#9C4738]/40 to-[#57251C]/60 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-[#EB9D8E] hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/ganpati-pooja-kit-hamper-2026/149_hamper.png" alt="Ganpati Hampers" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <div class="mt-6 flex items-center justify-between">
                <h3 class="font-serif text-xl font-bold text-[#FFFDFC]">Ganpati Special Kits</h3>
                <span class="rounded-full bg-[#C56D5B] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">Festive</span>
              </div>
              <p class="mt-2 text-xs leading-relaxed text-[#D9C3B9]">Ready pooja kits & dry fruit boxes starting at ₹99.</p>
              <span class="mt-4 inline-flex items-center text-xs font-bold text-[#EB9D8E] group-hover:underline">View Boxes & Video →</span>
            </a>
          </div>

          <!-- Custom Consult Banner -->
          <div class="mt-14 grid items-center gap-8 rounded-[2.5rem] border border-[#D9C3B9]/25 bg-gradient-to-r from-[#9C4738]/30 via-[#57251C]/60 to-[#9C4738]/20 p-8 lg:grid-cols-12 lg:p-12">
            <div class="lg:col-span-9">
              <span class="rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#EB9D8E] border border-white/15">Bespoke Concierge</span>
              <h3 class="mt-4 font-serif text-2xl font-bold text-[#FFFDFC] lg:text-3xl">Want a custom hamper tailored to your budget?</h3>
              <p class="mt-3 text-sm leading-relaxed text-[#D9C3B9]">Chat with our stylists on WhatsApp. Share your budget, theme, or reference photos, and we will assemble the perfect hamper for you.</p>
              <a 
                href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20a%20custom%20gift%20hamper." 
                target="_blank"
                rel="noopener noreferrer"
                class="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFFDFC] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#57251C] shadow-xl transition-all duration-300 hover:bg-[#F7F6F3] hover:scale-105"
              >
                <span>💬 Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      <!-- SEASONAL HIGHLIGHTS SLIDER -->
      <section class="py-12 md:py-16 bg-[#FAF7F5] border-t border-[#D9C3B9]/40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">Top Offers & Favorites</span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">Trending Hampers This Season</h2>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75">Click any offer below to view details and order directly on WhatsApp.</p>
          </div>

          <div class="relative mt-8">
            <div class="overflow-hidden rounded-[2.5rem] bg-[#FFFDFC] border border-[#D9C3B9]/50 shadow-xl">
              <div 
                *ngFor="let slide of topOfferSlides; let idx = index"
                [class.hidden]="idx !== activeSlideIndex"
                class="grid md:grid-cols-12 items-center"
              >
                <div class="md:col-span-6 p-6 sm:p-10 lg:p-12">
                  <span class="inline-block rounded-full bg-[#C56D5B]/15 border border-[#C56D5B]/25 px-3 py-1 text-xs font-bold text-[#9C4738] mb-4">
                    Season Special
                  </span>
                  <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#57251C] leading-tight">
                    {{ slide.title }}
                  </h3>
                  <p class="mt-4 text-sm leading-relaxed text-[#57251C]/80">
                    {{ slide.description }}
                  </p>
                  <div class="mt-8 flex items-center gap-4">
                    <a 
                      [routerLink]="slide.route"
                      class="inline-flex items-center gap-2 rounded-full bg-[#57251C] px-7 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md hover:bg-[#9C4738] transition"
                    >
                      <span>View Collection</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>
                <div class="md:col-span-6 h-64 md:h-96">
                  <img 
                    [src]="slide.image" 
                    [alt]="slide.title"
                    class="h-full w-full object-cover"
                  />
                </div>
              </div>
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

  topOfferSlides = [
    {
      title: 'Ganesh Utsav Pooja Kits & Hampers',
      description: 'Ready pooja kits starting from ₹99. Contains Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum & Dry Fruits in a strong partitioned box.',
      image: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
      route: '/ganpati-hampers'
    },
    {
      title: 'Friendship Day Collection',
      description: 'Cute and cheerful gift sets with chocolates, goodies, and personalized keepsakes for your best friends.',
      image: 'assets/top_offers/friendship_day/friendship_day_hamper.jpg',
      route: '/top-offers/friendship-day'
    },
    {
      title: 'Rakshabandhan Favorites',
      description: 'Heartfelt hampers with beautiful Rakhis, tasty chocolates, and sweet surprises for brother and sister.',
      image: 'assets/top_offers/rakshabandhan/rakshabandhan_299.jpg',
      route: '/top-offers/rakshabandhan'
    }
  ];

  ngOnInit() {
    this.startAutoRotate();
    this.seo.setPageMetadata({
      title: 'Custom Gift Hampers for Every Occasion',
      description: 'Discover beautiful custom gift hampers for birthdays, festivals, anniversaries and special celebrations from RMS Gift Hampers.',
      keywords: 'gift hampers, custom gift hampers, birthday hampers, festival hampers, luxury gifts',
      slug: ''
    });
  }

  ngOnDestroy() {
    this.stopAutoRotate();
  }

  private startAutoRotate() {
    if (isPlatformBrowser(this.platformId)) {
      this.autoRotateTimer = window.setInterval(() => this.nextSlide(), 6000);
    }
  }

  private stopAutoRotate() {
    if (isPlatformBrowser(this.platformId) && this.autoRotateTimer) {
      window.clearInterval(this.autoRotateTimer);
    }
  }

  nextSlide() {
    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.topOfferSlides.length;
  }

  prevSlide() {
    this.activeSlideIndex = (this.activeSlideIndex - 1 + this.topOfferSlides.length) % this.topOfferSlides.length;
  }

  goToSlide(index: number) {
    this.activeSlideIndex = index;
    // Reset timer on manual action for smooth experience
    this.stopAutoRotate();
    this.startAutoRotate();
  }
}