import { MatchModel } from '../../../../../utility/models/match.model';
import { LinkedLogsViewModel } from '../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongOddsService } from './event-wrong-odds.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeWrongOddsModel = new WrongOddsModel();
  static readonly fakeLinkedLogsViewModel: LinkedLogsViewModel = {
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    result: new Result(),
    poolHouseLinkedLogsData: [
      {
        groupName: '1X2',
        isShow: true,
        logsData: []
      },
      {
        groupName: 'AIO',
        isShow: true,
        logsData: []
      },
    ]
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
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
  } as TicketRequest;
  static readonly fakeFilterWrongOddsModel: FilterWrongOddsModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    liveIndicator: 0,
    spread: '',
    maxBet: 0,
    allowanceRate: '',
    correctOddsHomeOver: '',
    correctOddsAwayUnder: '',
    fromOddsNotVoidHomeOver: '',
    toOddsNotVoidHomeOver: '',
    fromOddsNotVoidAwayUnder: '',
    toOddsNotVoidAwayUnder: '',
    maxBetAndSpreadInfo: []
  };
  static readonly fakeLogInfoWrongOdds: LogInfoWrongOdds = {
    matchId: Helper.fakeMatchId,
    filterWrongOdds: Helper.fakeFilterWrongOddsModel,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: new LinkedLogsViewModel(),
    poolHouseCheckedBetTypes: ''
  };
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: Helper.fakeMatchId,
    validation: {
      isInvalidTotalTickets: true,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: false
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
    saveRequestArg.primitiveProps = new PrimitiveProperty();
    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    const validationService = new ValidationService();
    validationService.validateCommonData = jest.fn().mockImplementation(() => false);

    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, null);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return true when #validationService.isValidLogInfoEvent true', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.primitiveProps = new PrimitiveProperty();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.logInfoEvent = new LogInfoWrongOdds();
    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    logInfoService.getLogInfo = jest.fn();

    const validationService = new ValidationService();
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidLogInfoEvent = jest.fn().mockImplementation(() => true);
    const eventWrongOddsService = new EventWrongOddsService(null, null);
    eventWrongOddsService.getLinkedLog = jest.fn();
    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, eventWrongOddsService);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#recheckLogInfoBeforeSaveRequest should return false when #validationService.isValidLogInfoEvent false', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.primitiveProps = new PrimitiveProperty();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.logInfoEvent = new LogInfoWrongOdds();
    const logInfoService = new LogInfoService(null, null);
    logInfoService.resetLogInfoOfEvent = jest.fn();
    logInfoService.getLogInfo = jest.fn();

    const validationService = new ValidationService();
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    validationService.isValidLogInfoEvent = jest.fn().mockImplementation(() => false);
    const eventWrongOddsService = new EventWrongOddsService(null, null);
    eventWrongOddsService.getLinkedLog = jest.fn();
    const saveRequestService = new SaveRequestService(validationService, logInfoService, null, null, eventWrongOddsService);

    const actual = await saveRequestService.recheckLogInfoBeforeSaveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#saveRequest should not called #proceedSaveRequest', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeBlockingUiStatus = jest.fn();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = false;
    service['proceedSaveRequest'] = jest.fn();
    service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockImplementation(() => Promise.resolve(false));

    await service.saveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(saveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(service['proceedSaveRequest']).toHaveBeenCalledTimes(0);
  });

  it('#saveRequest should called #proceedSaveRequest', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeBlockingUiStatus = jest.fn();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.isVoided = true;
    service['proceedSaveRequest'] = jest.fn();

    await service.saveRequest(saveRequestArg);

    expect(saveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(service['proceedSaveRequest']).toHaveBeenCalledTimes(1);
  });

  it('#proceedSaveRequest should showConfirm', async () => {
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.addRequestStore = new AddRequestStore();
    saveRequestArg.addRequestStore.changeSavingRequestStatus = jest.fn();
    service['proceedSaveRequest'] = jest.fn();

    const validationService = new ValidationService();
    validationService.checkCanShowConfirmationWrongOdds = jest.fn().mockImplementation(() => true);

    const popupService = new PopupService(null);
    const spyShowConfirm = jest.spyOn(popupService, 'showConfirm').mockImplementation(() => {});

    const saveRequestService = new SaveRequestService(validationService, null, popupService, null, null);
    saveRequestService['getMessageConfirmationWrongOdds'] = jest.fn().mockImplementation(() => 'aaa');
    saveRequestService['onClickConfirmSave'] = jest.fn();

    saveRequestService['proceedSaveRequest'](saveRequestArg);

    expect(validationService.checkCanShowConfirmationWrongOdds).toHaveBeenCalledTimes(1);
    expect(saveRequestService['getMessageConfirmationWrongOdds']).toHaveBeenCalledTimes(1);

    expect(spyShowConfirm.mock.calls[0][0]).toEqual('aaa');
    expect(spyShowConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(spyShowConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    spyShowConfirm.mock.calls[0][1]();
    expect(saveRequestService['onClickConfirmSave']).toHaveBeenCalledTimes(1);

    spyShowConfirm.mock.calls[0][2]();
    expect(saveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#proceedSaveRequest should called #executeSaveRequestApi', async () => {
    const saveRequestArg = new SaveRequestArg();
    const validationService = new ValidationService();
    validationService.checkCanShowConfirmationWrongOdds = jest.fn().mockImplementation(() => false);

    const saveRequestService = new SaveRequestService(validationService, null, null, null, null);
    saveRequestService['executeSaveRequestApi'] = jest.fn();

    saveRequestService['proceedSaveRequest'](saveRequestArg);

    expect(validationService.checkCanShowConfirmationWrongOdds).toHaveBeenCalledTimes(1);
    expect(saveRequestService['executeSaveRequestApi']).toHaveBeenCalledTimes(1);
  });

  it('#getMessageConfirmation should return expected msg', async () => {
    const expected = '<div>There are some warnings in this request.'
    + '</div><div>Ticket(s) on request will be unmarked.</div>'
    + '<div style=\"color:red\">Please remind this request undefined is confirmed by undefined.</div><div class=\'mg-top-10\'>'
    + '<i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>';
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.userId = 11111;
    saveRequestArg.isEdit = true;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = '2';
    saveRequestArg.actionIdOfFirstTimeAccess = '5';
    saveRequestArg.logInfoEvent = Helper.fakeLogInfoWrongOdds;
    saveRequestArg.logInfoEvent.logInfoDetail.settleCount = 1;
    saveRequestArg.logInfoEvent.messageValidationLogInfo.push({ isError: false, reason: 'aaa'});
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);

    const actual = service['getMessageConfirmationWrongOdds'](saveRequestArg);

    expect(actual).toBe(expected);
  });

  it('#getMessageConfirmationWrongOdds should return expected msg', async () => {
    const expected = '<div class=\'mg-top-10\'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>';
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.isEdit = false;
    saveRequestArg.logInfoEvent = new LogInfoWrongOdds();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = null;

    const actual = service['getMessageConfirmationWrongOdds'](saveRequestArg);

    expect(actual).toBe(expected);
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

  it('#initAddRequestQuery should return expected model when request is voided', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.others = new OthersModel();
    arg.filter.isVoided = true;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOdds;
    arg.primitiveProps = new PrimitiveProperty();
    arg.eventLeagueComponent = new EventLeagueComponent(null, null);
    arg.eventLeagueComponent.selectedMatch = new MatchModel();
    arg.eventLeagueComponent.selectedMatch.sportType = 2;
    service['getWrongOddsInfo'] = jest.fn();

    const actual = service['initAddRequestQuery'](arg);

    expect(actual).toBeDefined();
    expect(service['getWrongOddsInfo']).toHaveBeenCalledTimes(0);
  });

  it('#initAddRequestQuery should return expected model when transInfoAddRequestModel not null', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.others = new OthersModel();
    arg.filter.issueTypeId = IssueTypeConstant.WRONG_ODDS;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOdds;
    arg.eventLeagueComponent = new EventLeagueComponent(null, null);
    arg.eventLeagueComponent.selectedMatch = new MatchModel();
    arg.eventLeagueComponent.selectedMatch.sportType = 2;
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    service['getWrongOddsInfo'] = jest.fn();

    const actual = service['initAddRequestQuery'](arg);

    expect(actual).toBeDefined();
    expect(service['getWrongOddsInfo']).toHaveBeenCalledTimes(1);
  });

  it('#getWrongOddsInfo should return expected when isSubTypeOuOr1stOu', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.others = new OthersModel();
    arg.filter.issueTypeId = IssueTypeConstant.WRONG_1ST_HDP;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOdds;
    const validationService = new ValidationService();
    validationService.isSubTypeOuOr1stOu = jest.fn().mockImplementation(() => true);
    const saveRequestService = new SaveRequestService(validationService, null, null, null, null);

    const actual = saveRequestService['getWrongOddsInfo'](Helper.fakeLogInfoWrongOdds, '1');

    expect(actual).toBeDefined();
  });

  it('#getWrongOddsInfo should return expected when is not SubTypeOuOr1stOu', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.others = new OthersModel();
    arg.filter.issueTypeId = IssueTypeConstant.WRONG_1ST_HDP;
    arg.logInfoEvent = Helper.fakeLogInfoWrongOdds;
    const validationService = new ValidationService();
    validationService.isSubTypeOuOr1stOu = jest.fn().mockImplementation(() => false);
    const saveRequestService = new SaveRequestService(validationService, null, null, null, null);

    const actual = saveRequestService['getWrongOddsInfo'](Helper.fakeLogInfoWrongOdds, '1');

    expect(actual).toBeDefined();
  });
});