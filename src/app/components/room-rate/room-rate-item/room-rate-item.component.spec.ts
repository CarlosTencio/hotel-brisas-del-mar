import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRateItemComponent } from './room-rate-item.component';

describe('RoomRateItemComponent', () => {
  let component: RoomRateItemComponent;
  let fixture: ComponentFixture<RoomRateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomRateItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomRateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
