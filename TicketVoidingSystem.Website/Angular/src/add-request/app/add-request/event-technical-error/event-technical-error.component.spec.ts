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
import { ConfirmAddRequestComponent } from '../confirm-add-request/confirm-add-request.component';
import { FilterModel } from '../filter/filter.model';
import { TechnicalErrorModel } from '../models/event-technical-error.model';
import { EventTechnicalErrorComponent } from './event-technical-error.component';
import { FilterTimeTechnicalErrorComponent } from './filter-time-technical-error/filter-time-technical-error.component';
import { LogInfoTechnicalErrorComponent } from './log-info-technical-error/log-info-technical-error.component';
import { FilterTechnicalErrorModel } from './models/filter-technical-error.model';
import { LogInfoTechnicalError } from './models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { EventTechnicalErrorService } from './services/event-technical-error.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterTechnicalErrorModel: FilterTechnicalErrorModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate
  };
  static readonly fakeTechnicalErrorModel: TechnicalErrorModel = {
    betTypeCount: [],
    filterFromTransTime: Helper.fromDate,
    filterToTransTime: Helper.toDate,
    subIssueTypeId: 1,
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
  } as TechnicalErrorModel;
  static readonly fakeLogInfoTechnicalError: LogInfoTechnicalError = {
    matchId: 1,
    filterTechnicalErrorModel: Helper.fakeFilterTechnicalErrorModel,
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
    betTypeCount: [],
    betTeamsResult: []
  } as LogInfoTechnicalError;
}

describe('EventTechnicalErrorComponent', () => {
  @NgModule({
    declarations: [
      FilterTimeTechnicalErrorComponent,
      EventLeagueComponent,
      LogInfoTechnicalErrorComponent,
      AdvancedModeAddRequestComponent,
      EventLeagueComponent,
      ConfirmAddRequestComponent
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
      EventTechnicalErrorService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventTechnicalErrorComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventTechnicalErrorComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('EventTechnicalErrorComponent init should match snapshot', async () => {
    const component = new EventTechnicalErrorComponent(null, null, null, null, null, null);
    component.technicalErrorModel = Helper.fakeTechnicalErrorModel;

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
        technicalErrorModel: Helper.fakeTechnicalErrorModel,
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
        technicalErrorModel: Helper.fakeTechnicalErrorModel,
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
        technicalErrorModel: Helper.fakeTechnicalErrorModel,
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
    instance.logInfoEvent = Helper.fakeLogInfoTechnicalError;
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);
    instance.advancedMode.clearBetTeam = jest.fn();

    await instance.changeMatchEvent();

    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });
});