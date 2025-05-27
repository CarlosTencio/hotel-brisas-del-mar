import { Component, OnInit } from '@angular/core';
import { RoomTypeService } from '../../services/roomType.service';
import { RoomType } from '../../models/room-type';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
  templateUrl: './room-manage.component.html',
  styleUrls: ['./room-manage.component.css']
})
export class RoomManageComponent implements OnInit {

  roomTypes: RoomType[] = [];
  selectedRoomTypeId: number | null = null;
  selectedRoomType: string = '';
  selectedFile: File | null = null;

  room: RoomType = {
    roomTypeId: 0,
    roomTypeName: '',
    price: '',
    characteristics: '',
    description: '',
    image: ''
  };

  constructor(
    private roomTypeService: RoomTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roomTypeService.getRoomTypes().subscribe({
      next: (types) => {
        this.roomTypes = types;

        const roomTypeName = this.route.snapshot.paramMap.get('name');
        if (roomTypeName) {
          const matched = this.roomTypes.find(r => r.roomTypeName === roomTypeName);
          if (matched) {
            this.selectedRoomTypeId = matched.roomTypeId;
            this.loadRoomData();
          }
        }
      },
      error: (err) => {
        console.error('Error al cargar tipos de habitación', err);
      }
    });
  }

  loadRoomData(): void {
    if (this.selectedRoomType) {
      this.roomTypeService.getRoomByName(this.selectedRoomType).subscribe({
        next: (roomData) => {
          this.room = roomData;
        },
        error: (err) => {
          console.error('Error cargando habitación', err);
        }
      });
    }
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
    const formData = new FormData();
    formData.append('roomTypeName', this.room.roomTypeName);
    formData.append('price', this.room.price);
    formData.append('characteristics', this.room.characteristics);
    formData.append('description', this.room.description);

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile, this.selectedFile.name);
    }

    this.roomTypeService.updateRoomType(this.room.roomTypeName, formData).subscribe({
      next: () => {
        alert('Habitación actualizada con éxito.');
        this.router.navigate(['/habitaciones']);
      },
      error: (err) => {
        console.error('Error al actualizar habitación', err);
      }
    });
  }

  onDelete(): void {
    this.router.navigate(['/habitaciones']);
  }

  onRoomTypeChange(): void {
    this.loadRoomData();
  }
}
