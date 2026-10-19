import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { ThemeService } from '../../services/theme.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 sm:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 w-full
                   bg-[#FDFBF7]/90 dark:bg-[#1C1917]/90 backdrop-blur-md border-b border-[#EADFD2]/60 dark:border-white/10
                   transition-colors duration-300">

      <!-- Left: Hamburger (mobile) & Section Breadcrumb -->
      <div class="flex items-center gap-3 sm:gap-4 min-w-0">
        <!-- Mobile Drawer Toggle -->
        <button (click)="menuClick.emit()"
          aria-label="Toggle navigation menu"
          class="md:hidden p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED]
                 bg-white dark:bg-[#2E2825] rounded-xl shadow-sm border border-[#EADFD2] dark:border-white/10 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Right: Action Buttons & User Menu -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">

        <!-- Dark / Light Theme Toggle -->
        <button (click)="themeService.toggleTheme()"
          class="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10
                 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED]
                 shadow-sm transition-all duration-200 active:scale-95"
          [title]="themeService.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <!-- Sun icon (shown in light mode) -->
          <svg *ngIf="!themeService.isDarkMode" class="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l.71.71M12 7a5 5 0 100 10A5 5 0 0012 7z"/>
          </svg>
          <!-- Moon icon (shown in dark mode) -->
          <svg *ngIf="themeService.isDarkMode" class="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>

        <!-- Admin User Profile Pill -->
        <div class="flex items-center gap-2 sm:gap-2.5 pl-1.5 pr-2 sm:pr-3 py-1 bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10
                    rounded-2xl shadow-sm transition-colors duration-200 group">
          <div class="h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-[#DD8776] to-[#9C4738]
                      text-white flex items-center justify-center font-bold text-xs tracking-wide shrink-0">
            A
          </div>
          <div class="text-left hidden min-[400px]:block">
            <p class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] leading-none mb-0.5">Admin</p>
            <p class="text-[9px] text-[#8B6E57] dark:text-[#C5A393] leading-none">RMS Studio</p>
          </div>
          <button (click)="logout()" title="Logout"
                  class="ml-1 p-1 text-[#8B6E57] hover:text-rose-600 dark:text-[#C5A393] dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>

      </div>
    </header>
  `
})
export class NavbarComponent {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);
  themeService = inject(ThemeService);

  @Output() menuClick = new EventEmitter<void>();

  async logout() {
    await this.supabase.signOut();
    this.localStorage.removeItem('auth_token');
    this.localStorage.removeItem('user_role');
    this.router.navigate(['/login']);
  }
}

