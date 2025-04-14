import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RoomType } from '../../models/room-type.interface';

@Injectable({ providedIn: 'root' })
export class RoomTypeService {
  constructor() { }

  private URL = 'https://localhost:7075/api/RoomType';
  private readonly http = inject(HttpClient);

  loadSelectRoomType(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(this.URL).pipe(
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