import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { LinkedLogsViewModel } from '../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../filter/filter.model';
import { EventWrongOddsComponent } from './event-wrong-odds.component';
import { FilterWrongOddsComponent } from './filter-wrong-odds/filter-wrong-odds.component';
import { LogInfoWrongOddsComponent } from './log-info-wrong-odds/log-info-wrong-odds.component';
import { FilterWrongOddsModel } from './models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from './models/log-info-wrong-odds.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { EventWrongOddsService } from './services/event-wrong-odds.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { MatchModel } from '../../../../utility/models/match.model';
class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: 12345,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeFromDateTime),
    voidToTime: new Date(Helper.fakeToDateTime),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    instantlySettleCount: 2,
    scoreNormalTicket: '',
    scoreOfMatch: '',
    cancelCashOutCount: 1
  } as LogInfoDetail;
  static readonly fakeFilterWrongOddsModel: FilterWrongOddsModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    betTeam: 'h',
    correctOdds: '1',
    favoriteValue: '1',
    filterFavoriteType: 'h',
    filterOddsType: 'value',
    filterOuType: 'h',
    fromOdds: '1',
    oddsValue: '1',
    ouValue: '1',
    liveIndicator: 0,
    toOdds: '1'
  };
  static readonly fakeLogInfoWrongOdds: LogInfoWrongOdds = {
    matchId: 12345,
    filterWrongOdds: new FilterWrongOddsModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: new LinkedLogsViewModel(),
    poolHouseCheckedBetTypes: ''
  };
}

describe('EventWrongOddsComponent', () => {
  @NgModule({
    declarations: [
      LeagueEventRedCardComponent,
      LogInfoWrongOddsComponent,
      FilterWrongOddsComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule
    ],
    providers: [
      ValidationService,
      EventWrongOddsService,
      AddRequestStore,
      LogInfoService,
      SaveRequestService,
      AddRequestApiService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventWrongOddsComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventWrongOddsComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#EventWrongOddsComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .mock(EventWrongOddsService, { initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()) })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel()
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should assign model to logInfoEvent', async () => {
    const { instance } = await shallow
    .mock(EventWrongOddsService, {
      assignModelsToEvents: jest.fn().mockImplementation(() => Helper.fakeLogInfoWrongOdds),
      initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => Helper.fakeLogInfoWrongOdds)
    })
    .render({
      bind: {
        filter: new FilterModel()
      }
    });

    [true, false].forEach(x => {
      instance.isEdit = x;
      instance.ngOnInit();
      expect(instance.logInfoEvent.isPoolHouseAffected).toBe(Helper.fakeLogInfoWrongOdds.isPoolHouseAffected);
      expect(instance.logInfoEvent.linkedLogsViewModel).toBe(Helper.fakeLogInfoWrongOdds.linkedLogsViewModel);
    });
  });

  it('#clickSearch should call #handleSearchEvent', async () => {
    const { instance } = await shallow
    .mock(EventWrongOddsService, { initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()) })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel()
      }
    });
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;
    instance.handleSearchEvent = jest.fn();
    await instance.clickSearch();

    expect(instance.handleSearchEvent).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should return false when validationService.validateCommonData', async () => {
    const mockValidateCommonData = jest.fn().mockImplementation(() => false);
    const { instance } = await shallow
    .mock(EventWrongOddsService, { initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()) })
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .mock(ValidationService, { validateCommonData: mockValidateCommonData })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;
    await instance.handleSearchEvent();

    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should call #logInfoService.getLogInfo', async () => {
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, {
      resetLogInfoOfEvent: jest.fn(),
      getLogInfo: mockGetLogInfo
    })
    .mock(ValidationService, { validateCommonData: jest.fn().mockImplementation(() => true) })
    .mock(EventWrongOddsService, {
      getLinkedLog: jest.fn(),
      initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds())
    })
    .mock(AddRequestStore, {
      changeBlockingUiStatus: jest.fn(),
      changeSavingRequestStatus: jest.fn()
    })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;

    await instance.handleSearchEvent();

    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#saveRequest should call #saveRequestService.saveRequest', async () => {
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
    .mock(SaveRequestService, { saveRequest: mockSaveRequest })
    .mock(EventWrongOddsService, {
      initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()),
      getLinkedLog: jest.fn()})
    .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance['initSaveRequestInput'] = jest.fn();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;

    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#initSaveRequestInput should return expected argument', async () => {
    const { instance } = await shallow
    .mock(EventWrongOddsService, { initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()) })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.requestId = 1;
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;

    const actual = instance['initSaveRequestInput']();

    expect(actual.isEdit).toBe(false);
    expect(actual.requestId).toBe(1);
  });

  it('#changeMatchEvent should emit updateMatchId', async () => {
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .mock(EventWrongOddsService, { initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()) })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.leagueEventWrongOddsComponent = null;
    instance.primitiveProps = new PrimitiveProperty();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;

    instance.changeMatchEvent();

    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should emit updateMatchId when leagueEventWrongOddsComponent not null', async () => {
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .mock(EventWrongOddsService, { initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()) })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.leagueEventWrongOddsComponent = new LeagueEventRedCardComponent(null, null);
    instance.leagueEventWrongOddsComponent.selectedMatch = new MatchModel();
    instance.primitiveProps = new PrimitiveProperty();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;

    instance.changeMatchEvent();

    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#resetLogInfoOfEvent should call #resetLogInfoOfEvent', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
    .mock(EventWrongOddsService, { initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()) })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.leagueEventWrongOddsComponent = null;
    instance.primitiveProps = new PrimitiveProperty();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;

    instance.resetLogInfoOfEvent();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
  });
});