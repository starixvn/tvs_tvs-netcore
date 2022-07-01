import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarWebsiteComponent } from './navbar-website.component';

describe('NavbarWebsiteComponent', () => {
  let component: NavbarWebsiteComponent;
  let fixture: ComponentFixture<NavbarWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarWebsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
