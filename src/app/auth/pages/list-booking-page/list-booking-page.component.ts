import { Component, inject, signal, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BokingService } from '../../services/boking.service';
import { Router } from '@angular/router';
import { ModalListBookingComponent } from "./modal-list-booking/modal-list-booking.component";
import { ModalBookingDetailsComponent } from "./modal-booking-details/modal-booking-details.component";
import { CommonModule } from '@angular/common';
import { Booking } from '../../models/booking';

interface TokenResponse {
  tokenDTOString: string;
}

@Component({
  selector: 'app-list-booking-page',
  standalone: true,
  imports: [CommonModule, ModalListBookingComponent, ModalBookingDetailsComponent],
  templateUrl: './list-booking-page.component.html',
  styleUrl: './list-booking-page.component.css'
})
export default class ListBookingPageComponent implements OnInit {
  isLoading = signal(true);
  hasMorePages = signal(true);
  totalBookings = signal(0);
  pageSize = 6; // Debe coincidir con el SP
  
  login = inject(LoginService);
  bookingService = inject(BokingService);
  router = inject(Router);
  
  bookings: Booking[] = [];
  currentPage = 1;
  
  // Modal states
  showModal = false;
  bookingToDelete: number | null = null;
  
  // Details modal properties
  showDetailsModal = false;
  selectedBooking: Booking | null = null;
  
  ngOnInit(): void {
    this.checkAuthAndLoadBookings();
  }

  private checkAuthAndLoadBookings(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No token found');
      this.router.navigate(['/login']);
      return;
    }

    this.login.verifyToken(token).subscribe({
      next: (tokenResponse) => {
        if (!tokenResponse) {
          this.router.navigate(['/login']);
          return;
        }
        this.loadBookings(this.currentPage);
      },
      error: (err) => {
        console.error('Error verificando token:', err);
        this.router.navigate(['/login']);
      }
    });
  }

  loadBookings(page: number): void {
    if (page < 1) {
      page = 1;
    }
    
    this.isLoading.set(true);
    this.bookingService.getAllBookings(page).subscribe({
      next: (response) => {
        this.bookings = response.bookings;
        this.currentPage = page;
        this.totalBookings.set(response.totalBookings);
        
        // Calculamos si hay más páginas basándonos en el total y el tamaño de página
        const totalPages = Math.ceil(response.totalBookings / this.pageSize);
        this.hasMorePages.set(page < totalPages);

        // Si no hay datos y estamos en una página mayor a 1, volvemos a la página anterior
        if (response.bookings.length === 0 && page > 1) {
          this.loadBookings(page - 1);
        }
      },
      error: (err) => {
        console.error('Error cargando las reservas:', err);
        this.bookings = [];
        this.totalBookings.set(0);
        this.hasMorePages.set(false);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.totalBookings() / this.pageSize);
    if (this.currentPage < totalPages) {
      this.loadBookings(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadBookings(this.currentPage - 1);
    }
  }

  // Método helper para mostrar información de paginación
  getPaginationInfo(): string {
    if (this.totalBookings() === 0) {
      return 'No hay reservaciones';
    }
    const start = ((this.currentPage - 1) * this.pageSize) + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalBookings());
    return `Mostrando ${start}-${end} de ${this.totalBookings()} reservas`;
  }

  viewBooking(bookingId: number): void {
    const booking = this.bookings.find(b => b.bookingid === bookingId);
    if (booking) {
      this.selectedBooking = booking;
      this.showDetailsModal = true;
    } else {
      console.error('Reserva no encontrada');
    }
  }

  openDeleteModal(bookingId: number): void {
    this.bookingToDelete = bookingId;
    this.showModal = true;
  }

  cancelDelete(): void {
    this.showModal = false;
    this.bookingToDelete = null;
  }

  confirmDelete(bookingId: number): void {
    this.isLoading.set(true);
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        console.log('Reserva eliminada exitosamente');
        this.loadBookings(this.currentPage);
        this.showModal = false;
        this.bookingToDelete = null;
      },
      error: (err) => {
        console.error('Error eliminando la reserva:', err);
        this.isLoading.set(false);
      }
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedBooking = null;
  }

  deleteBookingFromDetails(bookingId: number): void {
    this.showDetailsModal = false;
    this.selectedBooking = null;
    this.openDeleteModal(bookingId);
  }

  // Método para enmascarar el número de tarjeta
  maskCardNumber(cardNumber: string): string {
    if (!cardNumber) return '****';
    // Asegurarse de que solo se muestren los últimos 4 dígitos
    const lastFourDigits = cardNumber.slice(-4);
    return `•••• •••• •••• ${lastFourDigits}`;
  }
}
