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
  errorMessage = signal<string>('');

  ngOnInit() {
    this.aboutUsContent.loadContent().subscribe({
      next: (respPages) => {
        this.dataPage.set(respPages);
        this.errorMessage.set(''); // Limpiar cualquier error previo
      },
      error: (err) => {
        console.error('Error loading pages:', err);
        this.errorMessage.set(err.message); // Utilizamos directamente el mensaje procesado por el servicio
      }
    });
  }
}