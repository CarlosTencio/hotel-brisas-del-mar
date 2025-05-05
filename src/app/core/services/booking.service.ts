import { inject, Injectable } from '@angular/core';
import { RoomAvailable } from '../../models/room-available.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../../models/booking.interface';
import { BookingResponse } from '../../models/booking-response.interface';
import { Customer } from '../../models/customer.interface';
import { getBaseUrl } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })

//with this service I pass the reservation information to the reservation view(between sibling components)
//Also, I create the booking data object to be sent to the backend
export class BookingService {
  private readonly baseUrl = getBaseUrl();
  private bookingURLPost = `${this.baseUrl}/Booking/create-booking`;
  private readonly http = inject(HttpClient);
  constructor() { }
  // Store the reservation data
  private bookingDataSubject = new BehaviorSubject<any>(null);
  bookingData$ = this.bookingDataSubject.asObservable();
  //data from the room to be reserved
  saveData(data: RoomAvailable) {
    const currentData = this.bookingDataSubject.value || {};
    this.bookingDataSubject.next({
      ...currentData,
      roomAvailable: data
    });
  }
  //get data from the room to be reserved
  getData(): RoomAvailable {
    return this.bookingDataSubject.value?.roomAvailable;
  }
  cleanData() {
    this.bookingDataSubject.next(null);
  }




  //Create booking after check availability
  createBooking(booking: Booking): Observable<BookingResponse> {
    const customer: Customer = {
      name: booking.Customer.name,
      lastName: booking.Customer.lastName,
      email: booking.Customer.email,
      cardNumber: booking.Customer.cardNumber
    }
    // Create the booking object to send to the backend
    const bookingRequest = {
      customer: customer,
      roomId: booking.RoomId,
      checkIn: booking.CheckIn,
      checkOut: booking.CheckOut,
      transaction: booking.Transaction
    };
    return this.http.post<BookingResponse>(this.bookingURLPost, bookingRequest);
  }
}
