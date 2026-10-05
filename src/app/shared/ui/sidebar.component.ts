import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="h-screen w-[260px] flex flex-col pt-6 pb-8 border-r border-[#EADFD2]/50">
      
      <!-- Logo -->
      <div class="px-8 mb-8 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 bg-gradient-to-br from-[#DD8776] to-[#9C4738] rounded-2xl flex items-center justify-center shadow-sm">
            <span class="text-white font-black text-xl tracking-tighter">R</span>
          </div>
          <div>
            <span class="text-xl font-serif text-[#4A3C31] tracking-wide font-bold block">RMS</span>
            <span class="text-[10px] font-bold text-[#DD8776] tracking-widest uppercase block -mt-1">Creations</span>
          </div>
        </div>
        
        <button class="md:hidden text-[#4A3C31] hover:bg-[#F3E7DC] p-1.5 rounded-lg" (click)="close.emit()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        
        <a routerLink="/admin/dashboard" routerLinkActive="bg-[#F3E7DC] text-[#4A3C31] font-bold" (click)="onNavClick()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#7A6C5E] hover:bg-[#FDFBF7] transition-colors font-medium text-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Dashboard
        </a>
        
        <div class="h-4"></div>

        <a routerLink="/admin/products" routerLinkActive="bg-[#F3E7DC] text-[#4A3C31] font-bold" (click)="onNavClick()" class="flex items-center justify-between px-4 py-3 rounded-2xl text-[#7A6C5E] hover:bg-[#FDFBF7] transition-colors font-medium text-sm group">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            Products
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>

        <a routerLink="/admin/categories" routerLinkActive="bg-[#F3E7DC] text-[#4A3C31] font-bold" (click)="onNavClick()" class="flex items-center justify-between px-4 py-3 rounded-2xl text-[#7A6C5E] hover:bg-[#FDFBF7] transition-colors font-medium text-sm group">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Categories
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>
        
        <a routerLink="/admin/items" routerLinkActive="bg-[#F3E7DC] text-[#4A3C31] font-bold" (click)="onNavClick()" class="flex items-center justify-between px-4 py-3 rounded-2xl text-[#7A6C5E] hover:bg-[#FDFBF7] transition-colors font-medium text-sm group">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            Items Master
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </a>

        <div class="h-4"></div>

        <a routerLink="/admin/orders" routerLinkActive="bg-[#F3E7DC] text-[#4A3C31] font-bold" (click)="onNavClick()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#7A6C5E] hover:bg-[#FDFBF7] transition-colors font-medium text-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          Orders
        </a>

        <a routerLink="/admin/users" routerLinkActive="bg-[#F3E7DC] text-[#4A3C31] font-bold" (click)="onNavClick()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#7A6C5E] hover:bg-[#FDFBF7] transition-colors font-medium text-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          Users
        </a>

        <a routerLink="/admin/settings" routerLinkActive="bg-[#F3E7DC] text-[#4A3C31] font-bold" (click)="onNavClick()" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#7A6C5E] hover:bg-[#FDFBF7] transition-colors font-medium text-sm group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          App Setting
        </a>
      </nav>
    </aside>

    <style>
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
    </style>
  `
})
export class SidebarComponent {
  @Output() close = new EventEmitter<void>();

  onNavClick() {
    this.close.emit();
  }
}
