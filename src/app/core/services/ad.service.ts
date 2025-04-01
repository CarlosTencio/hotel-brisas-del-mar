import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AdMain } from '../../models/ad-main.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private readonly adURL = 'http://localhost:5119/api/Ad';

  constructor(private http: HttpClient) {}

  getAds(): Observable<AdMain[]> {
    return this.http.get<AdMain[]>(this.adURL).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error occurred:', error);
    if (error.status === 0) {
      console.error('Ad API is not accessible. Check if the API is running on http://localhost:5119');
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => error);
  }
}
