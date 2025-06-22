import { Component, inject, OnInit, signal  } from '@angular/core';
import { ContentService } from '../../core/services/content.service';
import { Page } from '../../models/page.interface';
import { ContactUsComponent } from "../../components/contact-us/contact-us.component";

@Component({
  selector: 'app-contact-us-page',
  imports: [ContactUsComponent],
  templateUrl: './contact-us-page.component.html',
  styleUrl: './contact-us-page.component.css'
})
export default class ContactUsPageComponent implements OnInit {
  contactUsMessage = inject(ContentService);
  dataPage = signal<Page[]>([]);
  
  ngOnInit() {
    this.contactUsMessage.loadContent().subscribe({
      next: (respPages) => {
        this.dataPage.set(respPages);
      },
      error: (err) => {
        console.error('Error loading pages', err);
      }
    });
  }
}