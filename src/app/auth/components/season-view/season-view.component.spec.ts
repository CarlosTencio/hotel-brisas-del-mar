import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import SeasonViewComponent from './season-view.component';

describe('SeasonViewComponent', () => {
  let component: SeasonViewComponent;
  let fixture: ComponentFixture<SeasonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SeasonViewComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeasonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 