import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Page } from '../../models/page.interface';
import { catchError, tap } from 'rxjs/operators';
import { getBaseUrl } from '../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private baseUrl = `${getBaseUrl()}/Page`;

  constructor(private http: HttpClient) {
    console.log('PageService initialized with baseUrl:', this.baseUrl);
  }

  getPageByTitle(title: string): Observable<Page> {
    const url = `${this.baseUrl}/getPageForTittle?facilities=${title}`;
    console.log('Fetching page with URL:', url);
    
    return this.http.get<Page[]>(url).pipe(
      map(pages => {
        if (Array.isArray(pages) && pages.length > 0) {
          console.log('Received array of pages, extracting first item:', pages[0]);
          return pages[0];
        } else {
          throw new Error('No page found with the specified title');
        }
      }),
      tap(response => console.log('Received page data:', response)),
      catchError((error) => {
        console.error('Error fetching page by title:', error);
        throw error;
      })
    );
  }

  updatePage(page: Page): Observable<any> {
    const url = `${this.baseUrl}/update`;
    
    return new Observable(observer => {
      // Use the XMLHttpRequest API directly for maximum control
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', '*/*');
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Update successful', xhr.responseText);
          observer.next(xhr.responseText || 'Success');
          observer.complete();
        } else {
          console.error('Update failed', xhr.status, xhr.statusText, xhr.responseText);
          observer.error({
            status: xhr.status,
            statusText: xhr.statusText,
            error: xhr.responseText
          });
        }
      };
      
      xhr.onerror = () => {
        console.error('Network error occurred');
        observer.error({
          error: 'Network error occurred'
        });
      };
      
      // Format request body
      const requestBody = {
        pageID: page.pageID,
        pageTitle: page.pageTitle,
        pageContent: page.pageContent,
        images: page.images || []
      };
      
      console.log('Sending data:', JSON.stringify(requestBody));
      
      // Send the request
      xhr.send(JSON.stringify(requestBody));
    });
  }
} 