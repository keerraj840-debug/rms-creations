import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopPageComponent, ShopProduct } from './shop-page.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { CartService } from '../services/cart.service';
import { BehaviorSubject, of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('ShopPageComponent', () => {
  let component: ShopPageComponent;
  let fixture: ComponentFixture<ShopPageComponent>;
  let mockSeoService: any;
  let mockSupabaseService: any;
  let mockCartService: any;
  let queryParams$: BehaviorSubject<any>;

  const mockProduct: ShopProduct = {
    id: 101,
    name: 'Luxury Ganpati Pooja Hamper',
    description: 'Festive hamper with premium pooja items',
    price: 499,
    originalPrice: 699,
    category: 'Ganpati Hampers',
    image: 'assets/banners/banner.png',
    images: ['assets/banners/banner.png'],
    inStock: true
  };

  beforeEach(async () => {
    queryParams$ = new BehaviorSubject<any>({});

    mockSeoService = {
      setPageMetadata: vi.fn(),
      setBreadcrumbSchema: vi.fn()
    };

    mockSupabaseService = {
      from: vi.fn().mockImplementation((table: string) => {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockResolvedValue({ data: [], error: null })
            }),
            order: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        };
      })
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
      }),
      updateQuantity: vi.fn().mockImplementation((itemId: string, qty: number) => {
        const index = cartItems.findIndex(i => i.id === itemId);
        if (index > -1) {
          if (qty <= 0) {
            cartItems.splice(index, 1);
          } else {
            cartItems[index].quantity = qty;
          }
        }
        mockCartService.totalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
      })
    };

    await TestBed.configureTestingModule({
      imports: [ShopPageComponent],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: mockSeoService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: CartService, useValue: mockCartService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParams$.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopPageComponent);
    component = fixture.componentInstance;
  });

  it('should initialize and call SEO setPageMetadata', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(mockSeoService.setPageMetadata).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'shop' })
    );
  });

  it('should handle adding product to cart with quantity 1', () => {
    component.addToCart(mockProduct, 1);
    expect(mockCartService.addToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: mockProduct.id,
        price: 499,
        title: mockProduct.name
      }),
      1
    );
    expect(component.getCartQty(mockProduct.id)).toBe(1);
  });

  it('should increment quantity when incrementCartQty is called', () => {
    component.addToCart(mockProduct, 1);
    component.incrementCartQty(mockProduct);
    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(String(mockProduct.id), 2);
    expect(component.getCartQty(mockProduct.id)).toBe(2);
  });

  it('should decrement quantity and remove when quantity reaches 0', () => {
    component.addToCart(mockProduct, 1);
    expect(component.getCartQty(mockProduct.id)).toBe(1);

    component.decrementCartQty(mockProduct);
    expect(mockCartService.updateQuantity).toHaveBeenCalledWith(String(mockProduct.id), 0);
    expect(component.getCartQty(mockProduct.id)).toBe(0);
  });

  it('should filter products correctly by search and budget', () => {
    component.products = [
      mockProduct,
      {
        id: 102,
        name: 'Budget Chocolates',
        description: 'Sweet treats',
        price: 150,
        category: 'Chocolates',
        image: '',
        images: [],
        inStock: true
      }
    ];

    component.searchQuery = 'Ganpati';
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe(101);

    component.searchQuery = '';
    component.selectedBudget = 'under-200';
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].id).toBe(102);

    component.resetFilters();
    expect(component.selectedBudget).toBe('all');
    expect(component.searchQuery).toBe('');
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should default mobileViewMode to grid and calculate category count correctly', () => {
    expect(component.mobileViewMode).toBe('grid');
    component.products = [
      mockProduct,
      {
        id: 102,
        name: 'Budget Chocolates',
        description: 'Sweet treats',
        price: 150,
        category: 'Chocolates',
        image: '',
        images: [],
        inStock: true
      }
    ];

    expect(component.getCategoryCount('All')).toBe(2);
    expect(component.getCategoryCount('Ganpati Hampers')).toBe(1);
    expect(component.getCategoryCount('Chocolates')).toBe(1);
    expect(component.getCategoryCount('NonExistent')).toBe(0);
  });
});
