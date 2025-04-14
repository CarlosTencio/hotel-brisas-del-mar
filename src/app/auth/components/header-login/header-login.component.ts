import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
@Component({
  selector: 'app-header-login',
  imports: [],
  templateUrl: './header-login.component.html',
  styleUrl: './header-login.component.css'
})
export class HeaderLoginComponent {
  constructor(private menuService: MenuService) {}

}
