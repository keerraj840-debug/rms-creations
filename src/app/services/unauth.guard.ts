import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * unauthGuard — prevents authenticated users from accessing auth pages.
 * Role is read from AuthService.currentUser (verified session), not localStorage.
 */
export const unauthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser;

  if (currentUser) {
    if (currentUser.role === 'admin') {
      return router.parseUrl('/admin');
    }
    return router.parseUrl('/');
  }

  return true;
};

