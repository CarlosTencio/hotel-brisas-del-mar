import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SeasonService } from '../../services/season.service';
import { CommonModule } from '@angular/common';
import { SeasonDTO } from '../../../models/season.model';

@Component({
  selector: 'app-season-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './season-form.component.html',
  styleUrl: './season-form.component.css'
})
export default class SeasonFormComponent implements OnInit {
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  seasonForm!: FormGroup;
  isEditMode = signal(false);
  seasonId = signal<number | undefined>(undefined);
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loginService = inject(LoginService);
  private seasonService = inject(SeasonService);
  
  ngOnInit(): void {
    this.checkAuthentication();
    this.initForm();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const parsedId = parseInt(id, 10);
      this.seasonId.set(parsedId);
      this.isEditMode.set(true);
      this.loadSeason(parsedId);
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
    this.seasonForm = this.fb.group({
      seasonName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      percent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      isActive: [true],
      isHigh: [false]
    });
  }
  
  private loadSeason(id: number): void {
    this.seasonService.getSeasonById(id).subscribe({
      next: (season) => {
        // Format dates for input[type="date"]
        const startDate = new Date(season.startDate).toISOString().split('T')[0];
        const endDate = new Date(season.endDate).toISOString().split('T')[0];
        
        this.seasonForm.patchValue({
          seasonName: season.seasonName,
          startDate: startDate,
          endDate: endDate,
          percent: season.percent,
          isActive: season.isActive,
          isHigh: season.isHigh
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading season: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  onSubmit(): void {
    if (this.seasonForm.invalid) {
      this.markFormGroupTouched(this.seasonForm);
      return;
    }
    
    this.isLoading.set(true);
    const seasonData: SeasonDTO = {
      ...this.seasonForm.value
    };
    
    if (this.isEditMode() && this.seasonId() !== undefined) {
      seasonData.seasonID = this.seasonId();
      this.updateSeason(seasonData);
    } else {
      this.createSeason(seasonData);
    }
  }
  
  private createSeason(season: SeasonDTO): void {
    this.seasonService.createSeason(season).subscribe({
      next: () => {
        this.router.navigate(['/home-auth/season']);
      },
      error: (error) => {
        this.errorMessage.set('Error creating season: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  private updateSeason(season: SeasonDTO): void {
    this.seasonService.updateSeason(season).subscribe({
      next: () => {
        this.router.navigate(['/home-auth/season']);
      },
      error: (error) => {
        this.errorMessage.set('Error updating season: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  cancel(): void {
    this.router.navigate(['/home-auth/season']);
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