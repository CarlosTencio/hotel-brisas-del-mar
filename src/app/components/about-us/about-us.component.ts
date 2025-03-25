import { Component, input } from '@angular/core';
import { AboutComponent } from "./about/about.component";
import { Page } from '../../models/page.interface';

@Component({
  selector: 'app-about-us',
  imports: [AboutComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
dataPage=input.required<Page[]>();
}
