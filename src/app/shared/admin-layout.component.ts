import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './ui/sidebar.component';
import { NavbarComponent } from './ui/navbar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="min-h-screen bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED]
                flex font-sans selection:bg-[#DD8776] selection:text-white transition-colors duration-300">

      <!-- Mobile Backdrop -->
      <div *ngIf="isSidebarOpen"
           (click)="isSidebarOpen = false"
           class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity">
      </div>

      <!-- Sidebar -->
      <div
        class="fixed md:static inset-y-0 left-0 z-50 w-[260px] bg-[#FDFBF7] dark:bg-[#1C1917]
               md:bg-transparent transition-transform duration-300 transform md:translate-x-0"
        [ngClass]="isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'">
        <app-sidebar (close)="isSidebarOpen = false"></app-sidebar>
      </div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 z-10">
        <app-navbar (menuClick)="isSidebarOpen = true"></app-navbar>
        <main class="flex-1 overflow-x-hidden overflow-y-auto">
          <div class="px-6 md:px-8 py-6 md:py-8 mx-auto max-w-[1400px]">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  isSidebarOpen = false;
}
