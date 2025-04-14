import { Component, input } from '@angular/core';
import { Page } from '../../models/page.interface';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-contact-us',
  imports: [ContactComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  dataPage=input.required<Page[]>();
}
