import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AfterVoidStatusComponent } from './after-void-status.component';

describe('AfterVoidStatusComponent', () => {
  let component: AfterVoidStatusComponent;
  let fixture: ComponentFixture<AfterVoidStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterVoidStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterVoidStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
