import { Component, inject, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';

interface ReturnGiftOffer {
  slug: string;
  title: string;
  description: string;
  image: string;
  orderLink: string;
}

@Component({
  selector: 'app-return-gift-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] py-12 md:py-18">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 blur-3xl"></div>

        <div class="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 bg-[#FFFDFC]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] shadow-sm backdrop-blur-md">
            <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
            Event Favours & Return Gifts
          </div>

          <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] sm:text-5xl lg:text-6xl leading-[1.15]">
            Thoughtful <span class="font-serif italic font-normal text-[#C56D5B] underline decoration-[#EB9D8E] decoration-wavy decoration-1 underline-offset-8">Return Gifts & Favours</span>
          </h1>

          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#57251C]/80 sm:text-lg">
            Memorable, beautifully packed tokens of gratitude for weddings, birthday celebrations, baby showers, and festive gatherings.
          </p>
        </div>
      </section>

      <!-- CARDS GRID SECTION -->
      <section class="bg-[#F7F6F3] py-12 md:py-16 border-t border-[#D9C3B9]/40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let item of offers" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl"
            >
              <!-- Card Image & Lightbox Trigger -->
              <div class="relative overflow-hidden cursor-pointer bg-[#FAF7F5]" (click)="openLightbox(item)">
                <img 
                  [src]="item.image" 
                  [alt]="item.title" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="rounded-full bg-[#FFFDFC]/95 px-3.5 py-1.5 text-xs font-bold text-[#57251C] backdrop-blur-md shadow-sm">
                    🔍 View High-Res Photo
                  </span>
                </div>
              </div>

              <!-- Card Details -->
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 class="font-serif text-xl font-bold tracking-tight text-[#57251C] group-hover:text-[#9C4738] transition-colors duration-300">
                    {{ item.title }}
                  </h2>
                  <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75">
                    {{ item.description }}
                  </p>
                </div>

                <!-- Action Navigation -->
                <div class="mt-6 flex flex-col gap-2.5 pt-4 border-t border-[#D9C3B9]/30">
                  <a 
                    [routerLink]="['/return-gifts', item.slug]" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#57251C]/35 bg-[#FFFDFC] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#57251C] shadow-sm transition-all duration-300 hover:bg-[#F7F6F3] active:scale-95"
                  >
                    View Collection →
                  </a>

                  <a 
                    [href]="item.orderLink" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(item.title, 'Return Gifts', item.orderLink)" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition-all duration-300 hover:bg-[#9C4738] hover:shadow-lg active:scale-95"
                  >
                    <span>💬 Order on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LIGHTBOX PREVIEW MODAL -->
      <div 
        *ngIf="activeLightboxItem" 
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
            <div class="lg:col-span-7 bg-[#FAF7F5] flex items-center justify-center overflow-hidden rounded-2xl">
              <img [src]="activeLightboxItem.image" [alt]="activeLightboxItem.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-[#C56D5B]/15 px-3 py-1 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">Return Gift Preview</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C]">{{ activeLightboxItem.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80">{{ activeLightboxItem.description }}</p>
              </div>

              <div class="mt-8 flex flex-col gap-3">
                <a 
                  [routerLink]="['/return-gifts', activeLightboxItem.slug]" 
                  (click)="closeLightbox()"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#57251C]/35 bg-[#FFFDFC] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#57251C] shadow-sm transition hover:bg-[#F7F6F3]"
                >
                  Explore Collection
                </a>
                <a 
                  [href]="activeLightboxItem.orderLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="trackOrder(activeLightboxItem.title, 'Return Gifts', activeLightboxItem.orderLink)" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] active:scale-95"
                >
                  <span>💬 Order on WhatsApp</span>
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
export class ReturnGiftPageComponent implements OnInit, OnDestroy {
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);

  activeLightboxItem: ReturnGiftOffer | null = null;

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Return Gifts for Birthdays, Weddings and Parties',
      description: 'Choose thoughtful return gifts for birthdays, weddings and parties from RMS Gift Hampers with elegant presentation and simple ordering.',
      keywords: 'return gifts, birthday return gifts, wedding return gifts, party return gifts',
      slug: 'return-gifts'
    });
  }

  offers: ReturnGiftOffer[] = [
    {
      slug: 'birthday-return-gift',
      title: 'Birthday Return Gift',
      description: 'Pretty and memorable party return gifts for birthday guests.',
      image: 'assets/return_gift/birthday_return_gift/birthday_return_gift.jpg',
      orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20birthday%20return%20gifts.'
    },
    {
      slug: 'wedding-return-gifts',
      title: 'Wedding Return Gifts',
      description: 'Elegant wedding return gifts for guests in Marathi and English packaging.',
      image: 'assets/return_gift/wedding_return_gift/wedding_return_gift_marathi.jpg',
      orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20wedding%20return%20gifts.'
    },
    {
      slug: 'party-return-gifts',
      title: 'Party Return Gifts',
      description: 'Festive party return gifts to delight every guest.',
      image: 'assets/return_gift/party_return_gifts/party_return_gifts_english.jpg',
      orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20party%20return%20gifts.'
    }
  ];

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightboxItem) {
      this.closeLightbox();
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  trackOrder(title: string, category: string, link: string) {
    this.orderTracker.recordOrder({
      title,
      category,
      page: 'Return Gifts',
      link
    });
  }

  openLightbox(item: ReturnGiftOffer) {
    this.activeLightboxItem = item;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.activeLightboxItem = null;
    document.body.style.overflow = '';
  }
}