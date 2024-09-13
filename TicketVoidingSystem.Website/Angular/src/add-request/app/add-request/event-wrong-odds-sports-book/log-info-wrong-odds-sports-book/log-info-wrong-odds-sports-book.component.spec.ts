import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInfoWrongOddsSportsBookComponent } from './log-info-wrong-odds-sports-book.component';

describe('LogInfoWrongOddsSportsBookComponent', () => {
  let component: LogInfoWrongOddsSportsBookComponent;
  let fixture: ComponentFixture<LogInfoWrongOddsSportsBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInfoWrongOddsSportsBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInfoWrongOddsSportsBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
