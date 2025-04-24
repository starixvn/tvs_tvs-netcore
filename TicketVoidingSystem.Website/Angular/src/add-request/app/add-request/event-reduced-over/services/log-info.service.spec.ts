import * as _ from 'lodash';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoModel, GetLogInfoViewModel } from '../../models/get-log-info.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventReducedOverService } from './event-reduced-over.service';
import { LogInfoService } from './log-info.service';
import { TestBed } from '@angular/core/testing';
import { StaticService } from '../../../../../utility/services/static.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: CommonService;
  let eventReducedOverService: EventReducedOverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LogInfoService, EventReducedOverService]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService);
    eventReducedOverService = TestBed.inject(EventReducedOverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign to events', async () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: '123',
        logInfoDetail: null,
        messageValidationLogInfo: null,
        filterReducedOvers: []
      } as unknown as LogInfoReducedOver;

      const mockFilter = {
        subIssueTypeId: '1',
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      const mockPrimitiveProps = {
        transInfoAddRequestModel: null
      } as PrimitivePropertyEvent;

      const mockViewModel = {
        transInfoAddRequestModel: { someData: 'test' },
        getLogInfoModels: [{
          matchId: '123',
          logInfoDetail: { detail: 'test' },
          messageValidationLogInfo: ['message1'],
          validation: {
            isInvalidTotalTickets: false
          }
        }]
      } as unknown as GetLogInfoViewModel;

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);
      jest.spyOn(eventReducedOverService, 'getReducedOverGetLogInfoModel').mockReturnValue([]);

      // Act
      await service.getLogInfo(mockLogInfoEvent, false, 0, mockFilter, mockPrimitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(mockPrimitiveProps.transInfoAddRequestModel).toEqual(mockViewModel.transInfoAddRequestModel);
      expect(mockLogInfoEvent.logInfoDetail).toEqual(mockViewModel.getLogInfoModels[0].logInfoDetail);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info of event', () => {
      // Arrange
      const mockLogInfoEvent = {
        logInfoDetail: { someData: 'test' },
        messageValidationLogInfo: ['message1']
      } as unknown as LogInfoReducedOver;

      // Act
      service.resetLogInfoOfEvent(mockLogInfoEvent);

      // Assert
      expect(mockLogInfoEvent.logInfoDetail).toBeNull();
      expect(mockLogInfoEvent.messageValidationLogInfo).toBeNull();
    });
  });

  describe('initReducedOverGetLogInfoQuery', () => {
    it('should initialize query with correct values for new request', () => {
      // Arrange
      const mockFilter = {
        subIssueTypeId: '1',
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      const mockLogInfo = {
        matchId: '123',
        filterReducedOvers: []
      } as unknown as LogInfoReducedOver;

      jest.spyOn(eventReducedOverService, 'getReducedOverGetLogInfoModel').mockReturnValue([]);

      // Act
      const result = (service as any).initReducedOverGetLogInfoQuery(false, 0, mockFilter, mockLogInfo);

      // Assert
      expect(result.requestId).toBeNull();
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(1);
      expect(result.reducedOverModels).toEqual([]);
    });

    it('should initialize query with correct values for edit request', () => {
      // Arrange
      const mockFilter = {
        subIssueTypeId: '1',
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      const mockLogInfo = {
        matchId: '123',
        filterReducedOvers: []
      } as unknown as LogInfoReducedOver;

      jest.spyOn(eventReducedOverService, 'getReducedOverGetLogInfoModel').mockReturnValue([]);

      // Act
      const result = (service as any).initReducedOverGetLogInfoQuery(true, 123, mockFilter, mockLogInfo);

      // Assert
      expect(result.requestId).toBe(123);
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(1);
      expect(result.reducedOverModels).toEqual([]);
    });
  });

  describe('assignResultLogInfoToEvents', () => {
    it('should assign log info to matching event', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: '123',
        logInfoDetail: null,
        messageValidationLogInfo: null
      } as unknown as LogInfoReducedOver;

      const mockLogInfoModels = [{
        matchId: '123',
        logInfoDetail: { detail: 'test' },
        messageValidationLogInfo: ['message1']
      }] as unknown as GetLogInfoModel[];
      StaticService['getValidationMessageList'] = jest.fn().mockReturnValue(['message1']);

      // Act
      (service as any).assignResultLogInfoToEvents(mockLogInfoEvent, mockLogInfoModels);

      // Assert
      expect(mockLogInfoEvent.logInfoDetail).toEqual(mockLogInfoModels[0].logInfoDetail);
      expect(mockLogInfoEvent.messageValidationLogInfo).toEqual(['message1']);
    });

    it('should not assign log info when no matching event found', () => {
      // Arrange
      const mockLogInfoEvent = {
        matchId: '123',
        logInfoDetail: null,
        messageValidationLogInfo: null
      } as unknown as LogInfoReducedOver;

      const mockLogInfoModels = [{
        matchId: '456',
        logInfoDetail: { detail: 'test' },
        messageValidationLogInfo: ['message1']
      }] as unknown as GetLogInfoModel[];
      StaticService['getValidationMessageList'] = jest.fn().mockReturnValue(['message1']);

      // Act
      (service as any).assignResultLogInfoToEvents(mockLogInfoEvent, mockLogInfoModels);

      // Assert
      expect(mockLogInfoEvent.logInfoDetail).toBeNull();
      expect(mockLogInfoEvent.messageValidationLogInfo).toBeNull();
    });
  });
});
