import { Component, computed, inject, input, Output, EventEmitter } from '@angular/core';
import { ManageRoomActive } from '../../../models/manage-room-active';
import { RoomActive } from '../../../models/room-active';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-item-change-status-room',
  imports: [],
  templateUrl: './item-change-status-room.component.html',
  styleUrl: './item-change-status-room.component.css'
})
export class ItemChangeStatusRoomComponent {

  @Output() openChildMessage = new EventEmitter<number>();


  RoomService = inject(RoomService);
  dataRoomActive = input.required<ManageRoomActive>();
  roomTypeId = computed(() => this.dataRoomActive().roomTypeId);
  roomTypeName = computed(() => this.dataRoomActive().roomTypeName);
  roomActiveDTOs = computed(() => this.dataRoomActive().roomActiveDTOs);

  sendToParent(roomTypeId: number) {
    this.openChildMessage.emit(roomTypeId);
  }

  toggleRoomStatus(room: RoomActive) {

    room.isActice = !room.isActice;

    this.RoomService.updateRoomStatus(room)
      .subscribe(success => {
        if (success) {
          
        } else {
          console.warn('No se pudo actualizar el estado');
        }
      });

  }

}
