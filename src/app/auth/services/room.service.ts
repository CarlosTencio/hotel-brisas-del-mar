import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomStatus } from '../models/room-status';
import { ManageRoomActive } from '../models/manage-room-active';
import { getBaseUrl } from '../../core/constants/api.constants';
import { RoomActive } from '../models/room-active';
import { Room } from '../models/roomAvailable';

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

  getRoomManage(): Observable<ManageRoomActive[]> {

    const url = `${this.baseUrl}/Room/manage-active-rooms`; 

    return this.http.get<ManageRoomActive[]>(url);
    
  }
  
  updateRoomStatus(room: RoomActive): Observable<boolean> {
    const url = `${this.baseUrl}/Room/update-room-active`;
    return this.http.put<boolean>(url, room);
  }

listAvailableRooms(entryDate: string, departureDate: string, roomType: number): Observable<Room[]> {
  const url = `${this.baseUrl}/Room/list-roomAvailable`;
  
  const body = {
    entryDate: entryDate,
    departureDate: departureDate,
    roomTypeId: roomType
  };

  return this.http.post<Room[]>(url, body);
}
}