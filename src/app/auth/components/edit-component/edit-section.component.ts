import { Component, inject, OnInit, signal } from '@angular/core';
import { FacilitiesEditComponent } from './facilities-edit/facilities-edit.component';
import { PageService } from '../../services/page.service';
import { Page } from '../../../models/page.interface';
import {Page as PageAboutUs} from '../../models/page-model'
import { confirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { AboutusEditComponent } from './aboutus-edit/aboutus-edit.component';

@Component({
  selector: 'app-edit-component',
  imports: [FacilitiesEditComponent, confirmationModalComponent, AboutusEditComponent],
  templateUrl: './edit-section.component.html',
})
export class EditSectionComponent implements OnInit {
  pageService = inject(PageService);
  dataPage = signal<Page[]>([]);
  dataPageAbout = signal<PageAboutUs[]>([]);
  typeMessage: string = '';
  message: string = '';
  selectedOption = signal('');





  loadFacilities() {
    this.pageService.loadFacilities().subscribe({
      next: (respPage) => {
     console.log('Pages loaded successfully:', respPage);
        this.dataPage.set(respPage);
      },
      error: (err) => {
        console.error('Error loading pages:', err.error.message);
      },
    });
  }
  loadAboutUs() {
    this.pageService.loadAboutUs().subscribe({
      next: (respPageAbout) => {
        console.log('About Us loaded successfully:', respPageAbout);
        this.dataPageAbout.set(respPageAbout);
      },
      error: (err) => {
        console.error('Error loading About Us:', err.error.message);
      },
    });
  }
  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption.set(target.value);
   if (this.selectedOption() === 'Facilities') {
      this.loadFacilities();
    }
    if (this.selectedOption() === 'AboutUs') {
      this.loadAboutUs();
    }

  }
  ngOnInit() {
   // this.loadFacilities();
  }

  onModalRequestFromChild(event: {
    message: string;
    type: 'confirm' | 'success' | 'error';
  }) {
    this.message = event.message;
    this.typeMessage = event.type;
    this.openModal();
    this.loadFacilities();
    this.loadAboutUs();
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
