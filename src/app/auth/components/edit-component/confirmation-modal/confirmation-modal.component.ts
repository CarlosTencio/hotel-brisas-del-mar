// modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'modal-confimation',
  templateUrl: './confirmation-modal.html',
})
export class confirmationModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmación';
  @Input() showConfirmButton = true;
  @Input() showCancelButton = true;
  @Input() confirmButtonText = 'Confirmar';
  @Input() cancelButtonText = 'Cancelar';

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmModal = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }

  confirm(): void {
    this.confirmModal.emit();
  }
}