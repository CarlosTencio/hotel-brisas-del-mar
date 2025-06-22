import { Component, inject, signal, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditSectionComponent } from '../../components/edit-component/edit-section.component';
import { ContentContactUs } from '../../models/image-model';
interface TokenResponse {
  tokenDTOString: string;
}

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [CommonModule,EditSectionComponent],
  templateUrl: './edit-page.component.html',
})
export default class EditPageComponent implements OnInit {

  isLoading = signal(false);
  
  contactData = signal<ContentContactUs>({
    pageID: 0,
    phone1: '',
    phone2: '',
    poBox: '',
    email: '',
    facebook: '',
    instagram: ''
  });

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
