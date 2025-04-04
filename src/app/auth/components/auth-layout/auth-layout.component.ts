import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import  {SideMenuAuthComponent}  from './side-menu-auth/side-menu-auth.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, SideMenuAuthComponent],

  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export default class AuthLayoutComponent {
  
}
