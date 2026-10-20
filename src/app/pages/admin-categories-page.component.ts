import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { CardComponent } from '../shared/ui/card.component';
import { TableComponent, TableColumn } from '../shared/ui/table.component';

@Component({
  selector: 'app-admin-categories-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardComponent, TableComponent],
  template: `
    <div class="space-y-6  mx-auto pb-12 transition-colors duration-300">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] tracking-tight">Categories & Collections</h1>
          <p class="text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
            Organize gift hampers by festivals, recipients, and celebration occasions.
          </p>
        </div>
        
        <div class="flex items-center gap-2.5">
          <a routerLink="/admin/categories/new" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#DD8776] text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Category</span>
          </a>
        </div>
      </div>

      <!-- Quick KPI Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-folder-tree"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Total Collections</p>
            <p class="text-xl font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">{{ categories.length }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Live on Website</p>
            <p class="text-xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{{ activeCategoriesCount }}</p>
          </div>
        </div>

        <div class="col-span-2 sm:col-span-1 bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-tags"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Pricing Range</p>
            <p class="text-base font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">From ₹{{ minCategoryPrice }}</p>
          </div>
        </div>
      </div>

      <app-card [hasFooter]="false">
        <div card-header class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="relative w-full sm:w-72">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6C5E] dark:text-[#C5A393]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search categories..."
                   class="w-full bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8B6E57]/20 text-xs sm:text-sm text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all">
          </div>
        </div>

        <app-table
          [columns]="columns"
          [loading]="loading"
          [error]="error"
          (retry)="fetchCategories()"
          [isEmpty]="filteredCategories.length === 0"
          [emptyIcon]="searchQuery ? 'search' : 'folder'"
          [emptyTitle]="searchQuery ? 'No matching categories' : 'No categories yet'"
          [emptyDescription]="searchQuery ? 'No categories matched your search query.' : 'Categories organize your products into occasions, hampers, and festivals.'"
          [emptyActionText]="searchQuery ? 'Clear Search' : 'Create First Category'"
          [emptyActionIcon]="searchQuery ? 'refresh' : 'plus'"
          (emptyActionClick)="searchQuery ? (searchQuery = '') : router.navigate(['/admin/categories/new'])"
        >
          <tr *ngFor="let c of filteredCategories" class="hover:bg-[#FDFBF7] dark:hover:bg-white/5 transition-colors group">
            
            <!-- Category Info -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="h-12 w-16 rounded-xl bg-[#F3E7DC] dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                   <img *ngIf="c.image" [src]="c.image" [alt]="c.name + ' category image'" class="h-full w-full object-cover">
                   <span *ngIf="!c.image" class="text-lg text-[#7A6C5E] dark:text-[#C5A393]"><i class="fa-solid fa-folder"></i></span>
                </div>
                <div>
                  <a [routerLink]="['/admin/categories/edit', c.id]" class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] hover:text-[#9C4738] dark:hover:text-[#DD8776] transition-colors text-sm text-left">
                    {{ c.name }}
                  </a>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] max-w-sm truncate mt-0.5">{{ c.description || 'No description added' }}</p>
                </div>
              </div>
            </td>

            <!-- Starting Price -->
            <td class="px-6 py-4 font-serif font-bold text-sm text-[#3B2F2F] dark:text-[#F4F1ED]">
              {{ c.price ? '₹' + c.price : 'Bespoke' }}
            </td>

            <!-- Availability Window -->
            <td class="px-6 py-4">
              <span *ngIf="c.from_date || c.to_date" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold border"
                    [ngClass]="isCategoryDateActive(c) ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'">
                <i class="fa-regular fa-calendar-days text-[10px]"></i>
                <span>{{ formatCategoryDateRange(c.from_date, c.to_date) }}</span>
              </span>
              <span *ngIf="!c.from_date && !c.to_date" class="text-xs text-[#A89F91]">
                Year-round
              </span>
            </td>

            <!-- Status Toggle -->
            <td class="px-6 py-4">
              <button type="button" (click)="toggleActive(c, $event)"
                      [class]="c.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100' : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/40 text-stone-500 hover:bg-stone-100'"
                      class="px-2.5 py-1 border rounded-lg text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Click to toggle store visibility">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="c.is_active ? 'bg-emerald-500' : 'bg-stone-400'"></span>
                <span>{{ c.is_active ? 'ACTIVE' : 'DRAFT' }}</span>
              </button>
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <a [routerLink]="['/admin/categories/edit', c.id]" class="p-2 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] dark:hover:text-[#DD8776] hover:bg-[#F3E7DC] dark:hover:bg-white/10 rounded-xl transition-all" title="Edit Category Screen">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </a>
              </div>
            </td>

          </tr>
        </app-table>
      </app-card>

    </div>
  `
})
export class AdminCategoriesPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);
  public router = inject(Router);

  categories: any[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';

  columns: TableColumn[] = [
    { label: 'Collection / Occasion', width: '38%' },
    { label: 'Starting Price', width: '16%' },
    { label: 'Active Window', width: '22%' },
    { label: 'Status', width: '12%' },
    { label: 'Actions', width: '12%', align: 'right' }
  ];

  formatCategoryDateRange(from: string | null, to: string | null): string {
    if (!from && !to) return 'Year-round';
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    if (from && to) {
      const f = new Date(from).toLocaleDateString('en-IN', opts);
      const t = new Date(to).toLocaleDateString('en-IN', opts);
      return `${f} to ${t}`;
    }
    if (from) return `From ${new Date(from).toLocaleDateString('en-IN', opts)}`;
    return `Until ${new Date(to!).toLocaleDateString('en-IN', opts)}`;
  }

  isCategoryDateActive(c: any): boolean {
    if (!c?.from_date && !c?.to_date) return true;
    const now = new Date().toISOString().split('T')[0];
    if (c.from_date && now < c.from_date) return false;
    if (c.to_date && now > c.to_date) return false;
    return true;
  }

  get activeCategoriesCount(): number {
    return this.categories.filter(c => c.is_active).length;
  }

  get minCategoryPrice(): number {
    const prices = this.categories.map(c => Number(c.price)).filter(p => !isNaN(p) && p > 0);
    return prices.length > 0 ? Math.min(...prices) : 99;
  }

  get filteredCategories() {
    if (!this.searchQuery) return this.categories;
    const q = this.searchQuery.toLowerCase();
    return this.categories.filter(c => (c.name && c.name.toLowerCase().includes(q)) || (c.description && c.description.toLowerCase().includes(q)));
  }

  ngOnInit() {
    this.fetchCategories();
  }

  async fetchCategories() {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .order('creation_date', { ascending: false });

      if (error) {
        this.error = error.message;
        this.categories = [];
      } else if (data) {
        this.categories = data;
        this.error = null;
      }
    } catch (err: any) {
      this.error = err?.message || 'Failed to connect to database.';
      this.categories = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async toggleActive(category: any, event: Event) {
    event.stopPropagation();
    const newStatus = !category.is_active;
    category.is_active = newStatus;
    this.cdr.markForCheck();

    try {
      const { error } = await this.supabase
        .from('categories')
        .update({ is_active: newStatus })
        .eq('id', category.id);

      if (error) {
        category.is_active = !newStatus;
        this.cdr.markForCheck();
      }
    } catch {
      category.is_active = !newStatus;
      this.cdr.markForCheck();
    }
  }
}
