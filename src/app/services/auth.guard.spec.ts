import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let routerSpy: { parseUrl: any };
  let authServiceSpy: { currentUser: any };

  beforeEach(() => {
    routerSpy = { parseUrl: vi.fn((url: string) => url as unknown as UrlTree) };
    authServiceSpy = { currentUser: null };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
  });

  it('should redirect to /login when user is not logged in', () => {
    authServiceSpy.currentUser = null;

    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe('/login');
  });

  it('should allow navigation when user is logged in and no roles required', () => {
    authServiceSpy.currentUser = { id: 1, name: 'Test', email: 'test@test.com', role: 'customer' };

    const route = { data: {} } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('should allow navigation when role matches expected role', () => {
    authServiceSpy.currentUser = { id: 1, name: 'Admin', email: 'admin@test.com', role: 'admin' };

    const route = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('should redirect to / when customer tries to access admin route', () => {
    authServiceSpy.currentUser = { id: 2, name: 'Customer', email: 'customer@test.com', role: 'customer' };

    const route = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/');
    expect(result).toBe('/');
  });

  it('should redirect to / when user role is undefined but role is required', () => {
    authServiceSpy.currentUser = { id: 3, name: 'NoRole', email: 'norole@test.com', role: undefined };

    const route = { data: { roles: ['admin'] } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/');
    expect(result).toBe('/');
  });
});

