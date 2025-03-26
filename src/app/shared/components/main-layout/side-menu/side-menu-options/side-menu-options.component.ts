import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AdsComponent } from "../../ads/ads.component";

interface MenuOptions {
  label: string;
  route: string;
}


@Component({
  selector: 'side-menu-options',
  imports: [RouterLink, RouterLinkActive, AdsComponent],
  templateUrl: './side-menu-options.component.html',
  styleUrl: './side-menu-options.component.css'
})
export class SideMenuOptionsComponent {
  menuOptions: MenuOptions[] = [
    {
      label: 'Home',
      route: '/home'
    },
    {
      label: 'Sobre nosotros',
      route: '/about-us'
    },
    {
      label: 'Facilidades',
      route: '/facilities'
    },
    {
      label: 'Cómo llegar?',
      route: '/location'
    },
    {
      label: 'Tarifas',
      route: '/room-rate'
    },
    {
      label: 'Reservar en linea',
      route: '/reservation'
    },
    {
      label: 'Contáctenos',
      route: '/contact-us'
    }
  ]
}
