import { Component, Input } from '@angular/core';
import { Page } from '../../models/page.interface';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-home-item',
  standalone: true,
  imports: [HomeComponent],
  templateUrl: './home-item.component.html',
  styleUrl: './home-item.component.css'
})
export class HomeItemComponent {
  @Input() page!: Page;
} 