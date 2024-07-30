import { ElementRef, NgModule, SimpleChanges, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { LinkedLogsViewModel } from '../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { EventWrongOddsComponent } from './event-wrong-odds.component';
import { FilterWrongOddsComponent } from './filter-wrong-odds/filter-wrong-odds.component';
import { LogInfoWrongOddsComponent } from './log-info-wrong-odds/log-info-wrong-odds.component';
import { FilterWrongOddsModel, MaxBetAndSpreadInfo } from './models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from './models/log-info-wrong-odds.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { EventWrongOddsService } from './services/event-wrong-odds.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { MatchModel } from '../../../../utility/models/match.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { CalculateOddsService } from './services/calculate-odds.service';
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
    favoriteValue: '1',
    filterFavoriteType: 'h',
    liveIndicator: 1,
    spread: '0.2',
    maxBet: 0,
    allowanceRate: '20',
    correctOddsHomeOver: '0.8',
    correctOddsAwayUnder: '0.9',
    fromOddsNotVoidHomeOver: '0.65',
    toOddsNotVoidHomeOver: '0.85',
    fromOddsNotVoidAwayUnder: '0.5',
    toOddsNotVoidAwayUnder: '0.9',
    maxBetAndSpreadInfo: []
  };
  static readonly fakeLogInfoWrongOdds: LogInfoWrongOdds = {
    matchId: 12345,
    filterWrongOdds: new FilterWrongOddsModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: new LinkedLogsViewModel(),
    poolHouseCheckedBetTypes: '',
    isShowValidation: false
  };
  static readonly fakeMatch: MatchModel = {
    matchId: 876543,
    matchCode: '345678',
    leagueName: 'abc',
    matchEvent: 'xyz'
  }
  static readonly FakeFilter: FilterModel = {
    sportType: 7,
    subIssueTypeId: '2',
    action: '',
    isTest: false,
    isAbnormal: false,
    isVoided: false,
    isChangeSubTypeManual: false
  }
}

describe('EventWrongOddsComponent', () => {
  @NgModule({
    declarations: [
      EventLeagueComponent,
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
      AddRequestApiService,
      CalculateOddsService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventWrongOddsComponent>;

  beforeEach(() => {
    jest.clearAllMocks();
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
        filter: Helper.FakeFilter
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
  
  it('should call GetMaxBetAndSpreadOfEvent and resetOddsInfo if filter is changed and isChangeSubTypeManual is true', async () => {
    const mockFunctionResetOddsInfo = jest.fn();
    const mockFunctionGetMaxBetAndSpreadOfEvent = jest.fn();

    const { instance } = await shallow
    .mock(EventWrongOddsService, {
      assignModelsToEvents: jest.fn().mockImplementation(() => Helper.fakeLogInfoWrongOdds),
      initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => Helper.fakeLogInfoWrongOdds)
    })
    .mock(CalculateOddsService, { resetOddsInfo: mockFunctionResetOddsInfo, createMaxBetAndSpreadQuery: jest.fn()})
    .mock(AddRequestApiService, { getMaxBetAndSpreadOfEvent: mockFunctionGetMaxBetAndSpreadOfEvent})
    .render({
      bind: {
        filter: Helper.FakeFilter
      }
    });

    let newFilter = Helper.FakeFilter;
    newFilter.isChangeSubTypeManual = true;

    const changes: SimpleChanges = {
      filter: new SimpleChange(Helper.FakeFilter, newFilter, true)
    };

    await instance.ngOnChanges(changes);

    expect(mockFunctionGetMaxBetAndSpreadOfEvent).toHaveBeenCalled();
    expect(mockFunctionResetOddsInfo).toHaveBeenCalledWith(instance.filterWrongOddsComponent.filterWrongOddsModel, instance.filter.subIssueTypeId);
  });

  it('should not call GetMaxBetAndSpreadOfEvent if maxBetAndSpreadInfo is already set', async () => {
    const mockFunctionResetOddsInfo = jest.fn();
    const mockFunctionGetMaxBetAndSpreadOfEvent = jest.fn();

    const { instance } = await shallow
    .mock(EventWrongOddsService, {
      assignModelsToEvents: jest.fn().mockImplementation(() => Helper.fakeLogInfoWrongOdds),
      initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => Helper.fakeLogInfoWrongOdds)
    })
    .mock(CalculateOddsService, { resetOddsInfo: mockFunctionResetOddsInfo, createMaxBetAndSpreadQuery: jest.fn()})
    .mock(AddRequestApiService, { getMaxBetAndSpreadOfEvent: mockFunctionGetMaxBetAndSpreadOfEvent})
    .render({
      bind: {
        filter: Helper.FakeFilter
      }
    });
    instance.filterWrongOddsComponent.filterWrongOddsModel.maxBetAndSpreadInfo = [new MaxBetAndSpreadInfo()]
    let newFilter = Helper.FakeFilter;
    newFilter.isChangeSubTypeManual = true;

    const changes: SimpleChanges = {
      filter: new SimpleChange(Helper.FakeFilter, newFilter, true)
    };

    await instance.ngOnChanges(changes);

    expect(mockFunctionGetMaxBetAndSpreadOfEvent).not.toHaveBeenCalled();
    expect(mockFunctionResetOddsInfo).toHaveBeenCalledWith(instance.filterWrongOddsComponent.filterWrongOddsModel, instance.filter.subIssueTypeId);
  });

  it('#ngOnChanges should not call resetOddsInfo if filter is not changed', async () => {
    const mockFunctionResetOddsInfo = jest.fn();
    const mockFunctionGetMaxBetAndSpreadOfEvent = jest.fn();
    const newFilter = new FilterModel();
    const { instance } = await shallow
    .mock(EventWrongOddsService, {
      assignModelsToEvents: jest.fn().mockImplementation(() => Helper.fakeLogInfoWrongOdds),
      initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => Helper.fakeLogInfoWrongOdds)
    })
    .mock(CalculateOddsService, { resetOddsInfo: mockFunctionResetOddsInfo, createMaxBetAndSpreadQuery: jest.fn()})
    .mock(AddRequestApiService, { getMaxBetAndSpreadOfEvent: mockFunctionGetMaxBetAndSpreadOfEvent})
    .render({
      bind: {
        filter: newFilter
      }
    });
    
    const changes: SimpleChanges = {
      filter: new SimpleChange(newFilter, newFilter, false)
    };

    await instance.ngOnChanges(changes);

    expect(mockFunctionGetMaxBetAndSpreadOfEvent).not.toHaveBeenCalled();
    expect(mockFunctionResetOddsInfo).not.toHaveBeenCalled();
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

  it('#handleSearchEvent validateCommonData should call getLogInfo & getLogInfo', async () => {
    const mockGetLogInfo = jest.fn();
    const mockGetLinkedLog = jest.fn();

    const { instance } = await shallow
    .mock(LogInfoService, {
      resetLogInfoOfEvent: jest.fn(),
      getLogInfo: mockGetLogInfo
    })
    .mock(ValidationService, { validateCommonData: jest.fn().mockImplementation(() => true) })
    .mock(CalculateOddsService, { calculateOddsRange: jest.fn()})
    .mock(EventWrongOddsService, {
      getLinkedLog: mockGetLinkedLog,
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
    expect(mockGetLinkedLog).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent not validateCommonData should not call getLogInfo & getLogInfo', async () => {
    const mockGetLogInfo = jest.fn();
    const mockGetLinkedLog = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, {
      resetLogInfoOfEvent: jest.fn(),
      getLogInfo: mockGetLogInfo
    })
    .mock(ValidationService, { validateCommonData: jest.fn().mockReturnValue(false)})
    .mock(EventWrongOddsService, {
      getLinkedLog: mockGetLinkedLog,
      initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds())
    })
    
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });

    await instance.handleSearchEvent();

    expect(mockGetLogInfo).toHaveBeenCalledTimes(0);
    expect(mockGetLinkedLog).toHaveBeenCalledTimes(0);
  });

  it('#saveRequest should call #saveRequestService.saveRequest', async () => {
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
    .mock(SaveRequestService, { saveRequest: mockSaveRequest })
    .mock(CalculateOddsService, { calculateOddsRange: jest.fn() })
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

  it('#changeMatchEvent should emit updateMatchId when selectedMatch not null', async () => {
    const mockFunctionUpdateOddsInfo = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .mock(EventWrongOddsService, { initDefaultLogInfoWrongOdds: jest.fn().mockImplementation(() => new LogInfoWrongOdds()) })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .mock(CalculateOddsService, { updateOddsInfo: mockFunctionUpdateOddsInfo })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.eventLeagueComponent = new EventLeagueComponent(null, null);
    instance.eventLeagueComponent.selectedMatch = Helper.fakeMatch;
    instance.primitiveProps = new PrimitiveProperty();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;
    instance.updateMatchId.emit = jest.fn();;

    instance.changeMatchEvent();

    expect(mockFunctionUpdateOddsInfo).toHaveBeenCalledTimes(1);
    expect(instance.logInfoEvent.matchId).toBe(Helper.fakeMatch.matchId);
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
    instance.eventLeagueComponent = null;
    instance.primitiveProps = new PrimitiveProperty();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOdds;

    instance.resetLogInfoOfEvent();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
  });
});