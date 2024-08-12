import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectedTicketComponent } from './affected-ticket.component';

describe('AffectedTicketComponent', () => {
  let component: AffectedTicketComponent;
  let fixture: ComponentFixture<AffectedTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectedTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
