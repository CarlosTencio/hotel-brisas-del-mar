import { Component, computed, Input, input, OnInit, signal,Output,EventEmitter,inject } from '@angular/core';
import { Page } from '../../../../models/page-model';
import { Image } from '../../../../models/image-model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CloudinaryService } from '../../../../services/cloudinary.service';
@Component({
  selector: 'app-aboutus-gallery',
  imports: [ReactiveFormsModule],
  templateUrl: './aboutus-gallery.component.html',
  styleUrl: './aboutus-gallery.component.css'
})
export class AboutusGalleryComponent {
 @Input() dataPage!: Page;
@Output() deleteImage = new EventEmitter<number>();
@Output() insertImage = new EventEmitter<{ imagePath: string, pageID: number }>();

  excludedImages = [
    '/images/equipo.jpg',
    '/images/logo.png'
  ];
  cloudinaryService = inject(CloudinaryService);
  showAddImageAboutUsModal = signal(false);
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
 filteredImages = computed(() => 
  this.dataPage.images.filter(img => !this.excludedImages.includes(img.imagePath))
);

selectedImage = signal<Image | null>(null);
 ngOnInit(): void {
  if (this.filteredImages().length > 0) {
    this.selectedImage.set(this.filteredImages()[0]);
  }
}
  
  setSelectedImage(image: Image) {
    this.selectedImage.set(image);
    console.log('Selected image:', this.selectedImage());
  }

  limitedImages() {
    return this.filteredImages().slice(0, 16);
  }
  onDeleteImage() {
  const image = this.selectedImage();
  if (image) {
    this.deleteImage.emit(image.imageID); // Asegurate de que `image.id` sea el ID correcto
  }
}
onCloseModal() {
    this.showAddImageAboutUsModal.set(false);
    // Reset del formulario y estado
    this.addForm.reset();
    this.selectedFile = null;
    this.imageSignal.set(null);
  }
  onSubmitInsertImageAboutUs() {
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

   
    
    // Si todo está válido, proceder con el guardado
    this.cloudinaryService.processImage(this.selectedFile).subscribe({
      next: (response) => {
        this.addImageAboutUs(this.dataPage.pageID, response);
      },
      error: (error) => {
        this.onShowModalRequest({
          message: 'Error al subir la imagen',
          type: 'error',
        });
      },
    });
  }
  private addImageAboutUs(pageId: number, imgPath: string) {
    this.insertImage.emit({ imagePath: imgPath, pageID: pageId });
  }
  onAddImage() {
    this.showAddImageAboutUsModal.set(true);
  }

}
