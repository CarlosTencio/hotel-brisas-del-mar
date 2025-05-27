import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomType } from '../models/room-type';
import { getBaseUrl } from '../../core/constants/api.constants';

@Injectable({ providedIn: 'root'})
export class RoomTypeService {
  private readonly http = inject(HttpClient); 
  private readonly baseUrl = getBaseUrl();

  private pageURL = `${this.baseUrl}/RoomType/roomTypeName`;
  
  constructor() { }
  
  getRoomTypes(): Observable<RoomType[]> {
    return this.http.get<RoomType[]>(`${this.baseUrl}/room-types`);
  }
  
  getRoomByName(roomTypeName: string): Observable<RoomType> {
    return this.http.get<RoomType>(`${this.baseUrl}/RoomType/${roomTypeName}`);
  }

  getRoomByTypeId(roomTypeId: number): Observable<RoomType> {
    return this.http.get<RoomType>(`${this.baseUrl}/RoomType/id/${roomTypeId}`);
  }

  updateRoomType(roomTypeName: string, data: FormData): Observable<RoomType> {
  return this.http.put<RoomType>(`${this.baseUrl}/RoomType/${roomTypeName}`, data);
  }
}
