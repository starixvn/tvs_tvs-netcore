import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWebsiteComponent } from './header-website.component';

describe('HeaderWebsiteComponent', () => {
  let component: HeaderWebsiteComponent;
  let fixture: ComponentFixture<HeaderWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderWebsiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
