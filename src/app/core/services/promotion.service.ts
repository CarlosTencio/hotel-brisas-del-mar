import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { PromotionMain } from '../../models/promotion-main.interface';
import { catchError } from 'rxjs/operators';
import { getBaseUrl } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  constructor(private http: HttpClient) { }
  private readonly baseUrl = getBaseUrl();

  getPromotions(): Observable<PromotionMain[]> {
    return this.http.get<PromotionMain[]>(`${this.baseUrl}/Promotion`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}