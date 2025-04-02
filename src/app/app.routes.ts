import { Routes } from '@angular/router';
import NavPageComponent from './shared/components/main-layout/main-layout.component';
//import AdminNavComponent from './shared/components/admin-layout/admin-layout.component';
import LoginPageComponent from './pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: NavPageComponent, // Aquí estás usando el layout
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/home-page/home-page.component') },
      { path: 'about-us', loadComponent: () => import('./pages/about-us-page/about-us-page.component') },
      { path: 'contact-us', loadComponent: () => import('./pages/contact-us-page/contact-us-page.component') },
      { path: 'facilities', loadComponent: () => import('./pages/facilities-page/facilities-page.component') },
      { path: 'location', loadComponent: () => import('./pages/location-page/location-page.component') },
      { path: 'room-rate', loadComponent: () => import('./pages/room-rate-page/room-rate-page.component') },
      { path: 'reservation', loadComponent: () => import('./pages/reservation-page/reservation-page.component') },
    ]
  },
  {
    path: 'login', 
    loadComponent: () => import('./pages/login-page/login-page.component') // Solo carga el componente login
  },
  {
    path: '**',
    redirectTo: 'home' // Redirige a home si la ruta no existe
  }
];