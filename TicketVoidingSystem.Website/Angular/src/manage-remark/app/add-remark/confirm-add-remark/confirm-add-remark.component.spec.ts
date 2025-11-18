import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAddRemarkComponent } from './confirm-add-remark.component';

describe('ConfirmAddRemarkComponent', () => {
  let component: ConfirmAddRemarkComponent;
  let fixture: ComponentFixture<ConfirmAddRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAddRemarkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAddRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
