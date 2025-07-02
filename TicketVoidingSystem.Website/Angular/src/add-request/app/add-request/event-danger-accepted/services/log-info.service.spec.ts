import { TestBed } from '@angular/core/testing';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterModel } from '../../filter/filter.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { ValidationMessage, GetLogInfoViewModel } from '../../models/get-log-info.model';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let validationService: ValidationService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        {
          provide: ValidationService,
          useValue: {
            isHasAllowanceTime: jest.fn(),
            isHasWarningRangeTime: jest.fn()
          }
        },
        {
          provide: CommonService,
          useValue: {
            getLogInfo: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(LogInfoService);
    validationService = TestBed.inject(ValidationService);
    commonService = TestBed.inject(CommonService);
  });

  describe('getLogInfo', () => {
    it('should call getLogInfo with correct parameters and update events', async () => {
      const allEvents = [
        {
          matchId: 1,
          subIssueTypeId: 1,
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          }
        }
      ] as LogInfoRelatedEvent[];

      const primitiveProps = {
        filterBy: 1
      } as PrimitiveProperty;

      const isEdit = false;
      const requestId = 1;
      const filter = {
        action: '1',
        issueTypeId: '1'
      } as FilterModel;

      const defaultFilterTimeWithAllowance = {
        fromDateTime: '2024-01-01 10:00:00',
        toDateTime: '2024-01-01 11:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      } as FilterTimeWithAllowance;

      const mockLogInfoResponse = {
        transInfoAddRequestModel: {},
        getLogInfoModels: [
          {
            matchId: 1,
            logInfoDetail: {
              matchId: 1,
              liveScores: '',
              voidFromTime: new Date('2024-01-01 10:00:00'),
              voidToTime: new Date('2024-01-01 11:00:00'),
              transVoidToTime: new Date('2024-01-01 11:00:00'),
              singleCount: 0,
              cashOutCount: 0,
              settleCount: 0,
              instantlySettleCount: 0,
              mainParlayCount: 0,
              cancelCashOutCount: 0,
              scoreNormalTicket: '0',
              scoreOfMatch: '0',
              minTransId: '0',
              actionType: '',
              isHasWarningRangeTime: false
            } as LogInfoDetail,
            validation: {
              isPoolHouseAffected: false,
              isInvalidTotalTickets: false,
              isExistedInOtherRequest: false,
              isExistsSecondAccept: false,
              isHasSettledTicket: false,
              isHasInstantlySettledTicket: false
            },
            ticketRequest: []
          }
        ]
      } as GetLogInfoViewModel;

      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(true);
      jest.spyOn(commonService, 'getLogInfo').mockResolvedValue(mockLogInfoResponse);

      await service.getLogInfo(allEvents, primitiveProps, isEdit, requestId, filter, defaultFilterTimeWithAllowance);

      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toEqual(mockLogInfoResponse.transInfoAddRequestModel);
      expect(allEvents[0].logInfoDetail).toEqual(mockLogInfoResponse.getLogInfoModels[0].logInfoDetail);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset logInfoDetail and messageValidationLogInfo of all events', () => {
      const events = [
        {
          matchId: 1,
          logInfoDetail: {
            matchId: 1,
            liveScores: '',
            singleCount: 0,
            cashOutCount: 0,
            settleCount: 0,
            instantlySettleCount: 0,
            mainParlayCount: 0,
            cancelCashOutCount: 0,
            voidFromTime: new Date('2024-01-01 10:00:00'),
            voidToTime: new Date('2024-01-01 11:00:00'),
            transVoidToTime: new Date('2024-01-01 11:00:00'),
            isHasWarningRangeTime: false,
            scoreNormalTicket: '0',
            scoreOfMatch: '0',
            minTransId: '0',
            actionType: ''
          } as LogInfoDetail,
          messageValidationLogInfo: [
            {
              message: 'message1',
              type: 'error',
              isError: true,
              reason: 'error1'
            } as ValidationMessage,
            {
              message: 'message2',
              type: 'warning',
              isError: false,
              reason: 'warning1'
            } as ValidationMessage
          ],
          leagueName: 'Test League',
          isMainMatch: true,
          eventName: 'Test Event',
          subIssueTypeId: 1,
          sportType: 1,
          eventDate: new Date('2024-01-01'),
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          },
          tvDetectionModel: null
        }
      ] as LogInfoRelatedEvent[];

      service.resetLogInfoOfEvent(events);

      expect(events[0].logInfoDetail).toBeNull();
      expect(events[0].messageValidationLogInfo).toBeNull();
    });
  });

  describe('updateIsCheckedVar', () => {
    it('should update isCheckedVar and isHighLightVarCheck based on StaticService.isShowVarCheck', () => {
      const events = [
        {
          matchId: 1,
          subIssueTypeId: 1,
          isCheckedVar: false,
          isHighLightVarCheck: true
        }
      ] as LogInfoRelatedEvent[];

      jest.spyOn(StaticService, 'isShowVarCheck').mockReturnValue(true);

      service.updateIsCheckedVar(events, true);

      expect(events[0].isCheckedVar).toBe(true);
      expect(events[0].isHighLightVarCheck).toBe(false);
    });

    it('should set isCheckedVar to null when StaticService.isShowVarCheck returns false', () => {
      const events = [
        {
          matchId: 1,
          subIssueTypeId: 1,
          isCheckedVar: false,
          isHighLightVarCheck: true
        }
      ] as LogInfoRelatedEvent[];

      jest.spyOn(StaticService, 'isShowVarCheck').mockReturnValue(false);

      service.updateIsCheckedVar(events, true);

      expect(events[0].isCheckedVar).toBeNull();
      expect(events[0].isHighLightVarCheck).toBe(false);
    });
  });

  describe('initGetLogInfoRedCardQuery', () => {
    it('should return query with dangerAcceptedModels when isEdit is true and issueTypeId is danger accepted', () => {
      const filterBy = 1;
      const isEdit = true;
      const requestId = 1;
      const filter = {
        action: '1',
        issueTypeId: '1'
      } as FilterModel;
      const events = [
        {
          matchId: 1,
          subIssueTypeId: 1,
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          }
        }
      ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = {
        fromDateTime: '2024-01-01 10:00:00',
        toDateTime: '2024-01-01 11:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      } as FilterTimeWithAllowance;

      const result = service['initGetLogInfoRedCardQuery'](filterBy, isEdit, requestId, filter, events, defaultFilterTimeWithAllowance);

      expect(result.requestId).toBe(1);
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(1);
      expect(result.dangerAcceptedModels).toBeDefined();
      expect(result.dangerAcceptedModels.length).toBe(1);
      expect(result.dangerAcceptedModels[0].matchId).toBe(1);
      expect(result.dangerAcceptedModels[0].filterBy).toBe(1);
      expect(result.dangerAcceptedModels[0].subIssueTypeId).toBe(1);
      expect(result.dangerAcceptedModels[0].aaTime).toBe(5);
      expect(result.dangerAcceptedModels[0].paTime).toBe(5);
      expect(result.dangerAcceptedModels[0].saTime).toBe(5);
    });

    it('should return query with null requestId when isEdit is false and issueTypeId is danger accepted', () => {
      const filterBy = 1;
      const isEdit = false;
      const requestId = 1;
      const filter = {
        action: '1',
        issueTypeId: '1'
      } as FilterModel;
      const events = [
        {
          matchId: 1,
          subIssueTypeId: 1,
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          }
        }
      ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = {
        fromDateTime: '2024-01-01 10:00:00',
        toDateTime: '2024-01-01 11:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      } as FilterTimeWithAllowance;

      const result = service['initGetLogInfoRedCardQuery'](filterBy, isEdit, requestId, filter, events, defaultFilterTimeWithAllowance);

      expect(result.requestId).toBeNull();
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(1);
      expect(result.dangerAcceptedModels).toBeDefined();
    });

    it('should return query without dangerAcceptedModels when issueTypeId is not danger accepted', () => {
      const filterBy = 1;
      const isEdit = true;
      const requestId = 1;
      const filter = {
        action: '1',
        issueTypeId: '2'
      } as FilterModel;
      const events = [
        {
          matchId: 1,
          subIssueTypeId: 1,
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          }
        }
      ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = {
        fromDateTime: '2024-01-01 10:00:00',
        toDateTime: '2024-01-01 11:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      } as FilterTimeWithAllowance;

      const result = service['initGetLogInfoRedCardQuery'](filterBy, isEdit, requestId, filter, events, defaultFilterTimeWithAllowance);

      expect(result.requestId).toBe(1);
      expect(result.actionId).toBe(1);
      expect(result.issueTypeId).toBe(2);
      expect(result.dangerAcceptedModels).toBeUndefined();
    });
  });

  describe('getLogInfoModel', () => {
    it('should use defaultFilterTimeWithAllowance when event has allowance time', () => {
      const filterBy = 1;
      const events = [
        {
          matchId: 1,
          subIssueTypeId: 1,
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          }
        }
      ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = {
        fromDateTime: '2024-01-01 12:00:00',
        toDateTime: '2024-01-01 13:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      } as FilterTimeWithAllowance;

      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(true);

      const result = service['getLogInfoModel'](filterBy, events, defaultFilterTimeWithAllowance);

      expect(result.length).toBe(1);
      expect(result[0].filterFromTransTime).toBe('2024-01-01 12:00:00');
      expect(result[0].filterToTransTime).toBe('2024-01-01 13:00:00');
      expect(result[0].matchId).toBe(1);
      expect(result[0].filterBy).toBe(1);
      expect(result[0].subIssueTypeId).toBe(1);
      expect(result[0].aaTime).toBe(5);
      expect(result[0].paTime).toBe(5);
      expect(result[0].saTime).toBe(5);
    });

    it('should use voidTimeArea when event does not have allowance time', () => {
      const filterBy = 1;
      const events = [
        {
          matchId: 1,
          subIssueTypeId: 1,
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          }
        }
      ] as LogInfoRelatedEvent[];
      const defaultFilterTimeWithAllowance = {
        fromDateTime: '2024-01-01 12:00:00',
        toDateTime: '2024-01-01 13:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      } as FilterTimeWithAllowance;

      jest.spyOn(validationService, 'isHasAllowanceTime').mockReturnValue(false);

      const result = service['getLogInfoModel'](filterBy, events, defaultFilterTimeWithAllowance);

      expect(result.length).toBe(1);
      expect(result[0].filterFromTransTime).toBe('2024-01-01 10:00:00');
      expect(result[0].filterToTransTime).toBe('2024-01-01 11:00:00');
      expect(result[0].matchId).toBe(1);
      expect(result[0].filterBy).toBe(1);
      expect(result[0].subIssueTypeId).toBe(1);
      expect(result[0].aaTime).toBe(5);
      expect(result[0].paTime).toBe(5);
      expect(result[0].saTime).toBe(5);
    });
  });
});
