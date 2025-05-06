import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../services/popup.service';
import { AddRequestService } from '../../add-request.service';
import { EventReducedOverService } from './event-reduced-over.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestService: AddRequestService;
  let eventReducedOverService: EventReducedOverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [SaveRequestService, ValidationService, LogInfoService, EventReducedOverService]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestService = TestBed.inject(AddRequestService);
    eventReducedOverService = TestBed.inject(EventReducedOverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should proceed with save when data is valid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(true);
      jest.spyOn(service as any, 'proceedSaveRequest').mockImplementation();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(service['proceedSaveRequest']).toHaveBeenCalledWith(mockArg);
    });

    it('should not proceed with save when data is invalid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'proceedSaveRequest').mockImplementation();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(service['proceedSaveRequest']).not.toHaveBeenCalled();
    });
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when validation passes', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(validationService, 'isValidLogInfoEvent').mockReturnValue(true);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockArg);

      // Assert
      expect(result).toBeTruthy();
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should return false when validation fails', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockArg);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('proceedSaveRequest', () => {
    it('should show confirmation popup when validation check passes', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'checkCanShowConfirmationReducedOver').mockReturnValue(true);
      jest.spyOn(service as any, 'getMessageConfirmationReducedOver').mockReturnValue('test message');
      jest.spyOn(popupService, 'showConfirm').mockImplementation();

      // Act
      service['proceedSaveRequest'](mockArg);

      // Assert
      expect(popupService.showConfirm).toHaveBeenCalled();
    });

    it('should execute save request directly when no confirmation needed', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'checkCanShowConfirmationReducedOver').mockReturnValue(false);
      jest.spyOn(service as any, 'executeSaveRequestApi').mockImplementation();

      // Act
      service['proceedSaveRequest'](mockArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
    });
  });

  describe('getMessageConfirmationReducedOver', () => {
    it('should include settled tickets warning when applicable', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {
          logInfoDetail: { settleCount: 1 },
          messageValidationLogInfo: []
        },
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      // Act
      const result = service['getMessageConfirmationReducedOver'](mockArg);

      // Assert
      expect(result).toContain('The request has settled ticket(s)');
    });

    it('should include validation warnings when applicable', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {
          logInfoDetail: { settleCount: 0 },
          messageValidationLogInfo: [{ isError: false }]
        },
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      // Act
      const result = service['getMessageConfirmationReducedOver'](mockArg);

      // Assert
      expect(result).toContain('There are some warnings in this request');
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should call addRequestService with correct parameters', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'initAddRequestQuery').mockReturnValue({});
      jest.spyOn(addRequestService, 'executeSaveRequest').mockResolvedValue();

      // Act
      await service['executeSaveRequestApi'](mockArg);

      // Assert
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        mockArg.isEdit,
        mockArg.requestId,
        expect.any(Object),
        mockArg.addRequestStore
      );
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when validation passes', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(true);
      service['executeSaveRequestApi'] = jest.fn();
      jest.spyOn(popupService, 'showError').mockImplementation();

      // Act
      await service['onClickConfirmSave'](mockArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
      expect(popupService.showError).not.toHaveBeenCalled();
    });

    it('should show error when validation fails', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {},
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      service['executeSaveRequestApi'] = jest.fn();
      jest.spyOn(popupService, 'showError').mockImplementation();

      // Act
      await service['onClickConfirmSave'](mockArg);

      // Assert
      expect(service['executeSaveRequestApi']).not.toHaveBeenCalled();
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
          action: TVSRequestActionType.TAKE_NOTE_ID.toString(),
          subIssueTypeId: '2'
        },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: {
          isShowValidation: true,
          transInfoAddRequestModel: {
            transInfoJson: '{}',
            unMarkTransIds: ['1'],
            markTransIds: ['2']
          }
        },
        filterReducedOverComponent: {},
        eventLeagueComponent: {},
        others: {
          mistakenBy: 'user1',
          decidedBy: 'user2',
          remark: 'test remark'
        },
        userId: 1
      } as unknown as SaveRequestArg;

      jest.spyOn(eventReducedOverService, 'getReducedOverModel').mockReturnValue([]);

      // Act
      const result = service['initAddRequestQuery'](mockArg);

      // Assert
      expect(result.transInfoJson).toBe('{}');
      expect(result.unMarkTransIds).toEqual(['1']);
      expect(result.markTransIds).toEqual(['2']);
      expect(result.issueTypeId).toBe('1');
      expect(result.isTest).toBe(true);
      expect(result.actionId).toBe(TVSRequestActionType.TAKE_NOTE_ID.toString());
      expect(result.isVoided).toBe(false);
      expect(result.mistakenBy).toBe('user1');
      expect(result.decidedBy).toBe('user2');
      expect(result.remark).toBe('test remark');
      expect(result.reducedOverInfo).toBeDefined();
    });
  });
});
