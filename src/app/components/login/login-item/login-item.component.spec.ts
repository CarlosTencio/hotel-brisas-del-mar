import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginItemComponent } from './login-item.component';

describe('LoginItemComponent', () => {
  let component: LoginItemComponent;
  let fixture: ComponentFixture<LoginItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
