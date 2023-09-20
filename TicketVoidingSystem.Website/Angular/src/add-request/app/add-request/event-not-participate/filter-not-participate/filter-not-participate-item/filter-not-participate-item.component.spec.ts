import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { ItemsSelect } from '../../../../../../utility/components/multiple-selection/items-select';
import { MultipleSelection } from '../../../../../../utility/components/multiple-selection/multiple-selection';
import { MultipleSelectionModule } from '../../../../../../utility/components/multiple-selection/multiple-selection.module';
import { ToolTipModule } from '../../../../../../utility/components/tooltip/tooltip.module';
import { FilterNotParticipateModel } from '../../models/filter-not-participate.model';
import { NotParticipateBetType } from '../../models/not-participate-bet-type.model';
import { FilterNotParticipateService } from '../../services/filter-not-participate.service';
import { ValidationService } from '../../services/validation.service';
import { FilterNotParticipateItemComponent } from './filter-not-participate-item.component';
import { PrimitivePropertyItem } from './filter-not-participate-item.model';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterNotParticipateModel: FilterNotParticipateModel = {
    betTypeId: 1,
    playerIds: ['1', '2'],
    playerMultipleSelection: new MultipleSelection()
  };
  static readonly fakeNotParticipateBetTypes: NotParticipateBetType[] = [
    {
      betTypeId: 1,
      betTypeName: '1',
      disabled: false
    },
    {
      betTypeId: 2,
      betTypeName: '2',
      disabled: false
    }
  ];
  static readonly fakePlayers: OddsInfo[] = [
    {
      betChoice: '',
      betTypeId: '1',
      oddsId: '1',
      playerId: '1',
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

describe('FilterNotParticipateItemComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      NgSelectModule,
      MultipleSelectionModule,
      ToolTipModule
    ],
    providers: [
      ValidationService,
      FilterNotParticipateService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterNotParticipateItemComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterNotParticipateItemComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterNotParticipateItemComponent init should match snapshot', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.model = Helper.fakeFilterNotParticipateModel;

    expect(component).toMatchSnapshot();
  });

  it('FilterNotParticipateItemComponent should call #updateCheckedBetTypes', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.originalNotParticipateBetTypes = Helper.fakeNotParticipateBetTypes;
    component.model = Helper.fakeFilterNotParticipateModel;
    component.updateCheckedBetTypes = jest.fn();
    component.ngOnInit();

    expect(component.updateCheckedBetTypes).toHaveBeenCalledTimes(1);
  });

  it('changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('isValid should returen true', async () => {
    const validationService = new ValidationService();
    validationService.isAllFieldsHaveValue = jest.fn().mockReturnValue(true);
    const component = new FilterNotParticipateItemComponent(null, validationService, null);

    const actual = component.isValid();

    expect(actual).toBeTruthy();
  });

  it('updateCheckedPlayers should update value to model', async () => {
    const checkedPlayerIds = ['1', '2'];
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.model = new FilterNotParticipateModel();
    component.updateCheckedPlayers(checkedPlayerIds);

    expect(component.model.playerIds).toEqual(checkedPlayerIds);
  });

  it('addBetTypeItem should emit #addItemEvent', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.isVoided = false;
    component.addItemEvent.emit = jest.fn();
    component.addBetTypeItem();

    expect(component.addItemEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('addBetTypeItem should not emit #addItemEvent', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.isVoided = true;
    component.addItemEvent.emit = jest.fn();
    component.addBetTypeItem();

    expect(component.addItemEvent.emit).toHaveBeenCalledTimes(0);
  });

  it('removeBetTypeItem should emit #removeItemEvent', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.isVoided = false;
    component.removeItemEvent.emit = jest.fn();
    component.removeBetTypeItem(1);

    expect(component.removeItemEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('removeBetTypeItem should not emit #removeItemEvent', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.isVoided = true;
    component.removeItemEvent.emit = jest.fn();
    component.removeBetTypeItem(1);

    expect(component.removeItemEvent.emit).toHaveBeenCalledTimes(0);
  });

  it('renderPlayerByBetType should update playerMultipleSelection.items to []', async () => {
    Helper.fakeItemsSelect.forEach(x => {
      x.checkBySelectedItem = jest.fn();
      x.allChildIsChecked = jest.fn();
    })
    const filterService = new FilterNotParticipateService(null, null);
    filterService.renderPlayer = jest.fn().mockReturnValue(Helper.fakeItemsSelect);
    const component = new FilterNotParticipateItemComponent(null, null, filterService);
    component.originalNotParticipateBetTypes = _.cloneDeep(Helper.fakeNotParticipateBetTypes);
    component.originalPlayers = Helper.fakePlayers;
    component.model = new FilterNotParticipateModel();
    component.model.playerMultipleSelection = new MultipleSelection();
    component.model.playerMultipleSelection.getDisplayedItems = jest.fn();
    component['renderPlayerByBetType'](1);

    expect(component.model.playerMultipleSelection.items).toEqual(Helper.fakeItemsSelect);
  });

  it('resetValue should update playerIds to []', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.model = Helper.fakeFilterNotParticipateModel;
    component.model.betTypeId = 2;
    component['resetValue'](1);

    expect(component.model.playerIds).toEqual([]);
  });

  it('resetValue should not update playerIds to []', async () => {
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.model = Helper.fakeFilterNotParticipateModel;
    component.model.betTypeId = 2;
    component.model.playerIds = ['1'];
    component['resetValue'](2);

    expect(component.model.playerIds).toEqual(['1']);
  });

  it('updateCheckedBetTypes should emit #changeBetTypeEvent', async () => {
    const selectedBetType = new NotParticipateBetType();
    const component = new FilterNotParticipateItemComponent(null, null, null);
    component.model = Helper.fakeFilterNotParticipateModel;
    component.primitivePropertyItem = new PrimitivePropertyItem();
    component.changeBetTypeEvent.emit = jest.fn();
    component['renderPlayerByBetType'] = jest.fn();
    component['resetValue'] = jest.fn();

    component.updateCheckedBetTypes(selectedBetType);

    expect(component.changeBetTypeEvent.emit).toHaveBeenCalledTimes(1);
    expect(component['renderPlayerByBetType']).toHaveBeenCalledWith(Helper.fakeFilterNotParticipateModel.betTypeId);
    expect(component['resetValue']).toHaveBeenCalledWith(selectedBetType.betTypeId);
    expect(component.primitivePropertyItem.isDisabledPlayer).toBeFalsy();
  });
});