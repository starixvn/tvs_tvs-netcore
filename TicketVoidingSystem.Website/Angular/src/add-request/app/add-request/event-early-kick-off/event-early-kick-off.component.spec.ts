import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { DateTimeModule } from '../../../../utility/components/date-time/date-time.module';
import { TimeModel } from '../../../../utility/components/date-time/date-time/time.model';
import { MatchInfo } from '../../../../utility/models/event.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { HttpService } from '../../../../utility/services/http.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { LeagueEventComponent } from '../league-event/league-event.component';
import { GetLogInfoModel, GetLogInfoViewModel } from '../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../models/trans-info-add-request.model';
import { EventEarlyKickOffComponent } from './event-early-kick-off.component';
import { TableTicketsModel } from './tickets-list/table-tickets.model';
import { TicketsListComponent } from './tickets-list/tickets-list.component';

class Helper {
  static readonly hourSelector = 'input.hour';
  static readonly minuteSelector = 'input.minute';
  static readonly secondSelector = 'input.second';
  static readonly kickOffTime = '2019-11-18 12:08:49.737';
  static readonly timeModelValue = '2019/11/18 12:08:49';
  static readonly defaultDate = '2019-11-09 12:08:49.737'; 
  static readonly fakeGetLogInfoModelList: GetLogInfoModel[] = [{
    matchId: 12345,
    validation: {
      isInvalidTotalTickets: false,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: false
    },
    ticketRequest: [{
      transIds: '123456789',
      requestId: 123
    }],
    logInfoDetail: null
  }];
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    getLogInfoModels: Helper.fakeGetLogInfoModelList,
    transInfoAddRequestModel: new TransInfoAddRequestModel()
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
}

describe('EventEarlyKickOffComponent', () => {
  @NgModule({
    declarations: [
      LeagueEventComponent,
      TicketsListComponent
    ],
    imports: [
      BlockUiModule,
      DateTimeModule,
      FormsModule,
      NgbModule
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
              .dontMock(DateTimeModule)
              .dontMock(NgbModule);
  });

  it('EventEarlyKickOffComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should call updateData', async () => {
    // Arrange
    const { instance } = await shallow
    .render({
        bind: {
          filter: Helper.fakeFilterModel
        }
      });
    instance.updateData = jest.fn();

    // Action
    await instance.ngOnInit();

    // Assert
    expect(instance.updateData).toHaveBeenCalledTimes(1);
  });
  
  it('#updateData should be set data for selectedMatch', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(HttpService, {
        postJson: jest.fn().mockImplementation(() => Helper.getFakeMatchInfo())
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel
        }
      });
    instance.eventDetailModel.matchId = 12345;

    // Action
    await instance.updateData();

    // Assert
    expect(instance.selectedMatch).toEqual(Helper.getFakeMatchInfo());
  });

  
  it('#updateData should be call getKickOffTime', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(HttpService, {
        postJson: jest.fn().mockImplementation(() => Helper.getFakeMatchInfo())
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel
        }
      });
    instance.getKickOffTime = jest.fn();

    // Action
    await instance.updateData();

    // Assert
    expect(instance.getKickOffTime).toHaveBeenCalledTimes(1);
  });

  it('#getKickOffTime should return kickOffTime from selected match', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.selectedMatch = Helper.getFakeMatchInfo();
    instance.isEdit = false;
    instance.eventDetailModel.matchId = 12345;
    instance.eventDetailModel.kickOffTime = new Date(Helper.kickOffTime);

    // Action
    await instance.getKickOffTime();

    // Assert
    expect(instance.kickOffTime.getValue()).toBe(Helper.timeModelValue);
  });

  it('#getKickOffTime should return kickOffTime from eventDetailModel', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.isEdit = true;
    instance.eventDetailModel.matchId = 12345;
    instance.eventDetailModel.kickOffTime = new Date(Helper.kickOffTime);

    // Action
    await instance.getKickOffTime();

    // Assert
    expect(instance.kickOffTime.getValue()).toBe(Helper.timeModelValue);
  });

  it('#getKickOffTime should init default for kickOffTime', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.isEdit = true;
    instance.eventDetailModel.matchId = null;
    instance.eventDetailModel.kickOffTime = new Date(Helper.kickOffTime);

    // Action
    await instance.getKickOffTime();

    // Assert
    expect(instance.kickOffTime).toStrictEqual(new TimeModel(new Date(moment().tz('Etc/GMT-8').format('YYYY-MM-DD HH:mm:ss.SSS'))));
  });

  it('#getTickets should return expected TableTicketsModel', async () => {
    // Arrange
    const { instance } = await shallow
    .mock(HttpService, {
      postJson: jest.fn().mockImplementation(() => Helper.getTableTicketsModel())
    })
    .render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });

    // Action
    await instance.getTickets();

    // Assert
    expect(instance.paging.total).toBe(24);
    expect(instance.tableTicketsModel.totalSingle).toBe(3);
    expect(instance.tableTicketsModel.totalParlay).toBe(0);
  });

  it('#isValid should return false and warningMessageList is empty', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.leagueEventComponent = new LeagueEventComponent(null, null);
    instance.leagueEventComponent.isMatchIdValid = jest.fn().mockImplementation(() => false);

    // Action
    const actual = await instance.isValid();

    // Assert
    expect(actual).toBe(false);
    expect(instance.warningMessageList).toStrictEqual([]);
  });

  it('#isValid should return true and call #getWarningMessage', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.leagueEventComponent = new LeagueEventComponent(null, null);
    instance.leagueEventComponent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    instance.getWarningMessage = jest.fn();

    // Action
    const actual = await instance.isValid();

    // Assert
    expect(actual).toBe(true);
    expect(instance.getWarningMessage).toHaveBeenCalledTimes(1);
  });

  it('#search should init expected query and call #getTickets', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.isValid = jest.fn().mockImplementation(() => true);
    instance.selectedMatch = Helper.getFakeMatchInfo();
    instance.eventDetailModel.kickOffTime = new Date(Helper.kickOffTime);
    instance.getTickets = jest.fn();

    // Action
    await instance.search();

    // Assert
    expect(instance.query.pageSize).toBe(500);
    expect(instance.query.pageIndex).toBe(0);
    expect(instance.query.issueTypeId).toBe(11);
    expect(instance.query.actionId).toBe(5);
    expect(instance.query.match).toStrictEqual(Helper.getFakeMatchInfo());
    expect(instance.getTickets).toHaveBeenCalledTimes(1);
  });

  it('#pagingEvent should init expected query of paging and call #getTickets', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.getTickets = jest.fn();
    instance.paging.page = 3;
    instance.paging.pageSize = 500;

    // Action
    await instance.pagingEvent();

    // Assert
    expect(instance.query.pageSize).toBe(500);
    expect(instance.query.pageIndex).toBe(2);
    expect(instance.getTickets).toHaveBeenCalledTimes(1);
  });

  it('#getWarningMessage should return warningMessageList correctly when is not edit request action', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn() })
      .mock(HttpService, {
        postJson: jest.fn().mockImplementation(() => Helper.fakeGetLogInfoViewModel)
      })
      .render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });

    // Action
    await instance.getWarningMessage();

    // Assert
    expect(instance.warningMessageList.length).toBe(1);
    expect(instance.warningMessageList[0]).toBe('Tickets 123456789 is existed in Request 123.');
  });
  
  it('#getWarningMessage should return warningMessageList correctly when edit request', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn() })
      .mock(HttpService, {
        postJson: jest.fn().mockImplementation(() => Helper.fakeGetLogInfoViewModel)
      })
      .render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.isEdit = true;

    // Action
    await instance.getWarningMessage();

    // Assert
    expect(instance.warningMessageList.length).toBe(1);
    expect(instance.warningMessageList[0]).toBe('Tickets 123456789 is existed in Request 123.');
  });
  
  it('#changeMatchInfo should be emit #matchIdChange', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
      bind: {
        filter: Helper.fakeFilterModel
      }
    });
    instance.matchIdChange.emit = jest.fn();

    // Action
    instance.changeMatchInfo(new MatchInfo());

    // Assert
    expect(instance.matchIdChange.emit).toHaveBeenCalledTimes(1);
  });
});
