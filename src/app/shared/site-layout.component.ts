import { Component, Input, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderTrackingService } from './order-tracking.service';

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgIf, NgFor, FormsModule],
  template: `
    <!-- Main Shell -->
    <div class="flex min-h-screen flex-col bg-[#F7F6F3] font-sans text-[#57251C] selection:bg-[#EB9D8E] selection:text-[#57251C]">
      
      <!-- Top Announcement Bar (Festive Brand Banner) -->
      <aside aria-label="Announcement" class="relative z-50 bg-gradient-to-r from-[#57251C] via-[#9C4738] to-[#C56D5B] px-4 py-2 text-center text-xs font-semibold text-[#FFFDFC] shadow-sm sm:text-sm">
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <span>🌺</span>
          <span><strong>Ganesh Utsav Special:</strong> Handcrafted Ganpati Pooja Kits starting at just ₹99!</span>
          <a routerLink="/ganpati-hampers" class="rounded-full bg-white/20 px-3 py-0.5 font-bold text-[#FFFDFC] hover:bg-white/30 transition">View Boxes & Order &rarr;</a>
          <span>🪔</span>
        </div>
      </aside>

      <!-- Sticky Luxury Glassmorphism Header -->
      <header 
        class="sticky top-0 z-40 w-full border-b border-[#D9C3B9]/45 bg-[#FFFDFC]/92 backdrop-blur-md transition-all duration-300"
        [ngClass]="{
          'shadow-md shadow-[#57251C]/5 py-1 bg-[#FFFDFC]/96': isScrolled, 
          'py-2 bg-[#FFFDFC]/88': !isScrolled
        }"
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between sm:h-18">
            
            <!-- Logo Section -->
            <a routerLink="/" class="group flex items-center gap-3 transition-transform hover:scale-102">
              <div class="relative">
                <img 
                  src="assets/logo.png" 
                  alt="RMS Logo" 
                  class="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-[#D9C3B9]/60 transition-all group-hover:ring-[#C56D5B] sm:h-12 sm:w-12" 
                />
                <span class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#1B4D3E] ring-2 ring-[#FFFDFC]" title="Online & Ready to assist"></span>
              </div>
              <div class="flex flex-col justify-center">
                <span class="text-[10px] font-bold uppercase tracking-[0.35em] text-[#9D7B6C] sm:text-xs leading-none mb-1">RMS</span>
                <span class="font-serif text-base font-bold tracking-tight text-[#57251C] sm:text-lg leading-none group-hover:text-[#9C4738] transition-colors">Gift Hampers</span>
              </div>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex md:items-center md:gap-5 lg:gap-7">
              <a 
                routerLink="/" 
                routerLinkActive="text-[#9C4738] font-bold after:w-full" 
                [routerLinkActiveOptions]="{ exact: true }" 
                class="relative text-sm font-medium text-[#57251C]/80 transition-colors hover:text-[#9C4738] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Home
              </a>
              <a 
                routerLink="/ganpati-hampers" 
                routerLinkActive="text-[#9C4738] font-bold after:w-full" 
                class="relative inline-flex items-center gap-1.5 text-sm font-bold text-[#9C4738] transition-colors hover:text-[#57251C] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                <span>🌺 Ganpati Hampers</span>
                <span class="rounded-full bg-[#C56D5B]/15 px-1.5 py-0.2 text-[10px] font-extrabold text-[#9C4738] border border-[#C56D5B]/30 animate-pulse">Special</span>
              </a>
              <a 
                routerLink="/hampers" 
                routerLinkActive="text-[#9C4738] font-bold after:w-full" 
                class="relative text-sm font-medium text-[#57251C]/80 transition-colors hover:text-[#9C4738] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Hampers
              </a>
              <a 
                routerLink="/return-gifts" 
                routerLinkActive="text-[#9C4738] font-bold after:w-full" 
                class="relative text-sm font-medium text-[#57251C]/80 transition-colors hover:text-[#9C4738] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Return Gifts
              </a>
              <a 
                routerLink="/gallery" 
                routerLinkActive="text-[#9C4738] font-bold after:w-full" 
                class="relative text-sm font-medium text-[#57251C]/80 transition-colors hover:text-[#9C4738] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Gallery
              </a>
              <a 
                routerLink="/top-offers" 
                routerLinkActive="text-[#9C4738] font-bold after:w-full" 
                class="relative text-sm font-medium text-[#57251C]/80 transition-colors hover:text-[#9C4738] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Top Offers
              </a>
              <a 
                routerLink="/contact" 
                routerLinkActive="text-[#9C4738] font-bold after:w-full" 
                class="relative text-sm font-medium text-[#57251C]/80 transition-colors hover:text-[#9C4738] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:rounded-full after:bg-[#C56D5B] after:transition-all hover:after:w-full"
              >
                Contact
              </a>
            </nav>

            <!-- Header Action Controls -->
            <div class="flex items-center gap-3 sm:gap-4">
              <!-- WhatsApp Quick Action Button (Refined Luxury CTA) -->
              <button
                type="button"
                (click)="openWhatsapp('Header')"
                class="hidden items-center justify-center gap-2 rounded-full bg-[#57251C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FFFDFC] shadow-sm shadow-[#57251C]/20 transition-all hover:-translate-y-0.5 hover:bg-[#9C4738] hover:shadow-md active:scale-95 sm:inline-flex"
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.551 4.195 1.597 6.02L.055 24l6.105-1.602c1.745.952 3.712 1.455 5.871 1.455 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm3.896 17.266c-.183.513-1.045.962-1.464 1.002-.42.04-1.001.077-2.923-.717-2.316-.957-3.805-3.32-3.921-3.475-.116-.155-.936-1.246-.936-2.378 0-1.132.585-1.688.794-1.921.209-.233.456-.291.608-.291.152 0 .304 0 .436.007.14.008.33.025.517.47.195.467.666 1.632.724 1.748.058.116.097.252.019.408-.078.155-.116.252-.233.388-.116.136-.245.298-.348.396-.115.109-.239.229-.107.457.132.228.588.973 1.259 1.573.864.773 1.603 1.012 1.832 1.127.228.116.363.097.498-.058.136-.155.585-.68.74-.913.155-.233.228-.155.443.058.558.214.724.348 1.267.504 1.344.155.077.33.078.503-.131z"/>
                </svg>
                <span>WhatsApp</span>
              </button>

              <!-- Mobile Hamburger Button -->
              <button 
                type="button"
                (click)="toggleMenu()"
                [attr.aria-expanded]="isMobileMenuOpen"
                aria-label="Toggle mobile menu"
                class="inline-flex items-center justify-center rounded-xl p-2.5 text-[#57251C] transition-colors hover:bg-[#F7F6F3] hover:text-[#9C4738] focus:outline-none focus:ring-2 focus:ring-[#C56D5B] md:hidden"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path [class.hidden]="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  <path [class.hidden]="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation Menu Dropdown -->
        <div 
          class="border-t border-[#D9C3B9]/30 bg-[#FFFDFC]/98 backdrop-blur-xl md:hidden overflow-hidden transition-all duration-300 ease-in-out"
          [ngClass]="isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
        >
          <nav class="flex flex-col space-y-1 px-4 pb-6 pt-3 sm:px-6">
            <a routerLink="/" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] text-[#9C4738] font-bold border-l-2 border-[#C56D5B]" [routerLinkActiveOptions]="{ exact: true }" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] transition-colors hover:bg-[#F7F6F3] hover:text-[#9C4738]">Home</a>
            <a routerLink="/ganpati-hampers" (click)="closeMenu()" routerLinkActive="bg-[#C56D5B]/15 text-[#9C4738] font-bold border-l-2 border-[#9C4738]" class="flex items-center justify-between rounded-xl px-4 py-3 text-base font-bold text-[#9C4738] bg-[#F7F6F3] border border-[#D9C3B9]/50 shadow-sm">
              <span>🌺 Ganpati Hampers & Pooja Kits</span>
              <span class="rounded-full bg-[#9C4738] text-white px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">Special</span>
            </a>
            <a routerLink="/hampers" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] text-[#9C4738] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] transition-colors hover:bg-[#F7F6F3] hover:text-[#9C4738]">All Hampers</a>
            <a routerLink="/return-gifts" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] text-[#9C4738] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] transition-colors hover:bg-[#F7F6F3] hover:text-[#9C4738]">Return Gifts</a>
            <a routerLink="/gallery" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] text-[#9C4738] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] transition-colors hover:bg-[#F7F6F3] hover:text-[#9C4738]">Gallery</a>
            <a routerLink="/top-offers" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] text-[#9C4738] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] transition-colors hover:bg-[#F7F6F3] hover:text-[#9C4738]">Top Offers</a>
            <a routerLink="/contact" (click)="closeMenu()" routerLinkActive="bg-[#F7F6F3] text-[#9C4738] font-bold border-l-2 border-[#C56D5B]" class="block rounded-xl px-4 py-3 text-base font-medium text-[#57251C] transition-colors hover:bg-[#F7F6F3] hover:text-[#9C4738]">Contact Us</a>
            
            <div class="pt-3">
              <button
                type="button"
                (click)="openWhatsapp('Mobile menu')"
                class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#57251C] px-4 py-3.5 text-base font-semibold text-[#FFFDFC] shadow-md transition-all hover:bg-[#9C4738] active:scale-95"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.551 4.195 1.597 6.02L.055 24l6.105-1.602c1.745.952 3.712 1.455 5.871 1.455 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm3.896 17.266c-.183.513-1.045.962-1.464 1.002-.42.04-1.001.077-2.923-.717-2.316-.957-3.805-3.32-3.921-3.475-.116-.155-.936-1.246-.936-2.378 0-1.132.585-1.688.794-1.921.209-.233.456-.291.608-.291.152 0 .304 0 .436.007.14.008.33.025.517.47.195.467.666 1.632.724 1.748.058.116.097.252.019.408-.078.155-.116.252-.233.388-.116.136-.245.298-.348.396-.115.109-.239.229-.107.457.132.228.588.973 1.259 1.573.864.773 1.603 1.012 1.832 1.127.228.116.363.097.498-.058.136-.155.585-.68.74-.913.155-.233.228-.155.443.058.558.214.724.348 1.267.504 1.344.155.077.33.078.503-.131z"/>
                </svg>
                Chat on WhatsApp
              </button>
            </div>
          </nav>
        </div>
      </header>

      <!-- Main Outlet Container -->
      <main class="w-full flex-grow">
        <ng-content></ng-content>
      </main>

      <!-- Editorial Luxury Footer -->
      <footer class="mt-auto border-t border-[#57251C] bg-[#57251C] text-[#FFFDFC]">
        <div class="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
            
            <!-- Brand Info Column -->
            <div class="flex flex-col md:col-span-2">
              <a routerLink="/" class="flex items-center gap-3 mb-4 transition-transform hover:scale-102">
                <img src="assets/logo.png" alt="RMS Logo" class="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-[#D9C3B9]/40" />
                <span class="font-serif text-2xl font-bold tracking-tight text-[#FFFDFC]">RMS Gift Hampers</span>
              </a>
              <p class="max-w-md text-sm leading-relaxed text-[#D9C3B9]/90">
                Handcrafted, bespoke gift hampers for birthdays, festive celebrations, anniversaries, and corporate milestones. Curated with devotion and delivered with care across India.
              </p>
              
              <!-- Social Links -->
              <div class="mt-6 flex gap-3">
                <a 
                  href="https://www.instagram.com/rmsgifthampers?igsh=dWF2N2I4YW45dmx1" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-full bg-white/10 p-2.5 text-[#D9C3B9] transition-all hover:bg-[#C56D5B] hover:text-white hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" /></svg>
                </a>
              </div>
            </div>
            
            <!-- Quick Links Column -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#EB9D8E]">Discover</h3>
              <ul class="mt-4 space-y-3 text-sm font-medium text-[#D9C3B9]">
                <li><a routerLink="/" class="transition-colors hover:text-[#FFFDFC]">Home</a></li>
                <li><a routerLink="/ganpati-hampers" class="text-[#DD8776] font-bold hover:text-white">🌺 Ganpati Hampers (From ₹99)</a></li>
                <li><a routerLink="/hampers" class="transition-colors hover:text-[#FFFDFC]">All Hampers</a></li>
                <li><a routerLink="/return-gifts" class="transition-colors hover:text-[#FFFDFC]">Return Gifts</a></li>
                <li><a routerLink="/top-offers" class="transition-colors hover:text-[#FFFDFC]">Top Offers</a></li>
                <li><a routerLink="/gallery" class="transition-colors hover:text-[#FFFDFC]">Our Gallery</a></li>
              </ul>
            </div>
            
            <!-- Contact Info Column -->
            <div>
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#EB9D8E]">Get in Touch</h3>
              <ul class="mt-4 space-y-3 text-sm text-[#D9C3B9]">
                <li class="flex items-center gap-3">
                  <svg class="h-5 w-5 text-[#DD8776] shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.864-1.048l-3.413-.541c-.49-.078-.984.12-1.22.569l-1.218 2.321c-3.218-1.55-5.83-4.162-7.38-7.38l2.321-1.218c.45-.236.647-.73.569-1.22l-.541-3.413C10.231 2.601 9.78 2.25 9.264 2.25H7.875A2.25 2.25 0 005.625 4.5c0 1.25.13 2.474.382 3.65z" /></svg>
                  <a href="tel:+919284905118" class="font-semibold text-[#FFFDFC] hover:text-[#DD8776] transition-colors">+91 9284905118</a>
                </li>
                <li class="flex items-center gap-3">
                  <svg class="h-5 w-5 text-[#DD8776] shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  <a href="mailto:rmsgifthampers@gmail.com" class="font-semibold text-[#FFFDFC] hover:text-[#DD8776] transition-colors break-all">rmsgifthampers&#64;gmail.com</a>
                </li>
                <li class="pt-2">
                  <a 
                    href="https://wa.me/919284905118" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="group inline-flex items-center gap-1.5 font-bold text-[#DD8776] transition-colors hover:text-white"
                  >
                    <span>Message on WhatsApp</span>
                    <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>
          
          <!-- Copyright & Bottom Info -->
          <div class="mt-16 flex flex-col items-center justify-between border-t border-[#D9C3B9]/20 pt-8 sm:flex-row">
            <p class="text-sm text-[#D9C3B9]/70">
              © 2026 RMS Gift Hampers. All Rights Reserved.
            </p>
            <div class="mt-4 flex gap-6 text-sm text-[#D9C3B9]/70 sm:mt-0">
              <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <!-- OPTIONAL FLOATING ORDER TRACKER BADGE FOR OPERATORS -->
      <div class="fixed bottom-5 right-5 z-40">
        <button 
          type="button"
          (click)="toggleTrackerModal()"
          class="flex items-center gap-2 rounded-full bg-[#57251C] px-4 py-2.5 text-xs font-semibold text-[#FFFDFC] shadow-xl ring-2 ring-[#D9C3B9]/40 transition hover:bg-[#9C4738] hover:scale-105 active:scale-95"
        >
          <span class="flex h-2 w-2 rounded-full bg-[#EB9D8E] animate-pulse"></span>
          <span>{{ isAdminAuthenticated ? 'Captured Enquiries' : 'Admin Access' }}</span>
          <span *ngIf="orderCount > 0" class="rounded-full bg-[#C56D5B] px-2 py-0.5 text-[10px] font-bold text-white">{{ orderCount }}</span>
        </button>
      </div>

      <!-- ADMIN LOGIN MODAL -->
      <div 
        *ngIf="showAdminLoginModal" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        (click)="closeAdminLoginModal()"
      >
        <div class="w-full max-w-md rounded-3xl bg-[#FFFDFC] p-6 shadow-2xl border border-[#D9C3B9]/50" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-[#D9C3B9]/30 pb-4">
            <div>
              <h3 class="text-lg font-bold text-[#57251C]">Admin Login</h3>
              <p class="text-xs text-[#9D7B6C]">Only the admin can view enquiries or export the sheet.</p>
            </div>
            <button (click)="closeAdminLoginModal()" class="rounded-full bg-[#F7F6F3] p-2 text-[#9D7B6C] hover:text-[#57251C]">✕</button>
          </div>

          <div class="mt-4 space-y-3">
            <input
              [(ngModel)]="adminUsername"
              type="email"
              class="w-full rounded-xl border border-[#D9C3B9]/60 px-3 py-2.5 text-sm outline-none focus:border-[#C56D5B]"
              placeholder="Email"
            />
            <input
              [(ngModel)]="adminPassword"
              type="password"
              class="w-full rounded-xl border border-[#D9C3B9]/60 px-3 py-2.5 text-sm outline-none focus:border-[#C56D5B]"
              placeholder="Password"
            />
            <p *ngIf="adminLoginError" class="text-sm text-red-600">{{ adminLoginError }}</p>
          </div>

          <div class="mt-6 flex gap-3">
            <button 
              (click)="submitAdminLogin()"
              class="w-full rounded-xl bg-[#57251C] py-3 text-sm font-bold text-[#FFFDFC] shadow hover:bg-[#9C4738] transition"
            >
              Login
            </button>
            <button 
              (click)="closeAdminLoginModal()"
              class="rounded-xl border border-[#D9C3B9] px-4 py-3 text-sm font-semibold text-[#57251C] hover:bg-[#F7F6F3]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- TRACKER MODAL DRAWER -->
      <div 
        *ngIf="isTrackerModalOpen" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        (click)="toggleTrackerModal()"
      >
        <div class="max-w-lg w-full rounded-3xl bg-[#FFFDFC] p-6 shadow-2xl border border-[#D9C3B9]/50" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between border-b border-[#D9C3B9]/30 pb-4">
            <div>
              <h3 class="text-lg font-bold text-[#57251C]">Tracked Customer Orders</h3>
              <p class="text-xs text-[#9D7B6C]">Recorded sessions during this visit</p>
            </div>
            <button (click)="toggleTrackerModal()" class="rounded-full bg-[#F7F6F3] p-2 text-[#9D7B6C] hover:text-[#57251C]">✕</button>
          </div>

          <div class="mt-4 max-h-60 overflow-y-auto space-y-2">
            <div *ngFor="let item of trackerOrders" class="rounded-xl bg-[#F7F6F3] p-3 text-xs flex justify-between items-center border border-[#D9C3B9]/30">
              <div>
                <p class="font-bold text-[#57251C]">{{ item.title }}</p>
                <p class="text-[#9D7B6C]">{{ item.page }} • {{ item.category }}</p>
              </div>
              <span class="text-[10px] text-[#9D7B6C] font-mono">{{ item.timestamp  }}</span>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button 
              (click)="downloadOrderSheet()" 
              class="w-full rounded-xl bg-[#57251C] py-3 text-xs font-bold text-[#FFFDFC] shadow hover:bg-[#9C4738] transition"
            >
              Export Order Sheet (.CSV)
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class SiteLayoutComponent {
  @Input() title = '';

  private readonly orderTracker = inject(OrderTrackingService);
  private readonly router = inject(Router);
  
  isMobileMenuOpen = false;
  isScrolled = false;
  isTrackerModalOpen = false;
  showAdminLoginModal = false;
  isAdminAuthenticated = false;
  adminUsername = '';
  adminPassword = '';
  adminLoginError = '';

  private readonly adminAuthStorageKey = 'rms-admin-auth';
  private readonly adminEmail = 'rmsgifthampers@gmail.com';
  private readonly adminPasswordValue = 'RMS@1234';

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(this.adminAuthStorageKey);
      this.isAdminAuthenticated = stored === 'true';
    }

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMenu() {
    this.isMobileMenuOpen = false;
  }

  openWhatsapp(sourcePage: string = 'General') {
    const url = 'https://wa.me/919284905118?text=Hello%20RMS%20Gift%20Hampers,%20I%20would%20like%20to%20know%20more!';
    this.trackOrder('General enquiry', 'Website', sourcePage, url);
    window.open(url, '_blank');
  }

  trackOrder(title: string, category: string, page: string, link: string) {
    this.orderTracker.recordOrder({
      title,
      category,
      page,
      link
    });
  }

  toggleTrackerModal() {
    if (!this.isAdminAuthenticated) {
      this.showAdminLoginModal = true;
      this.isTrackerModalOpen = false;
      this.adminLoginError = '';
      return;
    }

    this.isTrackerModalOpen = !this.isTrackerModalOpen;
  }

  closeAdminLoginModal() {
    this.showAdminLoginModal = false;
    this.adminLoginError = '';
    this.adminUsername = '';
    this.adminPassword = '';
  }

  submitAdminLogin() {
    if (this.adminUsername.trim() === this.adminEmail && this.adminPassword === this.adminPasswordValue) {
      this.isAdminAuthenticated = true;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(this.adminAuthStorageKey, 'true');
      }
      this.adminLoginError = '';
      this.showAdminLoginModal = false;
      this.isTrackerModalOpen = true;
      this.adminUsername = '';
      this.adminPassword = '';
      return;
    }

    this.adminLoginError = 'Invalid username or password.';
  }

  downloadOrderSheet() {
    if (!this.isAdminAuthenticated) {
      this.showAdminLoginModal = true;
      this.isTrackerModalOpen = false;
      this.adminLoginError = '';
      return;
    }

    this.orderTracker.downloadOrders();
  }

  get orderCount(): number {
    return this.orderTracker.getOrders().length;
  }

  get trackerOrders() {
    return this.orderTracker.getOrders();
  }
}