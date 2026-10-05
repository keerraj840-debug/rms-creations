import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled || loading"
      (click)="onClick.emit($event)"
      class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs tracking-wide shadow-sm hover:-translate-y-0.5"
      [ngClass]="{
        'bg-[#4A3C31] text-[#FDFBF7] hover:bg-[#3B2F2F] hover:shadow-md': variant === 'primary',
        'bg-white text-[#4A3C31] hover:bg-[#FDFBF7] border border-[#EADFD2]': variant === 'secondary',
        'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200': variant === 'danger',
        'bg-transparent border-2 border-[#EADFD2] hover:border-[#4A3C31] text-[#4A3C31]': variant === 'outline',
        'w-full': fullWidth
      }"
    >
      <span *ngIf="loading" class="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"></span>
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'outline' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
