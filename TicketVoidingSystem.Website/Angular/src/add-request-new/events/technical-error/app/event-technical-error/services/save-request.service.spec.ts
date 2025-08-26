import { TestBed } from '@angular/core/testing';
import { TEXT } from '../../../../../../utility/constants/text';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { CommonService } from '../../../../../../utility/services/common.service';
import { ConfirmAddRequestModel } from '../../../../../component/confirm-add-request/confirm-add-request.model';
import { TechnicalErrorModel } from '../../../../../models/event-technical-error.model';
import { PopupService } from '../../../../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventTechnicalErrorService } from './event-technical-error.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let validationService: ValidationService;
  let popupService: PopupService;
  let eventTechnicalErrorService: EventTechnicalErrorService;
  let commonService: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [SaveRequestService, ValidationService, LogInfoService, EventTechnicalErrorService]
    });

    service = TestBed.inject(SaveRequestService);
    validationService = TestBed.inject(ValidationService);
    popupService = TestBed.inject(PopupService);
    eventTechnicalErrorService = TestBed.inject(EventTechnicalErrorService);
    commonService = TestBed.inject(CommonService);

    // Mock document.getElementById
    document.body.innerHTML = '<div id="body" user-id="123"></div>';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should show popup confirm when data is valid and not voided', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: true },
        confirmAddRequest: new ConfirmAddRequestModel(),
        isEdit: false,
        requestId: '123',
        userId: '123',
        requestedBy: 'user1',
        actionIdOfFirstTimeAccess: 'action1',
        others: {},
        eventLeagueComponent: { isMatchIdValid: () => true },
        filterTimeComponent: { isValidity: () => true },
        advancedModeComponent: {}
      } as unknown as SaveRequestArg;

      service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockResolvedValue(true);
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
        primitiveProps: { isShowValidation: true },
        confirmAddRequest: new ConfirmAddRequestModel(),
        isEdit: false,
        requestId: '123',
        userId: '123',
        requestedBy: 'user1',
        actionIdOfFirstTimeAccess: 'action1',
        others: {},
        eventLeagueComponent: { isMatchIdValid: () => true },
        filterTimeComponent: { isValidity: () => true },
        advancedModeComponent: {}
      } as unknown as SaveRequestArg;

      service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);
      service['showPopupConfirmSave'] = jest.fn();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(service['showPopupConfirmSave']).not.toHaveBeenCalled();
    });
  });

  describe('recheckLogInfoBeforeSaveRequest', () => {
    it('should validate and return false when common data is invalid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn(), changeSavingRequestStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: true },
        isEdit: false,
        requestId: '123',
        userId: '123',
        others: {},
        eventLeagueComponent: { isMatchIdValid: () => true },
        filterTimeComponent: { isValidity: () => true },
        advancedModeComponent: {}
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);

      // Act
      const result = await service['recheckLogInfoBeforeSaveRequest'](mockArg);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when data is valid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: true },
        isEdit: false,
        requestId: '123',
        userId: '123',
        others: {},
        eventLeagueComponent: { isMatchIdValid: () => true },
        filterTimeComponent: { isValidity: () => true },
        advancedModeComponent: {}
      } as unknown as SaveRequestArg;

      service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockResolvedValue(true);
      service['executeSaveRequestApi'] = jest.fn();

      // Act
      await service.onClickConfirmSave(mockArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
    });

    it('should show error popup when data is invalid', async () => {
      // Arrange
      const mockArg: SaveRequestArg = {
        filter: { isVoided: false },
        addRequestStore: { changeBlockingUiStatus: jest.fn() },
        logInfoEvent: {},
        primitiveProps: { isShowValidation: true },
        isEdit: false,
        requestId: '123',
        userId: '123',
        others: {},
        eventLeagueComponent: { isMatchIdValid: () => true },
        filterTimeComponent: { isValidity: () => true },
        advancedModeComponent: {}
      } as unknown as SaveRequestArg;

      service['recheckLogInfoBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);
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
          remark: 'test remark'
        },
        logInfoEvent: {},
        eventLeagueComponent: { isMatchIdValid: () => true },
        filterTimeComponent: { isValidity: () => true },
        advancedModeComponent: {},
        confirmAddRequest: {} as ConfirmAddRequestModel
      } as unknown as SaveRequestArg;

      jest.spyOn(eventTechnicalErrorService, 'getTechnicalErrorModel').mockReturnValue({} as TechnicalErrorModel);

      // Act
      const result = service['initAddRequestQuery'](mockArg);

      // Assert
      expect(result).toEqual(expect.objectContaining({
        transInfoJson: 'json',
        unMarkTransIds: ['1', '2'],
        markTransIds: ['3', '4'],
        issueTypeId: '1',
        isTest: true,
        actionId: 'action1',
        isVoided: false,
        mistakenBy: 'user1',
        decidedBy: 'user2',
        remark: 'test remark'
      }));
    });
  });
});
