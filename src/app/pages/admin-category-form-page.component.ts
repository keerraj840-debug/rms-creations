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
  selector: 'app-admin-category-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FileUploadComponent, CardComponent, ButtonComponent, InputComponent],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto pb-12">
      
      <div class="flex items-center gap-4">
        <a routerLink="/admin/categories" class="p-2 text-[#7A6C5E] hover:text-[#4A3C31] bg-white rounded-xl shadow-sm border border-[#EADFD2] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </a>
        <div>
          <h1 class="text-3xl font-serif font-bold text-[#3B2F2F] tracking-tight">{{ isEdit ? 'Edit Category' : 'Create Category' }}</h1>
          <p class="text-sm text-[#7A6C5E] mt-1">Configure category details and upload banner.</p>
        </div>
      </div>

      <app-card [hasHeader]="false" [hasFooter]="false">
        <form (ngSubmit)="saveCategory()" #catForm="ngForm" class="space-y-8">
          
          <div *ngIf="errorMessage" class="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-bold border border-rose-200">
            {{ errorMessage }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div class="md:col-span-2">
              <app-input label="Category Name" type="text" [(ngModel)]="category.name" name="name" [required]="true"></app-input>
            </div>
            
            <div class="md:col-span-2">
              <app-input label="Description" type="textarea" [(ngModel)]="category.description" name="description"></app-input>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-[#7A6C5E] uppercase tracking-widest mb-2">Category Image (16:9 Banner)</label>
              
              <app-file-upload 
                [aspectRatio]="16/9" 
                [maxSizeMB]="1" 
                (fileReady)="onFileReady($event)"
              ></app-file-upload>
              
              <div *ngIf="uploadingImage" class="mt-2 text-sm text-[#DD8776] flex items-center gap-2 font-medium">
                <span class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                Uploading to server...
              </div>

              <div *ngIf="category.image" class="mt-4 bg-[#FDFBF7] p-4 rounded-2xl border border-[#EADFD2] relative group">
                <p class="text-xs font-bold text-[#7A6C5E] mb-3 uppercase tracking-wider">Current Image</p>
                <img [src]="category.image" class="w-full max-w-md object-cover rounded-xl shadow-sm border border-[#EADFD2]">
                <button type="button" (click)="category.image = ''" class="absolute top-4 right-4 bg-white/90 text-rose-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm border border-[#EADFD2]">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div class="md:col-span-2 flex items-center gap-3 pt-4 border-t border-[#EADFD2]">
              <input type="checkbox" id="is_active" name="is_active" [(ngModel)]="category.is_active" class="w-5 h-5 rounded text-[#DD8776] border-[#EADFD2] focus:ring-[#DD8776]">
              <label for="is_active" class="text-sm font-bold text-[#4A3C31]">Category is Active (Visible)</label>
            </div>

          </div>

          <div class="pt-6 border-t border-[#EADFD2] flex justify-end gap-4 mt-8">
            <app-button variant="secondary" [routerLink]="['/admin/categories']">Cancel</app-button>
            <app-button variant="primary" type="submit" [disabled]="saving || uploadingImage || !catForm.valid" [loading]="saving">
              {{ saving ? 'Saving...' : 'Save Category' }}
            </app-button>
          </div>
        </form>
      </app-card>
    </div>
  `
})
export class AdminCategoryFormPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEdit = false;
  saving = false;
  uploadingImage = false;
  errorMessage = '';

  category: any = {
    name: '',
    description: '',
    image: '',
    is_active: true
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadCategory(id);
    }
  }

  async loadCategory(id: string) {
    const { data, error } = await this.supabase.from('categories').select('*').eq('id', id).single();
    if (data) {
      this.category = data;
    } else {
      this.errorMessage = 'Category not found.';
    }
  }

  async onFileReady(file: File) {
    this.uploadingImage = true;
    const fileExt = file.name.split('.').pop();
    const fileName = `category-${Date.now()}.${fileExt}`;
    const { data, error } = await this.supabase.uploadFile('images', fileName, file);
    
    if (error) {
      this.errorMessage = error.message;
    } else {
      this.category.image = data;
    }
    this.uploadingImage = false;
  }

  async saveCategory() {
    this.saving = true;
    this.errorMessage = '';

    let error;
    if (this.isEdit) {
      const res = await this.supabase.from('categories').update(this.category).eq('id', this.category.id);
      error = res.error;
    } else {
      const res = await this.supabase.from('categories').insert(this.category);
      error = res.error;
    }

    if (error) {
      this.errorMessage = error.message;
      this.saving = false;
    } else {
      this.router.navigate(['/admin/categories']);
    }
  }
}
