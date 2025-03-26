import { Component,input } from '@angular/core';
import { Page } from '../../models/page.interface';
import { FacilitiesComponent } from "./facilities/facilities.component";
@Component({
  selector: 'app-facilities-item',
  imports: [FacilitiesComponent],
  templateUrl: './facilities-item.component.html',
  styleUrl: './facilities-item.component.css'
})
export class FacilitiesItemComponent {
  dataPage=input.required<Page[]>();
}
