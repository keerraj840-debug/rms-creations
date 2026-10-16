import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationOutboxService, OutboxEntry } from './notification-outbox.service';
import { SupabaseService } from './supabase.service';

describe('NotificationOutboxService', () => {
  let service: NotificationOutboxService;
  let insertedOutboxRows: any[] = [];

  beforeEach(() => {
    insertedOutboxRows = [];

    const fakeSupabase = {
      from: (table: string) => {
        if (table === 'order_notification_outbox') {
          return {
            insert: (records: any[]) => {
              insertedOutboxRows.push(...records);
              return Promise.resolve({ data: records, error: null });
            },
            select: () => ({
              eq: () => ({
                order: () => ({
                  limit: () => Promise.resolve({
                    data: [
                      {
                        id: 101,
                        event_type: 'order_created',
                        purchase_order_no: 'RMS-100200',
                        recipient_role: 'admin',
                        recipient_email: 'rmsgifthampers@gmail.com',
                        subject: '🔔 New Order Received: #RMS-100200 (₹599)',
                        template_data: {
                          orderNo: 'RMS-100200',
                          customerName: 'Aaryak Tests',
                          customerEmail: 'aaryak@example.com',
                          totalAmount: 599
                        },
                        status: 'pending',
                        attempts: 0,
                        max_attempts: 5,
                        idempotency_key: 'created_admin_RMS-100200'
                      }
                    ],
                    error: null
                  })
                })
              })
            }),
            update: () => ({
              eq: () => Promise.resolve({ data: null, error: null })
            })
          };
        }
        return {
          select: () => ({ limit: () => Promise.resolve({ data: [], error: null }) })
        };
      },
      client: {
        functions: {
          invoke: (fnName: string) => Promise.resolve({
            data: { total_batch: 1, sent: 1, failed: 0 },
            error: null
          })
        }
      }
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationOutboxService,
        { provide: SupabaseService, useValue: fakeSupabase }
      ]
    });

    service = TestBed.inject(NotificationOutboxService);
  });

  it('enqueues Admin Alert and Customer Confirmation outbox records with unique idempotency keys', async () => {
    const success = await service.recordOrderCreatedNotifications(
      'RMS-888999',
      55,
      'John Doe',
      'john@example.com',
      '9284905118',
      'Diwali Hamper 299 (1x)',
      299,
      'Cash on Delivery (COD)',
      'Plot 42, Vashi, Navi Mumbai',
      '400703'
    );

    expect(success).toBe(true);
    expect(insertedOutboxRows.length).toBe(2);

    const adminEntry = insertedOutboxRows.find(r => r.recipient_role === 'admin');
    const customerEntry = insertedOutboxRows.find(r => r.recipient_role === 'customer');

    expect(adminEntry).toBeDefined();
    expect(adminEntry.recipient_email).toBe('rmsgifthampers@gmail.com');
    expect(adminEntry.idempotency_key).toBe('created_admin_RMS-888999');

    expect(customerEntry).toBeDefined();
    expect(customerEntry.recipient_email).toBe('john@example.com');
    expect(customerEntry.idempotency_key).toBe('created_customer_RMS-888999');
  });

  it('enqueues customer status update outbox entry when order status changes', async () => {
    const success = await service.recordStatusUpdatedNotification(
      'RMS-888999',
      55,
      'John Doe',
      'john@example.com',
      'shipped',
      'confirmed',
      299,
      'Blue Dart Express - Tracking #BD123456IN'
    );

    expect(success).toBe(true);
    expect(insertedOutboxRows.length).toBe(1);

    const statusEntry = insertedOutboxRows[0];
    expect(statusEntry.event_type).toBe('order_status_updated');
    expect(statusEntry.recipient_email).toBe('john@example.com');
    expect(statusEntry.subject).toContain('Shipped');
    expect(statusEntry.idempotency_key).toContain('status_upd_RMS-888999_shipped_');
  });

  it('builds clean HTML email templates for Admin and Customer', () => {
    const adminHtml = service.buildAdminNewOrderEmailHtml({
      orderNo: 'RMS-123',
      customerName: 'Jane Doe',
      customerEmail: 'jane@example.com',
      customerPhone: '9284905118',
      itemSummary: 'Ganpati Pooja Kit ₹149',
      totalAmount: 149,
      paymentMode: 'COD',
      shippingAddress: 'Vashi, Navi Mumbai',
      pinCode: '400703'
    });

    expect(adminHtml).toContain('New Customer Order #RMS-123');
    expect(adminHtml).toContain('Jane Doe');
    expect(adminHtml).toContain('₹149');

    const customerHtml = service.buildCustomerOrderConfirmationEmailHtml({
      orderNo: 'RMS-123',
      customerName: 'Jane Doe',
      itemSummary: 'Ganpati Pooja Kit ₹149',
      totalAmount: 149,
      paymentMode: 'COD',
      shippingAddress: 'Vashi, Navi Mumbai'
    });

    expect(customerHtml).toContain('Thank you, Jane Doe!');
    expect(customerHtml).toContain('Order Confirmation #RMS-123');

    const statusHtml = service.buildCustomerStatusUpdateEmailHtml({
      orderNo: 'RMS-123',
      customerName: 'Jane Doe',
      newStatus: 'Shipped',
      trackingRemark: 'Blue Dart #BD999'
    });

    expect(statusHtml).toContain('Status Changed to: <strong>Shipped</strong>');
    expect(statusHtml).toContain('Blue Dart #BD999');
  });

  it('processes pending outbox queue records idempotently', async () => {
    const result = await service.processPendingOutbox();
    expect(result.processed).toBe(1);
    expect(result.sent).toBe(1);
    expect(result.failed).toBe(0);
  });
});
