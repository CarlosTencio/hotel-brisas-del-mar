import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


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
  menuOptions: MenuOptions[] = [
    {
      label: 'Home',
      route: '/auth-home'
    },
    {
      label: 'modificar pagina',
      route: '/about-us'
    },
    {
      label: 'Listado de reservaciones',
      route: '/facilities'
    },
    {
      label: 'Cómo llegar?',
      route: '/location'
    },
    {
      label: 'administrar habitaciones',
      route: '/room-rate'
    },
    {
      label: 'Ver estado del hotel hoy ',
      route: '/reservation'
    },
    {
      label: 'consultar dispobibilidad de habitaciones',
      route: '/contact-us'
    },
    {
      label: 'publicidad',
      route: '/publicidad'
    }
  ]
}
