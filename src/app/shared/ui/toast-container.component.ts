import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService, ToastItem } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- SCREEN MANAGED TOAST CONTAINER -->
    <div
      *ngIf="toastService.toasts().length > 0"
      aria-live="polite"
      aria-atomic="true"
      role="region"
      aria-label="Notifications"
      class="fixed z-50 pointer-events-none transition-all duration-300 flex flex-col items-center gap-2.5"
      [ngClass]="{
        'bottom-20 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md': !hideBottomNav,
        'bottom-5 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md': hideBottomNav
      }"
    >
      <div
        *ngFor="let toast of toastService.toasts(); trackBy: trackById"
        (mouseenter)="pauseTimer(toast.id)"
        (mouseleave)="resumeTimer(toast.id)"
        (touchstart)="pauseTimer(toast.id)"
        (touchend)="resumeTimer(toast.id)"
        class="toast-card pointer-events-auto relative w-full overflow-hidden rounded-2xl bg-[#281512]/95 dark:bg-[#1C1512]/95 text-white backdrop-blur-xl border border-[#EB9D8E]/35 shadow-2xl shadow-black/40 ring-1 ring-white/10 transition-all duration-300"
        [ngClass]="{
          'toast-exit': toast.isExiting,
          'toast-enter': !toast.isExiting
        }"
      >
        <!-- TOAST BODY -->
        <div class="flex items-center gap-3 p-3 sm:p-3.5">
          <!-- Thumbnail Image (For Products/Cart Items) OR Styled Icon -->
          <div class="shrink-0 relative">
            <ng-container *ngIf="toast.image; else iconOnly">
              <img
                [src]="toast.image"
                [alt]="toast.title"
                class="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/20 shadow-md bg-black/30"
              />
              <span
                *ngIf="toast.type === 'cart'"
                class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#C56D5B] text-white flex items-center justify-center text-[9px] shadow ring-1 ring-[#281512]"
                title="Cart Item"
              >
                <i class="fa-solid fa-bag-shopping"></i>
              </span>
            </ng-container>

            <!-- Fallback Category/Type Icon -->
            <ng-template #iconOnly>
              <div
                class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-sm shadow-md"
                [ngClass]="{
                  'bg-gradient-to-br from-[#9C4738] to-[#C56D5B] text-white': toast.type === 'cart',
                  'bg-gradient-to-br from-emerald-600 to-teal-500 text-white': toast.type === 'success',
                  'bg-gradient-to-br from-blue-600 to-indigo-500 text-white': toast.type === 'info',
                  'bg-gradient-to-br from-amber-600 to-orange-500 text-white': toast.type === 'warning',
                  'bg-gradient-to-br from-rose-600 to-red-500 text-white': toast.type === 'error'
                }"
              >
                <i *ngIf="toast.type === 'cart'" class="fa-solid fa-bag-shopping"></i>
                <i *ngIf="toast.type === 'success'" class="fa-solid fa-circle-check"></i>
                <i *ngIf="toast.type === 'info'" class="fa-solid fa-circle-info"></i>
                <i *ngIf="toast.type === 'warning'" class="fa-solid fa-triangle-exclamation"></i>
                <i *ngIf="toast.type === 'error'" class="fa-solid fa-circle-exmark"></i>
              </div>
            </ng-template>
          </div>

          <!-- Message & Title Details -->
          <div class="flex-1 min-w-0 pr-1">
            <div class="flex items-center gap-1.5 leading-none mb-1">
              <span
                class="w-1.5 h-1.5 rounded-full"
                [ngClass]="{
                  'bg-[#EB9D8E] animate-pulse': toast.type === 'cart',
                  'bg-emerald-400 animate-pulse': toast.type === 'success',
                  'bg-blue-400': toast.type === 'info',
                  'bg-amber-400': toast.type === 'warning',
                  'bg-rose-400': toast.type === 'error'
                }"
              ></span>
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-[#EB9D8E] truncate">
                {{ toast.title }}
              </span>
            </div>

            <p class="text-xs sm:text-sm font-semibold text-[#FFFDFC] truncate leading-tight">
              {{ toast.message }}
            </p>

            <div *ngIf="toast.price" class="flex items-center gap-2 mt-0.5 text-[11px] text-[#D9C3B9] font-mono">
              <span>₹{{ toast.price }}</span>
              <span *ngIf="toast.quantity && toast.quantity > 1" class="text-white/70">
                • Qty: {{ toast.quantity }}
              </span>
            </div>
          </div>

          <!-- Action Button (e.g., View Bag) -->
          <div *ngIf="toast.action" class="shrink-0">
            <a
              *ngIf="toast.action.route"
              [routerLink]="toast.action.route"
              (click)="onActionClick(toast)"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#C56D5B] to-[#9C4738] hover:from-[#DD8776] hover:to-[#C56D5B] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>{{ toast.action.label }}</span>
            </a>

            <button
              *ngIf="!toast.action.route && toast.action.onClick"
              type="button"
              (click)="onActionClick(toast)"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#C56D5B] to-[#9C4738] hover:from-[#DD8776] hover:to-[#C56D5B] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span>{{ toast.action.label }}</span>
            </button>
          </div>

          <!-- Dismiss (Close) Button -->
          <button
            type="button"
            (click)="dismiss(toast.id)"
            class="shrink-0 w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition active:scale-90 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <!-- AMBIENT COUNTDOWN PROGRESS LINE -->
        <div class="h-[2.5px] w-full bg-white/10 overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-[#EB9D8E] via-[#DD8776] to-[#C56D5B] transition-[width] duration-100 ease-linear"
            [style.width.%]="getProgress(toast.id)"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-card {
      will-change: transform, opacity;
    }

    .toast-enter {
      animation: toastSpringIn 0.34s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .toast-exit {
      animation: toastSpringOut 0.26s cubic-bezier(0.4, 0, 1, 1) forwards;
    }

    @keyframes toastSpringIn {
      0% {
        opacity: 0;
        transform: translateY(22px) scale(0.92);
      }
      65% {
        opacity: 1;
        transform: translateY(-3px) scale(1.015);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes toastSpringOut {
      0% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translateY(14px) scale(0.95);
      }
    }
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  @Input() hideBottomNav = false;

  public readonly toastService = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private readonly toastRemainingMap = new Map<string, number>();
  private readonly pausedToasts = new Set<string>();

  ngOnInit() {
    // 50ms interval drives smooth progress bar countdown and auto-dismissal
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 50);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.toastRemainingMap.clear();
    this.pausedToasts.clear();
  }

  trackById(_index: number, item: ToastItem): string {
    return item.id;
  }

  private tick() {
    const toasts = this.toastService.toasts();
    if (toasts.length === 0) {
      if (this.toastRemainingMap.size > 0) {
        this.toastRemainingMap.clear();
      }
      return;
    }

    let hasChanges = false;
    for (const toast of toasts) {
      if (toast.isExiting) continue;

      if (!this.toastRemainingMap.has(toast.id)) {
        this.toastRemainingMap.set(toast.id, toast.duration);
        hasChanges = true;
      }

      if (!this.pausedToasts.has(toast.id)) {
        const remaining = (this.toastRemainingMap.get(toast.id) || toast.duration) - 50;
        this.toastRemainingMap.set(toast.id, Math.max(0, remaining));
        hasChanges = true;

        if (remaining <= 0) {
          this.toastService.dismiss(toast.id);
        }
      }
    }

    // Clean up IDs no longer in service
    const activeIds = new Set(toasts.map(t => t.id));
    for (const id of this.toastRemainingMap.keys()) {
      if (!activeIds.has(id)) {
        this.toastRemainingMap.delete(id);
        this.pausedToasts.delete(id);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      this.cdr.markForCheck();
    }
  }

  getProgress(id: string): number {
    const toast = this.toastService.toasts().find(t => t.id === id);
    if (!toast) return 0;
    const remaining = this.toastRemainingMap.get(id) ?? toast.duration;
    return Math.max(0, Math.min(100, (remaining / toast.duration) * 100));
  }

  pauseTimer(id: string) {
    this.pausedToasts.add(id);
    this.cdr.markForCheck();
  }

  resumeTimer(id: string) {
    this.pausedToasts.delete(id);
    this.cdr.markForCheck();
  }

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }

  onActionClick(toast: ToastItem) {
    if (toast.action?.onClick) {
      toast.action.onClick();
    }
    this.dismiss(toast.id);
  }
}
