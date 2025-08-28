import { TestBed } from '@angular/core/testing';
import { LogInfoService } from './log-info.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoModel, GetLogInfoViewModel } from '../../../../../models/get-log-info.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { TransInfoAddRequestModel } from '../../../../../models/trans-info-add-request.model';
import { WrongOddsSportsBookGetLogInfoQuery } from '../models/get-log-info.query';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: CommonService;
  let eventWrongOddsSportsBookService: EventWrongOddsSportsBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LogInfoService, EventWrongOddsSportsBookService]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService);
    eventWrongOddsSportsBookService = TestBed.inject(EventWrongOddsSportsBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign results correctly', async () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        filterWrongOddsSportsBook: {
          fromDateTime: '2024-01-01',
          toDateTime: '2024-01-02',
          filterOddsType: '1',
          oddsValue: 1.5,
          filterBetType: '1',
          filterBetStatus: '1',
          filterBetResult: '1',
          filterBetAmount: 100,
          fromOdds: 1.5,
          toOdds: 2.5,
          correctOdds: 1.8,
          liveIndicator: '1'
        } as unknown as FilterWrongOddsSportsBookModel,
        logInfoDetail: null,
        betTeamsResult: [],
        isHasSettledTicket: false,
        isHasInstantlySettledTicket: false,
        messageValidationLogInfo: [],
        allBetTypesSelection: []
      } as LogInfoWrongOddsSportsBook;

      const mockFilter = {
        action: '1',
        issueTypeId: '2',
        subIssueTypeId: '3'
      } as FilterModel;

      const mockPrimitiveProps = {} as PrimitiveProperty;

      const mockViewModel = {
        transInfoAddRequestModel: {
          transInfoJson: '',
          unMarkTransIds: '',
          markTransIds: '',
          removeTransIds: ''
        } as TransInfoAddRequestModel,
        getLogInfoModels: [{
          matchId: 123,
          validation: {
            isHasSettledTicket: true,
            isHasInstantlySettledTicket: false,
            isPoolHouseAffected: false,
            isInvalidTotalTickets: false,
            isExistedInOtherRequest: false,
            isExistsSecondAccept: false
          },
          logInfoDetail: null,
          ticketRequest: []
        }],
        infoSiteDBDownModel: null
      } as GetLogInfoViewModel;

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);
      jest.spyOn(eventWrongOddsSportsBookService, 'getWrongOddsSportsBookGetLogInfoModel').mockReturnValue({
        matchId: 123,
        subIssueTypeId: 3,
        filterFromTransTime: '2024-01-01',
        filterToTransTime: '2024-01-02',
        liveIndicator: '1',
        filterOddsType: '1',
        oddsValue: 1.5,
        fromOdds: 1.5,
        toOdds: 2.5,
        correctOdds: 1.8
      } as unknown as WrongOddsSportsBookGetLogInfoQuery);

      // Act
      await service.getLogInfo(mockLogInfoEvent, false, 1, mockFilter, mockPrimitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(mockPrimitiveProps.transInfoAddRequestModel).toBe(mockViewModel.transInfoAddRequestModel);
      expect(mockLogInfoEvent.isHasSettledTicket).toBe(true);
      expect(mockLogInfoEvent.isHasInstantlySettledTicket).toBe(false);
      expect(mockLogInfoEvent.logInfoDetail).toBeDefined();
    });
  });

  describe('initGetLogInfoWrongOddsSportsBookQuery', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        filterWrongOddsSportsBook: {
          fromDateTime: '2024-01-01',
          toDateTime: '2024-01-02',
          filterOddsType: '1',
          oddsValue: 1.5,
          filterBetType: '1',
          filterBetStatus: '1',
          filterBetResult: '1',
          filterBetAmount: 100,
          fromOdds: 1.5,
          toOdds: 2.5,
          correctOdds: 1.8,
          liveIndicator: '1'
        } as unknown as FilterWrongOddsSportsBookModel,
        logInfoDetail: null,
        betTeamsResult: [],
        isHasSettledTicket: false,
        isHasInstantlySettledTicket: false,
        messageValidationLogInfo: [],
        allBetTypesSelection: []
      } as LogInfoWrongOddsSportsBook;

      const mockFilter = {
        action: '1',
        issueTypeId: '2',
        subIssueTypeId: '3'
      } as FilterModel;

      const mockWrongOddsSportsBookQuery = {
        matchId: 123,
        subIssueTypeId: 3,
        filterFromTransTime: '2024-01-01',
        filterToTransTime: '2024-01-02',
        liveIndicator: '1',
        filterOddsType: '1',
        oddsValue: 1.5,
        fromOdds: 1.5,
        toOdds: 2.5,
        correctOdds: 1.8
      };

      jest.spyOn(eventWrongOddsSportsBookService, 'getWrongOddsSportsBookGetLogInfoModel').mockReturnValue(mockWrongOddsSportsBookQuery as unknown as WrongOddsSportsBookGetLogInfoQuery);

      // Act
      const result = (service as any).initGetLogInfoWrongOddsSportsBookQuery(false, 1, mockFilter, mockLogInfoEvent);

      // Assert
      expect(result).toEqual({
        requestId: 1,
        actionId: 1,
        issueTypeId: 2,
        wrongOddsSportsBookModel: mockWrongOddsSportsBookQuery
      });
    });
  });

  describe('assignResultLogInfoToEvents', () => {
    it('should assign log info to matching event', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        filterWrongOddsSportsBook: {
          fromDateTime: '2024-01-01',
          toDateTime: '2024-01-02',
          filterOddsType: '1',
          oddsValue: 1.5,
          filterBetType: '1',
          filterBetStatus: '1',
          filterBetResult: '1',
          filterBetAmount: 100,
          fromOdds: 1.5,
          toOdds: 2.5,
          correctOdds: 1.8,
          liveIndicator: '1'
        } as unknown as FilterWrongOddsSportsBookModel,
        logInfoDetail: null,
        betTeamsResult: [],
        isHasSettledTicket: false,
        isHasInstantlySettledTicket: false,
        messageValidationLogInfo: [],
        allBetTypesSelection: []
      } as LogInfoWrongOddsSportsBook;

      const mockLogInfoModels = [{
        matchId: 123,
        validation: {
          isHasSettledTicket: true,
          isHasInstantlySettledTicket: false,
          isPoolHouseAffected: false,
          isInvalidTotalTickets: false,
          isExistedInOtherRequest: false,
          isExistsSecondAccept: false
        },
        logInfoDetail: null,
        ticketRequest: []
      }] as GetLogInfoModel[];

      // Act
      (service as any).assignResultLogInfoToEvents(mockLogInfoEvent, mockLogInfoModels);

      // Assert
      expect(mockLogInfoEvent.isHasSettledTicket).toBe(true);
      expect(mockLogInfoEvent.isHasInstantlySettledTicket).toBe(false);
      expect(mockLogInfoEvent.logInfoDetail).toBeDefined();
    });

    it('should not assign log info when no matching event found', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        filterWrongOddsSportsBook: {
          fromDateTime: '2024-01-01',
          toDateTime: '2024-01-02',
          filterOddsType: '1',
          oddsValue: 1.5,
          filterBetType: '1',
          filterBetStatus: '1',
          filterBetResult: '1',
          filterBetAmount: 100,
          fromOdds: 1.5,
          toOdds: 2.5,
          correctOdds: 1.8,
          liveIndicator: '1'
        } as unknown as FilterWrongOddsSportsBookModel,
        logInfoDetail: null,
        betTeamsResult: [],
        isHasSettledTicket: false,
        isHasInstantlySettledTicket: false,
        messageValidationLogInfo: [],
        allBetTypesSelection: []
      } as LogInfoWrongOddsSportsBook;

      const mockLogInfoModels = [{
        matchId: 456,
        validation: {
          isHasSettledTicket: true,
          isHasInstantlySettledTicket: false,
          isPoolHouseAffected: false,
          isInvalidTotalTickets: false,
          isExistedInOtherRequest: false,
          isExistsSecondAccept: false
        },
        logInfoDetail: null,
        ticketRequest: []
      }] as GetLogInfoModel[];

      // Act
      (service as any).assignResultLogInfoToEvents(mockLogInfoEvent, mockLogInfoModels);

      // Assert
      expect(mockLogInfoEvent.isHasSettledTicket).toBe(false);
      expect(mockLogInfoEvent.isHasInstantlySettledTicket).toBe(false);
      expect(mockLogInfoEvent.logInfoDetail).toBeNull();
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info fields', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        filterWrongOddsSportsBook: {
          fromDateTime: '2024-01-01',
          toDateTime: '2024-01-02',
          filterOddsType: '1',
          oddsValue: 1.5,
          filterBetType: '1',
          filterBetStatus: '1',
          filterBetResult: '1',
          filterBetAmount: 100,
          fromOdds: 1.5,
          toOdds: 2.5,
          correctOdds: 1.8,
          liveIndicator: '1'
        } as unknown as FilterWrongOddsSportsBookModel,
        logInfoDetail: null,
        betTeamsResult: [],
        isHasSettledTicket: false,
        isHasInstantlySettledTicket: false,
        messageValidationLogInfo: [],
        allBetTypesSelection: []
      } as LogInfoWrongOddsSportsBook;

      // Act
      service.resetLogInfoOfEvent(mockLogInfoEvent);

      // Assert
      expect(mockLogInfoEvent.logInfoDetail).toBeNull();
      expect(mockLogInfoEvent.messageValidationLogInfo).toBeNull();
    });
  });
});
