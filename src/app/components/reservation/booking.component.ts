import { Component, inject, OnInit, signal } from '@angular/core';
import { BookingRoomComponent } from './booking-room/booking-room.component';

import { RoomTypeService } from '../../core/services/roomType.service';
import { RoomType } from '../../models/room-type.interface';
import { PersonalDataBookingComponent } from "./personal-data-booking/personal-data-booking.component";


@Component({
  selector: 'booking-component',
  imports: [BookingRoomComponent, PersonalDataBookingComponent],
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
  isAvailable:boolean= false;
  RoomType = inject(RoomTypeService);
  dataRoomType: RoomType[] = [];
  errorMessage = signal<string>('');

  updateProporty(newValue: boolean) {
    this.isAvailable = newValue;
  }


  ngOnInit() {
    this.loadSelect();
  }
  loadSelect() {
    this.RoomType.loadSelectRoomType().subscribe({
      next: (respRoomTypes) => {
        this.dataRoomType = respRoomTypes; // Guardamos el array completo
        this.errorMessage.set(''); // Limpiar cualquier error previo
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al cargar los tipos de habitación');
      }
    });
  }
}
