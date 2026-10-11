import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { CartService, CartItem } from '../services/cart.service';
import { PinCodeAvailabilityService, DeliveryCheckResult } from '../services/pin-code-availability.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-24">
        
        <!-- Header -->
        <div class="bg-gradient-to-b from-[#F3E7DC]/60 to-transparent dark:from-white/5 py-8 md:py-12 border-b border-[#EADFD2]/60 dark:border-white/10">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
              Your Shopping Cart
            </h1>
            <p class="mt-2 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393]">
              Review your handpicked hampers before proceed to checkout.
            </p>
          </div>
        </div>

        <main class="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          <!-- EMPTY CART STATE -->
          <div *ngIf="cartService.items.length === 0" class="py-20 text-center bg-white dark:bg-[#1E1916] rounded-3xl border border-dashed border-[#EADFD2] dark:border-white/10 p-8 max-w-lg mx-auto shadow-xs">
            <div class="w-16 h-16 rounded-3xl bg-[#FAF7F2] dark:bg-white/5 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-3xl mx-auto">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <h2 class="mt-5 font-serif text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
              Your Cart is Empty
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] max-w-sm mx-auto">
              You haven't added any gift hampers yet. Explore our bestselling collections and festive specials!
            </p>
            <div class="mt-8 flex flex-wrap justify-center gap-3">
              <a 
                routerLink="/shop" 
                class="px-6 py-3 rounded-full bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold uppercase tracking-wider shadow-md transition active:scale-95"
              >
                Browse Shop Catalog →
              </a>
              <a 
                routerLink="/ganpati-hampers" 
                class="px-6 py-3 rounded-full border border-[#9C4738] text-[#9C4738] dark:text-[#EB9D8E] hover:bg-[#FAF7F2] dark:hover:bg-white/5 text-xs font-bold uppercase tracking-wider transition"
              >
                Ganpati Specials
              </a>
            </div>
          </div>

          <!-- FILLED CART VIEW -->
          <div *ngIf="cartService.items.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT 8 COLS: CART ITEMS LIST -->
            <div class="lg:col-span-8 space-y-4">
              
              <!-- Items Card Container -->
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 sm:p-7 shadow-xs">
                
                <div class="flex items-center justify-between pb-4 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <span class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED]">
                    Items in Cart ({{ cartService.totalItemsCount }})
                  </span>
                  <button 
                    type="button" 
                    (click)="cartService.clearCart()" 
                    class="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <i class="fa-solid fa-trash-can text-[11px]"></i>
                    <span>Clear Cart</span>
                  </button>
                </div>

                <!-- Individual Item Row -->
                <div class="divide-y divide-[#EADFD2]/60 dark:divide-white/10">
                  <div 
                    *ngFor="let item of cartService.items" 
                    class="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <!-- Media + Info -->
                    <div class="flex items-center gap-4 flex-1">
                      <img 
                        [src]="item.image || 'assets/banners/banner.png'" 
                        [alt]="item.title" 
                        class="w-20 h-20 rounded-2xl object-cover bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/60 dark:border-white/10 shrink-0"
                      />
                      <div>
                        <span *ngIf="item.category" class="text-[10px] font-bold text-[#9C4738] dark:text-[#EB9D8E] uppercase tracking-wider block">
                          {{ item.category }}
                        </span>
                        <h3 class="font-serif font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED] leading-snug">
                          {{ item.title }}
                        </h3>
                        <p class="font-serif font-bold text-sm text-[#9C4738] dark:text-[#EB9D8E] mt-0.5">
                          ₹{{ item.price }} each
                        </p>
                        <p *ngIf="item.notes" class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] italic mt-1 line-clamp-1">
                          "{{ item.notes }}"
                        </p>
                      </div>
                    </div>

                    <!-- Quantity Controls & Line Total -->
                    <div class="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0">
                      <!-- Stepper -->
                      <div class="flex items-center border border-[#EADFD2] dark:border-white/10 rounded-xl bg-[#FAF7F2] dark:bg-[#251F1C] overflow-hidden p-0.5">
                        <button 
                          type="button" 
                          (click)="cartService.updateQuantity(item.id, item.quantity - 1)"
                          class="w-7 h-7 rounded-lg bg-white dark:bg-[#1E1916] text-[#4A3C31] dark:text-[#F4F1ED] text-xs font-bold hover:bg-[#F3E7DC] dark:hover:bg-white/10 flex items-center justify-center cursor-pointer"
                          aria-label="Decrease"
                        >
                          <i class="fa-solid fa-minus text-[10px]"></i>
                        </button>
                        <span class="w-8 text-center font-bold text-xs font-mono text-[#2E2825] dark:text-[#F4F1ED]">
                          {{ item.quantity }}
                        </span>
                        <button 
                          type="button" 
                          (click)="cartService.updateQuantity(item.id, item.quantity + 1)"
                          class="w-7 h-7 rounded-lg bg-white dark:bg-[#1E1916] text-[#4A3C31] dark:text-[#F4F1ED] text-xs font-bold hover:bg-[#F3E7DC] dark:hover:bg-white/10 flex items-center justify-center cursor-pointer"
                          aria-label="Increase"
                        >
                          <i class="fa-solid fa-plus text-[10px]"></i>
                        </button>
                      </div>

                      <!-- Line Item Subtotal -->
                      <div class="text-right min-w-18">
                        <span class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">
                          ₹{{ item.price * item.quantity }}
                        </span>
                      </div>

                      <!-- Remove Action -->
                      <button 
                        type="button"
                        (click)="cartService.removeFromCart(item.id)"
                        class="p-2 text-[#7A6C5E] hover:text-rose-600 transition cursor-pointer"
                        title="Remove item"
                      >
                        <i class="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>

                  </div>
                </div>

                <!-- Bottom Shopping Link -->
                <div class="pt-5 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-between">
                  <a routerLink="/shop" class="text-xs font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline flex items-center gap-1.5">
                    <i class="fa-solid fa-arrow-left text-[10px]"></i>
                    <span>Add More Items</span>
                  </a>
                  <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                    Prices inclusive of all taxes
                  </span>
                </div>

              </div>

              <!-- Delivery Offer Box -->
              <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-3 text-xs">
                <i class="fa-solid fa-truck-fast text-emerald-600 text-lg shrink-0"></i>
                <div class="flex-1">
                  <p *ngIf="cartService.subtotal >= 499" class="font-bold text-emerald-800 dark:text-emerald-300">
                    Congratulations! Your order qualifies for FREE Doorstep Delivery!
                  </p>
                  <p *ngIf="cartService.subtotal < 499" class="text-emerald-800 dark:text-emerald-300">
                    Add ₹{{ 499 - cartService.subtotal }} more to get <strong>FREE delivery</strong> (Flat ₹49 otherwise).
                  </p>
                </div>
              </div>

            </div>

            <!-- RIGHT 4 COLS: ORDER SUMMARY & CHECKOUT -->
            <div class="lg:col-span-4 space-y-4">
              
              <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 shadow-xs space-y-5">
                
                <h2 class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED] pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  Order Summary
                </h2>

                <!-- PIN Code Serviceability Check Box -->
                <div class="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/80 dark:border-white/10 space-y-2">
                  <label class="block text-[11px] font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                    Check Delivery to Your PIN Code:
                  </label>
                  <div class="flex gap-2">
                    <input 
                      type="text" 
                      maxlength="6"
                      [(ngModel)]="checkPinCode" 
                      (keyup.enter)="checkDeliveryAvailability()"
                      placeholder="e.g. 411038"
                      class="flex-1 px-3 py-1.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs font-mono font-bold text-[#2E2825] dark:text-[#F4F1ED] outline-none"
                    />
                    <button 
                      type="button" 
                      (click)="checkDeliveryAvailability()"
                      [disabled]="checkingPin || !checkPinCode.trim()"
                      class="px-3 py-1.5 rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition disabled:opacity-50 cursor-pointer"
                    >
                      <i *ngIf="checkingPin" class="fa-solid fa-spinner fa-spin mr-1"></i>
                      <span>Check</span>
                    </button>
                  </div>

                  <div *ngIf="pinResult" class="pt-1 text-[11px] font-medium" [ngClass]="pinResult.isServiceable ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600'">
                    <i class="fa-solid mr-1" [ngClass]="pinResult.isServiceable ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
                    <span>{{ pinResult.message }}</span>
                  </div>
                </div>

                <div class="space-y-3 text-xs">
                  <div class="flex justify-between items-center text-[#7A6C5E] dark:text-[#C5A393]">
                    <span>Items Subtotal:</span>
                    <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">₹{{ cartService.subtotal }}</span>
                  </div>

                  <div class="flex justify-between items-center text-[#7A6C5E] dark:text-[#C5A393]">
                    <span>Total Weight:</span>
                    <span class="font-semibold text-[#2E2825] dark:text-[#F4F1ED]">{{ cartService.totalWeightKg }} kg</span>
                  </div>

                  <div class="flex justify-between items-center text-[#7A6C5E] dark:text-[#C5A393]">
                    <span>Delivery Charges:</span>
                    <span *ngIf="cartService.deliveryFee === 0" class="font-bold text-emerald-600 uppercase text-[11px]">
                      FREE
                    </span>
                    <span *ngIf="cartService.deliveryFee > 0" class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                      ₹{{ cartService.deliveryFee }}
                    </span>
                  </div>

                  <div class="pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 flex justify-between items-baseline">
                    <span class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">Final Payable:</span>
                    <span class="font-serif font-bold text-2xl text-[#9C4738] dark:text-[#EB9D8E]">
                      ₹{{ cartService.finalTotal }}
                    </span>
                  </div>
                </div>

                <!-- PROCEED TO CHECKOUT BUTTON (Guaranteed Cart-to-Checkout Flow) -->
                <div class="pt-2">
                  <a 
                    routerLink="/checkout"
                    class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#57251C] to-[#9C4738] hover:from-[#451B14] hover:to-[#883B2D] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <span>Proceed to Checkout</span>
                    <i class="fa-solid fa-arrow-right text-xs"></i>
                  </a>
                </div>

                <!-- Trust Points -->
                <div class="space-y-2 pt-2 text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-circle-check text-emerald-600 text-xs"></i>
                    <span>Cash on Delivery (COD) Available</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-qrcode text-emerald-600 text-xs"></i>
                    <span>Free 0% UPI to 7350120467</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-headset text-emerald-600 text-xs"></i>
                    <span>Customer Support: 9284905118</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </main>

      </div>
    </app-site-layout>
  `
})
export class CartPageComponent implements OnInit {
  public readonly cartService = inject(CartService);
  private readonly pinService = inject(PinCodeAvailabilityService);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);

  checkPinCode = '';
  checkingPin = false;
  pinResult: DeliveryCheckResult | null = null;

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'Shopping Cart — RMS Gift Hampers',
      description: 'Review your selected gift hampers, update quantities, check PIN code serviceability, and proceed to secure checkout.',
      keywords: 'shopping cart, checkout gift hampers, rms creations cart',
      slug: 'cart'
    });
  }

  async checkDeliveryAvailability() {
    const clean = this.checkPinCode.trim().replace(/\D/g, '');
    if (clean.length !== 6) {
      this.pinResult = {
        isServiceable: false,
        pinCode: clean,
        baseCharge: 0,
        above1kgCharge: 0,
        calculatedDeliveryFee: 0,
        totalWeightKg: this.cartService.totalWeightKg,
        freeDeliveryApplied: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      };
      return;
    }

    this.checkingPin = true;
    try {
      this.pinResult = await this.pinService.checkDelivery(
        clean,
        this.cartService.subtotal,
        this.cartService.totalWeightKg
      );
      if (this.pinResult.isServiceable) {
        this.cartService.setVerifiedDeliveryFee(this.pinResult.calculatedDeliveryFee);
      }
    } finally {
      this.checkingPin = false;
      this.cdr.markForCheck();
    }
  }
}

