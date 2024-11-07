import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { IssueType, SubIssueType } from '../../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from "../../../../../utility/models/match.model";
import { Selection } from '../../../../../utility/models/selection.model';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { ConfirmAddRequestModel } from '../../confirm-add-request/confirm-add-request.model';
import { FilterModel } from "../../filter/filter.model";
import { IssueTypes } from '../../filter/issue-types.model';
import { WrongOfferedNameModel } from '../../models/event-wrong-offered-name.model';
import { GetLogInfoModel, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { PrimitiveProperty } from "../models/primitive-property.model";
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongOfferedNameService } from "./event-wrong-offered-name.service";
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeWrongOfferedNameModel: WrongOfferedNameModel = {
    currencyIds: '1,2',
    licenseeNames: 'licensee1,licensee2',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    match: new MatchModel(),
    subIssueTypeId: 1
  } as WrongOfferedNameModel;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '26',
    subIssueTypeId: '1',
    action: '5'
  } as FilterModel;
  static readonly fakeLogInfoWrongOfferedName: LogInfoWrongOfferedName = {
    matchId: 1,
    matchModel: new MatchModel(),
    filterWrongOfferedName: new FilterWrongOfferedNameModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
  } as LogInfoWrongOfferedName;
  static readonly fakeFilterWrongOfferedName: FilterWrongOfferedNameModel = {
    currencyIds: [],
    licenseeNames: []
  } as FilterWrongOfferedNameModel;
  static readonly fakeGetLogInfoModels: GetLogInfoModel[] = [
    {
      matchId: 1,
      validation: new Validation(),
      logInfoDetail: new LogInfoDetail()
    } as GetLogInfoModel
  ]
}

describe('SaveRequestService', () => {
  let mockService: SaveRequestService;
  let mockPopupService: PopupService;
  let mockAddRequestService: AddRequestService;
  let mockValidationService: ValidationService;
  let mockLogInfoService: LogInfoService;
  let mockEventWrongOfferedNameService: EventWrongOfferedNameService;

  beforeEach(() => {
    mockPopupService = new PopupService(null);
    mockAddRequestService = new AddRequestService(null, null, null);
    mockValidationService = new ValidationService(null);
    mockLogInfoService = new LogInfoService(null, null);
    mockEventWrongOfferedNameService = new EventWrongOfferedNameService(null, null, null, null, null);
    mockService = new SaveRequestService(mockPopupService, mockAddRequestService, mockValidationService,
      mockLogInfoService, mockEventWrongOfferedNameService);
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when does not pass validation', async () => {
    const arg = new SaveRequestArg();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(false);

    const actual = await mockService.recheckLogInfoBeforeSaveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when #validationService.isAccountHasAddRequestPermission false', async () => {
    const arg = new SaveRequestArg();
    arg.filter = Helper.fakeFilterModel;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    arg.primitiveProps = new PrimitiveProperty();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockLogInfoService.getLogInfo = jest.fn();
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(true);
    mockValidationService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(false);

    const actual = await mockService.recheckLogInfoBeforeSaveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockLogInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(mockValidationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(mockValidationService.isAccountHasAddRequestPermission).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return true when #validationService.isValidLogInfoEvent true', async () => {
    const arg = new SaveRequestArg();
    arg.filter = Helper.fakeFilterModel;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    arg.primitiveProps = new PrimitiveProperty();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockLogInfoService.getLogInfo = jest.fn();
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(true);
    mockValidationService.isValidLogInfoEvent = jest.fn().mockReturnValue(true);
    mockValidationService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(true);

    const actual = await mockService.recheckLogInfoBeforeSaveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(mockLogInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when #validationService.isValidLogInfoEvent false', async () => {
    const arg = new SaveRequestArg();
    arg.filter = Helper.fakeFilterModel;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    arg.primitiveProps = new PrimitiveProperty();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockLogInfoService.getLogInfo = jest.fn();
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(true);
    mockValidationService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(true);
    mockValidationService.isValidLogInfoEvent = jest.fn().mockReturnValue(false);

    const actual = await mockService.recheckLogInfoBeforeSaveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(mockLogInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#saveRequest should not called #showPopupConfirmSave', async () => {
    const arg = new SaveRequestArg();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    mockService['showPopupConfirmSave'] = jest.fn();
    mockService['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockReturnValue(false);

    await mockService.saveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockService['showPopupConfirmSave']).toHaveBeenCalledTimes(0);
  });

  it('#saveRequest should called #showPopupConfirmSave', async () => {
    const arg = new SaveRequestArg();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    arg.filter = new FilterModel();
    arg.filter.isVoided = true;
    arg.confirmAddRequest = new ConfirmAddRequestModel();
    mockService['showPopupConfirmSave'] = jest.fn();

    await mockService.saveRequest(arg);

    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockService['showPopupConfirmSave']).toHaveBeenCalledTimes(1);
  });

  it('#executeSaveRequestApi should called #executeSaveRequest', async () => {
    mockAddRequestService.executeSaveRequest = jest.fn();
    mockService['initAddRequestQuery'] = jest.fn();

    await mockService['executeSaveRequestApi'](new SaveRequestArg());

    expect(mockAddRequestService.executeSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should not called #executeSaveRequestApi when request not voided', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    mockPopupService.showError = jest.fn();
    mockService['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockReturnValue(false);

    await mockService['onClickConfirmSave'](arg);

    expect(mockPopupService.showError).toHaveBeenCalledTimes(1);
    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('#onClickConfirmSave should called #executeSaveRequestApi when request voided', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = true;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    mockService['executeSaveRequestApi'] = jest.fn();

    await mockService['onClickConfirmSave'](arg);

    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockService['executeSaveRequestApi']).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should called #executeSaveRequestApi when request note voided', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    mockService['executeSaveRequestApi'] = jest.fn();
    mockService['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockReturnValue(true);

    await mockService['onClickConfirmSave'](arg);

    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockService['executeSaveRequestApi']).toHaveBeenCalledTimes(1);
  });

  it('#initAddRequestQuery should not call #eventWrongOfferedNameService.initWrongMarketOfferedModel when request is voided', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.others = new OthersModel();
    arg.filter.isVoided = true;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    arg.primitiveProps = new PrimitiveProperty();
    mockEventWrongOfferedNameService.initWrongMarketOfferedModel = jest.fn().mockReturnValue(Helper.fakeWrongOfferedNameModel);

    const actual = mockService['initAddRequestQuery'](arg);

    expect(actual).toBeDefined();
    expect(mockEventWrongOfferedNameService.initWrongMarketOfferedModel).toHaveBeenCalledTimes(0);
  });

  it('#initAddRequestQuery should return expected model when transInfoAddRequestModel not null', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.others = new OthersModel();
    arg.filter.issueTypeId = IssueTypeConstant.WRONG_OFFERED_NAME;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.transInfoAddRequest = new TransInfoAddRequestModel();
    mockService['getWrongOddsSportsBookInfo'] = jest.fn();
    mockEventWrongOfferedNameService.initWrongMarketOfferedModel = jest.fn().mockReturnValue(Helper.fakeWrongOfferedNameModel);

    const actual = mockService['initAddRequestQuery'](arg);

    expect(actual).toBeDefined();
    expect(mockEventWrongOfferedNameService.initWrongMarketOfferedModel).toHaveBeenCalledTimes(1);
  });

  it('#showPopupConfirmSave should update expected model', async () => {
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockReturnValue(element);
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.issueTypeId = '1';
    arg.filter.subIssueTypeId = '2'
    arg.filter.action = '1';
    arg.filter.actions = [{ value: '1', name: 'actionName' }] as Selection[];
    arg.logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    arg.issueTypes = {
      issueTypes: [{ issueTypeName: 'issueName', issueTypeId: 1 }] as IssueType[],
      subIssueTypes: [{ subIssueTypeName: 'subIssueName', subIssueTypeId: 2 }] as SubIssueType[],
    } as IssueTypes;
    arg.confirmAddRequest = new ConfirmAddRequestModel();
    mockService['getWrongOddsSportsBookInfo'] = jest.fn();
    mockEventWrongOfferedNameService.initWrongMarketOfferedModel = jest.fn().mockReturnValue(Helper.fakeWrongOfferedNameModel);

    mockService['showPopupConfirmSave'](arg);

    expect(arg.confirmAddRequest.requestId).toBe(arg.requestId);
    expect(arg.confirmAddRequest.requestedBy).toBe(arg.requestedBy);
    expect(arg.confirmAddRequest.isOpen).toBeTruthy();
    expect(arg.confirmAddRequest.issueTypeName).toBe('issueName');
    expect(arg.confirmAddRequest.subIssueTypeName).toBe('subIssueName');
    expect(arg.confirmAddRequest.voidAction).toBe('actionName');
  });
});
