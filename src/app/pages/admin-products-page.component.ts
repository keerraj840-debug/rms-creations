import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { TableComponent, TableColumn } from '../shared/ui/table.component';
import { ModalComponent } from '../shared/ui/modal.component';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CardComponent, ButtonComponent, TableComponent, ModalComponent],
  template: `
    <div class="space-y-5  mx-auto pb-12 transition-colors duration-300">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] tracking-tight">Products Catalog</h1>
          <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
            {{ products.length }} hampers total • {{ activeProductsCount }} live on store • {{ categories.length }} collections
          </p>
        </div>
        
        <div class="flex items-center gap-2.5">
          <!-- 1-Click Quick Add Modal Button -->
          <button type="button" (click)="openQuickAdd()"
                  class="px-3.5 py-2 rounded-xl bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] transition-all flex items-center gap-1.5 shadow-2xs hover:bg-[#F3E7DC]/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#9C4738] dark:text-[#DD8776]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Quick Add</span>
          </button>

          <!-- Full Studio Link -->
          <app-button [routerLink]="['/admin/products/new']" variant="primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </app-button>
        </div>
      </div>

      <!-- Quick Action Success Toast -->
      <div *ngIf="quickSuccessMsg" class="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between animate-in fade-in">
        <span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-check"></i> {{ quickSuccessMsg }}</span>
        <button (click)="quickSuccessMsg = ''" class="text-emerald-500 hover:text-emerald-700"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Main Data Table Container -->
      <app-card [hasFooter]="false">
        
        <!-- Filter Controls Toolbar -->
        <div card-header class="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2">
          
          <!-- Search box -->
          <div class="relative w-full md:w-80">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6C5E] dark:text-[#C5A393]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search by name, description..."
                   class="w-full bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B6E57]/20 text-xs sm:text-sm text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all">
          </div>
          
          <!-- Filter pills & Category dropdown -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Category Filter Dropdown -->
            <select [(ngModel)]="selectedCategoryFilter" class="bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
              <option value="all">All Categories ({{ categories.length }})</option>
              <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
            </select>

            <!-- Status Filter Switcher -->
            <div class="flex bg-[#FDFBF7] dark:bg-white/5 p-1 rounded-xl border border-[#EADFD2] dark:border-white/10 shrink-0">
              <button (click)="statusFilter = 'all'"
                      [class]="statusFilter === 'all' ? 'bg-white dark:bg-[#2E2825] shadow-sm text-[#4A3C31] dark:text-[#F4F1ED]' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all">All ({{ products.length }})</button>
              <button (click)="statusFilter = 'active'"
                      [class]="statusFilter === 'active' ? 'bg-white dark:bg-[#2E2825] shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all">Active</button>
              <button (click)="statusFilter = 'inactive'"
                      [class]="statusFilter === 'inactive' ? 'bg-white dark:bg-[#2E2825] shadow-sm text-rose-600 dark:text-rose-400' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                      class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all">Drafts</button>
            </div>
          </div>

        </div>

        <!-- Table with Skeleton & Instant Fallback -->
        <app-table
          [columns]="columns"
          [loading]="loading"
          [error]="error"
          (retry)="fetchProducts()"
          [isEmpty]="filteredProducts.length === 0"
          [emptyIcon]="searchQuery || statusFilter !== 'all' || selectedCategoryFilter !== 'all' ? 'search' : 'box'"
          [emptyTitle]="searchQuery || statusFilter !== 'all' || selectedCategoryFilter !== 'all' ? 'No matching products' : 'No products in catalog'"
          [emptyDescription]="searchQuery || statusFilter !== 'all' || selectedCategoryFilter !== 'all' ? 'No products match the selected filters.' : 'Your product catalog is empty. Start by adding your first gift hamper.'"
          [emptyActionText]="searchQuery || statusFilter !== 'all' || selectedCategoryFilter !== 'all' ? 'Reset Filters' : 'Add First Product'"
          [emptyActionRouterLink]="searchQuery || statusFilter !== 'all' || selectedCategoryFilter !== 'all' ? undefined : ['/admin/products/new']"
          [emptyActionIcon]="searchQuery || statusFilter !== 'all' || selectedCategoryFilter !== 'all' ? 'refresh' : 'plus'"
          (emptyActionClick)="resetFilters()"
        >
          <tr *ngFor="let p of filteredProducts" class="hover:bg-[#FDFBF7] dark:hover:bg-white/5 transition-colors group">
            
            <!-- Product Column (Photo, Name, Audience, Description) -->
            <td class="px-6 py-3.5">
              <div class="flex items-center gap-3.5">
                <div class="h-11 w-11 rounded-xl bg-[#F3E7DC] dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                   <img *ngIf="p.images && p.images.length > 0" [src]="p.images[0]" [alt]="p.name + ' thumbnail'" class="h-full w-full object-cover">
                   <span *ngIf="!p.images || p.images.length === 0" class="text-sm text-[#7A6C5E] dark:text-[#C5A393]"><i class="fa-solid fa-gift"></i></span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <a [routerLink]="['/admin/products/edit', p.id]" class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] hover:text-[#DD8776] dark:hover:text-[#DD8776] transition-colors text-sm truncate">
                      {{ p.name }}
                    </a>
                    <span *ngIf="p.gender && p.gender !== 'unisex'" class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#8B6E57]/10 text-[#8B6E57] dark:text-[#C5A393] inline-flex items-center gap-1">
                      <i [class]="getGenderIcon(p.gender) + ' text-[9px]'"></i>
                      <span>{{ getGenderLabel(p.gender) }}</span>
                    </span>
                    <span *ngIf="p.from_date || p.to_date" class="px-1.5 py-0.2 rounded text-[9px] font-bold border flex items-center gap-1"
                          [ngClass]="isProductDateActive(p) ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200'">
                      <i class="fa-regular fa-calendar-days text-[9px]"></i>
                      <span>{{ formatDateRange(p.from_date, p.to_date) }}</span>
                    </span>
                  </div>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] max-w-sm truncate mt-0.5">{{ p.description || 'No description added' }}</p>
                </div>
              </div>
            </td>

            <!-- Category Column -->
            <td class="px-6 py-3.5">
              <span class="inline-flex px-2.5 py-0.5 bg-[#FDFBF7] dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-full text-[10px] font-bold text-[#7A6C5E] dark:text-[#C5A393]">
                {{ p.categories?.name || 'Uncategorized' }}
              </span>
            </td>

            <!-- Selling Price Column -->
            <td class="px-6 py-3.5 font-serif font-bold text-sm text-[#3B2F2F] dark:text-[#F4F1ED]">
              ₹{{ p.selling_price || 0 }}
            </td>

            <!-- Quick Toggle Status Column -->
            <td class="px-6 py-3.5">
              <button type="button" (click)="toggleActive(p, $event)"
                      [class]="p.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100' : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/40 text-stone-500 hover:bg-stone-100'"
                      class="px-2.5 py-1 border rounded-lg text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Click to toggle store visibility">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="p.is_active ? 'bg-emerald-500' : 'bg-stone-400'"></span>
                <span>{{ p.is_active ? 'ACTIVE' : 'DRAFT' }}</span>
              </button>
            </td>

            <!-- Actions Column -->
            <td class="px-6 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <!-- Duplicate / Clone -->
                <a [routerLink]="['/admin/products/new']" [queryParams]="{ cloneFrom: p.id }"
                   class="p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#8B6E57] hover:bg-[#F3E7DC] dark:hover:bg-white/10 rounded-xl transition-all"
                   title="Duplicate Hamper Template">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </a>

                <!-- Edit in Studio -->
                <a [routerLink]="['/admin/products/edit', p.id]"
                   class="p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#DD8776] hover:bg-[#F3E7DC] dark:hover:bg-white/10 rounded-xl transition-all"
                   title="Edit Product in Studio">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </a>
              </div>
            </td>

          </tr>
        </app-table>
      </app-card>

      <!-- Instant In-Place Quick Add Modal -->
      <app-modal [isOpen]="showQuickAddModal" title="Quick Add Product" size="md" (onClose)="closeQuickAdd()">
        <form (ngSubmit)="saveQuickProduct(false)" class="space-y-4 py-1">
          
          <div *ngIf="quickError" class="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200">
            {{ quickError }}
          </div>

          <!-- Product Name -->
          <div>
            <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">
              Product Title <span class="text-rose-500">*</span>
            </label>
            <input type="text" [(ngModel)]="quickProduct.name" name="quick_name" placeholder="e.g. Premium Chocolate Gift Box" [required]="true"
                   class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3.5 py-2 text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]">
          </div>

          <!-- Category & Price in 1 Row -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Category *</label>
              </div>
              <select [(ngModel)]="quickProduct.category_id" name="quick_cat" class="w-full px-3 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FDFBF7] dark:bg-[#1C1917] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/20">
                <option value="">Select Category...</option>
                <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Selling Price (₹)</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-serif font-bold text-[#7A6C5E]">₹</span>
                <input type="number" [(ngModel)]="quickProduct.selling_price" name="quick_price" placeholder="e.g. 499"
                       class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/20">
              </div>
            </div>
          </div>

          <!-- Target Recipient / Gender -->
          <div>
            <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Target Recipient / Gender</label>
            <div class="grid grid-cols-5 gap-1.5 text-xs">
              <button type="button" *ngFor="let g of audienceOptions" (click)="quickProduct.gender = g.value"
                      [class]="quickProduct.gender === g.value ? 'bg-[#9C4738] text-white font-bold shadow-2xs' : 'bg-[#FDFBF7] dark:bg-[#1C1917] text-[#7A6C5E] dark:text-[#C5A393] border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738]'"
                      class="py-1.5 px-1 rounded-xl text-[10px] transition-all flex flex-col items-center justify-center gap-1 text-center">
                <i [class]="g.iconClass + ' text-[11px]'"></i>
                <span class="leading-tight font-medium">{{ g.label }}</span>
              </button>
            </div>
          </div>

          <!-- Active Availability Dates -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1">Available From (Opt)</label>
              <input type="date" [(ngModel)]="quickProduct.from_date" name="quick_from"
                     class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-1">Available Until (Opt)</label>
              <input type="date" [(ngModel)]="quickProduct.to_date" name="quick_to"
                     class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
            </div>
          </div>

          <!-- Quick Image Upload -->
          <div>
            <label class="block text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] mb-1">Cover Photo</label>
            <div class="flex items-center gap-3">
              <div *ngIf="quickProduct.image" class="w-14 h-14 rounded-xl overflow-hidden border border-[#EADFD2] dark:border-white/10 shrink-0 bg-stone-100 relative group">
                <img [src]="quickProduct.image" [alt]="quickProduct.name || 'Product preview'" class="w-full h-full object-cover">
                <button type="button" (click)="quickProduct.image = ''" class="absolute inset-0 bg-black/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <i class="fa-solid fa-trash-can text-xs"></i>
                  <span>Remove</span>
                </button>
              </div>

              <label class="flex-1 border-2 border-dashed border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] rounded-xl p-3 text-center cursor-pointer transition-colors bg-[#FDFBF7] dark:bg-white/5 flex items-center justify-center gap-2 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738]">
                <input type="file" (change)="onQuickFileSelected($event)" accept="image/*" class="hidden">
                <span *ngIf="quickUploading" class="animate-spin h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full"></span>
                <span>{{ quickUploading ? 'Uploading image...' : (quickProduct.image ? 'Change Photo' : '+ Choose Image File') }}</span>
              </label>
            </div>
          </div>

          <!-- Status Switch -->
          <div class="flex items-center justify-between pt-1">
            <span class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393]">Store Visibility</span>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" [(ngModel)]="quickProduct.is_active" name="quick_active" class="sr-only peer">
              <div class="w-8 h-4.5 bg-stone-300 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500 relative"></div>
              <span class="text-[11px] font-bold" [ngClass]="quickProduct.is_active ? 'text-emerald-600' : 'text-stone-400'">
                {{ quickProduct.is_active ? 'Active' : 'Draft' }}
              </span>
            </label>
          </div>

          <button type="submit" class="hidden"></button>
        </form>

        <div modal-footer class="w-full flex justify-between items-center gap-2">
          <a [routerLink]="['/admin/products/new']" (click)="closeQuickAdd()" class="text-[11px] font-bold text-[#9C4738] dark:text-[#DD8776] hover:underline">
            Open Full Studio →
          </a>

          <div class="flex items-center gap-2">
            <button type="button" (click)="saveQuickProduct(true)" [disabled]="quickSaving || quickUploading || !quickProduct.name || !quickProduct.category_id"
                    class="px-3 py-1.5 rounded-xl border border-[#EADFD2] text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#F3E7DC]/30 transition-all disabled:opacity-50">
              Save & Add Another
            </button>
            <button type="button" (click)="saveQuickProduct(false)" [disabled]="quickSaving || quickUploading || !quickProduct.name || !quickProduct.category_id"
                    class="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all disabled:opacity-50">
              {{ quickSaving ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </div>
      </app-modal>

    </div>
  `
})
export class AdminProductsPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  products: any[] = [];
  categories: any[] = [];
  itemsCount = 0;
  loading = true;
  error: string | null = null;
  searchQuery = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  selectedCategoryFilter: string = 'all';

  // Quick Add State
  showQuickAddModal = false;
  quickSaving = false;
  quickUploading = false;
  quickError = '';
  quickSuccessMsg = '';
  quickProduct = {
    name: '',
    category_id: '',
    selling_price: null as number | null,
    from_date: null as string | null,
    to_date: null as string | null,
    gender: 'unisex',
    image: '',
    is_active: true
  };

  audienceOptions = [
    { value: 'unisex', label: 'All', iconClass: 'fa-solid fa-gift' },
    { value: 'girls', label: 'For Her', iconClass: 'fa-solid fa-venus' },
    { value: 'boys', label: 'For Him', iconClass: 'fa-solid fa-mars' },
    { value: 'kids', label: 'Kids', iconClass: 'fa-solid fa-child' },
    { value: 'festive', label: 'Festive', iconClass: 'fa-solid fa-wand-magic-sparkles' }
  ];

  columns: TableColumn[] = [
    { label: 'Product & Theme', width: '40%' },
    { label: 'Category', width: '22%' },
    { label: 'Price', width: '14%' },
    { label: 'Status', width: '12%' },
    { label: 'Actions', width: '12%', align: 'right' }
  ];

  get activeProductsCount(): number {
    return this.products.filter(p => p.is_active).length;
  }

  get filteredProducts() {
    return this.products.filter(p => {
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !this.searchQuery ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.categories?.name && p.categories.name.toLowerCase().includes(q));

      const matchStatus = this.statusFilter === 'all' || (this.statusFilter === 'active' ? p.is_active : !p.is_active);
      const matchCategory = this.selectedCategoryFilter === 'all' || String(p.category_id) === String(this.selectedCategoryFilter);

      return matchSearch && matchStatus && matchCategory;
    });
  }

  ngOnInit() {
    this.fetchProducts();
  }

  resetFilters() {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.selectedCategoryFilter = 'all';
    this.cdr.markForCheck();
  }

  async fetchProducts() {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    try {
      const [pRes, cRes, itemsRes] = await Promise.all([
        this.supabase.from('products').select('*').order('creation_date', { ascending: false }),
        this.supabase.from('categories').select('id, name').order('name'),
        this.supabase.from('product_details').select('id', { count: 'exact' })
      ]);

      if (pRes.error) {
        this.error = pRes.error.message;
        this.products = [];
      } else {
        this.categories = cRes.data || [];
        this.itemsCount = itemsRes.count || (itemsRes.data ? itemsRes.data.length : 0);

        const catMap = new Map<number, string>();
        if (cRes.data) {
          cRes.data.forEach((c: any) => catMap.set(Number(c.id), c.name));
        }

        if (pRes.data) {
          this.products = pRes.data.map((p: any) => ({
            ...p,
            categories: { name: catMap.get(Number(p.category_id)) || 'Uncategorized' }
          }));
        } else {
          this.products = [];
        }
        this.error = null;
      }
    } catch (err: any) {
      this.error = err?.message || 'Failed to connect to database.';
      this.products = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async toggleActive(product: any, event: Event) {
    event.stopPropagation();
    const newStatus = !product.is_active;
    product.is_active = newStatus;
    this.cdr.markForCheck();

    try {
      const { error } = await this.supabase
        .from('products')
        .update({ is_active: newStatus })
        .eq('id', product.id);

      if (error) {
        product.is_active = !newStatus;
        this.cdr.markForCheck();
      }
    } catch {
      product.is_active = !newStatus;
      this.cdr.markForCheck();
    }
  }

  // Quick Add Methods
  openQuickAdd() {
    this.quickProduct = {
      name: '',
      category_id: this.categories.length > 0 ? String(this.categories[0].id) : '',
      selling_price: null,
      from_date: null,
      to_date: null,
      gender: 'unisex',
      image: '',
      is_active: true
    };
    this.quickError = '';
    this.showQuickAddModal = true;
    this.cdr.markForCheck();
  }

  closeQuickAdd() {
    this.showQuickAddModal = false;
    this.cdr.markForCheck();
  }

  async onQuickFileSelected(event: any) {
    const file = event.target?.files?.[0];
    if (!file) return;

    this.quickUploading = true;
    this.cdr.markForCheck();

    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `product-${cleanBaseName}-${Date.now()}.${fileExt}`;
      const { data, error } = await this.supabase.uploadFile('images', fileName, file);

      if (error) {
        this.quickError = error.message;
      } else if (data) {
        this.quickProduct.image = data;
      }
    } catch (err: any) {
      this.quickError = err?.message || 'Failed to upload photo.';
    } finally {
      this.quickUploading = false;
      this.cdr.markForCheck();
    }
  }

  async saveQuickProduct(addAnother = false) {
    if (!this.quickProduct.name.trim() || !this.quickProduct.category_id) {
      this.quickError = 'Please enter Product Title and select a Category.';
      this.cdr.markForCheck();
      return;
    }

    this.quickSaving = true;
    this.quickError = '';
    this.cdr.markForCheck();

    const savedName = this.quickProduct.name.trim();
    const retainedCategory = this.quickProduct.category_id;

    try {
      const payload: any = {
        name: savedName,
        category_id: Number(this.quickProduct.category_id),
        selling_price: this.quickProduct.selling_price ? Number(this.quickProduct.selling_price) : null,
        from_date: this.quickProduct.from_date || null,
        to_date: this.quickProduct.to_date || null,
        images: this.quickProduct.image ? [this.quickProduct.image] : [],
        is_active: Boolean(this.quickProduct.is_active),
        gender: this.quickProduct.gender || 'unisex'
      };

      const { data, error } = await this.supabase.from('products').insert(payload).select().single();

      if (error) {
        this.quickError = error.message;
      } else if (data) {
        const catObj = this.categories.find(c => String(c.id) === String(data.category_id));
        const newRow = {
          ...data,
          categories: { name: catObj ? catObj.name : 'Uncategorized' }
        };
        // Prepend to catalog table immediately
        this.products.unshift(newRow);
        this.quickSuccessMsg = `"${savedName}" added to catalog!`;

        if (addAnother) {
          this.quickProduct = {
            name: '',
            category_id: retainedCategory,
            selling_price: null,
            from_date: null,
            to_date: null,
            gender: 'unisex',
            image: '',
            is_active: true
          };
        } else {
          this.closeQuickAdd();
        }
      }
    } catch (err: any) {
      this.quickError = err?.message || 'Failed to save product.';
    } finally {
      this.quickSaving = false;
      this.cdr.markForCheck();
    }
  }

  getGenderIcon(gender: string): string {
    switch (gender) {
      case 'girls': return 'fa-solid fa-venus text-rose-500';
      case 'boys': return 'fa-solid fa-mars text-blue-500';
      case 'kids': return 'fa-solid fa-child text-amber-500';
      case 'festive': return 'fa-solid fa-wand-magic-sparkles text-purple-500';
      default: return 'fa-solid fa-gift text-stone-500';
    }
  }

  getGenderLabel(gender: string): string {
    switch (gender) {
      case 'girls': return 'For Her';
      case 'boys': return 'For Him';
      case 'kids': return 'Kids';
      case 'festive': return 'Festive';
      default: return 'Unisex';
    }
  }

  formatDateRange(from: string | null, to: string | null): string {
    if (from && to) return `${from} to ${to}`;
    if (from) return `From ${from}`;
    if (to) return `Until ${to}`;
    return '';
  }

  isProductDateActive(p: any): boolean {
    if (!p.from_date && !p.to_date) return true;
    const today = new Date().toISOString().split('T')[0];
    if (p.from_date && p.from_date > today) return false;
    if (p.to_date && p.to_date < today) return false;
    return true;
  }
}
