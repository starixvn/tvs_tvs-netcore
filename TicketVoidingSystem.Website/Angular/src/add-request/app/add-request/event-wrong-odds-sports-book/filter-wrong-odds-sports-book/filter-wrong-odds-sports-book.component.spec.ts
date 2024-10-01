import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { ValidationService } from '../services/validation.service';
import { FilterWrongOddsSportsBookComponent } from './filter-wrong-odds-sports-book.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterWrongOddsSportsBookModel: FilterWrongOddsSportsBookModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate,
    correctOdds: '1.5',
    filterOddsType: '1',
    fromOdds: '1.5',
    liveIndicator: 1,
    oddsValue: '1.5',
    toOdds: '1.5',
  };
}

describe('FilterWrongOddsSportsBookComponent', () => {
  @NgModule({
    declarations: [
      FilterWrongOddsSportsBookComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
      ValidationService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterWrongOddsSportsBookComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterWrongOddsSportsBookComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterWrongOddsSportsBookComponent init should match snapshot', async () => {
    const component = new FilterWrongOddsSportsBookComponent(null, null);
    component.filterWrongOddsSportsBookModel = Helper.fakeFilterWrongOddsSportsBookModel;

    expect(component).toMatchSnapshot();
  });

  it('#changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterWrongOddsSportsBookComponent(null, null);
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#emitRefreshEvent should emit #refreshEvent', async () => {
    const component = new FilterWrongOddsSportsBookComponent(null, null);
    component.refreshEvent.emit = jest.fn();
    component.emitRefreshEvent();

    expect(component.refreshEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isValidDateTime should return true', async () => {
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => true);
    validationService.isValidFilterWrongOddsSportsBook = jest.fn().mockImplementation(() => true);
    const component = new FilterWrongOddsSportsBookComponent(null, validationService);
    component.filterWrongOddsSportsBookModel = Helper.fakeFilterWrongOddsSportsBookModel;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);

    const result = component.isValidity();

    expect(result).toBe(true);
  });

  it('#isValidMultipleOdds should return false', async () => {
    const component = new FilterWrongOddsSportsBookComponent(null, null);
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    const actual = component.isValidMultipleOdds('1aa@', 'test');

    expect(actual).toBeFalsy();
  });

  it('#isValidMultipleOdds should return true', async () => {
    const validationService = new ValidationService();
    validationService.isValidOddsValueHaveNotZero = jest.fn().mockImplementation(() => true);
    const component = new FilterWrongOddsSportsBookComponent(null, validationService);
    const actual = component.isValidMultipleOdds('1&2', 'test');

    expect(actual).toBeTruthy();
  });

  it('#isValidSingleOdds should return false', async () => {
    const component = new FilterWrongOddsSportsBookComponent(null, null);
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    const actual = component.isValidSingleOdds('a', 'test');

    expect(actual).toBeFalsy();
  });

  it('#isValidSingleOdds should return true', async () => {
    const validationService = new ValidationService();
    validationService.isValidOddsValueHaveNotZero = jest.fn().mockImplementation(() => true);
    const component = new FilterWrongOddsSportsBookComponent(null, validationService);
    const actual = component.isValidSingleOdds('2', 'test');

    expect(actual).toBeTruthy();
  });

  it('#isCorrectFormatMultipleDecimal should return false', async () => {
    const component = new FilterWrongOddsSportsBookComponent(null, null);
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    const actual = component.isCorrectFormatMultipleDecimal('a', 'test');

    expect(actual).toBeFalsy();
  });

  it('#isCorrectFormatMultipleDecimal should return true', async () => {
    const component = new FilterWrongOddsSportsBookComponent(null, null);
    component.tooltip = new Tooltip();
    const actual = component.isCorrectFormatMultipleDecimal('1', 'test');

    expect(actual).toBeTruthy();
  });

  it('#setFilterOddsType should update filter model', async () => {
    const component = new FilterWrongOddsSportsBookComponent(null, null);
    component.filterWrongOddsSportsBookModel = new FilterWrongOddsSportsBookModel();
    component.setFilterOddsType('value');

    expect(component.filterWrongOddsSportsBookModel.filterOddsType).toBe('value');
  });
});