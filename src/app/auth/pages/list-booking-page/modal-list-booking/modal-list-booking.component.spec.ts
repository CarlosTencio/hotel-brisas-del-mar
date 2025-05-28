import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListBookingComponent } from './modal-list-booking.component';

describe('ModalListBookingComponent', () => {
  let component: ModalListBookingComponent;
  let fixture: ComponentFixture<ModalListBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalListBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalListBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
