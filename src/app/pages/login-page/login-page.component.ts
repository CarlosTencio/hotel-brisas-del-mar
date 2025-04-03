import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../core/services/login.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { Page } from '../../models/page.interface';
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
  dataPage = signal<Page[]>([]);
  handleLogin(credentials: { username: string; password: string }) {
    
    if (credentials.username && credentials.password) {
      console.log('Login successful:', credentials);
      this.login.login(credentials.username, credentials.password).subscribe({
        next: (respPages) => {
          this.dataPage.set(respPages);
          console.log(respPages);
        },
        error: (err) => { 
          console.error('Error loading pages', err);
        }
      });
      // Navigate to the desired page after successful login
      //this.router.navigate(['/admin']);
    }
  }
}
