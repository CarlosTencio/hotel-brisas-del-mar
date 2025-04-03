import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu.component';

@Component({
  selector: 'app-nav-page',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './main-layout.component.html',

})
export default class NavPageComponent {
  
}
