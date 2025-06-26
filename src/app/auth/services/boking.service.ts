import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Booking } from '../models/booking';
import { getBaseUrl } from '../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class BokingService {
  private readonly baseUrl = getBaseUrl();
  private readonly apiUrl = `${this.baseUrl}/Booking`;

  constructor(private http: HttpClient) { }

  private formatDate(dateString: string, isCreationDate: boolean = false): string {
    try {
      // For creation dates, if we're getting "31/12/1", let's use current date
      if (isCreationDate && (dateString === '31/12/1' || !dateString)) {
        const now = new Date();
        return now.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If the date is invalid and it's a creation date, use current date
        if (isCreationDate) {
          const now = new Date();
          return now.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        }
        throw new Error('Invalid date');
      }
      
      // For regular dates (check-in/check-out)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      if (isCreationDate) {
        // If there's any error with creation date, use current date
        const now = new Date();
        return now.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
      }
      return dateString;
    }
  }

  private transformDates(booking: Booking): Booking {
    return {
      ...booking,
      creationDate: this.formatDate(booking.creationDate, true),
      checkIn: this.formatDate(booking.checkIn),
      checkOut: this.formatDate(booking.checkOut)
    };
  }

  getAllBookings(page: number = 1): Observable<{ bookings: Booking[], totalBookings: number }> {
    return this.http.get<Booking[]>(`${this.apiUrl}/AllBooking?page=${page}`).pipe(
      map(response => {
        // Por ahora, solo manejamos las reservas hasta que el backend se actualice
        const bookings = Array.isArray(response) ? response.map(booking => this.transformDates(booking)) : [];
        // Usamos la longitud del array como total temporal
        const totalBookings = bookings.length;
        return { bookings, totalBookings };
      })
    );
  }

  deleteBooking(bookingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteBooking/?idBooking=${bookingId}`);
  }
}
