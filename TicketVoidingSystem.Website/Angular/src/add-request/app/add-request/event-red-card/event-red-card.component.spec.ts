import { ElementRef, NgModule, QueryList, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Shallow } from 'shallow-render';
import { AddChildMatchModel } from '../../../../utility/components/add-child-match/add-child-match.model';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { MatchType, SubIssueTypeGroup, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { AllowanceTime } from '../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { RedCardModel } from '../models/event-red-card.model';
import { ValidationMessage } from '../models/get-log-info.model';
import { ChildMatchModel } from '../models/related-event.model';
import { AddChildMatchComponent } from './../../../../utility/components/add-child-match/add-child-match.component';
import { ConfirmRedCardComponent } from './confirm-red-card/confirm-red-card.component';
import { EventRedCardComponent } from './event-red-card.component';
import { PrimitiveProperty } from './event-red-card.model';
import { FilterTimeAreaComponent } from './filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowanceComponent } from './filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from './filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCardComponent } from './log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from './log-info-red-card/log-info-red-card.model';
import { EventRedCardService } from './services/event-red-card.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeAllowanceTime: AllowanceTime = {
    aaTime: 1,
    paTime: 1,
    saTime: 1,
  };
  static readonly fakeFilterTimeWithAllowance: FilterTimeWithAllowance = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
    aaTime: 1,
    paTime: 12,
    saTime: 12,
  };
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  };
  static readonly fakeRedCardModel: RedCardModel = {
    matchId: 39420383,
    filterBy: TVSRequestFilterBy.CHECK_TIME,
    filterFromTransTime: null,
    filterToTransTime: null,
    aaTime: 1,
    paTime: 2,
    saTime: 1,
    isMainMatch: true,
    matchEvent: '',
    matchType: 1,
    subIssueTypeId: 5,
    subIssueTypeName: '',
    logInfoDetail: null,
    leagueName: '',
    sportType: 0
  };
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
      scoreOfMatch: '',
      scoreNormalTicket: '',
      cancelCashOutCount: 1
    } as LogInfoDetail;
  static readonly fakeValidationMessage: ValidationMessage[] = [
    {
      isError: false,
      reason: '',
    }
  ];
  static readonly fakeChildMatches: ChildMatchModel[] = [
    {
      matchId: 123,
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
  static readonly fakeLogInfoRedCard: LogInfoRedCard = {
    matchId: 1111,
    isMainMatch: true,
    leagueName: '',
    eventName: '',
    subIssueTypeId: 7,
    matchCode: "1111",
    voidTimeArea: Helper.fakeFilterTimeWithAllowance,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: Helper.fakeValidationMessage,
    sportType: 0
  };
  static readonly fakeChildMatchModel: ChildMatchModel = {
    matchId: 1111,
    matchCode: '222',
    matchEvent: 'TestC - vs - Real Madrid (V)',
    isChecked: true,
    matchType: MatchType.LINK,
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
  };

  static readonly fakeSelectedMatch: MatchModel = {
    matchId: 1,
    matchCode: '1',
    leagueName: 'leagueName',
    leagueId: 1,
    name: 'name',
    kickOffTime: '',
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
    leagueGroupId: 0,
    leagueNameNewSimplified: '',
    leagueNameSimplified: '',
    leagueNameTraditional: '',
    matchEvent: '',
    matchEventSimplified: '',
    matchEventNewSimplified: '',
    startTime: undefined,
    endTime: undefined,
    sportType: 0,
    sportTypeName: '',
    sportTypeNameNewSimplified: '',
    sportTypeNameSimplified: '',
    sportTypeNameTraditional: ''
  };
}

describe('EventRedCardComponent', () => {
  @NgModule({
    declarations: [
      EventLeagueComponent,
      ConfirmRedCardComponent,
      FilterTimeAreaComponent,
      LogInfoRedCardComponent,
      AddChildMatchComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule,
      BlockUiModule,
    ],
    providers: [
      ElementRef,
      LogInfoService,
      ValidationService,
      SaveRequestService,
      AddRequestStore,
      RelatedEventService,
      EventRedCardService,
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventRedCardComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventRedCardComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#EventRedCardComponent init should match snapshot', async () => {
    // Arrange
    const { fixture, instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          redCardModels: [Helper.fakeRedCardModel],
          isEdit: false,
        }
      });

    // Action
    instance.ngOnInit = jest.fn();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit has isEdit is true init Have Been Called Expected', async () => {
    // Arrange
    const addRequestStore = new AddRequestStore();
    const eventRedCardService = new EventRedCardService();
    const relatedEventService = new RelatedEventService(null, null, null, null);
    eventRedCardService.assignModelsToEvents = jest.fn();
    eventRedCardService.updateDefaultFilterTime = jest.fn();
    relatedEventService.getChildMatches = jest.fn();

    const component = new EventRedCardComponent(null, null, null, null, addRequestStore, relatedEventService, eventRedCardService);
    component.isEdit = true;
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.isMainMatch = true;
    component.allSelectedEvents = [mainEvent];
    component.filter = {issueTypeId: "1"} as FilterModel;
    // Action
    await component.ngOnInit();

    // Assert
    expect(eventRedCardService.assignModelsToEvents).toHaveBeenCalledTimes(1);
    expect(eventRedCardService.updateDefaultFilterTime).toHaveBeenCalledTimes(1);
    expect(relatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit has isEdit is false init Have Been Called Expected', async () => {
    // Arrange
    const addRequestStore = new AddRequestStore();
    const eventRedCardService = new EventRedCardService();
    const relatedEventService = new RelatedEventService(null, null, null, null);
    addRequestStore.getAllowanceTimeSubject.subscribe = jest.fn();
    eventRedCardService.initDefaultMainEvent = jest.fn();
    eventRedCardService.initDefaultFilterTime = jest.fn();
    relatedEventService.getChildMatches = jest.fn();

    const component = new EventRedCardComponent(null, null, null, null, addRequestStore, relatedEventService, eventRedCardService);
    component.isEdit = false;
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.isMainMatch = true;
    component.allSelectedEvents = [mainEvent];

    // Action
    await component.ngOnInit();

    // Assert
    expect(eventRedCardService.initDefaultMainEvent).toHaveBeenCalledTimes(1);
    expect(eventRedCardService.initDefaultFilterTime).toHaveBeenCalledTimes(1);
  });

  it('#ngOnChanges should call expected function', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mockResetVoidTimeArea = jest.fn();
    const mockResetIsCheckedVar = jest.fn();
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
        resetVoidTimeArea: mockResetVoidTimeArea,
        resetIsCheckedVar: mockResetIsCheckedVar,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.mainEvent = Helper.fakeLogInfoRedCard;
    instance.filter.isChangeSubTypeManual = true;
    instance.resetLogInfoAndHideAllEvents = jest.fn();
    const changes = {
      'filter': new SimpleChange({}, {}, true)
    };

    // Action
    instance.ngOnChanges(changes);

    // Assert
    expect(mockResetVoidTimeArea).toHaveBeenCalledTimes(1);
    expect(mockResetIsCheckedVar).toHaveBeenCalledTimes(1);
  });

  it('#ngOnDestroy should call #unsubscribe', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          redCardModels: [Helper.fakeRedCardModel],
          isEdit: false,
        }
      });

    instance.getAllowanceTimeSubscription = new Subscription();
    instance.getAllowanceTimeSubscription.unsubscribe = jest.fn();

    // Action
    instance.ngOnDestroy();

    // Assert
    expect(instance.getAllowanceTimeSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should be return when inValidateCommonData', async () => {
    // Arrange
    const mockValidateCommonData = jest.fn().mockImplementation(() => false);
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .mock(ValidationService, {
        validateCommonData: mockValidateCommonData
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          redCardModels: [Helper.fakeRedCardModel],
          isEdit: false,
        }
      });

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(instance.primitiveProps.isShowLogInfoMainMatch).toBeFalsy();
    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should be return when isCheckedVar is null and IsShowVarCheck', async () => {
    // Arrange
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .mock(ValidationService, {
        validateCommonData: mockValidateCommonData
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          redCardModels: [Helper.fakeRedCardModel],
          isEdit: false,
        }
      });

    instance.mainEvent.isCheckedVar = null;
    instance.mainEvent.subIssueTypeId = 1;

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(instance.mainEvent.isHighLightVarCheck).toBeTruthy();
  });

  it('#handleSearchEvent should be call #getLogInfo when have not filterTimeWithAllowanceComponent', async () => {
    // Arrange
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const mockChangeBlockingUiStatus = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const mockGetChildMatches = jest.fn();
    const mockGetDataWhenSearch = jest.fn();
    const mockUpdateIsCheckedVar = jest.fn();

    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
        updateIsCheckedVar: mockUpdateIsCheckedVar,
      })
      .mock(AddRequestStore, {
        changeBlockingUiStatus: mockChangeBlockingUiStatus,
        changeSavingRequestStatus: mockChangeSavingRequestStatus
      })
      .mock(ValidationService, {
        validateCommonData: mockValidateCommonData
      })
      .mock(RelatedEventService, {
        getChildMatches: mockGetChildMatches,
        getDataWhenSearch: mockGetDataWhenSearch,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    const logInfoRedCardComponent = new LogInfoRedCardComponent(null, null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent = null;
    logInfoRedCardComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRedCardComponent>();
    instance.logInfoComponents.reset([...logInfoComponents.toArray(), logInfoRedCardComponent]);
    instance.mainEvent.isCheckedVar = false;
    instance.allSelectedEvents = [Helper.fakeLogInfoRedCard];

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(mockChangeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(mockGetChildMatches).toHaveBeenCalledTimes(1);
    expect(mockGetDataWhenSearch).toHaveBeenCalledTimes(1);
    expect(mockUpdateIsCheckedVar).toHaveBeenCalledTimes(1);
    expect(instance.primitiveProps.isShowLogInfoMainMatch).toBeTruthy();
    expect(instance.primitiveProps.isShowRelatedEvents).toBeTruthy();

  });

  it('#handleSearchEvent should be call #getLogInfo when have filterTimeWithAllowanceComponent', async () => {
    // Arrange
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const mockChangeBlockingUiStatus = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const mockGetChildMatches = jest.fn();
    const mockGetDataWhenSearch = jest.fn();
    const mockUpdateIsCheckedVar = jest.fn();

    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
        updateIsCheckedVar: mockUpdateIsCheckedVar,
      })
      .mock(AddRequestStore, {
        changeBlockingUiStatus: mockChangeBlockingUiStatus,
        changeSavingRequestStatus: mockChangeSavingRequestStatus
      })
      .mock(ValidationService, {
        validateCommonData: mockValidateCommonData
      })
      .mock(RelatedEventService, {
        getChildMatches: mockGetChildMatches,
        getDataWhenSearch: mockGetDataWhenSearch,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    const logInfoRedCardComponent = new LogInfoRedCardComponent(null, null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent = new FilterTimeWithAllowanceComponent(null);
    logInfoRedCardComponent.filterTimeWithAllowanceComponent.updateData = jest.fn();
    logInfoRedCardComponent.showValidationDetail = jest.fn();
    const logInfoComponents = new QueryList<LogInfoRedCardComponent>();
    instance.logInfoComponents.reset([...logInfoComponents.toArray(), logInfoRedCardComponent]);
    instance.mainEvent.isCheckedVar = false;

    // Action
    await instance.handleSearchEvent();

    // Assert
    expect(logInfoRedCardComponent.filterTimeWithAllowanceComponent.updateData).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should be call #resetLogInfoOfEvent & emit updateMatchId when have selectedMatch', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    instance.mainEvent = Helper.fakeLogInfoRedCard;
    instance.eventLeagueComponent.selectedMatch = Helper.fakeSelectedMatch;
    instance.allSelectedEvents = [Helper.fakeLogInfoRedCard];

    // Action
    instance.changeMatchEvent();

    // Assert
    expect(mockResetLogInfoOfEvent).toBeCalled();
    expect(instance.updateMatchId.emit).toBeCalled();
    expect(instance.mainEvent.matchId).toBe(Helper.fakeSelectedMatch.matchId);
    expect(instance.mainEvent.eventName).toBe(Helper.fakeSelectedMatch.name);
    expect(instance.mainEvent.leagueName).toBe(Helper.fakeSelectedMatch.leagueName);
    expect(instance.mainEvent.matchCode).toBe(Helper.fakeSelectedMatch.matchCode);
  });

  it('#changeMatchEvent should be call #resetLogInfoOfEvent & emit updateMatchId when have not selectedMatch', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.updateMatchId.emit = jest.fn();
    instance.mainEvent = Helper.fakeLogInfoRedCard;
    instance.eventLeagueComponent = null;

    // Action
    instance.changeMatchEvent();

    // Assert
    expect(instance.updateMatchId.emit).toBeCalled();
    expect(mockResetLogInfoOfEvent).toBeCalled();
    expect(instance.mainEvent.matchId).toBe(Helper.fakeLogInfoRedCard.matchId);
    expect(instance.mainEvent.eventName).toBe(Helper.fakeLogInfoRedCard.eventName);
    expect(instance.mainEvent.leagueName).toBe(Helper.fakeLogInfoRedCard.leagueName);
    expect(instance.mainEvent.matchCode).toBe(Helper.fakeLogInfoRedCard.matchCode);
  });

  it('#isExistMatchEvent should be return false', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    instance.mainEvent = new LogInfoRedCard();
    instance.mainEvent.matchId = undefined;

    // Action
    const actual = instance.isExistMatchEvent();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isExistMatchEvent should be return true', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    instance.mainEvent = new LogInfoRedCard();
    instance.mainEvent.matchId = 11;

    // Action
    const actual = instance.isExistMatchEvent();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#resetLogInfoAndHideAllEvents should call #resetLogInfoOfEvent', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: true
        }
      });

    // Action
    instance.resetLogInfoAndHideAllEvents();

    // Assert
    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(instance.primitiveProps.isShowLogInfoMainMatch).toBeFalsy();
    expect(instance.primitiveProps.isShowRelatedEvents).toBeFalsy();
  });

  it('#saveRequest should be call #saveRequestService.saveRequest', async () => {
    // Arrange
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .mock(SaveRequestService, {
        saveRequest: mockSaveRequest,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    await instance.saveRequest();

    // Assert
    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
  });

  it('#onClickConfirmSaveRequest should be call #saveRequestService.onClickConfirmSave', async () => {
    // Arrange
    const mockOnClickConfirmSave = jest.fn();
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .mock(SaveRequestService, {
        onClickConfirmSave: mockOnClickConfirmSave,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    await instance.onClickConfirmSaveRequest();

    // Assert
    expect(mockOnClickConfirmSave).toHaveBeenCalledTimes(1);
  });

  it('#onClickCancelSaveRequest should be call #addRequestStore.changeSavingRequestStatus', async () => {
    // Arrange
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .mock(AddRequestStore, {
        changeSavingRequestStatus: mockChangeSavingRequestStatus,
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    instance.onClickCancel();

    // Assert
    expect(mockChangeSavingRequestStatus).toHaveBeenCalled();
  });

  it('#saveRelatedEvent should be call expected function when have not new matches diff match id', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mockResetVoidTimeArea = jest.fn();
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const mockGetLogInfo = jest.fn();
    const mockUpdateIsCheckedVar = jest.fn();
    const mockAssignChildMatchToLogInfoModel = jest.fn().mockImplementation(() => []);

    const { instance } = await shallow
      .mock(RelatedEventService, {
        assignChildMatchToLogInfoModel: mockAssignChildMatchToLogInfoModel
      })
      .mock(EventRedCardService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, {
        getLogInfo: mockGetLogInfo,
        resetVoidTimeArea: mockResetVoidTimeArea,
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
        updateIsCheckedVar: mockUpdateIsCheckedVar,
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.allSelectedEvents = [Helper.fakeLogInfoRedCard, new LogInfoRedCard()];
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

    // Action
    await instance.saveRelatedEvent(Helper.fakeChildMatches);

    // Assert
    expect(mockUpdateIsCheckedVar).toHaveBeenCalledTimes(1);
    expect(mockAssignChildMatchToLogInfoModel).toHaveBeenCalledTimes(1);
    expect(mockUpdateSubIssueTypeAndAllowanceTime).toHaveBeenCalledTimes(1);
    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#handleClickAddRelatedEvent should be call #relatedEventService.addRelatedEventByInput', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mockAddRelatedEventByInput = jest.fn();
    const { instance } = await shallow
      .mock(RelatedEventService, {
        addRelatedEventByInput: mockAddRelatedEventByInput
      })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance['initAddRelatedEventArgs'] = jest.fn();
    instance.allSelectedEvents = [Helper.fakeLogInfoRedCard, new LogInfoRedCard()];

    // Action
    await instance.handleClickAddRelatedEvent();

    // Assert
    expect(mockAddRelatedEventByInput).toHaveBeenCalledTimes(1);
    expect(instance['initAddRelatedEventArgs']).toHaveBeenCalledTimes(1);
  });

  it('#handleDeleteEvent should be update model', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mainEvent = new LogInfoRedCard();
    mainEvent.isMainMatch = true;
    mainEvent.matchId = 999;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.allSelectedEvents = [Helper.fakeLogInfoRedCard];
    instance.allSelectedEvents.push(mainEvent);

    // Action
    instance.handleDeleteEvent(999);

    // Assert
    expect(instance.allSelectedEvents.length).toBe(2);
  });

  it('#showAddChildMatchModal should be update model', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    instance.addChildMatchModel = new AddChildMatchModel();
    instance.allSelectedEvents = [Helper.fakeLogInfoRedCard];

    // Action
    instance.showAddChildMatchModal(1);

    // Assert
    expect(instance.addChildMatchModel.matchType).toBe(1);
    expect(instance.addChildMatchModel.isOpen).toBeTruthy();
  });

  it('#countChildMatches should return number of link matches', async () => {
    // Arrange
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.CHILD;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.relatedEvents = fakeChildMatches;

    // Action
    const actual = instance.countChildMatches();

    // Assert
    expect(actual).toBe(1);
  });

  it('#isDisabledChildMatches should return true when request voided', async () => {
    // Arrange
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = true;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    const actual = instance.isDisabledChildMatches();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isDisabledChildMatches should return true when have not any link matches', async () => {
    // Arrange
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.NORMAL;
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      }).render({
        bind: {
          filter: fakeFilterModel,
          isEdit: false
        }
      });
    instance.relatedEvents = fakeChildMatches;

    // Action
    const actual = instance.isDisabledChildMatches();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isDisabledChildMatches should return false', async () => {
    // Arrange
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.CHILD;
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: fakeFilterModel,
          isEdit: false
        }
      });
    instance.relatedEvents = fakeChildMatches;

    // Action
    const actual = instance.isDisabledChildMatches();

    // Assert
    expect(actual).toBe(false);
  });

  it('#countLinkMatches should return number of link matches', async () => {
    // Arrange
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.LINK;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.relatedEvents = fakeChildMatches;

    // Action
    const actual = instance.countLinkMatches();

    // Assert
    expect(actual).toBe(1);
  });

  it('#isDisabledLinkMatches should return true when request voided', async () => {
    // Arrange
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = true;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    const actual = instance.isDisabledLinkMatches();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isDisabledLinkMatches should return true when have not any link matches', async () => {
    // Arrange
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.NORMAL;
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: fakeFilterModel,
          isEdit: false
        }
      });
    instance.relatedEvents = fakeChildMatches;

    // Action
    const actual = instance.isDisabledLinkMatches();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isDisabledLinkMatches should return false', async () => {
    // Arrange
    const fakeChildMatches = _.cloneDeep(Helper.fakeChildMatches);
    fakeChildMatches[0].matchType = MatchType.LINK;
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = false;
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: fakeFilterModel,
          isEdit: false
        }
      });
    instance.relatedEvents = fakeChildMatches;

    // Action
    const actual = instance.isDisabledLinkMatches();

    // Assert
    expect(actual).toBe(false);
  });

  it('#initSaveRequestInput should be update expected data', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.requestId = Helper.fakeRequestId;

    // Action
    const actual = instance['initSaveRequestInput']();

    // Assert
    expect(actual.requestId).toEqual(Helper.fakeRequestId);
    expect(actual.isEdit).toEqual(false);
    expect(actual.filter).toEqual(Helper.fakeFilterModel);
  });

  it('#initAddRelatedEventArgs should be update expected data', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.requestId = Helper.fakeRequestId;

    // Action
    const actual = instance['initAddRelatedEventArgs']();

    // Assert
    expect(actual.isEdit).toEqual(false);
    expect(actual.filter).toEqual(Helper.fakeFilterModel);
  });

  it('#changeVarCheckValue should update value isCheckedVar = true', async () => {
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    instance.changeVarCheckValue(true);

    // Assert
    expect(instance.mainEvent.isCheckedVar).toEqual(true);
  });

  it('#changeVarCheckValue should update value isCheckedVar = false', async () => {
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    instance.changeVarCheckValue(false);

    // Assert
    expect(instance.mainEvent.isCheckedVar).toEqual(false);
  });

  it('#isShowVarCheck should return false when subIssueTypeId = null', async () => {
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.mainEvent.subIssueTypeId = null;

    // Action
    const actual = instance.isShowVarCheck();

    // Assert
    expect(actual).toBeFalsy();
  });

  it('#isShowVarCheck should return true', async () => {
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn(),
        resetVoidTimeArea: jest.fn(),
        resetIsCheckedVar: jest.fn(),
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });

    // Action
    // Assert
    SubIssueTypeGroup.SUBTYPE_VAR.forEach(element => {
      instance.mainEvent.subIssueTypeId = element;
      const actual = instance.isShowVarCheck();
      expect(actual).toBeTruthy();
    });
  });
});
