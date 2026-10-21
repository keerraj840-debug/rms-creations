import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from './modal.component';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      title="Confirm Sign Out"
      size="sm"
      [hasFooter]="true"
      (onClose)="cancelLogout()"
    >
      <div class="py-2 space-y-4">
        <div class="flex items-start gap-3.5">
          <div class="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200/60 dark:border-rose-900/40 shadow-xs">
            <i class="fa-solid fa-right-from-bracket text-base"></i>
          </div>
          <div class="space-y-1.5 min-w-0">
            <h3 class="text-sm font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">
              Are you sure you want to sign out?
            </h3>
            <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
              You will be signed out of your current session. Any items in your bag remain safely saved for your next visit.
            </p>
          </div>
        </div>
      </div>

      <div modal-footer class="w-full flex items-center justify-end gap-2.5">
        <button
          type="button"
          (click)="cancelLogout()"
          [disabled]="isLoggingOut"
          class="px-4 py-2.5 rounded-xl text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#3B2F2F] dark:hover:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-white/5 border border-[#EADFD2] dark:border-white/10 transition cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          (click)="confirmLogout()"
          [disabled]="isLoggingOut"
          class="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#9C4738] hover:bg-[#853B2E] active:scale-98 text-white shadow-sm flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
        >
          <i *ngIf="isLoggingOut" class="fa-solid fa-circle-notch fa-spin text-xs"></i>
          <i *ngIf="!isLoggingOut" class="fa-solid fa-right-from-bracket text-xs"></i>
          <span>{{ isLoggingOut ? 'Signing Out...' : 'Sign Out' }}</span>
        </button>
      </div>
    </app-modal>
  `
})
export class LogoutModalComponent {
  authService = inject(AuthService);

  get isOpen(): boolean {
    return typeof this.authService?.showLogoutModal === 'function' ? this.authService.showLogoutModal() : false;
  }

  get isLoggingOut(): boolean {
    return typeof this.authService?.isLoggingOut === 'function' ? this.authService.isLoggingOut() : false;
  }

  cancelLogout(): void {
    if (typeof this.authService?.cancelLogout === 'function') {
      this.authService.cancelLogout();
    }
  }

  confirmLogout(): void {
    if (typeof this.authService?.confirmLogout === 'function') {
      this.authService.confirmLogout();
    }
  }
}
