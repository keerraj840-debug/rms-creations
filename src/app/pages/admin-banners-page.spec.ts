import { TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminBannersPageComponent, BannerItem } from './admin-banners-page.component';
import { SupabaseService } from '../services/supabase.service';
import { provideRouter } from '@angular/router';

describe('AdminBannersPageComponent (Banner Management & Aspect Ratio)', () => {
  let component: AdminBannersPageComponent;
  let mockSupabase: any;

  beforeEach(async () => {
    mockSupabase = {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { email: 'rmsgifthampers@gmail.com' }
          }
        }
      }),
      from: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AdminBannersPageComponent],
      providers: [
        { provide: SupabaseService, useValue: mockSupabase },
        provideRouter([])
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminBannersPageComponent);
    component = fixture.componentInstance;
  });

  it('fetches banners and counts active and inactive banners correctly', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: [
            { id: 1, name: 'Diwali Mega Sale', image: 'assets/banners/1.jpg', is_active: true },
            { id: 2, name: 'Valentine Specials', image: 'assets/banners/2.jpg', is_active: false }
          ],
          error: null
        })
      })
    });

    await component.fetchBanners();

    expect(component.banners.length).toBe(2);
    expect(component.activeBannersCount).toBe(1);
    expect(component.errorMessage).toBe('');
  });

  it('successfully deactivates a live banner and updates state when database returns updated row', async () => {
    const testBanner: BannerItem = {
      id: 1,
      name: 'Festive Hampers',
      image: 'assets/banners/festive.jpg',
      navigate_to_url_on_click: '/shop',
      is_active: true
    };
    component.banners = [testBanner];

    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: 1, is_active: false }],
      error: null
    });
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

    mockSupabase.from.mockReturnValue({ update: mockUpdate });

    await component.toggleBannerStatus(testBanner);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ is_active: false })
    );
    expect(testBanner.is_active).toBe(false);
    expect(component.successMessage).toContain('Deactivated');
    expect(component.errorMessage).toBe('');
  });

  it('safely rejects deactivation and surfaces error if database returns 0 rows updated', async () => {
    const testBanner: BannerItem = {
      id: 5,
      name: 'Expired Promotion',
      image: 'assets/banners/expired.jpg',
      navigate_to_url_on_click: '/shop',
      is_active: true
    };
    component.banners = [testBanner];

    // Simulate RLS rejection returning 0 rows
    const mockSelect = vi.fn().mockResolvedValue({
      data: [],
      error: null
    });
    const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
    const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });

    mockSupabase.from.mockReturnValue({ update: mockUpdate });

    await component.toggleBannerStatus(testBanner);

    // Banner must stay true because database rejected the update
    expect(testBanner.is_active).toBe(true);
    expect(component.errorMessage).toContain('0 rows changed');
  });

  it('alerts if admin session is expired when attempting to toggle banner', async () => {
    mockSupabase.getSession.mockResolvedValueOnce({
      data: { session: null }
    });

    const testBanner: BannerItem = {
      id: 1,
      name: 'Banner',
      image: 'img.jpg',
      navigate_to_url_on_click: '/shop',
      is_active: true
    };

    await component.toggleBannerStatus(testBanner);

    expect(testBanner.is_active).toBe(true);
    expect(component.errorMessage).toContain('session has expired');
  });
});
