import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { CartService } from '../services/cart.service';
import { AuthService, UserProfile } from '../services/auth.service';
import { CustomerAddressService, CustomerAddress } from '../services/customer-address.service';
import { PinCodeAvailabilityService, DeliveryCheckResult } from '../services/pin-code-availability.service';
import { SupabaseService } from '../services/supabase.service';
import { LocalStorageService } from '../services/local-storage.service';
import { OrderTrackingService } from '../shared/order-tracking.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-24">

        <!-- HEADER -->
        <div class="bg-gradient-to-b from-[#F3E7DC]/60 to-transparent dark:from-white/5 py-8 border-b border-[#EADFD2]/60 dark:border-white/10">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-xl">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E]">Secure Checkout</span>
            <h1 class="mt-1 font-serif text-3xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
              Delivery &amp; Payment
            </h1>
            <p class="mt-1 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
              Authentic handcrafted gifts packed with care and dispatched on schedule.
            </p>
          </div>
        </div>

        <main class="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 max-w-7xl">

          <!-- GUARD: EMPTY CART NOTICE -->
          <div *ngIf="cartService.items.length === 0" class="py-16 text-center max-w-md mx-auto bg-white dark:bg-[#1E1916] rounded-3xl p-8 border border-[#EADFD2] dark:border-white/10 shadow-xs">
            <i class="fa-solid fa-cart-shopping text-3xl text-[#9C4738] mb-3 block"></i>
            <h2 class="font-serif font-bold text-xl text-[#2E2825] dark:text-[#F4F1ED]">Your cart is empty</h2>
            <p class="mt-2 text-xs text-[#7A6C5E] dark:text-[#C5A393]">Please add products to your cart before proceeding to checkout.</p>
            <a routerLink="/shop" class="mt-5 inline-block px-6 py-2.5 rounded-full bg-[#9C4738] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#883B2D] transition">
              Browse Hampers
            </a>
          </div>

          <!-- CHECKOUT FORM & SUMMARY -->
          <div *ngIf="cartService.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <!-- LEFT 7 COLS: AUTHENTICATION + ADDRESS + PAYMENT -->
            <div class="lg:col-span-7 space-y-6">

              <!-- STEP 1: MANDATORY CUSTOMER AUTHENTICATION -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-[#9C4738] text-white text-xs font-bold flex items-center justify-center">1</span>
                    <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">Customer Authentication</h2>
                  </div>
                  <span *ngIf="currentUser" class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5">
                    <i class="fa-solid fa-check text-[10px]"></i> Logged In
                  </span>
                </div>

                <!-- Unauthenticated State: Gate with Login/Register & Google -->
                <div *ngIf="!currentUser" class="space-y-4">
                  <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                    <i class="fa-solid fa-shield-halved text-amber-600 text-base mt-0.5 shrink-0"></i>
                    <div>
                      <strong class="font-bold block">Account Required For Order Placement</strong>
                      <span class="text-[11px] leading-relaxed">
                        To protect your order confirmation, invoice, and courier tracking, please sign in or create an account. Your cart items are saved and you'll return straight to this checkout.
                      </span>
                    </div>
                  </div>

                  <!-- Google One-Click Sign In -->
                  <button
                    type="button"
                    (click)="loginWithGoogle()"
                    class="w-full py-3 px-4 bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl text-xs sm:text-sm font-semibold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-stone-50 dark:hover:bg-white/5 transition flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer active:scale-98"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <a
                      [routerLink]="['/login']"
                      [queryParams]="{ returnUrl: '/checkout' }"
                      class="w-full py-2.5 px-4 text-center rounded-xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#F3E7DC] transition cursor-pointer"
                    >
                      Sign In with Email
                    </a>
                    <a
                      [routerLink]="['/register']"
                      [queryParams]="{ returnUrl: '/checkout' }"
                      class="w-full py-2.5 px-4 text-center rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition shadow-xs cursor-pointer"
                    >
                      Create Free Account
                    </a>
                  </div>
                </div>

                <!-- Authenticated State: User info summary & profile completion -->
                <div *ngIf="currentUser" class="space-y-3">
                  <div class="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/70 dark:border-white/10 text-xs">
                    <div>
                      <p class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ currentUser.name }}</p>
                      <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">{{ currentUser.email }} &bull; {{ currentUser.phone_no || 'No mobile saved' }}</p>
                    </div>
                    <span class="text-[10px] font-bold text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider">
                      {{ currentUser.role }}
                    </span>
                  </div>

                  <!-- Missing required profile details check (Gender, DOB) -->
                  <div *ngIf="!currentUser.gender || !currentUser.date_of_birth" class="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/30 text-xs space-y-3">
                    <div class="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
                      <i class="fa-solid fa-circle-exclamation text-amber-600"></i>
                      <span>Please complete missing profile details to finalize your customer record:</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[11px] font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">Gender *</label>
                        <select
                          [(ngModel)]="profileGender"
                          class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-[11px] font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">Date of Birth *</label>
                        <input
                          type="date"
                          [(ngModel)]="profileDob"
                          class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none"
                        />
                      </div>
                    </div>

                    <div class="flex justify-end pt-1">
                      <button
                        type="button"
                        (click)="saveProfileDetails()"
                        [disabled]="!profileGender || !profileDob || savingProfile"
                        class="px-4 py-1.5 rounded-xl bg-[#9C4738] text-white text-[11px] font-bold hover:bg-[#883B2D] transition disabled:opacity-50 cursor-pointer"
                      >
                        {{ savingProfile ? 'Saving...' : 'Update Profile' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STEP 2: SAVED ADDRESS SELECTION & DELIVERY VALIDATION -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-[#9C4738] text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">Delivery Address</h2>
                  </div>
                  <button
                    *ngIf="currentUser && !showNewAddressForm"
                    type="button"
                    (click)="showNewAddressForm = true"
                    class="text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <i class="fa-solid fa-plus text-[10px]"></i> Add New Address
                  </button>
                </div>

                <!-- Customer's Saved Addresses List -->
                <div *ngIf="currentUser && savedAddresses.length > 0 && !showNewAddressForm" class="space-y-3">
                  <label class="block text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-2">Select a saved shipping address:</label>
                  <div class="grid grid-cols-1 gap-3">
                    <div
                      *ngFor="let addr of savedAddresses"
                      (click)="selectAddress(addr)"
                      class="p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between"
                      [ngClass]="selectedAddressId === addr.customer_address_id ? 'border-[#9C4738] bg-[#F3E7DC]/30 dark:bg-white/10 ring-2 ring-[#9C4738]/20' : 'border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C]'"
                    >
                      <div class="flex items-start gap-3">
                        <span class="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                              [ngClass]="selectedAddressId === addr.customer_address_id ? 'border-[#9C4738] bg-[#9C4738]' : 'border-stone-400'">
                          <i *ngIf="selectedAddressId === addr.customer_address_id" class="fa-solid fa-check text-[9px] text-white"></i>
                        </span>
                        <div>
                          <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase" [ngClass]="addr.address_type === 'Home' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-800'">
                              {{ addr.address_type }}
                            </span>
                            <span *ngIf="addr.is_default" class="text-[10px] text-emerald-600 font-bold">Default</span>
                          </div>
                          <p class="text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] mt-1">{{ addr.address }}</p>
                          <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">{{ addr.city }}, {{ addr.state }} - <strong class="font-mono text-[#2E2825] dark:text-[#F4F1ED]">{{ addr.pin_code }}</strong></p>
                        </div>
                      </div>

                      <button
                        type="button"
                        (click)="editAddress(addr, $event)"
                        class="text-xs text-[#7A6C5E] hover:text-[#9C4738] p-1 cursor-pointer"
                        title="Edit Address"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Add / Edit Address Form -->
                <div *ngIf="showNewAddressForm || !currentUser || savedAddresses.length === 0" class="space-y-4 pt-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                      {{ editingAddressId ? 'Edit Address' : 'Enter Shipping Details' }}
                    </h3>
                    <button
                      *ngIf="savedAddresses.length > 0"
                      type="button"
                      (click)="cancelAddressForm()"
                      class="text-xs text-[#7A6C5E] hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <!-- Name and Phone for delivery contact -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        Recipient Name <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        [(ngModel)]="customerName"
                        autocomplete="name"
                        placeholder="e.g. Radhika Sharma"
                        class="w-full min-h-[42px] px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        Mobile Number <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        inputmode="numeric"
                        autocomplete="tel"
                        maxlength="10"
                        [(ngModel)]="customerPhone"
                        placeholder="10-digit mobile"
                        class="w-full min-h-[42px] px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] font-mono outline-none focus:border-[#9C4738]"
                      />
                    </div>
                  </div>

                  <!-- Street Address -->
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                      Street Address &amp; Flat/House No. <span class="text-rose-500">*</span>
                    </label>
                    <textarea
                      [(ngModel)]="customerAddress"
                      autocomplete="street-address"
                      rows="2"
                      placeholder="e.g. Flat 304, Green Heights, Linking Road, Bandra West"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
                    ></textarea>
                  </div>

                  <!-- City, State, PIN -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">City <span class="text-rose-500">*</span></label>
                      <input
                        type="text"
                        [(ngModel)]="customerCity"
                        autocomplete="address-level2"
                        placeholder="e.g. Mumbai"
                        class="w-full min-h-[42px] px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">State <span class="text-rose-500">*</span></label>
                      <input
                        type="text"
                        [(ngModel)]="customerState"
                        autocomplete="address-level1"
                        placeholder="Maharashtra"
                        class="w-full min-h-[42px] px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
                        PIN Code (6 digits) <span class="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        inputmode="numeric"
                        autocomplete="postal-code"
                        [(ngModel)]="customerPin"
                        (ngModelChange)="onPinChange($event)"
                        maxlength="6"
                        placeholder="e.g. 400050"
                        class="w-full min-h-[42px] px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs font-mono font-bold text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
                      />
                    </div>
                  </div>

                  <!-- Address Type Selector & Save to Address Book Toggle -->
                  <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Address Type:</span>
                      <button
                        type="button"
                        *ngFor="let t of ['Home', 'Work', 'Other']"
                        (click)="addressType = t"
                        class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer"
                        [ngClass]="addressType === t ? 'bg-[#9C4738] text-white border-[#9C4738]' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] border-[#EADFD2] dark:border-white/10'"
                      >
                        {{ t }}
                      </button>
                    </div>

                    <div *ngIf="currentUser" class="flex items-center gap-2">
                      <input type="checkbox" id="saveAddrCheck" [(ngModel)]="saveAddressToBook" class="h-4 w-4 rounded border-[#EADFD2] text-[#9C4738] cursor-pointer" />
                      <label for="saveAddrCheck" class="text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] cursor-pointer">
                        Save to my address book
                      </label>
                    </div>
                  </div>

                </div>

                <!-- PIN Code Serviceability Banner -->
                <div *ngIf="deliveryCheckResult" class="p-3.5 rounded-2xl border text-xs transition-all"
                     [ngClass]="deliveryCheckResult.isServiceable ? 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200' : 'bg-rose-50/80 dark:bg-rose-950/25 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200'">
                  <div class="flex items-start gap-2.5">
                    <i class="fa-solid text-sm mt-0.5 shrink-0" [ngClass]="deliveryCheckResult.isServiceable ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark text-rose-600'"></i>
                    <div class="space-y-1">
                      <p class="font-bold">{{ deliveryCheckResult.message }}</p>
                      <div *ngIf="deliveryCheckResult.isServiceable" class="text-[11px] text-emerald-800 dark:text-emerald-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>Courier: <strong>{{ deliveryCheckResult.courierService || 'Express DTDC' }}</strong></span>
                        <span>Estimated Weight: <strong>{{ cartService.totalWeightKg }} kg</strong></span>
                        <span>Shipping Fee: <strong>{{ deliveryCheckResult.freeDeliveryApplied ? 'FREE' : '₹' + deliveryCheckResult.calculatedDeliveryFee }}</strong></span>
                      </div>
                      <p *ngIf="!deliveryCheckResult.isServiceable" class="text-[11px] text-rose-700 dark:text-rose-300">
                        Orders can only be accepted for serviceable PIN codes configured in our delivery network.
                      </p>
                    </div>
                  </div>
                </div>

                <div *ngIf="isCheckingPin" class="text-xs text-[#7A6C5E] flex items-center gap-2">
                  <i class="fa-solid fa-spinner fa-spin text-[#9C4738]"></i>
                  <span>Checking postal delivery coverage...</span>
                </div>

              </div>

              <!-- STEP 3: PAYMENT METHOD SELECTION -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-7 shadow-xs space-y-4">
                <div class="flex items-center gap-2.5 pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <span class="w-6 h-6 rounded-full bg-[#9C4738] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">Payment Selection</h2>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <!-- COD Option -->
                  <div
                    (click)="paymentMode = 'COD'"
                    [class]="paymentMode === 'COD' ? 'border-[#9C4738] bg-[#F3E7DC]/30 dark:bg-white/10 ring-2 ring-[#9C4738]/20' : 'border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C]'"
                    class="p-4 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2.5">
                        <i class="fa-solid fa-hand-holding-dollar text-base text-[#9C4738]"></i>
                        <span class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED]">Cash on Delivery</span>
                      </div>
                      <span class="w-4 h-4 rounded-full border flex items-center justify-center" [class.bg-[#9C4738]]="paymentMode === 'COD'" [class.border-[#9C4738]]="paymentMode === 'COD'">
                        <i *ngIf="paymentMode === 'COD'" class="fa-solid fa-check text-[9px] text-white"></i>
                      </span>
                    </div>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-2.5">
                      Pay cash to delivery courier upon receiving your gift parcel.
                    </p>
                  </div>

                  <!-- Free UPI Option (Payment Number: 7350120467) -->
                  <div
                    (click)="paymentMode = 'ONLINE_UPI'"
                    [class]="paymentMode === 'ONLINE_UPI' ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/20 ring-2 ring-emerald-500/30' : 'border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C]'"
                    class="p-4 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2.5">
                        <i class="fa-solid fa-qrcode text-base text-emerald-600"></i>
                        <span class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED]">Online UPI (0% Fee)</span>
                      </div>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white uppercase">
                        Free
                      </span>
                    </div>
                    <p class="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2.5">
                      Direct UPI transfer to <strong>7350120467</strong> (GPay / PhonePe / Paytm).
                    </p>
                  </div>
                </div>

                <!-- UPI Details Box -->
                <div *ngIf="paymentMode === 'ONLINE_UPI'" class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-3.5">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <i class="fa-solid fa-circle-check text-emerald-600"></i>
                      Payable: ₹{{ cartService.finalTotal }}
                    </span>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Payment Mobile: 7350120467
                    </span>
                  </div>

                  <div class="p-3 bg-white dark:bg-[#1E1916] rounded-xl border border-emerald-200/80 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Receiver UPI ID / Number:</span>
                      <p class="font-mono font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED] mt-0.5">
                        7350120467&#64;upi
                      </p>
                    </div>
                    <button
                      type="button"
                      (click)="copyUpi()"
                      class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition cursor-pointer"
                    >
                      {{ upiCopied ? 'Copied!' : 'Copy UPI' }}
                    </button>
                  </div>

                  <div class="flex flex-col sm:flex-row items-center gap-3.5 p-2 bg-white/70 dark:bg-white/5 rounded-xl">
                    <img
                      [src]="qrCodeUrl"
                      alt="UPI QR Code"
                      class="w-32 h-32 rounded-lg border border-emerald-200 shrink-0"
                    />
                    <div class="space-y-2 flex-1 w-full text-xs">
                      <p class="text-[11px] text-emerald-900 dark:text-emerald-200 font-medium">
                        Scan with GPay, PhonePe, Paytm, or BHIM. Or open directly:
                      </p>
                      <div class="grid grid-cols-2 gap-2">
                        <a [href]="upiDeepLink" class="p-2 rounded-xl bg-white dark:bg-white/10 border border-emerald-300 font-bold text-[11px] text-emerald-800 dark:text-emerald-300 text-center hover:bg-emerald-50">
                          <i class="fa-brands fa-google-pay mr-1"></i> Google Pay
                        </a>
                        <a [href]="upiDeepLink" class="p-2 rounded-xl bg-white dark:bg-white/10 border border-emerald-300 font-bold text-[11px] text-emerald-800 dark:text-emerald-300 text-center hover:bg-emerald-50">
                          <i class="fa-solid fa-mobile-screen-button mr-1"></i> PhonePe
                        </a>
                      </div>

                      <div class="pt-1">
                        <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-0.5">
                          12-Digit UPI Reference / UTR (Optional):
                        </label>
                        <input
                          type="text"
                          [(ngModel)]="utrNumber"
                          placeholder="e.g. 429810294829"
                          class="w-full px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <!-- RIGHT 5 COLS: SUMMARY & PLACE ORDER BUTTON (STICKY ON DESKTOP) -->
            <div class="lg:col-span-5 space-y-4 lg:sticky lg:top-24">

              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 shadow-xs space-y-4">

                <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED] pb-3 border-b border-[#EADFD2]/60 dark:border-white/10 flex justify-between items-center">
                  <span>Order Items</span>
                  <span class="text-xs font-sans font-normal text-[#7A6C5E] dark:text-[#C5A393]">{{ cartService.totalItemsCount }} item(s)</span>
                </h2>

                <!-- Items Snapshot List -->
                <div class="divide-y divide-[#EADFD2]/60 dark:divide-white/10 max-h-64 overflow-y-auto pr-1">
                  <div *ngFor="let item of cartService.items" class="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <img [src]="item.image || 'assets/banners/banner.png'" [alt]="item.title" class="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0 border" />
                      <div class="truncate">
                        <p class="font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ item.title }}</p>
                        <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Qty: {{ item.quantity }} &bull; {{ item.weight_kg || 0.5 }}kg</span>
                      </div>
                    </div>
                    <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED] shrink-0">₹{{ item.price * item.quantity }}</span>
                  </div>
                </div>

                <!-- Price Breakdown -->
                <div class="pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 space-y-2 text-xs">
                  <div class="flex justify-between text-[#7A6C5E] dark:text-[#C5A393]">
                    <span>Items Subtotal:</span>
                    <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">₹{{ cartService.subtotal }}</span>
                  </div>
                  <div class="flex justify-between text-[#7A6C5E] dark:text-[#C5A393]">
                    <span>Total Parcel Weight:</span>
                    <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ cartService.totalWeightKg }} kg</span>
                  </div>
                  <div class="flex justify-between text-[#7A6C5E] dark:text-[#C5A393]">
                    <span>Delivery Charges:</span>
                    <span *ngIf="cartService.deliveryFee === 0" class="font-bold text-emerald-600">FREE</span>
                    <span *ngIf="cartService.deliveryFee > 0" class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">₹{{ cartService.deliveryFee }}</span>
                  </div>
                  <div class="pt-2 border-t border-[#EADFD2]/60 dark:border-white/10 flex justify-between items-baseline">
                    <span class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">Total Payable:</span>
                    <span class="font-serif font-bold text-2xl text-[#9C4738] dark:text-[#EB9D8E]">₹{{ cartService.finalTotal }}</span>
                  </div>
                </div>

                <!-- Submission Error Notice -->
                <div *ngIf="errorMessage" class="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium border border-rose-200">
                  <i class="fa-solid fa-triangle-exclamation mr-1"></i> {{ errorMessage }}
                </div>

                <!-- PLACE ORDER BUTTON (DUPLICATE SUBMISSION PROTECTED) -->
                <div class="pt-2">
                  <button
                    type="button"
                    (click)="confirmAndPlaceOrder()"
                    [disabled]="isSubmitting || !canPlaceOrder"
                    class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#57251C] to-[#9C4738] hover:from-[#451B14] hover:to-[#883B2D] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <i class="fa-solid" [ngClass]="isSubmitting ? 'fa-spinner fa-spin' : 'fa-shield-halved'"></i>
                    <span>{{ isSubmitting ? 'Placing Order...' : ('Place Order (₹' + cartService.finalTotal + ')') }}</span>
                  </button>

                  <p *ngIf="!currentUser" class="text-[11px] text-amber-700 dark:text-amber-300 text-center mt-2 font-medium">
                    * Please sign in or register above to confirm your order.
                  </p>
                  <p *ngIf="currentUser && deliveryCheckResult && !deliveryCheckResult.isServiceable" class="text-[11px] text-rose-600 text-center mt-2 font-medium">
                    * PIN code {{ customerPin }} is currently unserviceable.
                  </p>

                  <!-- Legal Pre-Purchase Agreement Notice -->
                  <p class="text-[10px] text-center text-[#7A6C5E] dark:text-[#C5A393] mt-2.5 leading-relaxed">
                    By placing this order, you agree to our
                    <a routerLink="/terms" target="_blank" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Terms of Service</a>,
                    <a routerLink="/privacy" target="_blank" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Privacy Policy</a>, and
                    <a routerLink="/refund-policy" target="_blank" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Cancellation &amp; Refund Policy</a>.
                  </p>
                </div>

                <!-- Support Notice with 9284905118 -->
                <p class="text-[11px] text-center text-[#7A6C5E] dark:text-[#C5A393] pt-1">
                  Need custom assistance? Call or WhatsApp RMS Support:
                  <strong class="text-[#9C4738] dark:text-[#EB9D8E]">+91 92849 05118</strong>
                </p>

              </div>

            </div>

          </div>

        </main>

      </div>
    </app-site-layout>
  `
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  public readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(CustomerAddressService);
  private readonly pinService = inject(PinCodeAvailabilityService);
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly localStorage = inject(LocalStorageService);
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);

  currentUser: UserProfile | null = null;
  private authSub?: Subscription;

  // Saved Addresses
  savedAddresses: CustomerAddress[] = [];
  selectedAddressId?: number;
  showNewAddressForm = false;
  editingAddressId?: number;

  // Address Form State
  customerName = '';
  customerPhone = '';
  customerAddress = '';
  customerCity = 'Mumbai';
  customerState = 'Maharashtra';
  customerPin = '';
  addressType = 'Home';
  saveAddressToBook = true;

  // Missing profile details
  profileGender = '';
  profileDob = '';
  savingProfile = false;

  // PIN code check
  deliveryCheckResult: DeliveryCheckResult | null = null;
  isCheckingPin = false;
  pinDebounceTimer?: any;

  // Payment
  paymentMode: 'COD' | 'ONLINE_UPI' = 'COD';
  utrNumber = '';
  upiCopied = false;

  // Duplicate Submission Prevention
  isSubmitting = false;
  submissionLockTimestamp = 0;
  errorMessage = '';

  get canPlaceOrder(): boolean {
    const isServiceable = this.deliveryCheckResult ? this.deliveryCheckResult.isServiceable : true;
    const cleanPhone = (this.customerPhone || '').replace(/\D/g, '');
    const cleanPin = (this.customerPin || '').trim();

    return Boolean(
      this.currentUser &&
      isServiceable &&
      (this.customerName || '').trim() &&
      cleanPhone.length >= 10 &&
      (this.customerAddress || '').trim() &&
      cleanPin.length === 6 &&
      this.cartService.items.length > 0
    );
  }

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Checkout — RMS Creations Handcrafted Hampers',
      description: 'Enter your delivery address, check PIN code serviceability, and select payment mode.',
      keywords: 'checkout, gift hampers delivery, online order',
      slug: 'checkout'
    });

    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        if (!this.customerName) this.customerName = user.name || 'RMS Customer';
        if (!this.customerPhone) this.customerPhone = user.phone_no || '9284905118';
        if (!this.customerAddress) this.customerAddress = 'Maharashtra, India';
        if (!this.customerPin) this.customerPin = '400703';
        this.profileGender = user.gender || 'prefer_not_to_say';
        this.profileDob = user.date_of_birth ? user.date_of_birth.split('T')[0] : '1995-01-01';
        this.loadCustomerAddresses(user.id);
        this.verifyPinCode(this.customerPin);
      }
      this.cdr.markForCheck();
    });

    // If customer already had pre-filled PIN from a previous session, validate it
    const cachedProfile = this.localStorage.getItem<any>('rms_customer_profile');
    if (cachedProfile) {
      if (!this.customerName) this.customerName = cachedProfile.name || '';
      if (!this.customerPhone) this.customerPhone = cachedProfile.phone || '';
      if (!this.customerAddress) this.customerAddress = cachedProfile.address || '';
      if (!this.customerPin) this.customerPin = cachedProfile.pin || '';
      if (cachedProfile.city) this.customerCity = cachedProfile.city;
      if (cachedProfile.state) this.customerState = cachedProfile.state;
      if (this.customerPin) {
        this.verifyPinCode(this.customerPin);
      }
    }
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle('/checkout');
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to initiate Google sign-in.';
    }
  }

  async loadCustomerAddresses(userId?: number) {
    if (!userId) return;
    try {
      this.savedAddresses = await this.addressService.getCustomerAddresses(userId);
      if (this.savedAddresses.length > 0) {
        const defaultAddr = this.savedAddresses.find(a => a.is_default) || this.savedAddresses[0];
        this.selectAddress(defaultAddr);
      } else {
        this.showNewAddressForm = true;
      }
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  }

  selectAddress(addr: CustomerAddress) {
    this.selectedAddressId = addr.customer_address_id;
    this.customerAddress = addr.address;
    this.customerCity = addr.city;
    this.customerState = addr.state;
    this.customerPin = addr.pin_code;
    this.addressType = addr.address_type || 'Home';
    this.showNewAddressForm = false;
    this.verifyPinCode(addr.pin_code);
  }

  editAddress(addr: CustomerAddress, event: Event) {
    event.stopPropagation();
    this.editingAddressId = addr.customer_address_id;
    this.selectedAddressId = addr.customer_address_id;
    this.customerAddress = addr.address;
    this.customerCity = addr.city;
    this.customerState = addr.state;
    this.customerPin = addr.pin_code;
    this.addressType = addr.address_type || 'Home';
    this.showNewAddressForm = true;
    this.verifyPinCode(addr.pin_code);
  }

  cancelAddressForm() {
    this.showNewAddressForm = false;
    this.editingAddressId = undefined;
    if (this.savedAddresses.length > 0) {
      const active = this.savedAddresses.find(a => a.customer_address_id === this.selectedAddressId) || this.savedAddresses[0];
      this.selectAddress(active);
    }
  }

  onPinChange(val: string) {
    clearTimeout(this.pinDebounceTimer);
    const clean = (val || '').replace(/\D/g, '').slice(0, 6);
    this.customerPin = clean;
    if (clean.length === 6) {
      this.pinDebounceTimer = setTimeout(() => {
        this.verifyPinCode(clean);
      }, 300);
    } else {
      this.deliveryCheckResult = null;
      this.cartService.setVerifiedDeliveryFee(null);
    }
  }

  async verifyPinCode(pin: string) {
    if (!pin || pin.length !== 6) return;
    this.isCheckingPin = true;
    this.cdr.markForCheck();

    try {
      const result = await this.pinService.checkDelivery(
        pin,
        this.cartService.subtotal,
        this.cartService.totalWeightKg
      );
      this.deliveryCheckResult = result;
      if (result.isServiceable) {
        if (result.state && !this.customerState) this.customerState = result.state;
        if (result.district && !this.customerCity) this.customerCity = result.district;
        this.cartService.setVerifiedDeliveryFee(result.calculatedDeliveryFee);
      } else {
        this.cartService.setVerifiedDeliveryFee(null);
      }
    } catch {
      this.deliveryCheckResult = {
        isServiceable: false,
        pinCode: pin,
        baseCharge: 0,
        above1kgCharge: 0,
        calculatedDeliveryFee: 0,
        totalWeightKg: this.cartService.totalWeightKg,
        freeDeliveryApplied: false,
        message: 'Could not connect to delivery availability service. Please retry.'
      };
      this.cartService.setVerifiedDeliveryFee(null);
    } finally {
      this.isCheckingPin = false;
      this.cdr.markForCheck();
    }
  }

  async saveProfileDetails() {
    if (!this.profileGender || !this.profileDob) return;
    this.savingProfile = true;
    try {
      await this.authService.updateProfile({
        gender: this.profileGender as any,
        date_of_birth: this.profileDob
      });
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to update profile details.';
    } finally {
      this.savingProfile = false;
      this.cdr.markForCheck();
    }
  }

  get qrCodeUrl(): string {
    const upiUri = `upi://pay?pa=7350120467@upi&pn=RMS%20Creations&am=${this.cartService.finalTotal}&cu=INR&tn=GiftOrder`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;
  }

  get upiDeepLink(): string {
    return `upi://pay?pa=7350120467@upi&pn=RMS%20Creations&am=${this.cartService.finalTotal}&cu=INR&tn=GiftOrder`;
  }

  copyUpi() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('7350120467@upi').then(() => {
        this.upiCopied = true;
        setTimeout(() => { this.upiCopied = false; this.cdr.markForCheck(); }, 2000);
      });
    }
  }

  async confirmAndPlaceOrder() {
    // 1. Double Submission / Idempotency Prevention
    const now = Date.now();
    if (this.isSubmitting || (now - this.submissionLockTimestamp < 3500)) {
      return;
    }
    this.submissionLockTimestamp = now;

    // 2. Mandatory Authentication Enforcement
    if (!this.currentUser) {
      this.errorMessage = 'Please sign in or register before placing your order.';
      return;
    }

    // 3. Address and Input Validations
    if (!this.customerName.trim() || !this.customerPhone.trim() || !this.customerAddress.trim() || !this.customerPin.trim()) {
      this.errorMessage = 'Please complete all required fields (Recipient Name, Phone, Address, PIN).';
      return;
    }

    const cleanPhone = this.customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      this.errorMessage = 'Please enter a valid 10-digit mobile number.';
      return;
    }

    // 4. Server-Side Re-validation of PIN code serviceability
    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    try {
      const pinValidation = await this.pinService.checkDelivery(
        this.customerPin,
        this.cartService.subtotal,
        this.cartService.totalWeightKg
      );

      if (!pinValidation.isServiceable) {
        this.errorMessage = `Delivery is not available for PIN code ${this.customerPin}. Orders can only be placed for serviceable areas.`;
        this.isSubmitting = false;
        this.cdr.markForCheck();
        return;
      }

      // Re-apply validated fee
      this.cartService.setVerifiedDeliveryFee(pinValidation.calculatedDeliveryFee);

      // 5. Save address if requested and user is authenticated
      if (this.currentUser?.id && this.saveAddressToBook && this.showNewAddressForm) {
        try {
          const savedResult = await this.addressService.saveAddress(this.currentUser.id, {
            customer_address_id: this.editingAddressId,
            user_id: this.currentUser.id,
            address_type: (this.addressType as any) || 'Home',
            address: this.customerAddress.trim(),
            city: this.customerCity.trim(),
            state: this.customerState.trim(),
            country: 'India',
            pin_code: this.customerPin.trim(),
            is_default: this.savedAddresses.length === 0
          });
          if (savedResult.data?.customer_address_id) {
            this.selectedAddressId = savedResult.data.customer_address_id;
          }
        } catch {
          // Non-blocking
        }
      }

      // 6. Generate reliable unique order number
      const orderNo = `RMS-${Math.floor(100000 + Math.random() * 900000)}`;
      const fullShippingAddress = `${this.customerAddress.trim()}, ${this.customerCity.trim()}, ${this.customerState.trim()} - ${this.customerPin.trim()}`;

      const paymentDisplay = this.paymentMode === 'COD'
        ? 'Cash on Delivery (COD)'
        : `Online UPI (7350120467)${this.utrNumber.trim() ? ' - UTR: ' + this.utrNumber.trim() : ''}`;

      // 7. Insert order into purchase_order table
      const orderPayload: any = {
        purchase_order_no: orderNo,
        purchase_order_date: new Date().toISOString(),
        purchase_order_status: 'confirmed',
        payable_amount: this.cartService.finalTotal,
        total_amount: this.cartService.finalTotal,
        customer_id: this.currentUser.id || null,
        contact_no: cleanPhone,
        payment_mode: paymentDisplay,
        shipping_address: fullShippingAddress,
        shipping_remark: `Customer: ${this.customerName.trim()} | Email: ${this.currentUser.email} | Courier: ${pinValidation.courierService || 'Express DTDC'}`,
        is_active: true,
        creation_date: new Date().toISOString()
      };

      const { data: orderData, error: orderErr } = await this.supabase
        .from('purchase_order')
        .insert([orderPayload])
        .select()
        .single();

      if (orderErr) {
        throw new Error(orderErr.message);
      }

      const orderId = orderData ? orderData.purchase_order_id : null;

      // 8. Insert line items into purchase_order_details table
      if (orderId) {
        const lineItems = this.cartService.items.map(item => ({
          purchase_order_id: orderId,
          item_id: item.productId || 1,
          item_sale_price: item.price,
          item_quantity: item.quantity,
          amount: item.price * item.quantity,
          is_active: true,
          creation_date: new Date().toISOString()
        }));

        await this.supabase.from('purchase_order_details').insert(lineItems);
      }

      // 9. Save snapshot to local user history
      const myOrderSnapshot = {
        orderNo: orderNo,
        date: new Date().toISOString(),
        customerName: this.customerName.trim(),
        phone: cleanPhone,
        email: this.currentUser.email,
        address: fullShippingAddress,
        paymentMode: paymentDisplay,
        items: [...this.cartService.items],
        subtotal: this.cartService.subtotal,
        deliveryFee: this.cartService.deliveryFee,
        total: this.cartService.finalTotal,
        status: 'Confirmed'
      };

      const existingOrders = this.localStorage.getItem<any[]>('rms_my_orders') || [];
      this.localStorage.setItem('rms_my_orders', [myOrderSnapshot, ...existingOrders]);

      // Cache profile
      this.localStorage.setItem('rms_customer_profile', {
        name: this.customerName.trim(),
        phone: cleanPhone,
        email: this.currentUser.email,
        address: this.customerAddress.trim(),
        city: this.customerCity.trim(),
        state: this.customerState.trim(),
        pin: this.customerPin.trim()
      });

      // 10. Record tracking event (skipDbSync because real order was already saved above)
      this.orderTracker.recordOrder({
        title: `Cart Checkout (${this.cartService.totalItemsCount} items)`,
        category: 'Online Order',
        page: 'Checkout',
        link: `/order-confirmation/${orderNo}`,
        skipDbSync: true
      });

      // 11. Clear cart
      this.cartService.clearCart();

      // 12. Navigate to confirmation screen
      this.router.navigate(['/order-confirmation', orderNo]);

    } catch (err: any) {
      console.error('Order creation error:', err);
      this.errorMessage = err?.message || 'An error occurred while placing your order. Please try again or contact RMS concierge at +91 92849 05118.';
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }
}
