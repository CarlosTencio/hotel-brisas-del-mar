import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../../models/page.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  dataPage = input.required<Page>();
  image = computed(() => this.dataPage().images[0]);
  content = computed(() => this.dataPage().pageContent);
  title = computed(() => this.dataPage().pageTitle);
} 