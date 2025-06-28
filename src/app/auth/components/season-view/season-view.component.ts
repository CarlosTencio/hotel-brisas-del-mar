import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SeasonService } from '../../services/season.service';
import { CommonModule } from '@angular/common';
import { SeasonDTO } from '../../../models/season.model';
import { confirmationModalComponent } from '../edit-component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-season-view',
  standalone: true,
  imports: [CommonModule, confirmationModalComponent],
  templateUrl: './season-view.component.html',
  styleUrl: './season-view.component.css'
})
export default class SeasonViewComponent implements OnInit {
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  season = signal<SeasonDTO | null>(null);
  
  isDeleteModalOpen = signal(false);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loginService = inject(LoginService);
  private seasonService = inject(SeasonService);
  
  ngOnInit(): void {
    this.checkAuthentication();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSeason(parseInt(id, 10));
    } else {
      this.errorMessage.set('Season ID not provided');
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
  
  private loadSeason(id: number): void {
    this.seasonService.getSeasonById(id).subscribe({
      next: (season) => {
        this.season.set(season);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading season: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  goToList(): void {
    this.router.navigate(['/home-auth/season']);
  }
  
  editSeason(): void {
    const currentSeason = this.season();
    if (currentSeason && currentSeason.seasonID !== undefined) {
      this.router.navigate([`/home-auth/season/edit/${currentSeason.seasonID}`]);
    }
  }
  
  confirmDelete(): void {
    const currentSeason = this.season();
    if (!currentSeason?.seasonID) return;

    this.isLoading.set(true);
    this.seasonService.deleteSeason(currentSeason.seasonID).subscribe({
      next: () => {
        this.isDeleteModalOpen.set(false);
        this.router.navigate(['/home-auth/season']);
      },
      error: (error) => {
        this.errorMessage.set('Error al eliminar la temporada: ' + error.message);
        this.isLoading.set(false);
        this.isDeleteModalOpen.set(false);
      }
    });
    
  }
} 