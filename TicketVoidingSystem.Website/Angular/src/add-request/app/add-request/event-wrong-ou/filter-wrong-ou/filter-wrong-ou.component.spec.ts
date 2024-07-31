import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { ValidationService } from '../services/validation.service';
import { FilterWrongOuComponent } from './filter-wrong-ou.component';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeFilterWrongOuModel: FilterWrongOuModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    actualMarket: '1',
    wrongMarket: '1',
    liveIndicator: 1
  };
}

describe('FilterWithHdpComponent', () => {

  beforeEach(() => {
  });

  it('#getDurationTime should return -', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);

    const result = component.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when have not fromTimeComponent', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);
    component.fromTimeComponent = null;

    const result = component.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when have not toTimeComponent', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = null;

    const result = component.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when toTimeComponent false', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);

    const result = component.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return 4m11s', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.filterWrongOuModel = Helper.fakeFilterWrongOuModel;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.filterWrongOuModel.filterFromTransTime = '2021/11/10 01:01:00.000 AM';
    component.filterWrongOuModel.filterToTransTime = '2021/11/10 01:05:11.000 AM';

    const result = component.getDurationTime();

    expect(result).toBe('4m11s');
  });

  it('#isValid should return true when isFilterByTransTime', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component['isValidDateTime'] = jest.fn().mockImplementation(() => true);
    component['isValidHdp'] = jest.fn().mockImplementation(() => true);
    component['isValidLiveIndicator'] = jest.fn().mockImplementation(() => true);

    const result = component.isValid();

    expect(result).toBe(true);
  });

  it('#isValidDateTime should return true', async () => {
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => true);
    const component = new FilterWrongOuComponent(null, validationService);
    component.filterWrongOuModel = Helper.fakeFilterWrongOuModel;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);

    const result = component['isValidDateTime']();

    expect(result).toBe(true);
  });

  it('#changeFilterBy should update filterWrongOuModel.filterToTransTime', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.filterWrongOuModel = Helper.fakeFilterWrongOuModel;
    component.changeFilterBy();

    expect(component.filterWrongOuModel.filterFromTransTime).toBeDefined();
    expect(component.filterWrongOuModel.filterFromTransTime).toBeDefined();
  });

  it('#changeFilterBy should update filterWrongOuModel.filterToTransTime', async () => {
    const filterWrongOuModel = Helper.fakeFilterWrongOuModel;
    filterWrongOuModel.filterFromTransTime = Helper.fakeFromDateTime;
    filterWrongOuModel.filterToTransTime = null;
    const component = new FilterWrongOuComponent(null, null);
    component.filterWrongOuModel = filterWrongOuModel;

    component.changeFilterBy();

    expect(component.filterWrongOuModel.filterFromTransTime).toBeDefined();
    expect(component.filterWrongOuModel.filterFromTransTime).toBeDefined();
  });

  it('#changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isValidHdp should return true', async () => {
    const validationService = new ValidationService();
    validationService.isValidHdp = jest.fn().mockImplementation(() => true);
    const component = new FilterWrongOuComponent(null, validationService);

    const result = component['isValidHdp']();

    expect(validationService.isValidHdp).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('#emitSearchEvent should emit #searchTicketEvent', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.filterWrongOuModel = Helper.fakeFilterWrongOuModel;
    component.searchTicketEvent.emit = jest.fn();
    component['emitSearchEvent']();

    expect(component.searchTicketEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#emitRefreshEvent should emit #searchTicketEvent', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.filterWrongOuModel = Helper.fakeFilterWrongOuModel;
    component.refreshEvent.emit = jest.fn();
    component['emitRefreshEvent']();

    expect(component.refreshEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isValidLiveIndicator should should return false when liveIndicator is Null', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.tooltip.display = jest.fn();
    component.filterWrongOuModel =  Helper.fakeFilterWrongOuModel;
    component.filterWrongOuModel.liveIndicator = null;

    let actual = component['isValidLiveIndicator']();

    expect(actual).toBeFalsy();
  });

  it('#isValidLiveIndicator should should return false when liveIndicator is Undefined', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.tooltip.display = jest.fn();
    component.filterWrongOuModel = Helper.fakeFilterWrongOuModel;
    component.filterWrongOuModel.liveIndicator = undefined;

    let actual = component['isValidLiveIndicator']();

    expect(actual).toBeFalsy();
  });

  it('#isValidLiveIndicator should should return true', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.tooltip.display = jest.fn();
    component.filterWrongOuModel = Helper.fakeFilterWrongOuModel;
    component.filterWrongOuModel.liveIndicator = 12;

    let actual = component['isValidLiveIndicator']();

    expect(actual).toBeTruthy();
  });

  it('#isCorrectFormatHdp should return false', async () => {
    const component = new FilterWrongOuComponent(null, null);
    component.tooltip.display = jest.fn();
    component.tooltip.display = jest.fn();
    let actual = component.isCorrectFormatHdp("111111", "");

    expect(actual).toBeFalsy;
  });
});