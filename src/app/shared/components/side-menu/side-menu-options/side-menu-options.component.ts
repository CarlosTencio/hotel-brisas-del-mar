import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuOptions {
  label: string;
  route: string;
}


@Component({
  selector: 'side-menu-options',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
  styleUrl: './side-menu-options.component.css'
})
export class SideMenuOptionsComponent {
  menuOptions: MenuOptions[]=[
    {
      label: 'Home',
      route: '/nav/home'
    },
    {
      label: 'About-us',
      route: '/nav/about-us'
    },
    {
      label: 'Contact-us',
      route: '/nav/contact-us'
    },
    {
      label: 'Facilities',
      route: '/nav/facilities'
    },
    {
      label: 'Location',
      route: '/nav/location'
    },
    {
      label: 'Room Rate',
      route: '/nav/room-rate'
    },
    {
      label:'Reservation',
      route: '/nav/reservation'
    }
  ]
}
