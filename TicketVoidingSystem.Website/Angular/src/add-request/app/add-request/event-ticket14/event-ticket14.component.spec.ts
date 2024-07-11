import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { EventTicket14Model } from '../models/event-ticket-14.model';
import { EventTicket14Component } from './event-ticket14.component';
import { PrimitiveProperty } from './models/primitive-property.model';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

class Helper {  
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
  static readonly fakeEventTicket14Model: EventTicket14Model = {
    transIds: '12345'
  };
}

describe('EventTicket14Component', () => {
  @NgModule({
    declarations: [
      BetIdsComponent
    ],
    imports: [
      BlockUiModule,
      FormsModule
    ],
    providers: [
      ValidationService,
      SaveRequestService,
      AddRequestStore,
      AddRequestApiService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventTicket14Component>;

  beforeEach(() => {
    shallow = new Shallow(EventTicket14Component, AppModuleTest);
  });

  it('#EventTicket14Component init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        eventTicket14Model: Helper.fakeEventTicket14Model,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('#afterFocusOutBetIds should call #checkBusinessRule', async () => {
    const mockCheckBusinessRule = jest.fn();
    const { instance } = await shallow
    .mock(ValidationService, { checkBusinessRule: mockCheckBusinessRule })
    .mock(AddRequestApiService, { getPermissionAddRequest: jest.fn() })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        eventTicket14Model: Helper.fakeEventTicket14Model,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.isCancelAfterFocusOutBetIdsEvent = false;

    await instance.afterFocusOutBetIds();

    expect(mockCheckBusinessRule).toHaveBeenCalledTimes(1);
  });
  
  it('#afterFocusOutBetIds should not call #checkBusinessRule', async () => {
    const mockCheckBusinessRule = jest.fn();
    const { instance } = await shallow
    .mock(ValidationService, { checkBusinessRule: mockCheckBusinessRule })
    .mock(AddRequestApiService, { getPermissionAddRequest: jest.fn() })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        eventTicket14Model: Helper.fakeEventTicket14Model,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.isCancelAfterFocusOutBetIdsEvent = true;

    await instance.afterFocusOutBetIds();

    expect(mockCheckBusinessRule).toHaveBeenCalledTimes(0);
  });
  
  it('#saveRequest should call #executeApiSaveRequest', async () => {
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, {
      changeBlockingUiStatus: mockChangeBlockingUiStatus,
    })
    .render({
      bind: {
        eventTicket14Model: Helper.fakeEventTicket14Model,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.filter.isVoided = true;
    instance['executeApiSaveRequest'] = jest.fn();

    await instance.saveRequest();

    expect(instance['executeApiSaveRequest']).toHaveBeenCalledTimes(1);
    expect(mockChangeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });
  
  it('#saveRequest should call #saveWhenRequestNotVoided', async () => {
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, {
      changeBlockingUiStatus: mockChangeBlockingUiStatus,
    })
    .render({
      bind: {
        eventTicket14Model: Helper.fakeEventTicket14Model,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.filter.isVoided = false;
    instance['saveWhenRequestNotVoided'] = jest.fn();

    await instance.saveRequest();

    expect(instance['saveWhenRequestNotVoided']).toHaveBeenCalledTimes(1);
    expect(mockChangeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });
  
  it('#saveWhenRequestNotVoided should call #executeApiSaveRequest', async () => {
    const mockChangeBlockingUiStatus = jest.fn();
    const mockCheckBusinessRule = jest.fn().mockImplementation(() => Promise.resolve({isValid: true}));
    const { instance } = await shallow
    .mock(ValidationService, {
      checkBusinessRule: mockCheckBusinessRule,
    })
    .mock(AddRequestStore, {
      changeBlockingUiStatus: mockChangeBlockingUiStatus,
      changeSavingRequestStatus: jest.fn()
    })
    .render({
      bind: {
        eventTicket14Model: Helper.fakeEventTicket14Model,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.triggerFocusOutBetIds = jest.fn();
    instance['executeApiSaveRequest'] = jest.fn();

    await instance['saveWhenRequestNotVoided']();

    expect(instance['executeApiSaveRequest']).toHaveBeenCalledTimes(1);
  });
  
  it('#saveWhenRequestNotVoided should not call #executeApiSaveRequest', async () => {
    const mockChangeSavingRequestStatus = jest.fn();
    const mockCheckBusinessRule = jest.fn().mockImplementation(() => Promise.resolve(false));
    const { instance } = await shallow
    .mock(ValidationService, {
      checkBusinessRule: mockCheckBusinessRule,
    })
    .mock(AddRequestStore, {
      changeSavingRequestStatus: mockChangeSavingRequestStatus,
    })
    .render({
      bind: {
        eventTicket14Model: Helper.fakeEventTicket14Model,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.triggerFocusOutBetIds = jest.fn();
    instance['executeApiSaveRequest'] = jest.fn();

    await instance['saveWhenRequestNotVoided']();

    expect(instance['executeApiSaveRequest']).toHaveBeenCalledTimes(0);
    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });
  
  it('#executeApiSaveRequest should call #checkBusinessRule', async () => {
    const mockExecuteSave = jest.fn();
    const { instance } = await shallow
    .mock(SaveRequestService, {
      executeSave: mockExecuteSave,
    })
    .render({
      bind: {
        eventTicket14Model: Helper.fakeEventTicket14Model,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    const testCase = [true, false];
    testCase.forEach(async x => {
      instance.filter.isAbnormal = x;
      instance.betIdsComponent = new BetIdsComponent(null);
      instance.betIdsComponent.getAllBetIds = jest.fn();
  
      await instance['executeApiSaveRequest']();
  
      expect(mockExecuteSave).toHaveBeenCalled();
    });
  });
});
