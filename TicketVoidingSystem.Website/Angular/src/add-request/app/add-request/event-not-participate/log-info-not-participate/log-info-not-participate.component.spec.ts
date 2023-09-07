import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInfoNotParticipateComponent } from './log-info-not-participate.component';

describe('LogInfoNotParticipateComponent', () => {
  let component: LogInfoNotParticipateComponent;
  let fixture: ComponentFixture<LogInfoNotParticipateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInfoNotParticipateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInfoNotParticipateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
