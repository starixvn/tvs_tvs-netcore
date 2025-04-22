import { TestBed } from '@angular/core/testing';
import { LogInfoService } from './log-info.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { EventEarlyKickOffService } from './event-eko.service';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { FilterModel } from '../../filter/filter.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { GetLogInfoViewModel } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { Validation } from '../../models/get-log-info.model';
import { EarlyKickOffGetLogInfoQuery } from '../models/get-log-info.query';
import { ValidationMessage } from '../../models/get-log-info.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { TemplateService } from '../../../../../utility/components/template-message/template-message/services/template.service';
import { HttpService } from '../../../../../utility/services/http.service';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeKickOffTime = '2020-10-08 09:44:46.361 PM';
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
    isHasInstantlySettledTicket: false
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
    subIssueTypeId: '11',
    action: '1'
  } as FilterModel;

  static readonly fakeTransInfoAddRequestModel = {
    transInfoJson: null,
    unMarkTransIds: '',
    markTransIds: '',
    removeTransIds: ''
  } as TransInfoAddRequestModel;

  static readonly fakeEarlyKickOffGetLogInfoQuery = {
    matchId: Helper.fakeMatchId,
    isMainMatch: true,
    subIssueTypeId: 11,
    kickOffTime: Helper.fakeKickOffTime
  } as EarlyKickOffGetLogInfoQuery;

  static readonly fakeValidationMessage = {
    isError: true,
    reason: 'Test error message',
    isShowPopup: false,
    transIds: '',
    requestId: 1
  } as ValidationMessage;

  static readonly fakeTableTicketsModel = {
    id: 1,
    groups: [],
    total: 10,
    totalSingle: 5,
    totalParlay: 5,
    groupPHAffected: true,
    isHasSettledTicket: true,
    isHasInstantlySettledTicket: false,
    isInvalidTotalTickets: false,
    isExistedInOtherRequest: false,
    isExistsSecondAccept: false,
    initData: jest.fn()
  } as unknown as TableTicketsModel;
}

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: jest.Mocked<CommonService>;
  let eventEarlyKickOffService: jest.Mocked<EventEarlyKickOffService>;
  let httpService: jest.Mocked<HttpService>;
  let templateService: jest.Mocked<TemplateService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        { provide: CommonService, useValue: {
          getLogInfo: jest.fn()
        } },
        { provide: EventEarlyKickOffService, useValue: {
          getEarlyKickOffModel: jest.fn()
        } },
        { provide: StaticService, useValue: {
          getValidationMessageList: jest.fn().mockReturnValue([Helper.fakeValidationMessage])
        } },
        { provide: HttpService, useValue: {
          postJson: jest.fn()
        } },
        { provide: TemplateService, useValue: {
          initializeTemplateValue: jest.fn().mockReturnValue({})
        } }
      ]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    eventEarlyKickOffService = TestBed.inject(EventEarlyKickOffService) as jest.Mocked<EventEarlyKickOffService>;
    httpService = TestBed.inject(HttpService) as jest.Mocked<HttpService>;
    templateService = TestBed.inject(TemplateService) as jest.Mocked<TemplateService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTickets', () => {
    it('should get tickets when logInfoDetail.logInfoTicketsJson is null', async () => {
      // Arrange
      const logInfo = {
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        logInfoDetail: { logInfoTicketsJson: null },
        pagingModel: { page: 1, pageSize: 10 },
        tableTicketsModel: Helper.fakeTableTicketsModel
      } as LogInfoEarlyKickOff;
      const isEdit = false;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;

      const mockResponse = {
        transInfoAddRequestModel: Helper.fakeTransInfoAddRequestModel,
        getLogInfoModels: [Helper.fakeGetLogInfoModel]
      } as GetLogInfoViewModel;

      commonService.getLogInfo.mockResolvedValue(mockResponse);
      httpService.postJson.mockResolvedValue(Helper.fakeTableTicketsModel);

      // Act
      await service.getTickets(logInfo, isEdit, requestId, filter);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(httpService.postJson).toHaveBeenCalled();
      expect(logInfo.tableTicketsModel.initData).toHaveBeenCalled();
      expect(logInfo.isRenderedTickets).toBe(true);
      expect(logInfo.isShowValidation).toBe(true);
      expect(logInfo.isCollapse).toBe(false);
    });

    it('should not get tickets when logInfoDetail.logInfoTicketsJson exists', async () => {
      // Arrange
      const logInfo = {
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        logInfoDetail: { logInfoTicketsJson: 'some data' },
        pagingModel: { page: 1, pageSize: 10 },
        tableTicketsModel: Helper.fakeTableTicketsModel,
        isRenderedTickets: false
      } as LogInfoEarlyKickOff;
      const isEdit = false;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;

      // Mock the getLogInfoTickets method to avoid the error
      jest.spyOn(service as any, 'getLogInfoTickets').mockImplementation(async () => {
        // Do nothing
      });

      // Act
      await service.getTickets(logInfo, isEdit, requestId, filter);

      // Assert
      expect(commonService.getLogInfo).not.toHaveBeenCalled();
      expect(httpService.postJson).not.toHaveBeenCalled();
      expect(logInfo.isRenderedTickets).toBe(false);
    });
  });

  describe('initQueryGetTickets', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const pageIndex = 0;
      const pageSize = 10;
      const logInfo = {
        logInfoDetail: { logInfoTicketsJson: 'some data' }
      } as LogInfoEarlyKickOff;
      const filter = Helper.fakeFilterModel;

      // Act
      const result = service.initQueryGetTickets(pageIndex, pageSize, logInfo, filter);

      // Assert
      expect(result.logInfoTicketsJson).toBe('some data');
      expect(result.issueTypeId).toBe(Number(filter.issueTypeId));
      expect(result.pageIndex).toBe(pageIndex);
      expect(result.pageSize).toBe(pageSize);
    });
  });

  describe('assignTemplateMessageValueToEvent', () => {
    it('should assign template message values correctly', () => {
      // Arrange
      const eventLogInfo = {
        matchModel: {},
        tableTicketsModel: Helper.fakeTableTicketsModel,
        kickOffTime: Helper.fakeKickOffTime
      } as LogInfoEarlyKickOff;

      // Act
      service.assignTemplateMessageValueToEvent(eventLogInfo);

      // Assert
      expect(templateService.initializeTemplateValue).toHaveBeenCalledWith(eventLogInfo.matchModel);
      expect(eventLogInfo.templateValue.groupPHAffected).toBe(Helper.fakeTableTicketsModel.groupPHAffected);
      expect(eventLogInfo.templateValue.checkSettled).toBe(Helper.fakeTableTicketsModel.isHasSettledTicket);
      expect(eventLogInfo.templateValue.kickOffTime).toBe(Helper.fakeKickOffTime);
    });
  });

  describe('getLogInfo', () => {
    it('should get log info and assign results', async () => {
      // Arrange
      const selectedEvents = [{
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        isCollapse: true,
        isShowValidation: false
      } as LogInfoEarlyKickOff];
      const isEdit = false;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;

      const mockResponse = {
        transInfoAddRequestModel: Helper.fakeTransInfoAddRequestModel,
        getLogInfoModels: [Helper.fakeGetLogInfoModel]
      } as GetLogInfoViewModel;

      commonService.getLogInfo.mockResolvedValue(mockResponse);
      eventEarlyKickOffService.getEarlyKickOffModel.mockReturnValue([Helper.fakeEarlyKickOffGetLogInfoQuery]);

      // Act
      const result = await service.getLogInfo(selectedEvents, isEdit, requestId, filter);
      service.assignResultLogInfoToEvents(selectedEvents, result.getLogInfoModels);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
      expect(selectedEvents[0].logInfoDetail).toBeDefined();
      expect(selectedEvents[0].messageValidationLogInfo).toBeDefined();
    });
  });

  describe('initGetLogInfoEarlyKickOffQuery', () => {
    it('should initialize query with correct values for new request', () => {
      // Arrange
      const isEdit = false;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;
      const events = [{
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        kickOffTime: Helper.fakeKickOffTime
      } as LogInfoEarlyKickOff];

      eventEarlyKickOffService.getEarlyKickOffModel.mockReturnValue([Helper.fakeEarlyKickOffGetLogInfoQuery]);

      // Act
      const result = service.initGetLogInfoEarlyKickOffQuery(isEdit, requestId, filter, events);

      // Assert
      expect(result.requestId).toBeNull();
      expect(result.actionId).toBe(Number(filter.action));
      expect(result.issueTypeId).toBe(Number(filter.issueTypeId));
      expect(result.earlyKickOffModels).toBeDefined();
    });

    it('should initialize query with correct values for edit request', () => {
      // Arrange
      const isEdit = true;
      const requestId = 1;
      const filter = Helper.fakeFilterModel;
      const events = [{
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        kickOffTime: Helper.fakeKickOffTime
      } as LogInfoEarlyKickOff];

      eventEarlyKickOffService.getEarlyKickOffModel.mockReturnValue([Helper.fakeEarlyKickOffGetLogInfoQuery]);

      // Act
      const result = service.initGetLogInfoEarlyKickOffQuery(isEdit, requestId, filter, events);

      // Assert
      expect(result.requestId).toBe(requestId);
      expect(result.actionId).toBe(Number(filter.action));
      expect(result.issueTypeId).toBe(Number(filter.issueTypeId));
      expect(result.earlyKickOffModels).toBeDefined();
    });
  });

  describe('assignResultLogInfoToEvents', () => {
    it('should assign log info results to events correctly', () => {
      // Arrange
      const selectedEvents = [{
        matchId: Helper.fakeMatchId,
        isCollapse: true,
        isShowValidation: false
      } as LogInfoEarlyKickOff];
      const logInfoModels = [Helper.fakeGetLogInfoModel];

      // Act
      service.assignResultLogInfoToEvents(selectedEvents, logInfoModels);

      // Assert
      expect(selectedEvents[0].isInvalidTotalTickets).toBe(Helper.fakeValidation.isInvalidTotalTickets);
      expect(selectedEvents[0].isHasSettledTicket).toBe(Helper.fakeValidation.isHasSettledTicket);
      expect(selectedEvents[0].isHasInstantlySettledTicket).toBe(Helper.fakeValidation.isHasInstantlySettledTicket);
      expect(selectedEvents[0].messageValidationLogInfo).toBeDefined();
      expect(selectedEvents[0].logInfoDetail).toBe(Helper.fakeLogInfoDetail);
      expect(selectedEvents[0].isCollapse).toBe(true);
      expect(selectedEvents[0].isShowValidation).toBe(false);
    });

    it('should set isShowValidation to true when isInvalidTotalTickets is true', () => {
      // Arrange
      const selectedEvents = [{
        matchId: Helper.fakeMatchId,
        isCollapse: true,
        isShowValidation: false
      } as LogInfoEarlyKickOff];
      const logInfoModels = [{
        ...Helper.fakeGetLogInfoModel,
        validation: {
          ...Helper.fakeValidation,
          isInvalidTotalTickets: true
        }
      }];

      // Act
      service.assignResultLogInfoToEvents(selectedEvents, logInfoModels);

      // Assert
      expect(selectedEvents[0].isShowValidation).toBe(true);
      expect(selectedEvents[0].isCollapse).toBe(false);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info of events', () => {
      // Arrange
      const events = [{
        matchId: Helper.fakeMatchId,
        isRenderedTickets: true,
        messageValidationLogInfo: [Helper.fakeValidationMessage]
      } as LogInfoEarlyKickOff];

      // Act
      service.resetLogInfoOfEvent(events);

      // Assert
      expect(events[0].isRenderedTickets).toBe(false);
      expect(events[0].messageValidationLogInfo).toBeNull();
    });
  });
});
