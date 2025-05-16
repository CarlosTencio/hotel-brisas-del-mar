import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { RoomStatus } from '../../models/room-status';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TokenResponse {
  tokenDTOString: string;
}

@Component({
  selector: 'app-status-hotel-page',
  standalone: true,
  imports: [],
  templateUrl: './status-hotel-page.component.html',
  styleUrl: './status-hotel-page.component.css'
})
export default class StatusHotelPageComponent implements OnInit {
  habitaciones = signal<RoomStatus[]>([]);
  isLoading = signal(true);
  fechaActual = signal('');
  
  // Paginación
  pageSize = signal(10);
  currentPage = signal(1);
  totalPages = computed(() => Math.ceil(this.habitaciones().length / this.pageSize()));
  
  // Habitaciones paginadas
  paginatedHabitaciones = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.habitaciones().slice(start, end);
  });
  
  // Exponer Math para usar en la plantilla
  mathMin = Math.min;
  
  // Lista de páginas para la paginación
  pageNumbers = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  private roomService = inject(RoomService);
  private router = inject(Router);
  private login = inject(LoginService);

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    
    if (token) {
      this.login.verifyToken(token).subscribe({
        next: (tokenResponse) => {
          this.isLoading.set(false);
          if(!tokenResponse) {
            this.router.navigate(['/login']);
            return;
          }
          
          const hoy = new Date();
          const fechaFormateada = hoy.toLocaleDateString('es-ES');
          this.fechaActual.set(fechaFormateada);

          this.loadRoomStatuses();
        },
        error: (err) => {
          console.error('Error loading pages', err);
          this.router.navigate(['/login']);
        }
      });
    } else {
      console.error('No token found');
      // Redirect to login page
      this.router.navigate(['/login']);
    }
  }

  private loadRoomStatuses(): void {
    this.roomService.roomStatus().subscribe({
      next: (data) => {
        this.habitaciones.set(data);
        this.isLoading.set(false); // Oculta el loader cuando ya cargó
      },
      error: (err) => {
        console.error('Error al cargar estados de habitación', err);
        this.isLoading.set(false);
      }
    });
  }
  
  // Métodos para la paginación
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(val => val + 1);
    }
  }
  
  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(val => val - 1);
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
  
  // Método para generar PDF
  generatePDF(): void {
    const doc = new jsPDF();
    const fecha = this.fechaActual();
    
    // Título
    doc.setFontSize(18);
    doc.text('Estado del Hotel Hoy', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    // Fecha
    doc.setFontSize(12);
    doc.text(`Fecha: ${fecha}`, 14, 30);
    
    // Tabla
    const tableColumn = ['Número de Habitación', 'Tipo', 'Estado'];
    const tableRows: any[] = [];
    
    this.habitaciones().forEach(habitacion => {
      const roomData = [
        habitacion.roomNumber.toString(),
        habitacion.roomTypeName,
        habitacion.status
      ];
      tableRows.push(roomData);
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      }
    });
    
    // Guardar el PDF
    doc.save(`estado-hotel-${fecha.replace(/\//g, '-')}.pdf`);
  }
}