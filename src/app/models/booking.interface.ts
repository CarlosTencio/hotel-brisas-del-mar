import { Customer } from './customer.interface';
export interface Booking {
  Customer: Customer;
  RoomId: number;
  CheckIn: string;
  CheckOut: string;
  Transaction:number;
}