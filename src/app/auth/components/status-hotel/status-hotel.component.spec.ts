import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusHotelComponent } from './status-hotel.component';

describe('StatusHotelComponent', () => {
  let component: StatusHotelComponent;
  let fixture: ComponentFixture<StatusHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusHotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
