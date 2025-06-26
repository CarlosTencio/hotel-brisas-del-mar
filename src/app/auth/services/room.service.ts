import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomStatus } from '../models/room-status';
import { ManageRoomActive } from '../models/manage-room-active';
import { getBaseUrl } from '../../core/constants/api.constants';
import { RoomActive } from '../models/room-active';
import { Room } from '../models/roomAvailable';

interface AvailabilityRequest {
  entryDate: string;
  departureDate: string;
  roomTypeId: number;
  availabilityCriterion: string;
}

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

  private formatDateToISO(dateString: string): string {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00`;
  }

  listAvailableRooms(entryDate: string, departureDate: string, roomType: number): Observable<Room[]> {
    const url = `${this.baseUrl}/Room/list-roomAvailable`;
    
    const body: AvailabilityRequest = {
      entryDate: this.formatDateToISO(entryDate),
      departureDate: this.formatDateToISO(departureDate),
      roomTypeId: roomType,
      availabilityCriterion: 'Standard' // Valor por defecto
    };

    console.log('Sending request to backend:', body);
    
    return this.http.post<Room[]>(url, body);
  }
}