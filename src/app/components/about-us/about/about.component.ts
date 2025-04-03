import { Component, computed, input, OnInit } from '@angular/core';
import { Page } from '../../../models/page.interface';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent{

  dataPage = input.required<Page>();
  // errorMessage=input.required<string>();
  title = computed(() => this.dataPage().pageTitle);
  content = computed(() => this.dataPage().pageContent);
}
