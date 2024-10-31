import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInfoOtherIssuesComponent } from './log-info-other-issues.component';

describe('LogInfoOtherIssuesComponent', () => {
  let component: LogInfoOtherIssuesComponent;
  let fixture: ComponentFixture<LogInfoOtherIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInfoOtherIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInfoOtherIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
