import { Component, computed, EventEmitter, Output, input } from '@angular/core';
import { Page } from '../../../../models/page-model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-aboutus-item',
  imports: [ReactiveFormsModule],
  templateUrl: './aboutus-item.component.html',
  styleUrl: './aboutus-item.component.css'
})
export class AboutusItemComponent {
   @Output() update = new EventEmitter<{ id: number, content: string }>();
  dataPage = input.required<Page>();

  form = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });

  title = computed(() => this.dataPage().pageTitle);
  content = computed(() => this.dataPage().pageContent);

  ngOnInit() {
    this.form.patchValue({ content: this.dataPage().pageContent });
  }

  onSubmit() {
    if (this.form.valid) {
      this.update.emit({
        id: this.dataPage().pageID,
        content: this.form.value.content || '',
      });
    }
  }
}
