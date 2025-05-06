import { TestBed } from '@angular/core/testing';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';
import { EventWrongOddsService } from './event-wrong-odds.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { PoolHouseTicketValue } from '../../pool-house-ticket/pool-house-ticket.constant';
import { FilterModel } from '../../filter/filter.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { GetLogInfoViewModel } from '../../models/get-log-info.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { WrongOddsGetLogInfoQuery } from '../models/get-log-info.query';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let eventWrongOddsService: EventWrongOddsService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        LogInfoService,
        EventWrongOddsService,
        AddRequestApiService,
        ValidationService,
        CommonService
      ]
    });
    service = TestBed.inject(LogInfoService);
    eventWrongOddsService = TestBed.inject(EventWrongOddsService);
    commonService = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info successfully', async () => {
      // Arrange
      const mockLogInfoDetail = new LogInfoDetail();
      mockLogInfoDetail.matchId = 123;
      mockLogInfoDetail.voidFromTime = new Date('2024-03-31T01:53:32.508Z');
      mockLogInfoDetail.voidToTime = new Date('2024-03-31T01:53:32.508Z');
      mockLogInfoDetail.singleCount = 1;
      mockLogInfoDetail.cashOutCount = 0;
      mockLogInfoDetail.settleCount = 0;
      mockLogInfoDetail.instantlySettleCount = 0;
      mockLogInfoDetail.mainParlayCount = 0;
      mockLogInfoDetail.cancelCashOutCount = 0;

      const mockLogInfoWrongOdds = new LogInfoWrongOdds();
      mockLogInfoWrongOdds.logInfoDetail = mockLogInfoDetail;
      mockLogInfoWrongOdds.messageValidationLogInfo = [{ isError: false, reason: '' }];
      mockLogInfoWrongOdds.isPoolHouseAffected = false;
      mockLogInfoWrongOdds.poolHouseCheckedBetTypes = PoolHouseTicketValue.NOT_AFFECTED;

      const mockFilter = new FilterModel();
      const mockPrimitiveProps = new PrimitiveProperty();
      const mockGetLogInfoResponse = new GetLogInfoViewModel();
      mockGetLogInfoResponse.getLogInfoModels = [{
        matchId: 123,
        logInfoDetail: mockLogInfoDetail,
        validation: {
          isInvalidTotalTickets: false,
          isExistedInOtherRequest: false,
          isExistsSecondAccept: false,
          isHasSettledTicket: false,
          isHasInstantlySettledTicket: false,
          isPoolHouseAffected: false
        },
        ticketRequest: []
      }];

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockGetLogInfoResponse);
      eventWrongOddsService.getWrongOddsModel = jest.fn().mockReturnValue({} as WrongOddsGetLogInfoQuery);

      // Act
      await service.getLogInfo(mockLogInfoWrongOdds, false, 0, mockFilter, mockPrimitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(mockPrimitiveProps.transInfoAddRequestModel).toEqual(mockGetLogInfoResponse.transInfoAddRequestModel);
      expect(mockLogInfoWrongOdds.logInfoDetail).toBeDefined();
      expect(mockLogInfoWrongOdds.messageValidationLogInfo).toBeDefined();
      expect(mockLogInfoWrongOdds.isPoolHouseAffected).toBeFalsy();
      expect(mockLogInfoWrongOdds.poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.NOT_AFFECTED);
    });

    it('should handle case when log info model is not found', async () => {
      // Arrange
      const mockLogInfoWrongOdds = new LogInfoWrongOdds();
      mockLogInfoWrongOdds.matchId = 123;
      mockLogInfoWrongOdds.logInfoDetail = new LogInfoDetail();
      mockLogInfoWrongOdds.messageValidationLogInfo = [{ isError: false, reason: '' }];
      mockLogInfoWrongOdds.isPoolHouseAffected = false;
      mockLogInfoWrongOdds.poolHouseCheckedBetTypes = PoolHouseTicketValue.NOT_AFFECTED;

      const mockFilter = new FilterModel();
      const mockPrimitiveProps = new PrimitiveProperty();
      const mockGetLogInfoResponse = new GetLogInfoViewModel();
      mockGetLogInfoResponse.getLogInfoModels = [];

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockGetLogInfoResponse);
      eventWrongOddsService.getWrongOddsModel = jest.fn().mockReturnValue({} as WrongOddsGetLogInfoQuery);

      // Save initial state
      const initialState = {
        logInfoDetail: mockLogInfoWrongOdds.logInfoDetail,
        messageValidationLogInfo: mockLogInfoWrongOdds.messageValidationLogInfo,
        isPoolHouseAffected: mockLogInfoWrongOdds.isPoolHouseAffected,
        poolHouseCheckedBetTypes: mockLogInfoWrongOdds.poolHouseCheckedBetTypes
      };

      // Act
      await service.getLogInfo(mockLogInfoWrongOdds, false, 0, mockFilter, mockPrimitiveProps);

      // Assert
      expect(mockLogInfoWrongOdds.logInfoDetail).toEqual(initialState.logInfoDetail);
      expect(mockLogInfoWrongOdds.messageValidationLogInfo).toEqual(initialState.messageValidationLogInfo);
      expect(mockLogInfoWrongOdds.isPoolHouseAffected).toBe(initialState.isPoolHouseAffected);
      expect(mockLogInfoWrongOdds.poolHouseCheckedBetTypes).toBe(initialState.poolHouseCheckedBetTypes);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset all log info properties', () => {
      // Arrange
      const mockLogInfoWrongOdds = new LogInfoWrongOdds();
      mockLogInfoWrongOdds.logInfoDetail = new LogInfoDetail();
      mockLogInfoWrongOdds.messageValidationLogInfo = [{ isError: true, reason: 'test' }];

      // Act
      service.resetLogInfoOfEvent(mockLogInfoWrongOdds);

      // Assert
      expect(mockLogInfoWrongOdds.logInfoDetail).toBeNull();
      expect(mockLogInfoWrongOdds.messageValidationLogInfo).toBeNull();
    });
  });
});