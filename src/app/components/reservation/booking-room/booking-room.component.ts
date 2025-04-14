import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { RoomType } from '../../../models/room-type.interface';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../core/services/room.service';
import { RoomAvailable } from '../../../models/room-available.interface';

@Component({
  selector: 'booking-room',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './booking-room.component.html',
})
export class BookingRoomComponent {
  @Output() isAvailable = new EventEmitter<boolean>();
  errorMessage = signal<string>('');
  Room = inject(RoomService);
  dataSelectRoomType = input.required<RoomType[]>();

  //data from form
  profileForm = new FormGroup({
    arrivalDate: new FormControl(''),
    departureDate: new FormControl(''),
    roomType: new FormControl(''),
  });

  onSubmit() {
    // console.log(this.profileForm.value);

    // Obtener los valores del formulario
    const arrivalDate = this.profileForm.get('arrivalDate')?.value;
    const departureDate = this.profileForm.get('departureDate')?.value;
    const roomTypeId = Number(this.profileForm.get('roomType')?.value);

    // Verificar que los valores existan antes de hacer la llamada
    if (arrivalDate && departureDate && roomTypeId) {
      this.Room.checkAvailability(arrivalDate, departureDate, roomTypeId)
        .subscribe({
          next: (room: RoomAvailable) => {
            // Si retona un objeto, significa que hay habitaciones disponibles

            this.isAvailable.emit(true); // Emitir el evento de disponibilidad
            console.log('Habitación disponible:', this.isAvailable);

            if (room == null) {
              //levantar modal
              console.log('No hay habitaciones disponibles');
            }
            // Aquí puedes manejar la lógica para mostrar la disponibilidad
          },
          error: (error) => {
            console.error('Error al verificar disponibilidad:', error);

            if (error.status === 404) {
              this.errorMessage.set('No hay habitaciones disponibles para las fechas seleccionadas');
            } else {
              this.errorMessage.set('Ocurrió un error al consultar la disponibilidad');
            }

            // this.mostrarAlertaError = true;
          },
        });
    }
  }


}