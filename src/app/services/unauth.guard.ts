import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

export const unauthGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  const token = localStorageService.getItem<string>('auth_token');
  const role = localStorageService.getItem<string>('user_role');

  if (token) {
    if (role === 'admin') {
      return router.parseUrl('/admin');
    }
    return router.parseUrl('/');
  }

  return true;
};
