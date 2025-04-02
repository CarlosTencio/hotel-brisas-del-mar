import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { Page } from '../../models/page.interface';

import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  private loginURL = 'https://localhost:7075/api/Login';
  login(): Observable<Page[]> {
      return this.http.get<Page[]>(this.loginURL).pipe(
  
        catchError((error)=>{
  
          throw error;
  
        })
  
      );
    }
}
