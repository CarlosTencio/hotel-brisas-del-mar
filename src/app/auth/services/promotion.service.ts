import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromotionMainDTO } from '../../models/promotion.model';
import { catchError } from 'rxjs/operators';
import { getBaseUrl } from '../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private baseUrl = `${getBaseUrl()}/Promotion`;

  constructor(private http: HttpClient) { }

  getAllPromotions(): Observable<PromotionMainDTO[]> {
    return this.http.get<PromotionMainDTO[]>(`${this.baseUrl}/all`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  getPromotionById(id: number): Observable<PromotionMainDTO> {
    return this.http.get<PromotionMainDTO>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  createPromotion(promotion: PromotionMainDTO): Observable<number> {
    return this.http.post<number>(this.baseUrl, promotion).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  updatePromotion(promotion: PromotionMainDTO): Observable<any> {
    return this.http.put(this.baseUrl, promotion).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  deletePromotion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
} 