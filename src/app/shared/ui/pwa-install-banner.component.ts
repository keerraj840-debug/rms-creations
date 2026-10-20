import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-install-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 1. SLIM NEW VERSION UPDATE NOTIFICATION (TOP-RIGHT TOAST) -->
    <div
      *ngIf="pwaService.showUpdateBanner()"
      class="fixed top-4 right-4 left-4 sm:left-auto sm:max-w-sm z-50 animate-in slide-in-from-top-3 duration-300 pointer-events-auto"
      role="alert"
    >
      <div
        class="flex items-center gap-3 rounded-2xl bg-[#1C1816]/95 dark:bg-[#1C1816]/95 text-white p-1 shadow-xl border border-[#EB9D8E]/30 backdrop-blur-md"
      >
        <div class="flex h-6 w-9 shrink-0 items-center justify-center rounded-xl bg-[#9C4738] text-white">
          <i class="fa-solid fa-arrows-rotate text-sm" [class.fa-spin]="pwaService.isUpdateInstalling()"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <span class="inline-flex items-center px-1 py-0.5 rounded text-[10px] font-bold bg-[#EB9D8E]/20 text-[#EB9D8E]">
              v{{ pwaService.updateVersion() }}
            </span>
            <span class="text-[11px] text-[#D9C3B9]/80 font-medium">Update Ready</span>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            (click)="pwaService.applyUpdate()"
            [disabled]="pwaService.isUpdateInstalling()"
            class="px-3 py-1.5 rounded-lg bg-[#9C4738] hover:bg-[#BA5E4E] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            {{ pwaService.isUpdateInstalling() ? 'Updating...' : 'Update' }}
          </button>
          <button
            type="button"
            (click)="pwaService.dismissUpdateBanner()"
            aria-label="Dismiss update"
            class="p-1.5 text-[#D9C3B9]/70 hover:text-white transition cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. UNOBTRUSIVE DESKTOP-ONLY INSTALL TOAST (NEVER BLOCKS MOBILE SHOPPING) -->
    <div
      *ngIf="pwaService.canInstall() && !pwaService.isInstalled()"
      class="hidden sm:block fixed bottom-6 right-6 z-40 max-w-xs animate-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
    >
      <div
        class="rounded-2xl bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 border border-[#EADFD2] dark:border-[#3D302A] p-3.5 shadow-xl backdrop-blur-md text-[#57251C] dark:text-[#F4F1ED]"
      >
        <div class="flex items-center gap-3">
          <img
            src="assets/icons/icon-192.png"
            alt="RMS App"
            class="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-[#9C4738]/20 shadow-xs"
          />
          <div class="flex-1 min-w-0">
            <h4 class="font-serif text-xs font-bold leading-tight">Install RMS App</h4>
            <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-1 mt-0.5">Quick access from desktop</p>
          </div>
          <button
            type="button"
            (click)="pwaService.dismissInstallPrompt(30)"
            aria-label="Close install prompt"
            class="text-[#9D7B6C] hover:text-[#57251C] dark:hover:text-white p-1 transition cursor-pointer"
            title="Dismiss"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <div class="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            (click)="pwaService.promptInstall()"
            class="flex-1 py-1.5 px-3 rounded-lg bg-[#9C4738] hover:bg-[#BA5E4E] text-white text-[11px] font-bold shadow-xs transition cursor-pointer text-center"
          >
            <i class="fa-solid fa-download mr-1"></i> Install
          </button>
          <button
            type="button"
            (click)="pwaService.dismissInstallPrompt(30)"
            class="py-1.5 px-2.5 rounded-lg border border-[#D9C3B9]/60 dark:border-[#3D302A] text-[11px] text-[#7A6C5E] dark:text-[#C5A393] hover:bg-black/5 transition cursor-pointer"
          >
            Not now
          </button>
        </div>
      </div>
    </div>

    <!-- 3. COMPACT GUIDED INSTALLATION MODAL (EXPLICIT USER-TRIGGERED ONLY) -->
    <div
      *ngIf="pwaService.showInstallGuide()"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      (click)="pwaService.toggleInstallGuide(false)"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-guide-title"
    >
      <div
        class="w-full max-w-sm rounded-2xl bg-[#FFFDFC] dark:bg-[#1E1916] p-5 shadow-2xl border border-[#D9C3B9]/60 dark:border-[#3D302A] text-[#57251C] dark:text-[#F4F1ED] space-y-3.5"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-center justify-between border-b border-[#D9C3B9]/30 dark:border-[#3D302A] pb-2.5">
          <div class="flex items-center gap-2.5">
            <img src="assets/icons/icon-192.png" alt="RMS App" class="h-8 w-8 rounded-lg shadow-xs" />
            <div>
              <h3 id="install-guide-title" class="font-serif text-sm font-bold text-[#57251C] dark:text-[#F4F1ED]">
                Install RMS Creations
              </h3>
              <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">Add to home screen or desktop</p>
            </div>
          </div>
          <button
            type="button"
            (click)="pwaService.toggleInstallGuide(false)"
            aria-label="Close dialog"
            class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F7F6F3] dark:bg-[#251F1C] text-xs font-semibold text-[#9D7B6C] hover:text-[#57251C] dark:hover:text-white cursor-pointer transition"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
            <span>Close</span>
          </button>
        </div>

        <!-- iOS Safari Instructions -->
        <div *ngIf="pwaService.isIos()" class="space-y-2 py-1 text-xs">
          <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F7F6F3] dark:bg-[#251F1C]">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9C4738] text-white text-[10px] font-bold">1</span>
            <p class="text-[#57251C] dark:text-[#F4F1ED] leading-snug">
              Tap the <i class="fa-solid fa-arrow-up-from-bracket text-blue-500 mx-0.5"></i> <strong>Share</strong> button in Safari.
            </p>
          </div>
          <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F7F6F3] dark:bg-[#251F1C]">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9C4738] text-white text-[10px] font-bold">2</span>
            <p class="text-[#57251C] dark:text-[#F4F1ED] leading-snug">
              Select <strong class="text-[#9C4738] dark:text-[#EB9D8E]">Add to Home Screen</strong>.
            </p>
          </div>
        </div>

        <!-- Desktop Chrome / Edge / Android Instructions -->
        <div *ngIf="!pwaService.isIos()" class="space-y-2 py-1 text-xs">
          <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F7F6F3] dark:bg-[#251F1C]">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9C4738] text-white text-[10px] font-bold">1</span>
            <p class="text-[#57251C] dark:text-[#F4F1ED] leading-snug">
              Click the <i class="fa-solid fa-download text-[#9C4738] dark:text-[#EB9D8E] mx-0.5"></i> install icon in your browser's address bar.
            </p>
          </div>
          <div class="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F7F6F3] dark:bg-[#251F1C]">
            <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9C4738] text-white text-[10px] font-bold">2</span>
            <p class="text-[#57251C] dark:text-[#F4F1ED] leading-snug">
              Confirm <strong>Install</strong> to add the shortcut.
            </p>
          </div>
        </div>

        <button
          type="button"
          (click)="pwaService.toggleInstallGuide(false)"
          class="w-full py-2 rounded-xl bg-[#9C4738] hover:bg-[#BA5E4E] text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  `
})
export class PwaInstallBannerComponent {
  public readonly pwaService = inject(PwaService);

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    if (this.pwaService.showInstallGuide()) {
      this.pwaService.toggleInstallGuide(false);
    }
  }
}
