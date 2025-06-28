import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { PromotionService } from '../../services/promotion.service';
import { CommonModule } from '@angular/common';
import { PromotionMainDTO } from '../../../models/promotion.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { confirmationModalComponent } from '../edit-component/confirmation-modal/confirmation-modal.component';


@Component({
  selector: 'app-promotion-view',
  standalone: true,
  imports: [CommonModule, confirmationModalComponent],
  templateUrl: './promotion-view.component.html',
  styleUrl: './promotion-view.component.css'
})
export default class PromotionViewComponent implements OnInit {
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  promotion = signal<PromotionMainDTO | null>(null);
  isDeleteModalOpen = signal(false);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loginService = inject(LoginService);
  private promotionService = inject(PromotionService);

  ngOnInit(): void {
    this.checkAuthentication();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPromotion(parseInt(id, 10));
    } else {
      this.errorMessage.set('Id de la promoción no proporcionado.');
      this.isLoading.set(false);
    }
  }
  
  openDeleteModal(): void {
  this.isDeleteModalOpen.set(true);
}

cancelDelete(): void {
  this.isDeleteModalOpen.set(false);
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
  
  private loadPromotion(id: number): void {
    this.promotionService.getPromotionById(id).subscribe({
      next: (promotion) => {
        this.promotion.set(promotion);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading promotion: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  goToList(): void {
    this.router.navigate(['/home-auth/promotion']);
  }
  
  editPromotion(): void {
    const currentPromotion = this.promotion();
    if (currentPromotion && currentPromotion.promotionID !== undefined) {
      this.router.navigate([`/home-auth/promotion/edit/${currentPromotion.promotionID}`]);
    }
  }
  
confirmDelete(): void {
  const currentPromotion = this.promotion();
  if (!currentPromotion?.promotionID) return;

  this.isLoading.set(true);
  this.promotionService.deletePromotion(currentPromotion.promotionID).subscribe({
    
    next: () => {
      this.isDeleteModalOpen.set(false);
      this.router.navigate(['/home-auth/promotion']);
    },
    error: (error) => {
      this.errorMessage.set('Error al eliminar la promoción: ' + error.message);
      this.isLoading.set(false);
      this.isDeleteModalOpen.set(false);
    }
  });


}
} 