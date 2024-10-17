import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { NotParticipateModel } from '../models/event-not-participate.model';
import { EventNotParticipateComponent } from './event-not-participate.component';
import { FilterNotParticipateComponent } from './filter-not-participate/filter-not-participate.component';
import { LogInfoNotParticipateComponent } from './log-info-not-participate/log-info-not-participate.component';
import { FilterNotParticipateModel } from './models/filter-not-participate.model';
import { LogInfoNotParticipate } from './models/log-info-not-participate.model';
import { NotParticipateBetTypeViewModel } from './models/not-participate-bet-type.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { EventNotParticipateService } from './services/event-not-participate.service';
import { FilterNotParticipateService } from './services/filter-not-participate.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeNotParticipateModels: NotParticipateModel[] = [
    {
      betTypeIds: '1',
      playerId: 1,
      subIssueTypeId: 1,
      logInfoDetail: new LogInfoDetail(),
      matchId: 1,
      playerNames: ''
    }
  ];
  static readonly fakeLogInfoNotParticipate: LogInfoNotParticipate = {
    matchId: 1,
    filterNotParticipates: [],
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  };
  static readonly fakeFilterNotParticipateModel: FilterNotParticipateModel = {
    playerId: 1,
    betTypeIds: [],
    betTypeMultipleSelection: null
  };
}

describe('EventNotParticipateComponent', () => {
  @NgModule({
    declarations: [
      FilterNotParticipateComponent,
      EventLeagueComponent,
      LogInfoNotParticipateComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
      FilterNotParticipateService,
      AddRequestStore,
      ValidationService,
      LogInfoService,
      SaveRequestService,
      EventNotParticipateService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventNotParticipateComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventNotParticipateComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('EventNotParticipateComponent init should match snapshot', async () => {
    const component = new EventNotParticipateComponent(null, null, null, null, null, null);
    component.notParticipateModels = Helper.fakeNotParticipateModels;

    expect(component).toMatchSnapshot();
  });

  it('ngOnInit should call #updateModelWhenChangeMatchId when isEdit', async () => {
    const { instance } = await shallow
    .mock(EventNotParticipateService, { assignModelsToEvents: jest.fn().mockReturnValue(Helper.fakeLogInfoNotParticipate) })
    .mock(FilterNotParticipateService, { initDefaultBetTypeSelection: jest.fn().mockReturnValue(null) })
    .render({
      bind: {
        isEdit: true,
        filter: new FilterModel(),
        notParticipateModels: Helper.fakeNotParticipateModels,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.logInfoEvent = Helper.fakeLogInfoNotParticipate;
    instance.logInfoEvent.filterNotParticipates = [Helper.fakeFilterNotParticipateModel];
    instance['updateModelWhenChangeMatchId'] = jest.fn();

    instance.ngOnInit();

    expect(instance['updateModelWhenChangeMatchId']).toHaveBeenCalledTimes(1);
  });

  it('updateModelWhenChangeMatchId should call #filterService.getPlayers', async () => {
    const mockBetTypes = jest.fn().mockReturnValue(new NotParticipateBetTypeViewModel());
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(FilterNotParticipateService, {
      getNotParticipateBetTypes: mockBetTypes
    })
    .mock(AddRequestStore, {
      changeBlockingUiStatus: mockChangeBlockingUiStatus,
    })
    .render({
      bind: {
        filter: new FilterModel(),
        notParticipateModels: Helper.fakeNotParticipateModels,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();

    await instance['updateModelWhenChangeMatchId']();

    expect(mockBetTypes).toHaveBeenCalledTimes(1);
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
        notParticipateModels: Helper.fakeNotParticipateModels,
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
        notParticipateModels: Helper.fakeNotParticipateModels,
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
        notParticipateModels: Helper.fakeNotParticipateModels,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();

    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should emit updateMatchId when leagueEventWrongOddsComponent not null', async () => {
    const { instance } = await shallow
    .mock(FilterNotParticipateService, { initDefaultFilter: jest.fn().mockReturnValue(new FilterNotParticipateModel()) })
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.eventLeagueComponent = new EventLeagueComponent(null, null);
    instance.eventLeagueComponent.selectedMatch = new MatchModel();
    instance.eventLeagueComponent.selectedMatch.matchId = 1;
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.logInfoEvent = Helper.fakeLogInfoNotParticipate;
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
    instance.eventLeagueComponent = new EventLeagueComponent(null, null);
    instance.eventLeagueComponent = null;
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.logInfoEvent = Helper.fakeLogInfoNotParticipate;
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