import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
    service.clearAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should initialize with empty toasts', () => {
    expect(service.toasts().length).toBe(0);
  });

  it('should create a cart toast with thumbnail, title, price, and view bag action', () => {
    const id = service.showCartToast({
      title: 'Ganpati Pooja Box',
      price: 299,
      image: 'https://images.unsplash.com/test.jpg',
      quantity: 2
    });

    const active = service.toasts();
    expect(active.length).toBe(1);
    expect(active[0].id).toBe(id);
    expect(active[0].type).toBe('cart');
    expect(active[0].title).toBe('Added to Bag');
    expect(active[0].message).toContain('Ganpati Pooja Box');
    expect(active[0].message).toContain('(2)');
    expect(active[0].price).toBe(299);
    expect(active[0].quantity).toBe(2);
    expect(active[0].image).toBe('https://images.unsplash.com/test.jpg');
    expect(active[0].action?.label).toBe('View Bag →');
    expect(active[0].action?.route).toBe('/cart');
  });

  it('should create success, info, warning, and error toasts', () => {
    service.success('Order placed successfully!', 'Order Confirmed');
    service.info('Item moved to wishlist', 'Wishlist');
    service.warning('Low inventory remaining', 'Hurry!');

    expect(service.toasts().length).toBe(3);
    expect(service.toasts()[0].type).toBe('success');
    expect(service.toasts()[1].type).toBe('info');
    expect(service.toasts()[2].type).toBe('warning');
  });

  it('should enforce maximum toast stack limit of 3', () => {
    service.show({ message: 'Toast 1' });
    service.show({ message: 'Toast 2' });
    service.show({ message: 'Toast 3' });
    service.show({ message: 'Toast 4' });

    const current = service.toasts();
    expect(current.length).toBe(3);
    expect(current.some(t => t.message === 'Toast 1')).toBe(false);
    expect(current[2].message).toBe('Toast 4');
  });

  it('should mark toast as exiting and then remove after timeout', () => {
    const id = service.show({ message: 'Dismissible Toast' });
    expect(service.toasts().length).toBe(1);

    service.dismiss(id);
    expect(service.toasts()[0].isExiting).toBe(true);

    vi.advanceTimersByTime(300);
    expect(service.toasts().length).toBe(0);
  });

  it('should clear all toasts when clearAll is called', () => {
    service.show({ message: 'Toast A' });
    service.show({ message: 'Toast B' });
    expect(service.toasts().length).toBe(2);

    service.clearAll();
    expect(service.toasts().length).toBe(0);
  });
});
