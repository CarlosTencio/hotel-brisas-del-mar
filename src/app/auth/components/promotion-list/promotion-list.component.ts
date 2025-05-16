import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { PromotionService } from '../../services/promotion.service';
import { CommonModule } from '@angular/common';
import { PromotionMainDTO } from '../../../models/promotion.model';

@Component({
  selector: 'app-promotion-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotion-list.component.html',
  styleUrl: './promotion-list.component.css'
})
export default class PromotionListComponent implements OnInit {
  isLoading = signal(true);
  promotions = signal<PromotionMainDTO[]>([]);
  errorMessage = signal<string | null>(null);
  
  private router = inject(Router);
  private loginService = inject(LoginService);
  private promotionService = inject(PromotionService);
  
  ngOnInit(): void {
    this.checkAuthentication();
    this.loadPromotions();
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
    if (confirm('Are you sure you want to delete this promotion?')) {
      this.isLoading.set(true);
      this.promotionService.deletePromotion(id).subscribe({
        next: () => {
          this.loadPromotions();
        },
        error: (error) => {
          this.errorMessage.set('Error deleting promotion: ' + error.message);
          this.isLoading.set(false);
        }
      });
    }
  }
} 