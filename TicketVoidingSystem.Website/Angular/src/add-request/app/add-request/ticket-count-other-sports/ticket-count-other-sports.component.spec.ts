import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCountOtherSportsComponent } from './ticket-count-other-sports.component';

describe('TicketCountOtherSportsComponent', () => {
  let component: TicketCountOtherSportsComponent;
  let fixture: ComponentFixture<TicketCountOtherSportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketCountOtherSportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketCountOtherSportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
