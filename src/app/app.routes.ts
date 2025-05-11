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
        loadComponent: () => import('./auth/pages/manage-room-page/manage-room-page.component')
      }
      ,{
        path: 'status-hotel',
        loadComponent: () => import('./auth/pages/status-hotel-page/status-hotel-page.component')
      },{
        path: 'status-hotel',
        loadComponent: () => import('./auth/pages/status-hotel-page/status-hotel-page.component')
      }
      ,{
        path: 'availability-room',
        loadComponent: () => import('./auth/pages/availability-room-page/availability-room-page.component')
      },{
        path: 'advertising',
        loadComponent: () => import('./auth/pages/advertising-page/advertising-page.component')
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];