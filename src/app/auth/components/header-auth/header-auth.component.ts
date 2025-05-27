import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-header-auth',
  standalone: true,
  imports: [],
  templateUrl: './header-auth.component.html',
  styleUrl: './header-auth.component.css'
})
export default class HeaderAuthComponent {
  userName: string = localStorage.getItem('user') || '';
  constructor(private menuService: MenuService) {}
  toggleMenu() {
    this.menuService.toggleMenu();
    //console.log('menuOpen', this.menuService.menuOpen$);
  }
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  }

}
