import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { PopupService } from '../../services/popup.service';
import { AddRequestService } from '../../add-request.service';
import { ValidationService } from './validation.service';
import { AbnormalAccountService } from './abnormal-account.service';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestStore } from '../../add-request.store';
import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { SaveRequestArg } from '../models/save-request.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { ValidationBusinessRuleOutput } from '../models/validation.model';
import { FilterModel } from '../../filter/filter.model';
import { ConfirmAddRequestModel } from '../../confirm-add-request/confirm-add-request.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let popupService: PopupService;
  let addRequestService: AddRequestService;
  let validationService: ValidationService;
  let abnormalAccountService: AbnormalAccountService;

  const mockSaveRequestArg: SaveRequestArg = {
    addRequestStore: {
      changeBlockingUiStatus: jest.fn(),
      changeSavingRequestStatus: jest.fn()
    } as unknown as AddRequestStore,
    primitiveProps: {
      validAccountWinlostModels: [],
      transInfoAddRequestModel: null,
      numberOfTicketsExistedInRequest: 0,
      isCancelValidate: false
    } as PrimitiveProperty,
    filter: {
      isVoided: false,
      action: '1',
      issueTypeId: '1',
      subIssueTypeId: '1',
      isTest: false,
      isAbnormal: false,
      actions: []
    } as FilterModel,
    usernamesComponent: {
      triggerFocusOutUsernames: jest.fn()
    } as unknown as UsernamesComponent,
    confirmAddRequest: {
      isOpen: false,
      requestId: 0,
      requestedBy: '',
      isEditingByAnotherUser: false,
      isHasWarningTakenNote: false,
      extraWarningModel: null,
      userId: 0,
      isHasSettledTicket: false,
      isHasWarningTicket: false,
      isShowSubIssueType: false,
    } as ConfirmAddRequestModel,
    isEdit: false,
    requestId: 0,
    userId: 0,
    requestedBy: '',
    actionIdOfFirstTimeAccess: '',
    abnormalAccountModel: {
      usernames: 'usernames'
    } as AbnormalAccountModel,
    productFilterComponent: null,
    eventDateFilterComponent: null,
    others: {
      decidedBy: '',
      remark: ''
    },
    accountTableComponent: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        SaveRequestService,
        PopupService,
        AddRequestService,
        ValidationService,
        AbnormalAccountService,
        AddRequestStore
      ]
    });

    service = TestBed.inject(SaveRequestService);
    popupService = TestBed.inject(PopupService);
    addRequestService = TestBed.inject(AddRequestService);
    validationService = TestBed.inject(ValidationService);
    abnormalAccountService = TestBed.inject(AbnormalAccountService);

    jest.spyOn(popupService, 'showError');
    jest.spyOn(StaticService, 'isHasWarningTakenNote');
    jest.spyOn(StaticService, 'isEditingByAnotherUser').mockReturnValue(false);
    jest.spyOn(abnormalAccountService, 'getExtraWarningModel');
    jest.spyOn(addRequestService, 'executeSaveRequest');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveRequest', () => {
    it('should show popup confirm when data is valid', async () => {
      service['recheckValidationBeforeSaveRequest'] = jest.fn().mockResolvedValue(true);
      service['showPopupConfirmSave'] = jest.fn();


      await service.saveRequest(mockSaveRequestArg);

      expect(mockSaveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(mockSaveRequestArg);
      expect(mockSaveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should not show popup when data is invalid', async () => {
      service['recheckValidationBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);
      service['showPopupConfirmSave'] = jest.fn();

      await service.saveRequest(mockSaveRequestArg);

      expect(mockSaveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(service['showPopupConfirmSave']).not.toHaveBeenCalled();
      expect(mockSaveRequestArg.addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(mockSaveRequestArg.addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('recheckValidationBeforeSaveRequest', () => {
    it('should validate and update primitive props', async () => {
      const mockValidation: ValidationBusinessRuleOutput = {
        isValid: true,
        accountWinlostModels: [],
        transInfoAddRequestModel: null,
        numberOfTicketsExistedInRequest: 0,
        isWarringTooHighTickets: false
      };

      jest.spyOn(validationService, 'checkBusinessRule').mockResolvedValue(mockValidation);

      const result = await service['recheckValidationBeforeSaveRequest'](mockSaveRequestArg);

      expect(result).toBe(true);
      expect(mockSaveRequestArg.primitiveProps.validAccountWinlostModels).toEqual([]);
      expect(mockSaveRequestArg.primitiveProps.transInfoAddRequestModel).toBeNull();
      expect(mockSaveRequestArg.primitiveProps.numberOfTicketsExistedInRequest).toBe(0);
    });
  });

  describe('onClickConfirmSave', () => {
    it('should execute save request when data is valid', async () => {
      service['recheckValidationBeforeSaveRequest'] = jest.fn().mockResolvedValue(true);
      service['executeSaveRequestApi'] = jest.fn();

      await service.onClickConfirmSave(mockSaveRequestArg);

      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(mockSaveRequestArg);
    });

    it('should show error when data is invalid', async () => {
      service['recheckValidationBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);

      await service.onClickConfirmSave(mockSaveRequestArg);

      expect(popupService.showError).toHaveBeenCalledWith(TEXT.INVALID_DATA_IN_REQUEST);
    });
  });

  describe('showPopupConfirmSave', () => {
    it('should set up confirm popup with correct values', () => {
      service['showPopupConfirmSave'](mockSaveRequestArg);

      expect(StaticService.isHasWarningTakenNote).toHaveBeenCalled();
      expect(StaticService.isEditingByAnotherUser).toHaveBeenCalled();
      expect(abnormalAccountService.getExtraWarningModel).toHaveBeenCalled();
      expect(mockSaveRequestArg.confirmAddRequest.isOpen).toBe(true);
    });
  });

  describe('executeSaveRequestApi', () => {
    it('should call addRequestService.executeSaveRequest with correct parameters', async () => {
      await service['executeSaveRequestApi'](mockSaveRequestArg);

      expect(addRequestService.executeSaveRequest).toHaveBeenCalledWith(
        mockSaveRequestArg.isEdit,
        mockSaveRequestArg.requestId,
        expect.any(AddRequestQuery),
        mockSaveRequestArg.addRequestStore
      );
    });
  });

  describe('initValidationBusinessRuleArgs', () => {
    it('should initialize validation business rule args correctly', () => {
      const result = service['initValidationBusinessRuleArgs'](mockSaveRequestArg);

      expect(result.actionId).toBe(mockSaveRequestArg.filter.action);
      expect(result.requestId).toBe(mockSaveRequestArg.requestId);
      expect(result.usernamesComponent).toBe(mockSaveRequestArg.usernamesComponent);
      expect(result.abnormalAccountModel).toBe(mockSaveRequestArg.abnormalAccountModel);
      expect(result.primitiveProps).toBe(mockSaveRequestArg.primitiveProps);
      expect(result.issueTypeId).toBe(mockSaveRequestArg.filter.issueTypeId);
    });
  });

  describe('initAddRequestQuery', () => {
    it('should initialize add request query with correct values', () => {
      const result = service['initAddRequestQuery'](mockSaveRequestArg);

      expect(result.transInfoJson).toBe(mockSaveRequestArg.primitiveProps.transInfoAddRequestModel?.transInfoJson);
      expect(result.unMarkTransIds).toBe(mockSaveRequestArg.primitiveProps.transInfoAddRequestModel?.unMarkTransIds);
      expect(result.markTransIds).toBe(mockSaveRequestArg.primitiveProps.transInfoAddRequestModel?.markTransIds);
      expect(result.issueTypeId).toBe(mockSaveRequestArg.filter.issueTypeId);
      expect(result.subIssueTypeId).toBe(mockSaveRequestArg.filter.subIssueTypeId);
      expect(result.actionId).toBe(mockSaveRequestArg.filter.action);
      expect(result.isTest).toBe(mockSaveRequestArg.filter.isTest);
      expect(result.isVoided).toBe(mockSaveRequestArg.filter.isVoided);
      expect(result.abnormalAccountInfo).toEqual(mockSaveRequestArg.abnormalAccountModel);
      expect(result.decidedBy).toBe(mockSaveRequestArg.others.decidedBy);
      expect(result.remark).toBe(mockSaveRequestArg.others.remark);
    });
  });

  describe('cancelValidateUsernamesWhenFocusOut', () => {
    it('should cancel validation and trigger focus out', () => {
      service['cancelValidateUsernamesWhenFocusOut'](
        mockSaveRequestArg.primitiveProps,
        mockSaveRequestArg.usernamesComponent
      );

      expect(mockSaveRequestArg.primitiveProps.isCancelValidate).toBe(true);
      expect(mockSaveRequestArg.usernamesComponent.triggerFocusOutUsernames).toHaveBeenCalled();
    });
  });

  describe('getAccountWinlostWhenSaveRequest', () => {
    it('should preserve original account values when merging with new accounts', () => {
      const originalAccounts: AccountWinlostModel[] = [{
        custId: 1,
        username: 'test',
        givenCredit: 0,
        adjustVoidLimit: 0,
        currentWinning: 0,
        currentLosing: 0,
        estimateVoidAmount: 100,
        estimateVoidAmountUnEditableTickets: 0,
        winLostAfterVoid: 50,
        isHighlight: false,
        adjustVoidLimitString: '',
        isShowInput: false,
        isEditedTicket: false,
        isCanEditTicket: false,
        isShowOnTable: false,
        transInfoAccountJson: ''
      }];

      const newAccounts: AccountWinlostModel[] = [{
        custId: 1,
        username: 'test',
        givenCredit: 0,
        adjustVoidLimit: 0,
        currentWinning: 0,
        currentLosing: 0,
        estimateVoidAmount: 200,
        estimateVoidAmountUnEditableTickets: 0,
        winLostAfterVoid: 150,
        isHighlight: false,
        adjustVoidLimitString: '',
        isShowInput: false,
        isEditedTicket: false,
        isCanEditTicket: false,
        isShowOnTable: false,
        transInfoAccountJson: ''
      }];

      const result = service['getAccountWinlostWhenSaveRequest'](originalAccounts, newAccounts);

      expect(result[0].estimateVoidAmount).toBe(100);
      expect(result[0].winLostAfterVoid).toBe(50);
    });

    it('should return new accounts when no original accounts exist', () => {
      const newAccounts: AccountWinlostModel[] = [{
        custId: 1,
        username: 'test',
        givenCredit: 0,
        adjustVoidLimit: 0,
        currentWinning: 0,
        currentLosing: 0,
        estimateVoidAmount: 200,
        estimateVoidAmountUnEditableTickets: 0,
        winLostAfterVoid: 150,
        isHighlight: false,
        adjustVoidLimitString: '',
        isShowInput: false,
        isEditedTicket: false,
        isCanEditTicket: false,
        isShowOnTable: false,
        transInfoAccountJson: ''
      }];

      const result = service['getAccountWinlostWhenSaveRequest']([], newAccounts);

      expect(result).toEqual(newAccounts);
    });
  });
});
