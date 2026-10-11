import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { LocalStorageService } from './local-storage.service';

describe('authGuard', () => {
  let routerSpy: { parseUrl: ReturnEvent };
  let localStorageSpy: { getItem: ReturnEvent };

  type ReturnEvent = any;

  beforeEach(() => {
    routerSpy = { parseUrl: vi.fn((url: string) => url as unknown as UrlTree) };
    localStorageSpy = { getItem: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LocalStorageService, useValue: localStorageSpy }
      ]
    });
  });

  it('should redirect to /login when token is missing', () => {
    localStorageSpy.getItem.mockReturnValue(null);

    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe('/login');
  });

  it('should allow navigation when token is present and no roles required', () => {
    localStorageSpy.getItem.mockImplementation((key: string) => {
      if (key === 'auth_token') return 'valid_token';
      return null;
    });

    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('should allow navigation when role matches expected role', () => {
    localStorageSpy.getItem.mockImplementation((key: string) => {
      if (key === 'auth_token') return 'valid_token';
      if (key === 'user_role') return 'admin';
      return null;
    });

    const route = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('should redirect to / when role does not match expected role', () => {
    localStorageSpy.getItem.mockImplementation((key: string) => {
      if (key === 'auth_token') return 'valid_token';
      if (key === 'user_role') return 'customer';
      return null;
    });

    const route = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/');
    expect(result).toBe('/');
  });

  it('should redirect to / when role is missing but role is required', () => {
    localStorageSpy.getItem.mockImplementation((key: string) => {
      if (key === 'auth_token') return 'valid_token';
      if (key === 'user_role') return null;
      return null;
    });

    const route = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/');
    expect(result).toBe('/');
  });
});
