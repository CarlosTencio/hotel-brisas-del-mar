import { Component, input } from '@angular/core';
import { AboutComponent } from "./about/about.component";
import { Page } from '../../models/page.interface';
import { GalleryComponent } from "./gallery/gallery.component";

@Component({
  selector: 'app-about-us',
  imports: [AboutComponent, GalleryComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
dataPage=input.required<Page[]>();
}
