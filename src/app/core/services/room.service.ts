import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomAvailable } from '../../models/room-available.interface';

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor() { }
  private pageURL = 'https://localhost:7075/api/Room/check-availability';
  private readonly http = inject(HttpClient);
//Check availability and if there is any, return the room.
  checkAvailability(entryDate: string, departureDate: string, roomTypeId: number): Observable<RoomAvailable> {
// Create the request object to send to the backend
    const requestBody = {
      entryDate: entryDate,
      departureDate: departureDate,
      roomTypeId: roomTypeId
    };
    // Enviar la solicitud POST con el cuerpo
    return this.http.post<RoomAvailable>(this.pageURL, requestBody);
  }
}