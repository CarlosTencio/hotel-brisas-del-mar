import { Component,computed, input, } from '@angular/core';
import { Page } from '../../../models/page.interface';
@Component({
  selector: 'app-facilities',
  imports: [],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.css'
})
export class FacilitiesComponent {
  dataPage = input.required<Page>();
  image = computed(() => this.dataPage().images);
  content = computed(() => this.dataPage().pageContent);
}
