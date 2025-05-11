import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisingPageComponent } from './advertising-page.component';

describe('AdvertisingPageComponent', () => {
  let component: AdvertisingPageComponent;
  let fixture: ComponentFixture<AdvertisingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
