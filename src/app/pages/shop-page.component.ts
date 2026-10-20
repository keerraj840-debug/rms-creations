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
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-28 sm:pb-20">

        <!-- MAIN SHOP CONTENT -->
        <main class="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 sm:pt-6">

          <!-- Sleek Compact Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#EADFD2]/70 dark:border-white/10">
            <div>
              <h1 class="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
                Shop Gift Hampers
              </h1>
            </div>
            <div class="hidden sm:flex items-center gap-2 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200/50 dark:border-emerald-800/40">
                <i class="fa-solid fa-truck-fast text-[11px]"></i> Safe Doorstep Delivery
              </span>
            </div>
          </div>

          <!-- SEARCH & FILTER TOOLBAR -->
          <div class="bg-white dark:bg-[#1E1916] rounded-2xl p-3 sm:p-4 border border-[#EADFD2] dark:border-white/10 shadow-xs">

            <!-- Top Controls Row -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <!-- Search bar -->
              <div class="relative flex-1">
                <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] dark:text-[#C5A393]"></i>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  placeholder="Search hampers, Ganpati boxes, return gifts..."
                  class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] transition placeholder:text-[#9D7B6C]/70"
                />
                <button *ngIf="searchQuery" (click)="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] hover:text-[#2E2825] p-1 cursor-pointer">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <!-- Sorting, Count & Mobile Layout Switcher -->
              <div class="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                <span class="text-xs font-medium text-[#7A6C5E] dark:text-[#C5A393]">
                  Showing <strong class="text-[#2E2825] dark:text-[#F4F1ED] font-bold">{{ filteredProducts.length }}</strong> products
                </span>

                <div class="flex items-center gap-1.5">
                  <!-- Mobile 1-Col (Full Width) vs 2-Col (Grid) Switcher -->
                  <div class="flex items-center bg-[#FAF7F2] dark:bg-[#251F1C] p-0.5 rounded-xl border border-[#EADFD2] dark:border-white/10 sm:hidden">
                    <button
                      type="button"
                      (click)="mobileViewMode = 'single'"
                      [class]="mobileViewMode === 'single' ? 'bg-white dark:bg-[#1E1916] text-[#9C4738] dark:text-[#EB9D8E] shadow-2xs font-bold' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2 py-1 rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                      title="1 Product Per Row (Full Width)"
                      aria-label="Full width 1 product per row"
                    >
                      <i class="fa-solid fa-bars text-[10px]"></i>
                    </button>
                    <button
                      type="button"
                      (click)="mobileViewMode = 'grid'"
                      [class]="mobileViewMode === 'grid' ? 'bg-white dark:bg-[#1E1916] text-[#9C4738] dark:text-[#EB9D8E] shadow-2xs font-bold' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2 py-1 rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                      title="2 Products Per Row (Grid)"
                      aria-label="2 products per row grid"
                    >
                      <i class="fa-solid fa-table-cells-large text-[10px]"></i>
                    </button>
                  </div>

                  <label class="text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] hidden md:inline">Sort By:</label>
                  <select
                    [(ngModel)]="sortBy"
                    class="px-2.5 py-1.5 sm:py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs font-semibold text-[#2E2825] dark:text-[#F4F1ED] outline-none cursor-pointer"
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
            <div class="pt-2.5 border-t border-[#EADFD2]/60 dark:border-white/10 space-y-1">
              <!-- Categories Horizontal Scroll with Count Badges -->
              <div class="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                <button
                  type="button"
                  *ngFor="let cat of availableCategories"
                  (click)="selectedCategory = cat"
                  [class]="selectedCategory === cat
                    ? 'bg-[#9C4738] text-white font-bold shadow-xs'
                    : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825] dark:hover:text-[#F4F1ED] border border-[#EADFD2] dark:border-white/10 font-medium'"
                  class="min-h-[30px] sm:min-h-[34px] px-3 py-1 sm:py-1.5 rounded-full text-xs shrink-0 transition-all cursor-pointer whitespace-nowrap active:scale-95 flex items-center gap-1.5"
                >
                  <span>{{ cat }}</span>
                  <span
                    class="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold"
                    [ngClass]="selectedCategory === cat ? 'bg-white/25 text-white' : 'bg-black/5 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]'"
                  >
                    {{ getCategoryCount(cat) }}
                  </span>
                </button>
              </div>

              <!-- Budget filters -->
              <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] shrink-0 mr-1">Budget:</span>
                <button
                  type="button"
                  *ngFor="let b of budgetFilters"
                  (click)="selectedBudget = b.value"
                  [class]="selectedBudget === b.value
                    ? 'bg-[#57251C] dark:bg-white text-white dark:text-[#2E2825] font-bold shadow-2xs'
                    : 'bg-white dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10 font-medium'"
                  class="min-h-[30px] px-2.5 py-1 rounded-lg text-[11px] shrink-0 transition-all cursor-pointer whitespace-nowrap active:scale-95"
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

          <!-- RESPONSIVE PRODUCT GRID (Default: 1 Full-Width Card per Row on Mobile) -->
          <!-- RESPONSIVE PRODUCT GRID (Default: High-Density 2-Column Grid on Mobile) -->
          <div
            *ngIf="!loading && filteredProducts.length > 0"
            [ngClass]="mobileViewMode === 'single'
              ? 'flex flex-col gap-2.5 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4 lg:gap-5'
              : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5'"
            class="mt-3.5 sm:mt-6"
          >
            <ng-container *ngFor="let product of filteredProducts">

              <!-- VIEW MODE 1: COMPACT 2-COLUMN GRID (HIGH-DENSITY, LOW-BULK) -->
              <div
                *ngIf="mobileViewMode === 'grid'"
                class="group bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2]/80 dark:border-white/10 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#9C4738]/40 transition-all duration-200 flex flex-col justify-between"
              >
                <!-- Card Media & Badges -->
                <div
                  class="relative aspect-square overflow-hidden bg-[#FAF7F2] dark:bg-[#251F1C] cursor-pointer"
                  [routerLink]="['/product', product.id]"
                >
                  <img
                    [src]="product.image"
                    [alt]="product.name"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  <!-- Category badge -->
                  <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-white/95 dark:bg-[#1E1916]/95 text-[#9C4738] dark:text-[#EB9D8E] backdrop-blur-xs shadow-2xs border border-[#EADFD2]/60 dark:border-white/10 truncate max-w-[95px] sm:max-w-[130px]">
                    {{ product.category }}
                  </span>

                  <!-- Discount badge if applicable -->
                  <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-emerald-600 text-white shadow-2xs">
                    Save ₹{{ product.originalPrice - product.price }}
                  </span>
                </div>

                <!-- Compact Card Content -->
                <div class="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3
                      [routerLink]="['/product', product.id]"
                      class="font-medium text-xs sm:text-sm text-[#2E2825] dark:text-[#F4F1ED] group-hover:text-[#9C4738] dark:group-hover:text-[#EB9D8E] transition-colors cursor-pointer line-clamp-2 leading-tight min-h-[2rem] sm:min-h-[2.5rem]"
                      [title]="product.name"
                    >
                      {{ product.name }}
                    </h3>
                  </div>

                  <!-- Price & Compact Stepper / Add Button (Side by side) -->
                  <div class="pt-2 border-t border-[#EADFD2]/50 dark:border-white/5 flex items-center justify-between gap-1.5">
                    <div class="min-w-0 pr-1">
                      <div class="flex items-baseline gap-1">
                        <span class="font-serif font-bold text-xs sm:text-base text-[#9C4738] dark:text-[#EB9D8E]">₹{{ product.price }}</span>
                        <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="text-[10px] text-[#7A6C5E] line-through">
                          ₹{{ product.originalPrice }}
                        </span>
                      </div>
                    </div>

                    <!-- Quantity Control / Tactile Stepper -->
                    <div class="shrink-0">
                      <!-- IF IN CART: Compact tactile stepper -->
                      <div
                        *ngIf="getCartQty(product.id) > 0"
                        class="h-7 sm:h-8 flex items-center border border-[#9C4738] dark:border-[#C56D5B] rounded-lg bg-[#FAF7F2] dark:bg-[#251F1C] p-0.5 shadow-2xs"
                      >
                        <button
                          type="button"
                          (click)="decrementCartQty(product, $event)"
                          class="w-6 h-6 rounded bg-white dark:bg-[#1E1916] text-[#9C4738] dark:text-[#EB9D8E] font-bold text-xs flex items-center justify-center hover:bg-[#F3E7DC] active:scale-90 cursor-pointer"
                          [attr.aria-label]="'Decrease quantity of ' + product.name"
                        >
                          <i class="fa-solid fa-minus text-[8px]"></i>
                        </button>
                        <span class="font-mono font-bold text-[11px] sm:text-xs text-[#57251C] dark:text-[#F4F1ED] px-1 select-none min-w-[14px] text-center">
                          {{ getCartQty(product.id) }}
                        </span>
                        <button
                          type="button"
                          (click)="incrementCartQty(product, $event)"
                          class="w-6 h-6 rounded bg-[#9C4738] dark:bg-[#C56D5B] text-white font-bold text-xs flex items-center justify-center hover:bg-[#883B2D] active:scale-90 cursor-pointer"
                          [attr.aria-label]="'Increase quantity of ' + product.name"
                        >
                          <i class="fa-solid fa-plus text-[8px]"></i>
                        </button>
                      </div>

                      <!-- IF NOT IN CART: Add button -->
                      <button
                        *ngIf="getCartQty(product.id) === 0"
                        type="button"
                        (click)="addToCart(product, 1, $event)"
                        class="h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] text-white text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 shadow-2xs active:scale-90 cursor-pointer whitespace-nowrap"
                        [title]="'Add ' + product.name + ' to Cart'"
                      >
                        <i class="fa-solid fa-plus text-[8px]"></i>
                        <span>ADD</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- VIEW MODE 2: HORIZONTAL LIST CARD (COMPACT MOBILE ROW) -->
              <div
                *ngIf="mobileViewMode === 'single'"
                class="group bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2]/80 dark:border-white/10 p-2.5 sm:p-3.5 shadow-2xs hover:shadow-md hover:border-[#9C4738]/40 transition-all duration-200 flex items-center gap-3 sm:gap-4"
              >
                <!-- Thumbnail -->
                <div
                  class="relative w-22 h-22 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#251F1C] shrink-0 cursor-pointer"
                  [routerLink]="['/product', product.id]"
                >
                  <img
                    [src]="product.image"
                    [alt]="product.name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="absolute top-1 right-1 px-1 py-0.5 rounded text-[8px] font-bold bg-emerald-600 text-white">
                    -₹{{ product.originalPrice - product.price }}
                  </span>
                </div>

                <!-- Info and Actions -->
                <div class="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                  <div>
                    <span class="text-[9px] font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] block truncate mb-0.5">
                      {{ product.category }}
                    </span>
                    <h3
                      [routerLink]="['/product', product.id]"
                      class="font-medium text-xs sm:text-sm text-[#2E2825] dark:text-[#F4F1ED] group-hover:text-[#9C4738] transition-colors cursor-pointer line-clamp-2 leading-tight"
                    >
                      {{ product.name }}
                    </h3>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-1 mt-0.5 hidden sm:block">
                      {{ product.description }}
                    </p>
                  </div>

                  <!-- Price and Stepper Row -->
                  <div class="pt-1.5 flex items-center justify-between gap-2 mt-auto">
                    <div class="flex items-baseline gap-1.5">
                      <span class="font-serif font-bold text-sm sm:text-base text-[#9C4738] dark:text-[#EB9D8E]">₹{{ product.price }}</span>
                      <span *ngIf="product.originalPrice && product.originalPrice > product.price" class="text-[10px] text-[#7A6C5E] line-through">
                        ₹{{ product.originalPrice }}
                      </span>
                    </div>

                    <div>
                      <div
                        *ngIf="getCartQty(product.id) > 0"
                        class="h-7 sm:h-8 flex items-center border border-[#9C4738] dark:border-[#C56D5B] rounded-lg bg-[#FAF7F2] dark:bg-[#251F1C] p-0.5 shadow-2xs"
                      >
                        <button
                          type="button"
                          (click)="decrementCartQty(product, $event)"
                          class="w-6 h-6 rounded bg-white dark:bg-[#1E1916] text-[#9C4738] dark:text-[#EB9D8E] font-bold text-xs flex items-center justify-center hover:bg-[#F3E7DC] active:scale-90 cursor-pointer"
                        >
                          <i class="fa-solid fa-minus text-[8px]"></i>
                        </button>
                        <span class="font-mono font-bold text-[11px] sm:text-xs text-[#57251C] dark:text-[#F4F1ED] px-1.5 select-none min-w-[16px] text-center">
                          {{ getCartQty(product.id) }}
                        </span>
                        <button
                          type="button"
                          (click)="incrementCartQty(product, $event)"
                          class="w-6 h-6 rounded bg-[#9C4738] dark:bg-[#C56D5B] text-white font-bold text-xs flex items-center justify-center hover:bg-[#883B2D] active:scale-90 cursor-pointer"
                        >
                          <i class="fa-solid fa-plus text-[8px]"></i>
                        </button>
                      </div>

                      <button
                        *ngIf="getCartQty(product.id) === 0"
                        type="button"
                        (click)="addToCart(product, 1, $event)"
                        class="h-7 sm:h-8 px-3 rounded-lg bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] text-white text-xs font-bold transition flex items-center gap-1 shadow-2xs active:scale-90 cursor-pointer"
                      >
                        <i class="fa-solid fa-plus text-[8px]"></i>
                        <span>ADD</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </ng-container>
          </div>

        </main>

        <!-- FLOATING MOBILE CART SUMMARY PILL (When items are in cart) -->
        <aside
          *ngIf="cartService.totalItemsCount > 0"
          aria-label="View Shopping Cart"
          class="fixed bottom-16 inset-x-3.5 max-w-md mx-auto z-30 md:hidden bg-gradient-to-r from-[#57251C] to-[#9C4738] text-white rounded-2xl p-3 shadow-2xl border border-white/15 flex items-center justify-between backdrop-blur-md transition-all duration-300"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-bag-shopping text-xs"></i>
            </div>
            <div class="truncate">
              <p class="text-xs font-bold leading-tight">
                {{ cartService.totalItemsCount }} {{ cartService.totalItemsCount === 1 ? 'item' : 'items' }} added
              </p>
              <p class="text-[10px] text-white/80 leading-tight">
                Subtotal: ₹{{ cartService.subtotal }}
              </p>
            </div>
          </div>
          <a
            routerLink="/cart"
            class="shrink-0 px-3.5 py-1.5 rounded-xl bg-white text-[#57251C] font-bold text-xs shadow-sm hover:bg-white/90 active:scale-95 transition flex items-center gap-1.5"
          >
            <span>View Cart</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </a>
        </aside>

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
  mobileViewMode: 'grid' | 'single' = 'grid';

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
            const rawPrice = Number(p.price || 0);
            const rawSellingPrice = Number(p.selling_price || 0);
            let finalPrice = rawSellingPrice || rawPrice || (isNaN(extractedPrice) || extractedPrice <= 0 ? 199 : extractedPrice);
            let originalPrice: number | undefined = undefined;

            // Genuine pricing rule: only display originalPrice when database has a higher base price than the selling price
            if (rawPrice > 0 && rawSellingPrice > 0 && rawPrice > rawSellingPrice) {
              finalPrice = rawSellingPrice;
              originalPrice = rawPrice;
            }

            const image = (p.images && p.images[0]) || cat?.image || 'assets/banners/banner.png';

            return {
              id: Number(p.id),
              name: p.name,
              description: p.description || 'Thoughtfully curated handcrafted gift creation.',
              price: Number(finalPrice),
              originalPrice: originalPrice,
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

  addToCart(product: ShopProduct, quantity: number = 1, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.cartService.addToCart({
      id: String(product.id),
      productId: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    }, quantity);
    this.cdr.markForCheck();
  }

  incrementCartQty(product: ShopProduct, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const currentQty = this.getCartQty(product.id);
    if (currentQty === 0) {
      this.addToCart(product, 1, event);
    } else {
      const item = this.cartService.items.find(i => i.productId === product.id || i.id === String(product.id));
      if (item) {
        this.cartService.updateQuantity(item.id, currentQty + 1);
        this.cdr.markForCheck();
      }
    }
  }

  decrementCartQty(product: ShopProduct, event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const currentQty = this.getCartQty(product.id);
    if (currentQty <= 0) return;
    const item = this.cartService.items.find(i => i.productId === product.id || i.id === String(product.id));
    if (item) {
      this.cartService.updateQuantity(item.id, currentQty - 1);
      this.cdr.markForCheck();
    }
  }

  getCartQty(productId: number): number {
    const item = this.cartService.items.find(i => i.productId === productId || i.id === String(productId));
    return item ? item.quantity : 0;
  }

  getCategoryCount(category: string): number {
    if (!this.products || this.products.length === 0) return 0;
    if (category === 'All') return this.products.length;
    return this.products.filter(p => p.category === category).length;
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedBudget = 'all';
    this.sortBy = 'featured';
  }
}
