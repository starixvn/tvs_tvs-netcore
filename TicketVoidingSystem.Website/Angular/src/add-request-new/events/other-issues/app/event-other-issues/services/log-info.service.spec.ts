import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoModel, GetLogInfoViewModel } from '../../../../../models/get-log-info.model';
import { CheckAddPermissionService } from '../../../../../services/check-permission.service';
import { OtherIssuesGetLogInfoQuery } from '../models/get-log-info.query';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventOtherIssuesService } from './event-other-issues.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: CommonService;
  let eventOtherIssuesService: EventOtherIssuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LogInfoService, EventOtherIssuesService, ValidationService, CheckAddPermissionService]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService);
    eventOtherIssuesService = TestBed.inject(EventOtherIssuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset logInfoDetail and messageValidationLogInfo to null', () => {
      // Arrange
      const logInfoEvent = {
        logInfoDetail: 'some detail',
        messageValidationLogInfo: 'some message'
      } as unknown as LogInfoOtherIssues;

      // Act
      service.resetLogInfoOfEvent(logInfoEvent);

      // Assert
      expect(logInfoEvent.logInfoDetail).toBeNull();
      expect(logInfoEvent.messageValidationLogInfo).toBeNull();
    });
  });

  describe('getLogInfo', () => {
    it('should get log info and assign results correctly', async () => {
      // Arrange
      const logInfoEvent = {
        matchId: 'testMatchId'
      } as unknown as LogInfoOtherIssues;
      const requestId = 123;
      const filter = {
        action: '1',
        issueTypeId: '2',
        subIssueTypeId: '3'
      } as FilterModel;
      const primitiveProps = {} as PrimitiveProperty;

      const mockViewModel = {
        transInfoAddRequestModel: { someData: 'test' },
        getLogInfoModels: [{
          matchId: 'testMatchId',
          validation: {
            isHasSettledTicket: true,
            isHasInstantlySettledTicket: false
          },
          logInfoDetail: 'test detail',
          ticketRequest: {} // Thêm ticketRequest để đáp ứng yêu cầu của GetLogInfoModel
        }]
      } as unknown as GetLogInfoViewModel;

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);
      jest.spyOn(eventOtherIssuesService, 'initOtherIssuesGetLogInfoModel').mockReturnValue({
        matchId: 123,
        subIssueTypeId: 3,
        filterFromTransTime: null,
        filterToTransTime: null,
        betTeamsResult: null
      } as unknown as OtherIssuesGetLogInfoQuery);

      // Act
      await service.getLogInfo(logInfoEvent, requestId, filter, primitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toEqual(mockViewModel.transInfoAddRequestModel);
      expect(logInfoEvent.isHasSettledTicket).toBeTruthy();
      expect(logInfoEvent.isHasInstantlySettledTicket).toBeFalsy();
      expect(logInfoEvent.logInfoDetail).toBe('test detail');
    });
  });

  describe('initGetLogInfoOtherIssuesQuery', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const requestId = 123;
      const filter = {
        action: '1',
        issueTypeId: '2',
        subIssueTypeId: '3'
      } as FilterModel;
      const events = {} as LogInfoOtherIssues;

      jest.spyOn(eventOtherIssuesService, 'initOtherIssuesGetLogInfoModel').mockReturnValue({} as OtherIssuesGetLogInfoQuery);

      // Act
      const result = service['initGetLogInfoOtherIssuesQuery'](requestId, filter, events);

      // Assert
      expect(result.requestId).toBe(requestId);
      expect(result.actionId).toBe(Number(filter.action));
      expect(result.issueTypeId).toBe(Number(filter.issueTypeId));
      expect(eventOtherIssuesService.initOtherIssuesGetLogInfoModel).toHaveBeenCalledWith(filter.issueTypeId,
        Number(filter.subIssueTypeId),
        events
      );
    });
  });

  describe('assignResultLogInfoToEvents', () => {
    it('should assign log info to events when match is found', () => {
      // Arrange
      const logInfoEvent = {
        matchId: 'testMatchId'
      } as unknown as LogInfoOtherIssues;

      const logInfoModels = [{
        matchId: 'testMatchId',
        validation: {
          isHasSettledTicket: true,
          isHasInstantlySettledTicket: false
        },
        logInfoDetail: 'test detail'
      }] as unknown as GetLogInfoModel[];

      // Act
      service['assignResultLogInfoToEvents'](logInfoEvent, logInfoModels);

      // Assert
      expect(logInfoEvent.isHasSettledTicket).toBeTruthy();
      expect(logInfoEvent.isHasInstantlySettledTicket).toBeFalsy();
      expect(logInfoEvent.logInfoDetail).toBe('test detail');
    });

    it('should not assign log info when no match is found', () => {
      // Arrange
      const logInfoEvent = {
        matchId: 'testMatchId'
      } as unknown as LogInfoOtherIssues;

      const logInfoModels = [{
        matchId: 'differentMatchId',
        validation: {
          isHasSettledTicket: true,
          isHasInstantlySettledTicket: false
        },
        logInfoDetail: 'test detail'
      }] as unknown as GetLogInfoModel[];

      // Act
      service['assignResultLogInfoToEvents'](logInfoEvent, logInfoModels);

      // Assert
      expect(logInfoEvent.isHasSettledTicket).toBeUndefined();
      expect(logInfoEvent.isHasInstantlySettledTicket).toBeUndefined();
      expect(logInfoEvent.logInfoDetail).toBeUndefined();
    });
  });
});
