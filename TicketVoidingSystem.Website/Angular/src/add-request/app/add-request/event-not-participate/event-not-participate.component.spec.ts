import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventNotParticipateComponent } from './event-not-participate.component';

describe('EventNotParticipateComponent', () => {
  let component: EventNotParticipateComponent;
  let fixture: ComponentFixture<EventNotParticipateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventNotParticipateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventNotParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
