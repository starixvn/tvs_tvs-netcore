import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../services/popup.service';
import { AddRequestService } from '../../add-request.service';
import { EventOtherIssuesService } from './event-other-issues.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TEXT } from '../../../../../utility/constants/text';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let mockValidationService: ValidationService;
  let mockLogInfoService: LogInfoService;
  let mockPopupService: PopupService;
  let mockAddRequestService: AddRequestService;
  let mockEventOtherIssuesService: EventOtherIssuesService;

  beforeEach(() => {
    // Mock document
    const mockBody = {
      getAttribute: jest.fn().mockReturnValue('1')
    };
    document.getElementById = jest.fn().mockReturnValue(mockBody);

    mockValidationService = {
      validateCommonData: jest.fn(),
      isAccountHasAddRequestPermission: jest.fn(),
      isValidLogInfoEvent: jest.fn()
    } as unknown as ValidationService;

    mockLogInfoService = {
      resetLogInfoOfEvent: jest.fn(),
      getLogInfo: jest.fn()
    } as unknown as LogInfoService;

    mockPopupService = {
      showError: jest.fn()
    } as unknown as PopupService;

    mockAddRequestService = {
      executeSaveRequest: jest.fn()
    } as unknown as AddRequestService;

    mockEventOtherIssuesService = {
      getOtherIssuesModel: jest.fn()
    } as unknown as EventOtherIssuesService;

    TestBed.configureTestingModule({
      providers: [
        SaveRequestService,
        { provide: ValidationService, useValue: mockValidationService },
        { provide: LogInfoService, useValue: mockLogInfoService },
        { provide: PopupService, useValue: mockPopupService },
        { provide: AddRequestService, useValue: mockAddRequestService },
        { provide: EventOtherIssuesService, useValue: mockEventOtherIssuesService }
      ]
    });

    service = TestBed.inject(SaveRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should show popup when data is valid and not voided', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { 
          changeBlockingUiStatus: jest.fn(), 
          changeSavingRequestStatus: jest.fn() 
        },
        logInfoEvent: {},
        eventLeagueComponent: {},
        filterOtherIssuesComponent: {},
        advancedModeComponent: {},
        primitiveProps: { isShowValidation: false },
        requestId: '123',
        permission: {},
        confirmAddRequest: {},
        requestedBy: 'test',
        userId: 1,
        isEdit: false,
        actionIdOfFirstTimeAccess: '1',
        others: {}
      } as unknown as SaveRequestArg;

      (mockValidationService.validateCommonData as jest.Mock).mockReturnValue(true);
      (mockValidationService.isAccountHasAddRequestPermission as jest.Mock).mockReturnValue(true);
      (mockValidationService.isValidLogInfoEvent as jest.Mock).mockReturnValue(true);

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should not show popup when data is invalid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { 
          changeBlockingUiStatus: jest.fn(), 
          changeSavingRequestStatus: jest.fn() 
        },
        logInfoEvent: {},
        eventLeagueComponent: {},
        filterOtherIssuesComponent: {},
        advancedModeComponent: {},
        primitiveProps: { isShowValidation: false },
        requestId: '123',
        permission: {},
        confirmAddRequest: {},
        requestedBy: 'test',
        userId: 1,
        isEdit: false,
        actionIdOfFirstTimeAccess: '1',
        others: {}
      } as unknown as SaveRequestArg;

      (mockValidationService.validateCommonData as jest.Mock).mockReturnValue(false);

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when all validations pass', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { 
          changeBlockingUiStatus: jest.fn(), 
          changeSavingRequestStatus: jest.fn() 
        },
        logInfoEvent: {},
        eventLeagueComponent: {},
        filterOtherIssuesComponent: {},
        advancedModeComponent: {},
        primitiveProps: { isShowValidation: false },
        requestId: '123',
        permission: {},
        confirmAddRequest: {},
        requestedBy: 'test',
        userId: 1,
        isEdit: false,
        actionIdOfFirstTimeAccess: '1',
        others: {}
      } as unknown as SaveRequestArg;

      (mockValidationService.validateCommonData as jest.Mock).mockReturnValue(true);
      (mockValidationService.isAccountHasAddRequestPermission as jest.Mock).mockReturnValue(true);
      (mockValidationService.isValidLogInfoEvent as jest.Mock).mockReturnValue(true);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(mockArg);

      // Assert
      expect(result).toBeTruthy();
      expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
      expect(mockLogInfoService.getLogInfo).toHaveBeenCalled();
    });

    it('should return false when common data validation fails', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { 
          changeBlockingUiStatus: jest.fn(), 
          changeSavingRequestStatus: jest.fn() 
        },
        logInfoEvent: {},
        eventLeagueComponent: {},
        filterOtherIssuesComponent: {},
        advancedModeComponent: {},
        primitiveProps: { isShowValidation: false },
        requestId: '123',
        permission: {},
        confirmAddRequest: {},
        requestedBy: 'test',
        userId: 1,
        isEdit: false,
        actionIdOfFirstTimeAccess: '1',
        others: {}
      } as unknown as SaveRequestArg;

      (mockValidationService.validateCommonData as jest.Mock).mockReturnValue(false);

      // Act
      const result = await service.recheckLogInfoBeforeSaveRequest(mockArg);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when data is valid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { 
          changeBlockingUiStatus: jest.fn(),
          changeSavingRequestStatus: jest.fn()
        },
        logInfoEvent: {},
        eventLeagueComponent: {},
        filterOtherIssuesComponent: {},
        advancedModeComponent: {},
        primitiveProps: { isShowValidation: false },
        requestId: '123',
        permission: {},
        confirmAddRequest: {},
        isEdit: false,
        others: {},
        requestedBy: 'test',
        userId: 1,
        actionIdOfFirstTimeAccess: '1'
      } as unknown as SaveRequestArg;

      (mockValidationService.validateCommonData as jest.Mock).mockReturnValue(true);
      (mockValidationService.isAccountHasAddRequestPermission as jest.Mock).mockReturnValue(true);
      (mockValidationService.isValidLogInfoEvent as jest.Mock).mockReturnValue(true);

      // Act
      await service.onClickConfirmSave(mockArg);

      // Assert
      expect(mockAddRequestService.executeSaveRequest).toHaveBeenCalled();
    });

    it('should show error when data is invalid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { 
          changeBlockingUiStatus: jest.fn(),
          changeSavingRequestStatus: jest.fn()
        },
        logInfoEvent: {},
        eventLeagueComponent: {},
        filterOtherIssuesComponent: {},
        advancedModeComponent: {},
        primitiveProps: { isShowValidation: false },
        requestId: '123',
        permission: {},
        confirmAddRequest: {},
        isEdit: false,
        others: {},
        requestedBy: 'test',
        userId: 1,
        actionIdOfFirstTimeAccess: '1'
      } as unknown as SaveRequestArg;

      (mockValidationService.validateCommonData as jest.Mock).mockReturnValue(false);

      // Act
      await service.onClickConfirmSave(mockArg);

      // Assert
      expect(mockPopupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });
  });
});
