import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { GroupUsername } from '../../../../../utility/components/user-names/user-names.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { AccountTableComponent } from '../account-table/account-table.component';
import { ConfirmAbnormalAccountModel } from '../confirm-abnormal-account/confirm-abnormal-account.model';
import { EventDateFilterComponent } from '../event-date-filter/event-date-filter.component';
import { CheckUsernamesViewModel, ValidationAbnormalAccount } from '../models/check-username.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from '../models/validation.model';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { ValidationService } from './validation.service';

class Helper {
  static readonly url = 'http://localhost:60196/';
  static readonly fakeRequestId = 10222;
  static readonly fakeTransId = '100000002';
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  };
  static readonly fakeConfirmAbnormalAccountModel: ConfirmAbnormalAccountModel = {
    isOpenDialog: true,
    isAutoVoid: false,
    isHasWarningEditTakeNoteRequest: false,
    isEditingByAnotherUser: false,
    requestId: 0,
    requestedBy: '',
    isHasWarningTicketsExistedInRequest: false,
    numberOfTicketsExistedInRequest: 1
  };
  static readonly fakeValidationBusinessRuleArgs: ValidationBusinessRuleArgs = {
    requestId: Helper.fakeRequestId,
    abnormalAccountModel: new AbnormalAccountModel(),
    primitiveProps: new PrimitiveProperty(),
    usernamesComponent: new UsernamesComponent(null),
    actionId: '1',
    issueTypeId: '1',
    eventDateFilterComponent: new EventDateFilterComponent(null),
    productFilterComponent: new ProductFilterComponent(null),
    accountTableComponent: new AccountTableComponent(null, null, null, null)
  };
  static readonly fakeValidationBusinessRuleOutput: ValidationBusinessRuleOutput = {
    isValid: false,
    confirmAbnormalAccountModel: new ConfirmAbnormalAccountModel(),
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    accountWinlostModels: []
  };
}

describe('ValidationService', () => {
  let validationService: ValidationService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(() => {
    addRequestApiService = new AddRequestApiService(null);
    validationService = new ValidationService(addRequestApiService);
    validationService['getTransInfo'] = jest.fn();
  });

  it('#isValidCommonData should return true', async () => {
    const productFilterComponent = new ProductFilterComponent(null);
    productFilterComponent.isValidComponent = jest.fn().mockImplementation(() => true);
    const eventDateFilterComponent = new EventDateFilterComponent(null);
    eventDateFilterComponent.isValidEventDate = jest.fn().mockImplementation(() => true);

    const actual = validationService.isValidCommonData(productFilterComponent, eventDateFilterComponent);

    expect(actual).toBeTruthy();
  });

  it('#checkValidUsernames should return false when isCancelValidate true', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    args.primitiveProps.isCancelValidate = true;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => 'admin');

    const actual = await validationService.checkBusinessRule(args);

    expect(actual.isValid).toBeFalsy();
  });

  it('#checkValidUsernames should return false when @usernames empty and @checkValidItems false', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    args.primitiveProps.isCancelValidate = false;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => '');
    args.usernamesComponent.checkValidItems = jest.fn().mockImplementation(() => false);

    const actual = await validationService.checkBusinessRule(args);

    expect(actual.isValid).toBeFalsy();
  });

  it('#checkValidUsernames should return false when isValidCommonData false', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    args.primitiveProps.isCancelValidate = false;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => '');
    validationService['isValidCommonData'] = jest.fn().mockReturnValue(false);

    const actual = await validationService.checkBusinessRule(args);

    expect(actual.isValid).toBeFalsy();
  });

  it('#checkValidUsernames should return false when have duplicated usernames', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    args.primitiveProps.isCancelValidate = false;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.resetAllValue = jest.fn().mockImplementation();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => 'admin');
    args.usernamesComponent.checkValidItems = jest.fn().mockImplementation(() => false);
    args.usernamesComponent.groupUsername.getDuplicatedItems = jest.fn().mockImplementation(() => 'admin');
    args.usernamesComponent.groupUsername.updateDuplicatedItems = jest.fn().mockImplementation();
    validationService['isValidCommonData'] = jest.fn().mockReturnValue(true);

    const actual = await validationService.checkBusinessRule(args);

    expect(actual.isValid).toBeFalsy();
  });

  it('#checkValidUsernames should return false when have invalid usernames', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    const results = new CheckUsernamesViewModel();
    results.validation = new ValidationAbnormalAccount();
    results.validation.invalidUserName = 'admin, member';
    args.primitiveProps.isCancelValidate = false;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => 'admin');
    args.usernamesComponent.groupUsername.resetAllValue = jest.fn().mockImplementation();
    args.usernamesComponent.groupUsername.getDuplicatedItems = jest.fn().mockImplementation(() => '');
    args.usernamesComponent.groupUsername.updateDuplicatedItems = jest.fn().mockImplementation();
    args.usernamesComponent.checkValidItems = jest.fn().mockImplementation(() => false);
    validationService['getValidation'] = jest.fn().mockImplementation(() => Promise.resolve(results));
    validationService['highlightInvalidUsernames'] = jest.fn().mockImplementation(() => false);
    validationService['isValidCommonData'] = jest.fn().mockReturnValue(true);

    const actual = await validationService.checkBusinessRule(args);

    expect(actual.isValid).toBeFalsy();
  });

  it('#checkValidUsernames should return false when isExceededTotalUsernames true', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    const results = new CheckUsernamesViewModel();
    results.validation = new ValidationAbnormalAccount();
    results.validation.invalidUserName = '';
    results.validation.isExceededTotalUsernames = true;
    args.primitiveProps.isCancelValidate = false;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => 'admin');
    args.usernamesComponent.groupUsername.resetAllValue = jest.fn().mockImplementation();
    args.usernamesComponent.groupUsername.getDuplicatedItems = jest.fn().mockImplementation(() => '');
    args.usernamesComponent.groupUsername.updateDuplicatedItems = jest.fn().mockImplementation();
    args.usernamesComponent.checkValidItems = jest.fn().mockImplementation(() => false);
    validationService['getValidation'] = jest.fn().mockImplementation(() => Promise.resolve(results));
    validationService['highlightInvalidUsernames'] = jest.fn().mockImplementation(() => false);
    validationService['isValidCommonData'] = jest.fn().mockReturnValue(true);

    const actual = await validationService.checkBusinessRule(args);

    expect(actual.isValid).toBeFalsy();
  });

  it('#checkValidUsernames should return false when isInvalidTotalTicket true', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    const results = new CheckUsernamesViewModel();
    results.validation = new ValidationAbnormalAccount();
    results.validation.invalidUserName = '';
    results.validation.isExceededTotalUsernames = false;
    results.validation.isInvalidTotalTicket = true;
    args.primitiveProps.isCancelValidate = false;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => 'admin');
    args.usernamesComponent.groupUsername.resetAllValue = jest.fn().mockImplementation();
    args.usernamesComponent.groupUsername.getDuplicatedItems = jest.fn().mockImplementation(() => '');
    args.usernamesComponent.groupUsername.updateDuplicatedItems = jest.fn().mockImplementation();
    args.usernamesComponent.checkValidItems = jest.fn().mockImplementation(() => false);
    validationService['getValidation'] = jest.fn().mockImplementation(() => Promise.resolve(results));
    validationService['highlightInvalidUsernames'] = jest.fn().mockImplementation(() => false);
    validationService['isValidCommonData'] = jest.fn().mockReturnValue(true);

    const actual = await validationService.checkBusinessRule(args);

    expect(actual.isValid).toBeFalsy();
  });

  it('#checkValidUsernames should return true', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    const results = new CheckUsernamesViewModel();
    results.validation = new ValidationAbnormalAccount();
    results.validation.invalidUserName = '';
    results.validation.isExceededTotalUsernames = false;
    results.validation.isInvalidTotalTicket = false;
    args.primitiveProps.isCancelValidate = false;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => 'admin');
    args.usernamesComponent.groupUsername.resetAllValue = jest.fn().mockImplementation();
    args.usernamesComponent.groupUsername.getDuplicatedItems = jest.fn().mockImplementation(() => '');
    args.usernamesComponent.groupUsername.updateDuplicatedItems = jest.fn().mockImplementation();
    args.usernamesComponent.checkValidItems = jest.fn().mockImplementation(() => true);
    validationService['getValidation'] = jest.fn().mockImplementation(() => Promise.resolve(results));
    validationService['getConfirmAbnormalBetModel'] = jest.fn().mockImplementation();
    validationService['highlightInvalidUsernames'] = jest.fn().mockImplementation(() => true);
    validationService['isValidCommonData'] = jest.fn().mockReturnValue(true);

    const actual = await validationService.checkBusinessRule(args);

    expect(actual.isValid).toBeTruthy();
  });

  it('#checkValidUsernames should be throw exception', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    args.primitiveProps.isCancelValidate = false;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => '');
    args.usernamesComponent.groupUsername.checkValidItems = jest.fn().mockImplementation(() => {
      throw new TypeError('No server is available');
    });
    validationService['isValidCommonData'] = jest.fn().mockReturnValue(true);

    try {
      const actual = await validationService.checkBusinessRule(args);
      expect(actual).toBeTruthy();
    } catch(e) {
      expect(e.isValid).toBeFalsy();
    }
  });

  it('#getConfirmAbnormalBetModel should return expected model', async () => {
    const model = new ValidationAbnormalAccount();
    const actual = validationService['getConfirmAbnormalBetModel'](model);

    expect(actual.numberOfTicketsExistedInRequest).toBe(model.numberOfTickets)
  });

  it('#getValidation should call #checkValidUsernames', async () => {
    const args = Helper.fakeValidationBusinessRuleArgs;
    addRequestApiService.checkValidUsernames = jest.fn().mockReturnValue(new CheckUsernamesViewModel());
    const actual = await validationService['getValidation'](args);

    expect(addRequestApiService.checkValidUsernames).toHaveBeenCalledTimes(1);
    expect(actual).toEqual(new CheckUsernamesViewModel());
  });

  it('#isHasWarningEditTakeNoteRequest should return true', async () => {
    const actual = validationService['isHasWarningEditTakeNoteRequest'](true, '2', '5');

    expect(actual).toBeTruthy();
  });

  it('#isEditingByAnotherUser should return true', async () => {
    const actual = validationService['isEditingByAnotherUser'](true, 1, 2);

    expect(actual).toBeTruthy();
  });
});