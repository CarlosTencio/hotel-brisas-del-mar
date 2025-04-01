import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { PromotionMain } from '../../models/promotion-main.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private readonly promotionURL = 'http://localhost:5119/api/Promotion';

  constructor(private http: HttpClient) { }

  getPromotions(): Observable<PromotionMain[]> {
    return this.http.get<PromotionMain[]>(this.promotionURL).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error occurred:', error);
    if (error.status === 0) {
      console.error('Promotion API is not accessible. Check if the API is running on http://localhost:5119');
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => error);
  }
}
