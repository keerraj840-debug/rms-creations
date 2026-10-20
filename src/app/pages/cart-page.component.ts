import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { CartService, CartItem } from '../services/cart.service';
import { PinCodeAvailabilityService, DeliveryCheckResult } from '../services/pin-code-availability.service';
import { AuthService, UserProfile } from '../services/auth.service';
import { CustomerAddressService, CustomerAddress } from '../services/customer-address.service';
import { SupabaseService } from '../services/supabase.service';
import { LocalStorageService } from '../services/local-storage.service';
import { OrderTrackingService } from '../shared/order-tracking.service';
import { NotificationOutboxService } from '../services/notification-outbox.service';
import { SwipeButtonComponent } from '../shared/ui/swipe-button.component';
import { ModalComponent } from '../shared/ui/modal.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    SiteLayoutComponent,
    SwipeButtonComponent,
    ModalComponent
  ],
  template: `
    <app-site-layout [hideBottomNav]="true" [hideFloatingAction]="true">
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-44 lg:pb-24">
        
        <main class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
          
          <!-- Sleek Compact Page Header -->
          <div class="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-[#EADFD2]/80 dark:border-white/10">
            <div class="flex items-center gap-2.5">
              <a 
                routerLink="/shop" 
                class="sm:hidden w-8 h-8 rounded-full bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#F4F1ED] flex items-center justify-center text-xs shadow-2xs hover:bg-[#FAF7F2] transition active:scale-95 shrink-0"
                aria-label="Back to Shop"
              >
                <i class="fa-solid fa-arrow-left"></i>
              </a>
              <div>
                <div class="flex items-center gap-1.5 sm:gap-2">
                  <span class="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#9C4738] dark:text-[#EB9D8E] bg-[#9C4738]/10 px-2 py-0.5 rounded-full border border-[#9C4738]/20">
                    <i class="fa-solid fa-bolt text-[8px]"></i> 1-Step Checkout
                  </span>
                  <span class="text-[10px] sm:text-xs text-[#7A6C5E] dark:text-[#A8988C] hidden sm:inline">• Doorstep Delivery across India</span>
                </div>
                <h1 class="font-serif text-lg sm:text-3xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED] mt-0.5 sm:mt-1">
                  Cart &amp; Checkout
                </h1>
              </div>
            </div>
            <a 
              routerLink="/shop" 
              class="hidden sm:flex text-xs font-semibold text-[#9C4738] dark:text-[#EB9D8E] hover:text-[#7A3428] dark:hover:text-[#F2B9AE] items-center gap-1.5 transition-colors group"
            >
              <i class="fa-solid fa-arrow-left text-[11px] transition-transform group-hover:-translate-x-1"></i>
              <span>Continue Shopping</span>
            </a>
            <a 
              routerLink="/shop" 
              class="sm:hidden text-[11px] font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline"
            >
              + Add Items
            </a>
          </div>
          
          <!-- EMPTY CART STATE -->
          <div *ngIf="cartService.items.length === 0" class="py-20 text-center bg-white dark:bg-[#1E1916] rounded-3xl border border-dashed border-[#EADFD2] dark:border-white/10 p-8 max-w-lg mx-auto shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-2xl mx-auto shadow-inner">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <h2 class="mt-5 font-serif text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
              Your Cart is Empty
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] max-w-sm mx-auto leading-relaxed">
              You haven't added any gift hampers yet. Explore our bestselling collections, artisanal boxes, and festive specials!
            </p>
            <div class="mt-7 flex flex-wrap justify-center gap-3">
              <a 
                routerLink="/shop" 
                class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9C4738] hover:bg-[#853C2F] text-white text-xs font-bold uppercase tracking-wider shadow-md transition active:scale-95"
              >
                <span>Browse Catalog</span>
                <i class="fa-solid fa-arrow-right text-[11px]"></i>
              </a>
            </div>
          </div>

          <!-- UNIFIED CART & CHECKOUT VIEW -->
          <div *ngIf="cartService.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT 8 COLS: CART ITEMS + DELIVERY DETAILS + PAYMENT -->
            <div class="lg:col-span-8 space-y-6">
              
              <!-- 1. CART ITEMS CONTAINER -->
              <section class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-3.5 sm:p-7 shadow-xs">
                <div class="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-2 sm:gap-2.5">
                    <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#9C4738] text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-xs">1</span>
                    <h2 class="font-serif font-bold text-sm sm:text-lg text-[#2E2825] dark:text-[#F4F1ED]">
                      Items in Cart ({{ cartService.totalItemsCount }})
                    </h2>
                  </div>
                  <button 
                    type="button" 
                    (click)="cartService.clearCart()" 
                    class="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <i class="fa-solid fa-trash-can text-[10px]"></i>
                    <span>Clear Cart</span>
                  </button>
                </div>

                <!-- Individual Item Row -->
                <div class="divide-y divide-[#EADFD2]/60 dark:divide-white/10">
                  <div 
                    *ngFor="let item of cartService.items" 
                    class="py-3 sm:py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 transition-colors hover:bg-stone-50/50 dark:hover:bg-white/[0.02] -mx-1 sm:-mx-2 px-1 sm:px-2 rounded-2xl"
                  >
                    <!-- Media + Info -->
                    <div class="flex items-start gap-3 flex-1 min-w-0">
                      <img 
                        [src]="item.image || 'assets/banners/banner.png'" 
                        [alt]="item.title" 
                        class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/60 dark:border-white/10 shrink-0 shadow-2xs"
                      />
                      <div class="min-w-0 flex-1">
                        <div class="flex items-start justify-between gap-1.5">
                          <span *ngIf="item.category" class="text-[9px] sm:text-[10px] font-bold text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider block truncate">
                            {{ item.category }}
                          </span>
                          <!-- Mobile Trash Action (Top Right of Card) -->
                          <button 
                            type="button"
                            (click)="cartService.removeFromCart(item.id)"
                            class="sm:hidden -mt-1 -mr-1 p-1 text-[#7A6C5E] hover:text-rose-600 transition cursor-pointer rounded-lg"
                            aria-label="Remove item"
                          >
                            <i class="fa-solid fa-trash-can text-xs"></i>
                          </button>
                        </div>

                        <h3 class="font-serif font-bold text-xs sm:text-base text-[#2E2825] dark:text-[#F4F1ED] leading-snug line-clamp-2 sm:truncate">
                          {{ item.title }}
                        </h3>
                        <p class="font-serif font-bold text-xs sm:text-sm text-[#9C4738] dark:text-[#EB9D8E] mt-0.5">
                          ₹{{ item.price }} <span class="text-[10px] sm:text-[11px] font-sans font-normal text-[#7A6C5E] dark:text-[#A8988C]">each</span>
                        </p>
                        <div *ngIf="item.notes" class="text-[10px] sm:text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-1 bg-[#FAF7F2] dark:bg-stone-900/60 p-2 rounded-xl border border-[#EADFD2]/60 dark:border-stone-800">
                          <span class="font-semibold block text-[#57251C] dark:text-[#D9C3B9] text-[9px] uppercase tracking-wider mb-0.5">Card Note:</span>
                          <span class="leading-relaxed line-clamp-2 sm:line-clamp-none">{{ item.notes }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Quantity Controls & Line Total -->
                    <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-white/5 pl-[76px] sm:pl-0">
                      <!-- Stepper -->
                      <div class="flex items-center border border-[#EADFD2] dark:border-white/10 rounded-xl bg-[#FAF7F2] dark:bg-[#251F1C] p-0.5 shadow-2xs">
                        <button 
                          type="button" 
                          (click)="cartService.updateQuantity(item.id, item.quantity - 1)"
                          class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white dark:bg-[#1E1916] text-[#4A3C31] dark:text-[#F4F1ED] text-xs font-bold hover:bg-[#F3E7DC] dark:hover:bg-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition"
                          aria-label="Decrease quantity"
                        >
                          <i class="fa-solid fa-minus text-[9px] sm:text-[10px]"></i>
                        </button>
                        <span class="w-7 sm:w-8 text-center font-bold text-xs font-mono text-[#2E2825] dark:text-[#F4F1ED]">
                          {{ item.quantity }}
                        </span>
                        <button 
                          type="button" 
                          (click)="cartService.updateQuantity(item.id, item.quantity + 1)"
                          class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white dark:bg-[#1E1916] text-[#4A3C31] dark:text-[#F4F1ED] text-xs font-bold hover:bg-[#F3E7DC] dark:hover:bg-white/10 flex items-center justify-center cursor-pointer active:scale-95 transition"
                          aria-label="Increase quantity"
                        >
                          <i class="fa-solid fa-plus text-[9px] sm:text-[10px]"></i>
                        </button>
                      </div>

                      <!-- Line Item Subtotal -->
                      <div class="text-right min-w-[65px] sm:min-w-[70px]">
                        <span class="font-serif font-bold text-sm sm:text-lg text-[#2E2825] dark:text-[#F4F1ED]">
                          ₹{{ item.price * item.quantity }}
                        </span>
                      </div>

                      <!-- Desktop Remove Action -->
                      <button 
                        type="button"
                        (click)="cartService.removeFromCart(item.id)"
                        class="hidden sm:block p-2 text-[#7A6C5E] hover:text-rose-600 transition cursor-pointer rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <i class="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>

                  </div>
                </div>

                <!-- Bottom Shopping Link -->
                <div class="pt-4 mt-2 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-between">
                  <a routerLink="/shop" class="text-xs font-semibold text-[#9C4738] dark:text-[#EB9D8E] hover:underline flex items-center gap-1.5">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                    <span>Add more items</span>
                  </a>
                  <span class="text-[11px] text-[#7A6C5E] dark:text-[#A8988C] flex items-center gap-1">
                    <i class="fa-solid fa-shield-halved text-[10px] text-emerald-600"></i> All items securely packed
                  </span>
                </div>

              </section>

              <!-- 2. DELIVERY & CUSTOMER DETAILS CARD -->
              <section id="delivery-details-section" class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-4 sm:p-7 shadow-xs space-y-5 scroll-mt-20">
                
                <div class="flex items-center justify-between pb-3.5 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-[#9C4738] text-white text-xs font-bold flex items-center justify-center shadow-xs">2</span>
                    <h2 class="font-serif font-bold text-base sm:text-lg text-[#2E2825] dark:text-[#F4F1ED]">
                      Delivery Address &amp; Contact Details
                    </h2>
                  </div>
                  <span *ngIf="currentUser" class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1.5">
                    <i class="fa-solid fa-user-check text-[10px]"></i> {{ currentUser.name || 'Account Linked' }}
                  </span>
                </div>

                <!-- Saved Address Quick Selector (If authenticated) -->
                <div *ngIf="savedAddresses.length > 0" class="space-y-2.5">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider block">
                      Saved Addresses
                    </span>
                    <button 
                      type="button"
                      (click)="useNewAddress()"
                      class="text-[11px] font-semibold text-[#9C4738] dark:text-[#EB9D8E] hover:underline cursor-pointer"
                    >
                      + Add New Address
                    </button>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      *ngFor="let addr of savedAddresses"
                      type="button"
                      (click)="selectSavedAddress(addr)"
                      [class]="selectedAddressId === addr.customer_address_id ? 'border-[#9C4738] bg-[#FAF7F2] dark:bg-[#251F1C] ring-2 ring-[#9C4738]/20 shadow-xs' : 'border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] hover:border-[#9C4738]/50'"
                      class="p-3.5 text-left rounded-2xl border transition-all cursor-pointer text-xs space-y-1 relative"
                    >
                      <div class="flex items-center justify-between font-bold">
                        <span class="text-[#2E2825] dark:text-[#F4F1ED] flex items-center gap-1.5">
                          <i class="fa-regular fa-building text-[11px] text-[#9C4738]"></i>
                          {{ addr.address_type || 'Address' }}
                        </span>
                        <span *ngIf="addr.is_default" class="text-[9px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded">Default</span>
                      </div>
                      <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-2 leading-relaxed">
                        {{ addr.address }}, {{ addr.city }}, {{ addr.state }} - {{ addr.pin_code }}
                      </p>
                    </button>
                  </div>
                </div>

                <!-- Form Fields -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <!-- Name -->
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                      Full Name <span class="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      [(ngModel)]="customerName"
                      placeholder="e.g. Priya Sharma"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1C1917] text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/30 focus:border-[#9C4738] transition"
                    />
                  </div>

                  <!-- Mobile Phone -->
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                      Mobile / WhatsApp Number <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#7A6C5E] select-none">+91</span>
                      <input
                        type="tel"
                        inputmode="numeric"
                        maxlength="10"
                        [(ngModel)]="customerPhone"
                        placeholder="98200 12345"
                        class="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1C1917] text-xs font-medium font-mono text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/30 focus:border-[#9C4738] transition"
                      />
                    </div>
                  </div>

                  <!-- Email Address -->
                  <div class="sm:col-span-2">
                    <div class="flex items-center justify-between mb-1.5">
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                        Email Address <span class="text-rose-500">*</span>
                      </label>
                      <span class="text-[10px] text-[#A89F91]">Order invoice &amp; tracking updates</span>
                    </div>
                    <input
                      type="email"
                      [(ngModel)]="customerEmail"
                      placeholder="e.g. priya@example.com"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1C1917] text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/30 focus:border-[#9C4738] transition"
                    />
                  </div>

                  <!-- Street Address -->
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                      Delivery Address <span class="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows="2"
                      [(ngModel)]="customerAddress"
                      placeholder="Flat/House No., Wing, Building/Society, Street, Landmark"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1C1917] text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/30 focus:border-[#9C4738] transition resize-none"
                    ></textarea>
                  </div>

                  <!-- PIN Code with Instant Delivery Checker -->
                  <div>
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                      PIN Code (6 Digits) <span class="text-rose-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        type="text"
                        inputmode="numeric"
                        maxlength="6"
                        [(ngModel)]="customerPin"
                        (ngModelChange)="onPinCodeChange($event)"
                        placeholder="e.g. 400001"
                        class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1C1917] font-mono text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/30 focus:border-[#9C4738] transition"
                      />
                      <i *ngIf="checkingPin" class="fa-solid fa-circle-notch fa-spin absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#9C4738]"></i>
                    </div>

                    <!-- PIN check message -->
                    <div *ngIf="pinResult" class="mt-1.5 text-[11px] font-medium flex items-center gap-1.5" [ngClass]="pinResult.isServiceable ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-400'">
                      <i class="fa-solid text-[10px]" [ngClass]="pinResult.isServiceable ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
                      <span>{{ pinResult.message }}</span>
                    </div>
                  </div>

                  <!-- City & State -->
                  <div class="grid grid-cols-2 gap-2.5">
                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">City <span class="text-rose-500">*</span></label>
                      <input
                        type="text"
                        [(ngModel)]="customerCity"
                        placeholder="e.g. Mumbai"
                        class="w-full px-3 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1C1917] text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/30 focus:border-[#9C4738] transition"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">State <span class="text-rose-500">*</span></label>
                      <input
                        type="text"
                        [(ngModel)]="customerState"
                        placeholder="Maharashtra"
                        class="w-full px-3 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#1C1917] text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/30 focus:border-[#9C4738] transition"
                      />
                    </div>
                  </div>

                </div>

              </section>

              <!-- 3. PAYMENT METHOD CARD -->
              <section class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-4 sm:p-7 shadow-xs space-y-4">
                
                <div class="flex items-center justify-between pb-3.5 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-full bg-[#9C4738] text-white text-xs font-bold flex items-center justify-center shadow-xs">3</span>
                    <h2 class="font-serif font-bold text-base sm:text-lg text-[#2E2825] dark:text-[#F4F1ED]">
                      Payment Method
                    </h2>
                  </div>
                  <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700/50">
                    Pay on Delivery
                  </span>
                </div>

                <div class="p-4 sm:p-5 rounded-2xl border-2 border-[#9C4738] bg-[#FAF7F2] dark:bg-[#251F1C] space-y-3.5">
                  <div class="flex items-start gap-3.5">
                    <div class="w-10 h-10 rounded-xl bg-[#9C4738]/15 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center shrink-0 mt-0.5">
                      <i class="fa-solid fa-truck-ramp-box text-lg"></i>
                    </div>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">Cash / UPI on Delivery (COD)</span>
                        <span class="text-[9px] font-bold bg-[#9C4738] text-white px-1.5 py-0.5 rounded">Guaranteed Safe</span>
                      </div>
                      <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed">
                        Pay conveniently with Cash or scan QR via UPI (GPay, PhonePe, Paytm) directly when your hamper is handed over.
                      </p>
                    </div>
                  </div>

                  <div class="pt-3 border-t border-[#EADFD2]/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[11px] text-[#4A3C31] dark:text-[#E0D8D0]">
                    <span class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                      <i class="fa-solid fa-circle-check text-xs"></i> Freshly Packed &amp; Inspected
                    </span>
                    <a href="https://wa.me/919284905118" target="_blank" class="flex items-center gap-1.5 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738]">
                      <i class="fa-brands fa-whatsapp text-xs text-emerald-600"></i> Help: +91 92849 05118
                    </a>
                  </div>
                </div>

              </section>

            </div>

            <!-- RIGHT 4 COLS: ORDER SUMMARY & SWIPE BUTTON (STICKY) -->
            <div class="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-5">
                
                <h2 class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED] pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  Order Summary
                </h2>

                <div class="space-y-3 text-xs">
                  <div class="flex justify-between items-center text-[#7A6C5E] dark:text-[#C5A393]">
                    <span>Items Subtotal ({{ cartService.totalItemsCount }} items):</span>
                    <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">₹{{ cartService.subtotal }}</span>
                  </div>

                  <div class="flex justify-between items-center text-[#7A6C5E] dark:text-[#C5A393]">
                    <span>Total Weight:</span>
                    <span class="font-semibold text-[#2E2825] dark:text-[#F4F1ED]">{{ cartService.totalWeightKg }} kg</span>
                  </div>

                  <div class="flex justify-between items-center text-[#7A6C5E] dark:text-[#C5A393]">
                    <div>
                      <span>Delivery Charges:</span>
                      <span *ngIf="cartService.hasHamper" class="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block">
                        PIN courier rate (Hamper Parcel)
                      </span>
                    </div>
                    <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                      ₹{{ cartService.deliveryFee }}
                    </span>
                  </div>

                  <div class="pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 flex justify-between items-baseline">
                    <span class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">Total Payable:</span>
                    <span class="font-serif font-bold text-2xl text-[#9C4738] dark:text-[#EB9D8E]">
                      ₹{{ cartService.finalTotal }}
                    </span>
                  </div>
                </div>

                <!-- Validation Warning Banner -->
                <div *ngIf="!isFormValid" class="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div class="flex items-center gap-1.5 font-bold">
                    <i class="fa-solid fa-circle-info text-amber-600"></i>
                    <span>Required to checkout:</span>
                  </div>
                  <p class="text-[11px] leading-relaxed pl-5 font-medium">
                    {{ validationHint }}
                  </p>
                </div>

                <!-- Error Message Banner -->
                <div *ngIf="errorMessage" class="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold flex items-start gap-2">
                  <i class="fa-solid fa-triangle-exclamation text-rose-500 mt-0.5"></i>
                  <span>{{ errorMessage }}</span>
                </div>

                <!-- INTERACTIVE SWIPE TO PLACE ORDER DRAGGABLE BUTTON (DESKTOP / TABLET ONLY) -->
                <div class="hidden lg:block pt-1">
                  <app-swipe-button
                    #swipeButton
                    [disabled]="!isFormValid || isSubmitting"
                    [disabledText]="'Please complete delivery details'"
                    [text]="'Slide to Confirm Order (COD)'"
                    [confirmedText]="'Order Placed! 🎉'"
                    [loading]="isSubmitting"
                    [loadingText]="'Confirming your order...'"
                    (onSwipeComplete)="handleSwipeOrder()"
                  ></app-swipe-button>
                  <p class="text-[10px] text-center text-[#7A6C5E] dark:text-[#C5A393] mt-2 leading-relaxed">
                    By sliding to confirm, you agree to our
                    <a routerLink="/terms" target="_blank" rel="noopener noreferrer" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Terms</a>,
                    <a routerLink="/privacy" target="_blank" rel="noopener noreferrer" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Privacy</a>, and
                    <a routerLink="/refund-policy" target="_blank" rel="noopener noreferrer" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Refund Policy</a>.
                  </p>
                </div>

                <!-- Trust Points -->
                <div class="space-y-2.5 pt-3 border-t border-[#EADFD2]/50 dark:border-white/5 text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-shield-check text-emerald-600 text-xs"></i>
                    <span>100% Quality Checked Before Dispatch</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-truck-fast text-emerald-600 text-xs"></i>
                    <span>Safe Delivery &amp; Real-time WhatsApp Tracking</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-headset text-emerald-600 text-xs"></i>
                    <span>Questions? WhatsApp Support: +91 9284905118</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </main>

        <!-- STICKY MOBILE BOTTOM SWIPE BAR -->
        <aside 
          *ngIf="cartService.items.length > 0"
          aria-label="Mobile Order Action"
          class="fixed bottom-0 inset-x-0 z-40 bg-[#FFFDFC]/95 dark:bg-[#1C1816]/95 backdrop-blur-md border-t border-[#D9C3B9]/50 dark:border-[#3D302A] px-4 pt-3 pb-3 lg:hidden shadow-2xl flex flex-col gap-2.5 transition-all"
        >
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-baseline gap-1.5">
              <span class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">Total:</span>
              <span class="font-serif font-bold text-lg text-[#9C4738] dark:text-[#EB9D8E]">₹{{ cartService.finalTotal }}</span>
              <span class="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">COD</span>
            </div>
            
            <button 
              *ngIf="!isFormValid" 
              type="button" 
              (click)="scrollToAddress()"
              class="text-[11px] font-bold text-[#9C4738] dark:text-[#EB9D8E] flex items-center gap-1 hover:underline cursor-pointer bg-[#FAF7F2] dark:bg-[#251F1C] px-2 py-1 rounded-lg border border-[#EADFD2] dark:border-white/10 shadow-2xs"
            >
              <span>Complete details</span>
              <i class="fa-solid fa-arrow-up text-[10px]"></i>
            </button>
            <span *ngIf="isFormValid" class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <i class="fa-solid fa-circle-check text-[10px]"></i> Ready to swipe
            </span>
          </div>

          <app-swipe-button
            [disabled]="!isFormValid || isSubmitting"
            [disabledText]="'Fill delivery fields to order'"
            [text]="'Slide to Confirm Order (COD)'"
            [confirmedText]="'Order Placed! 🎉'"
            [loading]="isSubmitting"
            [loadingText]="'Confirming your order...'"
            (onSwipeComplete)="handleSwipeOrder()"
          ></app-swipe-button>
          <p class="text-[9px] text-center text-[#7A6C5E] dark:text-[#C5A393] leading-tight">
            By sliding, you agree to our
            <a routerLink="/terms" target="_blank" rel="noopener noreferrer" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Terms</a>,
            <a routerLink="/privacy" target="_blank" rel="noopener noreferrer" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Privacy</a>, and
            <a routerLink="/refund-policy" target="_blank" rel="noopener noreferrer" class="underline hover:text-[#9C4738] dark:hover:text-[#EB9D8E] font-medium">Refunds</a>.
          </p>
        </aside>

      </div>

      <!-- DOUBLE CONFIRMATION WITH DETAILS MODAL -->
      <app-modal [isOpen]="showOrderConfirmationModal" title="Order Confirmation" size="lg" (onClose)="closeConfirmationModal()">
        <div *ngIf="placedOrderDetails" class="space-y-4 py-1 text-xs">
          
          <!-- Celebration Header Card -->
          <div class="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white space-y-2 text-center shadow-md">
            <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl mx-auto shadow-inner">
              <i class="fa-solid fa-check"></i>
            </div>
            <h2 class="font-serif font-bold text-xl sm:text-2xl">
              Thank You, {{ placedOrderDetails.customerName }}!
            </h2>
            <p class="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
              Your order <strong class="font-mono text-white text-sm bg-black/20 px-2 py-0.5 rounded">#{{ placedOrderDetails.orderNo }}</strong> has been placed successfully and logged in our fulfillment queue.
            </p>
          </div>

          <!-- Order Breakdown Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            <!-- Delivery Destination -->
            <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] block">
                Delivery Address:
              </span>
              <p class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                {{ placedOrderDetails.customerName }} ({{ placedOrderDetails.phone }})
              </p>
              <p class="text-[#7A6C5E] dark:text-[#C5A393] text-[11px] leading-relaxed">
                {{ placedOrderDetails.address }}
              </p>
              <p class="text-[11px] text-[#9C4738] dark:text-[#EB9D8E] font-semibold pt-1">
                Updates sent to: {{ placedOrderDetails.email }}
              </p>
            </div>

            <!-- Payment Summary -->
            <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] block">
                Payment &amp; Amount:
              </span>
              <div class="flex justify-between items-center text-xs">
                <span>Payment Mode:</span>
                <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ placedOrderDetails.paymentMode }}</span>
              </div>
              <div class="flex justify-between items-center text-xs pt-1 border-t border-[#EADFD2]/60 dark:border-white/10">
                <span class="font-bold">Total Payable:</span>
                <span class="font-serif font-bold text-lg text-[#9C4738] dark:text-[#EB9D8E]">₹{{ placedOrderDetails.total }}</span>
              </div>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1 flex items-center gap-1">
                <i class="fa-solid fa-circle-check"></i> Dispatched via {{ placedOrderDetails.courier }}
              </p>
            </div>

          </div>

          <!-- Items Ordered Preview -->
          <div class="p-4 bg-white dark:bg-[#1E1916] border border-[#EADFD2] dark:border-white/10 rounded-2xl space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] block">
              Items Ordered:
            </span>
            <div class="divide-y divide-[#EADFD2]/60 dark:divide-white/10">
              <div *ngFor="let it of placedOrderDetails.items" class="py-2 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2.5">
                  <span class="font-mono text-stone-500 font-semibold text-[11px]">{{ it.quantity }}x</span>
                  <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ it.title }}</span>
                </div>
                <span class="font-serif font-bold text-[#9C4738] dark:text-[#EB9D8E]">₹{{ it.price * it.quantity }}</span>
              </div>
            </div>
          </div>

        </div>

        <div modal-footer class="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <a
            [href]="getWhatsAppConciergeLink()"
            target="_blank"
            class="w-full sm:w-auto px-4.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition"
          >
            <i class="fa-brands fa-whatsapp text-sm"></i>
            <span>Chat on WhatsApp</span>
          </a>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              routerLink="/my-orders"
              (click)="closeConfirmationModal()"
              class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-white/10 hover:bg-[#F3E7DC] text-[#4A3C31] dark:text-[#F4F1ED] font-bold text-xs border border-[#EADFD2] dark:border-white/10 text-center cursor-pointer transition"
            >
              Track Order
            </a>
            <button
              type="button"
              (click)="closeConfirmationModal()"
              class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#9C4738] hover:bg-[#853C2F] text-white font-bold text-xs shadow-sm text-center cursor-pointer transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </app-modal>

    </app-site-layout>
  `
})
export class CartPageComponent implements OnInit, OnDestroy {
  public readonly cartService = inject(CartService);
  private readonly pinService = inject(PinCodeAvailabilityService);
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(CustomerAddressService);
  private readonly supabase = inject(SupabaseService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly orderTracker = inject(OrderTrackingService);
  private readonly outboxService = inject(NotificationOutboxService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  private authSub?: Subscription;
  currentUser: UserProfile | null = null;
  savedAddresses: CustomerAddress[] = [];
  selectedAddressId: number | null = null;

  // Form Fields
  customerName = '';
  customerPhone = '';
  customerEmail = '';
  customerAddress = '';
  customerCity = '';
  customerState = 'Maharashtra';
  customerPin = '';
  paymentMode: 'COD' | 'ONLINE_UPI' = 'COD';
  utrNumber = '';

  // Delivery & PIN Validation
  checkingPin = false;
  pinResult: DeliveryCheckResult | null = null;

  // Submitting & Double Confirmation
  isSubmitting = false;
  errorMessage = '';
  placedOrderDetails: any = null;
  showOrderConfirmationModal = false;

  get upiPayLink(): string {
    const amount = this.cartService.finalTotal || 1;
    const note = encodeURIComponent('RMS Gift Hamper Order');
    return `upi://pay?pa=7350120467@upi&pn=RMS%20Creations&am=${amount}&cu=INR&tn=${note}`;
  }

  get isFormValid(): boolean {
    const hasName = this.customerName.trim().length >= 2;
    const cleanPhone = this.customerPhone.trim().replace(/\D/g, '');
    const hasPhone = cleanPhone.length === 10;
    const hasEmail = this.customerEmail.trim().includes('@') && this.customerEmail.trim().includes('.');
    const hasAddress = this.customerAddress.trim().length >= 5;
    const hasCity = this.customerCity.trim().length >= 2;
    const hasState = this.customerState.trim().length >= 2;
    const cleanPin = this.customerPin.trim().replace(/\D/g, '');
    const hasPin = cleanPin.length === 6;
    const isServiceable = this.pinResult ? this.pinResult.isServiceable : true;

    return hasName && hasPhone && hasEmail && hasAddress && hasCity && hasState && hasPin && isServiceable;
  }

  get validationHint(): string {
    if (!this.customerName.trim()) return 'Please enter your full name.';
    const cleanPhone = this.customerPhone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) return 'Please enter a valid 10-digit mobile number.';
    if (!this.customerEmail.trim().includes('@') || !this.customerEmail.trim().includes('.')) return 'Please enter a valid email address.';
    if (this.customerAddress.trim().length < 5) return 'Please enter your complete street / house address.';
    const cleanPin = this.customerPin.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) return 'Please enter your 6-digit postal PIN code.';
    if (this.pinResult && !this.pinResult.isServiceable) return this.pinResult.message;
    if (!this.customerCity.trim()) return 'Please enter your delivery city.';
    return 'Please complete all required fields.';
  }

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Cart & 1-Step Checkout — RMS Creations',
      description: 'Review your handcrafted gift hampers, verify delivery address, and swipe to place your order with COD or UPI.',
      keywords: 'cart, instant checkout, swipe to place order, rms gift hampers',
      slug: 'cart'
    });

    // Populate from cached local storage profile
    const cachedProfile = this.localStorage.getItem<any>('rms_customer_profile');
    if (cachedProfile) {
      this.customerName = cachedProfile.name || '';
      this.customerPhone = cachedProfile.phone || '';
      this.customerEmail = cachedProfile.email || '';
      this.customerAddress = cachedProfile.address || '';
      this.customerCity = cachedProfile.city || '';
      this.customerState = cachedProfile.state || 'Maharashtra';
      this.customerPin = cachedProfile.pin || '';
      if (this.customerPin && this.customerPin.length === 6) {
        this.checkDeliveryAvailability(this.customerPin);
      }
    }

    // Subscribe to current auth user
    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        if (!this.customerName && user.name) this.customerName = user.name;
        if (!this.customerEmail && user.email) this.customerEmail = user.email;
        if (!this.customerPhone && user.phone_no) this.customerPhone = user.phone_no;
        if (user.id) {
          this.loadUserSavedAddresses(user.id);
        }
      }
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async loadUserSavedAddresses(userId: number) {
    try {
      this.savedAddresses = await this.addressService.getCustomerAddresses(userId);
      if (this.savedAddresses.length > 0 && !this.customerAddress) {
        this.selectSavedAddress(this.savedAddresses[0]);
      }
    } catch {
      // Non-blocking
    }
  }

  selectSavedAddress(addr: CustomerAddress) {
    this.selectedAddressId = addr.customer_address_id || null;
    this.customerAddress = addr.address;
    this.customerCity = addr.city;
    this.customerState = addr.state;
    this.customerPin = addr.pin_code;
    this.checkDeliveryAvailability(addr.pin_code);
  }

  useNewAddress() {
    this.selectedAddressId = null;
    this.customerAddress = '';
    this.customerCity = '';
    this.customerState = 'Maharashtra';
    this.customerPin = '';
    this.pinResult = null;
  }

  onPinCodeChange(pin: string) {
    const clean = pin.trim().replace(/\D/g, '');
    if (clean.length === 6) {
      this.checkDeliveryAvailability(clean);
    } else {
      this.pinResult = null;
    }
  }

  async checkDeliveryAvailability(pinToTest?: string) {
    const pin = (pinToTest || this.customerPin).trim().replace(/\D/g, '');
    if (pin.length !== 6) return;

    this.checkingPin = true;
    this.cdr.markForCheck();

    try {
      this.pinResult = await this.pinService.checkDelivery(
        pin,
        this.cartService.subtotal,
        this.cartService.totalWeightKg,
        this.cartService.hasHamper
      );

      if (this.pinResult.isServiceable) {
        this.cartService.setVerifiedDeliveryFee(this.pinResult.calculatedDeliveryFee);
        if (this.pinResult.district && !this.customerCity) {
          this.customerCity = this.pinResult.district;
        }
        if (this.pinResult.state && (!this.customerState || this.customerState === 'Maharashtra')) {
          this.customerState = this.pinResult.state;
        }
      }
    } finally {
      this.checkingPin = false;
      this.cdr.markForCheck();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Real-Customer Swipe Order Placement                                */
  /* ------------------------------------------------------------------ */
  async handleSwipeOrder() {
    if (!this.isFormValid || this.cartService.items.length === 0) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const cleanPhone = this.customerPhone.trim().replace(/\D/g, '');
    const cleanPin = this.customerPin.trim().replace(/\D/g, '');
    const orderNo = `RMS-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullShippingAddress = `${this.customerAddress.trim()}, ${this.customerCity.trim()}, ${this.customerState.trim()} - ${cleanPin}`;

    const paymentDisplay = 'Cash on Delivery (COD)';

    try {
      // 1. Insert order into purchase_order table
      const orderPayload: any = {
        purchase_order_no: orderNo,
        purchase_order_date: new Date().toISOString(),
        purchase_order_status: 'confirmed',
        payable_amount: this.cartService.finalTotal,
        total_amount: this.cartService.finalTotal,
        delivery_amount: this.cartService.deliveryFee,
        customer_id: this.currentUser?.id || null,
        contact_no: cleanPhone,
        payment_mode: paymentDisplay,
        transaction_status: 'PENDING',
        shipping_address: fullShippingAddress,
        shipping_state: this.customerState.trim(),
        shipping_country: 'India',
        shipping_pin_code: cleanPin,
        shipping_remark: `Customer: ${this.customerName.trim()} | Email: ${this.customerEmail.trim()} | Courier: ${this.pinResult?.courierService || 'Pan-India Express Courier'} | Items: ${this.cartService.items.map(i => `${i.quantity}x ${i.title}${i.notes ? ` [${i.notes}]` : ''}`).join('; ')}`,
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

      // 2. Insert line items into purchase_order_details
      if (orderId && this.cartService.items.length > 0) {
        const lineItems = this.cartService.items.map(item => ({
          purchase_order_id: orderId,
          item_id: item.productId || null,
          item_sale_price: item.price,
          item_quantity: item.quantity,
          item_total: item.price * item.quantity,
          is_active: true,
          creation_date: new Date().toISOString()
        }));

        const { error: lineItemErr } = await this.supabase
          .from('purchase_order_details')
          .insert(lineItems);

        if (lineItemErr) {
          console.warn('purchase_order_details warning:', lineItemErr.message);
        }
      }

      // 3. Cache customer profile for future checkouts
      this.localStorage.setItem('rms_customer_profile', {
        name: this.customerName.trim(),
        phone: cleanPhone,
        email: this.customerEmail.trim(),
        address: this.customerAddress.trim(),
        city: this.customerCity.trim(),
        state: this.customerState.trim(),
        pin: cleanPin
      });

      // 4. Save local order tracking history
      const orderSnapshot = {
        orderNo: orderNo,
        date: new Date().toISOString(),
        customerName: this.customerName.trim(),
        phone: cleanPhone,
        email: this.customerEmail.trim(),
        address: fullShippingAddress,
        paymentMode: paymentDisplay,
        items: [...this.cartService.items],
        subtotal: this.cartService.subtotal,
        deliveryFee: this.cartService.deliveryFee,
        total: this.cartService.finalTotal,
        status: 'Confirmed'
      };

      const existingOrders = this.localStorage.getItem<any[]>('rms_my_orders') || [];
      this.localStorage.setItem('rms_my_orders', [orderSnapshot, ...existingOrders]);

      // 5. Enqueue outbox records for notifications
      const itemSummary = this.cartService.items.map(it => `${it.title} (${it.quantity}x)`).join(', ');
      this.outboxService.recordOrderCreatedNotifications(
        orderNo,
        orderId,
        this.customerName.trim(),
        this.customerEmail.trim(),
        cleanPhone,
        itemSummary,
        this.cartService.finalTotal,
        paymentDisplay,
        fullShippingAddress,
        cleanPin
      ).then(() => {
        this.outboxService.processPendingOutbox().catch(() => { });
      }).catch(() => { });

      // 6. Record tracking analytics
      this.orderTracker.recordOrder({
        title: `Cart Order #${orderNo} (${this.cartService.totalItemsCount} items)`,
        category: 'Online Order',
        page: 'Cart Checkout',
        link: `/order-confirmation/${orderNo}`,
        skipDbSync: true
      });

      // 7. Store confirmation snapshot & trigger modal
      this.placedOrderDetails = {
        ...orderSnapshot,
        courier: this.pinResult?.courierService || 'Pan-India Express'
      };

      // 8. Clear cart
      this.cartService.clearCart();
      this.showOrderConfirmationModal = true;

    } catch (err: any) {
      console.error('Order creation error:', err);
      this.errorMessage = 'We could not complete your order right now. Please check your connection or contact RMS WhatsApp Support (+91 9284905118).';
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }
  }

  getWhatsAppConciergeLink(): string {
    if (!this.placedOrderDetails) return 'https://wa.me/919284905118';
    const text = encodeURIComponent(
      `Hello RMS Creations! I have just swiped & placed Order #${this.placedOrderDetails.orderNo} for ₹${this.placedOrderDetails.total}. Customer: ${this.placedOrderDetails.customerName} (${this.placedOrderDetails.phone}). Please share dispatch updates!`
    );
    return `https://wa.me/919284905118?text=${text}`;
  }

  scrollToAddress() {
    const el = document.getElementById('delivery-details-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  closeConfirmationModal() {
    this.showOrderConfirmationModal = false;
    this.router.navigate(['/shop']);
  }
}