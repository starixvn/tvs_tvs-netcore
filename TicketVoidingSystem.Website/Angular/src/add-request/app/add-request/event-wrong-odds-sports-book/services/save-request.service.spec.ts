import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { ConfirmAddRequestModel } from '../../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsSportsBookModel } from '../../models/event-wrong-odds-sports-book.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeWrongOddsSportsBookModel = new WrongOddsSportsBookModel();
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false,
    actions: []
  };
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: Helper.fakeMatchId,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeFromDateTime),
    voidToTime: new Date(Helper.fakeToDateTime),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    instantlySettleCount: 2,
    scoreNormalTicket: '',
    scoreOfMatch: '',
    cancelCashOutCount: 1
  } as LogInfoDetail;
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: 1,
    createdBy: 'admin',
  };
  static readonly fakeFilterWrongOddsSportsBookModel: FilterWrongOddsSportsBookModel = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
    correctOdds: '1',
    filterOddsType: 'value',
    fromOdds: '1',
    oddsValue: '1',
    liveIndicator: 0,
    toOdds: '1'
  };
  static readonly fakeLogInfoWrongOddsSportsBook: LogInfoWrongOddsSportsBook = {
    matchId: Helper.fakeMatchId,
    filterWrongOddsSportsBook: new FilterWrongOddsSportsBookModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    betTeamsResult: [],
    checkedBetTypes: []
  } as LogInfoWrongOddsSportsBook;
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: Helper.fakeMatchId,
    validation: {
      isInvalidTotalTickets: true,
      isExistedInOtherRequest: true
    } as Validation,
    ticketRequest: [Helper.fakeTicketRequest],
    logInfoDetail: Helper.fakeLogInfoDetail
  };
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    getLogInfoModels: [Helper.fakeGetLogInfoModel],
  };
}

describe('SaveRequestService', () => {
  let service: SaveRequestService;

  beforeEach(() => {
    service = new SaveRequestService(null, null, null, null, null);
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when does not pass validation', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    const validationService = new ValidationService(null);
    validationService.validateCommonData = jest.fn().mockImplementation(() => false);

    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, null);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return true when #validationService.isValidLogInfoEvent true', async () => {
    const arg = new SaveRequestArg();
    arg.filter = Helper.fakeFilterModel;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOddsSportsBook;
    arg.primitiveProps = new PrimitiveProperty();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();

    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    logInfoService.getLogInfo = jest.fn();

    const validationService = new ValidationService(null);
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidLogInfoEvent = jest.fn().mockImplementation(() => true);
    validationService.isAccountHasAddRequestPermission = jest.fn().mockImplementation(() => true);

    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, null);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when #validationService.isValidLogInfoEvent false', async () => {
    const arg = new SaveRequestArg();
    arg.filter = Helper.fakeFilterModel;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOddsSportsBook;
    arg.primitiveProps = new PrimitiveProperty();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();

    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    logInfoService.getLogInfo = jest.fn();

    const validationService = new ValidationService(null);
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidLogInfoEvent = jest.fn().mockImplementation(() => false);
    validationService.isAccountHasAddRequestPermission = jest.fn().mockImplementation(() => true);
    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, null);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#saveRequest should not called #showPopupConfirmSave', async () => {
    const arg = new SaveRequestArg();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    service['showPopupConfirmSave'] = jest.fn();
    service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await service.saveRequest(arg);

    expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(service['showPopupConfirmSave']).toHaveBeenCalledTimes(0);
  });

  it('#saveRequest should called #showPopupConfirmSave', async () => {
    const arg = new SaveRequestArg();
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    arg.addRequestStore.changeSavingRequestStatus = jest.fn();
    arg.filter = new FilterModel();
    arg.filter.isVoided = true;
    arg.confirmAddRequest = new ConfirmAddRequestModel();
    service['showPopupConfirmSave'] = jest.fn();

    await service.saveRequest(arg);

    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(service['showPopupConfirmSave']).toHaveBeenCalledTimes(1);
  });

  it('#executeSaveRequestApi should called #executeSaveRequest', async () => {
    const addRequestService = new AddRequestService(null, null, null);
    const spyExecuteSaveRequest = jest.spyOn(addRequestService, 'executeSaveRequest').mockImplementation();
    const saveRequestService = new SaveRequestService(null, null, null, addRequestService, null);
    saveRequestService['initAddRequestQuery'] = jest.fn();

    await saveRequestService['executeSaveRequestApi'](new SaveRequestArg());

    expect(spyExecuteSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should not called #executeSaveRequestApi', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();

    const popupService = new PopupService(null);
    const spyShowError = jest.spyOn(popupService, 'showError').mockImplementation(() => {});

    const saveRequestService = new SaveRequestService(null, null, popupService, null, null);
    saveRequestService['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await saveRequestService['onClickConfirmSave'](arg);

    expect(spyShowError).toHaveBeenCalledTimes(1);
    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('#onClickConfirmSave should called #executeSaveRequestApi', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = true;
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    service['executeSaveRequestApi'] = jest.fn();

    await service['onClickConfirmSave'](arg);

    expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('#initAddRequestQuery should not call #eventService.getWrongOddsSportsBookModel when request is voided', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.others = new OthersModel();
    arg.filter.isVoided = true;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOddsSportsBook;
    arg.primitiveProps = new PrimitiveProperty();
    const eventService = new EventWrongOddsSportsBookService();
    eventService.getWrongOddsSportsBookModel = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeWrongOddsSportsBookModel));
    const saveRequestService = new SaveRequestService(null, null, null, null, eventService);

    const actual = saveRequestService['initAddRequestQuery'](arg);

    expect(actual).toBeDefined();
    expect(eventService.getWrongOddsSportsBookModel).toHaveBeenCalledTimes(0);
  });

  it('#initAddRequestQuery should return expected model when transInfoAddRequestModel not null', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.others = new OthersModel();
    arg.filter.issueTypeId = IssueTypeConstant.WRONG_ODDS;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOddsSportsBook;
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    service['getWrongOddsSportsBookInfo'] = jest.fn();
    const eventService = new EventWrongOddsSportsBookService();
    eventService.getWrongOddsSportsBookModel = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeWrongOddsSportsBookModel));
    const saveRequestService = new SaveRequestService(null, null, null, null, eventService);

    const actual = saveRequestService['initAddRequestQuery'](arg);

    expect(actual).toBeDefined();
    expect(eventService.getWrongOddsSportsBookModel).toHaveBeenCalledTimes(1);
  });
});