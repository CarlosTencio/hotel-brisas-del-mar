import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AdMain } from '../../models/ad-main.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private adURL = 'https://localhost:7075/api/Ad';

  constructor(private http: HttpClient) {}

  getAds(): Observable<AdMain[]> {
    return this.http.get<AdMain[]>(this.adURL).pipe(

      catchError((error)=>{

        throw error;

      })

    );
  }
}
