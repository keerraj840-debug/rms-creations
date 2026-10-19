import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CheckoutService, CheckoutItem, CustomerOrderPayload } from '../../services/checkout.service';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" 
         class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fade-in"
         (click)="onBackdropClick($event)">
      
      <div class="relative w-full max-w-xl bg-[#FFFDFC] dark:bg-[#1E1916] rounded-3xl shadow-2xl border border-[#D9C3B9]/60 dark:border-[#3D302A] overflow-hidden my-auto transition-all"
           (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-5 py-4 bg-[#FAF7F2] dark:bg-white/5 border-b border-[#EADFD2] dark:border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-[#9C4738]/10 dark:bg-[#9C4738]/20 text-[#9C4738] dark:text-[#E89382] flex items-center justify-center text-sm">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <div>
              <h2 class="font-serif font-bold text-base sm:text-lg text-[#2E2825] dark:text-[#F4F1ED] leading-tight">
                {{ isOrderPlaced ? 'Order Confirmed!' : 'Place Your Order' }}
              </h2>
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] leading-none mt-0.5">
                {{ isOrderPlaced ? 'We will send updates on Email & WhatsApp' : 'Direct secure order with COD or 100% Free UPI' }}
              </p>
            </div>
          </div>

          <button type="button" (click)="close()" 
                  class="w-8 h-8 rounded-full bg-white dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] flex items-center justify-center text-xs transition cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Body: Step 1 Checkout Form OR Step 2 Order Success -->
        <div class="p-5 max-h-[80vh] overflow-y-auto">
          
          <!-- SCREEN 1: CHECKOUT FORM -->
          <div *ngIf="!isOrderPlaced && currentItem" class="space-y-5">
            
            <!-- Item Summary Bar -->
            <div class="p-3.5 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl flex items-center gap-3.5">
              <img *ngIf="currentItem.image" [src]="currentItem.image" [alt]="currentItem.title" 
                   class="w-14 h-14 rounded-xl object-cover border border-[#EADFD2] dark:border-white/10 shrink-0" />
              <div *ngIf="!currentItem.image" class="w-14 h-14 rounded-xl bg-[#EADFD2] dark:bg-white/10 flex items-center justify-center text-[#9C4738] shrink-0 text-xl">
                <i class="fa-solid fa-gift"></i>
              </div>

              <div class="flex-1 min-w-0">
                <p class="font-bold text-xs sm:text-sm text-[#2E2825] dark:text-[#F4F1ED] truncate">
                  {{ currentItem.title }}
                </p>
                <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                  ₹{{ currentItem.price }} each
                </p>
              </div>

              <!-- Quantity Stepper -->
              <div class="flex items-center gap-2 bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-xl px-2 py-1 shrink-0">
                <button type="button" (click)="decrementQty()" [disabled]="quantity <= 1"
                        class="w-6 h-6 rounded-lg text-[#7A6C5E] hover:text-[#9C4738] disabled:opacity-30 font-bold flex items-center justify-center text-xs cursor-pointer">
                  -
                </button>
                <span class="text-xs font-bold font-mono text-[#2E2825] dark:text-[#F4F1ED] w-5 text-center">
                  {{ quantity }}
                </span>
                <button type="button" (click)="incrementQty()"
                        class="w-6 h-6 rounded-lg text-[#7A6C5E] hover:text-[#9C4738] font-bold flex items-center justify-center text-xs cursor-pointer">
                  +
                </button>
              </div>
            </div>

            <!-- Price Breakdown Box -->
            <div class="flex items-center justify-between text-xs px-1">
              <span class="text-[#7A6C5E] dark:text-[#C5A393]">Subtotal ({{ quantity }} item{{ quantity > 1 ? 's' : '' }}):</span>
              <span class="font-serif font-bold text-base text-[#9C4738] dark:text-[#E89382]">₹{{ totalAmount }}</span>
            </div>

            <!-- CUSTOMER DETAILS FORM -->
            <form (ngSubmit)="placeOrder()" class="space-y-3.5 text-xs">
              
              <div class="border-t border-[#EADFD2]/60 dark:border-white/10 pt-3">
                <p class="font-bold text-[11px] uppercase tracking-wider text-[#A89F91] mb-2.5">
                  1. Contact &amp; Delivery Details
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Your Full Name *</label>
                    <input type="text" [(ngModel)]="customerName" name="customerName" required placeholder="e.g. Priya Sharma"
                           class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/20">
                  </div>

                  <div>
                    <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">WhatsApp / Phone Number *</label>
                    <input type="tel" [(ngModel)]="customerPhone" name="customerPhone" required placeholder="e.g. 9820012345" maxlength="12"
                           class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/20">
                    <span class="text-[10px] text-[#A89F91] mt-0.5 block">We will send dispatch updates to this WhatsApp</span>
                  </div>
                </div>

                <div class="mt-3">
                  <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Email Address *</label>
                  <input type="email" [(ngModel)]="customerEmail" name="customerEmail" required placeholder="e.g. priya@gmail.com"
                         class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/20">
                  <span class="text-[10px] text-[#A89F91] mt-0.5 block">We will email your full order receipt and tracking code</span>
                </div>

                <div class="mt-3">
                  <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Complete Street Address *</label>
                  <textarea [(ngModel)]="customerAddress" name="customerAddress" required rows="2" placeholder="House/Flat number, Building name, Street, Landmark"
                            class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/20"></textarea>
                </div>

                <div class="grid grid-cols-3 gap-2.5 mt-3">
                  <div>
                    <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">City *</label>
                    <input type="text" [(ngModel)]="customerCity" name="customerCity" required placeholder="Mumbai"
                           class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                  </div>
                  <div>
                    <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">PIN Code *</label>
                    <input type="text" [(ngModel)]="customerPin" name="customerPin" required placeholder="400001" maxlength="6"
                           class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                  </div>
                  <div>
                    <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">State *</label>
                    <input type="text" [(ngModel)]="customerState" name="customerState" required placeholder="Maharashtra"
                           class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                  </div>
                </div>
              </div>

              <!-- PAYMENT MODE SELECTOR -->
              <div class="border-t border-[#EADFD2]/60 dark:border-white/10 pt-3">
                <p class="font-bold text-[11px] uppercase tracking-wider text-[#A89F91] mb-2.5">
                  2. Choose Payment Mode
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <!-- COD Card -->
                  <div (click)="paymentMode = 'COD'"
                       [class]="paymentMode === 'COD' ? 'border-[#9C4738] bg-[#FDF6F0] dark:bg-[#9C4738]/10 ring-2 ring-[#9C4738]/30' : 'border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C]'"
                       class="p-3.5 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center gap-2">
                        <i class="fa-solid fa-hand-holding-dollar text-sm text-[#9C4738]"></i>
                        <span class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED]">Cash on Delivery</span>
                      </div>
                      <span *ngIf="paymentMode === 'COD'" class="w-4 h-4 rounded-full bg-[#9C4738] text-white flex items-center justify-center text-[9px]">
                        <i class="fa-solid fa-check"></i>
                      </span>
                    </div>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-2">
                      Pay in cash or UPI when your parcel arrives at your door.
                    </p>
                  </div>

                  <!-- ONLINE UPI Card (100% Free to 7350120467) -->
                  <div (click)="paymentMode = 'ONLINE_UPI'"
                       [class]="paymentMode === 'ONLINE_UPI' ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/20 ring-2 ring-emerald-500/30' : 'border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#251F1C]'"
                       class="p-3.5 border rounded-2xl cursor-pointer transition-all flex flex-col justify-between">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center gap-2">
                        <i class="fa-solid fa-qrcode text-sm text-emerald-600"></i>
                        <span class="font-bold text-xs text-[#2E2825] dark:text-[#F4F1ED]">Online UPI (0% Fee)</span>
                      </div>
                      <span class="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                        Free
                      </span>
                    </div>
                    <p class="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2">
                      Direct UPI transfer to <strong>{{ checkoutService.upiNumber }}</strong> (GPay / PhonePe / Paytm).
                    </p>
                  </div>

                </div>

                <!-- ONLINE UPI DETAILS (Appears when ONLINE_UPI selected) -->
                <div *ngIf="paymentMode === 'ONLINE_UPI'" 
                     class="mt-3.5 p-4 rounded-2xl bg-white dark:bg-[#181412] border border-emerald-200 dark:border-emerald-800/40 space-y-3.5 animate-fade-in">
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span class="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                        Transfer ₹{{ totalAmount }} directly to store account
                      </span>
                    </div>
                    <span class="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">100% Free UPI</span>
                  </div>

                  <!-- Phone / UPI ID Box -->
                  <div class="p-3 bg-[#FAF7F2] dark:bg-white/5 rounded-xl border border-[#EADFD2] dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-[#A89F91] uppercase tracking-wider block">Receiver Number / UPI ID</span>
                      <p class="font-mono font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED] mt-0.5">
                        {{ checkoutService.upiNumber }} ({{ checkoutService.upiId }})
                      </p>
                    </div>
                    <button type="button" (click)="copyUpiId()"
                            class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer">
                      <i class="fa-regular fa-copy"></i>
                      <span>{{ copiedUpi ? 'Copied!' : 'Copy' }}</span>
                    </button>
                  </div>

                  <!-- QR Code & Deep Link Section -->
                  <div class="flex flex-col sm:flex-row items-center gap-3.5 p-2 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl">
                    <!-- Dynamic QR -->
                    <div class="bg-white p-2 rounded-xl shadow-xs border border-emerald-200 shrink-0 text-center">
                      <img [src]="qrCodeUrl" alt="Scan to pay via UPI" class="w-32 h-32 mx-auto rounded-lg" />
                      <span class="text-[9px] font-bold text-[#7A6C5E] mt-1 block">Scan with any UPI App</span>
                    </div>

                    <!-- Mobile App Deep Link Buttons -->
                    <div class="space-y-2 text-left flex-1 w-full">
                      <p class="text-[11px] text-[#4A3C31] dark:text-[#F4F1ED] font-medium leading-tight">
                        On mobile? Click below to launch your payment app with ₹{{ totalAmount }} pre-filled:
                      </p>
                      
                      <div class="grid grid-cols-2 gap-2">
                        <a [href]="upiDeepLink" class="px-2.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-emerald-300 dark:border-white/10 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] text-center shadow-2xs hover:bg-emerald-50 transition">
                          <i class="fa-brands fa-google-pay text-sm mr-1"></i> Google Pay
                        </a>
                        <a [href]="upiDeepLink" class="px-2.5 py-2 rounded-xl bg-white dark:bg-white/10 border border-emerald-300 dark:border-white/10 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] text-center shadow-2xs hover:bg-emerald-50 transition">
                          <i class="fa-solid fa-mobile-screen-button text-sm mr-1"></i> PhonePe / Paytm
                        </a>
                      </div>

                      <!-- UTR Number Input -->
                      <div class="pt-1">
                        <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] text-[11px] mb-1">
                          After payment, enter 12-digit UPI Reference / UTR Number:
                        </label>
                        <input type="text" [(ngModel)]="utrNo" name="utrNo" placeholder="e.g. 429810294829 (optional)"
                               class="w-full px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-white/10 bg-white dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] font-mono text-xs outline-none">
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <!-- Error Message -->
              <div *ngIf="submitError" class="p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                {{ submitError }}
              </div>

              <!-- Submit Button -->
              <div class="pt-2">
                <button type="submit" [disabled]="isSubmitting"
                        class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#9C4738] via-[#BA5E4E] to-[#9C4738] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                  <span *ngIf="isSubmitting" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>{{ isSubmitting ? 'Recording Your Order...' : ('Place Order Now • ₹' + totalAmount) }}</span>
                </button>
                <p class="text-[10px] text-center text-[#A89F91] mt-2">
                  🔒 Verified Order Confirmation • Updates sent to your Email &amp; WhatsApp
                </p>
              </div>

            </form>

          </div>

          <!-- SCREEN 2: ORDER SUCCESS WITH EMAIL & WHATSAPP UPDATES -->
          <div *ngIf="isOrderPlaced" class="space-y-4 text-center py-2 animate-fade-in">
            
            <div class="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-sm">
              <i class="fa-solid fa-circle-check"></i>
            </div>

            <div>
              <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] inline-block mb-1">
                Order #{{ confirmedOrderNo }}
              </span>
              <h3 class="font-serif text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                Order Confirmed!
              </h3>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1 max-w-md mx-auto">
                Thank you, <strong>{{ customerName }}</strong>! Your gift order has been received and scheduled for dispatch.
              </p>
            </div>

            <!-- Order Snapshot Box -->
            <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl text-left text-xs space-y-2">
              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Item:</span>
                <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ currentItem?.title }} ({{ quantity }}x)</span>
              </div>
              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Total Amount:</span>
                <span class="font-serif font-bold text-base text-[#9C4738] dark:text-[#E89382]">₹{{ totalAmount }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Payment Mode:</span>
                <span class="font-medium text-[#2E2825] dark:text-[#F4F1ED]">
                  {{ paymentMode === 'COD' ? 'Cash on Delivery (COD)' : ('Paid Online via UPI to ' + checkoutService.upiNumber) }}
                </span>
              </div>
              <div class="flex justify-between items-start pt-1">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Delivery To:</span>
                <span class="font-medium text-right text-[#2E2825] dark:text-[#F4F1ED] max-w-[220px]">
                  {{ customerAddress }}, {{ customerCity }} - {{ customerPin }}
                </span>
              </div>
            </div>

            <!-- Real-Time Updates Channels -->
            <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-left space-y-3">
              <div class="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <i class="fa-solid fa-bell text-sm"></i>
                <span>Receive Order Updates:</span>
              </div>
              <p class="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                We send order packaging photos, dispatch receipts, and live courier tracking to your WhatsApp and Email:
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <!-- 1. WhatsApp Update Action -->
                <a [href]="whatsAppReceiptUrl" target="_blank"
                   class="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition">
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  <span>WhatsApp Updates</span>
                </a>

                <!-- 2. Email Receipt Action -->
                <a [href]="emailReceiptUrl"
                   class="px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-emerald-300 dark:border-white/10 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs hover:bg-emerald-50 transition">
                  <i class="fa-solid fa-envelope text-xs"></i>
                  <span>Email Confirmation</span>
                </a>
              </div>
            </div>

            <!-- Done Button -->
            <div class="pt-2">
              <button type="button" (click)="close()"
                      class="w-full py-3 rounded-xl bg-[#57251C] dark:bg-[#C56D5B] text-white font-bold text-xs hover:bg-[#9C4738] transition cursor-pointer">
                Done &amp; Continue Shopping
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  `
})
export class CheckoutModalComponent implements OnInit, OnDestroy {
  public checkoutService = inject(CheckoutService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = false;
  currentItem: CheckoutItem | null = null;
  quantity = 1;

  // Form State
  customerName = '';
  customerPhone = '';
  customerEmail = '';
  customerAddress = '';
  customerCity = '';
  customerState = 'Maharashtra';
  customerPin = '';
  paymentMode: 'COD' | 'ONLINE_UPI' = 'ONLINE_UPI';
  utrNo = '';

  isSubmitting = false;
  submitError = '';
  isOrderPlaced = false;
  confirmedOrderNo = '';
  copiedUpi = false;

  private sub?: Subscription;

  get totalAmount(): number {
    return Math.max(0, (this.currentItem?.price || 0) * this.quantity);
  }

  get upiDeepLink(): string {
    if (!this.currentItem) return '';
    return this.checkoutService.getUpiPaymentUrl(this.totalAmount, 'RMS-ORDER', this.currentItem.title);
  }

  get qrCodeUrl(): string {
    return this.checkoutService.getQrCodeUrl(this.upiDeepLink);
  }

  get whatsAppReceiptUrl(): string {
    if (!this.currentItem) return '';
    const fullAddr = `${this.customerAddress}, ${this.customerCity} - ${this.customerPin}`;
    const mode = this.paymentMode === 'COD' ? 'Cash on Delivery (COD)' : `Paid Online UPI to ${this.checkoutService.upiNumber} (UTR: ${this.utrNo || 'Submitted'})`;
    return this.checkoutService.getWhatsAppUpdateLink(
      this.confirmedOrderNo,
      this.customerName,
      this.currentItem.title,
      this.totalAmount,
      mode,
      fullAddr
    );
  }

  get emailReceiptUrl(): string {
    if (!this.currentItem) return '';
    const fullAddr = `${this.customerAddress}, ${this.customerCity} - ${this.customerPin}`;
    const mode = this.paymentMode === 'COD' ? 'Cash on Delivery (COD)' : `Paid Online UPI to ${this.checkoutService.upiNumber} (UTR: ${this.utrNo || 'Submitted'})`;
    return this.checkoutService.getEmailUpdateLink(
      this.confirmedOrderNo,
      this.customerName,
      this.customerEmail,
      this.currentItem.title,
      this.totalAmount,
      mode,
      fullAddr
    );
  }

  ngOnInit() {
    this.sub = this.checkoutService.isOpen$.subscribe(open => {
      this.isOpen = open;
      this.cdr.markForCheck();
    });

    this.checkoutService.activeItem$.subscribe(item => {
      this.currentItem = item;
      this.quantity = item?.quantity || 1;
      this.isOrderPlaced = false;
      this.submitError = '';
      this.copiedUpi = false;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  incrementQty() {
    this.quantity++;
  }

  decrementQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  copyUpiId() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.checkoutService.upiNumber);
      this.copiedUpi = true;
      setTimeout(() => {
        this.copiedUpi = false;
        this.cdr.markForCheck();
      }, 2500);
    }
  }

  onBackdropClick(event: MouseEvent) {
    this.close();
  }

  close() {
    this.checkoutService.close();
    this.isOrderPlaced = false;
    this.submitError = '';
  }

  async placeOrder() {
    if (!this.customerName.trim()) {
      this.submitError = 'Please enter your full name.';
      return;
    }
    if (!this.customerPhone.trim() || this.customerPhone.replace(/\D/g, '').length < 10) {
      this.submitError = 'Please enter a valid 10-digit mobile number for WhatsApp updates.';
      return;
    }
    if (!this.customerEmail.trim() || !this.customerEmail.includes('@')) {
      this.submitError = 'Please enter a valid email address for your order confirmation.';
      return;
    }
    if (!this.customerAddress.trim() || !this.customerCity.trim() || !this.customerPin.trim()) {
      this.submitError = 'Please fill out your delivery address, city, and PIN code.';
      return;
    }

    if (!this.currentItem) return;

    this.isSubmitting = true;
    this.submitError = '';
    this.cdr.markForCheck();

    const payload: CustomerOrderPayload = {
      customerName: this.customerName,
      phone: this.customerPhone,
      email: this.customerEmail,
      address: this.customerAddress,
      city: this.customerCity,
      state: this.customerState,
      pinCode: this.customerPin,
      paymentMode: this.paymentMode,
      utrNo: this.utrNo,
      quantity: this.quantity,
      totalAmount: this.totalAmount,
      item: this.currentItem
    };

    const res = await this.checkoutService.submitCustomerOrder(payload);

    this.isSubmitting = false;
    if (res.success) {
      this.confirmedOrderNo = res.orderNo;
      this.isOrderPlaced = true;
    } else {
      this.submitError = res.error || 'Failed to place order. Please try again.';
    }
    this.cdr.markForCheck();
  }
}
