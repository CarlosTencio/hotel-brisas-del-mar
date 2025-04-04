import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
interface TokenResponse {
  tokenDTOString: string;
}
@Component({
  selector: 'app-home-auth',
  imports: [],
  templateUrl: './home-auth.component.html',
  styleUrl: './home-auth.component.css'
})
export default class HomeAuthComponent implements OnInit {
  constructor(private router: Router) { }
  login= inject(LoginService);
  ngOnInit(): void {
    console.log('Token:');
    console.log('Token:', localStorage.getItem('token'));
   
    this.login.verifyToken(localStorage.getItem('token')!).subscribe({
      next: (TokenResponse) => {
        console.log(TokenResponse);
        
      }
      ,
      error: (err) => {
        console.error('Error loading pages', err);
      }
    });
  }

}
