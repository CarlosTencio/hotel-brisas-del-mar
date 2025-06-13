import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Page } from '../../models/page.interface';
import { catchError, tap } from 'rxjs/operators';
import { getBaseUrl } from '../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = getBaseUrl();

  getPageByTitleArray(title: string): Observable<Page[]> {
    const url = `${this.baseUrl}/Page/getPageForTittle?facilities=${title}`;
    console.log('Fetching pages with URL:', url);
    
    return this.http.get<Page[]>(url).pipe(
      tap(response => console.log('Received page data:', response)),
      catchError((error) => {
        console.error('Error fetching pages by title:', error);
        return of([]); // Return an empty array on error
      })
    );
  }

  getPageByTitle(title: string): Observable<Page> {
    const url = `${this.baseUrl}/Page/getPageForTittle?facilities=${title}`;
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
  loadFacilities(): Observable<Page[]> {
    return this.http.get<Page[]>(`${this.baseUrl}/Page/getPageForTittle?facilities=Facilidades`);
  }
  deleteFacility(facilityID: number): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.baseUrl}/Page/facility/${facilityID}`);
  }
  updateFacility(id: number, content: string, imgPath: string): Observable<any> {
    const params = new HttpParams()
      .set('pageID', id.toString())
      .set('pageContent', content)
      .set('imagePath', imgPath);
    return this.http.put<any>(`${this.baseUrl}/Page/updateFacility`, null, { params });
  }
  addFacility(content: string, imgPath: string): Observable<any> {
  const params = new HttpParams()
    .set('contentFacility', content)  // Cambiar de 'pageContent' a 'contentFacility'
    .set('imagePath', imgPath);
  console.log('Adding facility with params:', params.toString());
  return this.http.post<any>(`${this.baseUrl}/Page/createFacility`, null, { params });
}
  updatePage(page: Page): Observable<any> {
    return this.updateFacility(page.pageID, page.pageContent, page.images[0] || '');
  }
} 