import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoModel, GetLogInfoViewModel } from '../../../../../models/get-log-info.model';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventTechnicalErrorService } from './event-technical-error.service';
import { LogInfoService } from './log-info.service';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: CommonService;
  let eventTechnicalErrorService: EventTechnicalErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LogInfoService, EventTechnicalErrorService]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService);
    eventTechnicalErrorService = TestBed.inject(EventTechnicalErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign to events correctly', async () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        logInfoDetail: null,
        messageValidationLogInfo: null,
        betTypeCount: null,
        filterTechnicalErrorModel: {},
        betTeamsResult: [],
        allBetTypesSelection: []
      } as unknown as LogInfoTechnicalError;

      const mockFilter = {
        subIssueTypeId: '1',
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      const mockPrimitiveProps = {
        transInfoAddRequestModel: null,
        isShowBetTypeCount: true
      } as PrimitivePropertyEvent;

      const mockViewModel = {
        transInfoAddRequestModel: { someData: 'test' },
        getLogInfoModels: [{
          matchId: 123,
          logInfoDetail: { detail: 'test' },
          betTypeCount: 5,
          validation: {},
          ticketRequest: {}
        }]
      } as unknown as GetLogInfoViewModel;

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);
      jest.spyOn(eventTechnicalErrorService, 'getTechnicalErrorGetLogInfoModel').mockReturnValue({
        matchId: 123,
        subIssueTypeId: 1,
        betTeamsResult: [],
        filterFromTransTime: null,
        filterToTransTime: null
      });

      // Act
      await service.getLogInfo(mockLogInfoEvent, false, 0, mockFilter, mockPrimitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(mockPrimitiveProps.transInfoAddRequestModel).toEqual(mockViewModel.transInfoAddRequestModel);
      expect(mockPrimitiveProps.isShowBetTypeCount).toBeFalsy();
      expect(mockLogInfoEvent.logInfoDetail).toEqual(mockViewModel.getLogInfoModels[0].logInfoDetail);
      expect(mockLogInfoEvent.betTypeCount).toEqual(mockViewModel.getLogInfoModels[0].betTypeCount);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info event properties', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        logInfoDetail: { someData: 'test' },
        messageValidationLogInfo: ['some message'],
        filterTechnicalErrorModel: {},
        betTeamsResult: [],
        allBetTypesSelection: [],
        betTypeCount: null
      } as unknown as LogInfoTechnicalError;

      // Act
      service.resetLogInfoOfEvent(mockLogInfoEvent);

      // Assert
      expect(mockLogInfoEvent.logInfoDetail).toBeNull();
      expect(mockLogInfoEvent.messageValidationLogInfo).toBeNull();
    });
  });

  describe('initTechnicalErrorGetLogInfoQuery', () => {
    it('should initialize query with correct values for edit mode', () => {
      // Arrange
      const mockLogInfo = {
        matchId: 123,
        logInfoDetail: null,
        filterTechnicalErrorModel: {},
        betTeamsResult: [],
        allBetTypesSelection: [],
        betTypeCount: null
      } as unknown as LogInfoTechnicalError;

      const mockFilter = {
        subIssueTypeId: '1',
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      jest.spyOn(eventTechnicalErrorService, 'getTechnicalErrorGetLogInfoModel').mockReturnValue({
        matchId: 123,
        subIssueTypeId: 1,
        betTeamsResult: [],
        filterFromTransTime: null,
        filterToTransTime: null
      });

      // Act
      const result = service['initTechnicalErrorGetLogInfoQuery'](true, 123, mockFilter, mockLogInfo);

      // Assert
      expect(result.requestId).toBe(123);
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(1);
      expect(eventTechnicalErrorService.getTechnicalErrorGetLogInfoModel).toHaveBeenCalledWith(1, mockLogInfo);
    });

    it('should initialize query with correct values for create mode', () => {
      // Arrange
      const mockLogInfo = {
        matchId: 123,
        logInfoDetail: null,
        filterTechnicalErrorModel: {},
        betTeamsResult: [],
        allBetTypesSelection: [],
        betTypeCount: null
      } as unknown as LogInfoTechnicalError;

      const mockFilter = {
        subIssueTypeId: '1',
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      jest.spyOn(eventTechnicalErrorService, 'getTechnicalErrorGetLogInfoModel').mockReturnValue({
        matchId: 123,
        subIssueTypeId: 1,
        betTeamsResult: [],
        filterFromTransTime: null,
        filterToTransTime: null
      });

      // Act
      const result = service['initTechnicalErrorGetLogInfoQuery'](false, 0, mockFilter, mockLogInfo);

      // Assert
      expect(result.requestId).toBeNull();
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(1);
      expect(eventTechnicalErrorService.getTechnicalErrorGetLogInfoModel).toHaveBeenCalledWith(1, mockLogInfo);
    });
  });

  describe('assignResultLogInfoToEvents', () => {
    it('should assign log info to matching event', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        logInfoDetail: null,
        messageValidationLogInfo: null,
        betTypeCount: null,
        filterTechnicalErrorModel: {},
        betTeamsResult: [],
        allBetTypesSelection: []
      } as unknown as LogInfoTechnicalError;

      const mockLogInfoModels = [{
        matchId: 123,
        logInfoDetail: { detail: 'test' },
        betTypeCount: 5,
        validation: {},
        ticketRequest: {}
      }] as unknown as GetLogInfoModel[];

      // Act
      service['assignResultLogInfoToEvents'](mockLogInfoEvent, mockLogInfoModels);

      // Assert
      expect(mockLogInfoEvent.logInfoDetail).toEqual(mockLogInfoModels[0].logInfoDetail);
      expect(mockLogInfoEvent.betTypeCount).toEqual(mockLogInfoModels[0].betTypeCount);
    });

    it('should not assign log info when no matching event found', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: 123,
        logInfoDetail: null,
        messageValidationLogInfo: null,
        betTypeCount: null,
        filterTechnicalErrorModel: {},
        betTeamsResult: [],
        allBetTypesSelection: []
      } as unknown as LogInfoTechnicalError;

      const mockLogInfoModels = [{
        matchId: 456,
        logInfoDetail: { detail: 'test' },
        betTypeCount: 5,
        validation: {},
        ticketRequest: {}
      }] as unknown as GetLogInfoModel[];

      // Act
      (service as any).assignResultLogInfoToEvents(mockLogInfoEvent, mockLogInfoModels);

      // Assert
      expect(mockLogInfoEvent.logInfoDetail).toBeNull();
      expect(mockLogInfoEvent.betTypeCount).toBeNull();
    });
  });
});
