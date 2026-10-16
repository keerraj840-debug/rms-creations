import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NotificationOutboxService, OutboxEntry } from './notification-outbox.service';
import { SupabaseService } from './supabase.service';

describe('Reliable Notifications and Outbox Lifecycle', () => {
  let service: NotificationOutboxService;
  let insertedOutboxRows: OutboxEntry[] = [];

  const fakeSupabase = {
    from: (table: string) => {
      if (table === 'order_notification_outbox') {
        return {
          insert: (rows: OutboxEntry[]) => {
            insertedOutboxRows.push(...rows);
            return Promise.resolve({ data: rows, error: null });
          },
          select: () => ({
            eq: () => ({
              order: () => ({
                limit: () => Promise.resolve({ data: insertedOutboxRows, error: null })
              })
            })
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
          data: { total_batch: 2, sent: 2, failed: 0 },
          error: null
        })
      }
    }
  };

  beforeEach(() => {
    insertedOutboxRows = [];
    TestBed.configureTestingModule({
      providers: [
        NotificationOutboxService,
        { provide: SupabaseService, useValue: fakeSupabase }
      ]
    });
    service = TestBed.inject(NotificationOutboxService);
  });

  it('1. Generates exactly 1 admin alert and 1 customer confirmation for a new valid order', async () => {
    await service.recordOrderCreatedNotifications(
      'RMS-998877',
      55,
      'Pooja Sharma',
      'pooja@example.com',
      '9876543210',
      'Ganpati Pooja Kit ₹149',
      149,
      'COD',
      'Flat 402, Shivam Heights, Vashi, Navi Mumbai',
      '400703'
    );

    expect(insertedOutboxRows.length).toBe(2);

    const adminEntry = insertedOutboxRows.find(r => r.recipient_role === 'admin');
    const customerEntry = insertedOutboxRows.find(r => r.recipient_role === 'customer');

    expect(adminEntry).toBeDefined();
    expect(adminEntry?.recipient_email).toBe('rmsgifthampers@gmail.com');
    expect(adminEntry?.idempotency_key).toBe('created_admin_RMS-998877');
    expect(adminEntry?.template_data.totalAmount).toBe(149);

    expect(customerEntry).toBeDefined();
    expect(customerEntry?.recipient_email).toBe('pooja@example.com');
    expect(customerEntry?.idempotency_key).toBe('created_customer_RMS-998877');
    expect(customerEntry?.subject).toContain('Order Confirmation #RMS-998877');
  });

  it('2. Does not send customer confirmation if customer email is missing or invalid', async () => {
    await service.recordOrderCreatedNotifications(
      'RMS-112233',
      56,
      'Walk-in Guest',
      '', // invalid email
      '9876543210',
      'Gift Hamper',
      299,
      'COD',
      'Pune, Maharashtra',
      '411001'
    );

    // Only Admin Alert should be created
    expect(insertedOutboxRows.length).toBe(1);
    expect(insertedOutboxRows[0].recipient_role).toBe('admin');
  });

  it('3. Generates customer status notification with friendly explanation on status changes', async () => {
    await service.recordStatusUpdatedNotification(
      'RMS-998877',
      55,
      'Pooja Sharma',
      'pooja@example.com',
      'shipped',
      'confirmed',
      149,
      'Blue Dart Express - Tracking #BD778899',
      'UPI-UTR-12345'
    );

    expect(insertedOutboxRows.length).toBe(1);
    const updateEntry = insertedOutboxRows[0];

    expect(updateEntry.event_type).toBe('order_status_updated');
    expect(updateEntry.recipient_email).toBe('pooja@example.com');
    expect(updateEntry.subject).toContain('Order #RMS-998877 Status Update: Shipped');
    expect(updateEntry.template_data.trackingRemark).toContain('Blue Dart Express - Tracking #BD778899');
  });

  it('4. Email templates do not expose private secrets, credentials, or internal tokens', () => {
    const adminHtml = service.buildAdminNewOrderEmailHtml({
      orderNo: 'RMS-998877',
      customerName: 'Pooja Sharma',
      customerEmail: 'pooja@example.com',
      customerPhone: '9876543210',
      itemSummary: 'Luxury Hamper',
      totalAmount: 999,
      paymentMode: 'COD',
      shippingAddress: 'Vashi',
      pinCode: '400703'
    });

    expect(adminHtml).not.toContain('password');
    expect(adminHtml).not.toContain('service_role');
    expect(adminHtml).not.toContain('SUPABASE_ANON_KEY');

    const customerHtml = service.buildCustomerOrderConfirmationEmailHtml({
      orderNo: 'RMS-998877',
      customerName: 'Pooja Sharma',
      itemSummary: 'Luxury Hamper',
      totalAmount: 999,
      paymentMode: 'COD',
      shippingAddress: 'Vashi'
    });

    expect(customerHtml).not.toContain('password');
    expect(customerHtml).not.toContain('token');
    expect(customerHtml).toContain('Thank you, Pooja Sharma!');
  });

  it('5. Invokes server worker and returns processed counts', async () => {
    const result = await service.processPendingOutbox();
    expect(result.processed).toBe(2);
    expect(result.sent).toBe(2);
    expect(result.failed).toBe(0);
  });
});
