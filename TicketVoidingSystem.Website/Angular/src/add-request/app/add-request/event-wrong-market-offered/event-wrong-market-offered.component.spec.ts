import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { AdvancedModeComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.component';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongMarketOfferedModel } from '../models/event-wrong-market-offered.model';
import { EventWrongMarketOfferedComponent } from './event-wrong-market-offered.component';
import { FilterTimeComponent } from './filter-time/filter-time.component';
import { LogInfoWrongMarketOfferedComponent } from './log-info-wrong-market-offered/log-info-wrong-market-offered.component';
import { FilterWrongMarketOfferedModel } from './models/filter-wrong-market-offered.model';
import { LogInfoWrongMarketOffered } from './models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { EventWrongMarketOfferedService } from './services/event-wrong-market-offfered.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterWrongMarketOfferedModel: FilterWrongMarketOfferedModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate
  };
  static readonly fakeWrongMarketOfferedModel: WrongMarketOfferedModel = {
    betTypeCount: [],
    filterFromTransTime: Helper.fromDate,
    filterToTransTime: Helper.toDate,
    subIssueTypeId: 1,
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
  } as WrongMarketOfferedModel;
  static readonly fakeLogInfoWrongMarketOffered: LogInfoWrongMarketOffered = {
    matchId: 1,
    filterWrongMarketOfferedModels: Helper.fakeFilterWrongMarketOfferedModel,
    logInfoDetails: new LogInfoDetail(),
    messageValidationLogInfo: [],
    betTypeCount: [],
    betTeamsResult: []
  } as LogInfoWrongMarketOffered;
}

describe('EventWrongMarketOfferedComponent', () => {
  @NgModule({
    declarations: [
      FilterTimeComponent,
      EventLeagueComponent,
      LogInfoWrongMarketOfferedComponent,
      AdvancedModeAddRequestComponent,
      EventLeagueComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
      AddRequestStore,
      ValidationService,
      LogInfoService,
      SaveRequestService,
      CommonService,
      EventWrongMarketOfferedService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventWrongMarketOfferedComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventWrongMarketOfferedComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('EventWrongMarketOfferedComponent init should match snapshot', async () => {
    const component = new EventWrongMarketOfferedComponent(null, null, null, null, null, null);
    component.wrongMarketOfferedModels = Helper.fakeWrongMarketOfferedModel;

    expect(component).toMatchSnapshot();
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
        wrongMarketOfferedModel: Helper.fakeWrongMarketOfferedModel,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);

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
        wrongMarketOfferedModel: Helper.fakeWrongMarketOfferedModel,
      }
    });
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);

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
        wrongMarketOfferedModel: Helper.fakeWrongMarketOfferedModel,
      }
    });
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);
    instance.advancedMode.advancedModeComponent = new AdvancedModeComponent(null, null, null);
    instance.advancedMode.advancedModeComponent.getAllBetTypesSelection = jest.fn().mockReturnValue([]);
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();

    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should emit updateMatchId when leagueEventWrongOddsComponent not null', async () => {
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .mock(AddRequestStore, {
      changeBlockingUiStatus: jest.fn(),
      changeSavingRequestStatus: jest.fn(),
      changeStartTimeFilterAnalysis: jest.fn()
     })
    .render({
      bind: {
        isEdit: false,
        filter: new FilterModel(),
      }
    });
    instance.eventLeague = new EventLeagueComponent(null, null, null);
    instance.eventLeague.selectedMatch = new MatchModel();
    instance.eventLeague.selectedMatch.matchId = 1;
    instance.primitivePropertyEvent = new PrimitivePropertyEvent();
    instance.logInfoEvent = Helper.fakeLogInfoWrongMarketOffered;
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);
    instance.advancedMode.clearBetTeam = jest.fn();

    await instance.changeMatchEvent();

    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });
});