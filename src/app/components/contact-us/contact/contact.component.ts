import { Component, computed, input, OnInit, signal  } from '@angular/core';
import { Page } from '../../../models/page.interface';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    NgFor
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  dataPage = input.required<Page>();

  title = computed(() => this.dataPage().pageTitle);
  content = computed(() => this.dataPage().pageContent.split(';'));
  image = computed(() => this.dataPage().images);

  excludedImages = [
    '/images/equipo.jpg',
    '/images/logo.png'
  ];

  filteredImages = computed(() =>
    this.dataPage().images?.filter(img => !this.excludedImages.includes(img)) ?? []
  );

  selectedImage = signal('');
  ngOnInit(): void {
    
    if (this.filteredImages().length > 0) {
      this.selectedImage.set(this.filteredImages()[1]);
    }
  }  
  
  setSelectedImage(image: string) {
    this.selectedImage.set(image);
  }

  limitedImages() {
    return this.filteredImages().slice(0, 16);
  }
}
