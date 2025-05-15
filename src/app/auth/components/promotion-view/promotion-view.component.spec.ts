import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import PromotionViewComponent from './promotion-view.component';

describe('PromotionViewComponent', () => {
  let component: PromotionViewComponent;
  let fixture: ComponentFixture<PromotionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PromotionViewComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromotionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 