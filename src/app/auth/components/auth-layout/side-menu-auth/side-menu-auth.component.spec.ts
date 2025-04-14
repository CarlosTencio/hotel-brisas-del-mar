import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuAuthComponent } from './side-menu-auth.component';

describe('SideMenuAuthComponent', () => {
  let component: SideMenuAuthComponent;
  let fixture: ComponentFixture<SideMenuAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
