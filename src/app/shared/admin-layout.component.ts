import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './ui/sidebar.component';
import { NavbarComponent } from './ui/navbar.component';
import { LogoutModalComponent } from './ui/logout-modal.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent, LogoutModalComponent],
  template: `
    <div class="min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED]
                flex flex-col md:flex-row font-sans selection:bg-[#DD8776] selection:text-white transition-colors duration-300">

      <!-- Mobile Backdrop Overlay -->
      <div *ngIf="isSidebarOpen"
           (click)="closeSidebar()"
           class="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] md:hidden transition-opacity duration-300 animate-fade-in"
           aria-hidden="true">
      </div>

      <!-- Sidebar Container (Fixed Drawer on Mobile, Sticky Column on Desktop) -->
      <div
        class="fixed inset-y-0 left-0 z-[70] md:z-auto w-72 md:w-64 xl:w-72 shrink-0
               bg-[#FDFBF7] dark:bg-[#1C1917] h-full h-[100dvh] md:h-screen
               md:sticky md:top-0 md:translate-x-0
               transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none"
        [ngClass]="isSidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none md:pointer-events-auto'">
        <app-sidebar (close)="closeSidebar()"></app-sidebar>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <!-- Sticky Navbar -->
        <app-navbar (menuClick)="toggleSidebar()"></app-navbar>

        <!-- Main Routed View -->
        <main class="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 max-w-[1500px] w-full mx-auto">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Admin Logout Confirmation Modal -->
      <app-logout-modal></app-logout-modal>
    </div>
  `
})
export class AdminLayoutComponent implements OnDestroy {
  isSidebarOpen = false;
  private router = inject(Router);

  constructor() {
    // Automatically close sidebar drawer when navigating to a new route on mobile
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeSidebar();
      });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.syncScrollLock();
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.syncScrollLock();
  }

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  private syncScrollLock() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.isSidebarOpen ? 'hidden' : '';
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}

