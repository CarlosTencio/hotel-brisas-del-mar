import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityRoomComponent } from './availability-room.component';

describe('AvailabilityRoomComponent', () => {
  let component: AvailabilityRoomComponent;
  let fixture: ComponentFixture<AvailabilityRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
