import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';
import { CustomHamperService } from '../services/custom-hamper.service';
import {
  HamperBuilderItem,
  CustomHamperRequestItem,
  HamperMarkupConfig
} from '../models/custom-hamper.model';
import { ModalComponent } from '../shared/ui/modal.component';
import { CartService } from '../services/cart.service';
import { LocalStorageService } from '../services/local-storage.service';
import { ItemSourcingImageService } from '../services/item-sourcing-image.service';

interface ItemVisualMeta {
  icon: string;
  badge: string;
  category: string;
}

@Component({
  selector: 'app-build-hamper-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent, ModalComponent],
  template: `
    <app-site-layout [hideFooter]="true" [hideFloatingAction]="true">
      <!-- MAIN STUDIO WRAPPER: Viewport-fitted on desktop (ZERO outer page scroll), natural scroll on mobile -->
      <div class="h-full flex-1 flex flex-col min-h-0 bg-[#FAF7F2] dark:bg-[#14100E] text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-200 font-sans pb-24 lg:pb-0 overflow-x-hidden lg:overflow-hidden">

        <!-- COMPACT STUDIO HEADER: Occasions, Quick Mixes & Included Perks in 1 Slim Bar -->
        <header class="shrink-0 bg-white dark:bg-[#1A1614] border-b border-[#EADFD2] dark:border-stone-800 shadow-2xs z-20 px-3 sm:px-6 py-2">
          <div class="mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">

            <!-- Title & Occasions -->
            <div class="flex items-center gap-2 overflow-hidden w-full md:w-auto justify-between md:justify-start">
              <div class="shrink-0 hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57251C] dark:text-[#D9C3B9]">
                <i class="fa-solid fa-gift"></i>
                <span class="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 normal-case">Occasion:</span>
              </div>

              <!-- Occasion Pills Scroll -->
              <div class="flex items-center gap-1.5 overflow-x-auto py-0.5 custom-scrollbar min-w-0 flex-1 md:flex-none">
                <button
                  type="button"
                  *ngFor="let occ of occasions"
                  (click)="selectedOccasion = occ; onBuilderStateChanged()"
                  class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition cursor-pointer"
                  [ngClass]="selectedOccasion === occ ? 'bg-[#57251C] text-white border-[#57251C] shadow-2xs' : 'bg-[#FAF7F2] dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'"
                >
                  {{ occ }}
                </button>
              </div>

              <!-- Mobile Quick Mixes Pill Toggle -->
              <button
                type="button"
                (click)="isMobileCombosOpen = !isMobileCombosOpen"
                class="md:hidden shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-600/40 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
                [attr.aria-expanded]="isMobileCombosOpen"
              >
                <span>✨ Mixes</span>
                <i class="fa-solid text-[9px]" [ngClass]="isMobileCombosOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </button>
            </div>

            <!-- Combos Row: Always visible on desktop (md:), collapsible on mobile -->
            <div
              class="items-center gap-2 shrink-0 overflow-x-auto py-0.5 custom-scrollbar justify-between md:justify-end"
              [ngClass]="isMobileCombosOpen ? 'flex' : 'hidden md:flex'"
            >
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="text-[11px] font-bold text-stone-500 uppercase tracking-wider hidden xl:inline">Popular Combos:</span>
                <button
                  type="button"
                  *ngFor="let ai of aiCurations"
                  (click)="applyAiCuration(ai.id)"
                  class="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-[#57251C] text-stone-700 dark:text-stone-300 transition cursor-pointer whitespace-nowrap"
                  [title]="'Add ' + ai.name + ' combo'"
                >
                  {{ ai.icon }} {{ ai.name }}
                </button>
                <button
                  type="button"
                  (click)="applyAiSurpriseMe()"
                  class="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#FAF7F2] dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-[#57251C] dark:text-[#D9C3B9] hover:bg-stone-200 transition cursor-pointer flex items-center gap-1 whitespace-nowrap"
                  title="Random curated selection"
                >
                  <span>🎲 Surprise Mix</span>
                </button>
              </div>

            </div>

          </div>

          <div *ngIf="aiCurationActiveMessage" class="mx-auto mt-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 animate-fade-in flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check"></i>
            <span>{{ aiCurationActiveMessage }}</span>
          </div>
        </header>

        <!-- MOBILE VIEW SWITCHER TABS (1. Choose Items vs. 2. Hamper Box) -->
        <div class="lg:hidden shrink-0 px-3 pt-2 pb-1.5 bg-[#FAF7F2] dark:bg-[#14100E] border-b border-[#EADFD2] dark:border-stone-800">
          <div class="flex items-center p-1 bg-stone-200/70 dark:bg-stone-900 rounded-2xl border border-stone-300/60 dark:border-stone-800 shadow-2xs">
            <button
              type="button"
              (click)="mobileTab = 'catalogue'"
              class="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              [ngClass]="mobileTab === 'catalogue' ? 'bg-[#57251C] text-white shadow-xs' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'"
            >
              <i class="fa-solid fa-cookie-bite text-[11px]"></i>
              <span>1. Choose Items</span>
            </button>
            <button
              type="button"
              (click)="mobileTab = 'box'"
              class="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer relative"
              [ngClass]="mobileTab === 'box' ? 'bg-[#57251C] text-white shadow-xs' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'"
            >
              <i class="fa-solid fa-gift text-[11px]"></i>
              <span>2. My Hamper Box</span>
              <span
                *ngIf="totalItemsCount > 0"
                class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold leading-tight"
                [ngClass]="mobileTab === 'box' ? 'bg-white text-[#57251C]' : 'bg-[#57251C] text-white'"
              >
                {{ totalItemsCount }}
              </span>
            </button>
          </div>
        </div>

        <!-- MAIN WORKSPACE: Fits 100% on desktop screen without page scrolling -->
        <main class="flex-1 min-h-0 w-full mx-auto px-3 sm:px-6 py-2 sm:py-3 overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full items-stretch">

            <!-- LEFT: ITEMS CATALOGUE (7 COLS ON DESKTOP, TOGGLED ON MOBILE) -->
            <section
              class="lg:col-span-7 h-full flex-col min-h-0 overflow-hidden"
              [ngClass]="mobileTab === 'catalogue' ? 'flex' : 'hidden lg:flex'"
            >

              <!-- Filter Tabs, Search Bar & View Mode Switcher -->
              <div class="shrink-0 pb-2.5 space-y-2">
                <!-- Search and View Toggle Row -->
                <div class="flex items-center justify-between gap-2">
                  <div class="relative flex-1">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-stone-400"></i>
                    <input
                      type="text"
                      [(ngModel)]="catalogueSearchQuery"
                      placeholder="Search sweets, nuts, snacks..."
                      class="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-hidden focus:border-[#57251C] dark:text-[#F4F1ED] transition shadow-2xs"
                    >
                    <button
                      *ngIf="catalogueSearchQuery"
                      type="button"
                      (click)="catalogueSearchQuery = ''"
                      class="absolute right-2.5 top-2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  <!-- View Switcher (List vs Compact Grid) -->
                  <div class="flex items-center p-0.5 bg-stone-200/80 dark:bg-stone-900 rounded-xl border border-stone-300/60 dark:border-stone-800 shrink-0">
                    <button
                      type="button"
                      (click)="catalogViewMode = 'list'"
                      class="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      [ngClass]="catalogViewMode === 'list' ? 'bg-white dark:bg-stone-800 text-[#57251C] dark:text-[#EB9D8E] shadow-2xs' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'"
                      title="Compact List View (Recommended for easy browsing)"
                    >
                      <i class="fa-solid fa-list-ul text-[11px]"></i>
                      <span class="hidden sm:inline text-[11px]">List</span>
                    </button>
                    <button
                      type="button"
                      (click)="catalogViewMode = 'grid'"
                      class="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      [ngClass]="catalogViewMode === 'grid' ? 'bg-white dark:bg-stone-800 text-[#57251C] dark:text-[#EB9D8E] shadow-2xs' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'"
                      title="Compact Grid View"
                    >
                      <i class="fa-solid fa-grip text-[11px]"></i>
                      <span class="hidden sm:inline text-[11px]">Grid</span>
                    </button>
                  </div>
                </div>

                <!-- Category Pills with Item Counts -->
                <div class="flex items-center gap-1.5 overflow-x-auto py-0.5 custom-scrollbar">
                  <button
                    type="button"
                    *ngFor="let cat of catalogueCategories"
                    (click)="selectedCategoryFilter = cat"
                    class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition cursor-pointer flex items-center gap-1.5"
                    [ngClass]="selectedCategoryFilter === cat ? 'bg-[#57251C] text-white border-[#57251C] shadow-2xs' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-stone-400'"
                  >
                    <i [class]="getCategoryIcon(cat) + ' text-[10px]'"></i>
                    <span>{{ cat }}</span>
                    <span
                      class="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold"
                      [ngClass]="selectedCategoryFilter === cat ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'"
                    >
                      {{ getCategoryCount(cat) }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- Loading Skeleton -->
              <div *ngIf="isLoadingItems" class="p-12 text-center text-xs text-stone-500 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800">
                <i class="fa-solid fa-spinner fa-spin text-xl text-[#57251C] mb-2"></i>
                <p class="font-semibold">Loading treats and snacks...</p>
              </div>

              <!-- Empty State -->
              <div *ngIf="!isLoadingItems && filteredCatalogueProducts.length === 0" class="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
                <i class="fa-solid fa-box-open text-2xl text-stone-400 mb-2"></i>
                <p class="text-xs font-semibold text-stone-600 dark:text-stone-400">No matching items found</p>
                <button (click)="catalogueSearchQuery = ''; selectedCategoryFilter = 'All Items'" class="mt-2 text-xs text-[#57251C] underline font-semibold cursor-pointer">
                  Reset search filter
                </button>
              </div>

              <!-- Scrollable Items Grid: Responsive cards with dedicated smooth scroll -->
              <div *ngIf="!isLoadingItems && filteredCatalogueProducts.length > 0" class="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar space-y-2 pb-36 sm:pb-40 lg:pb-4">

                <!-- 1. COMPACT LIST VIEW (DEFAULT: Ideal for short names, fast multi-item adding) -->
                <div *ngIf="catalogViewMode === 'list'" class="space-y-1.5">
                  <div
                    *ngFor="let item of filteredCatalogueProducts"
                    class="group p-2 sm:p-2.5 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
                    [ngClass]="isItemInHamper(item.uid)
                      ? 'border-[#57251C] dark:border-[#EB9D8E]/50 bg-amber-50/40 dark:bg-stone-900/90 ring-1 ring-[#57251C]/20'
                      : 'border-stone-200/80 dark:border-stone-800 bg-white dark:bg-[#1E1916] hover:border-stone-300 dark:hover:border-stone-700'"
                  >
                    <!-- Left: Thumbnail & Name -->
                    <div class="flex items-center gap-2.5 min-w-0 flex-1">
                      <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0 flex items-center justify-center bg-[#FAF7F2] dark:bg-stone-800 text-[#57251C] dark:text-[#EB9D8E] overflow-hidden border border-stone-100 dark:border-stone-700/50 group-hover:scale-105 transition-transform">
                        <img *ngIf="item.imageUrl" [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover">
                        <i *ngIf="!item.imageUrl" [class]="getItemVisual(item.name).icon + ' text-sm'"></i>
                      </div>

                      <div class="min-w-0 flex-1 pr-1">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <h3 class="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                            {{ item.name }}
                          </h3>
                          <span
                            *ngIf="isItemInHamper(item.uid)"
                            class="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#57251C] text-white"
                          >
                            {{ getHamperItemQuantity(item.uid) }} in box
                          </span>
                        </div>
                        <div class="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500 dark:text-stone-400 font-medium">
                          <span class="inline-flex items-center gap-1">
                            <i [class]="getItemVisual(item.name).icon + ' text-[9px] text-[#9C4738]'"></i>
                            {{ item.category || getItemVisual(item.name).badge }}
                          </span>
                          <span *ngIf="item.description" class="hidden sm:inline text-stone-400 truncate max-w-xs">
                            &bull; {{ item.description }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Right: Price & Stepper/Add -->
                    <div class="flex items-center gap-2.5 sm:gap-3 shrink-0">
                      <div class="text-right">
                        <span class="text-xs sm:text-sm font-mono font-extrabold text-[#57251C] dark:text-[#EB9D8E]">
                          ₹{{ item.price }}
                        </span>
                      </div>

                      <div>
                        <!-- Add Button -->
                        <button
                          *ngIf="!isItemInHamper(item.uid)"
                          type="button"
                          (click)="addCatalogueItemToHamper(item)"
                          class="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl border border-[#57251C] bg-[#57251C]/5 hover:bg-[#57251C] hover:text-white text-[#57251C] dark:text-[#EB9D8E] dark:hover:text-white text-xs font-bold transition cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs hover:shadow-xs"
                        >
                          <i class="fa-solid fa-plus text-[9px]"></i>
                          <span>Add</span>
                        </button>

                        <!-- Micro Stepper -->
                        <div *ngIf="isItemInHamper(item.uid)" class="flex items-center gap-0.5 bg-stone-100 dark:bg-stone-800 border border-[#57251C]/30 dark:border-stone-700 rounded-xl p-0.5 shadow-2xs">
                          <button
                            type="button"
                            (click)="decreaseHamperQuantity(item.uid)"
                            class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white dark:bg-stone-900 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span class="text-xs font-bold text-stone-900 dark:text-stone-100 px-1 sm:px-1.5 font-mono min-w-[18px] sm:min-w-[20px] text-center">
                            {{ getHamperItemQuantity(item.uid) }}
                          </span>
                          <button
                            type="button"
                            (click)="increaseHamperQuantity(item.uid)"
                            class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white dark:bg-stone-900 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center cursor-pointer active:scale-90"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 2. COMPACT GRID VIEW (Modern high-density cards) -->
                <div *ngIf="catalogViewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  <div
                    *ngFor="let item of filteredCatalogueProducts"
                    class="p-2 sm:p-2.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 group shadow-2xs hover:shadow-xs"
                    [ngClass]="isItemInHamper(item.uid)
                      ? 'border-[#57251C] ring-1 ring-[#57251C]/25 bg-amber-50/30 dark:bg-stone-900/80'
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1E1916] hover:border-stone-400'"
                  >
                    <!-- Visual & Info -->
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm bg-[#FAF7F2] dark:bg-stone-800 text-[#57251C] dark:text-[#EB9D8E] group-hover:scale-105 transition-transform overflow-hidden border border-stone-100 dark:border-stone-700/50">
                        <img *ngIf="item.imageUrl" [src]="item.imageUrl" [alt]="item.name" class="w-full h-full object-cover">
                        <i *ngIf="!item.imageUrl" [class]="getItemVisual(item.name).icon"></i>
                      </div>
                      <div class="min-w-0 flex-1">
                        <h3 class="text-xs font-bold text-stone-900 dark:text-stone-100 truncate" [title]="item.name">
                          {{ item.name }}
                        </h3>
                        <span class="text-[10px] text-stone-500 dark:text-stone-400 block truncate font-medium">
                          {{ item.category || getItemVisual(item.name).badge }}
                        </span>
                      </div>
                    </div>

                    <!-- Price & Action -->
                    <div class="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                      <span class="text-xs font-mono font-bold text-[#57251C] dark:text-[#EB9D8E]">
                        ₹{{ item.price }}
                      </span>

                      <div>
                        <!-- Add Button -->
                        <button
                          *ngIf="!isItemInHamper(item.uid)"
                          type="button"
                          (click)="addCatalogueItemToHamper(item)"
                          class="px-2.5 py-1 rounded-xl border border-[#57251C] bg-[#57251C]/5 hover:bg-[#57251C] hover:text-white text-[#57251C] dark:text-[#EB9D8E] dark:hover:text-white text-xs font-bold transition cursor-pointer active:scale-95 flex items-center gap-1 shadow-2xs"
                        >
                          <i class="fa-solid fa-plus text-[9px]"></i>
                          <span>Add</span>
                        </button>

                        <!-- Micro Stepper -->
                        <div *ngIf="isItemInHamper(item.uid)" class="flex items-center gap-0.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-0.5 shadow-2xs">
                          <button
                            type="button"
                            (click)="decreaseHamperQuantity(item.uid)"
                            class="w-5 h-5 rounded-md bg-white dark:bg-stone-900 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-rose-600 flex items-center justify-center cursor-pointer active:scale-90"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span class="text-xs font-bold text-stone-900 dark:text-stone-100 px-1 font-mono min-w-[16px] text-center">
                            {{ getHamperItemQuantity(item.uid) }}
                          </span>
                          <button
                            type="button"
                            (click)="increaseHamperQuantity(item.uid)"
                            class="w-5 h-5 rounded-md bg-white dark:bg-stone-900 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-600 flex items-center justify-center cursor-pointer active:scale-90"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Custom Item Link -->
                <div class="pt-2 text-center">
                  <button
                    type="button"
                    (click)="isCustomItemFormOpen = !isCustomItemFormOpen"
                    class="text-[11px] font-semibold text-stone-500 hover:text-[#57251C] dark:hover:text-[#EB9D8E] transition cursor-pointer inline-flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
                  >
                    <i class="fa-solid fa-circle-plus text-[10px] text-[#9C4738]"></i>
                    <span>Need something special? Add custom item</span>
                  </button>
                </div>

                <!-- Inline Custom Item Input -->
                <div *ngIf="isCustomItemFormOpen" class="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2.5 text-xs shadow-xs animate-fade-in">
                  <div class="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                    <span class="flex items-center gap-1.5">
                      <i class="fa-solid fa-pen-ruler text-[#9C4738]"></i>
                      Add Custom Item to Hamper
                    </span>
                    <button (click)="isCustomItemFormOpen = false" class="text-stone-400 hover:text-stone-600 text-sm cursor-pointer" aria-label="Close custom item form">&times;</button>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <input
                      type="text"
                      [(ngModel)]="newCustomItemName"
                      placeholder="Item name (e.g. Kaju Katli 250g, Silver Coin)"
                      class="sm:col-span-8 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs dark:text-stone-100 focus:outline-hidden focus:border-[#57251C]"
                    >
                    <input
                      type="number"
                      [(ngModel)]="newCustomItemQuantity"
                      min="1"
                      placeholder="Qty"
                      class="sm:col-span-4 px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs dark:text-stone-100 focus:outline-hidden focus:border-[#57251C]"
                    >
                  </div>
                  <div class="flex justify-end gap-2">
                    <button
                      type="button"
                      (click)="isCustomItemFormOpen = false"
                      class="px-3 py-1.5 text-stone-500 text-xs font-semibold hover:text-stone-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      (click)="addCustomItemToHamper()"
                      [disabled]="!newCustomItemName.trim()"
                      class="px-4 py-1.5 rounded-xl bg-[#57251C] hover:bg-[#3D1A13] text-white font-bold text-xs cursor-pointer disabled:opacity-40"
                    >
                      Add to Hamper
                    </button>
                  </div>
                </div>

              </div>

            </section>

            <!-- RIGHT: GIFT BOX TRAY (5 COLS ON DESKTOP, TOGGLED ON MOBILE) -->
            <aside
              class="lg:col-span-5 h-full flex-col min-h-0 overflow-hidden"
              [ngClass]="mobileTab === 'box' ? 'flex' : 'hidden lg:flex'"
            >
              <!-- Back to items banner on mobile -->
              <div class="lg:hidden shrink-0 pb-2 flex items-center justify-between">
                <button
                  type="button"
                  (click)="mobileTab = 'catalogue'"
                  class="text-xs font-bold text-[#57251C] dark:text-[#EB9D8E] flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs active:scale-95 cursor-pointer"
                >
                  <i class="fa-solid fa-arrow-left text-[10px]"></i>
                  <span>Add More Treats</span>
                </button>
                <span class="text-[11px] text-stone-500 font-medium">Step 2: Review Inclusions</span>
              </div>

              <div class="flex-1 min-h-0 overflow-hidden">
                <ng-container *ngTemplateOutlet="giftBoxSimulationTemplate"></ng-container>
              </div>
            </aside>

          </div>
        </main>

        <!-- REUSABLE GIFT BOX SIMULATION TEMPLATE (Self-contained, perfectly sized for screen) -->
        <ng-template #giftBoxSimulationTemplate>
          <div class="h-full flex flex-col bg-white dark:bg-[#1E1916] rounded-3xl border border-stone-200 dark:border-stone-800 p-3.5 sm:p-4 shadow-xs overflow-hidden min-h-0">

            <!-- 1. Box Header (Shrink-0) -->
            <div class="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800 shrink-0">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-[#57251C] dark:text-[#D9C3B9] flex items-center justify-center text-xs shadow-2xs">
                  <i class="fa-solid fa-gift"></i>
                </span>
                <div>
                  <h2 class="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-tight">
                    Your Custom Hamper
                  </h2>
                  <p class="text-[10px] text-stone-500">
                    {{ selectedOccasion }} &bull; {{ totalItemsCount }} item(s) selected
                  </p>
                </div>
              </div>

              <button
                *ngIf="hamperItems.length > 0"
                type="button"
                (click)="clearAllItems()"
                class="text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <!-- 2. Inclusions Scroll List (Flex-1: Takes remaining height, scrolls smoothly inside) -->
            <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar my-2 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-900/60">

              <!-- Empty State -->
              <div *ngIf="hamperItems.length === 0" class="h-full flex flex-col items-center justify-center py-6 text-center space-y-2">
                <div class="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 text-stone-300 dark:text-stone-600 flex items-center justify-center text-lg shadow-2xs">
                  <i class="fa-solid fa-basket-shopping"></i>
                </div>
                <h4 class="text-xs font-bold text-stone-700 dark:text-stone-300">Your hamper is empty</h4>
                <p class="text-[10px] text-stone-500 max-w-xs">
                  Click "+ Add" on items to create your custom gift box.
                </p>
                <button
                  type="button"
                  (click)="mobileTab = 'catalogue'"
                  class="mt-1.5 px-3.5 py-1.5 rounded-xl bg-[#57251C] text-white text-xs font-bold hover:bg-[#3D1A13] transition cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-cookie-bite text-[10px]"></i>
                  <span>Browse Treats to Add &rarr;</span>
                </button>
              </div>

              <!-- Filled Items Rows -->
              <div *ngIf="hamperItems.length > 0" class="space-y-1.5 pr-0.5">
                <div
                  *ngFor="let it of hamperItems"
                  class="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 flex items-center justify-between gap-2 text-xs shadow-2xs"
                >
                  <div class="flex items-center gap-2 min-w-0 flex-1">
                    <span class="w-5 h-5 rounded-md bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-[9px] text-[#57251C] shrink-0 overflow-hidden">
                      <img *ngIf="it.imageUrl" [src]="it.imageUrl" [alt]="it.name || 'Selected hamper item'" class="w-full h-full object-cover">
                      <i *ngIf="!it.imageUrl" [class]="getItemVisual(it.name).icon"></i>
                    </span>
                    <div class="min-w-0 flex-1">
                      <h4 class="font-bold text-stone-900 dark:text-stone-100 truncate text-[11px]">{{ it.name }}</h4>
                      <span class="text-[9px] text-stone-400 font-mono">
                        {{ it.isPriceConfirmed ? ('₹' + it.price + ' each') : 'Custom Item' }}
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5 shrink-0">
                    <!-- Micro Stepper -->
                    <div class="flex items-center bg-stone-100 dark:bg-stone-900 rounded-lg p-0.5 border border-stone-200 dark:border-stone-700">
                      <button
                        type="button"
                        (click)="decreaseHamperQuantity(it.uid)"
                        class="w-4 h-4 rounded text-[11px] font-bold text-stone-600 hover:text-stone-900 dark:text-stone-300 flex items-center justify-center cursor-pointer active:scale-90"
                      >
                        -
                      </button>
                      <span class="text-[11px] font-bold text-stone-800 dark:text-stone-200 font-mono px-1 min-w-3 text-center">{{ it.quantity }}</span>
                      <button
                        type="button"
                        (click)="increaseHamperQuantity(it.uid)"
                        class="w-4 h-4 rounded text-[11px] font-bold text-stone-600 hover:text-stone-900 dark:text-stone-300 flex items-center justify-center cursor-pointer active:scale-90"
                      >
                        +
                      </button>
                    </div>

                    <span *ngIf="it.isPriceConfirmed" class="font-mono font-bold text-stone-900 dark:text-stone-100 w-10 text-right text-[11px]">
                      ₹{{ (it.price || 0) * it.quantity }}
                    </span>

                    <button
                      type="button"
                      (click)="removeItemFromHamper(it.uid)"
                      class="text-stone-300 hover:text-rose-500 text-sm cursor-pointer px-0.5"
                      title="Remove item"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <!-- 3. Fixed Bottom Actions Area (Shrink-0: Stays visible above the fold!) -->
            <div class="shrink-0 space-y-2 pt-1 border-t border-stone-100 dark:border-stone-800">

           

              <!-- Compact Greeting Card Input -->
              <div>
                <textarea
                  [(ngModel)]="personalMessage"
                  (change)="onBuilderStateChanged()"
                  rows="1"
                  placeholder="Message for greeting card (optional)..."
                  class="w-full px-2.5 py-1 text-[11px] rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 focus:outline-hidden focus:border-[#57251C] dark:text-[#F4F1ED] resize-none"
                ></textarea>
              </div>

              <!-- Total Price Display -->
              <div class="flex items-center justify-between py-0.5">
                <div>
                  <span class="text-xs font-bold text-stone-600 dark:text-stone-300 block">Total Hamper Price:</span>
                  <span class="text-[9px] text-stone-400">Includes hamper box &amp; card &bull; PIN delivery calculated at checkout</span>
                </div>
                <div class="text-right">
                  <span class="text-xl font-mono font-extrabold text-[#57251C] dark:text-[#D9C3B9]">
                    ₹{{ estimatedCatalogueSubtotal }}
                  </span>
                </div>
              </div>

              <!-- Action CTAs: Direct Checkout & Bespoke Request -->
              <div class="space-y-1.5">
                <button
                  type="button"
                  (click)="addCustomHamperToCartAndCheckout()"
                  [disabled]="hamperItems.length === 0"
                  class="w-full py-2.5 px-3 rounded-xl bg-[#57251C] hover:bg-[#3D1A13] text-white text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                >
                  <i class="fa-solid fa-cart-shopping text-xs"></i>
                  <span>Add Hamper to Cart &amp; Checkout (₹{{ estimatedCatalogueSubtotal }})</span>
                </button>

                <div class="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    (click)="openReviewModal()"
                    [disabled]="hamperItems.length === 0"
                    class="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-[#57251C] dark:text-[#D9C3B9] text-[11px] font-bold transition disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <i class="fa-solid fa-paper-plane text-[10px]"></i>
                    <span>Quote Request</span>
                  </button>

                  <button
                    type="button"
                    (click)="orderViaWhatsApp()"
                    [disabled]="hamperItems.length === 0"
                    class="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <i class="fa-brands fa-whatsapp text-xs"></i>
                    <span>WhatsApp</span>
                  </button>
                </div>

                <p class="text-[10px] text-stone-500 text-center leading-tight pt-1">
                  <i class="fa-solid fa-circle-check text-emerald-600 mr-1"></i>Packaging, ribbon &amp; personalized card included. Delivery calculated at checkout.
                </p>
              </div>

            </div>

          </div>
        </ng-template>

        <!-- MOBILE STICKY FLOATING BOTTOM BAR: Floats smoothly ABOVE the sticky mobile bottom navigation bar -->
        <aside
          *ngIf="hamperItems.length > 0 && mobileTab === 'catalogue'"
          class="lg:hidden fixed bottom-[68px] sm:bottom-20 inset-x-3 z-40 bg-[#57251C] dark:bg-[#1E1916] text-white p-3 rounded-2xl shadow-2xl border border-white/15 dark:border-white/10 flex items-center justify-between gap-3 animate-fade-in backdrop-blur-md"
        >
          <div class="min-w-0">
            <span class="text-[10px] text-stone-300 font-medium block leading-tight">
              {{ totalItemsCount }} item(s) selected
            </span>
            <span class="text-sm font-mono font-bold text-white leading-none">
              ₹{{ estimatedCatalogueSubtotal }}
            </span>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button
              type="button"
              (click)="mobileTab = 'box'"
              class="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-100 active:scale-95 text-[#57251C] text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <i class="fa-solid fa-gift text-[11px]"></i>
              <span>View Box ({{ totalItemsCount }}) &rarr;</span>
            </button>
          </div>
        </aside>

        <!-- MOBILE SLIDE-UP DRAWER -->
        <div
          *ngIf="isMobileDrawerOpen"
          class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end lg:hidden animate-fade-in"
          (click)="isMobileDrawerOpen = false"
        >
          <div
            class="w-full bg-[#FAF7F2] dark:bg-[#1E1916] rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 space-y-3"
            (click)="$event.stopPropagation()"
          >
            <div class="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-2"></div>
            <ng-container *ngTemplateOutlet="giftBoxSimulationTemplate"></ng-container>
            <button
              type="button"
              (click)="isMobileDrawerOpen = false"
              class="w-full py-2 text-center text-xs font-semibold text-stone-500 hover:text-stone-700 cursor-pointer"
            >
              Continue Packing &rarr;
            </button>
          </div>
        </div>

        <!-- REVIEW & QUOTATION MODAL -->
        <app-modal
          [isOpen]="showReviewModal"
          title="Submit Custom Hamper Request"
          size="md"
          (onClose)="showReviewModal = false"
        >
          <div class="space-y-3 p-2 text-xs">
            <!-- Review Workflow Notice -->
            <div class="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <i class="fa-solid fa-clipboard-check text-amber-700 dark:text-amber-400 mt-0.5 shrink-0"></i>
              <p>
                <strong>Bespoke Review:</strong> We review your hamper inclusions, check packaging fit, and calculate delivery charges for your PIN code before sending you a quotation to accept.
              </p>
            </div>

            <div class="p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-1">
              <div class="flex items-center justify-between font-bold">
                <span>{{ selectedOccasion }}</span>
                <span class="font-mono text-sm">₹{{ estimatedCatalogueSubtotal }}</span>
              </div>
              <div class="text-[11px] text-stone-500">
                {{ totalItemsCount }} item(s) selected &bull; Satin ribbon &amp; gift box included
              </div>
            </div>

            <div class="space-y-2.5">
              <div>
                <label class="block text-[11px] font-semibold mb-1">Full Name *</label>
                <input type="text" [(ngModel)]="customerName" placeholder="Your Full Name" class="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 dark:text-[#F4F1ED]">
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-semibold mb-1">WhatsApp Mobile *</label>
                  <input type="tel" [(ngModel)]="customerPhone" placeholder="10-digit mobile number" maxlength="10" class="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 dark:text-[#F4F1ED]">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold mb-1">Email Address *</label>
                  <input type="email" [(ngModel)]="customerEmail" placeholder="yourname@gmail.com" class="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 dark:text-[#F4F1ED]">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-semibold mb-1">Delivery PIN Code *</label>
                  <input type="text" [(ngModel)]="deliveryPinCode" placeholder="6-digit PIN" maxlength="6" class="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 dark:text-[#F4F1ED]">
                </div>
                <div>
                  <label class="block text-[11px] font-semibold mb-1">City / District (Optional)</label>
                  <input type="text" [(ngModel)]="deliveryCity" placeholder="e.g. Pune, Mumbai" class="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 dark:text-[#F4F1ED]">
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold mb-1">Special Instructions or Delivery Date (Optional)</label>
                <textarea [(ngModel)]="customerNotes" rows="2" placeholder="e.g. Need delivery by 25th October, specific packaging instructions..." class="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 dark:text-[#F4F1ED]"></textarea>
              </div>

              <div *ngIf="submitErrorMessage" class="p-2.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
                {{ submitErrorMessage }}
              </div>
            </div>
          </div>

          <div modal-footer class="w-full flex items-center justify-between gap-2">
            <button type="button" (click)="showReviewModal = false" class="px-3 py-1.5 text-xs font-semibold text-stone-500 cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              (click)="submitConsultationRequest()"
              [disabled]="isSubmitting"
              class="px-5 py-2 rounded-xl bg-[#57251C] hover:bg-[#3D1A13] text-white text-xs font-bold transition disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <span *ngIf="isSubmitting" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ isSubmitting ? 'Submitting...' : 'Submit Request for Review' }}</span>
            </button>
          </div>
        </app-modal>

        <!-- SUCCESS MODAL -->
        <app-modal
          [isOpen]="showSuccessModal"
          title="Quote Request Received!"
          size="sm"
          (onClose)="showSuccessModal = false"
        >
          <div class="p-3 text-center space-y-3 text-xs">
            <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center text-lg">
              <i class="fa-solid fa-check"></i>
            </div>
            <div>
              <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Request Reference</span>
              <h3 class="font-mono text-base font-bold text-stone-900 dark:text-stone-100">{{ createdRequestNo }}</h3>
            </div>
            <p class="text-stone-600 dark:text-stone-400">
              Thank you! We have received your hamper details. Our team will message you on WhatsApp with your final quotation and design options.
            </p>
          </div>
          <div modal-footer class="w-full flex justify-end gap-2">
            <button type="button" (click)="showSuccessModal = false" class="px-4 py-1.5 text-xs font-semibold text-stone-500 cursor-pointer">
              Close
            </button>
            <a routerLink="/my-custom-hampers" class="px-4 py-1.5 rounded-xl bg-[#57251C] text-white text-xs font-semibold cursor-pointer">
              View My Requests &rarr;
            </a>
          </div>
        </app-modal>

      </div>
    </app-site-layout>
  `
})
export class BuildHamperPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);
  private readonly customHamperService = inject(CustomHamperService);
  private readonly cartService = inject(CartService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly occasions = [
    'Diwali Festive',
    'Ganesh Utsav',
    'Wedding & Shagun',
    'Birthday Special',
    'Anniversary',
    'Baby Shower',
    'Corporate & Bulk',
    'Celebration Box'
  ];

  selectedOccasion = 'Diwali Festive';
  personalMessage = '';
  selectedRecipient = 'Family & Friends';
  mobileTab: 'catalogue' | 'box' = 'catalogue';
  catalogViewMode: 'list' | 'grid' = 'list';

  getCategoryCount(cat: string): number {
    if (cat === 'All Items') return this.allCatalogueProducts.length;
    if (cat === 'Other / Uncategorized') {
      return this.allCatalogueProducts.filter(i => !i.category || !i.category.trim()).length;
    }
    return this.allCatalogueProducts.filter(i => i.category === cat).length;
  }

  getCategoryIcon(cat: string): string {
    const c = (cat || '').toLowerCase();
    if (c.includes('all')) return 'fa-solid fa-border-all';
    if (c.includes('sweet') || c.includes('snack')) return 'fa-solid fa-cookie-bite';
    if (c.includes('dry') || c.includes('nut')) return 'fa-solid fa-seedling';
    if (c.includes('pooja') || c.includes('diya')) return 'fa-solid fa-fire-flame-curved';
    if (c.includes('gift') || c.includes('packag')) return 'fa-solid fa-gift';
    return 'fa-solid fa-tag';
  }

  private itemSourcing = inject(ItemSourcingImageService);

  catalogueSearchQuery = '';
  selectedCategoryFilter = 'All Items';

  get catalogueCategories(): string[] {
    const list = ['All Items'];
    const standard = [
      'Sweets & Snacks',
      'Dry Fruits & Nuts',
      'Pooja & Diyas',
      'Gifts & Packaging'
    ];
    const presentCats = new Set<string>();
    let hasUncategorized = false;

    this.allCatalogueProducts.forEach(item => {
      const cat = (item.category || '').trim();
      if (cat) {
        presentCats.add(cat);
      } else {
        hasUncategorized = true;
      }
    });

    standard.forEach(s => {
      list.push(s);
      presentCats.delete(s);
    });

    presentCats.forEach(c => list.push(c));

    if (hasUncategorized) {
      list.push('Other / Uncategorized');
    }

    return list;
  }

  readonly aiCurations = [
    {
      id: 'diwali_grand',
      name: 'Diwali Box',
      icon: '🪔',
      itemNames: ['diya', 'candle', 'ladoo', 'almond', 'cashew']
    },
    {
      id: 'dry_fruits',
      name: 'Dry Fruits Pack',
      icon: '🥜',
      itemNames: ['almond', 'cashew', 'pista']
    },
    {
      id: 'sweet_savory',
      name: 'Mithai & Namkeen',
      icon: '🌸',
      itemNames: ['karanji', 'chakli', 'chivda', 'shankar', 'ladoo']
    }
  ];

  aiCurationActiveMessage = '';
  isMobileCombosOpen = false;

  hamperMarkupConfig: HamperMarkupConfig = { percent: 0, fixedAmount: 0 };
  hamperMarkup = 0;
  allCatalogueProducts: HamperBuilderItem[] = [];
  isLoadingItems = true;

  isCustomItemFormOpen = false;
  newCustomItemName = '';
  newCustomItemQuantity = 1;
  newCustomItemDesc = '';
  newCustomItemImageUrl = '';

  hamperItems: HamperBuilderItem[] = [];
  isMobileDrawerOpen = false;

  showReviewModal = false;
  customerName = '';
  customerEmail = '';
  customerPhone = '';
  deliveryPinCode = '';
  deliveryCity = '';
  customerNotes = '';
  isSubmitting = false;
  submitErrorMessage = '';
  showSuccessModal = false;
  createdRequestNo = '';

  async ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Build Your Own Hamper — RMS Creations Gift Studio',
      description: 'Handpick individual sweets, dry fruits, pooja items, and keepsakes to create your custom gift hamper. Instant live simulation with concierge quotation.',
      keywords: 'build hamper, custom gift hamper, personalized gift box, DIY gift hamper Mumbai, create hamper online',
      slug: 'build-hamper'
    });

    this.seo.setBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Build Your Own Hamper', url: '/build-hamper' }
    ]);

    const user = this.auth.currentUser;
    if (user) {
      this.customerName = user.name || '';
      this.customerEmail = user.email || '';
      this.customerPhone = user.phone_no || '';
    }

    this.restoreDraft();
    await this.loadCatalogueItems();
  }

  private restoreDraft() {
    if (typeof sessionStorage === 'undefined') return;
    try {
      const draft = sessionStorage.getItem('rms_hamper_builder_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
          this.hamperItems = parsed.items;
        }
        if (parsed.selectedOccasion) this.selectedOccasion = parsed.selectedOccasion;
        if (parsed.personalMessage) this.personalMessage = parsed.personalMessage;
        if (parsed.selectedRecipient) this.selectedRecipient = parsed.selectedRecipient;
        if (parsed.catalogViewMode === 'list' || parsed.catalogViewMode === 'grid') {
          this.catalogViewMode = parsed.catalogViewMode;
        }
      }
    } catch { }
  }

  onBuilderStateChanged() {
    if (typeof sessionStorage === 'undefined') return;
    try {
      sessionStorage.setItem('rms_hamper_builder_draft', JSON.stringify({
        items: this.hamperItems,
        selectedOccasion: this.selectedOccasion,
        personalMessage: this.personalMessage,
        selectedRecipient: this.selectedRecipient,
        catalogViewMode: this.catalogViewMode
      }));
    } catch { }
  }

  async loadCatalogueItems() {
    this.isLoadingItems = true;
    this.cdr.markForCheck();

    try {
      this.hamperMarkupConfig = await this.customHamperService.getHamperMarkupConfig();
      this.hamperMarkup = this.hamperMarkupConfig.fixedAmount;

      const { data, error } = await this.supabase
        .from('product_details')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (!error && data && data.length > 0) {
        this.allCatalogueProducts = data.map((item: any) => {
          const basePrice = Number(item.price || 0);
          const finalPrice = this.customHamperService.calculateCustomerItemPrice(basePrice, this.hamperMarkupConfig);
          const markupDiff = finalPrice - basePrice;
          const parsed = this.itemSourcing.extractMetadataFromDescription(item.description);
          const explicitCat = (item.category || parsed.category || '').trim();
          const category = explicitCat || this.getItemVisual(item.name).category || '';
          return {
            uid: `inclusion-${item.id}`,
            itemType: 'catalogue_inclusion',
            inclusionId: Number(item.id),
            name: this.formatItemName(item.name),
            description: parsed.cleanDescription || item.description || '',
            basePrice: basePrice,
            markupAmount: markupDiff,
            price: finalPrice,
            stockQuantity: item.stock_quantity != null ? Number(item.stock_quantity) : null,
            imageUrl: item.image || parsed.image || (item.description?.match(/"image":"([^"]+)"/)?.[1] ?? ''),
            isPriceConfirmed: true,
            quantity: 1,
            category: category
          };
        });
      } else {
        this.loadFallbackItems();
      }
    } catch {
      this.loadFallbackItems();
    } finally {
      this.isLoadingItems = false;
      this.cdr.markForCheck();
    }
  }

  private formatItemName(name: string): string {
    if (!name) return 'Artisanal Treat';
    const cleaned = name.replace(/^\d+\s+/, '').trim();
    return cleaned.replace(/\b([a-z])/g, (_, char) => char.toUpperCase());
  }

  private loadFallbackItems() {
    const fallbackList = [
      { id: 10, name: 'Pooja Diya', price: 49 },
      { id: 11, name: 'Essence Candle', price: 10 },
      { id: 12, name: 'Almonds (Badam)', price: 20 },
      { id: 13, name: 'Cashew (Kaju)', price: 20 },
      { id: 14, name: 'Pistachio (Pista)', price: 20 },
      { id: 15, name: 'Personalized Greeting Card', price: 50 },
      { id: 16, name: 'Karanji', price: 15 },
      { id: 17, name: 'Chakli', price: 7.5 },
      { id: 18, name: 'Methi Ladoo', price: 10 },
      { id: 19, name: 'Besan Ladoo', price: 10 },
      { id: 20, name: 'Rawa Ladoo', price: 10 },
      { id: 21, name: 'Chivda', price: 10 },
      { id: 22, name: 'Shankar Pali', price: 10 },
      { id: 23, name: 'Peanut Chikki', price: 10 },
      { id: 24, name: 'Artisanal Hamper Box', price: 10 },
      { id: 9, name: 'Festive Hair Clip', price: 7 }
    ];

    this.allCatalogueProducts = fallbackList.map(item => {
      const basePrice = item.price;
      const finalPrice = this.customHamperService.calculateCustomerItemPrice(basePrice, this.hamperMarkupConfig);
      const markupDiff = finalPrice - basePrice;
      return {
        uid: `inclusion-${item.id}`,
        itemType: 'catalogue_inclusion',
        inclusionId: item.id,
        name: item.name,
        description: '',
        basePrice: basePrice,
        markupAmount: markupDiff,
        price: finalPrice,
        isPriceConfirmed: true,
        quantity: 1,
        category: this.getItemVisual(item.name).category
      };
    });
  }

  getItemVisual(name: string): ItemVisualMeta {
    const n = (name || '').toLowerCase();
    if (n.includes('almond') || n.includes('badam')) {
      return { icon: 'fa-solid fa-seedling', badge: 'Dry Fruits', category: 'Dry Fruits & Nuts' };
    }
    if (n.includes('cashew') || n.includes('kaju')) {
      return { icon: 'fa-solid fa-bowl-food', badge: 'Dry Fruits', category: 'Dry Fruits & Nuts' };
    }
    if (n.includes('pista') || n.includes('pistachio')) {
      return { icon: 'fa-solid fa-leaf', badge: 'Dry Fruits', category: 'Dry Fruits & Nuts' };
    }
    if (n.includes('ladoo') || n.includes('laddu') || n.includes('karanji') || n.includes('chikki') || n.includes('sweet') || n.includes('modak')) {
      return { icon: 'fa-solid fa-cookie-bite', badge: 'Sweet', category: 'Sweets & Snacks' };
    }
    if (n.includes('chakli') || n.includes('chivda') || n.includes('shankar') || n.includes('snack')) {
      return { icon: 'fa-solid fa-bowl-rice', badge: 'Snack', category: 'Sweets & Snacks' };
    }
    if (n.includes('diya')) {
      return { icon: 'fa-solid fa-fire-flame-curved', badge: 'Diya', category: 'Pooja & Diyas' };
    }
    if (n.includes('candle')) {
      return { icon: 'fa-solid fa-fire', badge: 'Candle', category: 'Pooja & Diyas' };
    }
    if (n.includes('card')) {
      return { icon: 'fa-solid fa-envelope-open-text', badge: 'Greeting Card', category: 'Gifts & Packaging' };
    }
    if (n.includes('box')) {
      return { icon: 'fa-solid fa-box-open', badge: 'Gift Box', category: 'Gifts & Packaging' };
    }
    if (n.includes('clip') || n.includes('charm') || n.includes('ribbon')) {
      return { icon: 'fa-solid fa-gem', badge: 'Gift & Keepsake', category: 'Gifts & Packaging' };
    }
    return { icon: 'fa-solid fa-gift', badge: 'Gift Item', category: 'Gifts & Packaging' };
  }

  get filteredCatalogueProducts(): HamperBuilderItem[] {
    return this.allCatalogueProducts.filter(item => {
      const matchesSearch = !this.catalogueSearchQuery.trim() ||
        item.name.toLowerCase().includes(this.catalogueSearchQuery.toLowerCase());
      let matchesCat = false;
      if (this.selectedCategoryFilter === 'All Items') {
        matchesCat = true;
      } else if (this.selectedCategoryFilter === 'Other / Uncategorized') {
        matchesCat = !item.category || !item.category.trim();
      } else {
        matchesCat = item.category === this.selectedCategoryFilter;
      }
      return matchesSearch && matchesCat;
    });
  }

  isItemInHamper(uid: string): boolean {
    return this.hamperItems.some(i => i.uid === uid);
  }

  getHamperItemQuantity(uid: string): number {
    const it = this.hamperItems.find(i => i.uid === uid);
    return it ? it.quantity : 0;
  }

  addCatalogueItemToHamper(item: HamperBuilderItem) {
    const existing = this.hamperItems.find(i => i.uid === item.uid);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.hamperItems.push({ ...item, quantity: 1 });
    }
    this.onBuilderStateChanged();
    this.cdr.markForCheck();
  }

  increaseHamperQuantity(uid: string) {
    const item = this.hamperItems.find(i => i.uid === uid);
    if (item && item.quantity < 50) {
      item.quantity += 1;
      this.onBuilderStateChanged();
      this.cdr.markForCheck();
    }
  }

  decreaseHamperQuantity(uid: string) {
    const item = this.hamperItems.find(i => i.uid === uid);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeItemFromHamper(uid);
      }
      this.onBuilderStateChanged();
      this.cdr.markForCheck();
    }
  }

  removeItemFromHamper(uid: string) {
    this.hamperItems = this.hamperItems.filter(i => i.uid !== uid);
    this.onBuilderStateChanged();
    this.cdr.markForCheck();
  }

  clearAllItems() {
    this.hamperItems = [];
    this.onBuilderStateChanged();
    this.cdr.markForCheck();
  }

  addCustomItemToHamper() {
    if (!this.newCustomItemName.trim()) return;

    const customUid = `custom-${Date.now()}`;
    const customItem: HamperBuilderItem = {
      uid: customUid,
      itemType: 'custom_requested',
      name: this.newCustomItemName.trim(),
      description: this.newCustomItemDesc.trim(),
      price: null,
      isPriceConfirmed: false,
      quantity: Math.max(1, Number(this.newCustomItemQuantity) || 1),
      imageUrl: this.newCustomItemImageUrl || '',
      category: 'Custom Item'
    };

    this.hamperItems.push(customItem);
    this.newCustomItemName = '';
    this.newCustomItemQuantity = 1;
    this.newCustomItemDesc = '';
    this.newCustomItemImageUrl = '';
    this.isCustomItemFormOpen = false;
    this.onBuilderStateChanged();
    this.cdr.markForCheck();
  }

  get totalItemsCount(): number {
    return this.hamperItems.reduce((acc, i) => acc + i.quantity, 0);
  }

  get estimatedCatalogueSubtotal(): number {
    return this.hamperItems.reduce((acc, i) => {
      if (i.isPriceConfirmed && typeof i.price === 'number') {
        return acc + (i.price * i.quantity);
      }
      return acc;
    }, 0);
  }

  applyAiCuration(curationId: string) {
    const curation = this.aiCurations.find(c => c.id === curationId);
    if (!curation) return;

    this.hamperItems = [];
    for (const keyword of curation.itemNames) {
      const match = this.allCatalogueProducts.find(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
      if (match && !this.hamperItems.some(i => i.uid === match.uid)) {
        this.hamperItems.push({ ...match, quantity: 1 });
      }
    }

    this.aiCurationActiveMessage = `Added "${curation.name}" with ${this.hamperItems.length} items to your box!`;
    this.onBuilderStateChanged();
    this.cdr.markForCheck();

    setTimeout(() => {
      this.aiCurationActiveMessage = '';
      this.cdr.markForCheck();
    }, 4000);
  }

  applyAiSurpriseMe() {
    if (this.allCatalogueProducts.length === 0) return;
    const shuffled = [...this.allCatalogueProducts].sort(() => 0.5 - Math.random());
    this.hamperItems = shuffled.slice(0, 5).map(i => ({ ...i, quantity: 1 }));
    this.aiCurationActiveMessage = `🎲 Curated a 5-item festive mix for you!`;
    this.onBuilderStateChanged();
    this.cdr.markForCheck();

    setTimeout(() => {
      this.aiCurationActiveMessage = '';
      this.cdr.markForCheck();
    }, 4000);
  }

  addCustomHamperToCartAndCheckout() {
    if (this.hamperItems.length === 0) return;
    const itemSummary = this.hamperItems.map(i => `${i.quantity}x ${i.name} (₹${(i.price || 0) * i.quantity})`).join(', ');
    const customNotes = `Occasion: ${this.selectedOccasion} | Inclusions: ${itemSummary}${this.personalMessage ? ' | Card: "' + this.personalMessage + '"' : ''}`;
    // Gift box + packing material base ~0.4kg, plus ~0.15kg per inclusion item
    const estimatedWeightKg = Math.max(0.8, Math.round((0.4 + this.totalItemsCount * 0.15) * 10) / 10);

    this.cartService.addToCart({
      id: `custom-hamper-${Date.now()}`,
      title: `Custom Hamper: ${this.selectedOccasion}`,
      price: this.estimatedCatalogueSubtotal,
      image: 'assets/logo.png',
      category: 'Custom Hamper',
      weight_kg: estimatedWeightKg,
      notes: customNotes
    }, 1);

    this.router.navigate(['/cart']);
  }

  orderViaWhatsApp() {
    if (this.hamperItems.length === 0) return;
    const itemLines = this.hamperItems.map(i => `  • ${i.quantity}x ${i.name} (₹${(i.price || 0) * i.quantity})`).join('\n');
    const msg = [
      `*Custom Hamper Inquiry & Quote Request*`,
      `Occasion: ${this.selectedOccasion}`,
      `Selected Inclusions (${this.totalItemsCount} items):`,
      itemLines,
      `*Estimated Items Subtotal: ₹${this.estimatedCatalogueSubtotal}*`,
      this.deliveryPinCode ? `Delivery PIN Code: ${this.deliveryPinCode}` : '',
      this.personalMessage ? `Greeting Card Message: "${this.personalMessage}"` : '',
      `Please check item availability and let me know the confirmed delivery charges for my PIN code!`
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/919284905118?text=${encodeURIComponent(msg)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }

  openReviewModal() {
    this.isMobileDrawerOpen = false;
    if (this.hamperItems.length === 0) return;
    this.submitErrorMessage = '';

    const user = this.auth.currentUser;
    if (user) {
      if (!this.customerName) this.customerName = user.name || '';
      if (!this.customerEmail) this.customerEmail = user.email || '';
      if (!this.customerPhone) this.customerPhone = user.phone_no || '';
    }

    const savedProfile = this.localStorage.getItem<any>('rms_customer_profile');
    if (savedProfile) {
      if (!this.deliveryPinCode && savedProfile.pin) this.deliveryPinCode = savedProfile.pin;
      if (!this.deliveryCity && savedProfile.city) this.deliveryCity = savedProfile.city;
    }

    this.showReviewModal = true;
    this.cdr.markForCheck();
  }

  async submitConsultationRequest() {
    this.submitErrorMessage = '';

    if (this.hamperItems.length === 0) {
      this.submitErrorMessage = 'Please add at least one item to your hamper.';
      return;
    }

    if (!this.customerName.trim() || !this.customerEmail.trim() || !this.customerPhone.trim()) {
      this.submitErrorMessage = 'Please fill in your name, WhatsApp mobile number, and email address.';
      return;
    }

    if (!this.deliveryPinCode || this.deliveryPinCode.trim().length !== 6) {
      this.submitErrorMessage = 'Please enter a valid 6-digit delivery PIN code so we can verify courier availability and delivery charges.';
      return;
    }

    if (!this.auth.isAuthenticated) {
      this.onBuilderStateChanged();
      this.submitErrorMessage = 'Please sign in to submit your custom hamper request.';
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/build-hamper' } });
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    try {
      const currentUser = this.auth.currentUser;
      const destinationNote = `Delivery PIN: ${this.deliveryPinCode.trim()}${this.deliveryCity.trim() ? ` (${this.deliveryCity.trim()})` : ''}`;
      const mergedNotes = [destinationNote, this.customerNotes.trim()].filter(Boolean).join('\n\n');

      const requestPayload = {
        customer_id: currentUser?.id || null,
        customer_name: this.customerName.trim(),
        customer_email: this.customerEmail.trim(),
        customer_phone: this.customerPhone.trim(),
        occasion: this.selectedOccasion,
        theme: 'Standard Luxury',
        recipient_gender: this.selectedRecipient,
        personal_message: this.personalMessage.trim(),
        customer_notes: mergedNotes,
        estimated_catalogue_total: this.estimatedCatalogueSubtotal,
        is_active: true
      };

      const requestItems: Omit<CustomHamperRequestItem, 'id' | 'request_id'>[] = this.hamperItems.map(it => ({
        item_type: it.itemType,
        product_id: it.productId || null,
        inclusion_item_id: it.inclusionId || null,
        item_name: it.name,
        item_description: it.description || null,
        quantity: it.quantity,
        unit_price_snapshot: it.isPriceConfirmed ? it.price : null,
        admin_confirmed_price: null,
        reference_image_url: it.imageUrl || null,
        is_confirmed_catalogue: it.isPriceConfirmed,
        is_active: true
      }));

      const res = await this.customHamperService.submitRequest(requestPayload, requestItems);

      if (res.success && res.requestNo) {
        this.createdRequestNo = res.requestNo;
        this.showReviewModal = false;
        this.showSuccessModal = true;
        this.hamperItems = [];
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('rms_hamper_builder_draft');
        }
      } else {
        this.submitErrorMessage = res.error || 'Failed to submit quote request. Please try again.';
      }
    } catch (err: any) {
      this.submitErrorMessage = err?.message || 'Unexpected error while submitting your request.';
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }
}