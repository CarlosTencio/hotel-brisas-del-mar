import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from "./shared/components/header/header.component";
import HeaderComponentAuth from "./auth/components/header-auth/header-auth.component";
import { Router } from '@angular/router';
import AuthLayoutComponent from "./auth/components/auth-layout/auth-layout.component";
import { HeaderLoginComponent } from "./auth/components/header-login/header-login.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent, HeaderComponentAuth, HeaderLoginComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hotel-brisas-del-mar';

  constructor(private router: Router) {}
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
  isPageAuth(): boolean {
    return this.router.url.startsWith('/home-auth');
  }
}
