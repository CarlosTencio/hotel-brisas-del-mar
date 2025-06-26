import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../auth/services/login.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import modalLoginComponent from './modal-login/modal-login.component';

interface TokenResponse {
  tokenDTOString: string;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, LoginComponent, modalLoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export default class LoginPageComponent {
  constructor(private router: Router) {}
  login = inject(LoginService);
  dataPage = signal<TokenResponse[]>([]);
  showErrorModal = signal<boolean>(false);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  handleLogin(credentials: { username: string; password: string }) {
    this.isLoading.set(true);
    this.login.login(credentials.username, credentials.password).subscribe({
      next: (tokenResponse: TokenResponse) => {
        this.isLoading.set(false);
        if(tokenResponse.tokenDTOString === null) {
          this.errorMessage.set('Credenciales incorrectas. Por favor intente nuevamente.');
          this.showErrorModal.set(true);
          return;
        }
        this.dataPage.set([tokenResponse]);
        localStorage.setItem('token', tokenResponse.tokenDTOString);
        localStorage.setItem('user', credentials.username);
        this.router.navigate(['/home-auth']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciales incorrectas. Por favor intente nuevamente.');
        this.showErrorModal.set(true);
      }
    });
  }

  closeErrorModal() {
    this.showErrorModal.set(false);
  }
}