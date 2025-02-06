import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { GroupUsername } from '../../../../../utility/components/user-names/user-names.model';
import { AddRequestService } from '../../add-request.service';
import { AddRequestStore } from '../../add-request.store';
import { ConfirmAddRequestModel } from '../../confirm-add-request/confirm-add-request.model';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PopupService } from '../../services/popup.service';
import { AccountTableComponent } from '../account-table/account-table.component';
import { EventDateFilterComponent } from '../event-date-filter/event-date-filter.component';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request.model';
import { ValidationBusinessRuleOutput } from '../models/validation.model';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { AbnormalAccountService } from './abnormal-account.service';
import { SaveRequestService } from './save-request.service';
import { ValidationService } from './validation.service';
;

class Helper {
  static readonly url = 'http://localhost:60196/';
  static readonly fakeRequestId = 10222;
  static readonly fakeTransId = '100000002';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeSaveRequestArg: SaveRequestArg = {
    requestId: Helper.fakeRequestId,
    isEdit: false,
    filter: Helper.fakeFilterModel,
    abnormalAccountModel: new AbnormalAccountModel(),
    others: new OthersModel(),
    confirmAddRequest: new ConfirmAddRequestModel(),
    addRequestStore: new AddRequestStore(),
    userId: 8,
    requestedBy: 'AA',
    actionIdOfFirstTimeAccess: '5',
    primitiveProps: new PrimitiveProperty(),
    usernamesComponent: new UsernamesComponent(null),
    productFilterComponent: new ProductFilterComponent(null),
    eventDateFilterComponent: new EventDateFilterComponent(null),
    accountTableComponent: new AccountTableComponent(null, null, null, null)
  } as SaveRequestArg;
  static readonly fakeValidationBusinessRuleOutput: ValidationBusinessRuleOutput = {
    isValid: false,
    numberOfTicketsExistedInRequest: 0,
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    accountWinlostModels: []
  };
}

describe('SaveRequestService', () => {
  let saveRequestService: SaveRequestService;
  let addRequestService: AddRequestService;
  let validationService: ValidationService;
  let abnormalAccountService: AbnormalAccountService;
  let popupService: PopupService;

  beforeEach(() => {
    addRequestService = new AddRequestService(null, null, null);
    addRequestService.executeSaveRequest = jest.fn();
    saveRequestService = new SaveRequestService(popupService, addRequestService, validationService, abnormalAccountService);
  });

  it('#saveRequest should not call #showPopupConfirmSave', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = false;
    args.addRequestStore = new AddRequestStore();
    args.addRequestStore.changeBlockingUiStatus = jest.fn();
    args.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestService = new SaveRequestService(null, addRequestService, validationService, null);
    saveRequestService['showPopupConfirmSave'] = jest.fn();
    saveRequestService.recheckValidationBeforeSaveRequest = jest.fn().mockReturnValue(false);
    saveRequestService['cancelValidateUsernamesWhenFocusOut'] = jest.fn().mockImplementation();

    await saveRequestService.saveRequest(args);

    expect(saveRequestService['showPopupConfirmSave']).toHaveBeenCalledTimes(0);
  });

  it('#saveRequest should call #showPopupConfirmSave', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = true;
    args.addRequestStore = new AddRequestStore();
    args.addRequestStore.changeBlockingUiStatus = jest.fn();
    args.addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestService = new SaveRequestService(null, addRequestService, validationService, null);
    saveRequestService['showPopupConfirmSave'] = jest.fn();
    saveRequestService['cancelValidateUsernamesWhenFocusOut'] = jest.fn();

    await saveRequestService.saveRequest(args);

    expect(saveRequestService['showPopupConfirmSave']).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should call #executeSaveRequestApi', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.filter.isVoided = true;
    args.addRequestStore = new AddRequestStore();
    args.addRequestStore.changeBlockingUiStatus = jest.fn();
    saveRequestService = new SaveRequestService(null, addRequestService, null, null);
    saveRequestService['executeSaveRequestApi'] = jest.fn().mockImplementation();

    await saveRequestService.onClickConfirmSave(args);

    expect(saveRequestService['executeSaveRequestApi']).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSave should call #showError', async () => {
    const args = Helper.fakeSaveRequestArg;
    const output = Helper.fakeValidationBusinessRuleOutput;
    output.isValid = false;
    args.filter.isVoided = false;
    args.addRequestStore = new AddRequestStore();
    args.addRequestStore.changeBlockingUiStatus = jest.fn();
    const mockPopupService = new PopupService(null);
    mockPopupService.showError = jest.fn();
    saveRequestService = new SaveRequestService(mockPopupService, addRequestService, null, null);
    saveRequestService.recheckValidationBeforeSaveRequest = jest.fn().mockReturnValue(false);

    await saveRequestService.onClickConfirmSave(args);

    expect(mockPopupService.showError).toHaveBeenCalledTimes(1);
  });

  it('#initAddRequestQuery should return model', async () => {
    const args = Helper.fakeSaveRequestArg;
    args.usernamesComponent = new UsernamesComponent(null);
    args.usernamesComponent.groupUsername = new GroupUsername();
    args.usernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue(['AB'])
    args.filter.isVoided = false;
    args.primitiveProps = new PrimitiveProperty();
    args.primitiveProps.transInfoAddRequestModel = new TransInfoAddRequestModel();
    saveRequestService = new SaveRequestService(null, null, null, null);

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
    saveRequestService = new SaveRequestService(null, null, null, null);

    const actual = saveRequestService['initAddRequestQuery'](args);

    expect(actual.actionId).toBe(args.filter.action);
    expect(actual.issueTypeId).toBe(args.filter.issueTypeId);
  });

  it('#cancelValidateUsernamesWhenFocusOut should call #triggerFocusOutUsernames', async () => {
    const primitiveProps = new PrimitiveProperty();
    const usernamesComponent = new UsernamesComponent(null);
    usernamesComponent.triggerFocusOutUsernames = jest.fn();
    saveRequestService = new SaveRequestService(null, null, null, null);

    saveRequestService['cancelValidateUsernamesWhenFocusOut'](primitiveProps, usernamesComponent);

    expect(usernamesComponent.triggerFocusOutUsernames).toHaveBeenCalledTimes(1);
  });
});