import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
interface TokenResponse {
  tokenDTOString: string;
}
@Component({
  selector: 'app-home-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-auth.component.html',
  styleUrl: './home-auth.component.css'
})
export default class HomeAuthComponent implements OnInit {
  isLoading = signal(true);
  constructor(private router: Router) {
    console.log('HomeAuthComponent initialized');
   }
  
  login= inject(LoginService);
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    // console.log('Token:', token);
    
    if (token) {
      this.login.verifyToken(token).subscribe({
        next: (tokenResponse) => {
         
          this.isLoading.set(false);
          if(!tokenResponse) {
           
           
            this.router.navigate(['/login']);
          
          }
      
        },
        error: (err) => {
          console.error('Error loading pages', err);
        }
      });
    } else {
      console.error('No token found');
      // Redirect to login page
      this.router.navigate(['/login']);
    }
  }
  

}
