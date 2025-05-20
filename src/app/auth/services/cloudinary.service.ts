import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { getBaseUrl } from '../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private baseUrl = `${getBaseUrl()}/upload`; // Assuming your backend has an upload endpoint

  // Cloudinary configuration
  private cloudName = 'dgcrjewoy'; // From your Cloudinary dashboard
  private uploadPreset = 'hotel_uploads'; // Create this in your Cloudinary dashboard > Settings > Upload

  constructor(private http: HttpClient) {}

  /**
   * Converts a data URL to a Blob object
   */
  private dataURItoBlob(dataURI: string): Blob {
    // Convert base64/URLEncoded data component to raw binary data
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = decodeURIComponent(dataURI.split(',')[1]);
    }

    // Separate the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // Write bytes to ArrayBuffer
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }

  /**
   * Checks if an image is already a Cloudinary URL
   */
  isCloudinaryUrl(url: string | null | undefined): boolean {
    return typeof url === 'string' && url.includes('cloudinary.com');
  }

  /**
   * Uploads a base64 image to Cloudinary
   */
  uploadBase64Image(base64Image: string): Observable<string> {
    // If it's already a Cloudinary URL, just return it
    if (this.isCloudinaryUrl(base64Image)) {
      return of(base64Image);
    }

    // Check if it's a valid base64 image
    if (!base64Image || !base64Image.startsWith('data:image')) {
      return throwError(() => new Error('Invalid base64 image format'));
    }

    console.log('Converting base64 to blob for upload');
    
    // Convert to blob
    const blob = this.dataURItoBlob(base64Image);
    
    // Create a file from the blob
    const fileName = `hotel_image_${new Date().getTime()}.${this.getImageExtension(base64Image)}`;
    const file = new File([blob], fileName, { type: blob.type });
    
    // Now use the file upload method
    return this.uploadFile(file);
  }

  /**
   * Gets the file extension from a base64 image
   */
  private getImageExtension(base64: string): string {
    const match = base64.match(/data:image\/([a-zA-Z]+);base64,/);
    return match ? match[1] : 'jpg';
  }

  /**
   * Uploads a file to Cloudinary
   */
  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'hotel');
    formData.append('public_id', `hotel_image_${new Date().getTime()}`);

    console.log('Uploading file to Cloudinary:', file.name);
    
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;
    
    const headers = new HttpHeaders();
    // No additional headers needed for FormData
    
    return this.http.post<any>(cloudinaryUrl, formData).pipe(
      map(response => {
        console.log('Cloudinary upload successful:', response);
        if (response && response.secure_url) {
          return response.secure_url;
        } else {
          throw new Error('Invalid response from Cloudinary');
        }
      }),
      catchError(error => {
        console.error('Error uploading to Cloudinary:', error);
        let errorMessage = 'Error uploading image';
        
        // Try to get a more detailed error message
        if (error.error && error.error.error && error.error.error.message) {
          errorMessage = error.error.error.message;
        }
        
        // Fall back to using the image directly if upload fails
        console.warn('Falling back to direct image usage due to Cloudinary error');
        
        // Return a custom error that includes the original base64 for fallback
        return throwError(() => ({
          message: errorMessage,
          originalImage: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));
      })
    );
  }

  /**
   * Handles an image based on its type (URL, base64, File)
   * Returns the best available image URL (Cloudinary if possible, fallback if not)
   */
  processImage(image: string | File | null | undefined): Observable<string> {
    // If no image, return empty string
    if (!image) {
      return of('');
    }
    
    // If it's already a Cloudinary URL, just return it
    if (typeof image === 'string' && this.isCloudinaryUrl(image)) {
      return of(image);
    }
    
    // If it's a File, upload it directly
    if (image instanceof File) {
      return this.uploadFile(image);
    }
    
    // If it's a base64 string, convert and upload
    if (typeof image === 'string' && image.startsWith('data:')) {
      return this.uploadBase64Image(image);
    }
    
    // If we can't process it, just return the original
    return of(typeof image === 'string' ? image : '');
  }
} 