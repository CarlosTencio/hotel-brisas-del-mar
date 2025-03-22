import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePageComponent } from './room-rate-page.component';

describe('FeePageComponent', () => {
  let component: FeePageComponent;
  let fixture: ComponentFixture<FeePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
