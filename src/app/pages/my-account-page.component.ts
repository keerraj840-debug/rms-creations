import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { LocalStorageService } from '../services/local-storage.service';
import { CartService } from '../services/cart.service';
import { AuthService, UserProfile } from '../services/auth.service';
import { CustomerAddressService, CustomerAddress } from '../services/customer-address.service';
import { SupabaseService } from '../services/supabase.service';

type AccountTab = 'profile' | 'addresses' | 'security';

@Component({
  selector: 'app-my-account-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-28 sm:pb-20">
        
        <!-- HEADER OVERVIEW STRIP -->
        <div class="via-[#FAF7F2] to-transparent dark:from-white/5 py-7 md:py-10 border-b border-[#EADFD2]/60 dark:border-white/10">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 ">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <!-- Customer Identity Pill -->
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#57251C] to-[#9C4738] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md shadow-[#57251C]/15 shrink-0 ring-4 ring-white dark:ring-[#1E1916]">
                  {{ userInitial }}
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <h1 class="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
                      {{ currentUser?.name || 'Customer Account' }}
                    </h1>
                    <span *ngIf="currentUser" class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50">
                      Verified Member
                    </span>
                  </div>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                    {{ currentUser?.email || 'Sign in to access your saved addresses & order history' }}
                  </p>
                </div>
              </div>

              <!-- Quick Metrics Row -->
              <div *ngIf="currentUser" class="flex items-center gap-2.5 sm:gap-4 overflow-x-auto pb-1 md:pb-0">
                <a routerLink="/my-orders" class="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-2xs hover:border-[#9C4738] transition flex items-center gap-3 shrink-0">
                  <div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm font-bold">
                    <i class="fa-solid fa-box-archive"></i>
                  </div>
                  <div>
                    <span class="text-[10px] uppercase font-bold text-[#7A6C5E] dark:text-[#C5A393] block">Orders</span>
                    <span class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED]">{{ orderCount }} Placed</span>
                  </div>
                </a>

                <button type="button" (click)="activeTab = 'addresses'" class="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-2xs hover:border-[#9C4738] transition flex items-center gap-3 shrink-0 cursor-pointer">
                  <div class="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-sm font-bold">
                    <i class="fa-solid fa-map-location-dot"></i>
                  </div>
                  <div class="text-left">
                    <span class="text-[10px] uppercase font-bold text-[#7A6C5E] dark:text-[#C5A393] block">Saved</span>
                    <span class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED]">{{ addresses.length }} Addresses</span>
                  </div>
                </button>

                <a routerLink="/cart" class="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 shadow-2xs hover:border-[#9C4738] transition flex items-center gap-3 shrink-0">
                  <div class="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-sm font-bold">
                    <i class="fa-solid fa-bag-shopping"></i>
                  </div>
                  <div>
                    <span class="text-[10px] uppercase font-bold text-[#7A6C5E] dark:text-[#C5A393] block">Cart</span>
                    <span class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED]">{{ cartService.totalItemsCount }} Items</span>
                  </div>
                </a>
              </div>

            </div>
          </div>
        </div>

        <!-- MAIN DASHBOARD CONTENT -->
        <main class="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 ">

          <!-- UN-AUTHENTICATED NOTICE -->
          <div *ngIf="!currentUser" class="py-16 text-center bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 max-w-lg mx-auto p-8 shadow-xs space-y-4">
            <div class="w-16 h-16 rounded-3xl bg-[#FAF7F2] dark:bg-white/5 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-3xl mx-auto">
              <i class="fa-solid fa-user-lock"></i>
            </div>
            <h2 class="font-serif font-bold text-2xl text-[#2E2825] dark:text-[#F4F1ED]">Log In to Manage Your Account</h2>
            <p class="text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
              Please sign in to access your profile details, manage saved delivery addresses, and track real-time courier updates.
            </p>
            <div class="flex flex-wrap justify-center gap-3 pt-2">
              <a routerLink="/login" class="px-7 py-3 rounded-full bg-[#9C4738] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#883B2D] transition shadow-md active:scale-95 cursor-pointer">
                Sign In to Account
              </a>
              <a routerLink="/register" class="px-7 py-3 rounded-full border border-[#EADFD2] dark:border-white/10 text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-stone-50 dark:hover:bg-white/5 transition active:scale-95 cursor-pointer">
                Create Account
              </a>
            </div>
          </div>

          <!-- AUTHENTICATED 2-COLUMN DASHBOARD (DESKTOP EFFICIENT / MOBILE RESPONSIVE) -->
          <div *ngIf="currentUser" class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            <!-- LEFT COLUMN: SIDEBAR / NAVIGATION (4 COLS) -->
            <div class="lg:col-span-4 space-y-4">
              
              <!-- Tab Navigation Card -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-3 sm:p-4 shadow-xs">
                
                <!-- Mobile Horizontal Tabs -->
                <div class="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-none">
                  <button
                    type="button"
                    (click)="activeTab = 'profile'"
                    [class]="activeTab === 'profile' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393]'"
                    class="min-h-[40px] px-4 py-2 rounded-xl text-xs flex items-center gap-2 whitespace-nowrap cursor-pointer transition"
                  >
                    <i class="fa-solid fa-user text-xs"></i>
                    <span>Profile Info</span>
                  </button>
                  <button
                    type="button"
                    (click)="activeTab = 'addresses'"
                    [class]="activeTab === 'addresses' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393]'"
                    class="min-h-[40px] px-4 py-2 rounded-xl text-xs flex items-center gap-2 whitespace-nowrap cursor-pointer transition"
                  >
                    <i class="fa-solid fa-map-location-dot text-xs"></i>
                    <span>Addresses ({{ addresses.length }})</span>
                  </button>
                  <button
                    type="button"
                    (click)="activeTab = 'security'"
                    [class]="activeTab === 'security' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393]'"
                    class="min-h-[40px] px-4 py-2 rounded-xl text-xs flex items-center gap-2 whitespace-nowrap cursor-pointer transition"
                  >
                    <i class="fa-solid fa-shield-halved text-xs"></i>
                    <span>Security</span>
                  </button>
                </div>

                <!-- Desktop Vertical Sidebar Menu -->
                <div class="hidden lg:flex flex-col space-y-1.5">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] px-3 py-1">Account Menu</span>
                  
                  <button
                    type="button"
                    (click)="activeTab = 'profile'"
                    [class]="activeTab === 'profile' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-[#251F1C] font-semibold'"
                    class="w-full px-4 py-3 rounded-2xl text-xs flex items-center justify-between cursor-pointer transition"
                  >
                    <span class="flex items-center gap-3">
                      <i class="fa-solid fa-user text-sm" [class.text-white]="activeTab === 'profile'" [class.text-[#9C4738]]="activeTab !== 'profile'"></i>
                      <span>Personal Profile</span>
                    </span>
                    <i class="fa-solid fa-chevron-right text-[10px] opacity-70"></i>
                  </button>

                  <button
                    type="button"
                    (click)="activeTab = 'addresses'"
                    [class]="activeTab === 'addresses' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-[#251F1C] font-semibold'"
                    class="w-full px-4 py-3 rounded-2xl text-xs flex items-center justify-between cursor-pointer transition"
                  >
                    <span class="flex items-center gap-3">
                      <i class="fa-solid fa-map-location-dot text-sm" [class.text-white]="activeTab === 'addresses'" [class.text-[#9C4738]]="activeTab !== 'addresses'"></i>
                      <span>Delivery Addresses</span>
                    </span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" [class]="activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393]'">
                      {{ addresses.length }}
                    </span>
                  </button>

                  <button
                    type="button"
                    (click)="activeTab = 'security'"
                    [class]="activeTab === 'security' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-[#251F1C] font-semibold'"
                    class="w-full px-4 py-3 rounded-2xl text-xs flex items-center justify-between cursor-pointer transition"
                  >
                    <span class="flex items-center gap-3">
                      <i class="fa-solid fa-shield-halved text-sm" [class.text-white]="activeTab === 'security'" [class.text-[#9C4738]]="activeTab !== 'security'"></i>
                      <span>Security &amp; Password</span>
                    </span>
                    <i class="fa-solid fa-chevron-right text-[10px] opacity-70"></i>
                  </button>

                  <div class="pt-3 my-1 border-t border-[#EADFD2]/60 dark:border-white/10">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] px-3 py-1">Quick Links</span>
                    
                    <a routerLink="/my-orders" class="w-full px-4 py-2.5 rounded-2xl text-xs text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-[#251F1C] font-semibold flex items-center justify-between transition">
                      <span class="flex items-center gap-3">
                        <i class="fa-solid fa-box-archive text-sm text-[#7A6C5E] dark:text-[#C5A393]"></i>
                        <span>Order History</span>
                      </span>
                      <span class="text-[10px] text-[#7A6C5E]">{{ orderCount }}</span>
                    </a>

                    <a routerLink="/my-custom-hampers" class="w-full px-4 py-2.5 rounded-2xl text-xs text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-[#251F1C] font-semibold flex items-center justify-between transition">
                      <span class="flex items-center gap-3">
                        <i class="fa-solid fa-wand-magic-sparkles text-sm text-purple-600"></i>
                        <span>Custom Hamper Requests</span>
                      </span>
                    </a>

                    <a routerLink="/shop" class="w-full px-4 py-2.5 rounded-2xl text-xs text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-[#251F1C] font-semibold flex items-center justify-between transition">
                      <span class="flex items-center gap-3">
                        <i class="fa-solid fa-gift text-sm text-[#9C4738]"></i>
                        <span>Continue Shopping</span>
                      </span>
                    </a>

                    <a routerLink="/terms" class="w-full px-4 py-2.5 rounded-2xl text-xs text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] dark:hover:bg-[#251F1C] font-semibold flex items-center justify-between transition">
                      <span class="flex items-center gap-3">
                        <i class="fa-solid fa-scale-balanced text-sm text-[#7A6C5E] dark:text-[#C5A393]"></i>
                        <span>Customer Policies &amp; Trust</span>
                      </span>
                    </a>
                  </div>

                  <!-- Sign Out Button -->
                  <div class="pt-2 border-t border-[#EADFD2]/60 dark:border-white/10">
                    <button
                      type="button"
                      (click)="promptSignOut()"
                      class="w-full px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-3 transition cursor-pointer"
                    >
                      <i class="fa-solid fa-right-from-bracket text-sm"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>

                </div>

              </div>

              <!-- Assistance Quick Box -->
              <div class="bg-gradient-to-br from-[#FAF7F2] to-[#F3E7DC]/50 dark:from-[#1E1916] dark:to-[#251F1C] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 space-y-2 text-xs">
                <div class="flex items-center gap-2 text-[#9C4738] dark:text-[#EB9D8E] font-bold">
                  <i class="fa-solid fa-headset text-sm"></i>
                  <span>Need Gifting Help?</span>
                </div>
                <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
                  Have special delivery requests or corporate hamper inquiries? Chat with our team on WhatsApp.
                </p>
                <a
                  href="https://wa.me/919284905118?text=Hi%20RMS%20Creations!%20I%20have%20an%20inquiry%20regarding%20my%20account."
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                >
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  <span>Chat on WhatsApp (+91 92849 05118)</span>
                </a>
              </div>

            </div>

            <!-- RIGHT COLUMN: CONTENT PANE (8 COLS) -->
            <div class="lg:col-span-8">

              <!-- TAB 1: PERSONAL PROFILE FORM -->
              <div *ngIf="activeTab === 'profile'" class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div>
                    <h2 class="font-serif font-bold text-lg sm:text-xl text-[#2E2825] dark:text-[#F4F1ED]">
                      Personal Information
                    </h2>
                    <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                      Update your contact information for order confirmation and shipping updates.
                    </p>
                  </div>
                  <span *ngIf="profileSuccess" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5 shrink-0 animate-fade-in">
                    <i class="fa-solid fa-circle-check text-xs"></i>
                    <span>Profile saved successfully</span>
                  </span>
                </div>

                <form (ngSubmit)="saveProfile()" class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    
                    <!-- Full Name -->
                    <div>
                      <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                        Full Name <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="profileName"
                        name="profileName"
                        required
                        placeholder="Radhika Sharma"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] transition"
                      />
                    </div>

                    <!-- Email Address (Read-only ID) -->
                    <div>
                      <div class="flex items-center justify-between mb-1.5">
                        <label class="font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Email Address</label>
                        <span class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">Account ID</span>
                      </div>
                      <input
                        type="email"
                        [value]="currentUser.email"
                        disabled
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-stone-100 dark:bg-stone-900 text-stone-500 text-xs outline-none cursor-not-allowed"
                      />
                    </div>

                    <!-- Mobile Number -->
                    <div>
                      <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                        Mobile Number (for SMS &amp; WhatsApp updates)
                      </label>
                      <input
                        type="tel"
                        maxlength="10"
                        inputmode="numeric"
                        autocomplete="tel"
                        [(ngModel)]="profilePhone"
                        name="profilePhone"
                        placeholder="10-digit mobile number"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs font-mono text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] transition"
                      />
                    </div>

                    <!-- Gender Selection -->
                    <div>
                      <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                        Gender
                      </label>
                      <select
                        [(ngModel)]="profileGender"
                        name="profileGender"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] transition cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>

                    <!-- Date of Birth -->
                    <div>
                      <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        [(ngModel)]="profileDob"
                        name="profileDob"
                        class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] transition"
                      />
                    </div>

                  </div>

                  <div class="pt-4 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      [disabled]="savingProfile || !profileName.trim()"
                      class="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] dark:hover:bg-[#DD8776] text-white text-xs font-bold transition shadow-sm hover:shadow active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      <span *ngIf="savingProfile" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
                      <span>{{ savingProfile ? 'Saving...' : 'Save Profile Changes' }}</span>
                    </button>
                  </div>
                </form>

              </div>

              <!-- TAB 2: SAVED ADDRESS BOOK -->
              <div *ngIf="activeTab === 'addresses'" class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
                
                <div class="flex items-center justify-between pb-4 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div>
                    <h2 class="font-serif font-bold text-lg sm:text-xl text-[#2E2825] dark:text-[#F4F1ED]">
                      Saved Delivery Addresses
                    </h2>
                    <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                      Quickly select your home, work, or celebration gift delivery destinations during checkout.
                    </p>
                  </div>

                  <button
                    *ngIf="!showAddressModal"
                    type="button"
                    (click)="openAddAddress()"
                    class="min-h-[40px] px-4 py-2 rounded-xl bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <i class="fa-solid fa-plus text-[10px]"></i>
                    <span>Add New Address</span>
                  </button>
                </div>

                <!-- Address Cards Grid -->
                <div *ngIf="addresses.length > 0 && !showAddressModal" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    *ngFor="let addr of addresses"
                    class="p-4.5 rounded-2xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] flex flex-col justify-between space-y-3 relative hover:border-[#9C4738]/50 transition"
                  >
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider" [ngClass]="addr.address_type === 'Home' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300'">
                          {{ addr.address_type }}
                        </span>
                        <span *ngIf="addr.is_default" class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <i class="fa-solid fa-circle-check"></i> Default
                        </span>
                      </div>

                      <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] mt-2.5 leading-snug">
                        {{ addr.address }}
                      </p>
                      <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-1">
                        {{ addr.city }}, {{ addr.state }} &bull; <strong class="font-mono text-[#2E2825] dark:text-[#F4F1ED]">{{ addr.pin_code }}</strong>
                      </p>
                    </div>

                    <div class="pt-2.5 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-between text-xs">
                      <button type="button" (click)="editAddress(addr)" class="font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline cursor-pointer py-1 flex items-center gap-1">
                        <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                        <span>Edit</span>
                      </button>
                      <button type="button" (click)="deleteAddress(addr)" class="font-bold text-rose-600 hover:text-rose-700 cursor-pointer py-1 flex items-center gap-1">
                        <i class="fa-solid fa-trash-can text-[11px]"></i>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty Addresses State -->
                <div *ngIf="addresses.length === 0 && !showAddressModal" class="py-12 text-center text-xs text-[#7A6C5E] dark:text-[#C5A393] space-y-3 bg-[#FAF7F2] dark:bg-[#251F1C] rounded-2xl border border-dashed border-[#EADFD2] dark:border-white/10 p-6">
                  <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl mx-auto">
                    <i class="fa-solid fa-map-location-dot"></i>
                  </div>
                  <h3 class="font-serif font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">No Saved Addresses Yet</h3>
                  <p class="text-[11px] max-w-sm mx-auto">Add your home or office address to save time when placing orders.</p>
                  <button type="button" (click)="openAddAddress()" class="min-h-[40px] px-5 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition cursor-pointer">
                    + Add Your First Address
                  </button>
                </div>

                <!-- Inline Add / Edit Address Form Modal Pane -->
                <div *ngIf="showAddressModal" class="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 space-y-4 animate-fade-in">
                  <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                      {{ currentAddress.customer_address_id ? 'Edit Saved Address' : 'New Delivery Address' }}
                    </h3>
                    <button type="button" (click)="showAddressModal = false" class="text-xs text-[#7A6C5E] hover:underline cursor-pointer">
                      Cancel
                    </button>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">Address Type</label>
                      <select [(ngModel)]="currentAddress.address_type" class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none">
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">6-Digit PIN Code *</label>
                      <input type="text" maxlength="6" inputmode="numeric" autocomplete="postal-code" [(ngModel)]="currentAddress.pin_code" placeholder="411038" class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs font-mono font-bold text-[#2E2825] dark:text-[#F4F1ED] outline-none" />
                    </div>

                    <div class="sm:col-span-2">
                      <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">Street Address / House No. / Landmark *</label>
                      <textarea [(ngModel)]="currentAddress.address" autocomplete="street-address" rows="2" placeholder="Flat No., Wing, Building Name, Street..." class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none"></textarea>
                    </div>

                    <div>
                      <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">City *</label>
                      <input type="text" [(ngModel)]="currentAddress.city" autocomplete="address-level2" placeholder="Pune" class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none" />
                    </div>

                    <div>
                      <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">State *</label>
                      <input type="text" [(ngModel)]="currentAddress.state" autocomplete="address-level1" placeholder="Maharashtra" class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none" />
                    </div>

                    <div class="sm:col-span-2 flex items-center gap-2 pt-1">
                      <input type="checkbox" id="addrDefaultCheck" [(ngModel)]="currentAddress.is_default" class="h-4 w-4 rounded border-[#EADFD2] text-[#9C4738] cursor-pointer" />
                      <label for="addrDefaultCheck" class="text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] cursor-pointer">
                        Set as primary default delivery address
                      </label>
                    </div>
                  </div>

                  <div *ngIf="addressError" class="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium border border-rose-200">
                    {{ addressError }}
                  </div>

                  <div class="pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 flex justify-end gap-2.5">
                    <button type="button" (click)="showAddressModal = false" class="px-4 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs font-semibold text-[#7A6C5E] cursor-pointer">
                      Cancel
                    </button>
                    <button type="button" (click)="saveAddress()" [disabled]="savingAddress" class="px-5 py-2 rounded-xl bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer">
                      {{ savingAddress ? 'Saving...' : 'Save Address' }}
                    </button>
                  </div>
                </div>

              </div>

              <!-- TAB 3: SECURITY & PASSWORD -->
              <div *ngIf="activeTab === 'security'" class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
                
                <div class="pb-4 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <h2 class="font-serif font-bold text-lg sm:text-xl text-[#2E2825] dark:text-[#F4F1ED]">
                    Security &amp; Account Access
                  </h2>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                    Manage your credentials, password reset requests, and authenticated session.
                  </p>
                </div>

                <div class="space-y-4">
                  <!-- Password Reset Section -->
                  <div class="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 class="font-bold text-xs sm:text-sm text-[#2E2825] dark:text-[#F4F1ED] flex items-center gap-2">
                        <i class="fa-solid fa-key text-[#9C4738]"></i>
                        <span>Change Account Password</span>
                      </h3>
                      <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1 leading-relaxed">
                        We will send a secure password reset link to your registered email (<strong>{{ currentUser.email }}</strong>).
                      </p>
                    </div>

                    <button
                      type="button"
                      (click)="sendPasswordReset()"
                      [disabled]="resetSent"
                      class="px-5 py-2.5 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] dark:hover:bg-[#DD8776] text-white text-xs font-bold transition shadow-xs disabled:opacity-50 shrink-0 cursor-pointer"
                    >
                      {{ resetSent ? 'Reset Link Sent!' : 'Send Reset Link' }}
                    </button>
                  </div>

                  <!-- Feedback Alert -->
                  <div *ngIf="resetMessage" class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>{{ resetMessage }}</span>
                  </div>

                  <!-- Active Session Info -->
                  <div class="p-4 rounded-2xl bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 text-xs space-y-2">
                    <span class="text-[10px] uppercase font-bold text-[#7A6C5E] dark:text-[#C5A393]">Active Session Protocol</span>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
                      Your session is secured using encrypted JWT tokens via Supabase Auth with Row-Level Security on all database records.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <!-- TRUST ASSURANCES FOOTER STRIP -->
          <div class="mt-8 bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 sm:p-6 shadow-xs">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#9C4738]/10 text-[#9C4738] flex items-center justify-center text-sm shrink-0">
                  <i class="fa-solid fa-truck-fast"></i>
                </div>
                <div>
                  <strong class="font-bold block text-[#2E2825] dark:text-[#F4F1ED]">India-Wide Courier</strong>
                  <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Swift dispatch via Blue Dart &amp; Delhivery</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-sm shrink-0">
                  <i class="fa-solid fa-qrcode"></i>
                </div>
                <div>
                  <strong class="font-bold block text-[#2E2825] dark:text-[#F4F1ED]">Direct UPI &amp; COD</strong>
                  <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Pay to 7350120467&#64;upi or COD upon arrival</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-sm shrink-0">
                  <i class="fa-solid fa-shield-heart"></i>
                </div>
                <div>
                  <strong class="font-bold block text-[#2E2825] dark:text-[#F4F1ED]">Artisan Finished</strong>
                  <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">100% handcrafted packaging standard</span>
                </div>
              </div>
            </div>
          </div>

        </main>

      </div>
    </app-site-layout>
  `
})
export class MyAccountPageComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(CustomerAddressService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly supabase = inject(SupabaseService);
  public readonly cartService = inject(CartService);

  currentUser: UserProfile | null = null;
  private authSub?: Subscription;

  activeTab: AccountTab = 'profile';

  // Profile Form
  profileName = '';
  profilePhone = '';
  profileGender = '';
  profileDob = '';
  savingProfile = false;
  profileSuccess = false;

  // Address Book
  addresses: CustomerAddress[] = [];
  showAddressModal = false;
  savingAddress = false;
  addressError = '';
  currentAddress: CustomerAddress = {
    address_type: 'Home',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pin_code: '',
    is_default: false
  };

  orderCount = 0;
  resetSent = false;
  resetMessage = '';

  get userInitial(): string {
    if (this.currentUser?.name) {
      return this.currentUser.name.trim().charAt(0).toUpperCase();
    }
    if (this.currentUser?.email) {
      return this.currentUser.email.charAt(0).toUpperCase();
    }
    return 'C';
  }

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'My Account — RMS Creations Gift Hampers',
      description: 'Manage your profile, view order history, and maintain your saved address book.',
      keywords: 'my account, customer profile, address book, rms creations',
      slug: 'my-account'
    });

    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileName = user.name || '';
        this.profilePhone = user.phone_no || '';
        this.profileGender = user.gender || '';
        this.profileDob = user.date_of_birth ? user.date_of_birth.split('T')[0] : '';
        this.loadAddresses(user.id);
      }
      this.cdr.markForCheck();
    });

    const orders = this.localStorage.getItem<any[]>('rms_my_orders') || [];
    this.orderCount = orders.length;
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async loadAddresses(userId?: number) {
    if (!userId) return;
    try {
      this.addresses = await this.addressService.getCustomerAddresses(userId);
      this.cdr.markForCheck();
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  }

  async saveProfile() {
    if (!this.profileName.trim()) return;
    this.savingProfile = true;
    try {
      await this.authService.updateProfile({
        name: this.profileName.trim(),
        phone_no: this.profilePhone.trim(),
        gender: (this.profileGender as any) || '',
        date_of_birth: this.profileDob || null
      });
      this.profileSuccess = true;
      setTimeout(() => { this.profileSuccess = false; this.cdr.markForCheck(); }, 3000);
    } finally {
      this.savingProfile = false;
      this.cdr.markForCheck();
    }
  }

  openAddAddress() {
    this.currentAddress = {
      address_type: 'Home',
      address: '',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pin_code: '',
      is_default: this.addresses.length === 0
    };
    this.addressError = '';
    this.showAddressModal = true;
  }

  editAddress(addr: CustomerAddress) {
    this.currentAddress = { ...addr };
    this.addressError = '';
    this.showAddressModal = true;
  }

  async saveAddress() {
    if (!this.currentUser?.id) return;
    this.savingAddress = true;
    this.addressError = '';

    try {
      const res = await this.addressService.saveAddress(this.currentUser.id, this.currentAddress);
      if (res.error) {
        this.addressError = res.error;
        return;
      }
      this.showAddressModal = false;
      await this.loadAddresses(this.currentUser.id);
    } catch (err: any) {
      this.addressError = err?.message || 'Error saving address.';
    } finally {
      this.savingAddress = false;
      this.cdr.markForCheck();
    }
  }

  async deleteAddress(addr: CustomerAddress) {
    if (!this.currentUser?.id || !addr.customer_address_id) return;
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await this.addressService.deleteAddress(this.currentUser.id, addr.customer_address_id);
      await this.loadAddresses(this.currentUser.id);
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  }

  async sendPasswordReset() {
    if (!this.currentUser?.email) return;
    try {
      this.resetSent = true;
      const { error } = await this.supabase.resetPasswordForEmail(this.currentUser.email);
      if (error) throw error;
      this.resetMessage = `Password reset instructions have been sent to ${this.currentUser.email}.`;
    } catch (err: any) {
      this.resetMessage = err?.message || 'Failed to send password reset email. Please try again.';
      this.resetSent = false;
    } finally {
      this.cdr.markForCheck();
    }
  }

  promptSignOut() {
    this.authService.promptLogout();
  }

  async signOut() {
    try {
      await this.authService.signOut();
    } catch (e) {
      console.warn('Sign-out completed with warning:', e);
    } finally {
      this.router.navigate(['/login']);
    }
  }
}
