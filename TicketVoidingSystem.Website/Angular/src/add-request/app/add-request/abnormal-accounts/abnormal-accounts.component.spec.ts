import { ElementRef, NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { UsernamesComponent } from '../../../../utility/components/user-names/user-names.component';
import { BlockUiModule } from '../../../../utility/modules/block-ui/block-ui.module';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { AbnormalAccountModel } from '../models/abnormal-account.model';
import { AbnormalAccountOtherComponent } from './abnormal-accounts-other/abnormal-accounts-other.component';
import { AbnormalAccountsComponent } from './abnormal-accounts.component';
import { ConfirmAbnormalAccountComponent } from './confirm-abnormal-account/confirm-abnormal-account.component';
import { EventDateFilterComponent } from './event-date-filter/event-date-filter.component';
import { PrimitiveProperty } from './models/primitive-property.model';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

class Helper{
  static readonly fakeDate: string = '2020-11-09 12:08:49.737';
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: Helper.fakeDate,
    issueTypeId: '11',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  };
  static readonly fakeAbnormalAccountModel: AbnormalAccountModel = {
    usernames: '',
    productIds: '',
    statusIds: '',
    fromDate: null,
    toDate: null
  };
}

describe('AbnormalAccountsComponent', () => {
  @NgModule({
    declarations: [
      UsernamesComponent,
      ProductFilterComponent,
      EventDateFilterComponent,
      AbnormalAccountOtherComponent,
      ConfirmAbnormalAccountComponent
    ],
    imports: [
      BlockUiModule,
      NgbModule
    ],
    providers: [
      CommonService,
      AddRequestStore,
      ValidationService,
      SaveRequestService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AbnormalAccountsComponent>;
  let validationService: ValidationService;

  beforeEach(() => {
    validationService = new ValidationService(null);
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
    const {  instance } = await shallow
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
    const {  instance } = await shallow
    .mock(ValidationService, { checkValidUsernames: mockCheckValidUsernames })
    .render({
      bind: {
        abnormalAccountModel: Helper.fakeAbnormalAccountModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.primitiveProps.isCancelValidate = false;

    await instance.focusOutUsernames();

    expect(mockCheckValidUsernames).toHaveBeenCalledTimes(1);
  });
  
  it('#triggerCloseEvent should called #changeSavingRequestStatus', async () => {
    const mockChangeSavingRequestStatus = jest.fn().mockImplementation();
    const {  instance } = await shallow
    .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
    .render({
      bind: {
        abnormalAccountModel: Helper.fakeAbnormalAccountModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.triggerCloseEvent();

    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });
  
  it('#triggerCloseEvent should called #changeSavingRequestStatus', async () => {
    const mockChangeSavingRequestStatus = jest.fn().mockImplementation();
    const {  instance } = await shallow
    .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
    .render({
      bind: {
        abnormalAccountModel: Helper.fakeAbnormalAccountModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.triggerCloseEvent();

    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });
  
  it('#saveRequest should called #saveRequestService.saveRequest', async () => {
    const mockSaveRequest = jest.fn().mockImplementation();
    const {  instance } = await shallow
    .mock(SaveRequestService, { saveRequest: mockSaveRequest })
    .render({
      bind: {
        abnormalAccountModel: Helper.fakeAbnormalAccountModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });
  
  it('#onYesConfirmWarningModal should called #saveRequestService.onYesConfirmWarningModal', async () => {
    const mockOnYesConfirmWarningModal = jest.fn().mockImplementation();
    const {  instance } = await shallow
    .mock(SaveRequestService, { onYesConfirmWarningModal: mockOnYesConfirmWarningModal })
    .render({
      bind: {
        abnormalAccountModel: Helper.fakeAbnormalAccountModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    await instance.onYesConfirmWarningModal();

    expect(mockOnYesConfirmWarningModal).toHaveBeenCalledTimes(1);
  });
  
  it('#initSaveRequestInput should return expected model', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        abnormalAccountModel: Helper.fakeAbnormalAccountModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    const actual = instance['initSaveRequestInput']();

    expect(actual.requestId).toBe(instance.requestId);
    expect(actual.isEdit).toBe(instance.isEdit);
    expect(actual.userId).toBe(instance.userId);
  });
});
