import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CloudinarysService {
  private cloudName = 'dgcrjewoy';
  private uploadPreset = 'hotel_uploads';

  constructor(private http: HttpClient) {}

  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;

    return this.http.post<any>(cloudinaryUrl, formData);
  }
}




