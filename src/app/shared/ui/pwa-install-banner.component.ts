import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-install-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- 1. FLOATING NEW VERSION UPDATE BAR (HIGH PRIORITY) -->
    <div
      *ngIf="pwaService.showUpdateBanner()"
      class="fixed top-20 inset-x-4 sm:inset-x-auto sm:right-6 z-50 max-w-md animate-in slide-in-from-top-4 duration-300"
    >
      <div
        class="flex items-center gap-3.5 rounded-2xl bg-gradient-to-r from-[#2A1D1A] to-[#1E1412] text-white p-4 shadow-2xl border border-[#EB9D8E]/30 ring-1 ring-black/20 backdrop-blur-xl"
      >
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#9C4738] text-white shadow-inner">
          <i class="fa-solid fa-arrows-rotate text-base" [class.fa-spin]="pwaService.isUpdateInstalling()"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EB9D8E]/20 text-[#EB9D8E] uppercase tracking-wide">
              Update v{{ pwaService.updateVersion() }}
            </span>
            <span class="text-[11px] text-[#D9C3B9]/70">Ready to install</span>
          </div>
          <p class="text-xs font-medium text-[#F4F1ED] mt-0.5 line-clamp-1">
            New improvements and speed enhancements are ready.
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            (click)="pwaService.applyUpdate()"
            [disabled]="pwaService.isUpdateInstalling()"
            class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#BA5E4E] hover:to-[#9C4738] text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {{ pwaService.isUpdateInstalling() ? 'Updating...' : 'Update' }}
          </button>
          <button
            type="button"
            (click)="pwaService.dismissUpdateBanner()"
            aria-label="Dismiss update banner"
            class="p-1.5 text-[#D9C3B9]/60 hover:text-white transition-colors cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. SMART PWA INSTALLATION BANNER (BOTTOM DESKTOP/MOBILE) -->
    <div
      *ngIf="pwaService.canInstall() && !pwaService.isInstalled()"
      class="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-40 max-w-sm animate-in slide-in-from-bottom-4 duration-300"
    >
      <div
        class="rounded-3xl bg-[#FFFDFC]/95 dark:bg-[#1E1916]/95 border border-[#EADFD2] dark:border-[#3D302A] p-4 shadow-2xl backdrop-blur-xl text-[#57251C] dark:text-[#F4F1ED]"
      >
        <div class="flex items-start gap-3">
          <div class="relative shrink-0">
            <img
              src="assets/icons/icon-192.png"
              alt="RMS Gift Studio App"
              class="h-12 w-12 rounded-2xl object-cover shadow-md ring-2 ring-[#9C4738]/20"
            />
            <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1B4D3E] text-[8px] font-bold text-white">
              <i class="fa-solid fa-check"></i>
            </span>
          </div>
          <div class="flex-1 min-w-0 pr-1">
            <h4 class="font-serif text-sm font-bold text-[#57251C] dark:text-[#F4F1ED] leading-tight">
              Install RMS App
            </h4>
            <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5 leading-snug">
              Fast loading, quick orders, and offline access directly from your home screen.
            </p>
          </div>
          <button
            type="button"
            (click)="pwaService.dismissInstallPrompt(3)"
            aria-label="Dismiss install prompt"
            class="text-[#9D7B6C] hover:text-[#57251C] dark:hover:text-white transition p-1 cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <div class="mt-3.5 flex items-center gap-2">
          <button
            type="button"
            (click)="pwaService.promptInstall()"
            class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#BA5E4E] hover:to-[#9C4738] text-white text-xs font-bold shadow-md shadow-[#9C4738]/20 transition active:scale-98 cursor-pointer"
          >
            <i class="fa-solid fa-download text-xs"></i>
            <span>Add to Home Screen</span>
          </button>
          <button
            type="button"
            (click)="pwaService.dismissInstallPrompt(7)"
            class="py-2 px-3 rounded-xl border border-[#D9C3B9]/50 dark:border-[#3D302A] text-xs font-medium text-[#7A6C5E] dark:text-[#C5A393] hover:bg-[#F7F6F3] dark:hover:bg-[#251F1C] transition cursor-pointer"
          >
            Later
          </button>
        </div>
      </div>
    </div>

    <!-- 3. GUIDED INSTALLATION MODAL (FOR iOS & DESKTOP BROWSER GUIDANCE) -->
    <div
      *ngIf="pwaService.showInstallGuide()"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      (click)="pwaService.toggleInstallGuide(false)"
    >
      <div
        class="w-full max-w-md rounded-3xl bg-[#FFFDFC] dark:bg-[#1E1916] p-6 shadow-2xl border border-[#D9C3B9]/50 dark:border-[#3D302A] text-[#57251C] dark:text-[#F4F1ED] space-y-4"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-center justify-between border-b border-[#D9C3B9]/30 dark:border-[#3D302A] pb-3">
          <div class="flex items-center gap-3">
            <img src="assets/icons/icon-192.png" alt="RMS App" class="h-9 w-9 rounded-xl shadow-sm" />
            <div>
              <h3 class="font-serif text-base font-bold text-[#57251C] dark:text-[#F4F1ED]">Install RMS App</h3>
              <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">Add to your Home Screen in 3 steps</p>
            </div>
          </div>
          <button
            type="button"
            (click)="pwaService.toggleInstallGuide(false)"
            class="rounded-full bg-[#F7F6F3] dark:bg-[#251F1C] p-2 text-[#9D7B6C] hover:text-[#57251C] dark:hover:text-white cursor-pointer transition"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- iOS Safari Instructions -->
        <div *ngIf="pwaService.isIos()" class="space-y-3.5 py-1">
          <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] border border-[#D9C3B9]/30">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9C4738] text-white font-bold text-xs">
              1
            </div>
            <div class="text-xs">
              <p class="font-bold text-[#57251C] dark:text-[#F4F1ED]">Tap the Share icon</p>
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                At the bottom or top of your Safari browser, tap the <i class="fa-solid fa-arrow-up-from-bracket text-blue-500 mx-1"></i> Share button.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] border border-[#D9C3B9]/30">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9C4738] text-white font-bold text-xs">
              2
            </div>
            <div class="text-xs">
              <p class="font-bold text-[#57251C] dark:text-[#F4F1ED]">Select "Add to Home Screen"</p>
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                Scroll down the share sheet and tap <span class="font-semibold text-[#9C4738] dark:text-[#EB9D8E]"><i class="fa-regular fa-square-plus mr-0.5"></i> Add to Home Screen</span>.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] border border-[#D9C3B9]/30">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9C4738] text-white font-bold text-xs">
              3
            </div>
            <div class="text-xs">
              <p class="font-bold text-[#57251C] dark:text-[#F4F1ED]">Confirm Installation</p>
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                Tap <span class="font-bold text-[#9C4738] dark:text-[#EB9D8E]">Add</span> in the top-right corner. The RMS Creations app icon will now appear on your home screen!
              </p>
            </div>
          </div>
        </div>

        <!-- Android / Chrome / Edge Instructions -->
        <div *ngIf="!pwaService.isIos()" class="space-y-3.5 py-1">
          <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] border border-[#D9C3B9]/30">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9C4738] text-white font-bold text-xs">
              1
            </div>
            <div class="text-xs">
              <p class="font-bold text-[#57251C] dark:text-[#F4F1ED]">Browser Menu or Address Bar</p>
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                Click the <i class="fa-solid fa-download text-[#9C4738] dark:text-[#EB9D8E] mx-1"></i> install icon in your browser URL address bar, or open the browser menu <i class="fa-solid fa-ellipsis-vertical mx-1"></i>.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-2xl bg-[#F7F6F3] dark:bg-[#251F1C] border border-[#D9C3B9]/30">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#9C4738] text-white font-bold text-xs">
              2
            </div>
            <div class="text-xs">
              <p class="font-bold text-[#57251C] dark:text-[#F4F1ED]">Click "Install RMS Creations"</p>
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                Confirm install when prompted to launch RMS Creations as a standalone desktop or mobile application.
              </p>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <button
            type="button"
            (click)="pwaService.toggleInstallGuide(false)"
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] text-white font-bold text-xs shadow hover:opacity-95 transition cursor-pointer"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  `
})
export class PwaInstallBannerComponent {
  public readonly pwaService = inject(PwaService);
}
