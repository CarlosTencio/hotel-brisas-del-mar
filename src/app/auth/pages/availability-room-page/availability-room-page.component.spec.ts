import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityRoomPageComponent } from './availability-room-page.component';

describe('AvailabilityRoomPageComponent', () => {
  let component: AvailabilityRoomPageComponent;
  let fixture: ComponentFixture<AvailabilityRoomPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityRoomPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityRoomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
