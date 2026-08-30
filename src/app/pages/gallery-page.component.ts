import { Component, inject, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { galleryHighlights, GalleryItem } from '../shared/asset-folder-config';
import { OrderTrackingService } from '../shared/order-tracking.service';

@Component({
  selector: 'app-gallery-page',
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
          <div class="grid items-center gap-12 lg:grid-cols-12">
            
            <!-- Left Text Content -->
            <div class="lg:col-span-7">
              <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 bg-[#FFFDFC]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] shadow-sm backdrop-blur-md">
                <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
                Editorial Lookbook
              </div>

              <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] sm:text-5xl lg:text-6xl leading-[1.15]">
                Curated Gifting <span class="font-serif italic font-normal text-[#C56D5B] underline decoration-[#EB9D8E] decoration-wavy decoration-1 underline-offset-8">Lookbook & Gallery</span>
              </h1>

              <p class="mt-4 max-w-xl text-base leading-relaxed text-[#57251C]/80 sm:text-lg">
                Explore real creations, packaging finishes, and bespoke styling inspirations crafted with love.
              </p>

              <!-- Hero Note Badge -->
              <div class="mt-8 flex items-start gap-4 rounded-2xl border border-[#D9C3B9]/50 bg-[#FFFDFC]/90 p-4 shadow-sm backdrop-blur-sm sm:items-center">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F6F3] text-xl text-[#57251C] border border-[#D9C3B9]/40">
                  📸
                </div>
                <p class="text-xs font-medium leading-relaxed text-[#57251C]/80 sm:text-sm">
                  Browse authentic client commissions and select your favorite aesthetic.
                </p>
              </div>

              <!-- Action Navigation -->
              <div class="mt-8 flex flex-wrap items-center gap-4">
                <a 
                  href="https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers!%20I%20would%20like%20to%20see%20more%20options." 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-[#57251C] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md shadow-[#57251C]/20 transition-all duration-300 hover:bg-[#9C4738] hover:scale-105 active:scale-95"
                >
                  <span>💬 Inquire on WhatsApp</span>
                </a>

                <a 
                  routerLink="/contact" 
                  class="inline-flex items-center justify-center gap-2 rounded-full border border-[#57251C]/35 bg-[#FFFDFC] px-8 py-3.5 text-xs font-bold text-[#57251C] backdrop-blur-sm transition-all duration-300 hover:bg-[#F7F6F3] active:scale-95 shadow-sm"
                >
                  Contact Studio
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
                  class="relative h-[380px] w-full rounded-[2rem] border-8 border-[#FFFDFC] object-cover shadow-2xl transition duration-500 hover:scale-[1.02]" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- GALLERY GRID SECTION -->
      <section class="bg-[#F7F6F3] py-12 md:py-16 border-t border-[#D9C3B9]/40">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-3xl text-center">
            <span class="inline-block rounded-full bg-[#C56D5B]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#9C4738] border border-[#C56D5B]/25">
              Design Catalog
            </span>
            <h2 class="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#57251C]">
              Featured Hamper Styles
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75">
              Tap any photo to view full details or reserve via WhatsApp.
            </p>
          </div>

          <!-- Gallery Items Grid -->
          <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let item of galleryItems" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 bg-[#FFFDFC] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl"
            >
              <!-- Card Image & Lightbox Trigger -->
              <div class="relative overflow-hidden cursor-pointer bg-[#FAF7F5]" (click)="openLightbox(item)">
                <img 
                  [src]="item.image" 
                  [alt]="item.title" 
                  class="h-72 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                
                <!-- Price Badge overlay if price property exists -->
                <div *ngIf="item.price" class="absolute top-4 right-4 rounded-full bg-[#FFFDFC]/95 px-3 py-1 font-serif text-xs font-bold text-[#9C4738] shadow-sm backdrop-blur-md border border-[#D9C3B9]/40">
                  ₹{{ item.price }}
                </div>

                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-6">
                  <span class="rounded-full bg-[#FFFDFC]/95 px-3.5 py-1.5 text-xs font-bold text-[#57251C] backdrop-blur-md shadow-sm">
                    🔍 View High-Res Photo
                  </span>
                </div>
              </div>

              <!-- Card Details -->
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3 class="font-serif text-xl font-bold tracking-tight text-[#57251C] group-hover:text-[#9C4738] transition-colors duration-300">
                    {{ item.title }}
                  </h3>
                  <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75">
                    {{ item.description }}
                  </p>
                </div>

                <!-- WhatsApp Quick Action -->
                <div class="mt-6 pt-4 border-t border-[#D9C3B9]/30">
                  <a 
                    *ngIf="item.orderLink"
                    [href]="item.orderLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="trackOrder(item.title, 'Gift Gallery', item.orderLink)"
                    class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#57251C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-md transition-all duration-300 hover:bg-[#9C4738] hover:shadow-lg active:scale-95"
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
        *ngIf="activeLightboxItem" 
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
              <img [src]="activeLightboxItem.image" [alt]="activeLightboxItem.title" class="max-h-[80vh] w-full object-contain" />
            </div>
            <div class="flex flex-col justify-between p-8 lg:col-span-5">
              <div>
                <span class="rounded-full bg-[#C56D5B]/15 px-3 py-1 text-xs font-bold text-[#9C4738] border border-[#C56D5B]/25">Design Detail View</span>
                <h3 class="mt-4 font-serif text-2xl font-bold text-[#57251C]">{{ activeLightboxItem.title }}</h3>
                <p class="mt-3 text-xs sm:text-sm leading-relaxed text-[#57251C]/80">{{ activeLightboxItem.description }}</p>
              </div>

              <div class="mt-8">
                <a 
                  *ngIf="activeLightboxItem.orderLink" 
                  [href]="activeLightboxItem.orderLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="trackOrder(activeLightboxItem.title, 'Gift Gallery', activeLightboxItem.orderLink)" 
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
export class GalleryPageComponent implements OnInit, OnDestroy {
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);

  galleryItems = galleryHighlights;
  activeLightboxItem: GalleryItem | null = null;

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Hamper Gallery and Styling Inspiration',
      description: 'Browse RMS Gift Hampers gallery ideas and discover beautiful hamper styling inspiration for your next gift.',
      keywords: 'hamper gallery, gift hamper inspiration, hamper styling ideas, custom hamper designs',
      slug: 'gallery'
    });
  }

  @HostListener('window:keydown.escape')
  handleEscapeKey() {
    if (this.activeLightboxItem) {
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
      page: 'Gift Gallery',
      link
    });
  }

  openLightbox(item: GalleryItem) {
    this.activeLightboxItem = item;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.activeLightboxItem = null;
    document.body.style.overflow = '';
   }
}