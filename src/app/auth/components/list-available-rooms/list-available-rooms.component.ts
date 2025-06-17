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
  imports: [CommonModule, FormsModule],
  templateUrl: './list-available-rooms.component.html',
  styleUrl: './list-available-rooms.component.css'
})
export class ListAvailableRoomsComponent {
  roomService = inject(RoomService);
  
  // Propiedades para el formulario
  checkInDate: string = '';
  checkOutDate: string = '';
  roomType: number = 0;
  
  // Propiedades para los datos
  rooms: Room[] = [];
  loading: boolean = false;
  error: string = '';
  hasSearched: boolean = false;
  minDate = new Date().toISOString().split('T')[0]; // fecha mínima para el input de fecha de llegada
  minDateDeparture = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // un día después de hoy por defecto


  onSearch() {
    // Validar que las fechas estén seleccionadas
    if (!this.checkInDate || !this.checkOutDate) {
      this.error = 'Por favor selecciona ambas fechas';
      return;
    }

    // Validar que la fecha de entrada sea anterior a la de salida
    if (new Date(this.checkInDate) >= new Date(this.checkOutDate)) {
      this.error = 'La fecha de entrada debe ser anterior a la fecha de salida';
      return;
    }

    this.loading = true;
    this.error = '';
    this.hasSearched = true;

    // Asegurar que roomType sea un número
    const roomTypeNumber = Number(this.roomType);
    
    // Debug: mostrar los valores que se están enviando
    console.log('Enviando datos:', {
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      roomType: roomTypeNumber,
      roomTypeOriginal: this.roomType,
      roomTypeType: typeof this.roomType
    });

    // Llamar al servicio para obtener las habitaciones disponibles
    this.roomService.listAvailableRooms(this.checkInDate, this.checkOutDate, roomTypeNumber)
      .subscribe({
        next: (data: any) => { // Cambiamos a 'any' para evitar conflictos de tipos
          this.rooms = data;
          this.loading = false;
        },
        error: (err: any) => {
          this.error = 'Error al cargar las habitaciones disponibles';
          this.loading = false;
          console.error('Error:', err);
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
  }
}
  
}