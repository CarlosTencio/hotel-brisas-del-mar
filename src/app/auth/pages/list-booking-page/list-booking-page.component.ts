import { Component, inject, signal, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
interface TokenResponse {
  tokenDTOString: string;
}
@Component({
  selector: 'app-list-booking-page',
  imports: [],
  templateUrl: './list-booking-page.component.html',
  styleUrl: './list-booking-page.component.css'
})
export default class ListBookingPageComponent {
  isLoading = signal(true);
  constructor(private router: Router) {
    
  }
  login= inject(LoginService);

    ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    
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
