import { Component } from '@angular/core';
import { SideMenuComponent } from "../../shared/components/side-menu/side-menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav-page',
  imports: [RouterOutlet ,SideMenuComponent],
  templateUrl: './nav-page.component.html',
  styleUrl: './nav-page.component.css'
})
export default class NavPageComponent {

}
