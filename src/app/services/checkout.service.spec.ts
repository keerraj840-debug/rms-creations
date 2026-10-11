import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CheckoutService } from './checkout.service';
import { SupabaseService } from './supabase.service';
import { OrderTrackingService } from '../shared/order-tracking.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let mockSupabase: any;
  let mockOrderTracker: any;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { purchase_order_id: 99, purchase_order_no: 'RMS-123456' },
              error: null
            })
          })
        })
      })
    };

    mockOrderTracker = {
      recordOrder: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CheckoutService,
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: OrderTrackingService, useValue: mockOrderTracker }
      ]
    });

    service = TestBed.inject(CheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.upiNumber).toBe('7350120467');
  });

  it('should open and close checkout modal with item', async () => {
    service.open({
      title: 'Ganpati Pooja Box',
      price: 149,
      category: 'Ganpati Hampers'
    });

    const isOpen = await firstValueFrom(service.isOpen$);
    expect(isOpen).toBe(true);

    const item = await firstValueFrom(service.activeItem$);
    expect(item?.title).toBe('Ganpati Pooja Box');
    expect(item?.price).toBe(149);

    service.close();
    const isClosed = await firstValueFrom(service.isOpen$);
    expect(isClosed).toBe(false);
  });

  it('should generate valid UPI payment link for 7350120467', () => {
    const link = service.getUpiPaymentUrl(149, 'RMS-10294', 'Ganpati Pooja Box');
    expect(link).toContain('pa=7350120467@upi');
    expect(link).toContain('am=149');
    expect(link).toContain('cu=INR');
  });

  it('should submit customer order and sync to purchase_order and purchase_order_details', async () => {
    const res = await service.submitCustomerOrder({
      customerName: 'Priya Sharma',
      phone: '9820012345',
      email: 'priya@gmail.com',
      address: 'Flat 101, Crystal Apts',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      paymentMode: 'ONLINE_UPI',
      utrNo: '429810294829',
      quantity: 2,
      totalAmount: 298,
      item: {
        title: 'Ganpati Pooja Box',
        price: 149,
        productId: 5
      }
    });

    expect(res.success).toBe(true);
    expect(res.orderNo).toContain('RMS-');
    expect(mockSupabase.from).toHaveBeenCalledWith('purchase_order');
    expect(mockOrderTracker.recordOrder).toHaveBeenCalled();
  });

  it('should format WhatsApp and Email update links correctly', () => {
    const waLink = service.getWhatsAppUpdateLink(
      'RMS-999999',
      'Priya Sharma',
      'Ganpati Box',
      298,
      'Cash on Delivery (COD)',
      'Mumbai'
    );
    expect(waLink).toContain('9284905118');
    expect(waLink).toContain('RMS-999999');

    const emailLink = service.getEmailUpdateLink(
      'RMS-999999',
      'Priya Sharma',
      'priya@gmail.com',
      'Ganpati Box',
      298,
      'Cash on Delivery (COD)',
      'Mumbai'
    );
    expect(emailLink).toContain('mailto:keerraj840@gmail.com');
    expect(emailLink).toContain('RMS-999999');
  });
});
