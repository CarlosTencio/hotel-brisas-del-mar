import { Component, inject, OnInit, signal } from '@angular/core';
import { FacilitiesEditComponent } from './facilities-edit/facilities-edit.component';
import { PageService } from '../../services/page.service';
import { Page } from '../../../models/page.interface';
import { confirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import HomeEditorComponent from './home-editor/home-editor.component';

@Component({
  selector: 'app-edit-component',
  imports: [FacilitiesEditComponent, confirmationModalComponent, HomeEditorComponent],
  templateUrl: './edit-section.component.html',
})
export class EditSectionComponent implements OnInit {
  pageService = inject(PageService);
  dataPage = signal<Page[]>([]);
  dataHomePage = signal<Page>({} as Page);
  typeMessage: string = '';
  message: string = '';
  selectedOption = signal('');
  readonly titleHomePage = "Inicio";

  loadHome(){
    
    this.pageService.getPageByTitle(this.titleHomePage).subscribe({
    next: (respPage) => {
    console.log('Pages loaded successfully:', respPage);
      this.dataHomePage.set(respPage);
      console.log('DataPage updated at index 0:', this.dataPage()[0]);
    },
    error: (err) => {
      console.error('Error loading pages:', err.error.message);
    },
  });

  }

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
  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption.set(target.value);
    this.dataPage.set([]); // Clear the dataPage when changing selection
    console.log('Selected option:', this.selectedOption());
   if (this.selectedOption() === 'Facilities') {
      this.loadFacilities();
    }
    else if (this.selectedOption() === 'Home') {
      this.loadHome();
    }

  }
  ngOnInit() {
   // this.loadFacilities();
   this.dataPage.set([]);
   this.loadHome();
  }

  onModalRequestFromChild(event: {
    message: string;
    type: 'confirm' | 'success' | 'error';
  }) {
    this.message = event.message;
    this.typeMessage = event.type;
    this.openModal();
    this.loadFacilities();

    if(this.selectedOption() === 'Home' && this.typeMessage === 'success') {
      this.loadHome();
    }
    
  }

  // Modal
  isModalOpen = signal<boolean>(false);


  onModalConfirm(): void {
    console.log('Datos actualizados después de confirmar modal');
    // Recargar los datos después de confirmar la acción
    this.loadFacilities();
    // this.loadHome();
    // this.selectedOption.set('Facilities'); // Reset the selected option
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
