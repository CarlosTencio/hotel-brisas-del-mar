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
  aboutUsMessage = inject(ContentService);
  dataPage = signal<Page[]>([]);

  ngOnInit() {
    this.aboutUsMessage.loadContent().subscribe({
      next: (respPages) => {
        // Set the retrieved pages to the signal
        this.dataPage.set(respPages);
      },
      error: (err) => {
        // Optional: handle error
        console.error('Error loading pages', err);
      }
    });
  }
}