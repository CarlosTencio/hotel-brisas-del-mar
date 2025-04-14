import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-login',
  standalone: true,
  imports: [],
  templateUrl: './modal-login.component.html',
  styleUrl: './modal-login.component.css'
})
export default class ModalLoginComponent {
  @Input() errorMessage!: string;
  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }
}