import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeStatusRoomComponent } from '../../components/change-status-room/change-status-room.component';
import { RoomService } from '../../services/room.service';
import { ManageRoomActive } from '../../models/manage-room-active';

@Component({
  selector: 'app-manage-room-page',
  standalone: true,
  imports: [CommonModule, ChangeStatusRoomComponent],
  templateUrl: './manage-room-page.component.html',
  styleUrls: ['./manage-room-page.component.css']
})
export class ManageRoomPageComponent implements OnInit {
  isLoading = signal(true);
  roomsData: ManageRoomActive[] = [];

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getRoomManage().subscribe({
      next: (data) => {
        this.roomsData = data;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.isLoading.set(false);
      }
    });
  }
}
