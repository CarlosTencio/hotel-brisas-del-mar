import { Component } from '@angular/core';


import {SideMenuOptionsAuthComponent}  from './side-menu-options-auth/side-menu-options-auth.component';

@Component({
  selector: 'app-side-menu-auth',
  standalone: true,
  imports: [SideMenuOptionsAuthComponent],
  
  templateUrl: './side-menu-auth.component.html',
  styleUrl: './side-menu-auth.component.css'
})
export class SideMenuAuthComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
