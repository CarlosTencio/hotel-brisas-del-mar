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
  private loginURL = 'https://hotelauth-hrbdbne0c3b3gagy.canadacentral-01.azurewebsites.net/api/Admin/AuthWithCredentials';
  login(userNameDTO: string, passwordDTO: string): Observable<Page[]> {
    const body = { userNameDTO, passwordDTO }; 

    return this.http.post<Page[]>(this.loginURL, body).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}
