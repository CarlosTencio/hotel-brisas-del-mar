import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Solo necesitamos un subject para manejar el estado del menú
  private menuOpenSubject = new BehaviorSubject<boolean>(false);
  menuOpen$ = this.menuOpenSubject.asObservable();

  toggleMenu() {
    this.menuOpenSubject.next(!this.menuOpenSubject.value);
  }
  
  // Método para establecer un valor específico
  setMenuOpen(isOpen: boolean) {
    this.menuOpenSubject.next(isOpen);
  }
}