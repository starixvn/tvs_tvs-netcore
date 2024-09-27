import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAddRequestComponent } from './confirm-add-request.component';

describe('ConfirmAddRequestComponent', () => {
  let component: ConfirmAddRequestComponent;
  let fixture: ComponentFixture<ConfirmAddRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmAddRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAddRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
