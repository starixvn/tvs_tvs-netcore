import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidingHistoryComponent } from './voiding-history.component';

describe('VoidingHistoryComponent', () => {
  let component: VoidingHistoryComponent;
  let fixture: ComponentFixture<VoidingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidingHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
