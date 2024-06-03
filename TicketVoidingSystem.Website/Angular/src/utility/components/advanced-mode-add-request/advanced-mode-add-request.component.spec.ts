import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedModeAddRequestComponent } from './advanced-mode-add-request.component';

describe('AdvancedModeAddRequestComponent', () => {
  let component: AdvancedModeAddRequestComponent;
  let fixture: ComponentFixture<AdvancedModeAddRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedModeAddRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedModeAddRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
