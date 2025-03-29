import { Component, computed, Input, input, OnInit, signal } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { Page } from '../../../models/page.interface';

@Component({
  selector: 'app-gallery',
  imports: [NgClass, NgFor],
  standalone: true,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  @Input() dataPage!: Page;

  excludedImages = [
    '/images/equipo.jpg',
    '/images/logo.png'
  ];

  filteredImages = computed(() => 
    this.dataPage.images.filter(img => !this.excludedImages.includes(img))
  );

  selectedImage = signal('');
  ngOnInit(): void {
    
    if (this.filteredImages().length > 0) {
      this.selectedImage.set(this.filteredImages()[0]);
    }
  }  
  
  setSelectedImage(image: string) {
    this.selectedImage.set(image);
  }

  limitedImages() {
    return this.filteredImages().slice(0, 16);
  }
}
