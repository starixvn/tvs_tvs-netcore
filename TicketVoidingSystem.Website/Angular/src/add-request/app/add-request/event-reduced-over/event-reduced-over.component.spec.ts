import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { MultipleSelection } from '../../../../utility/components/multiple-selection/multiple-selection';
import { NgSelectMixtureModel } from '../../../../utility/components/ng-select-mixture/ng-select-mixture.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../filter/filter.model';
import { ReducedOverModel } from '../models/event-reduced-over.model';
import { EventReducedOverComponent } from './event-reduced-over.component';
import { FilterReducedOverComponent } from './filter-reduced-over/filter-reduced-over.component';
import { LogInfoReducedOverComponent } from './log-info-reduced-over/log-info-reduced-over.component';
import { ReducedOverBetType } from './models/bet-type-reduced-over-json.model';
import { FilterReducedOverModel } from './models/filter-reduced-over.model';
import { LogInfoReducedOver } from './models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { EventReducedOverService } from './services/event-reduced-over.service';
import { FilterReducedOverService } from './services/filter-reduced-over.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { MatchModel } from '../../../../utility/models/match.model';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeReducedOverModels: ReducedOverModel[] = [
    {
      betTypeIds: '1,2',
      live: true,
      nonLive: true,
      matchId: 1,
      playerIds: '1',
      wicketOver: '1',
      filterWicketOver: '1',
      runs: '1',
      subIssueTypeId: 1,
      logInfoDetail: new LogInfoDetail()
    }
  ];
  static readonly fakeLogInfoReducedOver: LogInfoReducedOver = {
    matchId: 1,
    filterReducedOvers: [],
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  };
  static readonly fakeFilterReducedOverModel: FilterReducedOverModel = {
    betTypeIds: [],
    playerIds: [],
    live: true,
    nonLive: true,
    runs: '',
    wicketOver: '',
    betTypeNgSelectMixtureModel: new NgSelectMixtureModel(),
    playerMultipleSelection: new MultipleSelection()
  };
  static readonly fakeReducedOverBetTypes: ReducedOverBetType[] = [
    {
      betTypeId: 1,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    },
    {
      betTypeId: 2,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    }
  ];
}

describe('EventReducedOverComponent', () => {
  @NgModule({
    declarations: [
      FilterReducedOverComponent,
      LeagueEventRedCardComponent,
      LogInfoReducedOverComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
      FilterReducedOverService,
      AddRequestStore,
      ValidationService,
      LogInfoService,
      SaveRequestService,
      EventReducedOverService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventReducedOverComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventReducedOverComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('EventReducedOverComponent init should match snapshot', async () => {
    const component = new EventReducedOverComponent(null, null, null, null, null, null);
    component.reducedOverModels = Helper.fakeReducedOverModels;

    expect(component).toMatchSnapshot();
  });

  it('ngOnInit should call #updateModelWhenChangeMatchId when isEdit', async () => {
    const { instance } = await shallow
    .mock(FilterReducedOverService, {
      initBetTypeNgSelectMixtureModel: jest.fn(),
      initDefaultPlayerSelection: jest.fn()
    })
    .mock(EventReducedOverService, { assignModelsToEvents: jest.fn().mockReturnValue(Helper.fakeLogInfoReducedOver) })
    .render({
      bind: {
        isEdit: true,
        filter: new FilterModel(),
        reducedOverModels: Helper.fakeReducedOverModels,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.logInfoEvent = Helper.fakeLogInfoReducedOver;
    instance.logInfoEvent.filterReducedOvers = [Helper.fakeFilterReducedOverModel];
    instance['updateModelWhenChangeMatchId'] = jest.fn();

    instance.ngOnInit();

    expect(instance['updateModelWhenChangeMatchId']).toHaveBeenCalledTimes(1);
  });

  it('updateModelWhenChangeMatchId should call #filterService.getPlayers', async () => {
    const mockGetReducedOverBetTypes = jest.fn().mockReturnValue(Helper.fakeReducedOverBetTypes);
    const mockGetPlayers = jest.fn();
    const mockChangeBlockingUiStatus = jest.fn();
    const mockRenderGroupReducedOverBetTypes = jest.fn();
    const { instance } = await shallow
    .mock(FilterReducedOverService, {
      getPlayers: mockGetPlayers,
      getReducedOverBetTypes: mockGetReducedOverBetTypes,
      renderGroupReducedOverBetTypes: mockRenderGroupReducedOverBetTypes
    })
    .mock(AddRequestStore, {
      changeBlockingUiStatus: mockChangeBlockingUiStatus,
    })
    .render({
      bind: {
        filter: new FilterModel(),
        reducedOverModels: Helper.fakeReducedOverModels,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();

    await instance['updateModelWhenChangeMatchId']();

    expect(mockRenderGroupReducedOverBetTypes).toHaveBeenCalledTimes(1);
    expect(mockGetReducedOverBetTypes).toHaveBeenCalledTimes(1);
    expect(mockGetPlayers).toHaveBeenCalledTimes(1);
    expect(mockChangeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('clickSearch should call #logInfoService.getLogInfo', async () => {
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(ValidationService, { validateCommonData: jest.fn().mockReturnValue(true) })
    .mock(AddRequestStore, {
      changeBlockingUiStatus: jest.fn(),
      changeSavingRequestStatus: jest.fn()
     })
    .mock(LogInfoService, { getLogInfo: mockGetLogInfo })
    .render({
      bind: {
        filter: new FilterModel(),
        reducedOverModels: Helper.fakeReducedOverModels,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();

    await instance.clickSearch();

    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('clickSearch should not call #logInfoService.getLogInfo when not valid', async () => {
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(ValidationService, { validateCommonData: jest.fn().mockReturnValue(false) })
    .mock(AddRequestStore, {
      changeBlockingUiStatus: jest.fn(),
      changeSavingRequestStatus: jest.fn()
     })
    .mock(LogInfoService, { getLogInfo: mockGetLogInfo })
    .render({
      bind: {
        filter: new FilterModel(),
        reducedOverModels: Helper.fakeReducedOverModels,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();

    await instance.clickSearch();

    expect(mockGetLogInfo).toHaveBeenCalledTimes(0);
  });

  it('saveRequest should call #saveRequestService.saveRequest', async () => {
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
    .mock(ValidationService, { validateCommonData: jest.fn().mockReturnValue(false) })
    .mock(AddRequestStore, {
      changeBlockingUiStatus: jest.fn(),
     })
    .mock(SaveRequestService, { saveRequest: mockSaveRequest })
    .render({
      bind: {
        filter: new FilterModel(),
        reducedOverModels: Helper.fakeReducedOverModels,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();

    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should emit updateMatchId when leagueEventWrongOddsComponent not null', async () => {
    const { instance } = await shallow
    .mock(FilterReducedOverService, { initDefaultFilter: jest.fn().mockReturnValue(new FilterReducedOverModel()) })
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.leagueEventReducedOverComponent = new LeagueEventRedCardComponent(null, null);
    instance.leagueEventReducedOverComponent.selectedMatch = new MatchModel();
    instance.leagueEventReducedOverComponent.selectedMatch.matchId = 1;
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.logInfoEvent = Helper.fakeLogInfoReducedOver;
    instance['updateModelWhenChangeMatchId'] = jest.fn();

    await instance.changeMatchEvent();

    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should not call #updateModelWhenChangeMatchId when leagueEventWrongOddsComponent null', async () => {
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.leagueEventReducedOverComponent = new LeagueEventRedCardComponent(null, null);
    instance.leagueEventReducedOverComponent = null;
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.logInfoEvent = Helper.fakeLogInfoReducedOver;
    instance['updateModelWhenChangeMatchId'] = jest.fn();
    await instance.changeMatchEvent();

    expect(instance['updateModelWhenChangeMatchId']).toHaveBeenCalledTimes(0);
  });

  it('#resetLogInfoOfEvent should call #logInfoService.resetLogInfoOfEvent', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.resetLogInfoOfEvent();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
  });
});