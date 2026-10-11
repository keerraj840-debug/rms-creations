import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CartService } from './cart.service';
import { LocalStorageService } from './local-storage.service';

describe('CartService', () => {
  let service: CartService;
  let mockStorage: Record<string, any>;

  beforeEach(() => {
    mockStorage = {};
    const fakeLocalStorageService = {
      getItem: (k: string) => mockStorage[k] || null,
      setItem: (k: string, v: any) => { mockStorage[k] = v; },
      removeItem: (k: string) => { delete mockStorage[k]; }
    };

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: LocalStorageService, useValue: fakeLocalStorageService }
      ]
    });
    service = TestBed.inject(CartService);
  });

  it('should initialize empty cart', () => {
    expect(service.items.length).toBe(0);
    expect(service.totalItemsCount).toBe(0);
    expect(service.subtotal).toBe(0);
  });

  it('should add item and update totals', () => {
    service.addToCart({
      id: 'prod-1',
      title: 'Ganpati Pooja Box',
      price: 149,
      image: 'img.jpg'
    }, 2);

    expect(service.items.length).toBe(1);
    expect(service.totalItemsCount).toBe(2);
    expect(service.subtotal).toBe(298);
    // Under 499 => delivery is 49
    expect(service.deliveryFee).toBe(49);
    expect(service.finalTotal).toBe(347);
  });

  it('should qualify for free delivery when subtotal >= 499', () => {
    service.addToCart({
      id: 'prod-2',
      title: 'Festive Luxury Hamper',
      price: 999,
      image: 'img.jpg'
    }, 1);

    expect(service.subtotal).toBe(999);
    expect(service.deliveryFee).toBe(0);
    expect(service.finalTotal).toBe(999);
  });

  it('should increment existing item quantity when added again', () => {
    service.addToCart({
      id: 'prod-1',
      title: 'Box',
      price: 100,
      image: 'img.jpg'
    }, 1);

    service.addToCart({
      id: 'prod-1',
      title: 'Box',
      price: 100,
      image: 'img.jpg'
    }, 2);

    expect(service.items.length).toBe(1);
    expect(service.items[0].quantity).toBe(3);
    expect(service.subtotal).toBe(300);
  });

  it('should update quantity and remove when 0', () => {
    service.addToCart({
      id: 'prod-1',
      title: 'Box',
      price: 100,
      image: 'img.jpg'
    }, 2);

    service.updateQuantity('prod-1', 4);
    expect(service.items[0].quantity).toBe(4);

    service.updateQuantity('prod-1', 0);
    expect(service.items.length).toBe(0);
  });

  it('should clear all items', () => {
    service.addToCart({
      id: 'prod-1',
      title: 'Box',
      price: 100,
      image: 'img.jpg'
    }, 1);

    service.clearCart();
    expect(service.items.length).toBe(0);
    expect(service.subtotal).toBe(0);
  });
});
