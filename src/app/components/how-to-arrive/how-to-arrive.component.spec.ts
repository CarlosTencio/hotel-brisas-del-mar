import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HowToArriveComponent } from './how-to-arrive.component';

describe('HowToArriveComponent', () => {
  let component: HowToArriveComponent;
  let fixture: ComponentFixture<HowToArriveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToArriveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HowToArriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 