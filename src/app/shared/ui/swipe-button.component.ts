import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-swipe-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full select-none" [class.opacity-60]="disabled && !loading">
      
      <!-- Track Container -->
      <div
        #trackElement
        class="relative w-full h-14 sm:h-16 rounded-full overflow-hidden border transition-all duration-300 shadow-inner flex items-center"
        [ngClass]="{
          'bg-[#F3ECE4] dark:bg-[#201A16] border-[#D9C3B9] dark:border-white/10': !isConfirmed && !loading,
          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700': isConfirmed,
          'bg-[#FAF4ED] dark:bg-[#1C1613] border-[#9C4738]/50': loading,
          'cursor-not-allowed': disabled
        }"
      >
        <!-- Dynamic Progress Fill -->
        <div
          class="absolute left-0 top-0 bottom-0 transition-all pointer-events-none rounded-full"
          [style.width.px]="fillWidth"
          [style.transition]="isDragging ? 'none' : 'width 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)'"
          [ngClass]="{
            'bg-gradient-to-r from-[#57251C] to-[#9C4738] opacity-25 dark:opacity-35': !isConfirmed,
            'bg-emerald-600 opacity-90': isConfirmed
          }"
        ></div>

        <!-- Shimmering Centered Track Text -->
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none text-xs sm:text-sm font-bold tracking-wider uppercase transition-opacity duration-200 px-14 text-center"
          [style.opacity]="textOpacity"
        >
          <!-- Loading State -->
          <div *ngIf="loading" class="flex items-center gap-2 text-[#9C4738] dark:text-[#EB9D8E]">
            <i class="fa-solid fa-spinner fa-spin text-sm"></i>
            <span>{{ loadingText }}</span>
          </div>

          <!-- Confirmed State -->
          <div *ngIf="isConfirmed && !loading" class="flex items-center gap-2 text-white font-extrabold">
            <i class="fa-solid fa-check text-base"></i>
            <span>{{ confirmedText }}</span>
          </div>

          <!-- Ready / Normal State with Animated Arrows -->
          <div
            *ngIf="!loading && !isConfirmed"
            class="flex items-center gap-1.5 transition-colors"
            [ngClass]="disabled ? 'text-[#A89F91] dark:text-[#7A6C5E]' : 'text-[#57251C] dark:text-[#F4F1ED]'"
          >
            <span>{{ disabled ? disabledText : text }}</span>
            <span *ngIf="!disabled" class="inline-flex items-center text-xs text-[#9C4738] dark:text-[#EB9D8E] animate-pulse">
              <i class="fa-solid fa-angles-right text-[11px] ml-1"></i>
            </span>
          </div>
        </div>

        <!-- Draggable Knob -->
        <div
          #knobElement
          class="absolute top-1 bottom-1 w-12 sm:w-14 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md z-10 transition-transform select-none touch-none"
          [style.left.px]="currentX"
          [style.transition]="isDragging ? 'none' : 'left 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), background-color 0.2s'"
          [ngClass]="{
            'bg-gradient-to-br from-[#57251C] to-[#9C4738] hover:from-[#471E17] hover:to-[#883C2F] text-[#FFFDFC]': !isConfirmed && !disabled,
            'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed': disabled && !loading && !isConfirmed,
            'bg-emerald-600 text-white': isConfirmed,
            'bg-[#9C4738] text-white': loading
          }"
          (mousedown)="onMouseDown($event)"
          (touchstart)="onTouchStart($event)"
          role="slider"
          [attr.aria-valuemin]="0"
          [attr.aria-valuemax]="100"
          [attr.aria-valuenow]="Math.round(dragPercentage * 100)"
          [attr.aria-label]="text"
          tabindex="0"
          (keydown)="onKeyDown($event)"
        >
          <!-- Knob Icon -->
          <i *ngIf="loading" class="fa-solid fa-spinner fa-spin text-base"></i>
          <i *ngIf="isConfirmed && !loading" class="fa-solid fa-check text-lg"></i>
          <i *ngIf="!loading && !isConfirmed" class="fa-solid fa-arrow-right text-base transition-transform group-hover:translate-x-0.5"></i>
        </div>

      </div>

      <!-- Human Verification Notice / Guide Tag -->
      <div class="flex items-center justify-between text-[11px] mt-1.5 px-2 text-[#7A6C5E] dark:text-[#C5A393]">
        <span class="flex items-center gap-1">
          <i class="fa-solid fa-shield-check text-emerald-600 text-[10px]"></i>
          <span>Swipe to confirm order details</span>
        </span>
        <span *ngIf="!disabled && !isConfirmed" class="text-[10px] font-mono text-[#9C4738] dark:text-[#EB9D8E]">
          Drag knob fully to right ➔
        </span>
      </div>

    </div>
  `
})
export class SwipeButtonComponent {
  private cdr = inject(ChangeDetectorRef);

  @Input() text = 'Swipe to Place Order';
  @Input() disabledText = 'Fill details to unlock swipe';
  @Input() confirmedText = 'Order Confirmed! 🎉';
  @Input() loadingText = 'Securing Your Order...';
  @Input() disabled = false;
  @Input() loading = false;

  @Output() onSwipeComplete = new EventEmitter<void>();

  @ViewChild('trackElement') trackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('knobElement') knobRef!: ElementRef<HTMLDivElement>;

  public readonly Math = Math;

  currentX = 4;
  fillWidth = 24;
  isDragging = false;
  isConfirmed = false;
  dragPercentage = 0;
  startX = 0;

  get textOpacity(): number {
    if (this.loading || this.isConfirmed) return 1;
    return Math.max(0, 1 - this.dragPercentage * 1.5);
  }

  /* ------------------------------------------------------------------ */
  /* Touch event handlers                                               */
  /* ------------------------------------------------------------------ */
  onTouchStart(event: TouchEvent) {
    if (this.disabled || this.loading || this.isConfirmed) return;
    const touch = event.touches[0];
    this.startDrag(touch.clientX);
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    const touch = event.touches[0];
    this.updateDrag(touch.clientX);
  }

  @HostListener('window:touchend')
  @HostListener('window:touchcancel')
  onTouchEnd() {
    if (this.isDragging) {
      this.finishDrag();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Mouse event handlers                                               */
  /* ------------------------------------------------------------------ */
  onMouseDown(event: MouseEvent) {
    if (this.disabled || this.loading || this.isConfirmed) return;
    event.preventDefault();
    this.startDrag(event.clientX);
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.updateDrag(event.clientX);
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    if (this.isDragging) {
      this.finishDrag();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Keyboard Accessibility Fallback (Space / Enter / ArrowRight)       */
  /* ------------------------------------------------------------------ */
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled || this.loading || this.isConfirmed) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.triggerComplete();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Drag lifecycle logic                                               */
  /* ------------------------------------------------------------------ */
  private startDrag(clientX: number) {
    this.isDragging = true;
    this.startX = clientX - this.currentX;
  }

  private updateDrag(clientX: number) {
    if (!this.trackRef || !this.knobRef) return;
    const trackWidth = this.trackRef.nativeElement.offsetWidth;
    const knobWidth = this.knobRef.nativeElement.offsetWidth;
    const maxDistance = trackWidth - knobWidth - 8;

    const rawX = clientX - this.startX;
    this.currentX = Math.max(4, Math.min(maxDistance, rawX));
    this.dragPercentage = (this.currentX - 4) / (maxDistance - 4 || 1);
    this.fillWidth = this.currentX + knobWidth / 2;
    this.cdr.markForCheck();
  }

  private finishDrag() {
    this.isDragging = false;
    if (this.dragPercentage >= 0.85) {
      this.triggerComplete();
    } else {
      this.resetSlider();
    }
  }

  private triggerComplete() {
    if (!this.trackRef || !this.knobRef) return;
    const trackWidth = this.trackRef.nativeElement.offsetWidth;
    const knobWidth = this.knobRef.nativeElement.offsetWidth;
    const maxDistance = trackWidth - knobWidth - 4;

    this.currentX = maxDistance;
    this.fillWidth = trackWidth;
    this.isConfirmed = true;
    this.dragPercentage = 1;
    this.cdr.markForCheck();

    // Subtle vibration feedback if supported by device
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([20, 40, 20]);
      }
    } catch {
      // Non-blocking
    }

    this.onSwipeComplete.emit();
  }

  public reset() {
    this.isConfirmed = false;
    this.resetSlider();
  }

  private resetSlider() {
    this.currentX = 4;
    this.fillWidth = 24;
    this.dragPercentage = 0;
    this.cdr.markForCheck();
  }
}
