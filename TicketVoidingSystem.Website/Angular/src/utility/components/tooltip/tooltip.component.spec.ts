import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipComponent } from './tooltip.component';
import { Tooltip } from './tooltip.model';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
  });

  it('should hide tooltip when clicking outside', () => {
    component.tooltip = {} as Tooltip;
    component.tooltip.show = true;
    component.onClick();
    expect(component.tooltip.show).toBe(false);
  });
});
