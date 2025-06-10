import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutusEditComponent } from './aboutus-edit.component';

describe('AboutusEditComponent', () => {
  let component: AboutusEditComponent;
  let fixture: ComponentFixture<AboutusEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutusEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutusEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
