import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { Ad } from '../../models/ad-model';

@Component({
  selector: 'app-ad-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-view.component.html',
  styleUrls: ['./ad-view.component.css']
})
export default class AdViewComponent implements OnInit {
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  ad = signal<Ad | null>(null);
  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loginService = inject(LoginService);
  private adService = inject(AdService);

  ngOnInit(): void {
    this.checkAuthentication();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAd(parseInt(id, 10));
    } else {
      this.errorMessage.set('Ad ID not provided');
      this.isLoading.set(false);
    }
  }

  private checkAuthentication(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.loginService.verifyToken(token).subscribe({
        next: (tokenResponse) => {
          if (!tokenResponse) {
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private loadAd(id: number): void {
    this.adService.getAdById(id).subscribe({
      next: (ad) => {
        this.ad.set(ad);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading ad: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

  goToList(): void {
    this.router.navigate(['/home-auth/ad']);
  }

  editAd(): void {
    const currentAd = this.ad();
    if (currentAd && currentAd.adID !== undefined) {
      this.router.navigate([`/home-auth/ad/edit/${currentAd.adID}`]);
    }
  }

  deleteAd(): void {
    const currentAd = this.ad();
    if (currentAd && currentAd.adID !== undefined && 
        confirm('Are you sure you want to delete this ad?')) {
      this.isLoading.set(true);
      this.adService.deleteAd(currentAd.adID).subscribe({
        next: () => {
          this.router.navigate(['/home-auth/ad']);
        },
        error: (error) => {
          this.errorMessage.set('Error deleting ad: ' + error.message);
          this.isLoading.set(false);
        }
      });
    }
  }
}
