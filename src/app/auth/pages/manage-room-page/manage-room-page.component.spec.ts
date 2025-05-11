import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRoomPageComponent } from './manage-room-page.component';

describe('ManageRoomPageComponent', () => {
  let component: ManageRoomPageComponent;
  let fixture: ComponentFixture<ManageRoomPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageRoomPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageRoomPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
