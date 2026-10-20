import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ModalComponent } from './modal.component';
import { ImageProcessorService, ProcessedImageResult } from './image-processor.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent, ModalComponent],
  template: `
    <div class="w-full space-y-3">
      
      <!-- Existing / Current Live Image Card (When already present and not replaced yet) -->
      <div *ngIf="existingImageUrl && !previewUrl" 
           class="relative group rounded-2xl overflow-hidden border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-white/5 p-3 flex items-center justify-between gap-3 shadow-2xs">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-[#EADFD2] dark:border-white/10 shrink-0 flex items-center justify-center">
            <img [src]="existingImageUrl" alt="Current active image preview" class="w-full h-full object-cover">
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              <i class="fa-solid fa-circle-check mr-1"></i> Current Active Image
            </span>
            <p class="text-xs font-semibold text-[#4A3C31] dark:text-[#F4F1ED] truncate">
              {{ targetLabel || 'Entity Graphic' }}
            </p>
            <p class="text-[10px] text-[#A89F91]">Aspect Ratio: {{ aspectRatioLabel }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <label class="px-3 py-1.5 rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] transition shadow-2xs cursor-pointer flex items-center gap-1.5">
            <i class="fa-solid fa-camera text-xs text-[#9C4738]"></i>
            <span>Replace File</span>
            <input type="file" (change)="onFileSelected($event)" accept=".jpg,.jpeg,.png,image/jpeg,image/png" class="hidden">
          </label>
        </div>
      </div>

      <!-- File Drop & Picker Zone (Visible when no current image or when replacing) -->
      <div *ngIf="!existingImageUrl || showUploaderZone"
        class="border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center min-h-[140px] relative group border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-white/5 hover:border-[#9C4738] dark:hover:border-[#DD8776] hover:bg-[#F3E7DC]/30 dark:hover:bg-white/10 cursor-pointer"
        [ngClass]="isDragging ? 'border-[#9C4738] bg-[#9C4738]/10 ring-2 ring-[#9C4738]/20 scale-[1.01]' : ''"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input 
          type="file" 
          #fileInput 
          (change)="onFileSelected($event)" 
          accept=".jpg,.jpeg,.png,image/jpeg,image/png" 
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        >
        
        <div class="w-11 h-11 rounded-2xl bg-[#9C4738]/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
          <i class="fa-regular fa-image text-lg"></i>
        </div>

        <h4 class="text-xs sm:text-sm font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-0.5">
          Select {{ targetLabel || 'Image' }} File (Drag &amp; Drop)
        </h4>
        <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
          Strictly <strong>JPG, JPEG, or PNG</strong> • Max <strong>1 MB</strong> • Fixed <strong>{{ aspectRatioLabel }}</strong>
        </p>

        <!-- Inline Error Banner -->
        <div *ngIf="errorMessage" class="text-xs font-bold text-rose-600 dark:text-rose-400 mt-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 z-20">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Processed / Uploaded File Summary & Optimization Stats -->
      <div *ngIf="lastProcessedResult && !errorMessage" 
           class="p-4 bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl shadow-2xs space-y-3">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <!-- Thumbnail -->
            <div class="w-14 h-14 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-[#EADFD2] dark:border-white/10 shrink-0">
              <img [src]="lastProcessedResult.dataUrl" alt="Optimized processed image preview" class="w-full h-full object-cover">
            </div>
            
            <div class="min-w-0">
              <p class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] truncate">
                {{ lastProcessedResult.file.name }}
              </p>
              
              <!-- Compression Telemetry Badges -->
              <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {{ formatBytes(lastProcessedResult.optimizedSizeBytes) }}
                </span>
                
                <span *ngIf="lastProcessedResult.savedPercentage > 0" 
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {{ lastProcessedResult.savedPercentage }}% Saved
                </span>

                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-stone-300">
                  {{ lastProcessedResult.compressionType }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions: Recrop / Clear -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button type="button" (click)="openRecrop()" [disabled]="uploading"
                    class="px-3 py-1.5 text-xs font-bold text-[#9C4738] dark:text-[#DD8776] bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] rounded-xl transition cursor-pointer flex items-center gap-1.5">
              <i class="fa-solid fa-crop-simple text-xs"></i>
              <span>Recrop</span>
            </button>
            <button type="button" (click)="clearFile()" [disabled]="uploading"
                    class="p-2 text-stone-400 hover:text-rose-500 rounded-xl transition cursor-pointer"
                    title="Remove File">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>

        <!-- Uploading Indicator -->
        <div *ngIf="uploading" class="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2 font-bold animate-pulse">
          <span class="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"></span>
          <span>Uploading optimized image to Supabase storage...</span>
        </div>

        <!-- Uploaded Success URL -->
        <div *ngIf="uploadedUrl && !uploading" class="p-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between">
          <span class="flex items-center gap-1.5 truncate">
            <i class="fa-solid fa-circle-check text-emerald-600"></i>
            <span class="truncate">Saved: {{ uploadedUrl }}</span>
          </span>
        </div>
      </div>

      <!-- CROPPER MODAL (Triggered immediately on valid file selection) -->
      <app-modal 
        [isOpen]="showCropperModal" 
        [title]="'Crop ' + (targetLabel || 'Image') + ' (' + aspectRatioLabel + ')'" 
        size="lg"
        (onClose)="cancelCrop()"
      >
        <div class="space-y-3.5 py-1 text-xs">
          <div class="flex items-center justify-between text-[#7A6C5E] dark:text-[#C5A393] px-1 flex-wrap gap-2">
            <span>Drag the bounding box or use controls below to crop with fixed <strong>{{ aspectRatioLabel }}</strong> ratio:</span>
            
            <!-- Zoom Controls -->
            <div class="flex items-center gap-1.5 bg-[#FAF7F2] dark:bg-white/10 px-2 py-1 rounded-xl border border-[#EADFD2] dark:border-white/10">
              <button type="button" (click)="zoomOut()" class="w-6 h-6 flex items-center justify-center font-bold text-sm text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-black/10 rounded cursor-pointer" title="Zoom Out">-</button>
              <span class="text-[10px] font-bold px-1.5 text-[#9C4738]">{{ (currentScale * 100).toFixed(0) }}%</span>
              <button type="button" (click)="zoomIn()" class="w-6 h-6 flex items-center justify-center font-bold text-sm text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-black/10 rounded cursor-pointer" title="Zoom In">+</button>
              <button type="button" (click)="resetZoom()" class="text-[10px] font-bold text-[#7A6C5E] hover:underline ml-1 cursor-pointer">Reset</button>
            </div>
          </div>

          <!-- Cropper Canvas Container -->
          <div class="bg-black/90 rounded-2xl overflow-hidden min-h-[340px] max-h-[58vh] flex items-center justify-center p-3 relative border border-white/10">
            <image-cropper
              *ngIf="showCropperModal && activeFileForCropping"
              [imageFile]="activeFileForCropping"
              [maintainAspectRatio]="true"
              [aspectRatio]="aspectRatio"
              [transform]="{ scale: currentScale }"
              [roundCropper]="false"
              format="png"
              (imageCropped)="onImageCropped($event)"
              (imageLoaded)="onImageLoaded($event)"
              (loadImageFailed)="onLoadImageFailed()"
              class="max-h-[55vh] max-w-full"
            ></image-cropper>
          </div>

          <!-- Live Crop Optimization Preview Notice -->
          <div class="p-3 bg-stone-50 dark:bg-white/5 rounded-xl border border-[#EADFD2]/70 dark:border-white/10 flex items-center justify-between text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
            <span>Output will be optimized client-side to enforce strict <strong>&le; 1 MB</strong> limit without distortion.</span>
            <span class="font-bold text-[#4A3C31] dark:text-[#F4F1ED]">PNG Transparency Preserved</span>
          </div>
        </div>

        <div modal-footer class="w-full flex items-center justify-between gap-3">
          <button type="button" (click)="cancelCrop()" [disabled]="processing"
                  class="px-4 py-2 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] rounded-xl transition cursor-pointer">
            Cancel
          </button>

          <button type="button" (click)="applyCropAndOptimize()" [disabled]="processing || !temporaryCroppedBlob"
                  class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition disabled:opacity-50 flex items-center gap-2 cursor-pointer">
            <span *ngIf="processing" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ processing ? 'Optimizing & Compressing...' : 'Apply Crop & Optimize' }}</span>
          </button>
        </div>
      </app-modal>

    </div>
  `
})
export class FileUploadComponent {
  /** Fixed Aspect Ratio: 16/9 for banners, 1 for categories/products/items */
  @Input() aspectRatio: number = 1;
  @Input() targetLabel: string = 'Image';
  @Input() existingImageUrl?: string | null;
  @Input() bucket: string = 'images';
  @Input() autoUpload: boolean = true;

  @Output() fileUploaded = new EventEmitter<string>(); // Emits public storage URL
  @Output() fileReady = new EventEmitter<ProcessedImageResult>(); // Emits processed file
  @Output() removed = new EventEmitter<void>();

  private readonly processor = inject(ImageProcessorService);
  private readonly supabase = inject(SupabaseService);
  private readonly cdr = inject(ChangeDetectorRef);

  isDragging = false;
  showUploaderZone = false;
  showCropperModal = false;
  errorMessage = '';
  processing = false;
  uploading = false;

  activeFileForCropping: File | null = null;
  temporaryCroppedBlob: Blob | null = null;
  currentScale = 1;

  lastProcessedResult: ProcessedImageResult | null = null;
  uploadedUrl: string | null = null;
  previewUrl: string | null = null;

  get aspectRatioLabel(): string {
    if (Math.abs(this.aspectRatio - (16 / 9)) < 0.05) return '16:9 Banner';
    return '1:1 Square';
  }

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

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    this.errorMessage = '';

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleIncomingFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    this.errorMessage = '';
    const file = event.target.files?.[0];
    if (file) {
      this.handleIncomingFile(file);
    }
    event.target.value = '';
  }

  async handleIncomingFile(file: File) {
    this.errorMessage = '';
    this.cdr.markForCheck();

    // 1. Mandatory File Validation (JPG, JPEG, PNG only, <= 1MB, magic bytes)
    const validation = await this.processor.validateFile(file);
    if (!validation.isValid) {
      this.errorMessage = validation.errorMessage || 'Invalid file selected.';
      this.cdr.markForCheck();
      return;
    }

    // 2. Open Cropper Modal with fixed aspect ratio
    this.activeFileForCropping = file;
    this.temporaryCroppedBlob = null;
    this.currentScale = 1;
    this.showCropperModal = true;
    this.cdr.markForCheck();
  }

  onImageCropped(event: ImageCroppedEvent) {
    this.temporaryCroppedBlob = event.blob || null;
  }

  onImageLoaded(image: LoadedImage) {
    this.cdr.markForCheck();
  }

  onLoadImageFailed() {
    this.errorMessage = 'Failed to load image for cropping. Please ensure file is a valid JPG or PNG.';
    this.showCropperModal = false;
    this.cdr.markForCheck();
  }

  zoomIn() {
    this.currentScale = Math.min(this.currentScale + 0.1, 3);
  }

  zoomOut() {
    this.currentScale = Math.max(this.currentScale - 0.1, 0.5);
  }

  resetZoom() {
    this.currentScale = 1;
  }

  cancelCrop() {
    this.showCropperModal = false;
    this.activeFileForCropping = null;
    this.temporaryCroppedBlob = null;
  }

  openRecrop() {
    if (!this.activeFileForCropping && this.lastProcessedResult) {
      this.activeFileForCropping = this.lastProcessedResult.file;
    }
    if (this.activeFileForCropping) {
      this.currentScale = 1;
      this.showCropperModal = true;
    }
  }

  async applyCropAndOptimize() {
    if (!this.temporaryCroppedBlob || !this.activeFileForCropping) return;

    this.processing = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      // 3. Process, optimize, preserve transparency, and enforce <= 1MB
      const result = await this.processor.processAndOptimize(
        this.temporaryCroppedBlob,
        this.activeFileForCropping.name,
        this.aspectRatio,
        this.activeFileForCropping.size
      );

      this.lastProcessedResult = result;
      this.previewUrl = result.dataUrl;
      this.showCropperModal = false;
      this.fileReady.emit(result);

      // 4. Auto-upload to backend storage if requested
      if (this.autoUpload) {
        await this.uploadOptimizedFile(result.file);
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Compression error: could not meet the 1 MB limit.';
    } finally {
      this.processing = false;
      this.cdr.markForCheck();
    }
  }

  private async uploadOptimizedFile(file: File) {
    this.uploading = true;
    this.cdr.markForCheck();

    try {
      const { data, error } = await this.supabase.uploadFile(this.bucket, file.name, file);
      if (error) {
        this.errorMessage = error.message || 'Failed to upload image to storage.';
      } else if (data) {
        this.uploadedUrl = data;
        this.fileUploaded.emit(data);
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Storage upload failed.';
    } finally {
      this.uploading = false;
      this.cdr.markForCheck();
    }
  }

  clearFile() {
    this.lastProcessedResult = null;
    this.previewUrl = null;
    this.uploadedUrl = null;
    this.activeFileForCropping = null;
    this.temporaryCroppedBlob = null;
    this.showUploaderZone = true;
    this.removed.emit();
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}
