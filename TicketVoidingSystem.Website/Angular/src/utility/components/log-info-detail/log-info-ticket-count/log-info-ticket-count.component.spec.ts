import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInfoTicketCountComponent } from './log-info-ticket-count.component';

describe('LogInfoDetailComponent', () => {
  let component: LogInfoTicketCountComponent;
  let fixture: ComponentFixture<LogInfoTicketCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInfoTicketCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInfoTicketCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
