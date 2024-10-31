import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventOtherIssuesComponent } from './event-other-issues.component';

describe('EventOtherIssuesComponent', () => {
  let component: EventOtherIssuesComponent;
  let fixture: ComponentFixture<EventOtherIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventOtherIssuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventOtherIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
