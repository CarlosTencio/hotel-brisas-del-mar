import { Component, EventEmitter, input, Output } from '@angular/core';
import { RoomRate } from '../../../models/room-rate.interface';
import { ItemChangeStatusRoomComponent } from './item-change-status-room/item-change-status-room.component';
import { ManageRoomActive } from '../../models/manage-room-active';
import { CommonModule } from '@angular/common';
import { RoomManageComponent } from './room-manage/room-manage.component';

@Component({
  selector: 'app-change-status-room',
  imports: [ItemChangeStatusRoomComponent, CommonModule, RoomManageComponent],
  templateUrl: './change-status-room.component.html',
  styleUrl: './change-status-room.component.css'
})
export class ChangeStatusRoomComponent {

  @Output() message = new EventEmitter<Number>();

  dataRoomActive=input.required<ManageRoomActive[]>();

  openChild: Boolean = false;
  roomTypeId: number = 0;

  updateProperty(roomTypeId: number) {

    console.log('updateProperty called with roomTypeId:', roomTypeId);
    
    this.openChild = true;

    this.roomTypeId = roomTypeId;

  }

  onCancelRoomManage() {
    this.openChild = false;
  }

}
