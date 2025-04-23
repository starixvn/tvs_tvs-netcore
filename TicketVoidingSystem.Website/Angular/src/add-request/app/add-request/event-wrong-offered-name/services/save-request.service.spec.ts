import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { PopupService } from '../../services/popup.service';
import { AddRequestService } from '../../add-request.service';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { EventWrongOfferedNameService } from './event-wrong-offered-name.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { ConfirmAddRequestModel } from '../../confirm-add-request/confirm-add-request.model';
import { WrongOfferedNameModel } from '../../models/event-wrong-offered-name.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { FilterModel } from '../../filter/filter.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { VoidedReason } from '../../../../../utility/models/reason.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';

// Mock StaticService
jest.mock('../../../../../utility/services/static.service', () => ({
  StaticService: {
    isEditingByAnotherUser: jest.fn().mockReturnValue(false),
    isHasWarningTakenNote: jest.fn().mockReturnValue(false)
  }
}));

class Helper {
  static readonly fakeSaveRequestArg = {
    filter: {
      isVoided: false,
      action: '1',
      issueTypeId: '1',
      subIssueTypeId: '1',
      isTest: false,
      isAbnormal: false,
      actions: []
    } as FilterModel,
    addRequestStore: {
      changeBlockingUiStatus: jest.fn(),
      changeSavingRequestStatus: jest.fn()
    },
    primitiveProps: {
      isBlock: false,
      isShowLogInfo: true,
      transInfoAddRequest: {
        transInfoJson: '{}',
        unMarkTransIds: [] as string[],
        markTransIds: [] as string[],
        removeTransIds: [] as string[]
      }
    } as unknown as PrimitiveProperty,
    logInfoEvent: {
      matchId: 1,
      filterWrongOfferedName: new FilterWrongOfferedNameModel(),
      messageValidationLogInfo: [],
      logInfoDetail: new LogInfoDetail(),
      titleTableTicket: '',
      tableTicketsModel: new TicketsModel(),
      voidReason: new VoidedReason(),
      matchModel: new MatchModel(),
      isCollapse: false,
      isInvalidTotalTickets: false,
      isHasSettledTicket: false,
      isHasInstantlySettledTicket: false
    } as LogInfoWrongOfferedName,
    permission: {},
    isEdit: false,
    requestId: 123,
    userId: 1,
    actionIdOfFirstTimeAccess: '1',
    confirmAddRequest: {} as ConfirmAddRequestModel,
    others: {
      mistakenBy: 'user1',
      decidedBy: 'user1',
      remark: 'test'
    },
    requestedBy: 'user1',
    eventLeagueComponent: {
      isEdit: false,
      matchId: 1,
      isShowSportType: true,
      changeEvent: { emit: jest.fn() },
      selectedMatch: new MatchModel(),
      matches: [],
      isBlock: false,
      tooltip: new Tooltip(),
      validationMessage: '',
      warningSubType: '',
      isShowWarningSubType: false
    } as unknown as EventLeagueComponent,
    filterWrongOfferedNameComponent: {}
  } as unknown as SaveRequestArg;
}

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let popupService: jest.Mocked<PopupService>;
  let addRequestService: jest.Mocked<AddRequestService>;
  let validationService: jest.Mocked<ValidationService>;
  let logInfoService: jest.Mocked<LogInfoService>;
  let eventWrongOfferedNameService: jest.Mocked<EventWrongOfferedNameService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SaveRequestService,
        { provide: PopupService, useValue: { showError: jest.fn() } },
        { provide: AddRequestService, useValue: { executeSaveRequest: jest.fn() } },
        { provide: ValidationService, useValue: {
          validateCommonData: jest.fn(),
          isAccountHasAddRequestPermission: jest.fn(),
          isValidLogInfoEvent: jest.fn()
        }},
        { provide: LogInfoService, useValue: {
          resetLogInfoOfEvent: jest.fn(),
          getLogInfo: jest.fn()
        }},
        { provide: EventWrongOfferedNameService, useValue: {
          initWrongMarketOfferedModel: jest.fn()
        }}
      ]
    });

    service = TestBed.inject(SaveRequestService);
    popupService = TestBed.inject(PopupService) as jest.Mocked<PopupService>;
    addRequestService = TestBed.inject(AddRequestService) as jest.Mocked<AddRequestService>;
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
    logInfoService = TestBed.inject(LogInfoService) as jest.Mocked<LogInfoService>;
    eventWrongOfferedNameService = TestBed.inject(EventWrongOfferedNameService) as jest.Mocked<EventWrongOfferedNameService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should show popup confirm when data is valid', async () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockResolvedValue(true);
      service['showPopupConfirmSave'] = jest.fn();

      // Act
      await service.saveRequest(arg);

      // Assert
      expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(arg);
      expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should not show popup when data is invalid', async () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);

      // Act
      await service.saveRequest(arg);

      // Assert
      expect(arg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(arg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when validation passes', async () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      validationService.validateCommonData.mockReturnValue(true);
      validationService.isAccountHasAddRequestPermission.mockReturnValue(true);
      validationService.isValidLogInfoEvent.mockReturnValue(true);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](arg);

      // Assert
      expect(result).toBe(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
    });

    it('should return false when common data validation fails', async () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      validationService.validateCommonData.mockReturnValue(false);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](arg);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when data is valid', async () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockResolvedValue(true);
      service['executeSaveRequestApi'] = jest.fn();

      // Act
      await service.onClickConfirmSave(arg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(arg);
    });

    it('should show error when data is invalid', async () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);

      // Act
      await service.onClickConfirmSave(arg);

      // Assert
      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });
  });

  describe('showPopupConfirmSave', () => {
    it('should set correct properties for confirm popup', () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      arg.confirmAddRequest = {
        isOpen: false,
        requestId: 0,
        userId: 0,
        requestedBy: '',
        extraWarningModel: { title: '', messages: [] },
        isHasSettledTicket: false,
        isHasWarningTicket: false,
        isHasWarningTakenNote: false,
        isEditingByAnotherUser: false,
        isShowSubIssueType: false
      } as ConfirmAddRequestModel;

      // Act
      service['showPopupConfirmSave'](arg);

      // Assert
      expect(arg.confirmAddRequest.requestId).toBe(arg.requestId);
      expect(arg.confirmAddRequest.requestedBy).toBe(arg.requestedBy);
      expect(arg.confirmAddRequest.isEditingByAnotherUser).toBe(StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId));
      expect(arg.confirmAddRequest.isHasWarningTakenNote).toBe(StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess));
      expect(arg.confirmAddRequest.isHasSettledTicket).toBe(false);
      expect(arg.confirmAddRequest.isHasWarningTicket).toBe(false);
      expect(arg.confirmAddRequest.isShowSubIssueType).toBe(true);
      expect(arg.confirmAddRequest.isOpen).toBe(true);
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should call addRequestService with correct parameters', async () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      const query = new AddRequestQuery();
      service['initAddRequestQuery'] = jest.fn().mockReturnValue(query);

      // Act
      await service['executeSaveRequestApi'](arg);

      // Assert
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        arg.isEdit,
        arg.requestId,
        query,
        arg.addRequestStore
      );
    });
  });

  describe('initAddRequestQuery', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const arg = Helper.fakeSaveRequestArg;
      const wrongMarketOfferedModel = {
        matchId: 1,
        subIssueTypeId: 1,
        logInfoDetail: new LogInfoDetail(),
        licenseeNames: '',
        currencyIds: '',
        wrongName: '',
        actualName: '',
        wrongNameT: '',
        actualNameT: '',
        wrongNameS: '',
        actualNameS: ''
      } as WrongOfferedNameModel;
      eventWrongOfferedNameService.initWrongMarketOfferedModel.mockReturnValue(wrongMarketOfferedModel);

      // Act
      const query = service['initAddRequestQuery'](arg);

      // Assert
      expect(query.transInfoJson).toBe(arg.primitiveProps.transInfoAddRequest?.transInfoJson);
      expect(query.unMarkTransIds).toBe(arg.primitiveProps.transInfoAddRequest?.unMarkTransIds);
      expect(query.markTransIds).toBe(arg.primitiveProps.transInfoAddRequest?.markTransIds);
      expect(query.issueTypeId).toBe(arg.filter.issueTypeId);
      expect(query.isTest).toBe(arg.filter.isTest);
      expect(query.actionId).toBe(arg.filter.action);
      expect(query.isVoided).toBe(arg.filter.isVoided);
      expect(query.mistakenBy).toBe(arg.others.mistakenBy);
      expect(query.decidedBy).toBe(arg.others.decidedBy);
      expect(query.remark).toBe(arg.others.remark);
      expect(query.wrongOfferedNameInfo).toBe(wrongMarketOfferedModel);
    });
  });
});
