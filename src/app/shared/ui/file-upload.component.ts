import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCropperComponent, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ButtonComponent } from './button.component';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, ImageCropperComponent, ButtonComponent, ModalComponent],
  template: `
    <div class="w-full">
      <!-- Drag and drop zone -->
      <div 
        class="border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[150px] relative group"
        [ngClass]="isDragging ? 'border-[#DD8776] bg-[#DD8776]/10' : 'border-white/20 bg-white/5 hover:border-[#DD8776]/50 hover:bg-white/10'"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
      >
        <input 
          type="file" 
          #fileInput 
          (change)="fileChangeEvent($event)" 
          accept="image/png, image/jpeg, image/jpg" 
          class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        >
        
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white/30 mb-3 group-hover:text-[#DD8776] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h4 class="text-sm font-bold text-white/80 mb-1 group-hover:text-white transition-colors">Click or drag image to upload</h4>
        <p class="text-xs text-white/40">JPG, JPEG, PNG (Max {{ maxSizeMB }}MB)</p>
        <p *ngIf="errorMsg" class="text-xs font-bold text-rose-400 mt-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">{{ errorMsg }}</p>
      </div>

      <!-- Cropper Modal -->
      <app-modal 
        [isOpen]="showCropper" 
        [title]="'Crop Image (' + (aspectRatio === 1 ? '1:1 Square' : '16:9 Banner') + ')'" 
        size="lg"
        (onClose)="cancelCrop()"
      >
        <div class="bg-black/50 border border-white/5 rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center p-4">
          <image-cropper
            [imageChangedEvent]="imageChangedEvent"
            [maintainAspectRatio]="true"
            [aspectRatio]="aspectRatio"
            format="jpeg"
            (imageCropped)="imageCropped($event)"
            (imageLoaded)="imageLoaded($event)"
            (cropperReady)="cropperReady()"
            (loadImageFailed)="loadImageFailed()"
            class="max-h-[60vh]"
          ></image-cropper>
        </div>
        
        <div modal-footer class="w-full flex justify-end gap-3">
          <app-button variant="secondary" (onClick)="cancelCrop()">Cancel</app-button>
          <app-button variant="primary" (onClick)="saveCrop()">Apply Crop</app-button>
        </div>
      </app-modal>
    </div>
  `
})
export class FileUploadComponent {
  @Input() aspectRatio: number = 1; // 1 for product (1:1), 16/9 for banner
  @Input() maxSizeMB: number = 1;
  @Output() fileReady = new EventEmitter<File>(); // Emits the cropped file

  isDragging = false;
  showCropper = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  errorMsg = '';
  
  private currentFileName = 'image.jpg';

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
    this.errorMsg = '';

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  fileChangeEvent(event: any): void {
    this.errorMsg = '';
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
      this.imageChangedEvent = event; 
    }
    event.target.value = ''; // reset
  }

  private handleFile(file: File) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      this.errorMsg = 'Invalid file type. Only JPG/PNG allowed.';
      return;
    }

    if (file.size > this.maxSizeMB * 1024 * 1024) {
      this.errorMsg = `File is too large. Max size is ${this.maxSizeMB}MB.`;
      return;
    }

    this.currentFileName = file.name;
    
    if (!this.imageChangedEvent) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      this.imageChangedEvent = { target: { files: dataTransfer.files } };
    }
    
    this.showCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  imageLoaded(image: LoadedImage) {}
  cropperReady() {}
  
  loadImageFailed() {
    this.errorMsg = 'Failed to load image for cropping.';
    this.showCropper = false;
  }

  cancelCrop() {
    this.showCropper = false;
    this.imageChangedEvent = '';
    this.croppedImage = null;
  }

  saveCrop() {
    if (this.croppedImage) {
      const croppedFile = new File([this.croppedImage], this.currentFileName, {
        type: 'image/jpeg',
      });
      this.fileReady.emit(croppedFile);
    }
    this.showCropper = false;
    this.imageChangedEvent = '';
  }
}
