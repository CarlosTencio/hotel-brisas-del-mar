import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromotionMain } from '../../models/promotion-main.interface';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http:HttpClient) { }

  private promotionURL = 'https://localhost:7075/api/Promotion';

  getPromotions(): Observable<PromotionMain[]> {

    return this.http.get<PromotionMain[]>(this.promotionURL).pipe(

      catchError((error)=>{

        throw error;

      })

    );

  }

}
