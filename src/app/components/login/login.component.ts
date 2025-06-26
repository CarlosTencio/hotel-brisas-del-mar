import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginItemComponent } from "./login-item/login-item.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LoginItemComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Input() isLoading = false;
  @Output() loginEvent = new EventEmitter<{ username: string; password: string }>();

  handleLogin(credentials: { username: string; password: string }) {
    console.log('Usuario:', credentials.username);
    console.log('Contraseña:', credentials.password);
    
    this.loginEvent.emit(credentials);
  }
}