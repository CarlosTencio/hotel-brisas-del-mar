import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStatusRoomComponent } from './change-status-room.component';

describe('ChangeStatusRoomComponent', () => {
  let component: ChangeStatusRoomComponent;
  let fixture: ComponentFixture<ChangeStatusRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeStatusRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeStatusRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
