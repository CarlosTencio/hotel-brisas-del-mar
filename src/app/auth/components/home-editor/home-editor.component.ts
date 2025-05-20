import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageService } from '../../services/page.service';
import { Page } from '../../../models/page.interface';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'app-home-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container p-4">
      <h2 class="text-2xl font-bold mb-4">Edit Home Page Content</h2>
      
      <!-- Loading Spinner -->
      <div *ngIf="isLoading()" class="flex justify-center my-5">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error Message -->
      <div *ngIf="errorMessage()" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ errorMessage() }}</span>
        <button class="absolute top-0 bottom-0 right-0 px-4 py-3" (click)="errorMessage.set(null)">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </button>
      </div>
      
      <!-- Success Message (Toast) -->
      <div *ngIf="successMessage()" class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-fadeIn">
        <div class="flex items-center">
          <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ successMessage() }}</span>
        </div>
      </div>
      
      <!-- Main content when not loading -->
      <div *ngIf="!isLoading()">
        <div *ngIf="isPreviewMode()">
          <!-- Preview Mode -->
          <div class="mb-6">
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="bg-blue-600 text-white px-4 py-2">
                <h4 class="text-lg font-semibold">Preview Mode</h4>
              </div>
              <div class="p-4">
                <div class="flex flex-col md:flex-row gap-6">
                  <div class="md:w-1/2">
                    <img *ngIf="previewData().images && previewData().images.length > 0" 
                         [src]="previewData().images[0]" 
                         class="w-full h-auto rounded" 
                         alt="Home page image">
                    <div *ngIf="!previewData().images || previewData().images.length === 0" 
                         class="bg-gray-100 text-center py-8 px-4 rounded border border-gray-300">
                      No image available
                    </div>
                  </div>
                  <div class="md:w-1/2">
                    <h3 class="text-xl font-bold">{{ previewData().pageTitle }}</h3>
                    <div class="mt-3 prose max-w-none" [innerHTML]="previewData().pageContent"></div>
                  </div>
                </div>
                <div class="flex justify-end mt-4 gap-2">
                  <button 
                    type="button" 
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors" 
                    (click)="cancelPreview()">
                    Back to Edit
                  </button>
                  <button 
                    type="button" 
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors" 
                    (click)="updatePage()">
                    Confirm Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Edit Form -->
        <div *ngIf="!isPreviewMode() && currentPage()">
          <form [formGroup]="pageForm" (ngSubmit)="onSubmit()" class="bg-white p-6 rounded-lg shadow-md">
            <!-- Page Title Field (Read-only) -->
            <div class="mb-4">
              <label for="pageTitle" class="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
              <input 
                type="text" 
                id="pageTitle" 
                formControlName="pageTitle" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                readonly>
            </div>
            
            <!-- Page Content Field -->
            <div class="mb-4">
              <label for="pageContent" class="block text-sm font-medium text-gray-700 mb-1">Page Content</label>
              <textarea 
                id="pageContent" 
                formControlName="pageContent" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"></textarea>
              <p *ngIf="pageForm.get('pageContent')?.invalid && pageForm.get('pageContent')?.touched" class="mt-1 text-sm text-red-600">
                Page content must be at least 100 characters
              </p>
            </div>
            
            <!-- Current Image Preview -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
              <div class="border border-gray-300 rounded-md p-2 bg-gray-50">
                <img *ngIf="pageForm.get('imageUrl')?.value" 
                     [src]="pageForm.get('imageUrl')?.value" 
                     class="max-h-48 mx-auto object-contain" 
                     alt="Current home page image">
                <div *ngIf="!pageForm.get('imageUrl')?.value" class="text-center py-8 text-gray-500">
                  No image available
                </div>
              </div>
            </div>
            
            <!-- Image Upload Field -->
            <div class="mb-6">
              <label for="imageUpload" class="block text-sm font-medium text-gray-700 mb-1">Upload New Image</label>
              <input 
                type="file" 
                id="imageUpload" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
                (change)="onFileSelected($event)">
                
              <!-- Image Upload Status -->
              <div *ngIf="isUploadingImage()" class="mt-2 flex items-center text-blue-500">
                <div class="w-4 h-4 mr-2 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                <span>Processing image...</span>
              </div>
            </div>
            
            <!-- Image URL Field (Hidden) -->
            <div class="hidden">
              <input type="text" formControlName="imageUrl">
            </div>
            
            <!-- Retry Button for API Error -->
            <div *ngIf="errorMessage()" class="mb-4">
              <button 
                type="button"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                (click)="retryLoadPage()">
                Retry Loading Page Data
              </button>
            </div>
            
            <!-- Submit Button -->
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                [disabled]="pageForm.invalid || isUploadingImage()"
                [class.opacity-50]="pageForm.invalid || isUploadingImage()">
                Preview Changes
              </button>
            </div>
          </form>
        </div>
        
        <!-- Show form creation button when there's an error and no current page -->
        <div *ngIf="errorMessage() && !currentPage()">
          <div class="bg-white p-6 rounded-lg shadow-md text-center">
            <p class="mb-4">There was an error loading the page data. You can try again or create a new page.</p>
            <div class="flex justify-center gap-4">
              <button 
                type="button"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                (click)="retryLoadPage()">
                Retry Loading
              </button>
              <button 
                type="button"
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                (click)="createNewPage()">
                Create New Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .prose {
      line-height: 1.6;
    }
    
    .prose p {
      margin-bottom: 1rem;
    }
    
    textarea {
      resize: vertical;
    }
  `]
})
export default class HomeEditorComponent implements OnInit {
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isUploadingImage = signal(false);
  pageForm!: FormGroup;
  currentPage = signal<Page | null>(null);
  isPreviewMode = signal(false);
  previewData = signal<Page>({
    pageID: 0,
    pageTitle: 'Inicio',
    pageContent: '',
    images: []
  });
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);
  private pageService = inject(PageService);
  private cloudinaryService = inject(CloudinaryService);
  
  // Store the original file for later upload
  private selectedImageFile: File | null = null;
  
  ngOnInit(): void {
    console.log('HomeEditorComponent initialized');
    this.checkAuthentication();
    this.initForm();
    this.loadPage();
  }
  
  private checkAuthentication(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.loginService.verifyToken(token).subscribe({
        next: (tokenResponse) => {
          if (!tokenResponse) {
            this.router.navigate(['/login']);
          }
        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  private initForm(): void {
    this.pageForm = this.fb.group({
      pageTitle: ['Inicio', Validators.required],
      pageContent: ['', [Validators.required, Validators.minLength(100)]],
      imageUrl: ['']
    });
  }
  
  private loadPage(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    this.pageService.getPageByTitle('Inicio').subscribe({
      next: (page) => {
        console.log('Loaded page:', page);
        this.currentPage.set(page);
        this.pageForm.patchValue({
          pageTitle: page.pageTitle,
          pageContent: page.pageContent,
          imageUrl: page.images && page.images.length > 0 ? page.images[0] : ''
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading page:', error);
        const errorMsg = 'Error loading page content: ' + 
          (error.status === 404 ? 'Page not found. The page might not exist yet.' : error.message || 'Unknown error');
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }
  
  retryLoadPage(): void {
    this.loadPage();
  }
  
  createNewPage(): void {
    const newPage: Page = {
      pageID: 0, // This will be assigned by the server
      pageTitle: 'Inicio',
      pageContent: 'Welcome to Hotel Brisas del Mar! Edit this content to customize your home page.',
      images: []
    };
    
    this.currentPage.set(newPage);
    this.pageForm.patchValue({
      pageTitle: newPage.pageTitle,
      pageContent: newPage.pageContent,
      imageUrl: ''
    });
    
    this.errorMessage.set(null);
  }
  
  onSubmit(): void {
    console.log('Form submitted');
    if (this.pageForm.valid) {
      if (this.isPreviewMode()) {
        this.updatePage();
      } else {
        this.showPreview();
      }
    } else {
      this.markFormGroupTouched(this.pageForm);
      this.errorMessage.set('Please correct the errors in the form before submitting.');
    }
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  
  showPreview(): void {
    console.log('Showing preview');
    const formData = this.pageForm.value;
    
    const previewData: Page = {
      pageID: this.currentPage()?.pageID || 0,
      pageTitle: formData.pageTitle,
      pageContent: formData.pageContent,
      images: formData.imageUrl ? [formData.imageUrl] : []
    };
    
    this.previewData.set(previewData);
    this.isPreviewMode.set(true);
  }
  
  cancelPreview(): void {
    console.log('Preview cancelled');
    this.isPreviewMode.set(false);
  }
  
  // Confirm and update page with Cloudinary image
  updatePage(): void {
    console.log('Updating page');
    const formData = this.pageForm.value;
    
    // If we have a new image file selected, upload to Cloudinary first
    if (this.selectedImageFile) {
      this.isLoading.set(true);
      this.uploadImageToCloudinary(this.selectedImageFile);
    } else {
      // Check if we're using a base64 image instead of a Cloudinary URL
      const currentImage = formData.imageUrl;
      if (typeof currentImage === 'string' && currentImage.startsWith('data:') && 
          !this.cloudinaryService.isCloudinaryUrl(currentImage)) {
        // We have a base64 image but no File object, process it directly
        this.isLoading.set(true);
        console.log('Processing base64 image...');
        
        this.cloudinaryService.processImage(currentImage).subscribe({
          next: (imageUrl) => {
            console.log('Base64 image processed successfully');
            this.pageForm.patchValue({
              imageUrl: imageUrl
            });
            this.savePageData();
          },
          error: (error) => {
            console.error('Error processing base64 image:', error);
            this.errorMessage.set('Warning: Could not process image. Using original.');
            this.savePageData();
          }
        });
      } else {
        // No new image or already using a Cloudinary URL, proceed with update
        this.savePageData();
      }
    }
  }
  
  // Handle image file upload
  onFileSelected(event: Event): void {
    console.log('File selected');
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.selectedImageFile = file;
      
      // Convert file to base64 for preview only
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        
        // Update form with base64 temporarily for preview
        this.pageForm.patchValue({
          imageUrl: base64String
        });
        
        console.log('File loaded into form for preview');
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Upload image to Cloudinary and then save page data
  private uploadImageToCloudinary(file: File): void {
    this.isUploadingImage.set(true);
    console.log('Processing image before saving page...');
    
    // Use the improved image processing method
    this.cloudinaryService.processImage(file).subscribe({
      next: (imageUrl) => {
        console.log('Image processed successfully:', imageUrl);
        
        // Update the form with the processed image URL
        this.pageForm.patchValue({
          imageUrl: imageUrl
        });
        
        this.isUploadingImage.set(false);
        
        // Now save the page data with the processed image URL
        this.savePageData();
      },
      error: (error) => {
        console.error('Error processing image:', error);
        
        // If we have a fallback image from the error, use it
        if (error.originalImage) {
          console.log('Using fallback image URL:', error.originalImage);
          this.pageForm.patchValue({
            imageUrl: error.originalImage
          });
          this.errorMessage.set('Warning: Could not upload to Cloudinary. Using local image temporarily.');
          
          // Proceed with local image
          this.isUploadingImage.set(false);
          this.savePageData();
        } else {
          // No fallback available
          this.errorMessage.set('Error uploading image: ' + (error.message || 'Unknown error'));
          this.isUploadingImage.set(false);
          this.isLoading.set(false);
          
          // Ask user if they want to continue without the image
          if (confirm('There was an error with the image. Do you want to continue without it?')) {
            // Remove the image and continue
            this.pageForm.patchValue({
              imageUrl: ''
            });
            this.savePageData();
          }
        }
      }
    });
  }
  
  // Save page data to the API
  private savePageData(): void {
    const formData = this.pageForm.value;
    
    const pageData: Page = {
      pageID: this.currentPage()?.pageID || 0,
      pageTitle: formData.pageTitle,
      pageContent: formData.pageContent,
      images: formData.imageUrl ? [formData.imageUrl] : []
    };
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    console.log('Sending page update:', {
      pageID: pageData.pageID,
      pageTitle: pageData.pageTitle,
      pageContent: pageData.pageContent.substring(0, 30) + '...',
      imagesCount: pageData.images.length,
      firstImageUrl: pageData.images[0] ? (pageData.images[0].substring(0, 50) + '...') : 'none'
    });
    
    this.pageService.updatePage(pageData).subscribe({
      next: (response) => {
        console.log('Page updated successfully');
        this.successMessage.set('Home page updated successfully');
        this.isPreviewMode.set(false);
        this.isLoading.set(false);
        
        // Reset the selectedImageFile
        this.selectedImageFile = null;
        
        // Reload the page data to refresh the view with the latest from server
        this.loadPage();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage.set(null);
        }, 3000);
      },
      error: (error) => {
        console.error('Error updating page:', error);
        
        // Get a more descriptive error message
        let errorMsg = 'Unknown error';
        if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.message) {
          errorMsg = error.message;
        } else if (error.status) {
          errorMsg = `HTTP error ${error.status} ${error.statusText}`;
        }
        
        this.errorMessage.set('Error updating home page: ' + errorMsg);
        this.isLoading.set(false);
      }
    });
  }
} 