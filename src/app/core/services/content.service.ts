import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Page } from '../../models/page.interface';
import { Observable, catchError, map, throwError } from 'rxjs';
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

  loadPageByTitle(title: string): Observable<Page> {
    return this.http.get<Page[]>(`${this.baseUrl}/Page/getPageForTittle?facilities=${title}`).pipe(
      map(pages => {
        if (Array.isArray(pages) && pages.length > 0) {
          console.log('Received array of pages, extracting first item:', pages[0]);
          return pages[0];
        } else {
          throw new Error('No page found with the specified title');
        }
      })
    );
  }

  loadFacilities(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.baseUrl}/Page/getPageForTittle?facilities=Facilidades`);
  }
}
