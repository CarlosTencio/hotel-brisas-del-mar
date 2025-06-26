import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.service';

interface Room {
  roomNumber: number;
  roomType: string;
  price: number;
}

// Si tu servicio retorna un tipo diferente, puedes usar este:
interface RoomActive {
  roomNumber: number;
  roomType: string;
  price: number;
}

@Component({
  selector: 'list-available-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-available-rooms.component.html',
  styleUrl: './list-available-rooms.component.css'
})
export class ListAvailableRoomsComponent {
  private roomService = inject(RoomService);
  
  // Propiedades para el formulario
  checkInDate: string = '';
  checkOutDate: string = '';
  roomType: number = 0;
  
  // Propiedades para los datos
  rooms: Room[] = [];
  loading: boolean = false;
  error: string = '';
  hasSearched: boolean = false;
  minDate = new Date().toISOString().split('T')[0];
  minDateDeparture = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Constantes para validación
  readonly MAX_STAY_DAYS = 30; // Máximo período de estancia

  private formatDateForBackend(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  private calculateDaysBetweenDates(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  onSearch() {
    // Limpiar estado previo
    this.error = '';
    this.rooms = [];
    
    // Validar que las fechas estén seleccionadas
    if (!this.checkInDate || !this.checkOutDate) {
      this.error = 'Por favor selecciona ambas fechas';
      return;
    }

    // Validar que la fecha de entrada sea anterior a la de salida
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    
    if (checkIn >= checkOut) {
      this.error = 'La fecha de entrada debe ser anterior a la fecha de salida';
      return;
    }

    // Validar duración máxima de estancia
    const stayDuration = this.calculateDaysBetweenDates(checkIn, checkOut);
    if (stayDuration > this.MAX_STAY_DAYS) {
      this.error = `La estancia máxima permitida es de ${this.MAX_STAY_DAYS} días. Has seleccionado ${stayDuration} días.`;
      return;
    }

    this.loading = true;
    this.hasSearched = true;

    // Formatear fechas para el backend (DD/MM/YYYY)
    const formattedCheckIn = this.formatDateForBackend(this.checkInDate);
    const formattedCheckOut = this.formatDateForBackend(this.checkOutDate);
    const roomTypeNumber = Number(this.roomType);
    
    console.log('Enviando búsqueda:', {
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut,
      roomType: roomTypeNumber
    });

    // Llamar al servicio para obtener las habitaciones disponibles
    this.roomService.listAvailableRooms(formattedCheckIn, formattedCheckOut, roomTypeNumber)
      .subscribe({
        next: (data: Room[]) => {
          console.log('Respuesta del servidor:', data);
          this.rooms = data;
          this.loading = false;
          
          if (data.length === 0) {
            this.error = `No se encontraron habitaciones disponibles para las fechas seleccionadas (${stayDuration} días de estancia)`;
          }
        },
        error: (err) => {
          console.error('Error al buscar habitaciones:', err);
          
          // Manejar diferentes tipos de errores
          if (err.status === 400) {
            if (err.error?.errors?.availabilityCriterion) {
              this.error = 'Error en el criterio de disponibilidad';
            } else if (err.error?.errors?.['$.entryDate'] || err.error?.errors?.['$.departureDate']) {
              this.error = 'Error en el formato de las fechas. Por favor, intenta de nuevo.';
            } else {
              this.error = 'Error en los datos enviados. Por favor, verifica la información e intenta de nuevo.';
            }
          } else {
            this.error = 'Error al buscar habitaciones disponibles. Por favor, intenta de nuevo más tarde.';
          }
          
          this.loading = false;
          this.rooms = [];
        }
      });
  }
  
  onCheckInDateChange() {
    if (this.checkInDate) {
      // Actualizar la fecha mínima de salida al día siguiente de la fecha de entrada
      const checkInDate = new Date(this.checkInDate);
      const nextDay = new Date(checkInDate);
      nextDay.setDate(checkInDate.getDate() + 1);
      this.minDateDeparture = nextDay.toISOString().split('T')[0];
      
      // Si la fecha de salida actual es anterior a la nueva fecha mínima, limpiarla
      if (this.checkOutDate && new Date(this.checkOutDate) <= checkInDate) {
        this.checkOutDate = '';
      }

      // Si la fecha de salida excede la estancia máxima, ajustarla
      if (this.checkOutDate) {
        const maxStayDate = new Date(checkInDate);
        maxStayDate.setDate(checkInDate.getDate() + this.MAX_STAY_DAYS);
        if (new Date(this.checkOutDate) > maxStayDate) {
          this.checkOutDate = maxStayDate.toISOString().split('T')[0];
        }
      }
    }
  }
}