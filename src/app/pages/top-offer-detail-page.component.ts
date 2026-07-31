import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';

interface TopOfferCategory {
  key: string;
  title: string;
  description: string;
  images: string[];
  details: string[];
  orderLink?: string;
}

const offerCategories: TopOfferCategory[] = [
  {
    key: 'friendship-day',
    title: 'Friendship Day Collections',
    description: 'Designed for friendship gifts with coordinated his and hers hampers, this collection is the top attention page for seasonal gifting.',
    images: [
      'assets/top_offers/friendship_day/friendship_day_girls.jpg',
      'assets/top_offers/friendship_day/friendship_day_boys.jpg',
      'assets/top_offers/friendship_day/friendship_day_hamper.jpg',
      'assets/top_offers/real_whatsapp_chat.jpg'
    ],
    details: [
      'Matching signature hampers for friends',
      'Limited-time seasonal styling',
      'Perfect for group gifts and personal surprises'
    ],
    orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20am%20interested%20in%20Friendship%20Day%20Collections.'
  },
  {
    key: 'ganpati',
    title: 'Ganpati Special Offers',
    description: 'Bright festive hamper styling for Ganpati celebrations with rich colors and celebratory charm.',
    images: [
      'assets/top_offers/ganpati/ganpati.jpg'
    ],
    details: [
      'Festival-ready gifting ideas',
      'Premium presentation and warm colors',
      'Perfect for home celebrations and gifting'
    ],
    orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20am%20interested%20in%20Ganpati%20Special%20Offers.'
  },
  {
    key: 'rakshabandhan',
    title: 'Rakshabandhan Favorites',
    description: 'Thoughtful hamper ideas and premium gift styling for the Rakshabandhan season.',
    images: [
      'assets/top_offers/rakshabandhan/rakshabandhan_299.jpg'
    ],
    details: [
      'Elegant and heartfelt gift ideas',
      'Perfect for sibling and family gifting',
      'Ideal for festive surprise delivery'
    ],
    orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20am%20interested%20in%20Rakshabandhan%20Favorites.'
  }
];

@Component({
  selector: 'app-top-offer-detail-page',
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

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <ng-container *ngIf="category; else notFound">
            <div class="grid items-center gap-12 lg:grid-cols-12">
              
              <!-- Left Text Column -->
              <div class="lg:col-span-7">
                <div class="inline-flex items-center gap-2 rounded-full border border-pink-200/60 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 shadow-sm backdrop-blur-md">
                  <span class="inline-block h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Seasonal offer
                </div>

                <h1 class="mt-4 text-3xl font-extrabold tracking-tight text-[#433535] sm:text-4xl lg:text-5xl">
                  {{ category.title }}
                </h1>

                <p class="mt-4 max-w-xl text-base leading-relaxed text-[#6d4d4d] sm:text-lg">
                  {{ category.description }}
                </p>

                <!-- Key Details Bullet List -->
                <div class="mt-8 space-y-3 rounded-2xl border border-rose-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <div *ngFor="let detail of category.details" class="flex items-center gap-3 text-sm font-medium text-[#6d4d4d]">
                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-rose-600">✓</span>
                    <span>{{ detail }}</span>
                  </div>
                </div>

                <!-- Action Navigation Buttons -->
                <div class="mt-8 flex flex-wrap items-center gap-4">
                  <a 
                    routerLink="/top-offers" 
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/80 bg-white/80 px-8 py-3.5 text-sm font-semibold text-rose-700 backdrop-blur-sm transition-all duration-300 hover:border-rose-400 hover:bg-rose-50 active:scale-95 shadow-sm"
                  >
                    ← Back to All Offers
                  </a>

                  <a 
                    *ngIf="category.orderLink"
                    [href]="category.orderLink" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(category.title, 'Top Offers', category.orderLink)" 
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <span>💬 Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>

              <!-- Right Featured Image Card -->
              <div class="relative lg:col-span-5">
                <div class="group relative mx-auto max-w-md lg:max-w-none">
                  <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-pink-400 to-rose-300 opacity-30 blur-xl transition duration-500 group-hover:opacity-50"></div>
                  <img 
                    [src]="category.images[0]" 
                    [alt]="category.title" 
                    class="relative h-[380px] w-full rounded-[2rem] border-8 border-white object-cover shadow-2xl transition duration-500 hover:scale-[1.02]" 
                  />
                </div>
              </div>

            </div>
          </ng-container>

          <!-- Fallback Template when route key is missing -->
          <ng-template #notFound>
            <div class="mx-auto max-w-xl text-center py-12 rounded-3xl border border-dashed border-rose-200 bg-white p-12 shadow-sm">
              <span class="rounded-full bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600">Offer Not Found</span>
              <h2 class="mt-4 text-2xl font-bold text-[#433535]">Looking for a specific seasonal offer?</h2>
              <p class="mt-2 text-sm leading-relaxed text-[#6d4d4d]">
                The offer page you requested does not exist or has expired. Return to the Top Offers overview to browse active promotions.
              </p>
              <div class="mt-6">
                <a routerLink="/top-offers" class="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-600">
                  Back to Top Offers
                </a>
              </div>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- FOLDER GALLERY GRID SECTION -->
      <section *ngIf="category" class="bg-gradient-to-b from-white via-[#fdf8fa] to-[#f9f0f3] py-8 md:py-10">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="rounded-full bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 border border-rose-100">
              More visuals
            </span>
            <h2 class="mt-3 text-2xl font-extrabold tracking-tight text-[#433535] sm:text-3xl">
              See more in this collection
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-[#6d4d4d] sm:text-base">
              Tap any image to see more details or ask us on WhatsApp.
            </p>
          </div>

          <!-- Gallery Items Grid -->
          <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let img of category.images; let idx = index" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-rose-100/80 bg-white/90 shadow-md backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl cursor-pointer"
              (click)="openLightbox(img)"
            >
              <div class="relative overflow-hidden">
                <img 
                  [src]="img" 
                  [alt]="category.title + ' preview ' + (idx + 1)" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-[#433535] backdrop-blur-md shadow-sm">
                    🔍 Inspect High-Res Photo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LIGHTBOX PREVIEW MODAL -->
      <div 
        *ngIf="activeLightboxImage" 
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
              <img [src]="activeLightboxImage" [alt]="category?.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 border border-rose-200">Offer Detail View</span>
                <h3 class="mt-4 text-2xl font-bold text-[#433535]">{{ category?.title }}</h3>
                <p class="mt-3 text-sm leading-relaxed text-[#6d4d4d]">{{ category?.description }}</p>
              </div>

              <div class="mt-8">
                <a 
                  *ngIf="category?.orderLink" 
                  [href]="category?.orderLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="trackOrder(category!.title, 'Top Offers', category!.orderLink)" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-rose-600 active:scale-95"
                >
                  <span>💬 Confirm & Inquire on WhatsApp</span>
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
export class TopOfferDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);
  private routeSub?: Subscription;

  category: TopOfferCategory | null = null;
  activeLightboxImage: string | null = null;

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightboxImage) {
      this.closeLightbox();
    }
  }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const key = params.get('category') ?? '';
      this.category = offerCategories.find((item) => item.key === key) ?? null;

      if (this.category) {
        this.seo.setPageMetadata({
          title: `${this.category.title} | Seasonal Gifts`,
          description: this.category.description,
          keywords: `${this.category.title}, gift hamper offers, seasonal gifts`,
          slug: `top-offers/${key}`
        });
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    document.body.style.overflow = '';
  }

  trackOrder(title: string, category: string, link?: string) {
    if (!link) return;
    this.orderTracker.recordOrder({
      title,
      category,
      page: 'Top Offer Detail',
      link
    });
  }

  openLightbox(image: string) {
    this.activeLightboxImage = image;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.activeLightboxImage = null;
    document.body.style.overflow = '';
  }
}