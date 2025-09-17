import { TestBed } from '@angular/core/testing';
import { LogInfoService } from './log-info.service';
import { CommonService } from '../../../../../../utility/services/common.service';
import { EventWrongOfferedNameService } from './event-wrong-offered-name.service';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoModel } from '../../../../../models/get-log-info.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { GetLogInfoViewModel } from '../../../../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../../models/trans-info-add-request.model';
import { VoidedReason } from '../../../../../../utility/models/reason.model';
import { TemplateValue } from '../../../../../../utility/components/template-message/template-message/template.model';
import { ValidationMessage } from '../../../../../models/get-log-info.model';
import { TicketsModel } from '../../../../../component/pool-house-ticket/tickets/tickets.model';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false
  } as FilterModel;

  static readonly fakeLogInfoWrongOfferedName = {
    matchId: 12345,
    matchModel: {
      sportType: 1
    },
    filterWrongOfferedName: {
      licenseeNames: ['Test Licensee'],
      currencyIds: ['1', '2']
    }
  } as LogInfoWrongOfferedName;

  static readonly fakeGetLogInfoModel = {
    matchId: 12345,
    logInfoDetail: {
      logInfoTicketsJson: '{}'
    },
    validation: {
      isInvalidTotalTickets: false,
      isHasSettledTicket: false,
      isHasInstantlySettledTicket: false
    }
  } as GetLogInfoModel;

  static readonly fakeTransInfoAddRequestModel = {
    transInfoJson: '{}',
    unMarkTransIds: '',
    markTransIds: '',
    removeTransIds: ''
  } as TransInfoAddRequestModel;

  static readonly fakeVoidedReason = {
    reasonEnglish: 'Test Reason',
    reasonChineseSimplified: 'Test Reason CN'
  } as VoidedReason;

  static readonly fakeTemplateValue = {
    matchId: 12345,
    groupPHAffected: 0
  } as TemplateValue;

  static readonly fakeValidationMessage = [{
    isError: false,
    reason: 'Test Message'
  }] as ValidationMessage[];
}

describe('LogInfoService', () => {
  let service: LogInfoService;
  let commonService: jest.Mocked<CommonService>;
  let eventWrongOfferedNameService: jest.Mocked<EventWrongOfferedNameService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogInfoService,
        { provide: CommonService, useValue: {
          getLogInfo: jest.fn(),
          getVoidedReason: jest.fn()
        } },
        { provide: EventWrongOfferedNameService, useValue: {
          getAffectedTickets: jest.fn(),
          getTemplateMessageValue: jest.fn(),
          getTitleTableTicket: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(LogInfoService);
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    eventWrongOfferedNameService = TestBed.inject(EventWrongOfferedNameService) as jest.Mocked<EventWrongOfferedNameService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLogInfo', () => {
    it('should get log info and assign to primitive properties', async () => {
      // Arrange
      const logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
      const isEdit = false;
      const requestId = 123;
      const filter = Helper.fakeFilterModel;
      const primitiveProps = new PrimitiveProperty();
      const mockViewModel = {
        transInfoAddRequestModel: Helper.fakeTransInfoAddRequestModel,
        getLogInfoModels: [Helper.fakeGetLogInfoModel]
      } as GetLogInfoViewModel;

      commonService.getLogInfo.mockResolvedValue(mockViewModel);
      eventWrongOfferedNameService.getAffectedTickets.mockResolvedValue({ isHasSettledTicket: false } as TicketsModel);
      commonService.getVoidedReason.mockResolvedValue(Helper.fakeVoidedReason);
      eventWrongOfferedNameService.getTemplateMessageValue.mockReturnValue(Helper.fakeTemplateValue);
      eventWrongOfferedNameService.getTitleTableTicket.mockReturnValue('Test Title');

      // Act
      await service.getLogInfo(logInfoEvent, isEdit, requestId, filter, primitiveProps);

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(primitiveProps.transInfoAddRequest).toBe(mockViewModel.transInfoAddRequestModel);
      expect(eventWrongOfferedNameService.getAffectedTickets).toHaveBeenCalled();
      expect(commonService.getVoidedReason).toHaveBeenCalled();
      expect(eventWrongOfferedNameService.getTemplateMessageValue).toHaveBeenCalled();
      expect(eventWrongOfferedNameService.getTitleTableTicket).toHaveBeenCalled();
    });
  });

  describe('assignResultLogInfoToEvents', () => {
    it('should assign log info to events correctly', async () => {
      // Arrange
      const filter = Helper.fakeFilterModel;
      const logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
      const logInfoModels = [Helper.fakeGetLogInfoModel];
      const mockTicketTable = { isHasSettledTicket: false };
      const mockVoidReason = Helper.fakeVoidedReason;
      const mockTemplateValue = Helper.fakeTemplateValue;
      const mockTitle = 'Test Title';

      eventWrongOfferedNameService.getAffectedTickets.mockResolvedValue(mockTicketTable as TicketsModel);
      commonService.getVoidedReason.mockResolvedValue(mockVoidReason);
      eventWrongOfferedNameService.getTemplateMessageValue.mockReturnValue(mockTemplateValue);
      eventWrongOfferedNameService.getTitleTableTicket.mockReturnValue(mockTitle);

      // Act
      await service.assignResultLogInfoToEvents(filter, logInfoEvent, logInfoModels);

      // Assert
      expect(logInfoEvent.tableTicketsModel).toBe(mockTicketTable);
      expect(logInfoEvent.titleTableTicket).toBe(mockTitle);
      expect(logInfoEvent.voidReason).toBe(mockVoidReason);
      expect(logInfoEvent.templateValue).toBe(mockTemplateValue);
      expect(logInfoEvent.isHasSettledTicket).toBe(Helper.fakeGetLogInfoModel.validation.isHasSettledTicket);
      expect(logInfoEvent.isHasInstantlySettledTicket).toBe(Helper.fakeGetLogInfoModel.validation.isHasInstantlySettledTicket);
      expect(logInfoEvent.isInvalidTotalTickets).toBe(Helper.fakeGetLogInfoModel.validation.isInvalidTotalTickets);
    });
  });

  describe('getVoidedReason', () => {
    it('should return null when isInvalidTotalTickets is true', async () => {
      // Act
      const result = await service.getVoidedReason(true, 1, 1);

      // Assert
      expect(result).toBeNull();
    });

    it('should call getVoidedReason when isInvalidTotalTickets is false', async () => {
      // Arrange
      const mockReason = Helper.fakeVoidedReason;
      commonService.getVoidedReason.mockResolvedValue(mockReason);

      // Act
      const result = await service.getVoidedReason(false, 1, 1);

      // Assert
      expect(commonService.getVoidedReason).toHaveBeenCalledWith(1, 1);
      expect(result).toBe(mockReason);
    });
  });

  describe('resetLogInfoOfEvent', () => {
    it('should reset messageValidationLogInfo to null', () => {
      // Arrange
      const logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
      logInfoEvent.messageValidationLogInfo = Helper.fakeValidationMessage;

      // Act
      service.resetLogInfoOfEvent(logInfoEvent);

      // Assert
      expect(logInfoEvent.messageValidationLogInfo).toBeNull();
    });
  });
});
