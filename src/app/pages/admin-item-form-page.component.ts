import { Component, OnInit, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { FileUploadComponent } from '../shared/ui/file-upload.component';
import { CustomHamperService } from '../services/custom-hamper.service';
import { HamperMarkupConfig } from '../models/custom-hamper.model';

@Component({
  selector: 'app-admin-item-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FileUploadComponent],
  template: `
    <div class=" mx-auto pb-12 space-y-4 transition-colors duration-300">

      <!-- Top Sticky Action Bar (Exact match to Product & Category Studio) -->
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
              {{ isEdit ? 'Update item details, price, and stock levels' : 'Add pooja items, sweets, diyas, dry fruits, candles, or packaging items' }}
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

          <!-- LEFT COLUMN: Component Details, Unit Cost, Stock & Description (7 Cols) -->
          <div class="lg:col-span-7 space-y-4.5">

            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2 flex items-center justify-between">
              <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-box text-[#9C4738]"></i>
                <span>Item Details</span>
              </h2>
            </div>

            <!-- 1. Item Name -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Item Name <span class="text-rose-500">*</span>
                </label>
                <span class="text-[10px] text-[#A89F91]">
                  {{ (item.name?.length || 0) }} / 80
                </span>
              </div>

              <input type="text" [(ngModel)]="item.name" placeholder="e.g. Brass Pooja Diya (2.5 inch), Premium Almonds 100g, Satin Ribbon..."
                     class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border rounded-xl px-4 py-2.5 text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all"
                     [ngClass]="submitted && errors['name'] ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20' : 'border-[#EADFD2] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]'">

              <p *ngIf="submitted && errors['name']" class="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <i class="fa-solid fa-circle-exclamation"></i> <span>{{ errors['name'] }}</span>
              </p>
            </div>

            <!-- 2. DESCRIPTION BOX -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Description / Notes (Optional)
                </label>
                <span class="text-[10px] text-[#A89F91]">
                  {{ (item.description?.length || 0) }} / 300
                </span>
              </div>

              <textarea [(ngModel)]="item.description" rows="3" placeholder="Packaging notes, batch size, shelf-life, or supplier details..."
                        class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] leading-relaxed resize-y"></textarea>
            </div>

            <!-- 3. PRICING & STOCK CONTROLS -->
            <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-4">
              <div class="flex items-center justify-between border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <span class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-solid fa-calculator text-[#9C4738]"></i>
                  <span>Pricing & Available Stock</span>
                </span>
                <span class="text-[10px] text-[#A89F91]">Price inside hampers</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <!-- Unit Cost (₹) -->
                <div>
                  <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                    Item Price (₹)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-serif font-bold text-[#7A6C5E] dark:text-[#C5A393]">₹</span>
                    <input type="number" [(ngModel)]="item.price" placeholder="0" min="0" step="1"
                           class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
                  </div>
                  <div class="mt-1 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] gap-1">
                    <span class="text-[#A89F91]">Base price in database</span>
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
                    <!-- Stock pill -->
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

            <!-- MULTI-MARKETPLACE LEAST-PRICE SOURCING RESEARCH CARD -->
            <div class="p-4 bg-gradient-to-br from-[#FAF7F2] to-[#FFFDFC] dark:from-white/5 dark:to-white/10 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-3 shadow-2xs">
              <div class="flex items-center justify-between border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-[#57251C] text-white flex items-center justify-center text-xs shadow-xs">
                    <i class="fa-solid fa-magnifying-glass-dollar text-[#EB9D8E]"></i>
                  </div>
                  <div>
                    <h3 class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Find Lowest Supplier Prices</h3>
                    <p class="text-[10px] text-[#A89F91]">Compare prices on Meesho, Amazon, Flipkart &amp; IndiaMART</p>
                  </div>
                </div>

                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Supplier Search
                </span>
              </div>

              <!-- Marketplace Direct Search Buttons -->
              <div class="space-y-2">
                <p class="text-[11px] font-bold text-[#57251C] dark:text-[#F4F1ED]">
                  Search <strong class="text-[#9C4738] dark:text-[#DD8776]">"{{ item.name || 'this item' }}"</strong> on market links:
                </p>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <!-- Meesho -->
                  <a [href]="getMeeshoUrl(item.name)" target="_blank" rel="noopener noreferrer"
                     class="px-3 py-2 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100 transition text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                    <span>🛍️ Meesho</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>

                  <!-- Amazon (Sorted Low to High) -->
                  <a [href]="getAmazonUrl(item.name)" target="_blank" rel="noopener noreferrer"
                     class="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 transition text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                    <span>📦 Amazon (Low&rarr;High)</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>

                  <!-- Flipkart (Sorted Low to High) -->
                  <a [href]="getFlipkartUrl(item.name)" target="_blank" rel="noopener noreferrer"
                     class="px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                    <span>🛒 Flipkart</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>

                  <!-- IndiaMART B2B -->
                  <a [href]="getIndiamartUrl(item.name)" target="_blank" rel="noopener noreferrer"
                     class="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                    <span>🏬 IndiaMART</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
              </div>

              <!-- Sourcing Guidance Box -->
              <div class="p-2.5 bg-white dark:bg-[#1C1917] rounded-xl border border-[#EADFD2] dark:border-white/10 text-[11px] text-[#7A6C5E] dark:text-[#C5A393] space-y-1">
                <p><strong>Tip:</strong> Use Meesho &amp; IndiaMART for wholesale prices on ribbons, diyas, boxes, and jars.</p>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Interactive Component Preview, Hamper Guide, Readiness (5 Cols) -->
          <div class="lg:col-span-5 space-y-5">

            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2 flex items-center justify-between">
              <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-eye text-[#9C4738]"></i>
                <span>Item Photo &amp; Showcase (1:1)</span>
              </h2>

              <!-- Copy ChatGPT / AI Prompt Button -->
              <button type="button" (click)="copyChatGptPrompt()"
                      class="px-2.5 py-1 rounded-xl bg-[#57251C] hover:bg-[#9C4738] text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                <i class="fa-solid fa-copy text-[10px]"></i>
                <span>{{ promptCopied ? 'Copied Prompt!' : 'Copy ChatGPT / AI Prompt' }}</span>
              </button>
            </div>

            <!-- Upload File Component (File Selection only, <=1MB, 1:1) -->
            <app-file-upload
              [aspectRatio]="1"
              targetLabel="Hamper Inclusion"
              bucket="images"
              [existingImageUrl]="item.image"
              (fileUploaded)="onItemImageUploaded($event)"
            ></app-file-upload>

            <!-- LIVE CHIP & CARD PREVIEW -->
            <div class="space-y-3">
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                Previewing how this inclusion card appears inside product studio and catalog tables:
              </p>

              <!-- Hamper Inclusion Chip Preview -->
              <div class="p-4 bg-gradient-to-br from-[#FAF7F2] to-white dark:from-[#251F1C] dark:to-[#1E1916] border border-[#EADFD2] dark:border-white/10 rounded-2xl shadow-xs space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl overflow-hidden bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm font-bold shrink-0">
                      <img *ngIf="item.image" [src]="item.image" class="w-full h-full object-cover">
                      <i *ngIf="!item.image" class="fa-solid fa-box"></i>
                    </div>
                    <div>
                      <h3 class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">
                        {{ item.name || 'Item Name' }}
                      </h3>
                      <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-1">
                        {{ item.description || 'No vendor / spec notes' }}
                      </p>
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

              <!-- Product Builder Chip Simulation -->
              <div class="p-3 bg-stone-50 dark:bg-white/5 border border-dashed border-[#EADFD2] dark:border-white/10 rounded-xl space-y-1.5">
                <span class="text-[10px] font-bold text-[#A89F91] uppercase tracking-wider block">
                  Product Studio Inclusions Chip
                </span>
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#251F1C] border border-[#9C4738] shadow-2xs">
                  <i class="fa-solid fa-check text-xs text-[#9C4738]"></i>
                  <span class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                    {{ item.name || 'Item Name' }}
                  </span>
                  <span class="text-[11px] font-serif font-bold text-[#9C4738] dark:text-[#DD8776]">
                    ₹{{ item.price || 0 }}
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
                <div class="flex items-center gap-2" [ngClass]="item.stock_quantity !== null ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#7A6C5E] dark:text-[#C5A393]'">
                  <i class="fa-solid fa-circle-check text-xs text-emerald-500"></i>
                  <span>Stock tracked ({{ item.stock_quantity !== null ? (item.stock_quantity + ' units') : 'Unlimited / On Demand' }})</span>
                </div>
              </div>
            </div>

            <!-- Quick Info Note -->
            <div class="p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#EADFD2]/70 dark:border-white/10 text-[11px] text-[#7A6C5E] dark:text-[#C5A393] space-y-1">
              <p class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                <i class="fa-regular fa-lightbulb text-amber-500"></i>
                <span>How this is used in Hampers:</span>
              </p>
              <p>When creating or editing a hamper in <strong>Product Studio</strong>, clicking this item's chip automatically calculates the hamper's total cost and lists it on customer item breakdowns.</p>
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
    price: null,
    stock_quantity: null,
    is_active: true,
    image: ''
  };

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
      this.item.price !== null && this.item.price !== undefined
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

  getMeeshoUrl(name: string): string {
    const q = encodeURIComponent((name || 'hamper item').trim() + ' wholesale');
    return `https://www.meesho.com/search?q=${q}`;
  }

  getAmazonUrl(name: string): string {
    const q = encodeURIComponent((name || 'hamper item').trim());
    return `https://www.amazon.in/s?k=${q}&s=price-asc-rank`;
  }

  getFlipkartUrl(name: string): string {
    const q = encodeURIComponent((name || 'hamper item').trim());
    return `https://www.flipkart.com/search?q=${q}&sort=price_asc`;
  }

  getIndiamartUrl(name: string): string {
    const q = encodeURIComponent((name || 'hamper item').trim() + ' wholesale');
    return `https://dir.indiamart.com/search.mp?ss=${q}`;
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
        this.item = {
          ...data,
          price: data.price != null ? Number(data.price) : null,
          stock_quantity: data.stock_quantity != null ? Number(data.stock_quantity) : null
        };
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
      const payload: any = {
        name: this.item.name.trim(),
        description: this.item.description?.trim() || null,
        price: this.item.price != null && !isNaN(this.item.price) ? Number(this.item.price) : 0,
        stock_quantity: this.item.stock_quantity != null && !isNaN(this.item.stock_quantity) ? Number(this.item.stock_quantity) : null,
        is_active: Boolean(this.item.is_active)
      };

      let error;
      if (this.isEdit) {
        const res = await this.supabase.from('product_details').update(payload).eq('id', this.item.id);
        error = res.error;
      } else {
        const res = await this.supabase.from('product_details').insert([payload]);
        error = res.error;
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
            price: null,
            stock_quantity: null,
            is_active: true
          };
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
