import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomType } from '../models/room-type';
import { getBaseUrl } from '../../core/constants/api.constants';
import { UpdateResponse } from '../models/response';
import { RoomTypedto } from '../models/room-typedto';

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
  updateRoomTypeData(roomType: RoomTypedto): Observable<string> {
    const url = `${this.baseUrl}/RoomType/UpdateRoomTypeData`;
    const requestBody = {
      roomTypeId: roomType.roomTypeId,
      roomTypeName: roomType.roomTypeName,
      price: roomType.price,
      characteristics: roomType.characteristics,
      description: roomType.description,
      image: roomType.image
    };
    
    // ✅ CLAVE: Especificar responseType: 'text'
    return this.http.put(url, requestBody, { responseType: 'text' });
  }
}
