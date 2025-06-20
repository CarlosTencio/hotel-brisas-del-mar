import { Component, computed, EventEmitter, Output, input } from '@angular/core';
import { Page } from '.././../../../../models/page.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-text',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-text.component.html',
  styleUrl: './edit-text.component.css'
})
export class EditTextComponent {
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
      this.dataPage().pageContent = this.form.value.content|| '' ;
    }
  }
}
