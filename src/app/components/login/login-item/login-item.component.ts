import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-item.component.html',
  styleUrl: './login-item.component.css'
})
export class LoginItemComponent {
  username: string = '';
  password: string = '';

  @Output() loginEvent = new EventEmitter<{ username: string; password: string }>();

  onSubmit() {
    this.loginEvent.emit({ username: this.username, password: this.password });
  }
}
