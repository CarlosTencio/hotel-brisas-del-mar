import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Page } from '../../../models/page.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  dataPage = input.required<Page>();
  image = computed(() => {
    const images = this.dataPage().images;
    if (!images || images.length === 0) {
      console.warn('No images available for the home page');
      return '';
    }
    return images[0];
  });
  content = computed(() => this.dataPage().pageContent);
  title = computed(() => this.dataPage().pageTitle);
} 