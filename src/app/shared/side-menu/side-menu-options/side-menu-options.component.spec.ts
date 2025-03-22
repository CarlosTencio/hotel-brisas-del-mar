import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuOptionsComponent } from './side-menu-options.component';

describe('SideMenuOptionsComponent', () => {
  let component: SideMenuOptionsComponent;
  let fixture: ComponentFixture<SideMenuOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
