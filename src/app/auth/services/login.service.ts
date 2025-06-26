import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { Page } from '../../models/page.interface';
import { catchError, map } from 'rxjs/operators';

interface TokenResponse {
  tokenDTOString: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) { }
  private baseURL = 'https://apihotel-emhmc5e6hpdfgwfg.canadacentral-01.azurewebsites.net';
  private loginURL = `${this.baseURL}/api/Admin/AuthWithCredentials`;
  private tokenURL = `${this.baseURL}/api/Admin/VerifyToken`;

  login(userNameDTO: string, passwordDTO: string): Observable<TokenResponse> {
    const body = { userNameDTO, passwordDTO };
    
    return this.http.post<TokenResponse>(this.loginURL, body).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  verifyToken(tokenDTOString: string): Observable<TokenResponse[]> {
    const body = { tokenDTOString };
    return this.http.post<TokenResponse[]>(this.tokenURL, body).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true si hay un token, false si no hay
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
