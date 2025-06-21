import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { Ad } from '../../models/ad-model';

@Component({
  selector: 'app-ad-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export default class AdListComponent implements OnInit {
  isLoading = signal(true);
  ads = signal<Ad[]>([]);
  errorMessage = signal<string | null>(null);

  private router = inject(Router);
  private adService = inject(AdService);

  ngOnInit(): void {
    this.loadAds();
  }

  private loadAds(): void {
    this.adService.getAds().subscribe({
      next: (data) => {
        this.ads.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading ads: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

  createAd(): void {
    this.router.navigate(['/home-auth/ad/create']);
  }

  editAd(id: number): void {
    this.router.navigate([`/home-auth/ad/edit/${id}`]);
  }

  viewAd(id: number): void {
    this.router.navigate([`/home-auth/ad/view/${id}`]);
  }

  deleteAd(id: number): void {
    if (confirm('Are you sure you want to delete this ad?')) {
      this.isLoading.set(true);
      this.adService.deleteAd(id).subscribe({
        next: () => {
          this.loadAds();
        },
        error: (error) => {
          this.errorMessage.set('Error deleting ad: ' + error.message);
          this.isLoading.set(false);
        }
      });
    }
  }
}
