import { Component, inject, OnInit, signal } from '@angular/core';
import { FacilitiesEditComponent } from './facilities-edit/facilities-edit.component';
import { PageService } from '../../services/page.service';
import { Page } from '../../../models/page.interface';
import { confirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-component',
  imports: [FacilitiesEditComponent, confirmationModalComponent],
  templateUrl: './edit-section.component.html',
})
export class EditSectionComponent implements OnInit {
  pageService = inject(PageService);
  dataPage = signal<Page[]>([]);
  typeMessage: string = '';
  message: string = '';
  selectedOption = signal('');

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption.set(target.value);
   
  }

  loadFacilities() {
    this.pageService.loadFacilities().subscribe({
      next: (respPage) => {
      // console.log('Pages loaded successfully:', respPage);
        this.dataPage.set(respPage);
      },
      error: (err) => {
        console.error('Error loading pages:', err.error.message);
      },
    });
  }

  ngOnInit() {
    this.loadFacilities();
  }

  onModalRequestFromChild(event: {
    message: string;
    type: 'confirm' | 'success' | 'error';
  }) {
    this.message = event.message;
    this.typeMessage = event.type;
    this.openModal();
    this.loadFacilities();
  }

  // Modal
  isModalOpen = signal<boolean>(false);


  onModalConfirm(): void {
    console.log('Datos actualizados después de confirmar modal');
    // Recargar los datos después de confirmar la acción
    this.loadFacilities();
    this.selectedOption.set('Facilities'); // Reset the selected option
   this.closeModal();
  }


  openModal(): void {
    this.isModalOpen.set(true);
    console.log('Modal abierto');
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.typeMessage = '';
  }
}
