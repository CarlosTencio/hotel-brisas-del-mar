import { Component, computed, EventEmitter, Output, input, OnInit,inject,signal } from '@angular/core';
import { Page } from '../../../../models/page.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageService } from '../../../services/page.service';
import {ContentAboutUS} from '../../../models/image-model';
import { EditTextComponent } from "./edit-text/edit-text.component";
@Component({
  selector: 'app-location-edit',
  imports: [ReactiveFormsModule, EditTextComponent], 
  templateUrl: './location-edit.component.html',
  styleUrl: './location-edit.component.css'
})
export class LocationEditComponent implements OnInit {
  @Output() update = new EventEmitter<{ id: number, content: string }>();
  dataLocationPage = input.required<Page>();
  title = computed(() => this.dataLocationPage().pageTitle);
  content = computed(() => this.dataLocationPage().pageContent);
  pageService = inject(PageService);
 
  showAddFacilityModal = signal(false);
 @Output() modalRequest = new EventEmitter<{
    message: string;
    type: 'confirm' | 'success' | 'error';
  }>();
  onShowModalRequest(event: {
    message: string;
    type: 'confirm' | 'success' | 'error';
  }) {
    this.modalRequest.emit(event);
  }

  onCloseModal() {
    this.showAddFacilityModal.set(false);
    // Reset del formulario y estado
    this.form.reset();

  }
  updateContentLocation(ContentAboutUS: ContentAboutUS) {
    this.pageService.UpdateAboutUs(ContentAboutUS)
      .subscribe({
        next: (response) => {
          console.log('Content updated successfully:', response);
          this.onShowModalRequest({ message: 'Content updated successfully', type: 'success' });
          this.onCloseModal();
           this.content= computed(() => ContentAboutUS.pageContent);
        },
        error: (error) => {
          console.error('Error updating content:', error);
          this.onShowModalRequest({ message: 'Error updating content', type: 'error' });
        }
      });
  }
 
  form = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.form.patchValue({ content: this.dataLocationPage().pageContent });
  }

  onSubmit() {
    if (this.form.valid) {
    const contentToUpdate: ContentAboutUS = {
      pageID: this.dataLocationPage().pageID,
      pageContent: this.form.value.content || ''
    };
    
    this.updateContentLocation(contentToUpdate);
  }
  }
    
  handleUpdateContent(event: { id: number, content: string }) {
    const contentToUpdate: ContentAboutUS = {
      pageID: event.id,
      pageContent: event.content
    };
  
    this.updateContentLocation(contentToUpdate);
  }
}