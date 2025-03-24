import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Page } from '../../models/page';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private http=Inject(HttpClient);

  // loadContent() {
  //  this.http.get<Page>(`https://localhost:7075/api/Page/GetPage`).subscribe((data) => {});
  // }

  constructor() { }
}
