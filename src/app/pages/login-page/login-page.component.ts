import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../auth/services/login.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { Page } from '../../models/page.interface';


interface TokenResponse {
  tokenDTOString: string;
}
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export default class LoginPageComponent {
  constructor(private router: Router) {}
  login= inject(LoginService);
  dataPage = signal<TokenResponse[]>([]);
  handleLogin(credentials: { username: string; password: string }) {
    
    if (credentials.username && credentials.password) {
      console.log('Login successful:', credentials);
      this.login.login(credentials.username, credentials.password).subscribe({
        next: (TokenResponse) => {
          this.dataPage.set(TokenResponse);
          console.log(TokenResponse);
          TokenResponse.forEach((token) => {
            localStorage.setItem('token', token.tokenDTOString);
          }
        );
         
        },
        error: (err) => { 
          console.error('Error loading pages', err);
        }
      });
     
      this.router.navigate(['/auth-home']);
    }
  }
}
