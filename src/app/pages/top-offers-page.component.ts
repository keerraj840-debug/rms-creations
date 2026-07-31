import { Component, inject, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';

interface TopOffer {
  title: string;
  description: string;
  image: string;
  images: string[];
  route: string;
  orderLink?: string;
}

@Component({
  selector: 'app-top-offers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#fdf8fa] via-[#fff5f8] to-white py-16 md:py-24">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl"></div>

        <div class="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div class="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 shadow-sm backdrop-blur-md">
            <span class="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            Seasonal offers
          </div>

          <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-[#433535] sm:text-4xl lg:text-5xl">
            Popular <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">offers</span>
          </h1>

          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#6d4d4d] sm:text-lg">
            See our best seasonal hampers and gift ideas for easy ordering.
          </p>
        </div>
      </section>

      <!-- CARDS GRID SECTION -->
      <section class="bg-gradient-to-b from-white via-[#fdf8fa] to-[#f9f0f3] py-8 md:py-10">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div 
              *ngFor="let offer of offers" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-rose-100/80 bg-white/90 shadow-md backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl"
            >
              <!-- Primary Image Box -->
              <div class="relative overflow-hidden cursor-pointer" (click)="openLightbox(offer.image, offer.title, offer.description, offer.orderLink)">
                <img 
                  [src]="offer.image" 
                  [alt]="offer.title" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#433535] backdrop-blur-md shadow-sm">
                    🔍 Inspect Image
                  </span>
                </div>
              </div>

              <!-- Card Content -->
              <div class="flex flex-1 flex-col justify-between p-8">
                <div>
                  <h2 class="text-2xl font-bold tracking-tight text-[#433535] group-hover:text-rose-600 transition-colors duration-300">
                    {{ offer.title }}
                  </h2>
                  <p class="mt-3 text-sm leading-relaxed text-[#6d4d4d]">
                    {{ offer.description }}
                  </p>

                  <!-- Image Thumbnails Strip -->
                  <div *ngIf="offer.images && offer.images.length > 1" class="mt-5 grid grid-cols-3 gap-2">
                    <img 
                      *ngFor="let subImg of offer.images.slice(0, 3)" 
                      [src]="subImg" 
                      [alt]="offer.title" 
                      (click)="openLightbox(subImg, offer.title, offer.description, offer.orderLink); $event.stopPropagation()"
                      class="h-20 w-full rounded-xl border border-rose-100 object-cover cursor-pointer transition hover:opacity-80 hover:scale-105" 
                    />
                  </div>
                </div>

                <!-- Action Links -->
                <div class="mt-8 flex flex-col gap-3 pt-4 border-t border-rose-100/80">
                  <a 
                    [routerLink]="offer.route" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-300/80 bg-white/80 px-6 py-3 text-xs font-bold uppercase tracking-wider text-rose-700 backdrop-blur-sm transition-all duration-300 hover:border-rose-400 hover:bg-rose-50 active:scale-95 shadow-sm"
                  >
                    View Details →
                  </a>

                  <a 
                    [href]="offer.orderLink" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(offer.title, 'Top Offers', offer.orderLink)" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-rose-600 hover:shadow-lg active:scale-95"
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
        *ngIf="activeLightbox" 
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
            <div class="lg:col-span-7 bg-black flex items-center justify-center overflow-hidden rounded-2xl">
              <img [src]="activeLightbox.image" [alt]="activeLightbox.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 border border-rose-200">Offer Detail View</span>
                <h3 class="mt-4 text-2xl font-bold text-[#433535]">{{ activeLightbox.title }}</h3>
                <p class="mt-3 text-sm leading-relaxed text-[#6d4d4d]">{{ activeLightbox.description }}</p>
              </div>

              <div class="mt-8">
                <a 
                  *ngIf="activeLightbox.orderLink" 
                  [href]="activeLightbox.orderLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="trackOrder(activeLightbox.title, 'Top Offers', activeLightbox.orderLink)" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-rose-600 active:scale-95"
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
export class TopOffersPageComponent implements OnInit, OnDestroy {
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);

  activeLightbox: { image: string; title: string; description: string; orderLink?: string } | null = null;

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Top Offers and Seasonal Hamper Collections',
      description: 'Explore RMS Gift Hampers top offers and seasonal gift collections for festive occasions and special celebrations.',
      keywords: 'top offers, seasonal hampers, festive gifts, friendship day hampers, ganpati gifts',
      slug: 'top-offers'
    });
  }

  offers: TopOffer[] = [
    {
      title: 'Friendship Day Collections',
      description: 'Special themed hampers and matching gift combos designed to make Friendship Day memorable.',
      image: 'assets/top_offers/friendship_day/friendship_day_girls.jpg',
      images: [
        'assets/top_offers/friendship_day/friendship_day_girls.jpg',
        'assets/top_offers/friendship_day/friendship_day_boys.jpg',
        'assets/top_offers/friendship_day/friendship_day_hamper.jpg'
      ],
      route: '/top-offers/friendship-day',
      orderLink: 'https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20am%20interested%20in%20Friendship%20Day%20Collections.'
    },
    {
      title: 'Ganpati Special Offers',
      description: 'Festive hamper ideas and celebration-ready gifting for Ganpati with bright and joyful presentation.',
      image: 'assets/top_offers/ganpati/ganpati.jpg',
      images: ['assets/top_offers/ganpati/ganpati.jpg'],
      route: '/top-offers/ganpati',
      orderLink: 'https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20am%20interested%20in%20Ganpati%20Special%20Offers.'
    },
    {
      title: 'Rakshabandhan Favorites',
      description: 'Beautifully wrapped gifts and hamper inspiration for the beloved Rakshabandhan season.',
      image: 'assets/top_offers/rakshabandhan/rakshabandhan_299.jpg',
      images: ['assets/top_offers/rakshabandhan/rakshabandhan_299.jpg'],
      route: '/top-offers/rakshabandhan',
      orderLink: 'https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20am%20interested%20in%20Rakshabandhan%20Favorites.'
    },
    {
      title: 'WhatsApp Chat Preview',
      description: 'See how customers interact with our gift suggestions and how the ordering experience feels in real time.',
      image: 'assets/top_offers/real_whatsapp_chat.jpg',
      images: ['assets/top_offers/real_whatsapp_chat.jpg'],
      route: '/top-offers/friendship-day',
      orderLink: 'https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20to%20see%20more%20details.'
    }
  ];

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightbox) {
      this.closeLightbox();
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  trackOrder(title: string, category: string, link?: string) {
    if (!link) return;
    this.orderTracker.recordOrder({
      title,
      category,
      page: 'Top Offers',
      link
    });
  }

  openLightbox(image: string, title: string, description: string, orderLink?: string) {
    this.activeLightbox = { image, title, description, orderLink };
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.activeLightbox = null;
    document.body.style.overflow = '';
  }
}