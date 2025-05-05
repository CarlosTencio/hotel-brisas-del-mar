import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Page } from '../../models/page.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { getBaseUrl } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = getBaseUrl();
  
  contentPages = signal<Page[]>([]);

  loadContent(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.baseUrl}/Page`);
  }

  loadFacilities(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.baseUrl}/Page/getPageForTittle?facilities=Facilidades`);
  }
}
