import { Component, inject, HostListener, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { CartService } from '../services/cart.service';

export interface GalleryItem {
  id?: number;
  title: string;
  description: string;
  image: string;
  price?: number;
  category?: string;
  orderLink?: string;
}

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-20">

        <!-- MAIN GALLERY CONTAINER (FLUID ) -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">

          <!-- Sleek Compact Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#EADFD2]/70 dark:border-white/10">
            <div>
              <h1 class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
                Lookbook &amp; Editorial Gallery
              </h1>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                Handcrafted hampers, satin ribbon wraps, and bespoke party favor commissions
              </p>
            </div>
            <div class="flex items-center gap-2">
              <a
                routerLink="/build-hamper"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold shadow-2xs transition active:scale-95"
              >
                <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                <span>Build Custom Hamper</span>
              </a>
              <a
                routerLink="/shop"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-[#57251C] dark:text-[#F4F1ED] shadow-2xs hover:border-[#9C4738] transition"
              >
                <i class="fa-solid fa-bag-shopping text-xs"></i>
                <span>Shop Catalogue</span>
              </a>
            </div>
          </div>

          <!-- TOOLBAR: CATEGORY FILTER PILLS & LIVE COUNTER -->
          <div class="bg-white dark:bg-[#1E1916] rounded-2xl p-3.5 sm:p-4 border border-[#EADFD2] dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <!-- Category Pills Horizontal Scroll -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
              <button
                type="button"
                *ngFor="let cat of categories"
                (click)="selectedCategory = cat"
                [class]="selectedCategory === cat
                  ? 'bg-[#9C4738] text-white font-bold shadow-xs'
                  : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825] dark:hover:text-[#F4F1ED] border border-[#EADFD2] dark:border-white/10 font-medium'"
                class="min-h-[36px] px-3.5 py-1.5 rounded-full text-xs shrink-0 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                {{ cat }}
              </button>
            </div>

            <!-- Items Counter -->
            <div class="text-xs text-[#7A6C5E] dark:text-[#C5A393] font-medium shrink-0 text-right">
              Showing <strong class="text-[#2E2825] dark:text-[#F4F1ED]">{{ filteredItems.length }}</strong> lookbook creations
            </div>
          </div>

          <!-- LOADING STATE -->
          <div *ngIf="isLoading" class="flex flex-col items-center justify-center py-20 text-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#9C4738] border-t-transparent mx-auto"></div>
            <p class="mt-4 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393]">Loading lookbook gallery...</p>
          </div>

          <!-- EMPTY STATE -->
          <div *ngIf="!isLoading && filteredItems.length === 0" class="mt-8 text-center rounded-3xl border border-dashed border-[#D9C3B9] dark:border-[#382C26] bg-white dark:bg-[#1E1916] p-10 max-w-md mx-auto shadow-xs">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F2] dark:bg-white/5 text-2xl text-[#9C4738] dark:text-[#EB9D8E]">
              <i class="fa-solid fa-camera-retro"></i>
            </div>
            <h3 class="mt-3 font-serif text-lg font-bold text-[#2E2825] dark:text-[#F4F1ED]">No creations found</h3>
            <p class="mt-1 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
              Try selecting "All Creations" to view our complete portfolio.
            </p>
            <button 
              type="button" 
              (click)="selectedCategory = 'All Creations'"
              class="mt-4 px-5 py-2 rounded-full bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition cursor-pointer"
            >
              Reset Filter
            </button>
          </div>

          <!-- HIGH-DENSITY RESPONSIVE PHOTO GRID (2-col mobile, 3-col tablet, 4-col desktop) -->
          <div *ngIf="!isLoading && filteredItems.length > 0" class="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            <div 
              *ngFor="let item of filteredItems" 
              class="group bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#9C4738]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <!-- Image Card & Click Lightbox -->
              <div class="relative overflow-hidden cursor-pointer bg-[#FAF7F2] dark:bg-[#251F1C] aspect-square" (click)="openLightbox(item)">
                <img 
                  [src]="item.image" 
                  [alt]="item.title" 
                  loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />

                <!-- Category Badge -->
                <span *ngIf="item.category" class="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/90 dark:bg-[#1E1916]/90 text-[#9C4738] dark:text-[#EB9D8E] backdrop-blur-md shadow-2xs border border-[#EADFD2]/60 truncate max-w-[110px]">
                  {{ item.category }}
                </span>

                <!-- Price overlay -->
                <span *ngIf="item.price" class="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#57251C]/90 text-white backdrop-blur-md shadow-xs font-mono">
                  ₹{{ item.price }}
                </span>

                <!-- Quick Zoom Hover Icon -->
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span class="w-8 h-8 rounded-full bg-white/90 text-[#57251C] flex items-center justify-center text-xs shadow-md">
                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                  </span>
                </div>
              </div>

              <!-- Card Details & Actions -->
              <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  <h3 
                    (click)="openLightbox(item)"
                    class="font-serif font-bold text-xs sm:text-sm text-[#2E2825] dark:text-[#F4F1ED] group-hover:text-[#9C4738] dark:group-hover:text-[#EB9D8E] transition-colors cursor-pointer line-clamp-1"
                    [title]="item.title"
                  >
                    {{ item.title }}
                  </h3>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-2 mt-1 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>

                <div class="pt-2 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-between gap-2">
                  <span class="font-serif font-bold text-sm text-[#9C4738] dark:text-[#EB9D8E]">
                    ₹{{ item.price || 499 }}
                  </span>

                  <!-- 1-Click Order Online Button -->
                  <button 
                    type="button"
                    (click)="orderItem(item)"
                    class="min-h-[34px] px-3 py-1.5 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] text-white text-[11px] font-bold transition flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer shrink-0"
                    title="Add to Cart"
                  >
                    <i class="fa-solid fa-cart-shopping text-[10px]"></i>
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </main>

        <!-- LIGHTBOX PREVIEW MODAL -->
        <div 
          *ngIf="activeLightboxItem" 
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-300"
          (click)="closeLightbox()"
        >
          <div class="relative max-w-3xl w-full overflow-hidden rounded-3xl bg-[#FFFDFC] dark:bg-[#1E1916] p-2 shadow-2xl border border-[#EADFD2] dark:border-white/10" (click)="$event.stopPropagation()">
            <button 
              type="button" 
              (click)="closeLightbox()" 
              class="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 hover:bg-black text-xs font-bold text-white transition cursor-pointer"
              aria-label="Close Preview"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
            
            <div class="grid gap-0 lg:grid-cols-12 items-center">
              <div class="lg:col-span-7 bg-[#FAF7F2] dark:bg-[#141210] flex items-center justify-center overflow-hidden rounded-2xl aspect-square">
                <img [src]="activeLightboxItem.image" [alt]="activeLightboxItem.title" class="max-h-[75vh] w-full object-contain p-2" />
              </div>

              <div class="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5 space-y-4">
                <div>
                  <span class="rounded-full bg-[#EADFD2]/70 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider">
                    {{ activeLightboxItem.category || 'Curated Design' }}
                  </span>
                  <h3 class="mt-2 font-serif text-xl sm:text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                    {{ activeLightboxItem.title }}
                  </h3>
                  <p class="mt-2 text-xs leading-relaxed text-[#7A6C5E] dark:text-[#C5A393]">
                    {{ activeLightboxItem.description }}
                  </p>
                  <p class="mt-3 font-serif font-bold text-2xl text-[#9C4738] dark:text-[#EB9D8E]">
                    ₹{{ activeLightboxItem.price || 499 }}
                  </p>
                </div>

                <div class="space-y-2 pt-2 border-t border-[#EADFD2]/60 dark:border-white/10">
                  <button 
                    type="button"
                    (click)="orderItem(activeLightboxItem); closeLightbox()" 
                    class="w-full py-3 rounded-xl bg-gradient-to-r from-[#57251C] to-[#9C4738] hover:from-[#451B14] hover:to-[#883B2D] text-white text-xs font-bold uppercase tracking-wider shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i class="fa-solid fa-bag-shopping text-xs"></i>
                    <span>Add to Cart &amp; Checkout</span>
                  </button>

                  <a 
                    [href]="activeLightboxItem.orderLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="w-full py-2.5 rounded-xl border border-emerald-600/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                    <span>Inquire on WhatsApp</span>
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
export class GalleryPageComponent implements OnInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  galleryItems: GalleryItem[] = [];
  activeLightboxItem: GalleryItem | null = null;
  isLoading = true;

  selectedCategory = 'All Creations';
  categories: string[] = ['All Creations'];

  get filteredItems(): GalleryItem[] {
    if (this.selectedCategory === 'All Creations') {
      return this.galleryItems;
    }
    return this.galleryItems.filter(item => item.category === this.selectedCategory);
  }

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Hamper Lookbook & Styling Gallery — RMS Creations',
      description: 'Explore client commissions, luxury satin ribbon presentations, and custom hamper finishes crafted by RMS Creations.',
      keywords: 'hamper gallery, gift lookbook, custom hampers, gifting finishes Mumbai, luxury hampers portfolio',
      slug: 'gallery'
    });

    this.seo.setBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Lookbook & Gallery', url: '/gallery' }
    ]);

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
        const catSet = new Set<string>();
        catSet.add('All Creations');

        this.galleryItems = pRes.data.map((p: any) => {
          const cat = catMap.get(Number(p.category_id));
          const catName = cat?.name || 'Curated Hampers';
          catSet.add(catName);

          const image = (p.images && p.images[0]) || cat?.image || 'assets/banners/banner.png';
          const price = Number(p.selling_price || p.price || 0);
          return {
            id: p.id,
            title: p.name,
            description: p.description || 'Thoughtfully curated handcrafted gift creation with luxury finishing.',
            image: image,
            category: catName,
            price: Number(price),
            orderLink: `https://wa.me/919284905118?text=Hello%20RMS!%20I%20am%20interested%20in%20${encodeURIComponent(p.name)}.`
          };
        });

        this.categories = Array.from(catSet);
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

  orderItem(item: { id?: number; title: string; image?: string; price?: number; description?: string }) {
    this.cartService.addToCart({
      id: `prod-${item.id || Date.now()}`,
      productId: item.id,
      title: item.title,
      price: item.price || 499,
      image: item.image || 'assets/banners/banner.png',
      category: 'Gift Lookbook'
    }, 1);
    this.router.navigate(['/cart']);
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