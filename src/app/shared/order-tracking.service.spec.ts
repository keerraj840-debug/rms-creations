import { TestBed } from '@angular/core/testing';
import { OrderTrackingService } from './order-tracking.service';
import { SupabaseService } from '../services/supabase.service';

describe('OrderTrackingService', () => {
  let service: OrderTrackingService;
  let mockSupabase: any;
  let insertSpy: any;

  beforeEach(() => {
    localStorage.clear();
    insertSpy = vi.fn().mockResolvedValue({ data: null, error: null });
    mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: insertSpy
      })
    };

    TestBed.configureTestingModule({
      providers: [
        OrderTrackingService,
        { provide: SupabaseService, useValue: mockSupabase }
      ]
    });
    service = TestBed.inject(OrderTrackingService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty orders in fresh state', () => {
    expect(service.getOrders()).toEqual([]);
  });

  it('should record an order and sync to purchase_order', () => {
    const entry = service.recordOrder({
      title: 'Luxury Diwali Hamper',
      category: 'Hampers',
      page: '/hampers',
      link: 'https://example.com/hamper',
      price: 1599
    });

    expect(entry).toBeTruthy();
    expect(entry.title).toBe('Luxury Diwali Hamper');
    expect(entry.price).toBe(1599);
    expect(entry.id).toBeTruthy();
    expect(entry.timestamp).toBeTruthy();

    const orders = service.getOrders();
    expect(orders.length).toBe(1);
    expect(orders[0].title).toBe('Luxury Diwali Hamper');

    expect(mockSupabase.from).toHaveBeenCalledWith('purchase_order');
    expect(insertSpy).toHaveBeenCalled();
  });

  it('should clear stored orders', () => {
    service.recordOrder({
      title: 'Sample Gift',
      category: 'Gifts',
      page: '/return-gifts',
      link: 'https://example.com/gifts'
    });
    expect(service.getOrders().length).toBe(1);

    service.clearOrders();
    expect(service.getOrders().length).toBe(0);
  });
});
