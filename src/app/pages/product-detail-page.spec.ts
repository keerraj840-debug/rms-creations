import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailPageComponent } from './product-detail-page.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { CartService } from '../services/cart.service';
import { PinCodeAvailabilityService } from '../services/pin-code-availability.service';
import { BehaviorSubject, of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ProductDetailPageComponent', () => {
  let component: ProductDetailPageComponent;
  let fixture: ComponentFixture<ProductDetailPageComponent>;
  let mockSeoService: any;
  let mockSupabaseService: any;
  let mockCartService: any;
  let mockPinService: any;
  let paramMap$: BehaviorSubject<any>;

  beforeEach(async () => {
    paramMap$ = new BehaviorSubject<any>({
      get: (key: string) => (key === 'id' ? '101' : null)
    });

    mockSeoService = {
      setPageMetadata: vi.fn(),
      setBreadcrumbSchema: vi.fn(),
      setProductSchema: vi.fn(),
      removeJsonLd: vi.fn()
    };

    mockSupabaseService = {
      from: vi.fn().mockImplementation((table: string) => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                id: 101,
                name: 'Festive Sweet Box',
                description: 'Assorted artisan sweets',
                price: 599,
                selling_price: 599,
                is_active: true
              },
              error: null
            })
          })
        })
      }))
    };

    const cartItems: any[] = [];
    mockCartService = {
      items: cartItems,
      totalItemsCount: 0,
      subtotal: 0,
      addToCart: vi.fn().mockImplementation((item: any, qty: number = 1) => {
        const existing = cartItems.find(i => i.productId === item.productId || i.id === item.id);
        if (existing) {
          existing.quantity += qty;
        } else {
          cartItems.push({ ...item, quantity: qty });
        }
        mockCartService.totalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
      })
    };

    mockPinService = {
      checkDelivery: vi.fn().mockResolvedValue({ isServiceable: true, message: 'Delivery available' })
    };

    await TestBed.configureTestingModule({
      imports: [ProductDetailPageComponent],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: mockSeoService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: CartService, useValue: mockCartService },
        { provide: PinCodeAvailabilityService, useValue: mockPinService },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMap$.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailPageComponent);
    component = fixture.componentInstance;
  });

  it('should initialize and handle quantity increment and decrement', () => {
    expect(component.quantity).toBe(1);
    component.incrementQty();
    expect(component.quantity).toBe(2);
    component.decrementQty();
    expect(component.quantity).toBe(1);
    // Should not go below 1
    component.decrementQty();
    expect(component.quantity).toBe(1);
  });

  it('should add product to cart with selected quantity and update cartItemQty', () => {
    component.product = {
      id: 101,
      name: 'Festive Sweet Box',
      description: 'Assorted artisan sweets',
      price: 599,
      originalPrice: 699,
      category: 'Festive Hampers',
      image: 'assets/banners/banner.png',
      images: ['assets/banners/banner.png'],
      inStock: true
    };

    expect(component.cartItemQty).toBe(0);
    component.quantity = 3;
    component.onAddToCart();

    expect(mockCartService.addToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 101,
        title: 'Festive Sweet Box',
        price: 599
      }),
      3,
      undefined
    );

    expect(component.cartItemQty).toBe(3);
  });
});
