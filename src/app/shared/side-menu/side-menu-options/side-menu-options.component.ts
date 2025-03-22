import { Component } from '@angular/core';

interface MenuOptions {
  label: string;
  route: string;
}


@Component({
  selector: 'app-side-menu-options',
  imports: [],
  templateUrl: './side-menu-options.component.html',
  styleUrl: './side-menu-options.component.css'
})
export class SideMenuOptionsComponent {
  menuOptions: MenuOptions[]=[
    {
      label: 'Home',
      route: '/home'
    },
    {
      label: 'About-us',
      route: '/about-us'
    },
    {
      label: 'Contact-us',
      route: '/contact-us'
    },
    {
      label: 'Facilities',
      route: '/facilities'
    },
    {
      label: 'Location',
      route: '/location'
    },
    {
      label: 'Room Rate',
      route: '/fees'
    },
    {
      label:'Reservation',
      route: '/reservation'
    }
  ]
}
