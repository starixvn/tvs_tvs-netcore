import { TestBed } from '@angular/core/testing';
import { LogInfoService } from './log-info.service';
import { CommonService } from '../../../../../../utility/services/common.service';
import { EventWrongOuService } from './event-wrong-ou.service';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { GetLogInfoModel } from '../../../../../models/get-log-info.model';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { PoolHouseTicketValue } from '../../../../../component/pool-house-ticket/pool-house-ticket.constant';
import { GetLogInfoViewModel } from '../../../../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../../models/trans-info-add-request.model';
import { Validation } from '../../../../../models/get-log-info.model';
import { ValidationMessage } from '../../../../../models/get-log-info.model';
import { StaticService } from '../../../../../../utility/services/static.service';

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
    isPoolHouseAffected: true
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
  let eventWrongOuService: jest.Mocked<EventWrongOuService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        { provide: CommonService, useValue: {
          getLogInfo: jest.fn()
        } },
        { provide: EventWrongOuService, useValue: {
          getWrongOuModel: jest.fn()
        } },
        { provide: StaticService, useValue: {
          getValidationMessageList: jest.fn().mockReturnValue([Helper.fakeValidationMessage]),
          isWrongOU: jest.fn().mockReturnValue(true)
        } }
      ]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    eventWrongOuService = TestBed.inject(EventWrongOuService) as jest.Mocked<EventWrongOuService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign results for wrong OU', async () => {
      // Arrange
      const allEvents: LogInfoWrongOu[] = [{
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        leagueName: 'Test League',
        eventName: 'Test Event',
        isPoolHouseAffected: false,
        poolHouseCheckedBetTypes: PoolHouseTicketValue.SELECT_ALL_BETTYPE,
        logInfoDetail: null,
        messageValidationLogInfo: null,
        isShowValidation: false,
        filterWrongOu: null,
        linkedLogsViewModel: null,
        eventDate: null,
        sportType: 1
      } as LogInfoWrongOu];
      const isEdit = false;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;
      const primitiveProps = new PrimitiveProperty();

      const mockResponse = {
        transInfoAddRequestModel: Helper.fakeTransInfoAddRequestModel,
        getLogInfoModels: [Helper.fakeGetLogInfoModel]
      } as GetLogInfoViewModel;

      commonService.getLogInfo.mockResolvedValue(mockResponse);
      eventWrongOuService.getWrongOuModel.mockReturnValue([{
        matchId: Helper.fakeMatchId,
        subIssueTypeId: 1,
        poolHouseCheckedBetTypes: PoolHouseTicketValue.SELECT_ALL_BETTYPE,
        isMainMatch: true,
        wrongMarket: '1',
        filterFromTransTime: '2024-03-20T10:00:00',
        filterToTransTime: '2024-03-20T11:00:00',
        liveIndicator: 1,
        filterBetTypeId: '1',
        filterBetIdX: 'X',
        filterBetIdY: 'Y',
        isLinkGroup1X2: true,
        isLinkGroupAIO: false
      }]);

      // Act
      await service.getLogInfo(allEvents, isEdit, requestId, filter, primitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toBeDefined();
      expect(allEvents[0].logInfoDetail).toBeDefined();
      expect(allEvents[0].messageValidationLogInfo).toBeDefined();
      expect(allEvents[0].isPoolHouseAffected).toBe(true);
      expect(allEvents[0].poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.SELECT_ALL_BETTYPE);
    });

    it('should get log info and assign results for non-pool house affected event', async () => {
      // Arrange
      const allEvents: LogInfoWrongOu[] = [{
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        leagueName: 'Test League',
        eventName: 'Test Event',
        isPoolHouseAffected: false,
        poolHouseCheckedBetTypes: '',
        logInfoDetail: null,
        messageValidationLogInfo: null,
        isShowValidation: false,
        filterWrongOu: null,
        linkedLogsViewModel: null,
        eventDate: null,
        sportType: 1
      } as LogInfoWrongOu];
      const isEdit = false;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;
      const primitiveProps = new PrimitiveProperty();

      const mockResponse = {
        transInfoAddRequestModel: Helper.fakeTransInfoAddRequestModel,
        getLogInfoModels: [{
          ...Helper.fakeGetLogInfoModel,
          validation: {
            ...Helper.fakeValidation,
            isPoolHouseAffected: false
          }
        }]
      } as GetLogInfoViewModel;

      commonService.getLogInfo.mockResolvedValue(mockResponse);
      eventWrongOuService.getWrongOuModel.mockReturnValue([{
        matchId: Helper.fakeMatchId,
        subIssueTypeId: 1,
        poolHouseCheckedBetTypes: '',
        isMainMatch: true,
        wrongMarket: '1',
        filterFromTransTime: '2024-03-20T10:00:00',
        filterToTransTime: '2024-03-20T11:00:00',
        liveIndicator: 1,
        filterBetTypeId: '1',
        filterBetIdX: 'X',
        filterBetIdY: 'Y',
        isLinkGroup1X2: true,
        isLinkGroupAIO: false
      }]);

      // Act
      await service.getLogInfo(allEvents, isEdit, requestId, filter, primitiveProps);

      // Assert
      expect(allEvents[0].isPoolHouseAffected).toBe(false);
      expect(allEvents[0].poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.NOT_AFFECTED);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info of events', () => {
      // Arrange
      const events: LogInfoWrongOu[] = [{
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        leagueName: 'Test League',
        eventName: 'Test Event',
        isPoolHouseAffected: false,
        poolHouseCheckedBetTypes: '',
        logInfoDetail: Helper.fakeLogInfoDetail,
        messageValidationLogInfo: [Helper.fakeValidationMessage],
        isShowValidation: true,
        filterWrongOu: null,
        linkedLogsViewModel: null,
        eventDate: null,
        sportType: 1
      } as LogInfoWrongOu];

      // Act
      service.resetLogInfoOfEvent(events);

      // Assert
      expect(events[0].isShowValidation).toBe(false);
      expect(events[0].logInfoDetail).toBeNull();
      expect(events[0].messageValidationLogInfo).toBeNull();
    });
  });
});
