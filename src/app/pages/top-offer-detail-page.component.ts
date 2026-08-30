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
    title: 'Ganpati Hampers & Pooja Kits',
    description: 'Ready Ganpati Pooja Kits starting at ₹99 and ₹149. Packed with Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad, Kumkum, and dry fruits in clean, spill-proof boxes.',
    images: [
      'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
      'assets/ganpati-pooja-kit-hamper-2026/99_hamper.png',
      'assets/top_offers/ganpati/ganpati.jpg'
    ],
    details: [
      '₹99 Box: Dhup, Kapoor, Kapus Vaat, Dhup Batti, Halad & Kumkum',
      '₹149 Box: All 6 pooja items PLUS a separate box of Kaju, Badam & Manuka',
      'Separate box sections so halad and kumkum will not spill',
      'Perfect for home aarti and return gifts for society visitors & relatives'
    ],
    orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20am%20interested%20in%20Ganpati%20Hampers%20and%20Pooja%20Kits.'
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
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] py-12 md:py-18">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 blur-3xl"></div>

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <ng-container *ngIf="category; else notFound">
            <div class="grid items-center gap-12 lg:grid-cols-12">
              
              <!-- Left Text Column -->
              <div class="lg:col-span-7">
                <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 bg-[#FFFDFC]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] shadow-sm backdrop-blur-md">
                  <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
                  Seasonal Collection Spotlight
                </div>

                <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] sm:text-5xl lg:text-6xl leading-[1.15]">
                  {{ category.title }}
                </h1>

                <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 sm:text-lg">
                  {{ category.description }}
                </p>

                <!-- Key Details Bullet List -->
                <div class="mt-8 space-y-3 rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC]/90 p-6 shadow-sm backdrop-blur-sm">
                  <div *ngFor="let detail of category.details" class="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#57251C]/85">
                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C56D5B]/15 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">✓</span>
                    <span>{{ detail }}</span>
                  </div>
                </div>

                <!-- Action Navigation Buttons -->
                <div class="mt-8 flex flex-wrap items-center gap-4">
                  <a 
                    *ngIf="category.key === 'ganpati'"
                    routerLink="/ganpati-hampers"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#9C4738] via-[#C56D5B] to-[#57251C] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-lg shadow-[#9C4738]/25 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <span>🌺 Watch Video Demo & Order Kits</span>
                  </a>

                  <a 
                    routerLink="/top-offers" 
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-[#57251C]/35 bg-[#FFFDFC] px-8 py-3.5 text-xs font-bold text-[#57251C] backdrop-blur-sm transition-all duration-300 hover:bg-[#F7F6F3] active:scale-95 shadow-sm"
                  >
                    ← Back to All Offers
                  </a>

                  <a 
                    *ngIf="category.orderLink"
                    [href]="category.orderLink" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(category.title, 'Top Offers', category.orderLink)" 
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] hover:scale-105 active:scale-95"
                  >
                    <span>💬 Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>

              <!-- Right Featured Image Card -->
              <div class="relative lg:col-span-5">
                <div class="group relative mx-auto max-w-md lg:max-w-none">
                  <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#EB9D8E] to-[#DD8776] opacity-35 blur-xl transition duration-500 group-hover:opacity-55"></div>
                  <img 
                    [src]="category.images[0]" 
                    [alt]="category.title" 
                    class="relative h-[380px] w-full rounded-[2rem] border-8 border-[#FFFDFC] object-cover shadow-2xl transition duration-500 hover:scale-[1.02]" 
                  />
                </div>
              </div>

            </div>
          </ng-container>

          <!-- Fallback Template when route key is missing -->
          <ng-template #notFound>
            <div class="mx-auto max-w-xl text-center py-12 rounded-3xl border border-dashed border-[#D9C3B9] bg-[#FFFDFC] p-12 shadow-sm">
              <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">Offer Not Found</span>
              <h2 class="mt-4 font-serif text-2xl font-bold text-[#57251C]">Looking for a specific seasonal offer?</h2>
              <p class="mt-2 text-sm leading-relaxed text-[#57251C]/75">
                The offer page you requested does not exist or has expired. Return to the Top Offers overview to browse active promotions.
              </p>
              <div class="mt-6">
                <a routerLink="/top-offers" class="inline-flex items-center gap-2 rounded-full bg-[#57251C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738]">
                  Back to Top Offers
                </a>
              </div>
            </div>
          </ng-template>
        </div>
      </section>

      <!-- FOLDER GALLERY GRID SECTION -->
      <section *ngIf="category" class="bg-[#F7F6F3] py-12 md:py-16 border-t border-[#D9C3B9]/40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">
              Visual Highlights
            </span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">
              More In This Collection
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75">
              Tap any photo to view high resolution details or customize on WhatsApp.
            </p>
          </div>

          <!-- Gallery Items Grid -->
          <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let img of category.images; let idx = index" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl cursor-pointer"
              (click)="openLightbox(img)"
            >
              <div class="relative overflow-hidden bg-[#FAF7F5]">
                <img 
                  [src]="img" 
                  [alt]="category.title + ' preview ' + (idx + 1)" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="rounded-full bg-[#FFFDFC]/95 px-3.5 py-1.5 text-xs font-bold text-[#57251C] backdrop-blur-md shadow-sm">
                    🔍 View High-Res Photo
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
              <img [src]="activeLightboxImage" [alt]="category?.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-[#C56D5B]/15 px-3 py-1 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">Offer Detail View</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C]">{{ category?.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80">{{ category?.description }}</p>
              </div>

              <div class="mt-8">
                <a 
                  *ngIf="category?.orderLink" 
                  [href]="category?.orderLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="trackOrder(category!.title, 'Top Offers', category!.orderLink)" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] active:scale-95"
                >
                  <span>💬 Confirm on WhatsApp</span>
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