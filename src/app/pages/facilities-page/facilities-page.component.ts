import { Component, inject, OnInit, signal } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { Page } from '../../models/page.interface';
import { FacilitiesItemComponent } from '../../components/facilities-item/facilities-item.component';
@Component({
  selector: 'app-facilities-page',
  imports: [FacilitiesItemComponent],
  templateUrl: './facilities-page.component.html',
  styleUrl: './facilities-page.component.css'
})
export default class FacilitiesPageComponent implements OnInit {

  facilities= inject(ContentService);
  dataPage = signal<Page[]>([]);

  ngOnInit() {
    this.facilities.loadFacilities().subscribe({
      next: (respPages) => {
        this.dataPage.set(respPages);
      },
      error: (err) => {
        // Optional: handle error
        console.error('Error loading pages', err);
      }
    });
}
}
