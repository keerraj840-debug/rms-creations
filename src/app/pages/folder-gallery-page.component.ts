import { Component, inject, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { folderPageConfigs, FolderPageConfig, GalleryItem } from '../shared/asset-folder-config';
import { OrderTrackingService } from '../shared/order-tracking.service';

import { SupabaseService } from '../services/supabase.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-folder-gallery-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] dark:from-[#14100E] dark:via-[#191412] dark:to-[#1E1916] py-12 md:py-18">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#EB9D8E]/25 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-[#DD8776]/20 dark:bg-[#DD8776]/10 blur-3xl"></div>

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Fallback when config is missing -->
          <div *ngIf="!config" class="text-center py-12">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/25">Collection Not Found</span>
            <h1 class="mt-4 font-serif text-3xl font-bold text-[#57251C] dark:text-[#F4F1ED]">Looking for a specific hamper collection?</h1>
            <p class="mt-2 text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">This collection route could not be found or has moved.</p>
            <div class="mt-6">
              <a routerLink="/hampers" class="inline-flex items-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] dark:hover:bg-[#DD8776]">
                Explore All Hampers
              </a>
            </div>
          </div>

          <!-- Hero Content Grid -->
          <div *ngIf="config" class="grid items-center gap-12 lg:grid-cols-12">
            <!-- Left Text Column -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 dark:border-[#3D302A] bg-[#FFFDFC]/90 dark:bg-[#1E1916]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#EB9D8E] shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
                {{ config.heroTag || 'Bespoke Collection' }}
              </div>

              <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] dark:text-[#F4F1ED] sm:text-5xl lg:text-6xl leading-[1.15]">
                {{ config.title }}
              </h1>

              <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-lg">
                {{ config.description }}
              </p>

              <!-- Hero Note Badge -->
              <div *ngIf="config.heroNote" class="mt-8 flex items-start gap-4 rounded-2xl border border-[#D9C3B9]/50 dark:border-[#3D302A] bg-[#FFFDFC]/90 dark:bg-[#1E1916]/90 p-4 shadow-sm backdrop-blur-sm sm:items-center">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F6F3] dark:bg-[#251F1C] text-lg text-[#C56D5B] border border-[#D9C3B9]/40 dark:border-[#3D302A]">
                  <i class="fa-solid fa-gift"></i>
                </div>
                <p class="text-xs font-medium leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-sm">
                  {{ config.heroNote }}
                </p>
              </div>

              <!-- Action Navigation -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  routerLink="/hampers" 
                  class="inline-flex items-center justify-center gap-2 rounded-full border border-[#57251C]/35 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#251F1C] px-8 py-3.5 text-xs font-bold text-[#57251C] dark:text-[#F4F1ED] transition-all duration-300 hover:bg-[#F7F6F3] dark:hover:bg-[#322924] active:scale-95 shadow-sm"
                >
                  <i class="fa-solid fa-arrow-left text-xs"></i>
                  <span>Back to Collections</span>
                </a>
                <a 
                  href="https://wa.me/919284905118?text=Hello%20RMS!%20I%20want%20to%20discuss%20a%20custom%20design." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:scale-105 active:scale-95"
                >
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  <span>Custom Order Inquiry</span>
                </a>
              </div>
            </div>

            <!-- Right Hero Preview Card -->
            <div *ngIf="config.heroImage" class="relative lg:col-span-5">
              <div class="group relative mx-auto max-w-md lg:max-w-none">
                <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-[#EB9D8E] to-[#DD8776] opacity-35 blur-xl transition duration-500 group-hover:opacity-55"></div>
                <img 
                  [src]="config.heroImage" 
                  [alt]="config.title" 
                  class="relative h-[380px] w-full rounded-[2rem] border-8 border-[#FFFDFC] dark:border-[#251F1C] object-cover shadow-2xl transition duration-500 hover:scale-[1.02]" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- DESIGNS GALLERY GRID SECTION -->
      <section *ngIf="config" class="bg-[#F7F6F3] dark:bg-[#191412] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#3D302A]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/25">Curated Variations</span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C] dark:text-[#F4F1ED]">Available Designs</h2>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">
              Tap any photo to view high resolution details or place an online order.
            </p>
          </div>

          <!-- Empty State if items array is empty -->
          <div *ngIf="!config.items || config.items.length === 0" class="mt-12 text-center rounded-3xl border border-dashed border-[#D9C3B9] dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#1E1916] p-12 max-w-md mx-auto">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C56D5B]/10 text-3xl text-[#C56D5B]">
              <i class="fa-solid fa-gifts"></i>
            </div>
            <h3 class="mt-4 font-serif text-lg font-bold text-[#57251C] dark:text-[#F4F1ED]">New Designs Coming Soon</h3>
            <p class="mt-2 text-xs text-[#57251C]/75 dark:text-[#D9C3B9]">We are currently styling new additions for this collection. Contact us for bespoke orders.</p>
          </div>

          <!-- Gallery Items Grid -->
          <div *ngIf="config.items && config.items.length > 0" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let item of config.items" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#1E1916] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl"
            >
              <!-- Image Container & Lightbox Trigger -->
              <div class="relative overflow-hidden cursor-pointer bg-[#FAF7F5] dark:bg-[#251F1C]" (click)="openLightbox(item)">
                <img 
                  [src]="item.image" 
                  [alt]="item.title" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                
                <!-- Price Badge overlay if price property exists -->
                <div *ngIf="item.price" class="absolute top-4 right-4 rounded-full bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 px-3 py-1 font-serif text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] shadow-sm backdrop-blur-md border border-[#D9C3B9]/40 dark:border-[#3D302A]">
                  ₹{{ item.price }}
                </div>

                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 px-3.5 py-1.5 text-xs font-bold text-[#57251C] dark:text-[#F4F1ED] backdrop-blur-md shadow-sm">
                    <i class="fa-solid fa-magnifying-glass text-[11px] text-[#C56D5B]"></i>
                    View High-Res Photo
                  </span>
                </div>
              </div>

              <!-- Card Content -->
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 class="font-serif text-xl font-bold tracking-tight text-[#57251C] dark:text-[#F4F1ED] group-hover:text-[#9C4738] dark:group-hover:text-[#EB9D8E] transition-colors duration-300">
                    {{ item.title }}
                  </h3>
                  <p *ngIf="item.description" class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">
                    {{ item.description }}
                  </p>
                </div>

                <!-- Order Action -->
                <div class="mt-6 pt-4 border-t border-[#D9C3B9]/30 dark:border-[#3D302A]">
                  <button 
                    type="button"
                    (click)="orderHamper(item)" 
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <i class="fa-solid fa-bag-shopping text-sm"></i>
                    <span>Order Now (COD / Online UPI)</span>
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
        <div class="relative max-w-4xl w-full overflow-hidden rounded-3xl bg-[#FFFDFC] dark:bg-[#1E1916] p-2 shadow-2xl border border-[#D9C3B9]/60 dark:border-[#3D302A]" (click)="$event.stopPropagation()">
          <button 
            type="button" 
            (click)="closeLightbox()" 
            class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#57251C] dark:bg-[#C56D5B] text-sm font-bold text-white transition hover:bg-[#9C4738] dark:hover:bg-[#DD8776]"
            aria-label="Close Preview"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="grid gap-0 lg:grid-cols-12">
            <div class="lg:col-span-7 bg-[#FAF7F5] dark:bg-[#251F1C] flex items-center justify-center overflow-hidden rounded-2xl">
              <img [src]="activeLightboxItem.image" [alt]="activeLightboxItem.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-[#C56D5B]/15 dark:bg-[#C56D5B]/25 px-3 py-1 text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/25">Design Detail View</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C] dark:text-[#F4F1ED]">{{ activeLightboxItem.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9]">{{ activeLightboxItem.description }}</p>
              </div>

              <div class="mt-8">
                <button 
                  type="button"
                  (click)="orderHamper(activeLightboxItem)" 
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition hover:bg-[#9C4738] dark:hover:bg-[#DD8776] active:scale-95 cursor-pointer"
                >
                  <i class="fa-solid fa-bag-shopping text-sm"></i>
                  <span>Order This Hamper (COD / Online UPI)</span>
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
export class FolderGalleryPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  public readonly checkoutService = inject(CheckoutService);
  private readonly cdr = inject(ChangeDetectorRef);
  private routeSub?: Subscription;

  config: FolderPageConfig | null = null;
  activeLightboxItem: GalleryItem | null = null;

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightboxItem) {
      this.closeLightbox();
    }
  }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') ?? '';
      this.config = folderPageConfigs[slug] ? { ...folderPageConfigs[slug] } : null;

      if (this.config) {
        this.seo.setPageMetadata({
          title: `${this.config.title} | Gift Hampers`,
          description: this.config.description,
          keywords: `${this.config.title}, custom hampers, gift hamper ideas`,
          slug: `hampers/${slug}`
        });
      }

      this.loadLiveProductsForSlug(slug);
    });
  }

  async loadLiveProductsForSlug(slug: string) {
    try {
      const { data: categories } = await this.supabase.from('categories').select('*').eq('is_active', true);
      if (!categories) {
        this.cdr.markForCheck();
        return;
      }

      const cat = categories.find(c => {
        const cLower = c.name.toLowerCase();
        const sLower = slug.toLowerCase();
        const generatedSlug = cLower.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const cleanKeyword = sLower.replace(/-hampers?/, '').replace(/-gifts?/, '');
        return generatedSlug === sLower || cLower.includes(cleanKeyword) || sLower.includes(cLower);
      });

      if (cat) {
        if (!this.config) {
          this.config = {
            slug: slug,
            title: cat.name,
            description: cat.description || 'Artisanal handcrafted gift collection.',
            heroTag: cat.price ? `From ₹${cat.price}` : 'Bespoke Collection',
            heroImage: cat.image || 'assets/banners/banner.png',
            heroNote: 'Each gift hamper is personally assembled with premium styling and careful packaging.',
            items: []
          };
        } else {
          this.config.title = cat.name;
          this.config.description = cat.description || this.config.description;
          this.config.heroImage = cat.image || this.config.heroImage;
        }

        const { data: prods } = await this.supabase
          .from('products')
          .select('*')
          .eq('category_id', cat.id)
          .eq('is_active', true)
          .order('id', { ascending: true });

        if (prods && prods.length > 0) {
          this.config.items = prods.map(p => ({
            title: p.name,
            description: p.description,
            image: (p.images && p.images[0]) || cat.image || 'assets/banners/banner.png',
            price: parseInt(p.name.match(/₹(\d+)/)?.[1] || String(cat.price || 199), 10),
            orderLink: `https://wa.me/919284905118?text=Hello!%20I%20want%20to%20order%20${encodeURIComponent(p.name)}.`
          }));
        } else {
          this.config.items = [];
        }
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  orderHamper(item: GalleryItem | null) {
    if (!item) return;
    const priceVal = parseInt(item.title.match(/₹(\d+)/)?.[1] || '', 10) || 999;
    this.checkoutService.open({
      title: item.title,
      price: priceVal,
      image: item.image,
      category: this.config?.title || 'Hampers'
    });
    if (this.activeLightboxItem) {
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
      page: 'Hampers Gallery',
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