import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { SeasonService } from '../../services/season.service';
import { CommonModule } from '@angular/common';
import { SeasonDTO } from '../../../models/season.model';

@Component({
  selector: 'app-season-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './season-list.component.html',
  styleUrl: './season-list.component.css'
})
export default class SeasonListComponent implements OnInit {
  isLoading = signal(true);
  seasons = signal<SeasonDTO[]>([]);
  errorMessage = signal<string | null>(null);
  
  private router = inject(Router);
  private loginService = inject(LoginService);
  private seasonService = inject(SeasonService);
  
  ngOnInit(): void {
    this.checkAuthentication();
    this.loadSeasons();
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
    if (confirm('Are you sure you want to delete this season?')) {
      this.isLoading.set(true);
      this.seasonService.deleteSeason(id).subscribe({
        next: () => {
          this.loadSeasons();
        },
        error: (error) => {
          this.errorMessage.set('Error deleting season: ' + error.message);
          this.isLoading.set(false);
        }
      });
    }
  }
} 