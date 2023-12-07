import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { ItemsSelect } from '../../../../../../utility/components/multiple-selection/items-select';
import { MultipleSelectionModule } from '../../../../../../utility/components/multiple-selection/multiple-selection.module';
import { ToolTipModule } from '../../../../../../utility/components/tooltip/tooltip.module';
import { FilterNotParticipateModel } from '../../models/filter-not-participate.model';
import { FilterNotParticipateService } from '../../services/filter-not-participate.service';
import { ValidationService } from '../../services/validation.service';
import { FilterNotParticipateItemComponent } from './filter-not-participate-item.component';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterNotParticipateModel: FilterNotParticipateModel = {
    playerId: 1,
    betTypeIds: ['1', '2'],
    betTypeMultipleSelection: null
  };
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
});