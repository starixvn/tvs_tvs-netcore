import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAffectedTicketComponent } from './account-affected-ticket.component';

describe('AccountAffectedTicketComponent', () => {
  let component: AccountAffectedTicketComponent;
  let fixture: ComponentFixture<AccountAffectedTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountAffectedTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAffectedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
