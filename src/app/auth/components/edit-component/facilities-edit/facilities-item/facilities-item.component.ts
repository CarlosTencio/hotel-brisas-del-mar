import { Component, computed, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { Page } from '../../../../../models/page.interface';
import { PageService } from '../../../../services/page.service';

@Component({
  selector: 'facility-item',
  templateUrl: './facilities-item.component.html',
})
export class FacilityItemComponent {
  pageService = inject(PageService);

  @Output() showModalRequest = new EventEmitter<{
    message: string;
    type: 'confirm' | 'success' | 'error';
  }>();

  dataPage = input.required<Page>();
  idFacility = computed(() => this.dataPage().pageID);
  image = computed(() => this.dataPage().images);
  content = computed(() => this.dataPage().pageContent);


  deleteFacility(facilityID: number): void {
    this.pageService.deleteFacility(facilityID).subscribe({
      next: (response) => {
        this.showModalRequest.emit({
          message: 'Facilidad eliminada correctamente',
          type: 'success',
        });
      },
      error: (error) => {
        this.showModalRequest.emit({
          message: 'Hubo un error al eliminar la facilidad',
          type: 'error',
        });
      },
    });
  }
}