import { Component } from '@angular/core';
import { SideMenuOptionsComponent } from './side-menu-options/side-menu-options.component';
import { MenuService } from '../../../../core/services/menu.service';

@Component({
  selector: 'side-menu',
  imports: [SideMenuOptionsComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  menuOpen = false;

  constructor(private menuService: MenuService) {
    this.menuService.menuOpen$.subscribe(open => {
      this.menuOpen = open;
    });
  }
  toggleMenu() {
    this.menuService.toggleMenu();
  }
}
