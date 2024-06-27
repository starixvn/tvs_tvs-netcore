import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { PermissionManage } from '../../../../manage-request/app/models/permission-manage.model';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { RecoverTicketModel } from '../models/recover-ticket.model';
import { PopupService } from '../services/popup.service';
import { ProductFilterRecoverTicket } from './constants/product.constant';
import { EventRecoverTicketComponent } from './event-recover-ticket.component';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

class Helper {
  static readonly fakeTransId = '123456789';
  static readonly fakeMatchId = 90000000;

  static readonly fakeRecoverTicketModel: RecoverTicketModel = {
    transIds: Helper.fakeTransId,
    filterBy: null,
    subIssueTypeId: 1,
    productIds: '1'
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '2020-11-09 12:08:49.737',
    issueTypeId: '11',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  };
  static readonly fakePermissionManage: PermissionManage = {
    manageRequestHost: true,
    verifyRead: true,
    verifyHost: true,
    voidRead: true,
    isReadMarkTickets: true,
  };
}

describe('EventRecoverTicketComponent', () => {
  @NgModule({
    declarations: [
      BetIdsComponent
    ],
    imports: [
      BlockUiModule,
      FormsModule,
      ToolTipModule,
      NgSelectModule
    ],
    providers: [
      ValidationService,
      SaveRequestService,
      AddRequestStore,
      PopupService,
      CommonService,
      AddRequestApiService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventRecoverTicketComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventRecoverTicketComponent, AppModuleTest);
  });

  it('#EventRecoverTicketComponent init should match snapshot', async () => {
    const { fixture, instance } = await shallow
      .mock(AddRequestApiService, { getPermissionAddRequest: jest.fn() })
      .render({
        bind: {
          recoverTicketModel: Helper.fakeRecoverTicketModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.ngOnInit = jest.fn();

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should update productIds to default', async () => {
    const { instance } = await shallow
      .mock(AddRequestApiService, { getPermissionAddRequest: jest.fn() })
      .render({
        bind: {
          recoverTicketModel: Helper.fakeRecoverTicketModel,
          filter: Helper.fakeFilterModel,
        }
      });
    instance.ngOnInit();
    expect(instance.recoverTicketModel.productIds).toBe(ProductFilterRecoverTicket.SELECTION_ITEMS[0].value);
  });

  it('#afterFocusOutBetIds should call #checkBusinessRule', async () => {
    const mockCheckBusinessRule = jest.fn();
    const { instance } = await shallow
      .mock(ValidationService, { checkBusinessRule: mockCheckBusinessRule })
      .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
      .render({
        bind: {
          recoverTicketModel: Helper.fakeRecoverTicketModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.isCancelAfterFocusOutBetIdsEvent = false;
    await instance.afterFocusOutBetIds();

    expect(mockCheckBusinessRule).toHaveBeenCalledTimes(1);
  });

  it('#afterFocusOutBetIds should not call #checkBusinessRule', async () => {
    const mockCheckBusinessRule = jest.fn();
    const { instance } = await shallow
      .mock(ValidationService, { checkBusinessRule: mockCheckBusinessRule })
      .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
      .render({
        bind: {
          recoverTicketModel: Helper.fakeRecoverTicketModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.isCancelAfterFocusOutBetIdsEvent = true;
    await instance.afterFocusOutBetIds();

    expect(mockCheckBusinessRule).toHaveBeenCalledTimes(0);
  });

  it('#saveRequest should not call #saveRequestService.saveRequest', async () => {
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
      .mock(SaveRequestService, { saveRequest: mockSaveRequest })
      .render({
        bind: {
          recoverTicketModel: Helper.fakeRecoverTicketModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.triggerFocusOutBetIds = jest.fn();
    instance.betIdsComponent.getAllBetIds = jest.fn();
    instance.isCancelAfterFocusOutBetIdsEvent = true;
    instance['checkBusinessRule'] = jest.fn();
    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });
});
