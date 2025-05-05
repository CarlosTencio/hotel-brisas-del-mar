import { Component, inject, OnInit, signal } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { Page } from '../../models/page.interface';
import { HowToArriveComponent } from '../../components/how-to-arrive/how-to-arrive.component';

@Component({
  selector: 'app-location-page',
  standalone: true,
  imports: [HowToArriveComponent],
  templateUrl: './location-page.component.html',
  styleUrl: './location-page.component.css'
})
export default class LocationPageComponent implements OnInit {
  locationContent = inject(ContentService);
  dataPage = signal<Page[]>([]);
  errorMessage: string = '';

  ngOnInit() {
    this.locationContent.loadContent().subscribe({
      next: (respPages) => {
        this.dataPage.set(respPages);
      },
      error: (err) => {
        console.error('Error loading pages:', err);
        if (err.status) {
          if (err.status === 404) {
            this.errorMessage = 'No se encontraron las páginas.';
          } else if (err.status === 500) {
            this.errorMessage = 'Error en el servidor. Inténtalo más tarde.';
          }
        } else {
          this.errorMessage = 'Error al cargar las páginas. Inténtalo más tarde.';
        }
      }
    });
  }
}
