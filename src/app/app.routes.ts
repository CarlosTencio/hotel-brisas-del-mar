import { Routes } from '@angular/router';
import NavPageComponent from './shared/components/main-layout/main-layout.component';
import AdminNavComponent from './auth/components/auth-layout/auth-layout.component';
import LoginPageComponent from './pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: NavPageComponent, // Aquí estás usando el layout
    children: [

      {
        path: '',
        redirectTo: 'home', // Redirige a 'home' si la URL está vacía
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home-page/home-page.component')
      },
      {
        path: 'about-us',
        loadComponent: () => import('./pages/about-us-page/about-us-page.component')
      },
      {
        path: 'contact-us',
        loadComponent: () => import('./pages/contact-us-page/contact-us-page.component')
      },
      {
        path: 'facilities',
        loadComponent: () => import('./pages/facilities-page/facilities-page.component')
      },
      {
        path: 'location',
        loadComponent: () => import('./pages/location-page/location-page.component')
      },
      {
        path: 'room-rate',
        loadComponent: () => import('./pages/room-rate-page/room-rate-page.component')
      },
      {
        path: 'reservation',
        loadComponent: () => import('./pages/booking-page/booking-page.component')
      }

    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component')
  },
  {
    path: 'home-auth',
    component: AdminNavComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./auth/pages/home-auth/home-auth.component')
      },
      {
        path: 'edit-page',
        loadComponent: () => import('./auth/pages/edit-page/edit-page.component')
      },
      {
        path: 'list-booking',
        loadComponent: () => import('./auth/pages/list-booking-page/list-booking-page.component')
      },
      {
        path: 'manage-room',
        loadComponent: () => import('./auth/pages/manage-status-room-page/manage-status-room-page.component')
      },
      {
        path: 'status-hotel',
        loadComponent: () => import('./auth/pages/status-hotel-page/status-hotel-page.component')
      },
      {
        path: 'availability-room',
        loadComponent: () => import('./auth/pages/availability-room-page/availability-room-page.component')
      },
      {
        path: 'ad',
        loadComponent: () => import('./auth/components/ad-list/ad-list.component')
      },
      {
        path: 'ad/view/:id',
        loadComponent: () => import('./auth/components/ad-view/ad-view.component')
      },
      {
        path: 'ad/edit/:id',
        loadComponent: () => import('./auth/components/ad-form/ad-form.component')
      },
      {
        path: 'ad/create',
        loadComponent: () => import('./auth/components/ad-form/ad-form.component')
      },
      {
        path: 'season',
        loadComponent: () => import('./auth/components/season-list/season-list.component')
      },
      {
        path: 'season/create',
        loadComponent: () => import('./auth/components/season-form/season-form.component')
      },
      {
        path: 'season/edit/:id',
        loadComponent: () => import('./auth/components/season-form/season-form.component')
      },
      {
        path: 'season/view/:id',
        loadComponent: () => import('./auth/components/season-view/season-view.component')
      },
      {
        path: 'promotion',
        loadComponent: () => import('./auth/components/promotion-list/promotion-list.component')
      },
      {
        path: 'promotion/create',
        loadComponent: () => import('./auth/components/promotion-form/promotion-form.component')
      },
      {
        path: 'promotion/edit/:id',
        loadComponent: () => import('./auth/components/promotion-form/promotion-form.component')
      },
      {
        path: 'promotion/view/:id',
        loadComponent: () => import('./auth/components/promotion-view/promotion-view.component')
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];