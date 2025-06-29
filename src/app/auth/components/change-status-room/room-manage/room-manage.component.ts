import { Component, inject, input, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { RoomTypeService } from '../../../services/roomType.service';
import { RoomType } from '../../../models/room-type';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RoomTypedto } from '../../../models/room-typedto';
import { modalUpdateRoomTypeComponent } from '../../confirmation-modal-updateRoomType/confirmation-modal-updateRoomType.component';
import { CloudinaryService } from '../../../services/cloudinary.service';

@Component({
  selector: 'app-room-manage',
  standalone: true,
  imports: [CommonModule, modalUpdateRoomTypeComponent, ReactiveFormsModule],
  templateUrl: './room-manage.component.html',
  styleUrls: ['./room-manage.component.css']
})
export class RoomManageComponent implements OnInit {

  @Output() cancelManage = new EventEmitter<void>();

  ngOnInit(): void {
    this.loadRoomData();
  }

  roomTypeId = input.required<number>();

  roomTypeName: string = '';

  cloudinary=inject(CloudinaryService);
  roomTypes: RoomType[] = [];
  selectedRoomTypeId: number | null = null;
  selectedFile: File | null = null;
  message: string = '';

  room: RoomType = {
    roomTypeId: 0,
    roomTypeName: '',
    price: 0,
    characteristics: null,
    description: null,
    image: null
  };

  // FormGroup con todos los campos incluyendo el selector
  updateForm = new FormGroup({
    price: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    characteristics: new FormControl('', [Validators.required]),
    img: new FormControl('')
  });

  constructor(
    private roomTypeService: RoomTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  loadRoomData(roomType?: string): void {
    const selectedType = roomType || this.updateForm.get('selectedRoomType')?.value;
    
    if (this.roomTypeId() === 1) {
      this.roomTypeName = 'Normal';
    } else if (this.roomTypeId() === 2) {
      this.roomTypeName = 'Premium';
    } else {
      console.error('Tipo de habitación no válido');
      return;
    }
    if (this.roomTypeId()){
      this.roomTypeService.getRoomByName(this.roomTypeName).subscribe({
        next: (roomData) => {
          this.room = roomData;
          this.room.characteristics = this.room.characteristics ? 
            this.room.characteristics.split('~').join('\n') : '';

          this.updateForm.patchValue({
            price: this.room.price.toString(),
            description: this.room.description,
            characteristics: this.room.characteristics
          });
        },
        error: (err) => {
          console.error('Error cargando habitación', err);
        }
      });
    }
  }

  onRoomTypeChange(): void {
    // Se ejecuta cuando cambia el select
    this.loadRoomData();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      this.selectedFile = file;

      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.room.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const formValues = this.updateForm.value;

      const proceedWithUpdate = (imageUrl: string) => {
        const updatedRoom: RoomTypedto = {
          roomTypeId: this.roomTypeId(),
          roomTypeName: this.roomTypeName,
          price: formValues.price ? parseInt(formValues.price) : 0,
          description: formValues.description || '',
          characteristics: formValues.characteristics || '',
          image: imageUrl
        };

        updatedRoom.characteristics = this.characteristicsFormatted(updatedRoom.characteristics);

        this.roomTypeService.updateRoomTypeData(updatedRoom).subscribe({
          next: (response: string) => {
            this.message = response;
            this.openModal();
          },
          error: (err) => {
            console.error('Error al actualizar habitación en backend:', err);
            this.message = 'Error al actualizar la habitación. Por favor, verifique los datos ingresados.';
            this.openModal();
          }
        });
      };

      if (formValues.img) {
        this.cloudinary.processImage(this.selectedFile).subscribe({
          next: (uploadResponse) => {
            const imageUrl = uploadResponse;
            console.log('Imagen subida a Cloudinary:', imageUrl);
            proceedWithUpdate(imageUrl);
          },
          error: (uploadErr) => {
            console.error('Error al subir imagen:', uploadErr);
            this.message = 'Error al subir la imagen.';
            this.openModal();
          }
        });
      } else {
        proceedWithUpdate(this.room.image || ''); // usa la imagen existente o cadena vacía si es null
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  characteristicsFormatted(characteristics: string): string {
    return characteristics ? characteristics.split('\n').join('~') : '';
  }

  updateRoomType(roomType: RoomTypedto): void {
    
    roomType.characteristics = this.characteristicsFormatted(roomType.characteristics);
    
    this.roomTypeService.updateRoomTypeData(roomType).subscribe({
      next: (response: string) => {
        this.message = response;
        this.openModal();
      },
      error: (err) => {
        console.error('Error:', err);
        this.message = 'Error al actualizar la habitación. Por favor, verifique los datos ingresados.';
        this.openModal();
      }
    });
  }

  onCancel(): void {
    this.cancelManage.emit();
  }

  // Método para marcar todos los campos como touched (mostrar errores)
  private markFormGroupTouched(): void {
    Object.keys(this.updateForm.controls).forEach(key => {
      const control = this.updateForm.get(key);
      control?.markAsTouched();
    });
  }

  // Modal
  isModalOpen = signal<boolean>(false);

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}