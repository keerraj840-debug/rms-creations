import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="h-full w-full flex flex-col pt-5 pb-6 px-3 sm:px-4
                  border-r border-[#EADFD2]/60 dark:border-white/10
                  bg-[#FDFBF7] dark:bg-[#1C1917] transition-colors duration-300">

      <!-- Brand Header -->
      <div class="px-3 mb-6 flex items-center justify-between shrink-0">
        <a routerLink="/admin/dashboard" (click)="onNavClick()" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#DD8776] to-[#9C4738] p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-200">
            <div class="w-full h-full bg-white dark:bg-[#2E2825] rounded-[14px] flex items-center justify-center">
              <span class="font-serif text-base font-bold text-[#9C4738] dark:text-[#DD8776]">R</span>
            </div>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-base font-serif text-[#4A3C31] dark:text-[#F4F1ED] font-bold tracking-tight">RMS</span>
              <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#C56D5B]/15 text-[#9C4738] dark:text-[#DD8776] uppercase">Admin</span>
            </div>
            <span class="text-[10px] font-bold text-[#8B6E57] dark:text-[#C5A393] uppercase tracking-widest block -mt-0.5">Creations Studio</span>
          </div>
        </a>

        <!-- Mobile Drawer Close Button -->
        <button (click)="close.emit()"
                aria-label="Close sidebar"
                class="md:hidden p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED]
                       hover:bg-[#F3E7DC] dark:hover:bg-white/10 rounded-xl transition-colors">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">

        <p class="px-3 text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#A89F91] pt-1 pb-1.5">Store Catalog</p>

        <!-- Dashboard -->
        <a routerLink="/admin"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
          </svg>
          <span>Dashboard</span>
        </a>

        <!-- Products -->
        <a routerLink="/admin/products"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
            <span>Products</span>
          </div>
          <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EADFD2]/60 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">Catalog</span>
        </a>

        <!-- Items (Product Inclusions) -->
        <a routerLink="/admin/items"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span>Hamper Items</span>
          </div>
          <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EADFD2]/60 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">Inclusions</span>
        </a>

        <!-- Categories -->
        <a routerLink="/admin/categories"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            <span>Categories</span>
          </div>
        </a>

        <!-- Banners Master -->
        <a routerLink="/admin/banners"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>Banners Master</span>
          </div>
          <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EADFD2]/60 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">Hero</span>
        </a>

        <!-- Orders -->
        <a routerLink="/admin/orders"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span>Orders</span>
          </div>
          <span class="inline-flex items-center justify-center h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </a>

        <!-- Custom Hampers Requests -->
        <a routerLink="/admin/custom-hampers"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-purple-600 dark:text-purple-400 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v13m0-13V4a2 2 0 112 2h-2zm0 0V4a2 2 0 10-2 2h2m-7 4h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"/>
            </svg>
            <span>Custom Hampers</span>
          </div>
          <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">Consult</span>
        </a>

        <!-- PIN Codes Delivery Coverage -->
        <a routerLink="/admin/pincodes"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <div class="flex items-center gap-3">
            <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>Delivery PINs</span>
          </div>
          <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EADFD2]/60 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">Shipping</span>
        </a>

        <p class="px-3 text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#A89F91] pt-4 pb-1.5">Settings & Users</p>

        <!-- Users -->
        <a routerLink="/admin/users"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <span>Users</span>
        </a>

        <!-- Settings -->
        <a routerLink="/admin/settings"
           routerLinkActive="bg-[#F3E7DC] dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] font-bold shadow-sm border border-[#EADFD2]/70 dark:border-white/10"
           (click)="onNavClick()"
           class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[#7A6C5E] dark:text-[#C5A393]
                  hover:bg-[#F3E7DC]/60 dark:hover:bg-white/5 hover:text-[#2E2825] dark:hover:text-[#F4F1ED] transition-all font-medium text-xs sm:text-sm group">
          <svg class="h-5 w-5 text-[#8B6E57] dark:text-[#DD8776] opacity-80 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>Store Settings</span>
        </a>
      </nav>

      <!-- Bottom Session Control -->
      <div class="px-2 mt-auto pt-4 border-t border-[#EADFD2]/60 dark:border-white/10 shrink-0">
        <button (click)="logout()"
          class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-rose-500
                 hover:bg-rose-50 dark:hover:bg-rose-950/25 transition-all font-bold text-xs uppercase tracking-wider group border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40">
          <svg class="h-4 w-4 opacity-80 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Log Out
        </button>
      </div>
    </aside>

    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
      :host-context(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); }
    </style>
  `
})
export class SidebarComponent {
  @Output() close = new EventEmitter<void>();

  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);

  onNavClick() { this.close.emit(); }

  async logout() {
    await this.supabase.signOut();
    this.localStorage.removeItem('auth_token');
    this.localStorage.removeItem('user_role');
    this.router.navigate(['/login']);
  }
}

