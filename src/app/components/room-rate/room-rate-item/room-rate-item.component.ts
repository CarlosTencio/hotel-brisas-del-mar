import { Component } from '@angular/core';
import { computed, input } from '@angular/core';
import { RoomRate } from '../../../models/room-rate.interface';

@Component({
  selector: 'app-room-rate-item',
  imports: [],
  templateUrl: './room-rate-item.component.html',
  styleUrl: './room-rate-item.component.css'
})
export class RoomRateItemComponent {

  readonly tokenSplit = "~";

  dataRoomRate = input.required<RoomRate>();

  roomTypeID = computed(() => this.dataRoomRate().roomTypeID);
  roomTypeName = computed(() => this.dataRoomRate().roomTypeName);
  characteristics = computed(() => this.dataRoomRate().characteristics);
  description = computed(() => this.dataRoomRate().description);
  price = computed(() => this.dataRoomRate().price);
  image = computed(() => this.dataRoomRate().image);
  
  title = computed(() => this.roomTypeName());
  content = computed(() => {
    const items = [];
    if (this.characteristics()) {
      items.push(`Características: ${this.characteristics()}`);
    }
    if (this.description()) {
      items.push(`Descripción: ${this.description()}`);
    }
    if (this.price()) {
      items.push(`Precio: $${this.price()}`);
    }
    return items;
  });
}
