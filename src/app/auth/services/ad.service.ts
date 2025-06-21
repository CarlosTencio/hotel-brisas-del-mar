import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Ad } from '../models/ad-model';
import { catchError } from 'rxjs/operators';
import { getBaseUrl } from '../../../app/core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private readonly baseUrl = `${getBaseUrl()}/Ad`;

  constructor(private http: HttpClient) {}

  getAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(`${this.baseUrl}/GetAdminAd`).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  getAdById(id: number): Observable<Ad> {
    return this.http.get<Ad>(`${this.baseUrl}/GetAdById?id=${id}`).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  updateAd(ad: Ad): Observable<any> {
    return this.http.put(`${this.baseUrl}/UpdateAd`, ad).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  deleteAd(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteAd?id=${id}`).pipe(
      catchError((error) => throwError(() => error))
    );
  }

    createAd(ad: Ad): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/CreateAd`, ad).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

}
