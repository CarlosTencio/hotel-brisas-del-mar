import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusHotelPageComponent } from './status-hotel-page.component';

describe('StatusHotelPageComponent', () => {
  let component: StatusHotelPageComponent;
  let fixture: ComponentFixture<StatusHotelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusHotelPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusHotelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
