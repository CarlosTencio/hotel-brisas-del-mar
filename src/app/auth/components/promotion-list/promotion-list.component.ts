import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { PromotionService } from '../../services/promotion.service';
import { CommonModule } from '@angular/common';
import { PromotionMainDTO } from '../../../models/promotion.model';
import { confirmationModalComponent } from '../edit-component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [CommonModule, confirmationModalComponent],
  templateUrl: './promotion-list.component.html',
  styleUrl: './promotion-list.component.css'
})
export default class PromotionListComponent implements OnInit {
  isLoading = signal(true);
  promotions = signal<PromotionMainDTO[]>([]);
  errorMessage = signal<string | null>(null);
  isModalOpen = signal(false);
  promotionToDelete = signal<number>(-1);

  private router = inject(Router);
  private loginService = inject(LoginService);
  private promotionService = inject(PromotionService);
  
  ngOnInit(): void {
    this.checkAuthentication();
    this.loadPromotions();
  }
  
  openDeleteModal(id: number): void {
    this.promotionToDelete.set(id);
    this.isModalOpen.set(true);
  }

  cancelDelete(): void {
    this.isModalOpen.set(false);
    this.promotionToDelete.set(-1);
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
  
  private loadPromotions(): void {
    this.promotionService.getAllPromotions().subscribe({
      next: (data) => {
        this.promotions.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading promotions: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  createPromotion(): void {
    this.router.navigate(['/home-auth/promotion/create']);
  }
  
  editPromotion(id: number): void {
    this.router.navigate([`/home-auth/promotion/edit/${id}`]);
  }
  
  viewPromotion(id: number): void {
    this.router.navigate([`/home-auth/promotion/view/${id}`]);
  }
  
  deletePromotion(id: number): void {
    this.openDeleteModal(id);
  }

  confirmDelete(): void {
    if (this.promotionToDelete() <= 0) return;

    this.isLoading.set(true);
    this.isModalOpen.set(false);

    this.promotionService.deletePromotion(this.promotionToDelete()).subscribe({
      next: () => {
        this.loadPromotions();
      },
      error: (error) => {
        this.errorMessage.set('Error eliminando la promoción: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

} 