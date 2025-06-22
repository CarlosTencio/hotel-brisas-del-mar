import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusEditComponent } from './contactus-edit.component';

describe('ContactusEditComponent', () => {
  let component: ContactusEditComponent;
  let fixture: ComponentFixture<ContactusEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactusEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
