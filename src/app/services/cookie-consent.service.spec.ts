import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieConsentService } from './cookie-consent.service';
import { LocalStorageService } from './local-storage.service';

describe('CookieConsentService', () => {
  let service: CookieConsentService;
  let mockStorage: Record<string, any>;
  let mockLocalStorageService: any;

  beforeEach(() => {
    mockStorage = {};
    mockLocalStorageService = {
      getItem: vi.fn((key: string) => (mockStorage[key] !== undefined ? mockStorage[key] : null)),
      setItem: vi.fn((key: string, value: any) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      })
    };

    (globalThis as any).window = (globalThis as any).window || {};
    delete (window as any)['ga-disable-G-RMSCREATION'];
    (window as any).gtag = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        CookieConsentService,
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(CookieConsentService);
  });

  it('should initialize with hasDecided = false if no stored preference', () => {
    expect(service.hasDecided()).toBe(false);
    expect(service.preferences().essential).toBe(true);
    expect(service.preferences().analytics).toBe(false);
    expect((window as any)['ga-disable-G-RMSCREATION']).toBe(true);
  });

  it('should allow acceptAll and enable GA4', () => {
    service.acceptAll();
    expect(service.hasDecided()).toBe(true);
    expect(service.preferences().analytics).toBe(true);
    expect((window as any)['ga-disable-G-RMSCREATION']).toBe(false);
    expect((window as any).gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted'
    });
    expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
      'rms_cookie_consent_v1',
      expect.objectContaining({ analytics: true, essential: true })
    );
  });

  it('should allow rejectNonEssential and disable GA4', () => {
    service.rejectNonEssential();
    expect(service.hasDecided()).toBe(true);
    expect(service.preferences().analytics).toBe(false);
    expect((window as any)['ga-disable-G-RMSCREATION']).toBe(true);
    expect((window as any).gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'denied'
    });
    expect(mockLocalStorageService.setItem).toHaveBeenCalledWith(
      'rms_cookie_consent_v1',
      expect.objectContaining({ analytics: false, essential: true })
    );
  });

  it('should toggle preferences modal', () => {
    expect(service.showPreferencesModal()).toBe(false);
    service.openPreferences();
    expect(service.showPreferencesModal()).toBe(true);
    service.closePreferences();
    expect(service.showPreferencesModal()).toBe(false);
  });

  it('should save custom preferences correctly', () => {
    service.openPreferences();
    service.saveCustom(true);
    expect(service.preferences().analytics).toBe(true);
    expect(service.showPreferencesModal()).toBe(false);
    expect(service.hasDecided()).toBe(true);
  });
});
