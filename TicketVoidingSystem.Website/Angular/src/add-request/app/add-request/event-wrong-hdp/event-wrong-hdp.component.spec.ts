import { ElementRef, NgModule, QueryList, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { AddChildMatchComponent } from '../../../../utility/components/add-child-match/add-child-match.component';
import { AddChildMatchModel } from '../../../../utility/components/add-child-match/add-child-match.model';
import { BlockFullUiModule } from '../../../../utility/components/block-full-ui/block-full-ui.module';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { MatchType } from '../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { PipeModule } from '../../../../utility/pipes/pipe.module';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongHdpModel } from '../models/event-wrong-hdp.model';
import { ChildMatchModel } from '../models/related-event.model';
import { EventWrongHdpComponent } from './event-wrong-hdp.component';
import { LogInfoWrongHdpComponent } from './log-info-wrong-hdp/log-info-wrong-hdp.component';
import { FilterWithHdpModel } from './models/filter-with-hdp.model';
import { LogInfoWrongHdp } from './models/log-info-wrong-hdp.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { EventWrongHdpService } from './services/event-wrong-hdp.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { MatchModel } from '../../../../utility/models/match.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';

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
  static readonly fakeFilterWithHdpModel: FilterWithHdpModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    homeFavorite: '2',
    awayFavorite: '',
    actualMarket: '1',
    hdpValue: '',
    liveIndicator: 0
  };
  static readonly fakeLogInfoWrongHdp: LogInfoWrongHdp = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWithHdp: new FilterWithHdpModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    poolHouseCheckedBetTypes: null,
    linkedLogsViewModel: null,
    isShowValidation: false
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  };
  static readonly fakeWrongHdpModel: WrongHdpModel = {
    matchId: 122,
    subIssueTypeId: 12,
    isMainMatch: true,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeFromDateTime,
    homeFavorite: '',
    awayFavorite: '',
    actualMarket: '',
    hdpValue: '',
    logInfoDetail: Helper.fakeLogInfoDetail,
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    isPoolHouseAffected: false,
    liveIndicator: 0,
    poolHouseCheckedBetTypes: null
  };
  static readonly fakeChildMatches: ChildMatchModel[] = [
    {
      matchId: 12345,
      matchCode: '111',
      matchEvent: 'Test A vs Test B',
      isChecked: true,
      matchType: 1,
      leagueName: '',
      name: ''
    }
  ];
}

describe('EventWrongHdpComponent', () => {
  @NgModule({
    declarations: [
      EventLeagueComponent,
      LogInfoWrongHdpComponent,
      AddChildMatchComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule,
      BlockUiModule,
      BlockFullUiModule,
      PipeModule
    ],
    providers: [
      LogInfoService,
      EventWrongHdpService,
      AddRequestStore,
      ValidationService,
      RelatedEventService,
      SaveRequestService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<EventWrongHdpComponent>;

  beforeEach(() => {
    shallow = new Shallow(EventWrongHdpComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('EventWrongHdpComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('ngOnChanges should call #initDefaultFilter', async () => {
    const changes = {
      'issueTypeId': new SimpleChange('1', '11', true)
    };
    const mockInitDefaultFilter = jest.fn();
    const { instance } = await shallow
    .mock(EventWrongHdpService, { initDefaultFilter: mockInitDefaultFilter })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.allSelectedEvents = [Helper.fakeLogInfoWrongHdp];
    instance['resetLogInfoAndHideEvents'] = jest.fn();
    instance.resetAllData = jest.fn();

    instance.ngOnChanges(changes);

    expect(mockInitDefaultFilter).toHaveBeenCalledTimes(1);
    expect(instance['resetLogInfoAndHideEvents']).toHaveBeenCalledTimes(1);
  });

  it('ngOnChanges should call #resetLogInfoAndHideEvents', async () => {
    const changes = {
      'filter': new SimpleChange({}, {}, true)
    };
    const filter = _.cloneDeep(Helper.fakeFilterModel);
    filter.isChangeSubTypeManual = true;
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: jest.fn() })
    .render({
      bind: {
        isEdit: true,
        filter: filter,
      }
    });
    instance['resetLogInfoAndHideEvents'] = jest.fn();

    instance.ngOnChanges(changes);

    expect(instance['resetLogInfoAndHideEvents']).toHaveBeenCalledTimes(0);
  });

  it('handleSearchEvent should return when invalid', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const mockValidateCommonData = jest.fn().mockImplementation(() => false);
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
    .mock(ValidationService, { validateCommonData: mockValidateCommonData })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    const logInfoWrongHdpComponents = new LogInfoWrongHdpComponent(null, null, null, null, null, null);
    logInfoWrongHdpComponents.isMainMatch = true;
    const logInfoComponents = new QueryList<LogInfoWrongHdpComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), logInfoWrongHdpComponents]);
    instance.logInfoComponents = logInfoComponents;

    await instance.handleSearchEvent();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
  });

  it('handleSearchEvent should call #getChildMatches', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const mockValidateCommonData = jest.fn().mockImplementation(() => true);
    const mockGetLogInfo = jest.fn();
    const mockGetChildMatches = jest.fn();
    const mockChangeSavingRequestStatus = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, {
      resetLogInfoOfEvent: mockResetLogInfoOfEvent,
      getLogInfo: mockGetLogInfo
    })
    .mock(ValidationService, { validateCommonData: mockValidateCommonData })
    .mock(RelatedEventService, { getChildMatches: mockGetChildMatches })
    .mock(AddRequestStore, { changeSavingRequestStatus: mockChangeSavingRequestStatus })
    .mock(EventWrongHdpService, { getLinkedLog: jest.fn() })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    const logInfoWrongHdpComponents = new LogInfoWrongHdpComponent(null, null, null, null, null, null);
    logInfoWrongHdpComponents.isMainMatch = true;
    const logInfoComponents = new QueryList<LogInfoWrongHdpComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), logInfoWrongHdpComponents]);
    instance.logInfoComponents = logInfoComponents;

    await instance.handleSearchEvent();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidateCommonData).toHaveBeenCalledTimes(1);
    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
    expect(mockGetChildMatches).toHaveBeenCalledTimes(1);
    expect(mockChangeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('changeMatchEvent should call expected method when have not league event', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.allSelectedEvents = [Helper.fakeLogInfoWrongHdp];
    instance.mainEvent = Helper.fakeLogInfoWrongHdp;
    instance.eventLeagueComponent = null;
    instance.updateMatchId.emit = jest.fn();

    instance.changeMatchEvent();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('changeMatchEvent should call expected method', async () => {
    const mockResetLogInfoOfEvent = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { resetLogInfoOfEvent: mockResetLogInfoOfEvent })
    .mock(AddRequestStore, { changeStartTimeFilterAnalysis: jest.fn() })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.primitiveProps = new PrimitiveProperty();
    instance.allSelectedEvents = [Helper.fakeLogInfoWrongHdp];
    instance.mainEvent = Helper.fakeLogInfoWrongHdp;
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.selectedMatch = new MatchModel();
    instance.eventLeagueComponent = eventLeagueComponent;
    instance.updateMatchId.emit = jest.fn();

    instance.changeMatchEvent();

    expect(mockResetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(instance.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('showAddChildMatchModal should update data', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.allSelectedEvents = [new LogInfoWrongHdp()]
    instance.addChildMatchModel = new AddChildMatchModel();

    instance.showAddChildMatchModal(1);

    expect(instance.addChildMatchModel.matchType).toBe(1);
    expect(instance.addChildMatchModel.isOpen).toBeTruthy();
  });

  it('saveRelatedEvent should call expected method when selectedRelatedEvents include same matchId', async () => {
    const selectedRelatedEvents: ChildMatchModel[] = [];
    selectedRelatedEvents.push({
      matchId: Helper.fakeLogInfoWrongHdp.matchId,
      matchCode: '',
      matchEvent: '',
      leagueName: '',
      name: '',
      isChecked: true,
      matchType: 1,
    });
    const logInfo = [_.cloneDeep(Helper.fakeLogInfoWrongHdp)];
    logInfo[0].matchId = 123123;
    logInfo.push(_.cloneDeep(Helper.fakeLogInfoWrongHdp));
    logInfo[1].matchId = 12341234;
    const mockUpdateEvents = jest.fn().mockImplementation(() => [Helper.fakeLogInfoWrongHdp]);
    const { instance } = await shallow
    .mock(RelatedEventService, { updateEvents: mockUpdateEvents })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    instance.relatedEvents = [new ChildMatchModel()];
    instance.relatedEvents[0].matchId = logInfo[1].matchId;
    instance.relatedEvents[0].matchType = 2;
    instance.primitiveProps = new PrimitiveProperty();
    instance.allSelectedEvents = [Helper.fakeLogInfoWrongHdp, ...logInfo];

    await instance.saveRelatedEvent(selectedRelatedEvents);

    expect(mockUpdateEvents).toHaveBeenCalledTimes(1);
  });

  it('handleDeleteEvent should update data', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });

    const logInfo = [_.cloneDeep(Helper.fakeLogInfoWrongHdp)];
    logInfo[0].matchId = 123123;
    instance.allSelectedEvents = [Helper.fakeLogInfoWrongHdp, ...logInfo];

    instance.handleDeleteEvent(Helper.fakeLogInfoWrongHdp.matchId);

    expect(instance.allSelectedEvents.length).toBe(2);
  });

  it('handleClickAddRelatedEvent should update data', async () => {
    const mockAddRelatedEventByInput = jest.fn();
    const { instance } = await shallow
    .mock(RelatedEventService, { addRelatedEventByInput: mockAddRelatedEventByInput })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });

    await instance.handleClickAddRelatedEvent();

    expect(mockAddRelatedEventByInput).toHaveBeenCalledTimes(1);
  });

  it('saveRequest should update data', async () => {
    const mockSaveRequest = jest.fn();
    const { instance } = await shallow
    .mock(SaveRequestService, { saveRequest: mockSaveRequest })
    .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn() })
    .mock(EventWrongHdpService, { getLinkedLog: jest.fn() })

    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
      }
    });
    const logInfoWrongHdpComponents = new LogInfoWrongHdpComponent(null, null, null, null, null, null);
    logInfoWrongHdpComponents.isMainMatch = true;
    const logInfoComponents = new QueryList<LogInfoWrongHdpComponent>();
    logInfoComponents.reset([...logInfoComponents.toArray(), logInfoWrongHdpComponents]);
    instance.logInfoComponents = logInfoComponents;

    await instance.saveRequest();

    expect(mockSaveRequest).toHaveBeenCalledTimes(1);
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

    const actual = instance.countChildMatches();

    expect(actual).toBe(1);
  });

  it('#ngOnInit should return call #getChildMatches', async () => {
    const eventWrongHdpService = new EventWrongHdpService(null, null);
    eventWrongHdpService.assignModelsToEvents = jest.fn();
    const relatedEventService = new RelatedEventService(null, null);
    relatedEventService.getChildMatches = jest.fn();
    const component = new EventWrongHdpComponent(null, null, eventWrongHdpService, null, null, relatedEventService, null);
    component.isEdit = true;
    component.allSelectedEvents = [Helper.fakeLogInfoWrongHdp];
    component.mainEvent = Helper.fakeLogInfoWrongHdp;

    await component.ngOnInit();

    expect(relatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
  });
});
