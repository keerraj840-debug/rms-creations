import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { CartService, CartItem } from '../services/cart.service';

export interface ShopProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryId?: number;
  image: string;
  images: string[];
  badge?: string;
  inStock: boolean;
}

export function isWithinDateWindow(fromDate?: string | null, toDate?: string | null): boolean {
  if (!fromDate && !toDate) return true;
  const todayStr = new Date().toISOString().slice(0, 10);
  if (fromDate && todayStr < fromDate) return false;
  if (toDate && todayStr > toDate) return false;
  return true;
}

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-20">

        <!-- MAIN SHOP CONTENT -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">

          <!-- Sleek Compact Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-[#EADFD2]/70 dark:border-white/10">
            <div>
              <h1 class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
                Shop Gift Hampers
              </h1>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                Handcrafted gift hampers with instant Cash on Delivery &amp; 0% Fee UPI
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#7A6C5E] dark:text-[#C5A393]">
              <span class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 px-2.5 py-1 shadow-2xs">
                <i class="fa-solid fa-truck-fast text-[#9C4738] dark:text-[#EB9D8E]"></i> Free Delivery ₹499+
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 px-2.5 py-1 shadow-2xs">
                <i class="fa-solid fa-shield-halved text-emerald-600 dark:text-emerald-400"></i> Artisanal Quality
              </span>
              <span class="inline-flex items-center gap-1 rounded-full bg-white dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 px-2.5 py-1 shadow-2xs">
                <i class="fa-solid fa-bolt text-amber-600 dark:text-amber-400"></i> 24-48h Dispatch
              </span>
            </div>
          </div>

          <!-- SEARCH & FILTER TOOLBAR -->
          <div class="bg-white dark:bg-[#1E1916] rounded-2xl p-3.5 sm:p-5 border border-[#EADFD2] dark:border-white/10 shadow-xs space-y-3.5">

            <!-- Top Controls Row -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <!-- Search bar -->
              <div class="relative flex-1 max-w-md">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] dark:text-[#C5A393]"></i>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  placeholder="Search hampers, Ganpati boxes, return gifts..."
                  class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] transition"
                />
                <button *ngIf="searchQuery" (click)="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] hover:text-[#2E2825] p-1">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <!-- Sorting & Count -->
              <div class="flex items-center gap-3 shrink-0 justify-between">
                <span class="text-xs font-medium text-[#7A6C5E] dark:text-[#C5A393]">
                  Showing <strong class="text-[#2E2825] dark:text-[#F4F1ED]">{{ filteredProducts.length }}</strong> products
                </span>

                <div class="flex items-center gap-2">
                  <label class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hidden sm:inline">Sort By:</label>
                  <select
                    [(ngModel)]="sortBy"
                    class="px-2.5 sm:px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs font-semibold text-[#2E2825] dark:text-[#F4F1ED] outline-none cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Category & Price Filter Pills -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#EADFD2]/60 dark:border-white/10">
              <!-- Categories Horizontal Scroll -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-1 px-1">
                <button
                  type="button"
                  *ngFor="let cat of availableCategories"
                  (click)="selectedCategory = cat"
                  [class]="selectedCategory === cat
                    ? 'bg-[#9C4738] text-white font-bold shadow-xs'
                    : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825] dark:hover:text-[#F4F1ED] border border-[#EADFD2] dark:border-white/10 font-medium'"
                  class="min-h-[36px] px-3.5 py-1.5 rounded-full text-xs shrink-0 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {{ cat }}
                </button>
              </div>

              <!-- Budget filters -->
              <div class="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
                <span class="text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider hidden lg:inline">Budget:</span>
                <button
                  type="button"
                  *ngFor="let b of budgetFilters"
                  (click)="selectedBudget = b.value"
                  [class]="selectedBudget === b.value
                    ? 'bg-[#57251C] dark:bg-white text-white dark:text-[#2E2825] font-bold'
                    : 'bg-white dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10'"
                  class="min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  {{ b.label }}
                </button>
              </div>
            </div>

          </div>

          <!-- LOADING STATE -->
          <div *ngIf="loading" class="py-24 text-center">
            <div class="w-12 h-12 rounded-full border-4 border-[#9C4738] border-t-transparent animate-spin mx-auto"></div>
            <p class="mt-4 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393]">Loading store catalog...</p>
          </div>

          <!-- EMPTY STATE -->
          <div *ngIf="!loading && filteredProducts.length === 0" class="py-16 sm:py-20 text-center bg-white dark:bg-[#1E1916] rounded-3xl border border-dashed border-[#EADFD2] dark:border-white/10 p-6 sm:p-8 max-w-md mx-auto my-8 shadow-xs">
            <div class="w-14 h-14 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-2xl mx-auto">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <h3 class="mt-4 font-serif text-lg font-bold text-[#2E2825] dark:text-[#F4F1ED]">No products match your filter</h3>
            <p class="mt-1.5 text-xs text-[#7A6C5E] dark:text-[#C5A393]">Try clearing search keywords or selecting "All Categories".</p>
            <button
              type="button"
              (click)="resetFilters()"
              class="mt-5 px-5 py-2.5 rounded-full bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition cursor-pointer active:scale-95"
            >
              Reset All Filters
            </button>
          </div>

          <!-- RESPONSIVE 2-COLUMN MOBILE PRODUCT GRID -->
          <div *ngIf="!loading && filteredProducts.length > 0" class="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            <div
              *ngFor="let product of filteredProducts"
              class="group bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 overflow-hidden shadow-2xs hover:shadow-lg hover:border-[#9C4738]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <!-- Card Media & Badges -->
              <div class="relative overflow-hidden bg-[#FAF7F2] dark:bg-[#251F1C] aspect-square cursor-pointer" [routerLink]="['/product', product.id]">
                <img
                  [src]="product.image"
                  [alt]="product.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <!-- Category badge -->
                <span class="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-white/90 dark:bg-[#1E1916]/90 text-[#9C4738] dark:text-[#EB9D8E] backdrop-blur-md shadow-2xs border border-[#EADFD2]/60 dark:border-white/10 truncate max-w-[120px]">
                  {{ product.category }}
                </span>

                <!-- Discount badge if applicable -->
                <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="absolute top-2 right-2 sm:top-3 sm:right-3 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                  Save ₹{{ product.originalPrice - product.price }}
                </span>
              </div>

              <!-- Card Content -->
              <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
                <div>
                  <h3
                    [routerLink]="['/product', product.id]"
                    class="font-serif font-bold text-xs sm:text-sm text-[#2E2825] dark:text-[#F4F1ED] group-hover:text-[#9C4738] dark:group-hover:text-[#EB9D8E] transition-colors cursor-pointer line-clamp-2 min-h-[2rem]"
                    [title]="product.name"
                  >
                    {{ product.name }}
                  </h3>
                  <p class="hidden sm:block text-xs text-[#7A6C5E] dark:text-[#C5A393] line-clamp-2 mt-1 leading-relaxed">
                    {{ product.description || 'Artisanal gift hamper curated with bespoke keepsakes.' }}
                  </p>
                </div>

                <!-- Price and Add to Cart Section -->
                <div class="pt-2 sm:pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div class="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
                      <span class="font-serif font-bold text-base sm:text-lg text-[#9C4738] dark:text-[#EB9D8E]">₹{{ product.price }}</span>
                      <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="text-[10px] sm:text-xs text-[#7A6C5E] line-through">
                        ₹{{ product.originalPrice }}
                      </span>
                    </div>
                    <span class="text-[9px] sm:text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <i class="fa-solid fa-check text-[8px]"></i> In Stock
                    </span>
                  </div>

                  <!-- ADD TO CART BUTTON (Strict Ecommerce Standard: No Direct Order Bypass) -->
                  <button
                    type="button"
                    (click)="addToCart(product)"
                    class="w-full sm:w-auto min-h-[38px] px-3 py-2 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] dark:hover:bg-[#DD8776] text-white text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs hover:shadow active:scale-95 cursor-pointer shrink-0"
                    title="Add to Cart"
                  >
                    <i class="fa-solid fa-bag-shopping text-[11px]"></i>
                    <span>{{ getCartQty(product.id) > 0 ? ('Added (' + getCartQty(product.id) + ')') : 'Add to Cart' }}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </main>

      </div>
    </app-site-layout>
  `
})
export class ShopPageComponent implements OnInit, OnDestroy {
  private readonly supabase = inject(SupabaseService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  public readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);

  private querySub?: Subscription;

  products: ShopProduct[] = [];
  loading = true;

  searchQuery = '';
  selectedCategory = 'All';
  selectedBudget = 'all';
  sortBy = 'featured';

  availableCategories: string[] = ['All'];

  budgetFilters = [
    { label: 'All Budgets', value: 'all' },
    { label: 'Under ₹200', value: 'under-200' },
    { label: '₹200 - ₹500', value: '200-500' },
    { label: '₹500+', value: 'above-500' }
  ];

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Shop Handcrafted Gift Hampers — RMS Creations',
      description: 'Explore the full RMS Creations collection. Handcrafted Diwali boxes, birthday favours, festive dry fruit hampers, and chocolate suites.',
      keywords: 'shop hampers, buy gift hampers online, Diwali hamper Mumbai, return gifts, chocolate gifts, pooja kits',
      slug: 'shop'
    });

    this.seo.setBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Shop All Hampers', url: '/shop' }
    ]);

    this.loadCatalog().then(() => {
      this.subscribeToQueryParams();
    });
  }

  ngOnDestroy() {
    this.querySub?.unsubscribe();
  }

  private subscribeToQueryParams() {
    this.querySub = this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.applyCategoryFilter(params['category']);
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.cdr.markForCheck();
    });
  }

  private applyCategoryFilter(catParam: string) {
    if (!catParam) return;
    const clean = catParam.toLowerCase().trim();
    const matched = this.availableCategories.find(c => {
      const lower = c.toLowerCase();
      return lower === clean ||
             lower.includes(clean) ||
             clean.includes(lower) ||
             (clean.includes('ganpati') && lower.includes('ganpati')) ||
             (clean.includes('return') && lower.includes('return')) ||
             (clean.includes('girl') && lower.includes('girl')) ||
             (clean.includes('boy') && lower.includes('boy')) ||
             (clean.includes('chocolate') && lower.includes('chocolate')) ||
             (clean.includes('friendship') && lower.includes('friendship')) ||
             (clean.includes('raksha') && lower.includes('raksha'));
    });
    if (matched) {
      this.selectedCategory = matched;
    }
  }

  async loadCatalog() {
    try {
      this.loading = true;
      const [pRes, cRes] = await Promise.all([
        this.supabase.from('products').select('*').eq('is_active', true).order('id', { ascending: false }),
        this.supabase.from('categories').select('*').eq('is_active', true)
      ]);

      const catMap = new Map<number, any>();
      const activeCategoryIds = new Set<number>();

      if (cRes.data) {
        cRes.data.forEach((c: any) => {
          if (isWithinDateWindow(c.from_date, c.to_date)) {
            catMap.set(Number(c.id), c);
            activeCategoryIds.add(Number(c.id));
          }
        });
        const activeCatNames = Array.from(catMap.values()).map((c: any) => c.name).filter(Boolean);
        this.availableCategories = ['All', ...new Set(activeCatNames)];
      }

      if (pRes.data && pRes.data.length > 0) {
        this.products = pRes.data
          .filter((p: any) => {
            // 1. Check product's own active date window
            if (!isWithinDateWindow(p.from_date, p.to_date)) return false;

            // 2. Check if the mapped category exists and is within its active date window
            if (p.category_id && !activeCategoryIds.has(Number(p.category_id))) {
              return false;
            }

            return true;
          })
          .map((p: any) => {
            const cat = catMap.get(Number(p.category_id));
            const catName = cat?.name || 'Gift Hamper';
            const extractedPrice = parseInt(p.name.match(/₹(\d+)/)?.[1] || String(cat?.price || 199), 10);
            const price = p.selling_price || p.price || (isNaN(extractedPrice) || extractedPrice <= 0 ? 199 : extractedPrice);
            const image = (p.images && p.images[0]) || cat?.image || 'assets/banners/banner.png';

            return {
              id: Number(p.id),
              name: p.name,
              description: p.description || 'Thoughtfully curated handcrafted gift creation.',
              price: Number(price),
              originalPrice: price < 300 ? Number(price) + 50 : Math.round(Number(price) * 1.25),
              category: catName,
              categoryId: Number(p.category_id),
              image: image,
              images: p.images && p.images.length > 0 ? p.images : [image],
              badge: p.badge || undefined,
              inStock: true
            };
          });
      } else {
        this.products = [];
      }
    } catch {
      this.products = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  get filteredProducts(): ShopProduct[] {
    return this.products
      .filter(p => {
        // Category Filter
        if (this.selectedCategory !== 'All' && p.category !== this.selectedCategory) {
          return false;
        }

        // Search Filter
        if (this.searchQuery.trim()) {
          const q = this.searchQuery.toLowerCase().trim();
          const matches = p.name.toLowerCase().includes(q) ||
                          p.description.toLowerCase().includes(q) ||
                          p.category.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Budget Filter
        if (this.selectedBudget === 'under-200' && p.price >= 200) return false;
        if (this.selectedBudget === '200-500' && (p.price < 200 || p.price > 500)) return false;
        if (this.selectedBudget === 'above-500' && p.price <= 500) return false;

        return true;
      })
      .sort((a, b) => {
        if (this.sortBy === 'price-asc') return a.price - b.price;
        if (this.sortBy === 'price-desc') return b.price - a.price;
        if (this.sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // featured (default ordering)
      });
  }

  addToCart(product: ShopProduct) {
    this.cartService.addToCart({
      id: String(product.id),
      productId: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    }, 1);
  }

  getCartQty(productId: number): number {
    const item = this.cartService.items.find(i => i.productId === productId || i.id === String(productId));
    return item ? item.quantity : 0;
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedBudget = 'all';
    this.sortBy = 'featured';
  }
}
