import { Component, inject, signal, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BokingService } from '../../services/boking.service';
import { Router } from '@angular/router';
import { ModalListBookingComponent } from "./modal-list-booking/modal-list-booking.component";
import { ModalBookingDetailsComponent } from "./modal-booking-details/modal-booking-details.component";


interface TokenResponse {
  tokenDTOString: string;
}
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
  selector: 'app-list-booking-page',
  imports: [ModalListBookingComponent, ModalBookingDetailsComponent],
  templateUrl: './list-booking-page.component.html',
  styleUrl: './list-booking-page.component.css'
})
export default class ListBookingPageComponent {
  isLoading = signal(true);
  
  constructor(private router: Router) {
    
  }
  login= inject(LoginService);
  bookings: Booking[] = [];
  currentPage: number = 1;
  bookingService = inject(BokingService);
  
  // Modal states
  showModal = false;
  bookingToDelete: number | null = null;
  
  // Details modal properties
  showDetailsModal = false;
  selectedBooking: Booking | null = null;
  
  ngOnInit(): void {
    this.loadBookings(this.currentPage);
    const token = localStorage.getItem('token');
    // console.log('Token:', token);
    
    if (token) {
      this.login.verifyToken(token).subscribe({
        next: (tokenResponse) => {
         
          this.isLoading.set(false);
          if(!tokenResponse) {
           
           
            this.router.navigate(['/login']);
          
          }
      
        },
        error: (err) => {
          console.error('Error loading pages', err);
        }
      });
    } else {
      console.error('No token found');
      // Redirect to login page
      this.router.navigate(['/login']);
    }
  }

  loadBookings(page: number): void {
    this.bookingService.getAllBookings(page).subscribe({
      next: (data) => {
        this.bookings = data;
        this.currentPage = page;
      },
      error: (err) => {
        console.error('Error cargando las reservas', err);
      }
    });
  }

  nextPage(): void {
    this.loadBookings(this.currentPage + 1);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadBookings(this.currentPage - 1);
    }
  }

  delteBooking(bookingId: number): void {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        console.log('Booking deleted successfully');
        // Reload bookings after deletion
        this.loadBookings(this.currentPage);
      },
      error: (err) => {
        console.error('Error deleting booking', err);
      }
    });
  }

  // Updated viewBooking method
  viewBooking(bookingId: number): void {
    const booking = this.bookings.find(b => b.bookingid === bookingId);
    if (booking) {
      this.selectedBooking = booking;
      this.showDetailsModal = true;
    } else {
      console.error('Booking not found');
    }
  }

  // Delete modal methods
  openDeleteModal(bookingId: number): void {
    this.bookingToDelete = bookingId;
    this.showModal = true;
  }

  cancelDelete(): void {
    this.showModal = false;
    this.bookingToDelete = null;
  }

  confirmDelete(bookingId: number): void {
    this.bookingService.deleteBooking(bookingId).subscribe({
      next: () => {
        console.log('Booking deleted successfully');
        this.loadBookings(this.currentPage);
        this.showModal = false;
        this.bookingToDelete = null;
      },
      error: (err) => {
        console.error('Error deleting booking', err);
      }
    });
  }

  // Details modal methods
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedBooking = null;
  }

  deleteBookingFromDetails(bookingId: number): void {
    this.showDetailsModal = false;
    this.selectedBooking = null;
    // Show confirmation modal
    this.openDeleteModal(bookingId);
  }
}
