import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BetTypesComponent } from './bettypes.component';
import { FormsModule } from '@angular/forms';
import { ToolTipModule } from '../../modules/tooltip/tooltip.module';
import { BetTypesModel, BetTypeModel } from './bettypes.model';
import { Product } from '../../constants/config';
import { Tooltip } from '../../modules/tooltip/tooltip.model';
import { TEXT } from '../../constants/text';

describe('BetTypesComponent', () => {
  let component: BetTypesComponent;
  let fixture: ComponentFixture<BetTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BetTypesComponent ],
      imports: [
        FormsModule,
        ToolTipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetTypesComponent);
    component = fixture.componentInstance;
  });

  it('ngOnChanges when BetTypesModel is undefined', () => {
    // Arrange
    spyOn(component, 'changeIsShow').and.callThrough();
    component.model = undefined;
    // Action and Asert
    component.ngOnChanges({});
    expect(component.display).toBe(false);
  });

  it('ngOnChanges when BetTypesModel have data', () => {
    // Arrange
    spyOn(component, 'changeIsShow').and.callThrough();
    component.model = new BetTypesModel([], false);
    spyOn(component.model, 'checkDisplay').and.returnValue(true);
    component.product = Product.NUMBER_GAME;
    // Action and Asert
    component.ngOnChanges({});
    expect(component.display).toBe(true);
  });

  it('Change IsShow', () => {
    // Arrange
    component.model = new BetTypesModel([new BetTypeModel('2702', '1H 1X2', false, 5, true)], false);
    // Action and Asert
    component.changeIsShow();
    expect(component.model.isChecked).toBe(true);
  });

  it('Validate', () => {
    // Arrange
    component.model = new BetTypesModel([new BetTypeModel('2702', '1H 1X2', false, 5, true)], false);
    spyOn(component.model, 'getCheckedBetTypes').and.returnValue([]);
    component.tooltip = new Tooltip();
    spyOn(component.tooltip, 'display');
    // Action and Asert
    component.validate();
    expect(component.tooltip.display).toHaveBeenCalledWith('checkbox-all-bettypes', TEXT.NO_CHECKED_BETTYPE);
  });
});
