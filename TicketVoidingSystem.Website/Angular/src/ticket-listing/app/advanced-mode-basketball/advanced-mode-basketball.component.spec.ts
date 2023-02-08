import { NgModule, SimpleChange } from '@angular/core';
import { Shallow } from 'shallow-render';
import { MultipleSelectComponent } from '../../../utility/components/advanced-mode/multiple-selection/multiple-select.component';
import { MultipleSelection } from '../../../utility/components/multiple-selection/multiple-selection';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { AdvancedModeBasketballComponent } from './advanced-mode-basketball.component';

describe('AdvancedModeBasketballComponent', () => {
  @NgModule({
    declarations: [
      MultipleSelectComponent
    ],
    imports: [
      ToolTipModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AdvancedModeBasketballComponent>;

  beforeEach(() => {
    shallow = new Shallow(AdvancedModeBasketballComponent, AppModuleTest);
  });

  it('AdvancedModeBasketballComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('ngOnChanges', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const changes = {
      'checkedIds': new SimpleChange([1], [1,2], true),
    };
    instance.isShow = false;
    instance.renderSelection = jest.fn();
    const testCases = [
      { isBasketBall: true, isBadminton: false, isPHAIO5: false, expectedResult: true },
      { isBasketBall: false, isBadminton: true, isPHAIO5: false, expectedResult: true },
      { isBasketBall: false, isBadminton: false, isPHAIO5: true, expectedResult: true },
      { isBasketBall: false, isBadminton: false, isPHAIO5: false, expectedResult: false }
    ];
    // Action and Assert
    for (const item of testCases) {
      instance['isBasketball'] = jest.fn().mockImplementation(() => item.isBasketBall);
      instance['isBadminton'] = jest.fn().mockImplementation(() => item.isBadminton);
      instance['isPHAIO5'] = jest.fn().mockImplementation(() => item.isPHAIO5);
      instance.ngOnChanges(changes);
      expect(instance.renderSelection).toHaveBeenCalled();
      expect(instance.isShow).toBe(item.expectedResult);
    }
  });

  it('Is Basketball', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.checkedIds = [609];
    // Action and Assert
    const actualResult = instance['isBasketball']();
    expect(actualResult).toBe(true);
  });

  it('Is Badminton', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.checkedIds = [707];
    // Action and Assert
    const actualResult = instance['isBadminton']();
    expect(actualResult).toBe(true);
  });

  it('Is PHAIO5', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.checkedIds = [381];
    // Action and Assert
    const actualResult = instance['isPHAIO5']();
    expect(actualResult).toBe(true);
  });

  it('Render selection', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const testCases = [
      { isBasketBall: true, isBadminton: false, isPHAIO5: false, expectedResult: 'Quarter X Bet types:' },
      { isBasketBall: false, isBadminton: true, isPHAIO5: false, expectedResult: 'Game X Bet types:' },
      { isBasketBall: false, isBadminton: false, isPHAIO5: true, expectedResult: 'Round X Bet types:' }
    ];
    // Action and Assert
    for (const item of testCases) {
      instance['isBasketball'] = jest.fn().mockImplementation(() => item.isBasketBall);
      instance['isBadminton'] = jest.fn().mockImplementation(() => item.isBadminton);
      instance['isPHAIO5'] = jest.fn().mockImplementation(() => item.isPHAIO5);
      instance.renderSelection();
      expect(instance.filterName).toBe(item.expectedResult);
    }
  });

  it('Get selection', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = '';
    instance.selection = new MultipleSelection();
    const testCases = [
      { isBasketBall: true, isBadminton: false, isPHAIO5: false, selectedValue: '1,2,3', expectResult: '1,2,3' },
      { isBasketBall: true, isBadminton: false, isPHAIO5: false, selectedValue: '1,2,3,4', expectResult: 'All' },
      { isBasketBall: false, isBadminton: true, isPHAIO5: false, selectedValue: '1,2,3,4', expectResult: '1,2,3,4' },
      { isBasketBall: false, isBadminton: true, isPHAIO5: false, selectedValue: '1,2,3,4,5', expectResult: 'All' },
    ];
    // Action and Assert
    for (const item of testCases) {
      instance['isBasketball'] = jest.fn().mockImplementation(() => item.isBasketBall);
      instance['isBadminton'] = jest.fn().mockImplementation(() => item.isBadminton);
      instance['isPHAIO5'] = jest.fn().mockImplementation(() => item.isPHAIO5);
      instance.selection.getValueItems = jest.fn().mockImplementation(() => item.selectedValue);
      actualResult = instance.getSelection();
      expect(actualResult).toBe(item.expectResult);
    }
  });

  it('Validate', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    instance.tooltip = new Tooltip();
    instance.selection = new MultipleSelection();
    instance.tooltip.display = jest.fn();
    const testCases = [
      { isShow: false,  selectedValue: '1,2,3', expectedResult: true},
      { isShow: true,  selectedValue: '1,2,3', expectedResult: true},
      { isShow: true,  selectedValue: '', expectedResult: false}
    ];
    // Action and Assert
    for (const item of testCases) {
      instance.isShow = item.isShow;
      instance.selection.getValueItems = jest.fn().mockImplementation(() => item.selectedValue);
      actualResult = instance.validate();
      expect(actualResult).toBe(item.expectedResult);
    }
  });
});
