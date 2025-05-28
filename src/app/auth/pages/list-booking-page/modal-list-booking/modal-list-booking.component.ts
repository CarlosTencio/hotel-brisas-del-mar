import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-list-booking',
  standalone: true,
  templateUrl: './modal-list-booking.component.html',
  styleUrl: './modal-list-booking.component.css'
})
export class ModalListBookingComponent {
  @Input() showModal = false;
  @Input() bookingId: number | null = null;

  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();

  onCancel() {
    this.cancel.emit();
  }

  onConfirmDelete() {
    if (this.bookingId !== null) {
      this.confirm.emit(this.bookingId);
      console.log('Booking ID to delete:', this.bookingId);
    }
  }
}
