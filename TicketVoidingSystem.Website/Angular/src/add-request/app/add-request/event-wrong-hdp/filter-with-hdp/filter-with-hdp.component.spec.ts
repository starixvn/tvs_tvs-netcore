import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { TeamFavorite } from '../../../../../utility/constants/config';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { ValidationService } from '../services/validation.service';
import { FilterWithHdpComponent } from './filter-with-hdp.component';
import { FilterModel } from '../../filter/filter.model';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeFilterWithHdpModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    homeFavorite: '2',
    awayFavorite: '',
    actualMarket: '1',
    hdpValue: '',
    liveIndicator: 0
  } as FilterWithHdpModel;
}

describe('FilterWithHdpComponent', () => {
  @NgModule({
    declarations: [
      DateFullTimeNewComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule
    ],
    providers: [
      ValidationService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterWithHdpComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterWithHdpComponent, AppModuleTest)
      .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => true) })
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('FilterWithHdpComponent init should match snapshot', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;

    expect(component).toMatchSnapshot();
  });

  it('#ngOnInit should call #initTeamFavorite', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component['initTeamFavorite'] = jest.fn();
    component.ngOnInit();

    expect(component['initTeamFavorite']).toBeCalledTimes(1);
  });

  it('#changeFilterBy should update filterWithHdpModel.filterToTransTime', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.changeFilterBy();

    expect(component.filterWithHdpModel.filterFromTransTime).toBeDefined();
    expect(component.filterWithHdpModel.filterFromTransTime).toBeDefined();
  });

  it('#changeFilterBy should not update new filterWithHdpModel.filterToTransTime', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.filterWithHdpModel.filterToTransTime = null;
    component.isEdit = false;
    component.changeFilterBy();

    expect(component.filterWithHdpModel.filterFromTransTime).toBe(Helper.fakeFilterWithHdpModel.filterFromTransTime);
    expect(component.filterWithHdpModel.filterToTransTime).toBe(Helper.fakeFilterWithHdpModel.filterToTransTime);
  });

  it('#changeFilterBy should update filterWithHdpModel.filterToTransTime', async () => {
    const filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    filterWithHdpModel.filterFromTransTime = Helper.fakeFromDateTime;
    filterWithHdpModel.filterToTransTime = null;
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = filterWithHdpModel;
    component.isEdit = false;

    component.changeFilterBy();

    expect(component.filterWithHdpModel.filterFromTransTime).toBeDefined();
    expect(component.filterWithHdpModel.filterFromTransTime).toBeDefined();
  });

  it('#initTeamFavorite should update teamFavorite to HOME when edit request', async () => {
    const filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    filterWithHdpModel.homeFavorite = '1213';
    filterWithHdpModel.awayFavorite = '';
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = filterWithHdpModel;
    component.isEdit = true;

    component['initTeamFavorite']();

    expect(component.teamFavorite).toBe(TeamFavorite.HOME);
  });

  it('#initTeamFavorite should update teamFavorite to AWAY when edit request', async () => {
    const filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    filterWithHdpModel.homeFavorite = null;
    filterWithHdpModel.awayFavorite = '1213';
     const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = filterWithHdpModel;
    component.isEdit = true;
    component['initTeamFavorite']();

    expect(component.teamFavorite).toBe(TeamFavorite.AWAY);
  });

  it('#initTeamFavorite should update teamFavorite to HOME when add request', async () => {
    const filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = filterWithHdpModel;
    component.isEdit = false;

    component['initTeamFavorite']();

    expect(component.teamFavorite).toBe(TeamFavorite.HOME);
  });

  it('#isCorrectFormatHdp should return false', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    let actual = component.isCorrectFormatHdp("111111", "");

    expect(actual).toBeFalsy;
  });

  it('#changeFilter should emit #changeFilterEvent', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.changeFilterEvent.emit = jest.fn();
    component.changeFilter();

    expect(component.changeFilterEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#changeTeamFavorite should call #changeFilter', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.changeFilter = jest.fn();
    [0,1].forEach(x => {
      component.changeTeamFavorite(x);

      expect(component.changeFilter).toHaveBeenCalled();
    });
  });

  it('#getDurationTime should return -', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;

    const result = component.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when have not fromTimeComponent', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.fromTimeComponent = null;

    const result = component.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when have not toTimeComponent', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = null;

    const result = component.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when toTimeComponent false', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);

    const result = component.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return 4m11s', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    component.filterWithHdpModel.filterFromTransTime = '2021/11/10 01:01:00.000 AM';
    component.filterWithHdpModel.filterToTransTime = '2021/11/10 01:05:11.000 AM';

    const result = component.getDurationTime();

    expect(result).toBe('4m11s');
  });

  it('#isValid should return true when isFilterByTransTime', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = _.cloneDeep(Helper.fakeFilterWithHdpModel);
    component.isEdit = false;
    component.getDurationTime = jest.fn();
    component['isValidDateTime'] = jest.fn().mockImplementation(() => true);
    component['isValidLiveIndicator'] = jest.fn().mockImplementation(() => true);
    component['isValidHdp'] = jest.fn().mockImplementation(() => true);

    const result = component.isValid();

    expect(result).toBe(true);
  });

  it('#isValidDateTime should return true', async () => {
    const validationService = new ValidationService();
    validationService.isFromTimeSameOrBeforeToTime = jest.fn().mockImplementation(() => true);
    const component = new FilterWithHdpComponent(null, validationService);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.getDurationTime = jest.fn();
    component.fromTimeComponent = new DateFullTimeNewComponent(null);
    component.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);
    component.toTimeComponent = new DateFullTimeNewComponent(null);
    component.toTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);

    const result = component['isValidDateTime']();

    expect(result).toBe(true);
  });

  it('#isValidHdp should return true when isSubTypeWrongHdpOrWrong1stHdp true', async () => {
    const filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    filterWithHdpModel.hdpValue = '';
    const validationService = new ValidationService();
    validationService.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp = jest.fn().mockImplementation(() => true);
    const component = new FilterWithHdpComponent(null, validationService);
    component.filterWithHdpModel = filterWithHdpModel;
    component.isEdit = false;
    component.getDurationTime = jest.fn();
    component.isSubTypeWrongHdpOrWrong1stHdp = jest.fn().mockImplementation(() => true);

    const result = component['isValidHdp']();

    expect(component.isSubTypeWrongHdpOrWrong1stHdp).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('#isValidHdp should return true when isSubTypeWrongHdpOrWrong1stHdp false', async () => {
    const filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    filterWithHdpModel.hdpValue = '1';
    const validationService = new ValidationService();
    validationService.isValidHdpWithSubTypeHomeAwayVirtualHedReverse = jest.fn().mockImplementation(() => true);
    const component = new FilterWithHdpComponent(null, validationService);
    component.filterWithHdpModel = filterWithHdpModel;
    component.isEdit = false;
    component.isSubTypeWrongHdpOrWrong1stHdp = jest.fn().mockImplementation(() => false);

    const result = component['isValidHdp']();

    expect(component.isSubTypeWrongHdpOrWrong1stHdp).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('#emitSearchEvent should emit #searchTicketEvent', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.searchTicketEvent.emit = jest.fn();

    component['emitSearchEvent']();

    expect(component.searchTicketEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#emitRefreshEvent should emit #searchTicketEvent', async () => {
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = Helper.fakeFilterWithHdpModel;
    component.isEdit = false;
    component.getDurationTime = jest.fn();
    component.refreshEvent.emit = jest.fn();
    component['emitRefreshEvent']();

    expect(component.refreshEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isSubTypeWrongHdpOrWrong1stHdp should be return true', async () => {
    // Arrange
    const validationService = new ValidationService();
    validationService.isSubTypeWrongHdpOrWrong1stHdp = jest.fn().mockImplementation(() => true);
    const component = new FilterWithHdpComponent(null, validationService);
    component.filter = new FilterModel();
    component.filter.subIssueTypeId = "1";

    // Action
    const actual = component['isSubTypeWrongHdpOrWrong1stHdp']();

    // Assert
    expect(validationService.isSubTypeWrongHdpOrWrong1stHdp).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#isValidLiveIndicator should be return true', async () => {
    // Arrange
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = _.cloneDeep(Helper.fakeFilterWithHdpModel);
    component.filterWithHdpModel.liveIndicator = 1;

    // Action
    const actual = component['isValidLiveIndicator']();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isValidLiveIndicator should be return false', async () => {
    // Arrange
    const component = new FilterWithHdpComponent(null, null);
    component.filterWithHdpModel = _.cloneDeep(Helper.fakeFilterWithHdpModel);
    component.tooltip = new Tooltip();
    component.tooltip.display = jest.fn();
    [null, undefined].forEach(x => {
      component.filterWithHdpModel.liveIndicator = x;

      // Action
      const actual = component['isValidLiveIndicator']();

      // Assert
      expect(actual).toBeFalsy();
    });
  });
});