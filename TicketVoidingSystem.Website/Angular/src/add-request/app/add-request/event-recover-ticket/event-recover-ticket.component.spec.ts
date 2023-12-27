import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRecoverTicketComponent } from './event-recover-ticket.component';

describe('EventRecoverTicketComponent', () => {
  let component: EventRecoverTicketComponent;
  let fixture: ComponentFixture<EventRecoverTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventRecoverTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventRecoverTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
