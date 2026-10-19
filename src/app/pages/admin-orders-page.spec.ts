import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminOrdersPageComponent } from './admin-orders-page.component';
import { SupabaseService } from '../services/supabase.service';
import { PinCodeAvailabilityService } from '../services/pin-code-availability.service';
import { PurchaseOrder } from '../models/purchase-order.model';

describe('AdminOrdersPageComponent (Smart Order Processing Dashboard)', () => {
  let component: AdminOrdersPageComponent;

  beforeEach(async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null })
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null })
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: {}, error: null })
          })
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null })
        })
      })
    };

    const mockPinCode = {
      checkDelivery: vi.fn().mockResolvedValue({
        isServiceable: true,
        calculatedDeliveryFee: 49,
        courierService: 'Blue Dart'
      })
    };

    await TestBed.configureTestingModule({
      imports: [AdminOrdersPageComponent],
      providers: [
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: PinCodeAvailabilityService, useValue: mockPinCode }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminOrdersPageComponent);
    component = fixture.componentInstance;
  });

  it('correctly categorizes and counts orders by workflow status', () => {
    component.orders = [
      { purchase_order_id: 1, purchase_order_no: 'ORD-1', purchase_order_status: 'confirmed', payable_amount: 1200 },
      { purchase_order_id: 2, purchase_order_no: 'ORD-2', purchase_order_status: 'pending', payable_amount: 800 },
      { purchase_order_id: 3, purchase_order_no: 'ORD-3', purchase_order_status: 'accepted', payable_amount: 1500 },
      { purchase_order_id: 4, purchase_order_no: 'ORD-4', purchase_order_status: 'packed', payable_amount: 900 },
      { purchase_order_id: 5, purchase_order_no: 'ORD-5', purchase_order_status: 'shipped', payable_amount: 2100 },
      { purchase_order_id: 6, purchase_order_no: 'ORD-6', purchase_order_status: 'delivered', payable_amount: 3000 },
      { purchase_order_id: 7, purchase_order_no: 'ORD-7', purchase_order_status: 'cancelled', payable_amount: 500 }
    ] as PurchaseOrder[];

    expect(component.confirmedCount).toBe(1);
    expect(component.pendingCount).toBe(1);
    expect(component.acceptedCount).toBe(1);
    expect(component.packedCount).toBe(1);
    expect(component.shippedCount).toBe(1);
    expect(component.deliveredCount).toBe(1);
    expect(component.cancelledCount).toBe(1);
    expect(component.inTransitCount).toBe(3); // accepted + packed + shipped
    expect(component.totalValue).toBe(10000);
  });

  it('detects new orders created within the last 24 hours', () => {
    const recentOrder: PurchaseOrder = {
      purchase_order_id: 10,
      purchase_order_no: 'ORD-10',
      purchase_order_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      purchase_order_status: 'confirmed',
      payable_amount: 500
    };

    const oldOrder: PurchaseOrder = {
      purchase_order_id: 11,
      purchase_order_no: 'ORD-11',
      purchase_order_date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
      purchase_order_status: 'confirmed',
      payable_amount: 500
    };

    expect(component.isNewOrder(recentOrder)).toBe(true);
    expect(component.isNewOrder(oldOrder)).toBe(false);
  });

  it('flags delayed orders that remain unfulfilled after 48 hours', () => {
    const delayedOrder: PurchaseOrder = {
      purchase_order_id: 20,
      purchase_order_no: 'ORD-20',
      purchase_order_date: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
      purchase_order_status: 'accepted',
      payable_amount: 1500
    };

    const shippedOrder: PurchaseOrder = {
      purchase_order_id: 21,
      purchase_order_no: 'ORD-21',
      purchase_order_date: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(),
      purchase_order_status: 'shipped',
      payable_amount: 1500
    };

    expect(component.isDelayedOrder(delayedOrder)).toBe(true);
    expect(component.isDelayedOrder(shippedOrder)).toBe(false);
  });

  it('detects UPI orders with missing or unverified UTR proof', () => {
    const unverifiedUpi: PurchaseOrder = {
      purchase_order_id: 30,
      purchase_order_no: 'ORD-30',
      payment_mode: 'Online UPI (7350120467)',
      utr_no: null,
      payable_amount: 1499
    };

    const verifiedUpi: PurchaseOrder = {
      purchase_order_id: 31,
      purchase_order_no: 'ORD-31',
      payment_mode: 'Online UPI (7350120467)',
      utr_no: '123456789012',
      transaction_status: 'SUCCESS',
      payable_amount: 1499
    };

    const codOrder: PurchaseOrder = {
      purchase_order_id: 32,
      purchase_order_no: 'ORD-32',
      payment_mode: 'Cash on Delivery (COD)',
      utr_no: null,
      payable_amount: 1499
    };

    expect(component.hasPaymentIssue(unverifiedUpi)).toBe(true);
    expect(component.hasPaymentIssue(verifiedUpi)).toBe(false);
    expect(component.hasPaymentIssue(codOrder)).toBe(false);
  });

  it('enforces safe sequential status transitions and guards terminal statuses', () => {
    expect(component.getNextSafeStatus({ purchase_order_status: 'pending' } as any)).toBe('confirmed');
    expect(component.getNextSafeStatus({ purchase_order_status: 'confirmed' } as any)).toBe('accepted');
    expect(component.getNextSafeStatus({ purchase_order_status: 'accepted' } as any)).toBe('packed');
    expect(component.getNextSafeStatus({ purchase_order_status: 'packed' } as any)).toBe('shipped');
    expect(component.getNextSafeStatus({ purchase_order_status: 'shipped' } as any)).toBe('delivered');
    expect(component.getNextSafeStatus({ purchase_order_status: 'delivered' } as any)).toBeNull();
    expect(component.getNextSafeStatus({ purchase_order_status: 'cancelled' } as any)).toBeNull();
  });

  it('generates WhatsApp concierge link with prefilled order details', () => {
    const order: PurchaseOrder = {
      purchase_order_id: 99,
      purchase_order_no: 'ORD-999',
      contact_no: '9820012345',
      payable_amount: 2499,
      purchase_order_status: 'confirmed'
    };

    const link = component.getWhatsAppLink(order);
    expect(link).toContain('https://wa.me/9820012345');
    expect(link).toContain('ORD-999');
    expect(link).toContain('2499');
  });

  it('filters orders by query search including PIN code and address', () => {
    component.orders = [
      { purchase_order_id: 1, purchase_order_no: 'ORD-101', contact_no: '9820011111', shipping_pin_code: '400001', shipping_address: 'Colaba, Mumbai' },
      { purchase_order_id: 2, purchase_order_no: 'ORD-102', contact_no: '9820022222', shipping_pin_code: '411001', shipping_address: 'Shivajinagar, Pune' }
    ] as PurchaseOrder[];

    component.searchQuery = '411001';
    component.applyFilter();
    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].purchase_order_no).toBe('ORD-102');

    component.searchQuery = 'mumbai';
    component.applyFilter();
    expect(component.filteredOrders.length).toBe(1);
    expect(component.filteredOrders[0].purchase_order_no).toBe('ORD-101');
  });

  it('requires double confirmation before advancing status to prevent accidental clicks', () => {
    const order: PurchaseOrder = {
      purchase_order_id: 301,
      purchase_order_no: 'ORD-301',
      purchase_order_status: 'confirmed',
      payable_amount: 1500
    };

    // Clicking advance should open confirmation modal, NOT immediately change status
    component.promptStatusAdvance(order, 'accepted');

    expect(component.showStatusConfirmModal).toBe(true);
    expect(component.pendingStatusOrder).toBe(order);
    expect(component.pendingTargetStatus).toBe('accepted');
    expect(order.purchase_order_status).toBe('confirmed'); // Still confirmed!

    // Cancelling should close modal without any modification
    component.cancelStatusAdvance();
    expect(component.showStatusConfirmModal).toBe(false);
    expect(component.pendingStatusOrder).toBeNull();
    expect(component.pendingTargetStatus).toBe('');
    expect(order.purchase_order_status).toBe('confirmed');
  });

  it('updates order status only after explicit confirmation in double confirmation modal', async () => {
    const order: PurchaseOrder = {
      purchase_order_id: 302,
      purchase_order_no: 'ORD-302',
      purchase_order_status: 'pending',
      payable_amount: 999
    };

    component.promptStatusAdvance(order, 'confirmed');
    expect(component.showStatusConfirmModal).toBe(true);

    // Confirm advance
    await component.confirmStatusAdvance();
    expect(component.showStatusConfirmModal).toBe(false);
    expect(order.purchase_order_status).toBe('confirmed');
  });

  it('requires double confirmation for bulk order status updates', () => {
    component.selectedOrderIds.add(1);
    component.selectedOrderIds.add(2);

    component.promptBulkStatus('accepted');
    expect(component.showBulkConfirmModal).toBe(true);
    expect(component.pendingBulkStatus).toBe('accepted');
  });

  it('correctly classifies paid vs pending/COD orders and generates payment labels', () => {
    const codOrder: PurchaseOrder = {
      purchase_order_id: 401,
      purchase_order_no: 'ORD-401',
      payment_mode: 'Cash on Delivery (COD)',
      transaction_status: 'PENDING',
      payable_amount: 1200
    };

    const upiPaidOrder: PurchaseOrder = {
      purchase_order_id: 402,
      purchase_order_no: 'ORD-402',
      payment_mode: 'Paid via UPI',
      transaction_status: 'PAID',
      utr_no: '987654321012',
      payable_amount: 1500
    };

    const cashPaidOrder: PurchaseOrder = {
      purchase_order_id: 403,
      purchase_order_no: 'ORD-403',
      payment_mode: 'Paid via Cash (COD)',
      transaction_status: 'PAID',
      payable_amount: 800
    };

    expect(component.isOrderPaid(codOrder)).toBe(false);
    expect(component.getOrderPaymentLabel(codOrder)).toBe('Pending / COD');

    expect(component.isOrderPaid(upiPaidOrder)).toBe(true);
    expect(component.getOrderPaymentLabel(upiPaidOrder)).toBe('Paid (UPI)');

    expect(component.isOrderPaid(cashPaidOrder)).toBe(true);
    expect(component.getOrderPaymentLabel(cashPaidOrder)).toBe('Paid (Cash)');
  });

  it('allows admin to open quick payment modal and update payment status to Paid via UPI', async () => {
    const order: PurchaseOrder = {
      purchase_order_id: 404,
      purchase_order_no: 'ORD-404',
      payment_mode: 'Cash on Delivery (COD)',
      transaction_status: 'PENDING',
      payable_amount: 2200
    };

    component.orders = [order];
    component.openQuickPaymentModal(order);

    expect(component.showPaymentModal).toBe(true);
    expect(component.paymentOrderTarget).toBe(order);
    expect(component.paymentActionType).toBe('PAID_UPI');

    component.paymentReferenceNote = 'GPay-Verified-4411';
    await component.submitPaymentStatusUpdate();

    expect(component.showPaymentModal).toBe(false);
    expect(order.transaction_status).toBe('PAID');
    expect(order.payment_mode).toBe('Paid via UPI');
    expect(order.utr_no).toBe('GPay-Verified-4411');
    expect(component.paymentSuccessBanner).toContain('Paid via UPI');
  });

  it('allows admin to revert an order back to COD/Pending', async () => {
    const paidOrder: PurchaseOrder = {
      purchase_order_id: 405,
      purchase_order_no: 'ORD-405',
      payment_mode: 'Paid via UPI',
      transaction_status: 'PAID',
      utr_no: '123456',
      payable_amount: 1999
    };

    component.orders = [paidOrder];
    await component.markOrderAsUnpaid(paidOrder);

    expect(paidOrder.transaction_status).toBe('PENDING');
    expect(paidOrder.payment_mode).toBe('Cash on Delivery (COD)');
    expect(paidOrder.utr_no).toBeNull();
    expect(component.paymentSuccessBanner).toContain('reverted');
  });
});

