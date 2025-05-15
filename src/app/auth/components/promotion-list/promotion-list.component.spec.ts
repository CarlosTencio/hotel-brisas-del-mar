import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import PromotionListComponent from './promotion-list.component';

describe('PromotionListComponent', () => {
  let component: PromotionListComponent;
  let fixture: ComponentFixture<PromotionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PromotionListComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromotionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 