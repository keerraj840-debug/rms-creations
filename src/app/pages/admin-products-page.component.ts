import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';

@Component({
  selector: 'app-admin-products-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
  template: `
    <div class="space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-serif font-bold text-[#3B2F2F] tracking-tight">Products</h1>
          <div class="h-5 w-px bg-[#EADFD2]"></div>
          <div class="flex items-center gap-2 text-sm text-[#7A6C5E] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span class="text-[10px] uppercase tracking-widest text-[#4A3C31] font-bold">> Inventory > Products</span>
          </div>
        </div>
        
        <app-button [routerLink]="['/admin/products/new']" variant="primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </app-button>
      </div>

      <app-card [hasFooter]="false">
        <div card-header class="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="relative w-full md:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6C5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search products..." class="w-full bg-white border border-[#EADFD2] rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B6E57]/20 text-sm text-[#4A3C31] placeholder-[#A89F91] transition-all duration-300">
          </div>
          
          <div class="flex bg-[#FDFBF7] p-1 rounded-full border border-[#EADFD2]">
            <button class="px-3 py-1 bg-white shadow-sm border border-[#EADFD2] rounded-full text-[10px] font-bold text-[#4A3C31]">All</button>
            <button class="px-3 py-1 text-[#7A6C5E] text-[10px] font-bold rounded-full hover:bg-white/50">Active</button>
            <button class="px-3 py-1 text-[#7A6C5E] text-[10px] font-bold rounded-full hover:bg-white/50">Inactive</button>
          </div>
        </div>

        <div class="overflow-x-auto -mx-5 md:-mx-6">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] uppercase tracking-widest text-[#7A6C5E] border-b border-[#EADFD2] bg-[#FDFBF7]">
                <th class="px-6 py-4 font-bold">Product</th>
                <th class="px-6 py-4 font-bold">Category</th>
                <th class="px-6 py-4 font-bold">Status</th>
                <th class="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EADFD2]/50">
              <tr *ngIf="loading">
                <td colspan="4" class="px-6 py-8 text-center text-[#7A6C5E] text-sm">Loading products...</td>
              </tr>
              <tr *ngIf="!loading && products.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-[#7A6C5E] text-sm">No products found. Create one above!</td>
              </tr>
              <tr *ngFor="let p of products" class="hover:bg-[#FDFBF7] transition-colors group cursor-pointer" [routerLink]="['/admin/products/edit', p.id]">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <div class="h-12 w-12 rounded-xl bg-[#F3E7DC] border border-[#EADFD2] overflow-hidden flex items-center justify-center flex-shrink-0">
                       <img *ngIf="p.images && p.images.length > 0" [src]="p.images[0]" class="h-full w-full object-cover">
                       <svg *ngIf="!p.images || p.images.length === 0" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#8B6E57]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p class="font-bold text-[#4A3C31] group-hover:text-[#DD8776] transition-colors text-sm">{{ p.name }}</p>
                      <p class="text-[11px] text-[#7A6C5E] max-w-xs truncate mt-0.5">{{ p.description || 'No description' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-white border border-[#EADFD2] rounded-full text-[10px] font-bold text-[#7A6C5E]">{{ p.categories?.name || 'Uncategorized' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-0.5 border rounded-md text-[10px] font-bold tracking-wide"
                        [ngClass]="p.is_active ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]' : 'bg-rose-50 border-rose-200 text-rose-600'">
                    {{ p.is_active ? 'ACTIVE' : 'INACTIVE' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="text-[#7A6C5E] hover:text-[#DD8776] transition-colors p-2 inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>
    </div>
  `
})
export class AdminProductsPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  products: any[] = [];
  loading = true;

  ngOnInit() {
    this.fetchProducts();
  }

  async fetchProducts() {
    this.loading = true;
    const { data } = await this.supabase
      .from('products')
      .select('*, categories(name)')
      .order('creation_date', { ascending: false });
    
    if (data) {
      this.products = data;
    }
    this.loading = false;
  }
}
