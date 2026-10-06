import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-20 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 w-full
                   bg-[#FDFBF7]/80 dark:bg-[#1C1917]/80 backdrop-blur-md border-b border-[#EADFD2]/50 dark:border-white/5
                   transition-colors duration-300">

      <!-- Left: Hamburger (mobile) -->
      <div class="flex items-center gap-4">
        <button (click)="menuClick.emit()"
          class="md:hidden p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED]
                 bg-white dark:bg-[#2E2825] rounded-xl shadow-sm border border-[#EADFD2] dark:border-white/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Right: actions -->
      <div class="flex items-center gap-3 ml-auto">

        <!-- 🌙 / ☀️  THEME TOGGLE -->
        <button (click)="themeService.toggleTheme()"
          class="p-2.5 rounded-full bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10
                 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED]
                 shadow-sm transition-all duration-300 hover:scale-110"
          [title]="themeService.isDarkMode ? 'Switch to Light' : 'Switch to Dark'">
          <!-- Sun icon (light mode) -->
          <svg *ngIf="!themeService.isDarkMode" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l.71.71M12 7a5 5 0 100 10A5 5 0 0012 7z"/>
          </svg>
          <!-- Moon icon (dark mode) -->
          <svg *ngIf="themeService.isDarkMode" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>

        <!-- Notification Bell -->
        <button class="relative p-2.5 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED]
                       bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10
                       rounded-full shadow-sm transition-all duration-300 hidden sm:block">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span class="absolute top-2 right-2 h-2.5 w-2.5 bg-[#DD8776] rounded-full border-2 border-white dark:border-[#2E2825]"></span>
        </button>

        <!-- User Pill -->
        <div class="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10
                    rounded-full shadow-sm cursor-pointer group transition-colors duration-300" (click)="logout()">
          <div class="h-8 w-8 rounded-full bg-gradient-to-br from-[#DD8776] to-[#9C4738]
                      text-white flex items-center justify-center font-bold text-xs tracking-wide
                      shadow-[0_0_15px_rgba(221,135,118,0.3)]">A</div>
          <div class="text-left mr-2">
            <p class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] uppercase tracking-wide
                       group-hover:text-[#DD8776] transition-colors">Admin</p>
            <p class="text-[9px] text-[#7A6C5E] dark:text-[#C5A393]">administrator</p>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  themeService = inject(ThemeService);

  @Output() menuClick = new EventEmitter<void>();

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }
}
