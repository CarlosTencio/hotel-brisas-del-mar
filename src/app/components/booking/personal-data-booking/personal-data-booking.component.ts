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
import { EmailJSService } from '../../../core/services/email.service';

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
  emailJSService = inject(EmailJSService); // Asegúrate de que EmailJSService esté proporcionado en tu módulo

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

  private async sendConfirmationEmailJS(customer: Customer): Promise<void> {
    const emailData = {
      customerEmail: customer.email,
      customerName: `${customer.name} ${customer.lastName}`,
      roomNumber: this.room.roomNumber,
      roomType: this.room.roomTypeName,
      description: this.room.description,
      checkIn: new Date(this.room.checkIn).toLocaleDateString('es-ES'),
      checkOut: new Date(this.room.checkOut).toLocaleDateString('es-ES'),
      price: this.room.price // Mantenemos el número para la interfaz EmailData
    };

    try {
      await this.emailJSService.sendBookingConfirmation(emailData);
      console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }
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

    // Ensure dates are in the correct format for SQL Server (YYYY-MM-DDTHH:mm:ss)
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString();
    };

    const booking: Booking = {
      Customer: customer,
      RoomId: this.room.roomId,
      CheckIn: formatDate(this.room.checkIn),
      CheckOut: formatDate(this.room.checkOut),
      Transaction: this.room.price,
    };

    console.log('Sending booking:', booking); // Debug log

    this.bookingService.createBooking(booking).subscribe({
      next: async (response: BookingResponse) => {
        console.log('Booking response:', response); // Debug log
        try {
          if (response.status === "Success") {
            await this.sendConfirmationEmailJS(customer);
            this.bookingService.cleanData();
            this.openModal();
          } else {
            throw new Error(response.status || 'Error al registrar la reserva');
          }
        } catch (error) {
          console.error('Error en el proceso:', error);
          if (error instanceof Error) {
            this.errorMessage.set(error.message);
          } else {
            this.errorMessage.set('Ocurrió un error inesperado');
          }
          this.isLoading.set(false);
        }
      },
      error: (error) => {
        console.error('Error completo:', error); // Debug log
        if (error.status === 404) {
          this.errorMessage.set('No hay habitaciones disponibles para las fechas seleccionadas');
        } else if (error.error && error.error.ErrorMessage) {
          this.errorMessage.set(`Error: ${error.error.ErrorMessage}`);
        } else {
          this.errorMessage.set('Ocurrió un error al procesar la reserva. Por favor, intente nuevamente.');
        }
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
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
