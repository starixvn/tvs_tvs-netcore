import { NgModule } from '@angular/core';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { RedCardModel } from '../../../add-request/app/add-request/models/event-red-card.model';
import { RequestDetailModel, RequestDetailViewModel, RequestEventModel } from '../../../edit-request/app/request.model';
import { BlockUiModule } from '../../../utility/components/block-ui/block-ui.module';
import { RequestInfoComponent } from '../../../utility/components/request-info/request-info.component';
import { GeneralInfo } from '../../../utility/components/request-info/request-info.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { IssueInfo } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { CommonService } from '../../../utility/services/common.service';
import { HttpService } from '../../../utility/services/http.service';
import { AppService } from '../app.service';
import { MatchInfoComponent } from './match-info/match-info.component';
import { TicketListComponent } from './ticket-list.component';
import { TicketListModal } from './ticket-list.modal';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsModel } from './tickets/tickets.model';
import { TicketsQuery } from './tickets/tickets.query';

class Helper {
  static readonly fakeDate = '2019-11-18 12:08:49.737';
  static ticketListComponentHtml = '<ticket-list [modal]="modal"></ticket-list>';
  static readonly fakeTicketListModal: TicketListModal = {
    open: true,
    requestId: 52000,
    matchId: 12345
  };

  static readonly fakeRequestDetailModel: RequestDetailModel = {
    actionId: 1,
    decidedBy: 'sa',
    isTest: false,
    isVoided: false,
    issueTypeId: 11,
    mistakenBy: null,
    operators: [],
    provider: null,
    remark: 'test',
    requestedBy: "sa",
    source: null,
    sportType: 2,
    voidedBy: 'sa',
    userId: 0,
    requestId: 1
  };

  static readonly fakeRequestEventModel: RequestEventModel = {
    awayId: 18486,
    eventDate: new Date(),
    finalAwayScore: 1,
    finalHomeScore: 1,
    homeId: 1983,
    htAwayScore: 1,
    htHomeScore: 1,
    kickOffTime: new Date('1700-12-16 01:00:00.000'),
    leagueId: 78717,
    matchId: 32784859,
    parentId: 0,
    transIds: '107661343669',
    globalShowTime: new Date('1700-12-16 02:00:00.000'),
    filterBy: 1,
    voidFromTime: new Date(),
    voidToTime: new Date(),
    subIssueTypeId: 6
  };

  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: 5100,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: Helper.fakeRequestEventModel,
    messages: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    duplicateTicketsModel: null
  };

  static readonly fakeTicketsModel: TicketsModel = {
    groups: [
      {
        name: 'Deposit',
        displayTotalTickets: 4,
        isCollapse: false,
        tickets: []
      }
    ],
    totalVoidedTickets: 1,
    totalCancelCashOut: 0,
    licenseeNames: '',
    generalBetTypeCombinations: ''
  };

  static readonly fakeMatchModel: MatchModel = {
    matchId: 32784859,
    homeId: 10935,
    homeName: 'American League',
    homeNameNewSimplified: '美国聯盟',
    homeNameSimplified: '美国聯盟',
    homeNameTraditional: '美國聯盟',
    awayId: 16277,
    awayName: 'National League',
    awayNameNewSimplified: '国家联盟',
    awayNameSimplified: '国家联盟',
    awayNameTraditional: '國家聯盟',
    matchCode: '*B0001',
    eventDate: new Date(),
    dateTime: new Date(),
    leagueId: 12345,
    leagueName: 'Test League',
    leagueNameNewSimplified: '',
    leagueNameSimplified: '',
    leagueNameTraditional: '',
    matchEvent: 'Test A - Test B',
    matchEventSimplified: '',
    matchEventNewSimplified: '',
    kickOffTime: Helper.fakeDate,
    sportType: 8,
    sportTypeName: '',
    sportTypeNameNewSimplified: '',
    sportTypeNameSimplified: '',
    sportTypeNameTraditional: '',
    startTime: new Date(Helper.fakeDate),
    endTime: new Date(Helper.fakeDate),
    leagueGroupId: 0
  };

  static readonly fakeIssueInfo: IssueInfo = {
    subIssueTypeId: 27,
    issueTypeId: 11,
    subIssueTypeName: 'Abnormal',
    subIssueTypeNameCS: '非正常',
    name: ''
  };

  static readonly fakeGeneralInfo: GeneralInfo = {
    voidedTimeString: '',
    voidingHistoryIds: '',
    kickOffTimeString: Helper.fakeDate,
    leagueName: '',
    matchEvent: 'MU - vs Barca',
    licenseeNames: '',
    totalVoidedTickets: 1,
    decidedBy: '',
    requestedBy: '',
    negativeBalanceUsers: '',
    generalBetTypeCombinations: '',
    scoreResult: '',
    reason: '',
    totalCancelCashOut: 0
  };
}

describe('TicketListComponent', () => {
  @NgModule({
    declarations: [
      MatchInfoComponent,
      RequestInfoComponent,
      TicketsComponent
    ],
    imports: [
      BlockUiModule
    ],
    providers: [
      HttpService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<TicketListComponent>;

  beforeEach(() => {
    shallow = new Shallow(TicketListComponent, AppModuleTest);
  });

  it('#ngOnChanges should call expected function', async () => {
    // Arrange
    const mockGetMatch = jest.fn();
    const mockGetRequestById = jest.fn().mockImplementation(() => Helper.fakeRequestDetailViewModel);
    const mockGetIssueInfo = jest.fn().mockImplementation(() => Helper.fakeIssueInfo);
    const mockGetGeneralInfo = jest.fn().mockImplementation(() => [Helper.fakeGeneralInfo]);
    const { instance } = await shallow
      .mock(CommonService, {
        getMatch: mockGetMatch,
        getRequestById: mockGetRequestById,
        getIssueInfo: mockGetIssueInfo
      })
      .mock(AppService, {
        getGeneralInfo: mockGetGeneralInfo
      })
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.tickets = Helper.fakeTicketsModel;
    instance.getTickets = jest.fn();
    instance.isShowMatchInfo = jest.fn().mockImplementation(() => true);
    instance['getSubIssueTypeId'] = jest.fn();

    // Action
    await instance.ngOnChanges({});

    // Assert
    expect(mockGetMatch).toHaveBeenCalled();
    expect(mockGetRequestById).toHaveBeenCalled();
    expect(mockGetIssueInfo).toHaveBeenCalled();
    expect(instance.getTickets).toHaveBeenCalled();
    expect(instance.paging.pageSize).toBe(500);
  });

  it('#ngOnChanges should call expected function when is not abnormal bet and score empty', async () => {
    // Arrange
    const dangerAcceptedModel = new RedCardModel();
    dangerAcceptedModel.isMainMatch = true;
    dangerAcceptedModel.subIssueTypeId = 1;
    const requestDetailViewModel = Helper.fakeRequestDetailViewModel;
    requestDetailViewModel.event = null;
    requestDetailViewModel.dangerAcceptedModels = [dangerAcceptedModel];
    requestDetailViewModel.request.issueTypeId = 1;
    const mockGetMatch = jest.fn();
    const mockGetRequestById = jest.fn().mockImplementation(() => requestDetailViewModel);
    const mockGetIssueInfo = jest.fn().mockImplementation(() => Helper.fakeIssueInfo);
    const mockGetGeneralInfo = jest.fn().mockImplementation(() => [Helper.fakeGeneralInfo]);
    const { instance } = await shallow
      .mock(CommonService, {
        getMatch: mockGetMatch,
        getRequestById: mockGetRequestById,
        getIssueInfo: mockGetIssueInfo
      })
      .mock(AppService, {
        getGeneralInfo: mockGetGeneralInfo
      })
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.tickets = Helper.fakeTicketsModel;
    instance.getTickets = jest.fn();
    instance['getSubIssueTypeId'] = jest.fn();

    // Action
    await instance.ngOnChanges({});

    // Assert
    expect(mockGetMatch).toHaveBeenCalled();
    expect(mockGetRequestById).toHaveBeenCalled();
    expect(mockGetIssueInfo).toHaveBeenCalled();
    expect(instance.getTickets).toHaveBeenCalled();
    expect(instance.paging.pageSize).toBe(500);
  });


  it('#ngOnChanges should call expected function when #getScoreResult return N/A ', async () => {
    // Arrange
    const requestDetailModel = Helper.fakeRequestDetailModel;
    requestDetailModel.issueTypeId = 11;
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.event = new RequestEventModel();
    const mockGetMatch = jest.fn();
    const mockGetRequestById = jest.fn().mockImplementation(() => fakeRequestDetailViewModel);
    const mockGetIssueInfo = jest.fn().mockImplementation(() => Helper.fakeIssueInfo);
    const mockGetGeneralInfo = jest.fn().mockImplementation(() => [Helper.fakeGeneralInfo]);
    const { instance } = await shallow
      .mock(CommonService, {
        getMatch: mockGetMatch,
        getRequestById: mockGetRequestById,
        getIssueInfo: mockGetIssueInfo
      })
      .mock(AppService, {
        getGeneralInfo: mockGetGeneralInfo
      })
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.tickets = Helper.fakeTicketsModel;
    instance.getTickets = jest.fn();

    // Action
    await instance.ngOnChanges({});

    // Assert
    expect(mockGetMatch).toHaveBeenCalled();
    expect(mockGetRequestById).toHaveBeenCalled();
    expect(mockGetIssueInfo).toHaveBeenCalled();
    expect(instance.getTickets).toHaveBeenCalled();
    expect(instance.paging.pageSize).toBe(500);
  });

  it('#getTickets should return expected tickets', async () => {
    // Arrange
    const requestDetailViewModel = Helper.fakeRequestDetailViewModel;
    requestDetailViewModel.event = null;
    requestDetailViewModel.request.issueTypeId = 1;
    const mockGetRequestById = jest.fn().mockImplementation(() => requestDetailViewModel);
    const { instance } = await shallow
      .mock(CommonService, {
        getRequestById: mockGetRequestById,
      })
      .mock(AppService, {
        getVoidedTickets: jest.fn().mockImplementation(() => Helper.fakeTicketsModel),
      })
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.tickets = Helper.fakeTicketsModel;
    instance.generalInfoViewModel.generalInfoModel.voidingHistoryIds = '';
    const expectedQuery: TicketsQuery = {
      issueTypeId: 1,
      requestId: 52000,
      matchId: 12345,
      pageIndex: 0,
      pageSize: 3000,
      voidingHistoryIds: ''
    };

    // Action
    await instance.getTickets();

    // Assert
    expect(instance.tickets).toEqual(Helper.fakeTicketsModel);
    expect(instance.query).toEqual(expectedQuery);
    expect(instance.paging.total).toBe(1);
  });

  it('#pagingEvent should call #getTickets', async () => {
    // Arrange
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
        }
      });
    instance.getTickets = jest.fn();

    // Action
    instance.pagingEvent();

    // Assert
    expect(instance.getTickets).toHaveBeenCalledTimes(1);
  });

  it('#exportExcel should export excel file', async () => {
    // Arrange
    const mockExportExcel = jest.fn();
    const { instance } = await shallow
      .mock(AppService, { exportTickets: mockExportExcel })
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal
        }
      });
    instance.query = new TicketsQuery();

    // Action
    await instance.exportExcel();

    // Assert
    expect(mockExportExcel).toHaveBeenCalledWith(instance.query);
    expect(mockExportExcel).toHaveBeenCalledTimes(1);
  });

  it('TicketListComponent should init match snapshot', async () => {
    // Arrange
    const { fixture, findComponent } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal
        }
      });
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(findComponent(MatchInfoComponent)).toHaveFoundOne();
    expect(findComponent(RequestInfoComponent)).toHaveFoundOne();
    expect(findComponent(TicketsComponent)).toHaveFoundOne();
  });

  it('when TicketsComponent pagingChange event emit, #pagingEvent should be called', async () => {
    // Arrange
    const { fixture, findComponent, instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal
        }
      });
    fixture.detectChanges();
    instance.pagingEvent = jest.fn();
    const ticketsComponent = findComponent(TicketsComponent);
    ticketsComponent.pagingChange.emit();

    // Assert
    expect(instance.pagingEvent).toHaveBeenCalledTimes(1);
  });

  it('when TicketsComponent exportExcelEvent event emit, #exportExcel should be called', async () => {
    // Arrange
    const { fixture, findComponent, instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal
        }
      });
    fixture.detectChanges();
    instance.exportExcel = jest.fn();
    const ticketsComponent = findComponent(TicketsComponent);
    ticketsComponent.exportExcelEvent.emit();

    // Assert
    expect(instance.exportExcel).toHaveBeenCalledTimes(1);
  });

  it('#isShowMatchInfo should return false when isAbnormalAccountIssueType true', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal
        }
      });
    instance.isAbnormalAccountIssueType = jest.fn().mockImplementation(() => true);
    const actual = instance.isShowMatchInfo(null);

    expect(actual).toBe(false);
  });

  it('#isShowMatchInfo should return false when isArchivedTicketIssueType true', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal
        }
      });
    instance['isAbnormalAccountIssueType'] = jest.fn().mockImplementation(() => false);
    instance['isAbnormalBetIssueType'] = jest.fn().mockImplementation(() => false);
    instance['isArchivedTicketIssueType'] = jest.fn().mockImplementation(() => true);
    const actual = instance.isShowMatchInfo(Helper.fakeRequestDetailViewModel);

    expect(actual).toBe(false);
  });

  it('#getScoreResult should return empty', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal
        }
      });
    const actual = instance['getScoreResult'](null);

    expect(actual).toBe('');
  });

  it('#getScoreResult should return "HT N/A, FT N/A"', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal
        }
      });
    instance.isAbnormalAccountIssueType = jest.fn().mockImplementation(() => true);
    const actual = instance['getScoreResult'](new RequestEventModel());

    expect(actual).toBe('HT N/A, FT N/A');
  });

  it('#ngOnChanges should not call #mappingDataTicketsToGeneralInfo', async () => {
    // Arrange
    const dangerAcceptedModel = new RedCardModel();
    dangerAcceptedModel.isMainMatch = true;
    dangerAcceptedModel.subIssueTypeId = 1;
    const fakeRequestDetailViewModel = _.cloneDeep(Helper.fakeRequestDetailViewModel);
    fakeRequestDetailViewModel.dangerAcceptedModels = [dangerAcceptedModel];
    const mockGetMatch = jest.fn();
    const mockGetRequestById = jest.fn().mockImplementation(() => fakeRequestDetailViewModel);
    const mockGetIssueInfo = jest.fn().mockImplementation(() => Helper.fakeIssueInfo);
    const mockGetGeneralInfo = jest.fn().mockImplementation(() => [Helper.fakeGeneralInfo]);
    const { instance } = await shallow
      .mock(CommonService, {
        getMatch: mockGetMatch,
        getRequestById: mockGetRequestById,
        getIssueInfo: mockGetIssueInfo
      })
      .mock(AppService, {
        getGeneralInfo: mockGetGeneralInfo
      })
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.tickets = Helper.fakeTicketsModel;
    instance.getTickets = jest.fn();
    instance.isShowMatchInfo = jest.fn().mockImplementation(() => true);
    instance['getGeneralInfo'] = jest.fn();
    instance['getSubIssueTypeId'] = jest.fn();

    // Action
    await instance.ngOnChanges({});

    // Assert
    expect(mockGetMatch).toHaveBeenCalled();
    expect(mockGetRequestById).toHaveBeenCalled();
    expect(mockGetIssueInfo).toHaveBeenCalled();
    expect(instance.getTickets).toHaveBeenCalled();
  });

  it('#ngOnChanges should not call #getTickets when modal.open false', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
          requestDetail: Helper.fakeRequestDetailViewModel
        }
      });
    instance.getTickets = jest.fn();
    instance.modal.open = false;

    await instance.ngOnChanges({});

    expect(instance.getTickets).toHaveBeenCalledTimes(0);
  });

  it('#isAbnormalBetRealMemberIssueType should return false when requestDetail have not request', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
        }
      });
    const requestDetail = new RequestDetailViewModel();
    requestDetail.request = null;

    const actual = instance['isAbnormalBetRealMemberIssueType'](requestDetail);

    expect(actual).toBe(false);
  });

  it('#isDangerAcceptedIssueType should return false when requestDetail have not request', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
        }
      });
    instance.requestDetail = new RequestDetailViewModel();
    instance.requestDetail.request = null;

    const actual = instance['isDangerAcceptedIssueType']();

    expect(actual).toBe(false);
  });

  it('#isWrongScoreIssueType should return false when requestDetail have not request', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
        }
      });
    instance.requestDetail = new RequestDetailViewModel();
    instance.requestDetail.request = null;

    const actual = instance['isWrongScoreIssueType']();

    expect(actual).toBe(false);
  });

  it('#isRedCardIssueType should return false when requestDetail have not request', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
        }
      });
    instance.requestDetail = new RequestDetailViewModel();
    instance.requestDetail.request = null;

    const actual = instance['isRedCardIssueType']();

    expect(actual).toBe(false);
  });

  it('#isAbnormalBetRealMemberIssueType should return true', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
        }
      });
    const requestDetail = new RequestDetailViewModel();
    requestDetail.request = new RequestDetailModel;
    requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET_REAL_MEMBER);

    const actual = instance['isAbnormalBetRealMemberIssueType'](requestDetail);

    expect(actual).toBeTruthy();
  });

  it('#isLikelyAbnormalBetIssueType should return true', async () => {
    const { instance } = await shallow
      .render(Helper.ticketListComponentHtml, {
        bind: {
          modal: Helper.fakeTicketListModal,
        }
      });
    [
      IssueTypeConstant.ABNORMAL_BET,
      IssueTypeConstant.ABNORMAL_BET_REAL_MEMBER
    ].forEach(x => {
      const requestDetail = new RequestDetailViewModel();
      requestDetail.request = new RequestDetailModel;
      requestDetail.request.issueTypeId = Number(x);

      const actual = instance['isLikelyAbnormalBetIssueType'](requestDetail);

      expect(actual).toBeTruthy();
    });
  });
});
