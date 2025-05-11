import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookingPageComponent } from './list-booking-page.component';

describe('ListBookingPageComponent', () => {
  let component: ListBookingPageComponent;
  let fixture: ComponentFixture<ListBookingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBookingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBookingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
