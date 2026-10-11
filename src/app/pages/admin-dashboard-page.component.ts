import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { TableComponent, TableColumn } from '../shared/ui/table.component';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TableComponent],
  styles: [`
    @keyframes bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    .bar-animate { transform-origin: bottom; animation: bar-grow 0.6s cubic-bezier(.4,0,.2,1) forwards; }
    @keyframes fade-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fade-up 0.4s ease forwards; }
    .fade-up-1 { animation-delay: .04s; }
    .fade-up-2 { animation-delay: .08s; }
    .fade-up-3 { animation-delay: .12s; }
    .fade-up-4 { animation-delay: .16s; }
  `],
  template: `
<div class="space-y-6">

  <!-- ── PAGE HEADER & CONTROLS ── -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-up">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393]">Store Overview</span>
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">Admin Dashboard</h1>
      <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">Quick summary of products, sales, and customer orders.</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-2.5 flex-wrap">
      <!-- Live Sync Refresh Button -->
      <button (click)="fetchDashboardStats()"
              [disabled]="isLoading"
              class="inline-flex items-center gap-2 bg-white dark:bg-[#2E2825] text-[#4A3C31] dark:text-[#F4F1ED]
                     border border-[#EADFD2] dark:border-white/10 hover:border-[#C56D5B] dark:hover:border-[#DD8776]
                     rounded-2xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all duration-200 disabled:opacity-60">
        <svg class="w-4 h-4 text-[#8B6E57] dark:text-[#DD8776]" [class.animate-spin]="isLoading" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span>{{ isLoading ? 'Refreshing...' : 'Refresh' }}</span>
      </button>

      <!-- New Product Quick Action -->
      <a routerLink="/admin/products/new"
         class="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#C56D5B] to-[#9C4738] text-white
                rounded-2xl px-4 py-2 text-xs font-semibold hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
        <span>Add Product</span>
      </a>
    </div>
  </div>

  <!-- ── METRICS STATS CARDS ── -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

    <!-- Card 1: Total Products -->
    <div class="fade-up fade-up-1 group bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10
                rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-[#C5A393] dark:hover:border-white/20 transition-all duration-300">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 bg-[#F4EDE6] dark:bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-5 h-5 text-[#8B6E57] dark:text-[#DD8776]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
          Catalog
        </span>
      </div>
      <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393] mb-1">Total Products</p>
      <p class="text-3xl font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">{{ totalProducts }}</p>
      <div class="mt-3 flex items-end gap-1 h-8">
        <div *ngFor="let h of [35,55,45,75,60,85,70]" [style.height.%]="h"
             class="flex-1 bg-[#EADFD2] dark:bg-white/10 group-hover:bg-[#C56D5B] dark:group-hover:bg-[#DD8776] rounded-sm transition-colors duration-300 bar-animate"></div>
      </div>
    </div>

    <!-- Card 2: Total Order Revenue -->
    <div class="fade-up fade-up-2 group bg-gradient-to-br from-[#2E2825] to-[#453730] dark:from-[#251F1C] dark:to-[#1A1614]
                border border-[#57251C]/40 dark:border-white/10 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-5 h-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
          Orders Value
        </span>
      </div>
      <p class="text-[10px] font-bold uppercase tracking-widest text-[#F4F1ED]/70 mb-1">Total Sales</p>
      <p class="text-3xl font-bold font-serif text-[#F4F1ED]">&#8377;{{ totalRevenue | number }}</p>
      <div class="mt-3 flex items-end gap-1 h-8">
        <div *ngFor="let h of [25,50,40,65,55,80,90]" [style.height.%]="h"
             class="flex-1 bg-white/20 group-hover:bg-amber-400/40 rounded-sm transition-colors duration-300 bar-animate"></div>
      </div>
    </div>

    <!-- Card 3: Categories & Collections -->
    <div class="fade-up fade-up-3 group bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10
                rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-[#C5A393] dark:hover:border-white/20 transition-all duration-300">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 bg-[#F4EDE6] dark:bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-5 h-5 text-[#8B6E57] dark:text-[#DD8776]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
        </div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-[#8B6E57] dark:text-[#DD8776] bg-[#F4EDE6] dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 px-2 py-0.5 rounded-full">
          {{ totalCategories }} Groups
        </span>
      </div>
      <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393] mb-1">Categories & Collections</p>
      <p class="text-3xl font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">{{ totalCategories }}</p>
      <div class="mt-3 flex items-end gap-1 h-8">
        <div *ngFor="let h of [65,45,75,35,85,60,50]" [style.height.%]="h"
             class="flex-1 bg-[#EADFD2] dark:bg-white/10 group-hover:bg-[#C56D5B] dark:group-hover:bg-[#DD8776] rounded-sm transition-colors duration-300 bar-animate"></div>
      </div>
    </div>

    <!-- Card 4: Orders Inquiries -->
    <div class="fade-up fade-up-4 group bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10
                rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-amber-200 dark:hover:border-amber-500/30 transition-all duration-300">
      <div class="flex items-start justify-between mb-3">
        <div class="w-10 h-10 bg-amber-50 dark:bg-amber-950/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <span class="text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
          Live
        </span>
      </div>
      <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393] mb-1">Total Orders</p>
      <p class="text-3xl font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">{{ totalOrders }}</p>
      <div class="mt-3 flex items-end gap-1 h-8">
        <div *ngFor="let h of [85,65,95,45,80,60,40]" [style.height.%]="h"
             class="flex-1 bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-300 dark:group-hover:bg-amber-500/50 rounded-sm transition-colors duration-300 bar-animate"></div>
      </div>
    </div>

  </div>

  <!-- ── CHARTS ROW ── -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

    <!-- Bar Chart: Weekly Orders Activity -->
    <div class="fade-up lg:col-span-2 bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393] mb-1">Weekly Activity</p>
          <h2 class="text-base sm:text-lg font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">Visits &amp; Orders</h2>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-1.5 text-[10px] font-semibold text-[#7A6C5E] dark:text-[#C5A393]">
            <span class="w-3 h-2 rounded-sm bg-[#C56D5B] inline-block"></span>Orders
          </div>
          <div class="flex items-center gap-1.5 text-[10px] font-semibold text-[#7A6C5E] dark:text-[#C5A393]">
            <span class="w-3 h-2 rounded-sm bg-[#EADFD2] dark:bg-white/20 inline-block"></span>Store Visits
          </div>
          <span class="text-[9px] font-bold text-[#8B6E57] dark:text-[#C5A393] bg-[#F4EDE6] dark:bg-white/10 border border-[#EADFD2] dark:border-white/10 px-2.5 py-1 rounded-full">
            Recent 7 Days
          </span>
        </div>
      </div>

      <!-- Bars Visualization -->
      <div class="relative h-52 pl-6">
        <div class="absolute left-0 top-0 bottom-4 flex flex-col justify-between text-[8px] font-semibold text-[#A89F91] dark:text-[#8B6E57] w-6">
          <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
        </div>
        <div class="h-full flex items-end gap-2 border-b border-l border-[#EADFD2] dark:border-white/10 pb-4">
          <div *ngFor="let day of chartData" class="flex-1 flex items-end gap-1 h-full group/bar">
            <div [style.height.%]="day.visits"
                 title="Visits: {{ day.visits }}"
                 class="flex-1 bg-[#EADFD2] dark:bg-white/15 group-hover/bar:bg-[#C5A393] dark:group-hover/bar:bg-white/30 rounded-t-md transition-all duration-300 bar-animate"></div>
            <div [style.height.%]="day.orders"
                 title="Orders: {{ day.orders }}"
                 class="flex-1 bg-[#C56D5B] group-hover/bar:bg-[#9C4738] rounded-t-md transition-all duration-300 bar-animate"></div>
          </div>
        </div>
      </div>
      <div class="pl-6 flex gap-2 mt-2">
        <div *ngFor="let day of chartData" class="flex-1 text-center text-[9px] font-bold text-[#A89F91] dark:text-[#8B6E57] uppercase">
          {{ day.label }}
        </div>
      </div>
    </div>

    <!-- Donut Chart: Live Status Distribution -->
    <div class="fade-up bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div class="mb-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393] mb-1">Status</p>
          <h2 class="text-base sm:text-lg font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">Order Breakdown</h2>
        </div>

        <div class="flex items-center justify-center py-4">
          <div class="relative w-36 h-36">
            <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
              <!-- Background ring -->
              <circle cx="18" cy="18" r="15.9" fill="none"
                      class="stroke-[#F4EDE6] dark:stroke-white/10" stroke-width="3.5"/>
              <!-- Completed slice -->
              <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#10b981" stroke-width="3.5"
                      [attr.stroke-dasharray]="completedPct + ' ' + (100 - completedPct)"
                      stroke-linecap="round"/>
              <!-- Pending slice -->
              <circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#f59e0b" stroke-width="3.5"
                      [attr.stroke-dasharray]="pendingPct + ' ' + (100 - pendingPct)"
                      [attr.stroke-dashoffset]="'-' + completedPct"
                      stroke-linecap="round"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-2xl font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED] leading-none">{{ totalOrders }}</span>
              <span class="text-[8px] text-[#8B6E57] dark:text-[#C5A393] font-semibold uppercase tracking-wider mt-1">Orders</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Breakdown Legend -->
      <div class="space-y-2 pt-2 border-t border-[#F4EDE6] dark:border-white/10">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span class="text-[#4A3C31] dark:text-[#F4F1ED]">Completed</span>
          </div>
          <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ completedCount }} ({{ completedPct }}%)</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
            <span class="text-[#4A3C31] dark:text-[#F4F1ED]">Pending</span>
          </div>
          <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ pendingCount }} ({{ pendingPct }}%)</span>
        </div>
      </div>
    </div>
  </div>

  <!-- ── BOTTOM ROW: RECENT ORDERS & QUICK SHORTCUTS ── -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

    <!-- Recent Orders Table -->
    <div class="fade-up lg:col-span-2 bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393] mb-1">Recent Activity</p>
          <h2 class="text-base sm:text-lg font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">Live Customer Orders</h2>
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-1.5 bg-[#FAF7F5] dark:bg-white/5 p-1 rounded-2xl border border-[#EADFD2]/60 dark:border-white/10">
          <button (click)="filterStatus = 'all'"
                  [class]="filterStatus === 'all' ? 'bg-white dark:bg-[#2E2825] text-[#2E2825] dark:text-[#F4F1ED] shadow-sm' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                  class="px-2.5 py-1 text-[10px] font-bold rounded-xl transition-all">All ({{ recentOrders.length }})</button>
          <button (click)="filterStatus = 'pending'"
                  [class]="filterStatus === 'pending' ? 'bg-white dark:bg-[#2E2825] text-amber-600 dark:text-amber-400 shadow-sm' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                  class="px-2.5 py-1 text-[10px] font-bold rounded-xl transition-all">Pending ({{ pendingCount }})</button>
          <button (click)="filterStatus = 'completed'"
                  [class]="filterStatus === 'completed' ? 'bg-white dark:bg-[#2E2825] text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-[#7A6C5E] dark:text-[#C5A393]'"
                  class="px-2.5 py-1 text-[10px] font-bold rounded-xl transition-all">Completed ({{ completedCount }})</button>
        </div>
      </div>

      <!-- Orders Table -->
      <app-table
        [columns]="orderColumns"
        [loading]="isLoading"
        [isEmpty]="filteredOrders.length === 0"
        [emptyIcon]="filterStatus !== 'all' ? 'search' : 'cart'"
        [emptyTitle]="filterStatus !== 'all' ? 'No matching orders' : 'No orders yet'"
        [emptyDescription]="filterStatus !== 'all' ? 'No orders match this status filter.' : 'Customer orders will appear here.'"
        [emptyActionText]="filterStatus !== 'all' ? 'Show All Orders' : undefined"
        [emptyActionIcon]="'refresh'"
        (emptyActionClick)="filterStatus = 'all'"
        customWrapperClass="-mx-5 sm:mx-0"
        minWidth="520px"
      >
        <tr *ngFor="let order of filteredOrders"
            class="border-b border-[#F4EDE6]/70 dark:border-white/5 hover:bg-[#FDFBF7] dark:hover:bg-white/5 transition-colors">
          <td class="py-3 px-6 text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ order.id }}</td>
          <td class="py-3 px-6">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-xl bg-[#F4EDE6] dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-[#8B6E57] dark:text-[#DD8776] shrink-0">
                {{ order.initials }}
              </div>
              <div>
                <span class="text-xs font-medium text-[#4A3C31] dark:text-[#F4F1ED] block leading-tight">{{ order.customer }}</span>
                <span class="text-[9px] text-[#8B6E57] dark:text-[#C5A393]">{{ order.date }}</span>
              </div>
            </div>
          </td>
          <td class="py-3 px-6 text-xs font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">&#8377;{{ order.amount }}</td>
          <td class="py-3 px-6">
            <span [class]="order.status === 'Completed'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'"
              class="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {{ order.status }}
            </span>
          </td>
          <td class="py-3 px-6 text-right">
            <a routerLink="/admin/orders"
               class="text-[10px] font-bold text-[#C56D5B] dark:text-[#DD8776] hover:underline">
              View &rarr;
            </a>
          </td>
        </tr>
      </app-table>

      <div class="mt-4 pt-3 border-t border-[#F4EDE6] dark:border-white/10 flex justify-end">
        <a routerLink="/admin/orders"
           class="text-xs font-bold text-[#C56D5B] dark:text-[#DD8776] hover:text-[#9C4738] dark:hover:text-white flex items-center gap-1 transition-colors">
          Manage All Orders &rarr;
        </a>
      </div>
    </div>

    <!-- Quick Shortcuts & Catalog Spotlight -->
    <div class="fade-up bg-white dark:bg-[#2E2825] border border-[#EADFD2] dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div class="mb-4">
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393] mb-1">Catalog</p>
          <h2 class="text-base sm:text-lg font-bold font-serif text-[#2E2825] dark:text-[#F4F1ED]">Quick Actions</h2>
        </div>

        <!-- 4 Quick Shortcut Tiles -->
        <div class="grid grid-cols-2 gap-2.5 mb-5">
          <a routerLink="/admin/products"
             class="p-3 rounded-2xl bg-[#FAF7F5] dark:bg-white/5 border border-[#EADFD2]/60 dark:border-white/10 hover:border-[#C56D5B] dark:hover:border-[#DD8776] transition-all group">
            <div class="w-8 h-8 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-gift"></i>
            </div>
            <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">Products</p>
            <p class="text-[9px] text-[#8B6E57] dark:text-[#C5A393]">Manage list</p>
          </a>

          <a routerLink="/admin/items"
             class="p-3 rounded-2xl bg-[#FAF7F5] dark:bg-white/5 border border-[#EADFD2]/60 dark:border-white/10 hover:border-[#C56D5B] dark:hover:border-[#DD8776] transition-all group">
            <div class="w-8 h-8 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-boxes-stacked"></i>
            </div>
            <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">Hamper Items</p>
            <p class="text-[9px] text-[#8B6E57] dark:text-[#C5A393]">Inclusions</p>
          </a>

          <a routerLink="/admin/categories"
             class="p-3 rounded-2xl bg-[#FAF7F5] dark:bg-white/5 border border-[#EADFD2]/60 dark:border-white/10 hover:border-[#C56D5B] dark:hover:border-[#DD8776] transition-all group">
            <div class="w-8 h-8 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-tags"></i>
            </div>
            <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">Categories</p>
            <p class="text-[9px] text-[#8B6E57] dark:text-[#C5A393]">Occasions</p>
          </a>

          <a routerLink="/admin/settings"
             class="p-3 rounded-2xl bg-[#FAF7F5] dark:bg-white/5 border border-[#EADFD2]/60 dark:border-white/10 hover:border-[#C56D5B] dark:hover:border-[#DD8776] transition-all group">
            <div class="w-8 h-8 rounded-xl bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-sm mb-2 group-hover:scale-105 transition-transform">
              <i class="fa-solid fa-gear"></i>
            </div>
            <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED]">Settings</p>
            <p class="text-[9px] text-[#8B6E57] dark:text-[#C5A393]">App info</p>
          </a>
        </div>

        <!-- Catalog Highlights -->
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#8B6E57] dark:text-[#C5A393] mb-2.5">Featured Hampers</p>
          <div class="space-y-2">
            <div *ngIf="topProducts.length === 0" class="text-xs text-[#8B6E57] dark:text-[#C5A393] py-3 text-center border border-dashed border-[#EADFD2] dark:border-white/10 rounded-xl">
              No products in catalog yet.
            </div>
            <div *ngFor="let item of topProducts"
                 class="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF7F5] dark:hover:bg-white/5 transition-colors">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-7 h-7 rounded-lg bg-[#F3E7DC] dark:bg-white/10 text-[#9C4738] dark:text-[#DD8776] flex items-center justify-center text-xs shrink-0">
                  <i [class]="item.iconClass"></i>
                </div>
                <span class="text-xs font-medium text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ item.name }}</span>
              </div>
              <span class="text-[10px] font-bold text-[#8B6E57] dark:text-[#DD8776] shrink-0">&#8377;{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-[#F4EDE6] dark:border-white/10">
        <a href="/" target="_blank"
           class="w-full py-2.5 px-3 rounded-2xl bg-[#FAF7F5] dark:bg-white/5 border border-[#EADFD2]/60 dark:border-white/10
                  text-[#8B6E57] dark:text-[#DD8776] hover:bg-[#F3E7DC] dark:hover:bg-white/10 transition-colors
                  flex items-center justify-center gap-2 text-xs font-bold">
          <i class="fa-solid fa-store text-xs"></i>
          <span>Open Customer Website</span>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
      </div>
    </div>

  </div>
</div>
  `
})
export class AdminDashboardPageComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;
  totalProducts = 0;
  totalRevenue = 0;
  totalCategories = 0;
  totalOrders = 0;

  completedCount = 0;
  pendingCount = 0;
  completedPct = 0;
  pendingPct = 0;

  filterStatus: 'all' | 'pending' | 'completed' = 'all';

  chartData = [
    { label: 'Mon', orders: 35, visits: 60 },
    { label: 'Tue', orders: 55, visits: 80 },
    { label: 'Wed', orders: 40, visits: 65 },
    { label: 'Thu', orders: 75, visits: 90 },
    { label: 'Fri', orders: 60, visits: 85 },
    { label: 'Sat', orders: 85, visits: 100 },
    { label: 'Sun', orders: 65, visits: 75 },
  ];

  recentOrders: any[] = [];
  topProducts: any[] = [];

  orderColumns: TableColumn[] = [
    { label: 'Order #', width: '20%' },
    { label: 'Customer', width: '35%' },
    { label: 'Amount', width: '20%' },
    { label: 'Status', width: '15%' },
    { label: 'Action', width: '10%', align: 'right' }
  ];

  get filteredOrders() {
    if (this.filterStatus === 'pending') {
      return this.recentOrders.filter(o => o.status === 'Pending');
    }
    if (this.filterStatus === 'completed') {
      return this.recentOrders.filter(o => o.status === 'Completed');
    }
    return this.recentOrders;
  }

  ngOnInit() {
    this.fetchDashboardStats();
  }

  async fetchDashboardStats() {
    this.isLoading = true;
    try {
      const [pRes, oRes, cRes] = await Promise.all([
        this.supabase.from('products').select('*', { count: 'exact' }),
        this.supabase.from('purchase_order').select('*', { count: 'exact' }).order('creation_date', { ascending: false }),
        this.supabase.from('categories').select('*', { count: 'exact' })
      ]);

      this.totalProducts = pRes.count || (pRes.data ? pRes.data.length : 0);
      this.totalOrders = oRes.count || (oRes.data ? oRes.data.length : 0);
      this.totalCategories = cRes.count || (cRes.data ? cRes.data.length : 0);

      if (oRes.data) {
        this.totalRevenue = oRes.data.reduce((sum, ord) => sum + (Number(ord.payable_amount ?? ord.order_total) || 0), 0);

        this.completedCount = oRes.data.filter(o => o.is_active || o.purchase_order_status === 'confirmed' || o.purchase_order_status === 'delivered').length;
        this.pendingCount = oRes.data.length - this.completedCount;

        const total = oRes.data.length || 1;
        this.completedPct = Math.round((this.completedCount / total) * 100);
        this.pendingPct = 100 - this.completedPct;

        this.recentOrders = oRes.data.slice(0, 7).map(o => {
          const dt = o.purchase_order_date || o.creation_date ? new Date(o.purchase_order_date || o.creation_date) : new Date();
          const orderNum = o.purchase_order_no || o.order_no || 'ORD';
          const isDone = o.is_active || o.purchase_order_status === 'confirmed' || o.purchase_order_status === 'delivered';
          return {
            id: '#' + orderNum,
            customer: o.contact_no ? o.contact_no : (o.customer_id ? `Customer #${o.customer_id}` : (o.shipping_remark || 'Direct Web Order')),
            initials: orderNum.slice(-2).toUpperCase(),
            amount: Number(o.payable_amount ?? o.order_total ?? 0).toLocaleString('en-IN'),
            status: isDone ? (o.purchase_order_status ? o.purchase_order_status.toUpperCase() : 'Confirmed') : 'Pending',
            date: dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
          };
        });
      }

      if (pRes.data && pRes.data.length > 0) {
        this.topProducts = pRes.data.slice(0, 4).map((p, idx) => {
          const priceVal = parseInt(p.name?.match(/₹(\d+)/)?.[1] || '', 10);
          return {
            iconClass: ['fa-solid fa-gift', 'fa-solid fa-wand-magic-sparkles', 'fa-solid fa-cookie-bite', 'fa-solid fa-gem'][idx % 4],
            name: p.name,
            price: !isNaN(priceVal) ? priceVal.toLocaleString('en-IN') : 'Custom'
          };
        });
      } else {
        this.topProducts = [];
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }
}

