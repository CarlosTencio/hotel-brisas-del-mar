import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { PromotionMainComponent } from './promotion-main/promotion-main.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, PromotionMainComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private menuService: MenuService) {}

  toggleMenu() {
    this.menuService.toggleMenu();
    console.log('menuOpen', this.menuService.menuOpen$);
  }
}
