import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { TEXT } from '../../../../../../utility/constants/text';
import { AddRequestService } from '../../../../../services/add-request.service';
import { PopupService } from '../../../../../services/popup.service';
import { ValidationService } from './validation.service';
import { SaveRequestArg } from '../models/save-request-arg.model';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let addRequestService: AddRequestService;
  let popupService: PopupService;
  let validationService: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [SaveRequestService, ValidationService]
    });

    service = TestBed.inject(SaveRequestService);
    addRequestService = TestBed.inject(AddRequestService);
    popupService = TestBed.inject(PopupService);
    validationService = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should proceed with save when data is valid and isVoided is true', async () => {
      // Arrange
      const mockArg = {
        filter: { 
          isVoided: true,
          issueTypeId: '1',
          action: 'action1'
        },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        primitiveProps: {
          transInfoAddRequestModel: {}
        },
        duplicateTicketsModel: {
          filterBy: 1
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: [],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'remark1'
        }
      } as unknown as SaveRequestArg;

      service['proceedSaveRequest'] = jest.fn();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
      expect(service['proceedSaveRequest']).toHaveBeenCalledWith(mockArg);
    });

    it('should recheck before save when data is not voided', async () => {
      // Arrange
      const mockArg = {
        filter: { 
          isVoided: false,
          issueTypeId: '1',
          action: 'action1'
        },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        primitiveProps: {
          transInfoAddRequestModel: {}
        },
        duplicateTicketsModel: {
          filterBy: 1
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: [],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'remark1'
        }
      } as unknown as SaveRequestArg;
      service['recheckBeforeSaveRequest'] = jest.fn();

      // Act
      await service.saveRequest(mockArg);

      // Assert
      expect(service['recheckBeforeSaveRequest']).toHaveBeenCalledWith(mockArg);
    });
  });

  describe('recheckBeforeSaveRequest', () => {
    it('should check business rule validity', async () => {
      // Arrange
      const mockArg = {
        filter: { 
          isVoided: false,
          issueTypeId: '1',
          action: 'action1'
        },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn(),
          changeSavingRequestStatus: jest.fn()
        },
        primitiveProps: {
          transInfoAddRequestModel: {}
        },
        duplicateTicketsModel: {
          filterBy: 1
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: [],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'remark1'
        }
      } as unknown as SaveRequestArg;
      
      service['checkValidBusinessRuleBeforeSave'] = jest.fn().mockResolvedValue(true);

      // Act
      const result = await service['recheckBeforeSaveRequest'](mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
      expect(result).toBeTruthy();
    });
  });

  describe('checkValidBusinessRuleBeforeSave', () => {
    it('should return false when orgTransIds is missing', async () => {
      // Arrange
      const mockArg = {
        duplicateTicketsModel: { orgTransIds: null },
        tooltip: { display: jest.fn() }
      } as unknown as SaveRequestArg;

      // Act
      const result = await service['checkValidBusinessRuleBeforeSave'](mockArg);

      // Assert
      expect(mockArg.tooltip.display).toHaveBeenCalledWith('org-transId', TEXT.REQUIRED_FIELD);
      expect(result).toBeFalsy();
    });

    it('should validate business rule when orgTransIds exists', async () => {
      // Arrange
      const mockArg = {
        duplicateTicketsModel: { orgTransIds: ['123'] }
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'checkValidBusinessRule').mockResolvedValue(true);

      // Act
      const result = await service['checkValidBusinessRuleBeforeSave'](mockArg);

      // Assert
      expect(validationService.checkValidBusinessRule).toHaveBeenCalledWith(mockArg);
      expect(result).toBeTruthy();
    });
  });

  describe('proceedSaveRequest', () => {
    it('should show confirmation when validation service indicates', () => {
      // Arrange
      const mockArg = {
        filter: { 
          isVoided: false,
          issueTypeId: '1',
          action: 'action1'
        },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        primitiveProps: {
          transInfoAddRequestModel: {}
        },
        duplicateTicketsModel: {
          filterBy: 1
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: [],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'remark1'
        }
      } as unknown as SaveRequestArg;
      jest.spyOn(validationService, 'checkCanShowConfirmation').mockReturnValue(true);
      jest.spyOn(popupService, 'showConfirm');

      // Act
      service['proceedSaveRequest'](mockArg);

      // Assert
      expect(popupService.showConfirm).toHaveBeenCalled();
    });

    it('should execute save request directly when no confirmation needed', () => {
      // Arrange
      const mockArg = {
        filter: { 
          isVoided: false,
          issueTypeId: '1',
          action: 'action1'
        },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        primitiveProps: {
          transInfoAddRequestModel: {}
        },
        duplicateTicketsModel: {
          filterBy: 1
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: [],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'remark1'
        }
      } as unknown as SaveRequestArg;
      validationService['checkCanShowConfirmation'] = jest.fn().mockReturnValue(false);
      service['executeSaveRequestApi'] = jest.fn();

      // Act
      service['proceedSaveRequest'](mockArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when data is valid', async () => {
      // Arrange
      const mockArg = {
        filter: { 
          isVoided: false,
          issueTypeId: '1',
          action: 'action1'
        },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        primitiveProps: {
          transInfoAddRequestModel: {}
        },
        duplicateTicketsModel: {
          filterBy: 1
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: [],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'remark1'
        }
      } as unknown as SaveRequestArg;

      service['recheckBeforeSaveRequest'] = jest.fn().mockResolvedValue(true);
      service['executeSaveRequestApi'] = jest.fn();

      // Act
      await service['onClickConfirmSave'](mockArg);

      // Assert
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockArg);
    });

    it('should show error when data is invalid', async () => {
      // Arrange
      const mockArg = {
        filter: { 
          isVoided: false,
          issueTypeId: '1',
          action: 'action1'
        },
        addRequestStore: {
          changeSavingRequestStatus: jest.fn(),
          changeBlockingUiStatus: jest.fn()
        },
        primitiveProps: {
          transInfoAddRequestModel: {}
        },
        duplicateTicketsModel: {
          filterBy: 1
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: [],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'remark1'
        }
      } as unknown as SaveRequestArg;

      service['recheckBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);
      popupService['showError'] = jest.fn();

      // Act
      await service['onClickConfirmSave'](mockArg);

      // Assert
      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should execute save request with correct parameters', async () => {
      // Arrange
      const mockArg = {
        isEdit: true,
        requestId: '123',
        filter: { 
          isVoided: false,
          issueTypeId: '1',
          action: 'action1'
        },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn(),
          changeSavingRequestStatus: jest.fn()
        },
        primitiveProps: {
          transInfoAddRequestModel: {}
        },
        duplicateTicketsModel: {
          filterBy: 1
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: [],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'remark1'
        }
      } as unknown as SaveRequestArg;
      service['initAddRequestQuery'] = jest.fn().mockReturnValue({});
      addRequestService['executeSaveRequest'] = jest.fn();

      // Act
      await service['executeSaveRequestApi'](mockArg);

      // Assert
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(true, '123', {}, mockArg.addRequestStore);
      expect(mockArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('initAddRequestQuery', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const mockArg = {
        filter: {
          issueTypeId: '1',
          action: 'action1',
          isTest: true,
          isVoided: false
        },
        primitiveProps: {
          transInfoAddRequestModel: {
            unMarkTransIds: ['1'],
            markTransIds: ['2'],
            removeTransIds: ['3'],
            transInfoJson: '{}'
          }
        },
        others: {
          mistakenBy: 'user1',
          operatorsList: ['op1'],
          provider: 'provider1',
          source: 'source1',
          decidedBy: 'decider1',
          remark: 'test remark'
        },
        duplicateTicketsModel: {
          filterBy: 'filter1'
        }
      } as unknown as SaveRequestArg;

      jest.spyOn(validationService, 'isFilterMixParlay').mockReturnValue(false);

      // Act
      const result = service['initAddRequestQuery'](mockArg);

      // Assert
      expect(result.issueTypeId).toBe('1');
      expect(result.unMarkTransIds).toEqual(['1']);
      expect(result.markTransIds).toEqual(['2']);
      expect(result.removeTransIds).toEqual(['3']);
      expect(result.actionId).toBe('action1');
      expect(result.isTest).toBeTruthy();
      expect(result.isVoided).toBeFalsy();
      expect(result.mistakenBy).toBe('user1');
      expect(result.operatorsList).toEqual(['op1']);
      expect(result.provider).toBe('provider1');
      expect(result.source).toBe('source1');
      expect(result.decidedBy).toBe('decider1');
      expect(result.remark).toBe('test remark');
      expect(result.transInfoJson).toBe('{}');
      expect(result.duplicateTicketsInfo).toBe(mockArg.duplicateTicketsModel);
    });
  });

  describe('getMessageConfirmation', () => {
    it('should return correct message for edit take note request', () => {
      // Arrange
      const mockArg = {
        isEdit: true,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        },
        actionIdOfFirstTimeAccess: 'different_action'
      } as unknown as SaveRequestArg;

      // Act
      const result = service['getMessageConfirmation'](mockArg);

      // Assert
      expect(result).toContain('Ticket(s) on request will be unmarked');
      expect(result).toContain('ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?');
    });

    it('should return basic confirmation message for non-edit request', () => {
      // Arrange
      const mockArg = {
        isEdit: false,
        filter: {
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        }
      } as unknown as SaveRequestArg;

      // Act
      const result = service['getMessageConfirmation'](mockArg);

      // Assert
      expect(result).not.toContain('Ticket(s) on request will be unmarked');
      expect(result).toContain('ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?');
    });
  });
});
