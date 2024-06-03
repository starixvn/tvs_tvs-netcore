import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedModeComponent } from './advanced-mode.component';

describe('AdvancedModeComponent', () => {
  let component: AdvancedModeComponent;
  let fixture: ComponentFixture<AdvancedModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
