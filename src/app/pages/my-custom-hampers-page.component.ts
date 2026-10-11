import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { AuthService } from '../services/auth.service';
import { CustomHamperService } from '../services/custom-hamper.service';
import { CustomHamperRequest } from '../models/custom-hamper.model';
import { ModalComponent } from '../shared/ui/modal.component';

@Component({
  selector: 'app-my-custom-hampers-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent, ModalComponent],
  template: `
    <app-site-layout>
      <div class="min-h-screen bg-[#FAF7F2] dark:bg-[#14100E] text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-28">
        
        <!-- HEADER -->
        <section class="bg-gradient-to-b from-[#F3E7DC]/70 to-transparent dark:from-white/5 py-10 border-b border-[#EADFD2]/60 dark:border-white/10">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <span class="text-xs font-bold uppercase tracking-widest text-[#9C4738] dark:text-[#EB9D8E]">Personalized Consultations</span>
            <h1 class="mt-2 font-serif text-3xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
              My Custom Hamper Requests
            </h1>
            <p class="mt-2 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393]">
              Track artisan review progress, inspect personalized quotations, and accept proposals to place confirmed orders.
            </p>
          </div>
        </section>

        <main class="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-5xl">
          
          <!-- AUTHENTICATION REQUIRED NOTICE -->
          <div *ngIf="!auth.isAuthenticated" class="text-center py-12 bg-white dark:bg-[#1E1916] rounded-3xl p-8 border border-[#EADFD2] dark:border-white/10 shadow-xs max-w-md mx-auto space-y-4">
            <i class="fa-solid fa-lock text-3xl text-[#9C4738]"></i>
            <h2 class="font-serif font-bold text-lg">Please Sign In</h2>
            <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">Sign in to track your personalized custom hamper consultation requests and quotations.</p>
            <a routerLink="/login" class="inline-block px-6 py-2.5 rounded-full bg-[#9C4738] text-white text-xs font-bold shadow hover:bg-[#883B2D] transition cursor-pointer">
              Sign In to Your Account
            </a>
          </div>

          <!-- LOGGED IN VIEW -->
          <div *ngIf="auth.isAuthenticated" class="space-y-6">
            
            <div class="flex items-center justify-between flex-wrap gap-3">
              <h2 class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED]">
                Consultation Requests ({{ requests.length }})
              </h2>
              <a routerLink="/build-hamper" class="px-5 py-2 rounded-full bg-[#9C4738] text-white text-xs font-bold shadow-2xs hover:bg-[#883B2D] transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
                <span>Build New Hamper</span>
              </a>
            </div>

            <!-- EMPTY STATE -->
            <div *ngIf="!loading && requests.length === 0" class="text-center py-16 bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-8 shadow-xs max-w-md mx-auto space-y-3">
              <div class="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 text-[#9C4738] mx-auto flex items-center justify-center text-2xl">
                <i class="fa-solid fa-gift"></i>
              </div>
              <h3 class="font-serif font-bold text-base">No Custom Requests Yet</h3>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                You haven't submitted any custom hamper consultation requests yet.
              </p>
              <a routerLink="/build-hamper" class="inline-block mt-3 px-6 py-2.5 rounded-full bg-[#9C4738] text-white text-xs font-bold shadow hover:bg-[#883B2D] transition cursor-pointer">
                Launch Hamper Studio
              </a>
            </div>

            <!-- REQUESTS LIST -->
            <div *ngIf="requests.length > 0" class="space-y-4">
              <div 
                *ngFor="let req of requests" 
                class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 sm:p-6 shadow-xs space-y-4 transition-all"
              >
                <!-- Header: Ref No, Date & Status -->
                <div class="flex items-start sm:items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-sm font-extrabold text-[#2E2825] dark:text-[#F4F1ED]">
                        {{ req.request_no }}
                      </span>
                      <span class="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase" [ngClass]="getStatusBadgeClass(req.status)">
                        {{ req.status }}
                      </span>
                    </div>
                    <p class="text-[11px] text-[#A89F91]">
                      Submitted on {{ req.creation_date ? (req.creation_date | date:'mediumDate') : 'Recently' }} • Theme: <strong>{{ req.theme || 'Bespoke' }}</strong> • Occasion: <strong>{{ req.occasion || 'Special' }}</strong>
                    </p>
                  </div>

                  <!-- Converted Order Badge -->
                  <div *ngIf="req.converted_order_no" class="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>Confirmed Order: {{ req.converted_order_no }}</span>
                  </div>
                </div>

                <!-- Items Preview Tiles -->
                <div *ngIf="req.items && req.items.length > 0" class="space-y-2">
                  <h4 class="text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                    Hamper Contents ({{ req.items.length }} items)
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    <div *ngFor="let it of req.items" class="p-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2]/70 dark:border-white/10 flex items-center gap-2.5">
                      <img [src]="it.reference_image_url || 'assets/logo.png'" class="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700">
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ it.item_name }}</p>
                        <p class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393]">
                          Qty: {{ it.quantity }} 
                          <span *ngIf="it.admin_confirmed_price" class="text-emerald-700 dark:text-emerald-400 font-bold ml-1">• ₹{{ it.admin_confirmed_price }}</span>
                          <span *ngIf="!it.admin_confirmed_price && it.unit_price_snapshot" class="ml-1">• ₹{{ it.unit_price_snapshot }}</span>
                          <span *ngIf="!it.admin_confirmed_price && !it.unit_price_snapshot" class="text-purple-600 dark:text-purple-400 ml-1">• Custom Item</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- QUOTATION RESPONSE CARD (When Quotation is Prepared) -->
                <div *ngIf="req.status === 'Quotation Prepared'" class="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#9C4738]/10 to-transparent border-2 border-amber-500/30 dark:border-amber-400/30 space-y-3">
                  <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2 text-[#9C4738] dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <i class="fa-solid fa-scroll text-sm"></i>
                      <span>Personalized Artisan Quotation Ready</span>
                    </div>

                    <div class="text-right">
                      <span class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] block">Final Quoted Price</span>
                      <span class="font-serif text-lg font-bold text-[#9C4738] dark:text-[#EB9D8E]">
                        ₹{{ (req.quoted_total || 0) + (req.quoted_delivery_charge || 0) }}
                      </span>
                      <span *ngIf="req.quoted_delivery_charge" class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] block">
                        (Incl. ₹{{ req.quoted_delivery_charge }} delivery)
                      </span>
                    </div>
                  </div>

                  <!-- Admin Response Notes -->
                  <div *ngIf="req.admin_response" class="p-3 bg-white/90 dark:bg-[#1E1916]/90 rounded-xl border border-black/5 dark:border-white/10 text-xs text-[#4A3C31] dark:text-[#F4F1ED] space-y-1">
                    <strong class="text-[#9C4738] block text-[11px]">Note from RMS Master Artisan:</strong>
                    <p class="leading-relaxed">{{ req.admin_response }}</p>
                  </div>

                  <!-- ACTIONS: ACCEPT OR DECLINE -->
                  <div class="pt-2 flex items-center justify-end gap-3 flex-wrap">
                    <button 
                      type="button" 
                      (click)="openDeclineModal(req)"
                      class="px-4 py-2 text-xs font-bold text-stone-500 hover:text-rose-600 rounded-xl border border-transparent hover:border-rose-200 transition cursor-pointer"
                    >
                      Decline Proposal
                    </button>

                    <button 
                      type="button" 
                      (click)="openAcceptModal(req)"
                      class="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <i class="fa-solid fa-check text-xs"></i>
                      <span>Accept Proposal &amp; Place Confirmed Order</span>
                    </button>
                  </div>
                </div>

                <!-- Footer Summary (When not in quotation prepared state) -->
                <div *ngIf="req.status !== 'Quotation Prepared'" class="flex items-center justify-between text-xs text-[#7A6C5E] dark:text-[#C5A393] pt-1">
                  <div>
                    Estimated Catalogue Subtotal: <strong class="text-[#2E2825] dark:text-[#F4F1ED]">₹{{ req.estimated_catalogue_total }}</strong>
                  </div>
                  <div class="italic text-[11px]">
                    {{ getStatusHelpText(req.status) }}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>

        <!-- ACCEPTANCE & SHIPPING CONFIRMATION MODAL -->
        <app-modal 
          [isOpen]="showAcceptModal" 
          [title]="'Confirm & Place Order: ' + activeRequest?.request_no" 
          size="lg"
          (onClose)="showAcceptModal = false"
        >
          <div *ngIf="activeRequest" class="space-y-4 py-1 text-xs text-[#2E2825] dark:text-[#F4F1ED]">
            <div class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">Accepted Quotation Amount</span>
                <span class="font-serif text-lg font-bold text-emerald-900 dark:text-emerald-100">
                  ₹{{ (activeRequest.quoted_total || 0) + (activeRequest.quoted_delivery_charge || 0) }}
                </span>
              </div>
              <span class="text-[11px] text-emerald-800 dark:text-emerald-300">
                100% Genuine Handcrafted Hamper
              </span>
            </div>

            <!-- Shipping Information Inputs -->
            <div class="space-y-3">
              <h4 class="font-bold text-xs uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                Delivery Address &amp; Contact
              </h4>

              <div>
                <label class="block text-[11px] font-bold mb-1">Street Address <span class="text-rose-500">*</span></label>
                <input type="text" [(ngModel)]="shippingAddress" placeholder="Flat / House No, Street, Landmark" class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]">
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold mb-1">City <span class="text-rose-500">*</span></label>
                  <input type="text" [(ngModel)]="shippingCity" class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]">
                </div>
                <div>
                  <label class="block text-[11px] font-bold mb-1">State <span class="text-rose-500">*</span></label>
                  <input type="text" [(ngModel)]="shippingState" class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]">
                </div>
                <div>
                  <label class="block text-[11px] font-bold mb-1">PIN Code <span class="text-rose-500">*</span></label>
                  <input type="text" [(ngModel)]="shippingPinCode" maxlength="6" class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]">
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold mb-1">Contact Phone <span class="text-rose-500">*</span></label>
                  <input type="tel" [(ngModel)]="shippingPhone" class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]">
                </div>

                <div>
                  <label class="block text-[11px] font-bold mb-1">Payment Mode <span class="text-rose-500">*</span></label>
                  <select [(ngModel)]="selectedPaymentMode" class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]">
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="ONLINE_UPI">0% Free UPI Online (7350120467)</option>
                  </select>
                </div>
              </div>

              <div *ngIf="selectedPaymentMode === 'ONLINE_UPI'">
                <label class="block text-[11px] font-bold mb-1">UPI Transaction UTR / Ref (Optional)</label>
                <input type="text" [(ngModel)]="upiUtrNo" placeholder="12-digit UTR from GPay / PhonePe / Paytm" class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]">
              </div>
            </div>

            <div *ngIf="actionErrorMessage" class="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 rounded-xl">
              {{ actionErrorMessage }}
            </div>
          </div>

          <div modal-footer class="w-full flex items-center justify-between gap-2">
            <button type="button" (click)="showAcceptModal = false" [disabled]="processingAction" class="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-700 cursor-pointer">
              Cancel
            </button>
            <button 
              type="button" 
              (click)="confirmAcceptAndPlaceOrder()" 
              [disabled]="processingAction"
              class="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <span *ngIf="processingAction" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ processingAction ? 'Confirming Order...' : 'Confirm Order Now' }}</span>
            </button>
          </div>
        </app-modal>

        <!-- DECLINE PROPOSAL CONFIRMATION MODAL -->
        <app-modal 
          [isOpen]="showDeclineModal" 
          title="Decline Custom Hamper Quotation" 
          size="sm"
          (onClose)="showDeclineModal = false"
        >
          <div class="space-y-3 py-1 text-xs">
            <p class="text-stone-600 dark:text-stone-300">
              Are you sure you want to decline this proposal? This will close the consultation without creating an order.
            </p>
            <div>
              <label class="block text-[11px] font-bold mb-1">Reason / Feedback (Optional)</label>
              <input type="text" [(ngModel)]="declineReason" placeholder="e.g. Budget adjustment or date changed" class="w-full px-3 py-2 rounded-xl text-xs bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]">
            </div>
          </div>

          <div modal-footer class="w-full flex items-center justify-between gap-2">
            <button type="button" (click)="showDeclineModal = false" class="px-4 py-2 text-xs font-bold text-stone-500 cursor-pointer">Keep Proposal</button>
            <button type="button" (click)="confirmDecline()" class="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow cursor-pointer">Decline Proposal</button>
          </div>
        </app-modal>

      </div>
    </app-site-layout>
  `
})
export class MyCustomHampersPageComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly auth = inject(AuthService);
  private readonly customHamperService = inject(CustomHamperService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  requests: CustomHamperRequest[] = [];
  loading = true;

  // Modals & Active Action
  activeRequest: CustomHamperRequest | null = null;
  showAcceptModal = false;
  showDeclineModal = false;
  processingAction = false;
  actionErrorMessage = '';

  // Shipping Form
  shippingAddress = '';
  shippingCity = 'Pune';
  shippingState = 'Maharashtra';
  shippingPinCode = '411038';
  shippingPhone = '';
  selectedPaymentMode: 'COD' | 'ONLINE_UPI' = 'COD';
  upiUtrNo = '';
  declineReason = '';

  async ngOnInit() {
    this.seo.setPageMetadata({
      title: 'My Custom Hamper Requests',
      description: 'Track and review your personalized custom hamper consultation requests and quotations.'
    });
    await this.loadRequests();
  }

  async loadRequests() {
    this.loading = true;
    this.cdr.markForCheck();

    const user = this.auth.currentUser;
    if (user) {
      this.shippingPhone = user.phone_no || '';
      this.requests = await this.customHamperService.getCustomerRequests(user.id, user.email);
    }
    this.loading = false;
    this.cdr.markForCheck();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Under Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'Quotation Prepared': return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 animate-pulse';
      case 'Accepted': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Declined': return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      default: return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300';
    }
  }

  getStatusHelpText(status: string): string {
    switch (status) {
      case 'New': return 'Our artisans have received your request and will review availability shortly.';
      case 'Under Review': return 'Sourcing items and checking custom specifications.';
      case 'Accepted': return 'Quotation accepted! Physical curation and packing initiated.';
      case 'Declined': return 'Consultation closed by customer.';
      default: return '';
    }
  }

  openAcceptModal(req: CustomHamperRequest) {
    this.activeRequest = req;
    this.actionErrorMessage = '';
    this.showAcceptModal = true;
    this.cdr.markForCheck();
  }

  openDeclineModal(req: CustomHamperRequest) {
    this.activeRequest = req;
    this.declineReason = '';
    this.showDeclineModal = true;
    this.cdr.markForCheck();
  }

  async confirmAcceptAndPlaceOrder() {
    if (!this.activeRequest) return;
    this.actionErrorMessage = '';

    if (!this.shippingAddress.trim() || !this.shippingCity.trim() || !this.shippingState.trim() || !this.shippingPinCode.trim() || !this.shippingPhone.trim()) {
      this.actionErrorMessage = 'Please complete all address and contact phone fields.';
      return;
    }

    this.processingAction = true;
    this.cdr.markForCheck();

    try {
      const res = await this.customHamperService.acceptQuotationAndCreateOrder(
        this.activeRequest.request_no,
        {
          address: this.shippingAddress,
          city: this.shippingCity,
          state: this.shippingState,
          pinCode: this.shippingPinCode,
          phone: this.shippingPhone,
          paymentMode: this.selectedPaymentMode,
          utrNo: this.upiUtrNo
        }
      );

      if (res.success && res.orderNo) {
        this.showAcceptModal = false;
        await this.loadRequests();
        this.router.navigate(['/order-confirmation', res.orderNo]);
      } else {
        this.actionErrorMessage = res.error || 'Failed to accept quotation. Please try again.';
      }
    } catch (err: any) {
      this.actionErrorMessage = err?.message || 'Error creating order from quotation.';
    } finally {
      this.processingAction = false;
      this.cdr.markForCheck();
    }
  }

  async confirmDecline() {
    if (!this.activeRequest) return;
    await this.customHamperService.declineQuotation(this.activeRequest.request_no, this.declineReason);
    this.showDeclineModal = false;
    await this.loadRequests();
  }
}
