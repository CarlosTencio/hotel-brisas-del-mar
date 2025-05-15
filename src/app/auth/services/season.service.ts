import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeasonDTO } from '../../models/season.model';
import { catchError } from 'rxjs/operators';
import { getBaseUrl } from '../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private baseUrl = `${getBaseUrl()}/Season`;

  constructor(private http: HttpClient) { }

  getAllSeasons(): Observable<SeasonDTO[]> {
    return this.http.get<SeasonDTO[]>(this.baseUrl).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  getSeasonById(id: number): Observable<SeasonDTO> {
    return this.http.get<SeasonDTO>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  createSeason(season: SeasonDTO): Observable<any> {
    return this.http.post(this.baseUrl, season).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  updateSeason(season: SeasonDTO): Observable<any> {
    return this.http.put(this.baseUrl, season).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  deleteSeason(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }
} 