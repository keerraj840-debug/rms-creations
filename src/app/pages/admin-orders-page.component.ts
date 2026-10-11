import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { PinCodeAvailabilityService, DeliveryCheckResult } from '../services/pin-code-availability.service';
import { CardComponent } from '../shared/ui/card.component';
import { ModalComponent } from '../shared/ui/modal.component';
import { TableComponent, TableColumn } from '../shared/ui/table.component';
import { PurchaseOrder, PurchaseOrderDetail } from '../models/purchase-order.model';

export interface OrderAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  adminName: string;
}

@Component({
  selector: 'app-admin-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ModalComponent, TableComponent],
  template: `
    <div class="space-y-5 max-w-7xl mx-auto pb-12 transition-colors duration-300">
      
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-xl sm:text-2xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] tracking-tight">
              Order Processing Dashboard
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">
              {{ orders.length }} orders
            </span>
          </div>
          <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
            Streamlined processing, automated delivery eligibility check, payment auditing, and status tracking.
          </p>
        </div>
        
        <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
          <!-- Refresh Button -->
          <button type="button" (click)="fetchOrders()" [disabled]="loading"
                  class="p-2.5 rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] shadow-2xs hover:border-[#9C4738] transition-all cursor-pointer"
                  title="Refresh Orders">
            <i class="fa-solid fa-arrows-rotate text-xs" [class.animate-spin]="loading"></i>
          </button>

          <!-- Export All / Filtered CSV -->
          <button type="button" (click)="exportOrdersCsv()" [disabled]="orders.length === 0"
                  class="px-3.5 py-2 rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#F4F1ED] text-xs font-bold shadow-2xs hover:border-[#9C4738] hover:bg-[#F3E7DC]/30 transition-all flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-download text-xs"></i>
            <span>Export CSV</span>
          </button>

          <!-- New Order Button -->
          <button type="button" (click)="openCreateModal()"
                  class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-plus text-xs"></i>
            <span>+ Record Order</span>
          </button>
        </div>
      </div>

      <!-- Actionable KPI Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        <!-- Total Orders -->
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Total Orders</p>
            <p class="text-lg font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">{{ orders.length }}</p>
          </div>
        </div>

        <!-- Attention Needed (Delayed / Unverified UPI / Pending) -->
        <button type="button" (click)="toggleNeedsAttentionFilter()"
                [class]="onlyNeedsAttention ? 'ring-2 ring-amber-500 bg-amber-50/50 dark:bg-amber-950/20' : 'bg-white dark:bg-[#251F1C]'"
                class="border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3 text-left transition-all cursor-pointer">
          <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-sm shrink-0 relative">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span *ngIf="needsAttentionCount > 0" class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Needs Action</p>
            <p class="text-lg font-serif font-bold text-amber-600 dark:text-amber-400">{{ needsAttentionCount }}</p>
          </div>
        </button>

        <!-- Confirmed / Active -->
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Confirmed</p>
            <p class="text-lg font-serif font-bold text-emerald-600 dark:text-emerald-400">{{ confirmedCount }}</p>
          </div>
        </div>

        <!-- In Fulfillment (Processing, Packed, Shipped) -->
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-truck-fast"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">In Transit</p>
            <p class="text-lg font-serif font-bold text-blue-600 dark:text-blue-400">{{ inTransitCount }}</p>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="col-span-2 sm:col-span-4 lg:col-span-1 bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Total Revenue</p>
            <p class="text-lg font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">₹{{ totalValue | number }}</p>
          </div>
        </div>
      </div>

      <!-- Bulk Actions Sticky Bar (When orders are selected) -->
      <div *ngIf="selectedOrderIds.size > 0" 
           class="p-3 bg-stone-900 text-white rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
        <div class="flex items-center gap-2.5 text-xs font-semibold">
          <span class="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-bold text-[11px]">
            {{ selectedOrderIds.size }}
          </span>
          <span>orders selected</span>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button type="button" (click)="bulkUpdateStatus('confirmed')"
                  class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer">
            <i class="fa-solid fa-check mr-1"></i> Confirm Selected
          </button>

          <button type="button" (click)="bulkUpdateStatus('accepted')"
                  class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer">
            <i class="fa-solid fa-box mr-1"></i> Start Processing
          </button>

          <button type="button" (click)="exportSelectedCsv()"
                  class="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer">
            <i class="fa-solid fa-file-csv mr-1"></i> Export Selected
          </button>

          <button type="button" (click)="clearSelection()"
                  class="px-3 py-1.5 text-stone-300 hover:text-white text-xs font-bold transition cursor-pointer">
            Cancel
          </button>
        </div>
      </div>

      <!-- Main Orders Table Card -->
      <app-card [hasFooter]="false">
        <div card-header class="w-full space-y-3">
          
          <!-- Top Row: Search + Status Tabs + Filters -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            <!-- Search Input -->
            <div class="relative w-full lg:w-72">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] dark:text-[#C5A393]"></i>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()" placeholder="Search Order #, phone, address, PIN..."
                     class="w-full bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9C4738]/20 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all">
            </div>

            <!-- Status Tabs -->
            <div class="flex items-center bg-[#FAF7F2] dark:bg-white/5 p-1 rounded-xl border border-[#EADFD2]/70 dark:border-white/10 text-xs flex-wrap gap-1">
              <button type="button" (click)="setStatusFilter('all')"
                      [class]="statusFilter === 'all' && !onlyNeedsAttention ? 'bg-white dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                All ({{ orders.length }})
              </button>
              <button type="button" (click)="setStatusFilter('pending')"
                      [class]="statusFilter === 'pending' ? 'bg-white dark:bg-[#251F1C] text-amber-600 dark:text-amber-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                New/Pending ({{ pendingCount }})
              </button>
              <button type="button" (click)="setStatusFilter('confirmed')"
                      [class]="statusFilter === 'confirmed' ? 'bg-white dark:bg-[#251F1C] text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                Confirmed ({{ confirmedCount }})
              </button>
              <button type="button" (click)="setStatusFilter('accepted')"
                      [class]="statusFilter === 'accepted' ? 'bg-white dark:bg-[#251F1C] text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                Processing ({{ acceptedCount }})
              </button>
              <button type="button" (click)="setStatusFilter('packed')"
                      [class]="statusFilter === 'packed' ? 'bg-white dark:bg-[#251F1C] text-purple-600 dark:text-purple-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                Packed ({{ packedCount }})
              </button>
              <button type="button" (click)="setStatusFilter('shipped')"
                      [class]="statusFilter === 'shipped' ? 'bg-white dark:bg-[#251F1C] text-blue-600 dark:text-blue-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                Shipped ({{ shippedCount }})
              </button>
              <button type="button" (click)="setStatusFilter('delivered')"
                      [class]="statusFilter === 'delivered' ? 'bg-white dark:bg-[#251F1C] text-teal-600 dark:text-teal-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                Delivered ({{ deliveredCount }})
              </button>
              <button type="button" (click)="setStatusFilter('cancelled')"
                      [class]="statusFilter === 'cancelled' ? 'bg-white dark:bg-[#251F1C] text-rose-600 dark:text-rose-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                Cancelled ({{ cancelledCount }})
              </button>
            </div>

          </div>

          <!-- Secondary Filter Controls (Date Range, Payment Mode, Sorter) -->
          <div class="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-[#EADFD2]/50 dark:border-white/5">
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Date Range Filter -->
              <div class="flex items-center gap-1.5 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                <span class="text-[10px] font-bold uppercase tracking-wider">Date:</span>
                <select [(ngModel)]="dateRangeFilter" (ngModelChange)="applyFilter()"
                        class="px-2.5 py-1 rounded-lg border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#251F1C] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>

              <!-- Payment Mode Filter -->
              <div class="flex items-center gap-1.5 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                <span class="text-[10px] font-bold uppercase tracking-wider">Payment:</span>
                <select [(ngModel)]="paymentFilter" (ngModelChange)="applyFilter()"
                        class="px-2.5 py-1 rounded-lg border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#251F1C] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                  <option value="all">All Modes</option>
                  <option value="cod">Cash on Delivery</option>
                  <option value="upi">Online UPI</option>
                </select>
              </div>

              <!-- Needs Attention Quick Toggle -->
              <button type="button" (click)="toggleNeedsAttentionFilter()"
                      [class]="onlyNeedsAttention ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300' : 'bg-white dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] border-[#EADFD2] dark:border-white/10'"
                      class="px-2.5 py-1 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-bell text-amber-600"></i>
                <span>Action Needed ({{ needsAttentionCount }})</span>
              </button>
            </div>

            <!-- Sort By -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Sort:</span>
              <select [(ngModel)]="sortBy" (ngModelChange)="applyFilter()"
                      class="px-2.5 py-1 rounded-lg border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#251F1C] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Amount (High to Low)</option>
                <option value="amount_low">Amount (Low to High)</option>
              </select>
            </div>
          </div>

          <!-- Active filters counter -->
          <div *ngIf="searchQuery || statusFilter !== 'all' || dateRangeFilter !== 'all' || paymentFilter !== 'all' || onlyNeedsAttention" 
               class="flex items-center justify-between text-[11px] text-[#A89F91] pt-1">
            <span>Showing {{ filteredOrders.length }} of {{ orders.length }} orders</span>
            <button type="button" (click)="resetFilters()" class="text-[#9C4738] dark:text-[#DD8776] font-bold hover:underline cursor-pointer">
              Reset Filters
            </button>
          </div>

        </div>

        <!-- High-Performance Table -->
        <app-table
          [columns]="columns"
          [loading]="loading"
          [error]="error"
          (retry)="fetchOrders()"
          [isEmpty]="filteredOrders.length === 0"
          [emptyIcon]="searchQuery || statusFilter !== 'all' ? 'search' : 'cart'"
          [emptyTitle]="searchQuery || statusFilter !== 'all' ? 'No matching orders' : 'No orders received yet'"
          [emptyDescription]="searchQuery || statusFilter !== 'all' ? 'No orders match your filter criteria. Try clearing your search.' : 'Online web orders and manual entries will appear here.'"
          [emptyActionText]="searchQuery || statusFilter !== 'all' ? 'Reset Filters' : '+ Record First Order'"
          [emptyActionIcon]="searchQuery || statusFilter !== 'all' ? 'refresh' : 'plus'"
          (emptyActionClick)="searchQuery || statusFilter !== 'all' ? resetFilters() : openCreateModal()"
        >
          <!-- Table Header Checkbox Row (Handled by user) -->
          <tr *ngFor="let order of filteredOrders" 
              class="hover:bg-[#FDFBF7] dark:hover:bg-white/5 transition-colors group">
            
            <!-- Checkbox & Order ID -->
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" [checked]="selectedOrderIds.has(order.purchase_order_id)"
                       (change)="toggleOrderSelection(order.purchase_order_id, $event)"
                       class="rounded border-[#EADFD2] text-[#9C4738] focus:ring-[#9C4738] cursor-pointer">
                <div>
                  <button type="button" (click)="viewOrder(order)" 
                          class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] group-hover:text-[#9C4738] dark:group-hover:text-[#DD8776] transition-colors text-xs sm:text-sm text-left flex items-center gap-1.5 cursor-pointer">
                    <i class="fa-solid fa-receipt text-[#A89F91] text-xs"></i>
                    <span>#{{ order.purchase_order_no || order.purchase_order_id }}</span>
                  </button>

                  <!-- Urgent Badges -->
                  <div class="flex items-center gap-1 mt-1 flex-wrap">
                    <span *ngIf="isNewOrder(order)" 
                          class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      NEW
                    </span>
                    <span *ngIf="isDelayedOrder(order)" 
                          class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      DELAYED (&gt;48h)
                    </span>
                    <span *ngIf="hasPaymentIssue(order)" 
                          class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      VERIFY UPI
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <!-- Channel / Customer -->
            <td class="px-4 py-3.5">
              <p class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] text-xs">
                {{ order.contact_no || (order.customer_id ? 'Customer #' + order.customer_id : (order.shipping_remark || 'Direct Order')) }}
              </p>
              <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-1 truncate max-w-xs">
                <i class="fa-solid fa-location-dot text-[#A89F91] text-[10px]"></i>
                <span>{{ order.shipping_address ? (order.shipping_address | slice:0:30) + '...' : 'Direct Inquiry' }}</span>
                <span *ngIf="order.shipping_pin_code" class="text-[10px] font-mono text-[#9C4738]">({{ order.shipping_pin_code }})</span>
              </p>
            </td>

            <!-- Date -->
            <td class="px-4 py-3.5 text-xs font-medium text-[#7A6C5E] dark:text-[#C5A393]">
              {{ (order.purchase_order_date || order.creation_date) | date:'mediumDate' }}
              <span class="block text-[10px] text-[#A89F91]">{{ (order.purchase_order_date || order.creation_date) | date:'shortTime' }}</span>
            </td>

            <!-- Status with Badge -->
            <td class="px-4 py-3.5">
              <span [class]="getStatusBadgeClass(order.purchase_order_status)"
                    class="px-2.5 py-1 border rounded-lg text-[10px] font-bold tracking-wide transition-all inline-flex items-center gap-1.5 shadow-2xs">
                <span class="w-1.5 h-1.5 rounded-full" [class]="getStatusDotClass(order.purchase_order_status)"></span>
                <span>{{ (order.purchase_order_status || 'CONFIRMED') | uppercase }}</span>
              </span>
            </td>

            <!-- Amount & Payment Mode -->
            <td class="px-4 py-3.5 text-right">
              <span class="font-bold font-serif text-sm sm:text-base text-[#2E2825] dark:text-[#F4F1ED] block">
                ₹{{ (order.payable_amount ?? order.total_amount ?? 0) | number }}
              </span>
              <span class="text-[10px] text-[#7A6C5E] dark:text-[#C5A393] block">
                {{ order.payment_mode ? (order.payment_mode.includes('COD') ? 'COD' : 'UPI') : 'COD' }}
              </span>
            </td>

            <!-- Actions -->
            <td class="px-4 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <!-- Fast Status Step Button (One-click progression) -->
                <button *ngIf="getNextSafeStatus(order) as nextSt" 
                        type="button" (click)="executeQuickAdvance(order, nextSt)"
                        class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#FAF7F2] dark:bg-white/10 hover:bg-[#F3E7DC] dark:hover:bg-white/20 text-[#9C4738] dark:text-[#DD8776] border border-[#EADFD2] dark:border-white/10 transition cursor-pointer"
                        [title]="'Advance to ' + nextSt">
                  <i class="fa-solid fa-arrow-right text-[10px] mr-1"></i>
                  <span>{{ nextSt | uppercase }}</span>
                </button>

                <!-- View Details -->
                <button type="button" (click)="viewOrder(order)"
                        class="p-1.5 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] dark:hover:text-[#DD8776] hover:bg-[#F3E7DC] dark:hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                        title="View Full Order Details">
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>
                
                <!-- Open WhatsApp Concierge -->
                <a [href]="getWhatsAppLink(order)" target="_blank"
                   class="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-all cursor-pointer"
                   title="Open WhatsApp chat for this order">
                  <i class="fa-brands fa-whatsapp text-xs"></i>
                </a>
              </div>
            </td>

          </tr>
        </app-table>
      </app-card>

      <!-- ORDER DETAILS SLIDE-OVER / MODAL -->
      <app-modal [isOpen]="showDetailsModal" [title]="'Purchase Order #' + (selectedOrder?.purchase_order_no || selectedOrder?.purchase_order_id || '')" size="lg" (onClose)="showDetailsModal = false">
        <div *ngIf="selectedOrder" class="space-y-4 py-2 text-xs">
          
          <!-- Summary Header -->
          <div class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-[10px] font-bold text-[#A89F91] uppercase tracking-wider block">Total Payable Amount</span>
              <p class="text-2xl font-serif font-bold text-[#9C4738] dark:text-[#DD8776]">
                ₹{{ (selectedOrder.payable_amount ?? selectedOrder.total_amount ?? 0) | number }}
              </p>
              <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5 inline-block">
                Mode: <strong>{{ selectedOrder.payment_mode || 'Cash on Delivery (COD)' }}</strong>
              </span>
            </div>

            <!-- Status Transition Buttons -->
            <div class="flex flex-col sm:items-end">
              <span class="text-[10px] font-bold text-[#A89F91] uppercase tracking-wider block mb-1">Current Fulfillment State</span>
              <div class="flex items-center gap-2 flex-wrap">
                <span [class]="getStatusBadgeClass(selectedOrder.purchase_order_status)"
                      class="px-3 py-1.5 border rounded-xl text-xs font-bold tracking-wide inline-flex items-center gap-1.5 shadow-2xs">
                  <span class="w-2 h-2 rounded-full" [class]="getStatusDotClass(selectedOrder.purchase_order_status)"></span>
                  <span>{{ (selectedOrder.purchase_order_status || 'CONFIRMED') | uppercase }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Workflow Progress Stepper -->
          <div class="p-3 bg-white dark:bg-[#1E1916] border border-[#EADFD2]/70 dark:border-white/10 rounded-xl">
            <span class="text-[10px] font-bold text-[#A89F91] block uppercase tracking-wider mb-2">Workflow Progression</span>
            <div class="flex items-center justify-between gap-1 text-[11px]">
              <div class="flex flex-col items-center flex-1" [class.font-bold]="isStepReached(selectedOrder, 'pending')">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1"
                      [ngClass]="isStepReached(selectedOrder, 'pending') ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-600'">
                  1
                </span>
                <span class="text-[10px] text-center">New Inquiry</span>
              </div>
              <div class="h-0.5 flex-1 bg-stone-200 dark:bg-stone-700"></div>

              <div class="flex flex-col items-center flex-1" [class.font-bold]="isStepReached(selectedOrder, 'confirmed')">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1"
                      [ngClass]="isStepReached(selectedOrder, 'confirmed') ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-600'">
                  2
                </span>
                <span class="text-[10px] text-center">Confirmed</span>
              </div>
              <div class="h-0.5 flex-1 bg-stone-200 dark:bg-stone-700"></div>

              <div class="flex flex-col items-center flex-1" [class.font-bold]="isStepReached(selectedOrder, 'accepted')">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1"
                      [ngClass]="isStepReached(selectedOrder, 'accepted') ? 'bg-indigo-500 text-white' : 'bg-stone-200 text-stone-600'">
                  3
                </span>
                <span class="text-[10px] text-center">In Assembly</span>
              </div>
              <div class="h-0.5 flex-1 bg-stone-200 dark:bg-stone-700"></div>

              <div class="flex flex-col items-center flex-1" [class.font-bold]="isStepReached(selectedOrder, 'shipped')">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1"
                      [ngClass]="isStepReached(selectedOrder, 'shipped') ? 'bg-blue-500 text-white' : 'bg-stone-200 text-stone-600'">
                  4
                </span>
                <span class="text-[10px] text-center">Shipped</span>
              </div>
              <div class="h-0.5 flex-1 bg-stone-200 dark:bg-stone-700"></div>

              <div class="flex flex-col items-center flex-1" [class.font-bold]="isStepReached(selectedOrder, 'delivered')">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1"
                      [ngClass]="isStepReached(selectedOrder, 'delivered') ? 'bg-teal-500 text-white' : 'bg-stone-200 text-stone-600'">
                  5
                </span>
                <span class="text-[10px] text-center">Delivered</span>
              </div>
            </div>
          </div>

          <!-- Quick State Transition Actions Bar -->
          <div class="p-3 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl flex items-center justify-between gap-2 flex-wrap">
            <span class="text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">Next Allowed Action:</span>
            <div class="flex items-center gap-2 flex-wrap">
              <button *ngIf="selectedOrder.purchase_order_status === 'pending'" type="button" 
                      (click)="confirmOrderStatus(selectedOrder, 'confirmed')"
                      class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer">
                <i class="fa-solid fa-check mr-1"></i> Confirm Order
              </button>

              <button *ngIf="selectedOrder.purchase_order_status === 'confirmed'" type="button" 
                      (click)="confirmOrderStatus(selectedOrder, 'accepted')"
                      class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer">
                <i class="fa-solid fa-box mr-1"></i> Start Assembly / Processing
              </button>

              <button *ngIf="selectedOrder.purchase_order_status === 'accepted'" type="button" 
                      (click)="confirmOrderStatus(selectedOrder, 'packed')"
                      class="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer">
                <i class="fa-solid fa-boxes-packing mr-1"></i> Mark Packed
              </button>

              <button *ngIf="selectedOrder.purchase_order_status === 'accepted' || selectedOrder.purchase_order_status === 'packed'" type="button" 
                      (click)="openShipModal(selectedOrder)"
                      class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer">
                <i class="fa-solid fa-truck mr-1"></i> Dispatch / Mark Shipped
              </button>

              <button *ngIf="selectedOrder.purchase_order_status === 'shipped'" type="button" 
                      (click)="openDeliverModal(selectedOrder)"
                      class="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer">
                <i class="fa-solid fa-house-chimney-check mr-1"></i> Mark Delivered
              </button>

              <!-- Safe Cancel Button (Requires confirmation dialog) -->
              <button *ngIf="selectedOrder.purchase_order_status !== 'cancelled' && selectedOrder.purchase_order_status !== 'delivered'" 
                      type="button" (click)="openCancelModal(selectedOrder)"
                      class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer">
                <i class="fa-solid fa-ban mr-1"></i> Cancel Order
              </button>
            </div>
          </div>

          <!-- Customer & Delivery Intelligence Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <!-- Contact & Customer -->
            <div class="p-3 bg-white dark:bg-[#1E1916] border border-[#EADFD2]/70 dark:border-white/10 rounded-xl space-y-1">
              <span class="text-[10px] font-bold text-[#A89F91] block uppercase tracking-wider">Customer &amp; Contact</span>
              <p class="font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                {{ selectedOrder.contact_no || 'Direct Web Customer' }}
              </p>
              <div class="flex items-center gap-2 pt-1">
                <a [href]="'tel:' + selectedOrder.contact_no" *ngIf="selectedOrder.contact_no"
                   class="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 text-[10px] font-bold hover:bg-stone-200">
                  <i class="fa-solid fa-phone mr-1"></i> Call
                </a>
                <a [href]="getWhatsAppLink(selectedOrder)" target="_blank"
                   class="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold hover:bg-emerald-200">
                  <i class="fa-brands fa-whatsapp mr-1"></i> WhatsApp
                </a>
              </div>
            </div>

            <!-- Date & Timeline -->
            <div class="p-3 bg-white dark:bg-[#1E1916] border border-[#EADFD2]/70 dark:border-white/10 rounded-xl">
              <span class="text-[10px] font-bold text-[#A89F91] block uppercase tracking-wider">Order Date</span>
              <p class="font-medium text-[#4A3C31] dark:text-[#F4F1ED] mt-0.5">
                {{ (selectedOrder.purchase_order_date || selectedOrder.creation_date) | date:'medium' }}
              </p>
              <p *ngIf="selectedOrder.order_shipping_date" class="text-[10px] text-blue-600 mt-1">
                Shipped: {{ selectedOrder.order_shipping_date | date:'short' }}
              </p>
              <p *ngIf="selectedOrder.order_delivery_date" class="text-[10px] text-teal-600 mt-0.5">
                Delivered: {{ selectedOrder.order_delivery_date | date:'short' }}
              </p>
            </div>

            <!-- Payment & UTR Proof -->
            <div class="p-3 bg-white dark:bg-[#1E1916] border border-[#EADFD2]/70 dark:border-white/10 rounded-xl">
              <span class="text-[10px] font-bold text-[#A89F91] block uppercase tracking-wider">Payment &amp; Proof</span>
              <p class="font-medium text-[#4A3C31] dark:text-[#F4F1ED] mt-0.5">
                {{ selectedOrder.payment_mode || 'Cash on Delivery (COD)' }}
              </p>
              <div class="mt-1">
                <span *ngIf="selectedOrder.utr_no" class="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  UTR: {{ selectedOrder.utr_no }}
                </span>
                <span *ngIf="!selectedOrder.utr_no && selectedOrder.payment_mode?.includes('UPI')" class="text-[10px] text-rose-600 font-bold">
                  ⚠️ No UTR number recorded
                </span>
              </div>
            </div>
          </div>

          <!-- Delivery Address & Live PIN-Code Serviceability Check -->
          <div class="p-3 bg-white dark:bg-[#1E1916] border border-[#EADFD2]/70 dark:border-white/10 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-[#A89F91] block uppercase tracking-wider">Delivery Address &amp; Serviceability</span>
              
              <!-- Real-time PIN Serviceability Badge -->
              <span *ngIf="pinCheckResult" 
                    [ngClass]="pinCheckResult.isServiceable ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'"
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1">
                <i [class]="pinCheckResult.isServiceable ? 'fa-solid fa-circle-check text-emerald-600' : 'fa-solid fa-triangle-exclamation text-rose-600'"></i>
                <span>{{ pinCheckResult.isServiceable ? 'Serviceable' : 'Unserviceable / Manual' }}</span>
              </span>
            </div>

            <p class="font-medium text-[#4A3C31] dark:text-[#F4F1ED]">
              {{ selectedOrder.shipping_address || 'No physical delivery address entered' }}
            </p>

            <div *ngIf="selectedOrder.shipping_pin_code" class="text-[11px] flex items-center gap-3 text-[#7A6C5E] dark:text-[#C5A393] bg-[#FAF7F2] dark:bg-white/5 p-2 rounded-lg">
              <span>PIN: <strong class="font-mono text-[#9C4738]">{{ selectedOrder.shipping_pin_code }}</strong></span>
              <span *ngIf="pinCheckResult?.courierService">Courier: <strong>{{ pinCheckResult?.courierService }}</strong></span>
              <span *ngIf="pinCheckResult">Delivery Fee: <strong>₹{{ pinCheckResult.calculatedDeliveryFee }}</strong></span>
            </div>

            <div *ngIf="selectedOrder.shipping_remark" class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
              <strong>Shipping Notes / AWB:</strong> {{ selectedOrder.shipping_remark }}
            </div>

            <div *ngIf="selectedOrder.cancellation_remark" class="p-2 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold">
              <strong>Cancellation Reason:</strong> {{ selectedOrder.cancellation_remark }}
            </div>
          </div>

          <!-- LINE ITEMS BREAKDOWN -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-[#2E2825] dark:text-[#F4F1ED] text-xs uppercase tracking-wider">
                Order Items &amp; Hampers ({{ orderDetails.length }})
              </h3>
              <span *ngIf="loadingDetails" class="text-[11px] text-[#A89F91] flex items-center gap-1">
                <i class="fa-solid fa-spinner animate-spin"></i> Loading line items...
              </span>
            </div>

            <div *ngIf="orderDetails.length > 0; else noItems" class="border border-[#EADFD2] dark:border-white/10 rounded-xl overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead class="bg-[#FAF7F2] dark:bg-white/5 border-b border-[#EADFD2] dark:border-white/10 text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393] uppercase tracking-wider">
                  <tr>
                    <th class="p-2.5">Item / Hamper</th>
                    <th class="p-2.5 text-center">Qty</th>
                    <th class="p-2.5 text-right">Price</th>
                    <th class="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#EADFD2]/60 dark:divide-white/5 bg-white dark:bg-[#1E1916]">
                  <tr *ngFor="let item of orderDetails">
                    <td class="p-2.5 font-medium text-[#4A3C31] dark:text-[#F4F1ED]">
                      {{ item.item_name || ('Product #' + (item.item_id || item.purchase_order_details_id)) }}
                    </td>
                    <td class="p-2.5 text-center text-[#7A6C5E] dark:text-[#C5A393]">
                      {{ item.item_quantity }}
                    </td>
                    <td class="p-2.5 text-right text-[#7A6C5E] dark:text-[#C5A393]">
                      ₹{{ item.item_sale_price | number }}
                    </td>
                    <td class="p-2.5 text-right font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                      ₹{{ (item.item_total || (item.item_sale_price * item.item_quantity)) | number }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ng-template #noItems>
              <div *ngIf="!loadingDetails" class="p-4 bg-[#FAF7F2] dark:bg-white/5 border border-dashed border-[#EADFD2] dark:border-white/10 rounded-xl text-center text-xs text-[#A89F91]">
                No specific line items broken down. (Manual or direct phone order)
              </div>
            </ng-template>
          </div>

          <!-- Audit Trail History -->
          <div class="p-3 bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2]/70 dark:border-white/10 rounded-xl space-y-1.5">
            <span class="text-[10px] font-bold text-[#A89F91] block uppercase tracking-wider">Processing Audit Trail</span>
            <div class="space-y-1 text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
              <div *ngFor="let log of auditLogs" class="flex items-center justify-between border-b border-stone-200/50 py-0.5">
                <span>{{ log.action }} - {{ log.details }}</span>
                <span class="text-[10px] text-[#A89F91]">{{ log.timestamp | date:'shortTime' }}</span>
              </div>
              <div *ngIf="auditLogs.length === 0" class="text-[#A89F91]">
                Order created on {{ (selectedOrder.purchase_order_date || selectedOrder.creation_date) | date:'medium' }}.
              </div>
            </div>
          </div>

        </div>

        <div modal-footer class="w-full flex justify-between items-center gap-2">
          <button *ngIf="selectedOrder" type="button" (click)="deleteOrder(selectedOrder)" 
                  class="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-trash-can"></i>
            <span>Delete Order</span>
          </button>
          
          <button type="button" (click)="showDetailsModal = false" 
                  class="px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold shadow-2xs cursor-pointer">
            Close
          </button>
        </div>
      </app-modal>

      <!-- DISPATCH / SHIP CONFIRMATION MODAL -->
      <app-modal [isOpen]="showShipModal" title="Confirm Shipment & Dispatch" size="md" (onClose)="showShipModal = false">
        <div class="space-y-3.5 py-1 text-xs">
          <p class="text-[#7A6C5E] dark:text-[#C5A393]">
            Record shipping courier and tracking number. This ensures customers receive accurate tracking details.
          </p>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Courier Partner <span class="text-rose-500">*</span></label>
            <select [(ngModel)]="shipCourier" class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs font-bold outline-none">
              <option value="Blue Dart Express">Blue Dart Express</option>
              <option value="Delhivery">Delhivery</option>
              <option value="India Post (Speed Post)">India Post (Speed Post)</option>
              <option value="DTDC Express">DTDC Express</option>
              <option value="Self Delivery / Local Concierge">Self Delivery / Local Concierge</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Tracking / AWB Number <span class="text-rose-500">*</span></label>
            <input type="text" [(ngModel)]="shipTrackingNo" placeholder="e.g. BD789456123IN"
                   class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] font-mono text-xs outline-none">
          </div>
        </div>

        <div modal-footer class="w-full flex justify-end gap-2">
          <button type="button" (click)="showShipModal = false" class="px-3 py-1.5 text-xs font-bold text-[#7A6C5E] cursor-pointer">
            Cancel
          </button>
          <button type="button" (click)="submitShipOrder()" [disabled]="!shipTrackingNo.trim()"
                  class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs disabled:opacity-50 cursor-pointer">
            Confirm &amp; Mark Shipped
          </button>
        </div>
      </app-modal>

      <!-- DELIVER CONFIRMATION MODAL -->
      <app-modal [isOpen]="showDeliverModal" title="Confirm Order Delivery" size="sm" (onClose)="showDeliverModal = false">
        <div class="space-y-3 py-1 text-xs">
          <p class="text-[#7A6C5E] dark:text-[#C5A393]">
            Are you sure you want to mark Order <strong>#{{ targetActionOrder?.purchase_order_no }}</strong> as Delivered?
          </p>
          <p class="text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
            This confirms receipt by the customer and completes fulfillment.
          </p>
        </div>

        <div modal-footer class="w-full flex justify-end gap-2">
          <button type="button" (click)="showDeliverModal = false" class="px-3 py-1.5 text-xs font-bold text-[#7A6C5E] cursor-pointer">
            Cancel
          </button>
          <button type="button" (click)="submitDeliverOrder()"
                  class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs cursor-pointer">
            Confirm Delivered
          </button>
        </div>
      </app-modal>

      <!-- CANCELLATION CONFIRMATION MODAL -->
      <app-modal [isOpen]="showCancelModal" title="Cancel Order Confirmation" size="md" (onClose)="showCancelModal = false">
        <div class="space-y-3.5 py-1 text-xs">
          <p class="text-rose-700 dark:text-rose-300 font-semibold">
            Warning: Cancelling Order #{{ targetActionOrder?.purchase_order_no }} is an irreversible administrative action.
          </p>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Cancellation Reason <span class="text-rose-500">*</span></label>
            <textarea [(ngModel)]="cancelReason" rows="3" placeholder="e.g. Customer requested cancellation, out of stock, or payment unverified..."
                      class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1C1917] text-xs outline-none"></textarea>
          </div>
        </div>

        <div modal-footer class="w-full flex justify-end gap-2">
          <button type="button" (click)="showCancelModal = false" class="px-3 py-1.5 text-xs font-bold text-[#7A6C5E] cursor-pointer">
            Keep Order
          </button>
          <button type="button" (click)="submitCancelOrder()" [disabled]="!cancelReason.trim()"
                  class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-2xs disabled:opacity-50 cursor-pointer">
            Confirm Cancellation
          </button>
        </div>
      </app-modal>

      <!-- RECORD ORDER MODAL -->
      <app-modal [isOpen]="showCreateModal" title="Record Manual Order / Inquiry" size="md" (onClose)="showCreateModal = false">
        <form (ngSubmit)="saveManualOrder()" class="space-y-3.5 py-1 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Order #</label>
              <input type="text" [(ngModel)]="newOrder.purchase_order_no" name="purchase_order_no" required
                     class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] font-mono text-xs outline-none">
            </div>

            <div>
              <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Customer Contact / Phone</label>
              <input type="text" [(ngModel)]="newOrder.contact_no" name="contact_no" placeholder="e.g. 9820012345"
                     class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] text-xs outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Order Total Amount (₹)</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-serif font-bold text-[#7A6C5E]">₹</span>
                <input type="number" [(ngModel)]="newOrder.payable_amount" name="payable_amount" required min="0" placeholder="e.g. 1499"
                       class="w-full pl-7 pr-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] font-serif font-bold text-xs outline-none">
              </div>
            </div>

            <div>
              <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Payment Mode</label>
              <select [(ngModel)]="newOrder.payment_mode" name="payment_mode"
                      class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] text-xs outline-none">
                <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                <option value="Online UPI (7350120467)">Online UPI (7350120467)</option>
                <option value="UPI / Online">UPI / Other</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Initial Status</label>
              <select [(ngModel)]="newOrder.purchase_order_status" name="purchase_order_status"
                      class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] text-xs outline-none">
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending Inquiry</option>
                <option value="accepted">Accepted / In Assembly</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Item / Hamper Notes</label>
              <input type="text" [(ngModel)]="newOrder.shipping_remark" name="shipping_remark" placeholder="e.g. Royal Dryfruit Hamper"
                     class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] text-xs outline-none">
            </div>
          </div>

          <div>
            <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Shipping Address / City</label>
            <input type="text" [(ngModel)]="newOrder.shipping_address" name="shipping_address" placeholder="e.g. 102 Crystal Apts, Mumbai"
                   class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-[#4A3C31] dark:text-[#F4F1ED] text-xs outline-none">
          </div>

          <div *ngIf="createError" class="p-2 text-rose-600 bg-rose-50 rounded-lg text-xs font-bold">
            {{ createError }}
          </div>
        </form>

        <div modal-footer class="w-full flex justify-end gap-2">
          <button type="button" (click)="showCreateModal = false" class="px-3 py-2 text-xs font-bold text-[#7A6C5E] cursor-pointer">
            Cancel
          </button>
          <button type="button" (click)="saveManualOrder()" [disabled]="savingNewOrder || !newOrder.purchase_order_no"
                  class="px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold shadow-2xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer">
            <span *ngIf="savingNewOrder" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>Record Order</span>
          </button>
        </div>
      </app-modal>

    </div>
  `
})
export class AdminOrdersPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private pinCodeService = inject(PinCodeAvailabilityService);
  private cdr = inject(ChangeDetectorRef);

  orders: PurchaseOrder[] = [];
  filteredOrders: PurchaseOrder[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  statusFilter = 'all';
  dateRangeFilter = 'all';
  paymentFilter = 'all';
  onlyNeedsAttention = false;
  sortBy = 'newest';

  // Multi-selection for bulk processing
  selectedOrderIds = new Set<number>();

  // Modal controls
  selectedOrder: PurchaseOrder | null = null;
  orderDetails: (PurchaseOrderDetail & { item_name?: string })[] = [];
  loadingDetails = false;
  showDetailsModal = false;
  showCreateModal = false;
  savingNewOrder = false;
  createError = '';

  // Confirmation modals
  showShipModal = false;
  showDeliverModal = false;
  showCancelModal = false;
  targetActionOrder: PurchaseOrder | null = null;
  shipCourier = 'Blue Dart Express';
  shipTrackingNo = '';
  cancelReason = '';

  // Real-time PIN check result for selected order
  pinCheckResult: DeliveryCheckResult | null = null;

  // Local audit trail history entries
  auditLogs: OrderAuditEntry[] = [];

  newOrder: Partial<PurchaseOrder> = {
    purchase_order_no: '',
    contact_no: '',
    payable_amount: 0,
    payment_mode: 'Cash on Delivery (COD)',
    purchase_order_status: 'confirmed',
    shipping_address: '',
    shipping_remark: '',
    is_active: true
  };

  columns: TableColumn[] = [
    { label: 'Order ID / Urgency', width: '24%' },
    { label: 'Customer / Delivery', width: '26%' },
    { label: 'Date', width: '16%' },
    { label: 'Status', width: '14%' },
    { label: 'Amount', width: '10%', align: 'right' },
    { label: 'Actions', width: '10%', align: 'right' }
  ];

  get confirmedCount(): number {
    return this.orders.filter(o => o.purchase_order_status === 'confirmed').length;
  }

  get pendingCount(): number {
    return this.orders.filter(o => o.purchase_order_status === 'pending' || (!o.is_active && !o.purchase_order_status)).length;
  }

  get acceptedCount(): number {
    return this.orders.filter(o => o.purchase_order_status === 'accepted').length;
  }

  get packedCount(): number {
    return this.orders.filter(o => o.purchase_order_status === 'packed').length;
  }

  get shippedCount(): number {
    return this.orders.filter(o => o.purchase_order_status === 'shipped').length;
  }

  get inTransitCount(): number {
    return this.orders.filter(o => ['accepted', 'packed', 'shipped'].includes(o.purchase_order_status || '')).length;
  }

  get deliveredCount(): number {
    return this.orders.filter(o => o.purchase_order_status === 'delivered').length;
  }

  get cancelledCount(): number {
    return this.orders.filter(o => o.purchase_order_status === 'cancelled').length;
  }

  get totalValue(): number {
    return this.orders.reduce((sum, o) => sum + (Number(o.payable_amount ?? o.total_amount) || 0), 0);
  }

  get needsAttentionCount(): number {
    return this.orders.filter(o => this.isOrderNeedingAttention(o)).length;
  }

  ngOnInit() {
    this.fetchOrders();
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.onlyNeedsAttention = false;
    this.applyFilter();
  }

  toggleNeedsAttentionFilter() {
    this.onlyNeedsAttention = !this.onlyNeedsAttention;
    this.applyFilter();
  }

  resetFilters() {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.dateRangeFilter = 'all';
    this.paymentFilter = 'all';
    this.onlyNeedsAttention = false;
    this.sortBy = 'newest';
    this.applyFilter();
  }

  isNewOrder(order: PurchaseOrder): boolean {
    const d = new Date(order.purchase_order_date || order.creation_date || 0).getTime();
    return (Date.now() - d) < 24 * 60 * 60 * 1000;
  }

  isDelayedOrder(order: PurchaseOrder): boolean {
    const st = (order.purchase_order_status || '').toLowerCase();
    if (['delivered', 'cancelled', 'shipped'].includes(st)) return false;
    const d = new Date(order.purchase_order_date || order.creation_date || 0).getTime();
    return (Date.now() - d) > 48 * 60 * 60 * 1000;
  }

  hasPaymentIssue(order: PurchaseOrder): boolean {
    const isUpi = (order.payment_mode || '').includes('UPI');
    if (!isUpi) return false;
    return !order.utr_no || order.transaction_status === 'FAILED' || order.transaction_status === 'PENDING';
  }

  isOrderNeedingAttention(order: PurchaseOrder): boolean {
    return (
      (order.purchase_order_status || '').toLowerCase() === 'pending' ||
      this.isDelayedOrder(order) ||
      this.hasPaymentIssue(order)
    );
  }

  isStepReached(order: PurchaseOrder, step: string): boolean {
    const current = (order.purchase_order_status || 'confirmed').toLowerCase();
    const orderRanks: Record<string, number> = {
      'pending': 1,
      'confirmed': 2,
      'accepted': 3,
      'packed': 4,
      'shipped': 5,
      'delivered': 6
    };
    return (orderRanks[current] || 2) >= (orderRanks[step] || 0);
  }

  getNextSafeStatus(order: PurchaseOrder): string | null {
    const st = (order.purchase_order_status || 'confirmed').toLowerCase();
    switch (st) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'accepted';
      case 'accepted': return 'packed';
      case 'packed': return 'shipped';
      case 'shipped': return 'delivered';
      default: return null;
    }
  }

  async executeQuickAdvance(order: PurchaseOrder, nextStatus: string) {
    if (nextStatus === 'shipped') {
      this.openShipModal(order);
      return;
    }
    if (nextStatus === 'delivered') {
      this.openDeliverModal(order);
      return;
    }
    await this.confirmOrderStatus(order, nextStatus);
  }

  getStatusBadgeClass(status?: string): string {
    const s = (status || 'confirmed').toLowerCase();
    switch (s) {
      case 'confirmed':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300';
      case 'packed':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300';
      case 'shipped':
        return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300';
      case 'delivered':
        return 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-300';
      case 'cancelled':
        return 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300';
      case 'accepted':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300';
      case 'pending':
      default:
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-300';
    }
  }

  getStatusDotClass(status?: string): string {
    const s = (status || 'confirmed').toLowerCase();
    switch (s) {
      case 'confirmed': return 'bg-emerald-500';
      case 'packed': return 'bg-purple-500';
      case 'shipped': return 'bg-blue-500';
      case 'delivered': return 'bg-teal-500';
      case 'cancelled': return 'bg-rose-500';
      case 'accepted': return 'bg-indigo-500';
      default: return 'bg-amber-500';
    }
  }

  async fetchOrders() {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    try {
      const { data, error } = await this.supabase
        .from('purchase_order')
        .select('*')
        .order('creation_date', { ascending: false });

      if (error) {
        this.error = error.message;
        this.orders = [];
      } else if (data) {
        this.orders = data as PurchaseOrder[];
        this.error = null;
      }
      this.applyFilter();
    } catch (err: any) {
      this.error = err?.message || 'Failed to connect to database.';
      this.orders = [];
      this.filteredOrders = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  applyFilter() {
    const now = Date.now();
    let result = this.orders.filter(order => {
      // 1. Text Search
      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (order.purchase_order_no && order.purchase_order_no.toLowerCase().includes(q)) ||
        (order.contact_no && order.contact_no.toLowerCase().includes(q)) ||
        (order.shipping_address && order.shipping_address.toLowerCase().includes(q)) ||
        (order.shipping_pin_code && order.shipping_pin_code.toLowerCase().includes(q)) ||
        (order.shipping_remark && order.shipping_remark.toLowerCase().includes(q));
      
      // 2. Status Filter
      const st = (order.purchase_order_status || 'confirmed').toLowerCase();
      const matchesStatus = this.statusFilter === 'all' || st === this.statusFilter;

      // 3. Needs Attention Filter
      const matchesAttention = !this.onlyNeedsAttention || this.isOrderNeedingAttention(order);

      // 4. Date Range Filter
      let matchesDate = true;
      const orderDate = new Date(order.purchase_order_date || order.creation_date || 0).getTime();
      if (this.dateRangeFilter === 'today') {
        matchesDate = (now - orderDate) < 24 * 60 * 60 * 1000;
      } else if (this.dateRangeFilter === '7days') {
        matchesDate = (now - orderDate) < 7 * 24 * 60 * 60 * 1000;
      } else if (this.dateRangeFilter === '30days') {
        matchesDate = (now - orderDate) < 30 * 24 * 60 * 60 * 1000;
      }

      // 5. Payment Mode Filter
      let matchesPayment = true;
      const pMode = (order.payment_mode || '').toLowerCase();
      if (this.paymentFilter === 'cod') {
        matchesPayment = pMode.includes('cod') || pMode.includes('cash');
      } else if (this.paymentFilter === 'upi') {
        matchesPayment = pMode.includes('upi');
      }

      return matchesSearch && matchesStatus && matchesAttention && matchesDate && matchesPayment;
    });

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.purchase_order_date || a.creation_date || 0).getTime();
      const dateB = new Date(b.purchase_order_date || b.creation_date || 0).getTime();
      if (this.sortBy === 'newest') return dateB - dateA;
      if (this.sortBy === 'oldest') return dateA - dateB;
      if (this.sortBy === 'amount_high') {
        return (Number(b.payable_amount ?? b.total_amount) || 0) - (Number(a.payable_amount ?? a.total_amount) || 0);
      }
      if (this.sortBy === 'amount_low') {
        return (Number(a.payable_amount ?? a.total_amount) || 0) - (Number(b.payable_amount ?? b.total_amount) || 0);
      }
      return 0;
    });

    this.filteredOrders = result;
  }

  // Multi-selection methods
  toggleOrderSelection(orderId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedOrderIds.add(orderId);
    } else {
      this.selectedOrderIds.delete(orderId);
    }
  }

  clearSelection() {
    this.selectedOrderIds.clear();
  }

  async bulkUpdateStatus(newStatus: string) {
    if (this.selectedOrderIds.size === 0) return;
    const ids = Array.from(this.selectedOrderIds);
    try {
      const { error } = await this.supabase
        .from('purchase_order')
        .update({
          purchase_order_status: newStatus,
          updation_date: new Date().toISOString()
        })
        .in('purchase_order_id', ids);

      if (!error) {
        this.orders.forEach(o => {
          if (this.selectedOrderIds.has(o.purchase_order_id)) {
            o.purchase_order_status = newStatus;
          }
        });
        this.logAuditAction(`Bulk Updated ${ids.length} orders to ${newStatus}`, ids[0], { count: ids.length, newStatus });
        this.clearSelection();
        this.applyFilter();
      }
    } catch (err) {
      console.error('Bulk update error:', err);
    }
  }

  exportSelectedCsv() {
    const selectedOrders = this.orders.filter(o => this.selectedOrderIds.has(o.purchase_order_id));
    this.downloadCsv(selectedOrders, `rms-orders-selected-${Date.now()}.csv`);
  }

  async viewOrder(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.orderDetails = [];
    this.auditLogs = [];
    this.pinCheckResult = null;
    this.showDetailsModal = true;
    this.loadingDetails = true;
    this.cdr.markForCheck();

    // Check PIN code serviceability immediately
    if (order.shipping_pin_code) {
      this.pinCodeService.checkDelivery(
        order.shipping_pin_code,
        Number(order.payable_amount ?? order.total_amount ?? 0)
      ).then(res => {
        this.pinCheckResult = res;
        this.cdr.markForCheck();
      });
    }

    try {
      const { data, error } = await this.supabase
        .from('purchase_order_details')
        .select('*')
        .eq('purchase_order_id', order.purchase_order_id);

      if (!error && data) {
        const items = [...data];
        const itemIds = items.map(i => i.item_id).filter(Boolean);
        if (itemIds.length > 0) {
          const { data: prods } = await this.supabase
            .from('products')
            .select('id, name')
            .in('id', itemIds);

          if (prods) {
            const map = new Map<number, string>(prods.map((p: any) => [p.id, p.name]));
            items.forEach((item: any) => {
              if (item.item_id && map.has(item.item_id)) {
                item.item_name = map.get(item.item_id);
              }
            });
          }
        }
        this.orderDetails = items;
      }
    } catch (err) {
      console.warn('Could not fetch purchase order details:', err);
    } finally {
      this.loadingDetails = false;
      this.cdr.markForCheck();
    }
  }

  async confirmOrderStatus(order: PurchaseOrder, newStatus: string) {
    const oldStatus = order.purchase_order_status;
    order.purchase_order_status = newStatus;
    order.is_active = newStatus !== 'cancelled';
    this.cdr.markForCheck();

    try {
      const payload: any = {
        purchase_order_status: newStatus,
        is_active: order.is_active,
        updation_date: new Date().toISOString()
      };
      if (newStatus === 'accepted') {
        payload.order_acceptance_date = new Date().toISOString();
      }

      const { error } = await this.supabase
        .from('purchase_order')
        .update(payload)
        .eq('purchase_order_id', order.purchase_order_id);

      if (error) {
        order.purchase_order_status = oldStatus;
        this.cdr.markForCheck();
      } else {
        this.logAuditAction(`Order Status changed from ${oldStatus} to ${newStatus}`, order.purchase_order_id, { oldStatus, newStatus });
      }
    } catch {
      order.purchase_order_status = oldStatus;
      this.cdr.markForCheck();
    }
  }

  // Ship confirmation flow
  openShipModal(order: PurchaseOrder) {
    this.targetActionOrder = order;
    this.shipCourier = 'Blue Dart Express';
    this.shipTrackingNo = order.shipping_remark || '';
    this.showShipModal = true;
  }

  async submitShipOrder() {
    if (!this.targetActionOrder || !this.shipTrackingNo.trim()) return;
    const order = this.targetActionOrder;
    const remark = `${this.shipCourier} - Tracking #${this.shipTrackingNo.trim()}`;

    try {
      const { error } = await this.supabase
        .from('purchase_order')
        .update({
          purchase_order_status: 'shipped',
          order_shipping_date: new Date().toISOString(),
          shipping_remark: remark,
          updation_date: new Date().toISOString()
        })
        .eq('purchase_order_id', order.purchase_order_id);

      if (!error) {
        order.purchase_order_status = 'shipped';
        order.order_shipping_date = new Date().toISOString();
        order.shipping_remark = remark;
        this.logAuditAction(`Order Dispatched via ${remark}`, order.purchase_order_id, { courier: this.shipCourier, tracking: this.shipTrackingNo });
        this.showShipModal = false;
        this.targetActionOrder = null;
        this.applyFilter();
        this.cdr.markForCheck();
      }
    } catch (err) {
      console.error('Ship order error:', err);
    }
  }

  // Deliver confirmation flow
  openDeliverModal(order: PurchaseOrder) {
    this.targetActionOrder = order;
    this.showDeliverModal = true;
  }

  async submitDeliverOrder() {
    if (!this.targetActionOrder) return;
    const order = this.targetActionOrder;

    try {
      const { error } = await this.supabase
        .from('purchase_order')
        .update({
          purchase_order_status: 'delivered',
          order_delivery_date: new Date().toISOString(),
          updation_date: new Date().toISOString()
        })
        .eq('purchase_order_id', order.purchase_order_id);

      if (!error) {
        order.purchase_order_status = 'delivered';
        order.order_delivery_date = new Date().toISOString();
        this.logAuditAction('Order Marked as Delivered to Customer', order.purchase_order_id, {});
        this.showDeliverModal = false;
        this.targetActionOrder = null;
        this.applyFilter();
        this.cdr.markForCheck();
      }
    } catch (err) {
      console.error('Deliver order error:', err);
    }
  }

  // Cancel order flow
  openCancelModal(order: PurchaseOrder) {
    this.targetActionOrder = order;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  async submitCancelOrder() {
    if (!this.targetActionOrder || !this.cancelReason.trim()) return;
    const order = this.targetActionOrder;

    try {
      const { error } = await this.supabase
        .from('purchase_order')
        .update({
          purchase_order_status: 'cancelled',
          is_active: false,
          cancellation_remark: this.cancelReason.trim(),
          updation_date: new Date().toISOString()
        })
        .eq('purchase_order_id', order.purchase_order_id);

      if (!error) {
        order.purchase_order_status = 'cancelled';
        order.is_active = false;
        order.cancellation_remark = this.cancelReason.trim();
        this.logAuditAction(`Order Cancelled: ${this.cancelReason.trim()}`, order.purchase_order_id, { reason: this.cancelReason });
        this.showCancelModal = false;
        this.targetActionOrder = null;
        this.applyFilter();
        this.cdr.markForCheck();
      }
    } catch (err) {
      console.error('Cancel order error:', err);
    }
  }

  private async logAuditAction(action: string, orderId: number, details: any) {
    const entry: OrderAuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details: JSON.stringify(details),
      adminName: 'Admin'
    };
    this.auditLogs.unshift(entry);

    try {
      await this.supabase.from('user_activity_log').insert([{
        action,
        entity: 'purchase_order',
        entity_id: orderId,
        timestamp: new Date().toISOString()
      }]);
    } catch {
      // Graceful fallback if table is offline
    }
  }

  getWhatsAppLink(order: PurchaseOrder): string {
    const phone = order?.contact_no?.replace(/\D/g, '') || '919284905118';
    const text = encodeURIComponent(
      `Hello! Regarding RMS Creations Order #${order.purchase_order_no || order.purchase_order_id} (Total: ₹${order.payable_amount ?? order.total_amount ?? 0}). Status: ${order.purchase_order_status || 'Confirmed'}. Let us know if you have any questions or customization requests!`
    );
    return `https://wa.me/${phone}?text=${text}`;
  }

  openCreateModal() {
    this.newOrder = {
      purchase_order_no: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      contact_no: '',
      payable_amount: 0,
      payment_mode: 'Cash on Delivery (COD)',
      purchase_order_status: 'confirmed',
      shipping_address: '',
      shipping_remark: '',
      is_active: true
    };
    this.createError = '';
    this.showCreateModal = true;
  }

  async saveManualOrder() {
    if (!this.newOrder.purchase_order_no?.trim()) return;
    this.savingNewOrder = true;
    this.createError = '';
    this.cdr.markForCheck();

    try {
      const payload: Partial<PurchaseOrder> = {
        purchase_order_no: this.newOrder.purchase_order_no.trim(),
        purchase_order_date: new Date().toISOString(),
        purchase_order_status: this.newOrder.purchase_order_status || 'confirmed',
        payable_amount: Number(this.newOrder.payable_amount) || 0,
        total_amount: Number(this.newOrder.payable_amount) || 0,
        contact_no: this.newOrder.contact_no?.trim() || null,
        payment_mode: this.newOrder.payment_mode || 'Cash on Delivery (COD)',
        shipping_address: this.newOrder.shipping_address?.trim() || null,
        shipping_remark: this.newOrder.shipping_remark?.trim() || null,
        is_active: this.newOrder.purchase_order_status !== 'cancelled',
        creation_date: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('purchase_order')
        .insert([payload])
        .select()
        .single();

      if (error) {
        this.createError = error.message;
      } else {
        if (data) {
          this.orders.unshift(data as PurchaseOrder);
          this.logAuditAction('Manual Order Created', (data as any).purchase_order_id, { no: payload.purchase_order_no });
          this.applyFilter();
        } else {
          await this.fetchOrders();
        }
        this.showCreateModal = false;
      }
    } catch (err: any) {
      this.createError = err?.message || 'Failed to record order.';
    } finally {
      this.savingNewOrder = false;
      this.cdr.markForCheck();
    }
  }

  async deleteOrder(order: PurchaseOrder | null) {
    if (!order) return;
    if (!confirm(`Are you sure you want to delete order #${order.purchase_order_no}? This cannot be undone.`)) return;
    try {
      const { error } = await this.supabase
        .from('purchase_order')
        .delete()
        .eq('purchase_order_id', order.purchase_order_id);

      if (!error) {
        this.orders = this.orders.filter(o => o.purchase_order_id !== order.purchase_order_id);
        this.selectedOrderIds.delete(order.purchase_order_id);
        this.applyFilter();
        this.showDetailsModal = false;
      }
    } catch (err) {
      console.error('Delete order failed:', err);
    }
  }

  exportOrdersCsv() {
    this.downloadCsv(this.filteredOrders, `rms-orders-${new Date().toISOString().split('T')[0]}.csv`);
  }

  private downloadCsv(orders: PurchaseOrder[], filename: string) {
    if (typeof window === 'undefined') return;
    const rows = [
      ['Order ID', 'Contact', 'Date', 'Status', 'Payment Mode', 'Address', 'PIN', 'Amount', 'Tracking'],
      ...orders.map(o => [
        o.purchase_order_no || String(o.purchase_order_id),
        o.contact_no || '',
        o.purchase_order_date || o.creation_date || '',
        o.purchase_order_status || 'confirmed',
        o.payment_mode || '',
        o.shipping_address || '',
        o.shipping_pin_code || '',
        String(o.payable_amount ?? o.total_amount ?? 0),
        o.shipping_remark || ''
      ])
    ];

    const csvContent = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
