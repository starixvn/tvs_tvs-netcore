import { NgModule } from '@angular/core';
import { BlockFullUiModule } from '../../../utility/components/block-full-ui/block-full-ui.module';
import { BlockUiModule } from '../../../utility/components/block-ui/block-ui.module';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { ToolTipModule } from '../../../utility/components/tooltip/tooltip.module';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { IssueType, SubIssueType } from '../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { Result } from '../../../utility/models/result';
import { HttpService } from '../../../utility/services/http.service';
import { AbnormalAccountOtherComponent } from './abnormal-accounts/abnormal-accounts-other/abnormal-accounts-other.component';
import { AbnormalAccountsComponent } from './abnormal-accounts/abnormal-accounts.component';
import { AddRequestComponent } from './add-request.component';
import { AddRequestService } from './add-request.service';
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
import { ChildMatchModel } from './models/related-event.model';
import { AddRequestResultModel, RequestModel } from './models/request.model';
import { OthersComponent } from './others/others.component';

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
    } as LogInfoDetail
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
    const component = new AddRequestComponent(addRequestStore, null);
    component.isEdit = true;

    component.ngOnInit();

    expect(component.isEdit).toBeTruthy();
  });

  it('#ngOnDestroy should be call unsubscribe', async () => {
    const addRequestStore = new AddRequestStore();
    const component = new AddRequestComponent(addRequestStore, null);
    component.savingRequestSubscription = addRequestStore.savingRequestStatus.subscribe(status => {
      component.isDisabledSaveButton = status;
    });
    component.checkValidSubIssueTypeInFilterSubscription = addRequestStore.getCheckValidSubIssueTypeInFilterSubject.subscribe(() => {
      component.filterComponent.checkValidSubIssueType();
    });
    component.blockingUiSubscription = addRequestStore.blockingUiStatus.subscribe(status => {
      component.isBlock = status.length > 0;;
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

  it('#updateModel should assign default data for decidedBy when is abnormal', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '1';
    const component = new AddRequestComponent(null, null);
    component.model = fakeRequestModel;
    Helper.initHtml();

    component.updateModel(Helper.fakeAbnormalFilterModel);

    expect(component.model.others.decidedBy).toBe('sa');
    expect(component.model.filter).toStrictEqual(Helper.fakeAbnormalFilterModel);
  });

  it('#updateModel should not assign default data for decidedBy when is not abnormal', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = '13';
    const component = new AddRequestComponent(null, null);
    component.model = fakeRequestModel;

    component.updateModel(Helper.fakeFilterModel);

    expect(component.model.others.decidedBy).toBe(undefined);
    expect(component.model.filter).toStrictEqual(Helper.fakeFilterModel);
  });

  it('#backToManagePage should assign to page', async () => {
    const fakeRequestModel = new RequestModel();
    const component = new AddRequestComponent(null, null);
    component.model = fakeRequestModel;
    Object.defineProperty(window, 'location', {
      value: new URL(Helper.url)
    });
    window.location.assign = jest.fn();

    component.backToManagePage();

    expect(window.location.assign).toHaveBeenCalledWith('TicketVoidingSystem/ManageRequest/Index');
  });

  it('#eventAbnormalBetComponent.saveRequest should execute save request when isLikelyAbnormalBetIssueType', async () => {
    const fakeRequestModel = new RequestModel();
    fakeRequestModel.filter.issueTypeId = IssueTypeConstant.ABNORMAL_BET;
    const mockSaveRequest = jest.fn();
    const eventAbnormalBetComponent = new EventAbnormalBetComponent(null, null, null, null, null);
    eventAbnormalBetComponent.saveRequest = mockSaveRequest;
    const component = new AddRequestComponent(null, null);
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
    const component = new AddRequestComponent(null, null);
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
    const component = new AddRequestComponent(null, null);
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
    const component = new AddRequestComponent(null, null);
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
    const component = new AddRequestComponent(null, null);
    component.model = fakeRequestModel;
    component.eventTicket14Component = eventArchivedTicketComponent;

    await component.saveRequest(false);

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#getEventLabel should return correct "Username"', async () => {
    const component = new AddRequestComponent(null, null);
    component.isAbnormalAccount = jest.fn().mockImplementation(() => true);
    const actual = component.getEventLabel();

    expect(actual).toBe('Username');
  });

  it('#getEventLabel should return correct "Ticket Info"', async () => {
    const component = new AddRequestComponent(null, null);
    component.isAbnormalAccount = jest.fn().mockImplementation(() => false);
    component.isArchivedTicketIssueType = jest.fn().mockImplementation(() => true);
    const actual = component.getEventLabel();

    expect(actual).toBe('Ticket Info');
  });

  it('#getEventLabel should return correct "Event"', async () => {
    const component = new AddRequestComponent(null, null);
    component.isAbnormalAccount = jest.fn().mockImplementation(() => false);
    component.isArchivedTicketIssueType = jest.fn().mockImplementation(() => false);
    const actual = component.getEventLabel();

    expect(actual).toBe('Event');
  });
});
