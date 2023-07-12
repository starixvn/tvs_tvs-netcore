import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { ValidationService } from '../services/validation.service';
import { FilterWrongOddsComponent } from './filter-wrong-odds.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterWrongOddsModel: FilterWrongOddsModel = {
    filterFromTransTime: Helper.fromDate,
    filterToTransTime: Helper.toDate,
    betTeam: 'h',
    correctOdds: '1',
    favoriteValue: '1',
    filterFavoriteType: 'h',
    filterOddsType: 'value',
    filterOuType: 'h',
    fromOdds: '1',
    liveIndicator: 1,
    oddsValue: '1',
    ouValue: '1',
    toOdds: '1'
  };
}

describe('FilterWrongOddsComponent', () => {
  @NgModule({
    declarations: [
      DateFullTimeNewComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      NgSelectModule,
      ToolTipModule
    ],
    providers: [
      ValidationService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterWrongOddsComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterWrongOddsComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterWithHdpComponent init should match snapshot', async () => {
    const component = new FilterWrongOddsComponent(null, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;

    expect(component).toMatchSnapshot();
  });

  it('#isValid should return true', async () => {
    const component = new FilterWrongOddsComponent(null, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    component['isValidDateTime'] = jest.fn().mockImplementation(() => true);
    component['isValidFilter'] = jest.fn().mockImplementation(() => true);
    const actual = component.isValid();

    expect(actual).toBeTruthy();
  });

  it('#changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterWrongOddsComponent(null, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isValidFilter should return true', async () => {
    const mockIsValidFilterWrongOdds = jest.fn().mockImplementation(() => true);
    const validationService = new ValidationService();
    validationService.isValidFilterWrongOdds = mockIsValidFilterWrongOdds;
    const component = new FilterWrongOddsComponent(null, validationService);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    const actual = component['isValidFilter']();

    expect(mockIsValidFilterWrongOdds).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#isValidDateTime should return true', async () => {
    const mockIsFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => true);
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = mockIsFromTimeSameOrBeforeToTime;
    const component = new FilterWrongOddsComponent(null, validationService);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    const actual = component['isValidDateTime']();

    expect(mockIsFromTimeSameOrBeforeToTime).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#isSubTypeOuOr1stOu should return true', async () => {
    const mockIsSubTypeOuOr1stOu = jest.fn().mockImplementation(() => true);
    const validationService = new ValidationService();
    validationService.isSubTypeOuOr1stOu = mockIsSubTypeOuOr1stOu;
    const component = new FilterWrongOddsComponent(null, validationService);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;

    const actual = component['isSubTypeOuOr1stOu']();

    expect(mockIsSubTypeOuOr1stOu).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#setFilterOddsType should return true', async () => {
    const component = new FilterWrongOddsComponent(null, null);
    component.filterWrongOddsModel = new FilterWrongOddsModel();

    component.setFilterOddsType('value');

    expect(component.filterWrongOddsModel.filterOddsType).toBe('value');
  });

  it('#isValidSingleOdds should return true', async () => {
    const validationService = new ValidationService();
    validationService.isValidOddsValueHaveNotZero = jest.fn().mockImplementation(() => true);
    const component = new FilterWrongOddsComponent(null, validationService);
    component.filterWrongOddsModel = new FilterWrongOddsModel();

    const actual = component.isValidSingleOdds('1', '');

    expect(actual).toBeTruthy();
  });

  it('#isValidSingleOdds should return false', async () => {
    const component = new FilterWrongOddsComponent(null, null);
    component.filterWrongOddsModel = new FilterWrongOddsModel();
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();

    const actual = component.isValidSingleOdds('1a', '');

    expect(actual).toBeFalsy();
  });

  it('#isValidMultipleOdds should return true', async () => {
    const validationService = new ValidationService();
    validationService.isValidOddsValueHaveNotZero = jest.fn().mockImplementation(() => true);
    const component = new FilterWrongOddsComponent(null, validationService);
    component.filterWrongOddsModel = new FilterWrongOddsModel();

    const actual = component.isValidMultipleOdds('1&2', '');

    expect(actual).toBeTruthy();
  });

  it('#isValidMultipleOdds should return false', async () => {
    const component = new FilterWrongOddsComponent(null, null);
    component.filterWrongOddsModel = new FilterWrongOddsModel();
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();

    const actual = component.isValidMultipleOdds('1&2aa', '');

    expect(actual).toBeFalsy();
  });

  it('#isCorrectFormatMultipleDecimal should return true', async () => {
    const component = new FilterWrongOddsComponent(null, null);
    component.filterWrongOddsModel = new FilterWrongOddsModel();

    const actual = component.isCorrectFormatMultipleDecimal('1&2', '');

    expect(actual).toBeTruthy();
  });

  it('#getDurationTime should return expected', async () => {
    const component = new FilterWrongOddsComponent(null, null);
    component.filterWrongOddsModel = Helper.fakeFilterWrongOddsModel;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);

    const actual = component.getDurationTime();

    expect(actual).toBe('4320m0s');
  });
});