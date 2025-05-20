import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeEditorComponent from './home-editor.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('HomeEditorComponent', () => {
  let component: HomeEditorComponent;
  let fixture: ComponentFixture<HomeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        HomeEditorComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 