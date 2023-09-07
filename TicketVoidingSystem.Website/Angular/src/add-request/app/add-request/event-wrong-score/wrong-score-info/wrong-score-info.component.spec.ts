import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { TooltipComponent } from '../../../../../utility/components/tooltip/tooltip.component';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { PipeModule } from '../../../../../utility/pipes/pipe.module';
import { CommonService } from '../../../../../utility/services/common.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { LogInfoService } from '../services/log-info.service';
import { SaveRequestService } from '../services/save-request.service';
import { ValidationService } from '../services/validation.service';
import { WrongScoreService } from '../services/wrong-score.service';
import { WrongScoreInfoComponent } from './wrong-score-info.component';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeAllowanceTime: AllowanceTime = {
    aaTime: 1,
    paTime: 1,
    saTime: 1,
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  };

  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: 12345,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeFromDateTime),
    voidToTime: new Date(Helper.fakeToDateTime),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    scoreOfMatch: '',
    scoreNormalTicket: '',
    instantlySettleCount: 2,
    cancelCashOutCount: 1
  };
  static readonly fakeValidationMessage: ValidationMessage[] = [
    {
      isError: false,
      reason: '',
    }
  ];
  static readonly fakeWrongScoreModels: WrongScoreModel[] = [{
    scoreId: 5464,
    isActive: true,
    wrongScore: '0-1',
    subIssueTypeId: 5,
    filterBy: 1,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    actualScore: '',
    matchId: 900000,
    isChecked: true,
    eventDate: null,
    voidFromTime: Helper.fakeFromDateTime,
    voidToTime: Helper.fakeToDateTime,
  }];
}

describe('EventRedCardComponent', () => {
  @NgModule({
    declarations: [
      TooltipComponent, DateFullTimeNewComponent
    ],
    imports: [
      NgbModule, FormsModule, BlockUiModule, PipeModule
    ],
    providers: [
      CommonService,AddRequestApiService, AddRequestStore, ValidationService, SaveRequestService, WrongScoreService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<WrongScoreInfoComponent>;

  beforeEach(() => {
    shallow = new Shallow(WrongScoreInfoComponent, AppModuleTest);
  });

  it('WrongScoreInfoComponent init should match snapshot', async () => {
    const { fixture, instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel,
        isEdit: false
      }
    });

    expect(fixture).toMatchSnapshot();
    expect(instance.isEdit).toBe(false);
  });

  it('#ngOnInit should only call initData', async () => {
    const { instance } = await shallow.render({
      bind: {
        isEdit: false
      }
    });
    const spyOnInitData = jest.spyOn(instance, 'initData').mockImplementation(() => jest.fn());
    instance.ngOnInit();

    expect(spyOnInitData).toBeCalledTimes(1);
  });

  it('#initData should be called', async () => {
    const { instance } = await shallow.render({
      bind: {
        isEdit: true
      }
    });

    instance.initData();

    expect(instance.isCollapse).toBe(false);
  });

  it('#onchangeCheckbox should call handleCheckedScore', async () => {
    const { instance } = await shallow.render();
    instance['handleCheckedScore'] = jest.fn();
    await instance.onchangeCheckbox(true);

    expect(instance['handleCheckedScore']).toBeCalledTimes(1);
    expect(instance.isCollapse).toBe(false);
  });

  it('#onchangeCheckbox should call handleUnCheckedScore', async () => {
    const { instance } = await shallow.render();
    instance['handleUnCheckedScore'] = jest.fn();
    await instance.onchangeCheckbox(false);

    expect(instance['handleUnCheckedScore']).toBeCalledTimes(1);
    expect(instance.isCollapse).toBe(true);
  });

  it('#handleCheckedScore should only call refreshLogInfo', async () => {
    const { instance } = await shallow
    .mock(ValidationService, {
      isLastScore: () => false
    })
    .render();
    const spyOnRefreshLogInfo = jest.spyOn(instance, 'refreshLogInfo').mockImplementation(jest.fn());

    await instance['handleCheckedScore']();

    expect(spyOnRefreshLogInfo).toBeCalledTimes(1);
  });

  it('#handleCheckedScore should run all case', async () => {
    const mockHandleCheckedLastScore = jest.fn();
    const { instance } = await shallow
      .mock(WrongScoreService, {
        handleCheckedLastScore: mockHandleCheckedLastScore
      })
      .mock(ValidationService, {
        isLastScore: () => true,
      })
      .render({
        bind: { filter: Helper.fakeFilterModel }
      });
    const spyOnRefreshLogInfo = jest.spyOn(instance, 'refreshLogInfo').mockImplementation(jest.fn());

    await instance['handleCheckedScore']();

    expect(spyOnRefreshLogInfo).toBeCalledTimes(1);
    expect(mockHandleCheckedLastScore).toBeCalledTimes(1);
  });

  it('#handleUnCheckedScore should execute scope when isLastScore return true', async () => {
    const { instance } = await shallow
      .mock(WrongScoreService, {
        setNullAllowanceTime: jest.fn(),
      })
      .mock(ValidationService, {
        isLastScore: () => true,
      })
      .mock(LogInfoService, {
        clearDataValidation: jest.fn()
      })
      .render();
    instance.originWrongScoreModels = Helper.fakeWrongScoreModels;
    instance.wrongScoreModel = Helper.fakeWrongScoreModels[0];

    await instance['handleUnCheckedScore']();

    expect(instance.wrongScoreModel.filterToTransTime).toBe(null);
  });

  it('#handleUnCheckedScore should execute scope when isLastScore return false', async () => {
    const { instance } = await shallow
      .mock(WrongScoreService, {
        setNullAllowanceTime: jest.fn(),
      })
      .mock(ValidationService, {
        isLastScore: () => false,
      })
      .mock(LogInfoService, {
        clearDataValidation: jest.fn()
      })
      .render();
    instance.originWrongScoreModels = [];
    instance.originWrongScoreModels.find = jest.fn().mockImplementation(() => {
      return { filterToTransTime: 'xxx' } as WrongScoreModel;
    });

    await instance['handleUnCheckedScore']();

    expect(instance.wrongScoreModel.filterToTransTime).toBe('xxx');
  });

  it('#refreshLogInfo should call logInfoService', async () => {
    const { instance } = await shallow
      .mock(LogInfoService, {
        clearDataValidation: jest.fn(), getLogInfo: jest.fn()
      })
      .render();
    instance.isValidDateTime = jest.fn().mockImplementation(() => true);
    instance.selectedWrongScores = Helper.fakeWrongScoreModels;
    await instance.refreshLogInfo();

    expect(instance.isCollapse).toBe(false);
  });

  it('#isValidDateTime should return false', async () => {
    const { instance } = await shallow.render();
    instance.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => false);

    const result = instance.isValidDateTime();

    expect(result).toBe(false);
  });

  it('#isValidDateTime should return true', async () => {
    const { instance } = await shallow
    .mock(ValidationService, {
      isValidToDateTime: jest.fn().mockImplementation(() => true),
      isFromTimeSameOrBeforeToTime: jest.fn().mockImplementation(() => true),
      isFromTimeSameOrAfterDefaultValue: jest.fn().mockImplementation(() => true),
      isToTimeSmallerThanFromTimeNextScore: jest.fn().mockImplementation(() => true),
    })
    .render();
    instance.fromTimeComponent.validateWithTooltip = jest.fn().mockImplementation(() => true);

    const result = instance.isValidDateTime();

    expect(result).toBe(true);
  });

  it('#getDurationTime should return -', async () => {
    const { instance } = await shallow.render();
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);

    const result = instance.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when have not fromTimeComponent', async () => {
    const { instance } = await shallow.render();
    instance.fromTimeComponent = null;

    const result = instance.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when have not toTimeComponent', async () => {
    const { instance } = await shallow.render();
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);
    instance.toTimeComponent = null;

    const result = instance.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when toTimeComponent false', async () => {
    const { instance } = await shallow.render();
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);

    const result = instance.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return 4m11s', async () => {
    const { instance } = await shallow
    .mock(WrongScoreService, { getDurationTime: jest.fn().mockImplementation(() => '4m11s') })
    .render();
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    instance.wrongScoreModel.filterFromTransTime = '2021/11/10 01:01:00.000 AM';
    instance.wrongScoreModel.filterToTransTime = '2021/11/10 01:05:11.000 AM';

    const result = instance.getDurationTime();

    expect(result).toBe('4m11s');
  });

  it('#getDurationTime should return - when toTimeComponent false', async () => {
    const { instance } = await shallow.render();
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent = new DateFullTimeNewComponent(null);
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);
    instance.toTimeComponent.isTimeValid = jest.fn().mockImplementation(() => false);

    const result = instance.getDurationTime();

    expect(result).toBe('-');
  });

  it('#getDurationTime should return - when toTimeComponent null', async () => {
    const { instance } = await shallow.render();
    instance.fromTimeComponent = new DateFullTimeNewComponent(null);
    instance.toTimeComponent = null;
    instance.fromTimeComponent.isTimeValid = jest.fn().mockImplementation(() => true);

    const result = instance.getDurationTime();

    expect(result).toBe('-');
  });

  it('#refreshLogInfo should return', async () => {
    const mockClearDataValidation = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, {
      clearDataValidation: mockClearDataValidation
    })
    .render();
    instance['isValidDateTime'] = jest.fn().mockImplementation(() => false);

    await instance.refreshLogInfo();

    expect(instance['isValidDateTime']).toHaveBeenCalledTimes(1);
    expect(mockClearDataValidation).toHaveBeenCalledTimes(1);
  });

  it('#isShowWarningSpecialBetType should return true', async () => {
    const { instance } = await shallow.render();
    instance.wrongScoreModel = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    instance.wrongScoreModel.logInfoDetail.voidFromTime = new Date('2020-10-08 09:44:46.361 PM');
    instance.wrongScoreModel.filterFromTransTime = '2021-10-08 09:44:46.361 PM';

    const actual = instance.isShowWarningSpecialBetType();

    expect(actual).toBeTruthy();
  });

  it('#isShowWarningSpecialBetType should return false', async () => {
    const { instance } = await shallow.render();
    instance.wrongScoreModel = _.cloneDeep(Helper.fakeWrongScoreModels[0]);
    instance.wrongScoreModel.logInfoDetail.voidFromTime = new Date('2022-10-08 09:44:46.361 PM');
    instance.wrongScoreModel.filterFromTransTime = '2021-10-08 09:44:46.361 PM';

    const actual = instance.isShowWarningSpecialBetType();

    expect(actual).toBeFalsy();
  });

  it('isShowCountInfo should return true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
      }
    });
    const actual = instance['isShowCountInfo'](1, 2, 0);

    expect(actual).toBeTruthy();
  });

  it('isShowCountInfo should return false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
      }
    });
    const actual = instance['isShowCountInfo'](0, 0, 0);

    expect(actual).toBeFalsy();
  });

  it('countInfoContent should return info CashOut', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
      }
    });
    const actual = instance['countInfoContent'](1, 2, 0);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Settled: <strong>2</strong>)');
  });

  it('countInfoContent should return info Settle', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
      }
    });
    const actual = instance['countInfoContent'](1, 2, 0);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Settled: <strong>2</strong>)');
  });

  it('countInfoContent should return string have not info', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
      }
    });
    const actual = instance['countInfoContent'](0, 0, 0);

    expect(actual).toBe(' ()');
  });
});
