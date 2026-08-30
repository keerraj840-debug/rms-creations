import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';

interface ReturnGiftCategory {
  slug: string;
  title: string;
  description: string;
  image: string;
  images: string[];
  orderLink: string;
}

const returnGiftCategories: ReturnGiftCategory[] = [
  {
    slug: 'birthday-return-gift',
    title: 'Birthday Return Gifts',
    description: 'Bright, cheerful and charming gifts for birthday guests that feel stylish and memorable.',
    image: 'assets/return_gift/birthday_return_gift/birthday_return_gift.jpg',
    images: [
      'assets/return_gift/birthday_return_gift/birthday_return_gift.jpg'
    ],
    orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20birthday%20return%20gifts.'
  },
  {
    slug: 'party-return-gifts',
    title: 'Party Return Gifts',
    description: 'Fun and festive gift options for parties, celebrations and happy little surprises.',
    image: 'assets/return_gift/party_return_gifts/party_return_gifts_english.jpg',
    images: [
      'assets/return_gift/party_return_gifts/party_return_gifts_english.jpg',
      'assets/return_gift/party_return_gifts/party_return_gifts_marathi.jpg'
    ],
    orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20party%20return%20gifts.'
  },
  {
    slug: 'wedding-return-gifts',
    title: 'Wedding Return Gifts',
    description: 'Elegant gifting ideas for wedding guests with premium presentation and warm charm.',
    image: 'assets/return_gift/wedding_return_gift/wedding_return_gift_marathi.jpg',
    images: [
      'assets/return_gift/wedding_return_gift/wedding_return_gift_marathi.jpg',
      'assets/return_gift/wedding_return_gift/wedding_return_fit_ooti.jpg'
    ],
    orderLink: 'https://wa.me/919284905118?text=Hello!%20I%20want%20wedding%20return%20gifts.'
  }
];

@Component({
  selector: 'app-return-gift-detail-page',
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
                  Return Gift Collection
                </div>

                <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] sm:text-5xl lg:text-6xl leading-[1.15]">
                  {{ category.title }}
                </h1>

                <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 sm:text-lg">
                  {{ category.description }}
                </p>

                <!-- Action Navigation Buttons -->
                <div class="mt-8 flex flex-wrap items-center gap-4">
                  <a 
                    routerLink="/return-gifts" 
                    class="inline-flex items-center justify-center gap-2 rounded-full border border-[#57251C]/35 bg-[#FFFDFC] px-8 py-3.5 text-xs font-bold text-[#57251C] transition-all duration-300 hover:bg-[#F7F6F3] active:scale-95 shadow-sm"
                  >
                    ← Back to Return Gifts
                  </a>

                  <a 
                    [href]="category.orderLink" 
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(category.title, 'Return Gifts', category.orderLink)" 
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] hover:scale-105 active:scale-95"
                  >
                    <span>💬 Order This Collection</span>
                  </a>
                </div>
              </div>

              <!-- Right Image Card Preview -->
              <div class="relative lg:col-span-5">
                <div class="group relative mx-auto max-w-md lg:max-w-none">
                  <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#EB9D8E] to-[#DD8776] opacity-35 blur-xl transition duration-500 group-hover:opacity-55"></div>
                  <img 
                    [src]="category.image" 
                    [alt]="category.title" 
                    class="relative h-[380px] w-full rounded-[2rem] border-8 border-[#FFFDFC] object-cover shadow-2xl transition duration-500 hover:scale-[1.02]" 
                  />
                </div>
              </div>

            </div>
          </ng-container>

          <!-- Fallback when collection route is missing -->
          <ng-template #notFound>
            <div class="mx-auto max-w-xl text-center py-12 rounded-3xl border border-dashed border-[#D9C3B9] bg-[#FFFDFC] p-12 shadow-sm">
              <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">Collection Not Found</span>
              <h2 class="mt-4 font-serif text-2xl font-bold text-[#57251C]">Looking for return gift options?</h2>
              <p class="mt-2 text-sm leading-relaxed text-[#57251C]/75">
                The specific collection route you requested is unavailable or has been relocated.
              </p>
              <div class="mt-6">
                <a routerLink="/return-gifts" class="inline-flex items-center gap-2 rounded-full bg-[#57251C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738]">
                  Return to Main Catalog
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
              Curated Variations
            </span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">
              More Designs in This Collection
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75">
              Tap any photo to view high resolution details or customize on WhatsApp.
            </p>
          </div>

          <!-- Gallery Grid -->
          <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let img of category.images; let idx = index" 
              class="group relative overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl cursor-pointer"
              (click)="openLightbox(img)"
            >
              <div class="relative overflow-hidden bg-[#FAF7F5]">
                <img 
                  [src]="img" 
                  [alt]="category.title + ' design ' + (idx + 1)" 
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
                <span class="rounded-full bg-[#C56D5B]/15 px-3 py-1 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">Design Detail View</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C]">{{ category?.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80">{{ category?.description }}</p>
              </div>

              <div class="mt-8">
                <a 
                  *ngIf="category?.orderLink" 
                  [href]="category?.orderLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="trackOrder(category!.title, 'Return Gifts', category!.orderLink)" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] active:scale-95"
                >
                  <span>💬 Inquire on WhatsApp</span>
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
export class ReturnGiftDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);
  private routeSub?: Subscription;

  category: ReturnGiftCategory | null = null;
  activeLightboxImage: string | null = null;

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightboxImage) {
      this.closeLightbox();
    }
  }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') ?? '';
      this.category = returnGiftCategories.find((item) => item.slug === slug) ?? null;

      if (this.category) {
        this.seo.setPageMetadata({
          title: `${this.category.title} | Return Gifts`,
          description: this.category.description,
          keywords: `${this.category.title}, return gifts, party gifts, wedding gifts`,
          slug: `return-gifts/${slug}`
        });
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    document.body.style.overflow = '';
  }

  trackOrder(title: string, category: string, link: string) {
    this.orderTracker.recordOrder({
      title,
      category,
      page: 'Return Gift Detail',
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