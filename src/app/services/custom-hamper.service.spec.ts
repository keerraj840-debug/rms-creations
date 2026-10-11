import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomHamperService } from './custom-hamper.service';
import { SupabaseService } from './supabase.service';
import { LocalStorageService } from './local-storage.service';
import { CustomHamperRequest, CustomHamperRequestItem } from '../models/custom-hamper.model';

describe('CustomHamperService (Build Your Own Hamper & Consultation Flow)', () => {
  let service: CustomHamperService;
  let mockSupabase: any;
  let mockLocalStorage: any;
  let storageState: Record<string, any>;

  beforeEach(() => {
    storageState = {};

    mockLocalStorage = {
      getItem: vi.fn((key: string) => storageState[key] || null),
      setItem: vi.fn((key: string, val: any) => { storageState[key] = val; }),
      removeItem: vi.fn((key: string) => { delete storageState[key]; })
    };

    mockSupabase = {
      from: vi.fn((table: string) => ({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ 
              data: table === 'purchase_order' 
                ? { purchase_order_id: 101, purchase_order_no: 'RMS-CH-123456' }
                : { id: 99, request_no: 'CHR-20261011-8888' }, 
              error: null 
            })
          })
        }),
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
            order: vi.fn().mockResolvedValue({ data: [], error: null })
          }),
          order: vi.fn().mockResolvedValue({ data: [], error: null })
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      }))
    };

    TestBed.configureTestingModule({
      providers: [
        CustomHamperService,
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: LocalStorageService, useValue: mockLocalStorage }
      ]
    });

    service = TestBed.inject(CustomHamperService);
  });

  it('generates unique consultation reference numbers starting with CHR-', () => {
    const ref1 = service.generateRequestNo();
    const ref2 = service.generateRequestNo();
    expect(ref1).toMatch(/^CHR-\d{8}-\d{4}$/);
    expect(ref2).toMatch(/^CHR-\d{8}-\d{4}$/);
  });

  it('submits a request and calculates confirmed catalogue subtotal while leaving custom items unpriced', async () => {
    const payload = {
      customer_name: 'Ananya Deshmukh',
      customer_email: 'ananya@example.com',
      customer_phone: '9876543210',
      occasion: 'Ganesh Utsav Special',
      theme: 'Festive Gold & Maroon',
      recipient_gender: 'Unisex',
      personal_message: 'Happy Ganesh Chaturthi!',
      customer_notes: 'Spill-proof pooja box packaging',
      estimated_catalogue_total: 0
    };

    const items: Omit<CustomHamperRequestItem, 'id' | 'request_id'>[] = [
      {
        item_type: 'catalogue_product',
        product_id: 1,
        item_name: 'Ganpati Essential Pooja Kit',
        quantity: 2,
        unit_price_snapshot: 99,
        is_confirmed_catalogue: true
      },
      {
        item_type: 'custom_requested',
        item_name: 'Handcrafted Brass Aarti Diya',
        item_description: 'With floral engraved handle',
        quantity: 1,
        unit_price_snapshot: null, // Price not confirmed
        reference_image_url: 'https://example.com/diya.jpg',
        is_confirmed_catalogue: false
      }
    ];

    const result = await service.submitRequest(payload, items);
    expect(result.success).toBe(true);
    expect(result.requestNo).toBeDefined();
    expect(result.request?.estimated_catalogue_total).toBe(198); // 99 * 2
    expect(result.request?.status).toBe('New');
    expect(result.request?.quoted_total).toBeNull();
  });

  it('allows admin to prepare quotation with confirmed custom item prices and personalized message', async () => {
    // Seed initial request
    const req: CustomHamperRequest = {
      id: 50,
      request_no: 'CHR-20261011-5555',
      customer_name: 'Rahul Kulkarni',
      customer_email: 'rahul@example.com',
      customer_phone: '9988776655',
      status: 'New',
      estimated_catalogue_total: 149,
      items: [
        {
          id: 1,
          request_id: 50,
          item_type: 'custom_requested',
          item_name: 'Custom Silver Coin',
          quantity: 1,
          unit_price_snapshot: null,
          admin_confirmed_price: null,
          is_confirmed_catalogue: false
        }
      ]
    };
    storageState['rms_custom_hamper_requests_cache'] = [req];

    const quoteResult = await service.updateAdminQuotation('CHR-20261011-5555', {
      quoted_total: 449, // 149 catalogue + 300 silver coin
      quoted_delivery_charge: 49,
      admin_response: 'We have sourced the 10g 999 silver coin with Ganpati embossing.',
      admin_notes: 'Purchased from local jeweler at ₹260 cost',
      status: 'Quotation Prepared',
      itemPriceUpdates: [
        { itemName: 'Custom Silver Coin', confirmedPrice: 300 }
      ]
    });

    expect(quoteResult.success).toBe(true);

    const updated = await service.getRequestDetails('CHR-20261011-5555');
    expect(updated?.status).toBe('Quotation Prepared');
    expect(updated?.quoted_total).toBe(449);
    expect(updated?.quoted_delivery_charge).toBe(49);
    expect(updated?.admin_response).toContain('silver coin');
    expect(updated?.items?.[0].admin_confirmed_price).toBe(300);
  });

  it('converts an accepted quotation into exactly one confirmed order and links order number', async () => {
    const req: CustomHamperRequest = {
      id: 60,
      request_no: 'CHR-20261011-6666',
      customer_name: 'Sneha Patil',
      customer_email: 'sneha@example.com',
      customer_phone: '9822001122',
      status: 'Quotation Prepared',
      estimated_catalogue_total: 200,
      quoted_total: 500,
      quoted_delivery_charge: 49,
      admin_response: 'All items ready for packing.',
      items: [
        {
          id: 2,
          request_id: 60,
          item_type: 'catalogue_product',
          item_name: 'Festive Box',
          quantity: 1,
          unit_price_snapshot: 200,
          is_confirmed_catalogue: true
        }
      ]
    };
    storageState['rms_custom_hamper_requests_cache'] = [req];

    const acceptRes = await service.acceptQuotationAndCreateOrder('CHR-20261011-6666', {
      address: 'Flat 402, Royal Palms, Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411038',
      phone: '9822001122',
      paymentMode: 'COD'
    });

    expect(acceptRes.success).toBe(true);
    expect(acceptRes.orderNo).toMatch(/^RMS-CH-\d+/);

    const updated = await service.getRequestDetails('CHR-20261011-6666');
    expect(updated?.status).toBe('Accepted');
    expect(updated?.converted_order_no).toBe(acceptRes.orderNo);

    // Prevent duplicate acceptance
    const secondAccept = await service.acceptQuotationAndCreateOrder('CHR-20261011-6666', {
      address: 'Flat 402',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411038',
      phone: '9822001122',
      paymentMode: 'COD'
    });
    expect(secondAccept.success).toBe(false);
    expect(secondAccept.error).toContain('already been accepted');
  });

  it('updates status to Declined without creating any order if customer declines', async () => {
    const req: CustomHamperRequest = {
      id: 70,
      request_no: 'CHR-20261011-7777',
      customer_name: 'Pooja Joshi',
      customer_email: 'pooja@example.com',
      customer_phone: '9111222333',
      status: 'Quotation Prepared',
      estimated_catalogue_total: 100,
      quoted_total: 600,
      items: []
    };
    storageState['rms_custom_hamper_requests_cache'] = [req];

    const declineRes = await service.declineQuotation('CHR-20261011-7777', 'Over budget');
    expect(declineRes.success).toBe(true);

    const updated = await service.getRequestDetails('CHR-20261011-7777');
    expect(updated?.status).toBe('Declined');
    expect(updated?.converted_order_no).toBeUndefined();
    expect(updated?.customer_notes).toContain('[Customer Declined: Over budget]');
  });
});
