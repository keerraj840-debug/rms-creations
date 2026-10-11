import { Component, OnInit, HostListener, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { FileUploadComponent } from '../shared/ui/file-upload.component';
import { AiImageStudioComponent } from '../shared/ai-image-studio/ai-image-studio.component';
import { AiImageStudioContext } from '../shared/ai-image-studio/ai-image-studio.service';

@Component({
  selector: 'app-admin-category-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FileUploadComponent, AiImageStudioComponent],
  template: `
    <div class="max-w-7xl mx-auto pb-12 space-y-4 transition-colors duration-300">
      
      <!-- Top Sticky Header Bar (Exact match to Product Studio) -->
      <div class="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#FAF7F2]/95 dark:bg-[#1E1916]/95 backdrop-blur-md border-b border-[#EADFD2]/80 dark:border-white/10 flex items-center justify-between gap-4">
        
        <!-- Left: Back, Title & Live Status -->
        <div class="flex items-center gap-3 min-w-0">
          <a routerLink="/admin/categories" 
             class="p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] bg-white dark:bg-[#251F1C] rounded-xl border border-[#EADFD2] dark:border-white/10 transition-colors shadow-2xs shrink-0 cursor-pointer"
             title="Back to Categories List">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>

          <div class="min-w-0">
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">
                {{ isEdit ? (category.name || 'Edit Category') : 'New Category' }}
              </h1>

              <!-- Live Store Visibility Switch Pill -->
              <button type="button" (click)="category.is_active = !category.is_active"
                      class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                      [ngClass]="category.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="category.is_active ? 'bg-emerald-500' : 'bg-stone-400'"></span>
                <span>{{ category.is_active ? 'Live on Store' : 'Draft Mode' }}</span>
              </button>

              <!-- Live Readiness Tracker Pill -->
              <div class="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0"
                   [ngClass]="readinessScore.isReady ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="readinessScore.isReady ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                <span>{{ readinessScore.isReady ? 'All Essentials Filled' : (readinessScore.completed + ' of ' + readinessScore.total + ' fields filled') }}</span>
              </div>
            </div>
            
            <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] truncate">
              {{ isEdit ? 'Update collection banner, pricing tier, and festive duration' : 'Configure your category showcase, pricing baseline, and target audience' }}
            </p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2.5 shrink-0">
          <button type="button" routerLink="/admin/categories" 
                  class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] rounded-xl transition-colors cursor-pointer">
            Cancel
          </button>

          <!-- Save & Add Another Button -->
          <button *ngIf="!isEdit" type="button" (click)="saveCategory(true)" [disabled]="saving || uploadingImage"
                  class="px-3.5 py-2 text-xs font-bold text-[#9C4738] dark:text-[#DD8776] bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-2xs hover:bg-[#F3E7DC]/30 cursor-pointer">
            <i class="fa-solid fa-plus text-xs"></i>
            <span class="hidden sm:inline">Save & Add Another</span>
            <span class="sm:hidden">+ Another</span>
          </button>
          
          <!-- Primary Save / Publish Button -->
          <button type="button" (click)="saveCategory(false)" [disabled]="saving || uploadingImage"
                  class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  title="Keyboard Shortcut: ⌘+Enter">
            <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Category') }}</span>
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
          
          <!-- LEFT COLUMN: Category Title, Generous Description, Pricing, Audience & Dates (7 Cols) -->
          <div class="lg:col-span-7 space-y-4.5">
            
            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2 flex items-center justify-between">
              <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-folder-open text-[#9C4738]"></i>
                <span>Collection Information</span>
              </h2>
            </div>

            <!-- 1. Category Name -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Category Name <span class="text-rose-500">*</span>
                </label>
                <span class="text-[10px] text-[#A89F91]">
                  {{ (category.name?.length || 0) }} / 60
                </span>
              </div>
              
              <input type="text" [(ngModel)]="category.name" placeholder="e.g. Diwali Premium Hampers, Corporate Gifts..."
                     class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border rounded-xl px-4 py-2.5 text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all"
                     [ngClass]="submitted && errors['name'] ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20' : 'border-[#EADFD2] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]'">
              
              <p *ngIf="submitted && errors['name']" class="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                <i class="fa-solid fa-circle-exclamation"></i> <span>{{ errors['name'] }}</span>
              </p>
            </div>

            <!-- 2. PROPER GENEROUS DESCRIPTION BOX -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Collection Description
                </label>
                <span class="text-[10px] text-[#A89F91]">
                  {{ (category.description?.length || 0) }} / 300
                </span>
              </div>
              
              <textarea [(ngModel)]="category.description" rows="3" placeholder="Festive occasion notes, gifting themes, curation story, or recipient highlights..."
                        class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:outline-none focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] leading-relaxed resize-y"></textarea>
            </div>

            <!-- 3. PRICING & TARGET AUDIENCE GRID -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Starting Price -->
              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  Starting Price (₹)
                  <span class="text-[10px] font-normal text-[#A89F91]">(Optional base)</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-serif font-bold text-[#7A6C5E] dark:text-[#C5A393]">₹</span>
                  <input type="number" [(ngModel)]="category.price" placeholder="e.g. 499"
                         class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
                </div>
                <p class="text-[10px] text-[#A89F91] mt-1">Leave empty for bespoke / unpriced collections</p>
              </div>

              <!-- Target Recipient / Audience -->
              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  Target Recipient
                </label>
                <div class="grid grid-cols-5 gap-1">
                  <button type="button" *ngFor="let g of audienceOptions" (click)="category.gender = g.value"
                          [class]="category.gender === g.value ? 'bg-[#9C4738] text-white font-bold shadow-2xs ring-1 ring-[#9C4738]' : 'bg-[#FDFBF7] dark:bg-[#1C1917] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738]'"
                          class="py-2 px-1 rounded-xl text-xs transition-all flex flex-col items-center justify-center gap-1 text-center cursor-pointer">
                    <i [class]="g.iconClass + ' text-xs'"></i>
                    <span class="text-[9px] font-medium leading-tight truncate w-full">{{ g.label }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 4. ACTIVE AVAILABILITY WINDOW WITH PRESETS -->
            <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-regular fa-calendar-days text-[#9C4738]"></i>
                  <span> Availability Window</span>
                </label>
                <span class="text-[10px] font-bold text-[#9C4738] dark:text-[#DD8776]">
                  {{ dateWindowSummary }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1 uppercase tracking-wider">From Date</label>
                  <input type="date" [(ngModel)]="category.from_date"
                         class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]">
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1 uppercase tracking-wider">To Date</label>
                  <input type="date" [(ngModel)]="category.to_date"
                         class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]">
                </div>
              </div>

              <!-- Quick Date Presets -->
              <div class="flex items-center gap-1.5 flex-wrap pt-1">
                <span class="text-[10px] font-bold text-[#A89F91]">Quick Set:</span>
                <button type="button" (click)="setPresetDays(7)" class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#7A6C5E] dark:text-[#C5A393] cursor-pointer">
                  Next 7 Days
                </button>
                <button type="button" (click)="setPresetDays(15)" class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#7A6C5E] dark:text-[#C5A393] cursor-pointer">
                  Next 15 Days
                </button>
                <button type="button" (click)="setPresetDays(30)" class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#7A6C5E] dark:text-[#C5A393] cursor-pointer">
                  Next 30 Days
                </button>
                <button *ngIf="category.from_date || category.to_date" type="button" (click)="clearDates()" class="px-2 py-0.5 rounded-lg text-[10px] font-bold text-rose-500 hover:bg-rose-50 cursor-pointer">
                  Clear Dates
                </button>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: Cover Media, Interactive Preview Card, & Live Readiness (5 Cols) -->
          <div class="lg:col-span-5 space-y-5">
            
            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-2 flex items-center justify-between">
              <h2 class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider flex items-center gap-2">
                <i class="fa-regular fa-image text-[#9C4738]"></i>
                <span>Cover Media & Showcase</span>
              </h2>

              <!-- ✨ AI Image Studio Trigger Button -->
              <button type="button" (click)="openAiStudio()"
                      class="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white text-[11px] font-bold shadow-2xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                <span>AI Studio</span>
              </button>
            </div>

            <!-- Category Cover Image Upload (Strictly file selection, 1:1, <=1MB) -->
            <div>
              <app-file-upload 
                [aspectRatio]="1" 
                targetLabel="Category Cover"
                bucket="images"
                [existingImageUrl]="category.image"
                (fileUploaded)="onCategoryCoverUploaded($event)"
              ></app-file-upload>
            </div>

            <!-- LIVE INTERACTIVE STORE PREVIEW CARD (WYSIWYG) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-solid fa-eye text-[#9C4738]"></i>
                  <span>Live Storefront Preview</span>
                </span>
                <span class="text-[10px] text-[#A89F91]">What shoppers see</span>
              </div>

              <div class="border border-[#EADFD2] dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#1E1916] shadow-sm">
                <!-- Cover Image or Placeholder -->
                <div class="relative h-44 bg-gradient-to-br from-[#F3E7DC] to-[#EADFD2] flex items-center justify-center overflow-hidden">
                  <img *ngIf="category.image" [src]="category.image" class="w-full h-full object-cover">
                  <div *ngIf="!category.image" class="flex flex-col items-center justify-center text-[#7A6C5E] gap-1 p-4 text-center">
                    <i class="fa-regular fa-image text-2xl text-[#BA5E4E]"></i>
                    <span class="text-xs font-bold">No cover uploaded yet</span>
                    <span class="text-[10px] text-[#A89F91]">Upload square photo above</span>
                  </div>

                  <!-- Overlay Badges -->
                  <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs flex items-center gap-1"
                          [ngClass]="category.is_active ? 'bg-emerald-500 text-white' : 'bg-stone-800 text-stone-200'">
                      <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span>{{ category.is_active ? 'Active' : 'Draft' }}</span>
                    </span>

                    <span *ngIf="category.gender && category.gender !== 'unisex'" 
                          class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-[#4A3C31] backdrop-blur-xs shadow-xs">
                      {{ getAudienceLabel(category.gender) }}
                    </span>
                  </div>

                  <!-- Date badge -->
                  <div *ngIf="category.from_date || category.to_date" class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                    <i class="fa-regular fa-calendar-days text-[9px]"></i>
                    <span>{{ dateWindowSummary }}</span>
                  </div>

                  <!-- Remove image button -->
                  <button *ngIf="category.image" type="button" (click)="category.image = ''" 
                          class="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white text-xs cursor-pointer"
                          title="Remove cover photo">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>

                <!-- Card Body -->
                <div class="p-3.5 space-y-1.5">
                  <div class="flex items-start justify-between gap-2">
                    <h3 class="font-serif font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED] truncate">
                      {{ category.name || 'Untitled Category' }}
                    </h3>
                    <span *ngIf="category.price" class="text-xs font-serif font-bold text-[#9C4738] dark:text-[#DD8776] shrink-0">
                      From ₹{{ category.price }}
                    </span>
                  </div>

                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-2 leading-relaxed">
                    {{ category.description || 'No description entered yet. Add festive theme details.' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Readiness Checklist -->
            <div class="p-3.5 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2]/70 dark:border-white/10 rounded-2xl text-xs space-y-2">
              <span class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                <i class="fa-solid fa-list-check text-[#9C4738]"></i>
                <span>Launch Readiness</span>
              </span>
              <div class="space-y-1 text-[11px]">
                <div class="flex items-center gap-2" [ngClass]="category.name?.trim() ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#A89F91]'">
                  <i [class]="category.name?.trim() ? 'fa-solid fa-circle-check text-xs' : 'fa-regular fa-circle text-xs'"></i>
                  <span>Category Name specified</span>
                </div>
                <div class="flex items-center gap-2" [ngClass]="category.image ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#A89F91]'">
                  <i [class]="category.image ? 'fa-solid fa-circle-check text-xs' : 'fa-regular fa-circle text-xs'"></i>
                  <span>Cover banner photo uploaded</span>
                </div>
                <div class="flex items-center gap-2" [ngClass]="category.description?.trim() ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#A89F91]'">
                  <i [class]="category.description?.trim() ? 'fa-solid fa-circle-check text-xs' : 'fa-regular fa-circle text-xs'"></i>
                  <span>Collection description written</span>
                </div>
                <div class="flex items-center gap-2" [ngClass]="category.price ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-[#A89F91]'">
                  <i [class]="category.price ? 'fa-solid fa-circle-check text-xs' : 'fa-regular fa-circle text-xs'"></i>
                  <span>Base starting price set</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- AI Image Creation Studio Modal -->
      <app-ai-image-studio
        [isOpen]="showAiStudio"
        [context]="aiStudioContext"
        (close)="showAiStudio = false"
        (applyImage)="onAiImageApplied($event)"
      ></app-ai-image-studio>

    </div>
  `
})
export class AdminCategoryFormPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  isEdit = false;
  saving = false;
  uploadingImage = false;
  errorMessage = '';
  successMessage = '';
  submitted = false;
  errors: Record<string, string> = {};

  category: any = {
    name: '',
    description: '',
    price: null,
    gender: 'unisex',
    from_date: null,
    to_date: null,
    image: '',
    is_active: true
  };

  // AI Image Studio state
  showAiStudio = false;
  aiStudioContext: AiImageStudioContext = { targetType: 'category', title: '' };

  audienceOptions = [
    { value: 'unisex', label: 'All', iconClass: 'fa-solid fa-gift' },
    { value: 'girls', label: 'For Her', iconClass: 'fa-solid fa-venus' },
    { value: 'boys', label: 'For Him', iconClass: 'fa-solid fa-mars' },
    { value: 'kids', label: 'Kids', iconClass: 'fa-solid fa-child' },
    { value: 'festive', label: 'Festive', iconClass: 'fa-solid fa-wand-magic-sparkles' }
  ];

  openAiStudio() {
    this.aiStudioContext = {
      targetType: 'category',
      title: this.category.name || 'Category Collection',
      description: this.category.description || '',
      gender: this.category.gender || undefined,
      fromDate: this.category.from_date || undefined,
      toDate: this.category.to_date || undefined,
      existingImageUrl: this.category.image || undefined
    };
    this.showAiStudio = true;
  }

  onAiImageApplied(imageUrl: string) {
    this.category.image = imageUrl;
    this.successMessage = '✨ AI Cover Image applied successfully! Click "Save Changes" to publish.';
    this.cdr.markForCheck();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      this.saveCategory(false);
    }
    if (event.key === 'Escape' && !this.saving) {
      this.router.navigate(['/admin/categories']);
    }
  }

  get readinessScore(): { completed: number; total: number; isReady: boolean } {
    const checks = [
      Boolean(this.category.name?.trim()),
      Boolean(this.category.image),
      Boolean(this.category.description?.trim())
    ];
    const completed = checks.filter(Boolean).length;
    return {
      completed,
      total: checks.length,
      isReady: Boolean(this.category.name?.trim())
    };
  }

  get dateWindowSummary(): string {
    if (!this.category.from_date && !this.category.to_date) {
      return 'Year-round Collection';
    }
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    if (this.category.from_date && this.category.to_date) {
      const f = new Date(this.category.from_date).toLocaleDateString('en-IN', opts);
      const t = new Date(this.category.to_date).toLocaleDateString('en-IN', opts);
      return `${f} to ${t}`;
    }
    if (this.category.from_date) {
      return `From ${new Date(this.category.from_date).toLocaleDateString('en-IN', opts)}`;
    }
    return `Until ${new Date(this.category.to_date).toLocaleDateString('en-IN', opts)}`;
  }

  getAudienceLabel(val: string): string {
    const opt = this.audienceOptions.find(o => o.value === val);
    return opt ? opt.label : 'All';
  }

  setPresetDays(days: number) {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);
    this.category.from_date = now.toISOString().split('T')[0];
    this.category.to_date = future.toISOString().split('T')[0];
    this.cdr.markForCheck();
  }

  clearDates() {
    this.category.from_date = null;
    this.category.to_date = null;
    this.cdr.markForCheck();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadCategory(id);
    }
  }

  async loadCategory(id: string) {
    try {
      const { data, error } = await this.supabase.from('categories').select('*').eq('id', id).single();
      if (data) {
        this.category = {
          ...data,
          gender: data.gender || 'unisex',
          price: data.price != null ? Number(data.price) : null
        };
      } else {
        this.errorMessage = error?.message || 'Category not found.';
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to load category.';
    } finally {
      this.cdr.markForCheck();
    }
  }

  onCategoryCoverUploaded(imageUrl: string) {
    this.category.image = imageUrl;
    this.successMessage = 'Category cover photo cropped, optimized, and saved!';
    this.cdr.markForCheck();
  }

  async saveCategory(addAnother: boolean = false) {
    this.submitted = true;
    this.errors = {};

    if (!this.category.name?.trim()) {
      this.errors['name'] = 'Please enter a category name.';
      this.cdr.markForCheck();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.markForCheck();

    try {
      const payload: any = {
        name: this.category.name.trim(),
        description: this.category.description?.trim() || null,
        price: this.category.price != null && !isNaN(this.category.price) ? Number(this.category.price) : null,
        gender: this.category.gender || 'unisex',
        from_date: this.category.from_date || null,
        to_date: this.category.to_date || null,
        image: this.category.image || null,
        is_active: Boolean(this.category.is_active)
      };

      let error;
      if (this.isEdit) {
        const res = await this.supabase.from('categories').update(payload).eq('id', this.category.id);
        error = res.error;
      } else {
        const res = await this.supabase.from('categories').insert(payload);
        error = res.error;
      }

      if (error) {
        this.errorMessage = error.message;
        this.saving = false;
        this.cdr.markForCheck();
      } else {
        if (addAnother) {
          this.successMessage = `Saved "${this.category.name}"! Ready for next category.`;
          this.category = {
            name: '',
            description: '',
            price: null,
            gender: 'unisex',
            from_date: null,
            to_date: null,
            image: '',
            is_active: true
          };
          this.submitted = false;
          this.saving = false;
          this.cdr.markForCheck();
        } else {
          this.router.navigate(['/admin/categories']);
        }
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to save category.';
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
}
