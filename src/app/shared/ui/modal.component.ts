import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-[#4A3C31]/40 backdrop-blur-sm transition-opacity" 
        (click)="closeModal()"
      ></div>

      <!-- Modal Panel -->
      <div 
        class="relative bg-white dark:bg-[#2E2825] rounded-[2rem] shadow-2xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-[#EADFD2] dark:border-white/10"
        [ngClass]="{
          'max-w-md': size === 'sm',
          'max-w-lg': size === 'md',
          'max-w-3xl': size === 'lg',
          'max-w-5xl': size === 'xl',
          'max-w-full': size === 'full'
        }"
      >
        <!-- Header -->
        <div class="px-6 md:px-8 py-5 border-b border-[#EADFD2] dark:border-white/10 flex justify-between items-center bg-[#FDFBF7] dark:bg-[#251F1C] rounded-t-[2rem] shrink-0 z-10">
          <h2 class="text-xl font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED] tracking-wide">{{ title }}</h2>
          <button (click)="closeModal()" class="text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] hover:bg-[#EADFD2]/30 dark:hover:bg-white/10 rounded-full p-2 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-6 md:p-8 overflow-y-auto custom-scrollbar z-10 bg-white dark:bg-[#2E2825] text-[#4A3C31] dark:text-[#F4F1ED]">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        <div *ngIf="hasFooter" class="px-6 md:px-8 py-5 border-t border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C] flex justify-end gap-3 rounded-b-[2rem] shrink-0 z-10">
          <ng-content select="[modal-footer]"></ng-content>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Modal Title';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() hasFooter = true;
  
  @Output() onClose = new EventEmitter<void>();

  closeModal() {
    this.isOpen = false;
    this.onClose.emit();
  }
}
