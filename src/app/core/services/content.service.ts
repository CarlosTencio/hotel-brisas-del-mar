import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Page } from '../../models/page.interface';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private pageURL= 'https://localhost:7075/api/Page';
  private readonly http = inject(HttpClient);

  contentPages = signal<Page[]>([]);

  loadContent(): Observable<Page[]> {
    return this.http.get<Page[]>(this.pageURL);
  }

  private pageFacilitiesURL = 'https://localhost:7075/api/Page/getPageForTittle?facilities=Facilidades';
  loadFacilities(): Observable<Page[]> {
    return this.http.get<Page[]>(this.pageFacilitiesURL);
  }
}
