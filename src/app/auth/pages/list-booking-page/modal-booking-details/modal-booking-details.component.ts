import { Component, Input, Output, EventEmitter, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BokingService } from '../../../services/boking.service';
import { RoomTypeService } from '../../../services/roomType.service';
import { jsPDF } from 'jspdf';
import { Booking } from '../../../models/booking';

@Component({
  selector: 'app-modal-booking-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-booking-details.component.html',
  styleUrl: './modal-booking-details.component.css'
})
export class ModalBookingDetailsComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() booking: Booking | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() deleteBooking = new EventEmitter<number>();

  private bookingService = inject(BokingService);
  private roomTypeService = inject(RoomTypeService);

  ngOnChanges(): void {
    if (this.booking) {
      console.log('=== Booking Data Debug ===');
      console.log('Full booking object:', this.booking);
      console.log('Check-in (raw):', this.booking.checkIn);
      console.log('Check-out (raw):', this.booking.checkOut);
      console.log('Room type:', this.booking.roomType);
      console.log('Transaction:', this.booking.transaction);
      console.log('========================');
      
      // Try to fetch additional room details if needed
      if (!this.booking.roomType?.price || this.booking.roomType.price === 0) {
        this.fetchRoomTypeDetails();
      }
    }
  }

  private fetchRoomTypeDetails(): void {
    // Try both possible field names due to inconsistency in the API
    const roomTypeId = this.booking?.roomType?.roomTypeId;
    
    if (roomTypeId) {
      console.log('Fetching room type details for ID:', roomTypeId);
      this.roomTypeService.getRoomByTypeId(roomTypeId).subscribe({
        next: (roomTypeData) => {
          console.log('Room type details fetched:', roomTypeData);
          if (this.booking && roomTypeData.price) {
            // Update the price in the current booking data
            this.booking.roomType.price = roomTypeData.price;
            if (roomTypeData.characteristics && !this.booking.roomType.characteristics) {
              this.booking.roomType.characteristics = roomTypeData.characteristics;
            }
            if (roomTypeData.description && !this.booking.roomType.description) {
              this.booking.roomType.description = roomTypeData.description;
            }
          }
        },
        error: (error) => {
          console.error('Error fetching room type details:', error);
        }
      });
    } else {
      console.warn('No room type ID found in booking data');
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onDeleteBooking(): void {
    if (this.booking) {
      this.deleteBooking.emit(this.booking.bookingid);
    }
  }

  printReservation(): void {
    if (!this.booking) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Hotel Brisas del Mar', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('Detalles de Reservación', pageWidth / 2, 35, { align: 'center' });
    
    // Line separator
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 45, pageWidth - 20, 45);
    
    // Booking information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    let yPosition = 60;
    const leftColumn = 25;
    const rightColumn = 110;
    
    // Left column - Booking details
    doc.text('INFORMACIÓN DE RESERVA', leftColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
    
    doc.text(`ID Reserva: ${this.booking.bookingReferenceNumber}`, leftColumn, yPosition);
    yPosition += 8;
    doc.text(`Check-in: ${this.formatDate(this.booking.checkIn)}`, leftColumn, yPosition);
    yPosition += 8;
    doc.text(`Check-out: ${this.formatDate(this.booking.checkOut)}`, leftColumn, yPosition);
    yPosition += 8;
    doc.text(`Noches: ${this.calculateNights()}`, leftColumn, yPosition);
    
    // Right column - Customer details
    yPosition = 60;
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE', rightColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
    
    doc.text(`Nombre: ${this.booking.customer.name}`, rightColumn, yPosition);
    yPosition += 8;
    doc.text(`Apellidos: ${this.booking.customer.lastName}`, rightColumn, yPosition);
    yPosition += 8;
    doc.text(`Email: ${this.booking.customer.email}`, rightColumn, yPosition);
    yPosition += 8;
    doc.text(`Tarjeta: ${this.maskCardNumber(this.booking.customer.cardNumber)}`, rightColumn, yPosition);
    
    // Room information
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DE HABITACIÓN', leftColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
    
    doc.text(`Tipo de Habitación: ${this.booking.roomType.roomTypeName}`, leftColumn, yPosition);
    yPosition += 8;
    doc.text(`Precio por noche: ${this.getFormattedPrice(this.getRoomPrice())}`, leftColumn, yPosition);
    yPosition += 8;
    doc.text(`Total: ${this.getFormattedPrice(this.getTotalPrice())}`, leftColumn, yPosition);
    yPosition += 8;
    if (this.booking.roomType.characteristics) {
      doc.text(`Características: ${this.booking.roomType.characteristics}`, leftColumn, yPosition);
      yPosition += 8;
    }
    if (this.booking.roomType.description) {
      doc.text(`Descripción: ${this.booking.roomType.description}`, leftColumn, yPosition, { maxWidth: pageWidth - 50 });
    }
    
    // Footer
    yPosition = doc.internal.pageSize.getHeight() - 30;
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    doc.text(`Impreso el: ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text('© 2024 Hotel Brisas del Mar. Todos los derechos reservados.', pageWidth / 2, yPosition + 5, { align: 'center' });
    
    // Save the PDF
    doc.save(`reservacion-${this.booking.bookingReferenceNumber}.pdf`);
  }

  formatDate(dateString: string): string {
    try {
      if (!dateString) return 'Fecha no disponible';
      
      // Si la fecha ya está en formato DD/MM/YYYY, la mostramos formateada
      if (dateString.includes('/')) {
        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      }
      
      // Para otros formatos, intentamos parsear
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      return dateString; // Si no podemos parsear, mostramos la fecha original
    } catch (error) {
      console.error('Error formatting date:', error, 'for date:', dateString);
      return dateString; // En caso de error, mostramos la fecha original
    }
  }

  formatDateTime(dateString: string): string {
    try {
      if (!dateString) return 'Fecha no disponible';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return 'Error en fecha';
    }
  }

  getFormattedPrice(price: number): string {
    try {
      if (typeof price !== 'number' || isNaN(price)) return '$0';
      return `$${price.toLocaleString('es-ES')}`;
    } catch (error) {
      console.error('Error formatting price:', error);
      return '$0';
    }
  }

  maskCardNumber(cardNumber: string): string {
    try {
      if (!cardNumber) return '•••• •••• •••• ****';
      const lastFourDigits = cardNumber.slice(-4);
      return `•••• •••• •••• ${lastFourDigits}`;
    } catch (error) {
      console.error('Error masking card number:', error);
      return '•••• •••• •••• ****';
    }
  }

  calculateNights(): number {
    try {
      if (!this.booking?.checkIn || !this.booking?.checkOut) return 0;
      
      // Convertir fechas en formato DD/MM/YYYY a Date
      const [checkInDay, checkInMonth, checkInYear] = this.booking.checkIn.split('/').map(Number);
      const [checkOutDay, checkOutMonth, checkOutYear] = this.booking.checkOut.split('/').map(Number);
      
      const checkIn = new Date(checkInYear, checkInMonth - 1, checkInDay);
      const checkOut = new Date(checkOutYear, checkOutMonth - 1, checkOutDay);
      
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        console.error('Invalid dates:', { checkIn: this.booking.checkIn, checkOut: this.booking.checkOut });
        return 0;
      }

      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error('Error calculating nights:', error);
      return 0;
    }
  }

  getRoomPrice(): number {
    try {
      console.log('Getting room price...');
      
      // Si tenemos una transacción válida y noches, calculamos el precio por noche
      if (this.booking?.transaction && !isNaN(this.booking.transaction) && this.booking.transaction > 0) {
        const nights = this.calculateNights();
        if (nights > 0) {
          const pricePerNight = this.booking.transaction / nights;
          console.log('Calculated price per night from transaction:', pricePerNight);
          return pricePerNight;
        }
      }
      
      // Si tenemos un precio válido en el tipo de habitación, lo usamos
      if (this.booking?.roomType?.price && !isNaN(this.booking.roomType.price) && this.booking.roomType.price > 0) {
        console.log('Using room type price:', this.booking.roomType.price);
        return this.booking.roomType.price;
      }
      
      console.warn('No valid price found');
      return 0;
    } catch (error) {
      console.error('Error getting room price:', error);
      return 0;
    }
  }

  getTotalPrice(): number {
    try {
      // Siempre usar la transacción si está disponible
      if (this.booking?.transaction && !isNaN(this.booking.transaction) && this.booking.transaction > 0) {
        return this.booking.transaction;
      }
      
      // Si no hay transacción, calcular desde el precio por noche
      const roomPrice = this.getRoomPrice();
      const nights = this.calculateNights();
      
      if (roomPrice > 0 && nights > 0) {
        return roomPrice * nights;
      }
      
      return 0;
    } catch (error) {
      console.error('Error calculating total price:', error);
      return 0;
    }
  }
} 