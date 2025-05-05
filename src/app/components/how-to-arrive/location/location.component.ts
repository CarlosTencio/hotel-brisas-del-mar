import { Component, computed, input } from '@angular/core';
import { Page } from '../../../models/page.interface';

@Component({
  selector: 'app-location',
  standalone: true,
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  dataPage = input.required<Page>();
  title = computed(() => this.dataPage().pageTitle);
  content = computed(() => this.dataPage().pageContent);
}
