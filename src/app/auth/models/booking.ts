import { RoomType } from './room-type';

export interface Customer {
  customerID: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  cardNumber: string;
  image: string | null;
}

export interface Booking {
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