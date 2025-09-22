import { TestBed } from '@angular/core/testing';
import { AddRequestQuery } from 'src/add-request-new/models/add-request.query';
import { AddRequestService } from 'src/add-request-new/services/add-request.service';
import { PopupService } from 'src/add-request-new/services/popup.service';
import { TEXT } from '../../../../../../utility/constants/text';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventNotParticipateService } from './event-not-participate.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let popupService: PopupService;
  let addRequestService: AddRequestService;
  let eventNotParticipateService: EventNotParticipateService;

  beforeEach(() => {
    document.body.innerHTML = '<div id="body" user-id="8"></div>';
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
        primitiveProps: { isShowValidation: true },
        confirmAddRequest: {}
      } as unknown as SaveRequestArg;

      jest.spyOn(service as any, 'recheckLogInfoBeforeSaveRequest').mockResolvedValue(true);

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
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

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
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
        confirmAddRequest: {},
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
