import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { Shallow } from 'shallow-render';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterTimeWithAllowanceComponent } from './filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from './filter-time-with-allowance.model';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-11-09 09:44:46.361 PM';
  static readonly fakeMomentFromDate = moment(Helper.fakeFromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
  static readonly fakeMomentToDate = moment(Helper.fakeToDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
  static readonly fakeFromDate =  new NgbDate(Helper.fakeMomentFromDate.year(), Helper.fakeMomentFromDate.month() + 1, Helper.fakeMomentFromDate.date());
  static readonly fakeToDate =  new NgbDate(Helper.fakeMomentToDate.year(), Helper.fakeMomentToDate.month() + 1, Helper.fakeMomentToDate.date());
  static readonly fakeFromTime = Helper.fakeMomentFromDate.format(DateTimeFormat.TIME_FORMAT);
  static readonly fakeToTime = Helper.fakeMomentToDate.format(DateTimeFormat.TIME_FORMAT);

  static readonly fakeFilterTimeWithAllowance: FilterTimeWithAllowance = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
    aaTime: 1,
    paTime: 1,
    saTime: 1,
  };

  static readonly fakeLogInfoDetail: LogInfoDetail =
    {
      matchId: 12345,
      liveScores: '0 - 0',
      voidFromTime: new Date('2020-11-06 09:44:46.361 PM'),
      voidToTime: new Date('2020-11-06 09:44:46.361 PM'),
      singleCount: 1,
      mainParlayCount: 1,
      cashOutCount: 3,
      settleCount: 0,
      scoreOfMatch: '',
      scoreNormalTicket: '',
      instantlySettleCount: 2,
      cancelCashOutCount: 1
    };
}

describe('FilterTimeWithAllowanceComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule
    ],
    providers: [
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterTimeWithAllowanceComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterTimeWithAllowanceComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterTimeWithAllowanceComponent init should match snapshot', async () => {
    const { fixture, instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });

    expect(fixture).toMatchSnapshot();
    expect(instance.isEdit).toBe(false);
  });

  it('ngOnInit should call #initData when is add request', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.filterTimeWithAllowanceModel.fromDateTime = null;
    instance.setDefaultValue = jest.fn();
    instance['isHasTime'] = jest.fn();
    instance.initData = jest.fn();

    // Action
    instance.ngOnInit();

    // Assert
    expect(instance.isEdit).toBe(false);
    expect(instance.initData).toHaveBeenCalledTimes(1);
  });

  it('ngOnInit should call #updateData when is edit request', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: true,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.setDefaultValue = jest.fn();
    instance['isHasTime'] = jest.fn();
    instance.updateData = jest.fn();

    // Action
    instance.ngOnInit();

    // Assert
    expect(instance.isEdit).toBe(true);
    expect(instance.updateData).toHaveBeenCalledTimes(1);
  });

  it('#updateData should update from/to date base on filterTimeWithAllowanceModel', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    const momentFromDate = moment(Helper.fakeFilterTimeWithAllowance.fromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const momentToDate = moment(Helper.fakeFilterTimeWithAllowance.toDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const expectedFromDate = new NgbDate(momentFromDate.year(), momentFromDate.month() + 1, momentFromDate.date());
    const expectedToDate = new NgbDate(momentToDate.year(), momentToDate.month() + 1, momentToDate.date());

    // Action
    instance.updateData();

    // Assert
    expect(instance.fromDate).toStrictEqual(expectedFromDate);
    expect(instance.toDate).toStrictEqual(expectedToDate);
  });

  it('#clearTimeWhenChangeActionWaitingToManualVoid should reset fromTime & toTime', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });

    // Action
    instance.clearTimeWhenChangeActionWaitingToManualVoid();

    // Assert
    expect(instance.fromTime).toBe('');
    expect(instance.toTime).toBe('');
  });

  it('#isValid should return false when #isFromTimeValid return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.isFromTimeValid = jest.fn().mockImplementation(() => false);

    // Action
    const actual = instance.isValid();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isValid should return false when #isFromTimeValid return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.isFromTimeValid = jest.fn().mockImplementation(() => false);

    // Action
    const actual = instance.isValid();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isValid should return false when #isToTimeValid return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.isFromTimeValid = jest.fn().mockImplementation(() => true);
    instance.isToTimeValid = jest.fn().mockImplementation(() => false);

    // Action
    const actual = instance.isValid();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isValid should return false when #isSameOrBefore return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.isFromTimeValid = jest.fn().mockImplementation(() => true);
    instance.isToTimeValid = jest.fn().mockImplementation(() => true);
    instance.fromDate =  new NgbDate(2020, 7, 1);
    instance.toDate =  new NgbDate(2020, 6, 1);
    instance.tooltip.display = jest.fn();

    // Action
    const actual = instance.isValid();

    // Assert
    expect(actual).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValid should return true when #isSettingTimeValid return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    const momentFromDate = moment(Helper.fakeFromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const momentToDate = moment(Helper.fakeToDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    instance.isFromTimeValid = jest.fn().mockImplementation(() => true);
    instance.isToTimeValid = jest.fn().mockImplementation(() => true);
    instance.fromDate =  new NgbDate(momentFromDate.year(), momentFromDate.month() + 1, momentFromDate.date());
    instance.toDate =  new NgbDate(momentToDate.year(), momentToDate.month() + 1, momentToDate.date());
    instance.fromTime = momentFromDate.format(DateTimeFormat.TIME_FORMAT);
    instance.toTime = momentToDate.format(DateTimeFormat.TIME_FORMAT);
    instance['isSettingTimeValid'] = jest.fn().mockImplementation(() => false);

    // Action
    const actual = instance.isValid();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isValid should return true when #isSettingTimeValid return true', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });

    instance.isFromTimeValid = jest.fn().mockImplementation(() => true);
    instance.isToTimeValid = jest.fn().mockImplementation(() => true);
    instance.fromDate = Helper.fakeFromDate;
    instance.toDate =  Helper.fakeToDate;
    instance.fromTime = Helper.fakeFromTime;
    instance.toTime = Helper.fakeToTime;
    instance['isSettingTimeValid'] = jest.fn().mockImplementation(() => true);

    // Action
    const actual = instance.isValid();

    // Assert
    expect(actual).toBe(true);
  });

  it('#isValid should return true when all data valid', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.isFromTimeValid = jest.fn().mockImplementation(() => true);
    instance.isToTimeValid = jest.fn().mockImplementation(() => true);
    instance.fromDate =  new NgbDate(2020, 4, 1);
    instance.toDate =  new NgbDate(2020, 6, 1);
    instance['isSettingTimeValid'] = jest.fn().mockImplementation(() => true);

    // Action
    const actual = instance.isValid();

    // Assert
    expect(actual).toBe(true);
  });


  it('#getDurationTime should return "-" when #isInputTimeValid return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance['isInputTimeValid'] = jest.fn().mockImplementation(() => false);

    // Action
    const actual = instance.getDurationTime();

    // Assert
    expect(instance['isInputTimeValid']).toHaveBeenCalledTimes(1);
    expect(actual).toEqual('-');
  });

  it('#changeAllowanceSettingTimeEvent should call emit emitChangeAllowanceSettingTimeEvent', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.changeAllowanceSettingTimeEvent.emit = jest.fn();

    // Action
    instance.emitChangeAllowanceSettingTimeEvent();

    // Assert
    expect(instance.changeAllowanceSettingTimeEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#changeFilterDateTime should call expected function', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: true,
        isDisabled: false,
      }
    });
    instance['clearSettingTime'] = jest.fn();
    instance.updateFilterTime = jest.fn();
    instance.changeFilterTimeEvent.emit = jest.fn();
    instance.emitChangeAllowanceSettingTimeEvent = jest.fn();

    // Action
    instance.changeFilterDateTime();

    // Assert
    expect(instance['clearSettingTime']).toHaveBeenCalledTimes(1);
    expect(instance.updateFilterTime).toHaveBeenCalledTimes(1);
    expect(instance.emitChangeAllowanceSettingTimeEvent).toHaveBeenCalledTimes(1);
    expect(instance.changeFilterTimeEvent.emit).toHaveBeenCalledTimes(1);

  });

  it('#changeFilterDateTime should not call #clearSettingTime', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance['clearSettingTime'] = jest.fn();
    instance.updateFilterTime = jest.fn();
    instance.changeFilterTimeEvent.emit = jest.fn();
    instance.emitChangeAllowanceSettingTimeEvent = jest.fn();

    // Action
    instance.changeFilterDateTime();

    // Assert
    expect(instance.updateFilterTime).toHaveBeenCalledTimes(1);
    expect(instance.emitChangeAllowanceSettingTimeEvent).toHaveBeenCalledTimes(1);
    expect(instance.changeFilterTimeEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#isSettingTimeValid should return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: true,
        isDisabled: false,
      }
    });
    const testCases = [
      { aaTime: 1, paTime: 1, saTime: null, expected: false },
      { aaTime: 1, paTime: null, saTime: 1, expected: false },
      { aaTime: null, paTime: 1, saTime: 1, expected: false },
      { aaTime: null, paTime: null, saTime: null, expected: true },
      { aaTime: 1, paTime: 1, saTime: 1, expected: true },
      { aaTime: null, paTime: null, saTime: 1, expected: false },
    ];

    testCases.forEach(item => {
      instance.filterTimeWithAllowanceModel.aaTime = item.aaTime;
      instance.filterTimeWithAllowanceModel.paTime = item.paTime;
      instance.filterTimeWithAllowanceModel.saTime = item.saTime;
      instance.tooltip.display = jest.fn();

      // Action
      const actual = instance['isSettingTimeValid']();

      // Assert
      expect(actual).toBe(item.expected);
    });
  });

  it('#updateFilterTime should update data', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: true,
        isDisabled: false,
      }
    });
    instance.fromDate = Helper.fakeFromDate;
    instance.toDate = Helper.fakeToDate;
    instance.fromTime = Helper.fakeFromTime;
    instance.toTime = Helper.fakeToTime;
    const expectedFromDateTime = moment(`${StaticService.convertToFullDate(Helper.fakeFromDate)} ${Helper.fakeFromTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT, true)
      .format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const expectedToDateTime = moment(`${StaticService.convertToFullDate(Helper.fakeToDate)} ${Helper.fakeToTime}`, DateTimeFormat.FULL_DATE_TIME_FORMAT, true)
    .format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    // Action
    instance.updateFilterTime();

    // Assert
    expect(instance.filterTimeWithAllowanceModel.fromDateTime).toEqual(expectedFromDateTime);
    expect(instance.filterTimeWithAllowanceModel.toDateTime).toEqual(expectedToDateTime);
  });

  it('#refreshLogInfo should emit refreshLogInfoEvent', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.refreshLogInfoEvent.emit = jest.fn();

    // Action
    instance.refreshLogInfo();

    // Assert
    expect(instance.refreshLogInfoEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#clearSettingTime should set null to allowance time', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });

    // Action
    instance['clearSettingTime']();

    // Assert
    expect(instance.filterTimeWithAllowanceModel.aaTime).toBeNull();
    expect(instance.filterTimeWithAllowanceModel.paTime).toBeNull();
    expect(instance.filterTimeWithAllowanceModel.saTime).toBeNull();

  });

  it('#isHasTime should return true', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.filterTimeWithAllowanceModel.fromDateTime = Helper.fakeFromDateTime;
    instance.filterTimeWithAllowanceModel.toDateTime = Helper.fakeToDateTime;

    // Action
    const actual = instance['isHasTime']();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isHasTime should return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.filterTimeWithAllowanceModel.fromDateTime = null;
    instance.filterTimeWithAllowanceModel.toDateTime = null;

    // Action
    const actual = instance['isHasTime']();

    // Assert
    expect(actual).toEqual(false);
  });

  it('#isFromTimeValid should return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.tooltip.display = jest.fn();
    instance['isInputTimeValid'] = jest.fn().mockImplementation(() => false);

    // Action
    const actual = instance['isFromTimeValid']();

    // Assert
    expect(instance.tooltip.display).toHaveBeenCalledTimes(1);
    expect(actual).toBe(false);
  });

  it('#isFromTimeValid should return true', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance['isInputTimeValid'] = jest.fn().mockImplementation(() => true);

    // Action
    const actual = instance['isFromTimeValid']();

    // Assert
    expect(actual).toBe(true);
  });

  it('#isToTimeValid should return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.tooltip.display = jest.fn();
    instance['isInputTimeValid'] = jest.fn().mockImplementation(() => false);

    // Action
    const actual = instance['isToTimeValid']();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isToTimeValid should return true', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance['isInputTimeValid'] = jest.fn().mockImplementation(() => true);
    // Action
    const actual = instance['isToTimeValid']();

    // Assert
    expect(actual).toBe(true);
  });

  it('#isInputTimeValid should return false', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });
    instance.tooltip.display = jest.fn();

    // Action
    const actual = instance['isInputTimeValid']('01:02');

    // Assert
    expect(actual).toBe(false);
  });

  it('#isInputTimeValid should return true', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });

    // Action
    const actual = instance['isInputTimeValid']('10:26:06.643 PM');

    // Assert
    expect(actual).toBe(true);
  });

  it('#clearTimeWhenChangeActionWaitingToManualVoid should clear time', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filterTimeWithAllowanceModel: Helper.fakeFilterTimeWithAllowance,
        isEdit: false,
        isUseInLogInfo: false,
        isDisabled: false,
      }
    });

    // Action
    instance.clearTimeWhenChangeActionWaitingToManualVoid();

    // Assert
    expect(instance.fromTime).toBe('');
    expect(instance.toTime).toBe('');
  });
});
