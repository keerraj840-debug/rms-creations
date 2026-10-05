import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  const token = localStorageService.getItem<string>('auth_token');
  const role = localStorageService.getItem<string>('user_role'); // 'admin' | 'customer'

  if (!token) {
    // Not logged in, redirect to login page (we will create this later)
    return router.parseUrl('/login');
  }

  // Check if route requires specific roles
  const expectedRoles: string[] = route.data?.['roles'] || [];
  if (expectedRoles.length > 0 && role) {
    if (!expectedRoles.includes(role)) {
      // User does not have the required role
      return router.parseUrl('/'); // Redirect to home or unauthorized page
    }
  }

  return true;
};
