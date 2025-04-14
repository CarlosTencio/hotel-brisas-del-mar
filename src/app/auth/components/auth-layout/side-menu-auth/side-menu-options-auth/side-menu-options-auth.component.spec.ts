import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuOptionsAuthComponent } from './side-menu-options-auth.component';

describe('SideMenuOptionsAuthComponent', () => {
  let component: SideMenuOptionsAuthComponent;
  let fixture: ComponentFixture<SideMenuOptionsAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuOptionsAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuOptionsAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
