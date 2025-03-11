import { ElementRef, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { AcceptType } from '../../../../../utility/constants/config';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { SubIssueType } from '../../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { FilterModel } from '../../filter/filter.model';
import { SubIssueTypeDialogComponent } from '../../filter/sub-issue-type-dialog/sub-issue-type-dialog.component';
import { SubIssueTypeDialogModel } from '../../filter/sub-issue-type-dialog/sub-issue-type-dialog.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterTimeWithAllowanceComponent } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoService } from '../../event-red-card/services/log-info.service';
import { PipeModule } from '../../../../../utility/pipes/pipe.module';
import { LogInfoRelatedEventComponent } from './log-info-related-event.component';
import { LogInfoRelatedEvent } from './log-info-related-event.model';

class Helper {
  static readonly fakeTransId = '111102';
  static readonly fakeMatchId = 111;
  static readonly fakeEventDate = '2020-11-06 09:44:46.361 PM';
  static readonly fakeSubIssueType: SubIssueType[] = [{
    subIssueTypeId: 1,
    subIssueTypeName: "Goal",
    issueTypeId: 11,
    subIssueTypeNameCS: "Hi"
  }];
  static readonly fakeValidationMessageError: ValidationMessage = {
    isError: true,
    reason: '',
    isShowPopup: true,
    transIds: '',
    requestId: 1,
  };
  static readonly fakeValidationMessageNotError: ValidationMessage = {
    isError: false,
    reason: '',
    isShowPopup: true,
    transIds: '',
    requestId: 1,
  };
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: 12345,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeEventDate),
    voidToTime: new Date(Helper.fakeEventDate),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    scoreOfMatch: '',
    scoreNormalTicket: '',
    instantlySettleCount: 2,
    highlightMinTime: new Date(Helper.fakeEventDate),
    cancelCashOutCount: 1
  } as LogInfoDetail;
  static readonly fakeValidationMessage: ValidationMessage[] = [
    {
      isError: false,
      reason: '',
    }
  ];
  static readonly fakeVoidTimeArea: FilterTimeWithAllowance = {
    fromDateTime: Helper.fakeEventDate,
    toDateTime: Helper.fakeEventDate,
    aaTime: 1,
    paTime: 1,
    saTime: 1,
  }
  static readonly fakeLogInfoRedCard: LogInfoRelatedEvent = {
    matchId: 111,
    isMainMatch: false,
    leagueName: '',
    eventName: 'AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS',
    subIssueTypeId: 1,
    voidTimeArea: Helper.fakeVoidTimeArea,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: Helper.fakeValidationMessage,
    sportType: 0
  } as LogInfoRelatedEvent;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '11',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  } as FilterModel;
  static readonly fakeSubIssueTypeDialogModel: SubIssueTypeDialogModel = {
    isOpen: true,
    issueTypeId: '1',
    allowanceTime: new AllowanceTime()
  };
}

describe('LogInfoRelatedEventComponent', () => {
  @NgModule({
    declarations: [
      FilterTimeWithAllowanceComponent,
      SubIssueTypeDialogComponent
    ],
    imports: [
      ToolTipModule,
      BlockUiModule,
      PipeModule
    ],
    providers: [
      ModalService,
      LogInfoService,
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoRelatedEventComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoRelatedEventComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('LogInfoRelatedEventComponent init should match snapshot', async () => {
    const { fixture, instance } = await shallow.render({
      bind: {
        isEdit: false,
        logInfo: Helper.fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });

    expect(fixture).toMatchSnapshot();
    expect(instance.isEdit).toBe(false);
  });

  it('#refreshLogInfo should call #getLogInfo', async () => {
    // Arrange
    const { instance } = await shallow
    .mock(LogInfoService, {
      getLogInfo: jest.fn()
    })
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();
    instance.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    instance.filterTimeWithAllowanceComponent.updateData = jest.fn();
    instance.filterTimeWithAllowanceComponent.isValid = jest.fn().mockImplementation(() => true);
    instance.hideValidationDetail = jest.fn();
    instance.showValidationDetail = jest.fn();
    instance['clearDataValidation'] = jest.fn();

    // Action
    await instance.refreshLogInfo();

    // Assert
    expect(instance.isBlock).toBe(false);
    expect(instance.hideValidationDetail).toBeCalledTimes(1);
    expect(instance.showValidationDetail).toBeCalledTimes(1);
    expect(instance['clearDataValidation']).toBeCalledTimes(1);
    expect(instance.filterTimeWithAllowanceComponent.isValid).toBeCalledTimes(1);
    expect(instance.filterTimeWithAllowanceComponent.updateData).toBeCalledTimes(1);
  });

  it('#refreshLogInfo should not call #getLogInfo', async () => {
    // Arrange
    const { instance } = await shallow
    .mock(LogInfoService, {
      getLogInfo: jest.fn()
    })
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();
    instance.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    instance.filterTimeWithAllowanceComponent.updateData = jest.fn();
    instance.filterTimeWithAllowanceComponent.isValid = jest.fn().mockImplementation(() => false);
    instance.hideValidationDetail = jest.fn();
    instance.showValidationDetail = jest.fn();
    instance['clearDataValidation'] = jest.fn();

    // Action
    await instance.refreshLogInfo();

    // Assert
    expect(instance.isBlock).toBe(false);
    expect(instance.hideValidationDetail).toBeCalledTimes(1);
    expect(instance.showValidationDetail).toBeCalledTimes(0);
    expect(instance['clearDataValidation']).toBeCalledTimes(1);
    expect(instance.filterTimeWithAllowanceComponent.isValid).toBeCalledTimes(1);
    expect(instance.filterTimeWithAllowanceComponent.updateData).toBeCalledTimes(0);
  });

  it('#clearDataValidation should update data', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();

    // Action
    instance['clearDataValidation']();

    // Assert
    expect(instance.logInfo.logInfoDetail).toBeNull();
    expect(instance.logInfo.messageValidationLogInfo).toBeNull();
  });

  it('#hideValidationDetail should update isShowValidation to false', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();

    // Action
    instance.hideValidationDetail();

    // Assert
    expect(instance.isShowValidation).toBe(false);
  });

  it('#showValidationDetail should update isShowValidation to true', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });

    // Action
    instance.showValidationDetail();

    // Assert
    expect(instance.isShowValidation).toBe(true);
  });

  it('#isLogInfoHasError should return true', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageError];
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();

    // Action
    const actual = instance.isLogInfoHasError();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isLogInfoHasError should return false', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();

    // Action
    const actual = instance.isLogInfoHasError();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isLogInfoHasError should return true', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageError];
    fakeLogInfoRedCard.logInfoDetail = Helper.fakeLogInfoDetail;
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();

    // Action
    const actual = instance.isLogInfoHasError();

    // Assert
    expect(actual).toBe(true);
  });

  it('#handleDeleteEvent should emit deleteEvent', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();
    instance.deleteEvent.emit = jest.fn();

    // Action
    instance.handleDeleteEvent(Helper.fakeMatchId);

    // Assert
    expect(instance.deleteEvent.emit).toHaveBeenCalledWith(Helper.fakeMatchId);
  });

  it('#getSubIssueTypeName should return expected sub type name', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.subIssueTypes = Helper.fakeSubIssueType;
    instance.logInfo.subIssueTypeId = Helper.fakeSubIssueType[0].subIssueTypeId;

    // Action
    const actual = instance.getSubIssueTypeName();

    // Assert
    expect(actual).toBe(Helper.fakeSubIssueType[0].subIssueTypeName);
  });

  it('#getSubIssueTypeName should return default text', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    const expected = 'Select Sub Type';
    instance.logInfo.subIssueTypeId = null;
    instance.subIssueTypes = Helper.fakeSubIssueType;

    // Action
    const actual = instance.getSubIssueTypeName();

    // Assert
    expect(actual).toBe(expected);
  });

  it('#openPopupTransIds should call #modalService.open', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];
    const mockModalOpen = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, { open: mockModalOpen })
    .render({
      bind: {
        logInfo: fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.getSubIssueTypeName = jest.fn();

    // Action
    instance.openPopupTransIds(1092, '');

    // Assert
    expect(mockModalOpen).toHaveBeenCalledTimes(1);
  });

  it('#updateDataAfterClosed should update correct data', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];
    const mockModalOpen = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, { open: mockModalOpen })
    .render({
      bind: {
        logInfo: fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.subIssueTypeDialogModel = Helper.fakeSubIssueTypeDialogModel;
    instance.hideValidationDetail = jest.fn();

    // Action
    instance.updateDataAfterClosed(1);

    // Assert
    expect(instance.hideValidationDetail).toHaveBeenCalledTimes(1);
    expect(instance.logInfo.subIssueTypeId).toBe(1);
  });

  it('#openDialog should update correct data', async () => {
    // Arrange
    const fakeLogInfoRedCard = Helper.fakeLogInfoRedCard;
    fakeLogInfoRedCard.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];
    const mockModalOpen = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, { open: mockModalOpen })
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoRedCard,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });
    instance.logInfo = fakeLogInfoRedCard;
    instance.subIssueTypeDialogModel = Helper.fakeSubIssueTypeDialogModel;
    instance.filter = Helper.fakeFilterModel;

    // Action
    instance.openDialog();

    // Assert
    expect(instance.subIssueTypeDialogModel.isOpen).toBeTruthy();
    expect(instance.subIssueTypeDialogModel.issueTypeId).toBe(Helper.fakeFilterModel.issueTypeId);
  });

  it('#getHighlightMinTimeClass should return highlight-min-aa', async () => {
    // Arrange
    const logInfo = Helper.fakeLogInfoRedCard;
    logInfo.logInfoDetail.highlightAcceptType = AcceptType.AUTO_ACCEPT;
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: logInfo,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-aa');
    expect(instance.acceptTypeName).toBe('AA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-sa', async () => {
    // Arrange
    const logInfo = Helper.fakeLogInfoRedCard;
    logInfo.logInfoDetail.highlightAcceptType = AcceptType.SECOND_ACCEPT;
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: logInfo,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-sa');
    expect(instance.acceptTypeName).toBe('SA');
  });

  it('#getHighlightMinTimeClass should return highlight-min-pa', async () => {
    // Arrange
    const logInfo = Helper.fakeLogInfoRedCard;
    logInfo.logInfoDetail.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: logInfo,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });

    // Action
    const actual = instance.getHighlightMinTimeClass(new Date());

    // Assert
    expect(actual).toBe('highlight-min-pa');
    expect(instance.acceptTypeName).toBe('PA');
  });

  it('#displayMinTime should return expected', async () => {
    // Arrange
    const logInfo = Helper.fakeLogInfoRedCard;
    logInfo.logInfoDetail.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    const expected = '09:44:46.361 PM - PA';
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: logInfo,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });

    // Action
    const actual = instance.displayMinTime(logInfo.logInfoDetail.highlightMinTime);

    // Assert
    expect(actual).toBe(expected);
  });

  it('#displayMinTime should return - when minTime is null', async () => {
    // Arrange
    const logInfo = Helper.fakeLogInfoRedCard;
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: logInfo,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });

    // Action
    const actual = instance.displayMinTime(null);

    // Assert
    expect(actual).toBe('-');
  });

  it('#changeVarCheckValue should update isCheckedVar', async () => {
    // Arrange
    const logInfo = Helper.fakeLogInfoRedCard;
    logInfo.logInfoDetail.highlightAcceptType = AcceptType.PENDING_ACCEPT;
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: logInfo,
        subIssueTypes: Helper.fakeSubIssueType
      }
    });

    // Action
    instance.changeVarCheckValue(true);

    // Assert
    expect(instance.logInfo.isCheckedVar).toBeTruthy();
  });

});
