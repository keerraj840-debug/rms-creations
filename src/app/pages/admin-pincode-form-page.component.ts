import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PinCodeAvailabilityService, PinCodeAvailability } from '../services/pin-code-availability.service';

@Component({
  selector: 'app-admin-pincode-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto pb-16 space-y-6 transition-colors duration-300">

      <!-- Top Sticky Action Bar -->
      <div class="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#FAF7F2]/95 dark:bg-[#1E1916]/95 backdrop-blur-md border-b border-[#EADFD2]/80 dark:border-white/10 flex items-center justify-between gap-4">
        
        <!-- Left: Back Button & Title -->
        <div class="flex items-center gap-3 min-w-0">
          <a 
            routerLink="/admin/pincodes" 
            class="p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] bg-white dark:bg-[#251F1C] rounded-xl border border-[#EADFD2] dark:border-white/10 transition-colors shadow-2xs shrink-0 cursor-pointer"
            title="Back to PIN Codes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </a>

          <div class="min-w-0">
            <div class="flex items-center gap-2.5">
              <h1 class="text-lg sm:text-xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">
                {{ isEdit ? ('Edit PIN: ' + item.pca_pin_code) : 'Add Serviceable PIN Code' }}
              </h1>

              <!-- Availability Status Pill -->
              <button 
                type="button" 
                (click)="item.pca_is_available = !item.pca_is_available"
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                [ngClass]="item.pca_is_available ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40'"
              >
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="item.pca_is_available ? 'bg-emerald-500' : 'bg-rose-500'"></span>
                <span>{{ item.pca_is_available ? 'Delivery Available' : 'Service Disabled' }}</span>
              </button>
            </div>
            
            <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] truncate">
              {{ isEdit ? 'Update delivery charges, courier partner, and serviceability rules' : 'Configure delivery coverage, shipping fee, and weight-based pricing' }}
            </p>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2.5 shrink-0">
          <a 
            routerLink="/admin/pincodes" 
            class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#4A3C31] dark:hover:text-[#F4F1ED] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </a>

          <button 
            type="button" 
            (click)="save()" 
            [disabled]="saving || !isValid"
            class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Save PIN Code') }}</span>
          </button>
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

      <!-- Main Form Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Form Controls (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
          <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-3">
              <h2 class="text-xs font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-2">
                <i class="fa-solid fa-location-dot text-[#9C4738] dark:text-[#EB9D8E]"></i>
                <span>Postal & Delivery Details</span>
              </h2>
            </div>

            <!-- PIN Code -->
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                PIN Code (6 digits) <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                maxlength="6"
                [(ngModel)]="item.pca_pin_code" 
                (ngModelChange)="onPinChange($event)"
                placeholder="e.g. 411038" 
                class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-3 text-base font-mono font-bold tracking-widest text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none transition"
              />
              <p *ngIf="item.pca_pin_code && !isPinValid" class="text-[11px] text-rose-500 mt-1 font-medium">
                Must be exactly 6 numeric digits (Indian Postal Code).
              </p>
            </div>

            <!-- State and District Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  State <span class="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  [(ngModel)]="item.pca_state" 
                  placeholder="e.g. Maharashtra" 
                  class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  District / City
                </label>
                <input 
                  type="text" 
                  [(ngModel)]="item.pca_district" 
                  placeholder="e.g. Pune" 
                  class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none transition"
                />
              </div>
            </div>

            <!-- Delivery Charges (Base & >1kg) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  Base Delivery Charge (₹) <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#A89F91]">₹</span>
                  <input 
                    type="number" 
                    min="0"
                    step="5"
                    [(ngModel)]="item.pca_delivery_charges" 
                    placeholder="50" 
                    class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-xs sm:text-sm font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none transition"
                  />
                </div>
                <p class="text-[10px] text-[#A89F91] mt-1">
                  Applicable up to 1 kg total hamper weight.
                </p>
              </div>

              <div>
                <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                  Extra Per Kg Above 1 kg (₹)
                </label>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#A89F91]">₹</span>
                  <input 
                    type="number" 
                    min="0"
                    step="5"
                    [(ngModel)]="item.pca_delivery_charges_above_1kg" 
                    placeholder="40" 
                    class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-xs sm:text-sm font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none transition"
                  />
                </div>
                <p class="text-[10px] text-[#A89F91] mt-1">
                  Charged per additional kg over the first kg.
                </p>
              </div>
            </div>

            <!-- Courier Service Partner -->
            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1.5">
                Courier Service Partner
              </label>
              <input 
                type="text" 
                [(ngModel)]="item.courier_service" 
                placeholder="e.g. DTDC Express, Delhivery, Speed Post" 
                class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none transition"
              />

              <!-- Courier quick chips -->
              <div class="mt-2 flex flex-wrap items-center gap-1.5">
                <span class="text-[10px] font-semibold text-[#7A6C5E] dark:text-[#C5A393]">Quick Select:</span>
                <button 
                  type="button" 
                  *ngFor="let c of ['DTDC', 'Delhivery', 'India Post', 'BlueDart', 'Professional Couriers']"
                  (click)="item.courier_service = c"
                  class="text-[11px] px-2 py-0.5 rounded-lg bg-[#FAF7F2] dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] border border-[#EADFD2] dark:border-white/10 transition cursor-pointer"
                >
                  {{ c }}
                </button>
              </div>
            </div>

            <!-- Availability Toggle -->
            <div class="pt-4 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-between">
              <div>
                <label for="pcaIsAvail" class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] cursor-pointer block">
                  Enable Delivery For This PIN Code
                </label>
                <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">
                  When disabled, customers entering this PIN will see a delivery unserviceable notice and checkout will be blocked.
                </p>
              </div>
              <input 
                type="checkbox" 
                id="pcaIsAvail" 
                [(ngModel)]="item.pca_is_available" 
                class="h-5 w-5 rounded border-[#EADFD2] text-[#9C4738] focus:ring-[#9C4738] cursor-pointer"
              />
            </div>

          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex items-center justify-between pt-2">
            <a 
              routerLink="/admin/pincodes" 
              class="px-5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs font-semibold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-white dark:hover:bg-white/5 transition cursor-pointer"
            >
              Back to PIN Codes List
            </a>

            <button 
              type="button" 
              (click)="save()" 
              [disabled]="saving || !isValid"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Save PIN Code') }}</span>
            </button>
          </div>

        </div>

        <!-- Right Summary / Guidance (5 cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
            
            <div class="border-b border-[#EADFD2]/60 dark:border-white/10 pb-3 flex items-center justify-between">
              <h2 class="text-xs font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393] flex items-center gap-2">
                <i class="fa-solid fa-truck-ramp-box text-[#9C4738] dark:text-[#EB9D8E]"></i>
                <span>Summary Card</span>
              </h2>
              <span 
                class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                [ngClass]="item.pca_is_available ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'"
              >
                {{ item.pca_is_available ? 'Active' : 'Disabled' }}
              </span>
            </div>

            <!-- Card simulation -->
            <div class="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#1C1917] border border-[#EADFD2]/70 dark:border-white/10 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">Target Postal Code</span>
                <span class="font-mono text-base font-bold text-[#9C4738] dark:text-[#EB9D8E]">
                  {{ item.pca_pin_code || '------' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Region</span>
                <span class="font-semibold text-[#2E2825] dark:text-[#F4F1ED]">
                  {{ item.pca_district ? item.pca_district + ', ' : '' }}{{ item.pca_state || 'Not specified' }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Standard Shipping</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{{ item.pca_delivery_charges }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Surcharge / kg (> 1 kg)</span>
                <span class="font-semibold text-[#4A3C31] dark:text-[#F4F1ED]">
                  ₹{{ item.pca_delivery_charges_above_1kg }}
                </span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Courier Partner</span>
                <span class="font-semibold text-[#4A3C31] dark:text-[#F4F1ED]">
                  {{ item.courier_service || 'Not specified' }}
                </span>
              </div>
            </div>

            <!-- Business Rule Explainer -->
            <div class="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 text-xs text-amber-900 dark:text-amber-200/90 space-y-2">
              <p class="font-bold flex items-center gap-1.5">
                <i class="fa-solid fa-circle-info text-amber-600"></i>
                <span>Store Delivery Rules</span>
              </p>
              <ul class="text-[11px] leading-relaxed list-disc list-inside space-y-1">
                <li>Free shipping is automatically applied if cart subtotal reaches ₹499.</li>
                <li>Weight above 1 kg is calculated in 1 kg increments with extra charge.</li>
                <li>Checkout blocks any unlisted or disabled PIN code with a helpful notice.</li>
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>
  `
})
export class AdminPincodeFormPageComponent implements OnInit {
  private readonly pinService = inject(PinCodeAvailabilityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isEdit = false;
  pincodeId: number | null = null;
  saving = false;
  successMessage = '';
  errorMessage = '';

  item: PinCodeAvailability = {
    pca_pin_code: '',
    pca_is_available: true,
    pca_state: 'Maharashtra',
    pca_district: '',
    pca_delivery_charges: 50,
    pca_delivery_charges_above_1kg: 40,
    courier_service: 'DTDC'
  };

  get isPinValid(): boolean {
    return /^[1-9][0-9]{5}$/.test(this.item.pca_pin_code?.trim() || '');
  }

  get isValid(): boolean {
    return this.isPinValid && (this.item.pca_state?.trim().length > 0) && (this.item.pca_delivery_charges >= 0);
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.pincodeId = Number(idParam);
      this.fetchPincode(this.pincodeId);
    }
  }

  onPinChange(val: string) {
    if (val) {
      this.item.pca_pin_code = val.replace(/\D/g, '').slice(0, 6);
      if (!this.isEdit && this.pinService.isRatnagiriTaluka(this.item.pca_pin_code)) {
        this.item.pca_delivery_charges = 30;
        this.item.pca_delivery_charges_above_1kg = 20;
        this.item.pca_district = 'Ratnagiri (Taluka)';
        this.item.pca_state = 'Maharashtra';
        this.item.courier_service = 'Local Express Delivery';
      }
    }
  }

  async fetchPincode(id: number) {
    try {
      const data = await this.pinService.getById(id);
      if (data) {
        this.item = { ...data };
      }
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to load PIN code details.';
    } finally {
      this.cdr.markForCheck();
    }
  }

  async save() {
    if (!this.isValid) {
      this.errorMessage = 'Please provide a valid 6-digit PIN code and required fields.';
      return;
    }

    try {
      this.saving = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.isEdit && this.pincodeId) {
        await this.pinService.update(this.pincodeId, {
          pca_pin_code: this.item.pca_pin_code.trim(),
          pca_is_available: this.item.pca_is_available,
          pca_state: this.item.pca_state.trim(),
          pca_district: (this.item.pca_district || '').trim(),
          pca_delivery_charges: Number(this.item.pca_delivery_charges) || 0,
          pca_delivery_charges_above_1kg: Number(this.item.pca_delivery_charges_above_1kg) || 0,
          courier_service: (this.item.courier_service || '').trim()
        });
        this.successMessage = `PIN code ${this.item.pca_pin_code} updated successfully!`;
      } else {
        await this.pinService.create({
          pca_pin_code: this.item.pca_pin_code.trim(),
          pca_is_available: this.item.pca_is_available,
          pca_state: this.item.pca_state.trim(),
          pca_district: (this.item.pca_district || '').trim(),
          pca_delivery_charges: Number(this.item.pca_delivery_charges) || 0,
          pca_delivery_charges_above_1kg: Number(this.item.pca_delivery_charges_above_1kg) || 0,
          courier_service: (this.item.courier_service || '').trim()
        });
        this.successMessage = `PIN code ${this.item.pca_pin_code} created successfully!`;
      }

      setTimeout(() => {
        this.router.navigate(['/admin/pincodes']);
      }, 700);
    } catch (err: any) {
      this.errorMessage = err?.message || 'Error saving PIN code configuration.';
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }
}
