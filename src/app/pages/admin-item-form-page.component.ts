import { Component, OnInit, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { FileUploadComponent } from '../shared/ui/file-upload.component';
import { CustomHamperService } from '../services/custom-hamper.service';
import { HamperMarkupConfig } from '../models/custom-hamper.model';
import {
  ItemSourcingImageService,
  OnlineImageCandidate,
  PlatformSourcingMeta
} from '../services/item-sourcing-image.service';

@Component({
  selector: 'app-admin-item-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FileUploadComponent],
  template: `
    <div class="mx-auto pb-12 space-y-4 transition-colors duration-300">

      <!-- Top Sticky Action Bar -->
      <div class="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#FAF7F2]/95 dark:bg-[#1E1916]/95 backdrop-blur-md border-b border-[#EADFD2]/80 dark:border-white/10 flex items-center justify-between gap-4">

        <!-- Left: Back, Title & Live Status -->
        <div class="flex items-center gap-3 min-w-0">
          <a routerLink="/admin/items"
             class="p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] bg-white dark:bg-[#251F1C] rounded-xl border border-[#EADFD2] dark:border-white/10 transition-colors shadow-2xs shrink-0 cursor-pointer"
             title="Back to Items Catalog">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>

          <div class="min-w-0">
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">
                {{ isEdit ? (item.name || 'Edit Item') : 'New Item' }}
              </h1>

              <!-- Live Store Visibility Switch Pill -->
              <button type="button" (click)="item.is_active = !item.is_active"
                      class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                      [ngClass]="item.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="item.is_active ? 'bg-emerald-500' : 'bg-stone-400'"></span>
                <span>{{ item.is_active ? 'Active' : 'Hidden' }}</span>
              </button>

              <!-- Live Readiness Tracker Pill -->
              <div class="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0"
                   [ngClass]="readinessScore.isReady ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="readinessScore.isReady ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                <span>{{ readinessScore.isReady ? 'Ready' : (readinessScore.completed + ' of ' + readinessScore.total + ' fields filled') }}</span>
              </div>
            </div>

            <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] truncate">
              {{ isEdit ? 'Update item details, sourcing prices, and stock levels' : 'Add pooja items, sweets, diyas, dry fruits, candles, or packaging items' }}
            </p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2.5 shrink-0">
          <button type="button" routerLink="/admin/items"
                  class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] rounded-xl transition-colors cursor-pointer">
            Cancel
          </button>

          <!-- Save & Add Another Button -->
          <button *ngIf="!isEdit" type="button" (click)="saveItem(true)" [disabled]="saving"
                  class="px-3.5 py-2 text-xs font-bold text-[#9C4738] dark:text-[#DD8776] bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-2xs hover:bg-[#F3E7DC]/30 cursor-pointer">
            <i class="fa-solid fa-plus text-xs"></i>
            <span class="hidden sm:inline">Save & Add Another</span>
            <span class="sm:hidden">+ Another</span>
          </button>

          <!-- Primary Save / Publish Button -->
          <button type="button" (click)="saveItem(false)" [disabled]="saving"
                  class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  title="Keyboard Shortcut: ⌘+Enter">
            <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Save Item') }}</span>
            <span class="text-[10px] opacity-75 hidden sm:inline font-mono">⌘↵</span>
          </button>
        </div>

      </div>

      <!-- Feedback Banners -->
      <div *ngIf="successMessage" class="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between animate-in fade-in">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-circle-check"></i>
          <span>{{ successMessage }}</span>
        </div>
        <button (click)="successMessage = ''" class="text-emerald-500 hover:text-emerald-700 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div *ngIf="errorMessage" class="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800/40 flex items-center justify-between animate-in fade-in">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>
        <button (click)="errorMessage = ''" class="text-rose-400 hover:text-rose-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- UNIFIED 2-COLUMN WORKSPACE -->
      <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-6 shadow-2xs">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <!-- LEFT COLUMN: Component Details, Unit Cost, Stock & Cheapest Sourcing Hub (7 Cols) -->
          <div class="lg:col-span-7 space-y-4.5">

            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2 flex items-center justify-between">
              <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-box text-[#9C4738]"></i>
                <span>Item Details</span>
              </h2>
            </div>

            <!-- 1. Item Name with Quick Online Search Trigger -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Item Name <span class="text-rose-500">*</span>
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] text-[#A89F91]">
                    {{ (item.name?.length || 0) }} / 80
                  </span>
                </div>
              </div>

              <div class="relative">
                <input type="text" [(ngModel)]="item.name" (ngModelChange)="onItemNameChange()"
                       placeholder="e.g. Brass Pooja Diya (2.5 inch), Ferrero Rocher 16 pcs, Scented Vanilla Candle..."
                       class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border rounded-xl px-4 py-2.5 text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all pr-24"
                       [ngClass]="submitted && errors['name'] ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20' : 'border-[#EADFD2] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]'">

                <!-- Quick Find Online Photos Pill Button inside input -->
                <button *ngIf="item.name?.trim()" type="button" (click)="searchOnlineImages(item.name)"
                        class="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#57251C] hover:bg-[#9C4738] text-white text-[10px] font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
                        title="Search online images for this name">
                  <i class="fa-solid fa-magnifying-glass text-[9px]"></i>
                  <span>Find Photos</span>
                </button>
              </div>

              <p *ngIf="submitted && errors['name']" class="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <i class="fa-solid fa-circle-exclamation"></i> <span>{{ errors['name'] }}</span>
              </p>
            </div>

            <!-- 2. DESCRIPTION BOX -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Description / Vendor Notes (Optional)
                </label>
                <span class="text-[10px] text-[#A89F91]">
                  {{ (item.description?.length || 0) }} / 300
                </span>
              </div>

              <textarea [(ngModel)]="item.description" rows="2" placeholder="Packaging notes, batch size, shelf-life, or supplier details..."
                        class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-2 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] leading-relaxed resize-y"></textarea>
            </div>

            <!-- 2b. ITEM CATEGORY (OPTIONAL) -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-solid fa-tags text-[#9C4738]"></i>
                  <span>Item Category</span>
                  <span class="text-[10px] text-[#A89F91] font-normal">(Optional — items may or may not have a category)</span>
                </label>
                <!-- Quick Suggestion Button based on item name -->
                <button *ngIf="sourcingMeta.categoryLabel && item.category !== sourcingMeta.categoryLabel"
                        type="button"
                        (click)="item.category = sourcingMeta.categoryLabel"
                        class="text-[10px] font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline flex items-center gap-1 cursor-pointer">
                  <i class="fa-solid fa-wand-magic-sparkles text-[9px]"></i>
                  <span>Suggest "{{ sourcingMeta.categoryLabel }}"</span>
                </button>
              </div>

              <div class="relative">
                <input type="text" [(ngModel)]="item.category"
                       placeholder="e.g. Dry Fruits & Nuts, Pooja & Diyas, Sweets & Snacks, Packaging... (or leave blank)"
                       class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-2 text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
              </div>

              <!-- Quick category preset pills -->
              <div class="flex items-center gap-1.5 flex-wrap mt-1.5">
                <span class="text-[10px] font-bold text-[#A89F91]">Presets:</span>
                <button *ngFor="let cat of commonItemCategories"
                        type="button"
                        (click)="item.category = (item.category === cat ? '' : cat)"
                        [class]="item.category === cat ? 'bg-[#57251C] text-white border-[#57251C]' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:border-[#9C4738]'"
                        class="px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition cursor-pointer">
                  {{ cat }}
                </button>
                <button *ngIf="item.category"
                        type="button"
                        (click)="item.category = ''"
                        class="text-[10px] text-[#A89F91] hover:text-rose-500 font-semibold px-1 cursor-pointer"
                        title="Clear category">
                  <i class="fa-solid fa-xmark"></i> Clear
                </button>
              </div>
            </div>

            <!-- 3. PRICING & STOCK CONTROLS -->
            <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-4">
              <div class="flex items-center justify-between border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <span class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-solid fa-calculator text-[#9C4738]"></i>
                  <span>Pricing & Available Stock</span>
                </span>
                <span class="text-[10px] text-[#A89F91]">Customer price inside hampers</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <!-- Unit Cost (₹) -->
                <div>
                  <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                    Hamper Item Price (₹)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-serif font-bold text-[#7A6C5E] dark:text-[#C5A393]">₹</span>
                    <input type="number" [(ngModel)]="item.price" (ngModelChange)="onPriceChange()" placeholder="0" min="0" step="1"
                           class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
                  </div>
                  <div class="mt-1 flex flex-col text-[10px] gap-0.5">
                    <span class="font-bold text-amber-700 dark:text-amber-400">
                      Customer Price in Hamper: ₹{{ getCustomerHamperPrice(item.price) }} ({{ getCustomerHamperMarkupExplanation(item.price) }})
                    </span>
                  </div>
                </div>

                <!-- Stock Quantity -->
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                      Available Stock
                    </label>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                          [ngClass]="stockStatusClass">
                      {{ stockStatusText }}
                    </span>
                  </div>

                  <div class="relative">
                    <input type="number" [(ngModel)]="item.stock_quantity" placeholder="Leave blank if unlimited" min="0"
                           class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
                  </div>

                  <!-- Quick Stock Presets -->
                  <div class="flex items-center gap-1.5 flex-wrap mt-2">
                    <span class="text-[10px] font-bold text-[#A89F91]">Quick:</span>
                    <button type="button" (click)="addStock(10)" class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#7A6C5E] dark:text-[#C5A393] cursor-pointer">
                      +10
                    </button>
                    <button type="button" (click)="addStock(25)" class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#7A6C5E] dark:text-[#C5A393] cursor-pointer">
                      +25
                    </button>
                    <button type="button" (click)="addStock(50)" class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#7A6C5E] dark:text-[#C5A393] cursor-pointer">
                      +50
                    </button>
                    <button type="button" (click)="item.stock_quantity = null" class="px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:underline cursor-pointer">
                      Unlimited
                    </button>
                  </div>
                </div>

              </div>
            </div>

            <!-- 4. CHEAPEST ONLINE PLATFORM FINDER & SOURCING PROFIT HUB -->
            <div class="p-4 bg-gradient-to-br from-[#FAF7F2] via-white to-[#FFFDFC] dark:from-[#251F1C] dark:via-[#1E1916] dark:to-[#171412] border-2 border-[#EADFD2] dark:border-white/15 rounded-2xl space-y-4 shadow-sm">

              <!-- Sourcing Hub Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADFD2]/70 dark:border-white/10 pb-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#57251C] to-[#9C4738] text-white flex items-center justify-center text-sm shadow-xs">
                    <i class="fa-solid fa-tags"></i>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-xs sm:text-sm font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">
                        Cheapest Online Platform Finder
                      </h3>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                        Live Price Links
                      </span>
                    </div>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                      Compare where this product is cheapest online across top Indian marketplaces.
                    </p>
                  </div>
                </div>

                <div class="text-left sm:text-right">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#DD8776] bg-[#9C4738]/10 px-2 py-0.5 rounded-md">
                    {{ sourcingMeta.categoryLabel }}
                  </span>
                </div>
              </div>

              <!-- Smart Sourcing Recommendation Box -->
              <div class="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs space-y-1.5">
                <div class="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                  <i class="fa-solid fa-crown text-amber-600"></i>
                  <span>Cheapest Recommendation: {{ sourcingMeta.topRecommendation }}</span>
                </div>
                <p class="text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  {{ sourcingMeta.sourcingTip }}
                </p>
              </div>

              <!-- 1-Click Lowest-Price Direct Market Links -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                    Open Direct Price Comparison (Sorted Low &rarr; High):
                  </span>
                  <span class="text-[10px] text-[#A89F91]">Opens in new tab</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <a *ngFor="let plat of sourcingMeta.platforms"
                     [href]="plat.searchUrl" target="_blank" rel="noopener noreferrer"
                     class="p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between gap-1.5 hover:shadow-2xs group cursor-pointer"
                     [ngClass]="plat.isRecommended ? 'bg-white dark:bg-[#251F1C] border-[#9C4738] ring-1 ring-[#9C4738]/30' : 'bg-white/60 dark:bg-white/5 border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738]/50'">
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5 font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">
                        <i [class]="plat.icon + ' text-sm'"></i>
                        <span>{{ plat.name }}</span>
                      </div>
                      <span *ngIf="plat.isRecommended" class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#57251C] text-white">
                        Recommended
                      </span>
                    </div>

                    <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-1">
                      {{ plat.badge }}
                    </p>

                    <div class="flex items-center justify-between pt-1 border-t border-[#EADFD2]/40 dark:border-white/5 text-[10px] text-[#9C4738] dark:text-[#DD8776] font-bold group-hover:translate-x-0.5 transition-transform">
                      <span>View Lowest Price</span>
                      <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                    </div>
                  </a>
                </div>
              </div>

              <!-- Record Sourcing Price & Live Margin Calculator -->
              <div class="pt-3 border-t border-[#EADFD2]/70 dark:border-white/10 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                    <i class="fa-solid fa-coins text-emerald-600"></i>
                    <span>Track Sourcing Cost &amp; Profit Margin</span>
                  </span>
                  <span class="text-[10px] text-[#A89F91]">Saved for your vendor tracking</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <!-- Sourcing Platform -->
                  <div>
                    <label class="block text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1">
                      Cheapest Platform Found
                    </label>
                    <select [(ngModel)]="item.sourcing_platform"
                            class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                      <option value="">Select Platform...</option>
                      <option value="Meesho">Meesho (Wholesale)</option>
                      <option value="IndiaMART">IndiaMART (B2B Bulk)</option>
                      <option value="JioMart">JioMart / DMart</option>
                      <option value="Google Shopping">Google Shopping Store</option>
                      <option value="Amazon">Amazon India</option>
                      <option value="Flipkart">Flipkart / Shopsy</option>
                      <option value="Local Wholesale">Local Market / APMC Mandi</option>
                      <option value="Direct Manufacturer">Direct Manufacturer</option>
                    </select>
                  </div>

                  <!-- Sourcing Price -->
                  <div>
                    <label class="block text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1">
                      My Sourcing Cost (₹)
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-serif font-bold text-[#7A6C5E] dark:text-[#C5A393]">₹</span>
                      <input type="number" [(ngModel)]="item.sourcing_price" placeholder="Cost you pay" min="0" step="1"
                             class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
                    </div>
                  </div>

                  <!-- Vendor SKU / Internal Note -->
                  <div>
                    <label class="block text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1">
                      Vendor SKU / Notes
                    </label>
                    <input type="text" [(ngModel)]="item.sourcing_url" placeholder="e.g. SKU-104 or local vendor contact"
                           class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
                  </div>
                </div>

                <!-- Live Margin Banner -->
                <div *ngIf="item.price && item.sourcing_price" class="p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold"
                     [ngClass]="marginInfo.isProfitable ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-200'">
                  <div class="flex items-center gap-2">
                    <i [class]="marginInfo.isProfitable ? 'fa-solid fa-chart-line text-emerald-600' : 'fa-solid fa-triangle-exclamation text-rose-600'"></i>
                    <span>
                      Sourcing Cost: ₹{{ item.sourcing_price }} &rarr; Hamper Price: ₹{{ item.price }}
                    </span>
                  </div>
                  <div>
                    <span>Profit: ₹{{ marginInfo.profit }} per piece ({{ marginInfo.marginPercent }}% Margin)</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <!-- RIGHT COLUMN: Online Image Finder & Studio (5 Cols) -->
          <div class="lg:col-span-5 space-y-4">

            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2 flex items-center justify-between">
              <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-camera-retro text-[#9C4738]"></i>
                <span>Item Image &amp; Media Studio</span>
              </h2>

              <!-- Copy AI Prompt -->
              <button type="button" (click)="copyChatGptPrompt()"
                      class="px-2.5 py-1 rounded-xl bg-[#57251C] hover:bg-[#9C4738] text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                <i class="fa-solid fa-copy text-[10px]"></i>
                <span>{{ promptCopied ? 'Copied Prompt!' : 'Copy AI Prompt' }}</span>
              </button>
            </div>

            <!-- MEDIA METHOD TABS -->
            <div class="flex items-center bg-[#FAF7F2] dark:bg-white/5 p-1 rounded-xl border border-[#EADFD2]/70 dark:border-white/10 text-xs">
              <button type="button" (click)="activeImageTab = 'online'"
                      class="flex-1 py-1.5 rounded-lg transition-all font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      [ngClass]="activeImageTab === 'online' ? 'bg-white dark:bg-[#251F1C] text-[#9C4738] dark:text-[#DD8776] shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'">
                <i class="fa-solid fa-globe text-xs"></i>
                <span>Search Online (Auto-saves to Storage)</span>
              </button>

              <button type="button" (click)="activeImageTab = 'upload'"
                      class="flex-1 py-1.5 rounded-lg transition-all font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      [ngClass]="activeImageTab === 'upload' ? 'bg-white dark:bg-[#251F1C] text-[#9C4738] dark:text-[#DD8776] shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'">
                <i class="fa-solid fa-cloud-arrow-up text-xs"></i>
                <span>Upload Device File</span>
              </button>
            </div>

            <!-- TAB 1: ONLINE IMAGE FINDER & SELECTION -->
            <div *ngIf="activeImageTab === 'online'" class="space-y-3 p-3.5 bg-[#FAF7F2] dark:bg-white/5 rounded-2xl border border-[#EADFD2] dark:border-white/10">

              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-solid fa-magnifying-glass text-[#9C4738]"></i>
                  <span>Find Photo Online</span>
                </span>
                <span class="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <i class="fa-solid fa-cloud-arrow-up text-[9px]"></i> Auto-uploads to Cloud Storage
                </span>
              </div>

              <!-- Search Bar -->
              <div class="flex items-center gap-1.5">
                <div class="relative flex-1">
                  <input type="text" [(ngModel)]="imageSearchQuery" (keydown.enter)="searchOnlineImages()"
                         placeholder="Search e.g. Brass Diya, Almonds, Scented Candle..."
                         class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none">
                  <button *ngIf="imageSearchQuery" type="button" (click)="imageSearchQuery = ''"
                          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer">
                    <i class="fa-solid fa-circle-xmark"></i>
                  </button>
                </div>

                <button type="button" (click)="searchOnlineImages()" [disabled]="isSearchingImages"
                        class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0">
                  <span *ngIf="isSearchingImages" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                  <i *ngIf="!isSearchingImages" class="fa-solid fa-magnifying-glass text-xs"></i>
                  <span>{{ isSearchingImages ? 'Searching...' : 'Search' }}</span>
                </button>
              </div>

              <!-- Suggested Keyword Chips -->
              <div class="flex items-center gap-1 flex-wrap text-[10px]">
                <span class="text-[#A89F91] font-bold">Suggested:</span>
                <button *ngFor="let kw of quickKeywords" type="button" (click)="searchOnlineImages(kw)"
                        class="px-2 py-0.5 rounded-lg bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#7A6C5E] dark:text-[#C5A393] transition cursor-pointer">
                  {{ kw }}
                </button>
              </div>

              <!-- Uploading in progress spinner -->
              <div *ngIf="isUploadingToStorage" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center gap-2 animate-pulse">
                <div class="inline-block animate-spin h-4 w-4 border-2 border-amber-700 border-t-transparent rounded-full"></div>
                <span>Downloading photo and saving file to your Supabase storage bucket...</span>
              </div>

              <!-- Selected Image in Cloud Storage -->
              <div *ngIf="item.image" class="p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5 min-w-0">
                  <img [src]="item.image" (error)="item.image = ''" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-emerald-300 shadow-2xs">
                  <div class="min-w-0">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1 w-max">
                      <i class="fa-solid fa-cloud-arrow-up text-[9px]"></i> Saved in Cloud Storage Bucket
                    </span>
                    <p class="text-[10px] text-emerald-800 dark:text-emerald-300 truncate max-w-xs mt-0.5 font-mono">
                      {{ getStoragePathDisplay(item.image) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <a [href]="item.image" target="_blank" rel="noopener noreferrer"
                     class="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1C1917] border border-[#EADFD2] text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] hover:text-[#9C4738] transition flex items-center gap-1 shadow-2xs">
                    <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                    <span>Preview</span>
                  </a>
                  <button type="button" (click)="item.image = ''; selectedCandidate = null"
                          class="text-rose-500 hover:text-rose-700 text-xs font-bold px-1.5 py-1 rounded cursor-pointer">
                    Remove
                  </button>
                </div>
              </div>

              <!-- Online Image Results Grid -->
              <div *ngIf="isSearchingImages" class="py-8 text-center space-y-2">
                <div class="inline-block animate-spin h-6 w-6 border-2 border-[#9C4738] border-t-transparent rounded-full"></div>
                <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">Searching high-resolution online photos...</p>
              </div>

              <div *ngIf="!isSearchingImages && onlineImageCandidates.length > 0" class="space-y-2">
                <div class="flex items-center justify-between text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                  <span>Click an image to download &amp; save to your cloud storage:</span>
                  <span class="font-bold text-[#9C4738] dark:text-[#DD8776]">{{ onlineImageCandidates.length }} found</span>
                </div>

                <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                  <div *ngFor="let cand of onlineImageCandidates"
                       (click)="selectOnlineImage(cand)"
                       class="relative group aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-white dark:bg-[#1C1917] shadow-2xs hover:scale-[1.02]"
                       [ngClass]="item.image === cand.thumbUrl || item.image === cand.originalUrl ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738]'">
                    
                    <img [src]="cand.thumbUrl" [alt]="cand.title"
                         loading="lazy"
                         class="w-full h-full object-cover transition-transform group-hover:scale-105">

                    <!-- Selected Badge -->
                    <div *ngIf="item.image === cand.thumbUrl || item.image === cand.originalUrl"
                         class="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                      <i class="fa-solid fa-check"></i>
                    </div>

                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9C4738]">Save to Storage</span>
                      <span class="text-[9px] line-clamp-1 mt-1 opacity-90">{{ cand.title }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Or Paste Web Image Address Input (Auto-saves to Storage) -->
              <div class="pt-2 border-t border-[#EADFD2]/60 dark:border-white/10 space-y-1.5">
                <span class="text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393]">
                  Or import from image web address (auto-downloads to our storage bucket):
                </span>
                <div class="flex items-center gap-1.5">
                  <input type="url" [(ngModel)]="directImageUrlInput" placeholder="https://example.com/photo.jpg"
                         (keydown.enter)="importWebImageAddress()"
                         class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] outline-none">
                  <button type="button" (click)="importWebImageAddress()" [disabled]="!directImageUrlInput?.trim() || isUploadingToStorage"
                          class="px-3 py-1.5 rounded-xl bg-[#57251C] hover:bg-[#9C4738] text-white text-xs font-bold disabled:opacity-40 shrink-0 cursor-pointer flex items-center gap-1 shadow-2xs">
                    <span *ngIf="isUploadingToStorage" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                    <i *ngIf="!isUploadingToStorage" class="fa-solid fa-cloud-arrow-up text-[10px]"></i>
                    <span>Save to Storage</span>
                  </button>
                </div>
              </div>

              <!-- Empty State & Google Images Shortcut -->
              <div *ngIf="!isSearchingImages && onlineImageCandidates.length === 0" class="py-5 text-center space-y-2 border border-dashed border-[#EADFD2] dark:border-white/10 rounded-xl p-3">
                <i class="fa-solid fa-images text-2xl text-[#A89F91]"></i>
                <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                  {{ imageSearchQuery ? 'No online images found for "' + imageSearchQuery + '". Try another keyword or browse Google Images.' : 'Enter an item name or keyword above and click Search.' }}
                </p>
                <a [href]="getGoogleImagesUrl(item.name || imageSearchQuery)" target="_blank" rel="noopener noreferrer"
                   class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] transition shadow-2xs">
                  <i class="fa-brands fa-google text-red-500"></i>
                  <span>Search on Google Images</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-[9px] text-[#A89F91]"></i>
                </a>
              </div>

            </div>

            <!-- TAB 2: LOCAL FILE UPLOADER -->
            <div *ngIf="activeImageTab === 'upload'">
              <app-file-upload
                [aspectRatio]="1"
                targetLabel="Hamper Inclusion"
                bucket="images"
                [existingImageUrl]="item.image"
                (fileUploaded)="onItemImageUploaded($event)"
              ></app-file-upload>
            </div>

            <!-- LIVE CHIP & CARD PREVIEW -->
            <div class="space-y-3">
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                Live Showcase Preview:
              </p>

              <!-- Hamper Inclusion Chip Preview -->
              <div class="p-4 bg-gradient-to-br from-[#FAF7F2] to-white dark:from-[#251F1C] dark:to-[#1E1916] border border-[#EADFD2] dark:border-white/10 rounded-2xl shadow-xs space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-12 h-12 rounded-xl overflow-hidden bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm font-bold shrink-0 border border-[#EADFD2]/70">
                      <img *ngIf="item.image" [src]="item.image" class="w-full h-full object-cover">
                      <i *ngIf="!item.image" class="fa-solid fa-box text-base"></i>
                    </div>
                    <div>
                      <h3 class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">
                        {{ item.name || 'Item Name' }}
                      </h3>
                      <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-1">
                        {{ item.description || 'No vendor / spec notes' }}
                      </p>
                      <span *ngIf="item.sourcing_platform" class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        Cheapest on: {{ item.sourcing_platform }} (₹{{ item.sourcing_price || 0 }})
                      </span>
                    </div>
                  </div>

                  <div class="text-right shrink-0">
                    <span class="text-sm font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                      ₹{{ item.price || 0 }}
                    </span>
                    <span class="block text-[10px] text-[#A89F91]">unit cost</span>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-[#EADFD2]/60 dark:border-white/10">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border" [ngClass]="stockStatusClass">
                    {{ stockStatusText }}
                  </span>

                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"
                        [ngClass]="item.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="item.is_active ? 'bg-emerald-500' : 'bg-stone-400'"></span>
                    <span>{{ item.is_active ? 'Active' : 'Draft' }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Readiness Checklist -->
            <div class="p-3.5 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2]/70 dark:border-white/10 rounded-2xl text-xs space-y-2">
              <span class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                <i class="fa-solid fa-list-check text-[#9C4738]"></i>
                <span>Item Readiness</span>
              </span>
              <div class="space-y-1 text-[11px]">
                <div class="flex items-center gap-2" [ngClass]="item.name?.trim() ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#A89F91]'">
                  <i [class]="item.name?.trim() ? 'fa-solid fa-circle-check text-xs' : 'fa-regular fa-circle text-xs'"></i>
                  <span>Item Name specified</span>
                </div>
                <div class="flex items-center gap-2" [ngClass]="item.price !== null && item.price !== undefined ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#A89F91]'">
                  <i [class]="item.price !== null && item.price !== undefined ? 'fa-solid fa-circle-check text-xs' : 'fa-regular fa-circle text-xs'"></i>
                  <span>Unit cost price configured</span>
                </div>
                <div class="flex items-center gap-2" [ngClass]="item.image ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#A89F91]'">
                  <i [class]="item.image ? 'fa-solid fa-circle-check text-xs text-emerald-500' : 'fa-regular fa-circle text-xs'"></i>
                  <span>Item image selected</span>
                </div>
                <div class="flex items-center gap-2" [ngClass]="item.sourcing_platform ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#A89F91]'">
                  <i [class]="item.sourcing_platform ? 'fa-solid fa-circle-check text-xs text-emerald-500' : 'fa-regular fa-circle text-xs'"></i>
                  <span>Cheapest sourcing platform recorded ({{ item.sourcing_platform || 'Optional' }})</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  `
})
export class AdminItemFormPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private customHamperService = inject(CustomHamperService);
  private itemSourcing = inject(ItemSourcingImageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  readonly Number = Number;
  hamperMarkupConfig: HamperMarkupConfig = { percent: 0, fixedAmount: 0 };
  hamperMarkup = 0;

  isEdit = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  submitted = false;
  errors: Record<string, string> = {};

  item: any = {
    name: '',
    description: '',
    category: '',
    price: null,
    stock_quantity: null,
    is_active: true,
    image: '',
    sourcing_platform: '',
    sourcing_price: null,
    sourcing_url: ''
  };

  readonly commonItemCategories = [
    'Dry Fruits & Nuts',
    'Sweets & Snacks',
    'Pooja & Diyas',
    'Candles & Aromas',
    'Packaging & Keepsakes'
  ];

  // Image Studio Tabs & State
  activeImageTab: 'online' | 'url' | 'upload' = 'online';
  imageSearchQuery = '';
  isSearchingImages = false;
  onlineImageCandidates: OnlineImageCandidate[] = [];
  selectedCandidate: OnlineImageCandidate | null = null;
  directImageUrlInput = '';

  readonly quickKeywords = [
    'Brass Diya',
    'Ferrero Rocher',
    'Scented Candle',
    'Almonds Badam',
    'Cashews Kaju',
    'Satin Ribbon',
    'Gift Box'
  ];

  sourcingMeta: PlatformSourcingMeta = this.itemSourcing.getCheapestPlatforms('');
  promptCopied = false;

  get chatGptPrompt(): string {
    const name = this.item.name?.trim() || 'Pooja Diya / Hamper Item';
    const desc = this.item.description?.trim() || 'Handcrafted luxury hamper inclusion item';
    return `Commercial 8K studio product photograph of "${name}". ${desc}. Contact RMS Gift Hampers: Phone/WhatsApp 9284905118, Email rmsgifthampers@gmail.com, Website https://rmscreations.netlify.app/. Clean studio hero presentation isolated on a warm neutral cream stone pedestal with soft directional key lighting, gentle realistic cast shadows, photorealistic, high detail, no text.`;
  }

  copyChatGptPrompt() {
    navigator.clipboard.writeText(this.chatGptPrompt);
    this.promptCopied = true;
    setTimeout(() => {
      this.promptCopied = false;
      this.cdr.markForCheck();
    }, 3000);
    this.cdr.markForCheck();
  }

  onItemImageUploaded(imageUrl: string) {
    this.item.image = imageUrl;
    this.successMessage = 'Item photo uploaded and optimized successfully!';
    this.cdr.markForCheck();
  }

  onItemNameChange() {
    if (!this.imageSearchQuery || this.imageSearchQuery === this.item.name) {
      this.imageSearchQuery = this.item.name || '';
    }
    this.sourcingMeta = this.itemSourcing.getCheapestPlatforms(this.item.name, this.item.price);
    this.cdr.markForCheck();
  }

  onPriceChange() {
    this.sourcingMeta = this.itemSourcing.getCheapestPlatforms(this.item.name, this.item.price);
    this.cdr.markForCheck();
  }

  get marginInfo() {
    return this.itemSourcing.calculateMargin(this.item.price, this.item.sourcing_price);
  }

  async searchOnlineImages(overrideQuery?: string) {
    const query = overrideQuery || this.imageSearchQuery || this.item.name;
    if (!query?.trim()) return;

    this.imageSearchQuery = query;
    this.isSearchingImages = true;
    this.cdr.markForCheck();

    try {
      const results = await this.itemSourcing.searchOnlineImages(query);
      this.onlineImageCandidates = results;
    } catch {
      this.onlineImageCandidates = [];
    } finally {
      this.isSearchingImages = false;
      this.cdr.markForCheck();
    }
  }

  isUploadingToStorage = false;

  async selectOnlineImage(candidate: OnlineImageCandidate) {
    this.selectedCandidate = candidate;
    this.isUploadingToStorage = true;
    this.successMessage = `Downloading "${candidate.title}" and saving file to your storage bucket...`;
    this.cdr.markForCheck();

    try {
      const res = await this.itemSourcing.uploadOnlineImageToStorage(
        candidate.originalUrl || candidate.thumbUrl,
        this.item.name || 'item'
      );
      if (res.success && res.url) {
        this.item.image = res.url;
        this.successMessage = `Saved permanently to your Supabase Storage bucket!`;
      } else {
        this.errorMessage = res.error || 'Failed to save image to cloud storage. Please choose another image or upload a file directly.';
      }
    } catch {
      this.errorMessage = 'Could not save image to cloud storage. Please choose another image.';
    } finally {
      this.isUploadingToStorage = false;
      this.cdr.markForCheck();
    }
  }

  async importWebImageAddress() {
    const url = this.directImageUrlInput?.trim();
    if (!url) return;
    this.isUploadingToStorage = true;
    this.successMessage = 'Downloading image and uploading to your Supabase storage bucket...';
    this.cdr.markForCheck();

    try {
      const res = await this.itemSourcing.uploadOnlineImageToStorage(url, this.item.name || 'item');
      if (res.success && res.url) {
        this.item.image = res.url;
        this.directImageUrlInput = '';
        this.successMessage = 'Image downloaded and saved permanently in your Supabase storage bucket!';
      } else {
        this.errorMessage = res.error || 'Could not download from that address. Please choose another image or upload directly.';
      }
    } catch {
      this.errorMessage = 'Could not download image from web address. Please upload directly.';
    } finally {
      this.isUploadingToStorage = false;
      this.cdr.markForCheck();
    }
  }

  getStoragePathDisplay(url?: string): string {
    if (!url) return '';
    if (url.includes('/images/')) {
      return 'images/' + url.split('/images/')[1];
    }
    return url;
  }

  getGoogleImagesUrl(query: string): string {
    const q = encodeURIComponent(this.itemSourcing.cleanSearchQuery(query || 'hamper item'));
    return `https://www.google.com/search?tbm=isch&q=${q}`;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      this.saveItem(false);
    }
    if (event.key === 'Escape' && !this.saving) {
      this.router.navigate(['/admin/items']);
    }
  }

  get readinessScore(): { completed: number; total: number; isReady: boolean } {
    const checks = [
      Boolean(this.item.name?.trim()),
      this.item.price !== null && this.item.price !== undefined,
      Boolean(this.item.image)
    ];
    const completed = checks.filter(Boolean).length;
    return {
      completed,
      total: checks.length,
      isReady: Boolean(this.item.name?.trim())
    };
  }

  get stockStatusText(): string {
    if (this.item.stock_quantity === null || this.item.stock_quantity === undefined) {
      return 'Unlimited / On Demand';
    }
    if (this.item.stock_quantity === 0) {
      return 'Out of Stock (0)';
    }
    if (this.item.stock_quantity <= 5) {
      return `Low Stock (${this.item.stock_quantity})`;
    }
    return `In Stock (${this.item.stock_quantity})`;
  }

  get stockStatusClass(): string {
    if (this.item.stock_quantity === null || this.item.stock_quantity === undefined) {
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40';
    }
    if (this.item.stock_quantity === 0) {
      return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40';
    }
    if (this.item.stock_quantity <= 5) {
      return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40';
    }
    return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';
  }

  addStock(amount: number) {
    const current = Number(this.item.stock_quantity) || 0;
    this.item.stock_quantity = current + amount;
    this.cdr.markForCheck();
  }

  async ngOnInit() {
    try {
      this.hamperMarkupConfig = await this.customHamperService.getHamperMarkupConfig();
      this.hamperMarkup = this.hamperMarkupConfig.fixedAmount;
    } catch {
      this.hamperMarkupConfig = { percent: 0, fixedAmount: 0 };
      this.hamperMarkup = 0;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadItem(id);
    }
    this.cdr.markForCheck();
  }

  getCustomerHamperPrice(price: any): number {
    return this.customHamperService.calculateCustomerItemPrice(Number(price) || 0, this.hamperMarkupConfig);
  }

  getCustomerHamperMarkupExplanation(price: any): string {
    const base = Number(price) || 0;
    const pct = Math.round((base * (this.hamperMarkupConfig.percent || 0)) / 100);
    if (this.hamperMarkupConfig.percent > 0 && this.hamperMarkupConfig.fixedAmount > 0) {
      return `+${this.hamperMarkupConfig.percent}% [₹${pct}] + ₹${this.hamperMarkupConfig.fixedAmount}`;
    }
    if (this.hamperMarkupConfig.percent > 0) {
      return `+${this.hamperMarkupConfig.percent}% [+₹${pct}]`;
    }
    return `+₹${this.hamperMarkupConfig.fixedAmount}`;
  }

  async loadItem(id: string) {
    try {
      const { data, error } = await this.supabase.from('product_details').select('*').eq('id', id).single();
      if (data) {
        const parsed = this.itemSourcing.extractMetadataFromDescription(data.description);
        this.item = {
          ...data,
          description: parsed.cleanDescription,
          category: data.category || parsed.category || '',
          image: data.image || parsed.image || '',
          sourcing_platform: data.sourcing_platform || parsed.sourcingPlatform || '',
          sourcing_price: data.sourcing_price != null ? Number(data.sourcing_price) : (parsed.sourcingPrice ?? null),
          sourcing_url: data.sourcing_url || parsed.sourcingUrl || '',
          price: data.price != null ? Number(data.price) : null,
          stock_quantity: data.stock_quantity != null ? Number(data.stock_quantity) : null
        };
        this.imageSearchQuery = this.item.name || '';
        this.sourcingMeta = this.itemSourcing.getCheapestPlatforms(this.item.name, this.item.price);

        // If item doesn't have an image yet, auto-query online images
        if (!this.item.image && this.item.name) {
          this.searchOnlineImages(this.item.name);
        }
      } else {
        this.errorMessage = error?.message || 'Item not found.';
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to load item.';
    } finally {
      this.cdr.markForCheck();
    }
  }

  async saveItem(addAnother: boolean = false) {
    this.submitted = true;
    this.errors = {};

    if (!this.item.name?.trim()) {
      this.errors['name'] = 'Please enter an item name.';
      this.cdr.markForCheck();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    try {
      const fullPayload: any = {
        name: this.item.name.trim(),
        description: this.item.description?.trim() || null,
        category: this.item.category?.trim() || null,
        price: this.item.price != null && !isNaN(this.item.price) ? Number(this.item.price) : 0,
        stock_quantity: this.item.stock_quantity != null && !isNaN(this.item.stock_quantity) ? Number(this.item.stock_quantity) : null,
        is_active: Boolean(this.item.is_active),
        image: this.item.image || null,
        sourcing_platform: this.item.sourcing_platform || null,
        sourcing_price: this.item.sourcing_price != null && !isNaN(this.item.sourcing_price) ? Number(this.item.sourcing_price) : null,
        sourcing_url: this.item.sourcing_url?.trim() || null
      };

      let error;
      if (this.isEdit) {
        const res = await this.supabase.from('product_details').update(fullPayload).eq('id', this.item.id);
        error = res.error;
      } else {
        const res = await this.supabase.from('product_details').insert([fullPayload]);
        error = res.error;
      }

      // If remote Supabase DB does not yet have the new columns, fall back transparently
      if (error && (error.code === '42703' || error.message?.includes('column'))) {
        const fallbackDesc = this.itemSourcing.embedMetadataIntoDescription(this.item.description, {
          image: this.item.image,
          category: this.item.category?.trim() || undefined,
          sourcingPlatform: this.item.sourcing_platform,
          sourcingPrice: this.item.sourcing_price,
          sourcingUrl: this.item.sourcing_url
        });
        const safePayload: any = {
          name: this.item.name.trim(),
          description: fallbackDesc || null,
          price: this.item.price != null && !isNaN(this.item.price) ? Number(this.item.price) : 0,
          stock_quantity: this.item.stock_quantity != null && !isNaN(this.item.stock_quantity) ? Number(this.item.stock_quantity) : null,
          is_active: Boolean(this.item.is_active)
        };
        if (this.isEdit) {
          const retry = await this.supabase.from('product_details').update(safePayload).eq('id', this.item.id);
          error = retry.error;
        } else {
          const retry = await this.supabase.from('product_details').insert([safePayload]);
          error = retry.error;
        }
      }

      if (error) {
        this.errorMessage = error.message;
        this.saving = false;
        this.cdr.markForCheck();
      } else {
        if (addAnother) {
          this.successMessage = `Saved "${this.item.name}"! Ready for next item.`;
          this.item = {
            name: '',
            description: '',
            category: '',
            price: null,
            stock_quantity: null,
            is_active: true,
            image: '',
            sourcing_platform: '',
            sourcing_price: null,
            sourcing_url: ''
          };
          this.onlineImageCandidates = [];
          this.selectedCandidate = null;
          this.imageSearchQuery = '';
          this.submitted = false;
          this.saving = false;
          this.cdr.markForCheck();
        } else {
          this.router.navigate(['/admin/items']);
        }
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to save item.';
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
}
