import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RoomRate } from '../../models/room-rate.interface';
import { getBaseUrl } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class RoomRateService {
  constructor() { }

  private readonly baseUrl = getBaseUrl();
  private roomRateURL = `${this.baseUrl}/RoomType/getRoomRatePage`
  private readonly http = inject(HttpClient);

  getRoomRatePage(): Observable<RoomRate[]> {
    
    return this.http.get<RoomRate[]>(this.roomRateURL).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg: string;

        if (error.status === 404) {
          errorMsg = 'No se encontraron las páginas.';
        } else if (error.status === 500) {
          errorMsg = 'Error en el servidor.';
        } else {
          errorMsg = 'Error al cargar las páginas.';
        }

        return throwError(() => new Error(errorMsg));
      })
    );
  }

}
