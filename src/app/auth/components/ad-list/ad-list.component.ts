import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdService } from '../../services/ad.service';
import { CommonModule } from '@angular/common';
import { confirmationModalComponent } from '../edit-component/confirmation-modal/confirmation-modal.component';
import { Ad } from '../../models/ad-model';

@Component({
  selector: 'app-ad-list',
  standalone: true,
  imports: [CommonModule, confirmationModalComponent],
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export default class AdListComponent implements OnInit {
  isLoading = signal(true);
  ads = signal<Ad[]>([]);
  errorMessage = signal<string | null>(null);
  isModalOpen = signal(false);
  adToDelete = signal<number>(-1);

  private router = inject(Router);
  private adService = inject(AdService);

  ngOnInit(): void {
    this.loadAds();
  }

  openDeleteModal(id: number): void {
    this.adToDelete.set(id);
    this.isModalOpen.set(true);
  }

  cancelDelete(): void {
    this.isModalOpen.set(false);
    this.adToDelete.set(-1);
  }

  private loadAds(): void {
    this.adService.getAds().subscribe({
      next: (data) => {
        this.ads.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error cargando ads: ' + error.message);
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
    this.openDeleteModal(id);
  }

  confirmDelete(): void {
    
    if (this.adToDelete() <= 0) return;

    this.isLoading.set(true);
    this.isModalOpen.set(false);

    this.adService.deleteAd(this.adToDelete()).subscribe({
      next: () => {
        this.loadAds();
      },
      error: (error) => {
        this.errorMessage.set('Error eliminando ad: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

}
