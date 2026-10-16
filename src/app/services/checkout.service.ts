import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { OrderTrackingService } from '../shared/order-tracking.service';
import { PurchaseOrder } from '../models/purchase-order.model';

export interface CheckoutItem {
  title: string;
  price: number;
  image?: string;
  category?: string;
  productId?: number;
  quantity?: number;
  notes?: string;
}

export interface CustomerOrderPayload {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  paymentMode: 'COD' | 'ONLINE_UPI';
  utrNo?: string;
  quantity: number;
  totalAmount: number;
  item: CheckoutItem;
}

import { NotificationOutboxService } from './notification-outbox.service';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private supabase = inject(SupabaseService);
  private orderTracker = inject(OrderTrackingService);
  private outboxService = inject(NotificationOutboxService);

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  public isOpen$ = this.isOpenSubject.asObservable();

  private activeItemSubject = new BehaviorSubject<CheckoutItem | null>(null);
  public activeItem$ = this.activeItemSubject.asObservable();

  // Store owner details for 100% Free UPI & updates
  public readonly upiNumber = '7350120467';
  public readonly upiId = '7350120467@upi';
  public readonly payeeName = 'RMS Creations';
  public readonly supportPhone = '+91 92849 05118';
  public readonly supportWhatsApp = '919284905118';
  public readonly supportEmail = 'keerraj840@gmail.com';

  open(item: CheckoutItem) {
    this.activeItemSubject.next({
      ...item,
      quantity: item.quantity || 1,
      price: Number(item.price) || 0
    });
    this.isOpenSubject.next(true);
  }

  close() {
    this.isOpenSubject.next(false);
  }

  generateOrderNo(): string {
    return `RMS-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  getUpiPaymentUrl(amount: number, orderNo: string, title: string): string {
    const cleanAmount = Math.max(1, Math.round(amount));
    const note = encodeURIComponent(`${orderNo} ${title.slice(0, 20)}`);
    return `upi://pay?pa=${this.upiId}&pn=${encodeURIComponent(this.payeeName)}&am=${cleanAmount}&cu=INR&tn=${note}`;
  }

  getQrCodeUrl(upiUrl: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(upiUrl)}`;
  }

  async submitCustomerOrder(payload: CustomerOrderPayload): Promise<{ success: boolean; orderNo: string; error?: string }> {
    const orderNo = this.generateOrderNo();
    const fullAddress = `${payload.address.trim()}, ${payload.city.trim()}, ${payload.state.trim()}`;
    const modeLabel = payload.paymentMode === 'COD' ? 'Cash on Delivery (COD)' : `UPI Online (${this.upiNumber})`;

    try {
      // 1. Insert into Supabase purchase_order
      const orderRecord: Partial<PurchaseOrder> = {
        purchase_order_no: orderNo,
        purchase_order_date: new Date().toISOString(),
        purchase_order_status: payload.paymentMode === 'COD' ? 'confirmed' : 'pending',
        payable_amount: payload.totalAmount,
        total_amount: payload.totalAmount,
        contact_no: payload.phone.trim(),
        payment_mode: modeLabel,
        shipping_type: 'Standard Free Delivery',
        shipping_address: fullAddress,
        shipping_state: payload.state.trim(),
        shipping_country: 'India',
        shipping_pin_code: payload.pinCode.trim(),
        transaction_status: payload.paymentMode === 'COD' ? 'Pending COD' : (payload.utrNo ? 'UTR Submitted' : 'Pending Verification'),
        utr_no: payload.utrNo?.trim() || null,
        shipping_remark: `Customer: ${payload.customerName.trim()} | Email: ${payload.email.trim()} | Item: ${payload.item.title} (Qty: ${payload.quantity})`,
        is_active: true,
        creation_date: new Date().toISOString()
      };

      const { data: poData, error: poError } = await this.supabase
        .from('purchase_order')
        .insert([orderRecord])
        .select()
        .single();

      if (poError) {
        console.warn('Supabase purchase_order insert note:', poError.message);
      }

      const purchaseOrderId = poData?.purchase_order_id;

      // 2. Insert into purchase_order_details if ID exists
      if (purchaseOrderId) {
        await this.supabase.from('purchase_order_details').insert([{
          purchase_order_id: purchaseOrderId,
          item_id: payload.item.productId || null,
          item_sale_price: payload.item.price,
          item_quantity: payload.quantity,
          item_total: payload.totalAmount,
          is_active: true,
          creation_date: new Date().toISOString()
        }]);
      }

      // 3. Record in local order tracker
      this.orderTracker.recordOrder({
        title: `${payload.item.title} (${payload.quantity}x)`,
        category: payload.item.category || 'Gifts & Hampers',
        page: 'Direct Online Order',
        link: `Order #${orderNo} - ₹${payload.totalAmount}`,
        price: payload.totalAmount
      });

      // 4. Enqueue Transactional Notification Outbox Entries (Admin Alert + Customer Confirmation)
      const itemSummaryText = `${payload.item.title} (Qty: ${payload.quantity})`;
      this.outboxService.recordOrderCreatedNotifications(
        orderNo,
        purchaseOrderId,
        payload.customerName,
        payload.email,
        payload.phone,
        itemSummaryText,
        payload.totalAmount,
        modeLabel,
        fullAddress,
        payload.pinCode
      ).then(() => {
        // Trigger background outbox processing
        this.outboxService.processPendingOutbox().catch(() => {});
      }).catch(() => {});

      return { success: true, orderNo };
    } catch (err: any) {
      console.error('Submit customer order failed:', err);
      return { success: false, orderNo, error: err?.message || 'Failed to submit order' };
    }
  }

  getWhatsAppUpdateLink(orderNo: string, customerName: string, itemTitle: string, totalAmount: number, paymentMode: string, address: string): string {
    const msg = `Hello RMS Creations! 👋\n` +
      `I have placed an order on your website:\n` +
      `📦 Order No: #${orderNo}\n` +
      `🎁 Hamper: ${itemTitle}\n` +
      `💰 Amount: ₹${totalAmount}\n` +
      `💳 Payment Mode: ${paymentMode}\n` +
      `👤 Customer: ${customerName}\n` +
      `📍 Delivery Address: ${address}\n\n` +
      `Please send dispatch and tracking updates to this WhatsApp chat. Thank you!`;

    return `https://wa.me/${this.supportWhatsApp}?text=${encodeURIComponent(msg)}`;
  }

  getEmailUpdateLink(orderNo: string, customerName: string, customerEmail: string, itemTitle: string, totalAmount: number, paymentMode: string, address: string): string {
    const subject = encodeURIComponent(`Order Confirmation & Updates: #${orderNo} - RMS Creations`);
    const body = encodeURIComponent(
      `Hello RMS Creations Team,\n\n` +
      `Order #${orderNo} has been placed successfully:\n\n` +
      `Customer Name: ${customerName}\n` +
      `Email: ${customerEmail}\n` +
      `Item / Hamper: ${itemTitle}\n` +
      `Total Payable: INR ${totalAmount}\n` +
      `Payment Mode: ${paymentMode}\n` +
      `Delivery Address: ${address}\n\n` +
      `Please email tracking and invoice details to: ${customerEmail}.\n\n` +
      `RMS Creations Customer Concierge`
    );

    return `mailto:${this.supportEmail}?cc=${encodeURIComponent(customerEmail)}&subject=${subject}&body=${body}`;
  }
}
