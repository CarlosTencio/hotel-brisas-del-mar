import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDataBookingComponent } from './personal-data-booking.component';

describe('PersonalDataBookingComponent', () => {
  let component: PersonalDataBookingComponent;
  let fixture: ComponentFixture<PersonalDataBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalDataBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDataBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
