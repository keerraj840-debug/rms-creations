import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { authGuard } from './services/auth.guard';
import { unauthGuard } from './services/unauth.guard';
import { HomePageComponent } from './pages/home-page.component';

export const routes: Routes = [
  // Authentication Routes
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login-page.component').then(m => m.LoginPageComponent), 
    canActivate: [unauthGuard] 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./pages/auth/register-page.component').then(m => m.RegisterPageComponent), 
    canActivate: [unauthGuard] 
  },
  { 
    path: 'forgot-password', 
    loadComponent: () => import('./pages/auth/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent), 
    canActivate: [unauthGuard] 
  },

  // Public/Customer Routes
  { path: '', component: HomePageComponent },
  { 
    path: 'ganpati-hampers', 
    redirectTo: () => {
      const router = inject(Router);
      return router.createUrlTree(['/shop'], { queryParams: { category: 'Ganpati Hampers & Pooja Kits' } });
    }
  },
  { 
    path: 'ganpati', 
    redirectTo: () => {
      const router = inject(Router);
      return router.createUrlTree(['/shop'], { queryParams: { category: 'Ganpati Hampers & Pooja Kits' } });
    }
  },
  { 
    path: 'hampers', 
    redirectTo: '/shop'
  },
  { 
    path: 'hampers/:slug', 
    redirectTo: '/shop'
  },
  { 
    path: 'return-gifts', 
    redirectTo: () => {
      const router = inject(Router);
      return router.createUrlTree(['/shop'], { queryParams: { category: 'Event Favours & Return Gifts' } });
    }
  },
  { 
    path: 'return-gifts/:slug', 
    redirectTo: () => {
      const router = inject(Router);
      return router.createUrlTree(['/shop'], { queryParams: { category: 'Event Favours & Return Gifts' } });
    }
  },
  { 
    path: 'gallery', 
    loadComponent: () => import('./pages/gallery-page.component').then(m => m.GalleryPageComponent) 
  },
  { 
    path: 'top-offers', 
    redirectTo: () => {
      const router = inject(Router);
      return router.createUrlTree(['/shop'], { queryParams: { category: 'Friendship Day Collections' } });
    }
  },
  { 
    path: 'top-offers/:category', 
    redirectTo: () => {
      const router = inject(Router);
      return router.createUrlTree(['/shop']);
    }
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./pages/contact-page.component').then(m => m.ContactPageComponent) 
  },
  { 
    path: 'shop', 
    loadComponent: () => import('./pages/shop-page.component').then(m => m.ShopPageComponent) 
  },
  { 
    path: 'product/:id', 
    loadComponent: () => import('./pages/product-detail-page.component').then(m => m.ProductDetailPageComponent) 
  },
  { 
    path: 'shop/:id', 
    loadComponent: () => import('./pages/product-detail-page.component').then(m => m.ProductDetailPageComponent) 
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./pages/cart-page.component').then(m => m.CartPageComponent) 
  },
  { 
    path: 'checkout', 
    redirectTo: '/cart',
    pathMatch: 'full'
  },
  { 
    path: 'order-confirmation/:orderNo', 
    loadComponent: () => import('./pages/order-confirmation-page.component').then(m => m.OrderConfirmationPageComponent) 
  },
  { 
    path: 'my-orders', 
    loadComponent: () => import('./pages/my-orders-page.component').then(m => m.MyOrdersPageComponent) 
  },
  { 
    path: 'my-account', 
    loadComponent: () => import('./pages/my-account-page.component').then(m => m.MyAccountPageComponent) 
  },
  { 
    path: 'build-hamper', 
    loadComponent: () => import('./pages/build-hamper-page.component').then(m => m.BuildHamperPageComponent) 
  },
  { path: 'build-your-own-hamper', redirectTo: 'build-hamper' },
  { 
    path: 'my-custom-hampers', 
    loadComponent: () => import('./pages/my-custom-hampers-page.component').then(m => m.MyCustomHampersPageComponent) 
  },

  // Dedicated Statutory Legal & Policy Routes (Indian Consumer Protection & DPDP Act 2023)
  {
    path: 'terms',
    loadComponent: () => import('./pages/policy-page.component').then(m => m.PolicyPageComponent),
    data: { section: 'terms' }
  },
  {
    path: 'terms-of-service',
    redirectTo: 'terms'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/policy-page.component').then(m => m.PolicyPageComponent),
    data: { section: 'privacy' }
  },
  {
    path: 'privacy-policy',
    redirectTo: 'privacy'
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/policy-page.component').then(m => m.PolicyPageComponent),
    data: { section: 'cookies' }
  },
  {
    path: 'cookie-policy',
    redirectTo: 'cookies'
  },
  {
    path: 'shipping-policy',
    loadComponent: () => import('./pages/policy-page.component').then(m => m.PolicyPageComponent),
    data: { section: 'shipping' }
  },
  {
    path: 'refund-policy',
    loadComponent: () => import('./pages/policy-page.component').then(m => m.PolicyPageComponent),
    data: { section: 'refunds' }
  },
  {
    path: 'cancellation-policy',
    redirectTo: 'refund-policy'
  },
  {
    path: 'grievance',
    loadComponent: () => import('./pages/policy-page.component').then(m => m.PolicyPageComponent),
    data: { section: 'grievance' }
  },
  {
    path: 'policies',
    redirectTo: 'terms'
  },
  {
    path: 'policy',
    redirectTo: 'terms'
  },

  // Admin Routes (Protected by Auth Guard)
  { 
    path: 'admin', 
    loadComponent: () => import('./shared/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    children: [
      { 
        path: '', 
        loadComponent: () => import('./pages/admin-dashboard-page.component').then(m => m.AdminDashboardPageComponent) 
      },
      { 
        path: 'dashboard', 
        redirectTo: '', 
        pathMatch: 'full' 
      },
      { 
        path: 'users', 
        loadComponent: () => import('./pages/admin-users-page.component').then(m => m.AdminUsersPageComponent) 
      },
      { 
        path: 'products', 
        loadComponent: () => import('./pages/admin-products-page.component').then(m => m.AdminProductsPageComponent) 
      },
      { 
        path: 'products/new', 
        loadComponent: () => import('./pages/admin-product-form-page.component').then(m => m.AdminProductFormPageComponent) 
      },
      { 
        path: 'products/edit/:id', 
        loadComponent: () => import('./pages/admin-product-form-page.component').then(m => m.AdminProductFormPageComponent) 
      },
      { 
        path: 'items', 
        loadComponent: () => import('./pages/admin-product-details-page.component').then(m => m.AdminProductDetailsPageComponent) 
      },
      { 
        path: 'items/new', 
        loadComponent: () => import('./pages/admin-item-form-page.component').then(m => m.AdminItemFormPageComponent) 
      },
      { 
        path: 'items/edit/:id', 
        loadComponent: () => import('./pages/admin-item-form-page.component').then(m => m.AdminItemFormPageComponent) 
      },
      { 
        path: 'categories', 
        loadComponent: () => import('./pages/admin-categories-page.component').then(m => m.AdminCategoriesPageComponent) 
      },
      { 
        path: 'categories/new', 
        loadComponent: () => import('./pages/admin-category-form-page.component').then(m => m.AdminCategoryFormPageComponent) 
      },
      { 
        path: 'categories/edit/:id', 
        loadComponent: () => import('./pages/admin-category-form-page.component').then(m => m.AdminCategoryFormPageComponent) 
      },
      { 
        path: 'orders', 
        loadComponent: () => import('./pages/admin-orders-page.component').then(m => m.AdminOrdersPageComponent) 
      },
      { 
        path: 'custom-hampers', 
        loadComponent: () => import('./pages/admin-custom-hampers-page.component').then(m => m.AdminCustomHampersPageComponent) 
      },
      { 
        path: 'banners', 
        loadComponent: () => import('./pages/admin-banners-page.component').then(m => m.AdminBannersPageComponent) 
      },
      { 
        path: 'banners/new', 
        loadComponent: () => import('./pages/admin-banner-form-page.component').then(m => m.AdminBannerFormPageComponent) 
      },
      { 
        path: 'banners/edit/:id', 
        loadComponent: () => import('./pages/admin-banner-form-page.component').then(m => m.AdminBannerFormPageComponent) 
      },
      { 
        path: 'pincodes', 
        loadComponent: () => import('./pages/admin-pincodes-page.component').then(m => m.AdminPincodesPageComponent) 
      },
      { 
        path: 'pincodes/new', 
        loadComponent: () => import('./pages/admin-pincode-form-page.component').then(m => m.AdminPincodeFormPageComponent) 
      },
      { 
        path: 'pincodes/edit/:id', 
        loadComponent: () => import('./pages/admin-pincode-form-page.component').then(m => m.AdminPincodeFormPageComponent) 
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./pages/admin-settings-page.component').then(m => m.AdminSettingsPageComponent) 
      },
    ]
  },

  { path: '**', redirectTo: '' }
];
