import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { Page } from '../../models/page.interface';

import { catchError } from 'rxjs/operators';
interface TokenResponse {
  tokenDTOString: string;
}
@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(private http: HttpClient) { }
  private loginURL = 'https://hotelauth-hrbdbne0c3b3gagy.canadacentral-01.azurewebsites.net/api/Admin/AuthWithCredentials';
  login(userNameDTO: string, passwordDTO: string): Observable<TokenResponse[]> {
    const body = { userNameDTO, passwordDTO }; 

    return this.http.post<TokenResponse[]>(this.loginURL, body).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
  private tokenURL = 'https://hotelauth-hrbdbne0c3b3gagy.canadacentral-01.azurewebsites.net/api/Admin/VerifyToken';
  verifyToken(tokenDTOString: string): Observable<TokenResponse[]> {
    const body = { tokenDTOString};
    return this.http.post<TokenResponse[]>(this.tokenURL,body ).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
}
