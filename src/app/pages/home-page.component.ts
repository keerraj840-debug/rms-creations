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
      <section class="relative overflow-hidden bg-gradient-to-b from-[#fdf8fa] via-[#fff5f8] to-white py-16 md:py-24">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl"></div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid items-center gap-12 lg:grid-cols-12">
            <!-- Left Content Column -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                Beautiful Gift Hampers
              </div>

              <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-[#433535] sm:text-4xl lg:text-5xl">
                Gifts for every <br />
                <span class="font-serif italic font-normal text-rose-500 underline decoration-pink-300 decoration-wavy decoration-1 underline-offset-8">special day</span>
              </h1>

              <p class="mt-4 max-w-2xl text-base leading-relaxed text-[#6d4d4d]">
                Thoughtful gift hampers for birthdays, festivals, and happy moments.
              </p>

              <!-- CTA Group -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20want%20to%20order%20a%20custom%20hamper." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/35 active:scale-95"
                >
                  <span class="text-base">💬</span>
                  <span>Order on WhatsApp</span>
                </a>

                <a 
                  routerLink="/gallery" 
                  class="inline-flex items-center justify-center rounded-full border border-rose-300/80 bg-white/60 px-8 py-4 text-sm font-semibold text-rose-700 backdrop-blur-sm transition-all duration-300 hover:border-rose-400 hover:bg-rose-50/80 active:scale-95"
                >
                  See More
                </a>
              </div>

              <!-- Trust Badges -->
              <div class="mt-6 flex flex-wrap gap-2 border-t border-rose-100/80 pt-4">
                <span class="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-white px-3 py-1.5 text-xs font-medium text-[#6d4d4d] shadow-sm">
                  ✨ Easy to customize
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-white px-3 py-1.5 text-xs font-medium text-[#6d4d4d] shadow-sm">
                  💬 Quick chat help
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-white px-3 py-1.5 text-xs font-medium text-[#6d4d4d] shadow-sm">
                  🎀 Beautiful packing
                </span>
              </div>
            </div>

            <!-- Right Visual Column -->
            <div class="relative lg:col-span-5">
              <div class="group relative mx-auto max-w-md lg:max-w-none">
                <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-pink-400 to-rose-300 opacity-30 blur-xl transition duration-500 group-hover:opacity-50"></div>
                <img 
                  src="assets/banners/banner.png" 
                  alt="Gift hamper showcase" 
                  class="relative h-auto w-full rounded-[2rem] border-8 border-white object-cover shadow-2xl transition duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- VALUE PROPOSITION GRID -->
      <section class="py-8 md:py-10 bg-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="rounded-full bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600">Why people choose us</span>
            <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-[#433535] sm:text-3xl">Simple, thoughtful, and easy to order</h2>
          </div>

          <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div class="group rounded-3xl border border-rose-100/80 bg-gradient-to-b from-white to-[#fdf8fa] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100/70 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white">🎁</div>
              <h3 class="mt-4 text-lg font-bold text-[#433535]">Pick what you like</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#6d4d4d]">Choose gifts that match the person and the occasion.</p>
            </div>

            <div class="group rounded-3xl border border-rose-100/80 bg-gradient-to-b from-white to-[#fdf8fa] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100/70 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white">💖</div>
              <h3 class="mt-4 text-lg font-bold text-[#433535]">Beautiful presentation</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#6d4d4d]">Neat packing with a lovely finish that feels special.</p>
            </div>

            <div class="group rounded-3xl border border-rose-100/80 bg-gradient-to-b from-white to-[#fdf8fa] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100/70 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white">💬</div>
              <h3 class="mt-4 text-lg font-bold text-[#433535]">Fast help</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#6d4d4d]">Get quick answers and simple guidance on WhatsApp.</p>
            </div>

            <div class="group rounded-3xl border border-rose-100/80 bg-gradient-to-b from-white to-[#fdf8fa] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl">
              <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100/70 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white">📦</div>
              <h3 class="mt-4 text-lg font-bold text-[#433535]">A lovely surprise</h3>
              <p class="mt-2 text-sm leading-relaxed text-[#6d4d4d]">Every hamper is wrapped so it feels exciting to open.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURED SHOWCASE CAROUSEL -->
      <section class="bg-[#f9f0f3] py-8 md:py-10">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span class="rounded-full bg-rose-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700">Seasonal Curation</span>
              <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-[#433535] sm:text-3xl">Popular Picks</h2>
            </div>
            <div class="flex items-center gap-3">
              <button 
                type="button" 
                (click)="prevSlide()" 
                class="flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-600 shadow-sm transition hover:bg-rose-500 hover:text-white active:scale-95"
                aria-label="Previous Slide"
              >
                ←
              </button>
              <button 
                type="button" 
                (click)="nextSlide()" 
                class="flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-600 shadow-sm transition hover:bg-rose-500 hover:text-white active:scale-95"
                aria-label="Next Slide"
              >
                →
              </button>
            </div>
          </div>

          <!-- Carousel Container -->
          <div class="overflow-hidden rounded-[2.5rem] border border-rose-100 bg-white shadow-2xl">
            <div class="grid items-center gap-0 lg:grid-cols-12">
              <div class="relative overflow-hidden lg:col-span-5">
                <img 
                  [src]="topOfferSlides[activeSlideIndex].image" 
                  [alt]="topOfferSlides[activeSlideIndex].title" 
                  class="h-[380px] w-full object-cover transition-all duration-700 ease-out hover:scale-105 lg:h-[460px]" 
                />
              </div>
              <div class="flex flex-col justify-center p-8 lg:col-span-7 lg:p-12">
                <span class="w-fit rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600 border border-pink-100">Limited Release</span>
                <h3 class="mt-4 text-2xl font-bold text-[#433535] lg:text-3xl">{{ topOfferSlides[activeSlideIndex].title }}</h3>
                <p class="mt-4 text-sm leading-relaxed text-[#6d4d4d] lg:text-base">{{ topOfferSlides[activeSlideIndex].description }}</p>
                
                <div class="mt-8 flex flex-wrap gap-4">
                  <a [routerLink]="topOfferSlides[activeSlideIndex].route" class="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600">View Collection</a>
                  <a href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20to%20check%20the%20latest%20offers." class="rounded-full border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50">Reserve via Chat</a>
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
                    [class.bg-rose-500]="activeSlideIndex === index" 
                    [class.bg-rose-200]="activeSlideIndex !== index" 
                    [attr.aria-label]="'Go to slide ' + (index + 1)"
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CATEGORIES BROWSER -->
      <section class="bg-[#2d2222] py-8 md:py-10 text-white">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">Browse by Category</h2>
            <p class="mt-3 text-sm leading-relaxed text-pink-100/70">Pick a collection and we will help you choose the right gift.</p>
          </div>

          <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <a routerLink="/girls" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-pink-300/40 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/hampers/girls_hampers/girls_hamper_199.png" alt="Girls hampers" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 text-xl font-bold text-white">Girls Hampers</h3>
              <p class="mt-2 text-xs leading-relaxed text-pink-100/70">Charming keepsakes, beauty treats, and aesthetic surprises.</p>
              <span class="mt-4 inline-flex items-center text-xs font-semibold text-pink-300 group-hover:underline">Explore Collection →</span>
            </a>

            <a routerLink="/boys" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-pink-300/40 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/hampers/boys_hampers/boys_hamper_199.png" alt="Boys hampers" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 text-xl font-bold text-white">Boys Hampers</h3>
              <p class="mt-2 text-xs leading-relaxed text-pink-100/70">Refined essentials, tech accessories, and masculine styling.</p>
              <span class="mt-4 inline-flex items-center text-xs font-semibold text-pink-300 group-hover:underline">Explore Collection →</span>
            </a>

            <a routerLink="/hampers" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-pink-300/40 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/hampers/chocolate_hamper/chocolate.jpeg" alt="Chocolate hampers" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 text-xl font-bold text-white">Gourmet & Chocolates</h3>
              <p class="mt-2 text-xs leading-relaxed text-pink-100/70">Artisanal chocolates, gourmet sweets, and luxury food pairings.</p>
              <span class="mt-4 inline-flex items-center text-xs font-semibold text-pink-300 group-hover:underline">Explore Collection →</span>
            </a>

            <a routerLink="/return-gifts" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-pink-300/40 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/return_gift/birthday_return_gift/birthday_return_gift.jpg" alt="Return gifts" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 text-xl font-bold text-white">Event Favours & Return Gifts</h3>
              <p class="mt-2 text-xs leading-relaxed text-pink-100/70">Thoughtful favor bundles for weddings, baby showers & parties.</p>
              <span class="mt-4 inline-flex items-center text-xs font-semibold text-pink-300 group-hover:underline">Explore Favours →</span>
            </a>

            <a routerLink="/gallery" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-pink-300/40 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/gallery/girls_199.jpeg" alt="Gallery collections" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 text-xl font-bold text-white">Lookbook Gallery</h3>
              <p class="mt-2 text-xs leading-relaxed text-pink-100/70">Browse our portfolio of completed bespoke commissions.</p>
              <span class="mt-4 inline-flex items-center text-xs font-semibold text-pink-300 group-hover:underline">View Gallery →</span>
            </a>

            <a routerLink="/top-offers" class="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition duration-500 hover:-translate-y-2 hover:border-pink-300/40 hover:bg-white/10">
              <div class="overflow-hidden rounded-2xl">
                <img src="assets/top_offers/friendship_day/friendship_day_girls.jpg" alt="Top offers" class="h-60 w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <h3 class="mt-6 text-xl font-bold text-white">Festive Specials</h3>
              <p class="mt-2 text-xs leading-relaxed text-pink-100/70">Limited-edition seasonal bundles designed for current holidays.</p>
              <span class="mt-4 inline-flex items-center text-xs font-semibold text-pink-300 group-hover:underline">View Specials →</span>
            </a>
          </div>

          <!-- Custom Consult Banner -->
          <div class="mt-16 grid items-center gap-8 rounded-[2.5rem] border border-rose-300/20 bg-gradient-to-r from-pink-900/30 to-rose-900/20 p-8 lg:grid-cols-12 lg:p-12">
            <div class="lg:col-span-9">
              <span class="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-300 border border-rose-400/20">Tailored Gifts</span>
              <h3 class="mt-4 text-2xl font-bold text-white lg:text-3xl">Have a specific theme or budget in mind?</h3>
              <p class="mt-3 text-sm leading-relaxed text-pink-100/80">Connect with our design team on WhatsApp. Share your reference images or budget limits, and we will assemble tailored options.</p>
              <a 
                href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20a%20custom%20gift%20hamper." 
                target="_blank"
                rel="noopener noreferrer"
                class="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-600 active:scale-95"
              >
                <span>💬 Start Custom Order</span>
              </a>
            </div>
            <div class="overflow-hidden rounded-2xl border border-white/10 lg:col-span-3">
              <img src="assets/top_offers/real_whatsapp_chat.jpg" alt="WhatsApp chat interaction preview" class="w-full object-contain transition duration-500 hover:scale-105" />
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
      title: 'Friendship Day Collection',
      description: 'Bright and cheerful gift sets crafted with aesthetic delights and personalized keepsakes for your closest friends.',
      image: 'assets/top_offers/friendship_day/friendship_day_hamper.jpg',
      route: '/top-offers/friendship-day'
    },
    {
      title: 'Ganpati Special Hamper',
      description: 'Festive gifting curated with traditional elegance, artisanal sweets, and vibrant celebration touches.',
      image: 'assets/top_offers/ganpati/ganpati.jpg',
      route: '/top-offers/ganpati'
    },
    {
      title: 'Rakshabandhan Favorites',
      description: 'Heartfelt hamper concepts designed with custom Rakhis, gourmet chocolates, and personalized tokens.',
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