import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemChangeStatusRoomComponent } from './item-change-status-room.component';

describe('ItemChangeStatusRoomComponent', () => {
  let component: ItemChangeStatusRoomComponent;
  let fixture: ComponentFixture<ItemChangeStatusRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemChangeStatusRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemChangeStatusRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
