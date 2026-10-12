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
}

@Component({
  selector: 'app-build-hamper-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent, FileUploadComponent, ModalComponent],
  template: `
    <app-site-layout>
      <div class="min-h-screen bg-[#FAF7F2] dark:bg-[#14100E] text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-28">
        
        <!-- HERO / BANNER -->
        <section class="relative overflow-hidden bg-gradient-to-b from-[#F3E7DC]/80 via-[#FAF7F2] to-[#FAF7F2] dark:from-[#1E1916] dark:via-[#14100E] dark:to-[#14100E] border-b border-[#EADFD2]/70 dark:border-white/10 py-10 sm:py-14">
          <div class="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#EB9D8E]/20 dark:bg-[#EB9D8E]/10 blur-3xl"></div>
          
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl relative">
            <span class="inline-flex items-center gap-2 rounded-full border border-[#D9C3B9]/80 dark:border-white/10 bg-[#FFFDFC]/90 dark:bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#EB9D8E] shadow-2xs">
              <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
              <span>Interactive Gifting Studio</span>
            </span>

            <h1 class="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
              Build Your Own Hamper
            </h1>
            <p class="mt-3 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed max-w-2xl mx-auto">
              Design a bespoke gift hamper with real-time visual simulation. Select verified catalogue goodies, request unique custom items with reference photos, and submit for a personalized artisan consultation.
            </p>
          </div>
        </section>

        <!-- MAIN STUDIO BUILDER INTERFACE -->
        <main class="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT 7 COLS: STEP-BY-STEP BUILDER & CATALOGUE SELECTOR -->
            <div class="lg:col-span-7 space-y-8">
              
              <!-- STEP 1: OCCASION & LUXURY THEME -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-6">
                <div class="flex items-center gap-3 pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <span class="w-7 h-7 rounded-full bg-[#9C4738] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">
                      Gift Occasion &amp; Presentation Theme
                    </h2>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Choose the celebration mood and physical presentation styling.</p>
                  </div>
                </div>

                <!-- Occasion Selector -->
                <div>
                  <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-2 uppercase tracking-wider">
                    Select Celebration Occasion
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button 
                      type="button" 
                      *ngFor="let occ of occasions" 
                      (click)="selectedOccasion = occ"
                      class="px-3 py-2 rounded-2xl text-xs font-semibold border text-center transition-all cursor-pointer"
                      [ngClass]="selectedOccasion === occ ? 'bg-[#9C4738] text-white border-[#9C4738] shadow-sm font-bold scale-[1.02]' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#D9C3B9] hover:border-[#9C4738]'"
                    >
                      {{ occ }}
                    </button>
                  </div>
                </div>

                <!-- Presentation Theme Cards -->
                <div>
                  <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-2 uppercase tracking-wider">
                    Choose Hamper Presentation Theme
                  </label>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div 
                      *ngFor="let th of themes" 
                      (click)="selectedTheme = th"
                      class="p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between"
                      [ngClass]="selectedTheme.id === th.id ? 'border-[#9C4738] ring-2 ring-[#9C4738]/20 bg-[#FAF7F2] dark:bg-white/10 shadow-xs' : 'border-[#EADFD2] dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#9C4738]/60'"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <span class="w-3.5 h-3.5 rounded-full" [style.background]="th.accentColor"></span>
                        <i *ngIf="selectedTheme.id === th.id" class="fa-solid fa-circle-check text-xs text-[#9C4738]"></i>
                      </div>
                      <h4 class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ th.name }}</h4>
                      <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">{{ th.tagline }}</p>
                    </div>
                  </div>
                </div>

                <!-- Recipient Gender & Personal Message -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                      Recipient
                    </label>
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <button 
                        type="button" 
                        *ngFor="let g of ['Unisex / Family', 'Her', 'Him', 'Kids', 'Couples']"
                        (click)="selectedRecipient = g"
                        class="px-2.5 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer"
                        [ngClass]="selectedRecipient === g ? 'bg-[#9C4738] text-white border-[#9C4738]' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#D9C3B9]'"
                      >
                        {{ g }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                      Personal Message for Gift Card
                    </label>
                    <input 
                      type="text" 
                      [(ngModel)]="personalMessage" 
                      placeholder="e.g. Wishing you joy & prosperity! - Sneha"
                      class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                    >
                  </div>
                </div>
              </div>

              <!-- STEP 2: ADD ITEMS FROM EXISTING CATALOGUE -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10 flex-wrap gap-2">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-full bg-[#9C4738] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">
                        Select Catalogue Items
                      </h2>
                      <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Add verified authentic RMS Creations products &amp; pooja inclusions.</p>
                    </div>
                  </div>

                  <!-- Item Search Input -->
                  <div class="relative w-full sm:w-56">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-[#A89F91]"></i>
                    <input 
                      type="text" 
                      [(ngModel)]="catalogueSearchQuery" 
                      placeholder="Search items..." 
                      class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                    >
                  </div>
                </div>

                <!-- Category Filters -->
                <div class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  <button 
                    type="button" 
                    *ngFor="let cat of catalogueCategories"
                    (click)="selectedCategoryFilter = cat"
                    class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition cursor-pointer"
                    [ngClass]="selectedCategoryFilter === cat ? 'bg-[#9C4738] text-white border-[#9C4738]' : 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10 text-[#7A6C5E] dark:text-[#C5A393]'"
                  >
                    {{ cat }}
                  </button>
                </div>

                <!-- Catalogue Products Grid -->
                <div *ngIf="filteredCatalogueProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  <div 
                    *ngFor="let item of filteredCatalogueProducts" 
                    class="p-3 rounded-2xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 hover:border-[#9C4738]/60 transition flex items-center justify-between gap-3 group"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-[#EADFD2] dark:border-white/10 shrink-0">
                        <img [src]="item.imageUrl || 'assets/logo.png'" class="w-full h-full object-cover group-hover:scale-105 transition">
                      </div>
                      <div class="min-w-0">
                        <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                          Catalogue Verified
                        </span>
                        <h4 class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ item.name }}</h4>
                        <p class="text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] mt-0.5">₹{{ item.price }}</p>
                      </div>
                    </div>

                    <div class="shrink-0">
                      <!-- Add Button or Quantity Toggle -->
                      <button 
                        *ngIf="!isItemInHamper(item.uid)" 
                        type="button" 
                        (click)="addCatalogueItemToHamper(item)"
                        class="px-3 py-1.5 rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#9C4738] dark:text-[#DD8776] text-xs font-bold transition shadow-2xs hover:shadow cursor-pointer flex items-center gap-1"
                      >
                        <i class="fa-solid fa-plus text-[10px]"></i>
                        <span>Add</span>
                      </button>

                      <div *ngIf="isItemInHamper(item.uid)" class="flex items-center gap-2 bg-white dark:bg-[#251F1C] border border-[#9C4738] rounded-xl p-1 shadow-2xs">
                        <button type="button" (click)="decreaseHamperQuantity(item.uid)" class="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-rose-600 flex items-center justify-center cursor-pointer active:scale-95" aria-label="Decrease quantity">-</button>
                        <span class="text-xs font-bold text-[#9C4738] px-1 font-mono">{{ getHamperItemQuantity(item.uid) }}</span>
                        <button type="button" (click)="increaseHamperQuantity(item.uid)" class="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-emerald-600 flex items-center justify-center cursor-pointer active:scale-95" aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="filteredCatalogueProducts.length === 0" class="p-6 text-center text-xs text-stone-400">
                  No matching catalogue items found.
                </div>
              </div>

              <!-- STEP 3: REQUEST CUSTOM NON-CATALOGUE ITEMS -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">
                        Request Custom Non-Catalogue Items
                      </h2>
                      <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Add items not found in our catalogue with reference photo &amp; specifications.</p>
                    </div>
                  </div>

                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    Bespoke Sourcing
                  </span>
                </div>

                <!-- Custom Item Input Form -->
                <div class="space-y-4 p-4 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10">
                  <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div class="sm:col-span-8">
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        Item Name / Description <span class="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        [(ngModel)]="newCustomItemName" 
                        placeholder="e.g. Personalized Wooden Name Plaque or Silver Bell" 
                        class="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                      >
                    </div>

                    <div class="sm:col-span-4">
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        Desired Quantity
                      </label>
                      <input 
                        type="number" 
                        [(ngModel)]="newCustomItemQuantity" 
                        min="1" 
                        max="100" 
                        class="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                      >
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Specifications &amp; Artisan Notes (Optional)
                    </label>
                    <textarea 
                      [(ngModel)]="newCustomItemDesc" 
                      rows="2" 
                      placeholder="e.g. Prefer gold lacquer finish, 6 inches in diameter, engraved with family initials." 
                      class="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
                    ></textarea>
                  </div>

                  <!-- Upload Custom Item Reference Image -->
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5 flex items-center justify-between">
                      <span>Upload Reference Image (Strictly JPG/PNG &le; 1 MB)</span>
                      <span *ngIf="newCustomItemImageUrl" class="text-emerald-600 text-[11px] font-bold">
                        <i class="fa-solid fa-check"></i> Image Attached
                      </span>
                    </label>
                    
                    <app-file-upload
                      [aspectRatio]="1"
                      targetLabel="Custom Item Reference"
                      bucket="images"
                      (fileUploaded)="onCustomItemPhotoUploaded($event)"
                      (removed)="newCustomItemImageUrl = ''"
                    ></app-file-upload>
                  </div>

                  <!-- Clarity Banner -->
                  <div class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <i class="fa-solid fa-circle-info text-amber-600 mt-0.5"></i>
                    <div>
                      <strong>Custom Item — Price Not Yet Confirmed:</strong> Our master artisans will personally inspect your requested specifications and confirm pricing &amp; sourcing feasibility in your consultation quotation.
                    </div>
                  </div>

                  <div class="flex justify-end pt-1">
                    <button 
                      type="button" 
                      (click)="addCustomItemToHamper()" 
                      [disabled]="!newCustomItemName.trim()"
                      class="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <i class="fa-solid fa-plus text-xs"></i>
                      <span>Add Custom Request to Hamper</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- STEP 4: CUSTOMER CONSULTATION SUBMISSION & POLICY -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-4">
                <div class="flex items-center gap-3 pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <span class="w-7 h-7 rounded-full bg-[#9C4738] text-white text-xs font-bold flex items-center justify-center shrink-0">4</span>
                  <div>
                    <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">
                      Review &amp; Submit Consultation Request
                    </h2>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Request personal assistance and quotation from RMS Creations.</p>
                  </div>
                </div>

                <!-- Customer Details Form -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Your Full Name <span class="text-rose-500">*</span></label>
                    <input type="text" [(ngModel)]="customerName" class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Email Address <span class="text-rose-500">*</span></label>
                    <input type="email" [(ngModel)]="customerEmail" class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">WhatsApp Phone <span class="text-rose-500">*</span></label>
                    <input type="tel" [(ngModel)]="customerPhone" placeholder="10-digit number" class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]">
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Additional Notes or Dietary Restrictions</label>
                  <textarea [(ngModel)]="customerNotes" rows="2" placeholder="e.g. Sugar-free dry fruits only, dispatch required before 15th October." class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"></textarea>
                </div>

                <!-- MANDATORY POLICY CALLOUT -->
                <div class="p-4 rounded-2xl bg-[#FDFBF7] dark:bg-white/5 border-2 border-[#9C4738]/30 dark:border-[#EB9D8E]/30 text-xs text-[#57251C] dark:text-[#EADFD2] space-y-1.5">
                  <div class="flex items-center gap-2 font-bold text-[#9C4738] dark:text-[#EB9D8E]">
                    <i class="fa-solid fa-shield-heart text-sm"></i>
                    <span>Consultation Workflow &amp; Pricing Policy</span>
                  </div>
                  <p class="leading-relaxed font-serif text-xs italic">
                    “Your hamper is a special custom request, not a confirmed order. Our team will review your selections, check item availability, and personally assist you with the final design and pricing before you confirm your order.”
                  </p>
                  <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] pt-0.5">
                    No payment will be collected during this request submission. A quotation with delivery feasibility will be generated for your explicit review and acceptance.
                  </p>
                </div>

                <div *ngIf="submitErrorMessage" class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 rounded-xl font-bold">
                  {{ submitErrorMessage }}
                </div>

                <!-- Submit Button -->
                <div class="pt-2 flex items-center justify-between flex-wrap gap-3">
                  <div class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                    Hamper contains: <strong class="text-[#2E2825] dark:text-[#F4F1ED]">{{ hamperItems.length }} item(s)</strong>
                  </div>

                  <button 
                    type="button" 
                    (click)="submitConsultationRequest()" 
                    [disabled]="isSubmitting || hamperItems.length === 0"
                    class="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    <span *ngIf="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <i *ngIf="!isSubmitting" class="fa-solid fa-paper-plane text-xs"></i>
                    <span>{{ isSubmitting ? 'Transmitting Request...' : 'Submit Custom Hamper Request' }}</span>
                  </button>
                </div>
              </div>

            </div>

            <!-- RIGHT 5 COLS: STICKY REAL-TIME HAMPER SIMULATION PREVIEW -->
            <div id="hamper-simulation-preview" class="lg:col-span-5 sticky top-24 space-y-4">
              
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 sm:p-6 shadow-md space-y-4">
                
                <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-gift text-[#9C4738] dark:text-[#EB9D8E] text-base"></i>
                    <h3 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">
                      Live Hamper Simulation
                    </h3>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 text-[#9C4738] dark:text-[#EB9D8E]">
                    {{ selectedTheme.name }}
                  </span>
                </div>

                <!-- Simulation Box Display -->
                <div 
                  class="relative rounded-2xl p-4 overflow-hidden border-2 transition-all duration-500 min-h-[260px] flex flex-col justify-between"
                  [style.borderColor]="selectedTheme.borderColor"
                  [style.background]="selectedTheme.bgGradient"
                >
                  <!-- Theme Ribbon Graphic -->
                  <div class="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                    <div class="absolute transform rotate-45 bg-[#9C4738] text-white text-[9px] font-bold py-1 right-[-35px] top-[18px] w-[120px] text-center shadow-xs">
                      {{ selectedOccasion }}
                    </div>
                  </div>

                  <!-- Hamper Interior Items Preview Grid -->
                  <div class="space-y-2 z-10">
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] font-bold uppercase tracking-wider text-[#4A3C31] dark:text-stone-300">
                        Hamper Composition ({{ totalItemsCount }} pcs)
                      </span>
                      <button *ngIf="hamperItems.length > 0" type="button" (click)="clearAllItems()" class="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer">
                        Reset All
                      </button>
                    </div>

                    <!-- Items Tray -->
                    <div *ngIf="hamperItems.length > 0" class="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                      <div 
                        *ngFor="let it of hamperItems; let i = index" 
                        class="p-2.5 rounded-xl bg-white/95 dark:bg-[#1E1916]/95 border border-black/5 dark:border-white/10 shadow-2xs flex items-center justify-between gap-2.5 group"
                      >
                        <div class="flex items-center gap-2.5 min-w-0">
                          <img [src]="it.imageUrl || 'assets/logo.png'" class="w-9 h-9 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-700">
                          <div class="min-w-0">
                            <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ it.name }}</p>
                            <div class="flex items-center gap-1.5 text-[10px]">
                              <span *ngIf="it.isPriceConfirmed" class="text-emerald-700 dark:text-emerald-400 font-bold">
                                ₹{{ it.price }} &times; {{ it.quantity }}
                              </span>
                              <span *ngIf="!it.isPriceConfirmed" class="text-purple-700 dark:text-purple-300 font-bold">
                                Custom Item (Qty: {{ it.quantity }})
                              </span>
                            </div>
                          </div>
                        </div>

                        <!-- Item Controls -->
                        <div class="flex items-center gap-1.5 shrink-0">
                          <button type="button" (click)="decreaseHamperQuantity(it.uid)" class="w-5 h-5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-bold flex items-center justify-center hover:bg-stone-200 cursor-pointer">-</button>
                          <span class="text-xs font-bold">{{ it.quantity }}</span>
                          <button type="button" (click)="increaseHamperQuantity(it.uid)" class="w-5 h-5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-bold flex items-center justify-center hover:bg-stone-200 cursor-pointer">+</button>
                          <button type="button" (click)="removeItemFromHamper(it.uid)" class="text-stone-400 hover:text-rose-500 text-xs ml-1 cursor-pointer">
                            <i class="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Empty Tray Notice -->
                    <div *ngIf="hamperItems.length === 0" class="py-10 text-center space-y-2">
                      <div class="w-12 h-12 rounded-full bg-white/60 dark:bg-white/10 mx-auto flex items-center justify-center text-[#9C4738] dark:text-[#EB9D8E] text-xl">
                        <i class="fa-solid fa-basket-shopping"></i>
                      </div>
                      <h4 class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Hamper is currently empty</h4>
                      <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] max-w-xs mx-auto">
                        Add catalogue items or request custom items to see them arranged in your simulated hamper.
                      </p>
                    </div>
                  </div>

                  <!-- Gift Card Message Callout -->
                  <div *ngIf="personalMessage" class="mt-2 p-2 rounded-xl bg-white/90 dark:bg-black/40 border border-black/5 dark:border-white/10 text-[10px] text-[#4A3C31] dark:text-stone-300">
                    <span class="font-bold text-[#9C4738] dark:text-[#EB9D8E]">Calligraphy Card:</span> “{{ personalMessage }}”
                  </div>
                </div>

                <!-- Simulation Disclaimer -->
                <p class="text-[10px] text-[#A89F91] text-center leading-normal">
                  <i class="fa-solid fa-info-circle mr-0.5"></i>
                  Illustrative simulation preview. Our artisans curate the physical hamper with satin ribbons and filler packaging upon consultation.
                </p>

                <!-- Pricing & Estimated Subtotal Summary -->
                <div class="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[#7A6C5E] dark:text-[#C5A393]">Confirmed Catalogue Items:</span>
                    <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">₹{{ estimatedCatalogueSubtotal }}</span>
                  </div>

                  <div *ngIf="customItemsCount > 0" class="flex items-center justify-between text-purple-700 dark:text-purple-300">
                    <span>Custom Items ({{ customItemsCount }}):</span>
                    <span class="font-bold">Pending Quotation</span>
                  </div>

                  <div class="border-t border-[#EADFD2]/70 dark:border-white/10 pt-2 flex items-center justify-between font-bold text-sm">
                    <span class="text-[#2E2825] dark:text-[#F4F1ED]">Estimated Subtotal:</span>
                    <span class="text-[#9C4738] dark:text-[#EB9D8E]">
                      ₹{{ estimatedCatalogueSubtotal }}
                      <span *ngIf="customItemsCount > 0" class="text-[10px] font-normal text-[#7A6C5E] dark:text-[#C5A393] block text-right">+ Custom Quotation</span>
                    </span>
                  </div>
                </div>

                <!-- Link to My Custom Hamper Requests -->
                <div class="text-center pt-1">
                  <a routerLink="/my-custom-hampers" class="text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline">
                    <i class="fa-solid fa-clock-rotate-left mr-1"></i> View Past Custom Hamper Requests &rarr;
                  </a>
                </div>

              </div>

            </div>

          </div>
        </main>

        <!-- FLOATING MOBILE HAMPER PREVIEW PILL (LG:HIDDEN) -->
        <aside 
          *ngIf="hamperItems.length > 0"
          aria-label="Hamper Composition Preview"
          class="fixed bottom-14 inset-x-3.5 z-30 lg:hidden shadow-2xl"
        >
          <div class="bg-[#57251C] text-white rounded-2xl p-3 shadow-xl border border-[#EB9D8E]/30 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-gift text-sm text-[#EB9D8E]"></i>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold truncate">Hamper: {{ totalItemsCount }} item(s)</p>
                <p class="text-[10px] text-[#D9C3B9]">Est: ₹{{ estimatedCatalogueSubtotal }} ({{ customItemsCount }} custom)</p>
              </div>
            </div>
            <button 
              type="button" 
              (click)="scrollToPreview()"
              class="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#C56D5B] hover:bg-[#9C4738] text-white text-xs font-bold shrink-0 transition cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>View Hamper</span>
              <i class="fa-solid fa-arrow-down text-[10px]"></i>
            </button>
          </div>
        </aside>

        <!-- SUCCESS CONFIRMATION MODAL -->
        <app-modal 
          [isOpen]="showSuccessModal" 
          title="Consultation Request Submitted" 
          size="md"
          (onClose)="showSuccessModal = false"
        >
          <div class="p-4 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl shadow-inner">
              <i class="fa-solid fa-gift"></i>
            </div>

            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-[#9C4738]">Reference Number</span>
              <h3 class="font-mono text-xl font-extrabold text-[#2E2825] dark:text-[#F4F1ED] mt-0.5">
                {{ createdRequestNo }}
              </h3>
            </div>

            <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
              Thank you! Our master artisans are reviewing your {{ selectedOccasion }} hamper selections and will prepare a personalized design &amp; pricing quotation.
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

  scrollToPreview() {
    if (typeof document !== 'undefined') {
      const el = document.getElementById('hamper-simulation-preview');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Occasions & Themes
  readonly occasions = [
    'Ganesh Utsav Special',
    'Diwali Festive',
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
      bgGradient: 'linear-gradient(135deg, rgba(254, 243, 199, 0.4) 0%, rgba(251, 191, 36, 0.15) 100%)',
      accentColor: '#D97706',
      borderColor: '#F59E0B',
      ribbonColor: '#9C4738'
    },
    {
      id: 'royal_velvet',
      name: 'Royal Velvet Plum',
      tagline: 'Deep luxurious jewel tones for momentous occasions',
      bgGradient: 'linear-gradient(135deg, rgba(243, 232, 255, 0.5) 0%, rgba(192, 132, 252, 0.2) 100%)',
      accentColor: '#7E22CE',
      borderColor: '#A855F7',
      ribbonColor: '#581C87'
    },
    {
      id: 'eco_kraft',
      name: 'Artisanal Eco-Kraft',
      tagline: 'Earthy textured kraft boxes with rustic botanical twine',
      bgGradient: 'linear-gradient(135deg, rgba(245, 238, 227, 0.6) 0%, rgba(217, 195, 185, 0.3) 100%)',
      accentColor: '#8B6E57',
      borderColor: '#B49B85',
      ribbonColor: '#4A3C31'
    }
  ];

  selectedOccasion = 'Ganesh Utsav Special';
  selectedTheme = this.themes[0];
  selectedRecipient = 'Unisex / Family';
  personalMessage = '';

  // Catalogue Item Search & Filtering
  catalogueSearchQuery = '';
  selectedCategoryFilter = 'All';
  readonly catalogueCategories = ['All', 'Ganpati Kits', 'Gourmet Treats', 'Luxury Keepsakes', 'Pooja Essentials'];
  allCatalogueProducts: HamperBuilderItem[] = [];

  // Custom Requested Item Form
  newCustomItemName = '';
  newCustomItemQuantity = 1;
  newCustomItemDesc = '';
  newCustomItemImageUrl = '';

  // Hamper Builder Tray Items
  hamperItems: HamperBuilderItem[] = [];

  // Customer Contact & Submission Details
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
      title: 'Build Your Own Hamper — Creative Gift Studio',
      description: 'Design a personalized gift hamper in real-time. Choose verified catalogue items, request custom items with reference photos, and submit for personal artisan quotation.'
    });

    // Pre-fill user profile if logged in
    const user = this.auth.currentUser;
    if (user) {
      this.customerName = user.name || '';
      this.customerEmail = user.email || '';
      this.customerPhone = user.phone_no || '';
    }

    await this.loadCatalogueItems();
  }

  async loadCatalogueItems() {
    try {
      const { data, error } = await this.supabase
        .from('products')
        .select('id, name, price, selling_price, images, category_id, description')
        .eq('is_active', true)
        .order('selling_price', { ascending: true });

      if (!error && data && data.length > 0) {
        this.allCatalogueProducts = data.map(p => ({
          uid: `cat-prod-${p.id}`,
          itemType: 'catalogue_product',
          productId: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.selling_price || p.price || 0),
          isPriceConfirmed: true,
          quantity: 1,
          imageUrl: p.images?.[0] || 'assets/logo.png',
          category: this.inferCategory(p.name)
        }));
      }
    } catch {
      // In offline/mock mode, provide staple products
      this.allCatalogueProducts = [
        {
          uid: 'cat-prod-1',
          itemType: 'catalogue_product',
          productId: 1,
          name: 'Ganpati Essential Pooja Kit (₹99)',
          price: 99,
          isPriceConfirmed: true,
          quantity: 1,
          imageUrl: 'assets/ganpati-pooja-kit-hamper-2026/99_hamper.png',
          category: 'Ganpati Kits'
        },
        {
          uid: 'cat-prod-2',
          itemType: 'catalogue_product',
          productId: 2,
          name: 'Ganpati Deluxe Pooja Kit & Dry Fruits Box (₹149)',
          price: 149,
          isPriceConfirmed: true,
          quantity: 1,
          imageUrl: 'assets/ganpati-pooja-kit-hamper-2026/149_hamper.png',
          category: 'Ganpati Kits'
        },
        {
          uid: 'cat-prod-3',
          itemType: 'catalogue_product',
          productId: 3,
          name: 'Ganpati Festive Celebration Hamper (₹199)',
          price: 199,
          isPriceConfirmed: true,
          quantity: 1,
          imageUrl: 'assets/ganpati-pooja-kit-hamper-2026/199_hamper.png',
          category: 'Ganpati Kits'
        }
      ];
    }
    this.cdr.markForCheck();
  }

  private inferCategory(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('ganpati') || lower.includes('pooja') || lower.includes('dhup')) return 'Ganpati Kits';
    if (lower.includes('kaju') || lower.includes('badam') || lower.includes('dry fruit') || lower.includes('chocolate')) return 'Gourmet Treats';
    if (lower.includes('diya') || lower.includes('kapoor') || lower.includes('vaat')) return 'Pooja Essentials';
    return 'Luxury Keepsakes';
  }

  get filteredCatalogueProducts(): HamperBuilderItem[] {
    return this.allCatalogueProducts.filter(item => {
      const matchesSearch = !this.catalogueSearchQuery.trim() || 
        item.name.toLowerCase().includes(this.catalogueSearchQuery.toLowerCase());
      const matchesCat = this.selectedCategoryFilter === 'All' || item.category === this.selectedCategoryFilter;
      return matchesSearch && matchesCat;
    });
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
    this.cdr.markForCheck();
  }

  increaseHamperQuantity(uid: string) {
    const item = this.hamperItems.find(i => i.uid === uid);
    if (item && item.quantity < 50) {
      item.quantity += 1;
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
      this.cdr.markForCheck();
    }
  }

  removeItemFromHamper(uid: string) {
    this.hamperItems = this.hamperItems.filter(i => i.uid !== uid);
    this.cdr.markForCheck();
  }

  clearAllItems() {
    this.hamperItems = [];
    this.cdr.markForCheck();
  }

  // Custom Item Handlers
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
      price: null, // Price not confirmed
      isPriceConfirmed: false,
      quantity: Math.max(1, Number(this.newCustomItemQuantity) || 1),
      imageUrl: this.newCustomItemImageUrl || 'assets/logo.png',
      category: 'Custom Item'
    };

    this.hamperItems.push(customItem);
    
    // Reset custom form
    this.newCustomItemName = '';
    this.newCustomItemQuantity = 1;
    this.newCustomItemDesc = '';
    this.newCustomItemImageUrl = '';
    this.cdr.markForCheck();
  }

  // Metrics
  get totalItemsCount(): number {
    return this.hamperItems.reduce((acc, i) => acc + i.quantity, 0);
  }

  get customItemsCount(): number {
    return this.hamperItems.filter(i => !i.isPriceConfirmed).reduce((acc, i) => acc + i.quantity, 0);
  }

  get estimatedCatalogueSubtotal(): number {
    return this.hamperItems.reduce((acc, i) => {
      if (i.isPriceConfirmed && typeof i.price === 'number') {
        return acc + (i.price * i.quantity);
      }
      return acc;
    }, 0);
  }

  // Submission Flow
  async submitConsultationRequest() {
    this.submitErrorMessage = '';

    if (this.hamperItems.length === 0) {
      this.submitErrorMessage = 'Please add at least one catalogue item or custom request to your hamper.';
      return;
    }

    if (!this.customerName.trim() || !this.customerEmail.trim() || !this.customerPhone.trim()) {
      this.submitErrorMessage = 'Please provide your full name, email, and phone number so our team can contact you.';
      return;
    }

    // Require sign-in if not authenticated
    if (!this.auth.isAuthenticated) {
      // Store current builder state and prompt user to login/register
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
        this.showSuccessModal = true;
        // Reset builder items
        this.hamperItems = [];
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
