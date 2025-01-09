import { ElementRef, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { UsernamesComponent } from '../../../../utility/components/user-names/user-names.component';
import { GroupUsername } from '../../../../utility/components/user-names/user-names.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { ConfirmAddRequestComponent } from '../confirm-add-request/confirm-add-request.component';
import { FilterModel } from '../filter/filter.model';
import { AbnormalAccountModel } from '../models/abnormal-account.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { AbnormalAccountOtherComponent } from './abnormal-accounts-other/abnormal-accounts-other.component';
import { AbnormalAccountsComponent } from './abnormal-accounts.component';
import { AccountTableComponent } from './account-table/account-table.component';
import { EventDateFilterComponent } from './event-date-filter/event-date-filter.component';
import { AccountWinlostModel } from './models/account-winlost.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { ValidationBusinessRuleOutput } from './models/validation.model';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

class Helper {
  static readonly fakeDate: string = '2020-11-09 12:08:49.737';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '11',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  } as FilterModel;
  static readonly fakeAbnormalAccountModel: AbnormalAccountModel = {
    usernames: '',
    productIds: '',
    statusIds: '',
    fromDate: null,
    toDate: null,
    accountWinlostModels: [],
    subIssueTypeId: 1
  } as AbnormalAccountModel;
}

describe('AbnormalAccountsComponent', () => {
  @NgModule({
    declarations: [
      UsernamesComponent,
      AccountTableComponent,
      ProductFilterComponent,
      EventDateFilterComponent,
      AbnormalAccountOtherComponent,
      ConfirmAddRequestComponent
    ],
    imports: [
      BlockUiModule,
      NgbModule
    ],
    providers: [
      CommonService,
      AddRequestStore,
      ValidationService,
      SaveRequestService,
      AddRequestApiService,
      SaveRequestService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AbnormalAccountsComponent>;

  beforeEach(() => {
    shallow = new Shallow(AbnormalAccountsComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#AbnormalAccountsComponent init should match snapshot', async () => {
    const { fixture } = await shallow
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });

    expect(fixture).toMatchSnapshot();
  });

  it('#focusOutUsernames should return & update isCancelValidate to false when isCancelValidate true', async () => {
    const { instance } = await shallow
      .mock(ValidationService, { isAutoVoidWithPolicy: jest.fn().mockReturnValue(false) })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.primitiveProps.isCancelValidate = true;

    await instance.focusOutUsernames();

    expect(instance.primitiveProps.isCancelValidate).toBeFalsy();
  });

  it('#focusOutUsernames should called #checkValidUsernames', async () => {
    const mockCheckValidUsernames = jest.fn().mockImplementation();
    const { instance } = await shallow
      .mock(ValidationService, { checkBusinessRule: mockCheckValidUsernames })
      .mock(ValidationService, { isAutoVoidWithPolicy: jest.fn().mockReturnValue(true) })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.usernamesComponent = new UsernamesComponent(null);
    instance.usernamesComponent.groupUsername = new GroupUsername();
    instance.usernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue('1,2,3');
    instance.primitiveProps = new PrimitiveProperty();
    instance.primitiveProps.isCancelValidate = false;

    await instance.focusOutUsernames();

    expect(mockCheckValidUsernames).toHaveBeenCalledTimes(1);
  });

  it('#triggerCloseEvent should called #changeSavingRequestStatus', async () => {
    const mockChangeSavingRequestStatus = jest.fn().mockImplementation();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.onClickCancelSaveRequest();

    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#triggerCloseEvent should called #changeSavingRequestStatus', async () => {
    const mockChangeSavingRequestStatus = jest.fn().mockImplementation();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.onClickCancelSaveRequest();

    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should called #saveRequestService.saveRequest', async () => {
    const mockSaveRequest = jest.fn().mockImplementation();
    const { instance } = await shallow
      .mock(SaveRequestService, { saveRequest: mockSaveRequest })
      .mock(ValidationService, { isAutoVoidWithPolicy: jest.fn().mockReturnValue(false) })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.usernamesComponent = new UsernamesComponent(null);
    instance.usernamesComponent.groupUsername = new GroupUsername();
    instance.usernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue('1,2,3');
    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#onYesConfirmWarningModal should called #saveRequestService.onYesConfirmWarningModal', async () => {
    const mockOnYesConfirmWarningModal = jest.fn().mockImplementation();
    const { instance } = await shallow
      .mock(SaveRequestService, { onClickConfirmSave: mockOnYesConfirmWarningModal })
      .mock(ValidationService, { isAutoVoidWithPolicy: jest.fn().mockReturnValue(true) })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.usernamesComponent = new UsernamesComponent(null);
    instance.usernamesComponent.groupUsername = new GroupUsername();
    instance.usernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue('1,2,3');
    await instance.onClickConfirmSaveRequest();

    expect(mockOnYesConfirmWarningModal).toHaveBeenCalledTimes(1);
  });

  it('#initSaveRequestInput should return expected model', async () => {
    const { instance } = await shallow
      .mock(ValidationService, { isAutoVoidWithPolicy: jest.fn().mockReturnValue(true) })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.usernamesComponent = new UsernamesComponent(null);
    instance.usernamesComponent.groupUsername = new GroupUsername();
    instance.usernamesComponent.groupUsername.getAllValue = jest.fn().mockReturnValue('1,2,3');
    const actual = instance['initSaveRequestInput']();

    expect(actual.requestId).toBe(instance.requestId);
    expect(actual.isEdit).toBe(instance.isEdit);
    expect(actual.userId).toBe(instance.userId);
  });

  it('#changeFilter should update isShowAccountWinLost and isShowError to false', async () => {
    const { instance } = await shallow
      .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.changeFilter();

    expect(instance.primitiveProps.isShowAccountWinLost).toBeFalsy();
    expect(instance.primitiveProps.isShowError).toBeFalsy();
  });

  it('#hideValidationMessage should update isShowError to false', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.hideValidationMessage();

    expect(instance.primitiveProps.isShowError).toBeFalsy();
  });

  it('#ngOnInit should called #addRequestApiService.getAccountWinLost', async () => {
    const validAccountWinlostModels = [new AccountWinlostModel()];
    const mockGetAccountWinLost = jest.fn().mockReturnValue(validAccountWinlostModels);
    const { instance } = await shallow
      .mock(ValidationService, { isAutoVoidWithPolicy: jest.fn().mockReturnValue(true) })
      .mock(AddRequestApiService, {
        getAccountWinLost: mockGetAccountWinLost,
        getPermissionAddRequest: jest.fn().mockReturnValue(new PermissionAddRequest())
      })
      .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn() })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    await instance.ngOnInit();

    expect(instance.primitiveProps.isShowAccountWinLost).toBeTruthy();
    expect(instance.primitiveProps.validAccountWinlostModels).toEqual(validAccountWinlostModels);
    expect(mockGetAccountWinLost).toHaveBeenCalled();
  });

  it('#saveRequest should called #saveRequestService.saveRequest when accountTableComponent is invalid', async () => {
    const mockChangeSavingRequestStatus = jest.fn();
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.accountTableComponent = new AccountTableComponent(null, null, null, null);
    instance.accountTableComponent.isValid = jest.fn().mockReturnValue(false);
    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(0);
    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should called #validationService.checkBusinessRule and update accountTableComponent.isCancelRecalculateAmount to true', async () => {
    const validationOutput = {
      accountWinlostModels: [new AccountWinlostModel()]
    } as ValidationBusinessRuleOutput;
    const mockChangeBlockingUiStatus = jest.fn();
    const mockCheckBusinessRule = jest.fn().mockReturnValue(validationOutput);
    const { instance } = await shallow
      .mock(ValidationService, { isAutoVoidWithPolicy: jest.fn().mockReturnValue(false) })
      .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
      .mock(ValidationService, { checkBusinessRule: mockCheckBusinessRule })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.accountTableComponent = new AccountTableComponent(null, null, null, null);

    await instance.handleSearchEvent();

    expect(mockCheckBusinessRule).toHaveBeenCalledTimes(1);
    expect(instance.accountTableComponent.isCancelRecalculateAmount).toBeTruthy();
    expect(instance.primitiveProps.validAccountWinlostModels).toEqual(validationOutput.accountWinlostModels);
  });

  it('#handleSearchEvent should not called #validationService.checkBusinessRule', async () => {
    const validationOutput = {
      accountWinlostModels: [new AccountWinlostModel()]
    } as ValidationBusinessRuleOutput;
    const mockChangeBlockingUiStatus = jest.fn();
    const mockCheckBusinessRule = jest.fn().mockReturnValue(validationOutput);
    const { instance } = await shallow
      .mock(ValidationService, { isAutoVoidWithPolicy: jest.fn().mockReturnValue(false) })
      .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
      .mock(ValidationService, { checkBusinessRule: mockCheckBusinessRule })
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.accountTableComponent = new AccountTableComponent(null, null, null, null);
    instance.accountTableComponent.isValid = jest.fn().mockReturnValue(false);
    await instance.handleSearchEvent();

    expect(mockCheckBusinessRule).toHaveBeenCalledTimes(0);
    expect(instance.accountTableComponent.isCancelRecalculateAmount).toBeTruthy();
  });

  it('#getMinDateByPermission should return null when have permission VoidAllArchivedTicket', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    const actual = instance['getMinDateByPermission'](true);

    expect(actual).toBeNull();
  });

  it('#getMinDateByPermission should return one date when have not permission VoidAllArchivedTicket', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          abnormalAccountModel: Helper.fakeAbnormalAccountModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    const actual = instance['getMinDateByPermission'](false);

    expect(actual).not.toBeNull();
  });
});
