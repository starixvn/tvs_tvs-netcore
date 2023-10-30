import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEkoComponent } from './confirm-eko.component';

describe('ConfirmEkoComponent', () => {
  let component: ConfirmEkoComponent;
  let fixture: ComponentFixture<ConfirmEkoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEkoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEkoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
