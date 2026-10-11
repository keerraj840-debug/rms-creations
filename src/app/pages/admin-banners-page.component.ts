import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export interface BannerItem {
  id?: number;
  name: string;
  image: string;
  navigate_to_url_on_click: string;
  is_active: boolean;
  from_date?: string | null;
  to_date?: string | null;
  creation_date?: string;
}

@Component({
  selector: 'app-admin-banners-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto pb-16 transition-colors duration-300">

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C56D5B]/15 text-[#9C4738] dark:text-[#EB9D8E] border border-[#C56D5B]/30">
              Homepage Showcase
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] tracking-tight mt-1">
            Banner Master Management
          </h1>
          <p class="text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
            Add, update, activate, and manage promotional hero slides displayed on the homepage.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <a 
            routerLink="/admin/banners/new"
            class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#DD8776] hover:from-[#883B2D] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <i class="fa-solid fa-plus text-xs"></i>
            <span>Add New Banner</span>
          </a>
        </div>
      </div>

      <!-- Quick KPI Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-images"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Total Banners</p>
            <p class="text-xl font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">{{ banners.length }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Active on Home</p>
            <p class="text-xl font-serif font-bold text-emerald-600 dark:text-emerald-400">{{ activeBannersCount }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-eye-slash"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Hidden / Draft</p>
            <p class="text-xl font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">{{ banners.length - activeBannersCount }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-link"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Click Target</p>
            <p class="text-xs font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">Instant Store Links</p>
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

      <!-- Main Banner Cards Grid -->
      <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-6 shadow-sm">
        
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-[#EADFD2]/60 dark:border-white/10">
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
              Active & Saved Promotional Banners
            </h2>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EADFD2]/60 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">
              {{ banners.length }}
            </span>
          </div>

          <div class="flex items-center gap-3">
            <button 
              type="button" 
              (click)="fetchBanners()" 
              [disabled]="loading"
              class="text-xs font-semibold text-[#9C4738] dark:text-[#EB9D8E] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-rotate-right" [ngClass]="{ 'animate-spin': loading }"></i>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="py-16 text-center">
          <div class="h-8 w-8 animate-spin rounded-full border-3 border-[#9C4738] border-t-transparent mx-auto"></div>
          <p class="mt-3 text-xs text-[#7A6C5E] dark:text-[#C5A393]">Loading store banners...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && banners.length === 0" class="py-16 text-center max-w-sm mx-auto">
          <div class="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl">
            <i class="fa-solid fa-images"></i>
          </div>
          <h3 class="font-serif text-lg font-bold text-[#3B2F2F] dark:text-[#F4F1ED] mt-3">No Banners Found</h3>
          <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1">
            Create promotional banners to highlight festival kits, discounts, and gift collections on the homepage.
          </p>
          <a 
            routerLink="/admin/banners/new" 
            class="inline-block mt-4 px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition cursor-pointer"
          >
            Add Your First Banner
          </a>
        </div>

        <!-- Banners List / Grid -->
        <div *ngIf="!loading && banners.length > 0" class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div 
            *ngFor="let banner of banners" 
            class="group relative flex flex-col rounded-2xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2]/60 dark:bg-[#1E1916] overflow-hidden shadow-sm hover:shadow-md transition duration-300"
          >
            <!-- Banner Image Preview -->
            <div class="relative aspect-[16/9] w-full overflow-hidden bg-black/5 dark:bg-white/5">
              <img 
                [src]="banner.image" 
                [alt]="banner.name" 
                (error)="onImageError($event)"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-102"
              />
              
              <!-- Status Badge -->
              <span 
                class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-sm"
                [ngClass]="banner.is_active ? 'bg-emerald-600/90 text-white' : 'bg-gray-600/90 text-white'"
              >
                {{ banner.is_active ? '● Live' : '○ Inactive' }}
              </span>

              <!-- ID Pill -->
              <span class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-md">
                #{{ banner.id }}
              </span>
            </div>

            <!-- Content Details -->
            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 class="font-serif font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED] line-clamp-1">
                  {{ banner.name }}
                </h3>
                
                <div class="mt-2 flex items-center gap-1.5 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                  <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-[#9C4738] dark:text-[#EB9D8E]"></i>
                  <span class="font-mono text-[11px] truncate">{{ banner.navigate_to_url_on_click || '/shop' }}</span>
                </div>
              </div>

              <!-- Action Controls -->
              <div class="pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 flex items-center justify-between gap-2">
                
                <!-- Visibility Toggle Button -->
                <button 
                  type="button" 
                  (click)="toggleBannerStatus(banner)" 
                  class="text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1.5"
                  [ngClass]="banner.is_active ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-400' : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-400'"
                  [title]="banner.is_active ? 'Hide from homepage' : 'Make live on homepage'"
                >
                  <i class="fa-solid" [ngClass]="banner.is_active ? 'fa-eye-slash' : 'fa-eye'"></i>
                  <span>{{ banner.is_active ? 'Deactivate' : 'Publish' }}</span>
                </button>

                <div class="flex items-center gap-1.5">
                  <a 
                    [routerLink]="['/admin/banners/edit', banner.id]"
                    class="p-2 rounded-lg bg-white dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#F4F1ED] hover:text-[#9C4738] hover:border-[#9C4738] transition cursor-pointer"
                    title="Edit Banner (Screen)"
                  >
                    <i class="fa-solid fa-pen-to-square text-xs"></i>
                  </a>

                  <button 
                    type="button" 
                    (click)="confirmDeleteBanner(banner)"
                    class="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition cursor-pointer"
                    title="Delete Banner"
                  >
                    <i class="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

      <!-- DELETE CONFIRMATION MODAL -->
      <div 
        *ngIf="bannerToDelete" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        (click)="bannerToDelete = null"
      >
        <div 
          class="w-full max-w-md rounded-3xl bg-white dark:bg-[#251F1C] p-6 shadow-2xl border border-rose-200 dark:border-rose-900/30 text-[#4A3C31] dark:text-[#F4F1ED]"
          (click)="$event.stopPropagation()"
        >
          <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center text-xl mb-4">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>

          <h3 class="font-serif text-lg font-bold text-[#2E2825] dark:text-[#F4F1ED]">
            Delete Promotional Banner?
          </h3>
          <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1.5 leading-relaxed">
            Are you sure you want to delete <strong class="text-rose-600">{{ bannerToDelete.name }}</strong>? This slide will be permanently removed from the database and homepage carousel.
          </p>

          <div class="mt-6 flex items-center justify-end gap-3">
            <button 
              type="button" 
              (click)="bannerToDelete = null"
              class="px-4 py-2.5 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs font-semibold text-[#4A3C31] dark:text-[#F4F1ED] hover:bg-[#FAF7F2] transition cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="button" 
              (click)="executeDeleteBanner()"
              [disabled]="deleting"
              class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <span *ngIf="deleting" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ deleting ? 'Deleting...' : 'Yes, Delete' }}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminBannersPageComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly cdr = inject(ChangeDetectorRef);

  banners: BannerItem[] = [];
  loading = false;
  deleting = false;

  successMessage = '';
  errorMessage = '';

  bannerToDelete: BannerItem | null = null;

  ngOnInit() {
    this.fetchBanners();
  }

  get activeBannersCount(): number {
    return this.banners.filter(b => b.is_active).length;
  }

  async fetchBanners() {
    try {
      this.loading = true;
      this.errorMessage = '';
      const { data, error } = await this.supabase
        .from('banner_images')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      this.banners = (data as BannerItem[]) || [];
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to fetch banner records from database.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async toggleBannerStatus(banner: BannerItem) {
    if (!banner.id) return;

    try {
      const nextStatus = !banner.is_active;
      const { error } = await this.supabase
        .from('banner_images')
        .update({ is_active: nextStatus, updation_date: new Date().toISOString() })
        .eq('id', banner.id);

      if (error) throw error;

      banner.is_active = nextStatus;
      this.successMessage = `Banner #${banner.id} is now ${nextStatus ? 'Live' : 'Hidden'}.`;
      this.cdr.markForCheck();
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to update banner status.';
      this.cdr.markForCheck();
    }
  }

  confirmDeleteBanner(banner: BannerItem) {
    this.bannerToDelete = banner;
  }

  async executeDeleteBanner() {
    if (!this.bannerToDelete?.id) return;

    try {
      this.deleting = true;
      const { error } = await this.supabase
        .from('banner_images')
        .delete()
        .eq('id', this.bannerToDelete.id);

      if (error) throw error;

      this.successMessage = `Banner "${this.bannerToDelete.name}" deleted successfully.`;
      this.bannerToDelete = null;
      await this.fetchBanners();
    } catch (err: any) {
      this.errorMessage = err?.message || 'Failed to delete banner.';
    } finally {
      this.deleting = false;
      this.cdr.markForCheck();
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/banners/banner.png';
  }
}
