import { Component, inject, HostListener, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';

import { SupabaseService } from '../services/supabase.service';
import { CheckoutService } from '../services/checkout.service';

interface TopOffer {
  id?: number;
  title: string;
  description: string;
  image: string;
  images: string[];
  price?: number;
  route: string;
  orderLink?: string;
}

@Component({
  selector: 'app-top-offers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell transition-colors duration-300">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] dark:from-[#1E1916] dark:via-[#1A1614] dark:to-[#141210] py-12 md:py-18 transition-colors duration-300">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 dark:bg-[#DD8776]/10 blur-3xl"></div>

        <div class="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 dark:border-[#57251C] bg-[#FFFDFC]/90 dark:bg-[#2A221E]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#E89382] shadow-sm backdrop-blur-md">
            <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
            Seasonal Curation & Specials
          </div>

          <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] dark:text-[#F3ECE8] sm:text-5xl lg:text-6xl leading-[1.15]">
            Featured <span class="font-serif italic font-normal text-[#C56D5B] dark:text-[#E89382] underline decoration-[#EB9D8E] dark:decoration-[#C56D5B] decoration-wavy decoration-1 underline-offset-8">Offers & Festive Deals</span>
          </h1>

          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-lg">
            Discover limited-edition festive specials, bestselling seasonal combos, and customized gift suites.
          </p>
        </div>
      </section>

      <!-- CARDS GRID SECTION -->
      <section class="bg-[#F7F6F3] dark:bg-[#1A1614] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#382C26] transition-colors duration-300">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#C56D5B] border-t-transparent"></div>
            <p class="mt-4 text-sm font-medium text-[#57251C]/75 dark:text-[#D9C3B9]">Loading seasonal offers...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && offers.length === 0" class="text-center rounded-3xl border border-dashed border-[#D9C3B9] dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] p-12 max-w-2xl mx-auto shadow-sm">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-xl"><i class="fa-solid fa-gift"></i></div>
            <h3 class="mt-4 font-serif text-xl font-bold text-[#57251C] dark:text-[#F3ECE8]">Seasonal Offers Updating</h3>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">
              We are currently preparing new seasonal hamper specials. Explore our full hampers range or contact our studio for custom corporate requests.
            </p>
            <div class="mt-6 flex flex-wrap justify-center gap-3">
              <a 
                routerLink="/hampers"
                class="inline-flex items-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9C4738] dark:hover:bg-[#DD8776] transition active:scale-95 shadow-md"
              >
                <i class="fa-solid fa-gift text-sm"></i>
                <span>Explore Hampers</span>
              </a>
            </div>
          </div>

          <!-- Cards Grid -->
          <div *ngIf="!isLoading && offers.length > 0" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div 
              *ngFor="let offer of offers" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] dark:hover:border-[#C56D5B] hover:shadow-2xl"
            >
              <!-- Primary Image Box -->
              <div class="relative overflow-hidden cursor-pointer bg-[#FAF7F5] dark:bg-[#1E1916]" (click)="openLightbox(offer.image, offer.title, offer.description, offer.orderLink)">
                <img 
                  [src]="offer.image" 
                  [alt]="offer.title" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 px-3.5 py-1.5 text-xs font-bold text-[#57251C] dark:text-[#F3ECE8] backdrop-blur-md shadow-sm">
                    <i class="fa-solid fa-magnifying-glass-plus text-xs"></i>
                    <span>View High-Res Photo</span>
                  </span>
                </div>
              </div>

              <!-- Card Content -->
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 class="font-serif text-xl font-bold tracking-tight text-[#57251C] dark:text-[#F3ECE8] group-hover:text-[#9C4738] dark:group-hover:text-[#E89382] transition-colors duration-300">
                    {{ offer.title }}
                  </h2>
                  <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">
                    {{ offer.description }}
                  </p>

                  <!-- Image Thumbnails Strip -->
                  <div *ngIf="offer.images && offer.images.length > 1" class="mt-4 grid grid-cols-3 gap-2">
                    <img 
                      *ngFor="let subImg of offer.images.slice(0, 3)" 
                      [src]="subImg" 
                      [alt]="offer.title" 
                      (click)="openLightbox(subImg, offer.title, offer.description, offer.orderLink); $event.stopPropagation()"
                      class="h-16 w-full rounded-xl border border-[#D9C3B9]/50 dark:border-[#382C26] object-cover cursor-pointer transition hover:opacity-85 hover:scale-105" 
                    />
                  </div>
                </div>

                <!-- Action Links -->
                <div class="mt-6 flex flex-col gap-2.5 pt-4 border-t border-[#D9C3B9]/30 dark:border-[#382C26]">
                  <a 
                    [routerLink]="offer.route" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#57251C]/35 dark:border-[#57251C] bg-[#FFFDFC] dark:bg-[#2A221E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#57251C] dark:text-[#F3ECE8] shadow-sm transition-all duration-300 hover:bg-[#F7F6F3] dark:hover:bg-[#342A25] active:scale-95"
                  >
                    View Details →
                  </a>

                  <button 
                    type="button"
                    (click)="orderOffer(offer)" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <i class="fa-solid fa-bag-shopping text-sm"></i>
                    <span>Order Online (COD / UPI)</span>
                  </button>
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
        <div class="relative max-w-4xl w-full overflow-hidden rounded-3xl bg-[#FFFDFC] dark:bg-[#1E1916] p-2 shadow-2xl border border-[#D9C3B9]/60 dark:border-[#382C26]" (click)="$event.stopPropagation()">
          <button 
            type="button" 
            (click)="closeLightbox()" 
            class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#57251C] dark:bg-[#2A221E] text-base font-bold text-white transition hover:bg-[#9C4738] dark:hover:bg-[#C56D5B] cursor-pointer"
            aria-label="Close Preview"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="grid gap-0 lg:grid-cols-12">
            <div class="lg:col-span-7 bg-[#FAF7F5] dark:bg-[#141210] flex items-center justify-center overflow-hidden rounded-2xl">
              <img [src]="activeLightbox.image" [alt]="activeLightbox.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-3 py-1 text-xs font-bold text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">Offer Detail View</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C] dark:text-[#F3ECE8]">{{ activeLightbox.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9]">{{ activeLightbox.description }}</p>
              </div>

              <div class="mt-8">
                <button 
                  type="button"
                  (click)="orderOffer(activeLightbox); closeLightbox()" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] dark:hover:bg-[#DD8776] active:scale-95 cursor-pointer"
                >
                  <i class="fa-solid fa-bag-shopping text-sm"></i>
                  <span>Order Online (COD / UPI)</span>
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
export class TopOffersPageComponent implements OnInit, OnDestroy {
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly cdr = inject(ChangeDetectorRef);

  activeLightbox: { image: string; title: string; description: string; orderLink?: string } | null = null;
  isLoading = true;
  offers: TopOffer[] = [];

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Top Offers and Seasonal Hamper Collections',
      description: 'Explore RMS Gift Hampers top offers and seasonal gift collections for festive occasions and special celebrations.',
      keywords: 'top offers, seasonal hampers, festive gifts, friendship day hampers, ganpati gifts',
      slug: 'top-offers'
    });
    this.loadLiveOffers();
  }

  async loadLiveOffers() {
    try {
      this.isLoading = true;
      const { data } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true);

      if (data && data.length > 0) {
        const seasonalCats = data.filter(c => 
          c.name.toLowerCase().includes('friendship') || 
          c.name.toLowerCase().includes('ganpati') || 
          c.name.toLowerCase().includes('raksha')
        );
        if (seasonalCats.length > 0) {
          this.offers = seasonalCats.map(c => {
            const isGanpati = c.name.toLowerCase().includes('ganpati');
            const isFriendship = c.name.toLowerCase().includes('friendship');
            const route = isGanpati ? '/ganpati-hampers' : isFriendship ? '/top-offers/friendship-day' : '/top-offers/rakshabandhan';
            return {
              id: c.id,
              title: c.name,
              description: c.description || 'Festive specials and limited edition hampers.',
              image: c.image || 'assets/banners/banner.png',
              images: [c.image || 'assets/banners/banner.png'],
              price: c.price || 199,
              route: route,
              orderLink: `https://wa.me/919284905118?text=Hello%20RMS%20Creations!%20I%20am%20interested%20in%20${encodeURIComponent(c.name)}.`
            };
          });
        } else {
          this.offers = [];
        }
      } else {
        this.offers = [];
      }
    } catch {
      this.offers = [];
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightbox) {
      this.closeLightbox();
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  orderOffer(offer: { title: string; image?: string; description?: string; price?: number }) {
    this.checkoutService.open({
      title: offer.title,
      price: offer.price || 199,
      image: offer.image,
      category: 'Top Offers'
    });
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
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    this.activeLightbox = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}