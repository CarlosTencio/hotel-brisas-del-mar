import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomStatus } from '../models/room-status';
import { getBaseUrl } from '../../core/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class RoomService {
  constructor() { }
  private readonly baseUrl = getBaseUrl();
  private pageURL = `${this.baseUrl}/Room/status-room`;
  private readonly http = inject(HttpClient);
  
  roomStatus(): Observable<RoomStatus[]> {

    const url = `${this.baseUrl}/Room/status-room`; 
    return this.http.get<RoomStatus[]>(url);
  }
}