import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { RoomStatus } from '../../models/room-status';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-status-hotel-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './status-hotel-page.component.html',
  styleUrl: './status-hotel-page.component.css'
})
export default class StatusHotelPageComponent implements OnInit {
  habitaciones = signal<RoomStatus[]>([]);
  isLoading = signal(true);
  currentDate = new Date();
  
  // Paginación
  pageSize = signal(10);
  currentPage = signal(1);
  totalRooms = signal(0);
  
  // Valores computados para la paginación
  startIndex = computed(() => (this.currentPage() - 1) * this.pageSize());
  endIndex = computed(() => Math.min(this.startIndex() + this.pageSize(), this.totalRooms()));
  
  // Habitaciones paginadas
  paginatedHabitaciones = computed(() => {
    const start = this.startIndex();
    const end = this.endIndex();
    return this.habitaciones().slice(start, end);
  });

  private roomService = inject(RoomService);
  private router = inject(Router);
  private login = inject(LoginService);

  ngOnInit(): void {
    if (!this.login.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadRoomStatuses();
  }

  private loadRoomStatuses(): void {
    this.isLoading.set(true);
    this.roomService.roomStatus().subscribe({
      next: (data) => {
        this.habitaciones.set(data);
        this.totalRooms.set(data.length);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar estados de habitación', err);
        this.isLoading.set(false);
      }
    });
  }
  
  // Métodos para la paginación
  nextPage(): void {
    if (this.currentPage() < Math.ceil(this.totalRooms() / this.pageSize())) {
      this.currentPage.update(val => val + 1);
    }
  }
  
  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(val => val - 1);
    }
  }
  
  // Método para generar PDF
  generatePDF(): void {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Estado del Hotel Hoy', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
    
    // Fecha
    doc.setFontSize(12);
    doc.text(`Fecha: ${this.currentDate.toLocaleDateString()}`, 14, 30);
    
    // Tabla
    const tableColumn = ['Número de Habitación', 'Tipo', 'Estado'];
    const tableRows = this.habitaciones().map(habitacion => [
      habitacion.roomNumber.toString(),
      habitacion.roomTypeName,
      habitacion.status
    ]);
    
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
    doc.save(`estado-hotel-${this.currentDate.toISOString().split('T')[0]}.pdf`);
  }
}