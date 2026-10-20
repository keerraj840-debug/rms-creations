import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { CartService } from '../services/cart.service';
import { PinCodeAvailabilityService, DeliveryCheckResult } from '../services/pin-code-availability.service';
import { ItemSourcingImageService } from '../services/item-sourcing-image.service';

export interface HamperInclusionItem {
  id: number;
  name: string;
  quantity: number;
  category?: string;
  description?: string;
  image?: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  categoryId?: number;
  image: string;
  images: string[];
  inStock: boolean;
}

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent],
  template: `
    <app-site-layout [hideBottomNav]="true">
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-28">
        
        <!-- BREADCRUMBS BAR -->
        <nav aria-label="Breadcrumb" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 text-xs text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-2">
          <a routerLink="/" class="hover:text-[#9C4738] transition">Home</a>
          <span>/</span>
          <a routerLink="/shop" class="hover:text-[#9C4738] transition">Shop</a>
          <span>/</span>
          <span *ngIf="product" class="text-[#2E2825] dark:text-[#F4F1ED] font-bold truncate max-w-xs">{{ product.name }}</span>
        </nav>

        <!-- LOADING STATE -->
        <div *ngIf="loading" class="py-32 text-center">
          <div class="w-12 h-12 rounded-full border-4 border-[#9C4738] border-t-transparent animate-spin mx-auto"></div>
          <p class="mt-4 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393]">Loading product details...</p>
        </div>

        <!-- NOT FOUND STATE -->
        <div *ngIf="!loading && !product" class="py-24 text-center max-w-md mx-auto px-4">
          <div class="w-16 h-16 rounded-3xl bg-[#EADFD2]/70 dark:bg-white/10 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-2xl mx-auto">
            <i class="fa-solid fa-gift"></i>
          </div>
          <h2 class="mt-4 font-serif text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">Product Not Found</h2>
          <p class="mt-2 text-xs text-[#7A6C5E] dark:text-[#C5A393]">This gift item may have been moved or is currently not listed.</p>
          <a routerLink="/shop" class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9C4738] text-white text-xs font-bold shadow-md hover:bg-[#883B2D] transition active:scale-95">
            Browse All Hampers
          </a>
        </div>

        <!-- PRODUCT DETAILS CONTAINER -->
        <main *ngIf="!loading && product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          
          <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 sm:p-8 lg:p-10 shadow-xs">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              <!-- LEFT COLUMN: PHOTO GALLERY -->
              <div class="lg:col-span-6 space-y-4">
                <!-- Large Image Preview -->
                <div class="relative overflow-hidden rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/60 dark:border-white/10 aspect-square flex items-center justify-center">
                  <img 
                    [src]="activeImage" 
                    [alt]="product.name" 
                    class="w-full h-full object-contain cursor-zoom-in transition-transform duration-500 hover:scale-105"
                    (click)="openImageModal()"
                  />
                  <span class="absolute top-3 left-3 sm:top-4 sm:left-4 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-[#1E1916]/95 text-[#9C4738] dark:text-[#EB9D8E] border border-[#EADFD2]/60 dark:border-white/10 shadow-2xs">
                    {{ product.category }}
                  </span>
                </div>

                <!-- Thumbnails Strip -->
                <div *ngIf="product.images && product.images.length > 1" class="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  <button 
                    type="button"
                    *ngFor="let img of product.images; let idx = index"
                    (click)="activeImage = img"
                    [class]="activeImage === img ? 'ring-2 ring-[#9C4738] border-transparent' : 'border-[#EADFD2] dark:border-white/10 hover:opacity-85'"
                    class="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF7F2] dark:bg-[#251F1C] border shrink-0 transition cursor-pointer"
                  >
                    <img [src]="img" [alt]="product.name" class="w-full h-full object-cover" />
                  </button>
                </div>
              </div>

              <!-- RIGHT COLUMN: DETAILS & ADD TO CART -->
              <div class="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div>
                  
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      In Stock &amp; Ready to Ship
                    </span>
                    <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">•</span>
                    <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] font-medium">Product #{{ product.id }}</span>
                  </div>

                  <!-- Product Title -->
                  <h1 class="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2E2825] dark:text-[#F4F1ED] tracking-tight leading-tight">
                    {{ product.name }}
                  </h1>

                  <!-- Pricing Section -->
                  <div class="mt-4 flex items-baseline gap-3">
                    <span class="font-serif font-bold text-3xl sm:text-4xl text-[#9C4738] dark:text-[#EB9D8E]">
                      ₹{{ product.price }}
                    </span>
                    <span *ngIf="product.originalPrice > product.price" class="text-base text-[#7A6C5E] dark:text-[#C5A393] line-through">
                      ₹{{ product.originalPrice }}
                    </span>
                    <span *ngIf="product.originalPrice > product.price" class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Save ₹{{ product.originalPrice - product.price }}
                    </span>
                  </div>

                  <!-- What's Inside This Hamper: Individual Inclusions Grid (Items only, NO individual prices) -->
                  <div class="mt-5 pt-5 border-t border-[#EADFD2]/60 dark:border-white/10 space-y-3">
                    <div class="flex items-center justify-between">
                      <h3 class="text-xs font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-2">
                        <i class="fa-solid fa-gift text-[#9C4738] dark:text-[#EB9D8E]"></i>
                        <span>What's Inside This Hamper</span>
                      </h3>
                      <span *ngIf="inclusionItems.length > 0" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#9C4738]/10 text-[#9C4738] dark:text-[#EB9D8E]">
                        {{ totalInclusionPieces }} {{ totalInclusionPieces === 1 ? 'item' : 'items' }} included
                      </span>
                    </div>

                    <!-- Visual Grid of Individual Items (Zero Prices Shown) -->
                    <div *ngIf="inclusionItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                      <div *ngFor="let item of inclusionItems"
                           class="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2]/70 dark:border-white/10 hover:border-[#9C4738]/40 transition-all shadow-2xs group">
                        
                        <!-- Item Photo Thumbnail (NO PRICES) -->
                        <div class="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 shrink-0 flex items-center justify-center relative shadow-2xs">
                          <img *ngIf="item.image" [src]="item.image" (error)="item.image = ''" [alt]="item.name" class="w-full h-full object-cover">
                          <i *ngIf="!item.image" class="fa-solid fa-gift text-[#A89F91] text-sm"></i>
                          
                          <!-- Quantity pill badge if item count > 1 -->
                          <span *ngIf="item.quantity > 1" class="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#57251C] text-white shadow-xs">
                            {{ item.quantity }}x
                          </span>
                        </div>

                        <!-- Item Name & Notes (NO PRICES) -->
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center justify-between gap-1">
                            <h4 class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED] truncate group-hover:text-[#9C4738] dark:group-hover:text-[#EB9D8E] transition-colors">
                              {{ item.name }}
                            </h4>
                            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2]/60 dark:border-white/10 shrink-0">
                              {{ item.quantity }} {{ item.quantity === 1 ? 'pc' : 'pcs' }}
                            </span>
                          </div>
                          <!-- Optional category tag -->
                          <div *ngIf="item.category" class="mt-0.5">
                            <span class="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-[#9C4738]/10 text-[#9C4738] dark:text-[#EB9D8E] border border-[#9C4738]/20">
                              <i class="fa-solid fa-tag text-[8px]"></i> {{ item.category }}
                            </span>
                          </div>
                          <p *ngIf="item.description" class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-1 mt-0.5">
                            {{ item.description }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Fallback: Parsed Bullet Items from Description (if no mapped items yet) -->
                    <div *ngIf="inclusionItems.length === 0 && parsedDescriptionBullets.length > 0" class="space-y-1.5 bg-[#FAF7F2] dark:bg-white/5 p-3 rounded-2xl border border-[#EADFD2]/60 dark:border-white/10">
                      <div *ngFor="let bullet of parsedDescriptionBullets" class="flex items-start gap-2 text-xs text-[#4A3C31] dark:text-[#D9C3B9]">
                        <i class="fa-solid fa-circle-check text-emerald-600 text-[11px] mt-0.5 shrink-0"></i>
                        <span>{{ bullet }}</span>
                      </div>
                    </div>

                    <!-- General Packaging & Gift Box Notes -->
                    <p *ngIf="product.description && (inclusionItems.length === 0 ? parsedDescriptionBullets.length === 0 : true)"
                       class="text-xs text-[#7A6C5E] dark:text-[#C5A393] leading-relaxed whitespace-pre-line pt-1">
                      {{ product.description }}
                    </p>
                  </div>

                  <!-- PIN CODE DELIVERY CHECKER -->
                  <div class="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 space-y-2">
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                      <i class="fa-solid fa-location-dot text-[#9C4738] mr-1"></i>
                      Check Delivery to Your Pincode:
                    </label>
                    <div class="flex gap-2">
                      <input 
                        type="text" 
                        inputmode="numeric"
                        maxlength="6"
                        [(ngModel)]="pincodeQuery" 
                        (keyup.enter)="checkPincode()"
                        placeholder="e.g. 400001"
                        class="flex-1 px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs font-mono font-bold text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
                      />
                      <button 
                        type="button" 
                        (click)="checkPincode()"
                        [disabled]="checkingPincode || !pincodeQuery.trim()"
                        class="min-h-[40px] px-4 py-2 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] text-white text-xs font-bold hover:bg-[#9C4738] transition disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        <i *ngIf="checkingPincode" class="fa-solid fa-spinner fa-spin mr-1"></i>
                        <span>Check Pincode</span>
                      </button>
                    </div>
                    <div *ngIf="pincodeResult" class="text-[11px] font-medium pt-1" [ngClass]="pincodeResult.isServiceable ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600'">
                      <i class="fa-solid mr-1" [ngClass]="pincodeResult.isServiceable ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
                      <span>{{ pincodeResult.message }}</span>
                    </div>
                  </div>

                  <!-- Optional Personalization Gift Note -->
                  <div class="mt-5 p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 space-y-2">
                    <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                      <i class="fa-solid fa-pen-nib text-[#9C4738] mr-1"></i>
                      Gift Message Card (Optional):
                    </label>
                    <textarea 
                      [(ngModel)]="personalizationNote" 
                      rows="2" 
                      placeholder="Write your wishes here (e.g. Happy Birthday / Happy Diwali from Rahul)..."
                      class="w-full p-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs outline-none focus:border-[#9C4738]"
                    ></textarea>
                  </div>

                  <!-- Quantity Controls & Add to Cart Action -->
                  <div class="mt-6 pt-6 border-t border-[#EADFD2]/60 dark:border-white/10 space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                      
                      <!-- Quantity Stepper with 44px touch targets -->
                      <div class="flex items-center border border-[#EADFD2] dark:border-white/10 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] overflow-hidden shrink-0 w-36 justify-between p-1">
                        <button 
                          type="button" 
                          (click)="decrementQty()" 
                          class="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1916] text-[#4A3C31] dark:text-[#F4F1ED] font-bold text-sm hover:bg-[#F3E7DC] dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center active:scale-95"
                          aria-label="Decrease quantity"
                        >
                          <i class="fa-solid fa-minus text-xs"></i>
                        </button>
                        <span class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED] px-3 font-mono">
                          {{ quantity }}
                        </span>
                        <button 
                          type="button" 
                          (click)="incrementQty()" 
                          class="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1916] text-[#4A3C31] dark:text-[#F4F1ED] font-bold text-sm hover:bg-[#F3E7DC] dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center active:scale-95"
                          aria-label="Increase quantity"
                        >
                          <i class="fa-solid fa-plus text-xs"></i>
                        </button>
                      </div>

                      <!-- STRICT BUSINESS RULE: ADD TO CART ONLY (No Direct-Order Bypass) -->
                      <button 
                        type="button" 
                        (click)="onAddToCart()"
                        class="flex-1 min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#57251C] to-[#9C4738] hover:from-[#451B14] hover:to-[#883B2D] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-98 transition flex items-center justify-center gap-2.5 cursor-pointer"
                      >
                        <i class="fa-solid fa-bag-shopping text-base"></i>
                        <span>{{ cartItemQty > 0 ? ('Add (' + quantity + ' more) — ₹' + (product.price * quantity)) : ('Add ' + (quantity > 1 ? (quantity + ' Items') : 'to Cart') + ' — ₹' + (product.price * quantity)) }}</span>
                      </button>

                    </div>

                    <!-- In-cart notification badge -->
                    <div *ngIf="cartItemQty > 0" class="flex items-center gap-2 text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] bg-[#9C4738]/10 dark:bg-[#EB9D8E]/10 p-2.5 rounded-xl border border-[#9C4738]/20">
                      <i class="fa-solid fa-circle-check text-emerald-600"></i>
                      <span>You currently have {{ cartItemQty }} of this item in your cart.</span>
                    </div>

                    <!-- Quick Navigation Links -->
                    <div class="flex items-center justify-between text-xs pt-2">
                      <a routerLink="/cart" class="font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline flex items-center gap-1">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span>View Cart ({{ cartService.totalItemsCount }} items) →</span>
                      </a>
                      <a routerLink="/shop" class="text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825]">
                        Continue Shopping
                      </a>
                    </div>
                  </div>

                </div>

                <!-- ASSURANCE BADGES -->
                <div class="grid grid-cols-3 gap-2.5 sm:gap-3 pt-6 border-t border-[#EADFD2]/60 dark:border-white/10 text-center text-xs">
                  <div class="p-2.5 sm:p-3 bg-[#FAF7F2] dark:bg-white/5 rounded-xl border border-[#EADFD2]/50 dark:border-white/10">
                    <i class="fa-solid fa-gift text-base text-[#9C4738] dark:text-[#EB9D8E] mb-1 block"></i>
                    <span class="font-bold text-[10px] sm:text-[11px] text-[#2E2825] dark:text-[#F4F1ED] block">100% Handcrafted</span>
                    <span class="text-[9px] sm:text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">Premium Gift Box</span>
                  </div>
                  <div class="p-2.5 sm:p-3 bg-[#FAF7F2] dark:bg-white/5 rounded-xl border border-[#EADFD2]/50 dark:border-white/10">
                    <i class="fa-solid fa-truck-fast text-base text-[#9C4738] dark:text-[#EB9D8E] mb-1 block"></i>
                    <span class="font-bold text-[10px] sm:text-[11px] text-[#2E2825] dark:text-[#F4F1ED] block">Safe Delivery</span>
                    <span class="text-[9px] sm:text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">No-Damage Packing</span>
                  </div>
                  <div class="p-2.5 sm:p-3 bg-[#FAF7F2] dark:bg-white/5 rounded-xl border border-[#EADFD2]/50 dark:border-white/10">
                    <i class="fa-solid fa-wallet text-base text-[#9C4738] dark:text-[#EB9D8E] mb-1 block"></i>
                    <span class="font-bold text-[10px] sm:text-[11px] text-[#2E2825] dark:text-[#F4F1ED] block">Cash on Delivery</span>
                    <span class="text-[9px] sm:text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">Pay at Doorstep</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </main>

        <!-- STICKY MOBILE BOTTOM BUY BAR (Fixed to bottom with safe-area spacing and quantity stepper) -->
        <aside 
          *ngIf="product && !loading"
          aria-label="Quick Add to Cart"
          class="fixed bottom-0 inset-x-0 z-40 bg-[#FFFDFC]/98 dark:bg-[#1C1816]/98 backdrop-blur-md border-t border-[#D9C3B9]/50 dark:border-[#3D302A] px-3.5 py-2.5 md:hidden shadow-2xl flex items-center justify-between gap-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
        >
          <div class="min-w-0">
            <div class="flex items-baseline gap-1">
              <span class="font-serif font-bold text-lg text-[#9C4738] dark:text-[#EB9D8E]">₹{{ product.price * quantity }}</span>
              <span *ngIf="product.originalPrice > product.price" class="text-[10px] text-[#7A6C5E] line-through">₹{{ product.originalPrice * quantity }}</span>
            </div>
            <span *ngIf="cartItemQty > 0" class="block text-[10px] text-[#9C4738] dark:text-[#EB9D8E] font-bold">
              {{ cartItemQty }} already in cart
            </span>
            <span *ngIf="cartItemQty === 0" class="block text-[10px] text-emerald-600 font-bold truncate">
              In Stock &bull; Cash on Delivery
            </span>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Compact Stepper in sticky bar -->
            <div class="flex items-center border border-[#EADFD2] dark:border-white/10 rounded-xl bg-[#FAF7F2] dark:bg-[#251F1C] overflow-hidden p-0.5">
              <button 
                type="button" 
                (click)="decrementQty()" 
                class="w-7 h-7 rounded-lg bg-white dark:bg-[#1E1916] text-[#4A3C31] dark:text-[#F4F1ED] font-bold text-xs hover:bg-[#F3E7DC] dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center active:scale-95"
                aria-label="Decrease quantity"
              >
                <i class="fa-solid fa-minus text-[10px]"></i>
              </button>
              <span class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED] px-2 font-mono">
                {{ quantity }}
              </span>
              <button 
                type="button" 
                (click)="incrementQty()" 
                class="w-7 h-7 rounded-lg bg-white dark:bg-[#1E1916] text-[#4A3C31] dark:text-[#F4F1ED] font-bold text-xs hover:bg-[#F3E7DC] dark:hover:bg-white/10 transition cursor-pointer flex items-center justify-center active:scale-95"
                aria-label="Increase quantity"
              >
                <i class="fa-solid fa-plus text-[10px]"></i>
              </button>
            </div>

            <!-- Add to Cart Button -->
            <button 
              type="button"
              (click)="onAddToCart()"
              class="min-h-[38px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#57251C] to-[#9C4738] hover:from-[#451B14] hover:to-[#883B2D] text-white font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <i class="fa-solid fa-bag-shopping text-xs"></i>
              <span>{{ cartItemQty > 0 ? ('Add (' + quantity + ')') : 'Add to Cart' }}</span>
            </button>
          </div>
        </aside>

        <!-- FULL RESOLUTION PREVIEW MODAL -->
        <div *ngIf="showImageModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" (click)="showImageModal = false">
          <div class="relative max-w-4xl max-h-[90vh] bg-white dark:bg-[#1E1916] rounded-2xl overflow-hidden p-2 shadow-2xl" (click)="$event.stopPropagation()">
            <button (click)="showImageModal = false" class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <img [src]="activeImage" [alt]="product?.name" class="max-h-[85vh] w-auto mx-auto object-contain" />
          </div>
        </div>

      </div>
    </app-site-layout>
  `
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly supabase = inject(SupabaseService);
  private readonly seo = inject(SeoService);
  public readonly cartService = inject(CartService);
  private readonly pinService = inject(PinCodeAvailabilityService);
  private readonly itemSourcing = inject(ItemSourcingImageService);
  private readonly cdr = inject(ChangeDetectorRef);

  product: ProductDetail | null = null;
  inclusionItems: HamperInclusionItem[] = [];
  loadingItems = false;
  loading = true;
  activeImage = '';
  quantity = 1;
  personalizationNote = '';
  showImageModal = false;

  get totalInclusionPieces(): number {
    return this.inclusionItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
  }

  get parsedDescriptionBullets(): string[] {
    if (!this.product?.description) return [];
    const lines = this.product.description.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const hasBullets = lines.some(l => /^[-*•\d+.]\s+/.test(l));
    if (hasBullets) {
      return lines.map(l => l.replace(/^[-*•\d+.]\s+/, '').trim()).filter(Boolean);
    }
    return [];
  }

  pincodeQuery = '';
  checkingPincode = false;
  pincodeResult: DeliveryCheckResult | null = null;

  @HostListener('window:keydown.escape')
  handleEscape() {
    if (this.showImageModal) this.showImageModal = false;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.loadProduct(Number(idStr));
      } else {
        this.loading = false;
      }
    });
  }

  async loadProduct(id: number) {
    try {
      this.loading = true;
      const { data: p, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (p && !error) {
        let catName = 'Gift Hamper';
        if (p.category_id) {
          const { data: c } = await this.supabase.from('categories').select('name, price').eq('id', p.category_id).single();
          if (c) catName = c.name;
        }

        const extractedPrice = parseInt(p.name.match(/₹(\d+)/)?.[1] || '199', 10);
        const rawPrice = Number(p.price || 0);
        const rawSellingPrice = Number(p.selling_price || 0);
        let finalPrice = rawSellingPrice || rawPrice || (isNaN(extractedPrice) || extractedPrice <= 0 ? 199 : extractedPrice);
        let originalPrice: number | undefined = undefined;

        if (rawPrice > 0 && rawSellingPrice > 0 && rawPrice > rawSellingPrice) {
          finalPrice = rawSellingPrice;
          originalPrice = rawPrice;
        }

        const images = p.images && p.images.length > 0 ? p.images : ['assets/banners/banner.png'];

        this.product = {
          id: p.id,
          name: p.name,
          description: p.description || 'Thoughtfully curated handcrafted gift creation with premium packaging.',
          price: Number(finalPrice),
          originalPrice: originalPrice || Number(finalPrice),
          category: catName,
          categoryId: p.category_id,
          image: images[0],
          images: images,
          inStock: true
        };
        this.activeImage = this.product.image;

        this.seo.setPageMetadata({
          title: `${this.product.name} — RMS Creations`,
          description: this.product.description.slice(0, 160),
          keywords: `${this.product.name}, ${this.product.category}, gift hamper, order gift hamper, luxury gift box`,
          slug: `product/${this.product.id}`,
          ogImage: this.product.image
        });

        // Rich Schema.org Product & Breadcrumb JSON-LD for Search Engine Snippets
        this.seo.setProductSchema({
          id: this.product.id,
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          image: this.product.image,
          category: this.product.category,
          inStock: this.product.inStock
        });

        this.seo.setBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Shop All Hampers', url: '/shop' },
          { name: this.product.category, url: `/shop?category=${encodeURIComponent(this.product.category)}` },
          { name: this.product.name, url: `/product/${this.product.id}` }
        ]);

        await this.loadHamperItems(p.id);
      } else {
        this.product = null;
        this.inclusionItems = [];
      }
    } catch {
      this.product = null;
      this.inclusionItems = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async loadHamperItems(productId: number) {
    try {
      this.loadingItems = true;
      const { data: mappings } = await this.supabase
        .from('product_mappings')
        .select('product_detail_id, quantity')
        .eq('product_id', productId);

      if (mappings && mappings.length > 0) {
        const detailIds = mappings
          .map((m: any) => m.product_detail_id)
          .filter((id: any) => id !== null && id !== undefined);

        if (detailIds.length > 0) {
          let details: any[] | null = null;
          const res = await this.supabase
            .from('product_details')
            .select('id, name, description, image, category')
            .in('id', detailIds);

          if (res.error && (res.error.code === '42703' || res.error.message?.includes('column'))) {
            const fallbackRes = await this.supabase
              .from('product_details')
              .select('id, name, description, image')
              .in('id', detailIds);
            details = fallbackRes.data;
          } else {
            details = res.data;
          }

          if (details && details.length > 0) {
            const detailMap = new Map<number, any>();
            details.forEach((d: any) => detailMap.set(Number(d.id), d));

            this.inclusionItems = mappings
              .filter((m: any) => detailMap.has(Number(m.product_detail_id)))
              .map((m: any) => {
                const d = detailMap.get(Number(m.product_detail_id));
                const parsed = this.itemSourcing.extractMetadataFromDescription(d.description);
                const category = d.category || parsed.category || undefined;
                return {
                  id: d.id,
                  name: d.name,
                  quantity: m.quantity || 1,
                  category: category ? String(category).trim() : undefined,
                  description: parsed.cleanDescription || '',
                  image: d.image || parsed.image || ''
                };
              });
          } else {
            this.inclusionItems = [];
          }
        } else {
          this.inclusionItems = [];
        }
      } else {
        this.inclusionItems = [];
      }
    } catch (err) {
      console.warn('Could not load hamper items', err);
      this.inclusionItems = [];
    } finally {
      this.loadingItems = false;
      this.cdr.markForCheck();
    }
  }

  async checkPincode() {
    if (!this.pincodeQuery || this.pincodeQuery.trim().length !== 6) {
      this.pincodeResult = {
        isServiceable: false,
        pinCode: this.pincodeQuery || '',
        baseCharge: 0,
        above1kgCharge: 0,
        calculatedDeliveryFee: 0,
        totalWeightKg: 0.5,
        freeDeliveryApplied: false,
        message: 'Please enter a valid 6-digit postal PIN code.'
      };
      return;
    }
    this.checkingPincode = true;
    try {
      const subtotal = (this.product?.price || 0) * this.quantity;
      const weight = ((this.product as any)?.weight_kg || 0.5) * this.quantity;
      const isHamper = this.product?.category?.toLowerCase().includes('hamper') || this.product?.name?.toLowerCase().includes('hamper');
      this.pincodeResult = await this.pinService.checkDelivery(this.pincodeQuery.trim(), subtotal, weight, !!isHamper);
    } finally {
      this.checkingPincode = false;
      this.cdr.markForCheck();
    }
  }

  get cartItemQty(): number {
    if (!this.product) return 0;
    const item = this.cartService.items.find(i => i.productId === this.product?.id || i.id === String(this.product?.id));
    return item ? item.quantity : 0;
  }

  incrementQty() {
    this.quantity++;
    this.cdr.markForCheck();
  }

  decrementQty() {
    if (this.quantity > 1) {
      this.quantity--;
      this.cdr.markForCheck();
    }
  }

  onAddToCart() {
    if (!this.product) return;
    this.cartService.addToCart({
      id: String(this.product.id),
      productId: this.product.id,
      title: this.product.name,
      price: this.product.price,
      image: this.product.image,
      category: this.product.category
    }, this.quantity, this.personalizationNote.trim() || undefined);
    this.cdr.markForCheck();
  }

  openImageModal() {
    this.showImageModal = true;
  }

  ngOnDestroy() {
    this.seo.removeJsonLd('product-json-ld');
    this.seo.removeJsonLd('breadcrumbs-json-ld');
  }
}
