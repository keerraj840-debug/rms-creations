import { Component, OnInit, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { CardComponent } from '../shared/ui/card.component';
import { ModalComponent } from '../shared/ui/modal.component';
import { InputComponent } from '../shared/ui/input.component';
import { TableComponent, TableColumn } from '../shared/ui/table.component';
import { CustomHamperService } from '../services/custom-hamper.service';

@Component({
  selector: 'app-admin-product-details-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardComponent, ModalComponent, InputComponent, TableComponent],
  template: `
    <div class="space-y-5  mx-auto pb-12 transition-colors duration-300">
      
      <!-- Header with Summary and Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-xl sm:text-2xl font-serif font-bold text-[#2E2825] dark:text-[#F4F1ED] tracking-tight">
              Hamper Items & Inclusions
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393]">
              {{ details.length }} items
            </span>
          </div>
          <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
            All individual items (sweets, dry fruits, pooja items, candles) used inside gift hampers.
          </p>
        </div>
        
        <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
          <!-- Bulk Paste Import Button (Great for adding 50-200 at once) -->
          <button type="button" (click)="openBulkModal()"
                  class="px-3.5 py-2 rounded-xl bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 text-[#4A3C31] dark:text-[#F4F1ED] text-xs font-bold shadow-2xs hover:border-[#9C4738] hover:bg-[#F3E7DC]/30 transition-all flex items-center gap-1.5">
            <i class="fa-solid fa-paste"></i>
            <span>Bulk Paste List</span>
          </button>

          <!-- Standard Add Item -->
          <a routerLink="/admin/items/new"
             class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add Item</span>
          </a>
        </div>
      </div>

      <!-- Quick KPI Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Total Items</p>
            <p class="text-lg font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">{{ details.length }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Active Items</p>
            <p class="text-lg font-serif font-bold text-emerald-600 dark:text-emerald-400">{{ activeDetailsCount }}</p>
          </div>
        </div>

        <div class="col-span-2 sm:col-span-1 bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm shrink-0">
            <i class="fa-solid fa-coins"></i>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">Average Item Price</p>
            <p class="text-lg font-serif font-bold text-[#3B2F2F] dark:text-[#F4F1ED]">₹{{ averageUnitCost }}</p>
          </div>
        </div>
      </div>

      <!-- BUILD HAMPER MARKUP CONFIG BAR -->
      <div class="bg-gradient-to-r from-amber-50 to-[#FAF7F2] dark:from-[#251F1C] dark:to-[#1E1916] border border-amber-200/80 dark:border-white/10 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-white/10 text-amber-700 dark:text-amber-300 flex items-center justify-center text-base shrink-0 mt-0.5">
            <i class="fa-solid fa-gift"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-xs sm:text-sm text-[#3B2F2F] dark:text-[#F4F1ED]">
                Build Hamper Item Markup (% + Fixed ₹)
              </h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                Live on Website
              </span>
            </div>
            <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
              Configurable extra amount added to each treat inside Build Hamper: 
              <span class="font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
                Customer Price = Base Cost + {{ hamperMarkupPercent }}% + ₹{{ hamperMarkupFixed }}
              </span>
            </p>
            <p *ngIf="markupSavedToast" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 animate-in fade-in">
              <i class="fa-solid fa-circle-check"></i> <span>{{ markupSavedToast }}</span>
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <div class="flex items-center gap-2">
            <!-- Percent markup input -->
            <div class="relative w-24">
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">%</span>
              <input type="number" [(ngModel)]="hamperMarkupPercent" min="0" step="1"
                     placeholder="0" title="Percentage markup"
                     class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-3 pr-7 py-1.5 text-xs font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]">
            </div>

            <span class="text-xs font-bold text-stone-400">+</span>

            <!-- Fixed markup input -->
            <div class="relative w-28">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-serif font-bold text-stone-500">₹</span>
              <input type="number" [(ngModel)]="hamperMarkupFixed" min="0" step="1"
                     placeholder="0" title="Fixed amount markup"
                     class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-7 pr-3 py-1.5 text-xs font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738]">
            </div>
          </div>

          <button type="button" (click)="saveHamperMarkup()" [disabled]="savingMarkup"
                  class="px-3.5 py-1.5 rounded-xl bg-[#57251C] hover:bg-[#3D1A13] text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <span *ngIf="savingMarkup" class="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ savingMarkup ? 'Saving...' : 'Save Markup' }}</span>
          </button>
        </div>
      </div>

      <!-- PINNED RAPID INLINE-ADD BAR -->
      <div class="bg-[#FAF7F2] dark:bg-[#251F1C] border-2 border-[#EADFD2] dark:border-white/10 rounded-2xl p-3.5 shadow-2xs space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] flex items-center gap-1.5">
            <i class="fa-solid fa-bolt text-[#9C4738] dark:text-[#DD8776]"></i>
            <span>Quick Add (Type name, price & press Enter)</span>
          </span>
          <span class="text-[11px] text-[#A89F91]">
            Press <strong class="text-[#9C4738] dark:text-[#DD8776]">↵ Enter</strong> to save & quickly type next item
          </span>
        </div>

        <form (ngSubmit)="saveQuickAdd()" class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <!-- Item Name -->
          <div class="flex-1 min-w-[200px]">
            <input type="text" #quickNameInput [(ngModel)]="quickItem.name" name="quick_name"
                   placeholder="Item Name (e.g. Brass Pooja Diya, Cashews 100g, Scented Candle)..."
                   class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none">
          </div>

          <!-- Unit Cost -->
          <div class="w-full sm:w-28 relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-serif font-bold text-[#7A6C5E] dark:text-[#C5A393]">₹</span>
            <input type="number" [(ngModel)]="quickItem.price" name="quick_price" placeholder="Cost"
                   class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm font-serif font-bold text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none">
          </div>

          <!-- Stock Quantity (Optional) -->
          <div class="w-full sm:w-28">
            <input type="number" [(ngModel)]="quickItem.stock_quantity" name="quick_stock" placeholder="Stock (opt)"
                   class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none"
                   title="Stock Quantity (Leave blank if unlimited)">
          </div>

          <!-- Notes / Description -->
          <div class="w-full sm:w-44">
            <input type="text" [(ngModel)]="quickItem.description" name="quick_desc" placeholder="Notes (Optional)..."
                   class="w-full bg-white dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738] outline-none">
          </div>

          <!-- Submit Button -->
          <button type="submit" [disabled]="savingQuick || !quickItem.name.trim()"
                  class="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 shrink-0 shadow-2xs">
            <span *ngIf="savingQuick" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span *ngIf="!savingQuick">+ Add</span>
            <kbd class="hidden sm:inline text-[9px] opacity-75 font-mono bg-white/20 px-1 py-0.2 rounded">↵</kbd>
          </button>
        </form>

        <!-- Dynamic Success Toast or Error -->
        <div *ngIf="quickAddedToast" class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
          <i class="fa-solid fa-circle-check"></i> <span>Added <strong>"{{ quickAddedToast }}"</strong>! Auto-focused for next component.</span>
        </div>
        <div *ngIf="quickAddError" class="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 animate-in fade-in">
          <i class="fa-solid fa-triangle-exclamation"></i> <span>{{ quickAddError }}</span>
        </div>
      </div>

      <!-- MAIN TABLE & SEARCH / FILTER CARD -->
      <app-card [hasFooter]="false">
        <div card-header class="w-full space-y-3">
          
          <!-- Top Row: Search + Status Tabs + Sort -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <!-- Search -->
            <div class="relative w-full sm:w-72">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6C5E] dark:text-[#C5A393]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="currentPage = 1" placeholder="Search components by name or notes..."
                     class="w-full bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9C4738]/20 text-xs text-[#4A3C31] dark:text-[#F4F1ED] placeholder-[#A89F91] transition-all">
            </div>

            <!-- Filter Tabs & Sorter -->
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Status Filter Chips -->
              <div class="flex items-center bg-[#FAF7F2] dark:bg-white/5 p-1 rounded-xl border border-[#EADFD2]/70 dark:border-white/10 text-xs">
                <button type="button" (click)="statusFilter = 'all'; currentPage = 1"
                        [class]="statusFilter === 'all' ? 'bg-white dark:bg-[#251F1C] text-[#4A3C31] dark:text-[#F4F1ED] font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                        class="px-2.5 py-1 rounded-lg transition-all">
                  All ({{ details.length }})
                </button>
                <button type="button" (click)="statusFilter = 'active'; currentPage = 1"
                        [class]="statusFilter === 'active' ? 'bg-white dark:bg-[#251F1C] text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                        class="px-2.5 py-1 rounded-lg transition-all">
                  Active ({{ activeDetailsCount }})
                </button>
                <button type="button" (click)="statusFilter = 'inactive'; currentPage = 1"
                        [class]="statusFilter === 'inactive' ? 'bg-white dark:bg-[#251F1C] text-stone-600 dark:text-stone-400 font-bold shadow-2xs' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                        class="px-2.5 py-1 rounded-lg transition-all">
                  Inactive ({{ details.length - activeDetailsCount }})
                </button>
              </div>

              <!-- Sort Dropdown -->
              <select [(ngModel)]="sortBy" (ngModelChange)="currentPage = 1"
                      class="px-3 py-1.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#251F1C] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                <option value="name">Sort: Name (A-Z)</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
                <option value="newest">Sort: Recently Added</option>
              </select>

              <!-- Page Size -->
              <select [(ngModel)]="pageSize" (ngModelChange)="currentPage = 1"
                      class="px-2.5 py-1.5 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-white dark:bg-[#251F1C] text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] outline-none">
                <option [ngValue]="25">25 / page</option>
                <option [ngValue]="50">50 / page</option>
                <option [ngValue]="100">100 / page</option>
                <option [ngValue]="-1">All</option>
              </select>
            </div>

          </div>

          <!-- Active filters counter -->
          <div *ngIf="searchQuery || statusFilter !== 'all'" class="flex items-center justify-between text-[11px] text-[#A89F91] pt-1 border-t border-[#EADFD2]/40 dark:border-white/5">
            <span>Showing {{ totalFilteredCount }} of {{ details.length }} components</span>
            <button type="button" (click)="searchQuery = ''; statusFilter = 'all'; currentPage = 1" class="text-[#9C4738] dark:text-[#DD8776] font-bold hover:underline">
              Reset Filters
            </button>
          </div>

        </div>

        <!-- High-Performance Table -->
        <app-table
          [columns]="columns"
          [loading]="loading"
          [error]="error"
          (retry)="fetchDetails()"
          [isEmpty]="filteredDetails.length === 0"
          [emptyIcon]="searchQuery ? 'search' : 'box'"
          [emptyTitle]="searchQuery ? 'No matching components' : 'No components created yet'"
          [emptyDescription]="searchQuery ? 'No items match your search. Try adjusting terms.' : 'Components are ingredients, treats, diyas, and craft items used inside hampers.'"
          [emptyActionText]="searchQuery ? 'Clear Search' : 'Add First Component'"
          [emptyActionIcon]="searchQuery ? 'refresh' : 'plus'"
          (emptyActionClick)="searchQuery ? (searchQuery = '') : openModal()"
        >
          <tr *ngFor="let d of paginatedDetails" class="hover:bg-[#FDFBF7] dark:hover:bg-white/5 transition-colors group">
            
            <!-- Component Name -->
            <td class="px-6 py-3.5">
              <a [routerLink]="['/admin/items/edit', d.id]" class="font-bold text-[#4A3C31] dark:text-[#F4F1ED] group-hover:text-[#9C4738] dark:group-hover:text-[#DD8776] transition-colors text-xs sm:text-sm text-left flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-box text-[#A89F91] text-xs"></i>
                <span>{{ d.name }}</span>
              </a>
            </td>

            <!-- Base Cost (₹) -->
            <td class="px-6 py-3.5">
              <span class="font-bold font-serif text-xs text-[#2E2825] dark:text-[#F4F1ED]">
                ₹{{ d.price || 0 }}
              </span>
            </td>

            <!-- Markup (% + ₹) -->
            <td class="px-6 py-3.5">
              <span class="text-xs font-mono font-medium text-amber-700 dark:text-amber-400">
                {{ getMarkupDisplay(d.price) }}
              </span>
            </td>

            <!-- Customer Hamper Price (₹) -->
            <td class="px-6 py-3.5">
              <span class="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[#57251C] dark:text-amber-200 font-bold font-mono text-xs border border-stone-200 dark:border-stone-700 inline-flex items-center gap-1">
                <span>₹{{ getCustomerPrice(d.price) }}</span>
              </span>
            </td>

            <!-- Stock Quantity Column -->
            <td class="px-6 py-3.5">
              <span *ngIf="d.stock_quantity !== null && d.stock_quantity !== undefined" 
                    [ngClass]="d.stock_quantity === 0 ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40' : (d.stock_quantity <= 5 ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40')"
                    class="px-2 py-0.5 rounded-md text-[10px] font-bold border inline-flex items-center gap-1 shadow-2xs">
                <i [class]="d.stock_quantity === 0 ? 'fa-solid fa-circle-xmark text-rose-500' : (d.stock_quantity <= 5 ? 'fa-solid fa-triangle-exclamation text-amber-500' : 'fa-solid fa-box text-emerald-600')"></i>
                <span>{{ d.stock_quantity }} pcs</span>
              </span>
              <span *ngIf="d.stock_quantity === null || d.stock_quantity === undefined" class="text-xs text-[#A89F91]">
                <i class="fa-solid fa-infinity text-xs mr-1 opacity-70"></i>Unlimited
              </span>
            </td>

            <!-- Instant Status Toggle -->
            <td class="px-6 py-3.5">
              <button type="button" (click)="toggleActive(d, $event)"
                      [class]="d.is_active ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100' : 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/40 text-stone-500 hover:bg-stone-100'"
                      class="px-2.5 py-1 border rounded-lg text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Click to toggle availability in hampers">
                <span class="w-1.5 h-1.5 rounded-full" [ngClass]="d.is_active ? 'bg-emerald-500' : 'bg-stone-400'"></span>
                <span>{{ d.is_active ? 'ACTIVE' : 'INACTIVE' }}</span>
              </button>
            </td>

            <!-- Actions: Edit & Delete -->
            <td class="px-6 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1">
                <a [routerLink]="['/admin/items/edit', d.id]" 
                   class="p-1.5 text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#9C4738] dark:hover:text-[#DD8776] hover:bg-[#F3E7DC] dark:hover:bg-white/10 rounded-lg transition-all cursor-pointer" 
                   title="Edit Component in Studio">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </a>
                <button type="button" (click)="confirmDelete(d, $event)" 
                        class="p-1.5 text-[#7A6C5E] dark:text-[#C5A393] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all" 
                        title="Delete Component">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </app-table>

        <!-- Pagination Controls (Keeps browsing fast when there are hundreds of items) -->
        <div *ngIf="totalPages > 1" class="px-6 py-3 border-t border-[#EADFD2]/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
          <div>
            Showing <strong class="text-[#4A3C31] dark:text-[#F4F1ED]">{{ ((currentPage - 1) * pageSize) + 1 }}</strong> to 
            <strong class="text-[#4A3C31] dark:text-[#F4F1ED]">{{ currentPage === totalPages ? totalFilteredCount : (currentPage * pageSize) }}</strong> 
            of <strong class="text-[#4A3C31] dark:text-[#F4F1ED]">{{ totalFilteredCount }}</strong> items
          </div>

          <div class="flex items-center gap-1.5">
            <button type="button" (click)="setPage(currentPage - 1)" [disabled]="currentPage === 1"
                    class="px-2.5 py-1 rounded-lg border border-[#EADFD2] dark:border-white/10 disabled:opacity-40 hover:bg-[#F3E7DC]/50 dark:hover:bg-white/5 transition-colors font-bold">
              ‹ Prev
            </button>

            <span class="px-3 py-1 font-bold text-[#4A3C31] dark:text-[#F4F1ED]">
              Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button type="button" (click)="setPage(currentPage + 1)" [disabled]="currentPage === totalPages"
                    class="px-2.5 py-1 rounded-lg border border-[#EADFD2] dark:border-white/10 disabled:opacity-40 hover:bg-[#F3E7DC]/50 dark:hover:bg-white/5 transition-colors font-bold">
              Next ›
            </button>
          </div>
        </div>

      </app-card>

      <!-- BULK PASTE IMPORT MODAL (Import dozens or hundreds of items with 1 click) -->
      <app-modal [isOpen]="showBulkModal" title="Bulk Import Components" size="lg" (onClose)="closeBulkModal()">
        <div class="space-y-3.5 py-1">
          <div class="p-3 bg-[#FAF7F2] dark:bg-white/5 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs text-[#7A6C5E] dark:text-[#C5A393] space-y-1.5">
            <div class="flex items-center justify-between">
              <p class="font-bold text-[#4A3C31] dark:text-[#F4F1ED]"><i class="fa-regular fa-lightbulb text-amber-500 mr-1"></i>How to paste items in bulk:</p>
              <button type="button" (click)="loadExampleBulk()" class="text-[11px] font-bold text-[#9C4738] dark:text-[#DD8776] hover:underline">
                Load Sample Data
              </button>
            </div>
            <p>Paste one item per line from <strong>Excel</strong>, <strong>Google Sheets</strong>, <strong>WhatsApp</strong>, or <strong>Notes</strong>. Supported format: <code>Name, Price, Stock (optional), Notes (optional)</code> or Tab/Comma/Hyphen separated:</p>
            <code class="block font-mono text-[11px] bg-white dark:bg-[#1C1917] p-2 rounded-lg border border-[#EADFD2] text-[#9C4738] dark:text-[#DD8776] leading-relaxed">
              Brass Pooja Diya, 45, 100, Handcrafted brass diya<br>
              Premium Cashews 100g, 120, 50, W240 grade<br>
              Ferrero Rocher 4pc, 199, 25, Packaged Box<br>
              Silk Ribbon Red, 15
            </code>
          </div>

          <div *ngIf="bulkImportError" class="p-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200">
            {{ bulkImportError }}
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5 text-xs">
              <label class="font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Paste Items Text:</label>
              <div class="flex items-center gap-2">
                <button type="button" (click)="pasteFromClipboard()" class="px-2.5 py-1 rounded-lg bg-[#FAF7F2] dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 hover:bg-[#F3E7DC]/40 text-[#4A3C31] dark:text-[#F4F1ED] font-bold text-[11px] flex items-center gap-1 transition-all">
                  <i class="fa-solid fa-paste mr-1 text-[10px]"></i><span>Paste from Clipboard</span>
                </button>
                <button *ngIf="bulkPasteText" type="button" (click)="bulkPasteText = ''" class="text-[11px] text-[#A89F91] hover:text-rose-500 font-bold">
                  Clear
                </button>
              </div>
            </div>
            <textarea [(ngModel)]="bulkPasteText" rows="6" placeholder="Paste lines here from Excel or text (Name, Price, Stock, Notes)..."
                      class="w-full bg-[#FDFBF7] dark:bg-[#1C1917] border border-[#EADFD2] dark:border-white/10 rounded-xl p-3 text-xs font-mono text-[#4A3C31] dark:text-[#F4F1ED] outline-none focus:ring-2 focus:ring-[#9C4738]/20 focus:border-[#9C4738]"></textarea>
            <div class="flex items-center justify-between mt-1 text-[11px]">
              <span class="text-[#A89F91]">Supports Tabs (Excel copy), Commas, Pipes (|), or Hyphens (-)</span>
              <span class="font-bold text-[#9C4738] dark:text-[#DD8776]" *ngIf="parsedBulkItems.length > 0">
                <i class="fa-solid fa-check mr-1"></i>{{ parsedBulkItems.length }} components recognized
              </span>
            </div>
          </div>

          <!-- Live Preview of Parsed Items -->
          <div *ngIf="parsedBulkItems.length > 0" class="space-y-1.5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-[#7A6C5E] dark:text-[#C5A393]">
              Preview (Showing up to 10 of {{ parsedBulkItems.length }} items):
            </span>
            <div class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 bg-[#FDFBF7] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 rounded-xl">
              <span *ngFor="let it of parsedBulkItems.slice(0, 10)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 shadow-2xs">
                <i class="fa-solid fa-box text-[10px] text-[#A89F91]"></i><span>{{ it.name }}</span>
                <span class="font-serif font-bold text-[#9C4738] dark:text-[#DD8776]">₹{{ it.price }}</span>
                <span *ngIf="it.stock_quantity !== null" class="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold border border-amber-200/50">
                  <i class="fa-solid fa-box text-[9px] mr-1"></i>{{ it.stock_quantity }}
                </span>
                <span *ngIf="it.description" class="text-[10px] text-[#A89F91] max-w-[100px] truncate" [title]="it.description">
                  ({{ it.description }})
                </span>
              </span>
              <span *ngIf="parsedBulkItems.length > 10" class="text-xs text-[#A89F91] self-center pl-1 font-bold">
                +{{ parsedBulkItems.length - 10 }} more...
              </span>
            </div>
          </div>
        </div>

        <div modal-footer class="w-full flex items-center justify-between gap-3">
          <button type="button" (click)="closeBulkModal()" class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] hover:text-[#4A3C31]">Cancel</button>
          <button type="button" (click)="importBulkItems()" [disabled]="importingBulk || parsedBulkItems.length === 0"
                  class="px-4.5 py-2 rounded-xl bg-gradient-to-r from-[#9C4738] to-[#BA5E4E] hover:from-[#883B2D] text-white text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-sm">
            <span *ngIf="importingBulk" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ importingBulk ? 'Importing...' : 'Import All ' + parsedBulkItems.length + ' Components' }}</span>
          </button>
        </div>
      </app-modal>

      <!-- STANDARD ADD / EDIT MODAL (With "Save & Add Another" mode) -->
      <app-modal [isOpen]="showModal" [title]="isEdit ? 'Edit Component Item' : 'Add New Component Item'" size="md" (onClose)="closeModal()">
        <form (ngSubmit)="saveItem(false)" class="space-y-4 py-2">
          
          <div *ngIf="modalError" class="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200">
            {{ modalError }}
          </div>

          <app-input label="Item Name *" type="text" [(ngModel)]="currentItem.name" name="name" [required]="true" placeholder="e.g. Pure Kapoor Aarti Tablets (Pack)"></app-input>
          
          <div class="grid grid-cols-2 gap-3">
            <app-input label="Unit Cost (₹)" type="number" [(ngModel)]="currentItem.price" name="price" placeholder="e.g. 25"></app-input>
            <app-input label="Stock Quantity (Optional)" type="number" [(ngModel)]="currentItem.stock_quantity" name="stock_quantity" placeholder="e.g. 100 (Blank = Unlimited)"></app-input>
          </div>
          
          <app-input label="Description / Vendor Notes" type="textarea" [(ngModel)]="currentItem.description" name="description" placeholder="Notes, brand, or packaging specifications..."></app-input>

          <div class="flex items-center gap-3 pt-2 border-t border-[#EADFD2] dark:border-white/10 mt-4">
            <input type="checkbox" id="item_is_active" name="is_active" [(ngModel)]="currentItem.is_active"
                   class="w-4 h-4 rounded text-[#9C4738] border-[#EADFD2] dark:border-white/20 focus:ring-[#9C4738] bg-white dark:bg-[#2E2825]">
            <label for="item_is_active" class="text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED]">Component is Active (Available for selection in hampers)</label>
          </div>

          <button type="submit" #submitBtn class="hidden"></button>
        </form>

        <div modal-footer class="w-full flex items-center justify-between gap-3">
          <button type="button" (click)="closeModal()" class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] hover:text-[#4A3C31]">Cancel</button>
          
          <div class="flex items-center gap-2">
            <!-- Save & Add Another Button -->
            <button *ngIf="!isEdit" type="button" (click)="saveItem(true)" [disabled]="saving || !currentItem.name?.trim()"
                    class="px-3.5 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 text-xs font-bold text-[#9C4738] dark:text-[#DD8776] hover:bg-[#F3E7DC]/30 transition-all disabled:opacity-40">
              Save & Add Another
            </button>
            
            <button type="button" (click)="saveItem(false)" [disabled]="saving || !currentItem.name?.trim()"
                    class="px-4 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold hover:bg-[#883B2D] transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-2xs">
              <span *ngIf="saving" class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ isEdit ? 'Update Component' : 'Add Component' }}</span>
            </button>
          </div>
        </div>
      </app-modal>

      <!-- DELETE CONFIRMATION MODAL -->
      <app-modal [isOpen]="showDeleteModal" title="Delete Item?" size="sm" (onClose)="showDeleteModal = false">
        <div class="space-y-3 py-2 text-xs text-[#7A6C5E] dark:text-[#C5A393]">
          <p>Are you sure you want to delete <strong class="text-[#4A3C31] dark:text-[#F4F1ED]">"{{ deleteTargetItem?.name }}"</strong>?</p>
          <p class="text-[11px] text-[#A89F91]">Existing hampers containing this item will keep it, but it will be hidden from new boxes.</p>
        </div>
        <div modal-footer class="w-full flex justify-end gap-2.5">
          <button type="button" (click)="showDeleteModal = false" class="px-3.5 py-2 text-xs font-bold text-[#7A6C5E] hover:text-[#4A3C31]">Cancel</button>
          <button type="button" (click)="executeDelete()" [disabled]="deleting"
                  class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all disabled:opacity-50">
            {{ deleting ? 'Deleting...' : 'Delete Item' }}
          </button>
        </div>
      </app-modal>

    </div>
  `
})
export class AdminProductDetailsPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private customHamperService = inject(CustomHamperService);
  private cdr = inject(ChangeDetectorRef);

  readonly Number = Number;
  hamperMarkupPercent = 0;
  hamperMarkupFixed = 0;
  hamperMarkup = 0;
  savingMarkup = false;
  markupSavedToast = '';

  getMarkupDisplay(price: any): string {
    const base = Number(price) || 0;
    const pct = Math.round((base * (this.hamperMarkupPercent || 0)) / 100);
    if (this.hamperMarkupPercent > 0 && this.hamperMarkupFixed > 0) {
      return `+${this.hamperMarkupPercent}% (₹${pct}) + ₹${this.hamperMarkupFixed}`;
    }
    if (this.hamperMarkupPercent > 0) {
      return `+${this.hamperMarkupPercent}% (+₹${pct})`;
    }
    return `+₹${this.hamperMarkupFixed}`;
  }

  getCustomerPrice(price: any): number {
    return this.customHamperService.calculateCustomerItemPrice(Number(price) || 0, {
      percent: this.hamperMarkupPercent,
      fixedAmount: this.hamperMarkupFixed
    });
  }

  @ViewChild('quickNameInput') quickNameInput?: ElementRef<HTMLInputElement>;

  details: any[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';

  // Inline Fast-Add State
  quickItem = {
    name: '',
    price: null as number | null,
    stock_quantity: null as number | null,
    description: ''
  };
  savingQuick = false;
  quickAddError = '';
  quickAddedToast = '';

  // Bulk Paste State
  showBulkModal = false;
  bulkPasteText = '';
  importingBulk = false;
  bulkImportError = '';

  // Modal State
  showModal = false;
  saving = false;
  isEdit = false;
  modalError = '';

  currentItem: any = {
    name: '',
    description: '',
    price: null,
    stock_quantity: null as number | null,
    is_active: true
  };

  // Delete State
  deleteTargetItem: any = null;
  showDeleteModal = false;
  deleting = false;

  // Pagination & Filtering
  pageSize = 50;
  currentPage = 1;
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sortBy: 'name' | 'price_asc' | 'price_desc' | 'newest' = 'name';

  columns: TableColumn[] = [
    { label: 'Component Name', width: '25%' },
    { label: 'Base Cost', width: '12%' },
    { label: 'Markup', width: '12%' },
    { label: 'Customer Hamper Price', width: '17%' },
    { label: 'Stock Qty', width: '12%' },
    { label: 'Status', width: '10%' },
    { label: 'Actions', width: '12%', align: 'right' }
  ];

  get activeDetailsCount(): number {
    return this.details.filter(d => d.is_active).length;
  }

  get averageUnitCost(): number {
    const valid = this.details.map(d => Number(d.price)).filter(p => !isNaN(p) && p > 0);
    if (valid.length === 0) return 0;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
  }

  get filteredDetails() {
    let list = this.details;

    if (this.statusFilter === 'active') {
      list = list.filter(d => d.is_active);
    } else if (this.statusFilter === 'inactive') {
      list = list.filter(d => !d.is_active);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(d =>
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.description && d.description.toLowerCase().includes(q))
      );
    }

    if (this.sortBy === 'name') {
      list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (this.sortBy === 'price_asc') {
      list = [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (this.sortBy === 'price_desc') {
      list = [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (this.sortBy === 'newest') {
      list = [...list].sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return list;
  }

  get totalFilteredCount(): number {
    return this.filteredDetails.length;
  }

  get totalPages(): number {
    if (this.pageSize === -1) return 1;
    return Math.ceil(this.totalFilteredCount / this.pageSize) || 1;
  }

  get paginatedDetails(): any[] {
    if (this.pageSize === -1) return this.filteredDetails;
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDetails.slice(start, start + this.pageSize);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.markForCheck();
    }
  }

  // Live Bulk Paste Parser
  get parsedBulkItems(): Array<{ name: string; price: number; stock_quantity: number | null; description: string }> {
    if (!this.bulkPasteText?.trim()) return [];
    const lines = this.bulkPasteText.split(/\r?\n/);
    const items: Array<{ name: string; price: number; stock_quantity: number | null; description: string }> = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      let parts: string[] = [];
      if (line.includes("\t")) {
        parts = line.split("\t").map(p => p.trim());
      } else if (line.includes("|")) {
        parts = line.split("|").map(p => p.trim());
      } else if (line.includes(";")) {
        parts = line.split(";").map(p => p.trim());
      } else if (line.includes(",")) {
        parts = line.split(",").map(p => p.trim());
      } else if (line.includes(" - ")) {
        parts = line.split(" - ").map(p => p.trim());
      } else {
        parts = [line];
      }

      const name = parts[0] || "";
      if (["name", "item name", "component", "component name", "item"].includes(name.toLowerCase())) {
        continue;
      }

      let price = 0;
      let stock_quantity: number | null = null;
      let description = "";

      if (parts.length > 1) {
        const rawPrice = parts[1].replace(/[^0-9.]/g, "");
        price = parseFloat(rawPrice) || 0;
      }

      if (parts.length === 3) {
        const rawThird = parts[2];
        const isNumeric = /^\s*\d+\s*(pcs|pc|units?|nos|box|boxes|pk|packs?)?\s*$/i.test(rawThird);
        if (isNumeric) {
          const num = parseInt(rawThird.replace(/[^0-9]/g, ""), 10);
          stock_quantity = isNaN(num) ? null : num;
        } else {
          description = rawThird;
        }
      } else if (parts.length >= 4) {
        const rawStock = parts[2];
        const isNumeric = /^\s*\d+\s*(pcs|pc|units?|nos|box|boxes|pk|packs?)?\s*$/i.test(rawStock);
        if (isNumeric) {
          const num = parseInt(rawStock.replace(/[^0-9]/g, ""), 10);
          stock_quantity = isNaN(num) ? null : num;
          description = parts.slice(3).join(", ");
        } else {
          description = parts.slice(2).join(", ");
        }
      }

      if (name) {
        items.push({ name, price, stock_quantity, description });
      }
    }
    return items;
  }

  async ngOnInit() {
    await Promise.all([
      this.loadHamperMarkup(),
      this.fetchDetails()
    ]);
  }

  async loadHamperMarkup() {
    try {
      const cfg = await this.customHamperService.getHamperMarkupConfig();
      this.hamperMarkupPercent = cfg.percent;
      this.hamperMarkupFixed = cfg.fixedAmount;
      this.hamperMarkup = cfg.fixedAmount;
    } catch {
      this.hamperMarkupPercent = 0;
      this.hamperMarkupFixed = 0;
      this.hamperMarkup = 0;
    } finally {
      this.cdr.markForCheck();
    }
  }

  async saveHamperMarkup() {
    this.savingMarkup = true;
    this.markupSavedToast = '';
    this.cdr.markForCheck();
    try {
      const res = await this.customHamperService.updateHamperMarkupConfig({
        percent: this.hamperMarkupPercent,
        fixedAmount: this.hamperMarkupFixed
      });
      if (res.success) {
        this.hamperMarkup = this.hamperMarkupFixed;
        this.markupSavedToast = `Hamper markup updated! Customer Price = Base Cost + ${this.hamperMarkupPercent}% + ₹${this.hamperMarkupFixed}`;
        setTimeout(() => {
          this.markupSavedToast = '';
          this.cdr.markForCheck();
        }, 4000);
      }
    } catch {
      // Error handled
    } finally {
      this.savingMarkup = false;
      this.cdr.markForCheck();
    }
  }

  async fetchDetails() {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    try {
      const { data, error } = await this.supabase.from('product_details').select('*').order('name');
      if (error) {
        this.error = error.message;
        this.details = [];
      } else {
        this.details = data || [];
        this.error = null;
      }
    } catch (err: any) {
      this.error = err?.message || 'Failed to connect to database.';
      this.details = [];
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  // 1. FAST INLINE ADD (Keyboard-friendly, auto-focuses next)
  async saveQuickAdd() {
    const name = this.quickItem.name.trim();
    if (!name) return;

    this.savingQuick = true;
    this.quickAddError = '';
    this.cdr.markForCheck();

    try {
      const payload: any = {
        name,
        price: this.quickItem.price != null && !isNaN(this.quickItem.price) ? Number(this.quickItem.price) : 0,
        stock_quantity: this.quickItem.stock_quantity != null && !isNaN(this.quickItem.stock_quantity) ? Number(this.quickItem.stock_quantity) : null,
        description: this.quickItem.description?.trim() || null,
        is_active: true
      };

      const { data, error } = await this.supabase.from('product_details').insert([payload]).select().single();
      if (error) {
        this.quickAddError = error.message;
      } else {
        if (data) {
          this.details.unshift(data);
        } else {
          await this.fetchDetails();
        }
        this.quickAddedToast = name;
        setTimeout(() => {
          if (this.quickAddedToast === name) {
            this.quickAddedToast = '';
            this.cdr.markForCheck();
          }
        }, 3000);

        this.quickItem = { name: '', price: null, stock_quantity: null, description: '' };
        setTimeout(() => this.quickNameInput?.nativeElement.focus(), 50);
      }
    } catch (err: any) {
      this.quickAddError = err?.message || 'Failed to save component';
    } finally {
      this.savingQuick = false;
      this.cdr.markForCheck();
    }
  }

  // 2. BULK IMPORT ACTIONS
  openBulkModal() {
    this.bulkPasteText = '';
    this.bulkImportError = '';
    this.showBulkModal = true;
    this.cdr.markForCheck();
  }

  closeBulkModal() {
    this.showBulkModal = false;
    this.bulkPasteText = '';
    this.cdr.markForCheck();
  }

  async pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        this.bulkPasteText = text;
        this.cdr.markForCheck();
      }
    } catch {
      // Direct paste fallback if permission blocked
    }
  }

  loadExampleBulk() {
    this.bulkPasteText = `Brass Pooja Diya\t45\t100\tHandcrafted brass diya
Premium Cashews 100g\t120\t50\tGoa W240 grade
Ferrero Rocher 4pc\t199\t25\tPackaged golden box
Silk Red Ribbon\t15\t\tSatin decorative roll
Silver Plated Coin\t85\t40\tLakshmi Ganesh coin`;
    this.cdr.markForCheck();
  }

  async importBulkItems() {
    const items = this.parsedBulkItems;
    if (items.length === 0) return;

    this.importingBulk = true;
    this.bulkImportError = '';
    this.cdr.markForCheck();

    try {
      const payloads = items.map(it => ({
        name: it.name,
        price: it.price,
        stock_quantity: it.stock_quantity != null ? it.stock_quantity : null,
        description: it.description || null,
        is_active: true
      }));

      const { data, error } = await this.supabase.from('product_details').insert(payloads).select();
      if (error) {
        this.bulkImportError = error.message;
      } else {
        this.closeBulkModal();
        await this.fetchDetails();
      }
    } catch (err: any) {
      this.bulkImportError = err?.message || 'Failed to import bulk items';
    } finally {
      this.importingBulk = false;
      this.cdr.markForCheck();
    }
  }

  // 3. TOGGLE ACTIVE
  async toggleActive(item: any, event: Event) {
    event.stopPropagation();
    const newStatus = !item.is_active;
    item.is_active = newStatus;
    this.cdr.markForCheck();

    try {
      const { error } = await this.supabase
        .from('product_details')
        .update({ is_active: newStatus })
        .eq('id', item.id);

      if (error) {
        item.is_active = !newStatus;
        this.cdr.markForCheck();
      }
    } catch {
      item.is_active = !newStatus;
      this.cdr.markForCheck();
    }
  }

  // 4. STANDARD MODAL ACTIONS
  openModal() {
    this.showModal = true;
    this.isEdit = false;
    this.modalError = '';
    this.currentItem = { name: '', description: '', price: null, is_active: true };
    this.cdr.markForCheck();
  }

  editItem(item: any) {
    this.showModal = true;
    this.isEdit = true;
    this.modalError = '';
    this.currentItem = { ...item };
    this.cdr.markForCheck();
  }

  closeModal() {
    this.showModal = false;
    this.cdr.markForCheck();
  }

  async saveItem(addAnother: boolean = false) {
    if (!this.currentItem.name?.trim()) return;
    this.saving = true;
    this.modalError = '';
    this.cdr.markForCheck();

    try {
      let error;
      if (this.isEdit) {
        const res = await this.supabase.from('product_details').update(this.currentItem).eq('id', this.currentItem.id);
        error = res.error;
      } else {
        const res = await this.supabase.from('product_details').insert([this.currentItem]).select().single();
        error = res.error;
        if (!error && res.data) {
          this.details.unshift(res.data);
        }
      }

      if (error) {
        this.modalError = error.message;
      } else {
        if (addAnother) {
          this.currentItem = { name: '', description: '', price: null, is_active: true };
          this.modalError = '';
        } else {
          this.closeModal();
          this.fetchDetails();
        }
      }
    } finally {
      this.saving = false;
      this.cdr.markForCheck();
    }
  }

  // 5. DELETE ACTIONS
  confirmDelete(item: any, event: Event) {
    event.stopPropagation();
    this.deleteTargetItem = item;
    this.showDeleteModal = true;
    this.cdr.markForCheck();
  }

  async executeDelete() {
    if (!this.deleteTargetItem) return;
    this.deleting = true;
    this.cdr.markForCheck();

    try {
      const { error } = await this.supabase.from('product_details').delete().eq('id', this.deleteTargetItem.id);
      if (!error) {
        this.details = this.details.filter(d => d.id !== this.deleteTargetItem.id);
        this.showDeleteModal = false;
        this.deleteTargetItem = null;
      }
    } finally {
      this.deleting = false;
      this.cdr.markForCheck();
    }
  }
}
