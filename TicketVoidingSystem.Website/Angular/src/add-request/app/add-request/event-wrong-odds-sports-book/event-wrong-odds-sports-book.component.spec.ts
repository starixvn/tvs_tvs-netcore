import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWrongOddsSportsBookComponent } from './event-wrong-odds-sports-book.component';

describe('EventWrongOddsSportsBookComponent', () => {
  let component: EventWrongOddsSportsBookComponent;
  let fixture: ComponentFixture<EventWrongOddsSportsBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWrongOddsSportsBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWrongOddsSportsBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
