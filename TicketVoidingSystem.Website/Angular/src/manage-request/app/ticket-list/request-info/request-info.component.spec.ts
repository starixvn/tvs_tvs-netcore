import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { PagingModel } from '../../../../utility/components/paging/paging.model';
import { IssueInfo } from '../../../../utility/models/issue-type.model';
import { AppService } from '../../app.service';
import { TabInfoRequest, TicketListModal } from '../ticket-list.modal';
import { TicketsModel } from '../tickets/tickets.model';
import { RequestInfoComponent } from './request-info.component';
import { GeneralInfo, GeneralInfoViewModel } from './request-info.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonService } from '../../../../utility/services/common.service';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { MatchModel } from '../../../../utility/models/match.model';

describe('RequestInfoComponent', () => {
  let component: RequestInfoComponent;
  let fixture: ComponentFixture<RequestInfoComponent>;
  let commonService: CommonService;
  let appService: AppService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        CommonService, AppService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestInfoComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    appService = fixture.debugElement.injector.get(AppService);
    component = fixture.componentInstance;
  });

  const fakeTicketListModal = {
    open: true,
    requestId: 1,
    matchId: 1,
    requestDetailId: 1,
    tabInfoRequest: []
  } as TicketListModal;
  const fakeGeneralInfoViewModel = {
    generalInfoModel: {
      voidingHistoryIds: "2",
      recoveredTimeString: "",
      voidedTimeString: "",
      totalTicketsProcessed: 0,
      totalCancelCashOutProcessed: 0,
      decidedBy: "",
      requestedBy: "",
      negativeBalanceUsers: "",
      licenseeNames: "",
      cancelCashOutLicenseesName: "",
      generalBetTypeCombinations: "",
      scoreResult: "",
      reason: ""
    } as GeneralInfo,
    userVoidMessages: [],
    succeedEmails: [],
    failedEmails: []
  } as GeneralInfoViewModel;
  const fakeModel = {
    requestId: 1,
    request: { issueTypeId: 1, requestId: 1 },
    abnormalBetModel: { filterBy: 1 },
    duplicateTicketsModel: { filterBy: 1 },
    event: { matchId: 1 }
  } as RequestDetailViewModel;
  const fakeIssue = {
    name: 'Abnormal',
    subIssueTypeId: 27,
    issueTypeId: 11,
    subIssueTypeName: 'Abnormal',
    subIssueTypeNameCS: '非正常'
  } as IssueInfo;


  it('#ngOnInit should setting data expected', async () => {
    // Arrange
    const fakeFunctionGetDataCurrentTab = jest.fn();
    component['getDataCurrentTab'] = fakeFunctionGetDataCurrentTab;
    component.ticketListModal = fakeTicketListModal;
    component.tabInfoRequest = [{ isActive: true, id: 1 }] as TabInfoRequest[];

    // Action 
    await component.ngOnInit();

    // Assert
    expect(fakeFunctionGetDataCurrentTab).toHaveBeenCalled();
    expect(component.paging.pageSize).toBe(500);
  });

  it('#getTickets should has getTickets', async () => {
    // Arrange
    const tickets = {
      totalTicketsProcessed: 1,
      totalCancelCashOutProcessed: 0,
      licenseeNames: "",
      cancelCashOutLicenseesName: "",
      generalBetTypeCombinations: "",
      groups: []
    } as TicketsModel;
    appService.getVoidedTickets = jest.fn().mockReturnValue(tickets);
    component.ticketListModal = fakeTicketListModal;
    component.generalInfoViewModel = fakeGeneralInfoViewModel;
    component.model = fakeModel;
    component.paging = new PagingModel();

    // Action
    await component.getTickets(12);

    // Assert
    expect(component.tickets).toEqual(tickets);
    expect(component.paging.total).toBe(1);
  });

  it('#pagingEvent should call getTickets', async () => {
    // Arrange
    const fakeFunctionGetTickets = jest.fn();
    component.getTickets = fakeFunctionGetTickets;
    component.ticketListModal = fakeTicketListModal;

    // Action
    await component.pagingEvent();

    // Assert
    expect(fakeFunctionGetTickets).toBeCalled();
  });

  it('#isShowMatchInfo should return false', () => {
    // Arrange
    const dataTests = [13, 11, 17, 20, 22];
    component.model = fakeModel;

    // Action & Assert
    dataTests.forEach(x => {
      component.issue.issueTypeId = x;
      const actual = component.isShowMatchInfo();
      expect(actual).toBeFalsy();
    })
  });

  it('#isShowMatchInfo should return true', () => {
    // Arrange
    component.issue.issueTypeId = 1;
    component.model = fakeModel;

    // Action
    const actual = component.isShowMatchInfo();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#getMatch should getMatch success', async () => {
    // Arrange
    component.issue.issueTypeId = 1;
    component.model = fakeModel;
    const matchId = 56839;
    const match = {
      matchId: 56839,
      matchCode: "TEST001",
      leagueName: "Test League",
      matchEvent: "Test Event"
    } as MatchModel;
    commonService.getMatch = jest.fn().mockResolvedValue(match);

    // Action
    await component['getMatch'](matchId);

    // Assert
    expect(component.match).toEqual(match);
  });
});
