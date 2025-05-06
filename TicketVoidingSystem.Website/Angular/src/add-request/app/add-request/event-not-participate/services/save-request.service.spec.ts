import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { PopupService } from '../../services/popup.service';
import { AddRequestService } from '../../add-request.service';
import { EventNotParticipateService } from './event-not-participate.service';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { AddRequestQuery } from '../../models/add-request.query';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestService: AddRequestService;
  let eventNotParticipateService: EventNotParticipateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [SaveRequestService, ValidationService, LogInfoService,EventNotParticipateService]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    popupService = TestBed.inject(PopupService);
    addRequestService = TestBed.inject(AddRequestService);
    eventNotParticipateService = TestBed.inject(EventNotParticipateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should proceed with save when data is valid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn(),
          changeSavingRequestStatus: jest.fn()
        },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true }
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(true);
      jest.spyOn(service as any, 'proceedSaveRequest').mockImplementation();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['proceedSaveRequest']).toHaveBeenCalledWith(mockArg);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should not proceed with save when data is invalid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn(),
          changeSavingRequestStatus: jest.fn()
        },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true }
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(service as any, 'proceedSaveRequest').mockImplementation();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['proceedSaveRequest']).not.toHaveBeenCalled();
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should return true when validation passes', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true }
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(validationService, 'isValidLogInfoEvent').mockReturnValue(true);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockArg);

      // Assert
      expect(result).toBeTruthy();
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(validationService.validateCommonData).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
    });

    it('should return false when validation fails', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: { isShowValidation: true }
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockArg);

      // Assert
      expect(result).toBeFalsy();
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(validationService.validateCommonData).toHaveBeenCalled();
    });
  });

  describe('proceedSaveRequest', () => {
    it('should show confirmation popup when validation passes', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { action: TVSRequestActionType.TAKE_NOTE_ID.toString() },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn()
        },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123'
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'checkCanShowConfirmationNotParticipate').mockReturnValue(true);
      jest.spyOn(service as any, 'getMessageConfirmationNotParticipate').mockReturnValue('test message');
      jest.spyOn(popupService, 'showConfirm').mockImplementation();

      // Act
      service['proceedSaveRequest'](mockArg);

      // Assert
      expect(validationService.checkCanShowConfirmationNotParticipate).toHaveBeenCalledWith(mockArg);
      expect(popupService.showConfirm).toHaveBeenCalled();
    });

    it('should execute save request directly when no confirmation needed', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { action: TVSRequestActionType.TAKE_NOTE_ID.toString() },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn()
        },
        logInfoEvent: {},
        isEdit: false,
        requestId: '123'
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'checkCanShowConfirmationNotParticipate').mockReturnValue(false);
      jest.spyOn(service as any, 'executeSaveRequestApi').mockImplementation();

      // Act
      service['proceedSaveRequest'](mockArg);

      // Assert
      expect(validationService.checkCanShowConfirmationNotParticipate).toHaveBeenCalledWith(mockArg);
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
    });
  });

  describe('getMessageConfirmationNotParticipate', () => {
    it('should include settled tickets warning when applicable', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { action: TVSRequestActionType.TAKE_NOTE_ID.toString() },
        logInfoEvent: {
          logInfoDetail: { settleCount: 1 }
        },
        isEdit: false,
        requestId: '123'
      } as unknown as SaveRequestArg;

      // Act
      const result = service['getMessageConfirmationNotParticipate'](mockArg);

      // Assert
      expect(result).toContain('The request has settled ticket(s)');
    });

    it('should include validation warnings when applicable', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { action: TVSRequestActionType.TAKE_NOTE_ID.toString() },
        logInfoEvent: {
          logInfoDetail: { settleCount: 0 },
          messageValidationLogInfo: [{ isError: false }]
        },
        isEdit: false,
        requestId: '123'
      } as unknown as SaveRequestArg;

      // Act
      const result = service['getMessageConfirmationNotParticipate'](mockArg);

      // Assert
      expect(result).toContain('There are some warnings in this request');
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should execute save request with correct parameters', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: {},
        isEdit: false,
        requestId: '123',
        primitiveProps: {},
        others: {}
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'initAddRequestQuery').mockReturnValue(new AddRequestQuery());
      jest.spyOn(addRequestService, 'executeSaveRequest').mockResolvedValue();

      // Act
      await service['executeSaveRequestApi'](mockArg);

      // Assert
      expect(service['initAddRequestQuery']).toHaveBeenCalledWith(mockArg);
      expect(addRequestService.executeSaveRequest).toHaveBeenCalled();
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when validation passes', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn()
        },
        isEdit: false,
        requestId: '123'
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(true);
      service['executeSaveRequestApi'] = jest.fn();

      // Act
      await service['onClickConfirmSave'](mockArg);

      // Assert
      expect(service['recheckLogInfoBeforeSaveRequest']).toHaveBeenCalledWith(mockArg);
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
    });

    it('should show error when validation fails', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn()
        },
        isEdit: false,
        requestId: '123'
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(false);
      jest.spyOn(popupService, 'showError').mockImplementation();

      // Act
      await service['onClickConfirmSave'](mockArg);

      // Assert
      expect(service['recheckLogInfoBeforeSaveRequest']).toHaveBeenCalledWith(mockArg);
      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });
  });

  describe('initAddRequestQuery', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: {
          isVoided: false,
          action: '1',
          issueTypeId: '1',
          isTest: false,
          subIssueTypeId: '1'
        },
        primitiveProps: {
          transInfoAddRequestModel: {
            transInfoJson: '{}',
            unMarkTransIds: [],
            markTransIds: []
          }
        },
        others: {
          mistakenBy: 'test',
          decidedBy: 'test',
          remark: 'test'
        },
        logInfoEvent: {}
      } as unknown as SaveRequestArg;

      jest.spyOn(eventNotParticipateService, 'getNotParticipateModel').mockReturnValue([]);

      // Act
      const result = service['initAddRequestQuery'](mockArg);

      // Assert
      expect(result).toBeInstanceOf(AddRequestQuery);
      expect(result.transInfoJson).toBe(mockArg.primitiveProps.transInfoAddRequestModel.transInfoJson);
      expect(result.unMarkTransIds).toBe(mockArg.primitiveProps.transInfoAddRequestModel.unMarkTransIds);
      expect(result.markTransIds).toBe(mockArg.primitiveProps.transInfoAddRequestModel.markTransIds);
      expect(result.issueTypeId).toBe(mockArg.filter.issueTypeId);
      expect(result.isTest).toBe(mockArg.filter.isTest);
      expect(result.actionId).toBe(mockArg.filter.action);
      expect(result.isVoided).toBe(mockArg.filter.isVoided);
      expect(result.mistakenBy).toBe(mockArg.others.mistakenBy);
      expect(result.decidedBy).toBe(mockArg.others.decidedBy);
      expect(result.remark).toBe(mockArg.others.remark);
    });
  });
});
