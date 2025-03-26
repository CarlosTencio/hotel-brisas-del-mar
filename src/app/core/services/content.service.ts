import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, signal } from '@angular/core';

import { Page } from '../../models/page.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContentService {
private pageURL= 'https://localhost:7075/api/Page';
  private http = inject(HttpClient);


contentPages=signal<Page[]>([]);

  loadContent(): Observable<Page[]> {
    return this.http.get<Page[]>(this.pageURL);
  }

  private pageFacilitiesURL = 'https://localhost:7075/api/Page/getPageForTittle?facilities=Facilidades';
  loadFacilities(): Observable<Page[]> {
    return this.http.get<Page[]>(this.pageFacilitiesURL);
  }
}
