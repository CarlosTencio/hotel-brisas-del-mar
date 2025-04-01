import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Page } from '../../models/page.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  // Updated to match the Swagger URL port
  private readonly baseURL = 'http://localhost:5119/api';
  private readonly http = inject(HttpClient);

  contentPages = signal<Page[]>([]);

  loadContent(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.baseURL}/Page`).pipe(
      catchError(this.handleError)
    );
  }

  loadFacilities(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.baseURL}/Page/getPageForTittle?facilities=Facilidades`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error occurred:', error);
    if (error.status === 0) {
      console.error('API is not accessible. Please check if the API is running and the port is correct (http://localhost:5119).');
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => error);
  }
}
