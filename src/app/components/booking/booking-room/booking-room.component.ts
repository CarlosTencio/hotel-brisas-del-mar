import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { RoomType } from '../../../models/room-type.interface';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../core/services/room.service';
import { RoomAvailable } from '../../../models/room-available.interface';
import { BookingService } from '../../../core/services/booking.service';
import { RecommendationModalComponent } from '../recommendation-modal/recommendation-modal.component';

@Component({
  selector: 'booking-room',
  imports: [ReactiveFormsModule, CommonModule, RecommendationModalComponent],
  templateUrl: './booking-room.component.html',
})
export class BookingRoomComponent {

  bookingService = inject(BookingService);
  message: string = '';
  @Output() isAvailable = new EventEmitter<boolean>();
  errorMessage = signal<string>('');
  room = inject(RoomService);
  dataSelectRoomType = input.required<RoomType[]>();
  minDate = new Date().toISOString().split('T')[0]; // fecha mínima para el input de fecha de llegada
  minDateDeparture = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // un día después de hoy por defecto

  //data from form
  profileForm = new FormGroup({
    arrivalDate: new FormControl(''),
    departureDate: new FormControl(''),
    roomType: new FormControl(''),
  });

  // Método para actualizar la fecha mínima de salida cuando cambie la fecha de llegada
  onArrivalDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const arrivalDate = target.value;
    
    if (arrivalDate) {
      // Crear fecha de salida mínima (un día después de la llegada)
      const departure = new Date(arrivalDate);
      departure.setDate(departure.getDate() + 1);
      this.minDateDeparture = departure.toISOString().split('T')[0];
      
      // Limpiar la fecha de salida si es anterior a la nueva fecha mínima
      const currentDepartureDate = this.profileForm.get('departureDate')?.value;
      if (currentDepartureDate && currentDepartureDate <= arrivalDate) {
        this.profileForm.get('departureDate')?.setValue('');
      }
    }
  }

  onSubmit() {
    // console.log(this.profileForm.value);
    // Obtener los valores del formulario
    const arrivalDate = this.profileForm.get('arrivalDate')?.value;
    const departureDate = this.profileForm.get('departureDate')?.value;
    const roomTypeId = Number(this.profileForm.get('roomType')?.value);

    // Verificar que los valores existan antes de hacer la llamada
    if (arrivalDate && departureDate && roomTypeId) {
      this.room.checkAvailability(arrivalDate, departureDate, roomTypeId)
        .subscribe({
          next: (room: RoomAvailable) => {
            console.log(room);
            if (room.resultType === 'Available') {
              // Guardar los datos de la habitación en el servicio de reserva
              this.bookingService.saveData(room);
              this.isAvailable.emit(true); // Emitir el evento de disponibilidad
            }
            //Room not available, but there is another type of room available
            if (room.resultType === 'Recommendation') {
              //levantar modal
              this.message = 'No hay disponibilidad para las fechas seleccionadas, pero tenemos una recomendación para usted: Hay espacio en el tipo de habitación'
                + room.roomTypeName;
              this.openModal();
            }
            if (room.resultType === 'AlternativeDates') {
              this.message = 'No hay habitaciones disponibles para las fechas seleccionadas, pero puedes intentar entre estas fechas: ' + room.checkIn + ' - ' + room.checkOut;
              this.openModal();
            }
            if (room.resultType === 'NoAvailability') {
              this.message = 'Lo sentimos, no hay disponibilidad en las próximas fechas.';
              this.openModal();
            }
          },
          error: (error) => {
            if (error.status === 404) {
              this.errorMessage.set('No hay habitaciones disponibles para las fechas seleccionadas');
            } else if (error.status === 400 && error.error?.error) {
              // Captura los BadRequest y muestra el mensaje específico del backend
              this.message = error.error.error;
              this.openModal();
            } else {
              this.errorMessage.set('Ocurrió un error al consultar la disponibilidad');
            }
          },
        });
    }
  }
  //modal

  isModalOpen = signal<boolean>(false);

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    console.log('Modal closed');
    this.isModalOpen.set(false);
    this.isAvailable.emit(false);//emite el evento para volver al componente hermano
  }
}