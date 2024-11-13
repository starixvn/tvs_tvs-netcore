import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlsAllBetTypesComponent } from './controls-all-bet-types.component';

describe('ControlsAllBetTypesComponent', () => {
  let component: ControlsAllBetTypesComponent;
  let fixture: ComponentFixture<ControlsAllBetTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlsAllBetTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsAllBetTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
