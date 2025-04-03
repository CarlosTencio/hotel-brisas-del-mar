import { Component } from '@angular/core';
import { BookingRoomComponent } from './booking-room/booking-room.component';


@Component({
  selector: 'booking-component',
  imports: [BookingRoomComponent],
  templateUrl: './booking.component.html',
})
export class BookingComponent {

}
