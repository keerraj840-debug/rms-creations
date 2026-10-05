import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-24 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 w-full pt-4">
      
      <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
        
        <!-- Mobile Hamburger -->
        <button (click)="menuClick.emit()" class="md:hidden p-2 text-[#7A6C5E] hover:text-[#4A3C31] bg-white rounded-xl shadow-sm border border-[#EADFD2] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>
      
      <div class="flex items-center gap-4 ml-auto md:ml-0">
        
        <!-- Notification Bell -->
        <button class="relative p-2.5 text-[#7A6C5E] hover:text-[#4A3C31] bg-white border border-[#EADFD2] rounded-full shadow-sm transition-all duration-300 hidden sm:block">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span class="absolute top-2 right-2 h-2.5 w-2.5 bg-[#DD8776] rounded-full border-2 border-white"></span>
        </button>
        
        <!-- User Pill -->
        <div class="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white border border-[#EADFD2] rounded-full shadow-sm cursor-pointer group" (click)="logout()">
          <div class="h-8 w-8 rounded-full bg-gradient-to-br from-[#DD8776] to-[#9C4738] text-white flex items-center justify-center font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(221,135,118,0.3)]">
            A
          </div>
          <div class="text-left mr-2">
            <p class="text-xs font-bold text-[#4A3C31] uppercase tracking-wide group-hover:text-[#DD8776] transition-colors">Admin</p>
            <p class="text-[9px] text-[#7A6C5E]">administrator</p>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);

  @Output() menuClick = new EventEmitter<void>();

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}
