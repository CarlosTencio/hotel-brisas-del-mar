import { Component } from '@angular/core';
import { BookingRoomComponent } from './booking-room/booking-room.component';


@Component({
  selector: 'reservation-component',
  imports: [BookingRoomComponent],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {

}
