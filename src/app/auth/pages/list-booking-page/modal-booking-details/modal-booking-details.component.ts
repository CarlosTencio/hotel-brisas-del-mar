import { Component, Input, Output, EventEmitter, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BokingService } from '../../../services/boking.service';
import { RoomTypeService } from '../../../services/roomType.service';
import { jsPDF } from 'jspdf';

interface Customer {
  name: string;
  lastName: string;
  email: string;
  cardNumber: string;
}

interface RoomType {
  roomTypeID: number;
  roomTypeName: string;
  price: number;
  characteristics: string | null;
  description: string | null;
  image: string | null;
}

interface Booking {
  bookingid: number;
  roomID: number;
  creationDate: string;
  checkIn: string;
  checkOut: string;
  customerID: number;
  transaction: number;
  bookingReferenceNumber: string;
  customer: Customer;
  roomType: RoomType;
}

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
      console.log('Booking data received:', this.booking);
      console.log('Room type price:', this.booking.roomType?.price);
      console.log('Transaction (total price):', this.booking.transaction);
      
      // Try to fetch additional room details if needed
      if (!this.booking.roomType?.price || this.booking.roomType.price === 0) {
        this.fetchRoomTypeDetails();
      }
    }
  }

  private fetchRoomTypeDetails(): void {
    // Try both possible field names due to inconsistency in the API
    const roomTypeId = this.booking?.roomType?.roomTypeID || this.booking?.roomType?.roomTypeID;
    
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
    doc.text(`Check-in: ${new Date(this.booking.checkIn).toLocaleDateString('es-ES')}`, leftColumn, yPosition);
    yPosition += 8;
    doc.text(`Check-out: ${new Date(this.booking.checkOut).toLocaleDateString('es-ES')}`, leftColumn, yPosition);
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
    doc.text(`Tarjeta: ****${this.booking.customer.cardNumber.slice(-4)}`, rightColumn, yPosition);
    
    // Room information
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DE HABITACIÓN', leftColumn, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 10;
    
    doc.text(`Tipo de Habitación: ${this.booking.roomType.roomTypeName}`, leftColumn, yPosition);
    yPosition += 8;
    doc.text(`Precio por noche: $${this.getRoomPrice().toLocaleString()}`, leftColumn, yPosition);
    yPosition += 8;
    doc.text(`Total: $${this.getTotalPrice().toLocaleString()}`, leftColumn, yPosition);
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
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  maskCardNumber(cardNumber: string): string {
    return `****-****-****-${cardNumber.slice(-4)}`;
  }

  calculateNights(): number {
    if (!this.booking) return 0;
    const checkIn = new Date(this.booking.checkIn);
    const checkOut = new Date(this.booking.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log('Calculated nights:', nights, 'from', checkIn, 'to', checkOut);
    return nights;
  }

  calculateTotal(): number {
    // Return the transaction value directly as it contains the total
    const total = this.getTotalPrice();
    console.log('Total price from transaction:', total);
    return total;
  }

  getRoomPrice(): number {
    // Use transaction field as total price and calculate price per night
    if (this.booking?.transaction && this.calculateNights() > 0) {
      const totalPrice = this.booking.transaction;
      const nights = this.calculateNights();
      const pricePerNight = totalPrice / nights;
      console.log('Price calculation: total:', totalPrice, '/ nights:', nights, '= per night:', pricePerNight);
      return Math.round(pricePerNight); // Round to avoid decimals
    }
    
    // Fallback to original price field if available
    return this.booking?.roomType?.price || 0;
  }

  getTotalPrice(): number {
    // Transaction field contains the total price
    return this.booking?.transaction || 0;
  }

  getFormattedPrice(price: number): string {
    return price > 0 ? `$${price.toLocaleString()}` : 'No disponible';
  }
} 