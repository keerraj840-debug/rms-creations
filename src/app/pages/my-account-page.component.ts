import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { LocalStorageService } from '../services/local-storage.service';
import { CartService } from '../services/cart.service';
import { AuthService, UserProfile } from '../services/auth.service';
import { CustomerAddressService, CustomerAddress } from '../services/customer-address.service';

@Component({
  selector: 'app-my-account-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-24">
        
        <!-- Header -->
        <div class="bg-gradient-to-b from-[#F3E7DC]/60 to-transparent dark:from-white/5 py-8 md:py-12 border-b border-[#EADFD2]/60 dark:border-white/10">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
              My Account &amp; Profile
            </h1>
            <p class="mt-2 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393]">
              Manage your personal information, saved delivery addresses, and order history.
            </p>
          </div>
        </div>

        <main class="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-4xl space-y-6">
          
          <!-- QUICK STATS TILES -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a routerLink="/my-orders" class="p-5 bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 shadow-xs hover:border-[#9C4738] transition flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-white/5 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl shrink-0">
                <i class="fa-solid fa-box-archive"></i>
              </div>
              <div>
                <span class="text-xs text-[#7A6C5E] dark:text-[#C5A393] block">Order History</span>
                <span class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED]">{{ orderCount }} Orders</span>
              </div>
            </a>

            <a routerLink="/my-custom-hampers" class="p-5 bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 shadow-xs hover:border-purple-500 transition flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-white/5 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xl shrink-0">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <span class="text-xs text-[#7A6C5E] dark:text-[#C5A393] block">Custom Hampers</span>
                <span class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED]">Consultations</span>
              </div>
            </a>

            <a routerLink="/cart" class="p-5 bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 shadow-xs hover:border-[#9C4738] transition flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-rose-50 dark:bg-white/5 text-rose-700 dark:text-rose-300 flex items-center justify-center text-xl shrink-0">
                <i class="fa-solid fa-bag-shopping"></i>
              </div>
              <div>
                <span class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">Active Cart</span>
                <span class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED]">{{ cartService.totalItemsCount }} Items</span>
              </div>
            </a>

            <a href="https://wa.me/919284905118" target="_blank" rel="noopener noreferrer" class="p-5 bg-white dark:bg-[#1E1916] rounded-2xl border border-[#EADFD2] dark:border-white/10 shadow-xs hover:border-emerald-500 transition flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-white/5 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                <i class="fa-brands fa-whatsapp"></i>
              </div>
              <div>
                <span class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">RMS Support</span>
                <span class="font-serif font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">+91 92849 05118</span>
              </div>
            </a>
          </div>

          <!-- UN-AUTHENTICATED NOTICE -->
          <div *ngIf="!currentUser" class="p-6 bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 text-center space-y-4">
            <i class="fa-solid fa-user-lock text-3xl text-[#9C4738]"></i>
            <h2 class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED]">Log In to Manage Your Account</h2>
            <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] max-w-md mx-auto">
              Please sign in to access your personal profile, update contact details, and view your saved delivery address book.
            </p>
            <div class="flex justify-center gap-3">
              <a routerLink="/login" class="px-6 py-2.5 rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition shadow-xs">
                Log In
              </a>
              <a routerLink="/register" class="px-6 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-stone-50 dark:hover:bg-white/5 transition">
                Create Account
              </a>
            </div>
          </div>

          <!-- SECTION 1: CUSTOMER PROFILE (NAME, GENDER, DOB, PHONE) -->
          <div *ngIf="currentUser" class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
              <div>
                <h2 class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED]">Customer Profile</h2>
                <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">Keep your identity and contact information up-to-date.</p>
              </div>
              <span *ngIf="profileSuccess" class="text-xs font-bold text-emerald-600 animate-fade-in flex items-center gap-1">
                <i class="fa-solid fa-check"></i> Profile saved
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Full Name *</label>
                <input type="text" [(ngModel)]="profileName" placeholder="Radhika Sharma" class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs outline-none" />
              </div>

              <div>
                <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Email Address (Account ID)</label>
                <input type="email" [value]="currentUser.email" disabled class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-stone-100 dark:bg-stone-900 text-stone-500 text-xs outline-none cursor-not-allowed" />
              </div>

              <div>
                <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Mobile Number</label>
                <input type="tel" maxlength="10" inputmode="numeric" autocomplete="tel" [(ngModel)]="profilePhone" placeholder="10-digit mobile number" class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs font-mono outline-none" />
              </div>

              <div>
                <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Gender *</label>
                <select [(ngModel)]="profileGender" class="w-full px-3.5 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs outline-none">
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Date of Birth *</label>
                <input type="date" [(ngModel)]="profileDob" class="w-full px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs outline-none" />
              </div>
            </div>

            <div class="pt-2 flex justify-end">
              <button type="button" (click)="saveProfile()" [disabled]="savingProfile || !profileName.trim()" class="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer">
                {{ savingProfile ? 'Saving...' : 'Update Profile' }}
              </button>
            </div>
          </div>

          <!-- SECTION 2: SAVED ADDRESS BOOK (CRUD) -->
          <div *ngIf="currentUser" class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-5">
            <div class="flex items-center justify-between pb-3 border-b border-[#EADFD2]/60 dark:border-white/10">
              <div>
                <h2 class="font-serif font-bold text-lg text-[#2E2825] dark:text-[#F4F1ED]">Saved Address Book</h2>
                <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">Save frequent delivery destinations for seamless checkout.</p>
              </div>
              <button *ngIf="!showAddressModal" type="button" (click)="openAddAddress()" class="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition shadow-2xs flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-plus text-[10px]"></i>
                <span>Add Address</span>
              </button>
            </div>

            <!-- Address Cards Grid -->
            <div *ngIf="addresses.length > 0 && !showAddressModal" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div *ngFor="let addr of addresses" class="p-4 rounded-2xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" [ngClass]="addr.address_type === 'Home' ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-800'">
                      {{ addr.address_type }}
                    </span>
                    <span *ngIf="addr.is_default" class="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <i class="fa-solid fa-check"></i> Default
                    </span>
                  </div>

                  <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] mt-2 line-clamp-2">
                    {{ addr.address }}
                  </p>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                    {{ addr.city }}, {{ addr.state }} - <strong class="font-mono text-[#2E2825] dark:text-[#F4F1ED]">{{ addr.pin_code }}</strong>
                  </p>
                </div>

                <div class="pt-2 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-between text-xs">
                  <button type="button" (click)="editAddress(addr)" class="font-bold text-[#9C4738] dark:text-[#EB9D8E] hover:underline cursor-pointer py-1">
                    Edit
                  </button>
                  <button type="button" (click)="deleteAddress(addr)" class="font-bold text-rose-600 hover:text-rose-700 cursor-pointer py-1">
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="addresses.length === 0 && !showAddressModal" class="py-8 text-center text-xs text-[#7A6C5E] dark:text-[#C5A393] space-y-2">
              <i class="fa-solid fa-map-location-dot text-2xl text-stone-400"></i>
              <p>You haven't saved any delivery addresses yet.</p>
              <button type="button" (click)="openAddAddress()" class="min-h-[40px] px-4 py-2 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] text-xs font-bold text-[#9C4738] cursor-pointer">
                + Add Your First Address
              </button>
            </div>

            <!-- Inline Address Form (Add / Edit) -->
            <div *ngIf="showAddressModal" class="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 space-y-4">
              <div class="flex items-center justify-between pb-2 border-b border-[#EADFD2]/60 dark:border-white/10">
                <h3 class="text-xs font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
                  {{ currentAddress.customer_address_id ? 'Edit Address' : 'New Delivery Address' }}
                </h3>
                <button type="button" (click)="showAddressModal = false" class="text-xs text-[#7A6C5E] hover:underline cursor-pointer">
                  Cancel
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">Address Type</label>
                  <select [(ngModel)]="currentAddress.address_type" class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs outline-none">
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">PIN Code (6 digits) *</label>
                  <input type="text" maxlength="6" inputmode="numeric" autocomplete="postal-code" [(ngModel)]="currentAddress.pin_code" placeholder="400050" class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs font-mono font-bold outline-none" />
                </div>

                <div class="sm:col-span-2">
                  <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">Street Address / House No. *</label>
                  <textarea [(ngModel)]="currentAddress.address" autocomplete="street-address" rows="2" placeholder="Building name, flat number, street..." class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs outline-none"></textarea>
                </div>

                <div>
                  <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">City *</label>
                  <input type="text" [(ngModel)]="currentAddress.city" autocomplete="address-level2" placeholder="Mumbai" class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs outline-none" />
                </div>

                <div>
                  <label class="block font-bold mb-1 text-[#4A3C31] dark:text-[#F4F1ED]">State *</label>
                  <input type="text" [(ngModel)]="currentAddress.state" autocomplete="address-level1" placeholder="Maharashtra" class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#1E1916] text-xs outline-none" />
                </div>

                <div class="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input type="checkbox" id="addrDefaultCheck" [(ngModel)]="currentAddress.is_default" class="h-4 w-4 rounded border-[#EADFD2] text-[#9C4738] cursor-pointer" />
                  <label for="addrDefaultCheck" class="text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] cursor-pointer">
                    Set as default delivery address
                  </label>
                </div>
              </div>

              <div *ngIf="addressError" class="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl font-medium border border-rose-200">
                {{ addressError }}
              </div>

              <div class="pt-2 flex justify-end gap-2">
                <button type="button" (click)="showAddressModal = false" class="px-4 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs font-semibold text-[#7A6C5E] cursor-pointer">
                  Cancel
                </button>
                <button type="button" (click)="saveAddress()" [disabled]="savingAddress" class="px-5 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition shadow-xs disabled:opacity-50 cursor-pointer">
                  {{ savingAddress ? 'Saving...' : 'Save Address' }}
                </button>
              </div>
            </div>

          </div>

          <!-- GUARANTEES & ZERO COMMISSIONS -->
          <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-8 shadow-xs space-y-3 text-xs">
            <h2 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED] pb-2 border-b border-[#EADFD2]/60 dark:border-white/10">
              Verified Gifting Standards
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div class="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/60 dark:border-white/10 space-y-1">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-truck text-[#9C4738]"></i> PIN-Code Delivery</span>
                <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Real-time courier validation ensures swift transit with leading couriers.</p>
              </div>
              <div class="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/60 dark:border-white/10 space-y-1">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-qrcode text-emerald-600"></i> Free UPI (7350120467)</span>
                <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">0% gateway fees. Direct UPI to receiver 7350120467&#64;upi or COD.</p>
              </div>
              <div class="p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/60 dark:border-white/10 space-y-1">
                <span class="font-bold flex items-center gap-1.5"><i class="fa-solid fa-headset text-[#9C4738]"></i> Support (9284905118)</span>
                <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Questions or bulk hamper queries? Contact us directly at 9284905118.</p>
              </div>
            </div>
          </div>

        </main>

      </div>
    </app-site-layout>
  `
})
export class MyAccountPageComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly addressService = inject(CustomerAddressService);
  private readonly localStorage = inject(LocalStorageService);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);
  public readonly cartService = inject(CartService);

  currentUser: UserProfile | null = null;
  private authSub?: Subscription;

  // Profile Form
  profileName = '';
  profilePhone = '';
  profileGender = '';
  profileDob = '';
  savingProfile = false;
  profileSuccess = false;

  // Address Book
  addresses: CustomerAddress[] = [];
  showAddressModal = false;
  savingAddress = false;
  addressError = '';
  currentAddress: CustomerAddress = {
    address_type: 'Home',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pin_code: '',
    is_default: false
  };

  orderCount = 0;

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'My Account — RMS Creations Gift Hampers',
      description: 'Manage your profile, view order history, and maintain your saved address book.',
      keywords: 'my account, customer profile, address book, rms creations',
      slug: 'my-account'
    });

    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileName = user.name || '';
        this.profilePhone = user.phone_no || '';
        this.profileGender = user.gender || '';
        this.profileDob = user.date_of_birth ? user.date_of_birth.split('T')[0] : '';
        this.loadAddresses(user.id);
      }
      this.cdr.markForCheck();
    });

    const orders = this.localStorage.getItem<any[]>('rms_my_orders') || [];
    this.orderCount = orders.length;
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
  }

  async loadAddresses(userId?: number) {
    if (!userId) return;
    try {
      this.addresses = await this.addressService.getCustomerAddresses(userId);
      this.cdr.markForCheck();
    } catch (err) {
      console.error('Error loading addresses:', err);
    }
  }

  async saveProfile() {
    if (!this.profileName.trim()) return;
    this.savingProfile = true;
    try {
      await this.authService.updateProfile({
        name: this.profileName.trim(),
        phone_no: this.profilePhone.trim(),
        gender: (this.profileGender as any) || '',
        date_of_birth: this.profileDob || null
      });
      this.profileSuccess = true;
      setTimeout(() => { this.profileSuccess = false; this.cdr.markForCheck(); }, 2500);
    } finally {
      this.savingProfile = false;
      this.cdr.markForCheck();
    }
  }

  openAddAddress() {
    this.currentAddress = {
      address_type: 'Home',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pin_code: '',
      is_default: this.addresses.length === 0
    };
    this.addressError = '';
    this.showAddressModal = true;
  }

  editAddress(addr: CustomerAddress) {
    this.currentAddress = { ...addr };
    this.addressError = '';
    this.showAddressModal = true;
  }

  async saveAddress() {
    if (!this.currentUser?.id) return;
    this.savingAddress = true;
    this.addressError = '';

    try {
      const res = await this.addressService.saveAddress(this.currentUser.id, this.currentAddress);
      if (res.error) {
        this.addressError = res.error;
        return;
      }
      this.showAddressModal = false;
      await this.loadAddresses(this.currentUser.id);
    } catch (err: any) {
      this.addressError = err?.message || 'Error saving address.';
    } finally {
      this.savingAddress = false;
      this.cdr.markForCheck();
    }
  }

  async deleteAddress(addr: CustomerAddress) {
    if (!this.currentUser?.id || !addr.customer_address_id) return;
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await this.addressService.deleteAddress(this.currentUser.id, addr.customer_address_id);
      await this.loadAddresses(this.currentUser.id);
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  }
}
