import { Component, inject, OnInit, OnDestroy, signal, EventEmitter, Output } from '@angular/core';
import { BookingService } from '../../../core/services/booking.service';
import { RoomType } from '../../../models/room-type.interface';
import { RoomAvailable } from '../../../models/room-available.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../models/customer.interface';
import { Booking } from '../../../models/booking.interface';
import { BookingResponse } from '../../../models/booking-response.interface';
import { Subscription } from 'rxjs';
import { ModalComponent } from "../confirmation-modal/confirmation-modal.component";
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'personal-data-booking',
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './personal-data-booking.component.html',
})
export class PersonalDataBookingComponent implements OnInit, OnDestroy {
  @Output() isAvailable = new EventEmitter<boolean>();
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  bookingService = inject(BookingService);
  roomService = inject(RoomService);


  room!: RoomAvailable;
  private bookingSubscription?: Subscription;

  // Formulario mejorado con validadores
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{16}$/), // Validación básica para tarjeta de 16 dígitos
    ]),
  });

  ngOnInit(): void {
    // Suscripción al observable de datos de reserva
    this.bookingSubscription = this.bookingService.bookingData$.subscribe((data) => {
      // Access the booking data here
      if (data !== null) {
        this.room = data.roomAvailable;
        this.room.roomNumber = data.roomAvailable.roomNumber;
        this.room.roomId = data.roomAvailable.roomId;
        this.room.roomTypeId = data.roomAvailable.roomTypeId;
        this.room.roomTypeName = data.roomAvailable.roomTypeName;
        this.room.description = data.roomAvailable.description;
        this.room.price = data.roomAvailable.price;
        this.room.imgUrl = data.roomAvailable.imgUrl;
        this.room.checkIn = data.roomAvailable.checkIn;
        this.room.checkOut = data.roomAvailable.checkOut;
      }
    });
  }


  ngOnDestroy(): void {
    // Limpieza de suscripción cuando el componente se destruye
    if (this.bookingSubscription) {
      this.bookingSubscription.unsubscribe();
    }
    this.roomService.updateStatus(this.room.roomId, 1).subscribe({
      error: (error) => console.error('Error al actualizar estado:', error)
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.errorMessage.set('Por favor complete todos los campos correctamente');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const customer: Customer = {
      name: this.profileForm.get('name')?.value || '',
      lastName: this.profileForm.get('lastName')?.value || '',
      email: this.profileForm.get('email')?.value || '',
      cardNumber: this.profileForm.get('cardNumber')?.value || '',
    };

    const booking: Booking = {
      Customer: customer,
      RoomId: this.room.roomId,
      CheckIn: this.room.checkIn,
      CheckOut: this.room.checkOut,
      Transaction: this.room.price,
    };


    this.bookingService.createBooking(booking).subscribe({
      next: (response: BookingResponse) => {

        this.isLoading.set(false);
        if (response.status === "Success") {
          this.openModal();

          this.bookingService.cleanData(); // Limpiar los datos de reserva después de la creación
        } else {
          console.log('Error al registrar la reserva', response);
          this.errorMessage.set(response.status || 'Error al registrar la reserva');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.status === 404) {
          this.errorMessage.set('No hay habitaciones disponibles para las fechas seleccionadas');
        } else {
          this.errorMessage.set('Ocurrió un error al procesar la reserva');
        }
      },
    });
  }


  //modal

  isModalOpen = signal<boolean>(false);

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.isAvailable.emit(false);//emite el evento para volver al componente hermano
  }


}
