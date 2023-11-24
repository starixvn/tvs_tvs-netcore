import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { GroupUsername } from '../../../../../utility/components/user-names/user-names.model';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { AccountTableComponent } from '../account-table/account-table.component';
import { ConfirmAbnormalAccountModel } from '../confirm-abnormal-account/confirm-abnormal-account.model';
import { EventDateFilterComponent } from '../event-date-filter/event-date-filter.component';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request.model';
import { ValidationBusinessRuleOutput } from '../models/validation.model';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';
;

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
    isHasWarningEditTakeNoteRequest: false,
    isEditingByAnotherUser: false,
    requestId: 0,
    requestedBy: '',
    isHasWarningTicketsExistedInRequest: false,
    numberOfTicketsExistedInRequest: 1
  };
  static readonly fakeSaveRequestArg: SaveRequestArg = {
    requestId: Helper.fakeRequestId,
    isEdit: false,
    filter: Helper.fakeFilterModel,
    abnormalAccountModel: new AbnormalAccountModel(),
    others: new OthersModel(),
    confirmAbnormalAccount: Helper.fakeConfirmAbnormalAccountModel,
    addRequestStore: new AddRequestStore(),
    userId: 8,
    requestedBy: 'AA',
    actionIdOfFirstTimeAccess: '5',
    primitiveProps: new PrimitiveProperty(),
    usernamesComponent: new UsernamesComponent(null),
    productFilterComponent: new ProductFilterComponent(null),
    eventDateFilterComponent: new EventDateFilterComponent(null),
    accountTableComponent: new AccountTableComponent(null, null, null, null)
  };
  static readonly fakeValidationBusinessRuleOutput: ValidationBusinessRuleOutput = {
    isValid: false,
    confirmAbnormalAccountModel: new ConfirmAbnormalAccountModel(),
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    accountWinlostModels: []
  };
}

describe('SaveRequestService', () => {
  let saveRequestService: SaveRequestService;
  let addRequestService: AddRequestService;
  let validationService: ValidationService;

  beforeEach(() => {
    addRequestService = new AddRequestService(null, null, null);
    addRequestService.executeSaveRequest = jest.fn();
  });

  it('#saveRequest should call #saveWhenRequestNotVoided', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    args.addRequestStore = new AddRequestStore();
    args.addRequestStore.changeBlockingUiStatus = jest.fn();
    args.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestService = new SaveRequestService(null, addRequestService, validationService);
    saveRequestService['saveWhenRequestNotVoided'] = jest.fn().mockImplementation();
    saveRequestService['cancelValidateUsernamesWhenFocusOut'] = jest.fn().mockImplementation();

    await saveRequestService.saveRequest(args);

    expect(saveRequestService['saveWhenRequestNotVoided']).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should call #saveWhenRequestVoided', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = true;
    args.addRequestStore = new AddRequestStore();
    args.addRequestStore.changeBlockingUiStatus = jest.fn();
    args.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestService = new SaveRequestService(null, addRequestService, validationService);
    saveRequestService['saveWhenRequestVoided'] = jest.fn().mockImplementation();
    saveRequestService['cancelValidateUsernamesWhenFocusOut'] = jest.fn().mockImplementation();

    await saveRequestService.saveRequest(args);

    expect(saveRequestService['saveWhenRequestVoided']).toHaveBeenCalledTimes(1);
  });

  it('#saveWhenRequestVoided should call #openConfirmAbnormalAccount', async () => {
    const args = Helper.fakeSaveRequestArg;
    saveRequestService = new SaveRequestService(null, addRequestService, validationService);
    saveRequestService['checkIfRequestHasWarning'] = jest.fn().mockImplementation().mockImplementation(() => Promise.resolve(true));
    saveRequestService['openConfirmAbnormalAccount'] = jest.fn().mockImplementation();

    await saveRequestService['saveWhenRequestVoided'](args);

    expect(saveRequestService['openConfirmAbnormalAccount']).toHaveBeenCalledTimes(1);
  });

  it('#saveWhenRequestVoided should call #executeApiSaveRequest', async () => {
    const args = Helper.fakeSaveRequestArg;
    saveRequestService = new SaveRequestService(null, addRequestService, validationService);
    saveRequestService['checkIfRequestHasWarning'] = jest.fn().mockImplementation().mockImplementation(() => Promise.resolve(false));
    saveRequestService['executeApiSaveRequest'] = jest.fn().mockImplementation();

    await saveRequestService['saveWhenRequestVoided'](args);

    expect(saveRequestService['executeApiSaveRequest']).toHaveBeenCalledTimes(1);
  });

  it('#saveWhenRequestNotVoided should return when #isValidCommonData false', async () => {
    const args = Helper.fakeSaveRequestArg;
    const mockValidationService = new ValidationService(null);
    mockValidationService.isValidCommonData = jest.fn().mockImplementation(() => false);
    saveRequestService = new SaveRequestService(null, addRequestService, mockValidationService);

    await saveRequestService['saveWhenRequestNotVoided'](args);

    expect(mockValidationService.isValidCommonData).toHaveBeenCalledTimes(1);
  });

  it('#saveWhenRequestNotVoided should return when #checkValidUsernames false', async () => {
    const args = Helper.fakeSaveRequestArg;
    const mockValidationService = new ValidationService(null);
    mockValidationService.isValidCommonData = jest.fn().mockImplementation(() => true);
    mockValidationService.checkBusinessRule = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeValidationBusinessRuleOutput));
    saveRequestService = new SaveRequestService(null, addRequestService, mockValidationService);

    await saveRequestService['saveWhenRequestNotVoided'](args);

    expect(mockValidationService.isValidCommonData).toHaveBeenCalledTimes(1);
    expect(mockValidationService.checkBusinessRule).toHaveBeenCalledTimes(1);
  });

  it('#saveWhenRequestNotVoided should call #openConfirmAbnormalAccount when #checkIfRequestHasWarning true', async () => {
    const args = Helper.fakeSaveRequestArg;
    const output = Helper.fakeValidationBusinessRuleOutput;
    output.isValid = true;
    const mockValidationService = new ValidationService(null);
    mockValidationService.isValidCommonData = jest.fn().mockImplementation(() => true);
    mockValidationService.checkBusinessRule = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeValidationBusinessRuleOutput));
    saveRequestService = new SaveRequestService(null, addRequestService, mockValidationService);
    saveRequestService['checkIfRequestHasWarning'] = jest.fn().mockImplementation().mockImplementation(() => Promise.resolve(true));
    saveRequestService['openConfirmAbnormalAccount'] = jest.fn().mockImplementation();

    await saveRequestService['saveWhenRequestNotVoided'](args);

    expect(saveRequestService['openConfirmAbnormalAccount']).toHaveBeenCalledTimes(1);
  });

  it('#saveWhenRequestNotVoided should call #executeApiSaveRequest when #checkIfRequestHasWarning false', async () => {
    const args = Helper.fakeSaveRequestArg;
    const output = Helper.fakeValidationBusinessRuleOutput;
    output.isValid = true;
    const mockValidationService = new ValidationService(null);
    mockValidationService.isValidCommonData = jest.fn().mockImplementation(() => true);
    mockValidationService.checkBusinessRule = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeValidationBusinessRuleOutput));
    saveRequestService = new SaveRequestService(null, addRequestService, mockValidationService);
    saveRequestService['checkIfRequestHasWarning'] = jest.fn().mockImplementation().mockImplementation(() => Promise.resolve(false));
    saveRequestService['executeApiSaveRequest'] = jest.fn().mockImplementation();

    await saveRequestService['saveWhenRequestNotVoided'](args);

    expect(saveRequestService['executeApiSaveRequest']).toHaveBeenCalledTimes(1);
  });

  it('#onYesConfirmWarningModal should call #executeApiSaveRequest', async () => {
    const args = Helper.fakeSaveRequestArg;
    const output = Helper.fakeValidationBusinessRuleOutput;
    output.isValid = true;
    args.addRequestStore = new AddRequestStore();
    args.addRequestStore.changeBlockingUiStatus = jest.fn();
    const mockValidationService = new ValidationService(null);
    mockValidationService.checkBusinessRule = jest.fn().mockImplementation(() => Promise.resolve(output));
    saveRequestService = new SaveRequestService(null, addRequestService, mockValidationService);
    saveRequestService['executeApiSaveRequest'] = jest.fn().mockImplementation();

    await saveRequestService.onYesConfirmWarningModal(args);

    expect(saveRequestService['executeApiSaveRequest']).toHaveBeenCalledTimes(1);
  });

  it('#onYesConfirmWarningModal should call #showError', async () => {
    const args = Helper.fakeSaveRequestArg;
    const output = Helper.fakeValidationBusinessRuleOutput;
    output.isValid = false;
    args.addRequestStore = new AddRequestStore();
    args.addRequestStore.changeBlockingUiStatus = jest.fn();
    const mockValidationService = new ValidationService(null);
    mockValidationService.checkBusinessRule = jest.fn().mockImplementation(() => Promise.resolve(output));
    const mockPopupService = new PopupService(null);
    mockPopupService.showError = jest.fn();
    saveRequestService = new SaveRequestService(mockPopupService, addRequestService, mockValidationService);

    await saveRequestService.onYesConfirmWarningModal(args);

    expect(mockPopupService.showError).toHaveBeenCalledTimes(1);
  });

  it('#checkIfRequestHasWarning should return true when isHasWarningTicketsExistedInRequest true', async () => {
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    const validation = Helper.fakeValidationBusinessRuleOutput;
    validation.confirmAbnormalAccountModel.numberOfTicketsExistedInRequest = 1;
    const mockValidationService = new ValidationService(null);
    mockValidationService.isHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    mockValidationService.isEditingByAnotherUser = jest.fn().mockImplementation(() => false);
    saveRequestService = new SaveRequestService(null, null, mockValidationService);

    const actual = await saveRequestService['checkIfRequestHasWarning'](args, validation);

    expect(actual).toBeTruthy();
  });

  it('#checkIfRequestHasWarning should return true when isHasWarningEditTakeNoteRequest true', async () => {
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    const validation = Helper.fakeValidationBusinessRuleOutput;
    validation.confirmAbnormalAccountModel.numberOfTicketsExistedInRequest = 0;
    const mockValidationService = new ValidationService(null);
    mockValidationService.isHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => true);
    mockValidationService.isEditingByAnotherUser = jest.fn().mockImplementation(() => false);
    saveRequestService = new SaveRequestService(null, null, mockValidationService);

    const actual = await saveRequestService['checkIfRequestHasWarning'](args, validation);

    expect(actual).toBeTruthy();
  });

  it('#checkIfRequestHasWarning should return true when isEditingByAnotherUser true', async () => {
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    const validation = Helper.fakeValidationBusinessRuleOutput;
    validation.confirmAbnormalAccountModel.numberOfTicketsExistedInRequest = 0;
    const mockValidationService = new ValidationService(null);
    mockValidationService.isHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    mockValidationService.isEditingByAnotherUser = jest.fn().mockImplementation(() => true);
    saveRequestService = new SaveRequestService(null, null, mockValidationService);

    const actual = await saveRequestService['checkIfRequestHasWarning'](args, validation);

    expect(actual).toBeTruthy();
  });

  it('#checkIfRequestHasWarning should return false', async () => {
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = true;
    const validation = Helper.fakeValidationBusinessRuleOutput;
    validation.confirmAbnormalAccountModel.numberOfTicketsExistedInRequest = 0;
    const mockValidationService = new ValidationService(null);
    mockValidationService.isHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    mockValidationService.isEditingByAnotherUser = jest.fn().mockImplementation(() => false);
    saveRequestService = new SaveRequestService(null, null, mockValidationService);

    const actual = await saveRequestService['checkIfRequestHasWarning'](args, validation);

    expect(actual).toBeFalsy();
  });

  it('#openConfirmAbnormalAccount should update data', async () => {
    const args = Helper.fakeSaveRequestArg;
    saveRequestService = new SaveRequestService(null, null, null);

    saveRequestService['openConfirmAbnormalAccount'](args);

    expect(args.confirmAbnormalAccount.requestId).toBe(args.requestId);
    expect(args.confirmAbnormalAccount.requestedBy ).toBe(args.requestedBy );
    expect(args.confirmAbnormalAccount.isOpenDialog ).toBeTruthy();
  });

  it('#executeApiSaveRequest should update data', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue(['AV'])
    const mockAddRequestService = new AddRequestService(null, null, null);
    mockAddRequestService.executeSaveRequest = jest.fn();
    saveRequestService = new SaveRequestService(null, mockAddRequestService, null);

    await saveRequestService['executeApiSaveRequest'](args);

    expect(mockAddRequestService.executeSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#initAddRequestQuery should return model', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue(['AB'])
    args.filter.isVoided = false;
    args.primitiveProps = new PrimitiveProperty();
    args.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    saveRequestService = new SaveRequestService(null, null, null);

    const actual = saveRequestService['initAddRequestQuery'](args);

    expect(actual.actionId).toBe(args.filter.action);
    expect(actual.issueTypeId).toBe(args.filter.issueTypeId);
  });

  it('#initAddRequestQuery should return expected model when transInfoAddRequestModel is null', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockImplementation(() => 'AB');
    args.filter.isVoided = false;
    args.primitiveProps = new PrimitiveProperty();
    args.primitiveProps.transInfoAddRequestModel = null;
    saveRequestService = new SaveRequestService(null, null, null);

    const actual = saveRequestService['initAddRequestQuery'](args);

    expect(actual.actionId).toBe(args.filter.action);
    expect(actual.issueTypeId).toBe(args.filter.issueTypeId);
  });

  it('#cancelValidateUsernamesWhenFocusOut should call #triggerFocusOutUsernames', async () => {
    const primitiveProps = new PrimitiveProperty();
    const usernamesComponent = new UsernamesComponent(null);
    usernamesComponent.triggerFocusOutUsernames = jest.fn();
    saveRequestService = new SaveRequestService(null, null, null);

    saveRequestService['cancelValidateUsernamesWhenFocusOut'](primitiveProps, usernamesComponent);

    expect(usernamesComponent.triggerFocusOutUsernames).toHaveBeenCalledTimes(1);
  });
});