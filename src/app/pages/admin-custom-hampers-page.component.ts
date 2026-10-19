import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomHamperService } from '../services/custom-hamper.service';
import { CustomHamperRequest, CustomHamperStatus } from '../models/custom-hamper.model';
import { ModalComponent } from '../shared/ui/modal.component';

@Component({
  selector: 'app-admin-custom-hampers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class=" mx-auto space-y-6 pb-20">

      <!-- Top Action Bar / Header -->
      <div class="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-[#EADFD2]/80 dark:border-white/10">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <i class="fa-solid fa-gift mr-1"></i> Custom Requests
            </span>
          </div>
          <h1 class="font-serif text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED] mt-1">
            Custom Hamper Requests
          </h1>
          <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
            Review custom hamper requests, set item prices, and send quotes to customers.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button (click)="loadRequests()" class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] bg-white dark:bg-[#251F1C] rounded-xl border border-[#EADFD2] dark:border-white/10 transition shadow-2xs cursor-pointer flex items-center gap-1.5">
            <i class="fa-solid fa-rotate-right text-xs"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 p-4 shadow-2xs space-y-3">
        <div class="flex items-center justify-between flex-wrap gap-3">

          <!-- Status Filter Tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
            <button
              type="button"
              *ngFor="let s of statusTabs"
              (click)="selectStatusTab(s)"
              class="px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer"
              [ngClass]="activeStatusTab === s ? 'bg-[#9C4738] text-white shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393] hover:bg-[#FAF7F2] dark:hover:bg-white/5'"
            >
              {{ s }}
              <span class="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                {{ getCountForStatus(s) }}
              </span>
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative w-full sm:w-64">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-xs text-[#A89F91]"></i>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search by ref, customer, phone..."
              class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738] dark:text-[#F4F1ED]"
            >
          </div>

        </div>
      </div>

      <!-- Requests List Table / Grid -->
      <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 overflow-hidden shadow-2xs">

        <div *ngIf="filteredRequests.length === 0" class="p-12 text-center text-xs text-stone-400 space-y-2">
          <i class="fa-solid fa-inbox text-3xl text-stone-300 dark:text-stone-700 block mb-2"></i>
          <p>No custom hamper requests found for current filters.</p>
        </div>

        <div *ngIf="filteredRequests.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#EADFD2] dark:border-white/10 text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">
              <tr>
                <th class="py-3 px-4">Request Ref</th>
                <th class="py-3 px-4">Customer</th>
                <th class="py-3 px-4">Occasion &amp; Theme</th>
                <th class="py-3 px-4">Items Breakdown</th>
                <th class="py-3 px-4">Pricing Status</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EADFD2]/60 dark:divide-white/10">
              <tr *ngFor="let req of filteredRequests" class="hover:bg-[#FAF7F2]/50 dark:hover:bg-white/5 transition">

                <!-- Ref & Date -->
                <td class="py-3.5 px-4 font-mono font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                  <div>{{ req.request_no }}</div>
                  <span class="text-[10px] font-normal text-[#A89F91]">
                    {{ req.creation_date ? (req.creation_date | date:'shortDate') : 'Today' }}
                  </span>
                </td>

                <!-- Customer Details -->
                <td class="py-3.5 px-4">
                  <div class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ req.customer_name }}</div>
                  <div class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">{{ req.customer_phone }}</div>
                  <div class="text-[10px] text-[#A89F91] truncate max-w-[150px]">{{ req.customer_email }}</div>
                </td>

                <!-- Occasion & Theme -->
                <td class="py-3.5 px-4">
                  <span class="font-bold text-[#4A3C31] dark:text-stone-200 block">{{ req.occasion }}</span>
                  <span class="text-[10px] text-[#A89F91]">{{ req.theme }} ({{ req.recipient_gender }})</span>
                </td>

                <!-- Items Breakdown -->
                <td class="py-3.5 px-4">
                  <div class="text-xs font-semibold">
                    {{ req.items?.length || 0 }} items total
                  </div>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span *ngIf="hasCustomItems(req)" class="px-2 py-0.2 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Has Custom Sourcing
                    </span>
                    <span *ngIf="!hasCustomItems(req)" class="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Catalogue Only
                    </span>
                  </div>
                </td>

                <!-- Pricing Status -->
                <td class="py-3.5 px-4">
                  <div *ngIf="req.quoted_total" class="font-bold text-[#9C4738] dark:text-[#EB9D8E]">
                    Quoted: ₹{{ (req.quoted_total || 0) + (req.quoted_delivery_charge || 0) }}
                  </div>
                  <div *ngIf="!req.quoted_total" class="text-[#7A6C5E] dark:text-[#C5A393]">
                    Cat. Est: ₹{{ req.estimated_catalogue_total }}
                  </div>
                  <span *ngIf="req.converted_order_no" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                    Order #{{ req.converted_order_no }}
                  </span>
                </td>

                <!-- Status Badge -->
                <td class="py-3.5 px-4">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase" [ngClass]="getStatusBadgeClass(req.status)">
                    {{ req.status }}
                  </span>
                </td>

                <!-- Action Button -->
                <td class="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    (click)="openReviewModal(req)"
                    class="px-3 py-1.5 rounded-xl bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold transition shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <i class="fa-solid fa-clipboard-check text-[10px]"></i>
                    <span>Review &amp; Quote</span>
                  </button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- ADMIN REVIEW & QUOTATION MODAL -->
      <app-modal
        [isOpen]="showReviewModal"
        [title]="'Artisan Review & Quotation: ' + selectedRequest?.request_no"
        size="lg"
        (onClose)="showReviewModal = false"
      >
        <div *ngIf="selectedRequest" class="space-y-5 py-1 text-xs text-[#2E2825] dark:text-[#F4F1ED] max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">

          <!-- Customer & Occasion Card -->
          <div class="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span class="text-[10px] font-bold text-[#A89F91] uppercase block">Customer</span>
              <strong class="text-xs">{{ selectedRequest.customer_name }}</strong>
              <div class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">{{ selectedRequest.customer_phone }}</div>
              <div class="text-[10px] text-[#A89F91]">{{ selectedRequest.customer_email }}</div>
            </div>

            <div>
              <span class="text-[10px] font-bold text-[#A89F91] uppercase block">Celebration Details</span>
              <strong class="text-xs">{{ selectedRequest.occasion }}</strong>
              <div class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Theme: {{ selectedRequest.theme }}</div>
              <div class="text-[10px] text-[#A89F91]">Recipient: {{ selectedRequest.recipient_gender }}</div>
            </div>

            <div>
              <span class="text-[10px] font-bold text-[#A89F91] uppercase block">Current Workflow State</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block mt-0.5" [ngClass]="getStatusBadgeClass(selectedRequest.status)">
                {{ selectedRequest.status }}
              </span>
              <div *ngIf="selectedRequest.converted_order_no" class="text-[10px] font-bold text-emerald-600 mt-1">
                Linked Order: {{ selectedRequest.converted_order_no }}
              </div>
            </div>
          </div>

          <!-- Customer Personal Greeting Card Message -->
          <div *ngIf="selectedRequest.personal_message" class="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-xl">
            <strong class="text-[11px] text-amber-900 dark:text-amber-200 block mb-0.5">
              <i class="fa-solid fa-pen-fancy mr-1"></i> Requested Calligraphy Gift Note:
            </strong>
            <p class="italic text-xs font-serif leading-relaxed">“{{ selectedRequest.personal_message }}”</p>
          </div>

          <div *ngIf="selectedRequest.customer_notes" class="p-3 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10">
            <strong class="text-[11px] text-[#4A3C31] dark:text-stone-300 block mb-0.5">Customer Instructions / Dietary:</strong>
            <p>{{ selectedRequest.customer_notes }}</p>
          </div>

          <!-- ITEMS INSPECTION & ADMIN PRICING SECTION -->
          <div class="space-y-3">
            <div class="flex items-center justify-between pb-1 border-b border-[#EADFD2]/60 dark:border-white/10">
              <h3 class="font-serif font-bold text-sm">
                Hamper Items Breakdown ({{ selectedRequest.items?.length || 0 }} items)
              </h3>
              <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                Cat. Subtotal: ₹{{ selectedRequest.estimated_catalogue_total }}
              </span>
            </div>

            <div class="space-y-3">
              <div
                *ngFor="let it of selectedRequest.items; let idx = index"
                class="p-3.5 rounded-2xl border transition-all"
                [ngClass]="it.is_confirmed_catalogue ? 'bg-[#FAF7F2] dark:bg-white/5 border-[#EADFD2] dark:border-white/10' : 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/40'"
              >
                <div class="flex items-start justify-between gap-3 flex-wrap">

                  <!-- Thumbnail & Title -->
                  <div class="flex items-start gap-3 min-w-0">
                    <img [src]="it.reference_image_url || 'assets/logo.png'" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-black/10 dark:border-white/10 bg-white">
                    <div class="min-w-0">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span *ngIf="it.is_confirmed_catalogue" class="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Catalogue Item
                        </span>
                        <span *ngIf="!it.is_confirmed_catalogue" class="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          Custom Requested Item
                        </span>
                      </div>

                      <h4 class="font-bold text-xs mt-0.5">{{ it.item_name }}</h4>
                      <p *ngIf="it.item_description" class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                        {{ it.item_description }}
                      </p>
                      <p class="text-[10px] text-[#A89F91]">Requested Quantity: <strong>{{ it.quantity }}</strong></p>
                    </div>
                  </div>

                  <!-- Price Confirmation Control -->
                  <div class="shrink-0 text-right">
                    <div *ngIf="it.is_confirmed_catalogue">
                      <span class="text-[10px] text-[#A89F91] block">Catalogue Snapshot</span>
                      <strong class="text-xs text-[#2E2825] dark:text-[#F4F1ED]">
                        ₹{{ it.unit_price_snapshot }} &times; {{ it.quantity }} = ₹{{ (it.unit_price_snapshot || 0) * it.quantity }}
                      </strong>
                    </div>

                    <!-- Custom Item Price Input for Admin -->
                    <div *ngIf="!it.is_confirmed_catalogue" class="space-y-1">
                      <label class="block text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                        Confirm Custom Price (₹)
                      </label>
                      <div class="flex items-center gap-1">
                        <span>₹</span>
                        <input
                          type="number"
                          [(ngModel)]="customItemPrices[it.item_name]"
                          (ngModelChange)="recalculateQuotationTotal()"
                          min="0"
                          placeholder="Price per unit"
                          class="w-24 px-2 py-1 text-xs rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-[#1E1916] text-right font-bold"
                        >
                      </div>
                      <span class="text-[10px] text-purple-600 block">
                        Total: ₹{{ (customItemPrices[it.item_name] || 0) * it.quantity }}
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>

          <!-- ADMIN QUOTATION BUILDER & MESSAGE -->
          <div class="p-4 rounded-2xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 shadow-xs space-y-4">
            <h3 class="font-serif font-bold text-sm text-[#9C4738] dark:text-[#EB9D8E] flex items-center gap-2">
              <i class="fa-solid fa-file-invoice-dollar"></i>
              <span>Artisan Quotation &amp; Consultation Message</span>
            </h3>

            <!-- Price Breakdown Inputs -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-[11px] font-bold mb-1">Items Total Amount (₹)</label>
                <input
                  type="number"
                  [(ngModel)]="quotationItemsTotal"
                  min="0"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 font-bold"
                >
              </div>

              <div>
                <label class="block text-[11px] font-bold mb-1">Delivery / Courier Charge (₹)</label>
                <input
                  type="number"
                  [(ngModel)]="quotationDeliveryCharge"
                  min="0"
                  class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 font-bold"
                >
              </div>

              <div>
                <label class="block text-[11px] font-bold mb-1">Final Customer Total (₹)</label>
                <div class="w-full px-3 py-2 text-xs rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 font-extrabold text-[#9C4738] dark:text-[#EB9D8E]">
                  ₹{{ quotationItemsTotal + quotationDeliveryCharge }}
                </div>
              </div>
            </div>

            <!-- Personalized Response Note -->
            <div>
              <label class="block text-[11px] font-bold mb-1">
                Personalized Response / Quotation Message to Customer <span class="text-rose-500">*</span>
              </label>
              <textarea
                [(ngModel)]="quotationAdminResponse"
                rows="3"
                placeholder="e.g. Hello! We have sourced your requested brass aarti diya and confirmed availability for all Ganpati items. Your hamper will be packaged with satin ribbons and dispatch is scheduled for tomorrow."
                class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]"
              ></textarea>
            </div>

            <!-- Internal Admin Notes -->
            <div>
              <label class="block text-[11px] font-bold mb-1">Internal Admin Sourcing Notes (Private)</label>
              <input
                type="text"
                [(ngModel)]="quotationAdminNotes"
                placeholder="e.g. Sourced via Ravi Handicrafts, cost price ₹280 per thali."
                class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 focus:outline-hidden focus:border-[#9C4738]"
              >
            </div>

            <!-- Status Selector -->
            <div>
              <label class="block text-[11px] font-bold mb-1">Update Workflow Status</label>
              <select [(ngModel)]="quotationStatus" class="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 font-bold">
                <option value="New">New (Unreviewed)</option>
                <option value="Under Review">Under Review (Checking Availability)</option>
                <option value="Quotation Prepared">Quotation Prepared (Ready for Customer Acceptance)</option>
                <option value="Awaiting Customer">Awaiting Customer Reply</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div *ngIf="saveErrorMessage" class="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold">
              {{ saveErrorMessage }}
            </div>
          </div>

        </div>

        <div modal-footer class="w-full flex items-center justify-between gap-3">
          <button type="button" (click)="showReviewModal = false" class="px-4 py-2 text-xs font-bold text-stone-500 hover:text-stone-700 cursor-pointer">
            Close
          </button>

          <button
            type="button"
            (click)="saveQuotationAndNotifyCustomer()"
            [disabled]="isSaving"
            class="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            <span *ngIf="isSaving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <i *ngIf="!isSaving" class="fa-solid fa-paper-plane text-xs"></i>
            <span>{{ isSaving ? 'Saving Quotation...' : 'Save & Send Quotation to Customer' }}</span>
          </button>
        </div>
      </app-modal>

    </div>
  `
})
export class AdminCustomHampersPageComponent implements OnInit {
  private readonly customHamperService = inject(CustomHamperService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly statusTabs = ['All', 'New', 'Under Review', 'Quotation Prepared', 'Accepted', 'Declined', 'Completed'];
  activeStatusTab = 'All';
  searchQuery = '';

  allRequests: CustomHamperRequest[] = [];
  loading = false;

  // Review Modal State
  selectedRequest: CustomHamperRequest | null = null;
  showReviewModal = false;
  isSaving = false;
  saveErrorMessage = '';

  // Quotation Editor State
  customItemPrices: Record<string, number> = {};
  quotationItemsTotal = 0;
  quotationDeliveryCharge = 49;
  quotationAdminResponse = '';
  quotationAdminNotes = '';
  quotationStatus: CustomHamperStatus = 'Quotation Prepared';

  async ngOnInit() {
    await this.loadRequests();
  }

  async loadRequests() {
    this.loading = true;
    this.cdr.markForCheck();
    this.allRequests = await this.customHamperService.getAllRequests();
    this.loading = false;
    this.cdr.markForCheck();
  }

  selectStatusTab(status: string) {
    this.activeStatusTab = status;
    this.cdr.markForCheck();
  }

  getCountForStatus(status: string): number {
    if (status === 'All') return this.allRequests.length;
    return this.allRequests.filter(r => r.status === status).length;
  }

  get filteredRequests(): CustomHamperRequest[] {
    return this.allRequests.filter(req => {
      const matchesTab = this.activeStatusTab === 'All' || req.status === this.activeStatusTab;
      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        req.request_no.toLowerCase().includes(q) ||
        req.customer_name.toLowerCase().includes(q) ||
        req.customer_phone.toLowerCase().includes(q) ||
        req.customer_email.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }

  hasCustomItems(req: CustomHamperRequest): boolean {
    return (req.items || []).some(it => !it.is_confirmed_catalogue);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'Under Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'Quotation Prepared': return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'Accepted': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Declined': return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      case 'Completed': return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300';
      default: return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300';
    }
  }

  openReviewModal(req: CustomHamperRequest) {
    this.selectedRequest = req;
    this.saveErrorMessage = '';
    this.customItemPrices = {};

    // Populate existing item confirmed prices
    (req.items || []).forEach(it => {
      if (!it.is_confirmed_catalogue) {
        this.customItemPrices[it.item_name] = it.admin_confirmed_price || 0;
      }
    });

    this.quotationDeliveryCharge = req.quoted_delivery_charge ?? 49;
    this.quotationAdminResponse = req.admin_response || '';
    this.quotationAdminNotes = req.admin_notes || '';
    this.quotationStatus = req.status === 'New' ? 'Quotation Prepared' : req.status;

    this.recalculateQuotationTotal();

    this.showReviewModal = true;
    this.cdr.markForCheck();
  }

  recalculateQuotationTotal() {
    if (!this.selectedRequest) return;

    let total = 0;
    (this.selectedRequest.items || []).forEach(it => {
      if (it.is_confirmed_catalogue) {
        total += (it.unit_price_snapshot || 0) * (it.quantity || 1);
      } else {
        const customPrice = this.customItemPrices[it.item_name] || 0;
        total += customPrice * (it.quantity || 1);
      }
    });

    this.quotationItemsTotal = total;
  }

  async saveQuotationAndNotifyCustomer() {
    if (!this.selectedRequest) return;
    this.saveErrorMessage = '';

    if (!this.quotationAdminResponse.trim()) {
      this.saveErrorMessage = 'Please enter a personalized consultation response message for the customer.';
      return;
    }

    this.isSaving = true;
    this.cdr.markForCheck();

    try {
      const itemPriceUpdates = Object.entries(this.customItemPrices).map(([itemName, confirmedPrice]) => ({
        itemName,
        confirmedPrice
      }));

      const res = await this.customHamperService.updateAdminQuotation(
        this.selectedRequest.request_no,
        {
          quoted_total: this.quotationItemsTotal,
          quoted_delivery_charge: this.quotationDeliveryCharge,
          admin_response: this.quotationAdminResponse.trim(),
          admin_notes: this.quotationAdminNotes.trim(),
          status: this.quotationStatus,
          itemPriceUpdates
        }
      );

      if (res.success) {
        this.showReviewModal = false;
        await this.loadRequests();
      } else {
        this.saveErrorMessage = res.error || 'Failed to save quotation.';
      }
    } catch (err: any) {
      this.saveErrorMessage = err?.message || 'Error saving quotation.';
    } finally {
      this.isSaving = false;
      this.cdr.markForCheck();
    }
  }
}
