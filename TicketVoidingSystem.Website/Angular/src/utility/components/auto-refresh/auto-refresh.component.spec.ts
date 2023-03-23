import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AutoRefreshComponent } from './auto-refresh.component';

describe('AutoRefreshComponent', () => {
  let component: AutoRefreshComponent;
  let fixture: ComponentFixture<AutoRefreshComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoRefreshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
