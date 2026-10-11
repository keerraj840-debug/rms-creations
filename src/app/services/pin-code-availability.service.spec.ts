import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { PinCodeAvailabilityService } from './pin-code-availability.service';
import { SupabaseService } from './supabase.service';

describe('PinCodeAvailabilityService', () => {
  let service: PinCodeAvailabilityService;
  let mockRecord: any;

  beforeEach(() => {
    mockRecord = {
      pca_id: 1,
      pca_pin_code: '411038',
      pca_delivery_charges: 50,
      pca_delivery_charges_above_1kg: 40,
      pca_is_available: true,
      pca_state: 'Maharashtra',
      pca_district: 'Pune',
      courier_service: 'DTDC Express'
    };

    const fakeSupabase = {
      from: () => ({
        select: () => ({
          eq: (col: string, val: any) => ({
            eq: () => ({
              maybeSingle: () => {
                if (val === '411038') {
                  return Promise.resolve({ data: mockRecord, error: null });
                } else if (val === '400999') {
                  return Promise.resolve({ data: { ...mockRecord, pca_pin_code: '400999', pca_is_available: false }, error: null });
                }
                return Promise.resolve({ data: null, error: null });
              }
            })
          })
        })
      })
    };

    TestBed.configureTestingModule({
      providers: [
        PinCodeAvailabilityService,
        { provide: SupabaseService, useValue: fakeSupabase }
      ]
    });
    service = TestBed.inject(PinCodeAvailabilityService);
  });

  it('rejects non-6-digit PIN codes immediately', async () => {
    const res = await service.checkDelivery('411', 200, 0.5);
    expect(res.isServiceable).toBe(false);
    expect(res.message).toContain('valid 6-digit');
  });

  it('reports unserviceable for disabled PIN codes', async () => {
    const res = await service.checkDelivery('400999', 200, 0.5);
    expect(res.isServiceable).toBe(false);
    expect(res.message).toContain('not available');
  });

  it('reports unserviceable for unlisted PIN codes', async () => {
    const res = await service.checkDelivery('999999', 200, 0.5);
    expect(res.isServiceable).toBe(false);
  });

  it('calculates standard base charge for parcel up to 1 kg', async () => {
    const res = await service.checkDelivery('411038', 300, 0.8);
    expect(res.isServiceable).toBe(true);
    expect(res.calculatedDeliveryFee).toBe(50);
    expect(res.freeDeliveryApplied).toBe(false);
    expect(res.courierService).toBe('DTDC Express');
  });

  it('adds weight surcharge per kg above 1 kg', async () => {
    // 2.2 kg parcel => base 50 + ceil(2.2 - 1.0) * 40 = 50 + 2 * 40 = 130
    const res = await service.checkDelivery('411038', 300, 2.2);
    expect(res.isServiceable).toBe(true);
    expect(res.calculatedDeliveryFee).toBe(130);
  });

  it('applies free delivery when subtotal meets freeDeliveryThreshold (₹499)', async () => {
    const res = await service.checkDelivery('411038', 599, 1.5);
    expect(res.isServiceable).toBe(true);
    expect(res.calculatedDeliveryFee).toBe(0);
    expect(res.freeDeliveryApplied).toBe(true);
  });
});
