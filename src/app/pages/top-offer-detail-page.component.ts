import { Component, inject, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';
import { SupabaseService } from '../services/supabase.service';
import { CheckoutService } from '../services/checkout.service';

interface TopOfferCategory {
  key: string;
  title: string;
  description: string;
  images: string[];
  details: string[];
  orderLink?: string;
}

@Component({
  selector: 'app-top-offer-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell transition-colors duration-300">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#C56D5B] border-t-transparent"></div>
        <p class="mt-4 text-sm font-medium text-[#57251C]/75 dark:text-[#D9C3B9]">Loading offer details...</p>
      </div>

      <!-- Content when loaded -->
      <ng-container *ngIf="!isLoading">
        <!-- HERO HEADER SECTION -->
        <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] dark:from-[#1E1916] dark:via-[#1A1614] dark:to-[#141210] py-12 md:py-18 transition-colors duration-300">
          <!-- Ambient Decorative Lighting -->
          <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
          <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 dark:bg-[#DD8776]/10 blur-3xl"></div>

          <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <ng-container *ngIf="category; else notFound">
              <div class="grid items-center gap-12 lg:grid-cols-12">
                
                <!-- Left Text Column -->
                <div class="lg:col-span-7">
                  <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 dark:border-[#57251C] bg-[#FFFDFC]/90 dark:bg-[#2A221E]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#E89382] shadow-sm backdrop-blur-md">
                    <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
                    Seasonal Collection Spotlight
                  </div>

                  <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] dark:text-[#F3ECE8] sm:text-5xl lg:text-6xl leading-[1.15]">
                    {{ category.title }}
                  </h1>

                  <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-lg">
                    {{ category.description }}
                  </p>

                  <!-- Key Details Bullet List -->
                  <div class="mt-8 space-y-3 rounded-2xl border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC]/90 dark:bg-[#231C18]/90 p-6 shadow-sm backdrop-blur-sm">
                    <div *ngFor="let detail of category.details" class="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#57251C]/85 dark:text-[#D9C3B9]">
                      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 text-xs font-bold text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">
                        <i class="fa-solid fa-check text-[10px]"></i>
                      </span>
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
                      <i class="fa-solid fa-play text-xs"></i>
                      <span>Watch Video Demo & Order Kits</span>
                    </a>

                    <a 
                      routerLink="/top-offers" 
                      class="inline-flex items-center justify-center gap-2 rounded-full border border-[#57251C]/35 dark:border-[#57251C] bg-[#FFFDFC] dark:bg-[#2A221E] px-8 py-3.5 text-xs font-bold text-[#57251C] dark:text-[#F3ECE8] backdrop-blur-sm transition-all duration-300 hover:bg-[#F7F6F3] dark:hover:bg-[#342A25] active:scale-95 shadow-sm"
                    >
                      <i class="fa-solid fa-arrow-left text-xs"></i>
                      <span>Back to All Offers</span>
                    </a>

                    <button 
                      type="button"
                      (click)="orderOfferHamper()" 
                      class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <i class="fa-solid fa-bag-shopping text-sm"></i>
                      <span>Order Online (COD / UPI)</span>
                    </button>
                  </div>
                </div>

                <!-- Right Featured Image Card -->
                <div class="relative lg:col-span-5">
                  <div class="group relative mx-auto max-w-md lg:max-w-none">
                    <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#EB9D8E] to-[#DD8776] opacity-35 blur-xl transition duration-500 group-hover:opacity-55"></div>
                    <img 
                      [src]="category.images[0]" 
                      [alt]="category.title" 
                      class="relative h-[380px] w-full rounded-[2rem] border-8 border-[#FFFDFC] dark:border-[#231C18] object-cover shadow-2xl transition duration-500 hover:scale-[1.02]" 
                    />
                  </div>
                </div>

              </div>
            </ng-container>

            <!-- Fallback Template when route key is missing -->
            <ng-template #notFound>
              <div class="mx-auto max-w-xl text-center py-12 rounded-3xl border border-dashed border-[#D9C3B9] dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] p-12 shadow-sm">
                <span class="inline-block rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">Offer Not Found</span>
                <h2 class="mt-4 font-serif text-2xl font-bold text-[#57251C] dark:text-[#F3ECE8]">Looking for a specific seasonal offer?</h2>
                <p class="mt-2 text-sm leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">
                  The offer page you requested does not exist or has expired. Return to the Top Offers overview to browse active promotions.
                </p>
                <div class="mt-6">
                  <a routerLink="/top-offers" class="inline-flex items-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] dark:hover:bg-[#DD8776]">
                    Back to Top Offers
                  </a>
                </div>
              </div>
            </ng-template>
          </div>
        </section>

        <!-- FOLDER GALLERY GRID SECTION -->
        <section *ngIf="category" class="bg-[#F7F6F3] dark:bg-[#1A1614] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#382C26] transition-colors duration-300">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
              <span class="inline-block rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">
                Visual Highlights
              </span>
              <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C] dark:text-[#F3ECE8]">
                More In This Collection
              </h2>
              <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">
                Tap any photo to view high resolution details or place an online order.
              </p>
            </div>

            <!-- Gallery Items Grid -->
            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div 
                *ngFor="let img of category.images; let idx = index" 
                class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] dark:hover:border-[#C56D5B] hover:shadow-2xl cursor-pointer"
                (click)="openLightbox(img)"
              >
                <div class="relative overflow-hidden bg-[#FAF7F5] dark:bg-[#1E1916]">
                  <img 
                    [src]="img" 
                    [alt]="category.title + ' preview ' + (idx + 1)" 
                    class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 px-3.5 py-1.5 text-xs font-bold text-[#57251C] dark:text-[#F3ECE8] backdrop-blur-md shadow-sm">
                      <i class="fa-solid fa-magnifying-glass text-[11px] text-[#C56D5B]"></i>
                      View High-Res Photo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ng-container>

      <!-- LIGHTBOX PREVIEW MODAL -->
      <div 
        *ngIf="activeLightboxImage" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md transition-opacity duration-300"
        (click)="closeLightbox()"
      >
        <div class="relative max-w-4xl w-full overflow-hidden rounded-3xl bg-[#FFFDFC] dark:bg-[#1E1916] p-2 shadow-2xl border border-[#D9C3B9]/60 dark:border-[#382C26]" (click)="$event.stopPropagation()">
          <button 
            type="button" 
            (click)="closeLightbox()" 
            class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#57251C] dark:bg-[#2A221E] text-sm font-bold text-white transition hover:bg-[#9C4738] dark:hover:bg-[#C56D5B]"
            aria-label="Close Preview"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="grid gap-0 lg:grid-cols-12">
            <div class="lg:col-span-7 bg-[#FAF7F5] dark:bg-[#141210] flex items-center justify-center overflow-hidden rounded-2xl">
              <img [src]="activeLightboxImage" [alt]="category?.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-3 py-1 text-xs font-bold text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">Offer Detail View</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C] dark:text-[#F3ECE8]">{{ category?.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9]">{{ category?.description }}</p>
              </div>

              <div class="mt-8">
                <button 
                  type="button"
                  (click)="orderOfferHamper()" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] dark:hover:bg-[#DD8776] active:scale-95 cursor-pointer"
                >
                  <i class="fa-solid fa-bag-shopping text-sm"></i>
                  <span>Order Offer Hamper (COD / Online UPI)</span>
                </button>
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
  public readonly checkoutService = inject(CheckoutService);
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly cdr = inject(ChangeDetectorRef);
  private routeSub?: Subscription;

  category: TopOfferCategory | null = null;
  activeLightboxImage: string | null = null;
  isLoading = true;

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightboxImage) {
      this.closeLightbox();
    }
  }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const key = params.get('category') ?? '';
      this.loadLiveCategory(key);
    });
  }

  async loadLiveCategory(key: string) {
    if (!key) {
      this.category = null;
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    try {
      this.isLoading = true;
      const { data: categories } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true);

      const cat = categories?.find(c => {
        const name = c.name.toLowerCase();
        const slug = name.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const cleanKey = key.toLowerCase().replace(/-/g, ' ');
        return slug === key.toLowerCase() || name.includes(cleanKey) || cleanKey.includes(name);
      });

      if (cat) {
      const { data: prods } = await this.supabase
        .from('products')
        .select('*')
        .eq('category_id', cat.id)
        .eq('is_active', true)
        .order('id', { ascending: true });

      const images = (prods && prods.length > 0)
        ? prods.map(p => (p.images && p.images[0]) || cat.image || 'assets/banners/banner.png').filter(Boolean)
        : (cat.image ? [cat.image] : ['assets/banners/banner.png']);

      this.category = {
        key: key,
        title: cat.name,
        description: cat.description || 'Festive specials and artisanal seasonal gifts.',
        images: images,
        details: [
          cat.description || 'Artisanal handcrafted gift collection.',
          cat.price ? `Starting from ₹${cat.price}` : 'Bespoke pricing based on curation',
          'Custom branding and doorstep delivery available'
        ],
        orderLink: `https://wa.me/919284905118?text=Hello!%20I%20am%20interested%20in%20${encodeURIComponent(cat.name)}.`
      };

      this.seo.setPageMetadata({
        title: `${this.category.title} | Seasonal Gifts`,
        description: this.category.description,
        keywords: `${this.category.title}, gift hamper offers, seasonal gifts`,
        slug: `top-offers/${key}`
      });
    } else {
      this.category = null;
    }
  } catch {
    this.category = null;
  } finally {
    this.isLoading = false;
    this.cdr.markForCheck();
  }
}

  orderOfferHamper() {
    if (!this.category) return;
    const priceVal = parseInt(this.category.title.match(/₹(\d+)/)?.[1] || '', 10) || 499;
    this.checkoutService.open({
      title: this.category.title,
      price: priceVal,
      image: this.category.images?.[0],
      category: 'Top Offers'
    });
    if (this.activeLightboxImage) {
      this.closeLightbox();
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
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
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    this.activeLightboxImage = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}