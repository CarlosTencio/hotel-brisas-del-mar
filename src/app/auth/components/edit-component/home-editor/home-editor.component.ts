import { Component, OnInit, inject, signal, computed, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageService } from '../../../services/page.service';
import { Page } from '../../../../models/page.interface';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { CloudinaryService } from '../../../services/cloudinary.service';

@Component({
  selector: 'app-home-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home-editor.component.html',
  styleUrl: './home-editor.component.css'
})
export default class HomeEditorComponent implements OnInit {
  // Input
  dataPage = input.required<Page>();

  // Servicios
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);
  private pageService = inject(PageService);
  private cloudinaryService = inject(CloudinaryService);

  // Señales
  private selectedImageFile: File | null = null;
  private imageSignal = signal<string>('');
  isLoading = signal(true);

  // Computed
  pageTitle = computed(() => this.dataPage().pageTitle);
  pageContent = computed(() => this.dataPage().pageContent);
  image = computed(() => this.imageSignal() || this.dataPage().images?.[0] || '');

  // Output
  @Output() modalRequest = new EventEmitter<{
    message: string;
    type: 'confirm' | 'success' | 'error';
  }>();

  // Formulario
  pageForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadPage();
  }

  private initForm(): void {
    this.pageForm = this.fb.group({
      pageTitle: ['', Validators.required],
      pageContent: ['', [Validators.required, Validators.minLength(100)]],
      imageUrl: [''],
    });
  }

  private loadPage(): void {
    this.isLoading.set(true);

    const page = this.dataPage();
    this.pageForm.patchValue({
      pageTitle: this.pageTitle(),
      pageContent: this.pageContent(),
      imageUrl: this.image(),
    });

    this.isLoading.set(false);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSignal.set(reader.result as string);
        this.pageForm.patchValue({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  onSubmit(): void {
    if (this.pageForm.valid) {
      this.updatePage();
    } else {
      this.markFormGroupTouched(this.pageForm);
      this.modalRequest.emit({
        message: 'Por favor corrija los errores en el formulario.',
        type: 'error',
      });
    }
  }

  private updatePage(): void {
    const formData = this.pageForm.value;
    if (this.selectedImageFile) {
      this.isLoading.set(true);
      this.cloudinaryService.processImage(this.selectedImageFile).subscribe({
        next: (imageUrl) => {
          this.pageForm.patchValue({ imageUrl });
          this.savePageData();
        },
        error: () => {
          this.modalRequest.emit({
            message: 'Error subiendo imagen. Intente de nuevo.',
            type: 'error',
          });
          this.isLoading.set(false);
        },
      });
    } else {
      this.savePageData();
    }
  }

  private savePageData(): void {
    const { pageTitle, pageContent, imageUrl } = this.pageForm.value;
    const pageData: Page = {
      pageID: this.dataPage().pageID,
      pageTitle,
      pageContent,
      images: imageUrl ? [imageUrl] : [],
    };
    this.isLoading.set(true);
    this.pageService.updatePage(pageData).subscribe({
      next: () => {
        this.modalRequest.emit({
          message: 'Página actualizada correctamente.',
          type: 'success',
        });
        this.loadPage();
        this.isLoading.set(false);
      },
      error: () => {
        this.modalRequest.emit({
          message: 'Error al actualizar la página.',
          type: 'error',
        });
        this.isLoading.set(false);
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) =>
      control.markAsTouched()
    );
  }
}