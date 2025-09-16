import { TestBed } from '@angular/core/testing';
import { GetLogInfoViewModel } from '../../../../../add-request-new/models/get-log-info.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoModel, Validation, ValidationMessage } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { PoolHouseTicketValue } from '../../pool-house-ticket/pool-house-ticket.constant';
import { WrongHdpGetLogInfoQuery } from '../models/get-log-info.query';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongHdpService } from './event-wrong-hdp.service';
import { LogInfoService } from './log-info.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeLogInfoDetail = {
    matchId: Helper.fakeMatchId,
    liveScores: '',
    transVoidToTime: null,
    singleCount: 0,
    cashOutCount: 0,
    settleCount: 0,
    instantlySettleCount: 0,
    mainParlayCount: 0,
    cancelCashOutCount: 0,
    voidFromTime: new Date('2024-03-20T10:00:00'),
    voidToTime: new Date('2024-03-20T11:00:00'),
    highlightMinTime: null,
    highlightAcceptType: null,
    scoreNormalTicket: '',
    scoreOfMatch: '',
    poolHouseSingleCount: 0,
    poolHouseCashOutCount: 0,
    poolHouseSettleCount: 0,
    poolHouseMainParlayCount: 0,
    poolHouseInstantlySettleCount: 0,
    minTransId: '',
    actionType: '',
    isHasWarningRangeTime: false,
    logInfoTicketsJson: null
  } as LogInfoDetail;

  static readonly fakeValidation = {
    isInvalidTotalTickets: false,
    isExistedInOtherRequest: false,
    isExistsSecondAccept: false,
    isHasSettledTicket: false,
    isHasInstantlySettledTicket: false,
  } as Validation;

  static readonly fakeGetLogInfoModel = {
    matchId: Helper.fakeMatchId,
    logInfoDetail: Helper.fakeLogInfoDetail,
    validation: Helper.fakeValidation,
    ticketRequest: [],
    betTypeCount: []
  } as GetLogInfoModel;

  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1'
  } as FilterModel;

  static readonly fakeTransInfoAddRequestModel = {
    transInfoJson: null,
    unMarkTransIds: '',
    markTransIds: '',
    removeTransIds: ''
  } as TransInfoAddRequestModel;

  static readonly fakeWrongHdpGetLogInfoQuery = {
    matchId: Helper.fakeMatchId,
    isMainMatch: true,
    subIssueTypeId: 1,
    filterFromTransTime: '2024-03-20T10:00:00',
    filterToTransTime: '2024-03-20T11:00:00',
    liveIndicator: 1,
    filterBetTypeId: '1',
    filterBetIdX: 'X',
    filterBetIdY: 'Y',
    isLinkGroup1X2: true,
    isLinkGroupAIO: false,
    homeFavorite: 'HOME',
    awayFavorite: 'AWAY',
    hdpValue: '1.5',
    poolHouseCheckedBetTypes: 'All'
  } as WrongHdpGetLogInfoQuery;

  static readonly fakeValidationMessage = {
    isError: true,
    reason: 'Test error message',
    isShowPopup: false,
    transIds: '',
    requestId: 1
  } as ValidationMessage;
}

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: jest.Mocked<CommonService>;
  let eventWrongHdpService: jest.Mocked<EventWrongHdpService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        { provide: CommonService, useValue: {
          getLogInfo: jest.fn()
        } },
        { provide: EventWrongHdpService, useValue: {
          getWrongHdpModel: jest.fn()
        } },
        { provide: StaticService, useValue: {
          getValidationMessageList: jest.fn().mockReturnValue([Helper.fakeValidationMessage])
        } }
      ]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    eventWrongHdpService = TestBed.inject(EventWrongHdpService) as jest.Mocked<EventWrongHdpService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign results for wrong HDP', async () => {
      // Arrange
      const allEvents: LogInfoWrongHdp[] = [{
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        leagueName: 'Test League',
        eventName: 'Test Event',
        poolHouseCheckedBetTypes: PoolHouseTicketValue.SELECT_ALL_BETTYPE,
        logInfoDetail: null,
        messageValidationLogInfo: null,
        isShowValidation: false,
        filterWithHdp: null,
        linkedLogsViewModel: null,
        eventDate: null,
        sportType: 1
      } as LogInfoWrongHdp];
      const isEdit = false;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;
      const primitiveProps = new PrimitiveProperty();

      const mockResponse = {
        transInfoAddRequestModel: Helper.fakeTransInfoAddRequestModel,
        getLogInfoModels: [Helper.fakeGetLogInfoModel]
      } as GetLogInfoViewModel;

      commonService.getLogInfo.mockResolvedValue(mockResponse);
      eventWrongHdpService.getWrongHdpModel.mockReturnValue([Helper.fakeWrongHdpGetLogInfoQuery]);

      // Act
      await service.getLogInfo(allEvents, isEdit, requestId, filter, primitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toBeDefined();
      expect(allEvents[0].logInfoDetail).toBeDefined();
      expect(allEvents[0].messageValidationLogInfo).toBeDefined();
      expect(allEvents[0].poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.SELECT_ALL_BETTYPE);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info of events', () => {
      // Arrange
      const events: LogInfoWrongHdp[] = [{
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        leagueName: 'Test League',
        eventName: 'Test Event',
        poolHouseCheckedBetTypes: '',
        logInfoDetail: Helper.fakeLogInfoDetail,
        messageValidationLogInfo: [Helper.fakeValidationMessage],
        isShowValidation: true,
        filterWithHdp: null,
        linkedLogsViewModel: null,
        eventDate: null,
        sportType: 1
      } as LogInfoWrongHdp];

      // Act
      service.resetLogInfoOfEvent(events);

      // Assert
      expect(events[0].isShowValidation).toBe(false);
      expect(events[0].logInfoDetail).toBeNull();
      expect(events[0].messageValidationLogInfo).toBeNull();
    });
  });
});
