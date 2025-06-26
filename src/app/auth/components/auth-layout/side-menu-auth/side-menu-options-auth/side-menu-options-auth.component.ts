import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '../../../../services/menu.service';
import { Router } from '@angular/router';

interface MenuOptions {
  label: string;
  route: string;
}

@Component({
  selector: 'app-side-menu-options-auth',
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './side-menu-options-auth.component.html',
  styleUrl: './side-menu-options-auth.component.css'
})
export  class SideMenuOptionsAuthComponent {
  constructor( private router: Router,private menuService: MenuService) {
 
    
  }
  menuOptions: MenuOptions[] = [
    {
      label: 'Home',
      route: '/home-auth'
    },
    {
      label: 'Modificar página',
      route: '/home-auth/edit-page'
    },
    {
      label: 'Listado de reservaciones',
      route: '/home-auth/list-booking'
    },
    {
      label: 'Administrar habitaciones',
      route: '/home-auth/manage-room'
    },
    {
      label: 'Ver estado del hotel hoy',
      route: '/home-auth/status-hotel'
    },
    {
      label: 'Consultar dispobibilidad de habitaciones',
      route: '/home-auth/availability-room'
    },
    {
      label: 'Administrar publicidad',
      route: '/home-auth/ad'
    },
    {
      label: 'Administrar temporadas',
      route: '/home-auth/season'
    },
    {
      label: 'Administrar promociones',
      route: '/home-auth/promotion'
    }
  ]
  navigateTo(route: string) {
    this.router.navigate([route]);
    this.menuService.setMenuOpen(false); // Cerramos menú
  }
}
