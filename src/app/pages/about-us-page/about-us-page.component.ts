import { Component, inject, OnInit, signal } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { Page } from '../../models/page.interface';
import { AboutUsComponent } from '../../components/about-us/about-us.component';

@Component({
  selector: 'app-about-us-page',
  imports: [AboutUsComponent],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css'
})
export default class AboutUsPageComponent implements OnInit {
  aboutUsContent = inject(ContentService);
  dataPage = signal<Page[]>([]);
  errorMessage:string=' ';

  ngOnInit() {

    this.aboutUsContent.loadContent().subscribe({
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