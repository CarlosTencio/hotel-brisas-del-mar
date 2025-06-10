import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutusGalleryComponent } from './aboutus-gallery.component';

describe('AboutusGalleryComponent', () => {
  let component: AboutusGalleryComponent;
  let fixture: ComponentFixture<AboutusGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutusGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutusGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
