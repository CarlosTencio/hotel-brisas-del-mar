import { Component, computed, EventEmitter, inject, input, Input, OnInit, Output, signal } from '@angular/core';
import { Page } from '../../../../../models/page.interface';
import { PageService } from '../../../../services/page.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloudinaryService } from '../../../../services/cloudinary.service';

@Component({
  selector: 'facility-item',
  imports: [ReactiveFormsModule],
  templateUrl: './facilities-item.component.html',
})
export class FacilityItemComponent implements OnInit {
  pageService = inject(PageService);
  cloudinaryService = inject(CloudinaryService);
  selectedFile: File | null = null;
  // FormGroup para editar las facilidades
  updateForm = new FormGroup({
    id: new FormControl(''),
    content: new FormControl('',[Validators.required]),
    image: new FormControl('')
  })

  @Output() showModalRequest = new EventEmitter<{
    message: string;
    type: 'confirm' | 'success' | 'error';
  }>();

  dataPage = input.required<Page>();
  idFacility = computed(() => this.dataPage().pageID);
  content = computed(() => this.dataPage().pageContent);
  imagePath = computed(() => this.dataPage().images);
  // Signal writable para manejar la imagen
  private imageSignal = signal<string>('');
  
  // Computed que combina la imagen original con la nueva seleccionada
  image = computed(() => {
    const selectedImage = this.imageSignal();
    return selectedImage || this.dataPage().images;
  });
ngOnInit(): void {
  this.updateForm.patchValue({
    id: this.idFacility().toString(),
    content: this.content()
  });
}
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
    this.selectedFile = file;
    
    // Crear URL temporal para preview
    const reader = new FileReader();
    reader.onload = () => {
      // Actualizar el signal con la nueva imagen
      this.imageSignal.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    }
  }

  onSubmitUpdate(): void {
  const { id, content } = this.updateForm.value;
  const numericId = id !== null && id !== undefined ? Number(id) : 0;

  // Si hay una imagen seleccionada, primero subirla a Cloudinary
  if (this.selectedFile) {
    this.cloudinaryService.processImage(this.selectedFile).subscribe({
      next: (cloudinaryURL) => {
        // Una vez subida la imagen, actualizar la facilidad
        this.updateFacilityWithImage(numericId, content ?? '', cloudinaryURL);
      },
      error: (error) => {
        this.showModalRequest.emit({
          message: 'Error al subir la imagen',
          type: 'error'
        });
      }
    });
  } else {
    // Si no hay imagen nueva, usar la imagen existente
    const existingImage = this.imagePath() || '';
    this.updateFacilityWithImage(numericId, content ?? '', existingImage.toString());
  }
}

private updateFacilityWithImage(id: number, content: string, imageURL: string): void {
  this.pageService.updateFacility(id, content, imageURL).subscribe({
    next: (response) => {
      this.showModalRequest.emit({
        message: 'Facilidad actualizada correctamente',
        type: 'success'
      });
    },
    error: (error) => {
      this.showModalRequest.emit({
        message: 'Error al actualizar la facilidad',
        type: 'error'
      });
    }
  });
}

  deleteFacility(facilityID: number): void {
    this.pageService.deleteFacility(facilityID).subscribe({
      next: (response) => {
        this.showModalRequest.emit({
          message: 'Facilidad eliminada correctamente',
          type: 'success',
        });
      },
      error: (error) => {
        this.showModalRequest.emit({
          message: 'Hubo un error al eliminar la facilidad',
          type: 'error',
        });
      },
    });
  }
}