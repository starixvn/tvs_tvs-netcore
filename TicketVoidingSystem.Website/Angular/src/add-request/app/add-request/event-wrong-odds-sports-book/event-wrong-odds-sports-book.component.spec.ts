import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../filter/filter.model';
import { WrongOddsSportsBookModel } from '../models/event-wrong-odds-sports-book.model';
import { EventWrongOddsSportsBookComponent } from './event-wrong-odds-sports-book.component';
import { FilterWrongOddsSportsBookComponent } from './filter-wrong-odds-sports-book/filter-wrong-odds-sports-book.component';
import { LogInfoWrongOddsSportsBookComponent } from './log-info-wrong-odds-sports-book/log-info-wrong-odds-sports-book.component';
import { FilterWrongOddsSportsBookModel } from './models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from './models/log-info-wrong-odds-sports-book.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { EventWrongOddsSportsBookService } from './services/event-wrong-odds-sports-book.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { ConfirmAddRequestComponent } from '../confirm-add-request/confirm-add-request.component';
class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterWrongOddsSportsBookModel: FilterWrongOddsSportsBookModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate,
    correctOdds: '1.5',
    filterOddsType: '1',
    fromOdds: '1.5',
    liveIndicator: 1,
    oddsValue: '1.5',
    toOdds: '1.5'
  };
  static readonly fakeWrongOddsSportsBookModel: WrongOddsSportsBookModel = {
    filterFromTransTime: Helper.fromDate,
    filterToTransTime: Helper.toDate,
    subIssueTypeId: 1,
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    actualMarket: '1',
    correctOdds: '1.5',
    filterOddsType: '1',
    fromOdds: '1.5',
    liveIndicator: 1,
    oddsValue: '1.5',
    toOdds: '1.5'
  };
  static readonly fakeLogInfoWrongOddsSportsBook: LogInfoWrongOddsSportsBook = {
    matchId: 1,
    filterWrongOddsSportsBook: Helper.fakeFilterWrongOddsSportsBookModel,
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
    betTeamsResult: [],
    checkedBetTypes: []
  };
}

describe('EventWrongOddsSportsBookComponent', () => {
  @NgModule({
    declarations: [
      FilterWrongOddsSportsBookComponent,
      LeagueEventRedCardComponent,
      LogInfoWrongOddsSportsBookComponent,
      AdvancedModeAddRequestComponent,
      ConfirmAddRequestComponent,
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
      EventWrongOddsSportsBookService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventWrongOddsSportsBookComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventWrongOddsSportsBookComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('EventWrongOddsSportsBookComponent init should match snapshot', async () => {
    const component = new EventWrongOddsSportsBookComponent(null, null, null, null, null, null);
    component.wrongOddsSportsBookModel = Helper.fakeWrongOddsSportsBookModel;

    expect(component).toMatchSnapshot();
  });

  it('handleSearchEvent should call #logInfoService.getLogInfo', async () => {
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
        wrongOddsSportsBookModel: Helper.fakeWrongOddsSportsBookModel,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);

    await instance.handleSearchEvent();

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
        wrongOddsSportsBookModel: Helper.fakeWrongOddsSportsBookModel,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);

    await instance.handleSearchEvent();

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
        wrongOddsSportsBookModel: Helper.fakeWrongOddsSportsBookModel,
      }
    });
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);
    instance.primitiveProps = new PrimitiveProperty();

    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should emit updateMatchId when eventLeagueComponent not null', async () => {
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
    instance.eventLeagueComponent = new EventLeagueComponent(null, null);
    instance.eventLeagueComponent.selectedMatch = new MatchModel();
    instance.eventLeagueComponent.selectedMatch.matchId = 1;
    instance.primitiveProps = new PrimitiveProperty();
    instance.logInfoEvent = Helper.fakeLogInfoWrongOddsSportsBook;
    instance.advancedMode = new AdvancedModeAddRequestComponent();
    instance.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);
    instance.advancedMode.clearBetTeam = jest.fn();

    await instance.changeMatchEvent();

    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });
});