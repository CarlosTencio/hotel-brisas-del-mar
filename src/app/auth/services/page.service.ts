import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Page } from '../../models/page.interface';
import { Page as PageaAboutUs} from '../../auth/models/page-model';
import { Page as PageContactUs} from '../../auth/models/page-model';
import { ImagePageAbotUs, ImagePageContactUs} from '../../auth/models/image-model'
import { catchError, tap } from 'rxjs/operators';
import { getBaseUrl } from '../../core/constants/api.constants';
import {ContentAboutUS, ContentContactUs} from '../models/image-model';

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
  loadAboutUs(): Observable<PageaAboutUs[]> {
    return this.http.get<PageaAboutUs[]>(`${this.baseUrl}/Page/GetPageWithImagesAboutUs?PageTitle=Sobre%20nosotros`).pipe(
      tap(response => console.log('About Us loaded successfully:', response)),
      catchError(err => {
        console.error('Error loading About Us:', err);
        return of([]); // Return an empty array on error
      })
    );
  }
  loadLocation(title: string): Observable<Page> {
    return this.http.get<Page[]>(`${this.baseUrl}/Page/GetPageWithImagesAboutUs?PageTitle=${title}`).pipe(
      map(response => {
        if (Array.isArray(response) && response.length > 0) {
          console.log('Location loaded successfully:', response[0]);
          return response[0];
        } else {
          throw new Error('No location page found with the specified title');
        }
      }),
      catchError(err => {
        console.error('Error loading About Us:', err);
        throw err;
      })
    );
  }
  UpdateAboutUs(ContentAboutUS: ContentAboutUS): Observable<any> {
    const url = `${this.baseUrl}/Page/UpdateTextAboutUs`;
    
    return new Observable(observer => {
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
      
      const requestBody = {
        pageID: ContentAboutUS.pageID,
        pageContent: ContentAboutUS.pageContent
      };
      
      console.log('Sending data:', JSON.stringify(requestBody));
      
      xhr.send(JSON.stringify(requestBody));
    });
  }
  DeleteImageAboutUs(imageID: number): Observable<any> {
    const url = `${this.baseUrl}/Page/DeleteImagePageAboutUs?imageID=${imageID}`;
    
    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', url, true);
      xhr.setRequestHeader('Accept', '*/*');
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Image deleted successfully', xhr.responseText);
          observer.next(xhr.responseText || 'Success');
          observer.complete();
        } else {
          console.error('Delete failed', xhr.status, xhr.statusText, xhr.responseText);
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
      
      console.log('Sending delete request for image ID:', imageID);
      
      xhr.send();
    });
  }
  InsertImageAboutUs(ImagePageAbotUs: ImagePageAbotUs): Observable<any> {
    const url = `${this.baseUrl}/Page/InsertImagePageAboutUs?ImagePath=${ImagePageAbotUs.ImagePath}&PageID=${ImagePageAbotUs.PageID}`;

    
    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', '*/*');
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Image inserted successfully', xhr.responseText);
          observer.next(xhr.responseText || 'Success');
          observer.complete();
        } else {
          console.error('Insert failed', xhr.status, xhr.statusText, xhr.responseText);
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
      
      const requestBody = {
        PageID: ImagePageAbotUs.PageID,
        ImagePath: ImagePageAbotUs.ImagePath
      };
      
      console.log('Sending data:', JSON.stringify(requestBody));
      
      xhr.send(JSON.stringify(requestBody));
    });
  }

  loadContactUs(): Observable<ContentContactUs[]> {
    return this.http.get<PageContactUs[]>(`${this.baseUrl}/Page/getPageForTittle?facilities=Contáctenos`).pipe(
      map(response => {
        return response.map(page => this.parseContactContent(page.pageContent, page.pageID));
      }),
      tap(parsed => console.log('Contact Us loaded and parsed successfully:', parsed)),
      catchError(err => {
        console.error('Error loading Contact Us:', err);
        return of([]);
      })
    );
  }

  private parseContactContent(content: string, pageID: number): ContentContactUs {
  const contact: any = { pageID };
  const parts = content.split(";").map(p => p.trim());

  parts.forEach(part => {
    if (part.startsWith("Teléfonos:")) {
      const phones = part.replace("Teléfonos:", "").split("/").map(p => p.trim());
      contact.phone1 = phones[0] || '';
      contact.phone2 = phones[1] || '';
    } else if (part.startsWith("Apartado Postal:")) {
      contact.poBox = part.replace("Apartado Postal:", "").trim();
    } else if (part.startsWith("Correo electrónico:")) {
      contact.email = part.replace("Correo electrónico:", "").trim();
    } else if (part.startsWith("Facebook:")) {
      contact.facebook = part.replace("Facebook:", "").trim();
    } else if (part.startsWith("Instagram:")) {
      contact.instagram = part.replace("Instagram:", "").trim();
    }
  });

  return contact as ContentContactUs;
}

  updateContactUs(ContentContactUs: ContentContactUs): Observable<any> {
    const url = `${this.baseUrl}/Page/UpdateContactUs`;

    return new Observable(observer => {
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

      const formattedContact = `Teléfonos: ${ContentContactUs.phone1} / ${ContentContactUs.phone2}; ` +
                              `Apartado Postal: ${ContentContactUs.poBox}; ` +
                              `Correo electrónico: ${ContentContactUs.email}; ` +
                              `Facebook: ${ContentContactUs.facebook}; ` +
                              `Instagram: ${ContentContactUs.instagram}`;

      const requestBody = {
        pageID: ContentContactUs.pageID,
        pageContent: formattedContact
      };

      console.log('Sending data:', JSON.stringify(requestBody));
      xhr.send(JSON.stringify(requestBody));
    });
  }

  deleteImageContactUs(imageID: number): Observable<any> {
    const url = `${this.baseUrl}/Page/DeleteImagePageContactUs?imageID=${imageID}`;

    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('DELETE', url, true);
      xhr.setRequestHeader('Accept', '*/*');

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Image deleted successfully', xhr.responseText);
          observer.next(xhr.responseText || 'Success');
          observer.complete();
        } else {
          console.error('Delete failed', xhr.status, xhr.statusText, xhr.responseText);
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

      console.log('Sending delete request for image ID:', imageID);
      xhr.send();
    });
  }

  insertImageContactUs(ImagePageContactUs: ImagePageContactUs): Observable<any> {
    const url = `${this.baseUrl}/Page/InsertImagePageContactUs?ImagePath=${ImagePageContactUs.ImagePath}&PageID=${ImagePageContactUs.PageID}`;

    return new Observable(observer => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', '*/*');

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Image inserted successfully', xhr.responseText);
          observer.next(xhr.responseText || 'Success');
          observer.complete();
        } else {
          console.error('Insert failed', xhr.status, xhr.statusText, xhr.responseText);
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

      const requestBody = {
        PageID: ImagePageContactUs.PageID,
        ImagePath: ImagePageContactUs.ImagePath
      };

      console.log('Sending data:', JSON.stringify(requestBody));
      xhr.send(JSON.stringify(requestBody));
    });
  }
} 