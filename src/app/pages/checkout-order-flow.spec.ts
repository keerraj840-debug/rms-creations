import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PinCodeAvailabilityService, DeliveryCheckResult } from '../services/pin-code-availability.service';
import { SupabaseService } from '../services/supabase.service';
import { CartService } from '../services/cart.service';
import { LocalStorageService } from '../services/local-storage.service';

describe('Ecommerce Order Processing & PIN Delivery Calculations', () => {
  let pinService: PinCodeAvailabilityService;
  let mockSupabase: any;
  let cartService: CartService;
  let mockStorage: Record<string, any>;

  beforeEach(() => {
    mockStorage = {};
    const fakeLocalStorageService = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: any) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; }
    };

    mockSupabase = {
      from: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CartService,
        PinCodeAvailabilityService,
        { provide: SupabaseService, useValue: mockSupabase },
        { provide: LocalStorageService, useValue: fakeLocalStorageService }
      ]
    });

    cartService = TestBed.inject(CartService);
    pinService = TestBed.inject(PinCodeAvailabilityService);
  });

  describe('PIN Service Delivery Charging Rules', () => {
    it('should reject invalid PIN formats (non-6-digit, letters, empty)', async () => {
      const emptyRes = await pinService.checkDelivery('', 500, 0.5);
      expect(emptyRes.isServiceable).toBe(false);
      expect(emptyRes.message).toContain('valid 6-digit');

      const shortRes = await pinService.checkDelivery('4000', 500, 0.5);
      expect(shortRes.isServiceable).toBe(false);

      const alphaRes = await pinService.checkDelivery('ABCDEF', 500, 0.5);
      expect(alphaRes.isServiceable).toBe(false);
    });

    it('should report unserviceable when PIN is not found or pca_is_available is false', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { pca_pin_code: '499999', pca_is_available: false },
                error: null
              })
            })
          })
        })
      });

      const res = await pinService.checkDelivery('499999', 600, 1.0);
      expect(res.isServiceable).toBe(false);
      expect(res.calculatedDeliveryFee).toBe(0);
      expect(res.message).toContain('not available for PIN code 499999');
    });

    it('should apply Free Delivery when subtotal is >= 499 for serviceable PIN', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  pca_pin_code: '400001',
                  pca_is_available: true,
                  pca_delivery_charges: 60,
                  pca_delivery_charges_above_1kg: 30,
                  pca_district: 'Mumbai',
                  pca_state: 'Maharashtra',
                  courier_service: 'Bluedart Express'
                },
                error: null
              })
            })
          })
        })
      });

      const res = await pinService.checkDelivery('400001', 599, 0.5);
      expect(res.isServiceable).toBe(true);
      expect(res.freeDeliveryApplied).toBe(true);
      expect(res.calculatedDeliveryFee).toBe(0);
      expect(res.district).toBe('Mumbai');
    });

    it('should charge base delivery fee when subtotal is < 499 and weight <= 1.0 kg', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  pca_pin_code: '400050',
                  pca_is_available: true,
                  pca_delivery_charges: 70,
                  pca_delivery_charges_above_1kg: 35,
                  pca_district: 'Mumbai Suburban',
                  pca_state: 'Maharashtra'
                },
                error: null
              })
            })
          })
        })
      });

      const res = await pinService.checkDelivery('400050', 350, 0.8);
      expect(res.isServiceable).toBe(true);
      expect(res.freeDeliveryApplied).toBe(false);
      expect(res.calculatedDeliveryFee).toBe(70);
    });

    it('should accurately calculate incremental weight fee for packages heavier than 1.0 kg', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  pca_pin_code: '411001',
                  pca_is_available: true,
                  pca_delivery_charges: 80,
                  pca_delivery_charges_above_1kg: 40,
                  pca_district: 'Pune',
                  pca_state: 'Maharashtra'
                },
                error: null
              })
            })
          })
        })
      });

      // Package weight 2.5 kg: Base covers 1kg. Extra is 1.5kg -> Math.ceil(1.5) = 2 extra kg
      // Expected fee = 80 + (2 * 40) = 160
      const res = await pinService.checkDelivery('411001', 400, 2.5);
      expect(res.isServiceable).toBe(true);
      expect(res.freeDeliveryApplied).toBe(false);
      expect(res.calculatedDeliveryFee).toBe(160);
    });
  });

  describe('Cart Calculations and Price Protection', () => {
    it('should correctly sum item quantities, weights, and calculate finalTotal with delivery fee', () => {
      cartService.addToCart({
        id: 'item-1',
        productId: 10,
        title: 'Luxury Diwali Gift Hamper',
        price: 999,
        image: 'hamper.jpg',
        weight_kg: 1.2
      }, 2);

      expect(cartService.subtotal).toBe(1998);
      expect(cartService.totalItemsCount).toBe(2);
      expect(cartService.totalWeightKg).toBe(2.4);

      // Verified delivery fee applied (free delivery because 1998 >= 499)
      cartService.setVerifiedDeliveryFee(0);
      expect(cartService.finalTotal).toBe(1998);

      // If delivery fee is 50
      cartService.setVerifiedDeliveryFee(50);
      expect(cartService.finalTotal).toBe(2048);
    });

    it('should clamp quantities correctly and prevent negative or zero items', () => {
      cartService.addToCart({
        id: 'item-2',
        title: 'Mini Sweet Box',
        image: 'box.jpg',
        price: 250
      }, 1);

      cartService.updateQuantity('item-2', 0);
      expect(cartService.items.length).toBe(0);
    });
  });
});
