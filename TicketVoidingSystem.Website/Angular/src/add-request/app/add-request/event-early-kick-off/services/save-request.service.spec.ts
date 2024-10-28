import * as _ from 'lodash';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../../../utility/constants/labels';
import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { IssueTypes } from '../../filter/issue-types.model';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { GetLogInfoViewModel, ValidationMessage } from '../../models/get-log-info.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { PopupService } from '../../services/popup.service';
import { ConfirmEarlyKickOffModel } from '../confirm-eko/confirm-eko.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
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
  static readonly fakeLogInfoEarlyKickOff: LogInfoEarlyKickOff = {
    matchId: 1,
    eventName: '',
    isCollapse: false,
    isMainMatch: true,
    isShowValidation: false,
    kickOffTime: '',
    leagueName: '',
    matchModel: new MatchModel(),
    pagingModel: new PagingModel(),
    isInvalidTotalTickets: false,
    tableTicketsModel: new TableTicketsModel(),
    isHasSettledTicket: false,
    isHasInstantlySettledTicket: false,
    sportType: 0
  };
  static readonly fakeEarlyKickOffModel: EarlyKickOffModel = {
    eventDate: new Date(),
    isMainMatch: true,
    kickOffTime: '',
    matchId: 1,
    subIssueTypeId: 1,
    sportType: 0
  }

  static readonly fakeSaveRequestArg: SaveRequestArg = {
    requestId: 1,
    requestedBy: '',
    userId: 0,
    isEdit: false,
    actionIdOfFirstTimeAccess: '',
    filter: new FilterModel,
    others: new OthersModel,
    primitiveProps: new PrimitiveProperty,
    allEvents: [],
    eventLeagueComponent: undefined,
    addRequestStore: new AddRequestStore,
    confirmEarlyKickOff: new ConfirmEarlyKickOffModel(),
    kickOffTimeComponent: new DateFullTimeNewComponent(null),
    mainEvent: Helper.fakeLogInfoEarlyKickOff,
    tooltip: new Tooltip(),
    permission: new PermissionAddRequest,
    issueTypes: undefined
  }
}

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestService: AddRequestService;
  let checkAddPermissionService: CheckAddPermissionService;

  beforeEach(() => {
    validationService = new ValidationService();
    logInfoService = new LogInfoService(null, null, null, null);
    popupService = new PopupService(null);
    addRequestService = new AddRequestService(null, null, null);
    checkAddPermissionService = new CheckAddPermissionService(null);
    service = new SaveRequestService(popupService, logInfoService, validationService, addRequestService, checkAddPermissionService);
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when does not pass validation', async () => {
    logInfoService.resetLogInfoOfEvent = jest.fn();
    const arg = Helper.fakeSaveRequestArg;
    validationService.validateCommonData = jest.fn().mockReturnValue(false);
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    const actual = await service.recheckLogInfoBeforeSaveRequest(arg);

    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when have event invalid', async () => {
    const arg = new SaveRequestArg();
    arg.allEvents = [Helper.fakeLogInfoEarlyKickOff];
    arg.primitiveProps = new PrimitiveProperty();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    arg.mainEvent = Helper.fakeLogInfoEarlyKickOff;
    arg.filter = new FilterModel();
    arg.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    logInfoService.resetLogInfoOfEvent = jest.fn();
    logInfoService.getLogInfo = jest.fn().mockReturnValue({getLogInfoModels: null} as GetLogInfoViewModel);
    logInfoService.getTickets = jest.fn();
    logInfoService.assignResultLogInfoToEvents = jest.fn();
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isAllEventsValid = jest.fn().mockImplementation(() => false);
    checkAddPermissionService.isAccountHasAddRequestPermission = jest.fn().mockImplementation(() => true);

    const saveRequestService = new SaveRequestService(null, logInfoService, validationService, null, checkAddPermissionService);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(validationService.isAllEventsValid).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return true', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.primitiveProps = new PrimitiveProperty();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.mainEvent = Helper.fakeLogInfoEarlyKickOff;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.allEvents = [];
    saveRequestArg.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    logInfoService.resetLogInfoOfEvent = jest.fn();
    logInfoService.getLogInfo = jest.fn().mockReturnValue({getLogInfoModels: null} as GetLogInfoViewModel);
    logInfoService.assignResultLogInfoToEvents = jest.fn();
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isAllEventsValid = jest.fn().mockImplementation(() => true);
    checkAddPermissionService.isAccountHasAddRequestPermission = jest.fn().mockImplementation(() => true);
    const saveRequestService = new SaveRequestService(null, logInfoService, validationService, null, checkAddPermissionService);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(validationService.isAllEventsValid).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#saveRequest should not called #proceedSaveRequest', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = false;
    service['proceedSaveRequest'] = jest.fn();
    service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await service.saveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(2);
    expect(service['proceedSaveRequest']).toHaveBeenCalledTimes(0);

  });

  it('#executeSaveRequestApi should called #executeSaveRequest', async () => {
    const spyExecuteSaveRequest = jest.spyOn(addRequestService, 'executeSaveRequest').mockImplementation();
    const saveRequestService = new SaveRequestService(null, null, null, addRequestService, checkAddPermissionService);
    saveRequestService['initAddRequestQuery'] = jest.fn();
    const arg = new SaveRequestArg();
    arg.addRequestStore = new AddRequestStore();

    await saveRequestService['executeSaveRequestApi'](arg);

    expect(spyExecuteSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should not called #executeSaveRequestApi', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.addRequestStore = new AddRequestStore();
    const spyShowError = jest.spyOn(popupService, 'showError').mockImplementation(() => { });
    const saveRequestService = new SaveRequestService(popupService, null, null, null, checkAddPermissionService);
    saveRequestService['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await saveRequestService['onClickConfirmSave'](arg);

    expect(spyShowError).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should called #executeSaveRequestApi', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = true;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    service['executeSaveRequestApi'] = jest.fn();

    await service['onClickConfirmSave'](arg);

    expect(service['executeSaveRequestApi']).toHaveBeenCalledTimes(1);
  });

  it('#initAddRequestQuery should return expected model when request is voided', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.others = new OthersModel();
    arg.filter.isVoided = true;
    arg.allEvents = [Helper.fakeLogInfoEarlyKickOff];
    arg.primitiveProps = new PrimitiveProperty();
    service['getEarlyKickOffModel'] = jest.fn();

    const actual = service['initAddRequestQuery'](arg);

    expect(actual).toBeDefined();
    expect(service['getEarlyKickOffModel']).toHaveBeenCalledTimes(0);
  });

  it('#initAddRequestQuery should return query', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.others = new OthersModel();
    arg.filter.issueTypeId = IssueTypeConstant.EARLY_KICK_OFF;
    arg.allEvents = [Helper.fakeLogInfoEarlyKickOff];
    arg.primitiveProps = new PrimitiveProperty();
    service['getEarlyKickOffModel'] = jest.fn();

    const actual = service['initAddRequestQuery'](arg);

    expect(actual).toBeDefined();
    expect(service['getEarlyKickOffModel']).toHaveBeenCalledTimes(1);
  });

  it('#getEarlyKickOffModel should return EarlyKickOffModel', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.others = new OthersModel();
    arg.allEvents = [Helper.fakeLogInfoEarlyKickOff];
    const saveRequestService = new SaveRequestService(null, null, validationService, null, checkAddPermissionService);

    const actual = saveRequestService['getEarlyKickOffModel'](Helper.fakeLogInfoEarlyKickOff, "1");

    expect(actual).toBeDefined();
  });

  it('#showPopupConfirmSave should update data to show popup', async () => {
    const issueTypeId = 8;
    const subIssueTypeId = 1;
    const args = Helper.fakeSaveRequestArg;
    args.filter.issueTypeId = issueTypeId.toString();
    args.filter.subIssueTypeId = subIssueTypeId.toString();
    args.issueTypes = {issueTypes: [{issueTypeId: 8, issueTypeName: ""}]} as IssueTypes;
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const spyIsEditingByAnotherUser = jest.spyOn(validationService, 'isEditingByAnotherUser').mockImplementation(() => false);

    service = new SaveRequestService(null, null, validationService, null, checkAddPermissionService);

    service['showPopupConfirmSave'](args);

    expect(args.confirmEarlyKickOff.isOpenDialog).toBeTruthy();
    expect(spyIsEditingByAnotherUser).toHaveBeenCalledTimes(1);
  });

  it('#showPopupConfirmSave should update data when edit request to action TAKE_NOTE', async () => {
    const issueTypeId = 8;
    const subIssueTypeId = 1;
    const args = Helper.fakeSaveRequestArg;
    const childEvent = new LogInfoEarlyKickOff();
    childEvent.messageValidationLogInfo = [_.cloneDeep(Helper.fakeValidationMessageError)];
    childEvent.messageValidationLogInfo[0].reason = LABELS.NO_VALID_TICKETS_IN_RANGE;
    const linkEvent = new LogInfoEarlyKickOff();
    linkEvent.messageValidationLogInfo = [_.cloneDeep(Helper.fakeValidationMessageNotError)];

    args.allEvents = [Helper.fakeLogInfoEarlyKickOff];
    args.allEvents[0].messageValidationLogInfo = [Helper.fakeValidationMessageError];
    args.allEvents.push(childEvent);
    args.allEvents.push(linkEvent);
    args.filter.issueTypeId = issueTypeId.toString();
    args.filter.subIssueTypeId = subIssueTypeId.toString();
    args.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    args.actionIdOfFirstTimeAccess = TVSRequestActionType.MANUAL_VOID_ID.toString();
    args.issueTypes = {issueTypes: [{issueTypeId: 8, issueTypeName: ""}]} as IssueTypes;
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const spyIsEditingByAnotherUser = jest.spyOn(validationService, 'isEditingByAnotherUser').mockImplementation(() => false);
    service = new SaveRequestService(null, null, validationService, null, checkAddPermissionService);

    service['showPopupConfirmSave'](args);

    expect(args.confirmEarlyKickOff.isOpenDialog).toBeTruthy();
    expect(spyIsEditingByAnotherUser).toHaveBeenCalledTimes(1);
  });
});