import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRateComponent } from './room-rate.component';

describe('RoomRateComponent', () => {
  let component: RoomRateComponent;
  let fixture: ComponentFixture<RoomRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomRateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
