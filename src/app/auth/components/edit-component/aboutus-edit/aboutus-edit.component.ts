import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Page } from '../../../models/page-model';
import { AboutusItemComponent } from './aboutus-item/aboutus-item.component';
import { PageService } from '../../../services/page.service';
import { ImagePageAbotUs} from '../../../models/image-model'
import {ContentAboutUS} from '../../../models/image-model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { AboutusGalleryComponent } from "./aboutus-gallery/aboutus-gallery.component";

@Component({
  selector: 'app-aboutus-edit',
  imports: [AboutusItemComponent, AboutusGalleryComponent,],
  templateUrl: './aboutus-edit.component.html',
  styleUrl: './aboutus-edit.component.css'
})
export class AboutusEditComponent {
pageService = inject(PageService);
  cloudinaryService = inject(CloudinaryService);
  dataPageAbout = input.required<Page[]>();
  showAddFacilityModal = signal(false);
  selectedFile: File | null = null;
 
  
  
  // Usar null para mostrar solo el contorno
  private imageSignal = signal<string | null>(null);
  image = computed(() => {
    return this.imageSignal();
  });

  addForm = new FormGroup({
    image: new FormControl('', [Validators.required]),
  });

  @Output() modalRequest = new EventEmitter<{
    message: string;
    type: 'confirm' | 'success' | 'error';
  }>();

  onShowModalRequest(event: {
    message: string;
    type: 'confirm' | 'success' | 'error';
  }) {
    this.modalRequest.emit(event);
  }

  onAddNewFacility() {
    this.showAddFacilityModal.set(true);
  }

  onCloseModal() {
    this.showAddFacilityModal.set(false);
    // Reset del formulario y estado
    this.addForm.reset();
    this.selectedFile = null;
    this.imageSignal.set(null);
  }
  updateContentAboutUs(ContentAboutUS: ContentAboutUS) {
    this.pageService.UpdateAboutUs(ContentAboutUS)
      .subscribe({
        next: (response) => {
          console.log('Content updated successfully:', response);
          this.onShowModalRequest({ message: 'Content updated successfully', type: 'success' });
          this.onCloseModal();
        },
        error: (error) => {
          console.error('Error updating content:', error);
          this.onShowModalRequest({ message: 'Error updating content', type: 'error' });
        }
      });
  }
  deleteImageAboutUs(id: number) {
  this.pageService.DeleteImageAboutUs(id)
      .subscribe({
        next: (response) => {
          console.log('Image deleted successfully:', response);
          this.onShowModalRequest({ message: 'Image deleted successfully', type: 'success' });
        },
        error: (error) => {
          console.error('Error deleting image:', error);
          this.onShowModalRequest({ message: 'Error deleting image', type: 'error' });
        }
      });
  }
handleUpdateContent(event: { id: number, content: string }) {
  const contentToUpdate: ContentAboutUS = {
    pageID: event.id,
    pageContent: event.content
  };

  this.updateContentAboutUs(contentToUpdate);
}
insertImageAboutUs(event: { imagePath: string, pageID: number }) {
  const imageToInsert = {
    PageID: event.pageID,
    ImagePath: event.imagePath
  };

  this.pageService.InsertImageAboutUs(imageToInsert)
    .subscribe({
      next: (response) => {
        console.log('Image inserted successfully:', response);
        this.onShowModalRequest({ message: 'Image inserted successfully', type: 'success' });
      },
      error: (error) => {
        console.error('Error inserting image:', error);
        this.onShowModalRequest({ message: 'Error inserting image', type: 'error' });
      }
    });
  }
}
