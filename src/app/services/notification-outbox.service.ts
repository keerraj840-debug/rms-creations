import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface OutboxEntry {
  id?: number;
  event_type: 'order_created' | 'order_status_updated' | 'custom_quote_prepared';
  purchase_order_id?: number;
  purchase_order_no: string;
  recipient_role: 'admin' | 'customer';
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  template_data: any;
  status: 'pending' | 'processing' | 'sent' | 'failed';
  attempts?: number;
  max_attempts?: number;
  last_error?: string;
  idempotency_key: string;
  provider_message_id?: string;
  created_at?: string;
  updated_at?: string;
  sent_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationOutboxService {
  private readonly supabase = inject(SupabaseService);

  public readonly adminNotificationEmail = 'rmsgifthampers@gmail.com';
  public readonly supportEmail = 'supportrmsgifthampers@gmail.com';
  public readonly supportPhone = '+91 9284905118';
  public readonly websiteUrl = 'https://rmscreations.netlify.app/';

  /* ------------------------------------------------------------------ */
  /* 1. OUTBOX ENTRY CREATION (IDEMPOTENT & NON-BLOCKING)                */
  /* ------------------------------------------------------------------ */

  /**
   * Enqueues outbox notification records when a new order is created.
   * Inserts 1 Admin Alert and 1 Customer Confirmation with unique idempotency keys.
   */
  async recordOrderCreatedNotifications(
    orderNo: string,
    purchaseOrderId: number | undefined,
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    itemSummary: string,
    totalAmount: number,
    paymentMode: string,
    shippingAddress: string,
    pinCode: string
  ): Promise<boolean> {
    const adminKey = `created_admin_${orderNo}`;
    const customerKey = `created_customer_${orderNo}`;
    const now = new Date().toISOString();

    const outboxRecords: OutboxEntry[] = [
      // 1. Admin Alert
      {
        event_type: 'order_created',
        purchase_order_id: purchaseOrderId,
        purchase_order_no: orderNo,
        recipient_role: 'admin',
        recipient_email: this.adminNotificationEmail,
        recipient_name: 'RMS Admin Team',
        subject: `🔔 New Order Received: #${orderNo} (₹${totalAmount})`,
        template_data: {
          orderNo,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          itemSummary: itemSummary.trim(),
          totalAmount,
          paymentMode,
          shippingAddress,
          pinCode,
          orderDate: now
        },
        status: 'pending',
        attempts: 0,
        max_attempts: 5,
        idempotency_key: adminKey,
        created_at: now
      }
    ];

    // 2. Customer Order Confirmation (if valid email)
    if (customerEmail && customerEmail.includes('@')) {
      outboxRecords.push({
        event_type: 'order_created',
        purchase_order_id: purchaseOrderId,
        purchase_order_no: orderNo,
        recipient_role: 'customer',
        recipient_email: customerEmail.trim(),
        recipient_name: customerName.trim(),
        subject: `✨ Order Confirmation #${orderNo} - RMS Creations`,
        template_data: {
          orderNo,
          customerName: customerName.trim(),
          itemSummary: itemSummary.trim(),
          totalAmount,
          paymentMode,
          shippingAddress,
          orderDate: now
        },
        status: 'pending',
        attempts: 0,
        max_attempts: 5,
        idempotency_key: customerKey,
        created_at: now
      });
    }

    try {
      const { error } = await this.supabase
        .from('order_notification_outbox')
        .insert(outboxRecords);

      if (error && !error.message.includes('duplicate key')) {
        console.warn('Outbox enqueue note:', error.message);
      }
      return true;
    } catch {
      // Non-blocking
      return false;
    }
  }

  /**
   * Enqueues outbox notification record when an order status is updated by admin.
   */
  async recordStatusUpdatedNotification(
    orderNo: string,
    purchaseOrderId: number | undefined,
    customerName: string,
    customerEmail: string,
    newStatus: string,
    oldStatus: string,
    totalAmount: number,
    trackingRemark?: string,
    utrNo?: string
  ): Promise<boolean> {
    if (!customerEmail || !customerEmail.includes('@')) return false;

    const statusClean = newStatus.toLowerCase().trim();
    const timestampKey = Math.floor(Date.now() / 1000);
    const idempotencyKey = `status_upd_${orderNo}_${statusClean}_${timestampKey}`;
    const now = new Date().toISOString();

    const formattedStatus = statusClean.charAt(0).toUpperCase() + statusClean.slice(1);

    const record: OutboxEntry = {
      event_type: 'order_status_updated',
      purchase_order_id: purchaseOrderId,
      purchase_order_no: orderNo,
      recipient_role: 'customer',
      recipient_email: customerEmail.trim(),
      recipient_name: customerName.trim(),
      subject: `📦 Order #${orderNo} Status Update: ${formattedStatus}`,
      template_data: {
        orderNo,
        customerName: customerName.trim(),
        newStatus: formattedStatus,
        oldStatus: oldStatus ? oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1) : 'Pending',
        totalAmount,
        utrNo: utrNo || '',
        trackingRemark: trackingRemark || '',
        updateDate: now
      },
      status: 'pending',
      attempts: 0,
      max_attempts: 5,
      idempotency_key: idempotencyKey,
      created_at: now
    };

    try {
      const { error } = await this.supabase
        .from('order_notification_outbox')
        .insert([record]);

      if (error && !error.message.includes('duplicate key')) {
        console.warn('Outbox status enqueue note:', error.message);
      }
      return true;
    } catch {
      return false;
    }
  }

  /* ------------------------------------------------------------------ */
  /* 2. HTML EMAIL TEMPLATE BUILDERS                                    */
  /* ------------------------------------------------------------------ */

  buildAdminNewOrderEmailHtml(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>New Order Alert #${data.orderNo}</title></head>
      <body style="font-family: Arial, sans-serif; background-color: #FAF7F2; color: #2E2825; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #EADFD2;">
          <div style="border-bottom: 2px solid #9C4738; pb: 12px; margin-bottom: 16px;">
            <h2 style="color: #57251C; margin: 0;">🔔 New Customer Order #${data.orderNo}</h2>
            <p style="color: #7A6C5E; font-size: 13px; margin-top: 4px;">RMS Creations Store Alert</p>
          </div>

          <div style="background: #FAF7F2; padding: 16px; border-radius: 12px; margin-bottom: 16px; font-size: 14px; line-height: 1.6;">
            <p style="margin: 0 0 8px 0;"><strong>Customer Name:</strong> ${data.customerName}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
            <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${data.customerPhone}</p>
            <p style="margin: 0 0 8px 0;"><strong>Hamper Summary:</strong> ${data.itemSummary}</p>
            <p style="margin: 0 0 8px 0;"><strong>Total Payable:</strong> <span style="color: #9C4738; font-weight: bold;">₹${data.totalAmount}</span></p>
            <p style="margin: 0 0 8px 0;"><strong>Payment Mode:</strong> ${data.paymentMode}</p>
            <p style="margin: 0;"><strong>Delivery Address:</strong> ${data.shippingAddress} (PIN: ${data.pinCode})</p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="${this.websiteUrl}admin/orders" style="background: #9C4738; color: #ffffff; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; font-size: 14px; inline-block;">
              Open Admin Orders Dashboard &rarr;
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  buildCustomerOrderConfirmationEmailHtml(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Order Confirmation #${data.orderNo}</title></head>
      <body style="font-family: Arial, sans-serif; background-color: #FAF7F2; color: #2E2825; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #EADFD2;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #57251C; font-family: Georgia, serif; margin: 0;">RMS Creations</h1>
            <p style="color: #9C4738; font-weight: bold; font-size: 13px; margin-top: 4px;">Bespoke Curated Gifting</p>
          </div>

          <div style="background: #FAF7F2; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
            <h2 style="color: #57251C; font-size: 18px; margin-top: 0;">Thank you, ${data.customerName}! 🎁</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #4A3C31;">
              Your order <strong>#${data.orderNo}</strong> has been received and confirmed. Our gifting specialists are preparing your package with care.
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px;">
              <tr><td style="padding: 6px 0; border-bottom: 1px solid #EADFD2;"><strong>Item / Hamper:</strong></td><td style="text-align: right; padding: 6px 0; border-bottom: 1px solid #EADFD2;">${data.itemSummary}</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px solid #EADFD2;"><strong>Total Amount:</strong></td><td style="text-align: right; padding: 6px 0; border-bottom: 1px solid #EADFD2; font-weight: bold; color: #9C4738;">₹${data.totalAmount}</td></tr>
              <tr><td style="padding: 6px 0; border-bottom: 1px solid #EADFD2;"><strong>Payment Mode:</strong></td><td style="text-align: right; padding: 6px 0; border-bottom: 1px solid #EADFD2;">${data.paymentMode}</td></tr>
              <tr><td style="padding: 6px 0;"><strong>Delivery Address:</strong></td><td style="text-align: right; padding: 6px 0;">${data.shippingAddress}</td></tr>
            </table>
          </div>

          <div style="border-top: 1px solid #EADFD2; pt: 16px; text-size: 12px; color: #7A6C5E; text-align: center;">
            <p style="margin-bottom: 4px;">Need help? Call or WhatsApp RMS Support: <strong>${this.supportPhone}</strong></p>
            <p style="margin-top: 0;">Email: <strong>${this.supportEmail}</strong> | <a href="${this.websiteUrl}" style="color: #9C4738;">www.rmscreations.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  buildCustomerStatusUpdateEmailHtml(data: any): string {
    const statusExplainer: Record<string, string> = {
      'Confirmed': 'Your order has been verified and queued for custom packaging.',
      'Accepted': 'Your order is currently being handcrafted and packed in our studio.',
      'Processing': 'Your gift hamper is being assembled with quality checks.',
      'Shipped': 'Your package has been dispatched! Courier tracking details are below.',
      'Delivered': 'Your gift hamper has been delivered successfully. Thank you for choosing RMS Creations!',
      'Cancelled': 'Your order has been cancelled. If you have questions, please reach out to support.'
    };

    const explanation = statusExplainer[data.newStatus] || `Your order status has been updated to ${data.newStatus}.`;

    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Order Status Update #${data.orderNo}</title></head>
      <body style="font-family: Arial, sans-serif; background-color: #FAF7F2; color: #2E2825; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px; border: 1px solid #EADFD2;">
          <div style="border-bottom: 2px solid #9C4738; pb: 12px; margin-bottom: 16px;">
            <h2 style="color: #57251C; margin: 0;">📦 Order #${data.orderNo} Update</h2>
            <p style="color: #7A6C5E; font-size: 13px; margin-top: 4px;">Status Changed to: <strong>${data.newStatus}</strong></p>
          </div>

          <div style="background: #FAF7F2; padding: 16px; border-radius: 12px; margin-bottom: 16px; font-size: 14px; line-height: 1.6;">
            <p style="margin-top: 0;">Hello ${data.customerName},</p>
            <p>${explanation}</p>

            ${data.trackingRemark ? `<p style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #EADFD2;"><strong>Tracking / Dispatch Details:</strong><br>${data.trackingRemark}</p>` : ''}
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #7A6C5E;">
            <p>Questions? Contact RMS Support: <strong>${this.supportPhone}</strong> or <strong>${this.supportEmail}</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /* ------------------------------------------------------------------ */
  /* 3. WORKER QUEUE DISPATCHER (RELIABLE & IDEMPOTENT)                  */
  /* ------------------------------------------------------------------ */

  async fetchPendingOutbox(limit = 10): Promise<OutboxEntry[]> {
    try {
      const { data, error } = await this.supabase
        .from('order_notification_outbox')
        .select('*')
        .eq('status', 'pending')
        .order('id', { ascending: true })
        .limit(limit);

      if (error) return [];
      return (data as OutboxEntry[]) || [];
    } catch {
      return [];
    }
  }

  async processPendingOutbox(entries?: OutboxEntry[]): Promise<{ processed: number; sent: number; failed: number; message?: string }> {
    try {
      // 1. Invoke Supabase Edge Function worker
      const { data, error } = await this.supabase.client.functions.invoke('process-order-notifications');

      if (!error && data) {
        return {
          processed: data.total_batch || data.processed || 0,
          sent: data.sent || 0,
          failed: data.failed || 0,
          message: data.warning || (data.sent ? `Successfully sent ${data.sent} notification(s)` : data.message)
        };
      }

      // If edge function returned an error
      if (error) {
        console.info('Outbox Edge Function notice:', error.message);
        return {
          processed: 0,
          sent: 0,
          failed: 0,
          message: 'Notification queued in database outbox. Configure RESEND_API_KEY in Supabase Edge Function secrets to deliver live emails.'
        };
      }

      return { processed: 0, sent: 0, failed: 0 };
    } catch (err: any) {
      console.info('Notification outbox worker notice:', err?.message);
      return {
        processed: 0,
        sent: 0,
        failed: 0,
        message: 'Notification saved to database outbox.'
      };
    }
  }
}
