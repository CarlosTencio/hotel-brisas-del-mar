import { Component, inject, OnInit, signal } from '@angular/core';
import { ChangeStatusRoomComponent } from '../../components/change-status-room/change-status-room.component';
import { RoomService } from '../../services/room.service';
import { ManageRoomActive } from '../../models/manage-room-active';

@Component({
  selector: 'app-manage-status-room-page',
  imports: [ChangeStatusRoomComponent],
  templateUrl: './manage-status-room-page.component.html',
  styleUrl: './manage-status-room-page.component.css'
})
export default class ManageStatusRoomPageComponent implements OnInit {

  RoomService = inject(RoomService);
  dataRoomActive = signal<ManageRoomActive[]>([]);
  errorMessage = signal<string>('');

  ngOnInit() {
    this.loadRoomTypes();
  }

  loadRoomTypes() {
    this.RoomService.getRoomManage().subscribe({
      next: (respRoomActive) => {
        
        this.dataRoomActive.set(respRoomActive); // Guardamos el array completo
        this.errorMessage.set(''); // Limpiar cualquier error previo
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al cargar las tarifas de habitación');
      }
    });

  }
}
