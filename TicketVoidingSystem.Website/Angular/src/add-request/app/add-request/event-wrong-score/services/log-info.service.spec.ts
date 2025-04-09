import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { LogInfoService } from './log-info.service';
import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { EventWrongScoreService } from './event-wrong-score.service';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { ValidationMessage } from '../../models/get-log-info.model';

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: CommonService;
  let validationService: ValidationService;
  let eventWrongScoreService: EventWrongScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        { provide: CommonService, useValue: { getLogInfo: jest.fn() } },
        {
          provide: ValidationService, useValue: {
            isHasAllowanceTime: jest.fn(),
            isHasAllowanceTimeWrongScoreModel: jest.fn()
          }
        },
        { provide: EventWrongScoreService, useValue: { getFilterByBaseOnSubIssueType: jest.fn() } }
      ]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService);
    validationService = TestBed.inject(ValidationService);
    eventWrongScoreService = TestBed.inject(EventWrongScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign results for CHECK_TIME filter', async () => {
      const isEdit = false;
      const requestId = 1;
      const filter = new FilterModel();
      filter.subIssueTypeId = '1';
      const primitiveProps: PrimitiveProperty = {
        filterBy: TVSRequestFilterBy.CHECK_TIME,
        isBlock: false,
        actualScore: '',
        isShowActualScore: false,
        transInfoAddRequestModel: null,
        isShowRelatedEvents: false
      };
      const wrongScoreModel = new WrongScoreModel();
      wrongScoreModel.matchId = 1;
      wrongScoreModel.filterFromTransTime = '2024-03-20T09:00:00';
      wrongScoreModel.filterToTransTime = '2024-03-20T12:00:00';
      wrongScoreModel.saTime = 11;
      wrongScoreModel.logInfoDetail = new LogInfoDetail();
      wrongScoreModel.messageValidationLogInfo = [];
      const wrongScoreModels = [wrongScoreModel];
      const mainMatchId = 1;
      const defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
      defaultFilterTimeWithAllowance.fromDateTime = '2024-03-20T09:00:00';
      defaultFilterTimeWithAllowance.toDateTime = '2024-03-20T12:00:00';

      const mockResponse = {
        transInfoAddRequestModel: {},
        getLogInfoModels: [{
          matchId: 1,
          logInfoDetail: {
            voidFromTime: '2024-03-20T10:00:00',
            voidToTime: '2024-03-20T11:00:00'
          },
          validation: { isInvalidTotalTickets: false }
        }]
      };
      commonService.getLogInfo = jest.fn().mockResolvedValue(mockResponse);
      eventWrongScoreService.getFilterByBaseOnSubIssueType = jest.fn().mockReturnValue(TVSRequestFilterBy.CHECK_TIME);

      await service.getLogInfo(isEdit, requestId, filter, primitiveProps, wrongScoreModels, mainMatchId, defaultFilterTimeWithAllowance);

      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(wrongScoreModels[0].voidFromTime).toBeDefined();
      expect(wrongScoreModels[0].voidToTime).toBeDefined();
    });
  });

  describe('mapRelatedEventToWrongScoreModel', () => {
    it('should map LogInfoRelatedEvent to WrongScoreModel with allowance time', () => {
      const logInfoRelatedEvent = new LogInfoRelatedEvent();
      logInfoRelatedEvent.matchId = 1;
      logInfoRelatedEvent.subIssueTypeId = 1;
      logInfoRelatedEvent.voidTimeArea = {
        fromDateTime: '2024-03-20T10:00:00',
        toDateTime: '2024-03-20T11:00:00',
        aaTime: 10,
        paTime: 10.5,
        saTime: 11
      };

      const defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
      defaultFilterTimeWithAllowance.fromDateTime = '2024-03-20T09:00:00';
      defaultFilterTimeWithAllowance.toDateTime = '2024-03-20T12:00:00';
      validationService.isHasAllowanceTime = jest.fn().mockReturnValue(true);
      eventWrongScoreService.getFilterByBaseOnSubIssueType = jest.fn().mockReturnValue(TVSRequestFilterBy.CHECK_TIME);

      const result = service.mapRelatedEventToWrongScoreModel(logInfoRelatedEvent, defaultFilterTimeWithAllowance);

      expect(result.matchId).toBe(1);
      expect(result.filterFromTransTime).toBe(defaultFilterTimeWithAllowance.fromDateTime);
      expect(result.filterToTransTime).toBe(defaultFilterTimeWithAllowance.toDateTime);
    });
  });

  describe('clearDataValidation', () => {
    it('should clear validation data from wrongScoreModels', () => {
      const wrongScoreModels = [new WrongScoreModel()];
      wrongScoreModels[0].logInfoDetail = new LogInfoDetail();
      wrongScoreModels[0].messageValidationLogInfo = [new ValidationMessage()];
      wrongScoreModels[0].voidFromTime = '2024-03-20T10:00:00';
      wrongScoreModels[0].voidToTime = '2024-03-20T11:00:00';

      service.clearDataValidation(wrongScoreModels);

      expect(wrongScoreModels[0].logInfoDetail).toBeNull();
      expect(wrongScoreModels[0].messageValidationLogInfo).toBeNull();
      expect(wrongScoreModels[0].voidFromTime).toBeNull();
      expect(wrongScoreModels[0].voidToTime).toBeNull();
    });

    it('should clear validation data from events if provided', () => {
      const wrongScoreModels = [new WrongScoreModel()];
      const events = [new LogInfoRelatedEvent()];
      events[0].logInfoDetail = new LogInfoDetail();
      events[0].messageValidationLogInfo = [new ValidationMessage()];

      service.clearDataValidation(wrongScoreModels, events);

      expect(events[0].logInfoDetail).toBeNull();
      expect(events[0].messageValidationLogInfo).toBeNull();
    });
  });
});
