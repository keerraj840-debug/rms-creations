import { Component, inject, HostListener, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { OrderTrackingService } from '../shared/order-tracking.service';
import { SupabaseService } from '../services/supabase.service';
import { CheckoutService } from '../services/checkout.service';

export interface GalleryItem {
  title: string;
  description: string;
  image: string;
  price?: number;
  orderLink?: string;
}

@Component({
  selector: 'app-gallery-page',
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

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid items-center gap-12 lg:grid-cols-12">
            
            <!-- Left Text Content -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 dark:border-[#57251C] bg-[#FFFDFC]/90 dark:bg-[#2A221E]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#E89382] shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
                Editorial Lookbook
              </div>

              <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] dark:text-[#F3ECE8] sm:text-5xl lg:text-6xl leading-[1.15]">
                Curated Gifting <span class="font-serif italic font-normal text-[#C56D5B] dark:text-[#E89382] underline decoration-[#EB9D8E] dark:decoration-[#C56D5B] decoration-wavy decoration-1 underline-offset-8">Lookbook & Gallery</span>
              </h1>

              <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-lg">
                Explore real creations, packaging finishes, and bespoke styling inspirations crafted with love.
              </p>

              <!-- Hero Note Badge -->
              <div class="mt-8 flex items-start gap-4 rounded-2xl border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC]/90 dark:bg-[#231C18]/90 p-4 shadow-sm backdrop-blur-sm sm:items-center">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F6F3] dark:bg-[#1E1916] text-lg text-[#C56D5B] border border-[#D9C3B9]/40 dark:border-[#382C26]">
                  <i class="fa-solid fa-camera-retro"></i>
                </div>
                <p class="text-xs font-medium leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-sm">
                  Browse authentic client commissions and select your favorite aesthetic.
                </p>
              </div>

              <!-- Action Navigation -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  routerLink="/build-hamper" 
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <i class="fa-solid fa-wand-magic-sparkles text-sm text-[#EB9D8E]"></i>
                  <span>Build Your Own Hamper</span>
                </a>

                <a 
                  routerLink="/contact" 
                  class="inline-flex items-center justify-center gap-2 rounded-full border border-[#57251C]/35 dark:border-[#57251C] bg-[#FFFDFC] dark:bg-[#2A221E] px-8 py-3.5 text-xs font-bold text-[#57251C] dark:text-[#F3ECE8] backdrop-blur-sm transition-all duration-300 hover:bg-[#F7F6F3] dark:hover:bg-[#342A25] active:scale-95 shadow-sm"
                >
                  <i class="fa-solid fa-envelope text-xs"></i>
                  <span>Contact Studio</span>
                </a>
              </div>
            </div>

            <!-- Right Hero Image Preview -->
            <div class="relative lg:col-span-5">
              <div class="group relative mx-auto max-w-md lg:max-w-none">
                <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#EB9D8E] to-[#DD8776] opacity-35 blur-xl transition duration-500 group-hover:opacity-55"></div>
                <img 
                  src="assets/banners/flowers.png" 
                  alt="Gallery preview" 
                  class="relative h-[380px] w-full rounded-[2rem] border-8 border-[#FFFDFC] dark:border-[#231C18] object-cover shadow-2xl transition duration-500 hover:scale-[1.02]" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- GALLERY GRID SECTION -->
      <section class="bg-[#F7F6F3] dark:bg-[#1A1614] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#382C26] transition-colors duration-300">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">
              Design Catalog
            </span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C] dark:text-[#F3ECE8]">
              Featured Hamper Styles
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">
              Tap any photo to view full details or order directly online with COD / UPI.
            </p>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-16 text-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#C56D5B] border-t-transparent"></div>
            <p class="mt-4 text-sm font-medium text-[#57251C]/75 dark:text-[#D9C3B9]">Loading gallery lookbook...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!isLoading && galleryItems.length === 0" class="mt-12 text-center rounded-3xl border border-dashed border-[#D9C3B9] dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] p-12 max-w-2xl mx-auto shadow-sm">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C56D5B]/10 text-3xl text-[#C56D5B]">
              <i class="fa-solid fa-camera-retro"></i>
            </div>
            <h3 class="mt-4 font-serif text-xl font-bold text-[#57251C] dark:text-[#F3ECE8]">Lookbook Updating</h3>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">
              Our latest client commissions and seasonal gift hampers are being curated for this lookbook. Connect with us on WhatsApp to view custom past creations!
            </p>
            <div class="mt-6">
              <a 
                routerLink="/build-hamper" 
                class="inline-flex items-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9C4738] dark:hover:bg-[#DD8776] transition active:scale-95 shadow-md cursor-pointer"
              >
                <i class="fa-solid fa-wand-magic-sparkles text-sm text-[#EB9D8E]"></i>
                <span>Build Custom Hamper</span>
              </a>
            </div>
          </div>

          <!-- Gallery Items Grid -->
          <div *ngIf="!isLoading && galleryItems.length > 0" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let item of galleryItems" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#382C26] bg-[#FFFDFC] dark:bg-[#231C18] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] dark:hover:border-[#C56D5B] hover:shadow-2xl"
            >
              <!-- Card Image & Lightbox Trigger -->
              <div class="relative overflow-hidden cursor-pointer bg-[#FAF7F5] dark:bg-[#1E1916]" (click)="openLightbox(item)">
                <img 
                  [src]="item.image" 
                  [alt]="item.title" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                
                <!-- Price Badge overlay if price property exists -->
                <div *ngIf="item.price" class="absolute top-4 right-4 rounded-full bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 px-3 py-1 font-serif text-xs font-bold text-[#9C4738] dark:text-[#E89382] shadow-sm backdrop-blur-md border border-[#D9C3B9]/40 dark:border-[#382C26]">
                  ₹{{ item.price }}
                </div>

                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 px-3.5 py-1.5 text-xs font-bold text-[#57251C] dark:text-[#F3ECE8] backdrop-blur-md shadow-sm">
                    <i class="fa-solid fa-magnifying-glass text-[11px] text-[#C56D5B]"></i>
                    View High-Res Photo
                  </span>
                </div>
              </div>

              <!-- Card Details -->
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 class="font-serif text-xl font-bold tracking-tight text-[#57251C] dark:text-[#F3ECE8] group-hover:text-[#9C4738] dark:group-hover:text-[#E89382] transition-colors duration-300">
                    {{ item.title }}
                  </h3>
                  <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">
                    {{ item.description }}
                  </p>
                </div>

                <!-- Order Quick Action -->
                <div class="mt-6 pt-4 border-t border-[#D9C3B9]/30 dark:border-[#382C26]">
                  <button 
                    type="button"
                    (click)="orderItem(item)"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:shadow-lg active:scale-95 cursor-pointer"
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
            class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#57251C] dark:bg-[#2A221E] text-sm font-bold text-white transition hover:bg-[#9C4738] dark:hover:bg-[#C56D5B]"
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
                <span class="rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-3 py-1 text-xs font-bold text-[#9C4738] dark:text-[#E89382] border border-[#C56D5B]/25 dark:border-[#C56D5B]/40">Design Detail View</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C] dark:text-[#F3ECE8]">{{ activeLightboxItem.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9]">{{ activeLightboxItem.description }}</p>
              </div>

              <div class="mt-8">
                <button 
                  type="button"
                  (click)="orderItem(activeLightboxItem); closeLightbox()" 
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
export class GalleryPageComponent implements OnInit, OnDestroy {
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly cdr = inject(ChangeDetectorRef);

  galleryItems: GalleryItem[] = [];
  activeLightboxItem: GalleryItem | null = null;
  isLoading = true;

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Hamper Gallery and Styling Inspiration',
      description: 'Browse RMS Gift Hampers gallery ideas and discover beautiful hamper styling inspiration for your next gift.',
      keywords: 'hamper gallery, gift hamper inspiration, hamper styling ideas, custom hamper designs',
      slug: 'gallery'
    });
    this.loadLiveGallery();
  }

  async loadLiveGallery() {
    try {
      this.isLoading = true;
      const [pRes, cRes] = await Promise.all([
        this.supabase.from('products').select('*').eq('is_active', true).order('id', { ascending: false }),
        this.supabase.from('categories').select('*')
      ]);

      const catMap = new Map<number, any>();
      if (cRes.data) {
        cRes.data.forEach((c: any) => catMap.set(Number(c.id), c));
      }

      if (pRes.data && pRes.data.length > 0) {
        this.galleryItems = pRes.data.map((p: any) => {
          const cat = catMap.get(Number(p.category_id));
          const image = (p.images && p.images[0]) || cat?.image || 'assets/banners/banner.png';
          const price = parseInt(p.name.match(/₹(\d+)/)?.[1] || String(cat?.price || 199), 10);
          return {
            title: p.name,
            description: p.description || 'Artisanal gift hamper curation.',
            image: image,
            price: price,
            orderLink: `https://wa.me/919284905118?text=Hello!%20I%20am%20interested%20in%20${encodeURIComponent(p.name)}.`
          };
        });
      } else {
        this.galleryItems = [];
      }
    } catch {
      this.galleryItems = [];
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

  orderItem(item: { title: string; image?: string; price?: number; description?: string }) {
    this.checkoutService.open({
      title: item.title,
      price: item.price || 499,
      image: item.image,
      category: 'Gift Gallery'
    });
  }

  trackOrder(title: string, category: string, link?: string) {
    if (!link) return;
    this.orderTracker.recordOrder({
      title,
      category,
      page: 'Gift Gallery',
      link
    });
  }

  openLightbox(item: GalleryItem) {
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