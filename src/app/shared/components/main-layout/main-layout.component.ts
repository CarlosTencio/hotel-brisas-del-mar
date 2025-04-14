import { Component,OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MenuService } from '../../../core/services/menu.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-nav-page',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './main-layout.component.html',

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
