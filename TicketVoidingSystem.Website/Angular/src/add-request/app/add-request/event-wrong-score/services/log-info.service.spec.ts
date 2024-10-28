import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { LogInfoService } from './log-info.service';
import { WrongScoreService } from './wrong-score.service';

class Helper {
  static readonly fakeRequestId = 1001;
  static readonly fakeFirstMatchId = 1111;
  static readonly fakeSecondMatchId = 2222;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeAllowanceTime: AllowanceTime = {
    aaTime: 1,
    paTime: 1,
    saTime: 1,
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
  } as LogInfoDetail;
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
  },
  {
    scoreId: 5465,
    isActive: false,
    wrongScore: '2-1',
    subIssueTypeId: 5,
    filterBy: 1,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    actualScore: '',
    matchId: 900000,
    isChecked: false,
    eventDate: null,
    voidFromTime: Helper.fakeFromDateTime,
    voidToTime: Helper.fakeToDateTime,
  }];
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: Helper.fakeRequestId,
  } as TicketRequest;
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
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    getLogInfoModels: [Helper.fakeGetLogInfoModel],
  };
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  } as FilterModel;
}

describe('LogInfoService', () => {
  let commonService: CommonService;
  let logInfoService: LogInfoService;

  beforeEach(() => {
    commonService = new CommonService(null);
    logInfoService = new LogInfoService(null, commonService);
  });

  it('#getLogInfo should call #assignResultsGetLogInfoToListModel', async () => {
    // Arrange
    const mockCommonService = new CommonService(null);
    mockCommonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const mockLogInfoService = new LogInfoService(null, mockCommonService);
    mockLogInfoService['assignResultsGetLogInfoToModel'] = jest.fn();
    mockLogInfoService['assignResultsGetLogInfoToListModel'] = jest.fn();
    mockLogInfoService['initGetLogInfoQueries'] = jest.fn();

    await mockLogInfoService.getLogInfo(false, 1, 1, new FilterModel(), {filterBy: 1} as PrimitiveProperty, []);

    expect(mockLogInfoService['assignResultsGetLogInfoToListModel']).toBeCalledTimes(1);
  });

  it('#getLogInfo should call #assignResultsGetLogInfoToModel', async () => {
    // Arrange
    const mockCommonService = new CommonService(null);
    mockCommonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const mockLogInfoService = new LogInfoService(null, mockCommonService);
    mockLogInfoService['assignResultsGetLogInfoToModel'] = jest.fn();
    mockLogInfoService['initGetLogInfoQueries'] = jest.fn();

    await mockLogInfoService.getLogInfo(false, 1, 1, new FilterModel(), {filterBy: 2} as PrimitiveProperty, []);

    expect(mockLogInfoService['assignResultsGetLogInfoToModel']).toBeCalledTimes(1);
  });

  it('#getWrongScoreModel should be return query', async () => {
    // Arrange
    const wrongScoreService = new WrongScoreService(null, null);
    wrongScoreService.getFilterByBaseOnSubIssueType = jest.fn();
    logInfoService = new LogInfoService(wrongScoreService, null);

    // Action
    const result = logInfoService['getWrongScoreModel'](1, Helper.fakeFilterModel, Helper.fakeWrongScoreModels);

    // Assert
    expect(result.length).toEqual(Helper.fakeWrongScoreModels.length);
  });
});
