import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteLayoutComponent } from '../shared/site-layout.component';
import { SeoService } from '../shared/seo.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-order-confirmation-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteLayoutComponent],
  template: `
    <app-site-layout>
      <div class="page-shell bg-[#FAF7F2] dark:bg-[#14110F] min-h-screen text-[#2E2825] dark:text-[#F4F1ED] transition-colors duration-300 py-12 md:py-16">
        
        <main class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          
          <div class="bg-white dark:bg-[#1E1916] rounded-3xl border border-[#EADFD2] dark:border-white/10 p-6 sm:p-10 shadow-sm text-center space-y-6">
            
            <!-- Success Icon -->
            <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-4xl shadow-sm">
              <i class="fa-solid fa-circle-check"></i>
            </div>

            <div>
              <span class="px-3.5 py-1 rounded-full text-xs font-bold bg-[#EADFD2]/70 dark:bg-white/10 text-[#7A6C5E] dark:text-[#C5A393] inline-block mb-2">
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
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Payment Mode:</span>
                <span class="font-bold text-[#2E2825] dark:text-[#F4F1ED]">{{ order.paymentMode }}</span>
              </div>

              <div class="flex justify-between items-center border-b border-[#EADFD2]/60 dark:border-white/10 pb-2.5">
                <span class="text-[#7A6C5E] dark:text-[#C5A393]">Delivery Address:</span>
                <span class="font-medium text-[#2E2825] dark:text-[#F4F1ED] text-right max-w-[260px]">{{ order.address }}</span>
              </div>

              <!-- Items Breakdown -->
              <div class="pt-1">
                <span class="font-bold text-[#7A6C5E] dark:text-[#C5A393] block mb-2">Hampers Ordered:</span>
                <div class="space-y-1.5">
                  <div *ngFor="let itm of order.items" class="flex justify-between text-[#2E2825] dark:text-[#F4F1ED]">
                    <span>{{ itm.title }} &times; {{ itm.quantity }}</span>
                    <span class="font-bold font-mono">₹{{ itm.price * itm.quantity }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-[#EADFD2]/60 dark:border-white/10 flex justify-between items-baseline">
                <span class="font-bold text-sm text-[#2E2825] dark:text-[#F4F1ED]">Total Amount:</span>
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
                <li>Our master artisans will carefully inspect, pack, and ribbon-wrap your hampers.</li>
                <li>You will receive dispatch photos and courier tracking link on SMS/WhatsApp.</li>
                <li>Delivery takes approximately 24 to 48 hours within Mumbai/Pune.</li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a 
                routerLink="/my-orders"
                class="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#57251C] dark:bg-[#C56D5B] hover:bg-[#9C4738] text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 text-center shadow-md"
              >
                View My Orders
              </a>

              <a 
                routerLink="/shop"
                class="w-full sm:w-auto px-7 py-3.5 rounded-full border border-[#EADFD2] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#251F1C] text-[#2E2825] dark:text-[#F4F1ED] hover:bg-white text-xs font-bold uppercase tracking-wider transition text-center"
              >
                Continue Shopping
              </a>

              <a 
                [href]="whatsAppSupportUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
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
  private readonly seo = inject(SeoService);

  orderNo = '';
  order: any = null;

  ngOnInit() {
    this.orderNo = this.route.snapshot.paramMap.get('orderNo') || 'RMS-ORDER';
    
    this.seo.setPageMetadata({
      title: `Order ${this.orderNo} Confirmed — RMS Gift Hampers`,
      description: 'Your gift hamper order has been placed successfully.',
      keywords: 'order confirmation, order received',
      slug: `order-confirmation/${this.orderNo}`
    });

    const orders = this.localStorage.getItem<any[]>('rms_my_orders') || [];
    this.order = orders.find(o => o.orderNo === this.orderNo) || orders[0] || null;
  }

  get whatsAppSupportUrl(): string {
    const text = encodeURIComponent(`Hello RMS Creations Support! I have a question regarding my order #${this.orderNo}.`);
    return `https://wa.me/919284905118?text=${text}`;
  }
}
