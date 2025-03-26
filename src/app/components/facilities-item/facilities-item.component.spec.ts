import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitiesItemComponent } from './facilities-item.component';

describe('FacilitiesItemComponent', () => {
  let component: FacilitiesItemComponent;
  let fixture: ComponentFixture<FacilitiesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilitiesItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilitiesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
