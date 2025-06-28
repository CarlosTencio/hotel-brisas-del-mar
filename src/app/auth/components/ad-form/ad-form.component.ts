import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AdService } from '../../services/ad.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import { CommonModule } from '@angular/common';
import { Ad } from '../../models/ad-model';

@Component({
  selector: 'app-ad-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ad-form.component.html',
  styleUrls: ['./ad-form.component.css']
})
export default class AdFormComponent implements OnInit {
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  adForm!: FormGroup;
  isEditMode = signal(false);
  adId = signal<number>(0);
  selectedFile: File | null = null;
  
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loginService = inject(LoginService);
  private adService = inject(AdService);
  private cloudinaryService = inject(CloudinaryService);

  ngOnInit(): void {
    this.checkAuthentication();
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const parsedId = parseInt(id, 10);
      this.adId.set(parsedId);
      this.isEditMode.set(true);
      this.loadAd(parsedId);
    } else {
      this.isLoading.set(false);
    }
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
    this.adForm = this.fb.group({
      name: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isActive: [true],
      img: [''],
      imgUrl: [''] // URL de redirección externa (por ejemplo: coca-cola.com)
    });
  }

  private loadAd(id: number): void {
    this.adService.getAdById(id).subscribe({
      next: (ad) => {
        const startDate = new Date(ad.startDate).toISOString().split('T')[0];
        const endDate = new Date(ad.endDate).toISOString().split('T')[0];

        this.adForm.patchValue({
          name: ad.name,
          startDate,
          endDate,
          isActive: ad.isActive,
          img: ad.img,
          imgUrl: ad.imgUrl
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error cargando ad: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.adForm.patchValue({ img: reader.result }); // Solo para preview
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.adForm.invalid) {
      this.markFormGroupTouched(this.adForm);
      return;
    }

    this.isLoading.set(true);

    if (this.selectedFile) {
      this.cloudinaryService.processImage(this.selectedFile).subscribe({
        next: (cloudinaryUrl) => {
          this.adForm.patchValue({ img: cloudinaryUrl });
          this.proceedWithSubmit();
        },
        error: () => {
          this.errorMessage.set('Error uploading image to Cloudinary.');
          this.isLoading.set(false);
        }
      });
    } else {
      this.proceedWithSubmit();
    }
  }

  private proceedWithSubmit(): void {
    const adData: Ad = {
      ...this.adForm.value
    };

    if (this.isEditMode() && this.adId()) {
      adData.adID = this.adId();
      this.updateAd(adData);
    } else {
      this.createAd(adData);
    }
  }

  private createAd(ad: Ad): void {
    this.adService.createAd(ad).subscribe({
      next: () => {
        this.router.navigate(['/home-auth/ad']);
      },
      error: (error) => {
        this.errorMessage.set('Error creating ad: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

  private updateAd(ad: Ad): void {
    this.adService.updateAd(ad).subscribe({
      next: () => {
        this.router.navigate(['/home-auth/ad']);
      },
      error: (error) => {
        this.errorMessage.set('Error updating ad: ' + error.message);
        this.isLoading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/home-auth/ad']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
