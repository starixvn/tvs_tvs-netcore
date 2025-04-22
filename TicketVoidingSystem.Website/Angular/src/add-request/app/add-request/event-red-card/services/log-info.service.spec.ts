import { TestBed } from '@angular/core/testing';
import { LogInfoService } from './log-info.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { ValidationService } from './validation.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property.model';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoViewModel } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';

jest.mock('../../../../../utility/services/static.service', () => ({
  StaticService: {
    isRedCard: jest.fn(),
    isDangerAccepted: jest.fn(),
    getValidationMessageList: jest.fn(),
    isShowVarCheck: jest.fn()
  }
}));

interface MockStaticService {
  isRedCard: jest.Mock;
  isDangerAccepted: jest.Mock;
  getValidationMessageList: jest.Mock;
  isShowVarCheck: jest.Mock;
}

class Helper {
  static readonly fakeMatchId = 12345;
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
    isHasWarningRangeTime: false
  } as LogInfoDetail;

  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1'
  } as FilterModel;

  static readonly fakeTransInfoAddRequestModel = {
    transInfoJson: null,
    unMarkTransIds: '',
    markTransIds: '',
    removeTransIds: ''
  } as TransInfoAddRequestModel;

  static readonly fakeDefaultFilterTimeWithAllowance = {
    fromDateTime: '2024-03-20T10:00:00',
    toDateTime: '2024-03-20T11:00:00',
    saTime: 60,
    aaTime: 30,
    paTime: 15
  } as FilterTimeWithAllowance;
}

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: jest.Mocked<CommonService>;
  let validationService: jest.Mocked<ValidationService>;
  let staticService: MockStaticService;

  beforeEach(() => {
    const mockStaticService = {
      isRedCard: jest.fn(),
      isDangerAccepted: jest.fn(),
      getValidationMessageList: jest.fn(),
      isShowVarCheck: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        { provide: CommonService, useValue: {
          getLogInfo: jest.fn()
        }},
        { provide: ValidationService, useValue: {
          isHasAllowanceTime: jest.fn(),
          isHasWarningRangeTime: jest.fn()
        }},
        { provide: StaticService, useValue: mockStaticService }
      ]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
    staticService = TestBed.inject(StaticService) as unknown as MockStaticService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign results for red card', async () => {
      // Arrange
      const allEvents: LogInfoRelatedEvent[] = [{
        matchId: Helper.fakeMatchId,
        subIssueTypeId: 1,
        voidTimeArea: Helper.fakeDefaultFilterTimeWithAllowance,
        logInfoDetail: null,
        messageValidationLogInfo: null,
        isCheckedVar: null,
        isHighLightVarCheck: null
      } as LogInfoRelatedEvent];

      const primitiveProps = new PrimitiveProperty();
      primitiveProps.filterBy = 1;

      const mockResponse = {
        transInfoAddRequestModel: Helper.fakeTransInfoAddRequestModel,
        getLogInfoModels: [{
          matchId: Helper.fakeMatchId,
          logInfoDetail: Helper.fakeLogInfoDetail,
          validation: {
            isInvalidTotalTickets: false,
            isExistedInOtherRequest: false,
            isExistsSecondAccept: false,
            isHasSettledTicket: false,
            isHasInstantlySettledTicket: false
          }
        }]
      } as GetLogInfoViewModel;

      commonService.getLogInfo.mockResolvedValue(mockResponse);
      validationService.isHasAllowanceTime.mockReturnValue(true);
      validationService.isHasWarningRangeTime.mockReturnValue(false);
      (StaticService.isRedCard as jest.Mock).mockReturnValue(true);
      (StaticService.isDangerAccepted as jest.Mock).mockReturnValue(false);
      (StaticService.getValidationMessageList as jest.Mock).mockReturnValue([{
        isError: false,
        reason: '',
        isShowPopup: false,
        transIds: '',
        requestId: 1
      }]);

      // Act
      await service.getLogInfo(
        allEvents,
        primitiveProps,
        false,
        1,
        Helper.fakeFilterModel,
        Helper.fakeDefaultFilterTimeWithAllowance
      );

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequestModel).toBeDefined();
      expect(allEvents[0].logInfoDetail).toBeDefined();
      expect(allEvents[0].messageValidationLogInfo).toBeDefined();
      expect(StaticService.getValidationMessageList).toHaveBeenCalledWith(
        mockResponse.getLogInfoModels[0],
        Helper.fakeDefaultFilterTimeWithAllowance.fromDateTime,
        Helper.fakeDefaultFilterTimeWithAllowance.saTime
      );
    });
  });

  describe('resetAllEventBeforeSearch', () => {
    it('should reset all events before search', () => {
      // Arrange
      const events: LogInfoRelatedEvent[] = [{
        matchId: Helper.fakeMatchId,
        subIssueTypeId: 2,
        voidTimeArea: Helper.fakeDefaultFilterTimeWithAllowance,
        logInfoDetail: Helper.fakeLogInfoDetail,
        messageValidationLogInfo: []
      } as LogInfoRelatedEvent];

      // Act
      service.resetAllEventBeforeSearch(events, Helper.fakeDefaultFilterTimeWithAllowance, 1);

      // Assert
      expect(events[0].subIssueTypeId).toBe(1);
      expect(events[0].logInfoDetail).toBeNull();
      expect(events[0].messageValidationLogInfo).toBeNull();
      expect(events[0].voidTimeArea).toEqual(Helper.fakeDefaultFilterTimeWithAllowance);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset log info of events', () => {
      // Arrange
      const events: LogInfoRelatedEvent[] = [{
        matchId: Helper.fakeMatchId,
        logInfoDetail: Helper.fakeLogInfoDetail,
        messageValidationLogInfo: []
      } as LogInfoRelatedEvent];

      // Act
      service.resetLogInfoOfEvent(events);

      // Assert
      expect(events[0].logInfoDetail).toBeNull();
      expect(events[0].messageValidationLogInfo).toBeNull();
    });
  });

  describe('resetVoidTimeArea', () => {
    it('should reset void time area of events', () => {
      // Arrange
      const events: LogInfoRelatedEvent[] = [{
        matchId: Helper.fakeMatchId,
        voidTimeArea: {
          fromDateTime: '2024-03-20T09:00:00',
          toDateTime: '2024-03-20T10:00:00',
          saTime: 30,
          aaTime: 15,
          paTime: 5
        } as FilterTimeWithAllowance
      } as LogInfoRelatedEvent];

      // Act
      service.resetVoidTimeArea(events, Helper.fakeDefaultFilterTimeWithAllowance);

      // Assert
      expect(events[0].voidTimeArea).toEqual(Helper.fakeDefaultFilterTimeWithAllowance);
    });
  });

  describe('resetIsCheckedVar', () => {
    it('should reset is checked var of events', () => {
      // Arrange
      const events: LogInfoRelatedEvent[] = [{
        matchId: Helper.fakeMatchId,
        isCheckedVar: true,
        isHighLightVarCheck: true
      } as LogInfoRelatedEvent];

      // Act
      service.resetIsCheckedVar(events);

      // Assert
      expect(events[0].isCheckedVar).toBeNull();
      expect(events[0].isHighLightVarCheck).toBeNull();
    });
  });

  describe('updateIsCheckedVar', () => {
    it('should update is checked var of events when isShowVarCheck returns true', () => {
      // Arrange
      const events: LogInfoRelatedEvent[] = [{
        matchId: Helper.fakeMatchId,
        subIssueTypeId: 1,
        isCheckedVar: null,
        isHighLightVarCheck: null
      } as LogInfoRelatedEvent];

      (StaticService.isShowVarCheck as jest.Mock).mockReturnValue(true);

      // Act
      service.updateIsCheckedVar(events, true);

      // Assert
      expect(StaticService.isShowVarCheck).toHaveBeenCalledWith(1);
      expect(events[0].isCheckedVar).toBe(true);
      expect(events[0].isHighLightVarCheck).toBe(false);
    });

    it('should not update is checked var when isShowVarCheck returns false', () => {
      // Arrange
      const events: LogInfoRelatedEvent[] = [{
        matchId: Helper.fakeMatchId,
        subIssueTypeId: 1,
        isCheckedVar: null,
        isHighLightVarCheck: null
      } as LogInfoRelatedEvent];

      (StaticService.isShowVarCheck as jest.Mock).mockReturnValue(false);

      // Act
      service.updateIsCheckedVar(events, true);

      // Assert
      expect(StaticService.isShowVarCheck).toHaveBeenCalledWith(1);
      expect(events[0].isCheckedVar).toBe(null);
      expect(events[0].isHighLightVarCheck).toBe(false);
    });
  });
});
