import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStatusRoomPageComponent } from './manage-status-room-page.component';

describe('ManageStatusRoomPageComponent', () => {
  let component: ManageStatusRoomPageComponent;
  let fixture: ComponentFixture<ManageStatusRoomPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageStatusRoomPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStatusRoomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
