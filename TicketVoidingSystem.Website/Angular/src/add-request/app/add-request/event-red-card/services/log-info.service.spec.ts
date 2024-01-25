import * as _ from 'lodash';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { IssueType } from '../../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { CommonService } from '../../../../../utility/services/common.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation, ValidationMessage } from '../../models/get-log-info.model';
import { AddRequestResultModel } from '../../models/request.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { PrimitiveProperty } from '../event-red-card.model';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCard } from '../log-info-red-card/log-info-red-card.model';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeRequestId = 1001;
  static readonly fakeFirstMatchId = 1111;
  static readonly fakeSecondMatchId = 2222;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeFilterTimeWithAllowance: FilterTimeWithAllowance = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
    aaTime: 1,
    paTime: 12,
    saTime: 12,
  };
  static readonly fakeValidation: Validation = {
    isInvalidTotalTickets: true,
    isExistedInOtherRequest: true,
    isPoolHouseAffected: false
  } as Validation;
  static readonly fakeAddRequestResultModel: AddRequestResultModel = {
    requestId: 1111,
    matchId: ''
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
      matchId: Helper.fakeFirstMatchId,
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
    } as LogInfoDetail;
  static readonly fakeLogInfoRedCard: LogInfoRedCard = {
    matchId: Helper.fakeFirstMatchId,
    isMainMatch: true,
    eventName: '',
    leagueName: '',
    subIssueTypeId: 7,
    voidTimeArea: Helper.fakeFilterTimeWithAllowance,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [Helper.fakeValidationMessageNotError],
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  };
  static fakeIssueType: IssueType[] = [{
    issueTypeId: 11,
    issueTypeName: "Danger Accepted",
  }];
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: Helper.fakeFirstMatchId,
    validation: {
      isInvalidTotalTickets: false,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: false
    } as Validation,
    ticketRequest: [{
      transIds: '123456789',
      requestId: 123
    } as TicketRequest],
    logInfoDetail: Helper.fakeLogInfoDetail
  };
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: Helper.fakeRequestId,
  } as TicketRequest;
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    getLogInfoModels: [Helper.fakeGetLogInfoModel]
  };
}

describe('LogInfoService', () => {
  let logInfoService: LogInfoService;
  let mockCommonService: CommonService;
  let mockValidationService: ValidationService;
  let mockAddRequestApiService: AddRequestApiService;

  beforeEach(() => {
    mockValidationService = new ValidationService();
    mockValidationService.isEventMatchValid = jest.fn();
    mockValidationService.isHasAllowanceTime = jest.fn();
    mockValidationService.validateCommonData = jest.fn();
    mockAddRequestApiService = new AddRequestApiService(null);
    mockCommonService = new CommonService(null);
  });

  it('#getLogInfo should update expected model', async () => {
    // Arrange
    const firstEvent = _.clone(Helper.fakeLogInfoRedCard);
    const secondEvent = _.clone(Helper.fakeLogInfoRedCard);
    firstEvent.matchId = Helper.fakeFirstMatchId;
    secondEvent.matchId = Helper.fakeSecondMatchId;
    const allEvents = [...[firstEvent], ...[secondEvent]];
    logInfoService = new LogInfoService(null, mockCommonService);
    logInfoService['initGetLogInfoRedCardQuery'] = jest.fn().mockImplementation(() => new GetLogInfoQuery());
    logInfoService['assignResultLogInfoToEvents'] = jest.fn();
    const spyCommonServiceGetLogInfo = jest.spyOn(mockCommonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));

    // Action
    await logInfoService.getLogInfo(allEvents, {filterBy: 1} as PrimitiveProperty, true, 1, Helper.fakeFilterModel, Helper.fakeFilterTimeWithAllowance);

    // Assert
    expect(logInfoService['initGetLogInfoRedCardQuery']).toHaveBeenCalledTimes(1);
    expect(logInfoService['assignResultLogInfoToEvents']).toHaveBeenCalledTimes(1);
    expect(spyCommonServiceGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should update expected model when have not void time', async () => {
    // Arrange
    const firstEvent = _.clone(Helper.fakeLogInfoRedCard);
    const secondEvent = _.clone(Helper.fakeLogInfoRedCard);
    firstEvent.matchId = Helper.fakeFirstMatchId;
    secondEvent.matchId = Helper.fakeSecondMatchId;
    const allEvents = [...[firstEvent], ...[secondEvent]];
    const validationService = new ValidationService();
    validationService.isHasAllowanceTime = jest.fn().mockImplementation(() => true);
    mockCommonService.getLogInfo = jest.fn().mockImplementation(() => new GetLogInfoViewModel());
    logInfoService = new LogInfoService(validationService, mockCommonService);
    logInfoService['assignResultLogInfoToEvents'] = jest.fn();
    logInfoService['getTransInfo'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(allEvents, {filterBy: 1} as PrimitiveProperty, true, 1, Helper.fakeFilterModel, Helper.fakeFilterTimeWithAllowance);

    // Assert
    expect(logInfoService['assignResultLogInfoToEvents']).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should update expected model when isHasAllowanceTime is false', async () => {
    // Arrange
    const firstEvent = _.clone(Helper.fakeLogInfoRedCard);
    const secondEvent = _.clone(Helper.fakeLogInfoRedCard);
    firstEvent.matchId = Helper.fakeFirstMatchId;
    secondEvent.matchId = Helper.fakeSecondMatchId;
    const allEvents = [...[firstEvent], ...[secondEvent]];
    const validationService = new ValidationService();
    validationService.isHasAllowanceTime = jest.fn().mockImplementation(() => false);
    mockCommonService.getLogInfo = jest.fn().mockImplementation(() => new GetLogInfoViewModel());
    logInfoService = new LogInfoService(validationService, mockCommonService);
    logInfoService['assignResultLogInfoToEvents'] = jest.fn();
    logInfoService['getTransInfo'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(allEvents, {filterBy: 1} as PrimitiveProperty, true, 1, Helper.fakeFilterModel, Helper.fakeFilterTimeWithAllowance);

    // Assert
    expect(logInfoService['assignResultLogInfoToEvents']).toHaveBeenCalledTimes(1);
  });

  it('#initGetLogInfoRedCardQuery should be return expected model when edit request red card', async () => {
    // Arrange
    const fakeFilterModel = Helper.fakeFilterModel;
    fakeFilterModel.issueTypeId = IssueTypeConstant.RED_CARD;
    const validationService = new ValidationService();
    validationService.isHasAllowanceTime = jest.fn().mockImplementation(() => true);
    logInfoService = new LogInfoService(validationService, null);
    logInfoService['getTransInfo'] = jest.fn();

    // Action
    const result = logInfoService['initGetLogInfoRedCardQuery'](1, true, Helper.fakeRequestId,
      fakeFilterModel, [Helper.fakeLogInfoRedCard], Helper.fakeFilterTimeWithAllowance);

    // Assert
    expect(result.requestId).toEqual(Helper.fakeRequestId);
    expect(result.issueTypeId.toString()).toEqual(Helper.fakeFilterModel.issueTypeId);
    expect(result.actionId.toString()).toEqual(Helper.fakeFilterModel.action);
  });

  it('#initGetLogInfoRedCardQuery should be return expected model when add request danger accepted', async () => {
    // Arrange
    const fakeFilterModel = Helper.fakeFilterModel;
    fakeFilterModel.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    const validationService = new ValidationService();
    validationService.isHasAllowanceTime = jest.fn().mockImplementation(() => true);
    logInfoService = new LogInfoService(validationService, null);
    logInfoService['getTransInfo'] = jest.fn();

    // Action
    const result = logInfoService['initGetLogInfoRedCardQuery'](1, false, Helper.fakeRequestId,
      fakeFilterModel, [Helper.fakeLogInfoRedCard], Helper.fakeFilterTimeWithAllowance);

    // Assert
    expect(result.requestId).toBeNull();
    expect(result.issueTypeId.toString()).toEqual(Helper.fakeFilterModel.issueTypeId);
    expect(result.actionId.toString()).toEqual(Helper.fakeFilterModel.action);
  });

  it('#initGetLogInfoRedCardQuery should be return expected model', async () => {
    // Arrange
    const validationService = new ValidationService();
    validationService.isHasAllowanceTime = jest.fn().mockImplementation(() => true);
    logInfoService = new LogInfoService(validationService, null);
    logInfoService['getTransInfo'] = jest.fn();

    // Action
    const result = logInfoService['initGetLogInfoRedCardQuery'](1, false, Helper.fakeRequestId,
      Helper.fakeFilterModel, [Helper.fakeLogInfoRedCard], Helper.fakeFilterTimeWithAllowance);

    // Assert
    expect(result.requestId).toBeNull();
    expect(result.issueTypeId.toString()).toEqual(Helper.fakeFilterModel.issueTypeId);
    expect(result.actionId.toString()).toEqual(Helper.fakeFilterModel.action);
  });

  it('#assignResultLogInfoToEvents should be update data', async () => {
    // Arrange
    const fakeLogInfoRedCard = _.clone(Helper.fakeLogInfoRedCard);
    const fakeGetLogInfoModel = _.clone(Helper.fakeGetLogInfoModel);
    fakeLogInfoRedCard.matchId = Helper.fakeFirstMatchId;
    fakeGetLogInfoModel.matchId = Helper.fakeFirstMatchId;
    logInfoService = new LogInfoService(mockValidationService, null);
    const spyValidationServiceIsHasAllowanceTime = jest.spyOn(mockValidationService, 'isHasAllowanceTime').mockImplementation(() => true);

    // Action
    logInfoService['assignResultLogInfoToEvents']([fakeLogInfoRedCard], [fakeGetLogInfoModel]);

    // Assert
    expect(spyValidationServiceIsHasAllowanceTime).toHaveBeenCalledTimes(1);
  });

  it('#assignResultLogInfoToEvents should be update data when have logInfo but have not logInfoDetail', async () => {
    // Arrange
    const fakeLogInfoRedCard = _.clone(Helper.fakeLogInfoRedCard);
    const fakeGetLogInfoModel = _.clone(Helper.fakeGetLogInfoModel);
    fakeLogInfoRedCard.matchId = Helper.fakeFirstMatchId;
    fakeGetLogInfoModel.matchId = Helper.fakeFirstMatchId;
    fakeGetLogInfoModel.logInfoDetail = null;
    logInfoService = new LogInfoService(mockValidationService, null);
    const spyValidationServiceIsHasAllowanceTime = jest.spyOn(mockValidationService, 'isHasAllowanceTime').mockImplementation(() => true);

    // Action
    logInfoService['assignResultLogInfoToEvents']([fakeLogInfoRedCard], [fakeGetLogInfoModel]);

    // Assert
    expect(spyValidationServiceIsHasAllowanceTime).toHaveBeenCalledTimes(0);
  });

  it('#assignResultLogInfoToEvents should be update data when have not logInfo', async () => {
    // Arrange
    const fakeLogInfoRedCard = _.clone(Helper.fakeLogInfoRedCard);
    const fakeGetLogInfoModel = _.clone(Helper.fakeGetLogInfoModel);
    fakeLogInfoRedCard.matchId = Helper.fakeFirstMatchId;
    fakeGetLogInfoModel.matchId = null;
    fakeGetLogInfoModel.logInfoDetail = null;
    logInfoService = new LogInfoService(mockValidationService, null);
    const spyValidationServiceIsHasAllowanceTime = jest.spyOn(mockValidationService, 'isHasAllowanceTime').mockImplementation(() => true);
    logInfoService['getValidationMessageList'] = jest.fn();

    // Action
    logInfoService['assignResultLogInfoToEvents']([fakeLogInfoRedCard], [fakeGetLogInfoModel]);

    // Assert
    expect(spyValidationServiceIsHasAllowanceTime).toHaveBeenCalledTimes(0);
    expect(logInfoService['getValidationMessageList']).toHaveBeenCalledTimes(0);
  });

  it('#resetAllEventBeforeSearch should be call expect function', async () => {
    // Arrange
    logInfoService = new LogInfoService(mockValidationService, null);
    logInfoService['resetSubIssueTypeOfEvent'] = jest.fn();
    logInfoService['resetLogInfoOfEvent'] = jest.fn();
    logInfoService['resetVoidTimeArea'] = jest.fn();
    logInfoService['resetIsCheckedVar'] = jest.fn();

    // Action
    logInfoService['resetAllEventBeforeSearch'](null, null, null);

    // Assert
    expect(logInfoService['resetSubIssueTypeOfEvent']).toHaveBeenCalledTimes(1);
    expect(logInfoService['resetLogInfoOfEvent']).toHaveBeenCalledTimes(1);
    expect(logInfoService['resetVoidTimeArea']).toHaveBeenCalledTimes(1);
  });

  it('#resetLogInfoOfEvent should be update data', async () => {
    // Arrange
    const fakeLogInfoRedCard = _.clone(Helper.fakeLogInfoRedCard);
    logInfoService = new LogInfoService(mockValidationService, null);

    // Action
    logInfoService['resetLogInfoOfEvent']([fakeLogInfoRedCard]);

    // Assert
    expect(fakeLogInfoRedCard.logInfoDetail).toBeNull();
    expect(fakeLogInfoRedCard.messageValidationLogInfo).toBeNull();
  });

  it('#resetSubIssueTypeOfEvent should be update data', async () => {
    // Arrange
    const fakeLogInfoRedCard = _.clone(Helper.fakeLogInfoRedCard);
    logInfoService = new LogInfoService(mockValidationService, null);

    // Action
    logInfoService['resetSubIssueTypeOfEvent']([fakeLogInfoRedCard], 17);

    // Assert
    expect(fakeLogInfoRedCard.subIssueTypeId).toEqual(17);
  });

  it('#resetVoidTimeArea should be update data', async () => {
    // Arrange
    const fakeLogInfoRedCard = _.clone(Helper.fakeLogInfoRedCard);
    logInfoService = new LogInfoService(mockValidationService, null);

    // Action
    logInfoService['resetVoidTimeArea']([fakeLogInfoRedCard], Helper.fakeFilterTimeWithAllowance);

    // Assert
    expect(fakeLogInfoRedCard.voidTimeArea.aaTime).toEqual(Helper.fakeFilterTimeWithAllowance.aaTime);
    expect(fakeLogInfoRedCard.voidTimeArea.paTime).toEqual(Helper.fakeFilterTimeWithAllowance.paTime);
    expect(fakeLogInfoRedCard.voidTimeArea.saTime).toEqual(Helper.fakeFilterTimeWithAllowance.saTime);
    expect(fakeLogInfoRedCard.voidTimeArea.fromDateTime).toEqual(Helper.fakeFilterTimeWithAllowance.fromDateTime);
    expect(fakeLogInfoRedCard.voidTimeArea.toDateTime).toEqual(Helper.fakeFilterTimeWithAllowance.toDateTime);
  });

  it('#resetIsCheckedVar should be update data', async () => {
    // Arrange
    const fakeLogInfoRedCard = _.clone(Helper.fakeLogInfoRedCard);
    logInfoService = new LogInfoService(null, null);

    // Action
    logInfoService['resetIsCheckedVar']([fakeLogInfoRedCard]);

    // Assert
    expect(fakeLogInfoRedCard.isCheckedVar).toBeNull();
    expect(fakeLogInfoRedCard.isHighLightVarCheck).toBeNull();
  });

  it('#updateIsCheckedVar should updateIsCheckedVar is expected', async () => {
    // Arrange
    const fakeLogInfoRedCard = _.clone(Helper.fakeLogInfoRedCard);
    fakeLogInfoRedCard.subIssueTypeId = SubIssueTypeConstant.GOAL;
    logInfoService = new LogInfoService(null, null);

    // Action
    logInfoService['updateIsCheckedVar']([fakeLogInfoRedCard], true);

    // Assert
    expect(fakeLogInfoRedCard.isCheckedVar).toBeTruthy();
    expect(fakeLogInfoRedCard.isHighLightVarCheck).toBeFalsy();
  });

});
