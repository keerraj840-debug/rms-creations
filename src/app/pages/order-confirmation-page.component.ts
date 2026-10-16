import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 py-12 md:py-16">
        
        <main class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          <!-- Loading State -->
          <div *ngIf="isLoading" class="py-20 text-center">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-[#9C4738] border-t-transparent mx-auto"></div>
            <p class="mt-4 text-xs font-bold text-[#7A6C5E] dark:text-[#C5A393]">Loading order confirmation...</p>
          </div>
          
          <div *ngIf="!isLoading" class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-10 shadow-sm text-center space-y-6">
            
            <!-- Success Icon -->
            <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-4xl shadow-sm">
              <i class="fa-solid fa-circle-check"></i>
            </div>

            <div>
              <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] inline-block mb-2 font-mono">
                Order #{{ orderNo }}
              </span>
              <h1 class="font-serif text-3xl sm:text-4xl font-bold text-[#2E2825] dark:text-[#F4F1ED]">
                Thank You for Your Order!
              </h1>
              <p class="mt-2 text-xs sm:text-sm text-[#7A6C5E] dark:text-[#C5A393] max-w-md mx-auto leading-relaxed">
                Your gift hamper order has been placed successfully and scheduled for artisanal packaging.
              </p>
            </div>

            <!-- Order Snapshot Box -->
            <div *ngIf="order" class="p-5 bg-[#FAF7F2] dark:bg-[#251F1C] border border-[#EADFD2] dark:border-white/10 rounded-2xl text-left text-xs space-y-3">
              
              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2.5">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Order Date:</span>
                <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ order.date | date:'mediumDate' }}</span>
              </div>

              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2.5">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Recipient Name:</span>
                <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ order.customerName }}</span>
              </div>

              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2.5">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Order Status:</span>
                <span class="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">{{ order.status }}</span>
              </div>

              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2.5">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Payment Mode:</span>
                <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ order.paymentMode }}</span>
              </div>

              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2.5">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Delivery Address:</span>
                <span class="font-medium text-[#2E2825] dark:text-[#F4F1ED] text-right max-w-[260px]">{{ order.address }}</span>
              </div>

              <!-- Items Breakdown -->
              <div class="pt-1" *ngIf="order.items && order.items.length > 0">
                <span class="font-bold text-[#7A6C5E] dark:text-[#C5A393] block mb-2">Hampers Ordered:</span>
                <div class="space-y-1.5">
                  <div *ngFor="let itm of order.items" class="flex justify-between text-[#2E2825] dark:text-[#F4F1ED]">
                    <span>{{ itm.title }} &times; {{ itm.quantity }}</span>
                    <span class="font-bold font-mono">₹{{ itm.price * itm.quantity }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 flex justify-between items-baseline">
                <span class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">Total Payable:</span>
                <span class="font-serif font-bold text-2xl text-[#9C4738] dark:text-[#EB9D8E]">₹{{ order.total }}</span>
              </div>
            </div>

            <!-- Next Steps Box -->
            <div class="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-left text-xs space-y-2">
              <span class="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <i class="fa-solid fa-clock-rotate-left text-amber-600"></i>
                What Happens Next?
              </span>
              <ul class="list-disc pl-5 space-y-1 text-amber-800 dark:text-amber-300">
                <li>Our gifting specialists will carefully assemble, inspect, and ribbon-wrap your hampers.</li>
                <li>You will receive order confirmation and courier dispatch notifications via email and WhatsApp.</li>
                <li>Standard delivery takes 24 to 48 hours for local orders.</li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a 
                routerLink="/my-orders"
                class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 text-center shadow-md cursor-pointer"
              >
                Track in My Orders
              </a>

              <a 
                routerLink="/shop"
                class="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-[#2E2825] dark:text-[#F4F1ED] hover:bg-white text-xs font-bold uppercase tracking-wider transition text-center cursor-pointer"
              >
                Continue Shopping
              </a>

              <a 
                [href]="whatsAppSupportUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i class="fa-brands fa-whatsapp text-sm"></i>
                <span>Ask Support</span>
              </a>
            </div>

          </div>

        </main>

      </div>
    </app-site-layout>
  `
})
export class OrderConfirmationPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly localStorage = inject(LocalStorageService);
  private readonly supabase = inject(SupabaseService);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);

  orderNo = '';
  order: any = null;
  isLoading = true;

  async ngOnInit() {
    this.orderNo = this.route.snapshot.paramMap.get('orderNo') || 'RMS-ORDER';
    
    this.seo.setPageMetadata({
      title: `Order ${this.orderNo} Confirmed — RMS Gift Hampers`,
      description: 'Your gift hamper order has been placed successfully.',
      keywords: 'order confirmation, order received',
      slug: `order-confirmation/${this.orderNo}`
    });

    await this.loadOrderDetails();
  }

  async loadOrderDetails() {
    this.isLoading = true;
    this.cdr.markForCheck();

    // 1. Try local storage cache
    const orders = this.localStorage.getItem<any[]>('rms_my_orders') || [];
    const localMatch = orders.find(o => o.orderNo === this.orderNo);

    if (localMatch) {
      this.order = localMatch;
    }

    // 2. Query Supabase database to verify live state
    try {
      const { data, error } = await this.supabase
        .from('purchase_order')
        .select(`
          purchase_order_id,
          purchase_order_no,
          purchase_order_date,
          creation_date,
          purchase_order_status,
          payable_amount,
          payment_mode,
          shipping_address,
          shipping_remark,
          purchase_order_details (
            item_id,
            item_sale_price,
            item_quantity,
            amount
          )
        `)
        .eq('purchase_order_no', this.orderNo)
        .maybeSingle();

      if (!error && data) {
        const nameMatch = (data.shipping_remark || '').match(/Customer:\s*([^|]+)/);
        const customerName = nameMatch ? nameMatch[1].trim() : (localMatch?.customerName || 'Valued Customer');

        let items = localMatch?.items || [];
        if (data.purchase_order_details && data.purchase_order_details.length > 0) {
          items = data.purchase_order_details.map((d: any) => ({
            title: `Gift Hamper Item #${d.item_id}`,
            quantity: d.item_quantity || 1,
            price: d.item_sale_price || d.amount || 0
          }));
        }

        const rawStatus = (data.purchase_order_status || 'confirmed').toLowerCase();
        const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

        this.order = {
          orderNo: data.purchase_order_no,
          date: data.purchase_order_date || data.creation_date,
          status: formattedStatus,
          customerName: customerName,
          address: data.shipping_address || localMatch?.address || 'Delivery Address Provided',
          paymentMode: data.payment_mode || 'Cash on Delivery',
          total: data.payable_amount || localMatch?.total || 0,
          items: items
        };
      }
    } catch {
      // Keep local match if available
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  get whatsAppSupportUrl(): string {
    const text = encodeURIComponent(`Hello RMS Creations Support! I have a question regarding my order #${this.orderNo}.`);
    return `https://wa.me/919284905118?text=${text}`;
  }
}
