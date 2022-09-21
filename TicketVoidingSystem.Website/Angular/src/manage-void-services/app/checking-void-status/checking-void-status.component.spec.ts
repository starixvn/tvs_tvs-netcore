import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingVoidStatusComponent } from './checking-void-status.component';

describe('CheckingVoidStatusComponent', () => {
  let component: CheckingVoidStatusComponent;
  let fixture: ComponentFixture<CheckingVoidStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckingVoidStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingVoidStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
