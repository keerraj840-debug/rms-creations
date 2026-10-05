import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { ModalComponent } from '../shared/ui/modal.component';
import { InputComponent } from '../shared/ui/input.component';

@Component({
  selector: 'app-admin-product-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, ModalComponent, InputComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-serif font-bold text-[#3B2F2F] tracking-tight">Items Master</h1>
          <div class="h-5 w-px bg-[#EADFD2]"></div>
          <div class="flex items-center gap-2 text-sm text-[#7A6C5E] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span class="text-[10px] uppercase tracking-widest text-[#4A3C31] font-bold">> Inventory > Items</span>
          </div>
        </div>
        
        <app-button variant="primary" (onClick)="openModal()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Item
        </app-button>
      </div>

      <app-card [hasFooter]="false">
        <div card-header class="w-full flex items-center justify-between">
           <div class="relative w-full md:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6C5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search items..." class="w-full bg-white border border-[#EADFD2] rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B6E57]/20 text-sm text-[#4A3C31] placeholder-[#A89F91] transition-all duration-300">
          </div>
        </div>

        <div class="overflow-x-auto -mx-5 md:-mx-6">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] uppercase tracking-widest text-[#7A6C5E] border-b border-[#EADFD2] bg-[#FDFBF7]">
                <th class="px-6 py-4 font-bold">Item Name</th>
                <th class="px-6 py-4 font-bold">Description</th>
                <th class="px-6 py-4 font-bold">Price</th>
                <th class="px-6 py-4 font-bold">Status</th>
                <th class="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#EADFD2]/50">
              <tr *ngIf="loading">
                <td colspan="5" class="px-6 py-8 text-center text-[#7A6C5E] text-sm">Loading items...</td>
              </tr>
              <tr *ngIf="!loading && details.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-[#7A6C5E] text-sm">No items found. Create one above!</td>
              </tr>
              <tr *ngFor="let d of details" class="hover:bg-[#FDFBF7] transition-colors group">
                <td class="px-6 py-4 font-bold text-[#4A3C31] group-hover:text-[#DD8776] transition-colors">{{ d.name }}</td>
                <td class="px-6 py-4 text-[#7A6C5E] text-sm truncate max-w-xs">{{ d.description || 'N/A' }}</td>
                <td class="px-6 py-4 font-bold text-[#4A3C31]">&#36;{{ d.price || 0 }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex px-2.5 py-0.5 border rounded-md text-[10px] font-bold tracking-wide"
                        [ngClass]="d.is_active ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]' : 'bg-rose-50 border-rose-200 text-rose-600'">
                    {{ d.is_active ? 'ACTIVE' : 'INACTIVE' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button (click)="editItem(d)" class="text-[#7A6C5E] hover:text-[#DD8776] transition-colors p-2 inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </app-card>

      <!-- Add/Edit Modal -->
      <app-modal [isOpen]="showModal" [title]="isEdit ? 'Edit Item' : 'Add New Item'" size="md" (onClose)="closeModal()">
        <form (ngSubmit)="saveItem()" #detailForm="ngForm" class="space-y-5 py-2">
          
          <div *ngIf="modalError" class="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-bold border border-rose-200">
            {{ modalError }}
          </div>

          <app-input label="Item Name" type="text" [(ngModel)]="currentItem.name" name="name" [required]="true"></app-input>
          
          <app-input label="Description" type="textarea" [(ngModel)]="currentItem.description" name="description"></app-input>
          
          <app-input label="Price ($)" type="number" [(ngModel)]="currentItem.price" name="price"></app-input>

          <div class="flex items-center gap-3 pt-2 border-t border-[#EADFD2] mt-4">
            <input type="checkbox" id="is_active" name="is_active" [(ngModel)]="currentItem.is_active" class="w-5 h-5 rounded text-[#DD8776] border-[#EADFD2] focus:ring-[#DD8776]">
            <label for="is_active" class="text-sm font-bold text-[#4A3C31]">Item is Active</label>
          </div>

          <button type="submit" #submitBtn class="hidden"></button>
        </form>

        <div modal-footer class="w-full flex justify-end gap-3">
          <app-button variant="secondary" (onClick)="closeModal()">Cancel</app-button>
          <app-button variant="primary" [loading]="saving" [disabled]="!detailForm.valid" (onClick)="submitBtn.click()">
            {{ saving ? 'Saving...' : 'Save Item' }}
          </app-button>
        </div>
      </app-modal>
    </div>
  `
})
export class AdminProductDetailsPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  details: any[] = [];
  loading = true;

  showModal = false;
  saving = false;
  isEdit = false;
  modalError = '';
  
  currentItem: any = {
    name: '',
    description: '',
    price: null,
    is_active: true
  };

  ngOnInit() {
    this.fetchDetails();
  }

  async fetchDetails() {
    this.loading = true;
    const { data } = await this.supabase.from('product_details').select('*').order('name');
    this.details = data || [];
    this.loading = false;
  }

  openModal() {
    this.showModal = true;
    this.isEdit = false;
    this.modalError = '';
    this.currentItem = { name: '', description: '', price: null, is_active: true };
  }

  editItem(item: any) {
    this.showModal = true;
    this.isEdit = true;
    this.modalError = '';
    this.currentItem = { ...item };
  }

  closeModal() {
    this.showModal = false;
  }

  async saveItem() {
    this.saving = true;
    this.modalError = '';

    let error;
    if (this.isEdit) {
      const res = await this.supabase.from('product_details').update(this.currentItem).eq('id', this.currentItem.id);
      error = res.error;
    } else {
      const res = await this.supabase.from('product_details').insert(this.currentItem);
      error = res.error;
    }

    if (error) {
      this.modalError = error.message;
    } else {
      this.closeModal();
      this.fetchDetails();
    }
    
    this.saving = false;
  }
}
