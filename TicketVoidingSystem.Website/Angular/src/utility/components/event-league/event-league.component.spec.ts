import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLeagueComponent } from './event-league.component';

describe('EventLeagueComponent', () => {
  let component: EventLeagueComponent;
  let fixture: ComponentFixture<EventLeagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventLeagueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
