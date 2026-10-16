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
  CustomHamperRequestItem
} from '../models/custom-hamper.model';
import { FileUploadComponent } from '../shared/ui/file-upload.component';
import { ModalComponent } from '../shared/ui/modal.component';

interface PresentationTheme {
  id: string;
  name: string;
  tagline: string;
  bgGradient: string;
  accentColor: string;
  borderColor: string;
  ribbonColor: string;
  lightBg: string;
}

interface ItemVisualMeta {
  icon: string;
  bg: string;
  text: string;
  badge: string;
  category: string;
}

@Component({
  selector: 'app-build-hamper-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent, FileUploadComponent, ModalComponent],
  template: `
    <app-site-layout>
      <div class="min-h-screen bg-[#FAF7F2] dark:bg-[#14100E] text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-24">

        <!-- MAIN STUDIO BUILDER INTERFACE -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-4">

          <!-- Sleek Compact Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EADFD2]/70 dark:border-white/10">
            <div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#9C4738] animate-pulse"></span>
                <h1 class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
                  Build Your Own Hamper
                </h1>
              </div>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                Handpick individual sweets, dry fruits, pooja items &amp; keepsakes to create your custom gift box.
              </p>
            </div>
            <a
              routerLink="/my-custom-hampers"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] transition shrink-0"
            >
              <i class="fa-solid fa-clock-rotate-left text-xs"></i>
              <span>My Past Hamper Requests &rarr;</span>
            </a>
          </div>

          <!-- COMPACT SETUP STRIP: Occasion, Theme, & Recipient in 1 sleek bar -->
          <div class="bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">

              <!-- Occasion Pills -->
              <div class="md:col-span-5">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-1.5">
                    <i class="fa-solid fa-sparkles text-[#9C4738]"></i> 1. Celebration Occasion
                  </span>
                  <span class="text-[10px] font-bold text-[#9C4738]">{{ selectedOccasion }}</span>
                </div>
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  <button
                    type="button"
                    *ngFor="let occ of occasions"
                    (click)="selectedOccasion = occ; onBuilderStateChanged()"
                    class="px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap border transition cursor-pointer"
                    [ngClass]="selectedOccasion === occ ? 'bg-[#9C4738] text-white border-[#9C4738] shadow-2xs' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#D9C3B9] hover:border-[#9C4738]/50'"
                  >
                    {{ occ }}
                  </button>
                </div>
              </div>

              <!-- Presentation Box Theme -->
              <div class="md:col-span-4">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-1.5">
                    <i class="fa-solid fa-box-open text-[#9C4738]"></i> 2. Box Theme
                  </span>
                  <span class="text-[10px] font-bold text-[#9C4738]">{{ selectedTheme.name }}</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    *ngFor="let th of themes"
                    (click)="selectedTheme = th; onBuilderStateChanged()"
                    class="px-2 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 truncate"
                    [ngClass]="selectedTheme.id === th.id ? 'border-[#9C4738] bg-[#9C4738]/10 text-[#9C4738] dark:text-[#EB9D8E] font-extrabold shadow-2xs' : 'border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 text-[#4A3C31] dark:text-[#D9C3B9] hover:border-[#9C4738]/50'"
                    [title]="th.name + ' - ' + th.tagline"
                  >
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" [style.background]="th.accentColor"></span>
                    <span class="truncate">{{ th.name.split(' ')[0] }}</span>
                  </button>
                </div>
              </div>

              <!-- Recipient Selector -->
              <div class="md:col-span-3">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-1.5">
                    <i class="fa-solid fa-user-heart text-[#9C4738]"></i> 3. Recipient
                  </span>
                </div>
                <div class="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    *ngFor="let g of recipients"
                    (click)="selectedRecipient = g; onBuilderStateChanged()"
                    class="px-2 py-0.5 rounded-lg text-[11px] font-bold border transition cursor-pointer"
                    [ngClass]="selectedRecipient === g ? 'bg-[#9C4738] text-white border-[#9C4738]' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#7A6C5E] dark:text-[#C5A393]'"
                  >
                    {{ g }}
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- 2-COLUMN MAIN WORKSPACE -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">

            <!-- LEFT 7 COLS: INDIVIDUAL ITEM SELECTOR BOUTIQUE -->
            <div class="lg:col-span-7 space-y-4">

              <!-- Filter & Search Toolbar -->
              <div class="bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 p-3 sm:p-4 shadow-2xs space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <h2 class="font-serif font-bold text-sm sm:text-base text-[#2E2825] dark:text-[#F4F1ED] flex items-center gap-2">
                      <span>Select Goodies for Your Hamper</span>
                      <span class="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FAF7F2] dark:bg-white/10 text-[#9C4738] rounded-full border border-[#EADFD2] dark:border-white/10">
                        {{ filteredCatalogueProducts.length }} items
                      </span>
                    </h2>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Click "+ Add" to put items directly into your hamper box.</p>
                  </div>

                  <!-- Instant Search -->
                  <div class="relative w-full sm:w-56">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-[#A89F91]"></i>
                    <input
                      type="text"
                      [(ngModel)]="catalogueSearchQuery"
                      placeholder="Search kaju, diya, ladoo..."
                      class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                    >
                    <button
                      *ngIf="catalogueSearchQuery"
                      (click)="catalogueSearchQuery = ''"
                      class="absolute right-2.5 top-2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                </div>

                <!-- Category Tabs -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  <button
                    type="button"
                    *ngFor="let cat of catalogueCategories"
                    (click)="selectedCategoryFilter = cat"
                    class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition cursor-pointer flex items-center gap-1.5"
                    [ngClass]="selectedCategoryFilter === cat ? 'bg-[#9C4738] text-white border-[#9C4738] shadow-2xs font-bold' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:border-[#9C4738]/50'"
                  >
                    <span>{{ cat }}</span>
                    <span class="text-[10px] opacity-80 font-mono">({{ getCategoryCount(cat) }})</span>
                  </button>
                </div>
              </div>

              <!-- Loading Skeleton / Error State -->
              <div *ngIf="isLoadingItems" class="p-8 text-center text-xs text-stone-500 bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10">
                <i class="fa-solid fa-spinner fa-spin text-xl text-[#9C4738] mb-2"></i>
                <p>Loading authentic goodies and inclusions...</p>
              </div>

              <!-- Empty Results State -->
              <div *ngIf="!isLoadingItems && filteredCatalogueProducts.length === 0" class="p-8 text-center bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 space-y-2">
                <div class="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 mx-auto flex items-center justify-center text-lg">
                  <i class="fa-solid fa-box-open"></i>
                </div>
                <h4 class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">No items match "{{ catalogueSearchQuery }}"</h4>
                <p class="text-[11px] text-stone-500">Try searching for dry fruits, sweets, ladoo, diya, or clear the search.</p>
                <button (click)="catalogueSearchQuery = ''; selectedCategoryFilter = 'All Goodies'" class="px-3 py-1 rounded-xl text-xs font-bold text-[#9C4738] hover:underline cursor-pointer">
                  Reset Search Filter
                </button>
              </div>

              <!-- ITEMS GRID: Fast, visual cards with instant 1-tap add/counter -->
              <div *ngIf="!isLoadingItems && filteredCatalogueProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  *ngFor="let item of filteredCatalogueProducts"
                  class="p-3.5 rounded-2xl border bg-white dark:bg-[#1E1916] transition-all duration-200 flex flex-col justify-between gap-3 group hover:shadow-xs"
                  [ngClass]="isItemInHamper(item.uid) ? 'border-[#9C4738] ring-1 ring-[#9C4738]/20 bg-[#FAF7F2]/50 dark:bg-[#251F1C]' : 'border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738]/50'"
                >
                  <!-- Card Top: Visual Avatar & Item Details -->
                  <div class="flex items-start gap-3 min-w-0">
                    <!-- Icon Avatar with category tint -->
                    <div
                      class="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-lg shadow-2xs transition group-hover:scale-105"
                      [ngClass]="getItemVisual(item.name).bg"
                    >
                      <i [class]="getItemVisual(item.name).icon" [ngClass]="getItemVisual(item.name).text"></i>
                    </div>

                    <!-- Name & Category Badge -->
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span
                          class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                          [ngClass]="getItemVisual(item.name).bg + ' ' + getItemVisual(item.name).text"
                        >
                          {{ getItemVisual(item.name).badge }}
                        </span>
                        <span *ngIf="item.stockQuantity && item.stockQuantity <= 5" class="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md">
                          Only {{ item.stockQuantity }} left
                        </span>
                      </div>
                      <h3 class="text-xs sm:text-sm font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate mt-1" [title]="item.name">
                        {{ item.name }}
                      </h3>
                      <p class="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {{ item.description || 'Artisanal authentic inclusion' }}
                      </p>
                    </div>
                  </div>

                  <!-- Card Bottom: Price & Add / Stepper Counter -->
                  <div class="flex items-center justify-between pt-2 border-t border-[#EADFD2]/50 dark:border-white/5">
                    <div>
                      <span class="text-xs font-extrabold text-[#9C4738] dark:text-[#EB9D8E] font-mono text-base">
                        ₹{{ item.price }}
                      </span>
                      <span class="text-[10px] text-stone-400 block -mt-1">per unit</span>
                    </div>

                    <!-- Add Button OR Stepper -->
                    <div>
                      <button
                        *ngIf="!isItemInHamper(item.uid)"
                        type="button"
                        (click)="addCatalogueItemToHamper(item)"
                        class="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] hover:bg-[#9C4738] hover:text-white text-[#9C4738] dark:text-[#EB9D8E] text-xs font-bold transition shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <i class="fa-solid fa-plus text-[10px]"></i>
                        <span>Add</span>
                      </button>

                      <div *ngIf="isItemInHamper(item.uid)" class="flex items-center gap-1.5 bg-[#9C4738]/10 dark:bg-white/10 border border-[#9C4738] rounded-xl p-0.5 shadow-2xs">
                        <button
                          type="button"
                          (click)="decreaseHamperQuantity(item.uid)"
                          class="w-7 h-7 rounded-lg bg-white dark:bg-[#1E1916] text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-rose-600 flex items-center justify-center cursor-pointer active:scale-90 transition shadow-2xs"
                          aria-label="Decrease quantity"
                        >
                          <i class="fa-solid fa-minus text-[9px]"></i>
                        </button>
                        <span class="text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] px-2 font-mono">
                          {{ getHamperItemQuantity(item.uid) }}
                        </span>
                        <button
                          type="button"
                          (click)="increaseHamperQuantity(item.uid)"
                          class="w-7 h-7 rounded-lg bg-white dark:bg-[#1E1916] text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-emerald-600 flex items-center justify-center cursor-pointer active:scale-90 transition shadow-2xs"
                          aria-label="Increase quantity"
                        >
                          <i class="fa-solid fa-plus text-[9px]"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- COLLAPSIBLE BESPOKE CUSTOM ITEM REQUEST -->
              <div class="bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 p-4 shadow-2xs space-y-3">
                <button
                  type="button"
                  (click)="isCustomItemFormOpen = !isCustomItemFormOpen"
                  class="w-full flex items-center justify-between text-left cursor-pointer group"
                >
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs">
                      <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] group-hover:text-purple-600 transition">
                        Can't find a specific item? Request bespoke sourcing
                      </h4>
                      <p class="text-[10px] text-stone-500">Add specialized sweets, engraved wooden items, silver coins, or personal gifts.</p>
                    </div>
                  </div>
                  <span class="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <span>{{ isCustomItemFormOpen ? 'Hide' : '+ Add Custom' }}</span>
                    <i class="fa-solid" [ngClass]="isCustomItemFormOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                  </span>
                </button>

                <!-- Collapsible Form Body -->
                <div *ngIf="isCustomItemFormOpen" class="pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 space-y-3">
                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    <div class="sm:col-span-8">
                      <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        Item Name / Description <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="newCustomItemName"
                        placeholder="e.g. Personalized Silver Plated Diya or Customized Name Tag"
                        class="w-full px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-purple-600 dark:text-[#F4F1ED]"
                      >
                    </div>

                    <div class="sm:col-span-4">
                      <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        [(ngModel)]="newCustomItemQuantity"
                        min="1"
                        max="100"
                        class="w-full px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-purple-600 dark:text-[#F4F1ED]"
                      >
                    </div>
                  </div>

                  <div>
                    <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Specifications &amp; Artisan Notes (Optional)
                    </label>
                    <textarea
                      [(ngModel)]="newCustomItemDesc"
                      rows="2"
                      placeholder="e.g. Prefer brass finish, 4 inches tall, engraved with family name."
                      class="w-full px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-purple-600 dark:text-[#F4F1ED]"
                    ></textarea>
                  </div>

                  <!-- Upload Custom Item Reference Image -->
                  <div>
                    <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1 flex items-center justify-between">
                      <span>Upload Reference Image (Optional, JPG/PNG &le; 1 MB)</span>
                      <span *ngIf="newCustomItemImageUrl" class="text-emerald-600 text-[10px] font-bold">
                        <i class="fa-solid fa-check"></i> Image Attached
                      </span>
                    </label>
                    <app-file-upload
                      [aspectRatio]="1"
                      targetLabel="Custom Reference Photo"
                      bucket="images"
                      (fileUploaded)="onCustomItemPhotoUploaded($event)"
                      (removed)="newCustomItemImageUrl = ''"
                    ></app-file-upload>
                  </div>

                  <div class="flex items-center justify-between pt-1">
                    <span class="text-[10px] text-stone-500 italic">
                      Price will be verified by concierge in your quotation.
                    </span>
                    <button
                      type="button"
                      (click)="addCustomItemToHamper()"
                      [disabled]="!newCustomItemName.trim()"
                      class="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-2xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <i class="fa-solid fa-plus text-[10px]"></i>
                      <span>Add Custom Item</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            <!-- RIGHT 5 COLS: STICKY LIVE HAMPER SIMULATION BOX -->
            <div id="hamper-simulation-preview" class="lg:col-span-5 lg:sticky lg:top-20 space-y-4">

              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 shadow-sm space-y-4">

                <!-- Hamper Title & Badge -->
                <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-2">
                    <span class="w-8 h-8 rounded-xl bg-[#9C4738]/10 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-sm">
                      <i class="fa-solid fa-gift"></i>
                    </span>
                    <div>
                      <h3 class="font-serif font-bold text-sm sm:text-base text-[#2E2825] dark:text-[#F4F1ED]">
                        Live Hamper Box
                      </h3>
                      <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">{{ selectedTheme.name }}</p>
                    </div>
                  </div>

                  <button
                    *ngIf="hamperItems.length > 0"
                    type="button"
                    (click)="clearAllItems()"
                    class="text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
                  >
                    Clear Box
                  </button>
                </div>

                <!-- Simulation Visual Box -->
                <div
                  class="relative rounded-2xl p-4 overflow-hidden border-2 transition-all duration-300 min-h-[220px] flex flex-col justify-between shadow-inner"
                  [style.borderColor]="selectedTheme.borderColor"
                  [style.background]="selectedTheme.bgGradient"
                >
                  <!-- Occasion Ribbon Graphic -->
                  <div class="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                    <div
                      class="absolute transform rotate-45 text-white text-[9px] font-bold py-1 right-[-35px] top-[18px] w-[120px] text-center shadow-xs uppercase tracking-wider"
                      [style.background]="selectedTheme.ribbonColor"
                    >
                      {{ selectedOccasion.split(' ')[0] }}
                    </div>
                  </div>

                  <!-- Hamper Items List -->
                  <div class="space-y-2 z-10">
                    <div class="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#4A3C31] dark:text-stone-300">
                      <span>Curated Inclusions</span>
                      <span class="font-mono text-[#9C4738] dark:text-[#EB9D8E]">{{ totalItemsCount }} pcs</span>
                    </div>

                    <!-- Empty Tray State -->
                    <div *ngIf="hamperItems.length === 0" class="py-8 text-center space-y-2">
                      <div class="w-10 h-10 rounded-full bg-white/60 dark:bg-white/10 mx-auto flex items-center justify-center text-[#9C4738] text-sm">
                        <i class="fa-solid fa-basket-shopping"></i>
                      </div>
                      <p class="text-xs font-bold text-[#4A3C31] dark:text-stone-200">Your hamper box is empty</p>
                      <p class="text-[10px] text-[#7A6C5E] dark:text-stone-400 max-w-[220px] mx-auto">
                        Click "+ Add" on any goodies on the left to start curating your gift box!
                      </p>
                    </div>

                    <!-- Active Items Scrollable Tray -->
                    <div *ngIf="hamperItems.length > 0" class="space-y-1.5 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                      <div
                        *ngFor="let it of hamperItems"
                        class="p-2 rounded-xl bg-white/95 dark:bg-[#1E1916]/95 border border-black/5 dark:border-white/10 shadow-2xs flex items-center justify-between gap-2"
                      >
                        <div class="flex items-center gap-2 min-w-0">
                          <div
                            class="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs"
                            [ngClass]="getItemVisual(it.name).bg"
                          >
                            <i [class]="getItemVisual(it.name).icon" [ngClass]="getItemVisual(it.name).text"></i>
                          </div>
                          <div class="min-w-0">
                            <h5 class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ it.name }}</h5>
                            <span class="text-[10px] text-stone-500 font-mono">
                              {{ it.isPriceConfirmed ? ('₹' + it.price + ' each') : 'Custom Item (TBD)' }}
                            </span>
                          </div>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                          <!-- Micro stepper -->
                          <div class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5">
                            <button
                              type="button"
                              (click)="decreaseHamperQuantity(it.uid)"
                              class="w-5 h-5 rounded text-[10px] font-bold text-stone-600 hover:text-rose-600 flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <span class="text-xs font-bold text-[#9C4738] font-mono px-1">{{ it.quantity }}</span>
                            <button
                              type="button"
                              (click)="increaseHamperQuantity(it.uid)"
                              class="w-5 h-5 rounded text-[10px] font-bold text-stone-600 hover:text-emerald-600 flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <!-- Subtotal -->
                          <span *ngIf="it.isPriceConfirmed" class="text-xs font-mono font-bold text-[#2E2825] dark:text-[#F4F1ED] w-12 text-right">
                            ₹{{ (it.price || 0) * it.quantity }}
                          </span>

                          <!-- Remove Icon -->
                          <button
                            type="button"
                            (click)="removeItemFromHamper(it.uid)"
                            class="text-stone-400 hover:text-rose-600 text-xs cursor-pointer p-1"
                            title="Remove item"
                          >
                            <i class="fa-solid fa-trash-can text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Bottom Box Footer -->
                  <div class="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-bold text-[#4A3C31] dark:text-stone-200 z-10">
                    <span>Estimated Goodies Total</span>
                    <span class="text-sm font-extrabold font-mono text-[#9C4738] dark:text-[#EB9D8E]">
                      ₹{{ estimatedCatalogueSubtotal }}
                    </span>
                  </div>
                </div>

                <!-- Gift Card Message Input -->
                <div>
                  <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                    Personal Gift Message (Printed on Complimentary Card)
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="personalMessage"
                    (change)="onBuilderStateChanged()"
                    placeholder="e.g. Wishing you a festive season filled with happiness!"
                    class="w-full px-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                  >
                </div>

                <!-- Main Action Button: Opens Review Modal -->
                <button
                  type="button"
                  (click)="openReviewModal()"
                  [disabled]="hamperItems.length === 0"
                  class="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  <i class="fa-solid fa-paper-plane text-xs"></i>
                  <span>Review &amp; Request Hamper Quotation &rarr;</span>
                </button>

                <!-- Trust Guarantee Chips -->
                <div class="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 text-[10px] text-[#7A6C5E] dark:text-[#C5A393] space-y-1">
                  <div class="flex items-center gap-1.5 font-bold text-[#9C4738] dark:text-[#EB9D8E]">
                    <i class="fa-solid fa-shield-check"></i>
                    <span>RMS Concierge Assurance</span>
                  </div>
                  <p class="leading-relaxed">
                    No payment charged now. Our artisans inspect availability, calculate bespoke packaging, and share your quotation on WhatsApp for final approval.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </main>

        <!-- FLOATING MOBILE BOTTOM BAR (Shows when items are added) -->
        <aside
          *ngIf="hamperItems.length > 0"
          class="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-[#57251C] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-fade-in"
        >
          <div class="min-w-0">
            <span class="text-[10px] uppercase tracking-wider text-amber-200 block">Hamper Box</span>
            <div class="text-xs font-bold truncate">
              {{ totalItemsCount }} item(s) • ₹{{ estimatedCatalogueSubtotal }}
            </div>
          </div>
          <button
            type="button"
            (click)="openReviewModal()"
            class="px-4 py-2 rounded-xl bg-[#C56D5B] hover:bg-[#9C4738] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>Request Quotation</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </aside>

        <!-- STEP 4: REVIEW & SUBMISSION MODAL (Replaces heavy in-page form) -->
        <app-modal
          [isOpen]="showReviewModal"
          title="Review Custom Hamper Request"
          size="lg"
          (onClose)="showReviewModal = false"
        >
          <div class="space-y-4 p-2 sm:p-4 text-xs">

            <!-- Hamper Summary Card -->
            <div class="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider">
                  {{ selectedOccasion }} • {{ selectedTheme.name }}
                </span>
                <span class="font-mono font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">
                  ₹{{ estimatedCatalogueSubtotal }}
                </span>
              </div>

              <div class="flex items-center gap-2 text-stone-500 text-[11px]">
                <span>Total Items: <strong class="text-stone-800 dark:text-stone-200">{{ totalItemsCount }} pcs</strong></span>
                <span>•</span>
                <span>Recipient: <strong class="text-stone-800 dark:text-stone-200">{{ selectedRecipient }}</strong></span>
              </div>

              <!-- List of items summary -->
              <div class="text-[11px] text-stone-600 dark:text-stone-300 pt-1 border-t border-[#EADFD2]/60 dark:border-white/10 max-h-28 overflow-y-auto custom-scrollbar space-y-1">
                <div *ngFor="let it of hamperItems" class="flex justify-between">
                  <span>{{ it.quantity }}x {{ it.name }}</span>
                  <span class="font-mono">{{ it.isPriceConfirmed ? ('₹' + ((it.price || 0) * it.quantity)) : 'Custom' }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Details Form -->
            <div class="space-y-3">
              <h4 class="font-serif font-bold text-xs uppercase tracking-wider text-[#4A3C31] dark:text-[#F4F1ED]">
                Your Contact Information
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                    Full Name <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    [(ngModel)]="customerName"
                    placeholder="e.g. Priya Sharma"
                    class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                  >
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                    WhatsApp Phone <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    [(ngModel)]="customerPhone"
                    placeholder="10-digit number"
                    maxlength="10"
                    class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                  >
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                    Email Address <span class="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    [(ngModel)]="customerEmail"
                    placeholder="e.g. priya@gmail.com"
                    class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                  >
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                  Delivery Date Preference or Dietary Notes (Optional)
                </label>
                <textarea
                  [(ngModel)]="customerNotes"
                  rows="2"
                  placeholder="e.g. Require delivery before 20th Oct in Navi Mumbai. Sugar-free dry fruits only."
                  class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                ></textarea>
              </div>

              <!-- Mandatory Policy Notice -->
              <div class="p-3 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#9C4738]/20 text-[11px] text-[#57251C] dark:text-[#EADFD2] leading-relaxed">
                <strong>No payment required now.</strong> Our concierge will verify item availability, craft a digital packaging preview, and share an official quotation for your review on WhatsApp.
              </div>

              <!-- Error Message Banner -->
              <div *ngIf="submitErrorMessage" class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 rounded-xl font-bold">
                {{ submitErrorMessage }}
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div modal-footer class="w-full flex items-center justify-between gap-3">
            <button
              type="button"
              (click)="showReviewModal = false"
              class="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 cursor-pointer"
            >
              Back to Studio
            </button>

            <button
              type="button"
              (click)="submitConsultationRequest()"
              [disabled]="isSubmitting"
              class="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold uppercase tracking-wider shadow hover:shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <span *ngIf="isSubmitting" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
              <i *ngIf="!isSubmitting" class="fa-solid fa-paper-plane text-xs"></i>
              <span>{{ isSubmitting ? 'Transmitting Request...' : 'Submit Hamper Request' }}</span>
            </button>
          </div>
        </app-modal>

        <!-- SUCCESS CONFIRMATION MODAL -->
        <app-modal
          [isOpen]="showSuccessModal"
          title="Consultation Request Received"
          size="md"
          (onClose)="showSuccessModal = false"
        >
          <div class="p-4 text-center space-y-4">
            <div class="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-2xl shadow-inner">
              <i class="fa-solid fa-gift"></i>
            </div>

            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-[#9C4738]">Reference Number</span>
              <h3 class="font-mono text-xl font-extrabold text-[#2E2825] dark:text-[#F4F1ED] mt-0.5">
                {{ createdRequestNo }}
              </h3>
            </div>

            <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
              Thank you! Our master artisans are reviewing your {{ selectedOccasion }} selections and will prepare your quotation and visual mockup within a few hours.
            </p>

            <div class="p-3 bg-[#FAF7F2] dark:bg-white/5 rounded-2xl text-[11px] text-[#4A3C31] dark:text-[#F4F1ED] border border-[#EADFD2] dark:border-white/10 text-left space-y-1">
              <div><strong class="text-[#9C4738]">Customer:</strong> {{ customerName }}</div>
              <div><strong class="text-[#9C4738]">Theme:</strong> {{ selectedTheme.name }}</div>
              <div><strong class="text-[#9C4738]">Total Items:</strong> {{ totalItemsCount }} pcs</div>
              <div><strong class="text-[#9C4738]">Status:</strong> <span class="text-amber-600 font-bold">New (Under Review)</span></div>
            </div>
          </div>

          <div modal-footer class="w-full flex items-center justify-between gap-2">
            <button type="button" (click)="showSuccessModal = false" class="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-700 cursor-pointer">
              Close
            </button>
            <a routerLink="/my-custom-hampers" class="px-5 py-2.5 rounded-full bg-[#9C4738] text-white text-xs font-bold shadow hover:bg-[#883B2D] transition cursor-pointer">
              Track Request Status &rarr;
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
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // Occasions, Themes & Recipients
  readonly occasions = [
    'Diwali Festive',
    'Ganesh Utsav Special',
    'Royal Wedding',
    'Birthday Celebration',
    'Corporate Milestone',
    'Anniversary',
    'Newborn & Baby Shower',
    'Personalized Keepsake'
  ];

  readonly themes: PresentationTheme[] = [
    {
      id: 'festive_gold',
      name: 'Festive Gold & Maroon',
      tagline: 'Warm golden shimmer with royal crimson ribbons',
      bgGradient: 'linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, rgba(251, 191, 36, 0.18) 100%)',
      accentColor: '#D97706',
      borderColor: '#F59E0B',
      ribbonColor: '#9C4738',
      lightBg: 'bg-amber-50'
    },
    {
      id: 'royal_velvet',
      name: 'Royal Velvet Plum',
      tagline: 'Deep luxurious jewel tones for momentous occasions',
      bgGradient: 'linear-gradient(135deg, rgba(243, 232, 255, 0.5) 0%, rgba(192, 132, 252, 0.2) 100%)',
      accentColor: '#7E22CE',
      borderColor: '#A855F7',
      ribbonColor: '#581C87',
      lightBg: 'bg-purple-50'
    },
    {
      id: 'eco_kraft',
      name: 'Artisanal Eco-Kraft',
      tagline: 'Earthy textured kraft boxes with rustic botanical twine',
      bgGradient: 'linear-gradient(135deg, rgba(245, 238, 227, 0.6) 0%, rgba(217, 195, 185, 0.3) 100%)',
      accentColor: '#8B6E57',
      borderColor: '#B49B85',
      ribbonColor: '#4A3C31',
      lightBg: 'bg-stone-50'
    }
  ];

  readonly recipients = ['Unisex / Family', 'For Her', 'For Him', 'Kids', 'Couples'];

  selectedOccasion = 'Diwali Festive';
  selectedTheme = this.themes[0];
  selectedRecipient = 'Unisex / Family';
  personalMessage = '';

  // Item Search & Filter State
  catalogueSearchQuery = '';
  selectedCategoryFilter = 'All Goodies';
  readonly catalogueCategories = [
    'All Goodies',
    'Dry Fruits & Nuts',
    'Sweets & Snacks',
    'Pooja & Lighting',
    'Keepsakes & Packaging'
  ];

  allCatalogueProducts: HamperBuilderItem[] = [];
  isLoadingItems = true;

  // Custom Requested Bespoke Item
  isCustomItemFormOpen = false;
  newCustomItemName = '';
  newCustomItemQuantity = 1;
  newCustomItemDesc = '';
  newCustomItemImageUrl = '';

  // Hamper Builder Tray Items
  hamperItems: HamperBuilderItem[] = [];

  // Customer Contact & Submission Details
  showReviewModal = false;
  customerName = '';
  customerEmail = '';
  customerPhone = '';
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

    // Pre-fill user profile if logged in
    const user = this.auth.currentUser;
    if (user) {
      this.customerName = user.name || '';
      this.customerEmail = user.email || '';
      this.customerPhone = user.phone_no || '';
    }

    // Restore draft if available from prior session
    this.restoreDraft();

    // Fetch verified individual inclusions from `product_details`
    await this.loadCatalogueItems();
  }

  // Restore & save session draft so users never lose curated hamper
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
      }
    } catch {}
  }

  onBuilderStateChanged() {
    if (typeof sessionStorage === 'undefined') return;
    try {
      sessionStorage.setItem('rms_hamper_builder_draft', JSON.stringify({
        items: this.hamperItems,
        selectedOccasion: this.selectedOccasion,
        personalMessage: this.personalMessage,
        selectedRecipient: this.selectedRecipient
      }));
    } catch {}
  }

  /**
   * Load individual inclusions and goodies from `product_details` table
   */
  async loadCatalogueItems() {
    this.isLoadingItems = true;
    this.cdr.markForCheck();

    try {
      const { data, error } = await this.supabase
        .from('product_details')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (!error && data && data.length > 0) {
        this.allCatalogueProducts = data.map((item: any) => ({
          uid: `inclusion-${item.id}`,
          itemType: 'catalogue_inclusion',
          inclusionId: Number(item.id),
          name: this.formatItemName(item.name),
          description: item.description || '',
          price: Number(item.price || 0),
          stockQuantity: item.stock_quantity != null ? Number(item.stock_quantity) : null,
          isPriceConfirmed: true,
          quantity: 1,
          category: this.getItemVisual(item.name).category
        }));
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
    if (!name) return 'Artisanal Goodie';
    // Clean up typos or leading numbers like "1  Essence Candle" -> "Essence Candle"
    return name.replace(/^\d+\s+/, '').trim();
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

    this.allCatalogueProducts = fallbackList.map(item => ({
      uid: `inclusion-${item.id}`,
      itemType: 'catalogue_inclusion',
      inclusionId: item.id,
      name: item.name,
      description: '',
      price: item.price,
      isPriceConfirmed: true,
      quantity: 1,
      category: this.getItemVisual(item.name).category
    }));
  }

  getItemVisual(name: string): ItemVisualMeta {
    const n = (name || '').toLowerCase();
    if (n.includes('almond') || n.includes('badam')) {
      return { icon: 'fa-solid fa-seedling', bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300', badge: 'Dry Fruits', category: 'Dry Fruits & Nuts' };
    }
    if (n.includes('cashew') || n.includes('kaju')) {
      return { icon: 'fa-solid fa-bowl-food', bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300', badge: 'Dry Fruits', category: 'Dry Fruits & Nuts' };
    }
    if (n.includes('pista') || n.includes('pistachio')) {
      return { icon: 'fa-solid fa-leaf', bg: 'bg-emerald-100 dark:bg-emerald-950/60', text: 'text-emerald-800 dark:text-emerald-300', badge: 'Dry Fruits', category: 'Dry Fruits & Nuts' };
    }
    if (n.includes('ladoo') || n.includes('laddu') || n.includes('karanji') || n.includes('chikki') || n.includes('sweet') || n.includes('modak')) {
      return { icon: 'fa-solid fa-cookie-bite', bg: 'bg-orange-100 dark:bg-orange-950/60', text: 'text-orange-800 dark:text-orange-300', badge: 'Festive Sweet', category: 'Sweets & Snacks' };
    }
    if (n.includes('chakli') || n.includes('chivda') || n.includes('shankar') || n.includes('snack')) {
      return { icon: 'fa-solid fa-bowl-rice', bg: 'bg-yellow-100 dark:bg-yellow-950/60', text: 'text-yellow-800 dark:text-yellow-300', badge: 'Crunchy Snack', category: 'Sweets & Snacks' };
    }
    if (n.includes('diya')) {
      return { icon: 'fa-solid fa-fire-flame-curved', bg: 'bg-rose-100 dark:bg-rose-950/60', text: 'text-rose-800 dark:text-rose-300', badge: 'Aarti & Light', category: 'Pooja & Lighting' };
    }
    if (n.includes('candle')) {
      return { icon: 'fa-solid fa-fire', bg: 'bg-amber-100 dark:bg-amber-950/60', text: 'text-amber-800 dark:text-amber-300', badge: 'Aroma & Decor', category: 'Pooja & Lighting' };
    }
    if (n.includes('card')) {
      return { icon: 'fa-solid fa-envelope-open-text', bg: 'bg-purple-100 dark:bg-purple-950/60', text: 'text-purple-800 dark:text-purple-300', badge: 'Personalized', category: 'Keepsakes & Packaging' };
    }
    if (n.includes('box')) {
      return { icon: 'fa-solid fa-box-open', bg: 'bg-stone-200 dark:bg-stone-800', text: 'text-stone-800 dark:text-stone-200', badge: 'Packaging', category: 'Keepsakes & Packaging' };
    }
    if (n.includes('clip') || n.includes('charm') || n.includes('ribbon')) {
      return { icon: 'fa-solid fa-gem', bg: 'bg-pink-100 dark:bg-pink-950/60', text: 'text-pink-800 dark:text-pink-300', badge: 'Accessory', category: 'Keepsakes & Packaging' };
    }
    return { icon: 'fa-solid fa-gift', bg: 'bg-amber-50 dark:bg-white/10', text: 'text-[#9C4738] dark:text-[#EB9D8E]', badge: 'Goodie', category: 'Other Goodies' };
  }

  get filteredCatalogueProducts(): HamperBuilderItem[] {
    return this.allCatalogueProducts.filter(item => {
      const matchesSearch = !this.catalogueSearchQuery.trim() ||
        item.name.toLowerCase().includes(this.catalogueSearchQuery.toLowerCase());
      const matchesCat = this.selectedCategoryFilter === 'All Goodies' || item.category === this.selectedCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }

  getCategoryCount(category: string): number {
    if (category === 'All Goodies') return this.allCatalogueProducts.length;
    return this.allCatalogueProducts.filter(i => i.category === category).length;
  }

  // Hamper Tray Operations
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

  // Custom Bespoke Item Handlers
  onCustomItemPhotoUploaded(imageUrl: string) {
    this.newCustomItemImageUrl = imageUrl;
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

    // Reset custom form
    this.newCustomItemName = '';
    this.newCustomItemQuantity = 1;
    this.newCustomItemDesc = '';
    this.newCustomItemImageUrl = '';
    this.isCustomItemFormOpen = false;
    this.onBuilderStateChanged();
    this.cdr.markForCheck();
  }

  // Metrics
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

  // Modal Controls
  openReviewModal() {
    if (this.hamperItems.length === 0) return;
    this.submitErrorMessage = '';

    // If authenticated, pre-fill from auth service
    const user = this.auth.currentUser;
    if (user) {
      if (!this.customerName) this.customerName = user.name || '';
      if (!this.customerEmail) this.customerEmail = user.email || '';
      if (!this.customerPhone) this.customerPhone = user.phone_no || '';
    }

    this.showReviewModal = true;
    this.cdr.markForCheck();
  }

  // Submission Flow
  async submitConsultationRequest() {
    this.submitErrorMessage = '';

    if (this.hamperItems.length === 0) {
      this.submitErrorMessage = 'Please add at least one item to your hamper.';
      return;
    }

    if (!this.customerName.trim() || !this.customerEmail.trim() || !this.customerPhone.trim()) {
      this.submitErrorMessage = 'Please provide your full name, WhatsApp phone number, and email address.';
      return;
    }

    // Require sign-in if not authenticated
    if (!this.auth.isAuthenticated) {
      this.onBuilderStateChanged();
      this.submitErrorMessage = 'Please sign in or register to submit your custom hamper consultation request.';
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/build-hamper' } });
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    try {
      const currentUser = this.auth.currentUser;

      const requestPayload = {
        customer_id: currentUser?.id || null,
        customer_name: this.customerName.trim(),
        customer_email: this.customerEmail.trim(),
        customer_phone: this.customerPhone.trim(),
        occasion: this.selectedOccasion,
        theme: this.selectedTheme.name,
        recipient_gender: this.selectedRecipient,
        personal_message: this.personalMessage.trim(),
        customer_notes: this.customerNotes.trim(),
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
        // Clear hamper items and draft
        this.hamperItems = [];
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('rms_hamper_builder_draft');
        }
      } else {
        this.submitErrorMessage = res.error || 'Failed to submit consultation request. Please try again.';
      }
    } catch (err: any) {
      this.submitErrorMessage = err?.message || 'Unexpected error while transmitting your request.';
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }
}
