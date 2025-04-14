import { Component } from '@angular/core';
import { PromotionMainComponent } from './promotion-main/promotion-main.component';
import { MenuService } from '../../../core/services/menu.service';
@Component({
  selector: 'app-header',
  imports: [PromotionMainComponent],
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
