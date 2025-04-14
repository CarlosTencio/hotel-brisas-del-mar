import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomAvailable } from '../../models/room-available.interface';

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor() { }
  private pageURL = 'https://localhost:7075/api/Room/check-availability';
  private readonly http = inject(HttpClient);

  checkAvailability(entryDate: string, departureDate: string, roomTypeId: number): Observable<RoomAvailable> {
    // Crear el objeto para enviarlo en el cuerpo de la solicitud
    const requestBody = {
      entryDate: entryDate,
      departureDate: departureDate,
      roomTypeId: roomTypeId
    };

    // Enviar la solicitud POST con el cuerpo
    return this.http.post<RoomAvailable>(this.pageURL, requestBody);
  }
}