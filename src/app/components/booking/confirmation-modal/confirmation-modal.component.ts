// modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Modal';
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