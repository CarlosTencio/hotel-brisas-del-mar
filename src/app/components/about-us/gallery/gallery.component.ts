import { Component, computed, input, OnInit } from '@angular/core';
import { Page } from '../../../models/page.interface';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {

  dataPage = input.required<Page>();

  images = computed(() => this.dataPage().images);
  responsiveOptions: any;

  /* images = computed(() => {
    return this.dataPage.images.map(image => image.url);
  }); */
}
