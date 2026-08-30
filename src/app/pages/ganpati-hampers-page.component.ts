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
        
        <!-- FESTIVE HERO SECTION WITH INTEGRATED 9:16 VIDEO & AUDIO -->
        <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] py-8 md:py-16">
          <!-- Ambient Festive Glow Elements -->
          <div class="pointer-events-none absolute -top-28 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#EB9D8E]/25 blur-3xl"></div>
          <div class="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#DD8776]/20 blur-3xl"></div>
          <div class="pointer-events-none absolute bottom-0 -left-20 h-96 w-96 rounded-full bg-[#C56D5B]/15 blur-3xl"></div>

          <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid items-center gap-8 lg:grid-cols-12">
              
              <!-- Left Column: Title, Subtitle, Trust Badges, Audio & Order CTAs -->
              <div class="lg:col-span-7 text-center lg:text-left">
                
                <!-- Shloka / Auspicious Badge -->
                <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 bg-[#FFFDFC]/90 px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide text-[#9C4738] shadow-sm backdrop-blur-md">
                  <span class="text-base">🌺</span>
                  <span>श्री गणेशाय नमः • गणपती बाप्पा मोरया</span>
                  <span class="text-base">🪔</span>
                </div>

                <!-- Main Headline -->
                <h1 class="mt-4 font-serif text-3xl font-bold tracking-tight text-[#57251C] sm:text-5xl lg:text-6xl leading-[1.15]">
                  Handcrafted Ganpati Pooja Kits <br class="hidden sm:inline" />
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#9C4738] via-[#C56D5B] to-[#57251C]">
                    Starting at Just ₹99!
                  </span>
                </h1>

                <!-- Subtitle -->
                <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 sm:text-lg mx-auto lg:mx-0">
                  All essential pooja items neatly partitioned in one elegant, spill-free box. No rushing to multiple shops on pooja day. Prepared with devotion for Bappa's welcoming and daily aarti.
                </p>

                <!-- Trust Pillars -->
                <div class="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-medium text-[#57251C]/80">
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/70 bg-[#FFFDFC] px-3 py-1.5 shadow-sm">
                    ✨ 100% Pure & Clean Items
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/70 bg-[#FFFDFC] px-3 py-1.5 shadow-sm">
                    📦 Individual Pockets (Zero Spill)
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/70 bg-[#FFFDFC] px-3 py-1.5 shadow-sm">
                    ⚡ Prompt Delivery Across Maharashtra
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-[#D9C3B9]/70 bg-[#FFFDFC] px-3 py-1.5 shadow-sm">
                    🤝 Special Rates for Housing Societies
                  </span>
                </div>

                <!-- Quick CTAs & Audio Toggle in Hero -->
                <div class="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <a 
                    href="#hamper-selection" 
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] hover:scale-105 active:scale-95"
                  >
                    <span>🎁 View ₹99 & ₹149 Boxes</span>
                    <span>↓</span>
                  </a>

                  <button 
                    type="button" 
                    (click)="openDirectWhatsapp('General Inquiry')"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-[#9C4738] px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#9C4738]/20 transition-all duration-300 hover:bg-[#57251C] hover:scale-105 active:scale-95"
                  >
                    <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.551 4.195 1.597 6.02L.055 24l6.105-1.602c1.745.952 3.712 1.455 5.871 1.455 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm3.896 17.266c-.183.513-1.045.962-1.464 1.002-.42.04-1.001.077-2.923-.717-2.316-.957-3.805-3.32-3.921-3.475-.116-.155-.936-1.246-.936-2.378 0-1.132.585-1.688.794-1.921.209-.233.456-.291.608-.291.152 0 .304 0 .436.007.14.008.33.025.517.47.195.467.666 1.632.724 1.748.058.116.097.252.019.408-.078.155-.116.252-.233.388-.116.136-.245.298-.348.396-.115.109-.239.229-.107.457.132.228.588.973 1.259 1.573.864.773 1.603 1.012 1.832 1.127.228.116.363.097.498-.058.136-.155.585-.68.74-.913.155-.233.228-.155.443.058.558.214.724.348 1.267.504 1.344.155.077.33.078.503-.131z"/>
                    </svg>
                    <span>Quick Order on WhatsApp</span>
                  </button>

                  <button 
                    type="button" 
                    (click)="unmuteAndPlay($event)"
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9C3B9] bg-[#FFFDFC] px-5 py-3 text-xs font-bold text-[#57251C] shadow-sm hover:bg-[#F7F6F3] transition"
                  >
                    <span>{{ isVideoMuted ? '🔊 Turn On Video Sound' : '🔊 Sound Playing (Mute)' }}</span>
                  </button>
                </div>

              </div>

              <!-- Right Column: 9:16 Vertical Video Reel (Front & Center!) -->
              <div class="lg:col-span-5 flex flex-col items-center justify-center">
                <div class="relative w-full max-w-[280px] sm:max-w-[310px]">
                  
                  <!-- Golden Aura Glow -->
                  <div class="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-[#EB9D8E] via-[#DD8776] to-[#C56D5B] opacity-40 blur-xl"></div>
                  
                  <!-- Phone / Reel Container -->
                  <div class="relative overflow-hidden rounded-[2.2rem] border-[4px] border-[#57251C] bg-black shadow-2xl">
                    
                    <!-- Top Status Indicator -->
                    <div class="absolute top-3.5 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                        <span class="h-2 w-2 rounded-full bg-[#EB9D8E] animate-pulse"></span>
                        LIVE PACKAGING DEMO
                      </span>
                      <span class="rounded-full bg-[#C56D5B]/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        AUDIO REEL
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

                      <!-- Center Pulsing Unmute Button when audio is muted -->
                      <button 
                        *ngIf="isVideoMuted"
                        type="button"
                        (click)="unmuteAndPlay($event)"
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#57251C] via-[#9C4738] to-[#C56D5B] px-4 py-2.5 text-xs font-extrabold text-white shadow-2xl border-2 border-white/80 animate-bounce hover:scale-105 transition"
                      >
                        <span class="text-base">🔊</span>
                        <span>Tap for Sound</span>
                      </button>

                      <!-- Center Play Icon when Paused -->
                      <button 
                        *ngIf="!isVideoPlaying"
                        type="button"
                        (click)="togglePlayPause()"
                        class="absolute inset-0 flex items-center justify-center bg-black/30 transition-all hover:bg-black/20"
                        aria-label="Play video"
                      >
                        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-2xl text-[#57251C] shadow-xl transition-transform hover:scale-110">
                          ▶
                        </div>
                      </button>
                    </div>

                    <!-- Reel Bottom Controls Bar -->
                    <div class="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between rounded-xl bg-black/75 px-3 py-2 text-white backdrop-blur-md">
                      <button 
                        type="button" 
                        (click)="togglePlayPause()" 
                        class="text-xs font-semibold hover:text-[#DD8776] transition"
                      >
                        {{ isVideoPlaying ? '⏸ Pause' : '▶ Play' }}
                      </button>

                      <button 
                        type="button" 
                        (click)="toggleMute()" 
                        class="text-xs font-semibold hover:text-[#DD8776] transition flex items-center gap-1"
                      >
                        <span>{{ isVideoMuted ? '🔇 Sound Off' : '🔊 Sound On' }}</span>
                      </button>

                      <button 
                        type="button" 
                        (click)="requestFullscreen()" 
                        class="text-xs font-semibold hover:text-[#DD8776] transition"
                        title="Fullscreen"
                      >
                        ⛶ Full
                      </button>
                    </div>

                  </div>

                  <!-- Badge Below Reel -->
                  <p class="mt-2.5 text-center text-xs font-medium text-[#9C4738]">
                    📹 Live Video Demonstration • Tap to Listen & Inspect
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- PACKAGING GUARANTEE BREAKDOWN -->
        <section class="py-10 md:py-14 bg-[#FFFDFC] border-y border-[#D9C3B9]/40">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div class="text-center">
              <span class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/70 bg-[#F7F6F3] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9C4738]">
                ✨ Artisanal Packaging Guarantee
              </span>
              <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">
                Precision Partitioning: <span class="text-[#9C4738]">Spill-Free & Pure</span>
              </h2>
              <p class="mt-2 text-sm text-[#57251C]/75 max-w-2xl mx-auto leading-relaxed">
                As seen in our video demonstration, each item resides in an individual sealed enclosure within partitioned cells. Halad and kumkum will not spill, and battis remain perfectly intact.
              </p>
            </div>

            <!-- 3 Feature Highlight Cards -->
            <div class="mt-8 grid gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-[#D9C3B9]/40 bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] p-5 text-center sm:text-left shadow-sm">
                <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl text-[#57251C] border border-[#D9C3B9]/30 mb-3">
                  📦
                </div>
                <h3 class="font-serif text-sm font-bold text-[#57251C]">Isolated Pockets</h3>
                <p class="mt-1 text-xs text-[#57251C]/75 leading-relaxed">Halad, kumkum, kapoor, and dhup have dedicated dividers ensuring zero powder mixing or cross-contamination.</p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/40 bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] p-5 text-center sm:text-left shadow-sm">
                <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl text-[#57251C] border border-[#D9C3B9]/30 mb-3">
                  🌸
                </div>
                <h3 class="font-serif text-sm font-bold text-[#57251C]">Aromatic Sealing</h3>
                <p class="mt-1 text-xs text-[#57251C]/75 leading-relaxed">Pure kapoor and fragrant dhup batti retain their natural temple scent in sealed enclosures until unwrapped for aarti.</p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/40 bg-gradient-to-b from-[#FFFDFC] to-[#FAF7F5] p-5 text-center sm:text-left shadow-sm">
                <div class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl text-[#57251C] border border-[#D9C3B9]/30 mb-3">
                  🪔
                </div>
                <h3 class="font-serif text-sm font-bold text-[#57251C]">Dignified Return Gift</h3>
                <p class="mt-1 text-xs text-[#57251C]/75 leading-relaxed">A respectful, high-value blessing token for guests, society residents, and mandal devotees.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- THE 2 CORE HAMPER OPTIONS (DETAILED SHOWCASE) -->
        <section id="hamper-selection" class="py-14 md:py-20 bg-[#F7F6F3]">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            
            <div class="mx-auto max-w-3xl text-center">
              <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">
                Curated Boxes
              </span>
              <h2 class="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#57251C]">
                Select Your Ganpati Pooja Box
              </h2>
              <p class="mt-3 text-sm leading-relaxed text-[#57251C]/80 sm:text-base">
                Choose between our ₹99 Essential Pooja Kit and ₹149 Deluxe Box with Dry Fruits Prasad. Both are crafted with utmost purity.
              </p>
            </div>

            <!-- Products Comparison Cards Grid -->
            <div class="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch">
              
              <!-- PRODUCT 1: ₹99 POOJA KIT -->
              <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/70 bg-[#FFFDFC] p-6 sm:p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-[#C56D5B]">
                <div>
                  
                  <!-- Badge & Price Header -->
                  <div class="flex items-center justify-between">
                    <span class="rounded-full bg-[#C56D5B]/15 px-3.5 py-1 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">
                      Essential Pooja Kit
                    </span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-xs font-semibold text-[#9D7B6C] uppercase">Only</span>
                      <span class="font-serif text-3xl font-bold text-[#57251C]">₹99</span>
                    </div>
                  </div>

                  <!-- Product Image with Zoom Action -->
                  <div 
                    class="mt-6 relative overflow-hidden rounded-2xl border border-[#D9C3B9]/40 bg-[#FAF7F5] cursor-pointer"
                    (click)="openLightbox(products[0])"
                  >
                    <img 
                      [src]="products[0].image" 
                      [alt]="products[0].name" 
                      class="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                      <span class="rounded-full bg-[#FFFDFC]/95 px-3 py-1 text-xs font-bold text-[#57251C] shadow">
                        🔍 Click to view high-res photo
                      </span>
                    </div>
                  </div>

                  <!-- Product Title & Highlights -->
                  <h3 class="mt-6 font-serif text-2xl font-bold text-[#57251C]">
                    {{ products[0].name }}
                  </h3>
                  <p class="mt-2 text-sm text-[#57251C]/80 leading-relaxed">
                    {{ products[0].shortDesc }}
                  </p>

                  <!-- Included Items Checklist -->
                  <div class="mt-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-[#9C4738]">Items inside the box:</h4>
                    <ul class="mt-3 space-y-2.5">
                      <li *ngFor="let item of products[0].items" class="flex items-center gap-2.5 text-xs sm:text-sm text-[#57251C]">
                        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7F6F3] text-xs border border-[#D9C3B9]/40">{{ item.icon }}</span>
                        <span class="font-semibold">{{ item.name }}:</span>
                        <span class="text-[#57251C]/75">{{ item.detail }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Ideal For Pills -->
                  <div class="mt-6 border-t border-[#D9C3B9]/40 pt-4">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-[#9D7B6C]">Best used for:</span>
                    <div class="mt-2 flex flex-wrap gap-1.5">
                      <span *ngFor="let use of products[0].idealFor" class="rounded-md bg-[#FAF7F5] border border-[#D9C3B9]/50 px-2.5 py-1 text-xs text-[#57251C]">
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
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md hover:bg-[#9C4738] hover:shadow-lg transition-all active:scale-95"
                  >
                    <span>💬 Order ₹99 Box on WhatsApp</span>
                  </a>
                </div>

              </div>

              <!-- PRODUCT 2: ₹149 DELUXE POOJA KIT + DRY FRUITS -->
              <div class="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-2 border-[#C56D5B] bg-[#FFFDFC] p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
                
                <!-- "Most Loved" Top Banner Strip -->
                <div class="absolute top-0 right-0 bg-gradient-to-l from-[#9C4738] to-[#C56D5B] px-5 py-1 text-[11px] font-bold tracking-wider text-[#FFFDFC] uppercase rounded-bl-xl shadow-sm">
                  ★ Most Popular Choice
                </div>

                <div>
                  <!-- Badge & Price Header -->
                  <div class="flex items-center justify-between">
                    <span class="rounded-full bg-[#EB9D8E]/25 px-3.5 py-1 text-xs font-bold text-[#57251C] border border-[#EB9D8E]/50">
                      Deluxe Pooja Kit + Dry Fruits
                    </span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-xs font-semibold text-[#9D7B6C] uppercase">Only</span>
                      <span class="font-serif text-3xl font-bold text-[#9C4738]">₹149</span>
                    </div>
                  </div>

                  <!-- Product Image with Zoom Action -->
                  <div 
                    class="mt-6 relative overflow-hidden rounded-2xl border border-[#D9C3B9]/40 bg-[#FAF7F5] cursor-pointer"
                    (click)="openLightbox(products[1])"
                  >
                    <img 
                      [src]="products[1].image" 
                      [alt]="products[1].name" 
                      class="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                      <span class="rounded-full bg-[#FFFDFC]/95 px-3 py-1 text-xs font-bold text-[#57251C] shadow">
                        🔍 Click to view high-res photo
                      </span>
                    </div>
                  </div>

                  <!-- Product Title & Highlights -->
                  <h3 class="mt-6 font-serif text-2xl font-bold text-[#57251C]">
                    {{ products[1].name }}
                  </h3>
                  <p class="mt-2 text-sm text-[#57251C]/80 leading-relaxed">
                    {{ products[1].shortDesc }}
                  </p>

                  <!-- Included Items Checklist -->
                  <div class="mt-6">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-[#9C4738]">Items inside the box:</h4>
                    <ul class="mt-3 space-y-2.5">
                      <li *ngFor="let item of products[1].items" class="flex items-center gap-2.5 text-xs sm:text-sm text-[#57251C]">
                        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F7F6F3] text-xs border border-[#D9C3B9]/40">{{ item.icon }}</span>
                        <span class="font-semibold">{{ item.name }}:</span>
                        <span class="text-[#57251C]/75">{{ item.detail }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Ideal For Pills -->
                  <div class="mt-6 border-t border-[#D9C3B9]/40 pt-4">
                    <span class="text-[11px] font-bold uppercase tracking-wider text-[#9D7B6C]">Best used for:</span>
                    <div class="mt-2 flex flex-wrap gap-1.5">
                      <span *ngFor="let use of products[1].idealFor" class="rounded-md bg-[#FAF7F5] border border-[#D9C3B9]/50 px-2.5 py-1 text-xs text-[#57251C]">
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
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#9C4738] px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-lg shadow-[#9C4738]/25 hover:bg-[#57251C] hover:shadow-xl transition-all active:scale-95"
                  >
                    <span>💬 Order ₹149 Box on WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        </section>

        <!-- INTERACTIVE BULK & QUANTITY CALCULATOR (ORDER ASSISTANT) -->
        <section class="py-12 md:py-16 bg-[#FAF7F5] border-y border-[#D9C3B9]/40">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl rounded-[2.5rem] border border-[#D9C3B9]/60 bg-[#FFFDFC] p-6 sm:p-10 shadow-xl">
              
              <div class="text-center">
                <span class="inline-block rounded-full bg-[#C56D5B]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">
                  Order Estimator
                </span>
                <h3 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">
                  Calculate Your Total & Order
                </h3>
                <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75">
                  Select your desired quantity for each box. Your customized order breakdown is instantly prepared for WhatsApp.
                </p>
              </div>

              <!-- Counter Inputs -->
              <div class="mt-8 grid gap-6 sm:grid-cols-2">
                
                <!-- Qty for ₹99 Kit -->
                <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#F7F6F3] p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-serif font-bold text-sm text-[#57251C]">₹99 Essential Kit</h4>
                      <p class="text-[11px] text-[#9D7B6C]">6 Complete Pooja Items</p>
                    </div>
                    <span class="font-serif font-bold text-[#57251C] text-lg">₹99</span>
                  </div>

                  <div class="mt-4 flex items-center justify-between">
                    <span class="text-xs font-semibold text-[#57251C]/80">Quantity:</span>
                    <div class="flex items-center gap-3">
                      <button 
                        type="button" 
                        (click)="decrementQty('qty99')"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDFC] border border-[#D9C3B9] font-bold text-[#57251C] shadow-sm hover:bg-[#57251C] hover:text-white active:scale-95"
                      >
                        -
                      </button>
                      <span class="w-8 text-center font-bold text-base text-[#57251C]">{{ qty99 }}</span>
                      <button 
                        type="button" 
                        (click)="incrementQty('qty99')"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-[#57251C] text-white font-bold shadow-sm hover:bg-[#9C4738] active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Qty for ₹149 Deluxe Kit -->
                <div class="rounded-2xl border border-[#C56D5B]/40 bg-[#FFFDFC] p-4 shadow-sm">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-serif font-bold text-sm text-[#57251C]">₹149 Deluxe Hamper</h4>
                      <p class="text-[11px] text-[#9C4738]">6 Essentials + Dry Fruits Prasad</p>
                    </div>
                    <span class="font-serif font-bold text-[#9C4738] text-lg">₹149</span>
                  </div>

                  <div class="mt-4 flex items-center justify-between">
                    <span class="text-xs font-semibold text-[#57251C]/80">Quantity:</span>
                    <div class="flex items-center gap-3">
                      <button 
                        type="button" 
                        (click)="decrementQty('qty149')"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDFC] border border-[#D9C3B9] font-bold text-[#57251C] shadow-sm hover:bg-[#57251C] hover:text-white active:scale-95"
                      >
                        -
                      </button>
                      <span class="w-8 text-center font-bold text-base text-[#57251C]">{{ qty149 }}</span>
                      <button 
                        type="button" 
                        (click)="incrementQty('qty149')"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-[#9C4738] text-white font-bold shadow-sm hover:bg-[#57251C] active:scale-95"
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
                  <label class="block text-xs font-semibold text-[#57251C] mb-1">Your Name (Optional):</label>
                  <input 
                    type="text" 
                    [(ngModel)]="customerName" 
                    placeholder="e.g. Rahul Sharma"
                    class="w-full rounded-xl border border-[#D9C3B9]/70 bg-[#FFFDFC] px-3.5 py-2.5 text-sm outline-none focus:border-[#C56D5B]"
                  />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-[#57251C] mb-1">City / Society Name (Optional):</label>
                  <input 
                    type="text" 
                    [(ngModel)]="customerLocation" 
                    placeholder="e.g. Pune / Sunrise Apartments"
                    class="w-full rounded-xl border border-[#D9C3B9]/70 bg-[#FFFDFC] px-3.5 py-2.5 text-sm outline-none focus:border-[#C56D5B]"
                  />
                </div>
              </div>

              <!-- Calculation Summary -->
              <div class="mt-6 rounded-2xl bg-[#F7F6F3] p-5 border border-[#D9C3B9]/60">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-[#57251C] font-semibold">Estimated Total ({{ totalQuantity }} Boxes)</p>
                    <p *ngIf="totalQuantity >= 10" class="text-[11px] text-[#9C4738] font-bold mt-0.5">
                      🎉 Bulk order! Special discounted rates will apply on WhatsApp!
                    </p>
                  </div>
                  <span class="font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">₹{{ calculatedTotal }}</span>
                </div>
              </div>

              <!-- Order via WhatsApp Action Button -->
              <div class="mt-6">
                <a 
                  [href]="customOrderWhatsappUrl" 
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="trackOrder('Calculated Ganpati Order', 'Ganpati Calculator', calculatedTotal)"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFFDFC] shadow-lg shadow-[#57251C]/25 transition-all hover:bg-[#9C4738] hover:shadow-xl active:scale-95"
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
        <section class="py-14 md:py-18 bg-[#57251C] text-[#FFFDFC]">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid items-center gap-8 lg:grid-cols-12">
              
              <div class="lg:col-span-8">
                <span class="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#EB9D8E] border border-white/15">
                  Housing Societies • Ganesh Mandals • Corporate Gifting
                </span>
                <h3 class="mt-4 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFFDFC]">
                  Bulk Orders for Your Society or Mandal
                </h3>
                <p class="mt-3 text-sm sm:text-base leading-relaxed text-[#D9C3B9]">
                  Arranging Ganpati return gifts for society residents, visiting devotees, or employees? We offer attractive tiered wholesale discounts on 10+ boxes with guaranteed on-time doorstep dispatch. Custom branding and name stickers are available.
                </p>
                <div class="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#EB9D8E]">
                  <span>✓ 10+ Boxes: Tiered Society Pricing</span>
                  <span>✓ 50+ Boxes: Maximum Bulk Savings</span>
                  <span>✓ 100+ Boxes: Custom Society / Mandal Label</span>
                </div>
              </div>

              <div class="lg:col-span-4 lg:flex lg:justify-end">
                <button
                  type="button"
                  (click)="openDirectWhatsapp('Bulk Society Order for Ganpati')"
                  class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#FFFDFC] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#57251C] shadow-xl transition-all hover:bg-[#F7F6F3] hover:scale-105 active:scale-95"
                >
                  <span>💬 Request Society Quote</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        <!-- GANESH CHATURTHI POOJA SAMAGRI CHECKLIST & GUIDE (SEO POWERHOUSE) -->
        <section class="py-14 md:py-20 bg-[#F7F6F3] border-t border-[#D9C3B9]/40">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div class="text-center">
              <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">
                🌺 Sacred Samagri Guide 🪔
              </span>
              <h2 class="mt-4 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#57251C]">
                Essential Ganesh Chaturthi Pooja Items
              </h2>
              <p class="mt-3 text-sm sm:text-base text-[#57251C]/80 max-w-2xl mx-auto leading-relaxed">
                Everything required for Lord Ganesha's auspicious Sthapana and daily aarti, thoughtfully assembled with utmost devotion:
              </p>
            </div>

            <!-- Items Breakdown Grid -->
            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-6 shadow-sm hover:shadow-md transition">
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl border border-[#D9C3B9]/40">🌿</span>
                  <div>
                    <h3 class="font-serif text-base font-bold text-[#57251C]">Dhup (धूप)</h3>
                    <span class="text-[11px] font-semibold text-[#9C4738]">Purification & Harmony</span>
                  </div>
                </div>
                <p class="mt-3 text-xs text-[#57251C]/75 leading-relaxed">
                  Traditional dhoop purifies the surroundings and creates an auspicious temple atmosphere during morning and evening aarti.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-6 shadow-sm hover:shadow-md transition">
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl border border-[#D9C3B9]/40">🕯️</span>
                  <div>
                    <h3 class="font-serif text-base font-bold text-[#57251C]">Pure Kapoor (कापूर)</h3>
                    <span class="text-[11px] font-semibold text-[#9C4738]">Clean Aarti Flame</span>
                  </div>
                </div>
                <p class="mt-3 text-xs text-[#57251C]/75 leading-relaxed">
                  Pure camphor tablets that burn clearly without toxic smoke, inviting sacred vibrations into your home.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-6 shadow-sm hover:shadow-md transition">
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl border border-[#D9C3B9]/40">🪔</span>
                  <div>
                    <h3 class="font-serif text-base font-bold text-[#57251C]">Kapus Vaat (कापूस वात)</h3>
                    <span class="text-[11px] font-semibold text-[#9C4738]">Luminous Diya Wick</span>
                  </div>
                </div>
                <p class="mt-3 text-xs text-[#57251C]/75 leading-relaxed">
                  Carefully crafted soft cotton wicks suitable for both oil and ghee diyas for a steady, uninterrupted flame.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-6 shadow-sm hover:shadow-md transition">
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl border border-[#D9C3B9]/40">🌸</span>
                  <div>
                    <h3 class="font-serif text-base font-bold text-[#57251C]">Dhup Batti (धूप बत्ती)</h3>
                    <span class="text-[11px] font-semibold text-[#9C4738]">Calming Fragrance</span>
                  </div>
                </div>
                <p class="mt-3 text-xs text-[#57251C]/75 leading-relaxed">
                  Slow-burning incense sticks that maintain a sweet spiritual fragrance throughout your puja space.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-6 shadow-sm hover:shadow-md transition">
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl border border-[#D9C3B9]/40">🟡</span>
                  <div>
                    <h3 class="font-serif text-base font-bold text-[#57251C]">Halad (हळद)</h3>
                    <span class="text-[11px] font-semibold text-[#9C4738]">Auspicious Turmeric</span>
                  </div>
                </div>
                <p class="mt-3 text-xs text-[#57251C]/75 leading-relaxed">
                  Pure puja haldi for sacred abhishek, rituals, and welcoming threshold decorations.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-6 shadow-sm hover:shadow-md transition">
                <div class="flex items-center gap-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl border border-[#D9C3B9]/40">🔴</span>
                  <div>
                    <h3 class="font-serif text-base font-bold text-[#57251C]">Kumkum (कुंकू)</h3>
                    <span class="text-[11px] font-semibold text-[#9C4738]">Sacred Vermillion</span>
                  </div>
                </div>
                <p class="mt-3 text-xs text-[#57251C]/75 leading-relaxed">
                  Vibrant, sacred red kumkum for Bappa's tilak and receiving visiting guests with traditional warmth.
                </p>
              </div>
            </div>

            <!-- Dry Fruits Prasad Callout in ₹149 Box -->
            <div class="mt-8 rounded-3xl border border-[#D9C3B9]/60 bg-gradient-to-r from-[#FAF7F5] via-[#FFFDFC] to-[#FAF7F5] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#57251C] text-3xl text-white shadow-md">
                🥜
              </div>
              <div>
                <span class="rounded-full bg-[#9C4738] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Included in ₹149 Deluxe Box</span>
                <h3 class="mt-2 font-serif text-lg sm:text-xl font-bold text-[#57251C]">Handpicked Dry Fruits for Prasad (काजू, बदाम, मनुका)</h3>
                <p class="mt-1 text-xs sm:text-sm text-[#57251C]/80 leading-relaxed">
                  Packaged in a crystal-clear container: premium Cashews (Kaju), crisp Almonds (Badam), and sweet Raisins (Manuka). Ready to offer as holy Naivedya to Lord Ganesha.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- DELIVERY LOCATIONS & LOCAL MAHARASHTRA SERVICE (LOCAL SEO) -->
        <section class="py-12 md:py-16 bg-[#FFFDFC] border-t border-[#D9C3B9]/40">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div class="text-center">
              <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">
                🚚 Fast Festive Delivery
              </span>
              <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">
                Serving Pune, Mumbai & All Maharashtra
              </h2>
              <p class="mt-2 text-sm text-[#57251C]/75 max-w-2xl mx-auto leading-relaxed">
                Whether ordering a single box for your family or 100+ for your residential complex, we guarantee safe, prompt dispatch right to your doorstep.
              </p>
            </div>

            <div class="mt-8 grid gap-4 sm:grid-cols-3">
              <div class="rounded-2xl border border-[#D9C3B9]/40 bg-[#FAF7F5] p-5 text-center sm:text-left">
                <span class="text-2xl">📍</span>
                <h3 class="mt-2 font-serif text-sm font-bold text-[#57251C]">Pune & PCMC Express</h3>
                <p class="mt-1 text-xs text-[#57251C]/75 leading-relaxed">
                  Rapid delivery across Kothrud, Baner, Wakad, Hadapsar, Viman Nagar, Hinjewadi, Aundh, Shivaji Nagar, Pimpri, Chinchwad, and PCMC.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/40 bg-[#FAF7F5] p-5 text-center sm:text-left">
                <span class="text-2xl">📍</span>
                <h3 class="mt-2 font-serif text-sm font-bold text-[#57251C]">Mumbai, Thane & Navi Mumbai</h3>
                <p class="mt-1 text-xs text-[#57251C]/75 leading-relaxed">
                  Doorstep courier across Dadar, Borivali, Andheri, Ghatkopar, Thane West, Vashi, Nerul, Kharghar, Panvel, and Western/Central lines.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/40 bg-[#FAF7F5] p-5 text-center sm:text-left">
                <span class="text-2xl">📦</span>
                <h3 class="mt-2 font-serif text-sm font-bold text-[#57251C]">Pan-Maharashtra & India Dispatch</h3>
                <p class="mt-1 text-xs text-[#57251C]/75 leading-relaxed">
                  Safe courier dispatch to Nashik, Nagpur, Kolhapur, Solapur, Sambhajinagar, and pin codes nationwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- DEVOTEE REVIEWS & TRUST TESTIMONIALS -->
        <section class="py-12 md:py-16 bg-[#F7F6F3] border-t border-[#D9C3B9]/40">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div class="text-center">
              <div class="inline-flex items-center gap-1 text-[#C56D5B] text-sm">
                ★★★★★ <span class="ml-1 text-xs font-bold text-[#57251C]">4.9 / 5 Devotee Satisfaction</span>
              </div>
              <h2 class="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">
                Trusted by Families & Housing Societies
              </h2>
            </div>

            <div class="mt-8 grid gap-6 sm:grid-cols-3">
              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-5 shadow-sm">
                <div class="text-[#C56D5B] text-xs">★★★★★</div>
                <p class="mt-3 text-xs leading-relaxed text-[#57251C]/80">
                  "We ordered 50 boxes for our society residents in Kothrud. Everyone was impressed! The packaging was 100% clean, and not a single speck of halad spilled."
                </p>
                <div class="mt-4 border-t border-[#D9C3B9]/30 pt-3">
                  <h4 class="font-serif text-xs font-bold text-[#57251C]">Suresh Kulkarni</h4>
                  <span class="text-[10px] text-[#9D7B6C]">Society Secretary, Pune</span>
                </div>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-5 shadow-sm">
                <div class="text-[#C56D5B] text-xs">★★★★★</div>
                <p class="mt-3 text-xs leading-relaxed text-[#57251C]/80">
                  "Saved so much time on Ganesh Chaturthi morning! Instead of running around to different stores for kapoor and vaat, everything was ready to use in one neat box."
                </p>
                <div class="mt-4 border-t border-[#D9C3B9]/30 pt-3">
                  <h4 class="font-serif text-xs font-bold text-[#57251C]">Pooja Deshmukh</h4>
                  <span class="text-[10px] text-[#9D7B6C]">Home Devotee, Dadar, Mumbai</span>
                </div>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC] p-5 shadow-sm">
                <div class="text-[#C56D5B] text-xs">★★★★★</div>
                <p class="mt-3 text-xs leading-relaxed text-[#57251C]/80">
                  "The ₹149 Deluxe Box with dry fruits is exceptional value. The dry fruits were fresh and sealed in a crystal box. Perfect return gift for our guests."
                </p>
                <div class="mt-4 border-t border-[#D9C3B9]/30 pt-3">
                  <h4 class="font-serif text-xs font-bold text-[#57251C]">Amit Joshi</h4>
                  <span class="text-[10px] text-[#9D7B6C]">Mandal Organizer, Thane</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- DEVOTEE FAQS SECTION -->
        <section class="py-12 md:py-16 bg-[#FFFDFC]">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div class="text-center">
              <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">
                Devotee Inquiries
              </span>
              <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">
                Frequently Asked Questions
              </h2>
              <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75">
                Everything you need to know about our handcrafted Ganpati pooja boxes
              </p>
            </div>

            <div class="mt-10 space-y-4">
              
              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FAF7F5] p-5">
                <h4 class="font-serif font-bold text-sm sm:text-base text-[#57251C]">
                  Q: Will the boxes arrive before Ganesh Chaturthi?
                </h4>
                <p class="mt-2 text-xs sm:text-sm text-[#57251C]/80 leading-relaxed">
                  Yes! We pack and dispatch expeditiously. We recommend ordering 2 to 3 days in advance to avoid last-minute festival courier rushes.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FAF7F5] p-5">
                <h4 class="font-serif font-bold text-sm sm:text-base text-[#57251C]">
                  Q: What dry fruits are included in the ₹149 Deluxe Box?
                </h4>
                <p class="mt-2 text-xs sm:text-sm text-[#57251C]/80 leading-relaxed">
                  It features an airtight container containing handpicked Cashews (Kaju), Almonds (Badam), and sweet Raisins (Manuka) — ready for divine Naivedya.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FAF7F5] p-5">
                <h4 class="font-serif font-bold text-sm sm:text-base text-[#57251C]">
                  Q: Is there any risk of Halad and Kumkum spilling inside?
                </h4>
                <p class="mt-2 text-xs sm:text-sm text-[#57251C]/80 leading-relaxed">
                  No. Each item is individually sealed in airtight pouches and nested inside partitioned cardboard cells as shown in our live video.
                </p>
              </div>

              <div class="rounded-2xl border border-[#D9C3B9]/50 bg-[#FAF7F5] p-5">
                <h4 class="font-serif font-bold text-sm sm:text-base text-[#57251C]">
                  Q: How do I order and complete payment?
                </h4>
                <p class="mt-2 text-xs sm:text-sm text-[#57251C]/80 leading-relaxed">
                  Click any WhatsApp button to chat directly with us. State your required box count and location, and complete payment smoothly via UPI, GPay, or PhonePe.
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
          <div class="relative max-w-4xl w-full overflow-hidden rounded-3xl bg-[#FFFDFC] p-2 shadow-2xl border border-[#D9C3B9]/60" (click)="$event.stopPropagation()">
            
            <button 
              type="button" 
              (click)="closeLightbox()" 
              class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#57251C] text-lg font-bold text-white transition hover:bg-[#9C4738]"
              aria-label="Close Preview"
            >
              ✕
            </button>
            
            <div class="grid gap-0 lg:grid-cols-12">
              <div class="lg:col-span-7 bg-[#FAF7F5] flex items-center justify-center overflow-hidden rounded-2xl p-2">
                <img 
                  [src]="activeLightboxProduct.image" 
                  [alt]="activeLightboxProduct.name" 
                  class="max-h-[80vh] w-full object-contain" 
                />
              </div>

              <div class="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                <div>
                  <span class="rounded-full bg-[#C56D5B]/15 px-3 py-1 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">
                    {{ activeLightboxProduct.badge }}
                  </span>
                  
                  <div class="mt-4 flex items-baseline gap-2">
                    <h3 class="font-serif text-2xl font-bold text-[#57251C]">{{ activeLightboxProduct.name }}</h3>
                    <span class="font-serif text-2xl font-bold text-[#9C4738]">₹{{ activeLightboxProduct.price }}</span>
                  </div>

                  <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80">
                    {{ activeLightboxProduct.shortDesc }}
                  </p>

                  <div class="mt-4">
                    <h5 class="text-xs font-bold uppercase text-[#9D7B6C]">Items inside the box:</h5>
                    <ul class="mt-2 space-y-1.5">
                      <li *ngFor="let it of activeLightboxProduct.items" class="text-xs text-[#57251C] flex items-center gap-2">
                        <span>{{ it.icon }}</span>
                        <strong>{{ it.name }}</strong> ({{ it.detail }})
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-6 pt-4 border-t border-[#D9C3B9]/30">
                  <a 
                    [href]="getWhatsappUrl(activeLightboxProduct.orderMessage)" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(activeLightboxProduct.name, 'Ganpati Lightbox', activeLightboxProduct.price)" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] active:scale-95"
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
      badgeClass: 'bg-[#C56D5B]/15 text-[#9C4738] border border-[#C56D5B]/25',
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
      badgeClass: 'bg-[#57251C]/15 text-[#57251C] border border-[#57251C]/25',
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

  private interactionEvents = ['click', 'touchstart', 'scroll', 'keydown'];
  private interactionHandler = () => {
    if (this.videoPlayerRef?.nativeElement) {
      const v = this.videoPlayerRef.nativeElement;
      v.muted = false;
      v.volume = 1.0;
      this.isVideoMuted = false;
    }
    this.removeInteractionListeners();
  };

  ngOnInit() {
    this.setupSeo();

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.startVideoWithAudio();
      }, 250);
    }
  }

  ngOnDestroy() {
    this.removeInteractionListeners();
    this.seo.removeJsonLd('ganpati-page-schema');
    document.body.style.overflow = '';
  }

  startVideoWithAudio() {
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;

    // Attempt direct audio playback first
    video.muted = false;
    video.volume = 1.0;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isVideoPlaying = true;
          this.isVideoMuted = false;
        })
        .catch(() => {
          // Browser blocked unmuted autoplay: fall back to muted and enable audio on first gesture
          video.muted = true;
          video.play().then(() => {
            this.isVideoPlaying = true;
            this.isVideoMuted = true;
          }).catch(() => {
            this.isVideoPlaying = false;
            this.isVideoMuted = true;
          });

          this.enableAudioOnFirstInteraction();
        });
    }
  }

  private enableAudioOnFirstInteraction() {
    if (typeof window !== 'undefined') {
      this.interactionEvents.forEach(evt => {
        window.addEventListener(evt, this.interactionHandler, { once: true, passive: true });
      });
    }
  }

  private removeInteractionListeners() {
    if (typeof window !== 'undefined') {
      this.interactionEvents.forEach(evt => {
        window.removeEventListener(evt, this.interactionHandler);
      });
    }
  }

  unmuteAndPlay(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const video = this.videoPlayerRef?.nativeElement;
    if (!video) return;

    video.muted = false;
    video.volume = 1.0;
    this.isVideoMuted = false;
    video.play().then(() => {
      this.isVideoPlaying = true;
    }).catch(() => {});
    this.removeInteractionListeners();
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
    if (!video.muted) {
      video.volume = 1.0;
    }
    this.isVideoMuted = video.muted;
    this.removeInteractionListeners();
  }

  setupSeo() {
    this.seo.setPageMetadata({
      title: 'Ganpati Hampers & Pooja Kits from ₹99 | Ganesh Utsav 2026',
      description: 'Order authentic Ganpati Pooja Kits starting at ₹99 and ₹149. Complete with Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum and Dry Fruits in spill-proof partitioned boxes. Fast delivery across Pune, Mumbai, Thane & all India.',
      keywords: 'ganpati hampers, ganpati pooja kit, ganesh chaturthi pooja kit, pooja samagri box 99 rs, ganpati return gifts, dry fruit ganpati hamper 149, ganesh utsav hampers 2026, society bulk ganpati gifts, ganpati hampers pune, ganpati hampers mumbai, halad kumkum kapoor dhup kit, rms gift hampers',
      slug: 'ganpati-hampers',
      ogType: 'product',
      ogImage: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
      ogVideo: 'assets/ganpati-pooja-kit-hamper-2026/the_box_should_be_strictly_lik.mp4'
    });

    const jsonLdGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Product',
          '@id': 'https://rmsgifthampers.com/ganpati-hampers#pooja-kit-99',
          'name': 'Ganpati Essential Pooja Kit (₹99)',
          'image': 'https://rmsgifthampers.com/assets/ganpati-pooja-kit-hamper-2026/99_hamper.png',
          'description': 'All 6 essential pooja items (Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum) neatly packed in a partitioned spill-proof box for home Ganpati aarti and society return gifts.',
          'sku': 'RMS-GANPATI-99',
          'brand': {
            '@type': 'Brand',
            'name': 'RMS Gift Hampers'
          },
          'offers': {
            '@type': 'Offer',
            'url': 'https://rmsgifthampers.com/ganpati-hampers',
            'priceCurrency': 'INR',
            'price': '99',
            'priceValidUntil': '2026-10-01',
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': 'https://schema.org/InStock',
            'seller': {
              '@type': 'Organization',
              'name': 'RMS Gift Hampers'
            }
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'reviewCount': '128'
          }
        },
        {
          '@type': 'Product',
          '@id': 'https://rmsgifthampers.com/ganpati-hampers#deluxe-hamper-149',
          'name': 'Ganpati Deluxe Pooja Kit & Dry Fruits Hamper (₹149)',
          'image': 'https://rmsgifthampers.com/assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
          'description': 'Complete sacred pooja essentials (Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum) plus an airtight clear container of premium Kaju, Badam & Manuka for holy Prasad.',
          'sku': 'RMS-GANPATI-149',
          'brand': {
            '@type': 'Brand',
            'name': 'RMS Gift Hampers'
          },
          'offers': {
            '@type': 'Offer',
            'url': 'https://rmsgifthampers.com/ganpati-hampers',
            'priceCurrency': 'INR',
            'price': '149',
            'priceValidUntil': '2026-10-01',
            'itemCondition': 'https://schema.org/NewCondition',
            'availability': 'https://schema.org/InStock',
            'seller': {
              '@type': 'Organization',
              'name': 'RMS Gift Hampers'
            }
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.95',
            'reviewCount': '184'
          }
        },
        {
          '@type': 'VideoObject',
          'name': 'Ganpati Pooja Kit Real Unboxing & Packaging Demonstration Video',
          'description': 'Real video unboxing demonstration of RMS Gift Hampers Ganpati Pooja Kit showing spill-proof compartments for halad, kumkum, kapoor, dhup, and dry fruits box.',
          'thumbnailUrl': [
            'https://rmsgifthampers.com/assets/ganpati-pooja-kit-hamper-2026/149_hamper.png'
          ],
          'uploadDate': '2026-08-01T08:00:00+05:30',
          'duration': 'PT10S',
          'contentUrl': 'https://rmsgifthampers.com/assets/ganpati-pooja-kit-hamper-2026/the_box_should_be_strictly_lik.mp4',
          'embedUrl': 'https://rmsgifthampers.com/ganpati-hampers',
          'publisher': {
            '@type': 'Organization',
            'name': 'RMS Gift Hampers',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://rmsgifthampers.com/assets/logo.png'
            }
          }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'Will the Ganpati pooja boxes reach before Ganesh Chaturthi?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Yes! We pack and dispatch quickly so it reaches your home in time. Please order 2 to 3 days in advance to avoid last-minute festival rush.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What items are included inside the ₹99 Ganpati Pooja Kit?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The ₹99 box includes all 6 essential items: Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, and Kumkum in a neat partitioned spill-proof box.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What dry fruits are inside the ₹149 Deluxe Box?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'It comes with a clean, clear plastic box with good quality Kaju (Cashews), Badam (Almonds), and Manuka (Raisins) — ready to offer as Prasad to Bappa, in addition to all 6 pooja samagri items.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Can Halad and Kumkum spill inside the box during transport?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'No! Each item is packed in separate sealed plastic pouches and placed in separate box pockets so nothing spills or mixes together.'
              }
            }
          ]
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://rmsgifthampers.com/'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Gift Hampers',
              'item': 'https://rmsgifthampers.com/hampers'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Ganpati Hampers & Pooja Kits',
              'item': 'https://rmsgifthampers.com/ganpati-hampers'
            }
          ]
        },
        {
          '@type': 'LocalBusiness',
          'name': 'RMS Gift Hampers',
          'image': 'https://rmsgifthampers.com/assets/logo.png',
          'telephone': '+919284905118',
          'url': 'https://rmsgifthampers.com/ganpati-hampers',
          'priceRange': '₹99 - ₹149',
          'areaServed': [
            'Mumbai', 'Pune', 'Thane', 'Navi Mumbai', 'Maharashtra', 'India'
          ]
        }
      ]
    };

    this.seo.setJsonLd(jsonLdGraph, 'ganpati-page-schema');
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

