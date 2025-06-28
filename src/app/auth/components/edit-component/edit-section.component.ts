import { Component, inject, OnInit, signal, input } from '@angular/core';
import { FacilitiesEditComponent } from './facilities-edit/facilities-edit.component';
import { PageService } from '../../services/page.service';
import { Page } from '../../../models/page.interface';
import { Page as PageAboutUs } from '../../models/page-model';
import { ContentContactUs } from '../../models/image-model';
import { ContactusEditComponent } from './contactus-edit/contactus-edit.component';
import { confirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import HomeEditorComponent from './home-editor/home-editor.component';
import { AboutusEditComponent } from './aboutus-edit/aboutus-edit.component';
import { LocationEditComponent } from './location-edit/location-edit.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-edit-component',
  imports: [FacilitiesEditComponent, confirmationModalComponent, AboutusEditComponent, HomeEditorComponent, LocationEditComponent, ContactusEditComponent, JsonPipe],
  templateUrl: './edit-section.component.html',
})
export class EditSectionComponent implements OnInit {
  pageService = inject(PageService);
  dataPage = signal<Page[]>([]);
  contactData = input.required<ContentContactUs>();
  dataHomePage = signal<Page>({} as Page);
  dataPageAbout = signal<PageAboutUs[]>([]);
  dataLocationPage = signal<Page>({} as Page);
  dataPageContact = signal<ContentContactUs | null>(null);
  typeMessage: string = '';
  message: string = '';
  selectedOption = signal('');
  readonly titleHomePage = "Inicio";
  readonly titleContactUs = "Contáctanos";
  readonly titleLocation = "Ubicacion";
  loadHome(){
    this.pageService.getPageByTitle(this.titleHomePage).subscribe({
      next: (respPage) => {
        this.dataHomePage.set(respPage);
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
   
  loadLocation() {
    this.pageService.loadLocation(this.titleLocation).subscribe({
      next: (respPage) => {
      
        this.dataLocationPage.set(respPage);
      },
      error: (err) => {
        console.error('Error loading location:', err.error.message);
      },
    });
  }
  
  loadContactUs() {
    this.pageService.loadContactUs().subscribe({  
      next: (respPage) => {
        if (respPage && Array.isArray(respPage) && respPage.length > 0) {
          this.dataPageContact.set(respPage[0]); 
        } else if (respPage && !Array.isArray(respPage)) {
          // Si no es array, tal vez es un objeto directo
          this.dataPageContact.set(respPage);
        } else {
                    this.dataPageContact.set(null);
        }
      },
      error: (err) => {
        this.dataPageContact.set(null);
      },
    });
  }

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedOption.set(target.value);
    this.dataPage.set([]); // Clear the dataPage when changing selection
  
   if (this.selectedOption() === 'Facilities') {
      this.loadFacilities();
    }
    if (this.selectedOption() === 'Home') {
      this.loadHome();
    }
    if (this.selectedOption() === 'AboutUs') {
      this.loadAboutUs();
    }
    if (this.selectedOption() === 'Location') {
      this.loadLocation();
    }
    if (this.selectedOption() === 'ContactUs') {
      this.loadContactUs();
    }
  }

  ngOnInit() {
   // this.loadFacilities();
   this.dataPage.set([]);
   this.loadHome();
   this.loadLocation();
  }

  onModalRequestFromChild(event: {
    message: string;
    type: 'confirm' | 'success' | 'error';
  }) {
    this.message = event.message;
    this.typeMessage = event.type;
    this.openModal();
    
     if(this.selectedOption() === 'Facilities') {
      this.loadFacilities();
     }


    if(this.selectedOption() === 'Home') {
      this.loadHome();
    }
    
    if(this.selectedOption() === 'AboutUs') {
      this.loadAboutUs();
    }

    if(this.selectedOption() === 'ContactUs') {
      this.loadContactUs();
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
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.typeMessage = '';
  }
}
