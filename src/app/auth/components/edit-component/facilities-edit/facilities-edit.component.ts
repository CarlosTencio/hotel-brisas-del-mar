import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Page } from '../../../../models/page.interface';
import { FacilityItemComponent } from './facilities-item/facilities-item.component';
import { PageService } from '../../../services/page.service';

@Component({
  selector: 'facilities-edit',
  imports: [FacilityItemComponent],
  templateUrl: './facilities-edit.component.html',
  styleUrl: './facilities-edit.component.css',
})
export class FacilitiesEditComponent {
  dataPage = input.required<Page[]>();
  showAddFacilityModal = signal(false);
  @Output() modalRequest = new EventEmitter<{
    message: string;
    type: 'confirm' | 'success' | 'error';
  }>();

  onShowModalRequest(event: {
    message: string;
    type: 'confirm' | 'success' | 'error';
  }) {
    //Emit to parent component
    this.modalRequest.emit(event);
  }

  onAddNewFacility() {
    this.showAddFacilityModal.set(true);
  }

  onCloseModal() {
    this.showAddFacilityModal.set(false);
  }

  onSaveFacility() {
    // Lógica para guardar
    // ...
    this.showAddFacilityModal.set(false);
  }
}
