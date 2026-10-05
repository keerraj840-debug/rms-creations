import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { FileUploadComponent } from '../shared/ui/file-upload.component';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { InputComponent } from '../shared/ui/input.component';

@Component({
  selector: 'app-admin-product-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FileUploadComponent, CardComponent, ButtonComponent, InputComponent],
  template: `
    <div class="space-y-6 max-w-5xl mx-auto pb-12">
      
      <!-- Header -->
      <div class="flex items-center gap-4">
        <a routerLink="/admin/products" class="p-2 text-[#7A6C5E] hover:text-[#4A3C31] bg-white rounded-xl shadow-sm border border-[#EADFD2] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <div>
          <h1 class="text-3xl font-serif font-bold text-[#3B2F2F] tracking-tight">{{ isEdit ? 'Edit Product' : 'Create Product' }}</h1>
          <p class="text-sm text-[#7A6C5E] mt-1">Configure product details, pricing, and composition.</p>
        </div>
      </div>

      <app-card [hasHeader]="false" [hasFooter]="false">
        <form (ngSubmit)="saveProduct()" #prodForm="ngForm" class="space-y-8">
          
          <div *ngIf="errorMessage" class="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-200">
            {{ errorMessage }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div class="space-y-6 md:col-span-1 border-r-0 md:border-r border-[#EADFD2] md:pr-8">
               <h3 class="text-lg font-serif font-bold text-[#4A3C31] border-b border-[#EADFD2] pb-2">Basic Info</h3>
               
               <app-input label="Product Name" type="text" [(ngModel)]="product.name" name="name" [required]="true"></app-input>
               
               <app-input label="Category" type="select" [(ngModel)]="product.category_id" name="category_id" [required]="true">
                  <option value="">Select Category...</option>
                  <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
               </app-input>
               
               <app-input label="Description" type="textarea" [(ngModel)]="product.description" name="description"></app-input>

               <div class="flex items-center gap-3 pt-4 border-t border-[#EADFD2]">
                 <input type="checkbox" id="is_active" name="is_active" [(ngModel)]="product.is_active" class="w-5 h-5 rounded text-[#DD8776] border-[#EADFD2] focus:ring-[#DD8776]">
                 <label for="is_active" class="text-sm font-bold text-[#4A3C31]">Product is Active (Visible)</label>
               </div>
            </div>

            <div class="space-y-6 md:col-span-1">
               <h3 class="text-lg font-serif font-bold text-[#4A3C31] border-b border-[#EADFD2] pb-2">Media & Items</h3>
               
               <div>
                  <label class="block text-xs font-bold text-[#7A6C5E] uppercase tracking-widest mb-2">Product Image (1:1 Square) <span class="text-rose-500">*</span></label>
                  <app-file-upload 
                    [aspectRatio]="1" 
                    [maxSizeMB]="1" 
                    (fileReady)="onFileReady($event)"
                  ></app-file-upload>
                  
                  <div *ngIf="uploadingImage" class="mt-2 text-sm text-[#DD8776] flex items-center gap-2 font-medium">
                    <span class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Uploading to server...
                  </div>

                  <div *ngIf="product.images?.length > 0" class="mt-4 bg-[#FDFBF7] p-4 rounded-2xl border border-[#EADFD2] relative group">
                    <p class="text-xs font-bold text-[#7A6C5E] mb-3 uppercase tracking-wider">Current Image</p>
                    <img [src]="product.images[0]" class="w-32 h-32 object-cover rounded-xl shadow-sm border border-[#EADFD2]">
                    <button type="button" (click)="product.images = []" class="absolute top-4 right-4 bg-white/90 text-rose-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm border border-[#EADFD2]">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
               </div>

               <div class="pt-4 border-t border-[#EADFD2]">
                 <label class="block text-xs font-bold text-[#7A6C5E] uppercase tracking-widest mb-2">Composition Items</label>
                 <div class="bg-[#FDFBF7] border border-[#EADFD2] rounded-2xl p-4">
                   <p class="text-xs text-[#7A6C5E] mb-3">Select items that make up this product to calculate cost.</p>
                   
                   <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                     <label *ngFor="let item of allItems" class="flex items-center justify-between p-2 hover:bg-white rounded-lg border border-transparent hover:border-[#EADFD2] transition-colors cursor-pointer">
                        <div class="flex items-center gap-3">
                          <input type="checkbox" [checked]="isItemSelected(item.id)" (change)="toggleItem(item.id)" class="w-4 h-4 rounded text-[#DD8776] border-[#EADFD2] focus:ring-[#DD8776]">
                          <span class="text-sm font-medium text-[#4A3C31]">{{ item.name }}</span>
                        </div>
                        <span class="text-xs font-bold text-[#7A6C5E]">&#36;{{ item.price || 0 }}</span>
                     </label>
                   </div>
                 </div>
               </div>
               
               <div class="pt-4 border-t border-[#EADFD2]">
                 <app-input label="Selling Price ($)" type="number" [(ngModel)]="product.selling_price" name="selling_price"></app-input>
               </div>

            </div>

          </div>

          <div class="pt-6 border-t border-[#EADFD2] flex justify-end gap-4 mt-8">
            <app-button variant="secondary" [routerLink]="['/admin/products']">Cancel</app-button>
            <app-button variant="primary" type="submit" [disabled]="saving || uploadingImage || !prodForm.valid" [loading]="saving">
              {{ saving ? 'Saving...' : 'Save Product' }}
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `
})
export class AdminProductFormPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  saving = false;
  uploadingImage = false;
  errorMessage = '';

  categories: any[] = [];
  allItems: any[] = [];
  selectedItemIds: Set<string> = new Set();

  product: any = {
    name: '',
    description: '',
    category_id: '',
    selling_price: null,
    images: [],
    is_active: true
  };

  ngOnInit() {
    this.loadDependencies();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadProduct(id);
    }
  }

  async loadDependencies() {
    const [catRes, itemsRes] = await Promise.all([
      this.supabase.from('categories').select('id, name').eq('is_active', true),
      this.supabase.from('product_details').select('*').eq('is_active', true)
    ]);
    this.categories = catRes.data || [];
    this.allItems = itemsRes.data || [];
  }

  async loadProduct(id: string) {
    const { data, error } = await this.supabase.from('products').select('*').eq('id', id).single();
    if (data) {
      this.product = data;
      // Load mappings
      const { data: mappings } = await this.supabase.from('product_mappings').select('detail_id').eq('product_id', id);
      if (mappings) {
        this.selectedItemIds = new Set(mappings.map(m => m.detail_id));
      }
    } else {
      this.errorMessage = 'Product not found.';
    }
  }

  isItemSelected(id: string): boolean {
    return this.selectedItemIds.has(id);
  }

  toggleItem(id: string) {
    if (this.selectedItemIds.has(id)) {
      this.selectedItemIds.delete(id);
    } else {
      this.selectedItemIds.add(id);
    }
  }

  async onFileReady(file: File) {
    this.uploadingImage = true;
    const fileExt = file.name.split('.').pop();
    const fileName = `product-${Date.now()}.${fileExt}`;
    const { data, error } = await this.supabase.uploadFile('images', fileName, file);
    
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.product.images = [data]; // Only keeping 1 image for now per req
    }
    this.uploadingImage = false;
  }

  async saveProduct() {
    this.saving = true;
    this.errorMessage = '';

    let error;
    let productId = this.product.id;

    if (this.isEdit) {
      const res = await this.supabase.from('products').update(this.product).eq('id', productId);
      error = res.error;
    } else {
      const res = await this.supabase.from('products').insert(this.product).select();
      error = res.error;
      if (res.data) productId = res.data[0].id;
    }

    if (error) {
      this.errorMessage = error.message;
      this.saving = false;
      return;
    }

    // Save mappings
    if (productId) {
      await this.supabase.from('product_mappings').delete().eq('product_id', productId);
      const mappings = Array.from(this.selectedItemIds).map(detail_id => ({
        product_id: productId,
        detail_id: detail_id
      }));
      if (mappings.length > 0) {
        await this.supabase.from('product_mappings').insert(mappings);
      }
    }

    this.router.navigate(['/admin/products']);
  }
}
