import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInfoWrongMarketOfferedComponent } from './log-info-wrong-market-offered.component';

describe('LogInfoWrongMarketOfferedComponent', () => {
  let component: LogInfoWrongMarketOfferedComponent;
  let fixture: ComponentFixture<LogInfoWrongMarketOfferedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInfoWrongMarketOfferedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInfoWrongMarketOfferedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
