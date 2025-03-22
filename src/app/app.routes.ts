import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home-page/home-page.component')
  },
  {
    path: 'about-us',
    loadComponent: () => import('./pages/about-us/about-us.component')
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./pages/contact-us/contact-us.component')
  },
  {
    path: 'facilities',
    loadComponent: () => import('./pages/facilities/facilities.component')
  },
  {
    path: 'location',
    loadComponent: () => import('./pages/location/location.component')
  },
  {
    path: 'room-rate',
    loadComponent: () => import('./pages/room-rate/room-rate.component')
  },
  {
    path: 'reservation',
    loadComponent: () => import('./pages/reservation/reservation.component')
  }
];
