import { Component, inject, OnInit, signal } from '@angular/core';
import { RoomRateService } from '../../core/services/room-rate.service';
import { RoomRateItemComponent } from './room-rate-item/room-rate-item.component';
import { RoomRate } from '../../models/room-rate.interface';

@Component({
  selector: 'app-room-rate',
  imports: [RoomRateItemComponent],
  templateUrl: './room-rate.component.html',
  styleUrl: './room-rate.component.css'
})
export class RoomRateComponent implements OnInit {
  roomRateService = inject(RoomRateService);
  dataRoomRate = signal<RoomRate[]>([]);
  errorMessage = signal<string>('');

  ngOnInit() {
    this.loadRoomRates();
  }

  loadRoomRates() {
    this.roomRateService.getRoomRatePage().subscribe({
      next: (respRoomRates) => {
        this.dataRoomRate.set(respRoomRates); // Guardamos el array completo
        this.errorMessage.set(''); // Limpiar cualquier error previo
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error al cargar las tarifas de habitación');
      }
    });
  }
}
