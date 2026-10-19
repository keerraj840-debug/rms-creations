import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PinCodeAvailabilityService, PinCodeAvailability } from '../services/pin-code-availability.service';

@Component({
  selector: 'app-admin-pincodes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6  mx-auto pb-16 transition-colors duration-300">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Logistics Master
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] tracking-tight mt-1">
            PIN-Code Delivery Management
          </h1>
          <p class="text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
            Configure serviceable delivery areas, base shipping rates, 1kg+ weight surcharges, and courier partners.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button 
            type="button"
            (click)="setupRatnagiriPinCodes()"
            [disabled]="loading"
            class="px-3.5 py-2.5 rounded-xl border border-amber-600/40 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 shadow-2xs"
            title="Quickly configure all Ratnagiri Taluka postal PIN codes at ₹30 delivery charge"
          >
            <i class="fa-solid fa-bolt text-amber-600 dark:text-amber-400"></i>
            <span>Set Ratnagiri Taluka PINs (₹30)</span>
          </button>

          <a 
            routerLink="/admin/pincodes/new"
            class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#DD8776] hover:from-[#883B2D] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <i class="fa-solid fa-plus text-xs"></i>
            <span>Add Serviceable PIN</span>
          </a>
        </div>
      </div>

      <!-- Quick KPI Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Configured PINs</p>
            <p class="text-xl font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">{{ pinCodes.length }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-truck-fast"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Active Delivery</p>
            <p class="text-xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{{ activeCount }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-ban"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Disabled PINs</p>
            <p class="text-xl font-serif font-bold text-rose-600 dark:text-rose-400">{{ pinCodes.length - activeCount }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-indian-rupee-sign"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Avg Base Fee</p>
            <p class="text-xl font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">₹49</p>
          </div>
        </div>
      </div>

      <!-- Feedback Alerts -->
      <div *ngIf="successMessage" class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-circle-check"></i>
          <span>{{ successMessage }}</span>
        </div>
        <button (click)="successMessage = ''" class="text-emerald-500 hover:text-emerald-700 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div *ngIf="errorMessage" class="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-800/40 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>
        <button (click)="errorMessage = ''" class="text-rose-400 hover:text-rose-600 cursor-pointer"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="relative w-full sm:w-80">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] dark:text-[#C5A393]"></i>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="onFilterChange()"
              placeholder="Search PIN, District, State..." 
              class="w-full bg-[#FAF7F2] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]"
            />
          </div>

          <!-- Availability Filter Chips -->
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button 
              type="button" 
              (click)="setFilter('all')"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer"
              [ngClass]="activeFilter === 'all' ? 'bg-[#9C4738] text-white border-[#9C4738]' : 'bg-[#FAF7F2] dark:bg-white/5 text-[#7A6C5E] dark:text-[#C5A393] border-[#EADFD2] dark:border-white/10'"
            >
              All ({{ pinCodes.length }})
            </button>
            <button 
              type="button" 
              (click)="setFilter('available')"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer"
              [ngClass]="activeFilter === 'available' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-[#FAF7F2] dark:bg-white/5 text-[#7A6C5E] dark:text-[#C5A393] border-[#EADFD2] dark:border-white/10'"
            >
              Available ({{ activeCount }})
            </button>
            <button 
              type="button" 
              (click)="setFilter('unavailable')"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer"
              [ngClass]="activeFilter === 'unavailable' ? 'bg-rose-600 text-white border-rose-600' : 'bg-[#FAF7F2] dark:bg-white/5 text-[#7A6C5E] dark:text-[#C5A393] border-[#EADFD2] dark:border-white/10'"
            >
              Disabled ({{ pinCodes.length - activeCount }})
            </button>
          </div>
        </div>

        <!-- Table Listing -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-[#EADFD2]/80 dark:border-white/10 text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                <th class="py-3 px-3">PIN Code</th>
                <th class="py-3 px-3">Location (District / State)</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3">Base Charge</th>
                <th class="py-3 px-3">Above 1kg Charge</th>
                <th class="py-3 px-3">Courier Partner</th>
                <th class="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EADFD2]/40 dark:divide-white/5 text-xs">
              <tr *ngIf="loading">
                <td colspan="7" class="py-8 text-center text-[#7A6C5E] dark:text-[#C5A393]">
                  <div class="h-6 w-6 animate-spin rounded-full border-2 border-[#9C4738] border-t-transparent mx-auto mb-2"></div>
                  Loading PIN code configurations...
                </td>
              </tr>

              <tr *ngIf="!loading && filteredPinCodes.length === 0">
                <td colspan="7" class="py-8 text-center text-[#7A6C5E] dark:text-[#C5A393]">
                  No PIN codes match the filter criteria.
                </td>
              </tr>

              <tr *ngFor="let pca of filteredPinCodes" class="hover:bg-[#FAF7F2]/50 dark:hover:bg-white/5 transition">
                <td class="py-3 px-3 font-mono font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">
                  {{ pca.pca_pin_code }}
                </td>
                <td class="py-3 px-3 text-[#4A3C31] dark:text-[#D9C3B9]">
                  <span class="font-bold">{{ pca.pca_district }}</span>, {{ pca.pca_state }}
                </td>
                <td class="py-3 px-3">
                  <span 
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                    [ngClass]="pca.pca_is_available ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="pca.pca_is_available ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                    <span>{{ pca.pca_is_available ? 'Serviceable' : 'Disabled' }}</span>
                  </span>
                </td>
                <td class="py-3 px-3 font-semibold text-[#2E2825] dark:text-[#F4F1ED]">
                  ₹{{ pca.pca_delivery_charges }}
                </td>
                <td class="py-3 px-3 font-semibold text-[#7A6C5E] dark:text-[#C5A393]">
                  +₹{{ pca.pca_delivery_charges_above_1kg }}/kg
                </td>
                <td class="py-3 px-3 text-[#4A3C31] dark:text-[#D9C3B9]">
                  {{ pca.courier_service || 'Standard Express' }}
                </td>
                <td class="py-3 px-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    
                    <!-- Toggle Availability Button -->
                    <button 
                      type="button" 
                      (click)="toggleStatus(pca)"
                      class="px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition cursor-pointer"
                      [ngClass]="pca.pca_is_available ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'"
                      [title]="pca.pca_is_available ? 'Disable this PIN code' : 'Enable this PIN code'"
                    >
                      {{ pca.pca_is_available ? 'Disable' : 'Enable' }}
                    </button>

                    <!-- Edit Button -->
                    <a 
                      [routerLink]="['/admin/pincodes/edit', pca.pca_id]"
                      class="p-1.5 rounded-lg border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-[#4A3C31] dark:text-[#F4F1ED] transition cursor-pointer"
                      title="Edit PIN Code Settings"
                    >
                      <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </a>

                    <!-- Delete Button -->
                    <button 
                      type="button" 
                      (click)="deletePca(pca)"
                      class="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="Delete PIN Code"
                    >
                      <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `
})
export class AdminPincodesPageComponent implements OnInit {
  private readonly pcaService = inject(PinCodeAvailabilityService);
  private readonly cdr = inject(ChangeDetectorRef);

  pinCodes: PinCodeAvailability[] = [];
  filteredPinCodes: PinCodeAvailability[] = [];
  loading = false;
  searchQuery = '';
  activeFilter: 'all' | 'available' | 'unavailable' = 'all';

  successMessage = '';
  errorMessage = '';

  ngOnInit() {
    this.loadPinCodes();
  }

  get activeCount(): number {
    return this.pinCodes.filter(p => p.pca_is_available).length;
  }

  async loadPinCodes() {
    try {
      this.loading = true;
      this.errorMessage = '';
      this.pinCodes = await this.pcaService.getAllPinCodes('', 'all');
      this.applyFilter();
    } catch (err: any) {
      this.errorMessage = err?.message || 'Error loading PIN codes.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async setupRatnagiriPinCodes() {
    try {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      const res = await this.pcaService.setupRatnagiriTalukaPinCodes();
      if (res.error) {
        this.errorMessage = res.error;
      } else {
        this.successMessage = `Successfully configured ${res.count} Ratnagiri Taluka PIN codes at ₹30 delivery charge!`;
        await this.loadPinCodes();
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Error configuring Ratnagiri PIN codes.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  setFilter(filter: 'all' | 'available' | 'unavailable') {
    this.activeFilter = filter;
    this.applyFilter();
  }

  onFilterChange() {
    this.applyFilter();
  }

  applyFilter() {
    let list = [...this.pinCodes];
    if (this.activeFilter === 'available') {
      list = list.filter(p => p.pca_is_available);
    } else if (this.activeFilter === 'unavailable') {
      list = list.filter(p => !p.pca_is_available);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter(p =>
        p.pca_pin_code.includes(q) ||
        p.pca_state?.toLowerCase().includes(q) ||
        p.pca_district?.toLowerCase().includes(q) ||
        p.courier_service?.toLowerCase().includes(q)
      );
    }

    this.filteredPinCodes = list;
    this.cdr.markForCheck();
  }

  async toggleStatus(pca: PinCodeAvailability) {
    if (!pca.pca_id) return;
    const ok = await this.pcaService.toggleAvailability(pca.pca_id, pca.pca_is_available);
    if (ok) {
      pca.pca_is_available = !pca.pca_is_available;
      this.successMessage = `PIN code ${pca.pca_pin_code} status updated to ${pca.pca_is_available ? 'Available' : 'Disabled'}.`;
      this.applyFilter();
    } else {
      this.errorMessage = 'Failed to update PIN code status.';
    }
    this.cdr.markForCheck();
  }

  async deletePca(pca: PinCodeAvailability) {
    if (!pca.pca_id) return;
    if (!confirm(`Are you sure you want to delete PIN code ${pca.pca_pin_code}?`)) return;

    const ok = await this.pcaService.deletePinCode(pca.pca_id);
    if (ok) {
      this.successMessage = `PIN code ${pca.pca_pin_code} removed.`;
      this.pinCodes = this.pinCodes.filter(p => p.pca_id !== pca.pca_id);
      this.applyFilter();
    } else {
      this.errorMessage = 'Failed to delete PIN code.';
    }
    this.cdr.markForCheck();
  }
}
