import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { CheckedBetType } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GroupBetType, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { LogInfoComponent } from '../log-info/log-info.component';
import { FilterComponent } from './filter.component';

class Helper {
  static readonly searchButtonSelector = 'input[type=submit]';

  static readonly fakeBettypeList: BetType[] = [
    new BetType(15, '1H 1X2', false, 0, true),
    new BetType(4, 'Correct Score', false, 0, true),
    new BetType(216, 'Goal Scorer - Anytime', false, 0, true)
  ];

  static readonly fakeCheckedBetTypeList: CheckedBetType[] = [
    {
      betTeam: 'All',
      set: 'All',
      game: 'All',
      betOption: '',
      value: '',
      goal: '',
      id: 7,
      valueHdp1: '',
      valueHdp2: '',
      oddsSpread: '',
      oddsId: '',
      transdesc: ''
    },
    {
      betTeam: '',
      set: '',
      game: '',
      betOption: '1-0',
      value: 'All',
      goal: '',
      id: 8,
      valueHdp1: '',
      valueHdp2: '',
      oddsSpread: '',
      oddsId: '',
      transdesc: ''
    },
    {
      betTeam: '',
      set: '',
      game: '',
      betOption: '',
      value: '',
      goal: 'All',
      id: 10,
      valueHdp1: '',
      valueHdp2: '',
      oddsSpread: '',
      oddsId: '',
      transdesc: ''
    }
  ];

  static getFakeGroupBetTypesModel(): GroupBetTypesModel {
    const groupBettype: GroupBetType[] = [
      new GroupBetType('1H', [new BetType(15, '1H 1X2', false, 0, true)], true),
      new GroupBetType('FT', [new BetType(4, 'Correct Score', false, 0, true)], true),
      new GroupBetType('FT', [new BetType(216, 'Goal Scorer - Anytime', false, 0, true)], true),
    ];
    const groupBetTypesModel = new GroupBetTypesModel(groupBettype, true);
    return groupBetTypesModel;
  }
}

describe('DangerAcceptedFilterComponent', () => {
  @NgModule({
    declarations: [
      GroupBetTypesComponent,
      AdvancedModeComponent,
      LogInfoComponent
    ],
    imports: [
      FormsModule,
      NgSelectModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterComponent, AppModuleTest);
  });

  it('#changeBetTypes should return expected allBetTypes', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.changeBetTypes(Helper.fakeBettypeList);

    // Assert
    expect(instance.allBetTypes).toStrictEqual(Helper.fakeBettypeList);
  });

  it('#getBetTypeModels should emit search event with expected param', async () => {
    const { findComponent, instance } = await shallow.render();
    const groupBetTypesComponent = findComponent(GroupBetTypesComponent);
    const advancedModelComponent = findComponent(AdvancedModeComponent);
    groupBetTypesComponent.validate = jest.fn().mockImplementation(() => true);
    advancedModelComponent.validate = jest.fn().mockImplementation(() => false);
    instance.getBetTypeModels();
    expect(instance.search.emit).toHaveBeenCalled();
    expect(instance.search.emit).toHaveBeenCalledWith(null);
    instance.groupBetTypes = Helper.getFakeGroupBetTypesModel();
    instance.groupBetTypes.getValueCheckedBetTypes = jest.fn();
    instance.getBetTypeModels();
    expect(instance.search.emit).toHaveBeenCalled();
  });

  it('DangerAcceptedFilterComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#getBetTypeModels should be called when click search button', async () => {
    const { instance, find, findComponent } = await shallow.render();
    const groupBetTypesComponent = findComponent(GroupBetTypesComponent);
    const advancedModelComponent = findComponent(AdvancedModeComponent);
    groupBetTypesComponent.validate = jest.fn().mockImplementation(() => true);
    advancedModelComponent.validate = jest.fn().mockImplementation(() => true);
    advancedModelComponent.getBetTypeModels = jest.fn();
    instance.groupBetTypes = new GroupBetTypesModel([], false);
    const searchButtonSelector = find(Helper.searchButtonSelector);
    instance.search.emit = jest.fn();
    searchButtonSelector.triggerEventHandler('click', {});

    expect(instance.search.emit).toHaveBeenCalledTimes(1);
  });
  
  it('#ngOnChanges should update isShowSearch to true', async () => {
    const { instance } = await shallow.render();
    instance.groupBetTypes = Helper.getFakeGroupBetTypesModel();
    instance.groupBetTypes.getCheckedBetTypes = jest.fn().mockImplementation(() => [1]);
    instance.ngOnChanges();

    expect(instance.isShowSearch).toBe(true);
  });
  
  it('#ngOnChanges should update isShowSearch to false', async () => {
    const { instance } = await shallow.render();
    instance.groupBetTypes = null;
    instance.ngOnChanges();

    expect(instance.isShowSearch).toBe(false);
  });
});
