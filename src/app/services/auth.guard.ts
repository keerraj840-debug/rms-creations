import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * authGuard — Angular route guard.
 *
 * IMPORTANT: This guard provides UX-level navigation protection only.
 * True authorization is enforced at the Supabase database layer via RLS
 * policies keyed on auth.uid(). Never rely solely on this guard for security.
 *
 * Role is read from AuthService.currentUser (populated from the Supabase
 * session), NOT from raw localStorage, which can be tampered by users.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser;

  if (!currentUser) {
    const returnUrl = state?.url && state.url !== '/' ? `?returnUrl=${encodeURIComponent(state.url)}` : '';
    return router.parseUrl(`/login${returnUrl}`);
  }

  // Check if route requires specific roles — role comes from verified session profile
  const expectedRoles: string[] = route.data?.['roles'] || [];
  if (expectedRoles.length > 0) {
    const userRole = currentUser.role;
    if (!userRole || !expectedRoles.includes(userRole)) {
      // User does not have the required role — redirect to home
      return router.parseUrl('/');
    }
  }

  return true;
};
