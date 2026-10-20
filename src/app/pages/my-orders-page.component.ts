import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';

export interface DisplayOrder {
  orderNo: string;
  date: string;
  status: string;
  rawStatus: string;
  statusDescription: string;
  badgeClass: string;
  customerName: string;
  address: string;
  paymentMode: string;
  total: number;
  trackingRemark?: string;
  expanded?: boolean;
  items: {
    title: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
}

type OrderFilter = 'all' | 'active' | 'delivered' | 'cancelled';

@Component({
  selector: 'app-my-orders-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 pb-20">
        
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          
          <!-- Sleek Compact Page Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#EADFD2]/70 dark:border-white/10">
            <div>
              <h1 class="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2E2825] dark:text-[#F4F1ED]">
                My Orders &amp; Delivery Tracking
              </h1>
              <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">
                Assembly progress, dispatch confirmation, and courier tracking in real-time
              </p>
            </div>
            <a routerLink="/shop" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] text-white text-xs font-bold transition shadow-2xs active:scale-95 shrink-0">
              <i class="fa-solid fa-gift text-xs"></i>
              <span>Shop More Gifts</span>
            </a>
          </div>

          <!-- TOOLBAR: FILTER TABS & SEARCH (FLUID) -->
          <div *ngIf="!isLoading && orders.length > 0" class="bg-white dark:bg-[#1E1916] rounded-2xl p-3.5 sm:p-4 border border-[#EADFD2] dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            
            <!-- Filter Pills -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                type="button"
                (click)="activeFilter = 'all'"
                [class]="activeFilter === 'all' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825] font-semibold'"
                class="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition"
              >
                All Orders ({{ orders.length }})
              </button>

              <button
                type="button"
                (click)="activeFilter = 'active'"
                [class]="activeFilter === 'active' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825] font-semibold'"
                class="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition"
              >
                In Progress ({{ activeOrdersCount }})
              </button>

              <button
                type="button"
                (click)="activeFilter = 'delivered'"
                [class]="activeFilter === 'delivered' ? 'bg-[#9C4738] text-white font-bold shadow-xs' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825] font-semibold'"
                class="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition"
              >
                Delivered ({{ deliveredOrdersCount }})
              </button>

              <button
                *ngIf="cancelledOrdersCount > 0"
                type="button"
                (click)="activeFilter = 'cancelled'"
                [class]="activeFilter === 'cancelled' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'bg-[#FAF7F2] dark:bg-[#251F1C] text-[#7A6C5E] dark:text-[#C5A393] hover:text-[#2E2825] font-semibold'"
                class="min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap cursor-pointer transition"
              >
                Cancelled ({{ cancelledOrdersCount }})
              </button>
            </div>

            <!-- Search Field -->
            <div class="relative w-full md:w-72">
              <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] dark:text-[#C5A393]"></i>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                placeholder="Search order number or product..."
                class="w-full pl-9 pr-8 py-2 rounded-xl border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-xs text-[#2E2825] dark:text-[#F4F1ED] outline-none focus:border-[#9C4738] transition"
              />
              <button *ngIf="searchQuery" (click)="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A6C5E] p-1">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

          </div>

          <!-- LOADING STATE -->
          <div *ngIf="isLoading" class="py-24 text-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#9C4738] border-t-transparent mx-auto"></div>
            <p class="mt-4 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393]">Checking order history...</p>
          </div>
          
          <!-- EMPTY STATE (NO ORDERS PLACED) -->
          <div *ngIf="!isLoading && orders.length === 0" class="py-20 text-center bg-white dark:bg-[#1E1916] rounded-3xl border border-dashed border-[#EADFD2] dark:border-white/10 p-8 max-w-lg mx-auto shadow-xs space-y-4">
            <div class="w-16 h-16 rounded-3xl bg-[#FAF7F2] dark:bg-white/5 text-[#9C4738] dark:text-[#EB9D8E] flex items-center justify-center text-3xl mx-auto">
              <i class="fa-solid fa-box-open"></i>
            </div>
            <h2 class="font-serif text-2xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
              No Orders Found Yet
            </h2>
            <p class="text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] max-w-sm mx-auto leading-relaxed">
              You haven't placed any orders yet. Discover our artisanal gift hampers, festive specials, and customized celebration boxes!
            </p>
            <div class="pt-2">
              <a 
                routerLink="/shop" 
                class="inline-block px-7 py-3 rounded-full bg-[#9C4738] hover:bg-[#883B2D] text-white text-xs font-bold uppercase tracking-wider shadow-md transition active:scale-95 cursor-pointer"
              >
                Browse Hampers Catalog &rarr;
              </a>
            </div>
          </div>

          <!-- FILTER EMPTY STATE -->
          <div *ngIf="!isLoading && orders.length > 0 && filteredOrders.length === 0" class="py-16 text-center bg-white dark:bg-[#1E1916] rounded-3xl border border-dashed border-[#EADFD2] dark:border-white/10 p-6 max-w-md mx-auto space-y-3">
            <i class="fa-solid fa-filter text-2xl text-stone-400"></i>
            <h3 class="font-serif font-bold text-base text-[#2E2825] dark:text-[#F4F1ED]">No orders match your filter</h3>
            <p class="text-xs text-[#7A6C5E] dark:text-[#C5A393]">Try clearing search keywords or selecting "All Orders".</p>
            <button
              type="button"
              (click)="activeFilter = 'all'; searchQuery = ''"
              class="px-5 py-2 rounded-xl bg-[#9C4738] text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <!-- ORDERS LIST (COMPACT, MODERN, ZERO EXCESSIVE SCROLLING) -->
          <div *ngIf="!isLoading && filteredOrders.length > 0" class="space-y-4">
            <div 
              *ngFor="let order of filteredOrders" 
              class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-5 sm:p-6 shadow-xs hover:border-[#9C4738]/40 transition space-y-4"
            >
              
              <!-- Top Row: Order Header + Actions -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#EADFD2]/60 dark:border-white/10">
                <div class="flex items-center gap-3 flex-wrap">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-mono font-bold text-sm sm:text-base text-[#2E2825] dark:text-[#F4F1ED]">
                        #{{ order.orderNo }}
                      </span>
                      <button 
                        type="button" 
                        (click)="copyOrderNo(order.orderNo)" 
                        title="Copy Order ID"
                        class="text-[10px] text-[#7A6C5E] hover:text-[#9C4738] p-1 cursor-pointer"
                      >
                        <i class="fa-regular fa-copy"></i>
                      </button>
                    </div>
                    <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] mt-0.5">
                      Placed on {{ order.date | date:'mediumDate' }}
                    </p>
                  </div>

                  <span [class]="order.badgeClass" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border">
                    {{ order.status }}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <a 
                    [routerLink]="['/order-confirmation', order.orderNo]"
                    class="px-3.5 py-2 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD2] dark:border-white/10 hover:border-[#9C4738] text-xs font-bold text-[#4A3C31] dark:text-[#F4F1ED] transition flex items-center gap-1.5"
                  >
                    <i class="fa-solid fa-receipt text-[11px]"></i>
                    <span>Invoice / Details</span>
                  </a>

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

              <!-- Status Notification Strip -->
              <div class="p-3 rounded-2xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/60 dark:border-white/10 flex items-start gap-2.5 text-xs">
                <i class="fa-solid fa-circle-info text-[#9C4738] dark:text-[#EB9D8E] mt-0.5 shrink-0"></i>
                <div class="flex-1">
                  <span class="font-bold text-[#4A3C31] dark:text-[#F4F1ED]">{{ order.statusDescription }}</span>
                  <p *ngIf="order.trackingRemark" class="text-[11px] font-bold text-sky-700 dark:text-sky-400 mt-0.5">
                    <i class="fa-solid fa-truck-fast"></i> {{ order.trackingRemark }}
                  </p>
                </div>
              </div>

              <!-- Compact Order Details Grid (Total, Delivery, Payment) -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div class="p-3 bg-[#FAF7F2]/60 dark:bg-white/5 rounded-xl border border-[#EADFD2]/50 dark:border-white/10">
                  <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Total Payable:</span>
                  <p class="font-serif font-bold text-base text-[#9C4738] dark:text-[#EB9D8E] mt-0.5">₹{{ order.total }}</p>
                  <span class="text-[10px] text-[#7A6C5E]">{{ order.paymentMode }}</span>
                </div>

                <div class="p-3 bg-[#FAF7F2]/60 dark:bg-white/5 rounded-xl border border-[#EADFD2]/50 dark:border-white/10 sm:col-span-2">
                  <span class="text-[10px] font-bold text-[#7A6C5E] uppercase block">Delivering To:</span>
                  <p class="font-bold text-[#2E2825] dark:text-[#F4F1ED] mt-0.5 truncate">{{ order.customerName }}</p>
                  <p class="text-[11px] text-[#7A6C5E] dark:text-[#C5A393] truncate mt-0.5">{{ order.address }}</p>
                </div>
              </div>

              <!-- Compact Items Preview (Horizontal Grid) -->
              <div *ngIf="order.items && order.items.length > 0" class="pt-1">
                <div class="flex items-center justify-between text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393] mb-2">
                  <span>Included Hampers ({{ order.items.length }}):</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  <div *ngFor="let itm of order.items" class="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2]/60 dark:border-white/10 flex items-center gap-2.5">
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
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);

  orders: DisplayOrder[] = [];
  isLoading = true;
  activeFilter: OrderFilter = 'all';
  searchQuery = '';

  get activeOrdersCount(): number {
    return this.orders.filter(o => ['pending', 'accepted', 'confirmed', 'packed', 'shipped'].includes(o.rawStatus)).length;
  }

  get deliveredOrdersCount(): number {
    return this.orders.filter(o => o.rawStatus === 'delivered').length;
  }

  get cancelledOrdersCount(): number {
    return this.orders.filter(o => o.rawStatus === 'cancelled').length;
  }

  get filteredOrders(): DisplayOrder[] {
    let result = this.orders;

    // Filter by tab status
    if (this.activeFilter === 'active') {
      result = result.filter(o => ['pending', 'accepted', 'confirmed', 'packed', 'shipped'].includes(o.rawStatus));
    } else if (this.activeFilter === 'delivered') {
      result = result.filter(o => o.rawStatus === 'delivered');
    } else if (this.activeFilter === 'cancelled') {
      result = result.filter(o => o.rawStatus === 'cancelled');
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      result = result.filter(o =>
        o.orderNo.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.items.some(i => i.title.toLowerCase().includes(q))
      );
    }

    return result;
  }

  ngOnInit() {
    this.seo.setPageMetadata({
      title: 'My Orders & Tracking — RMS Creations',
      description: 'View your real-time order history, delivery tracking, and fulfillment progress.',
      keywords: 'my orders, order tracking, rms creations orders',
      slug: 'my-orders'
    });

    this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;
    this.cdr.markForCheck();

    try {
      const localOrders = this.localStorage.getItem<any[]>('rms_my_orders') || [];
      const user = this.auth.currentUser;

      // 1. Gather all local order numbers
      const localOrderNos = localOrders.map(o => o.orderNo).filter(Boolean);

      // 2. Query Supabase purchase_order table
      let query = this.supabase
        .from('purchase_order')
        .select(`
          purchase_order_id,
          purchase_order_no,
          purchase_order_date,
          creation_date,
          purchase_order_status,
          payable_amount,
          total_amount,
          customer_id,
          contact_no,
          payment_mode,
          shipping_address,
          shipping_remark,
          cancellation_remark,
          is_active,
          purchase_order_details (
            item_id,
            item_sale_price,
            item_quantity,
            amount
          )
        `)
        .order('creation_date', { ascending: false });

      if (user?.id) {
        query = query.or(`customer_id.eq.${user.id},shipping_remark.ilike.%${user.email}%`);
      } else if (localOrderNos.length > 0) {
        query = query.in('purchase_order_no', localOrderNos);
      } else {
        this.orders = [];
        this.isLoading = false;
        this.cdr.markForCheck();
        return;
      }

      const { data: dbOrders, error } = await query;

      if (!error && dbOrders && dbOrders.length > 0) {
        const { data: products } = await this.supabase
          .from('products')
          .select('id, name, images, price');
        const productMap = new Map<number, any>();
        if (products) {
          products.forEach(p => productMap.set(Number(p.id), p));
        }

        this.orders = dbOrders.map((o: any) => {
          const rawStatus = (o.purchase_order_status || 'confirmed').toLowerCase();
          const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

          const localMatch = localOrders.find(lo => lo.orderNo === o.purchase_order_no);

          const nameMatch = (o.shipping_remark || '').match(/Customer:\s*([^|]+)/);
          const customerName = nameMatch ? nameMatch[1].trim() : (localMatch?.customerName || user?.name || 'Valued Customer');

          let items: DisplayOrder['items'] = [];
          if (o.purchase_order_details && o.purchase_order_details.length > 0) {
            items = o.purchase_order_details.map((d: any) => {
              const prod = productMap.get(Number(d.item_id));
              return {
                title: prod?.name || `Gift Hamper Item #${d.item_id}`,
                quantity: d.item_quantity || 1,
                price: d.item_sale_price || d.amount || 0,
                image: (prod?.images && prod.images[0]) || 'assets/banners/banner.png'
              };
            });
          } else if (localMatch?.items) {
            items = localMatch.items;
          }

          return {
            orderNo: o.purchase_order_no,
            date: o.purchase_order_date || o.creation_date,
            status: formattedStatus,
            rawStatus: rawStatus,
            statusDescription: this.getStatusDescription(rawStatus),
            badgeClass: this.getStatusBadgeClass(rawStatus),
            customerName: customerName,
            address: o.shipping_address || localMatch?.address || 'Delivery Address Provided',
            paymentMode: o.payment_mode || 'Cash on Delivery',
            total: o.payable_amount || o.total_amount || localMatch?.total || 0,
            trackingRemark: o.shipping_remark?.includes('Tracking #') ? o.shipping_remark : undefined,
            items: items
          };
        });
      } else {
        this.orders = localOrders.map(lo => {
          const raw = (lo.status || 'confirmed').toLowerCase();
          return {
            orderNo: lo.orderNo,
            date: lo.date,
            status: lo.status || 'Confirmed',
            rawStatus: raw,
            statusDescription: this.getStatusDescription(raw),
            badgeClass: this.getStatusBadgeClass(raw),
            customerName: lo.customerName || 'Valued Customer',
            address: lo.address || '',
            paymentMode: lo.paymentMode || 'Cash on Delivery',
            total: lo.total || 0,
            items: lo.items || []
          };
        });
      }
    } catch {
      const local = this.localStorage.getItem<any[]>('rms_my_orders') || [];
      this.orders = local.map(lo => {
        const raw = (lo.status || 'confirmed').toLowerCase();
        return {
          orderNo: lo.orderNo,
          date: lo.date,
          status: lo.status || 'Confirmed',
          rawStatus: raw,
          statusDescription: this.getStatusDescription(raw),
          badgeClass: this.getStatusBadgeClass(raw),
          customerName: lo.customerName || 'Valued Customer',
          address: lo.address || '',
          paymentMode: lo.paymentMode || 'Cash on Delivery',
          total: lo.total || 0,
          items: lo.items || []
        };
      });
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  copyOrderNo(orderNo: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(orderNo);
    }
  }

  getStatusDescription(status: string): string {
    switch (status) {
      case 'pending':
        return 'Order received! We are checking your items.';
      case 'confirmed':
        return 'Order confirmed! We are preparing your gift hamper.';
      case 'accepted':
        return 'Order accepted! Your hamper is being packed with care.';
      case 'packed':
        return 'Packed nicely with ribbons & message card, ready for dispatch.';
      case 'shipped':
        return 'Dispatched! Your parcel is on the way to your address.';
      case 'delivered':
        return 'Delivered safely! Thank you for choosing RMS Creations.';
      case 'cancelled':
        return 'This order has been cancelled.';
      default:
        return 'Your order is being processed by RMS Creations.';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'confirmed':
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';
      case 'packed':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/40';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/40';
      case 'delivered':
        return 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800/40';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/40';
      default:
        return 'bg-stone-100 text-stone-700 dark:bg-white/10 dark:text-stone-300 border-stone-200 dark:border-white/10';
    }
  }

  getTrackingUrl(orderNo: string): string {
    const text = encodeURIComponent(`Hello RMS Support! Please provide the latest tracking status for my order #${orderNo}.`);
    return `https://wa.me/919284905118?text=${text}`;
  }
}
