import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomAvailable } from '../../models/room-available.interface';
import { getBaseUrl } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class RoomService {

  private readonly baseUrl = getBaseUrl();

  private checkAvailabilityURL = `${this.baseUrl}/Room/check-availability`;

  private updateStatusURL = `${this.baseUrl}/Room/room-status`;

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
    return this.http.post<RoomAvailable>(this.checkAvailabilityURL, requestBody);
  }


//actuzalizar el estado de la habitación para poder ser reservada
updateStatus(id: number, status: number): Observable<void> {
  const url = `${this.baseUrl}/Room/room-status/${id}`; // Interpolación directa
  const requestBody = { status: status };
  return this.http.put<void>(url, requestBody);
}
}