import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'nav',
    loadComponent: () => import('./pages/nav-page/nav-page.component'),
    children: [
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
        loadComponent: () => import('./pages/reservation-page/reservation-page.component')
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'nav/home'
  }

];
