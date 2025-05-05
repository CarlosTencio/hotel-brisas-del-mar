import { Component, input } from '@angular/core';
import { LocationComponent } from "./location/location.component";
import { MapComponent } from "./map/map.component";
import { Page } from '../../models/page.interface';

@Component({
  selector: 'app-how-to-arrive',
  standalone: true,
  imports: [LocationComponent, MapComponent],
  templateUrl: './how-to-arrive.component.html',
  styleUrl: './how-to-arrive.component.css'
})
export class HowToArriveComponent {
  dataPage = input.required<Page[]>();

  ngOnInit() {
    console.log('HowToArriveComponent loaded');
    console.log('Data received:', this.dataPage());
  }
} 