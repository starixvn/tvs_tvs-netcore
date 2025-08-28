import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../../../../services/popup.service';
import { AddRequestService } from '../../../../../services/add-request.service';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TEXT } from '../../../../../../utility/constants/text';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AddRequestQuery } from '../../../../../models/add-request.query';
import { WrongOddsSportsBookModel } from '../../../../../models/event-wrong-odds-sports-book.model';
import { CheckAddPermissionService } from '../../../../../services/check-permission.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestService: AddRequestService;
  let eventWrongOddsSportsBookService: EventWrongOddsSportsBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        SaveRequestService,
        ValidationService,
        LogInfoService,
        PopupService,
        AddRequestService,
        EventWrongOddsSportsBookService,
        CheckAddPermissionService
      ]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestService = TestBed.inject(AddRequestService);
    eventWrongOddsSportsBookService = TestBed.inject(EventWrongOddsSportsBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should show popup confirm when data is valid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: false },
        isEdit: false,
        requestId: '123',
        userId: 1,
        confirmAddRequest: {},
        others: {},
        eventLeagueComponent: {},
        filterWrongOddsSportsBookComponent: {},
        advancedModeComponent: {},
        permission: {}
      } as unknown as SaveRequestArg;
      service.recheckLogInfoBeforeSaveRequest = jest.fn().mockResolvedValue(true);
      service['showPopupConfirmSave'] = jest.fn();
      
      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(mockArg);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should not show popup when data is invalid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: false },
        isEdit: false,
        requestId: '123',
        userId: 1,
        confirmAddRequest: {},
        others: {},
        eventLeagueComponent: {},
        filterWrongOddsSportsBookComponent: {},
        advancedModeComponent: {},
        permission: {}
      } as unknown as SaveRequestArg;

      service.recheckLogInfoBeforeSaveRequest = jest.fn().mockResolvedValue(false);
      service['showPopupConfirmSave'] = jest.fn();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(service['showPopupConfirmSave']).not.toHaveBeenCalled();
    });
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when validation passes', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: false },
        isEdit: false,
        requestId: '123',
        userId: 1,
        confirmAddRequest: {},
        others: {},
        eventLeagueComponent: {},
        filterWrongOddsSportsBookComponent: {},
        advancedModeComponent: {},
        permission: {}
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(validationService, 'isAccountHasAddRequestPermission').mockReturnValue(true);
      jest.spyOn(validationService, 'isValidLogInfoEvent').mockReturnValue(true);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockArg);

      // Assert
      expect(result).toBeTruthy();
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
    });

    it('should return false when common data validation fails', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: false },
        isEdit: false,
        requestId: '123',
        userId: 1,
        confirmAddRequest: {},
        others: {},
        eventLeagueComponent: {},
        filterWrongOddsSportsBookComponent: {},
        advancedModeComponent: {},
        permission: {}
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockArg);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('showPopupConfirmSave', () => {
    it('should set correct values for confirm popup', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { action: 'action1' },
        isEdit: true,
        userId: 1,
        requestId: '123',
        requestedBy: 'user1',
        actionIdOfFirstTimeAccess: 'action2',
        logInfoEvent: {
          logInfoDetail: { settleCount: 1 },
          messageValidationLogInfo: ['warning1']
        },
        confirmAddRequest: {}
      } as unknown as SaveRequestArg;

      jest.spyOn(StaticService, 'isEditingByAnotherUser').mockReturnValue(true);
      jest.spyOn(StaticService, 'isHasWarningTakenNote').mockReturnValue(true);

      // Act
      service['showPopupConfirmSave'](mockArg);

      // Assert
      expect(mockArg.confirmAddRequest.requestId).toBe('123');
      expect(mockArg.confirmAddRequest.requestedBy).toBe('user1');
      expect(mockArg.confirmAddRequest.isEditingByAnotherUser).toBeTruthy();
      expect(mockArg.confirmAddRequest.isHasWarningTakenNote).toBeTruthy();
      expect(mockArg.confirmAddRequest.isHasSettledTicket).toBeTruthy();
      expect(mockArg.confirmAddRequest.isHasWarningTicket).toBeTruthy();
      expect(mockArg.confirmAddRequest.isOpen).toBeTruthy();
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when validation passes', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: false },
        isEdit: false,
        requestId: '123',
        userId: 1,
        confirmAddRequest: {},
        others: {},
        eventLeagueComponent: {},
        filterWrongOddsSportsBookComponent: {},
        advancedModeComponent: {},
        permission: {}
      } as unknown as SaveRequestArg;

      service.recheckLogInfoBeforeSaveRequest = jest.fn().mockResolvedValue(true);
      service['executeSaveRequestApi'] = jest.fn();

      // Act
      await service.onClickConfirmSave(mockArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
    });

    it('should show error when validation fails', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: false },
        isEdit: false,
        requestId: '123',
        userId: 1,
        confirmAddRequest: {},
        others: {},
        eventLeagueComponent: {},
        filterWrongOddsSportsBookComponent: {},
        advancedModeComponent: {},
        permission: {}
      } as unknown as SaveRequestArg;
      service.recheckLogInfoBeforeSaveRequest = jest.fn().mockResolvedValue(false);
      jest.spyOn(popupService, 'showError');

      // Act
      await service.onClickConfirmSave(mockArg);

      // Assert
      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });
  });

  describe('initAddRequestQuery', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: {
          isVoided: false,
          issueTypeId: '1',
          isTest: true,
          action: 'action1',
          subIssueTypeId: '2'
        },
        primitiveProps: {
          transInfoAddRequestModel: {
            transInfoJson: 'json',
            unMarkTransIds: ['1', '2'],
            markTransIds: ['3', '4']
          }
        },
        others: {
          mistakenBy: 'user1',
          decidedBy: 'user2',
          remark: 'remark'
        },
        logInfoEvent: {}
      } as unknown as SaveRequestArg;

      jest.spyOn(eventWrongOddsSportsBookService, 'getWrongOddsSportsBookModel').mockReturnValue({} as unknown as WrongOddsSportsBookModel);

      // Act
      const result = service['initAddRequestQuery'](mockArg);

      // Assert
      expect(result).toBeInstanceOf(AddRequestQuery);
      expect(result.transInfoJson).toBe('json');
      expect(result.unMarkTransIds).toEqual(['1', '2']);
      expect(result.markTransIds).toEqual(['3', '4']);
      expect(result.issueTypeId).toBe('1');
      expect(result.isTest).toBeTruthy();
      expect(result.actionId).toBe('action1');
      expect(result.isVoided).toBeFalsy();
      expect(result.mistakenBy).toBe('user1');
      expect(result.decidedBy).toBe('user2');
      expect(result.remark).toBe('remark');
      expect(result.wrongOddsSportsBookInfo).toBeDefined();
    });
  });
});
