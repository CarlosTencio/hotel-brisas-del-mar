import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../models/page.interface';
import { ContentService } from '../../core/services/content.service';
import { HomeItemComponent } from '../../components/home-item/home-item.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HomeItemComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export default class HomePageComponent implements OnInit {
  private contentService = inject(ContentService);
  pageData = signal<Page | null>(null);

  ngOnInit() {
    this.loadPageContent();
  }

  private loadPageContent() {
    this.contentService.loadPageByTitle('Inicio').subscribe({
      next: (page) => {
        console.log('Home page data:', page);
        this.pageData.set(page);
      },
      error: (error) => {
        console.error('Error loading home page content:', error);
        // Try fallback to loadContent method
        this.loadContentFallback();
      }
    });
  }

  private loadContentFallback() {
    this.contentService.loadContent().subscribe({
      next: (pages) => {
        const homePage = pages.find(page => page.pageTitle === 'Inicio');
        if (homePage) {
          console.log('Home page data from fallback:', homePage);
          this.pageData.set(homePage);
        }
      },
      error: (error) => {
        console.error('Error in fallback home page content load:', error);
      }
    });
  }

  get validPageData(): Page | null {
    return this.pageData() ? this.pageData() : null;
  }
}
