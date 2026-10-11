import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-my-orders-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-24">
        
        <!-- Header -->
        <div class="bg-gradient-to-b from-[#F3E7DC]/60 to-transparent dark:from-white/5 py-8 md:py-12 border-b border-[#EADFD2]/60 dark:border-white/10">
          <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
            <h1 class="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
              My Orders &amp; Delivery Tracking
            </h1>
            <p class="mt-2 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393]">
              Track your placed gift hampers, packaging progress, and fulfillment history.
            </p>
          </div>
        </div>

        <main class="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-4xl">
          
          <!-- EMPTY STATE -->
          <div *ngIf="orders.length === 0" class="py-20 text-center bg-white dark:bg-[#1E1916] rounded-3xl border border-dashed border-[#EADFD2] dark:border-white/10 p-8 max-w-lg mx-auto shadow-xs">
            <div class="w-16 h-16 rounded-3xl bg-[#FAF7F2] dark:bg-white/5 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-3xl mx-auto">
              <i class="fa-solid fa-box-open"></i>
            </div>
            <h2 class="mt-4 font-serif text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
              No Orders Found Yet
            </h2>
            <p class="mt-2 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] max-w-sm mx-auto">
              You haven't placed any orders yet. Discover our artisanal hampers and gifts!
            </p>
            <a 
              routerLink="/shop" 
              class="mt-6 inline-block px-7 py-3 rounded-full bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold uppercase tracking-wider shadow-md transition"
            >
              Start Shopping Now
            </a>
          </div>

          <!-- ORDERS LIST -->
          <div *ngIf="orders.length > 0" class="space-y-5">
            <div 
              *ngFor="let order of orders" 
              class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 sm:p-7 shadow-xs space-y-4"
            >
              
              <!-- Order Header Row -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EADFD2]/60 dark:border-white/10">
                <div>
                  <div class="flex items-center gap-2.5">
                    <span class="font-mono font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">
                      #{{ order.orderNo }}
                    </span>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      {{ order.status || 'Confirmed' }}
                    </span>
                  </div>
                  <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393] mt-1">
                    Placed on {{ order.date | date:'mediumDate' }}
                  </p>
                </div>

                <div class="flex items-center gap-3">
                  <a 
                    [href]="getTrackingUrl(order.orderNo)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <i class="fa-brands fa-whatsapp text-sm"></i>
                    <span>Track on WhatsApp</span>
                  </a>
                </div>
              </div>

              <!-- Order Info Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div class="p-3 bg-[#FAF7F2] dark:bg-[#251F1C] rounded-xl border border-[#EADFD2]/60 dark:border-white/10">
                  <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Delivery To:</span>
                  <p class="font-bold text-[#2E2825] dark:text-[#F4F1ED] mt-0.5">{{ order.customerName }}</p>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] line-clamp-2 mt-0.5">{{ order.address }}</p>
                </div>

                <div class="p-3 bg-[#FAF7F2] dark:bg-[#251F1C] rounded-xl border border-[#EADFD2]/60 dark:border-white/10">
                  <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Payment Mode:</span>
                  <p class="font-bold text-[#2E2825] dark:text-[#F4F1ED] mt-0.5">{{ order.paymentMode }}</p>
                  <p class="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">Verified Online Dispatch</p>
                </div>

                <div class="p-3 bg-[#FAF7F2] dark:bg-[#251F1C] rounded-xl border border-[#EADFD2]/60 dark:border-white/10">
                  <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Total Amount:</span>
                  <p class="font-serif font-bold text-lg text-[#9C4738] dark:text-[#EB9D8E] mt-0.5">₹{{ order.total }}</p>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">{{ order.items?.length || 1 }} hamper item(s)</p>
                </div>
              </div>

              <!-- Items Breakdown -->
              <div *ngIf="order.items && order.items.length > 0" class="pt-2">
                <span class="text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] block mb-2">Package Items:</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div *ngFor="let itm of order.items" class="p-2.5 rounded-xl bg-white dark:bg-[#1E1916] border border-[#EADFD2]/60 dark:border-white/10 flex items-center gap-3">
                    <img [src]="itm.image || 'assets/banners/banner.png'" [alt]="itm.title" class="w-10 h-10 rounded-lg object-cover bg-stone-100 border shrink-0" />
                    <div class="min-w-0 flex-1">
                      <p class="text-xs font-bold text-[#2E2825] dark:text-[#F4F1ED] truncate">{{ itm.title }}</p>
                      <span class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393]">Qty: {{ itm.quantity }} &bull; ₹{{ itm.price }}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </main>

      </div>
    </app-site-layout>
  `
})
export class MyOrdersPageComponent implements OnInit {
  private readonly localStorage = inject(LocalStorageService);
  private readonly supabase = inject(SupabaseService);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);

  orders: any[] = [];

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'My Orders — RMS Gift Hampers',
      description: 'View your order history and track dispatch status.',
      keywords: 'my orders, order tracking, rms creations orders',
      slug: 'my-orders'
    });

    this.loadOrders();
  }

  loadOrders() {
    const local = this.localStorage.getItem<any[]>('rms_my_orders') || [];
    this.orders = local;
    this.cdr.markForCheck();
  }

  getTrackingUrl(orderNo: string): string {
    const text = encodeURIComponent(`Hello RMS Support! Please provide the latest tracking status for my order #${orderNo}.`);
    return `https://wa.me/919284905118?text=${text}`;
  }
}
