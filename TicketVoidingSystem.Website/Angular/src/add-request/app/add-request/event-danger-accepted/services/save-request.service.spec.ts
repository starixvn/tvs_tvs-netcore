import { QueryList } from '@angular/core';
import * as _ from 'lodash';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { IssueType, SubIssueType } from '../../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { PrimitiveProperty } from '../../event-red-card/event-red-card.model';
import { FilterTimeWithAllowanceComponent } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRelatedEventComponent } from '../../components/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { ValidationMessage } from '../../models/get-log-info.model';
import { AddRequestResultModel } from '../../models/request.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { ConfirmDangerAcceptedModel } from '../confirm-danger-accepted/confirm-danger-accepted.model';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from './save-request.model';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeFilterTimeWithAllowance: FilterTimeWithAllowance = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
    aaTime: 1,
    paTime: 12,
    saTime: 12,
  };
  static readonly fakeAddRequestResultModel: AddRequestResultModel = {
    requestId: 1111,
    matchId: '',
    logResults: [],
    logStageName: '',
    markedTicketsSuccessful: []
  };
  static readonly fakeResultSuccessful: Result<AddRequestResultModel> = {
    isSuccessful: true,
    errorCode: null,
    errorMsg: null,
    data: Helper.fakeAddRequestResultModel,
  };
  static readonly fakeResultError: Result<AddRequestResultModel> = {
    isSuccessful: false,
    errorCode: 1,
    errorMsg: '',
  };
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
      voidFromTime: new Date(Helper.fakeFromDateTime),
      voidToTime: new Date(Helper.fakeToDateTime),
      singleCount: 1,
      mainParlayCount: 1,
      cashOutCount: 3,
      settleCount: 1,
      instantlySettleCount: 2,
      scoreOfMatch: '',
      scoreNormalTicket: '',
      cancelCashOutCount: 1
    } as LogInfoDetail;
  static readonly fakeLogInfoRedCard: LogInfoRelatedEvent = {
    matchId: 1111,
    isMainMatch: true,
    eventName: '',
    leagueName: '',
    subIssueTypeId: 7,
    voidTimeArea: Helper.fakeFilterTimeWithAllowance,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [Helper.fakeValidationMessageNotError],
    sportType: 0,
    tvDetectionModel: new TvDetectionModel()
  } as LogInfoRelatedEvent;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeConfirmDangerAcceptedModel: ConfirmDangerAcceptedModel = {
    isOpenDialog: null,
    issueTypeName: '',
    subIssueTypeName: '',
    isHasWarningEvent: true,
    isHasWarningEditTakeNoteRequest: true,
    warningRelatedEvents: [],
    isEditingByAnotherUser: false,
    requestId: 1,
    requestedBy: '',
    isHasSettledTicket: false,
    isHasWarningRangeTime: false
  };
  static fakeIssueType: IssueType[] = [{
    issueTypeId: 11,
    issueTypeName: "Danger Accepted",
  }];
  static fakeSubIssueType: SubIssueType[] = [{
    subIssueTypeId: 16,
    subIssueTypeName: "Goal",
    issueTypeId: 11,
    subIssueTypeNameCS: "Hi"
  }];
  static fakeIssueTypes: IssueTypes = {
    issueTypes: Helper.fakeIssueType,
    subIssueTypes: Helper.fakeSubIssueType,
    issueId: 11,
    selectedSubIssueTypes: Helper.fakeSubIssueType,
    subIssueId: 16,
  };
  static readonly fakeSaveRequestArg: SaveRequestArg = {
    requestId: null,
    isEdit: null,
    actionIdOfFirstTimeAccess: null,
    filter: Helper.fakeFilterModel,
    issueTypes: Helper.fakeIssueTypes,
    others: new OthersModel(),
    primitiveProps: new PrimitiveProperty(),
    defaultFilterTimeWithAllowance: new FilterTimeWithAllowance(),
    allEvents: [],
    eventLeagueComponent: null,
    filterTimeAreaComponent: null,
    logInfoComponents: null,
    confirmDangerAccepted: Helper.fakeConfirmDangerAcceptedModel,
    addRequestStore: null,
    requestedBy: '',
    userId: 0
  } as SaveRequestArg;
}

describe('SaveRequestService', () => {
  let mockSaveRequestService: SaveRequestService;
  let mockAddRequestStore: AddRequestStore;
  let mockLogInfoService: LogInfoService;
  let mockValidationService: ValidationService;
  let mockAddRequestService: AddRequestService;
  let mockPopupService: PopupService;

  beforeEach(() => {
    mockAddRequestStore = new AddRequestStore() as jest.Mocked<AddRequestStore>;
    mockAddRequestStore.checkValidSubIssueTypeInFilter = jest.fn();

    mockLogInfoService = new LogInfoService(null, null);
    mockLogInfoService.getLogInfo = jest.fn();
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();

    mockValidationService = new ValidationService();
    mockValidationService.isHasAllowanceTime = jest.fn();
    mockValidationService.validateCommonData = jest.fn();

    mockAddRequestService = new AddRequestService(null, null, null);
    mockAddRequestService.executeSaveRequest = jest.fn();

    mockPopupService = new PopupService(null);
    mockPopupService.showAddedRequestSuccessful = jest.fn();
    mockPopupService.showConfirm = jest.fn();
    mockPopupService.showEditedRequestSuccessful = jest.fn();
    mockPopupService.showError = jest.fn();
    mockPopupService.showSaveRequestError = jest.fn();
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when has allowance time and is not zero', async () => {
    // Arrange
    const args = Helper.fakeSaveRequestArg;
    const spyValidationServiceValidateCommonData = jest.spyOn(mockValidationService, 'validateCommonData').mockImplementation(() => false);

    args.addRequestStore = mockAddRequestStore;
    mockSaveRequestService = new SaveRequestService(mockValidationService, mockLogInfoService, null, null);
    mockSaveRequestService['validateVarCheck'] = jest.fn().mockImplementation(() => true);

    // Action
    const result = await mockSaveRequestService.recheckLogInfoBeforeSaveRequest(args);

    // Assert
    expect(result).toBe(false);
    expect(spyValidationServiceValidateCommonData).toHaveBeenCalledTimes(1);
  });

  it('#recheckLogInfoBeforeSaveRequest should return true when #validationService.isAllEventsValid is true', async () => {
    // Arrange
    const args = Helper.fakeSaveRequestArg;
    const spyValidationServiceValidateCommonData = jest.spyOn(mockValidationService, 'validateCommonData').mockImplementation(() => true);
    const spyValidationServiceIsAllEventsValid = jest.spyOn(mockValidationService, 'isAllEventsValid').mockImplementation(() => true);

    const LogInfoRelatedEventComponent = new LogInfoRelatedEventComponent(null, null);
    LogInfoRelatedEventComponent.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    LogInfoRelatedEventComponent.filterTimeWithAllowanceComponent.updateData = jest.fn();
    LogInfoRelatedEventComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), LogInfoRelatedEventComponent]);

    args.addRequestStore = mockAddRequestStore;
    args.logInfoComponents = logInfoComponents;
    mockSaveRequestService = new SaveRequestService(mockValidationService, mockLogInfoService, null, null);
    mockSaveRequestService['validateVarCheck'] = jest.fn().mockImplementation(() => true);

    // Action
    const result = await mockSaveRequestService.recheckLogInfoBeforeSaveRequest(args);

    // Assert
    expect(result).toBe(true);
    expect(spyValidationServiceValidateCommonData).toHaveBeenCalledTimes(1);
    expect(spyValidationServiceIsAllEventsValid).toHaveBeenCalledTimes(1);
    expect(mockSaveRequestService['validateVarCheck']).toHaveBeenCalledTimes(1);

  });

  it('#recheckLogInfoBeforeSaveRequest should return false when #validationService.isAllEventsValid is false', async () => {
    // Arrange
    const args = Helper.fakeSaveRequestArg;
    const spyValidationServiceValidateCommonData = jest.spyOn(mockValidationService, 'validateCommonData').mockImplementation(() => true);
    const spyValidationServiceIsAllEventsValid = jest.spyOn(mockValidationService, 'isAllEventsValid').mockImplementation(() => false);
    const LogInfoRelatedEventComponent = new LogInfoRelatedEventComponent(null, null);
    LogInfoRelatedEventComponent.filterTimeWithAllowanceComponent = null;
    LogInfoRelatedEventComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), LogInfoRelatedEventComponent]);

    args.addRequestStore = mockAddRequestStore;
    args.logInfoComponents = logInfoComponents;
    mockSaveRequestService = new SaveRequestService(mockValidationService, mockLogInfoService, null, null);
    mockSaveRequestService['validateVarCheck'] = jest.fn().mockImplementation(() => true);

    // Action
    const result = await mockSaveRequestService.recheckLogInfoBeforeSaveRequest(args);

    // Assert
    expect(result).toBe(false);
    expect(spyValidationServiceValidateCommonData).toHaveBeenCalledTimes(1);
    expect(spyValidationServiceIsAllEventsValid).toHaveBeenCalledTimes(1);
    expect(mockSaveRequestService['validateVarCheck']).toHaveBeenCalledTimes(1);
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when #validateVarCheck is false', async () => {
    // Arrange
    const args = Helper.fakeSaveRequestArg;
    const spyValidationServiceValidateCommonData = jest.spyOn(mockValidationService, 'validateCommonData').mockImplementation(() => true);
    const spyValidationServiceIsAllEventsValid = jest.spyOn(mockValidationService, 'isAllEventsValid').mockImplementation(() => true);
    const LogInfoRelatedEventComponent = new LogInfoRelatedEventComponent(null, null);
    LogInfoRelatedEventComponent.filterTimeWithAllowanceComponent = null;
    LogInfoRelatedEventComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), LogInfoRelatedEventComponent]);

    args.addRequestStore = mockAddRequestStore;
    args.logInfoComponents = logInfoComponents;
    mockSaveRequestService = new SaveRequestService(mockValidationService, mockLogInfoService, null, null);
    mockSaveRequestService['validateVarCheck'] = jest.fn().mockImplementation(() => false);

    // Action
    const result = await mockSaveRequestService.recheckLogInfoBeforeSaveRequest(args);

    // Assert
    expect(result).toBe(false);
    expect(spyValidationServiceValidateCommonData).toHaveBeenCalledTimes(1);
    expect(mockSaveRequestService['validateVarCheck']).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should call #showPopupConfirmSave when request voided', async () => {
    // Arrange
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = true;
    mockSaveRequestService = new SaveRequestService(null, null, null, null);
    mockSaveRequestService['showPopupConfirmSave'] = jest.fn();

    // Action
    await mockSaveRequestService.saveRequest(args);

    // Assert
    expect(mockSaveRequestService['showPopupConfirmSave']).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should call #addRequestStore.changeSavingRequestStatus when request not voided', async () => {
    // Arrange
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    args.addRequestStore = mockAddRequestStore;
    mockSaveRequestService = new SaveRequestService(null, null, null, null);
    mockSaveRequestService.recheckLogInfoBeforeSaveRequest = jest.fn().mockImplementation(() => false);
    mockSaveRequestService['showPopupConfirmSave'] = jest.fn();

    // Action
    await mockSaveRequestService.saveRequest(args);

    // Assert
    expect(mockSaveRequestService.recheckLogInfoBeforeSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#showPopupConfirmSave should update data to show popup', async () => {
    // Arrange
    const issueTypeId = 11;
    const subIssueTypeId = 16;
    const args = Helper.fakeSaveRequestArg;
    args.issueTypes.issueTypes = Helper.fakeIssueType;
    args.issueTypes.issueTypes[0].issueTypeId = issueTypeId;
    args.issueTypes.selectedSubIssueTypes = Helper.fakeSubIssueType;
    args.issueTypes.selectedSubIssueTypes[0].subIssueTypeId = subIssueTypeId;
    args.filter.issueTypeId = issueTypeId.toString();
    args.filter.subIssueTypeId = subIssueTypeId.toString();
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const validationService = new ValidationService();
    const spyIsEditingByAnotherUser = jest.spyOn(validationService, 'isEditingByAnotherUser').mockImplementation(() => false);

    mockSaveRequestService = new SaveRequestService(validationService, null, null, null);

    // Action
    mockSaveRequestService['showPopupConfirmSave'](args);

    // Assert
    expect(args.confirmDangerAccepted.isOpenDialog).toBeTruthy();
    expect(spyIsEditingByAnotherUser).toHaveBeenCalledTimes(1);
  });

  it('#showPopupConfirmSave should update data when edit request to action TAKE_NOTE', async () => {
    // Arrange
    const issueTypeId = 11;
    const subIssueTypeId = 16;
    const args = Helper.fakeSaveRequestArg;
    const childEvent = new LogInfoRelatedEvent();
    childEvent.messageValidationLogInfo = [_.cloneDeep(Helper.fakeValidationMessageError)];
    childEvent.messageValidationLogInfo[0].reason = LABELS.NO_VALID_TICKETS_IN_RANGE;
    const linkEvent = new LogInfoRelatedEvent();
    linkEvent.messageValidationLogInfo = [_.cloneDeep(Helper.fakeValidationMessageNotError)];
    args.issueTypes.issueTypes = Helper.fakeIssueType;
    args.issueTypes.issueTypes[0].issueTypeId = issueTypeId;
    args.issueTypes.selectedSubIssueTypes = Helper.fakeSubIssueType;
    args.issueTypes.selectedSubIssueTypes[0].subIssueTypeId = subIssueTypeId;
    args.allEvents = [Helper.fakeLogInfoRedCard];
    args.allEvents[0].messageValidationLogInfo = [Helper.fakeValidationMessageError];
    args.allEvents.push(childEvent);
    args.allEvents.push(linkEvent);
    args.filter.issueTypeId = issueTypeId.toString();
    args.filter.subIssueTypeId = subIssueTypeId.toString();
    args.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    args.actionIdOfFirstTimeAccess = TVSRequestActionType.MANUAL_VOID_ID.toString();
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const validationService = new ValidationService();
    const spyIsEditingByAnotherUser = jest.spyOn(validationService, 'isEditingByAnotherUser').mockImplementation(() => false);

    mockSaveRequestService = new SaveRequestService(validationService, null, null, null);

    // Action
    mockSaveRequestService['showPopupConfirmSave'](args);

    // Assert
    expect(args.confirmDangerAccepted.isOpenDialog).toBeTruthy();
    expect(spyIsEditingByAnotherUser).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should call #executeSaveRequestApi', async () => {
    // Arrange
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = true;
    mockSaveRequestService = new SaveRequestService(null, null, null, null);
    mockSaveRequestService.executeSaveRequestApi = jest.fn();

    // Action
    await mockSaveRequestService['onClickConfirmSave'](args);

    // Assert
    expect(mockSaveRequestService.executeSaveRequestApi).toHaveBeenCalledTimes(1);
    expect(args.primitiveProps.isBlock).toBe(false);
  });

  it('#onClickConfirmSave should call #popupService.showError', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    mockSaveRequestService = new SaveRequestService(null, null, mockPopupService, null);
    mockSaveRequestService.recheckLogInfoBeforeSaveRequest = jest.fn().mockImplementation(() => false);
    const spyPopupServiceShowError = jest.spyOn(mockPopupService, 'showError');

    await mockSaveRequestService['onClickConfirmSave'](args);

    expect(args.primitiveProps.isBlock).toBe(false);
    expect(spyPopupServiceShowError).toHaveBeenCalledTimes(1);
  });

  it('#executeSaveRequestApi should call #executeSaveRequest', async () => {
    const spyExecuteSaveRequest = jest.spyOn(mockAddRequestService, 'executeSaveRequest').mockImplementation();
    mockSaveRequestService = new SaveRequestService(null, null, null, mockAddRequestService);
    mockSaveRequestService['initAddRequestQuery'] = jest.fn().mockImplementation(() => new AddRequestQuery());

    await mockSaveRequestService.executeSaveRequestApi(Helper.fakeSaveRequestArg);

    expect(spyExecuteSaveRequest).toHaveBeenCalledTimes(1);
  });


  it('#initAddRequestQuery should return expected model', async () => {
    // Arrange
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    args.allEvents = [Helper.fakeLogInfoRedCard];
    args.primitiveProps = new PrimitiveProperty();
    args.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    mockSaveRequestService = new SaveRequestService(null, null, null, null);

    const result = mockSaveRequestService['initAddRequestQuery'](args);

    expect(result.issueTypeId).toEqual(args.filter.issueTypeId);
    expect(result.actionId).toEqual(args.filter.action);
    expect(result.isTest).toEqual(args.filter.isTest);
    expect(result.isVoided).toEqual(args.filter.isVoided);
    expect(result.mistakenBy).toEqual(args.others.mistakenBy);
    expect(result.mistakenBy).toEqual(args.others.mistakenBy);
  });

  it('#initAddRequestQuery should return expected model when request is voided', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = true;
    args.allEvents = [Helper.fakeLogInfoRedCard];
    mockSaveRequestService = new SaveRequestService(null, null, null, null);
    const result = mockSaveRequestService['initAddRequestQuery'](args);

    expect(result.issueTypeId).toEqual(args.filter.issueTypeId);
    expect(result.actionId).toEqual(args.filter.action);
    expect(result.isTest).toEqual(args.filter.isTest);
    expect(result.isVoided).toEqual(args.filter.isVoided);
    expect(result.mistakenBy).toEqual(args.others.mistakenBy);
  });

  it('#validateVarCheck should return true', async () => {
    const logInfo = _.cloneDeep(Helper.fakeLogInfoRedCard);
    logInfo.subIssueTypeId = SubIssueTypeConstant.GOAL;
    mockSaveRequestService = new SaveRequestService(null, null, null, null);
    [null, undefined].forEach(x => {
      logInfo.isCheckedVar = x;
      const actual = mockSaveRequestService['validateVarCheck']([logInfo]);

      expect(actual).toBeFalsy();
      expect(logInfo.isHighLightVarCheck).toBeTruthy();
    });
  });
});
