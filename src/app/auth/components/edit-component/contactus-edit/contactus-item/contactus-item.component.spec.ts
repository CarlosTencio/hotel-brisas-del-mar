import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusItemComponent } from './contactus-item.component';

describe('ContactusItemComponent', () => {
  let component: ContactusItemComponent;
  let fixture: ComponentFixture<ContactusItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactusItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactusItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
