import { Component, OnDestroy } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SideMenuAuthComponent } from './side-menu-auth/side-menu-auth.component';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, SideMenuAuthComponent, CommonModule, RouterModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export default class AuthLayoutComponent implements OnDestroy {
  
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