import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutusItemComponent } from './aboutus-item.component';

describe('AboutusItemComponent', () => {
  let component: AboutusItemComponent;
  let fixture: ComponentFixture<AboutusItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutusItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutusItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
