import { Component, inject, HostListener, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';
import { SupabaseService } from '../services/supabase.service';
import { CheckoutService } from '../services/checkout.service';

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
      <div class="page-shell transition-colors duration-300">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] dark:from-[#1E1916] dark:via-[#1A1614] dark:to-[#141210] py-12 md:py-18 transition-colors duration-300">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 dark:bg-[#DD8776]/10 blur-3xl"></div>

        <div class="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 dark:border-[#57251C] bg-[#FFFDFC]/90 dark:bg-[#2A221E]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#E89382] shadow-sm backdrop-blur-md">
            <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
            Event Favours & Return Gifts
          </div>

          <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] dark:text-[#F3ECE8] sm:text-5xl lg:text-6xl leading-[1.15]">
            Thoughtful <span class="font-serif italic font-normal text-[#C56D5B] dark:text-[#E89382] underline decoration-[#EB9D8E] dark:decoration-[#C56D5B] decoration-wavy decoration-1 underline-offset-8">Return Gifts & Favours</span>
          </h1>

          <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-lg">
            Memorable, beautifully packed tokens of gratitude for weddings, birthday celebrations, baby showers, and festive gatherings.
          </p>
        </div>
      </section>

      <!-- CARDS GRID SECTION -->
      <section class="bg-[#F7F6F3] dark:bg-[#1A1614] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#382C26] transition-colors duration-300">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#C56D5B] border-t-transparent"></div>
            <p class="mt-4 text-sm font-medium text-[#57251C]/75 dark:text-[#D9C3B9]">Loading return gift collections...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && offers.length === 0" class="text-center rounded-3xl border border-dashed border-[#D9C3B9] dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] p-12 max-w-2xl mx-auto shadow-sm">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-xl"><i class="fa-solid fa-gift"></i></div>
            <h3 class="mt-4 font-serif text-xl font-bold text-[#57251C] dark:text-[#F3ECE8]">Return Gift Collections Updating</h3>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">
              We are assembling our latest batch of event favours and return gifts. Message us on WhatsApp to discuss bespoke favor themes, bulk pricing, and custom packaging.
            </p>
            <div class="mt-6">
              <a 
                href="https://wa.me/919284905118?text=Hello!%20I%20want%20to%20inquire%20about%20event%20return%20gifts." 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9C4738] dark:hover:bg-[#DD8776] transition active:scale-95 shadow-md"
              >
                <i class="fa-brands fa-whatsapp text-sm"></i>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <!-- Cards Grid -->
          <div *ngIf="!isLoading && offers.length > 0" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let item of offers" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] dark:hover:border-[#C56D5B] hover:shadow-2xl"
            >
              <!-- Card Image & Lightbox Trigger -->
              <div class="relative overflow-hidden cursor-pointer bg-[#FAF7F5] dark:bg-[#1E1916]" (click)="openLightbox(item)">
                <img 
                  [src]="item.image" 
                  [alt]="item.title" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 px-3.5 py-1.5 text-xs font-bold text-[#57251C] dark:text-[#F3ECE8] backdrop-blur-md shadow-sm">
                    <i class="fa-solid fa-magnifying-glass-plus text-xs"></i>
                    <span>View High-Res Photo</span>
                  </span>
                </div>
              </div>

              <!-- Card Details -->
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 class="font-serif text-xl font-bold tracking-tight text-[#57251C] dark:text-[#F3ECE8] group-hover:text-[#9C4738] dark:group-hover:text-[#E89382] transition-colors duration-300">
                    {{ item.title }}
                  </h2>
                  <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">
                    {{ item.description }}
                  </p>
                </div>

                <!-- Action Navigation -->
                <div class="mt-6 flex flex-col gap-2.5 pt-4 border-t border-[#D9C3B9]/30 dark:border-[#382C26]">
                  <a 
                    [routerLink]="['/return-gifts', item.slug]" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#57251C]/35 dark:border-[#57251C] bg-[#FFFDFC] dark:bg-[#2A221E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#57251C] dark:text-[#F3ECE8] shadow-sm transition-all duration-300 hover:bg-[#F7F6F3] dark:hover:bg-[#342A25] active:scale-95"
                  >
                    View Collection →
                  </a>

                  <button 
                    type="button"
                    (click)="orderGift(item)" 
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
        *ngIf="activeLightboxItem" 
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
              <img [src]="activeLightboxItem.image" [alt]="activeLightboxItem.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-3 py-1 text-xs font-bold text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">Return Gift Preview</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C] dark:text-[#F3ECE8]">{{ activeLightboxItem.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9]">{{ activeLightboxItem.description }}</p>
              </div>

              <div class="mt-8 flex flex-col gap-3">
                <a 
                  [routerLink]="['/return-gifts', activeLightboxItem.slug]" 
                  (click)="closeLightbox()"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#57251C]/35 dark:border-[#57251C] bg-[#FFFDFC] dark:bg-[#2A221E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#57251C] dark:text-[#F3ECE8] shadow-sm transition hover:bg-[#F7F6F3] dark:hover:bg-[#342A25]"
                >
                  Explore Collection
                </a>
                <button 
                  type="button"
                  (click)="orderGift(activeLightboxItem); closeLightbox()" 
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
export class ReturnGiftPageComponent implements OnInit, OnDestroy {
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly cdr = inject(ChangeDetectorRef);

  activeLightboxItem: ReturnGiftOffer | null = null;
  isLoading = true;
  offers: ReturnGiftOffer[] = [];

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Return Gifts for Birthdays, Weddings and Parties',
      description: 'Choose thoughtful return gifts for birthdays, weddings and parties from RMS Gift Hampers with elegant presentation and simple ordering.',
      keywords: 'return gifts, birthday return gifts, wedding return gifts, party return gifts',
      slug: 'return-gifts'
    });
    this.loadLiveReturnGifts();
  }

  async loadLiveReturnGifts() {
    try {
      this.isLoading = true;
      const [pRes, cRes] = await Promise.all([
        this.supabase.from('products').select('*').eq('is_active', true),
        this.supabase.from('categories').select('id, name')
      ]);

      const catMap = new Map<number, string>();
      if (cRes.data) {
        cRes.data.forEach((c: any) => catMap.set(Number(c.id), c.name));
      }

      if (pRes.data && pRes.data.length > 0) {
        const returnGiftProds = pRes.data.filter(p => {
          const catName = catMap.get(Number(p.category_id)) || '';
          return (p.name && p.name.toLowerCase().includes('return gift')) ||
                 catName.toLowerCase().includes('return gift');
        });
        if (returnGiftProds.length > 0) {
          this.offers = returnGiftProds.map(p => {
            const lower = p.name.toLowerCase();
            const slug = lower.includes('birthday') ? 'birthday-return-gift' :
                         lower.includes('wedding') ? 'wedding-return-gifts' : 'party-return-gifts';
            return {
              slug: slug,
              title: p.name,
              description: p.description || 'Thoughtful return gift favors with elegant boutique finish.',
              image: (p.images && p.images[0]) || 'assets/banners/banner.png',
              orderLink: `https://wa.me/919284905118?text=Hello!%20I%20want%20to%20order%20${encodeURIComponent(p.name)}.`
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
    if (this.activeLightboxItem) {
      this.closeLightbox();
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  orderGift(item: { title: string; image?: string; description?: string }) {
    this.checkoutService.open({
      title: item.title,
      price: 399,
      image: item.image,
      category: 'Return Gifts'
    });
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
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    this.activeLightboxItem = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}