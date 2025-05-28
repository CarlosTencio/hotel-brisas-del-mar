import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
@Injectable({
  providedIn: 'root'
})
export class BokingService {
 private apiUrl = 'https://localhost:7075/api/Booking';
 private deleteUrl = 'https://localhost:7075/api/Booking/DeleteBooking';
  constructor(private http: HttpClient) { }
 getAllBookings(page: number = 1): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/AllBooking?page=${page}`);
  }
  deleteBooking(bookingId: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteUrl}/?idBooking=${bookingId}`);
  }

}
