import { Component, EventEmitter, Input, Output, OnInit, input, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageService } from '../../../services/page.service';
import { CloudinaryService } from '../../../services/cloudinary.service';
import { ImagePageContactUs, ContentContactUs } from '../../../models/image-model';
import { ContactusItemComponent } from './contactus-item/contactus-item.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-contactus-edit',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './contactus-edit.component.html',
  styleUrl: './contactus-edit.component.css'
})
export class ContactusEditComponent implements OnInit {
  //@Input() contactData!: ContentContactUs;
//  contactData = input.required<ContentContactUs>();
 contactData = input<ContentContactUs | null>(null);


  @Output() modalRequest = new EventEmitter<{
    message: string;
    type: 'confirm' | 'success' | 'error';
  }>(); 

  selectedFile: File | null = null;

  constructor(
    private pageService: PageService,
    private cloudinaryService: CloudinaryService
  ) {

  effect(() => {
      const data = this.contactData();
      if (data) {
        this.contactForm.patchValue({
          pageID: data.pageID,
          phone1: data.phone1,
          phone2: data.phone2,
          poBox: data.poBox,
          email: data.email,
          facebook: data.facebook,
          instagram: data.instagram
        });
      }
    });
  }

  contactForm = new FormGroup({
    pageID: new FormControl<number>(0),
    phone1: new FormControl<string>('', Validators.required),
    phone2: new FormControl<string>(''),
    poBox: new FormControl<string>(''),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    facebook: new FormControl<string>(''),
    instagram: new FormControl<string>(''),
  });

  ngOnInit(): void {
    const data = this.contactData();

  }

  handleUpdateContent() {

    
    if (this.contactForm.valid) {
      const contentToUpdate: ContentContactUs = this.contactForm.value as ContentContactUs;
      this.pageService.updateContactUs(contentToUpdate).subscribe({
        next: (response) => {
          this.onShowModalRequest({ message: 'Contenido actualizado con éxito.', type: 'success' });
        },
        error: (error) => {
          this.onShowModalRequest({ message: 'Error al actualizar el contenido.', type: 'error' });
        }
      });
    } else {
      this.onShowModalRequest({ message: 'Por favor complete los campos requeridos.', type: 'error' });
    }
  }

  insertImageContactUs(event: { imagePath: string, pageID: number }) {
    const imageToInsert: ImagePageContactUs = {
      PageID: event.pageID,
      ImagePath: event.imagePath
    };

    this.pageService.insertImageContactUs(imageToInsert).subscribe({
      next: () => {
        this.onShowModalRequest({ message: 'Imagen insertada correctamente.', type: 'success' });
      },
      error: () => {
        this.onShowModalRequest({ message: 'Error al insertar imagen.', type: 'error' });
      }
    });
  }

  deleteImageContactUs(id: number) {
    this.pageService.deleteImageContactUs(id).subscribe({
      next: () => {
        this.onShowModalRequest({ message: 'Imagen eliminada correctamente.', type: 'success' });
      },
      error: () => {
        this.onShowModalRequest({ message: 'Error al eliminar imagen.', type: 'error' });
      }
    });
  }

  onShowModalRequest(event: {
    message: string;
    type: 'confirm' | 'success' | 'error';
  }) {
    this.modalRequest.emit(event);
  }

  onCloseModal() {
    this.contactForm.reset();
    this.selectedFile = null;
  }

  testClick() {

  }

  checkFormStatus() {

  }
}
