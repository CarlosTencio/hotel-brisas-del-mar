import { Component } from '@angular/core';
import { BookingComponent } from '../../components/booking/booking.component';


@Component({
  selector: 'app-reservation-page',
  imports: [BookingComponent],
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.css'
})
export default class BookingPageComponent {

}
