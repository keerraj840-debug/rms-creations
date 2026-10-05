import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';
import { unauthGuard } from './services/unauth.guard';
import { LoginPageComponent } from './pages/login-page.component';
import { AdminLayoutComponent } from './shared/admin-layout.component';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page.component';
import { AdminUsersPageComponent } from './pages/admin-users-page.component';
import { AdminProductsPageComponent } from './pages/admin-products-page.component';
import { AdminProductFormPageComponent } from './pages/admin-product-form-page.component';
import { AdminCategoriesPageComponent } from './pages/admin-categories-page.component';
import { AdminCategoryFormPageComponent } from './pages/admin-category-form-page.component';
import { AdminProductDetailsPageComponent } from './pages/admin-product-details-page.component';
import { AdminOrdersPageComponent } from './pages/admin-orders-page.component';
import { AdminSettingsPageComponent } from './pages/admin-settings-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { GalleryPageComponent } from './pages/gallery-page.component';
import { ContactPageComponent } from './pages/contact-page.component';
import { TopOffersPageComponent } from './pages/top-offers-page.component';
import { TopOfferDetailPageComponent } from './pages/top-offer-detail-page.component';
import { HampersPageComponent } from './pages/hampers-page.component';
import { ReturnGiftPageComponent } from './pages/return-gift-page.component';
import { ReturnGiftDetailPageComponent } from './pages/return-gift-detail-page.component';
import { FolderGalleryPageComponent } from './pages/folder-gallery-page.component';
import { GanpatiHampersPageComponent } from './pages/ganpati-hampers-page.component';

export const routes: Routes = [
  // Authentication Routes
  { path: 'login', component: LoginPageComponent, canActivate: [unauthGuard] },

  // Public/Customer Routes
  { path: '', component: HomePageComponent },
  { path: 'ganpati-hampers', component: GanpatiHampersPageComponent },
  { path: 'ganpati', redirectTo: 'ganpati-hampers' },
  { path: 'hampers', component: HampersPageComponent },
  { path: 'hampers/:slug', component: FolderGalleryPageComponent },
  { path: 'return-gifts', component: ReturnGiftPageComponent },
  { path: 'return-gifts/:slug', component: ReturnGiftDetailPageComponent },
  { path: 'gallery', component: GalleryPageComponent },
  { path: 'top-offers', component: TopOffersPageComponent },
  { path: 'top-offers/:category', component: TopOfferDetailPageComponent },
  { path: 'contact', component: ContactPageComponent },

  // Admin Routes (Protected by Auth Guard)
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    children: [
      { path: '', component: AdminDashboardPageComponent },
      { path: 'users', component: AdminUsersPageComponent },
      { path: 'products', component: AdminProductsPageComponent },
      { path: 'products/new', component: AdminProductFormPageComponent },
      { path: 'products/edit/:id', component: AdminProductFormPageComponent },
      { path: 'items', component: AdminProductDetailsPageComponent },
      { path: 'categories', component: AdminCategoriesPageComponent },
      { path: 'categories/new', component: AdminCategoryFormPageComponent },
      { path: 'categories/edit/:id', component: AdminCategoryFormPageComponent },
      { path: 'orders', component: AdminOrdersPageComponent },
      { path: 'settings', component: AdminSettingsPageComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];
