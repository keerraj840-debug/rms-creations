import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { AiImageStudioComponent } from '../shared/ai-image-studio/ai-image-studio.component';
import { AiImageStudioContext } from '../shared/ai-image-studio/ai-image-studio.service';
import { FileUploadComponent } from '../shared/ui/file-upload.component';

@Component({
  selector: 'app-admin-banner-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AiImageStudioComponent, FileUploadComponent],
  template: `
    <div class="max-w-7xl mx-auto pb-16 space-y-6 transition-colors duration-300">
      
      <!-- Top Sticky Action Bar -->
      <div class="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#FAF7F2]/95 dark:bg-[#1E1916]/95 backdrop-blur-md border-b border-[#EADFD2]/80 dark:border-white/10 flex items-center justify-between gap-4">
        
        <!-- Left: Back Button & Title -->
        <div class="flex items-center gap-3 min-w-0">
          <a 
            routerLink="/admin/banners" 
            class="p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] bg-white dark:bg-[#251F1C] rounded-xl border border-[#EADFD2] dark:border-white/10 transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Back to Banners Master"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>

          <div class="min-w-0">
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">
                {{ isEdit ? (banner.name || 'Edit Banner') : 'New Promotional Banner' }}
              </h1>

              <!-- Live / Draft Pill Toggle -->
              <button 
                type="button" 
                (click)="banner.is_active = !banner.is_active"
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                [ngClass]="banner.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'"
              >
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="banner.is_active ? 'bg-emerald-500' : 'bg-stone-400'"></span>
                <span>{{ banner.is_active ? 'Live on Store' : 'Draft / Hidden' }}</span>
              </button>
            </div>
            
            <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] truncate">
              {{ isEdit ? 'Update homepage slide headline, destination, and promotional banner graphic' : 'Create and publish a new promotional slide to highlight festival specials and hampers' }}
            </p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2.5 shrink-0">
          <a 
            routerLink="/admin/banners" 
            class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </a>

          <button 
            type="button" 
            (click)="saveBanner()" 
            [disabled]="saving || !banner.name.trim() || !banner.image.trim()"
            class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Banner') }}</span>
          </button>
        </div>

      </div>

      <!-- Feedback Alerts -->
      <div *ngIf="successMessage" class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-circle-check"></i>
          <span>{{ successMessage }}</span>
        </div>
        <button (click)="successMessage = ''" class="text-emerald-500 hover:text-emerald-700 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div *ngIf="errorMessage" class="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800/40 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>
        <button (click)="errorMessage = ''" class="text-rose-400 hover:text-rose-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Main Form Screen Layout (2 Columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Form Controls (7 Columns) -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Card: Banner Details -->
          <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-3">
              <h2 class="text-xs font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-2">
                <i class="fa-solid fa-sliders text-[#9C4738] dark:text-[#EB9D8E]"></i>
                <span>Banner Information</span>
              </h2>
            </div>

            <!-- Banner Headline / Title -->
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                Headline / Banner Name <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="banner.name" 
                placeholder="e.g. Ganesh Utsav Pooja Kits & Hampers" 
                class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none transition"
              />
              <p class="text-[10px] text-[#A89F91] mt-1">
                Appears as the prominent headline of this promotional slide on the store front.
              </p>
            </div>

            <!-- Banner Graphic Upload (Strictly File Selection, Cropped 16:9, <=1MB) -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                  Banner Graphic (16:9 Fixed Ratio) <span class="text-rose-500">*</span>
                </label>
                <!-- ✨ AI Studio Trigger Button -->
                <button type="button" (click)="openAiStudio()"
                        class="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white text-[11px] font-bold shadow-2xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer">
                  <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                  <span>AI Image Studio</span>
                </button>
              </div>

              <app-file-upload
                [aspectRatio]="16 / 9"
                targetLabel="Promotional Banner"
                bucket="banners"
                [existingImageUrl]="banner.image"
                (fileUploaded)="onBannerImageUploaded($event)"
              ></app-file-upload>
            </div>

            <!-- Destination URL On Click -->
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                Destination Link (On Click) <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                [(ngModel)]="banner.navigate_to_url_on_click" 
                placeholder="e.g. /shop or /shop?category=Ganpati Hampers & Pooja Kits" 
                class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none transition"
              />

              <!-- Quick Link Chips -->
              <div class="mt-2.5 flex flex-wrap items-center gap-2">
                <span class="text-[11px] font-semibold text-[#7A6C5E] dark:text-[#C5A393]">Store Links:</span>
                <button 
                  type="button" 
                  (click)="banner.navigate_to_url_on_click = '/shop'"
                  class="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 transition cursor-pointer"
                >
                  /shop
                </button>
                <button 
                  type="button" 
                  (click)="banner.navigate_to_url_on_click = '/shop?category=Ganpati Hampers & Pooja Kits'"
                  class="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 transition cursor-pointer"
                >
                  Ganpati Kits
                </button>
                <button 
                  type="button" 
                  (click)="banner.navigate_to_url_on_click = '/shop?category=Chocolate Hampers'"
                  class="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 transition cursor-pointer"
                >
                  Chocolates
                </button>
                <button 
                  type="button" 
                  (click)="banner.navigate_to_url_on_click = '/shop?category=Event Favours & Return Gifts'"
                  class="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 transition cursor-pointer"
                >
                  Return Gifts
                </button>
                <button 
                  type="button" 
                  (click)="banner.navigate_to_url_on_click = '/build-hamper'"
                  class="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 transition cursor-pointer"
                >
                  Build Hamper
                </button>
              </div>
            </div>

            <!-- Visibility Status Checkbox Switch -->
            <div class="pt-4 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center gap-3">
              <input 
                type="checkbox" 
                id="formIsActive" 
                [(ngModel)]="banner.is_active" 
                class="h-4 w-4 rounded border-[#EADFD2] text-[#9C4738] focus:ring-[#9C4738] cursor-pointer"
              />
              <label for="formIsActive" class="text-xs font-semibold text-[#4A3C31] dark:text-[#F4F1ED] cursor-pointer">
                Publish immediately on the homepage carousel (Active)
              </label>
            </div>

          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex items-center justify-between pt-2">
            <a 
              routerLink="/admin/banners" 
              class="px-5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs font-semibold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-white dark:hover:bg-white/5 transition cursor-pointer"
            >
              Back to Banners List
            </a>

            <button 
              type="button" 
              (click)="saveBanner()" 
              [disabled]="saving || !banner.name.trim() || !banner.image.trim()"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Banner') }}</span>
            </button>
          </div>

        </div>

        <!-- Right Column: Real-Time Live Preview (5 Columns) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-6 shadow-sm">
            
            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-3 flex items-center justify-between">
              <h2 class="text-xs font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-2">
                <i class="fa-solid fa-eye text-emerald-600"></i>
                <span>Customer Live Preview</span>
              </h2>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" [ngClass]="banner.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'">
                {{ banner.is_active ? 'Live' : 'Draft' }}
              </span>
            </div>

            <div class="mt-4 space-y-4">
              <!-- Live Slide Card Display -->
              <div class="overflow-hidden rounded-2xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1E1916] shadow-md">
                
                <div class="relative aspect-[16/10] w-full overflow-hidden bg-black/10">
                  <img 
                    [src]="banner.image" 
                    [alt]="banner.name || 'Banner Preview'"
                    (error)="onImageError($event)"
                    class="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  <div class="absolute bottom-4 left-4 right-4 text-white">
                    <span class="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md mb-1.5">
                      Promotional Spotlight
                    </span>
                    <h3 class="font-serif text-base sm:text-lg font-bold leading-snug drop-shadow-sm line-clamp-2">
                      {{ banner.name || 'Your Banner Headline Will Appear Here' }}
                    </h3>
                  </div>
                </div>

                <div class="p-4 bg-white dark:bg-[#251F1C] flex items-center justify-between text-xs">
                  <div>
                    <span class="text-[10px] text-[#A89F91] block">When customer clicks:</span>
                    <span class="font-mono text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E]">
                      {{ banner.navigate_to_url_on_click || '/shop' }}
                    </span>
                  </div>
                  <span class="rounded-full bg-[#9C4738] text-white px-3 py-1 text-[11px] font-bold">
                    View &rarr;
                  </span>
                </div>

              </div>

              <!-- Tip Box -->
              <div class="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#1C1917] border border-[#EADFD2]/60 dark:border-white/10 text-xs text-[#7A6C5E] dark:text-[#C5A393] space-y-2">
                <p class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-solid fa-lightbulb text-amber-500"></i>
                  <span>Banner Best Practices</span>
                </p>
                <p class="text-[11px] leading-relaxed">
                  Recommended image resolution is 1200x600 px (2:1 or 16:9 aspect ratio). High-contrast visuals with clear hamper photography perform best on mobile screens.
                </p>
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
export class AdminBannerFormPageComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isEdit = false;
  bannerId: number | null = null;
  saving = false;
  successMessage = '';
  errorMessage = '';

  banner = {
    name: '',
    image: 'assets/banners/banner.png',
    navigate_to_url_on_click: '/shop',
    is_active: true
  };

  // AI Image Studio state
  showAiStudio = false;
  aiStudioContext: AiImageStudioContext = { targetType: 'banner', title: '' };

  openAiStudio() {
    this.aiStudioContext = {
      targetType: 'banner',
      title: this.banner.name || 'Festive Promotional Spotlight',
      destinationUrl: this.banner.navigate_to_url_on_click || '/shop',
      existingImageUrl: this.banner.image || undefined
    };
    this.showAiStudio = true;
  }

  onAiImageApplied(imageUrl: string) {
    this.banner.image = imageUrl;
    this.successMessage = '✨ AI Promotional Banner applied! Click "Save Changes" to publish.';
    this.cdr.markForCheck();
  }

  onBannerImageUploaded(imageUrl: string) {
    this.banner.image = imageUrl;
    this.successMessage = 'Banner image uploaded and optimized successfully!';
    this.cdr.markForCheck();
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.bannerId = Number(idParam);
      this.fetchBannerDetails(this.bannerId);
    }
  }

  async fetchBannerDetails(id: number) {
    try {
      const { data, error } = await this.supabase
        .from('banner_images')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        this.banner = {
          name: data.name || '',
          image: data.image || '',
          navigate_to_url_on_click: data.navigate_to_url_on_click || '/shop',
          is_active: Boolean(data.is_active)
        };
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to load banner details.';
    } finally {
      this.cdr.markForCheck();
    }
  }

  async saveBanner() {
    if (!this.banner.name.trim() || !this.banner.image.trim()) {
      this.errorMessage = 'Please provide both headline and image path.';
      return;
    }

    try {
      this.saving = true;
      this.errorMessage = '';
      this.successMessage = '';

      const payload = {
        name: this.banner.name.trim(),
        image: this.banner.image.trim(),
        navigate_to_url_on_click: this.banner.navigate_to_url_on_click.trim() || '/shop',
        is_active: this.banner.is_active,
        updation_date: new Date().toISOString()
      };

      if (this.isEdit && this.bannerId) {
        const { error } = await this.supabase
          .from('banner_images')
          .update(payload)
          .eq('id', this.bannerId);

        if (error) throw error;
        this.successMessage = `Banner "${this.banner.name}" updated successfully!`;
      } else {
        const { error } = await this.supabase
          .from('banner_images')
          .insert({
            ...payload,
            creation_date: new Date().toISOString()
          });

        if (error) throw error;
        this.successMessage = `New banner "${this.banner.name}" created and published!`;
      }

      setTimeout(() => {
        this.router.navigate(['/admin/banners']);
      }, 700);
    } catch (err: any) {
      this.errorMessage = err?.message || 'Error saving banner to database.';
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/banners/banner.png';
  }
}
