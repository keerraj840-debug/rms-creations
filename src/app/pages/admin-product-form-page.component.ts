import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { ModalComponent } from '../shared/ui/modal.component';
import { FileUploadComponent } from '../shared/ui/file-upload.component';
import { ImageProcessorService } from '../shared/ui/image-processor.service';

@Component({
  selector: 'app-admin-product-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalComponent, FileUploadComponent],
  template: `
    <div class="max-w-6xl mx-auto pb-12 space-y-4 transition-colors duration-300">

      <!-- Top Action Bar (Header with Live Readiness Score & Fast Actions) -->
      <div class="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#FAF7F2]/95 dark:bg-[#1E1916]/95 backdrop-blur-md border-b border-[#EADFD2]/80 dark:border-white/10 flex items-center justify-between gap-4">

        <!-- Left: Back, Title & Live Status -->
        <div class="flex items-center gap-3 min-w-0">
          <a routerLink="/admin/products"
             class="p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] bg-white dark:bg-[#251F1C] rounded-xl border border-[#EADFD2] dark:border-white/10 transition-colors shadow-2xs shrink-0"
             title="Back to Catalog">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>

          <div class="min-w-0">
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">
                {{ isEdit ? (product.name || 'Edit Product') : (isCloning ? 'Duplicate Product' : 'New Product') }}
              </h1>

              <!-- Live Store Visibility Switch Pill -->
              <button type="button" (click)="product.is_active = !product.is_active"
                      class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 shrink-0"
                      [ngClass]="product.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="product.is_active ? 'bg-emerald-500' : 'bg-stone-400'"></span>
                <span>{{ product.is_active ? 'Live on Store' : 'Draft Mode' }}</span>
              </button>

              <!-- Live Readiness Tracker Pill -->
              <div class="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0"
                   [ngClass]="readinessScore.isReady ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="readinessScore.isReady ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                <span>{{ readinessScore.isReady ? 'Ready to Publish' : (readinessScore.completed + ' of ' + readinessScore.total + ' required fields filled') }}</span>
              </div>
            </div>

            <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] truncate">
              {{ isEdit ? 'Update product details, pricing, and inclusions' : 'Enter box details on the left, and choose what items go inside on the right.' }}
            </p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2.5 shrink-0">
          <button type="button" routerLink="/admin/products"
                  class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] rounded-xl transition-colors">
            Cancel
          </button>

          <!-- Save & Add Another Button -->
          <button *ngIf="!isEdit" type="button" (click)="saveProduct(false, true)" [disabled]="saving || uploadingImage"
                  class="px-3.5 py-2 text-xs font-bold text-[#9C4738] dark:text-[#DD8776] bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-2xs hover:bg-[#F3E7DC]/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="hidden sm:inline">Save & Add Another</span>
            <span class="sm:hidden">+ Another</span>
          </button>

          <!-- Primary Save / Publish Button -->
          <button type="button" (click)="saveProduct(false, false)" [disabled]="saving || uploadingImage"
                  class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2"
                  title="Keyboard Shortcut: ⌘+Enter">
            <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Product') }}</span>
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
        <button (click)="successMessage = ''" class="text-emerald-500 hover:text-emerald-700"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div *ngIf="errorMessage" class="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800/40 flex items-center justify-between animate-in fade-in">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>
        <button (click)="errorMessage = ''" class="text-rose-400 hover:text-rose-600"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- UNIFIED 2-COLUMN WORKSPACE (Proper Description & Playable Chips) -->
      <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-6 shadow-2xs">

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <!-- LEFT COLUMN: Product Title, Proper Description, Category & Photos (6 Cols) -->
          <div class="lg:col-span-6 space-y-4">

            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2 flex items-center justify-between">
              <div>
                <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">
                  Product Details
                </h2>
              </div>
            </div>

            <!-- 1. Product Title -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Product Name <span class="text-rose-500">*</span>
                </label>
                <span class="text-[10px] text-[#A89F91]">
                  {{ (product.name?.length || 0) }} / 80
                </span>
              </div>

              <input type="text" #nameInput [(ngModel)]="product.name" placeholder="Enter Product Name"
                     class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border rounded-xl px-4 py-2.5 text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all"
                     [ngClass]="submitted && errors['name'] ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20' : 'border-[#EADFD2] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]'">

              <p *ngIf="submitted && errors['name']" class="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <i class="fa-solid fa-circle-exclamation"></i> <span>{{ errors['name'] }}</span>
              </p>
            </div>

            <!-- 2. PROPER DESCRIPTION BOX (Generous Height, Placed Right Below Title) -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Product Description
                </label>
                <span class="text-[10px] text-[#A89F91]">
                  {{ (product.description?.length || 0) }} / 400
                </span>
              </div>

              <textarea [(ngModel)]="product.description" rows="3" placeholder="Enter Description ..."
                        class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] leading-relaxed transition-all resize-y"></textarea>

            </div>

            <!-- 3. Category, Selling Price & Weight -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <!-- Category Selector -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                    Collection / Category <span class="text-rose-500">*</span>
                  </label>
                  <button type="button" (click)="openQuickCategoryModal()" class="text-[11px] font-bold text-[#9C4738] dark:text-[#DD8776] hover:underline">
                    + New
                  </button>
                </div>

                <select [(ngModel)]="product.category_id" (change)="onCategoryChange()"
                        class="w-full px-3.5 py-2.5 rounded-xl border bg-[#FDFBF7] dark:bg-[#1C1917] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none transition-all"
                        [ngClass]="submitted && errors['category_id'] ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20' : 'border-[#EADFD2] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]'">
                  <option value="">Select Category...</option>
                  <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
                </select>

                <p *ngIf="submitted && errors['category_id']" class="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i> <span>{{ errors['category_id'] }}</span>
                </p>
              </div>

              <!-- Selling Price -->
              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  Selling Price (₹) <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-serif font-bold text-[#7A6C5E] dark:text-[#C5A393]">₹</span>
                  <input type="number" [(ngModel)]="product.selling_price" placeholder="e.g. 599"
                         class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all"
                         [ngClass]="submitted && errors['selling_price'] ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20' : 'border-[#EADFD2] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]'">
                </div>

                <p *ngIf="submitted && errors['selling_price']" class="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i> <span>{{ errors['selling_price'] }}</span>
                </p>
                <p *ngIf="profitAmount < 0 && (!submitted || !errors['selling_price'])" class="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-triangle-exclamation"></i> <span>Price is below items cost (₹{{ totalComponentCost }})!</span>
                </p>
              </div>

              <!-- Package Weight (kg) -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                    Hamper Weight (kg)
                  </label>
                  <span class="text-[10px] text-[#A89F91]">
                    {{ (product.weight_kg || 0.5) * 1000 }}g
                  </span>
                </div>

                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                    <i class="fa-solid fa-weight-hanging"></i>
                  </span>
                  <input type="number" [(ngModel)]="product.weight_kg" placeholder="0.5" step="0.1" min="0.1"
                         class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-8 pr-2.5 py-2.5 text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
                </div>

                <div class="flex items-center gap-1 flex-wrap mt-1">
                  <button type="button" (click)="product.weight_kg = 0.3" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 cursor-pointer">300g</button>
                  <button type="button" (click)="product.weight_kg = 0.5" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 cursor-pointer">500g</button>
                  <button type="button" (click)="product.weight_kg = 1.0" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 cursor-pointer">1.0kg</button>
                </div>
              </div>

            </div>

            <!-- 4. Recipient / Gender Target -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Target Recipient / Gender
                </label>
                <span class="text-[10px] text-[#A89F91]">
                  Filter hampers for him, her, kids, or festive
                </span>
              </div>
              <div class="grid grid-cols-5 gap-1.5">
                <button type="button" *ngFor="let g of audienceOptions" (click)="product.gender = g.value"
                        [class]="product.gender === g.value ? 'bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] text-white font-bold shadow-2xs' : 'bg-[#FDFBF7] dark:bg-[#1C1917] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738]'"
                        class="py-2 px-1 rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-0.5 text-center">
                  <i [class]="g.iconClass + ' text-xs'"></i>
                  <span class="text-[10px] leading-tight font-medium">{{ g.label }}</span>
                </button>
              </div>
            </div>

            <!-- Availability Window (from_date - to_date) -->
            <div class="p-3 bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-regular fa-calendar-days text-[#9C4738]"></i> <span>Active Availability Window</span>
                </label>
                <div class="flex items-center gap-2">
                  <button *ngIf="selectedCategoryHasDates" type="button" (click)="syncCategoryDates()"
                          class="px-2 py-0.5 rounded-lg bg-[#9C4738]/10 text-[#9C4738] hover:bg-[#9C4738] hover:text-white text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Pull dates from selected category">
                    <i class="fa-solid fa-rotate text-[9px]"></i>
                    <span>Sync Category Dates</span>
                  </button>
                  <span class="text-[10px] font-bold text-[#9C4738] dark:text-[#DD8776]">
                    {{ dateWindowSummary }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1 uppercase tracking-wider">Available From</label>
                  <input type="date" [(ngModel)]="product.from_date"
                         class="w-full px-3 py-1.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1 uppercase tracking-wider">Available Until</label>
                  <input type="date" [(ngModel)]="product.to_date"
                         class="w-full px-3 py-1.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]">
                </div>
              </div>

              <div class="flex items-center justify-between text-[10px] text-[#A89F91]">
                <span>Optional: Leave blank for year-round catalog, or set festive window.</span>
                <button *ngIf="product.from_date || product.to_date" type="button" (click)="clearDates()" class="text-rose-500 font-bold hover:underline">
                  Clear Dates
                </button>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Product Photos
                </label>
                <!-- Copy ChatGPT / AI Prompt Button -->
                <button type="button" (click)="copyChatGptPrompt()"
                        class="px-2.5 py-1 rounded-xl bg-[#57251C] hover:bg-[#9C4738] text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <i class="fa-solid fa-copy text-[10px]"></i>
                  <span>{{ promptCopied ? 'Copied Prompt!' : 'Copy ChatGPT / AI Prompt' }}</span>
                </button>
              </div>

              <div class="space-y-3">
                <!-- Unified File Upload Component (Strictly file selection, 1:1 square crop, <=1MB) -->
                <app-file-upload
                  [aspectRatio]="1"
                  targetLabel="Product Photo"
                  bucket="images"
                  (fileUploaded)="onProductPhotoUploaded($event)"
                ></app-file-upload>

                <!-- Uploaded Photo Tiles Gallery -->
                <div *ngIf="product.images && product.images.length > 0"
                     class="flex flex-wrap items-center gap-3 p-3 bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl">

                  <div *ngFor="let img of product.images; let idx = index"
                       class="relative group w-20 h-20 rounded-xl overflow-hidden border border-[#EADFD2] dark:border-white/10 shrink-0 bg-stone-100 shadow-2xs">
                    <img [src]="img" [alt]="product.name ? (product.name + ' image ' + (idx + 1)) : ('Product photo ' + (idx + 1))" class="w-full h-full object-cover">

                    <span *ngIf="idx === 0" class="absolute bottom-1 left-1 bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                      COVER
                    </span>

                    <!-- Hover overlay controls -->
                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                      <button *ngIf="idx !== 0" type="button" (click)="setAsCover(idx)" class="px-2 py-0.5 bg-white text-[8px] font-bold rounded text-[#4A3C31] hover:bg-stone-100">
                        Cover
                      </button>
                      <button type="button" (click)="removeImage(idx)" class="p-1 text-rose-300 hover:text-white hover:bg-rose-600 rounded text-xs" title="Delete">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            <!-- AI INSTAGRAM CAPTION & HASHTAG GENERATOR CARD -->
            <div class="p-4 bg-gradient-to-br from-[#FAF7F2] to-[#FFFDFC] dark:from-white/5 dark:to-white/10 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-3 shadow-2xs">
              <div class="flex items-center justify-between border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 text-white flex items-center justify-center text-xs shadow-xs">
                    <i class="fa-brands fa-instagram"></i>
                  </div>
                  <div>
                    <h3 class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Instagram Caption &amp; Share</h3>
                    <p class="text-[10px] text-[#A89F91]">Generate caption with price, link, items &amp; hashtags</p>
                  </div>
                </div>

                <button type="button" (click)="generateInstaCaption()"
                        class="px-3 py-1.5 rounded-xl bg-[#57251C] hover:bg-[#9C4738] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer">
                  <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                  <span>Generate Caption</span>
                </button>
              </div>

              <!-- Generated Textbox & Direct Action Buttons -->
              <div *ngIf="generatedInstaCaption" class="space-y-2.5 animate-in fade-in">
                <textarea [value]="generatedInstaCaption" readonly rows="7"
                          class="w-full p-3 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs font-mono text-[#2E2825] dark:text-[#F4F1ED] leading-relaxed outline-none resize-y"></textarea>

                <div class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                  <div class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span *ngIf="instaPublishSuccess" class="flex items-center gap-1">
                      <i class="fa-solid fa-circle-check"></i> <span>Caption copied! Ready to post.</span>
                    </span>
                  </div>

                  <div class="flex items-center gap-2 w-full sm:w-auto">
                    <button type="button" (click)="copyInstaCaption()"
                            class="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#57251C] dark:text-[#F4F1ED] text-xs font-bold shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer">
                      <i class="fa-solid fa-copy text-xs"></i>
                      <span>{{ captionCopied ? 'Copied!' : 'Copy Caption' }}</span>
                    </button>

                    <button type="button" (click)="publishToInstagram()" [disabled]="publishingToInstagram"
                            class="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white text-xs font-bold shadow transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
                      <i class="fa-brands fa-instagram text-xs"></i>
                      <span>Post to Instagram</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            </div>

          </div>

          <!-- RIGHT COLUMN: Hamper Recipe with Interactive CHIPS (6 Cols) -->
          <div class="lg:col-span-6 space-y-4">

            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2 flex items-center justify-between">
              <div>
                <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">
                  Items in this Hamper
                </h2>
              </div>

              <!-- Recipient Selector Chips -->
              <div class="flex items-center gap-1">
                <button type="button" *ngFor="let g of audienceOptions" (click)="product.gender = g.value"
                        [class]="product.gender === g.value ? 'bg-[#9C4738] text-white font-bold' : 'bg-[#FDFBF7] dark:bg-white/5 text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738]'"
                        class="px-2 py-0.5 rounded-lg text-[10px] transition-all">
                  {{ g.label }}
                </button>
              </div>
            </div>

            <!-- 1. ALWAYS-VISIBLE SELECTED INCLUSIONS CHIPS TRAY -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <span>Included in this Box</span>
                  <span class="px-2 py-0.2 rounded-full text-[10px] font-bold"
                        [ngClass]="selectedItemIds.size > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500'">
                    {{ selectedItemIds.size }} items
                  </span>
                </span>

                <button *ngIf="selectedItemsList.length > 0" type="button" (click)="clearAllSelected()" class="text-[11px] font-bold text-rose-500 hover:underline">
                  Clear All
                </button>
              </div>

              <!-- Selected Chips Display -->
              <div *ngIf="selectedItemsList.length === 0" class="p-3 bg-[#FDFBF7] dark:bg-white/5 border border-dashed border-[#EADFD2] dark:border-white/10 rounded-xl text-center text-xs text-[#A89F91]">
                No items added to this box yet.
              </div>

              <div *ngIf="selectedItemsList.length > 0" class="flex flex-wrap gap-1.5 p-2.5 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl max-h-32 overflow-y-auto custom-scrollbar">
                <span *ngFor="let it of selectedItemsList"
                      class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#9C4738] text-white shadow-2xs animate-in zoom-in-95 duration-150">
                  <i class="fa-solid fa-box text-[10px] opacity-80 mr-1"></i><span>{{ it.name }}</span>
                  <span class="opacity-90 font-serif">₹{{ (it.price || 0) * getItemQty(it.id) }}</span>

                  <!-- Required Quantity Controls -->
                  <div class="flex items-center gap-1 bg-black/25 rounded-md px-1.5 py-0.5 ml-1">
                    <button type="button" (click)="decreaseQty(it.id, $event)" class="hover:bg-white/20 rounded px-1 text-[10px] leading-none" title="Decrease Quantity">-</button>
                    <span class="text-[11px] font-mono font-bold min-w-[14px] text-center">{{ getItemQty(it.id) }}</span>
                    <button type="button" (click)="increaseQty(it.id, $event)" class="hover:bg-white/20 rounded px-1 text-[10px] leading-none" title="Increase Quantity">+</button>
                  </div>

                  <button type="button" (click)="toggleItem(it.id)" class="hover:bg-white/20 rounded-full p-0.5 ml-0.5 text-white/90 hover:text-white" title="Remove"><i class="fa-solid fa-xmark text-[10px]"></i></button>
                </span>
              </div>
            </div>

            <!-- 2. SEARCH & QUICK ADD ITEMS -->
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A89F91]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" [(ngModel)]="itemSearchText" placeholder="Search items to add (candle, sweets, diya)..."
                       class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] outline-none focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
              </div>

              <button type="button" (click)="openQuickItemModal()"
                      class="px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs font-bold text-[#9C4738] dark:text-[#DD8776] hover:bg-[#F3E7DC]/30 transition-colors whitespace-nowrap shrink-0">
                + New Item
              </button>
            </div>

            <!-- 3. AVAILABLE ITEMS CHIPS CLOUD -->
            <div class="space-y-1">
              <label class="block text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">
                Items in Stock (Tap to add to box):
              </label>

              <div class="flex flex-wrap gap-2 max-h-44 overflow-y-auto custom-scrollbar p-3 bg-[#FDFBF7]/40 dark:bg-white/5 border border-[#EADFD2]/70 dark:border-white/10 rounded-xl">
                <div *ngIf="filteredItems.length === 0" class="text-xs text-[#A89F91] py-2 w-full text-center">
                  No items match "{{ itemSearchText }}". Click "+ New Item" to create one.
                </div>

                <!-- Interactive Chips -->
                <button type="button" *ngFor="let item of filteredItems"
                        (click)="toggleItem(item.id)"
                        [class]="isItemSelected(item.id)
                          ? 'bg-[#9C4738] text-white border-[#9C4738] shadow-xs scale-[1.02]'
                          : 'bg-white dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] hover:bg-[#F3E7DC]/30'"
                        class="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer">
                  <span class="text-xs font-bold"><i *ngIf="isItemSelected(item.id)" class="fa-solid fa-check text-[10px]"></i><span *ngIf="!isItemSelected(item.id)">+</span></span>
                  <span>{{ item.name }}</span>
                  <span class="font-serif font-bold text-[11px] opacity-80">₹{{ item.price || 0 }}</span>
                  <span *ngIf="item.stock_quantity !== null && item.stock_quantity !== undefined"
                        class="text-[9px] px-1 py-0.2 rounded font-mono font-bold"
                        [ngClass]="isItemSelected(item.id) ? 'bg-white/20 text-white' : (item.stock_quantity <= 5 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-[#C5A393]')">
                    {{ item.stock_quantity === 0 ? 'Out' : item.stock_quantity + ' stock' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- 4. LIVE FINANCIALS & PROFIT MARGIN BAR -->
            <div class="p-3.5 bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl space-y-2">
              <div class="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p class="text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">Total Items Cost</p>
                  <p class="text-sm font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED]">₹{{ totalComponentCost }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">Hamper Price</p>
                  <p class="text-sm font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED]">₹{{ product.selling_price || 0 }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">Estimated Profit</p>
                  <p [ngClass]="profitAmount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'" class="text-sm font-serif font-bold">
                    {{ profitAmount >= 0 ? '+' : '' }}₹{{ profitAmount }} ({{ profitMarginPercent }}%)
                  </p>
                </div>
              </div>

              <!-- Live Progress Meter -->
              <div class="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-300"
                     [ngClass]="profitMarginPercent >= 35 ? 'bg-emerald-500' : (profitMarginPercent > 0 ? 'bg-amber-500' : 'bg-rose-500')"
                     [style.width.%]="profitMarginPercent > 0 ? (profitMarginPercent > 100 ? 100 : profitMarginPercent) : 0"></div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- Quick Category Modal -->
      <app-modal [isOpen]="showQuickCategoryModal" title="Quick Add Category" size="sm" (onClose)="closeQuickCategoryModal()">
        <form (ngSubmit)="saveQuickCategory()" class="space-y-3.5 py-1">
          <div *ngIf="quickCategoryError" class="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200">
            {{ quickCategoryError }}
          </div>
          <div>
            <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Category Name *</label>
            <input type="text" [(ngModel)]="newCategory.name" name="cat_name" [required]="true" placeholder="e.g. Corporate Hampers"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] text-xs font-medium outline-none">
          </div>
          <div>
            <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Starting Price (₹)</label>
            <input type="number" [(ngModel)]="newCategory.price" name="cat_price" placeholder="e.g. 299"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] text-xs font-medium outline-none">
          </div>
          <button type="submit" #catSubmitBtn class="hidden"></button>
        </form>
        <div modal-footer class="w-full flex justify-end gap-2.5">
          <button type="button" (click)="closeQuickCategoryModal()" class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] hover:text-[#4A3C31]">Cancel</button>
          <button type="button" (click)="saveQuickCategory()" [disabled]="savingCategory || !newCategory.name"
                  class="px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold disabled:opacity-50">
            {{ savingCategory ? 'Creating...' : 'Create & Select' }}
          </button>
        </div>
      </app-modal>

      <!-- Quick Item Master Modal -->
      <app-modal [isOpen]="showQuickItemModal" title="Quick Add Item" size="sm" (onClose)="closeQuickItemModal()">
        <form (ngSubmit)="saveQuickItem()" class="space-y-3.5 py-1">
          <div *ngIf="quickItemError" class="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200">
            {{ quickItemError }}
          </div>
          <div>
            <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Item Name *</label>
            <input type="text" [(ngModel)]="newItem.name" name="item_name" [required]="true" placeholder="e.g. Brass Pooja Diya"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] text-xs font-medium outline-none">
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Unit Cost (₹)</label>
              <input type="number" [(ngModel)]="newItem.price" name="item_price" placeholder="e.g. 45"
                     class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] text-xs font-medium outline-none">
            </div>
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Stock (Opt)</label>
              <input type="number" [(ngModel)]="newItem.stock_quantity" name="item_stock" placeholder="e.g. 50"
                     class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] text-xs font-medium outline-none">
            </div>
          </div>
          <button type="submit" #itemSubmitBtn class="hidden"></button>
        </form>
        <div modal-footer class="w-full flex justify-end gap-2.5">
          <button type="button" (click)="closeQuickItemModal()" class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] hover:text-[#4A3C31]">Cancel</button>
          <button type="button" (click)="saveQuickItem()" [disabled]="savingItem || !newItem.name"
                  class="px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold disabled:opacity-50">
            {{ savingItem ? 'Creating...' : 'Create & Include' }}
          </button>
        </div>
      </app-modal>

    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
  `]
})
export class AdminProductFormPageComponent implements OnInit, AfterViewInit {
  private supabase = inject(SupabaseService);
  private imageProcessor = inject(ImageProcessorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('nameInput') nameInputRef?: ElementRef<HTMLInputElement>;

  isEdit = false;
  isCloning = false;
  saving = false;
  uploadingImage = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  isDragging = false;

  categories: any[] = [];
  allItems: any[] = [];
  selectedItemIds: Set<string> = new Set();
  itemQuantities: Record<string, number> = {};
  itemSearchText = '';

  product: any = {
    name: '',
    description: '',
    category_id: '',
    selling_price: null,
    from_date: null,
    to_date: null,
    images: [],
    is_active: true,
    gender: 'unisex'
  };

  audienceOptions = [
    { value: 'unisex', label: 'All', iconClass: 'fa-solid fa-gift' },
    { value: 'girls', label: 'For Her', iconClass: 'fa-solid fa-venus' },
    { value: 'boys', label: 'For Him', iconClass: 'fa-solid fa-mars' },
    { value: 'kids', label: 'Kids', iconClass: 'fa-solid fa-child' },
    { value: 'festive', label: 'Festive', iconClass: 'fa-solid fa-wand-magic-sparkles' }
  ];

  // Quick Category Modal State
  showQuickCategoryModal = false;
  savingCategory = false;
  quickCategoryError = '';
  newCategory = { name: '', price: null as number | null, description: '' };

  promptCopied = false;

  get chatGptPrompt(): string {
    const name = this.product.name?.trim() || 'RMS Curated Gift Hamper';
    const desc = this.product.description?.trim() || 'Luxury gift hamper box with satin ribbon bow';
    const itemNames = Array.from(this.selectedItemIds)
      .map(id => this.allItems.find(item => String(item.id) === String(id))?.name)
      .filter(Boolean)
      .slice(0, 5)
      .join(', ');

    const inclusions = itemNames ? ` featuring ${itemNames}` : '';

    return `Commercial 8K studio product photography of a luxury handcrafted gift hamper box named "${name}"${inclusions}. ${desc}. For orders and inquiries contact RMS Gift Hampers: Phone/WhatsApp 9284905118, Email rmsgifthampers@gmail.com, Website https://rmscreations.netlify.app/. Arranged artfully on a warm neutral limestone surface with soft 45-degree directional studio lighting, gentle contact shadows, satin ribbon tie, gold foil accents, photorealistic, no text, high detail.`;
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

  onProductPhotoUploaded(imageUrl: string) {
    if (!this.product.images) {
      this.product.images = [];
    }
    this.product.images.push(imageUrl);
    this.successMessage = 'Photo cropped, optimized, and added to gallery!';
    this.cdr.markForCheck();
  }

  // Quick Item Modal State
  showQuickItemModal = false;
  savingItem = false;
  quickItemError = '';
  newItem = { name: '', price: null as number | null, stock_quantity: null as number | null, description: '' };

  // Image Cropper Modal State
  showCropperModal = false;
  // Dynamic Validation Engine
  get errors(): Record<string, string> {
    const errs: Record<string, string> = {};

    if (!this.product.name?.trim()) {
      errs['name'] = 'Please enter a product title.';
    } else if (this.product.name.trim().length < 3) {
      errs['name'] = 'Product title must be at least 3 characters.';
    }

    if (!this.product.category_id) {
      errs['category_id'] = 'Please select a category for this hamper.';
    }

    const price = Number(this.product.selling_price);
    if (this.product.selling_price === null || this.product.selling_price === undefined || this.product.selling_price === '') {
      errs['selling_price'] = 'Please enter a selling price.';
    } else if (isNaN(price) || price <= 0) {
      errs['selling_price'] = 'Selling price must be greater than ₹0.';
    }

    return errs;
  }

  get hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  get readinessScore(): { completed: number; total: number; isReady: boolean } {
    let completed = 0;
    const total = 3;
    if (this.product.name?.trim().length >= 3) completed++;
    if (this.product.category_id) completed++;
    if (Number(this.product.selling_price) > 0) completed++;
    return { completed, total, isReady: completed === total };
  }

  get filteredItems() {
    if (!this.itemSearchText.trim()) return this.allItems;
    const q = this.itemSearchText.toLowerCase();
    return this.allItems.filter(i => (i.name && i.name.toLowerCase().includes(q)) || (i.description && i.description.toLowerCase().includes(q)));
  }

  get selectedItemsList() {
    return this.allItems.filter(i => this.selectedItemIds.has(i.id));
  }

  get totalComponentCost(): number {
    return this.selectedItemsList.reduce((acc, curr) => acc + ((Number(curr.price) || 0) * this.getItemQty(curr.id)), 0);
  }

  get profitAmount(): number {
    const sp = Number(this.product.selling_price) || 0;
    return sp - this.totalComponentCost;
  }

  get profitMarginPercent(): number {
    const sp = Number(this.product.selling_price) || 0;
    if (sp <= 0) return 0;
    return Math.round((this.profitAmount / sp) * 100);
  }

  ngOnInit() {
    this.loadDependencies();

    const id = this.route.snapshot.paramMap.get('id');
    const cloneId = this.route.snapshot.queryParamMap.get('cloneFrom');

    if (id) {
      this.isEdit = true;
      this.loadProduct(id);
    } else if (cloneId) {
      this.isCloning = true;
      this.loadCloneProduct(cloneId);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.nameInputRef?.nativeElement?.focus();
    }, 150);
  }

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to save immediately
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      if (!this.saving) {
        event.preventDefault();
        this.saveProduct(false, false);
      }
    }
  }

  // Clipboard paste: paste images directly anywhere on the page
  @HostListener('window:paste', ['$event'])
  async handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;
    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) pastedFiles.push(file);
      }
    }
    if (pastedFiles.length > 0) {
      event.preventDefault();
      for (const file of pastedFiles) {
        await this.uploadSingleFile(file);
      }
    }
  }

  async loadDependencies() {
    try {
      const [catRes, itemsRes] = await Promise.all([
        this.supabase.from('categories').select('id, name, price, image').eq('is_active', true).order('name'),
        this.supabase.from('product_details').select('*').eq('is_active', true).order('name')
      ]);
      this.categories = catRes.data || [];
      this.allItems = itemsRes.data || [];

      if (!this.product.category_id && this.categories.length > 0 && !this.isEdit) {
        this.product.category_id = String(this.categories[0].id);
      }
    } catch {
      // Ignore
    } finally {
      this.cdr.markForCheck();
    }
  }

  async loadProduct(id: string) {
    try {
      const { data, error } = await this.supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        this.product = {
          ...data,
          category_id: data.category_id ? String(data.category_id) : '',
          gender: data.gender || 'unisex'
        };
        const { data: mappings } = await this.supabase.from('product_mappings').select('product_detail_id, quantity').eq('product_id', id);
        if (mappings && mappings.length > 0) {
          this.selectedItemIds = new Set(mappings.map(m => m.product_detail_id));
          this.itemQuantities = {};
          mappings.forEach(m => {
            this.itemQuantities[String(m.product_detail_id)] = m.quantity || 1;
          });
        }
      } else {
        this.errorMessage = error?.message || 'Product not found.';
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  get selectedCategoryHasDates(): boolean {
    if (!this.product.category_id) return false;
    const cat = this.categories.find(c => String(c.id) === String(this.product.category_id));
    return Boolean(cat && (cat.from_date || cat.to_date));
  }

  onCategoryChange() {
    if (!this.product.category_id) return;
    const cat = this.categories.find(c => String(c.id) === String(this.product.category_id));
    if (cat && (cat.from_date || cat.to_date)) {
      if (!this.product.from_date && !this.product.to_date) {
        this.product.from_date = cat.from_date || null;
        this.product.to_date = cat.to_date || null;
      }
    }
    this.cdr.markForCheck();
  }

  syncCategoryDates() {
    if (!this.product.category_id) return;
    const cat = this.categories.find(c => String(c.id) === String(this.product.category_id));
    if (cat) {
      this.product.from_date = cat.from_date || null;
      this.product.to_date = cat.to_date || null;
      this.cdr.markForCheck();
    }
  }

  async loadCloneProduct(sourceId: string) {
    try {
      const { data } = await this.supabase.from('products').select('*').eq('id', sourceId).single();
      if (data) {
        this.product = {
          name: `${data.name} (Copy)`,
          description: data.description || '',
          category_id: data.category_id ? String(data.category_id) : '',
          selling_price: data.selling_price || null,
          from_date: data.from_date || null,
          to_date: data.to_date || null,
          images: data.images ? [...data.images] : [],
          is_active: true,
          gender: data.gender || 'unisex'
        };
        const { data: mappings } = await this.supabase.from('product_mappings').select('product_detail_id, quantity').eq('product_id', sourceId);
        if (mappings && mappings.length > 0) {
          this.selectedItemIds = new Set(mappings.map(m => m.product_detail_id));
          this.itemQuantities = {};
          mappings.forEach(m => {
            this.itemQuantities[String(m.product_detail_id)] = m.quantity || 1;
          });
        }
      }
    } finally {
      this.cdr.markForCheck();
    }
  }

  generatedInstaCaption = '';
  captionCopied = false;
  publishingToInstagram = false;
  instaPublishSuccess = false;
  instaPublishError = '';

  generateInstaCaption() {
    const name = this.product.name?.trim() || 'RMS Curated Gift Hamper';
    const price = this.product.selling_price ? `₹${this.product.selling_price}` : 'Boutique Pricing';
    const desc = this.product.description?.trim() || 'Handcrafted bespoke gift hamper curated with devotion and premium keepsake packaging.';
    const productLink = `https://rmscreations.netlify.app/shop?product=${encodeURIComponent(name)}`;

    const itemNames = Array.from(this.selectedItemIds)
      .map(id => this.allItems.find(item => String(item.id) === String(id))?.name)
      .filter(Boolean)
      .slice(0, 6)
      .join(', ');

    const inclusionsText = itemNames ? `\n🎁 Items Inside / Ingredients:\n✨ ${itemNames}\n` : '\n';

    const hashtags = [
      '#RMSGiftHampers',
      '#RMSCreations',
      '#CustomHampers',
      '#FestiveGifting',
      '#LuxuryHampers',
      '#HandcraftedGifts',
      '#MaharashtraGifting',
      '#NaviMumbaiGifts',
      '#MumbaiGifting',
      '#CorporateGifting',
      '#GiftingIdeas2026'
    ];

    if (name.toLowerCase().includes('ganpati') || name.toLowerCase().includes('pooja')) {
      hashtags.push('#GanpatiPoojaKit', '#GaneshUtsav2026', '#PoojaKitHamper');
    } else if (name.toLowerCase().includes('chocolate')) {
      hashtags.push('#GourmetChocolates', '#ChocolateHamper', '#TruffleGifts');
    } else if (name.toLowerCase().includes('girl') || name.toLowerCase().includes('female')) {
      hashtags.push('#GiftsForHer', '#BirthdayHamperForGirls', '#PastelGifting');
    } else if (name.toLowerCase().includes('boy') || name.toLowerCase().includes('male')) {
      hashtags.push('#GiftsForHim', '#BoysHamper', '#ExecutiveGifts');
    }

    this.generatedInstaCaption = `✨ RMS CREATIONS EXCLUSIVE BOUTIQUE CURATION ✨

Introducing "${name}" — an artisanal luxury hamper curated for special moments! 🎁🎀

📝 Description:
${desc}
${inclusionsText}
🏷️ Price: ${price}
🚚 Pan-India Express Delivery & Custom Consultation Available!

🔗 Direct Product Page Link:
${productLink}

📲 Order via Phone / WhatsApp: +91 9284905118
✉️ Email Us: rmsgifthampers@gmail.com
🌐 Visit Store: https://rmscreations.netlify.app/

${hashtags.join(' ')}`;
    this.cdr.markForCheck();
  }

  async publishToInstagram() {
    if (!this.generatedInstaCaption) {
      this.generateInstaCaption();
    }

    const coverImageUrl = this.product.images?.[0] || 'https://www.rmscreations.com/assets/logo.png';
    this.publishingToInstagram = true;
    this.instaPublishError = '';
    this.instaPublishSuccess = false;
    this.cdr.markForCheck();

    try {
      const { data: settingsData } = await this.supabase.from('store_settings').select('*').single();
      const igUserId = settingsData?.instagram_user_id?.trim();
      const igToken = settingsData?.instagram_access_token?.trim();

      if (igUserId && igToken && coverImageUrl.startsWith('http')) {
        const containerRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: coverImageUrl,
            caption: this.generatedInstaCaption,
            access_token: igToken
          })
        });

        const containerData = await containerRes.json();
        if (!containerRes.ok || !containerData.id) {
          throw new Error(containerData?.error?.message || 'Meta Instagram API container error');
        }

        const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igUserId}/media_publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: igToken
          })
        });

        const publishData = await publishRes.json();
        if (!publishRes.ok || !publishData.id) {
          throw new Error(publishData?.error?.message || 'Meta Instagram publish error');
        }

        this.instaPublishSuccess = true;
      } else {
        navigator.clipboard.writeText(this.generatedInstaCaption);
        this.captionCopied = true;
        this.instaPublishSuccess = true;
        window.open('https://www.instagram.com/create/select/', '_blank');
      }
    } catch (err: any) {
      console.warn('Instagram API direct publish fallback:', err);
      navigator.clipboard.writeText(this.generatedInstaCaption);
      this.captionCopied = true;
      this.instaPublishSuccess = true;
      window.open('https://www.instagram.com/create/select/', '_blank');
    } finally {
      this.publishingToInstagram = false;
      this.cdr.markForCheck();
    }
  }

  copyInstaCaption() {
    if (!this.generatedInstaCaption) return;
    navigator.clipboard.writeText(this.generatedInstaCaption);
    this.captionCopied = true;
    setTimeout(() => {
      this.captionCopied = false;
      this.cdr.markForCheck();
    }, 3000);
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

  isItemSelected(id: string): boolean {
    return this.selectedItemIds.has(id);
  }

  getItemQty(id: any): number {
    return this.itemQuantities[String(id)] || 1;
  }

  setItemQty(id: any, qty: number) {
    const cleanQty = Math.max(1, Math.floor(qty || 1));
    this.itemQuantities[String(id)] = cleanQty;
    this.cdr.markForCheck();
  }

  increaseQty(id: any, event?: Event) {
    if (event) event.stopPropagation();
    const current = this.getItemQty(id);
    this.setItemQty(id, current + 1);
  }

  decreaseQty(id: any, event?: Event) {
    if (event) event.stopPropagation();
    const current = this.getItemQty(id);
    if (current > 1) {
      this.setItemQty(id, current - 1);
    }
  }

  toggleItem(id: string) {
    if (this.selectedItemIds.has(id)) {
      this.selectedItemIds.delete(id);
      delete this.itemQuantities[String(id)];
    } else {
      this.selectedItemIds.add(id);
      if (!this.itemQuantities[String(id)]) {
        this.itemQuantities[String(id)] = 1;
      }
    }
    this.cdr.markForCheck();
  }

  clearAllSelected() {
    this.selectedItemIds.clear();
    this.itemQuantities = {};
    this.cdr.markForCheck();
  }

  get dateWindowSummary(): string {
    if (!this.product.from_date && !this.product.to_date) {
      return 'Year-round Catalog';
    }
    if (this.product.from_date && this.product.to_date) {
      const start = new Date(this.product.from_date);
      const end = new Date(this.product.to_date);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return 'Invalid Range';
      return `${diffDays + 1} Days Active`;
    }
    if (this.product.from_date) return `From ${this.product.from_date}`;
    if (this.product.to_date) return `Until ${this.product.to_date}`;
    return '';
  }

  clearDates() {
    this.product.from_date = null;
    this.product.to_date = null;
    this.cdr.markForCheck();
  }

  // Drag & Drop Photo Handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        await this.uploadSingleFile(file);
      }
    }
  }

  async onFilesSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files as FileList)) {
        await this.uploadSingleFile(file);
      }
    }
    event.target.value = '';
  }

  async uploadSingleFile(file: File) {
    this.uploadingImage = true;
    this.cdr.markForCheck();
    try {
      const validation = await this.imageProcessor.validateFile(file);
      if (!validation.isValid) {
        this.errorMessage = validation.errorMessage || 'Invalid image file.';
        return;
      }

      const optimized = await this.imageProcessor.processAndOptimize(file, file.name, 1, file.size);
      const safeName = `product-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { data, error } = await this.supabase.uploadFile('images', safeName, optimized.file);

      if (error) {
        this.errorMessage = error.message;
      } else if (data) {
        if (!this.product.images) this.product.images = [];
        this.product.images.push(data);
        this.successMessage = `Photo optimized (${(optimized.optimizedSizeBytes / 1024).toFixed(0)} KB, ${optimized.savedPercentage}% saved) and added to gallery!`;
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to upload image file to storage.';
    } finally {
      this.uploadingImage = false;
      this.cdr.markForCheck();
    }
  }

  setAsCover(index: number) {
    if (this.product.images && this.product.images.length > index) {
      const [item] = this.product.images.splice(index, 1);
      this.product.images.unshift(item);
      this.cdr.markForCheck();
    }
  }

  removeImage(index: number) {
    if (this.product.images) {
      this.product.images.splice(index, 1);
      this.cdr.markForCheck();
    }
  }

  // Quick Category Actions
  openQuickCategoryModal() {
    this.newCategory = { name: '', price: null, description: '' };
    this.quickCategoryError = '';
    this.showQuickCategoryModal = true;
    this.cdr.markForCheck();
  }

  closeQuickCategoryModal() {
    this.showQuickCategoryModal = false;
    this.cdr.markForCheck();
  }

  async saveQuickCategory() {
    if (!this.newCategory.name.trim()) return;
    this.savingCategory = true;
    this.quickCategoryError = '';
    this.cdr.markForCheck();

    try {
      const { data, error } = await this.supabase.from('categories').insert({
        name: this.newCategory.name.trim(),
        description: this.newCategory.description || '',
        price: this.newCategory.price || null,
        is_active: true
      }).select().single();

      if (error) {
        this.quickCategoryError = error.message;
      } else if (data) {
        this.categories.push(data);
        this.product.category_id = String(data.id);
        this.closeQuickCategoryModal();
      }
    } catch (err: any) {
      this.quickCategoryError = err?.message || 'Failed to save category.';
    } finally {
      this.savingCategory = false;
      this.cdr.markForCheck();
    }
  }

  // Quick Item Actions
  openQuickItemModal() {
    this.newItem = { name: '', price: null, stock_quantity: null, description: '' };
    this.quickItemError = '';
    this.showQuickItemModal = true;
    this.cdr.markForCheck();
  }

  closeQuickItemModal() {
    this.showQuickItemModal = false;
    this.cdr.markForCheck();
  }

  async saveQuickItem() {
    if (!this.newItem.name.trim()) return;
    this.savingItem = true;
    this.quickItemError = '';
    this.cdr.markForCheck();

    try {
      const { data, error } = await this.supabase.from('product_details').insert({
        name: this.newItem.name.trim(),
        price: this.newItem.price || 0,
        description: this.newItem.description || '',
        is_active: true
      }).select().single();

      if (error) {
        this.quickItemError = error.message;
      } else if (data) {
        this.allItems.push(data);
        this.selectedItemIds.add(data.id);
        this.closeQuickItemModal();
      }
    } catch (err: any) {
      this.quickItemError = err?.message || 'Failed to save item.';
    } finally {
      this.savingItem = false;
      this.cdr.markForCheck();
    }
  }

  async saveProduct(forceDraft = false, addAnother = false) {
    this.submitted = true;
    this.cdr.markForCheck();

    if (this.hasErrors) {
      this.errorMessage = 'Please complete the highlighted required fields before saving.';
      if (this.errors['name']) {
        this.nameInputRef?.nativeElement?.focus();
      }
      this.cdr.markForCheck();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    const savedName = this.product.name.trim();
    const retainedCategory = this.product.category_id;

    const productPayload: any = {
      name: savedName,
      description: this.product.description || '',
      category_id: Number(this.product.category_id),
      selling_price: this.product.selling_price ? Number(this.product.selling_price) : null,
      weight_kg: this.product.weight_kg ? Number(this.product.weight_kg) : 0.5,
      from_date: this.product.from_date || null,
      to_date: this.product.to_date || null,
      images: this.product.images || [],
      is_active: forceDraft ? false : Boolean(this.product.is_active),
      gender: this.product.gender || 'unisex'
    };

    try {
      let error;
      let productId = this.product.id;

      if (this.isEdit) {
        const res = await this.supabase.from('products').update(productPayload).eq('id', productId);
        error = res.error;
      } else {
        const res = await this.supabase.from('products').insert(productPayload).select();
        error = res.error;
        if (res.data && res.data.length > 0) productId = res.data[0].id;
      }

      if (error) {
        this.errorMessage = error.message;
        this.saving = false;
        this.cdr.markForCheck();
        return;
      }

      // Save composition mappings with required quantities
      if (productId) {
        await this.supabase.from('product_mappings').delete().eq('product_id', productId);
        const mappings = Array.from(this.selectedItemIds).map(product_detail_id => ({
          product_id: productId,
          product_detail_id: product_detail_id,
          quantity: this.getItemQty(product_detail_id),
          is_active: true
        }));
        if (mappings.length > 0) {
          await this.supabase.from('product_mappings').insert(mappings);
        }
      }

      if (addAnother) {
        this.saving = false;
        this.submitted = false;
        this.successMessage = `"${savedName}" published successfully! Form prepped for your next hamper.`;
        this.product = {
          name: '',
          description: '',
          category_id: retainedCategory,
          selling_price: null,
          images: [],
          is_active: true,
          gender: 'unisex'
        };
        this.selectedItemIds.clear();
        this.cdr.markForCheck();
        setTimeout(() => {
          this.nameInputRef?.nativeElement?.focus();
        }, 100);
      } else {
        this.router.navigate(['/admin/products']);
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to save product.';
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
}
