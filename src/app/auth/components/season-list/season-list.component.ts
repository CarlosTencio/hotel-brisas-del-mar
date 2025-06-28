import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SeasonService } from '../../services/season.service';
import { CommonModule } from '@angular/common';
import { SeasonDTO } from '../../../models/season.model';
import { confirmationModalComponent } from '../edit-component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-season-list',
  standalone: true,
  imports: [CommonModule, confirmationModalComponent],
  templateUrl: './season-list.component.html',
  styleUrl: './season-list.component.css'
})
export default class SeasonListComponent implements OnInit {
  isLoading = signal(true);
  seasons = signal<SeasonDTO[]>([]);
  errorMessage = signal<string | null>(null);
  isModalOpen = signal(false);
  seasonToDelete = signal<number>(-1);
  
  private router = inject(Router);
  private loginService = inject(LoginService);
  private seasonService = inject(SeasonService);
  
  ngOnInit(): void {
    this.checkAuthentication();
    this.loadSeasons();
  }
  
  openDeleteModal(id: number): void {
    this.seasonToDelete.set(id);
    this.isModalOpen.set(true);
  }

  cancelDelete(): void {
    this.isModalOpen.set(false);
    this.seasonToDelete.set(-1);
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
  
  private loadSeasons(): void {
    this.seasonService.getAllSeasons().subscribe({
      next: (data) => {
        this.seasons.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error loading seasons: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }
  
  createSeason(): void {
    this.router.navigate(['/home-auth/season/create']);
  }
  
  editSeason(id: number): void {
    this.router.navigate([`/home-auth/season/edit/${id}`]);
  }
  
  viewSeason(id: number): void {
    this.router.navigate([`/home-auth/season/view/${id}`]);
  }
  
  deleteSeason(id: number): void {
    this.openDeleteModal(id);
  }

  confirmDelete(): void {
    if (this.seasonToDelete() <= 0) return;

    this.isLoading.set(true);
    this.isModalOpen.set(false);

    this.seasonService.deleteSeason(this.seasonToDelete()).subscribe({
      next: () => {
        // Enfoque tipo React: eliminamos solo del array local
        const updated = this.seasons().filter(
          s => s.seasonID !== this.seasonToDelete()
        );
        this.seasons.set(updated);
        this.seasonToDelete.set(-1);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error eliminando la temporada: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

} 