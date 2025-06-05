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
import { Page } from '../../../../models/page.interface';
import { FacilityItemComponent } from './facilities-item/facilities-item.component';
import { PageService } from '../../../services/page.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CloudinaryService } from '../../../services/cloudinary.service';

@Component({
  selector: 'facilities-edit',
  imports: [FacilityItemComponent, ReactiveFormsModule],
  templateUrl: './facilities-edit.component.html',
  styleUrl: './facilities-edit.component.css',
})
export class FacilitiesEditComponent {
  pageService = inject(PageService);
  cloudinaryService = inject(CloudinaryService);
  dataPage = input.required<Page[]>();
  showAddFacilityModal = signal(false);
  selectedFile: File | null = null;
  
  // Usar null para mostrar solo el contorno
  private imageSignal = signal<string | null>(null);
  image = computed(() => {
    return this.imageSignal();
  });

  addForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSignal.set(reader.result as string);
        // Actualizar el FormControl de imagen como válido
        this.addForm.patchValue({ image: 'valid' });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitCreateFacility() {
    // Marcar todos los campos como tocados para mostrar errores
    this.addForm.markAllAsTouched();
    
    // Validar que el formulario sea válido
    if (this.addForm.invalid) {
      this.onShowModalRequest({
        message: 'Por favor completa todos los campos requeridos',
        type: 'error',
      });
      return; // Salir de la función si el formulario es inválido
    }

    // Validar que hay un archivo seleccionado
    if (!this.selectedFile) {
      this.onShowModalRequest({
        message: 'Por favor selecciona una imagen',
        type: 'error',
      });
      return;
    }

    const { content } = this.addForm.value;
    
    // Si todo está válido, proceder con el guardado
    this.cloudinaryService.processImage(this.selectedFile).subscribe({
      next: (response) => {
        this.addFacility(content!, response);
      },
      error: (error) => {
        this.onShowModalRequest({
          message: 'Error al subir la imagen',
          type: 'error',
        });
      },
    });
  }

  private addFacility(content: string, imgPath: string) {
    console.log(
      'Agregando facilidad con contenido:',
      content,
      'y ruta de imagen:',
      imgPath
    );
    this.pageService.addFacility(content, imgPath).subscribe({
      next: (response) => {
        console.log('Facilidad agregada:', response);
        this.onShowModalRequest({
          message: response.message || 'Facilidad agregada correctamente',
          type: 'success',
        });
        this.onCloseModal();
      },
      error: (error) => {
        console.error('Error al agregar la facilidad:', error);
        this.onShowModalRequest({
          message: 'Error al agregar la facilidad',
          type: 'error',
        });
      },
    });
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
}