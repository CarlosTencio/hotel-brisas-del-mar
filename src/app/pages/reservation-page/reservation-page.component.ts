import { Component } from '@angular/core';
import { ReservationComponent } from "../../components/reservation/reservation.component";

@Component({
  selector: 'app-reservation-page',
  imports: [ReservationComponent],
  templateUrl: './reservation-page.component.html',
  styleUrl: './reservation-page.component.css'
})
export default class ReservationPageComponent {

}
