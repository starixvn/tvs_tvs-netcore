import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { AbnormalFilterBy } from '../../../../utility/constants/config';
import { PermissionManage } from '../../../../utility/models/permission-manage.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { AbnormalBetModel } from '../models/abnormal-bet.model';
import { PopupService } from '../services/popup.service';
import { ConfirmAbnormalBetComponent } from './confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from './confirm-abnormal-bet/confirm-abnormal-bet.model';
import { EventAbnormalBetComponent } from './event-abnormal-bet.component';
import { LeagueEventAbnormalComponent } from './league-event-abnormal/league-event-abnormal.component';
import { SaveRequestService } from './services/save-request.service';
import { ValidationBusinessRuleOutput } from './services/validation.model';
import { ValidationService } from './services/validation.service';

class Helper {
  static readonly fakeTransId = '123456789';
  static readonly fakeMatchId = 90000000;

  static readonly fakeAbnormalBetModel: AbnormalBetModel = {
    matchId: Helper.fakeMatchId,
    transIds: Helper.fakeTransId,
    filterBy: null,
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
    manageRequestSettledTicketsHost: false,
    manageRequestUnsettledTicketsHost: true,
    isReadMarkTickets: true,
  };
  static readonly fakeValidationBusinessRule: ValidationBusinessRuleOutput = {
    isValid: true,
    warningModel: new ConfirmAbnormalBetModel(),
    transInfoAddRequestModel: null
  };
  static readonly fakeConfirmAbnormalBetModel: ConfirmAbnormalBetModel = {
    isOpenDialog: true,
    isHasWarningForAbnormalBet: true,
    isHasWarningEditTakeNoteRequest: false,
    transIds: '1022222',
    cn88Tickets: '2123122',
    ticketsOfVIPCustomer: '2123122',
    settledTickets:'2123122',
    ticketsOfCustomerClass201: '2123122',
    ticketsOfCustomerClass4K: '2123122',
    isHasWarningRemovedTickets: false,
    isEditingByAnotherUser: false,
    requestId: 1,
    requestedBy: '',
    listBettype : '',
    listBetteam : ''
  };
}

describe('EventAbnormalBetComponent', () => {
  @NgModule({
    declarations: [
      BetIdsComponent,
      LeagueEventAbnormalComponent,
      ConfirmAbnormalBetComponent
    ],
    imports: [
      BlockUiModule,
      FormsModule
    ],
    providers: [
      ValidationService,
      SaveRequestService,
      AddRequestStore,
      PopupService,
      CommonService,
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventAbnormalBetComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventAbnormalBetComponent, AppModuleTest);
  });

  it('#EventAbnormalBetComponent init should match snapshot', async () => {
    // Arrange
    const { fixture, instance } = await shallow
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.ngOnInit = jest.fn();

    // Action
    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should be call #getPermissionManageRequest when edit request', async () => {
    // Arrange
    const mockGetPermissionManageRequest = jest.fn();
    const mockChangeAbnormalFilterBy = jest.fn();
    const { instance } = await shallow
      .mock(CommonService, {
        getPermissionManageRequest: mockGetPermissionManageRequest,
      })
      .mock(AddRequestStore, {
        changeAbnormalFilterBy: mockChangeAbnormalFilterBy,
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });

    // Action
    await instance.ngOnInit();

    // Assert
    expect(mockGetPermissionManageRequest).toHaveBeenCalled();
  });

  it('#ngOnInit should be call #getPermissionManageRequest when add request', async () => {
    // Arrange
    const mockGetPermissionManageRequest = jest.fn();
    const mockChangeAbnormalFilterBy = jest.fn();
    const { instance } = await shallow
      .mock(CommonService, {
        getPermissionManageRequest: mockGetPermissionManageRequest,
      })
      .mock(AddRequestStore, {
        changeAbnormalFilterBy: mockChangeAbnormalFilterBy,
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: false,
        }
      });

    // Action
    await instance.ngOnInit();

    // Assert
    expect(mockGetPermissionManageRequest).toHaveBeenCalled();
  });

  it('#focusOutBetIds should call #getMatchAndCheckValidTransIds', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.isCancelAfterFocusOutBetIdsEvent = false;
    instance['checkValidBusinessRule'] = jest.fn();

    // Action
    await instance.afterFocusOutBetIds();

    // Assert
    expect(instance['checkValidBusinessRule']).toHaveBeenCalledTimes(1);
  });

  it('#focusOutBetIds should not call #getMatchAndCheckValidTransIds', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.isCancelAfterFocusOutBetIdsEvent = true;
    instance['checkValidBusinessRule'] = jest.fn();

    // Action
    await instance.afterFocusOutBetIds();

    // Assert
    expect(instance['checkValidBusinessRule']).toHaveBeenCalledTimes(0);
  });

  it('#onYesConfirmWarningModal should call #executeApiSaveRequest when is voided', async () => {
    // Arrange
    const fakeValidationBusinessRule = _.cloneDeep(Helper.fakeValidationBusinessRule);
    fakeValidationBusinessRule.isValid = true;
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, {
      changeBlockingUiStatus: mockChangeBlockingUiStatus,
    })
    .render({
      bind: {
        abnormalBetModel: Helper.fakeAbnormalBetModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance.filter.isVoided = true;
    instance['checkValidBusinessRule'] = jest.fn().mockImplementation(() => Promise.resolve(fakeValidationBusinessRule));
    instance['executeApiSaveRequest'] = jest.fn();

    // Action
    await instance.onYesConfirmWarningModal();

    // Assert
    expect(instance['executeApiSaveRequest']).toHaveBeenCalledTimes(1);
  });

  it('#onYesConfirmWarningModal should call #executeApiSaveRequest', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = true;
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, {
      changeBlockingUiStatus: mockChangeBlockingUiStatus,
    })
    .render({
      bind: {
        abnormalBetModel: Helper.fakeAbnormalBetModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance['checkValidBusinessRule'] = jest.fn().mockImplementation(() => Promise.resolve(fakeValidationBusinessRule));
    instance['executeApiSaveRequest'] = jest.fn();

    // Action
    await instance.onYesConfirmWarningModal();

    // Assert
    expect(instance['executeApiSaveRequest']).toHaveBeenCalledTimes(1);
  });

  it('#onYesConfirmWarningModal should not call #executeApiSaveRequest', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = false;
    const mockShowError = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(PopupService, {
        showError: mockShowError,
      })
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
        changeBlockingUiStatus: mockChangeBlockingUiStatus
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.filter.isVoided = false;
    instance['checkValidBusinessRule'] = jest.fn().mockImplementation(() => Promise.resolve(fakeValidationBusinessRule));
    instance['executeApiSaveRequest'] = jest.fn();

    // Action
    await instance.onYesConfirmWarningModal();

    // Assert
    expect(mockShowError).toHaveBeenCalledTimes(1);
    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(instance['executeApiSaveRequest']).toHaveBeenCalledTimes(0);
  });

  it('#saveRequest should call #checkIfRequestHasWarning', async () => {
    // Arrange
    const fakeFilterModel = Helper.fakeFilterModel;
    fakeFilterModel.isVoided = true;
    const mockChangeSavingRequestStatus = jest.fn();
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, {
      changeSavingRequestStatus: mockChangeSavingRequestStatus,
      changeBlockingUiStatus: mockChangeBlockingUiStatus
    })
    .render({
      bind: {
        abnormalBetModel: Helper.fakeAbnormalBetModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance['checkIfRequestHasWarning'] = jest.fn();

    // Action
    await instance.saveRequest();

    // Assert
    expect(instance['checkIfRequestHasWarning']).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should call #saveWhenRequestNotVoided', async () => {
    // Arrange
    const fakeFilterModel = Helper.fakeFilterModel;
    fakeFilterModel.isVoided = false;
    const mockChangeSavingRequestStatus = jest.fn();
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, {
      changeSavingRequestStatus: mockChangeSavingRequestStatus,
      changeBlockingUiStatus: mockChangeBlockingUiStatus
    })
    .render({
      bind: {
        abnormalBetModel: Helper.fakeAbnormalBetModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });
    instance['saveWhenRequestNotVoided'] = jest.fn();

    // Action
    await instance.saveRequest();

    // Assert
    expect(instance['saveWhenRequestNotVoided']).toHaveBeenCalledTimes(1);
  });

  it('#changeFilterBy should call #addRequestStore.changeAbnormalFilterBy', async () => {
    // Arrange
    const mockChangeAbnormalFilterBy = jest.fn();
    const fakeFilterModel = Helper.fakeFilterModel;
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
    .mock(AddRequestStore, {
      changeAbnormalFilterBy: mockChangeAbnormalFilterBy,
    })
    .render({
      bind: {
        abnormalBetModel: Helper.fakeAbnormalBetModel,
        filter: Helper.fakeFilterModel,
        isEdit: true,
      }
    });

    // Action
    instance.changeFilterBy(1);

    // Assert
    expect(instance.abnormalBetModel.filterBy).toBe(1);
    expect(mockChangeAbnormalFilterBy).toHaveBeenCalled();
  });

  it('#triggerCloseEvent should call #saveWhenRequestNotVoided', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance['saveWhenRequestNotVoided'] = jest.fn();

    // Action
    instance.triggerCloseEvent();

    // Assert
    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#saveWhenRequestNotVoided should call #checkIfRequestHasWarning', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = true;
    const { instance } = await shallow
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance['checkValidBusinessRule'] = jest.fn().mockImplementation(() => Promise.resolve(fakeValidationBusinessRule));
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.triggerFocusOutBetIds = jest.fn();
    instance['checkIfRequestHasWarning'] = jest.fn();

    // Action
    await instance['saveWhenRequestNotVoided']();

    // Assert
    expect(instance['checkValidBusinessRule']).toHaveBeenCalledTimes(1);
    expect(instance['checkIfRequestHasWarning']).toHaveBeenCalledTimes(1);
  });

  it('#saveWhenRequestNotVoided should call #changeSavingRequestStatus', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = false;
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance['checkValidBusinessRule'] = jest.fn().mockImplementation(() => Promise.resolve(fakeValidationBusinessRule));
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.triggerFocusOutBetIds = jest.fn();
    instance['checkIfRequestHasWarning'] = jest.fn();

    // Action
    await instance['saveWhenRequestNotVoided']();

    // Assert
    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#checkIfRequestHasWarning should call #openConfirmAbnormalBet', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = false;
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => true);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    const mockIsEditingByAnotherUser = jest.fn().mockImplementation(() => false);
    const { instance } = await shallow
      .mock(ValidationService, {
        isValidationHasWarningTicket: mockIsValidationHasWarningTicket,
        isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest,
        isEditingByAnotherUser: mockIsEditingByAnotherUser
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.getAllBetIds = jest.fn();
    instance['openConfirmAbnormalBet'] = jest.fn();

    // Action
    await instance['checkIfRequestHasWarning'](new ConfirmAbnormalBetModel());

    // Assert
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
  });

  it('#checkIfRequestHasWarning should call #openConfirmAbnormalBet', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = false;
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => true);
    const mockIsEditingByAnotherUser = jest.fn().mockImplementation(() => false);
    const { instance } = await shallow
      .mock(ValidationService, {
        isValidationHasWarningTicket: mockIsValidationHasWarningTicket,
        isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest,
        isEditingByAnotherUser: mockIsEditingByAnotherUser
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.getAllBetIds = jest.fn();
    instance['openConfirmAbnormalBet'] = jest.fn();
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);

    // Action
    await instance['checkIfRequestHasWarning'](new ConfirmAbnormalBetModel());

    // Assert
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
  });

  it('#checkIfRequestHasWarning should call #executeApiSaveRequest', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = false;
    const mockIsValidationHasWarningTicket = jest.fn().mockImplementation(() => false);
    const mockIsHasWarningEditTakeNoteRequest = jest.fn().mockImplementation(() => false);
    const mockIsEditingByAnotherUser = jest.fn().mockImplementation(() => false);

    const { instance } = await shallow
      .mock(ValidationService, {
        isValidationHasWarningTicket: mockIsValidationHasWarningTicket,
        isHasWarningEditTakeNoteRequest: mockIsHasWarningEditTakeNoteRequest,
        isEditingByAnotherUser: mockIsEditingByAnotherUser
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance['executeApiSaveRequest'] = jest.fn();

    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);

    // Action
    await instance['checkIfRequestHasWarning'](new ConfirmAbnormalBetModel());

    // Assert
    expect(instance['executeApiSaveRequest']).toHaveBeenCalledTimes(1);
    expect(mockIsValidationHasWarningTicket).toHaveBeenCalledTimes(1);
    expect(mockIsHasWarningEditTakeNoteRequest).toHaveBeenCalledTimes(1);
  });

  it('#openConfirmAbnormalBet should update data', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.confirmAbnormalBetModel = Helper.fakeConfirmAbnormalBetModel;

    // Action
    instance['openConfirmAbnormalBet'](true, true, '', Helper.fakeConfirmAbnormalBetModel);

    // Assert
    expect(instance.confirmAbnormalBetModel.isOpenDialog).toBeTruthy();
    expect(instance.confirmAbnormalBetModel.isHasWarningForAbnormalBet).toBeTruthy();
    expect(instance.confirmAbnormalBetModel.isHasWarningEditTakeNoteRequest).toBeTruthy();
  });

  it('#checkValidBusinessRule should call #checkValidBusinessRule & emit #updateMatchId', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = false;
    const mockCheckValidBusinessRule = jest.fn().mockImplementation(() => fakeValidationBusinessRule);
    const { instance } = await shallow
      .mock(ValidationService, {
        checkValidBusinessRule: mockCheckValidBusinessRule,
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.updateMatchId.emit = jest.fn();
    instance.leagueEventAbnormalComponent = new LeagueEventAbnormalComponent(null, null);

    // Action
    const result = await instance['checkValidBusinessRule'](false);

    // Assert
    expect(mockCheckValidBusinessRule).toHaveBeenCalledTimes(1);
    expect(instance.filter).toBe(Helper.fakeFilterModel);
    expect(result.isValid).toBe(fakeValidationBusinessRule.isValid);
  });

  it('#executeApiSaveRequest should call #checkValidBusinessRule & emit #updateMatchId', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    fakeValidationBusinessRule.isValid = false;
    const mockExecuteSave = jest.fn();
    const { instance } = await shallow
      .mock(SaveRequestService, {
        executeSave: mockExecuteSave,
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.getAllBetIds = jest.fn();

    // Action
    await instance['executeApiSaveRequest']();

    // Assert
    expect(mockExecuteSave).toHaveBeenCalledTimes(1);
    expect(instance.filter).toBe(Helper.fakeFilterModel);
  });

  it('#checkValidBusinessRule should emit updateMatchId', async () => {
    // Arrange
    const fakeValidationBusinessRule = Helper.fakeValidationBusinessRule;
    const mockCheckValidBusinessRule = jest.fn().mockImplementation(() => fakeValidationBusinessRule);
    const { instance } = await shallow
      .mock(ValidationService, {
        checkValidBusinessRule: mockCheckValidBusinessRule,
      })
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.removeTransId = jest.fn();
    instance.leagueEventAbnormalComponent = new LeagueEventAbnormalComponent(null, null);
    instance.updateMatchId.emit = jest.fn();
    instance.abnormalBetModel.filterBy = AbnormalFilterBy.SINGLE;

    // Action
    await instance['checkValidBusinessRule'](false);

    // Assert
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#removeInvalidTransIds should call #betIdsComponent.removeTransId', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          abnormalBetModel: Helper.fakeAbnormalBetModel,
          filter: Helper.fakeFilterModel,
          isEdit: true,
        }
      });
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.removeTransId = jest.fn();

    // Action
    instance.removeInvalidTransIds();

    // Assert
    expect(instance.betIdsComponent.removeTransId).toHaveBeenCalledTimes(1);
  });
});
