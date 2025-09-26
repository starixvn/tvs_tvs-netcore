import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { AddRequestService } from '../../../../../services/add-request.service';
import { ValidationService } from './validation.service';
import { PopupService } from '../../../../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TEXT } from '../../../../../../utility/constants/text';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let addRequestService: AddRequestService;
  let validationService: ValidationService;
  let popupService: PopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [SaveRequestService, ValidationService]
    });

    service = TestBed.inject(SaveRequestService);
    addRequestService = TestBed.inject(AddRequestService);
    validationService = TestBed.inject(ValidationService);
    popupService = TestBed.inject(PopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should proceed with save when data is valid and not voided', async () => {
      // Arrange
      const mockArg = createMockSaveRequestArg(false);
      jest.spyOn(validationService, 'checkBusinessRule').mockResolvedValue({ 
        isValid: true, 
        transInfoJson: '{}', 
        unMarkTransIds: '' 
      });
      jest.spyOn(popupService, 'showConfirm').mockImplementation((_message, onConfirm) => onConfirm());

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(validationService.checkBusinessRule).toHaveBeenCalled();
      expect(popupService.showConfirm).toHaveBeenCalled();
    });

    it('should not proceed with save when data is invalid', async () => {
      // Arrange
      const mockArg = createMockSaveRequestArg(false);
      jest.spyOn(validationService, 'checkBusinessRule').mockResolvedValue({ 
        isValid: false, 
        transInfoJson: '{}', 
        unMarkTransIds: '' 
      });

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(validationService.checkBusinessRule).toHaveBeenCalled();
    });

    it('should proceed directly with save when request is voided', async () => {
      // Arrange
      const mockArg = createMockSaveRequestArg(true);
      jest.spyOn(addRequestService, 'executeSaveRequest').mockResolvedValue();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(addRequestService.executeSaveRequest).toHaveBeenCalled();
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should execute save request with correct parameters', async () => {
      // Arrange
      const mockArg = createMockSaveRequestArg(false);
      jest.spyOn(addRequestService, 'executeSaveRequest').mockResolvedValue();

      // Act
      await service['executeSaveRequestApi'](mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        mockArg.isEdit,
        mockArg.requestId,
        expect.any(Object),
        mockArg.addRequestStore
      );
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('onClickConfirmSave', () => {
    it('should proceed with save when validation passes', async () => {
      // Arrange
      const mockArg = createMockSaveRequestArg(false);
      jest.spyOn(validationService, 'checkBusinessRule').mockResolvedValue({ 
        isValid: true, 
        transInfoJson: '{}', 
        unMarkTransIds: '' 
      });
      service['executeSaveRequestApi'] = jest.fn();

      // Act
      await service['onClickConfirmSave'](mockArg);

      // Assert
      expect(validationService.checkBusinessRule).toHaveBeenCalled();
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
    });

    it('should show error when validation fails', async () => {
      // Arrange
      const mockArg = createMockSaveRequestArg(false);
      jest.spyOn(validationService, 'checkBusinessRule').mockResolvedValue({ 
        isValid: false, 
        transInfoJson: '{}', 
        unMarkTransIds: '' 
      });
      jest.spyOn(popupService, 'showError');

      // Act
      await service['onClickConfirmSave'](mockArg);

      // Assert
      expect(validationService.checkBusinessRule).toHaveBeenCalled();
      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });
  });
});

function createMockSaveRequestArg(isVoided: boolean): SaveRequestArg {
  return {
    addRequestStore: {
      changeSavingRequestStatus: jest.fn(),
      changeBlockingUiStatus: jest.fn()
    },
    filter: {
      isVoided,
      issueTypeId: '1',
      subIssueTypeId: '1',
      action: '1',
      isTest: false
    },
    betIdsComponent: {} as any,
    recoverTicketModel: {},
    requestId: 123,
    isEdit: false,
    primitiveProps: {
      permission: {},
      transInfoJson: '{}',
      unMarkTransIds: ''
    },
    others: {
      decidedBy: 'test-user',
      remark: 'test-remark'
    },
    transIds: '',
    filterBy: null
  } as unknown as SaveRequestArg;
}
