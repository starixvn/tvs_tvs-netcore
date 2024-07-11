import { ElementRef, NgModule, QueryList, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { Shallow } from 'shallow-render';
import { AddChildMatchComponent } from '../../../../utility/components/add-child-match/add-child-match.component';
import { AddChildMatchModel } from '../../../../utility/components/add-child-match/add-child-match.model';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { MatchType, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { AllowanceTime } from '../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { AddRequestStore } from '../add-request.store';
import { PrimitiveProperty } from '../event-red-card/event-red-card.model';
import { FilterTimeAreaComponent } from '../event-red-card/filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowanceComponent } from '../event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from '../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LeagueEventRedCardComponent } from '../event-red-card/league-event-red-card/league-event-red-card.component';
import { LogInfoRedCardComponent } from '../event-red-card/log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from '../event-red-card/log-info-red-card/log-info-red-card.model';
import { FilterModel } from '../filter/filter.model';
import { RedCardModel } from '../models/event-red-card.model';
import { ValidationMessage } from '../models/get-log-info.model';
import { ChildMatchModel } from '../models/related-event.model';
import { ConfirmDangerAcceptedComponent } from './confirm-danger-accepted/confirm-danger-accepted.component';
import { EventDangerAcceptedComponent } from './event-danger-accepted.component';
import { EventDangerAcceptedService } from './services/event-danger-accepted.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

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
    sportType: 1,
    eventDate: '',
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: false,
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
    leagueName: ''
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
    scoreOfMatch: '',
    scoreNormalTicket: '',
    instantlySettleCount: 2,
    cancelCashOutCount: 1
  } as LogInfoDetail;
  static readonly fakeValidationMessage: ValidationMessage[] = [
    {
      isError: false,
      reason: '',
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
}

describe('EventDangerAcceptedComponent', () => {
  @NgModule({
    declarations: [
      LeagueEventRedCardComponent,
      ConfirmDangerAcceptedComponent,
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
      LogInfoService,
      ValidationService,
      SaveRequestService,
      AddRequestStore,
      RelatedEventService,
      EventDangerAcceptedService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventDangerAcceptedComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventDangerAcceptedComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#EventDangerAcceptedComponent init should match snapshot', async () => {
    // Arrange
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { fixture, instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn()
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          dangerAcceptedModels: [Helper.fakeRedCardModel],
          isEdit: true,
        }
      });

    // Action
    expect(fixture).toMatchSnapshot();
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
          dangerAcceptedModels: [Helper.fakeRedCardModel],
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
          dangerAcceptedModels: [Helper.fakeRedCardModel],
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

  it('#changeMatchEvent should be call #resetAllEventBeforeSearch & emit updateMatchId when have have #selectedMatch', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
      .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.mainEvent =  new LogInfoRedCard();
    instance.leagueEventDangerAcceptedComponent.selectedMatch = new MatchModel();
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.isMainMatch = true;
    instance.allSelectedEvents = [mainEvent];

    // Action
    instance.changeMatchEvent();

    // Assert
    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#changeMatchEvent should be call #resetAllEventBeforeSearch & emit updateMatchId when have not #selectedMatch', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
      .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.primitiveProps = new PrimitiveProperty();
    instance.mainEvent =  new LogInfoRedCard();
    instance.leagueEventDangerAcceptedComponent = null;
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.isMainMatch = true;
    instance.allSelectedEvents = [mainEvent];

    // Action
    instance.changeMatchEvent();

    // Assert
    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('#isExistMatchEvent should be return false', async () => {
    // Arrange
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn()
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.mainEvent =  new LogInfoRedCard();
    instance.mainEvent.matchId = undefined;

    // Action
    const actual = instance.isExistMatchEvent();

    // Assert
    expect(actual).toBe(false);
  });

  it('#isExistMatchEvent should be return true', async () => {
    // Arrange
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn()
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          isEdit: false
        }
      });
    instance.mainEvent =  new LogInfoRedCard();
    instance.mainEvent.matchId = 11;

    // Action
    const actual = instance.isExistMatchEvent();

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#saveRequest should be call #saveRequestService.saveRequest', async () => {
    // Arrange
    const mockSaveRequest = jest.fn();
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn()
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
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn()
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
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn()
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
    instance.onClickCancelSaveRequest();

    // Assert
    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('#initSaveRequestInput should be update expected data', async () => {
    // Arrange
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const { instance } = await shallow
      .mock(EventDangerAcceptedService, {
        updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
      })
      .mock(LogInfoService, {
        resetLogInfoOfEvent: jest.fn()
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

  it('#isDisabledLinkMatches should return true when request voided', async () => {
    // Arrange
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = true;
    const { instance } = await shallow
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

  it('#isDisabledChildMatches should return true when request voided', async () => {
    // Arrange
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.isVoided = true;
    const { instance } = await shallow
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
    expect(actual).toBeTruthy();
  });

  it('#isDisabledChildMatches should return false', async () => {
    // Arrange
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

  it('#countChildMatches should return number of link matches', async () => {
    // Arrange
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

    // Action
    const actual = instance.countChildMatches();

    // Assert
    expect(actual).toBe(1);
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


  it('#handleDeleteEvent should be update model', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mainEvent = new LogInfoRedCard();
    mainEvent.isMainMatch = true;
    mainEvent.matchId = 999;
    const { instance } = await shallow
    .mock(LogInfoService, {
      resetLogInfoOfEvent: mockResetLogInfoOfEvent
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

  it('#saveRelatedEvent should be call expected function', async () => {
    // Arrange
    const mockUpdateEvents = jest.fn().mockImplementation(() => []);
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const mockGetLogInfo = jest.fn();
    const mockUpdateIsCheckedVar = jest.fn();
    const { instance } = await shallow
    .mock(RelatedEventService, {
      assignChildMatchToLogInfoModel: mockUpdateEvents
    })
    .mock(EventDangerAcceptedService, {
      updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
    })
    .mock(LogInfoService, {
      getLogInfo: mockGetLogInfo,
      updateIsCheckedVar: mockUpdateIsCheckedVar
    })
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        isEdit: false
      }
    });
    instance.allSelectedEvents = [];
    instance.primitiveProps = new PrimitiveProperty();
    instance.relatedEvents = [];
    instance.addChildMatchModel = new AddChildMatchModel();
    instance.addChildMatchModel.matchType = MatchType.CHILD;

    // Action
    await instance.saveRelatedEvent(Helper.fakeChildMatches);

    // Assert
    expect(mockUpdateEvents).toHaveBeenCalledTimes(1);
    expect(mockUpdateSubIssueTypeAndAllowanceTime).toHaveBeenCalledTimes(1);
    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
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
      .mock(EventDangerAcceptedService, {
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

  it('#saveRelatedEvent should be call expected function when have not new matches diff match id', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const mockResetVoidTimeArea = jest.fn();
    const mockUpdateEvents = jest.fn().mockImplementation(() => []);
    const mockUpdateSubIssueTypeAndAllowanceTime = jest.fn();
    const mockGetLogInfo = jest.fn();
    const mockUpdateIsCheckedVar = jest.fn();
    const { instance } = await shallow
    .mock(RelatedEventService, {
      assignChildMatchToLogInfoModel: mockUpdateEvents
    })
    .mock(EventDangerAcceptedService, {
      updateSubIssueTypeAndAllowanceTime: mockUpdateSubIssueTypeAndAllowanceTime
    })
    .mock(LogInfoService, {
      getLogInfo: mockGetLogInfo,
      resetVoidTimeArea: mockResetVoidTimeArea,
      resetLogInfoOfEvent: mockResetLogInfoOfEvent,
      updateIsCheckedVar: mockUpdateIsCheckedVar
    })
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        isEdit: false
      }
    });
    instance.allSelectedEvents = [new LogInfoRedCard()];
    instance.primitiveProps = new PrimitiveProperty();

    // Action
    await instance.saveRelatedEvent(Helper.fakeChildMatches);

    // Assert
    expect(mockUpdateEvents).toHaveBeenCalledTimes(1);
    expect(mockUpdateSubIssueTypeAndAllowanceTime).toHaveBeenCalledTimes(1);
    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit should be call #updateDefaultFilterTime when edit request', async () => {
    // Arrange
    const addRequestStore = new AddRequestStore();
    addRequestStore.blockingUiStatus.subscribe = jest.fn();
    addRequestStore.getAllowanceTimeSubject.subscribe = jest.fn();
    const eventDangerAcceptedService = new EventDangerAcceptedService(null);
    eventDangerAcceptedService.updateDefaultFilterTime = jest.fn();
    eventDangerAcceptedService.assignModelsToEvents = jest.fn();
    const relatedEventService = new RelatedEventService(null, null, null, null);
    relatedEventService.getChildMatches = jest.fn();
    const component = new EventDangerAcceptedComponent(null, null, null, null, addRequestStore, relatedEventService, eventDangerAcceptedService);
    component.isEdit = true;
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.isMainMatch = true;
    component.allSelectedEvents = [mainEvent];

    // Action
    await component.ngOnInit();

    // Assert
    expect(eventDangerAcceptedService.updateDefaultFilterTime).toHaveBeenCalledTimes(1);
    expect(relatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
    expect(eventDangerAcceptedService.assignModelsToEvents).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit should be call #updateDefaultFilterTime when add request', async () => {
    // Arrange
    const addRequestStore = new AddRequestStore();
    addRequestStore.blockingUiStatus.subscribe = jest.fn();
    const eventDangerAcceptedService = new EventDangerAcceptedService(null);
    eventDangerAcceptedService.initDefaultMainEvent = jest.fn();
    eventDangerAcceptedService.initDefaultFilterTime = jest.fn();
    const component = new EventDangerAcceptedComponent(null, null, null, null, addRequestStore, null, eventDangerAcceptedService);
    component.isEdit = false;

    // Action
    await component.ngOnInit();

    // Assert
    expect(eventDangerAcceptedService.initDefaultMainEvent).toHaveBeenCalledTimes(1);
    expect(eventDangerAcceptedService.initDefaultFilterTime).toHaveBeenCalledTimes(1);
  });

  it('#ngOnDestroy should call #unsubscribe', async () => {
    // Arrange
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, {
      resetLogInfoOfEvent: mockResetLogInfoOfEvent
    })
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        dangerAcceptedModels: [Helper.fakeRedCardModel],
        isEdit: true,
      }
    });
    instance.getAllowanceTimeSubscription = new Subscription();
    instance.getAllowanceTimeSubscription.unsubscribe = jest.fn();

    // Action
    instance.ngOnDestroy();

    // Assert
    expect(instance.getAllowanceTimeSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('#ngOnChanges should call expected function', async() => {
    // Arrange
    const mockResetVoidTimeArea = jest.fn();
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetVoidTimeArea: mockResetVoidTimeArea,
        resetIsCheckedVar: jest.fn()
      })
      .render({
        bind: {
          filter: Helper.fakeFilterModel,
          dangerAcceptedModels: [Helper.fakeRedCardModel],
          isEdit: true,
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
    expect(mockResetVoidTimeArea).toHaveBeenCalled;
  });

  it('#resetLogInfoAndHideAllEvents should call #resetLogInfoOfEvent', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
      .mock(LogInfoService, {
        resetLogInfoOfEvent: mockResetLogInfoOfEvent,
      })
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        dangerAcceptedModels: [Helper.fakeRedCardModel],
        isEdit: true,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();

    // Action
    instance.resetLogInfoAndHideAllEvents();

    // Assert
    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
  });

  it('#changeVarCheckValue should update value isCheckedVar = true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        dangerAcceptedModels: [Helper.fakeRedCardModel],
      }
    });

    // Action
    instance.changeVarCheckValue(true);

    // Assert
    expect(instance.mainEvent.isCheckedVar).toEqual(true);
  });

  it('#changeVarCheckValue should update value isCheckedVar = false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        dangerAcceptedModels: [Helper.fakeRedCardModel],
      }
    });

    // Action
    instance.changeVarCheckValue(false);

    // Assert
    expect(instance.mainEvent.isCheckedVar).toEqual(false);
  });
});
