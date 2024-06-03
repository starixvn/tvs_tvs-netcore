import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWrongMarketOfferedComponent } from './event-wrong-market-offered.component';

describe('EventWrongMarkedOfferredComponent', () => {
  let component: EventWrongMarketOfferedComponent;
  let fixture: ComponentFixture<EventWrongMarketOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWrongMarketOfferedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWrongMarketOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
