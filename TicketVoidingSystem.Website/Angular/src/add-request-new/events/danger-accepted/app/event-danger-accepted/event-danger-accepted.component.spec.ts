import { QueryList, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import cloneDeep from 'lodash/cloneDeep';
import { Subscription } from 'rxjs';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../component/filter/filter.model';
import { LogInfoRelatedEventComponent } from '../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../component/log-info-related-event/log-info-related-event.model';
import { RedCardModel } from '../../../../models/event-red-card.model';
import { ValidationMessage } from '../../../../models/get-log-info.model';
import { ChildMatchModel } from '../../../../models/related-event.model';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { AddRequestStore } from '../../../../services/add-request.store';
import { FilterTimeAreaComponent } from '../../../red-card/app/event-red-card/filter-time-area/filter-time-area.component';
import { FilterTimeWithAllowanceComponent } from '../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.component';
import { FilterTimeWithAllowance } from '../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
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
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
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
  } as RedCardModel;
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
  static readonly fakeLogInfoRedCard: LogInfoRelatedEvent = {
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
  } as LogInfoRelatedEvent;
}

describe('EventDangerAcceptedComponent', () => {
  let component: EventDangerAcceptedComponent;
  let fixture: ComponentFixture<EventDangerAcceptedComponent>;
  let logInfoService: LogInfoService;
  let validationService: ValidationService;
  let saveRequestService: SaveRequestService;
  let addRequestStore: AddRequestStore;
  let relatedEventService: RelatedEventService;
  let eventDangerAcceptedService: EventDangerAcceptedService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        LogInfoService,
        ValidationService,
        SaveRequestService,
        AddRequestStore,
        RelatedEventService,
        EventDangerAcceptedService,
        AddRequestApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDangerAcceptedComponent);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    validationService = fixture.debugElement.injector.get(ValidationService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    relatedEventService = fixture.debugElement.injector.get(RelatedEventService);
    eventDangerAcceptedService = fixture.debugElement.injector.get(EventDangerAcceptedService);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    component = fixture.componentInstance;
    component.mainEvent = Helper.fakeLogInfoRedCard;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call resetVoidTimeArea when filter changes and isChangeSubTypeManual is true', async() => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.resetDateAfterChangeFilter = jest.fn();
    const changes = {
      'filter': new SimpleChange({}, {isChangeSubTypeManual: true, subIssueTypeId: 1}, true)
    };

    // Action
    component.ngOnChanges(changes);

    // Assert
    expect(component.resetDateAfterChangeFilter).toHaveBeenCalled();
    expect(component.filter.isChangeSubTypeManual).toBeFalsy();
    expect(component.filter.subIssueTypeId).toBe("1");
  });

  it('should not call resetVoidTimeArea when filter changes and isChangeSubTypeManual is false', async() => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.isChangeSubTypeManual = false;
    component.resetDateAfterChangeFilter = jest.fn();
    const changes = {
      'filter': new SimpleChange({}, {isChangeSubTypeManual: true, subIssueTypeId: 1}, true)
    };

    // Action
    component.ngOnChanges(changes);

    // Assert
    expect(component.resetDateAfterChangeFilter).toHaveBeenCalledTimes(0);
  });

  it('#ngOnInit should be call #updateDefaultFilterTime when edit request', async () => {
    // Arrange
    addRequestStore.blockingUiStatus.subscribe = jest.fn();
    addRequestStore.getAllowanceTimeSubject.subscribe = jest.fn();
    eventDangerAcceptedService.updateDefaultFilterTime = jest.fn();
    eventDangerAcceptedService.assignModelsToEvents = jest.fn();
    addRequestApiService.getChildMatches = jest.fn();
    component.isEdit = true;
    const mainEvent = cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.isMainMatch = true;
    component.allSelectedEvents = [mainEvent];
    component.filter = {issueTypeId: "1"} as FilterModel;

    // Action
    await component.ngOnInit();

    // Assert
    expect(eventDangerAcceptedService.updateDefaultFilterTime).toHaveBeenCalledTimes(1);
    expect(addRequestApiService.getChildMatches).toHaveBeenCalledTimes(1);
    expect(eventDangerAcceptedService.assignModelsToEvents).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit should be call #updateDefaultFilterTime when add request', async () => {
    // Arrange
    addRequestStore.blockingUiStatus.subscribe = jest.fn();
    eventDangerAcceptedService.initDefaultMainEvent = jest.fn();
    eventDangerAcceptedService.initDefaultFilterTime = jest.fn();
    component.isEdit = false;

    // Action
    await component.ngOnInit();

    // Assert
    expect(eventDangerAcceptedService.initDefaultMainEvent).toHaveBeenCalledTimes(1);
    expect(eventDangerAcceptedService.initDefaultFilterTime).toHaveBeenCalledTimes(1);
  });

  it('#ngOnDestroy should call #unsubscribe', async () => {
    // Arrange
    component.getAllowanceTimeSubscription = new Subscription();
    component.getAllowanceTimeSubscription.unsubscribe = jest.fn();

    // Action
    component.ngOnDestroy();

    // Assert
    expect(component.getAllowanceTimeSubscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should be return when inValidateCommonData', async () => {
    // Arrange
    validationService.validateCommonData = jest.fn().mockImplementation(() => false);
    component.dangerAcceptedModels = [Helper.fakeRedCardModel];
    component.filter = Helper.fakeFilterModel;

    // Action
    await component.handleSearchEvent();

    // Assert
    expect(component.primitiveProps.isShowLogInfoMainMatch).toBeFalsy();
    expect(validationService.validateCommonData).toHaveBeenCalledTimes(1);
  });

  it('#handleSearchEvent should be return when isCheckedVar is null and IsShowVarCheck', async () => {
    // Arrange
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    component.dangerAcceptedModels = [Helper.fakeRedCardModel];
    component.mainEvent.isCheckedVar = null;
    component.mainEvent.subIssueTypeId = 1;

    // Action
    await component.handleSearchEvent();

    // Assert
    expect(component.mainEvent.isHighLightVarCheck).toBeTruthy();
  });

  it('#handleSearchEvent should be call #updateData filterTimeWithAllowance when have logInfo', async () => {
    // Arrange
    validationService.validateCommonData = jest.fn().mockImplementation(() => true);
    component.mainEvent.isCheckedVar = false;
    logInfoService.updateIsCheckedVar = jest.fn();
    addRequestStore.changeBlockingUiStatus = jest.fn();
    addRequestStore.changeSavingRequestStatus = jest.fn();
    addRequestApiService.getChildMatches = jest.fn().mockReturnValue([]);
    relatedEventService.getDataWhenSearch = jest.fn();
    component.filter = Helper.fakeFilterModel;
    const logInfoRelatedEventComponent = {} as LogInfoRelatedEventComponent;
    logInfoRelatedEventComponent.filterTimeWithAllowanceComponent = {} as FilterTimeWithAllowanceComponent;
    logInfoRelatedEventComponent.filterTimeWithAllowanceComponent.updateData = jest.fn();
    logInfoRelatedEventComponent.showValidationDetail = jest.fn();
    component.logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
    component.logInfoComponents.reset([logInfoRelatedEventComponent]);
    component.mainEvent.isCheckedVar = false;
    component.allSelectedEvents = [Helper.fakeLogInfoRedCard];

    // Action
    await component.handleSearchEvent();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
    expect(addRequestApiService.getChildMatches).toHaveBeenCalledTimes(1);
    expect(relatedEventService.getDataWhenSearch).toHaveBeenCalledTimes(1);
    expect(logInfoService.updateIsCheckedVar).toHaveBeenCalledTimes(1);
    expect(component.primitiveProps.isShowLogInfoMainMatch).toBeTruthy();
    expect(component.primitiveProps.isShowRelatedEvents).toBeTruthy();
  });

  it('should handle case when has change selectedMatch', () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.eventLeagueComponent.selectedMatch = {
      matchId: 123,
      name: 'Test Match',
      leagueName: 'Test League',
      matchCode: 'TM001',
      eventDate: new Date(),
      sportType: 1
    } as MatchModel;

    component.allSelectedEvents = [];
    logInfoService.resetLogInfoOfEvent = jest.fn();
    component.updateMatchId.emit = jest.fn();

    // Action
    component.changeMatchEvent();

    // Assert
    expect(component.primitiveProps.isShowLogInfoMainMatch).toBeFalsy();
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
    expect(component.allSelectedEvents.length).toBe(1);
    expect(component.mainEvent.matchId).toBe(123);
    expect(component.mainEvent.eventName).toBe('Test Match');
    expect(component.mainEvent.leagueName).toBe('Test League');
    expect(component.mainEvent.matchCode).toBe('TM001');
    expect(component.mainEvent.eventDate).toBe(component.eventLeagueComponent.selectedMatch.eventDate);
    expect(component.mainEvent.sportType).toBe(1);
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(component.eventLeagueComponent.selectedMatch );
  });

  it('#isExistMatchEvent should return true when has mainMatch', () => {
    // Arrange
    component.mainEvent = Helper.fakeLogInfoRedCard;
    component.mainEvent.matchId = 11;

    // Action
    const result = component.isExistMatchEvent();

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isExistMatchEvent should return false when not has mainMatch', () => {
    // Arrange
    component.mainEvent = {} as LogInfoRelatedEvent;

    // Action
    const result = component.isExistMatchEvent();

    // Assert
    expect(result).toBeFalsy();
  });

  it('#resetLogInfoAndHideAllEvents should reset primitiveProps', () => {
    // Arrange
    logInfoService.resetLogInfoOfEvent = jest.fn();
    component.allSelectedEvents = [Helper.fakeLogInfoRedCard];

    // Action
    component.resetDateAfterChangeFilter();

    // Assert
    expect(component.primitiveProps.isShowLogInfoMainMatch).toBeFalsy();
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
  });

  it('#saveRequest should call saveRequestService', () => {
    // Arrange
    saveRequestService.saveRequest = jest.fn();

    // Action
    component.saveRequest();

    // Assert
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
  });

  it('#onClickConfirmSaveRequest should call saveRequestService', () => {
    // Arrange
    saveRequestService.onClickConfirmSave = jest.fn();

    // Action
    component.onClickConfirmSaveRequest();

    // Assert
    expect(saveRequestService.onClickConfirmSave).toHaveBeenCalled();
  });

  it('#onClickCancelSaveRequest should call addRequestStore', () => {
    // Arrange
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Action
    component.onClickCancelSaveRequest();

    // Assert
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalled();
  });

  it('#handleClickAddRelatedEvent should call addRequestStore', () => {
    // Arrange
    relatedEventService.addRelatedEventByInput = jest.fn();
    component.allSelectedEvents = [Helper.fakeLogInfoRedCard];

    // Action
    component.handleClickAddRelatedEvent();

    // Assert
    expect(relatedEventService.addRelatedEventByInput).toHaveBeenCalled();
  });

  it('#handleDeleteEvent should deleted related event has matchId selected', () => {
    // Arrange
    relatedEventService.addRelatedEventByInput = jest.fn();
    component.allSelectedEvents = [{matchId: 123}, {matchId: 456}] as LogInfoRelatedEvent[];

    // Action
    component.handleDeleteEvent(456);

    // Assert
    expect(component.allSelectedEvents).toHaveLength(1);
    expect(component.allSelectedEvents[0].matchId).toBe(123);
  });

  it('#showAddChildMatchModal should update addChildMatchModel from allSelectedEvents', () => {
    // Arrange
    component.allSelectedEvents = [{matchId: 123}, {matchId: 456}] as LogInfoRelatedEvent[];

    // Action
    component.showAddChildMatchModal(1);

    // Assert
    expect(component.addChildMatchModel.matchType).toBe(1);
    expect(component.addChildMatchModel.selectedMatchIds).toEqual([123, 456]);
    expect(component.addChildMatchModel.isOpen).toBeTruthy();
  });

  it('#countChildMatches should return count child matches', () => {
    // Arrange
    component.relatedEvents = [{matchId: 123, matchType: 1}, {matchId: 456, matchType: 2}] as ChildMatchModel[];

    // Action
    const result = component.countChildMatches();
    // Assert
    expect(result).toEqual(1);
  });

  it('#countLinkMatches should return count link matches', () => {
    // Arrange
    component.relatedEvents = [{matchId: 123, matchType: 1}, {matchId: 456, matchType: 2}] as ChildMatchModel[];

    // Action
    const result = component.countLinkMatches();
    // Assert
    expect(result).toEqual(1);
  });

  it('#isDisabledChildMatches should return true when Voided', () => {
    // Arrange
    component.filter = {isVoided: true} as FilterModel;

    // Action
    const result = component.isDisabledChildMatches();

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isDisabledChildMatches should return true when nót has child matches', () => {
    // Arrange
    component.filter = {isVoided: false} as FilterModel;
    component.relatedEvents = [{matchId: 123, matchType: 2}] as ChildMatchModel[];

    // Action
    const result = component.isDisabledChildMatches();

    // Assert
    expect(result).toBeTruthy();
  });


  it('#isDisabledChildMatches should return false when has child matches and not Voided', () => {
    // Arrange
    component.relatedEvents = [{matchId: 123, matchType: 1}] as ChildMatchModel[];
    component.filter = {isVoided: false} as FilterModel;

    // Action
    const result = component.isDisabledChildMatches();

    // Assert
    expect(result).toBeFalsy();
  });

  it('#isDisabledLinkMatches should return true when Voided', () => {
    // Arrange
    component.filter = {isVoided: true} as FilterModel;

    // Action
    const result = component.isDisabledLinkMatches();

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isDisabledLinkMatches should return true when not has child matches', () => {
    // Arrange
    component.filter = {isVoided: false} as FilterModel;
    component.relatedEvents = [{matchId: 123, matchType: 1}] as ChildMatchModel[];

    // Action
    const result = component.isDisabledLinkMatches();

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isDisabledLinkMatches should return false when has child matches and not Voided', () => {
    // Arrange
    component.relatedEvents = [{matchId: 123, matchType: 2}] as ChildMatchModel[];
    component.filter = {isVoided: false} as FilterModel;

    // Action
    const result = component.isDisabledLinkMatches();

    // Assert
    expect(result).toBeFalsy();
  });

  it('#isShowVarCheck should return true when subIssueTypeId has check var', () => {
    // Arrange
    component.mainEvent = {subIssueTypeId: 1} as LogInfoRelatedEvent;

    // Action
    const result = component.isShowVarCheck();

    // Assert
    expect(result).toBeTruthy();
  });

  it('#isShowVarCheck should return false when subIssueTypeId not has check var', () => {
    // Arrange
    component.mainEvent = {subIssueTypeId: 999} as LogInfoRelatedEvent;

    // Action
    const result = component.isShowVarCheck();

    // Assert
    expect(result).toBeFalsy();
  });

  it('#changeVarCheckValue should update mainEvent value checkVar', () => {
    // Arrange
    component.mainEvent = {} as LogInfoRelatedEvent;

    // Action
    component.changeVarCheckValue(true);

    // Assert
    expect(component.mainEvent.isCheckedVar).toBeTruthy();
    expect(component.mainEvent.isHighLightVarCheck).toBeFalsy();
  });

  it('#getLogInfoDetail should return LogInfoDetail mainMatch', () => {
    // Arrange
    component.mainEvent = {logInfoDetail: {matchId: 123}} as LogInfoRelatedEvent;

    // Action
    const result = component.getLogInfoDetail();

    // Assert
    expect(result).toHaveLength(1);
    expect(result).toEqual([component.mainEvent.logInfoDetail]);
  });

  it('#actualTimeChange should update fromTime for filterTime', () => {
    // Arrange
    component.filterTimeAreaComponent = {} as FilterTimeAreaComponent;
    component.filterTimeAreaComponent.filterTimeWithAllowanceComponent = {
      fromTime: null
    } as FilterTimeWithAllowanceComponent;
    logInfoService.resetLogInfoOfEvent = jest.fn();

    // Action
    component.actualTimeChange('2020-10-08 09:44:46.361 PM');

    // Assert
    expect(component.filterTimeAreaComponent.filterTimeWithAllowanceComponent.fromTime).toBe('08:44:46.000 PM');
  });

  describe('saveRelatedEvent', () => {
    beforeEach(() => {
      component.defaultFilterTimeWithAllowance = {
        fromDateTime: '2020-10-08 09:44:46.361 PM',
        toDateTime: '2020-10-09 09:44:46.361 PM',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      };
      component.primitiveProps = {
        isShowLogInfoMainMatch: false,
        isShowRelatedEvents: false,
        isBlock: false,
        filterBy: 1,
        transInfoAddRequestModel: {
          transInfoJson: null,
          unMarkTransIds: null,
          markTransIds: null,
          removeTransIds: null
        },
        infoSiteDBDownModel: null
      };
      component.addChildMatchModel = {
        matchType: MatchType.LINK,
        selectedMatchIds: [],
        isOpen: false
      };
      eventDangerAcceptedService['getGroupSubTypeIncludeAllowanceTime'] = jest.fn().mockReturnValue({
        aa: '3',
        pa: '3',
        sa: '5'
      });
      eventDangerAcceptedService['getSubIssueTypeLinkMatch'] = jest.fn().mockResolvedValue([
        {
          matchId: 1,
          subIssueTypeId: 1
        }
      ]);

      jest.spyOn(logInfoService['commonService'], 'getLogInfo').mockResolvedValue({
        transInfoAddRequestModel: {
          transInfoJson: null,
          unMarkTransIds: null,
          markTransIds: null,
          removeTransIds: null
        },
        getLogInfoModels: [],
        infoSiteDBDownModel: null
      });
      jest.spyOn(eventDangerAcceptedService, 'updateSubIssueTypeAndAllowanceTime').mockResolvedValue(undefined);
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue(undefined);
      jest.spyOn(logInfoService, 'updateIsCheckedVar').mockReturnValue(undefined);
    });

    it('should filter out events that are not in selectedRelatedEvents and not main match', async () => {
      // Arrange
      const selectedRelatedEvents = [
        {
          matchId: 1,
          matchType: MatchType.LINK,
          isChecked: true,
          matchCode: 'TEST1',
          leagueName: 'Test League',
          matchEvent: 'Test Event'
        } as ChildMatchModel
      ] as ChildMatchModel[];
      component.allSelectedEvents = [
        {
          matchId: 1,
          isMainMatch: false,
          subIssueTypeId: 1
        },
        {
          matchId: 2,
          isMainMatch: false,
          subIssueTypeId: 1
        },
        {
          matchId: 3,
          isMainMatch: true,
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      component.relatedEvents = [
        {
          matchId: 2,
          matchType: MatchType.LINK,
          isChecked: true,
          matchCode: 'TEST2',
          leagueName: 'Test League',
          matchEvent: 'Test Event'
        } as ChildMatchModel
      ] as ChildMatchModel[];
      component.filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1',
        isVoided: false
      } as FilterModel;

      // Act
      await component.saveRelatedEvent(selectedRelatedEvents);

      // Assert
      expect(component.allSelectedEvents.length).toBe(2);
      expect(component.allSelectedEvents.find(x => x.matchId === 1)).toBeTruthy();
      expect(component.allSelectedEvents.find(x => x.matchId === 3)).toBeTruthy();
    });

    it('should handle empty selectedRelatedEvents', async () => {
      // Arrange
      const selectedRelatedEvents: ChildMatchModel[] = [];
      component.allSelectedEvents = [
        {
          matchId: 1,
          isMainMatch: false,
          subIssueTypeId: 1
        },
        {
          matchId: 2,
          isMainMatch: true,
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      component.filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1',
        isVoided: false
      } as FilterModel;

      // Act
      await component.saveRelatedEvent(selectedRelatedEvents);

      // Assert
      expect(component.allSelectedEvents.length).toBe(2);
      expect(component.allSelectedEvents.find(x => x.matchId === 2)).toBeTruthy();
      expect(component.allSelectedEvents.find(x => x.matchId === 2).isMainMatch).toBe(true);
    });

    it('should call updateSubIssueTypeAndAllowanceTime when adding new events', async () => {
      // Arrange
      const selectedRelatedEvents = [
        {
          matchId: 1,
          matchType: MatchType.LINK,
          isChecked: true,
          matchCode: 'TEST1',
          leagueName: 'Test League',
          matchEvent: 'Test Event'
        } as ChildMatchModel
      ] as ChildMatchModel[];
      component.allSelectedEvents = [
        {
          matchId: 2,
          isMainMatch: false,
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      const newEvents = [
        {
          matchId: 1,
          isMainMatch: false,
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      jest.spyOn(relatedEventService, 'assignChildMatchToLogInfoModel').mockReturnValue(newEvents);
      component.filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1',
        isVoided: false
      } as FilterModel;

      // Act
      await component.saveRelatedEvent(selectedRelatedEvents);

      // Assert
      expect(eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime).toHaveBeenCalledWith(
        newEvents,
        component.mainEvent,
        component.relatedEvents,
        component.defaultFilterTimeWithAllowance
      );
    });

    it('should call getLogInfo when adding new events', async () => {
      // Arrange
      const selectedRelatedEvents = [
        {
          matchId: 1,
          matchType: MatchType.LINK,
          isChecked: true,
          matchCode: 'TEST1',
          leagueName: 'Test League',
          matchEvent: 'Test Event'
        } as ChildMatchModel
      ] as ChildMatchModel[];
      component.allSelectedEvents = [
        {
          matchId: 2,
          isMainMatch: false,
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      const newEvents = [
        {
          matchId: 1,
          isMainMatch: false,
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      jest.spyOn(relatedEventService, 'assignChildMatchToLogInfoModel').mockReturnValue(newEvents);
      component.filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1',
        isVoided: false
      } as FilterModel;

      // Act
      await component.saveRelatedEvent(selectedRelatedEvents);

      // Assert
      expect(logInfoService.getLogInfo).toHaveBeenCalledWith(
        newEvents,
        component.primitiveProps,
        component.isEdit,
        component.requestId,
        component.filter,
        component.defaultFilterTimeWithAllowance
      );
    });

    it('should call updateIsCheckedVar when adding new events', async () => {
      // Arrange
      const selectedRelatedEvents = [
        {
          matchId: 1,
          matchType: MatchType.LINK,
          isChecked: true,
          matchCode: 'TEST1',
          leagueName: 'Test League',
          matchEvent: 'Test Event'
        } as ChildMatchModel
      ] as ChildMatchModel[];
      component.allSelectedEvents = [
        {
          matchId: 2,
          isMainMatch: false,
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      const newEvents = [
        {
          matchId: 1,
          isMainMatch: false,
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      jest.spyOn(relatedEventService, 'assignChildMatchToLogInfoModel').mockReturnValue(newEvents);
      component.filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1',
        isVoided: false
      } as FilterModel;

      // Act
      await component.saveRelatedEvent(selectedRelatedEvents);

      // Assert
      expect(logInfoService.updateIsCheckedVar).toHaveBeenCalledWith(
        newEvents,
        component.mainEvent.isCheckedVar
      );
    });

    it('should sort and deduplicate allSelectedEvents after adding new events', async () => {
      // Arrange
      const selectedRelatedEvents = [
        {
          matchId: 1,
          matchType: MatchType.LINK,
          isChecked: true,
          matchCode: 'B',
          leagueName: 'Test League',
          matchEvent: 'Test Event'
        } as ChildMatchModel
      ] as ChildMatchModel[];
      component.allSelectedEvents = [
        {
          matchId: 2,
          isMainMatch: false,
          matchCode: 'A',
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      const newEvents = [
        {
          matchId: 1,
          isMainMatch: false,
          matchCode: 'B',
          subIssueTypeId: 1
        }
      ] as LogInfoRelatedEvent[];
      jest.spyOn(relatedEventService, 'assignChildMatchToLogInfoModel').mockReturnValue(newEvents);
      component.filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1',
        isVoided: false
      } as FilterModel;

      // Act
      await component.saveRelatedEvent(selectedRelatedEvents);

      // Assert
      expect(component.allSelectedEvents.length).toBe(2);
      expect(component.allSelectedEvents[0].matchCode).toBe('A');
      expect(component.allSelectedEvents[1].matchCode).toBe('B');
    });

    it('should set isShowRelatedEvents to true after processing', async () => {
      // Arrange
      const selectedRelatedEvents = [
        {
          matchId: 1,
          matchType: MatchType.LINK,
          isChecked: true,
          matchCode: 'TEST1',
          leagueName: 'Test League',
          matchEvent: 'Test Event'
        } as ChildMatchModel
      ] as ChildMatchModel[];
      component.filter = {
        action: '1',
        issueTypeId: '1',
        subIssueTypeId: '1',
        isVoided: false
      } as FilterModel;

      // Act
      await component.saveRelatedEvent(selectedRelatedEvents);

      // Assert
      expect(component.primitiveProps.isShowRelatedEvents).toBe(true);
    });
  });
});
