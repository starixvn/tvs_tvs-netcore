import { TestBed } from '@angular/core/testing';
import { LogInfoRelatedEventService } from './log-info-related-event.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../utility/services/common.service';
import { LogInfoRelatedEvent } from './log-info-related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterModel } from '../../filter/filter.model';
import { PrimitiveProperty } from './primitive-property.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import moment from 'moment-timezone';
import { GetLogInfoViewModel } from '../../models/get-log-info.model';

describe('LogInfoRelatedEventService', () => {
  let service: LogInfoRelatedEventService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LogInfoRelatedEventService, CommonService]
    });

    service = TestBed.inject(LogInfoRelatedEventService);
    commonService = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('refreshLogInfoForRelatedEvent', () => {
    it('should refresh log info with correct data when has allowance time', async () => {
      // Arrange
      const isEdit = false;
      const requestId = 123;
      const filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1'
      } as unknown as FilterModel;
      const primitiveProps= {
        filterBy: 1
      } as unknown as PrimitiveProperty;
      const logInfoRelatedEvent = {
        voidTimeArea: {
          fromDateTime: '2024-03-20 10:00:00',
          toDateTime: '2024-03-20 11:00:00',
          aaTime: 1,
          paTime: 1,
          saTime: 1
        },
        matchId: 'match123',
        subIssueTypeId: 1
      } as unknown as LogInfoRelatedEvent;
      const defaultFilterTimeWithAllowance = {
        fromDateTime: '2024-03-20 09:00:00',
        toDateTime: '2024-03-20 12:00:00'
      } as unknown as FilterTimeWithAllowance;

      const mockViewModel = {
        getLogInfoModels: [{
          logInfoDetail: {
            voidFromTime: '2024-03-20 10:00:00',
            voidToTime: '2024-03-20 11:00:00',
            transVoidToTime: new Date('2024-03-20 11:00:00')
          },
          validation: {
            isInvalidTotalTickets: false
          }
        }],
        transInfoAddRequestModel: {}
      } as unknown as GetLogInfoViewModel;

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);

      // Act
      await service.refreshLogInfoForRelatedEvent(
        isEdit,
        requestId,
        filter,
        primitiveProps,
        logInfoRelatedEvent,
        defaultFilterTimeWithAllowance
      );

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toBe(mockViewModel.transInfoAddRequestModel);
      expect(logInfoRelatedEvent.logInfoDetail).toBe(mockViewModel.getLogInfoModels[0].logInfoDetail);
      expect(logInfoRelatedEvent.voidTimeArea.fromDateTime).toBe(
        moment(mockViewModel.getLogInfoModels[0].logInfoDetail.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      );
      expect(logInfoRelatedEvent.voidTimeArea.toDateTime).toBe(
        moment(mockViewModel.getLogInfoModels[0].logInfoDetail.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
      );
    });

    it('should refresh log info without updating time when no allowance time', async () => {
      // Arrange
      const isEdit = false;
      const requestId = 123;
      const filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1'
      } as unknown as FilterModel;
      const primitiveProps = {
        filterBy: 1
      } as unknown as PrimitiveProperty;
      const logInfoRelatedEvent = {
        voidTimeArea: {
          fromDateTime: '2024-03-20 10:00:00',
          toDateTime: '2024-03-20 11:00:00',
          aaTime: null,
          paTime: null,
          saTime: null
        },
        matchId: 'match123',
        subIssueTypeId: 1
      } as unknown as LogInfoRelatedEvent;
      const defaultFilterTimeWithAllowance = {
        fromDateTime: '2024-03-20 09:00:00',
        toDateTime: '2024-03-20 12:00:00',
        aaTime: null,
        paTime: null,
        saTime: null
      } as unknown as FilterTimeWithAllowance;

      const mockViewModel = {
        getLogInfoModels: [{
          logInfoDetail: {
            voidFromTime: '2024-03-20 10:00:00',
            voidToTime: '2024-03-20 11:00:00'
          },
          validation: {
            isInvalidTotalTickets: false
          }
        }],
        transInfoAddRequestModel: {}
      } as unknown as GetLogInfoViewModel;

      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockViewModel);

      // Act
      await service.refreshLogInfoForRelatedEvent(
        isEdit,
        requestId,
        filter,
        primitiveProps,
        logInfoRelatedEvent,
        defaultFilterTimeWithAllowance
      );

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toBe(mockViewModel.transInfoAddRequestModel);
      expect(logInfoRelatedEvent.logInfoDetail).toBe(mockViewModel.getLogInfoModels[0].logInfoDetail);
      expect(logInfoRelatedEvent.voidTimeArea.fromDateTime).toBe('2024-03-20 10:00:00');
      expect(logInfoRelatedEvent.voidTimeArea.toDateTime).toBe('2024-03-20 11:00:00');
    });
  });

  describe('isHasWarningRangeTime', () => {
    it('should return true when time difference is more than 1 minute', () => {
      // Arrange
      const fromDateTime = '2024-03-20 10:00:00';
      const toDateTime = new Date('2024-03-20 10:02:00');

      // Act
      const result = (service as any).isHasWarningRangeTime(fromDateTime, toDateTime);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when time difference is less than 1 minute', () => {
      // Arrange
      const fromDateTime = '2024-03-20 10:00:00';
      const toDateTime = new Date('2024-03-20 10:00:30');

      // Act
      const result = (service as any).isHasWarningRangeTime(fromDateTime, toDateTime);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when fromDateTime or toDateTime is null', () => {
      // Arrange
      const fromDateTime = null;
      const toDateTime = new Date('2024-03-20 10:00:00');

      // Act
      const result = (service as any).isHasWarningRangeTime(fromDateTime, toDateTime);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isHasAllowanceTime', () => {
    it('should return true when any allowance time is set', () => {
      // Arrange
      const event: LogInfoRelatedEvent = {
        voidTimeArea: {
          fromDateTime: '2024-03-20 10:00:00',
          toDateTime: '2024-03-20 11:00:00',
          aaTime: 1,
          paTime: 0,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = (service as any).isHasAllowanceTime(event);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when all allowance times are 0', () => {
      // Arrange
      const event: LogInfoRelatedEvent = {
        voidTimeArea: {
          fromDateTime: '2024-03-20 10:00:00',
          toDateTime: '2024-03-20 11:00:00',
          aaTime: 0,
          paTime: 0,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = (service as any).isHasAllowanceTime(event);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when all allowance times are null', () => {
      // Arrange
      const event: LogInfoRelatedEvent = {
        voidTimeArea: {
          fromDateTime: '2024-03-20 10:00:00',
          toDateTime: '2024-03-20 11:00:00',
          aaTime: null,
          paTime: null,
          saTime: null
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = (service as any).isHasAllowanceTime(event);

      // Assert
      expect(result).toBeFalsy();
    });
  });
}); 