import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';

import { SupabaseService } from '../services/supabase.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  selector: 'app-hampers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="hamper-page-shell">
      <!-- HERO HEADER SECTION -->
      <section class="relative overflow-hidden bg-gradient-to-b from-[#F7F6F3] via-[#FAF7F5] to-[#FFFDFC] dark:from-[#14100E] dark:via-[#191412] dark:to-[#1E1916] py-12 md:py-18">
        <!-- Ambient Decorative Lighting -->
        <div class="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#EB9D8E]/25 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
        <div class="pointer-events-none absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-[#DD8776]/20 dark:bg-[#DD8776]/10 blur-3xl"></div>

        <div class="container relative mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 dark:border-[#3D302A] bg-[#FFFDFC]/90 dark:bg-[#1E1916]/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#EB9D8E] shadow-sm backdrop-blur-md">
            <span class="inline-block h-2 w-2 rounded-full bg-[#C56D5B] animate-pulse"></span>
            Curated Gift Collections
          </div>

          <h1 class="mt-5 font-serif text-3xl font-bold tracking-tight text-[#57251C] dark:text-[#F4F1ED] sm:text-5xl lg:text-6xl leading-[1.15]">
            Bespoke Hampers for <br class="hidden sm:inline" />
            <span class="font-serif italic font-normal text-[#C56D5B] dark:text-[#EB9D8E] underline decoration-[#EB9D8E] decoration-wavy decoration-1 underline-offset-8">Every Special Occasion</span>
          </h1>

          <p class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#57251C]/80 dark:text-[#D9C3B9] sm:text-base">
            Explore our artisanal gift hampers designed for festive celebrations, birthdays, anniversaries, and joyful moments.
          </p>
        </div>
      </section>

      <!-- COLLECTION GRID SECTION -->
      <section class="bg-[#F7F6F3] dark:bg-[#191412] py-12 md:py-16 border-t border-[#D9C3B9]/40 dark:border-[#3D302A]">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Empty State -->
          <div *ngIf="categories.length === 0" class="text-center py-12 max-w-md mx-auto rounded-3xl border border-dashed border-[#D9C3B9] dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#1E1916] p-8">
            <div class="w-12 h-12 mx-auto rounded-2xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-xl"><i class="fa-solid fa-gift"></i></div>
            <h3 class="mt-4 font-serif text-xl font-bold text-[#57251C] dark:text-[#F4F1ED]">Curating Collections</h3>
            <p class="mt-2 text-xs sm:text-sm text-[#57251C]/75 dark:text-[#D9C3B9]">We are preparing our bespoke gift hamper collections. Inquire directly on WhatsApp for custom hampers!</p>
            <a href="https://wa.me/919284905118" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex items-center gap-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-6 py-2.5 text-xs font-bold text-white uppercase tracking-wider">
              <i class="fa-brands fa-whatsapp text-sm"></i>
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div *ngIf="categories.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div 
              *ngFor="let category of categories" 
              class="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-[#D9C3B9]/50 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#1E1916] shadow-md transition-all duration-500 hover:-translate-y-2 hover:border-[#C56D5B] hover:shadow-2xl"
            >
              <!-- Card Image & Overlay Banner -->
              <div class="relative overflow-hidden">
                <img 
                  [src]="category.image" 
                  [alt]="category.title" 
                  class="h-60 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40"></div>
                <span class="absolute top-4 left-4 rounded-full border border-[#D9C3B9]/40 dark:border-[#3D302A] bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 px-3.5 py-1 text-xs font-bold tracking-wide text-[#57251C] dark:text-[#F4F1ED] shadow-sm backdrop-blur-md">
                  {{ category.tag }}
                </span>
              </div>

              <!-- Card Content -->
              <div class="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h2 class="font-serif text-xl font-bold tracking-tight text-[#57251C] dark:text-[#F4F1ED] group-hover:text-[#9C4738] dark:group-hover:text-[#EB9D8E] transition-colors duration-300">
                    {{ category.title }}
                  </h2>
                  <p class="mt-2 text-xs leading-relaxed text-[#57251C]/75 dark:text-[#D9C3B9]">
                    {{ category.description }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 flex flex-wrap items-center gap-2.5">
                  <a 
                    [routerLink]="category.directRoute ? category.directRoute : ['/hampers', category.slug]" 
                    class="inline-flex flex-1 items-center justify-center rounded-full bg-[#57251C] dark:bg-[#C56D5B] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-sm transition-all duration-300 hover:bg-[#9C4738] dark:hover:bg-[#DD8776] hover:shadow-md active:scale-95"
                  >
                    Explore Range
                  </a>
                  <button 
                    type="button"
                    (click)="orderHamper(category)" 
                    class="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#57251C]/35 dark:border-[#3D302A] bg-[#FFFDFC] dark:bg-[#251F1C] px-4 py-2.5 text-xs font-bold text-[#57251C] dark:text-[#F4F1ED] transition-all duration-300 hover:bg-[#F7F6F3] dark:hover:bg-[#322924] active:scale-95 cursor-pointer"
                  >
                    <i class="fa-solid fa-bag-shopping text-sm text-[#9C4738] dark:text-[#EB9D8E]"></i>
                    <span>Order (COD / UPI)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Consultation Banner -->
          <div class="mt-12 rounded-[2.5rem] border border-[#D9C3B9]/30 bg-gradient-to-r from-[#57251C] via-[#9C4738] to-[#C56D5B] p-8 text-[#FFFDFC] shadow-xl lg:p-12">
            <div class="grid items-center gap-8 lg:grid-cols-12">
              <div class="lg:col-span-8">
                <span class="inline-block rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#EB9D8E] border border-white/20 backdrop-blur-md">
                  Custom Hamper Studio
                </span>
                <h3 class="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFDFC]">
                  Looking for a custom theme, item combination, or budget?
                </h3>
                <p class="mt-2 max-w-2xl text-sm leading-relaxed text-[#D9C3B9] sm:text-base">
                  Our gifting specialists assemble bespoke hampers tailored exactly to your colors, favorite items, and price points.
                </p>
              </div>
              <div class="lg:col-span-4 lg:flex lg:justify-end">
                <a 
                  routerLink="/build-hamper"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FFFDFC] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#57251C] shadow-lg transition-all duration-300 hover:bg-[#F7F6F3] hover:scale-105 sm:w-auto active:scale-95 cursor-pointer"
                >
                  <i class="fa-solid fa-wand-magic-sparkles text-[#9C4738] text-base"></i>
                  <span>Build Your Own Hamper &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </app-site-layout>
  `
})
export class HampersPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private supabase = inject(SupabaseService);
  private readonly checkoutService = inject(CheckoutService);
  private cdr = inject(ChangeDetectorRef);

  categories: any[] = [];

  orderHamper(cat: any) {
    this.checkoutService.open({
      title: cat.title || cat.name,
      price: 999,
      image: cat.image,
      category: 'Gift Hampers'
    });
  }

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Gift Hampers for Ganesh Utsav, Girls, Boys and Chocolate Lovers',
      description: 'Explore festive Ganpati pooja kits, and hamper collections for girls, boys, and chocolate lovers with elegant styling at RMS Gift Hampers.',
      keywords: 'ganpati hampers, pooja kits, girls hampers, boys hampers, chocolate hampers, premium gift hampers',
      slug: 'hampers'
    });
    this.loadLiveCategories();
  }

  async loadLiveCategories() {
    try {
      const { data } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (data && data.length > 0) {
        this.categories = data.map(c => {
          const slug = this.generateSlug(c.name);
          const directRoute = c.name.toLowerCase().includes('ganpati') ? '/ganpati-hampers' :
                              c.name.toLowerCase().includes('return gift') ? '/return-gifts' : '';
          return {
            id: c.id,
            slug: slug,
            directRoute: directRoute,
            title: c.name,
            tag: c.price ? `From ₹${c.price}` : 'Bespoke Collection',
            description: c.description || 'Artisanal handcrafted gift collection.',
            image: c.image || 'assets/banners/banner.png',
            orderLink: `https://wa.me/919284905118?text=Hello!%20I%20want%20to%20order%20from%20${encodeURIComponent(c.name)}.`
          };
        });
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  private generateSlug(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('ganpati')) return 'ganpati-hampers';
    if (lower.includes('girl')) return 'girls-hampers';
    if (lower.includes('boy')) return 'boys-hampers';
    if (lower.includes('chocolate')) return 'chocolate-hamper';
    if (lower.includes('return')) return 'return-gifts';
    return lower.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
}