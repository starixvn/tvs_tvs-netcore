import { TestBed } from '@angular/core/testing';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';
import { TEXT } from '../../../../../../utility/constants/text';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { UsernamesComponent } from '../../../../../../utility/components/user-names/user-names.component';
import { SaveRequestArg } from '../models/save-request.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { AddRequestQuery } from '../../../../../models/add-request.query';
import { ValidationBusinessRuleOutput } from '../models/validation.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { ConfirmAbnormalAccountModel } from '../confirm-abnormal-account/confirm-abnormal-account.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { AbnormalAccountModel } from '../../../../../models/abnormal-account.model';
import { ConfirmAbnormalAccountComponent } from '../confirm-abnormal-account/confirm-abnormal-account.component';
import { PopupService } from '../../../../../services/popup.service';
import { AddRequestService } from '../../../../../services/add-request.service';

describe('SaveRequestService', () => {
  let service: SaveRequestService;
  let popupService: PopupService;
  let addRequestService: AddRequestService;
  let validationService: ValidationService;

  const mockSaveRequestArg: SaveRequestArg = {
    addRequestStore: {
      changeBlockingUiStatus: jest.fn(),
      changeSavingRequestStatus: jest.fn()
    } as unknown as AddRequestStore,
    primitiveProps: {} as PrimitiveProperty,
    filter: {
      action: '1',
      issueTypeId: '1',
      subIssueTypeId: '1',
      actions: []
    } as FilterModel,
    usernamesComponent: {
      triggerFocusOutUsernames: jest.fn()
    } as unknown as UsernamesComponent,
    confirmAddRequest: {
      numberOfTicketsExistedInRequest: 0,
      allUsernames: '',
      usernamesOfCreditCashService: '',
      extraWarningModel: null,
      userId: 0,
      issueTypeName: '',
      subIssueTypeName: '',
      actionName: ''
    } as unknown as ConfirmAbnormalAccountModel,
    confirmAddRequestComponent: {
      model: {
        usernamesOfCreditCashService: '',
        checkboxState: {}
      }
    } as unknown as ConfirmAbnormalAccountComponent,
    isEdit: false,
    requestId: 0,
    userId: 0,
    requestedBy: '',
    actionIdOfFirstTimeAccess: '',
    abnormalAccountModel: {
      usernames: 'usernames',
      accountWinlostModels: []
    } as AbnormalAccountModel,
    issueTypes: {
      issueTypes: [{ issueTypeId: 1, issueTypeName: 'Test Issue Type' }],
      subIssueTypes: [{ subIssueTypeId: 1, issueTypeId: 1, subIssueTypeName: 'Test Sub Issue Type', subIssueTypeNameCS: 'Test Sub Issue Type CS' }],
      issueId: 1,
      subIssueId: 1
    },
    productFilterComponent: null,
    eventDateFilterComponent: null,
    others: {
      decidedBy: '',
      remark: ''
    },
    accountTableComponent: null,
    isValidateFromConfirmPopup: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        SaveRequestService,
        PopupService,
        AddRequestService,
        ValidationService,
        AddRequestStore
      ]
    });

    service = TestBed.inject(SaveRequestService);
    popupService = TestBed.inject(PopupService);
    addRequestService = TestBed.inject(AddRequestService);
    validationService = TestBed.inject(ValidationService);

    jest.spyOn(popupService, 'showError');
    jest.spyOn(StaticService, 'isHasWarningTakenNote');
    jest.spyOn(StaticService, 'isEditingByAnotherUser').mockReturnValue(false);
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

    it('should skip validation when isVoided is true', async () => {
      const voidedArg = { ...mockSaveRequestArg, filter: { ...mockSaveRequestArg.filter, isVoided: true } };
      service['recheckValidationBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);
      service['showPopupConfirmSave'] = jest.fn();

      await service.saveRequest(voidedArg);

      expect(service['recheckValidationBeforeSaveRequest']).not.toHaveBeenCalled();
      expect(service['showPopupConfirmSave']).toHaveBeenCalledWith(voidedArg);
    });
  });

  describe('recheckValidationBeforeSaveRequest', () => {
    it('should validate and update primitive props', async () => {
      const mockValidation: ValidationBusinessRuleOutput = {
        isValid: true,
        accountWinlostModels: [],
        transInfoAddRequestModel: null,
        numberOfTicketsExistedInRequest: 0,
        isWarringTooHighTickets: false,
        usernamesOfCreditCashService: ''
      };

      jest.spyOn(validationService, 'checkBusinessRule').mockResolvedValue(mockValidation);

      const result = await service['recheckValidationBeforeSaveRequest'](mockSaveRequestArg);

      expect(result).toBe(true);
      expect(mockSaveRequestArg.primitiveProps.validAccountWinlostModels).toEqual([]);
      expect(mockSaveRequestArg.primitiveProps.transInfoAddRequestModel).toBeNull();
      expect(mockSaveRequestArg.primitiveProps.numberOfTicketsExistedInRequest).toBe(0);
      expect(mockSaveRequestArg.primitiveProps.usernamesOfCreditCashService).toBe('');
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

    it('should skip validation when isVoided is true', async () => {
      const voidedArg = { ...mockSaveRequestArg, filter: { ...mockSaveRequestArg.filter, isVoided: true } };
      service['recheckValidationBeforeSaveRequest'] = jest.fn().mockResolvedValue(false);
      service['executeSaveRequestApi'] = jest.fn();

      await service.onClickConfirmSave(voidedArg);

      expect(service['recheckValidationBeforeSaveRequest']).not.toHaveBeenCalled();
      expect(service['executeSaveRequestApi']).toHaveBeenCalledWith(voidedArg);
    });
  });

  describe('showPopupConfirmSave', () => {
    it('should set up confirm popup with correct values when not voided', () => {
      service['showPopupConfirmSave'](mockSaveRequestArg);

      expect(StaticService.isHasWarningTakenNote).toHaveBeenCalled();
      expect(StaticService.isEditingByAnotherUser).toHaveBeenCalled();
      expect(mockSaveRequestArg.confirmAddRequest.isOpen).toBe(true);
      expect(mockSaveRequestArg.confirmAddRequest.isHasWarningAbnormalAccount).toBe(false);
      expect(mockSaveRequestArg.confirmAddRequest.allUsernames).toBe('usernames');
      expect(mockSaveRequestArg.confirmAddRequest.numberOfTicketsExistedInRequest).toBe(0);
    });

    it('should set up confirm popup for voided requests', () => {
      const voidedArg = { ...mockSaveRequestArg, filter: { ...mockSaveRequestArg.filter, isVoided: true } };
      
      service['showPopupConfirmSave'](voidedArg);

      expect(mockSaveRequestArg.confirmAddRequest.isOpen).toBe(true);
      expect(mockSaveRequestArg.confirmAddRequest.issueTypeName).toBe('Test Issue Type');
      expect(mockSaveRequestArg.confirmAddRequest.subIssueTypeName).toBe('Test Sub Issue Type');
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
      expect(result.productFilterComponent).toBe(mockSaveRequestArg.productFilterComponent);
      expect(result.eventDateFilterComponent).toBe(mockSaveRequestArg.eventDateFilterComponent);
      expect(result.confirmAbnormalAccountComponent).toBe(mockSaveRequestArg.confirmAddRequestComponent);
      expect(result.isValidateFromConfirmPopup).toBe(mockSaveRequestArg.isValidateFromConfirmPopup);
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
      expect(result.abnormalAccountInfo).toBeDefined();
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
      const originalAccounts = [{
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
      }] as AccountWinlostModel[];

      const newAccounts = [{
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
      }] as AccountWinlostModel[];

      const result = service['getAccountWinlostWhenSaveRequest'](originalAccounts, newAccounts);

      expect(result[0].estimateVoidAmount).toBe(100);
      expect(result[0].winLostAfterVoid).toBe(50);
    });

    it('should return new accounts when no original accounts exist', () => {
      const newAccounts = [{
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
      }] as AccountWinlostModel[];

      const result = service['getAccountWinlostWhenSaveRequest']([], newAccounts);

      expect(result).toEqual(newAccounts);
    });
  });

  describe('getUsernamesForSaveRequest', () => {
    it('should return original usernames when no credit cash service usernames and no site DB down usernames', () => {
      const originalUsernames = 'user1,user2,user3';
      const confirmComponent = {
        model: {
          usernamesOfCreditCashService: '',
          checkboxState: {}
        }
      } as unknown as ConfirmAbnormalAccountComponent;
      const siteDBDownUserNames = '';

      const result = service['getUsernamesForSaveRequest'](originalUsernames, confirmComponent, siteDBDownUserNames);

      expect(result).toBe('user1,user2,user3');
    });

    it('should filter out credit cash service usernames when checkbox is checked', () => {
      const originalUsernames = 'user1,user2,user3';
      const confirmComponent = {
        model: {
          usernamesOfCreditCashService: 'user2',
          checkboxState: { [2]: true }
        }
      } as unknown as ConfirmAbnormalAccountComponent;
      const siteDBDownUserNames = '';

      const result = service['getUsernamesForSaveRequest'](originalUsernames, confirmComponent, siteDBDownUserNames);

      expect(result).toBe('user1,user3');
    });

    it('should filter out site DB down usernames', () => {
      const originalUsernames = 'user1,user2,user3';
      const confirmComponent = {
        model: {
          usernamesOfCreditCashService: '',
          checkboxState: {}
        }
      } as unknown as ConfirmAbnormalAccountComponent;
      const siteDBDownUserNames = 'user1';

      const result = service['getUsernamesForSaveRequest'](originalUsernames, confirmComponent, siteDBDownUserNames);

      expect(result).toBe('user2,user3');
    });

    it('should filter out both credit cash service and site DB down usernames', () => {
      const originalUsernames = 'user1,user2,user3,user4';
      const confirmComponent = {
        model: {
          usernamesOfCreditCashService: 'user2',
          checkboxState: { [2]: true }
        }
      } as unknown as ConfirmAbnormalAccountComponent;
      const siteDBDownUserNames = 'user3';

      const result = service['getUsernamesForSaveRequest'](originalUsernames, confirmComponent, siteDBDownUserNames);

      expect(result).toBe('user1,user4');
    });

    it('should not filter credit cash service usernames when checkbox is not checked', () => {
      const originalUsernames = 'user1,user2,user3';
      const confirmComponent = {
        model: {
          usernamesOfCreditCashService: 'user2',
          checkboxState: { [2]: false }
        }
      } as unknown as ConfirmAbnormalAccountComponent;
      const siteDBDownUserNames = '';

      const result = service['getUsernamesForSaveRequest'](originalUsernames, confirmComponent, siteDBDownUserNames);

      expect(result).toBe('user1,user2,user3');
    });

    it('should handle empty usernames', () => {
      const originalUsernames = '';
      const confirmComponent = {
        model: {
          usernamesOfCreditCashService: '',
          checkboxState: {}
        }
      } as unknown as ConfirmAbnormalAccountComponent;
      const siteDBDownUserNames = '';

      const result = service['getUsernamesForSaveRequest'](originalUsernames, confirmComponent, siteDBDownUserNames);

      expect(result).toBe('');
    });
  });

  describe('createAbnormalAccountModel', () => {
    it('should create abnormal account model with correct values', () => {
      const result = service['createAbnormalAccountModel'](mockSaveRequestArg);

      expect(result.usernames).toBe('usernames');
      expect(result.accountWinlostModels).toEqual([]);
    });

    it('should call getUsernamesForSaveRequest with correct parameters', () => {
      const getUsernamesSpy = jest.spyOn(service as any, 'getUsernamesForSaveRequest').mockReturnValue('filtered,usernames');
      const getAccountWinlostSpy = jest.spyOn(service as any, 'getAccountWinlostModelsForSaveRequest').mockReturnValue([]);

      service['createAbnormalAccountModel'](mockSaveRequestArg);

      expect(getUsernamesSpy).toHaveBeenCalledWith(
        mockSaveRequestArg.abnormalAccountModel.usernames,
        mockSaveRequestArg.confirmAddRequestComponent,
        mockSaveRequestArg.primitiveProps.infoSiteDBDownModel?.usernames
      );
      expect(getAccountWinlostSpy).toHaveBeenCalledWith(
        mockSaveRequestArg.filter.action,
        mockSaveRequestArg.abnormalAccountModel.accountWinlostModels,
        mockSaveRequestArg.confirmAddRequestComponent
      );
    });

    it('should return cloned abnormal account model with filtered usernames and account winlost models', () => {
      const mockAccountWinlostModels = [
        { custId: 1, username: 'user1' },
        { custId: 2, username: 'user2' }
      ] as AccountWinlostModel[];

      const argsWithAccountModels = {
        ...mockSaveRequestArg,
        abnormalAccountModel: {
          usernames: 'user1,user2,user3',
          accountWinlostModels: mockAccountWinlostModels
        } as AbnormalAccountModel
      };

      jest.spyOn(service as any, 'getUsernamesForSaveRequest').mockReturnValue('filtered,usernames');
      jest.spyOn(service as any, 'getAccountWinlostModelsForSaveRequest').mockReturnValue(mockAccountWinlostModels);

      const result = service['createAbnormalAccountModel'](argsWithAccountModels);

      expect(result.usernames).toBe('filtered,usernames');
      expect(result.accountWinlostModels).toEqual(mockAccountWinlostModels);
      expect(result).not.toBe(argsWithAccountModels.abnormalAccountModel); // Should be cloned
    });
  });
});
