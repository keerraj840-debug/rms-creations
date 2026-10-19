import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CustomerAddressService } from './customer-address.service';
import { SupabaseService } from './supabase.service';

describe('CustomerAddressService', () => {
  let service: CustomerAddressService;

  beforeEach(() => {
    const fakeSupabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () => ({
                order: () => Promise.resolve({ data: [], error: null })
              })
            })
          })
        })
      })
    };

    TestBed.configureTestingModule({
      providers: [
        CustomerAddressService,
        { provide: SupabaseService, useValue: fakeSupabase }
      ]
    });
    service = TestBed.inject(CustomerAddressService);
  });

  it('validates correct 6-digit Indian PIN code and address', () => {
    const res = service.validateAddress({
      address: 'Flat 402, Royal Palms, FC Road',
      city: 'Pune',
      state: 'Maharashtra',
      pin_code: '411004'
    });

    expect(res.valid).toBe(true);
    expect(res.error).toBeUndefined();
  });

  it('rejects empty street address', () => {
    const res = service.validateAddress({
      address: '',
      city: 'Pune',
      state: 'Maharashtra',
      pin_code: '411004'
    });

    expect(res.valid).toBe(false);
    expect(res.error).toContain('Street address');
  });

  it('rejects invalid PIN code format', () => {
    const res1 = service.validateAddress({
      address: 'Shop 12',
      city: 'Pune',
      state: 'Maharashtra',
      pin_code: '4110' // 4 digits
    });
    expect(res1.valid).toBe(false);
    expect(res1.error).toContain('6-digit');

    const res2 = service.validateAddress({
      address: 'Shop 12',
      city: 'Pune',
      state: 'Maharashtra',
      pin_code: 'ABC411' // non-numeric
    });
    expect(res2.valid).toBe(false);
  });

  it('requires user authentication to save an address', async () => {
    const res = await service.saveAddress(0, {
      address_type: 'Home',
      address: 'Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pin_code: '400001'
    });

    expect(res.data).toBeNull();
    expect(res.error).toContain('User must be authenticated');
  });
});
