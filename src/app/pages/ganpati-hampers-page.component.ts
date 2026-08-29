import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';

interface HamperProduct {
  id: string;
  name: string;
  marathiName?: string;
  price: number;
  badge: string;
  badgeClass: string;
  image: string;
  shortDesc: string;
  highlight: string;
  items: { icon: string; name: string; detail: string }[];
  idealFor: string[];
  orderMessage: string;
}

@Component({
  selector: 'app-ganpati-hampers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="ganpati-page-shell">
        
        <!-- FESTIVE HERO SECTION -->
        <section class="relative overflow-hidden bg-gradient-to-b from-[#fff7ed] via-[#fff1f2] to-white py-12 md:py-20">
          <!-- Ambient Festive Glow Elements -->
          <div class="pointer-events-none absolute -top-28 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-200/35 blur-3xl"></div>
          <div class="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl"></div>
          <div class="pointer-events-none absolute bottom-0 -left-20 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl"></div>

          <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl text-center">
              
              <!-- Shloka / Auspicious Badge -->
              <div class="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-white/90 px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide text-amber-800 shadow-sm backdrop-blur-md">
                <span class="text-base">🌺</span>
                <span>श्री गणेशाय नमः • गणपती बाप्पा मोरया</span>
                <span class="text-base">🪔</span>
              </div>

              <!-- Main Headline -->
              <h1 class="mt-6 text-3xl font-extrabold tracking-tight text-[#432c2c] sm:text-5xl lg:text-6xl">
                Ready Ganpati Pooja Kits <br class="hidden sm:inline" />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600">
                  Starting at just ₹99!
                </span>
              </h1>

              <!-- Subtitle -->
              <p class="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#6d4d4d] sm:text-lg">
                All essential pooja items neatly packed in one clean box. No rushing around to different shops on pooja day. Ready to use for Bappa's welcoming and daily aarti!
              </p>

              <!-- Trust Pillars -->
              <div class="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-[#7c5140]">
                <span class="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50/80 px-3.5 py-1.5 shadow-sm">
                  ✨ 100% Clean & Pure Items
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50/80 px-3.5 py-1.5 shadow-sm">
                  📦 Separate Pockets (No Spilling)
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50/80 px-3.5 py-1.5 shadow-sm">
                  ⚡ Quick Delivery Before Ganpati
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1.5 shadow-sm">
                  🤝 Special Discounts for Societies
                </span>
              </div>

              <!-- Quick CTAs -->
              <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a 
                  href="#hamper-selection" 
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  <span>🎁 View ₹99 & ₹149 Boxes</span>
                  <span>↓</span>
                </a>

                <button 
                  type="button" 
                  (click)="openDirectWhatsapp('General Inquiry')"
                  class="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/80 bg-emerald-500 px-8 py-4 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-600 hover:scale-105 active:scale-95"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.551 4.195 1.597 6.02L.055 24l6.105-1.602c1.745.952 3.712 1.455 5.871 1.455 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm3.896 17.266c-.183.513-1.045.962-1.464 1.002-.42.04-1.001.077-2.923-.717-2.316-.957-3.805-3.32-3.921-3.475-.116-.155-.936-1.246-.936-2.378 0-1.132.585-1.688.794-1.921.209-.233.456-.291.608-.291.152 0 .304 0 .436.007.14.008.33.025.517.47.195.467.666 1.632.724 1.748.058.116.097.252.019.408-.078.155-.116.252-.233.388-.116.136-.245.298-.348.396-.115.109-.239.229-.107.457.132.228.588.973 1.259 1.573.864.773 1.603 1.012 1.832 1.127.228.116.363.097.498-.058.136-.155.585-.68.74-.913.155-.233.228-.155.443.058.558.214.724.348 1.267.504 1.344.155.077.33.078.503-.131z"/>
                  </svg>
                  <span>Order on WhatsApp (Fast Reply)</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- 9:16 VERTICAL VIDEO REEL SHOWCASE SECTION -->
        <section class="relative bg-gradient-to-b from-white via-[#fff9f5] to-[#fff2ea] py-12 md:py-18 border-y border-amber-100">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid items-center gap-12 lg:grid-cols-12">
              
              <!-- Left: Video Frame (9:16 Portrait Reel) -->
              <div class="lg:col-span-5 flex justify-center">
                <div class="relative w-full max-w-[320px] sm:max-w-[340px]">
                  
                  <!-- Golden Aura & Decorative Outer Frame -->
                  <div class="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 opacity-40 blur-xl"></div>
                  
                  <!-- Phone / Reel Container -->
                  <div class="relative overflow-hidden rounded-[2.2rem] border-[6px] border-amber-900/90 bg-black shadow-2xl">
                    
                    <!-- Top Reel Status Indicator -->
                    <div class="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                        <span class="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        LIVE PACKAGING DEMO
                      </span>
                      <span class="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        9:16 REEL
                      </span>
                    </div>

                    <!-- Video Element -->
                    <div class="relative aspect-[9/16] w-full bg-black flex items-center justify-center">
                      <video 
                        #videoPlayer 
                        src="assets/ganpati-pooja-kit-hamper-2026/the_box_should_be_strictly_lik.mp4" 
                        playsinline 
                        loop 
                        [muted]="isVideoMuted" 
                        (click)="togglePlayPause()"
                        class="h-full w-full object-cover cursor-pointer"
                      ></video>

                      <!-- Center Play Overlay Button when paused -->
                      <button 
                        *ngIf="!isVideoPlaying"
                        type="button"
                        (click)="togglePlayPause()"
                        class="absolute inset-0 flex items-center justify-center bg-black/30 transition-all hover:bg-black/20"
                        aria-label="Play video"
                      >
                        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-orange-600 shadow-xl transition-transform hover:scale-110">
                          ▶
                        </div>
                      </button>
                    </div>

                    <!-- Reel Bottom Controls Bar -->
                    <div class="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between rounded-xl bg-black/65 px-3 py-2 text-white backdrop-blur-md">
                      <button 
                        type="button" 
                        (click)="togglePlayPause()" 
                        class="text-xs font-semibold hover:text-amber-400 transition"
                      >
                        {{ isVideoPlaying ? '⏸ Pause' : '▶ Play' }}
                      </button>

                      <button 
                        type="button" 
                        (click)="toggleMute()" 
                        class="text-xs font-semibold hover:text-amber-400 transition flex items-center gap-1"
                      >
                        <span>{{ isVideoMuted ? '🔇 Unmute' : '🔊 Sound On' }}</span>
                      </button>

                      <button 
                        type="button" 
                        (click)="requestFullscreen()" 
                        class="text-xs font-semibold hover:text-amber-400 transition"
                        title="Fullscreen"
                      >
                        ⛶ Full
                      </button>
                    </div>

                  </div>

                  <!-- Badge Below Reel -->
                  <p class="mt-3 text-center text-xs font-medium text-amber-800">
                    📹 Real box video • What you see is what you get!
                  </p>
                </div>
              </div>

              <!-- Right: Content & Why The Packaging Matters -->
              <div class="lg:col-span-7">
                <div class="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-semibold text-orange-700">
                  <span>✨ Neat & Strong Box Packing</span>
                </div>

                <h2 class="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#432c2c]">
                  See How Clean It Is Packed: <br />
                  <span class="text-orange-600">Nothing Spills, Nothing Breaks</span>
                </h2>

                <p class="mt-4 text-base leading-relaxed text-[#6d4d4d]">
                  In this 10-second video, watch how every item has its own separate pocket inside the box. Halad and kumkum will not spill or mix with other items, and batti will not break. Clean, neat, and ready to open for pooja!
                </p>

                <!-- Feature Highlights -->
                <div class="mt-6 space-y-4">
                  <div class="flex items-start gap-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-xl text-amber-700">
                      📦
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-[#432c2c]">Separate Pockets for Each Item</h3>
                      <p class="text-xs text-[#6d4d4d] leading-relaxed">Halad, kumkum, kapoor, and dhup have their own sections so there is zero mess or powder mixing.</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xl text-rose-700">
                      🌸
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-[#432c2c]">Stays Fresh with Nice Fragrance</h3>
                      <p class="text-xs text-[#6d4d4d] leading-relaxed">Pure kapoor and dhup batti stay fresh in sealed pouches with great natural fragrance until you open them for aarti.</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl text-orange-700">
                      🪔
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-[#432c2c]">Perfect Return Gift for Guests</h3>
                      <p class="text-xs text-[#6d4d4d] leading-relaxed">Looks very respectable and thoughtful to gift to guests, relatives, building society members, and mandal visitors.</p>
                    </div>
                  </div>
                </div>

                <!-- CTA Button -->
                <div class="mt-8 flex flex-wrap gap-4">
                  <a 
                    href="#hamper-selection" 
                    class="rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition"
                  >
                    View ₹99 & ₹149 Boxes
                  </a>
                  <button
                    type="button"
                    (click)="openDirectWhatsapp('Box Quality Inquiry')"
                    class="rounded-full border border-amber-300 bg-white px-7 py-3 text-sm font-bold text-amber-800 shadow-sm hover:bg-amber-50 transition"
                  >
                    Ask Us on WhatsApp
                  </button>
                </div>

              </div>

            </div>
          </div>
        </section>

        <!-- THE 2 CORE HAMPER OPTIONS (DETAILED SHOWCASE) -->
        <section id="hamper-selection" class="py-14 md:py-22 bg-white">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="mx-auto max-w-3xl text-center">
              <span class="rounded-full bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 border border-rose-100">
                Ganesh Utsav Specials
              </span>
              <h2 class="mt-3 text-3xl font-extrabold tracking-tight text-[#432c2c] sm:text-4xl">
                Choose Your Ganpati Box
              </h2>
              <p class="mt-3 text-sm leading-relaxed text-[#6d4d4d] sm:text-base">
                Choose between our ₹99 Essential Kit and ₹149 Deluxe Box with Dry Fruits. Both are clean, ready to use, and packed with care.
              </p>
            </div>

            <!-- Products Comparison Cards Grid -->
            <div class="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch">
              
              <!-- PRODUCT 1: ₹99 POOJA KIT -->
              <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-amber-200/90 bg-gradient-to-b from-white to-[#fffaf4] p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-amber-400">
                <div>
                  
                  <!-- Badge & Price Header -->
                  <div class="flex items-center justify-between">
                    <span class="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-800">
                      Essential Pooja Kit
                    </span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-xs font-semibold text-slate-400 uppercase">Only</span>
                      <span class="text-3xl font-extrabold text-amber-700">₹99</span>
                    </div>
                  </div>

                  <!-- Product Image with Zoom Action -->
                  <div 
                    class="mt-6 relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50 cursor-pointer"
                    (click)="openLightbox(products[0])"
                  >
                    <img 
                      [src]="products[0].image" 
                      [alt]="products[0].name" 
                      class="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                      <span class="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#432c2c] shadow">
                        🔍 Click to see photo
                      </span>
                    </div>
                  </div>

                  <!-- Product Title & Highlights -->
                  <h3 class="mt-6 text-2xl font-bold text-[#432c2c]">
                    {{ products[0].name }}
                  </h3>
                  <p class="mt-2 text-sm text-[#6d4d4d] leading-relaxed">
                    {{ products[0].shortDesc }}
                  </p>

                  <!-- Included Items Checklist -->
                  <div class="mt-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-amber-900">Items inside the box:</h4>
                    <ul class="mt-3 space-y-2.5">
                      <li *ngFor="let item of products[0].items" class="flex items-center gap-2.5 text-xs sm:text-sm text-[#5a3f3f]">
                        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs">{{ item.icon }}</span>
                        <span class="font-semibold">{{ item.name }}:</span>
                        <span class="text-slate-600">{{ item.detail }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Ideal For Pills -->
                  <div class="mt-6 border-t border-amber-100 pt-4">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Best used for:</span>
                    <div class="mt-2 flex flex-wrap gap-1.5">
                      <span *ngFor="let use of products[0].idealFor" class="rounded-md bg-white border border-amber-200/80 px-2.5 py-1 text-xs text-[#6d4d4d]">
                        {{ use }}
                      </span>
                    </div>
                  </div>

                </div>

                <!-- Action Button -->
                <div class="mt-8 pt-4">
                  <a 
                    [href]="getWhatsappUrl(products[0].orderMessage)" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(products[0].name, 'Ganpati Hampers', products[0].price)"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-6 py-4 text-sm font-bold text-white shadow-md hover:bg-amber-700 hover:shadow-lg transition-all active:scale-95"
                  >
                    <span>💬 Order ₹99 Box on WhatsApp</span>
                  </a>
                </div>

              </div>

              <!-- PRODUCT 2: ₹149 DELUXE POOJA KIT + DRY FRUITS -->
              <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-2 border-rose-300 bg-gradient-to-b from-white via-[#fff8f9] to-[#fff0f3] p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-rose-500">
                
                <!-- "Most Loved" Top Banner Strip -->
                <div class="absolute top-0 right-0 bg-gradient-to-l from-rose-600 to-pink-600 px-5 py-1 text-[11px] font-bold tracking-wider text-white uppercase rounded-bl-xl shadow-sm">
                  ★ Most Popular Choice
                </div>

                <div>
                  <!-- Badge & Price Header -->
                  <div class="flex items-center justify-between">
                    <span class="rounded-full bg-rose-100 px-3.5 py-1 text-xs font-bold text-rose-800">
                      Deluxe Pooja Kit + Dry Fruits
                    </span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-xs font-semibold text-slate-400 uppercase">Only</span>
                      <span class="text-3xl font-extrabold text-rose-600">₹149</span>
                    </div>
                  </div>

                  <!-- Product Image with Zoom Action -->
                  <div 
                    class="mt-6 relative overflow-hidden rounded-2xl border border-rose-200 bg-rose-50 cursor-pointer"
                    (click)="openLightbox(products[1])"
                  >
                    <img 
                      [src]="products[1].image" 
                      [alt]="products[1].name" 
                      class="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                      <span class="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#432c2c] shadow">
                        🔍 Click to see photo
                      </span>
                    </div>
                  </div>

                  <!-- Product Title & Highlights -->
                  <h3 class="mt-6 text-2xl font-bold text-[#432c2c]">
                    {{ products[1].name }}
                  </h3>
                  <p class="mt-2 text-sm text-[#6d4d4d] leading-relaxed">
                    {{ products[1].shortDesc }}
                  </p>

                  <!-- Included Items Checklist -->
                  <div class="mt-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-rose-900">Items inside the box:</h4>
                    <ul class="mt-3 space-y-2.5">
                      <li *ngFor="let item of products[1].items" class="flex items-center gap-2.5 text-xs sm:text-sm text-[#5a3f3f]">
                        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs">{{ item.icon }}</span>
                        <span class="font-semibold">{{ item.name }}:</span>
                        <span class="text-slate-600">{{ item.detail }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Ideal For Pills -->
                  <div class="mt-6 border-t border-rose-100 pt-4">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Best used for:</span>
                    <div class="mt-2 flex flex-wrap gap-1.5">
                      <span *ngFor="let use of products[1].idealFor" class="rounded-md bg-white border border-rose-200/80 px-2.5 py-1 text-xs text-[#6d4d4d]">
                        {{ use }}
                      </span>
                    </div>
                  </div>

                </div>

                <!-- Action Button -->
                <div class="mt-8 pt-4">
                  <a 
                    [href]="getWhatsappUrl(products[1].orderMessage)" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(products[1].name, 'Ganpati Hampers', products[1].price)"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-700 hover:shadow-xl transition-all active:scale-95"
                  >
                    <span>💬 Order ₹149 Box on WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        </section>

        <!-- INTERACTIVE BULK & QUANTITY CALCULATOR (ORDER ASSISTANT) -->
        <section class="py-12 md:py-16 bg-[#fffaf5] border-y border-amber-100">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl rounded-[2.5rem] border border-amber-200/80 bg-white p-6 sm:p-10 shadow-xl">
              
              <div class="text-center">
                <span class="rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-800">
                  Easy Price Calculator
                </span>
                <h3 class="mt-3 text-2xl sm:text-3xl font-extrabold text-[#432c2c]">
                  Check Your Total & Order
                </h3>
                <p class="mt-2 text-xs sm:text-sm text-[#6d4d4d]">
                  Select how many boxes you need. We will calculate the total and help you order directly on WhatsApp!
                </p>
              </div>

              <!-- Counter Inputs -->
              <div class="mt-8 grid gap-6 sm:grid-cols-2">
                
                <!-- Qty for ₹99 Kit -->
                <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-bold text-sm text-[#432c2c]">₹99 Essential Pooja Kit</h4>
                      <p class="text-[11px] text-slate-500">Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad & Kumkum</p>
                    </div>
                    <span class="font-extrabold text-amber-700 text-lg">₹99</span>
                  </div>

                  <div class="mt-4 flex items-center justify-between">
                    <span class="text-xs font-semibold text-slate-600">Quantity:</span>
                    <div class="flex items-center gap-3">
                      <button 
                        type="button" 
                        (click)="decrementQty('qty99')"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-300 font-bold text-slate-700 shadow-sm hover:bg-slate-100 active:scale-95"
                      >
                        -
                      </button>
                      <span class="w-8 text-center font-bold text-base text-slate-900">{{ qty99 }}</span>
                      <button 
                        type="button" 
                        (click)="incrementQty('qty99')"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white font-bold shadow-sm hover:bg-amber-600 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Qty for ₹149 Deluxe Kit -->
                <div class="rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-bold text-sm text-[#432c2c]">₹149 Deluxe Hamper</h4>
                      <p class="text-[11px] text-rose-600">All 6 Essentials + Premium Dry Fruits Box</p>
                    </div>
                    <span class="font-extrabold text-rose-600 text-lg">₹149</span>
                  </div>

                  <div class="mt-4 flex items-center justify-between">
                    <span class="text-xs font-semibold text-slate-600">Quantity:</span>
                    <div class="flex items-center gap-3">
                      <button 
                        type="button" 
                        (click)="decrementQty('qty149')"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-300 font-bold text-slate-700 shadow-sm hover:bg-slate-100 active:scale-95"
                      >
                        -
                      </button>
                      <span class="w-8 text-center font-bold text-base text-slate-900">{{ qty149 }}</span>
                      <button 
                        type="button" 
                        (click)="incrementQty('qty149')"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white font-bold shadow-sm hover:bg-rose-600 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Optional Customer Inputs -->
              <div class="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">Your Name (Optional):</label>
                  <input 
                    type="text" 
                    [(ngModel)]="customerName" 
                    placeholder="e.g. Rahul Sharma"
                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-slate-700 mb-1">City / Society Name (Optional):</label>
                  <input 
                    type="text" 
                    [(ngModel)]="customerLocation" 
                    placeholder="e.g. Mumbai / Sunrise Apartments"
                    class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <!-- Calculation Summary -->
              <div class="mt-6 rounded-2xl bg-amber-50/80 p-5 border border-amber-200">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-amber-900 font-medium">Estimated Total ({{ totalQuantity }} Boxes)</p>
                    <p *ngIf="totalQuantity >= 10" class="text-[11px] text-emerald-700 font-bold mt-0.5">
                      🎉 Bulk order! Special discounted rates will apply on WhatsApp!
                    </p>
                  </div>
                  <span class="text-2xl sm:text-3xl font-extrabold text-amber-900">₹{{ calculatedTotal }}</span>
                </div>
              </div>

              <!-- Order via WhatsApp Action Button -->
              <div class="mt-6">
                <a 
                  [href]="customOrderWhatsappUrl" 
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="trackOrder('Calculated Ganpati Order', 'Ganpati Calculator', calculatedTotal)"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-600 hover:shadow-xl active:scale-95"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.551 4.195 1.597 6.02L.055 24l6.105-1.602c1.745.952 3.712 1.455 5.871 1.455 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm3.896 17.266c-.183.513-1.045.962-1.464 1.002-.42.04-1.001.077-2.923-.717-2.316-.957-3.805-3.32-3.921-3.475-.116-.155-.936-1.246-.936-2.378 0-1.132.585-1.688.794-1.921.209-.233.456-.291.608-.291.152 0 .304 0 .436.007.14.008.33.025.517.47.195.467.666 1.632.724 1.748.058.116.097.252.019.408-.078.155-.116.252-.233.388-.116.136-.245.298-.348.396-.115.109-.239.229-.107.457.132.228.588.973 1.259 1.573.864.773 1.603 1.012 1.832 1.127.228.116.363.097.498-.058.136-.155.585-.68.74-.913.155-.233.228-.155.443.058.558.214.724.348 1.267.504 1.344.155.077.33.078.503-.131z"/>
                  </svg>
                  <span>Send Order Directly to WhatsApp</span>
                </a>
              </div>

            </div>
          </div>
        </section>

        <!-- SOCIETY & MANDAL BULK ORDERS BANNER -->
        <section class="py-12 md:py-16 bg-gradient-to-r from-amber-900 via-[#451a03] to-[#431407] text-white">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid items-center gap-8 lg:grid-cols-12">
              
              <div class="lg:col-span-8">
                <span class="inline-block rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 border border-amber-500/30">
                  Housing Societies • Ganesh Mandals • Offices
                </span>
                <h3 class="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
                  Ordering in Bulk for Your Society or Mandal?
                </h3>
                <p class="mt-3 text-sm sm:text-base leading-relaxed text-amber-100/80">
                  Planning Ganpati return gifts for your society residents, visiting devotees, or office staff? We provide special discount prices on 10+ boxes with quick on-time delivery. We can also add your society or company name sticker on the box!
                </p>
                <div class="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-amber-200">
                  <span>✓ 10+ Boxes: Special Discounted Rate</span>
                  <span>✓ 50+ Boxes: Extra Bulk Savings</span>
                  <span>✓ 100+ Boxes: Society Name Sticker on Box</span>
                </div>
              </div>

              <div class="lg:col-span-4 lg:flex lg:justify-end">
                <button
                  type="button"
                  (click)="openDirectWhatsapp('Bulk Society Order for Ganpati')"
                  class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 text-sm font-bold text-slate-900 shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <span>💬 Ask for Society Discount on WhatsApp</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- DEVOTEE FAQS SECTION -->
        <section class="py-12 md:py-16 bg-white">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div class="text-center">
              <span class="rounded-full bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600">
                Got Questions?
              </span>
              <h2 class="mt-3 text-2xl sm:text-3xl font-extrabold text-[#432c2c]">
                Frequently Asked Questions
              </h2>
              <p class="mt-2 text-xs sm:text-sm text-slate-500">
                Everything you need to know about our Ganpati pooja boxes
              </p>
            </div>

            <div class="mt-10 space-y-4">
              
              <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <h4 class="font-bold text-sm sm:text-base text-[#432c2c]">
                  Q: Will the boxes reach before Ganesh Chaturthi?
                </h4>
                <p class="mt-2 text-xs sm:text-sm text-[#6d4d4d] leading-relaxed">
                  Yes! We pack and dispatch quickly so it reaches your home in time. Please order 2 to 3 days in advance so there is no last-minute festival rush.
                </p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <h4 class="font-bold text-sm sm:text-base text-[#432c2c]">
                  Q: What dry fruits are inside the ₹149 Deluxe Box?
                </h4>
                <p class="mt-2 text-xs sm:text-sm text-[#6d4d4d] leading-relaxed">
                  It comes with a clean, clear plastic box with good quality Kaju (Cashews), Badam (Almonds), and Manuka (Raisins) — ready to offer as Prasad to Bappa.
                </p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <h4 class="font-bold text-sm sm:text-base text-[#432c2c]">
                  Q: Will Halad and Kumkum spill inside the box?
                </h4>
                <p class="mt-2 text-xs sm:text-sm text-[#6d4d4d] leading-relaxed">
                  No! Each item is packed in separate sealed plastic pouches and placed in separate box pockets (just like shown in our video). Nothing spills or mixes together.
                </p>
              </div>

              <div class="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <h4 class="font-bold text-sm sm:text-base text-[#432c2c]">
                  Q: How do I order and pay?
                </h4>
                <p class="mt-2 text-xs sm:text-sm text-[#6d4d4d] leading-relaxed">
                  Click any "Order on WhatsApp" button, tell us how many boxes you need, share your delivery address, and pay easily via Google Pay, PhonePe, or UPI.
                </p>
              </div>

            </div>

          </div>
        </section>

        <!-- LIGHTBOX PREVIEW MODAL -->
        <div 
          *ngIf="activeLightboxProduct" 
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-opacity duration-300"
          (click)="closeLightbox()"
        >
          <div class="relative max-w-4xl w-full overflow-hidden rounded-3xl bg-white p-2 shadow-2xl" (click)="$event.stopPropagation()">
            
            <button 
              type="button" 
              (click)="closeLightbox()" 
              class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-lg font-bold text-white transition hover:bg-black"
              aria-label="Close Preview"
            >
              ✕
            </button>
            
            <div class="grid gap-0 lg:grid-cols-12">
              <div class="lg:col-span-7 bg-amber-50 flex items-center justify-center overflow-hidden rounded-2xl p-2">
                <img 
                  [src]="activeLightboxProduct.image" 
                  [alt]="activeLightboxProduct.name" 
                  class="max-h-[80vh] w-full object-contain" 
                />
              </div>

              <div class="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                <div>
                  <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    {{ activeLightboxProduct.badge }}
                  </span>
                  
                  <div class="mt-4 flex items-baseline gap-2">
                    <h3 class="text-2xl font-extrabold text-[#432c2c]">{{ activeLightboxProduct.name }}</h3>
                    <span class="text-2xl font-bold text-rose-600">₹{{ activeLightboxProduct.price }}</span>
                  </div>

                  <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#6d4d4d]">
                    {{ activeLightboxProduct.shortDesc }}
                  </p>

                  <div class="mt-4">
                    <h5 class="text-xs font-bold uppercase text-slate-500">Items inside the box:</h5>
                    <ul class="mt-2 space-y-1.5">
                      <li *ngFor="let it of activeLightboxProduct.items" class="text-xs text-slate-700 flex items-center gap-2">
                        <span>{{ it.icon }}</span>
                        <strong>{{ it.name }}</strong> ({{ it.detail }})
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-6 pt-4 border-t border-slate-100">
                  <a 
                    [href]="getWhatsappUrl(activeLightboxProduct.orderMessage)" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(activeLightboxProduct.name, 'Ganpati Lightbox', activeLightboxProduct.price)" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-emerald-600 active:scale-95"
                  >
                    <span>💬 Order This Box on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </app-site-layout>
  `
})
export class GanpatiHampersPageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('videoPlayer') videoPlayerRef?: ElementRef<HTMLVideoElement>;

  isVideoPlaying = false;
  isVideoMuted = true;
  activeLightboxProduct: HamperProduct | null = null;

  // Quantity calculator state
  qty99 = 1;
  qty149 = 1;
  customerName = '';
  customerLocation = '';

  products: HamperProduct[] = [
    {
      id: 'pooja-kit-99',
      name: 'Ganpati Essential Pooja Kit (₹99)',
      marathiName: 'गणपती पूजा साहित्य किट',
      price: 99,
      badge: 'Essential Pooja Kit',
      badgeClass: 'bg-amber-100 text-amber-800',
      image: 'assets/ganpati-pooja-kit-hamper-2026/99_hamper.png',
      shortDesc: 'All 6 essential pooja items neatly arranged in a strong, clean box. Ready to use for home aarti and return gifts.',
      highlight: 'Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad & Kumkum',
      items: [
        { icon: '🌿', name: 'Dhup (धूप)', detail: 'Good quality dhoop for pooja' },
        { icon: '🕯️', name: 'Kapoor (कापूर)', detail: 'Pure kapoor tablets for daily aarti' },
        { icon: '🪔', name: 'Kapus Vaat (कापूस वात)', detail: 'Clean cotton wicks for diya' },
        { icon: '🌸', name: 'Dhup Batti (धूप बत्ती)', detail: 'Aromatic incense sticks' },
        { icon: '🟡', name: 'Halad (हळद)', detail: 'Pure puja haldi powder' },
        { icon: '🔴', name: 'Kumkum (कुंकू)', detail: 'Pure puja kumkum / roli' }
      ],
      idealFor: ['Daily Home Aarti', 'Return Gift for Guests', 'Society Distribution', 'Temple Offerings'],
      orderMessage: 'Hello RMS Gift Hampers! I want to order the Ganpati Essential Pooja Kit (₹99) containing Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad & Kumkum.'
    },
    {
      id: 'deluxe-hamper-149',
      name: 'Ganpati Pooja Kit + Dry Fruits (₹149)',
      marathiName: 'गणपती पूजा किट + ड्रायफ्रूट्स',
      price: 149,
      badge: 'Deluxe Hamper + Dry Fruits',
      badgeClass: 'bg-rose-100 text-rose-800',
      image: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
      shortDesc: 'All 6 essential pooja items PLUS a separate clear box of Kaju, Badam & Manuka for Prasad.',
      highlight: '6 Pooja Items + Kaju, Badam & Manuka Box',
      items: [
        { icon: '🌿', name: 'Dhup (धूप)', detail: 'Good quality dhoop for pooja' },
        { icon: '🕯️', name: 'Kapoor (कापूर)', detail: 'Pure kapoor tablets for daily aarti' },
        { icon: '🪔', name: 'Kapus Vaat (कापूस वात)', detail: 'Clean cotton wicks for diya' },
        { icon: '🌸', name: 'Dhup Batti (धूप बत्ती)', detail: 'Aromatic incense sticks' },
        { icon: '🟡', name: 'Halad (हळद)', detail: 'Pure puja haldi powder' },
        { icon: '🔴', name: 'Kumkum (कुंकू)', detail: 'Pure puja kumkum / roli' },
        { icon: '🥜', name: 'Dry Fruits Box', detail: 'Clean sealed box of Kaju (Cashews), Badam (Almonds) & Manuka (Raisins)' }
      ],
      idealFor: ['Prasad & Naivedya', 'Special Family & Relative Gifts', 'Society & Mandal Dignitaries', 'Office Festive Gifts'],
      orderMessage: 'Hello RMS Gift Hampers! I want to order the Ganpati Deluxe Pooja Kit & Dry Fruits Hamper (₹149) containing Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum & Dry Fruits.'
    }
  ];

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightboxProduct) {
      this.closeLightbox();
    }
  }

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Ganpati Hampers & Pooja Kits Starting ₹99 | Ganesh Utsav 2026',
      description: 'Order authentic Ganpati Pooja Kits and festive hampers starting at ₹99 and ₹149. Sacred samagri and dry fruits in partitioned spill-proof boxes. Fast delivery across India.',
      keywords: 'ganpati hampers, ganpati pooja kit, ganesh utsav hampers, ganesh chaturthi gifts, pooja samagri box, dry fruit hamper ganpati',
      slug: 'ganpati-hampers'
    });

    if (isPlatformBrowser(this.platformId)) {
      // Try subtle autoplay muted after page render
      setTimeout(() => {
        if (this.videoPlayerRef?.nativeElement) {
          const video = this.videoPlayerRef.nativeElement;
          video.muted = true;
          video.play().then(() => {
            this.isVideoPlaying = true;
          }).catch(() => {
            // Autoplay blocked by browser policy; user can click to play
            this.isVideoPlaying = false;
          });
        }
      }, 500);
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  togglePlayPause() {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        this.isVideoPlaying = true;
      });
    } else {
      video.pause();
      this.isVideoPlaying = false;
    }
  }

  toggleMute() {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    video.muted = !video.muted;
    this.isVideoMuted = video.muted;
  }

  requestFullscreen() {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  }

  incrementQty(field: 'qty99' | 'qty149') {
    if (field === 'qty99') this.qty99++;
    if (field === 'qty149') this.qty149++;
  }

  decrementQty(field: 'qty99' | 'qty149') {
    if (field === 'qty99' && this.qty99 > 0) this.qty99--;
    if (field === 'qty149' && this.qty149 > 0) this.qty149--;
  }

  get totalQuantity(): number {
    return this.qty99 + this.qty149;
  }

  get calculatedTotal(): number {
    return (this.qty99 * 99) + (this.qty149 * 149);
  }

  get customOrderWhatsappUrl(): string {
    let msg = `Hello RMS Gift Hampers! I want to place an order for Ganesh Utsav:\n`;
    if (this.qty99 > 0) {
      msg += `• Essential Pooja Kit (₹99) [Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum]: ${this.qty99} unit(s)\n`;
    }
    if (this.qty149 > 0) {
      msg += `• Deluxe Hamper (₹149) [Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum + Dry Fruits]: ${this.qty149} unit(s)\n`;
    }
    msg += `Total Estimated: ₹${this.calculatedTotal}\n`;
    if (this.customerName.trim()) {
      msg += `Name: ${this.customerName.trim()}\n`;
    }
    if (this.customerLocation.trim()) {
      msg += `Location: ${this.customerLocation.trim()}\n`;
    }
    msg += `Please confirm availability and dispatch details!`;

    return `https://wa.me/919284905118?text=${encodeURIComponent(msg)}`;
  }

  getWhatsappUrl(message: string): string {
    return `https://wa.me/919284905118?text=${encodeURIComponent(message)}`;
  }

  openDirectWhatsapp(topic: string) {
    const url = `https://wa.me/919284905118?text=${encodeURIComponent(`Hello RMS Gift Hampers! I would like to inquire about: ${topic}`)}`;
    this.trackOrder(topic, 'Ganpati Quick WhatsApp', 0);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }

  trackOrder(title: string, category: string, price: number) {
    this.orderTracker.recordOrder({
      title,
      category,
      page: 'Ganpati Hampers Page',
      link: `Price: ₹${price}`
    });
  }

  openLightbox(product: HamperProduct) {
    this.activeLightboxProduct = product;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.activeLightboxProduct = null;
    document.body.style.overflow = '';
  }
}

