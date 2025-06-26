import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MenuService } from '../../../core/services/menu.service';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-nav-page',
  imports: [RouterOutlet, RouterLink, SideMenuComponent, FooterComponent],
  templateUrl: './main-layout.component.html'
})
export default class NavPageComponent implements OnDestroy {
  menuOpen = false;
  subscription: Subscription;

  constructor(public menuService: MenuService) {
    this.subscription = this.menuService.menuOpen$.subscribe(open => {
      this.menuOpen = open;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
