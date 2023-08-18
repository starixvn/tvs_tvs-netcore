import { NgModule } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BlockFullUiModule } from '../../../utility/components/block-full-ui/block-full-ui.module';
import { BlockUiModule } from '../../../utility/components/block-ui/block-ui.module';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../utility/constants/labels';
import { IssueType, SubIssueType } from '../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { Result } from '../../../utility/models/result';
import { HttpService } from '../../../utility/services/http.service';
import { AbnormalAccountOtherComponent } from './abnormal-accounts/abnormal-accounts-other/abnormal-accounts-other.component';
import { AbnormalAccountsComponent } from './abnormal-accounts/abnormal-accounts.component';
import { AddRequestApiService } from './add-request-api.service';
import { AddRequestComponent } from './add-request.component';
import { AddRequestService, EarlyKickOffService } from './add-request.service';
import { AddRequestStore } from './add-request.store';
import { ConfirmAbnormalBetComponent } from './event-abnormal-bet/confirm-abnormal-bet/confirm-abnormal-bet.component';
import { EventAbnormalBetComponent } from './event-abnormal-bet/event-abnormal-bet.component';
import { EventDangerAcceptedComponent } from './event-danger-accepted/event-danger-accepted.component';
import { EventEarlyKickOffComponent } from './event-early-kick-off/event-early-kick-off.component';
import { EventRedCardComponent } from './event-red-card/event-red-card.component';
import { EventTicket14Component } from './event-ticket14/event-ticket14.component';
import { EventWrongScoreComponent } from './event-wrong-score/event-wrong-score.component';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './filter/filter.model';
import { IssueTypes } from './filter/issue-types.model';
import { AddRequestQuery } from './models/add-request.query';
import { ChildMatchModel } from './models/related-event.model';
import { AddRequestResultModel, RequestModel } from './models/request.model';
import { OthersComponent } from './others/others.component';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { AbnormalFilterBy } from '../../../utility/constants/config';

class Helper {
  static readonly url = 'http://localhost:60196/';
  static readonly saveButtonSelector = 'button.btn-primary';
  static readonly backButtonSelector = 'button.btn-danger';
  static readonly saveAndVoidButtonSelector = 'button.btn-success';
  static readonly eventSelector = 'event';
  static readonly filterSelector = 'filter';
  static readonly othersSelector = 'others';
  static readonly expectedMessage = '<div class="mg-bottom-5">Please double check below type if correct before proceeding</div>'
    + '<div class="ml-2"><div>Issue Type: Danger Accepted</div><div>Sub Type: Goal</div></div><hr style="margin: 16px -1rem;"/>'
    + 'There are some warnings in this request. Are you sure you want to process?';
  static readonly messageError: string = '<div class="mg-bottom-5">Related match(s) excluded when creating new request because having no valid tickets in the current range:</div>';
  static readonly messageWarning: string = '<div class="mg-bottom-5">There are some warnings in this request.</div>';
  static readonly fakeChildMatches: ChildMatchModel[] = [
    {
      matchId: 12345,
      matchCode: '111',
      matchEvent: 'Test A vs Test B',
      isChecked: true,
      matchType: 0,
      leagueName: '',
      name: ''
    }
  ];
  static readonly fakeAddRequestResultModel: Result<AddRequestResultModel>[] = [
    {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true,
      data: {
        matchId: '12345',
        requestId: 111
      }
    }
  ];
  static readonly fakeAddRequestResultModelFail: Result<AddRequestResultModel>[] = [
    {
      errorCode: 1,
      errorMsg: 'error',
      isSuccessful: false,
      data: null
    }
  ];
  static readonly fakeAddRequestResultModelFailHaveData: Result<AddRequestResultModel>[] = [
    {
      errorCode: 1,
      errorMsg: 'error',
      isSuccessful: false,
      data: {
        matchId: '12345',
        requestId: 111
      }
    }
  ];
  static readonly fakeAddRequestResultModelForAlert: Result<AddRequestResultModel>[] = [
    {
      errorCode: 1,
      errorMsg: 'error',
      isSuccessful: false,
      data: {
        matchId: '12345',
        requestId: 111
      }
    },
    {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true,
      data: {
        matchId: '54321',
        requestId: 222
      }
    }
  ];
  static readonly fakeLogInfoDetailList: LogInfoDetail[] = [
    {
      matchId: 12345,
      liveScores: '0 - 0',
      voidFromTime: new Date('2020-11-06 00:00:00.000'),
      voidToTime: new Date('2020-11-06 00:00:00.000'),
      singleCount: 1,
      cancelCashOutCount: 1,
      mainParlayCount: 1,
      cashOutCount: 3,
      settleCount: 1,
      scoreOfMatch: '',
      scoreNormalTicket: '',
      instantlySettleCount: 2
    }
  ];
  static readonly fakeAbnormalFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '11',
    subIssueTypeId: '',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  };
  static getFakeRequestViewModel(): Result<string> {
    return {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true,
      data: '12345'
    } as Result<string>;
  }

  static fakeIssueType: IssueType[] = [{
    issueTypeId: 1,
    issueTypeName: "Danger Accepted",
  }];

  static fakeSubIssueType: SubIssueType[] = [{
    subIssueTypeId: 1,
    subIssueTypeName: "Goal",
    issueTypeId: 11,
    subIssueTypeNameCS: "Hi"
  }];

  static fakeIssueTypes: IssueTypes = {
    issueTypes: Helper.fakeIssueType,
    subIssueTypes: Helper.fakeSubIssueType,
    issueId: 1,
    selectedSubIssueTypes: Helper.fakeSubIssueType,
    subIssueId: 1,
  };

  static initHtml(): void {
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    element.setAttribute('user-name', 'sa');
    document.body.appendChild(element);
  }
}

describe('AddRequestComponent', () => {
  @NgModule({
    declarations: [
      AddRequestComponent,
      EventEarlyKickOffComponent,
      EventAbnormalBetComponent,
      EventDangerAcceptedComponent,
      EventWrongScoreComponent,
      AbnormalAccountsComponent,
      AbnormalAccountOtherComponent,
      ConfirmAbnormalBetComponent,
      FilterComponent,
      OthersComponent,
      EventRedCardComponent,
    ],
    imports: [
      ToolTipModule,
      BlockUiModule,
      BlockFullUiModule
    ],
    providers: [
      HttpService,
      ModalService,
      AddRequestService
    ]
  })
  class AppModuleTest { }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('#ngOnInit should be call #getChangeActionWaitingToManualEditPageSubject.subscribe when edit request', async () => {
    const addRequestStore = new AddRequestStore();
    addRequestStore.savingRequestStatus.subscribe = jest.fn();
    addRequestStore.blockingUiStatus.subscribe = jest.fn();
    addRequestStore.getAbnormalFilterBySubject.subscribe = jest.fn();
    const component = new AddRequestComponent(null, null, null, addRequestStore);
    component.isEdit = true;

    component.ngOnInit();

    expect(component.isEdit).toBeTruthy();
  });

  it('#ngOnDestroy should be call unsubscribe', async () => {
    const addRequestStore = new AddRequestStore();
    const component = new AddRequestComponent(null, null, null, addRequestStore);
    component.savingRequestSubscription = addRequestStore.savingRequestStatus.subscribe(status => {
      component.isDisabledSaveButton = status;
    });
    component.checkValidSubIssueTypeInFilterSubscription = addRequestStore.getCheckValidSubIssueTypeInFilterSubject.subscribe(() => {
      component.filterComponent.checkValidSubIssueType();
    });
    component.blockingUiSubscription = addRequestStore.blockingUiStatus.subscribe(status => {
      component.isBlock = status;
    });
    component.abnormalFilterBySubscription = addRequestStore.getAbnormalFilterBySubject.subscribe(type => {
      component.abnormalFilterBy = type;
    });
    component.savingRequestSubscription.unsubscribe = jest.fn();
    component.checkValidSubIssueTypeInFilterSubscription.unsubscribe = jest.fn();
    component.blockingUiSubscription.unsubscribe = jest.fn();
    component.abnormalFilterBySubscription.unsubscribe = jest.fn();

    component.ngOnDestroy();

    expect(component.savingRequestSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.checkValidSubIssueTypeInFilterSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.blockingUiSubscription.unsubscribe).toHaveBeenCalled();
    expect(component.abnormalFilterBySubscription.unsubscribe).toHaveBeenCalled();
  });

  it('#saveRequestEarlyOrWrongKO should handle when validation EKO component false', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '8';
    const addRequestStore = new AddRequestStore();
    addRequestStore.savingRequestStatus.subscribe = jest.fn();
    addRequestStore.blockingUiStatus.subscribe = jest.fn();
    const mockEventEarlyKickOffComponent = new EventEarlyKickOffComponent(null, null, null);
    mockEventEarlyKickOffComponent.isValid = jest.fn().mockImplementation(() => false);

    const component = new AddRequestComponent(null, null, null, null);
    component.eventEarlyKickOffComponent = mockEventEarlyKickOffComponent;
    await component.saveRequestEarlyOrWrongKO(false);

    expect(mockEventEarlyKickOffComponent.isValid).toHaveBeenCalledTimes(1);
  });

  it('#saveRequestEarlyOrWrongKO should execute save request when validation is true and not have warning', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '8';
    const mockEventEarlyKickOffComponent = new EventEarlyKickOffComponent(null, null, null);
    mockEventEarlyKickOffComponent.isValid = jest.fn().mockImplementation(() => true);
    mockEventEarlyKickOffComponent.warningMessageList = [];
    const mockExecuteSaveRequestEarlyKO = jest.fn();
    const component = new AddRequestComponent(null, null, null, null);
    component.eventEarlyKickOffComponent = mockEventEarlyKickOffComponent;
    component.executeSaveRequestEarlyKO = mockExecuteSaveRequestEarlyKO;
    component['isEditingByAnotherUser'] = jest.fn().mockImplementation(() => false);

    await component.saveRequestEarlyOrWrongKO(false);

    expect(mockEventEarlyKickOffComponent.isValid).toHaveBeenCalledTimes(1);
    expect(mockExecuteSaveRequestEarlyKO).toHaveBeenCalledTimes(1);
    expect(mockExecuteSaveRequestEarlyKO).toHaveBeenCalledWith(false, undefined);
  });

  it('#executeSaveRequestEarlyKO should call edit function', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '8';
    const fakeAddRequestQuery = new AddRequestQuery();
    fakeAddRequestQuery.matchId = 998;
    const spyInitAddRequestQuery = jest.spyOn(EarlyKickOffService, 'initAddRequestQuery')
      .mockImplementation(x => fakeAddRequestQuery);
    const mockEditSingleRequest = jest.fn();
    const component = new AddRequestComponent(null, null, null, null);
    component.editSingleRequest = mockEditSingleRequest;
    component.isEdit = true;

    await component.executeSaveRequestEarlyKO(false, null);

    expect(spyInitAddRequestQuery).toHaveBeenCalledTimes(1);
    expect(spyInitAddRequestQuery).toHaveBeenLastCalledWith(component.model, null);
    expect(mockEditSingleRequest).toHaveBeenCalledTimes(1);
    expect(mockEditSingleRequest).toHaveBeenCalledWith(fakeAddRequestQuery, false);
  });

  it('#executeSaveRequestEarlyKO should call add function', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '8';
    const fakeAddRequestQuery = new AddRequestQuery();
    fakeAddRequestQuery.matchId = 998;
    const spyInitAddRequestQuery = jest.spyOn(EarlyKickOffService, 'initAddRequestQuery')
      .mockImplementation(() => fakeAddRequestQuery);
    const mockAddSingleRequest = jest.fn();
    const component = new AddRequestComponent(null, null, null, null);
    component.addSingleRequest = mockAddSingleRequest;
    component.isEdit = false;

    await component.executeSaveRequestEarlyKO(false, null);

    expect(spyInitAddRequestQuery).toHaveBeenCalledTimes(1);
    expect(spyInitAddRequestQuery).toHaveBeenLastCalledWith(component.model, null);
    expect(mockAddSingleRequest).toHaveBeenCalledTimes(1);
    expect(mockAddSingleRequest).toHaveBeenCalledWith(fakeAddRequestQuery, false);
  });

  it('#saveRequest should save request of EKO or Wrong KO', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '8';
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    component.isEdit = true;
    component.saveRequestEarlyOrWrongKO = jest.fn();

    await component.saveRequest(false);

    expect(component.isDisabledSaveButton).toBe(true);
    expect(component.saveRequestEarlyOrWrongKO).toHaveBeenCalledTimes(1);
  });

  it('#addSingleRequest should call #openModelErrorMessageRequest when add request return error', async () => {
    const mockAddRequestService = new AddRequestApiService(null);
    mockAddRequestService.addRequest = jest.fn().mockImplementation(() => Helper.fakeAddRequestResultModelFail[0]);
    const component = new AddRequestComponent(mockAddRequestService, null, null, null);
    component.openModelErrorMessageRequest = jest.fn();

    await component.addSingleRequest(new AddRequestQuery(), true);

    expect(component.isBlock).toBe(true);
    expect(component.openModelErrorMessageRequest).toHaveBeenCalledTimes(1);
    expect(component.openModelErrorMessageRequest).toHaveBeenCalledWith(Helper.fakeAddRequestResultModelFail[0],
        LABELS.ADD_REQUEST_RESULT_TITLE);
  });

  it('#addSingleRequest should go to void page after add request successfully', async () => {
    const mockAddRequestService = new AddRequestApiService(null);
    mockAddRequestService.addRequest = jest.fn().mockImplementation(() => Helper.fakeAddRequestResultModel[0]);
    const component = new AddRequestComponent(mockAddRequestService, null, null, null);
    component.goToVoidPage = jest.fn();

    await component.addSingleRequest(new AddRequestQuery(), true);

    expect(component.isBlock).toBe(true);
    expect(component.goToVoidPage).toHaveBeenCalledTimes(1);
    expect(component.goToVoidPage).toHaveBeenCalledWith(111);
  });

  it('#addSingleRequest should display pop-up after add request successfully', async () => {
    const mockModalServiceOpen = jest.fn();
    const openModal = {
      title: LABELS.ADD_REQUEST_RESULT_TITLE,
      message: `<div>Request No.<strong>111</strong> added successfully!</div>`,
      type: ModalType.Alert
    };
    const mockAddRequestService = new AddRequestApiService(null);
    mockAddRequestService.addRequest = jest.fn().mockImplementation(() => Helper.fakeAddRequestResultModel[0]);
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = mockModalServiceOpen;
    const component = new AddRequestComponent(mockAddRequestService, modalService, null, null);

    await component.addSingleRequest(new AddRequestQuery(), false);
    expect(component.isBlock).toBe(false);
    expect(mockModalServiceOpen.mock.calls[0][0]).toStrictEqual(openModal);

    component.reloadPageOrBackToManagePage = jest.fn();
    mockModalServiceOpen.mock.calls[0][1]();
    expect(component.reloadPageOrBackToManagePage).toHaveBeenCalledTimes(1);
  });

  it('#editSingleRequest should call #openModelErrorMessageRequest when edit request return error', async () => {
    const mockAddRequestService = new AddRequestApiService(null);
    mockAddRequestService.editRequest = jest.fn().mockImplementation(() => Helper.fakeAddRequestResultModelFail[0]);
    const component = new AddRequestComponent(mockAddRequestService, null, null, null);
    component.openModelErrorMessageRequest = jest.fn();

    await component.editSingleRequest(new AddRequestQuery(), true);

    expect(component.isBlock).toBe(true);
    expect(component.openModelErrorMessageRequest).toHaveBeenCalledTimes(1);
    expect(component.openModelErrorMessageRequest).toHaveBeenCalledWith(Helper.fakeAddRequestResultModelFail[0],
        LABELS.EDIT_REQUEST_RESULT_TITLE);
  });

  it('#editSingleRequest should go to void page after edit request successfully', async () => {
    const mockAddRequestService = new AddRequestApiService(null);
    mockAddRequestService.editRequest = jest.fn().mockImplementation(() => Helper.fakeAddRequestResultModel[0]);
    const component = new AddRequestComponent(mockAddRequestService, null, null, null);
    component.requestId = 111;
    component.goToVoidPage = jest.fn();

    await component.editSingleRequest(new AddRequestQuery(), true);

    expect(component.isBlock).toBe(true);
    expect(component.goToVoidPage).toHaveBeenCalledTimes(1);
    expect(component.goToVoidPage).toHaveBeenCalledWith(111);
  });

  it('#editSingleRequest should display pop-up after edit request successfully', async () => {
    const mockModalServiceOpen = jest.fn();
    const openModal = {
      title: LABELS.EDIT_REQUEST_RESULT_TITLE,
      message: `Request No.<strong>111</strong> edited successfully!`,
      type: ModalType.Alert
    };
    const mockAddRequestService = new AddRequestApiService(null);
    mockAddRequestService.editRequest = jest.fn().mockImplementation(() => Helper.fakeAddRequestResultModel[0]);
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = mockModalServiceOpen;
    const component = new AddRequestComponent(mockAddRequestService, modalService, null, null);

    component.requestId = 111;

    await component.editSingleRequest(new AddRequestQuery(), false);
    expect(component.isBlock).toBe(false);
    expect(mockModalServiceOpen.mock.calls[0][0]).toStrictEqual(openModal);

    component.reloadPageOrBackToManagePage = jest.fn();
    mockModalServiceOpen.mock.calls[0][1]();
    expect(component.reloadPageOrBackToManagePage).toHaveBeenCalledTimes(1);
  });

  it('#editSingleRequestHaveConfirm should handle with three button', async () => {
    const mockConfirmWithThreeButton = jest.fn();
    const confirmWithThreeButtonModal = {
      title: 'Confirm',
      message: LABELS.CONFIRM_TVS_UNMARK_TICKET_AND_AUTO_CAL,
      type: ModalType.ConfirmThreeButton
    };
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.confirmWithThreeButton = mockConfirmWithThreeButton;
    const component = new AddRequestComponent(null, modalService, null, null);

    await component.editSingleRequestHaveConfirm(new AddRequestQuery(), true, true);
    expect(mockConfirmWithThreeButton.mock.calls[0][0]).toStrictEqual(confirmWithThreeButtonModal);

    component.editSingleRequest = jest.fn();
    const fakeAddRequestQuery = new AddRequestQuery();
    fakeAddRequestQuery.isConfirmCalculator = true;
    mockConfirmWithThreeButton.mock.calls[0][1]();
    expect(component.editSingleRequest).toHaveBeenCalledWith(fakeAddRequestQuery, false);

    fakeAddRequestQuery.isConfirmCalculator = false;
    mockConfirmWithThreeButton.mock.calls[0][2]();
    expect(component.editSingleRequest).toHaveBeenCalledWith(fakeAddRequestQuery, false);

    mockConfirmWithThreeButton.mock.calls[0][3]();
    expect(component.isDisabledSaveButton).toBe(false);
  });

  it('#editSingleRequestHaveConfirm should handle with normal confirm', async () => {
    const mockConfirm = jest.fn();
    const confirmWithModal = {
      title: 'Confirm',
      message: LABELS.CONFIRM_TVS_UNMARK_TICKET,
      type: ModalType.Confirm
    };
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.confirm = mockConfirm;
    const component = new AddRequestComponent(null, modalService, null, null);

    await component.editSingleRequestHaveConfirm(new AddRequestQuery(), true, false);
    expect(mockConfirm.mock.calls[0][0]).toStrictEqual(confirmWithModal);

    component.editSingleRequest = jest.fn();
    const fakeAddRequestQuery = new AddRequestQuery();
    fakeAddRequestQuery.isConfirmCalculator = false;
    mockConfirm.mock.calls[0][1]();
    expect(component.editSingleRequest).toHaveBeenCalledWith(fakeAddRequestQuery, false);

    mockConfirm.mock.calls[0][2]();
    expect(component.isDisabledSaveButton).toBe(false);
  });

  it('#openModelErrorMessageRequest should handle correctly', async () => {
    const mockOpen = jest.fn();
    const openModal = {
      title: 'Test',
      message: 'Error: error',
      type: ModalType.Error
    };
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.open = mockOpen;
    const component = new AddRequestComponent(null, modalService, null, null);

    component.openModelErrorMessageRequest(Helper.fakeAddRequestResultModelFail[0], 'Test');
    expect(mockOpen.mock.calls[0][0]).toStrictEqual(openModal);

    mockOpen.mock.calls[0][1]();
    expect(component.isDisabledSaveButton).toBe(false);
  });

  it('#updateModel should assign default data for decidedBy when is abnormal', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '1';
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    Helper.initHtml();

    component.updateModel(Helper.fakeAbnormalFilterModel);

    expect(component.model.others.decidedBy).toBe('sa');
    expect(component.model.filter).toStrictEqual(Helper.fakeAbnormalFilterModel);
  });

  it('#updateModel should not assign default data for decidedBy when is not abnormal', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '13';
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;

    component.updateModel(Helper.fakeFilterModel);

    expect(component.model.others.decidedBy).toBe(undefined);
    expect(component.model.filter).toStrictEqual(Helper.fakeFilterModel);
  });

  it('#reloadPageOrBackToManagePage should assign', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '13';
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.assign = jest.fn();

    component.reloadPageOrBackToManagePage();

    expect(window.location.assign).toHaveBeenCalledTimes(1);
  });

  it('#reloadPageOrBackToManagePage should reload', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '11';
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.reload = jest.fn();

    component.reloadPageOrBackToManagePage();

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('#goToVoidPage should assign to page', async () => {
    const fakeRequestModel = new RequestModel();
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.assign = jest.fn();

    component.goToVoidPage(1);

    expect(window.location.assign).toHaveBeenCalledWith('TicketVoidingSystem/VoidRequest/Index/1');
  });

  it('#backToManagePage should assign to page', async () => {
    const fakeRequestModel = new RequestModel();
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.assign = jest.fn();

    component.backToManagePage();

    expect(window.location.assign).toHaveBeenCalledWith('TicketVoidingSystem/ManageRequest/Index');
  });

  it('#saveRequestEarlyOrWrongKO should execute save request when request voided', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '8';
    const mockEventEarlyKickOffComponent = new EventEarlyKickOffComponent(null, null, null);
    mockEventEarlyKickOffComponent.warningMessageList = [];
    const mockExecuteSaveRequestEarlyKO = jest.fn();
    const component = new AddRequestComponent(null, null, null, null);
    component.eventEarlyKickOffComponent = mockEventEarlyKickOffComponent;
    component.executeSaveRequestEarlyKO = mockExecuteSaveRequestEarlyKO;
    component.model.filter.isVoided = true;

    await component.saveRequestEarlyOrWrongKO(false);

    expect(mockExecuteSaveRequestEarlyKO).toHaveBeenCalledTimes(1);
  });

  it('#saveRequestEarlyOrWrongKO should execute save request when validation is true and have warning', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '8';
    const mockEventEarlyKickOffComponent = new EventEarlyKickOffComponent(null, null, null);
    mockEventEarlyKickOffComponent.isValid = jest.fn().mockImplementation(() => true);
    mockEventEarlyKickOffComponent.warningMessageList = ['abc'];
    const mockModalConfirm = jest.fn();
    const mockExecuteSaveRequestEarlyKO = jest.fn();
    const modalService = new ModalService(new NgbModalConfig(null), null, null);
    modalService.confirm = mockModalConfirm;
    const component = new AddRequestComponent(null, modalService, null, null);
    component.eventEarlyKickOffComponent = mockEventEarlyKickOffComponent;
    component.model = fakeRequestModel;
    component.executeSaveRequestEarlyKO = mockExecuteSaveRequestEarlyKO;

    await component.saveRequestEarlyOrWrongKO(false);

    expect(mockEventEarlyKickOffComponent.isValid).toHaveBeenCalledTimes(1);
    expect(mockModalConfirm).toHaveBeenCalledTimes(1);
    expect(mockExecuteSaveRequestEarlyKO).toHaveBeenCalledTimes(0);
    await mockModalConfirm.mock.calls[0][1]();
    expect(mockExecuteSaveRequestEarlyKO).toHaveBeenCalledTimes(1);
    mockModalConfirm.mock.calls[0][2]();
  });

  it('#eventAbnormalBetComponent.saveRequest should execute save request when isLikelyAbnormalBetIssueType', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = IssueTypeConstant.ABNORMAL_BET;
    const mockSaveRequest = jest.fn();
    const eventAbnormalBetComponent = new EventAbnormalBetComponent(null, null, null, null, null);
    eventAbnormalBetComponent.saveRequest = mockSaveRequest;
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    component.eventAbnormalBetComponent = eventAbnormalBetComponent;

    await component.saveRequest(false);

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#eventDangerAcceptedComponent.saveRequest should execute save request when isDangerAccepted', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;
    const mockSaveRequest = jest.fn();
    const eventDangerAcceptedComponent = new EventDangerAcceptedComponent(null, null, null, null, null, null, null);
    eventDangerAcceptedComponent.saveRequest = mockSaveRequest;
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    component.eventDangerAcceptedComponent = eventDangerAcceptedComponent;

    await component.saveRequest(false);

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#eventRedCardComponent.saveRequest should execute save request when isRedCard', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = IssueTypeConstant.RED_CARD;
    const mockSaveRequest = jest.fn();
    const eventRedCardComponent = new EventRedCardComponent(null, null, null, null, null, null, null);
    eventRedCardComponent.saveRequest = mockSaveRequest;
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    component.eventRedCardComponent = eventRedCardComponent;

    await component.saveRequest(false);

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#eventWrongScoreComponent.saveRequest should execute save request when isWrongScoreIssueType', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = IssueTypeConstant.WRONG_SCORE;
    const mockSaveRequest = jest.fn();
    const eventWrongScoreComponent = new EventWrongScoreComponent(null, null, null, null, null, null, null, null);
    eventWrongScoreComponent.saveRequest = mockSaveRequest;
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    component.eventWrongScoreComponent = eventWrongScoreComponent;

    await component.saveRequest(false);

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#eventArchivedTicket.saveRequest should execute save request when isArchivedTicketIssueType', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = IssueTypeConstant.ARCHIVED_TICKET;
    const mockSaveRequest = jest.fn();
    const eventArchivedTicketComponent = new EventTicket14Component(null, null, null);
    eventArchivedTicketComponent.saveRequest = mockSaveRequest;
    const component = new AddRequestComponent(null, null, null, null);
    component.model = fakeRequestModel;
    component.eventTicket14Component = eventArchivedTicketComponent;

    await component.saveRequest(false);

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#getEventLabel should return correct "Username"', async () => {
    const component = new AddRequestComponent(null, null, null, null);
    component.isAbnormalAccount = jest.fn().mockImplementation(() => true);
    const actual = component.getEventLabel();

    expect(actual).toBe('Username');
  });

  it('#getEventLabel should return correct "Ticket Info"', async () => {
    const component = new AddRequestComponent(null, null, null, null);
    component.isAbnormalAccount = jest.fn().mockImplementation(() => false);
    component.isArchivedTicketIssueType = jest.fn().mockImplementation(() => true);
    const actual = component.getEventLabel();

    expect(actual).toBe('Ticket Info');
  });

  it('#getEventLabel should return correct "Event"', async () => {
    const component = new AddRequestComponent(null, null, null, null);
    component.isAbnormalAccount = jest.fn().mockImplementation(() => false);
    component.isArchivedTicketIssueType = jest.fn().mockImplementation(() => false);
    const actual = component.getEventLabel();

    expect(actual).toBe('Event');
  });
});
