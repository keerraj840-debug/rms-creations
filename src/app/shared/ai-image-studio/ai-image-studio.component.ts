import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiImageStudioService, AiImageStudioContext, GeneratedImageCandidate } from './ai-image-studio.service';

export interface ColorPalettePreset {
  name: string;
  colors: string[];
}

@Component({
  selector: 'app-ai-image-studio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- MODAL BACKDROP -->
    <div *ngIf="isOpen" 
         class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in transition-all overflow-y-auto"
         (click)="onBackdropClick($event)">
      
      <div class="relative w-full max-w-5xl bg-[#FAF7F2] dark:bg-[#1A1614] rounded-3xl border border-[#EADFD2] dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
           (click)="$event.stopPropagation()">
        
        <!-- TOP STUDIO HEADER BAR -->
        <div class="px-6 py-4 bg-white/80 dark:bg-[#231C18]/80 border-b border-[#EADFD2] dark:border-white/10 flex items-center justify-between shrink-0 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9C4738] via-[#BA5E4E] to-[#DD8776] text-white flex items-center justify-center text-lg shadow-md shrink-0">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                  RMS AI Image Creation Studio
                </h2>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C56D5B]/15 text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/30">
                  {{ context.targetType | uppercase }} ASSET
                </span>
              </div>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] line-clamp-1">
                Synthesize high-resolution hamper photography & promotional graphics for <strong class="text-[#2E2825] dark:text-[#F4F1ED]">"{{ context.title || 'Asset' }}"</strong>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Close Button -->
            <button type="button" (click)="closeStudio()" 
                    class="w-9 h-9 rounded-full bg-stone-100 dark:bg-white/10 hover:bg-stone-200 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825] flex items-center justify-center transition cursor-pointer"
                    title="Close Studio">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
        </div>

        <!-- MAIN STUDIO BODY (SPLIT VIEW) -->
        <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- LEFT CONTROLS PANEL (5 COLS) -->
          <div class="lg:col-span-5 space-y-4">
            
            <!-- Current Originating Context Card -->
            <div class="p-3.5 rounded-2xl bg-white dark:bg-[#231C18] border border-[#EADFD2] dark:border-white/10 shadow-2xs space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider text-[10px]">Originating Screen Context</span>
                <span *ngIf="context.gender" class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-white/10 text-[#4A3C31] dark:text-[#F4F1ED]">
                  {{ context.gender }}
                </span>
              </div>
              <h3 class="text-sm font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ context.title }}</h3>
              <p *ngIf="context.description" class="text-xs text-[#7A6C5E] dark:text-[#C5A393] line-clamp-2">
                {{ context.description }}
              </p>
              <div *ngIf="context.fromDate || context.toDate" class="text-[10px] text-[#9C4738] font-bold">
                Campaign: {{ context.fromDate || 'Open' }} &rarr; {{ context.toDate || 'Open' }}
              </div>
            </div>

            <!-- 1. Theme Selector -->
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                Creative Theme & Mood
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" *ngFor="let th of themes" 
                        (click)="selectTheme(th.id)"
                        [class]="selectedTheme === th.id 
                          ? 'bg-[#9C4738] text-white font-bold shadow-xs border-[#9C4738]' 
                          : 'bg-white dark:bg-[#231C18] text-[#7A6C5E] dark:text-[#C5A393] border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738]'"
                        class="px-3 py-2 rounded-xl text-xs border text-left flex items-center gap-2 transition cursor-pointer">
                  <i [class]="'fa-solid ' + th.icon + ' text-xs shrink-0'"></i>
                  <span class="truncate">{{ th.label }}</span>
                </button>
              </div>
            </div>

            <!-- 2. Colour Palette Selector -->
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                Curated Colour Palette
              </label>
              <div class="space-y-1.5">
                <div *ngFor="let p of palettes" 
                     (click)="selectPalette(p)"
                     [class]="selectedPalette.name === p.name 
                       ? 'ring-2 ring-[#9C4738] bg-white dark:bg-[#231C18]' 
                       : 'bg-white/60 dark:bg-[#231C18]/60 hover:bg-white border-[#EADFD2] dark:border-white/10'"
                     class="p-2 rounded-xl border flex items-center justify-between cursor-pointer transition">
                  <span class="text-xs font-semibold text-[#4A3C31] dark:text-[#F4F1ED]">{{ p.name }}</span>
                  <div class="flex items-center gap-1">
                    <span *ngFor="let color of p.colors" [style.backgroundColor]="color" class="w-4 h-4 rounded-full border border-black/10 shadow-xs"></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Visual Photography Style -->
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                Visual Art Style
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button type="button" *ngFor="let st of styles" 
                        (click)="selectStyle(st)"
                        [class]="selectedStyle === st 
                          ? 'bg-[#57251C] text-white font-bold' 
                          : 'bg-white dark:bg-[#231C18] text-[#7A6C5E] dark:text-[#C5A393] border-[#EADFD2] dark:border-white/10'"
                        class="px-2.5 py-1.5 rounded-xl text-xs border text-center transition cursor-pointer">
                  {{ st }}
                </button>
              </div>
            </div>

            <!-- 4. Aspect Ratio & Format -->
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                Format & Aspect Ratio
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button type="button" (click)="selectedAspectRatio = '1:1'; regeneratePrompt()"
                        [class]="selectedAspectRatio === '1:1' ? 'bg-[#9C4738] text-white font-bold' : 'bg-white dark:bg-[#231C18] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10'"
                        class="py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <span class="w-4 h-4 rounded border-2 border-current"></span>
                  <span class="text-[10px]">1:1 Square</span>
                </button>
                <button type="button" (click)="selectedAspectRatio = '4:3'; regeneratePrompt()"
                        [class]="selectedAspectRatio === '4:3' ? 'bg-[#9C4738] text-white font-bold' : 'bg-white dark:bg-[#231C18] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10'"
                        class="py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <span class="w-5 h-4 rounded border-2 border-current"></span>
                  <span class="text-[10px]">4:3 Card</span>
                </button>
                <button type="button" (click)="selectedAspectRatio = '16:9'; regeneratePrompt()"
                        [class]="selectedAspectRatio === '16:9' ? 'bg-[#9C4738] text-white font-bold' : 'bg-white dark:bg-[#231C18] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10'"
                        class="py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center gap-1 cursor-pointer">
                  <span class="w-6 h-3 rounded border-2 border-current"></span>
                  <span class="text-[10px]">16:9 Banner</span>
                </button>
              </div>
            </div>

            <!-- Brand Identity Logo Option -->
            <div class="p-3 rounded-2xl bg-white dark:bg-[#231C18] border border-[#EADFD2] dark:border-white/10 flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <img src="assets/logo.png" alt="RMS Logo" class="w-7 h-7 rounded-full object-cover border border-[#D9C3B9]">
                <div>
                  <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">RMS Brand Seal</p>
                  <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">Incorporate official seal watermark</p>
                </div>
              </div>
              <input type="checkbox" [(ngModel)]="includeBrandLogo" class="w-4 h-4 accent-[#9C4738] cursor-pointer">
            </div>

          </div>

          <!-- RIGHT CANVAS & RESULTS PANEL (7 COLS) -->
          <div class="lg:col-span-7 space-y-4">
            
            <!-- Prompt Editor -->
            <div class="bg-white dark:bg-[#231C18] rounded-2xl p-4 border border-[#EADFD2] dark:border-white/10 space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
                  <i class="fa-solid fa-terminal text-[#9C4738]"></i>
                  <span>Assembled Creation Prompt</span>
                </label>
                <button type="button" (click)="regeneratePrompt()" 
                        class="text-[11px] font-bold text-[#9C4738] hover:underline cursor-pointer flex items-center gap-1">
                  <i class="fa-solid fa-arrows-rotate text-[10px]"></i>
                  <span>Rebuild Prompt</span>
                </button>
              </div>

              <textarea [(ngModel)]="activePrompt" rows="3"
                        class="w-full p-3 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1E1916] text-xs font-mono text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] resize-none leading-relaxed"></textarea>

              <div class="flex items-center justify-between pt-1">
                <span class="text-[10px] text-[#A89F91]">
                  Fine-tune wording before rendering your image variations.
                </span>

                <!-- Action Button -->
                <button type="button" (click)="generateImages()" [disabled]="isGenerating"
                        class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50">
                  <i class="fa-solid fa-sparkles text-xs" [class.animate-spin]="isGenerating"></i>
                  <span>{{ isGenerating ? 'Synthesizing...' : 'Generate Variations' }}</span>
                </button>
              </div>
            </div>

            <!-- Provider Status Alert -->
            <div class="px-3.5 py-2 bg-[#F3E7DC]/40 dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl flex items-center justify-between text-xs text-[#7A6C5E] dark:text-[#C5A393]">
              <span class="flex items-center gap-1.5 text-[11px]">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Studio Engine: <strong>RMS Procedural Synthesis &amp; Asset Renderer</strong></span>
              </span>
              <span class="text-[10px] text-[#A89F91]">No external API keys required</span>
            </div>

            <!-- Loading State -->
            <div *ngIf="isGenerating" class="py-16 text-center space-y-3 bg-white dark:bg-[#231C18] rounded-2xl border border-[#EADFD2] dark:border-white/10">
              <div class="w-12 h-12 rounded-full border-4 border-[#9C4738] border-t-transparent animate-spin mx-auto"></div>
              <p class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Rendering high-res artistic compositions...</p>
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Applying textures, luxury partitioned lighting, and brand seals</p>
            </div>

            <!-- Results Showcase & Comparison -->
            <div *ngIf="!isGenerating && candidates.length > 0" class="space-y-3">
              <div class="flex items-center justify-between text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                <span>Choose Preferred Variation ({{ candidates.length }} Generated):</span>
                <span class="text-[10px] text-[#A89F91]">Click image to select</span>
              </div>

              <!-- Variations Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div *ngFor="let c of candidates; let idx = index" 
                     (click)="selectedCandidate = c"
                     [class]="selectedCandidate?.id === c.id 
                       ? 'ring-4 ring-[#9C4738] shadow-lg border-[#9C4738]' 
                       : 'border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] shadow-sm'"
                     class="group relative bg-white dark:bg-[#231C18] rounded-2xl overflow-hidden border p-2 transition cursor-pointer flex flex-col justify-between">
                  
                  <div class="relative overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-900"
                       [ngClass]="c.aspectRatio === '16:9' ? 'aspect-video' : (c.aspectRatio === '4:3' ? 'aspect-4/3' : 'aspect-square')">
                    <img [src]="c.dataUrl" class="w-full h-full object-cover transition duration-300 group-hover:scale-102">
                    
                    <span class="absolute top-2 left-2 bg-black/75 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      Variation {{ idx + 1 }}
                    </span>

                    <span *ngIf="selectedCandidate?.id === c.id" 
                          class="absolute top-2 right-2 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md">
                      <i class="fa-solid fa-check"></i>
                    </span>
                  </div>

                  <div class="mt-2.5 flex items-center justify-between pt-1 text-[11px]">
                    <span class="font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Variation #{{ idx + 1 }}</span>
                    <button type="button" (click)="previewLightbox(c.dataUrl); $event.stopPropagation()" 
                            class="text-[10px] text-[#9C4738] font-bold hover:underline flex items-center gap-1">
                      <i class="fa-solid fa-magnifying-glass-plus"></i> <span>Inspect</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Apply / Save Action Bar -->
              <div *ngIf="selectedCandidate" 
                   class="p-4 rounded-2xl bg-white dark:bg-[#231C18] border border-[#EADFD2] dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
                <div>
                  <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">Selected Variation Ready</p>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Will be saved to Supabase storage and applied to this {{ context.targetType }}.</p>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                  <button type="button" (click)="closeStudio()" 
                          class="px-4 py-2 text-xs font-bold text-[#7A6C5E] hover:text-[#2E2825] rounded-xl transition cursor-pointer">
                    Cancel
                  </button>
                  <button type="button" (click)="confirmApplySelected()" [disabled]="isUploading"
                          class="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-check text-xs" [class.animate-spin]="isUploading"></i>
                    <span>{{ isUploading ? 'Uploading...' : 'Apply Image to ' + (context.targetType | titlecase) }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State before generation -->
            <div *ngIf="!isGenerating && candidates.length === 0" 
                 class="py-16 text-center rounded-2xl border-2 border-dashed border-[#EADFD2] dark:border-white/10 bg-white/40 dark:bg-white/5 space-y-2 p-6">
              <div class="w-12 h-12 rounded-2xl bg-[#9C4738]/10 text-[#9C4738] flex items-center justify-center text-xl mx-auto">
                <i class="fa-solid fa-palette"></i>
              </div>
              <h4 class="text-sm font-bold text-[#4A3C31] dark:text-[#F4F1ED]">No Variations Generated Yet</h4>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] max-w-sm mx-auto">
                Customize your theme, colors, and prompt on the left, then click <strong>"Generate Variations"</strong> to create bespoke images.
              </p>
            </div>

          </div>

        </div>

      </div>

      <!-- OVERWRITE CONFIRMATION MODAL -->
      <div *ngIf="showOverwriteModal" 
           class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
           (click)="$event.stopPropagation()">
        <div class="max-w-md w-full rounded-2xl bg-white dark:bg-[#231C18] p-5 shadow-2xl border border-[#EADFD2] dark:border-white/10 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shrink-0">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-[#2E2825] dark:text-[#F4F1ED]">Replace Existing Image?</h3>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">This {{ context.targetType }} already has an active photo.</p>
            </div>
          </div>
          <p class="text-xs text-[#4A3C31] dark:text-[#D9C3B9] leading-relaxed">
            Are you sure you want to replace the current photo with the newly generated AI asset? You can preview it on the form before saving.
          </p>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" (click)="showOverwriteModal = false" 
                    class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] hover:text-[#2E2825]">
              Keep Existing
            </button>
            <button type="button" (click)="finalizeApply()" 
                    class="px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold shadow">
              Yes, Replace
            </button>
          </div>
        </div>
      </div>

      <!-- LIGHTBOX PREVIEW MODAL -->
      <div *ngIf="lightboxUrl" 
           class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
           (click)="lightboxUrl = null">
        <div class="relative max-w-4xl max-h-[90vh] bg-transparent p-2" (click)="$event.stopPropagation()">
          <button (click)="lightboxUrl = null" class="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-black">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <img [src]="lightboxUrl" class="max-h-[85vh] w-auto mx-auto rounded-2xl shadow-2xl object-contain border border-white/20">
        </div>
      </div>

    </div>
  `
})
export class AiImageStudioComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() context: AiImageStudioContext = { targetType: 'product', title: '' };

  @Output() close = new EventEmitter<void>();
  @Output() applyImage = new EventEmitter<string>();

  private readonly studioService = inject(AiImageStudioService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Studio Settings
  themes = [
    { id: 'Festive & Auspicious', label: 'Festive & Ganpati', icon: 'fa-om' },
    { id: 'Luxury Gifting', label: 'Luxury Keepsake', icon: 'fa-crown' },
    { id: 'Birthday Celebrations', label: 'Birthday Special', icon: 'fa-cake-candles' },
    { id: 'Romantic & Anniversary', label: 'Romantic & Pastel', icon: 'fa-heart' },
    { id: 'Gourmet Chocolates', label: 'Gourmet Chocolates', icon: 'fa-cookie-bite' },
    { id: 'Minimalist & Modern', label: 'Minimalist & Clean', icon: 'fa-cube' }
  ];

  palettes: ColorPalettePreset[] = [
    { name: 'Rose & Burgundy (RMS Signature)', colors: ['#57251C', '#9C4738', '#EB9D8E'] },
    { name: 'Royal Gold & Ivory', colors: ['#D4AF37', '#FAF7F2', '#8C7853'] },
    { name: 'Festive Saffron & Marigold', colors: ['#E65100', '#FFB300', '#FFF3E0'] },
    { name: 'Pastel Charm & Blush', colors: ['#F8BBD0', '#E1BEE7', '#FFF9C4'] },
    { name: 'Midnight Navy & Silver', colors: ['#0D1B2A', '#415A77', '#E0E1DD'] },
    { name: 'Forest Green & Earth', colors: ['#1B4332', '#40916C', '#D8F3DC'] }
  ];

  styles = [
    'Premium Studio Product Photography',
    'Photorealistic Lifestyle Arrangement',
    'Editorial Gifting Magazine Spread',
    'Artistic Soft Watercolor'
  ];

  selectedTheme = 'Festive & Auspicious';
  selectedPalette = this.palettes[0];
  selectedStyle = 'Premium Studio Product Photography';
  selectedAspectRatio: '1:1' | '4:3' | '16:9' = '1:1';
  includeBrandLogo = true;

  activePrompt = '';
  isGenerating = false;
  isUploading = false;
  candidates: GeneratedImageCandidate[] = [];
  selectedCandidate: GeneratedImageCandidate | null = null;

  showOverwriteModal = false;
  lightboxUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['context'] || (changes['isOpen'] && this.isOpen)) {
      this.initStudioFromContext();
    }
  }

  private initStudioFromContext() {
    if (!this.context) return;

    // Smart default aspect ratio based on entity type
    if (this.context.targetType === 'banner') {
      this.selectedAspectRatio = '16:9';
    } else if (this.context.targetType === 'category') {
      this.selectedAspectRatio = '4:3';
    } else {
      this.selectedAspectRatio = '1:1';
    }

    // Smart theme mapping
    const titleLower = (this.context.title || '').toLowerCase();
    if (titleLower.includes('ganpati') || titleLower.includes('ganesh') || titleLower.includes('pooja') || titleLower.includes('festive') || titleLower.includes('diwali')) {
      this.selectedTheme = 'Festive & Auspicious';
      this.selectedPalette = this.palettes[2]; // Festive Saffron
    } else if (titleLower.includes('chocolate') || titleLower.includes('truffle')) {
      this.selectedTheme = 'Gourmet Chocolates';
      this.selectedPalette = this.palettes[0];
    } else if (titleLower.includes('girl') || titleLower.includes('friendship')) {
      this.selectedTheme = 'Romantic & Anniversary';
      this.selectedPalette = this.palettes[3]; // Pastel Charm
    } else if (titleLower.includes('boy') || titleLower.includes('urban') || titleLower.includes('executive')) {
      this.selectedTheme = 'Minimalist & Modern';
      this.selectedPalette = this.palettes[4]; // Midnight Navy
    } else {
      this.selectedTheme = 'Luxury Gifting';
      this.selectedPalette = this.palettes[0];
    }

    this.regeneratePrompt();
    this.candidates = [];
    this.selectedCandidate = null;
    this.cdr.markForCheck();
  }

  selectTheme(themeId: string) {
    this.selectedTheme = themeId;
    this.regeneratePrompt();
  }

  selectPalette(palette: ColorPalettePreset) {
    this.selectedPalette = palette;
    this.regeneratePrompt();
  }

  selectStyle(style: string) {
    this.selectedStyle = style;
    this.regeneratePrompt();
  }

  regeneratePrompt() {
    this.activePrompt = this.studioService.buildPrompt(
      this.context,
      this.selectedTheme,
      this.selectedPalette.name,
      this.selectedPalette.colors,
      this.selectedStyle,
      this.selectedAspectRatio
    );
  }

  async generateImages() {
    this.isGenerating = true;
    this.candidates = [];
    this.selectedCandidate = null;
    this.cdr.markForCheck();

    try {
      // Generate 2 contrasting variations side-by-side
      const [var1, var2] = await Promise.all([
        this.studioService.generateCandidate(
          this.activePrompt,
          this.context,
          this.selectedTheme,
          this.selectedPalette.colors,
          this.selectedAspectRatio,
          1,
          this.includeBrandLogo
        ),
        this.studioService.generateCandidate(
          this.activePrompt,
          this.context,
          this.selectedTheme,
          this.selectedPalette.colors,
          this.selectedAspectRatio,
          2,
          this.includeBrandLogo
        )
      ]);

      this.candidates = [var1, var2];
      this.selectedCandidate = var1;
    } catch (err) {
      console.error('Error generating images:', err);
    } finally {
      this.isGenerating = false;
      this.cdr.markForCheck();
    }
  }

  confirmApplySelected() {
    if (!this.selectedCandidate) return;

    // Check if existing image is present on entity
    if (this.context.existingImageUrl && this.context.existingImageUrl.trim().length > 0) {
      this.showOverwriteModal = true;
      return;
    }

    this.finalizeApply();
  }

  async finalizeApply() {
    this.showOverwriteModal = false;
    if (!this.selectedCandidate) return;

    this.isUploading = true;
    this.cdr.markForCheck();

    try {
      const publicUrl = await this.studioService.uploadGeneratedImage(
        this.selectedCandidate,
        this.context.title || 'asset'
      );
      this.applyImage.emit(publicUrl);
      this.closeStudio();
    } finally {
      this.isUploading = false;
      this.cdr.markForCheck();
    }
  }

  previewLightbox(url: string) {
    this.lightboxUrl = url;
  }

  closeStudio() {
    this.isOpen = false;
    this.showOverwriteModal = false;
    this.lightboxUrl = null;
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    this.closeStudio();
  }
}
