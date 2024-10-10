import { NgModule, QueryList } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { AddChildMatchComponent } from '../../../../utility/components/add-child-match/add-child-match.component';
import { AddChildMatchModel } from '../../../../utility/components/add-child-match/add-child-match.model';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { DateFullTimeNewComponent } from '../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { DateTimeModule } from '../../../../utility/components/date-time/date-time.module';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { MatchType } from '../../../../utility/constants/config';
import { MatchModel } from '../../../../utility/models/match.model';
import { HttpService } from '../../../../utility/services/http.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { EarlyKickOffModel } from '../models/event-eko.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../models/get-log-info.model';
import { ChildMatchModel } from '../models/related-event.model';
import { TransInfoAddRequestModel } from '../models/trans-info-add-request.model';
import { ConfirmEkoComponent } from './confirm-eko/confirm-eko.component';
import { EventEarlyKickOffComponent } from './event-early-kick-off.component';
import { LogInfoEkoComponent } from './log-info-eko/log-info-eko.component';
import { LogInfoEarlyKickOff } from './models/log-info-eko.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { EventEarlyKickOffService } from './services/event-eko.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { TableTicketsModel } from './tickets-list/table-tickets.model';
import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { AddRequestApiService } from '../add-request-api.service';
import { SearchEventService } from './services/search-event.service';

class Helper {
  static readonly hourSelector = 'input.hour';
  static readonly minuteSelector = 'input.minute';
  static readonly secondSelector = 'input.second';
  static readonly kickOffTime = '2019-11-18 12:08:49.737';
  static readonly timeModelValue = '2019/11/18 12:08:49';
  static readonly defaultDate = '2019-11-09 12:08:49.737';
  static readonly fakeEarlyKickOffModel: EarlyKickOffModel = {
    eventDate: new Date(),
    isMainMatch: true,
    kickOffTime: '',
    matchId: 1,
    subIssueTypeId: 1,
    sportType: 0
  }
  static readonly fakeTemplateValue: TemplateValue = {
    matchId: 0,
    groupPHAffected: 0,
    checkSettled: false,
    kickOffTime: '2019-11-18 12:08:49.737'
  };
  static readonly fakeChildMatches: ChildMatchModel[] = [
    {
      matchId: 12345,
      matchCode: '111',
      matchEvent: 'Test A vs Test B',
      isChecked: true,
      matchType: 1,
      leagueName: '',
      name: '',
      homeId: 0,
      homeName: '',
      homeNameNewSimplified: '',
      homeNameSimplified: '',
      homeNameTraditional: '',
      awayId: 0,
      awayName: '',
      awayNameNewSimplified: '',
      awayNameSimplified: '',
      awayNameTraditional: '',
      eventDate: undefined,
      dateTime: undefined,
      leagueId: 0,
      leagueGroupId: 0,
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      startTime: undefined,
      endTime: undefined,
      sportType: 0,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: ''
    }
  ];
  static readonly fakeGetLogInfoModelList: GetLogInfoModel[] = [{
    matchId: 12345,
    validation: {
      isInvalidTotalTickets: false,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: false
    } as Validation,
    ticketRequest: [{
      transIds: '123456789',
      requestId: 123
    } as TicketRequest],
    logInfoDetail: null
  }];
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    getLogInfoModels: Helper.fakeGetLogInfoModelList,
    transInfoAddRequestModel: new TransInfoAddRequestModel()
  };
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '11',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  };
  static readonly fakeTicketsModel = {
    groups: [
      {
        name: 'Credit',
        displayTotalTickets: 3,
        tickets: [
          { no: 1, betId : '108495160329', value: 108495160329, transDate: '11/09/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Handicap',
            odds: '', stake: '', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score: '', handicap: '',
            choice: '', soldId: null, mainTransId: 0,
            isParlay: false, isDisable: false, isCricket: false, isBonus: false, isMarked: false, secondAcceptFlag: ''
          },
          { no: 2, betId : '108495160330', value: 108495160330, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Waiting</div>', score: '', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0,
            isParlay: false, isDisable: false, isCricket: false, isBonus: false, isMarked: false, secondAcceptFlag: ''
          },
          { no: 3, betId : '108495160331', value: 108495160331, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score: '', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0,
            isParlay: false, isDisable: false, isCricket: false, isBonus: false, isMarked: false, secondAcceptFlag: ''
          },
        ]
      }
    ],
    strFromTime: '12:51:48 PM',
    strToTime: '12:51:55 PM',
    total: 24,
    totalSingle: 3,
    totalParlay: 0,
    fromTime: new Date(),
    toTime: new Date()
  };
  static getTableTicketsModel(): TableTicketsModel {
    return JSON.parse(JSON.stringify(Helper.fakeTicketsModel));
  }
  static getFakeMatchInfo(): MatchModel {
    return {
      matchId: 12345,
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
      eventDate: new Date(Helper.defaultDate),
      dateTime: new Date(Helper.defaultDate),
      leagueId: 12345,
      leagueName: '',
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEvent: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: Helper.kickOffTime,
      sportType: 8,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: '',
      startTime: new Date(Helper.defaultDate),
      endTime: new Date(Helper.defaultDate),
      leagueGroupId: 0
    };
  }
  static readonly fakeLogInfoEarlyKickOff: LogInfoEarlyKickOff = {
    isMainMatch: true,
    kickOffTime: '2019-11-18 12:08:49.737',
    matchId: 1,
    leagueName: '',
    eventName: '',
    tableTicketsModel: new TableTicketsModel,
    matchModel: Helper.getFakeMatchInfo(),
    isCollapse: false,
    pagingModel: undefined,
    isInvalidTotalTickets: false,
    isShowValidation: false,
    templateValue: Helper.fakeTemplateValue,
    isHasSettledTicket: false,
    isHasInstantlySettledTicket: false,
    sportType: 0
  }
}

describe('EventEarlyKickOffComponent', () => {
  @NgModule({
    declarations: [
      TicketsListComponent,
      EventLeagueComponent,
      AddChildMatchComponent,
      ConfirmEkoComponent
    ],
    imports: [
      BlockUiModule,
      DateTimeModule,
      FormsModule,
      NgbModule,
      ToolTipModule
    ],
    providers: [
      HttpService,
      AddRequestStore
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventEarlyKickOffComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventEarlyKickOffComponent, AppModuleTest)
              .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn(), })
              .dontMock(DateTimeModule)
              .dontMock(NgbModule);
  });

  it('EventEarlyKickOffComponent init should match snapshot', async () => {
    const component = new EventEarlyKickOffComponent(null, null, null, null, null, null, null, null);
    expect(component).toMatchSnapshot();
  });


  it('#changeMatchEvent should call change changeEvent', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent})
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.allSelectedEvents = [Helper.fakeLogInfoEarlyKickOff];
    instance.mainEvent = Helper.fakeLogInfoEarlyKickOff;
    instance.eventLeagueComponent = null;
    instance.updateMatchId.emit = jest.fn();

    // Action
    instance.changeMatchEvent();

    // Assert
    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should call expected method', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const { instance } = await shallow
    .mock(LogInfoService, {resetLogInfoOfEvent: mockResetLogInfoOfEvent })
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.allSelectedEvents = [Helper.fakeLogInfoEarlyKickOff];
    instance.mainEvent = Helper.fakeLogInfoEarlyKickOff;
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.selectedMatch = new MatchModel();
    instance.eventLeagueComponent = eventLeagueComponent;
    instance.updateMatchId.emit = jest.fn();

    instance.changeMatchEvent();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });


  it('changeKickOffTime should call logInfoService.resetLogInfoOfEvent', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.allSelectedEvents =  [Helper.fakeLogInfoEarlyKickOff];
    instance.primitiveProps = new PrimitiveProperty();
    instance.kickOffTimeComponent = new DateFullTimeNewComponent(null);
    instance.kickOffTimeComponent.isTimeValid = jest.fn().mockReturnValue(false);

    instance.changeKickOffTime();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
  });

  it('changeKickOffTime should call kickOffTimeComponent.getDateTime', async () => {
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.allSelectedEvents =  [Helper.fakeLogInfoEarlyKickOff];
    instance.primitiveProps = new PrimitiveProperty();
    instance.kickOffTimeComponent = new DateFullTimeNewComponent(null);
    instance.kickOffTimeComponent.isTimeValid = jest.fn().mockReturnValue(true);
    instance.kickOffTimeComponent.getDateTime = jest.fn();

    instance.changeKickOffTime();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(instance.kickOffTimeComponent.getDateTime).toHaveBeenCalledTimes(1);
  });

  it('getTicketsMainEvent should call logInfoService.getTickets', async () => {
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const mockGetTickets = jest.fn();
    const mockInitQuery = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getTickets: mockGetTickets, initQuery: mockInitQuery})
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.getTicketsMainEvent();

    expect(mockGetTickets).toHaveBeenCalledTimes(1);
    expect(mockInitQuery).toHaveBeenCalledTimes(1);
  });

  it('handleClickAddRelatedEvent should call relatedEventService.addRelatedEventByInput', async () => {
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const mockAddRelatedEventByInput = jest.fn();
    const { instance } = await shallow
    .mock(RelatedEventService, { addRelatedEventByInput: mockAddRelatedEventByInput})
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.handleClickAddRelatedEvent();

    expect(mockAddRelatedEventByInput).toHaveBeenCalledTimes(1);
  });

  it('saveRequest should call saveRequestService.saveRequest', async () => {
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
    .mock(SaveRequestService, { saveRequest: mockSaveRequest})
    .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn()})
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('onClickConfirmSaveRequest should call saveRequestService.onClickConfirmSave', async () => {
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const mockOnClickConfirmSave = jest.fn();
    const { instance } = await shallow
    .mock(SaveRequestService, { onClickConfirmSave: mockOnClickConfirmSave})
    .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn()})
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.onClickConfirmSaveRequest();

    expect(mockOnClickConfirmSave).toHaveBeenCalledTimes(1);
  });


  it('onClickCancelSaveRequest should call addRequestStore.changeSavingRequestStatus', async () => {
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus})
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.onClickCancelSaveRequest();

    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('showAddChildMatchModal should call update addChildMatchModel.isOpen = true', async () => {
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const { instance } = await shallow
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.addChildMatchModel = new AddChildMatchModel();
    instance.allSelectedEvents = [Helper.fakeLogInfoEarlyKickOff];
    instance.showAddChildMatchModal(1);

    expect(instance.addChildMatchModel.isOpen).toBeTruthy();
    expect(instance.addChildMatchModel.matchType).toBe(1);
  });

  it('#saveRelatedEvent should not call logInfoService.getLogInfo when have not new matches diff match id', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const mockGetLogInfo = jest.fn();
    const mockUpdateEvents = jest.fn().mockReturnValue([]);
    const { instance } = await shallow
      .mock(RelatedEventService, { mapChildMatchesToEvents: mockUpdateEvents })
      .mock(LogInfoService, {
        getLogInfo: mockGetLogInfo,
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
      })
      .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn()})
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.allSelectedEvents = [Helper.fakeLogInfoEarlyKickOff, new LogInfoEarlyKickOff()];
    instance.primitiveProps = new PrimitiveProperty();
    instance.addChildMatchModel.matchType = 1;
    const childMatchModel: ChildMatchModel = {
      matchEvent: '',
      name: '',
      isChecked: false,
      matchType: 3,
      matchId: 1111,
      leagueName: '',
      matchCode: "1111",
      homeId: 0,
      homeName: '',
      homeNameNewSimplified: '',
      homeNameSimplified: '',
      homeNameTraditional: '',
      awayId: 0,
      awayName: '',
      awayNameNewSimplified: '',
      awayNameSimplified: '',
      awayNameTraditional: '',
      eventDate: undefined,
      dateTime: undefined,
      leagueId: 0,
      leagueGroupId: 0,
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      startTime: undefined,
      endTime: undefined,
      sportType: 0,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: ''
    }
    instance.relatedEvents = [childMatchModel];
    await instance.saveRelatedEvent(Helper.fakeChildMatches);

    expect(mockGetLogInfo).toHaveBeenCalledTimes(0);
  });

  it('#saveRelatedEvent should be call expected function when have not new matches diff match id', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const mockUpdateEvents = jest.fn().mockReturnValue([new LogInfoEarlyKickOff()]);
    const mockGetLogInfo = jest.fn().mockReturnValue({getLogInfoModels: null} as GetLogInfoViewModel);
    const { instance } = await shallow
    .mock(RelatedEventService, { mapChildMatchesToEvents: mockUpdateEvents })
    .mock(LogInfoService, {
      getLogInfo: mockGetLogInfo,
      resetLogInfoOfEvent: mockResetLogInfoOfEvent,
      assignResultLogInfoToEvents: jest.fn()
    })
    .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn()})
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        isEdit: false
      }
    });
    instance.allSelectedEvents = [new LogInfoEarlyKickOff()];
    instance.primitiveProps = new PrimitiveProperty();

    await instance.saveRelatedEvent(Helper.fakeChildMatches);

    expect(mockUpdateEvents).toHaveBeenCalledTimes(1);
    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('handleDeleteEvent should slice 1 item in allSelectedEvents', async () => {
    const mockInitDefaultMainEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoEarlyKickOff);
    const { instance } = await shallow
    .mock(EventEarlyKickOffService, { initDefaultMainEvent: mockInitDefaultMainEvent })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    const childEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    childEvent.matchId = 99;
    childEvent.isMainMatch = false;
    instance.allSelectedEvents = [Helper.fakeLogInfoEarlyKickOff, childEvent];
    instance.handleDeleteEvent(99);

    expect(instance.allSelectedEvents.length).toBe(1);
  });


  it('#isDisabledLinkMatches should return true when request voided', async () => {
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = true;
    const { instance } = await shallow
      .render({
        bind: {
          filter: fakeFilterModel,
          isEdit: false
        }
      });
    const actual = instance.isDisabledLinkMatches();

    expect(actual).toBeTruthy();
  });

  it('#isDisabledLinkMatches should return true when have not any link matches', async () => {
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.NORMAL;
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
    .render({
      bind: {
        filter: fakeFilterModel,
        isEdit: false
      }
    });
    instance.relatedEvents = fakeChildMatches;
    const actual = instance.isDisabledLinkMatches();

    expect(actual).toBeTruthy();
  });

  it('#isDisabledLinkMatches should return false', async () => {
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.LINK;
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
    .render({
      bind: {
        filter: fakeFilterModel,
        isEdit: false
      }
    });
    instance.relatedEvents = fakeChildMatches;

    const actual = instance.isDisabledLinkMatches();

    expect(actual).toBe(false);
  });

  it('#isDisabledChildMatches should return true when request voided', async () => {
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = true;
    const { instance } = await shallow
      .render({
        bind: {
          filter: fakeFilterModel,
          isEdit: false
        }
      });

    const actual = instance.isDisabledChildMatches();

    expect(actual).toBeTruthy();
  });

  it('#isDisabledChildMatches should return true when have not any link matches', async () => {
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.NORMAL;
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
    .render({
      bind: {
        filter: fakeFilterModel,
        isEdit: false
      }
    });
    instance.relatedEvents = fakeChildMatches;
    const actual = instance.isDisabledChildMatches();

    expect(actual).toBeTruthy();
  });

  it('#isDisabledChildMatches should return false', async () => {
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.CHILD;
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
    .render({
      bind: {
        filter: fakeFilterModel,
        isEdit: false
      }
    });
    instance.relatedEvents = fakeChildMatches;
    const actual = instance.isDisabledChildMatches();

    expect(actual).toBe(false);
  });

  it('#countLinkMatches should return number of link matches', async () => {
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.LINK;
    const { instance } = await shallow
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        isEdit: false
      }
    });
    instance.relatedEvents = fakeChildMatches;
    const actual = instance.countLinkMatches();

    expect(actual).toBe(1);
  });

  it('#countChildMatches should return number of link matches', async () => {
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.CHILD;
    const { instance } = await shallow
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        isEdit: false
      }
    });
    instance.relatedEvents = fakeChildMatches;
    const actual = instance.countChildMatches();

    expect(actual).toBe(1);
  });

  it('#updateKickOffTime should return time formatted when has matchInfo', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        isEdit: false
      }
    });
    const matchInfo = new MatchModel();
    matchInfo.matchId = 1;
    matchInfo.kickOffTime = '2023/11/18 12:08:49.737';
    instance.isEdit = false;
    const actual = instance['updateKickOffTime'](matchInfo);

    expect(actual).toBe('2023-11-18 12:08:49.737');
  });

  it('#handleSearchEvent should be call #getLogInfo', async () => {
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const mockChangeBlockingUiStatus = jest.fn();
    const mockGetChildMatches = jest.fn();

    const { instance } = await shallow
      .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
      .mock(AddRequestStore, {
        changeBlockingUiStatus: mockChangeBlockingUiStatus
      })
      .mock(ValidationService, { validateCommonData: mockValidateCommonData })
      .mock(RelatedEventService, {
        getChildMatches: mockGetChildMatches
      })
      .mock(SearchEventService, {searchEvents: jest.fn().mockReturnValue(true)})
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    const childEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    childEvent.isMainMatch = false;
    const logInfoRedCardComponent = new LogInfoEkoComponent(null, null);
    const logInfoComponents = new QueryList<LogInfoEkoComponent>();
    instance.logInfoComponents.reset([...logInfoComponents.toArray(), logInfoRedCardComponent]);
    instance.allSelectedEvents = [Helper.fakeLogInfoEarlyKickOff, childEvent];
    instance.getTicketsMainEvent = jest.fn();
    instance.mainEvent = Helper.fakeLogInfoEarlyKickOff ;
    instance.mainEvent.templateValue = Helper.fakeTemplateValue;
    instance.getTicketsMainEvent = jest.fn()
    await instance.handleSearchEvent();

    expect(mockChangeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockGetChildMatches).toHaveBeenCalledTimes(1);
    expect(instance.getTicketsMainEvent).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit should be call #eventEarlyKickOffService.assignModelsToEvents when edit and not voided', async () => {
    const mockChangeBlockingUiStatus = jest.fn();
    const mockGetChildMatches = jest.fn();
    const eventEarlyKickOffService = new EventEarlyKickOffService();
    eventEarlyKickOffService.assignModelsToEvents = jest.fn();
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeBlockingUiStatus = mockChangeBlockingUiStatus;
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getPermissionAddRequest = jest.fn();
    const relatedEventService = new RelatedEventService(null, null, null);
    relatedEventService.getChildMatches = mockGetChildMatches;
    const logInfoService = new LogInfoService(null, null, null, null);
    const component = new EventEarlyKickOffComponent(null, addRequestStore, logInfoService, null, relatedEventService, eventEarlyKickOffService, null, addRequestApiService);
    component.filter = Helper.fakeFilterModel;
    component.filter.isVoided = true;
    component.isEdit = true;
    const childEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    component.allSelectedEvents = [Helper.fakeLogInfoEarlyKickOff, childEvent];
    component.getTicketsMainEvent = jest.fn();
    component.filter.isVoided = false;

    await component.ngOnInit();

    expect(mockChangeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockGetChildMatches).toHaveBeenCalledTimes(1);
    expect(component.getTicketsMainEvent).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit should be call #getTicketsMainEvent when edit and request voided', async () => {
    // Arrange
    const mockChangeBlockingUiStatus = jest.fn();
    const mockGetChildMatches = jest.fn();
    const eventEarlyKickOffService = new EventEarlyKickOffService();
    eventEarlyKickOffService.assignModelsToEvents = jest.fn();
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeBlockingUiStatus = mockChangeBlockingUiStatus;
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getPermissionAddRequest = jest.fn();
    const logInfoService = new LogInfoService(null, null, null, null);
    const relatedEventService = new RelatedEventService(null, null, null);
    relatedEventService.getChildMatches = mockGetChildMatches;
    const component = new EventEarlyKickOffComponent(null, addRequestStore, logInfoService, null, relatedEventService, eventEarlyKickOffService, null, addRequestApiService);

    const childEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    component.allSelectedEvents = [Helper.fakeLogInfoEarlyKickOff, childEvent];
    component.filter = Helper.fakeFilterModel;
    component.filter.isVoided = true;
    component.isEdit = true;

    // Action
    await component.ngOnInit();

    // Assert
    expect(mockChangeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockGetChildMatches).toHaveBeenCalledTimes(1);
  });
});
