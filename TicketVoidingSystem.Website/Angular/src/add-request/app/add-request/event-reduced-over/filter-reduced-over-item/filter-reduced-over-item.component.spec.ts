import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { ItemsSelect } from '../../../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { MultipleSelectionModule } from '../../../../../utility/components/multiple-selection/multiple-selection.module';
import { NgSelectMixtureModel } from '../../../../../utility/components/ng-select-mixture/ng-select-mixture.model';
import { NgSelectMixtureModule } from '../../../../../utility/components/ng-select-mixture/ng-select-mixture.module';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { FilterReducedOverService } from '../services/filter-reduced-over.service';
import { ValidationService } from '../services/validation.service';
import { FilterReducedOverItemComponent } from './filter-reduced-over-item.component';
import { PrimitivePropertyItem } from './filter-reduced-over-item.model';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterReducedOverModel: FilterReducedOverModel = {
    betTypeIds: [],
    playerIds: [],
    live: true,
    nonLive: true,
    runs: '',
    wicketOver: '',
    betTypeNgSelectMixtureModel: new NgSelectMixtureModel(),
    playerMultipleSelection: new MultipleSelection()
  };
  static readonly fakeReducedOverBetTypes: ReducedOverBetType[] = [
    {
      betTypeId: 1,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    },
    {
      betTypeId: 2,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    }
  ];
  static readonly fakePlayers: OddsInfo[] = [
    {
      betChoice: '',
      betTypeId: 1,
      oddsId: '1',
      playerId: 1,
      playerName: '',
      playNamesChineseSimplified: '',
      playNamesChineseTraditional: ''
    }
  ];
  static readonly fakeItemsSelect: ItemsSelect[] = [
    {
      checked: true,
      countChilds: 1,
      enable: true,
      expanded: false,
      id: 1,
      items: [],
      text: '',
      value: ''
    } as ItemsSelect
  ];
}

describe('FilterReducedOverItemComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      NgSelectModule,
      NgSelectMixtureModule,
      MultipleSelectionModule,
      ToolTipModule
    ],
    providers: [
      ValidationService,
      FilterReducedOverService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterReducedOverItemComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterReducedOverItemComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterReducedOverItemComponent init should match snapshot', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.model = Helper.fakeFilterReducedOverModel;

    expect(component).toMatchSnapshot();
  });

  it('FilterReducedOverItemComponent should call updateStatusControl', async () => {
    Helper.fakeItemsSelect[0].checkBySelectedItem = jest.fn();
    Helper.fakeItemsSelect[0].allChildIsChecked = jest.fn();
    Helper.fakeItemsSelect[0].countChildsChecked = jest.fn();
    Helper.fakeItemsSelect[0].getTextChildsChecked = jest.fn().mockReturnValue('');

    const { instance } = await shallow
    .mock(FilterReducedOverService, { renderPlayer: jest.fn().mockReturnValue(Helper.fakeItemsSelect)})
    .render({
      bind: {
        model: Helper.fakeFilterReducedOverModel,
        originalPlayers: Helper.fakePlayers,
        originalReducedOverBetTypes: Helper.fakeReducedOverBetTypes
      }
    });
    instance.model.betTypeIds = ['1'];
    instance.primitivePropertyItem = new PrimitivePropertyItem();
    instance.isVoided = true;
    instance['updateStatusControl'] = jest.fn();
    instance.ngOnInit();

    expect(instance['updateStatusControl']).toHaveBeenCalledTimes(1);
  });

  it('FilterReducedOverItemComponent should call #updateCheckedBetTypes', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: Helper.fakeFilterReducedOverModel,
        originalPlayers: [],
        originalReducedOverBetTypes: []
      }
    });
    instance.primitivePropertyItem = new PrimitivePropertyItem();
    instance.isVoided = false;
    instance.updateCheckedBetTypes = jest.fn();
    instance.ngOnInit();

    expect(instance.updateCheckedBetTypes).toHaveBeenCalledTimes(1);
  });

  it('changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('isValid should returen true', async () => {
    const validationService = new ValidationService();
    validationService.isAllFieldsHaveValue = jest.fn().mockReturnValue(true);
    const component = new FilterReducedOverItemComponent(null, validationService, null);

    const actual = component.isValid();

    expect(actual).toBeTruthy();
  });

  it('isValidSingleDecimalRuns should returen true', async () => {
    const validationService = new ValidationService();
    validationService.isValidSingleDecimalRuns = jest.fn().mockReturnValue(true);
    const component = new FilterReducedOverItemComponent(null, validationService, null);
    const actual = component.isValidSingleDecimalRuns(null, null);

    expect(actual).toBeTruthy();
  });

  it('isValidSingleDecimalWicketOver should returen true', async () => {
    const validationService = new ValidationService();
    validationService.isValidOnlyNumberWicketOver = jest.fn().mockReturnValue(true);
    const component = new FilterReducedOverItemComponent(null, validationService, null);
    const actual = component.isValidOnlyNumberWicketOver(null, null);

    expect(actual).toBeTruthy();
  });

  it('updateCheckedPlayers should update value to model', async () => {
    const checkedPlayerIds = ['1', '2'];
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.model = new FilterReducedOverModel();
    component.updateCheckedPlayers(checkedPlayerIds);

    expect(component.model.playerIds).toEqual(checkedPlayerIds);
  });

  it('addBetTypeItem should emit #addItemEvent', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.isVoided = false;
    component.addItemEvent.emit = jest.fn();
    component.addBetTypeItem();

    expect(component.addItemEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('addBetTypeItem should not emit #addItemEvent', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.isVoided = true;
    component.addItemEvent.emit = jest.fn();
    component.addBetTypeItem();

    expect(component.addItemEvent.emit).toHaveBeenCalledTimes(0);
  });

  it('removeBetTypeItem should emit #removeItemEvent', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.isVoided = false;
    component.removeItemEvent.emit = jest.fn();
    component.removeBetTypeItem(1);

    expect(component.removeItemEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('removeBetTypeItem should not emit #removeItemEvent', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.isVoided = true;
    component.removeItemEvent.emit = jest.fn();
    component.removeBetTypeItem(1);

    expect(component.removeItemEvent.emit).toHaveBeenCalledTimes(0);
  });

  it('resetValue should set value to null', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.model = new FilterReducedOverModel();
    component.model.betTypeIds = ['1'];
    component.resetValue([]);

    expect(component.model.wicketOver).toBeNull();
    expect(component.model.runs).toBeNull();
    expect(component.model.playerIds).toEqual([]);
    expect(component.model.live).toBeFalsy();
    expect(component.model.nonLive).toBeFalsy();

  });

  it('resetValue should not set value to null', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.model = new FilterReducedOverModel();
    component.model.betTypeIds = ['1'];
    component.resetValue([]);

    expect(component.model.betTypeIds).toEqual(['1']);
  });

  it('renderPlayerByBetType should update playerMultipleSelection.items to []', async () => {
    const component = new FilterReducedOverItemComponent(null, null, null);
    component.originalReducedOverBetTypes = _.cloneDeep(Helper.fakeReducedOverBetTypes);
    component.originalReducedOverBetTypes.forEach(x => x.isHasPlayer = false);
    component.originalPlayers = Helper.fakePlayers;
    component.model = new FilterReducedOverModel();
    component.model.playerMultipleSelection = new MultipleSelection();
    component['renderPlayerByBetType'](['1']);

    expect(component.model.playerMultipleSelection.items).toEqual([]);
  });
});