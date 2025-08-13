import { TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../../utility/services/common.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { WrongScoreModel } from '../../../../models/event-wrong-score.model';
import { GetLogInfoModel, ValidationMessage } from '../../../../models/get-log-info.model';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { GetLogInfoParams } from '../models/get-log-info-params.model';
import { EventWrongScoreService } from './event-wrong-score.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

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
      const params = new GetLogInfoParams();
      params.isEdit = false;
      params.requestId = 1;
      params.filter = new FilterModel();
      params.filter.subIssueTypeId = '1';
      params.primitiveProps = {
        filterBy: TVSRequestFilterBy.CHECK_TIME,
        isBlock: false,
        actualScore: '',
        isShowActualScore: false,
        transInfoAddRequestModel: null,
        isShowRelatedEvents: false,
        infoSiteDBDownModel: null
      };
      params.mainEvent = new LogInfoRelatedEvent();
      params.mainEvent.matchId = 1;
      params.mainEvent.isMainMatch = true;
      params.mainEvent.voidTimeArea = {
        fromDateTime: '2024-03-20T09:00:00',
        toDateTime: '2024-03-20T12:00:00',
        aaTime: 10,
        paTime: 10.5,
        saTime: 11
      };
      params.defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
      params.defaultFilterTimeWithAllowance.fromDateTime = '2024-03-20T09:00:00';
      params.defaultFilterTimeWithAllowance.toDateTime = '2024-03-20T12:00:00';
      params.relatedEvents = [];
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

      await service.getLogInfo(params);

      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(params.primitiveProps.transInfoAddRequestModel).toBeDefined();
    });

    it('should get log info and assign results for non-CHECK_TIME filter', async () => {
      const params = new GetLogInfoParams();
      params.isEdit = false;
      params.requestId = 1;
      params.filter = new FilterModel();
      params.filter.subIssueTypeId = '1';
      params.primitiveProps = {
        filterBy: TVSRequestFilterBy.TRANS_TIME,
        isBlock: false,
        actualScore: '',
        isShowActualScore: false,
        transInfoAddRequestModel: null,
        isShowRelatedEvents: false,
        infoSiteDBDownModel: null
      };
      params.wrongScoreModels = [new WrongScoreModel()];
      params.wrongScoreModels[0].matchId = 1;
      params.wrongScoreModels[0].scoreId = 1;
      params.wrongScoreModels[0].filterFromTransTime = '2024-03-20T09:00:00';
      params.wrongScoreModels[0].filterToTransTime = '2024-03-20T12:00:00';

      const mockResponse = {
        transInfoAddRequestModel: {},
        getLogInfoModels: [{
          matchId: 1,
          scoreId: 1,
          logInfoDetail: {
            voidFromTime: '2024-03-20T10:00:00',
            voidToTime: '2024-03-20T11:00:00'
          },
          validation: { isInvalidTotalTickets: false }
        }]
      };
      commonService.getLogInfo = jest.fn().mockResolvedValue(mockResponse);
      eventWrongScoreService.getFilterByBaseOnSubIssueType = jest.fn().mockReturnValue(TVSRequestFilterBy.TRANS_TIME);

      await service.getLogInfo(params);

      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(params.wrongScoreModels[0].voidFromTime).toBeDefined();
      expect(params.wrongScoreModels[0].voidToTime).toBeDefined();
    });
  });

  describe('mapWrongScoreGetLogInfoQuery', () => {
    it('should map WrongScoreModel to WrongScoreGetLogInfoQuery for CHECK_TIME filter', () => {
      const wrongScoreModel = new WrongScoreModel();
      wrongScoreModel.scoreId = 1;
      wrongScoreModel.matchId = 1;
      wrongScoreModel.filterBy = TVSRequestFilterBy.CHECK_TIME;
      wrongScoreModel.subIssueTypeId = 1;
      wrongScoreModel.aaTime = 10;
      wrongScoreModel.paTime = 10.5;
      wrongScoreModel.saTime = 11;

      const defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
      defaultFilterTimeWithAllowance.fromDateTime = '2024-03-20T09:00:00';
      defaultFilterTimeWithAllowance.toDateTime = '2024-03-20T12:00:00';

      const result = service.mapWrongScoreGetLogInfoQuery(wrongScoreModel, TVSRequestFilterBy.CHECK_TIME, defaultFilterTimeWithAllowance);

      expect(result.scoreId).toBe(1);
      expect(result.matchId).toBe(1);
      expect(result.filterBy).toBe(TVSRequestFilterBy.CHECK_TIME);
      expect(result.filterFromTransTime).toBe(defaultFilterTimeWithAllowance.fromDateTime);
      expect(result.filterToTransTime).toBe(defaultFilterTimeWithAllowance.toDateTime);
      expect(result.aaTime).toBe(10);
      expect(result.paTime).toBe(10.5);
      expect(result.saTime).toBe(11);
    });

    it('should map WrongScoreModel to WrongScoreGetLogInfoQuery for non-CHECK_TIME filter', () => {
      const wrongScoreModel = new WrongScoreModel();
      wrongScoreModel.scoreId = 1;
      wrongScoreModel.matchId = 1;
      wrongScoreModel.filterBy = TVSRequestFilterBy.TRANS_TIME;
      wrongScoreModel.subIssueTypeId = 1;
      wrongScoreModel.filterFromTransTime = '2024-03-20T09:00:00';
      wrongScoreModel.filterToTransTime = '2024-03-20T12:00:00';

      const defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
      defaultFilterTimeWithAllowance.fromDateTime = '2024-03-20T09:00:00';
      defaultFilterTimeWithAllowance.toDateTime = '2024-03-20T12:00:00';

      const result = service.mapWrongScoreGetLogInfoQuery(wrongScoreModel, TVSRequestFilterBy.TRANS_TIME, defaultFilterTimeWithAllowance);

      expect(result.scoreId).toBe(1);
      expect(result.matchId).toBe(1);
      expect(result.filterBy).toBe(TVSRequestFilterBy.TRANS_TIME);
      expect(result.filterFromTransTime).toBe(wrongScoreModel.filterFromTransTime);
      expect(result.filterToTransTime).toBe(wrongScoreModel.filterToTransTime);
    });
  });

  describe('getWrongScoreQueryHasManyScores', () => {
    it('should map multiple WrongScoreModels to WrongScoreGetLogInfoQuery array', () => {
      const params = new GetLogInfoParams();
      params.wrongScoreModels = [
        new WrongScoreModel(),
        new WrongScoreModel()
      ];
      params.wrongScoreModels[0].scoreId = 1;
      params.wrongScoreModels[1].scoreId = 2;
      params.defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
      params.defaultFilterTimeWithAllowance.fromDateTime = '2024-03-20T09:00:00';
      params.defaultFilterTimeWithAllowance.toDateTime = '2024-03-20T12:00:00';

      const result = service.getWrongScoreQueryHasManyScores(params, TVSRequestFilterBy.TRANS_TIME);

      expect(result.length).toBe(2);
      expect(result[0].scoreId).toBe(1);
      expect(result[1].scoreId).toBe(2);
    });
  });

  describe('getWrongScoreQueryHasRelatedEvent', () => {
    it('should map main event and related events to WrongScoreGetLogInfoQuery array', () => {
      const params = new GetLogInfoParams();
      params.mainEvent = new LogInfoRelatedEvent();
      params.mainEvent.matchId = 1;
      params.mainEvent.isMainMatch = true;
      params.mainEvent.voidTimeArea = {
        fromDateTime: '2024-03-20T09:00:00',
        toDateTime: '2024-03-20T12:00:00',
        aaTime: 10,
        paTime: 10.5,
        saTime: 11
      };
      params.relatedEvents = [new LogInfoRelatedEvent()];
      params.relatedEvents[0].matchId = 2;
      params.relatedEvents[0].voidTimeArea = {
        fromDateTime: '2024-03-20T09:00:00',
        toDateTime: '2024-03-20T12:00:00',
        aaTime: 10,
        paTime: 10.5,
        saTime: 11
      };
      params.defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
      params.defaultFilterTimeWithAllowance.fromDateTime = '2024-03-20T09:00:00';
      params.defaultFilterTimeWithAllowance.toDateTime = '2024-03-20T12:00:00';

      const result = service.getWrongScoreQueryHasRelatedEvent(params, TVSRequestFilterBy.CHECK_TIME);

      expect(result.length).toBe(2);
      expect(result[0].matchId).toBe(1);
      expect(result[1].matchId).toBe(2);
    });
  });

  describe('assignResultsGetLogInfoForRelatedEvent', () => {
    it('should assign log info results to related event with allowance time', () => {
      const logInfoModel = {
        logInfoDetail: {
          voidFromTime: '2024-03-20T10:00:00',
          voidToTime: '2024-03-20T11:00:00'
        },
        validation: {
          isInvalidTotalTickets: false,
          isPoolHouseAffected: false,
          isExistedInOtherRequest: false,
          isExistsSecondAccept: false,
          isHasSettledTicket: false,
          isHasInstantlySettledTicket: false
        },
        ticketRequest: []
      } as unknown as GetLogInfoModel;
      const event = new LogInfoRelatedEvent();
      event.voidTimeArea = {
        fromDateTime: '2024-03-20T09:00:00',
        toDateTime: '2024-03-20T12:00:00',
        aaTime: 10,
        paTime: 10.5,
        saTime: 11
      };
      validationService.isHasAllowanceTime = jest.fn().mockReturnValue(true);

      service.assignResultsGetLogInfoForRelatedEvent(logInfoModel, event);

      expect(event.logInfoDetail).toBeDefined();
      expect(event.messageValidationLogInfo).toBeDefined();
      expect(event.voidTimeArea.fromDateTime).toBe(moment(logInfoModel.logInfoDetail.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT));
      expect(event.voidTimeArea.toDateTime).toBe(moment(logInfoModel.logInfoDetail.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT));
    });

    it('should assign log info results to related event without allowance time', () => {
      const logInfoModel = {
        logInfoDetail: {
          voidFromTime: '2024-03-20T10:00:00',
          voidToTime: '2024-03-20T11:00:00'
        },
        validation: {
          isInvalidTotalTickets: false,
          isPoolHouseAffected: false,
          isExistedInOtherRequest: false,
          isExistsSecondAccept: false,
          isHasSettledTicket: false,
          isHasInstantlySettledTicket: false
        },
        ticketRequest: []
      } as unknown as GetLogInfoModel;
      const event = new LogInfoRelatedEvent();
      event.voidTimeArea = {
        fromDateTime: '2024-03-20T09:00:00',
        toDateTime: '2024-03-20T12:00:00',
        aaTime: 10,
        paTime: 10.5,
        saTime: 11
      };
      validationService.isHasAllowanceTime = jest.fn().mockReturnValue(false);

      service.assignResultsGetLogInfoForRelatedEvent(logInfoModel, event);

      expect(event.logInfoDetail).toBeDefined();
      expect(event.messageValidationLogInfo).toBeDefined();
      expect(event.voidTimeArea.fromDateTime).toBe('2024-03-20T09:00:00');
      expect(event.voidTimeArea.toDateTime).toBe('2024-03-20T12:00:00');
    });
  });

  describe('clearDataValidation', () => {
    it('should clear validation data from wrongScoreModels', () => {
      const wrongScoreModels = [new WrongScoreModel()];
      wrongScoreModels[0].logInfoDetail = new LogInfoDetail();
      wrongScoreModels[0].messageValidationLogInfo = [new ValidationMessage()];
      wrongScoreModels[0].voidFromTime = '2024-03-20T10:00:00';
      wrongScoreModels[0].voidToTime = '2024-03-20T11:00:00';

      service.clearDataValidation(wrongScoreModels, [], null);

      expect(wrongScoreModels[0].logInfoDetail).toBeNull();
      expect(wrongScoreModels[0].messageValidationLogInfo).toBeNull();
      expect(wrongScoreModels[0].voidFromTime).toBeNull();
      expect(wrongScoreModels[0].voidToTime).toBeNull();
    });

    it('should clear validation data from events and main event', () => {
      const wrongScoreModels = [new WrongScoreModel()];
      const events = [new LogInfoRelatedEvent()];
      const mainEvent = new LogInfoRelatedEvent();

      events[0].logInfoDetail = new LogInfoDetail();
      events[0].messageValidationLogInfo = [new ValidationMessage()];
      mainEvent.logInfoDetail = new LogInfoDetail();
      mainEvent.messageValidationLogInfo = [new ValidationMessage()];

      service.clearDataValidation(wrongScoreModels, events, mainEvent);

      expect(events[0].logInfoDetail).toBeNull();
      expect(events[0].messageValidationLogInfo).toBeNull();
      expect(mainEvent.logInfoDetail).toBeNull();
      expect(mainEvent.messageValidationLogInfo).toBeNull();
    });
  });
});
