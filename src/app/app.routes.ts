import { Routes } from '@angular/router';
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
  { path: '**', redirectTo: '' }
];
