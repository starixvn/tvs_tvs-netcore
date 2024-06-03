import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInfoMessageComponent } from './log-info-message.component';

describe('LogInfoMessageComponent', () => {
  let component: LogInfoMessageComponent;
  let fixture: ComponentFixture<LogInfoMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInfoMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInfoMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
