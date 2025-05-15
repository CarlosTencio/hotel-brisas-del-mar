import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import SeasonFormComponent from './season-form.component';

describe('SeasonFormComponent', () => {
  let component: SeasonFormComponent;
  let fixture: ComponentFixture<SeasonFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SeasonFormComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeasonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 