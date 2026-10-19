import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildHamperPageComponent } from './build-hamper-page.component';
import { provideRouter, Router } from '@angular/router';
import { SeoService } from '../shared/seo.service';
import { SupabaseService } from '../services/supabase.service';
import { AuthService } from '../services/auth.service';
import { CustomHamperService } from '../services/custom-hamper.service';
import { CartService } from '../services/cart.service';
import { LocalStorageService } from '../services/local-storage.service';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('BuildHamperPageComponent (Simulation Studio & AI Stylist)', () => {
  let component: BuildHamperPageComponent;
  let fixture: ComponentFixture<BuildHamperPageComponent>;
  let mockSeoService: any;
  let mockSupabaseService: any;
  let mockAuthService: any;
  let mockCustomHamperService: any;
  let mockCartService: any;
  let mockLocalStorageService: any;
  let router: Router;

  const mockCatalogueInclusions = [
    { id: 10, name: 'Pooja Diya', price: 49, is_active: true, description: 'Handmade clay diya' },
    { id: 11, name: 'Essence Candle', price: 10, is_active: true, description: 'Rose aroma candle' },
    { id: 12, name: 'Almonds (Badam)', price: 20, is_active: true, description: 'Crunchy California badam' },
    { id: 13, name: 'Cashew (Kaju)', price: 20, is_active: true, description: 'Whole Goa kaju' },
    { id: 14, name: 'Pistachio (Pista)', price: 20, is_active: true, description: 'Salted pista' },
    { id: 15, name: 'Personalized Greeting Card', price: 50, is_active: true, description: 'Gold embossed card' },
    { id: 17, name: 'Chakli', price: 7.5, is_active: true, description: 'Crispy rice chakli' },
    { id: 19, name: 'Besan Ladoo', price: 10, is_active: true, description: 'Pure ghee besan ladoo' }
  ];

  beforeEach(async () => {
    mockSeoService = {
      setPageMetadata: vi.fn(),
      setBreadcrumbSchema: vi.fn()
    };

    mockSupabaseService = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockCatalogueInclusions,
              error: null
            })
          })
        })
      })
    };

    mockAuthService = {
      currentUser$: of(null),
      currentUser: null,
      isAuthenticated: false
    };

    mockCustomHamperService = {
      submitRequest: vi.fn().mockResolvedValue({ success: true, requestNo: 'CST-2026-TEST' }),
      getHamperItemMarkup: vi.fn().mockResolvedValue(0),
      getHamperMarkupConfig: vi.fn().mockResolvedValue({ percent: 0, fixedAmount: 0 }),
      calculateCustomerItemPrice: vi.fn((base: number, cfg: any) => {
        const pct = Math.round((base * (cfg?.percent || 0)) / 100);
        return base + pct + (cfg?.fixedAmount || 0);
      }),
      updateHamperItemMarkup: vi.fn().mockResolvedValue({ success: true }),
      updateHamperMarkupConfig: vi.fn().mockResolvedValue({ success: true })
    };

    mockCartService = {
      items$: of([]),
      items: [],
      totalItemsCount: 0,
      subtotal: 0,
      addToCart: vi.fn(),
      toastMessage$: of(null)
    };

    mockLocalStorageService = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [BuildHamperPageComponent],
      providers: [
        provideRouter([]),
        { provide: SeoService, useValue: mockSeoService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CustomHamperService, useValue: mockCustomHamperService },
        { provide: CartService, useValue: mockCartService },
        { provide: LocalStorageService, useValue: mockLocalStorageService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true as any);

    fixture = TestBed.createComponent(BuildHamperPageComponent);
    component = fixture.componentInstance;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('should initialize with SEO metadata, default occasion and load catalogue inclusions', () => {
    expect(component).toBeTruthy();
    expect(mockSeoService.setPageMetadata).toHaveBeenCalled();
    expect(component.selectedOccasion).toBe('Diwali Festive');
    expect(component.allCatalogueProducts.length).toBeGreaterThan(0);
    expect(component.hamperItems.length).toBe(0);
    expect(component.totalItemsCount).toBe(0);
  });

  it('should add item to live hamper simulation box and update capacity meter', () => {
    const diyaItem = component.allCatalogueProducts.find(i => i.name.includes('Diya'))!;
    expect(diyaItem).toBeDefined();

    component.addCatalogueItemToHamper(diyaItem);

    expect(component.isItemInHamper(diyaItem.uid)).toBe(true);
    expect(component.getHamperItemQuantity(diyaItem.uid)).toBe(1);
    expect(component.totalItemsCount).toBe(1);
    expect(component.estimatedCatalogueSubtotal).toBe(49);

    // Increase quantity
    component.increaseHamperQuantity(diyaItem.uid);
    expect(component.getHamperItemQuantity(diyaItem.uid)).toBe(2);
    expect(component.estimatedCatalogueSubtotal).toBe(98);

    // Decrease quantity
    component.decreaseHamperQuantity(diyaItem.uid);
    expect(component.getHamperItemQuantity(diyaItem.uid)).toBe(1);

    // Decrease again should remove item from hamper
    component.decreaseHamperQuantity(diyaItem.uid);
    expect(component.isItemInHamper(diyaItem.uid)).toBe(false);
    expect(component.totalItemsCount).toBe(0);
  });


  it('should support AI Surprise Me randomizer', () => {
    component.applyAiSurpriseMe();

    expect(component.hamperItems.length).toBe(5);
    expect(component.totalItemsCount).toBe(5);
  });

  it('should add custom hamper directly to CartService and navigate to /cart', () => {
    // Add 2 items
    const candle = component.allCatalogueProducts.find(i => i.name.includes('Candle'))!;
    const ladoo = component.allCatalogueProducts.find(i => i.name.includes('Ladoo'))!;
    component.addCatalogueItemToHamper(candle);
    component.addCatalogueItemToHamper(ladoo);
    component.personalMessage = 'Happy Diwali!';

    component.addCustomHamperToCartAndCheckout();

    expect(mockCartService.addToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'Custom Hamper',
        price: component.estimatedCatalogueSubtotal,
        notes: expect.stringContaining('Happy Diwali!')
      }),
      1
    );
    expect(router.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('should construct accurate WhatsApp order message and open wa.me link', () => {
    const diya = component.allCatalogueProducts.find(i => i.name.includes('Diya'))!;
    component.addCatalogueItemToHamper(diya);
    component.personalMessage = 'Best wishes from the Sharma family';

    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    component.orderViaWhatsApp();

    expect(windowOpenSpy).toHaveBeenCalledWith(
      expect.stringContaining('https://wa.me/919284905118?text='),
      '_blank'
    );
  });

  it('should calculate customer display price as basePrice + percent + fixed surcharge when admin configures markup', async () => {
    mockCustomHamperService.getHamperMarkupConfig.mockResolvedValue({ percent: 10, fixedAmount: 15 });
    await component.loadCatalogueItems();

    expect(component.hamperMarkup).toBe(15);
    const diya = component.allCatalogueProducts.find(i => i.name.includes('Diya'))!;
    expect(diya.basePrice).toBe(49);
    // 49 + 10% (5) + 15 = 69
    expect(diya.price).toBe(69);

    const candle = component.allCatalogueProducts.find(i => i.name.includes('Candle'))!;
    expect(candle.basePrice).toBe(10);
    // 10 + 10% (1) + 15 = 26
    expect(candle.price).toBe(26);
  });

  it('should open review modal for request workflow and require 6-digit delivery PIN', async () => {
    const candle = component.allCatalogueProducts.find(i => i.name.includes('Candle'))!;
    component.addCatalogueItemToHamper(candle);

    component.openReviewModal();
    expect(component.showReviewModal).toBe(true);

    component.customerName = 'Test User';
    component.customerPhone = '9876543210';
    component.customerEmail = 'test@example.com';
    component.deliveryPinCode = '123'; // invalid

    await component.submitConsultationRequest();
    expect(component.submitErrorMessage).toContain('valid 6-digit delivery PIN code');
    expect(mockCustomHamperService.submitRequest).not.toHaveBeenCalled();

    // With valid PIN and authenticated user
    component.deliveryPinCode = '411038';
    component.deliveryCity = 'Pune';
    mockAuthService.isAuthenticated = true;
    mockAuthService.currentUser = { id: 1, name: 'Test User', email: 'test@example.com' };

    await component.submitConsultationRequest();
    expect(mockCustomHamperService.submitRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_name: 'Test User',
        customer_notes: expect.stringContaining('Delivery PIN: 411038 (Pune)')
      }),
      expect.any(Array)
    );
    expect(component.showSuccessModal).toBe(true);
    expect(component.createdRequestNo).toBe('CST-2026-TEST');
  });
});
