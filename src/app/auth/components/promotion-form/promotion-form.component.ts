import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { PromotionService } from '../../services/promotion.service';
import { CommonModule } from '@angular/common';
import { PromotionMainDTO } from '../../../models/promotion.model';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './promotion-form.component.html',
  styleUrl: './promotion-form.component.css'
})
export default class PromotionFormComponent implements OnInit {
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  promotionForm!: FormGroup;
  isEditMode = signal(false);
  promotionId = signal<number | undefined>(undefined);
  selectedFile: File | null = null;
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loginService = inject(LoginService);
  private promotionService = inject(PromotionService);
  
  ngOnInit(): void {
    this.checkAuthentication();
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const parsedId = parseInt(id, 10);
      this.promotionId.set(parsedId);
      this.isEditMode.set(true);
      this.loadPromotion(parsedId);
    } else {
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
  
  private initForm(): void {
    this.promotionForm = this.fb.group({
      promotionName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      percent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isActive: [true],
      img: ['']
    });
  }
  
  private loadPromotion(id: number): void {
    this.promotionService.getPromotionById(id).subscribe({
      next: (promotion) => {
        // Format dates for input[type="date"]
        const startDate = new Date(promotion.startDate).toISOString().split('T')[0];
        const endDate = new Date(promotion.endDate).toISOString().split('T')[0];
        
        this.promotionForm.patchValue({
          promotionName: promotion.promotionName,
          startDate: startDate,
          endDate: endDate,
          percent: promotion.percent,
          isActive: promotion.isActive,
          img: promotion.img
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading promotion: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Read and convert file to data URL (base64) for preview and form submission
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.promotionForm.patchValue({
            img: reader.result
          });
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  
  onSubmit(): void {
    if (this.promotionForm.invalid) {
      this.markFormGroupTouched(this.promotionForm);
      return;
    }
    
    this.isLoading.set(true);
    const promotionData: PromotionMainDTO = {
      ...this.promotionForm.value
    };
    
    if (this.isEditMode() && this.promotionId() !== undefined) {
      promotionData.promotionID = this.promotionId();
      this.updatePromotion(promotionData);
    } else {
      this.createPromotion(promotionData);
    }
  }
  
  private createPromotion(promotion: PromotionMainDTO): void {
    this.promotionService.createPromotion(promotion).subscribe({
      next: () => {
        this.router.navigate(['/home-auth/promotion']);
      },
      error: (error) => {
        this.errorMessage.set('Error creating promotion: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  private updatePromotion(promotion: PromotionMainDTO): void {
    this.promotionService.updatePromotion(promotion).subscribe({
      next: () => {
        this.router.navigate(['/home-auth/promotion']);
      },
      error: (error) => {
        this.errorMessage.set('Error updating promotion: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/home-auth/promotion']);
  }
  
  // Helper to mark all controls as touched to trigger validation
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
} 