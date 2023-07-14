import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDuplicateTicketsComponent } from './event-duplicate-tickets.component';

describe('EventDuplicateTicketsComponent', () => {
  let component: EventDuplicateTicketsComponent;
  let fixture: ComponentFixture<EventDuplicateTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDuplicateTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDuplicateTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
