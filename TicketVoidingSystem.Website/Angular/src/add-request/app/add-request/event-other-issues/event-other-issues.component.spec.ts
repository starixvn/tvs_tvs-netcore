import { SimpleChange } from '@angular/core';
import { AdvancedModeAddRequestComponent } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { BetTeamAddRequestResult } from '../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model';
import { GroupBetTypeAddRequest, GroupBetTypesAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { OtherIssuesModel } from '../models/event-other-issues.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { EventOtherIssuesComponent } from './event-other-issues.component';
import { FilterOtherIssuesModel } from './models/filter-other-isssues.model';
import { LogInfoOtherIssues } from './models/log-info-other-issues.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { EventOtherIssuesService } from './services/event-other-issues.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

class Helper {
  static readonly fakeOtherIssuesModel: OtherIssuesModel = {
    filterFromTransTime: '2024-10-08 09:44:46.363 PM',
    filterToTransTime: '2024-10-08 09:44:46.364 PM',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    subIssueTypeId: 1
  } as OtherIssuesModel;
  static readonly fakeLogInfoOtherIssues: LogInfoOtherIssues = {
    matchId: 1,
    filterOtherIssues: new FilterOtherIssuesModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
  } as LogInfoOtherIssues;
  static readonly fakeFilterOtherIssues: FilterOtherIssuesModel = {
    fromDateTime: '2024-10-08 09:44:46.361 PM',
    toDateTime: '2024-10-08 09:44:46.362 PM',
  } as FilterOtherIssuesModel;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '11',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  } as FilterModel;
}

describe('EventOtherIssuesComponent', () => {
  let mockComponent: EventOtherIssuesComponent;
  let mockLogInfoService: LogInfoService;
  let mockAddRequestStore: AddRequestStore;
  let mockValidationService: ValidationService;
  let mockSaveRequestService: SaveRequestService;
  let mockEventOtherIssuesService: EventOtherIssuesService;
  let mockAddRequestApiService: AddRequestApiService;

  beforeEach(() => {
    mockLogInfoService = new LogInfoService(null, null);
    mockAddRequestStore = new AddRequestStore();
    mockValidationService = new ValidationService(null,);
    mockSaveRequestService = new SaveRequestService(null, null, null, null, null);
    mockEventOtherIssuesService = new EventOtherIssuesService(null, null);
    mockAddRequestApiService = new AddRequestApiService(null);
    mockComponent = new EventOtherIssuesComponent(mockValidationService, mockEventOtherIssuesService,
      mockLogInfoService, mockAddRequestStore, mockSaveRequestService, mockAddRequestApiService
    );
    mockComponent.logInfoEvent = Helper.fakeLogInfoOtherIssues;
    mockComponent.filter = Helper.fakeFilterModel;
    mockComponent.primitiveProps = new PrimitiveProperty();
  });

  it('EventOtherIssuesComponent init should match snapshot', async () => {
    expect(mockComponent).toMatchSnapshot();
  });

  it('ngOnChanges should call #eventOtherIssuesService.initDefaultFilter', async () => {
    const changes = {
      'filter': new SimpleChange(null, null, true)
    };
    mockComponent.primitiveProps = new PrimitiveProperty();
    mockComponent.filter = Helper.fakeFilterModel;
    mockComponent.filter.isChangeSubTypeManual = true;
    mockComponent.logInfoEvent = Helper.fakeLogInfoOtherIssues;
    mockComponent.isSubTypeRestart = jest.fn().mockReturnValue(true);
    mockEventOtherIssuesService.initDefaultFilter = jest.fn().mockReturnValue(Helper.fakeFilterOtherIssues);

    await mockComponent.ngOnChanges(changes);

    expect(mockComponent.isSubTypeRestart).toHaveBeenCalledTimes(1);
    expect(mockEventOtherIssuesService.initDefaultFilter).toHaveBeenCalledTimes(1);
    expect(mockComponent.primitiveProps.isShowValidation).toBeFalsy();
  });


  it('ngOnChanges should call #renderDataBetTypesAdvancedMode', async () => {
    const changes = {
      'filter': new SimpleChange(null, null, true)
    };
    mockComponent.primitiveProps = new PrimitiveProperty();
    mockComponent.filter = Helper.fakeFilterModel;
    mockComponent.filter.isChangeSubTypeManual = true;
    mockComponent.isSubTypeRestart = jest.fn().mockReturnValue(false);
    mockComponent.renderDataBetTypesAdvancedMode = jest.fn();

    await mockComponent.ngOnChanges(changes);

    expect(mockComponent.isSubTypeRestart).toHaveBeenCalledTimes(1);
    expect(mockComponent.renderDataBetTypesAdvancedMode).toHaveBeenCalledTimes(1);
  });

  it('ngOnChanges should not call #eventOtherIssuesService.initDefaultFilter and #renderDataBetTypesAdvancedMode', async () => {
    const changes = {
      'filter': new SimpleChange(null, null, true)
    };
    mockComponent.primitiveProps = new PrimitiveProperty();
    mockComponent.filter = Helper.fakeFilterModel;
    mockComponent.filter.isChangeSubTypeManual = false;
    mockComponent.logInfoEvent = Helper.fakeLogInfoOtherIssues;
    mockComponent.isSubTypeRestart = jest.fn().mockReturnValue(true);
    mockEventOtherIssuesService.initDefaultFilter = jest.fn().mockReturnValue(Helper.fakeFilterOtherIssues);
    mockComponent.renderDataBetTypesAdvancedMode = jest.fn();

    await mockComponent.ngOnChanges(changes);

    expect(mockComponent.isSubTypeRestart).toHaveBeenCalledTimes(0);
    expect(mockEventOtherIssuesService.initDefaultFilter).toHaveBeenCalledTimes(0);
    expect(mockComponent.renderDataBetTypesAdvancedMode).toHaveBeenCalledTimes(0);
  });

  it('ngOnInit should call #updateDataWhenEditRequest', async () => {
    const permission = { isAddSettledTickets: true } as PermissionAddRequest;
    mockComponent.isEdit = true;
    mockComponent.updateDataWhenEditRequest = jest.fn();
    mockAddRequestApiService.getPermissionAddRequest = jest.fn().mockReturnValue(permission);

    await mockComponent.ngOnInit();

    expect(mockComponent.updateDataWhenEditRequest).toHaveBeenCalledTimes(1);
    expect(mockAddRequestApiService.getPermissionAddRequest).toHaveBeenCalledTimes(1);
    expect(mockComponent.permission).toBe(permission);
  });

  it('ngOnInit should call #eventOtherIssuesService.initLogInfoEvent', async () => {
    const permission = { isAddSettledTickets: true } as PermissionAddRequest;
    mockComponent.isEdit = false;
    mockEventOtherIssuesService.initDefaultLogInfoOtherIssues = jest.fn().mockReturnValue(Helper.fakeLogInfoOtherIssues);
    mockAddRequestApiService.getPermissionAddRequest = jest.fn().mockReturnValue(permission);

    await mockComponent.ngOnInit();

    expect(mockEventOtherIssuesService.initDefaultLogInfoOtherIssues).toHaveBeenCalledTimes(1);
    expect(mockAddRequestApiService.getPermissionAddRequest).toHaveBeenCalledTimes(1);
    expect(mockComponent.permission).toBe(permission);
    expect(mockComponent.logInfoEvent).toBe(Helper.fakeLogInfoOtherIssues);
  });

  it('updateDataWhenEditRequest should call #eventOtherIssuesService.assignModelsToEvents', async () => {
    const groupBetTypes = [{ betTypes: [{ id: 1 }, { id: 2 }, { id: 3 }] }] as GroupBetTypeAddRequest[];
    const betTeamAddRequest = [{ id: '1' }, { id: '2' }] as BetTeamAddRequestResult[];

    mockEventOtherIssuesService.assignModelsToEvents = jest.fn().mockReturnValue(Helper.fakeLogInfoOtherIssues);
    mockComponent.otherIssuesModel = Helper.fakeOtherIssuesModel;
    mockComponent.otherIssuesModel.groupBetTypes = groupBetTypes;
    mockComponent.otherIssuesModel.betTeamsResult = betTeamAddRequest;
    mockComponent.updateDataWhenEditRequest();

    expect(mockEventOtherIssuesService.assignModelsToEvents).toHaveBeenCalledTimes(1);
    expect(mockComponent.primitiveProps.isShowValidation).toBeTruthy();
    expect(mockComponent.primitiveProps.isShowAdvancedModeBetTypes).toBeTruthy();
  });

  it('changeMatchEvent should call #logInfoService.resetLogInfoOfEvent & emit #updateMatchId & update matchModel', async () => {
    const matchModel = new MatchModel();
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockComponent.updateMatchId.emit = jest.fn();
    mockComponent.eventLeagueComponent = new EventLeagueComponent(null, null, null);
    mockComponent.eventLeagueComponent.selectedMatch = matchModel;
    mockComponent.eventLeagueComponent.selectedMatch.matchId = 1;
    mockComponent.isSubTypeRestart = jest.fn().mockReturnValue(false);
    mockComponent.renderDataBetTypesAdvancedMode = jest.fn();

    await mockComponent.changeMatchEvent();

    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockComponent.updateMatchId.emit).toHaveBeenCalledTimes(1);
    expect(mockComponent.isSubTypeRestart).toHaveBeenCalledTimes(1);
    expect(mockComponent.renderDataBetTypesAdvancedMode).toHaveBeenCalledTimes(1);
    expect(mockComponent.logInfoEvent.matchId).toBe(1);
  });

  it('changeMatchEvent should call #logInfoService.resetLogInfoOfEvent & emit #updateMatchId', async () => {
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockComponent.updateMatchId.emit = jest.fn();
    mockComponent.eventLeagueComponent = null;

    await mockComponent.changeMatchEvent();

    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockComponent.updateMatchId.emit).toHaveBeenCalledTimes(1);
  });

  it('handleSearchEvent should call #validationService.validateCommonData & return when validateCommonData false', async () => {
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(false);
    mockComponent.otherIssuesModel = Helper.fakeOtherIssuesModel;
    mockComponent.advancedMode = new AdvancedModeAddRequestComponent();
    mockComponent.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);

    await mockComponent.handleSearchEvent();

    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidationService.validateCommonData).toHaveBeenCalledTimes(1);
  });

  it('handleSearchEvent should call #validationService.validateCommonData & return when validateCommonData false', async () => {
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockLogInfoService.getLogInfo = jest.fn();
    mockAddRequestStore.changeBlockingUiStatus = jest.fn();
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(true);
    mockValidationService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(false);
    mockComponent.advancedMode = new AdvancedModeAddRequestComponent();
    mockComponent.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);

    await mockComponent.handleSearchEvent();

    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(mockAddRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockValidationService.isAccountHasAddRequestPermission).toHaveBeenCalledTimes(1);
  });

  it('handleSearchEvent should call all method successfully & set isShowLogInfo to true', async () => {
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockLogInfoService.getLogInfo = jest.fn();
    mockAddRequestStore.changeBlockingUiStatus = jest.fn();
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(true);
    mockValidationService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(true);
    mockComponent.advancedMode = new AdvancedModeAddRequestComponent();
    mockComponent.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);

    await mockComponent.handleSearchEvent();

    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(mockAddRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockValidationService.isAccountHasAddRequestPermission).toHaveBeenCalledTimes(1);
    expect(mockComponent.primitiveProps.isShowValidation).toBeTruthy();
  });

  it('saveRequest should call #saveRequestService.saveRequest', async () => {
    mockSaveRequestService.saveRequest = jest.fn();
    mockComponent['initSaveRequestInput'] = jest.fn();

    await mockComponent.saveRequest();

    expect(mockSaveRequestService.saveRequest).toHaveBeenCalledTimes(1);
    expect(mockComponent['initSaveRequestInput']).toHaveBeenCalledTimes(1);
  });

  it('onClickConfirmSaveRequest should call #saveRequestService.onClickConfirmSave', async () => {
    mockSaveRequestService.onClickConfirmSave = jest.fn();
    mockComponent['initSaveRequestInput'] = jest.fn();

    await mockComponent.onClickConfirmSaveRequest();

    expect(mockSaveRequestService.onClickConfirmSave).toHaveBeenCalledTimes(1);
    expect(mockComponent['initSaveRequestInput']).toHaveBeenCalledTimes(1);
  });

  it('onClickCancelSaveRequest should call #mockAddRequestStore.changeSavingRequestStatus', async () => {
    mockAddRequestStore.changeSavingRequestStatus = jest.fn();
    mockComponent.onClickCancelSaveRequest();

    expect(mockAddRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('resetLogInfo should update isShowLogInfo false', async () => {
    mockComponent.resetLogInfo();

    expect(mockComponent.primitiveProps.isShowValidation).toBeFalsy();
    expect(mockComponent.primitiveProps.isShowErrorNoBetType).toBeFalsy();
  });

  it('initSaveRequestInput should return object and call #advancedMode.getCheckedBetTypes', async () => {
    mockComponent.filter.isVoided = false;
    mockComponent.advancedMode = new AdvancedModeAddRequestComponent();
    mockComponent.advancedMode.getCheckedBetTypes = jest.fn().mockReturnValue([]);

    const actual = mockComponent['initSaveRequestInput']();

    expect(actual.requestId).toBe(mockComponent.requestId);
    expect(actual.requestedBy).toBe(mockComponent.requestedBy);
    expect(actual.isEdit).toBe(mockComponent.isEdit);
    expect(actual.userId).toBe(mockComponent.userId);
    expect(actual.actionIdOfFirstTimeAccess).toBe(mockComponent.actionIdOfFirstTimeAccess);
    expect(actual.others).toBe(mockComponent.others);
    expect(actual.filter).toBe(mockComponent.filter);
    expect(actual.primitiveProps).toBe(mockComponent.primitiveProps);
    expect(actual.issueTypes).toBe(mockComponent.issueTypes);
    expect(actual.filterOtherIssuesComponent).toBe(mockComponent.filterOtherIssuesComponent);
    expect(actual.eventLeagueComponent).toBe(mockComponent.eventLeagueComponent);
    expect(actual.logInfoEvent).toBe(mockComponent.logInfoEvent);
    expect(actual.confirmAddRequest).toBe(mockComponent.confirmAddRequest);
    expect(actual.permission).toBe(mockComponent.permission);
    expect(mockComponent.advancedMode.getCheckedBetTypes).toHaveBeenCalledTimes(1);
  });

  it('resetBetTypeAndAdvancedMode should call #advancedMode.clearBetTeam', async () => {
    mockComponent.advancedMode = new AdvancedModeAddRequestComponent();
    mockComponent.advancedMode.clearBetTeam = jest.fn();
    mockComponent['resetBetTypeAndAdvancedMode']();

    expect(mockComponent.advancedMode.clearBetTeam).toHaveBeenCalledTimes(1);
  });

  it('resetLogInfoOfEvent should call #logInfoService.resetLogInfoOfEvent and update isShowValidation to false', async () => {
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockComponent.primitiveProps = new PrimitiveProperty();
    mockComponent.primitiveProps.isShowValidation = true;
    mockComponent.resetLogInfoOfEvent();

    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockComponent.primitiveProps.isShowValidation).toBeFalsy();
  });

  it('checkExistBetTypeEvent should update isShowErrorNoBetType to expected', async () => {
    [
      { isHaveBetType: true, expected: false },
      { isHaveBetType: false, expected: true }
    ].forEach((testCase) => {
      mockComponent.checkExistBetTypeEvent(testCase.isHaveBetType);

      expect(mockComponent.primitiveProps.isShowErrorNoBetType).toBe(testCase.expected);
    });
  });

  it('isSubTypeRestart should return result from validationService.isSubTypeRestart', async () => {
    [
      { isSubTypeRestart: true, expected: true },
      { isSubTypeRestart: false, expected: false }
    ].forEach((testCase) => {
      mockValidationService.isSubTypeRestart = jest.fn().mockReturnValue(testCase.isSubTypeRestart);
      const actual = mockComponent.isSubTypeRestart();

      expect(actual).toBe(testCase.expected);
      expect(mockValidationService.isSubTypeRestart).toHaveBeenCalledTimes(1);
    });
  });

  it('getGroupBetTypes should call #eventOtherIssuesService.getGroupBetTypes', async () => {
    const groupBetTypes = [
      {
        betTypes: [{ id: 1 }, { id: 2 }, { id: 3 }]
      }
    ] as GroupBetTypeAddRequest[];
    const currentGroupModel = new GroupBetTypesAddRequestModel(groupBetTypes, false, '', false);
    mockEventOtherIssuesService.getGroupBetTypes = jest.fn().mockReturnValue(currentGroupModel);
    mockAddRequestStore.changeBlockingUiStatus = jest.fn();
    mockComponent.groupBetTypesModel = currentGroupModel;

    await mockComponent.getGroupBetTypes();

    expect(mockEventOtherIssuesService.getGroupBetTypes).toHaveBeenCalledTimes(1);
    expect(mockAddRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockComponent.groupBetTypesModel).toEqual(currentGroupModel);
  });

  it('renderDataBetTypesAdvancedMode should call #getGroupBetTypes', async () => {
    mockComponent.groupBetTypesModel = new GroupBetTypesAddRequestModel([], false, '', false);
    mockComponent.getGroupBetTypes = jest.fn();
    mockComponent.resetLogInfo = jest.fn();
    mockComponent.advancedMode = new AdvancedModeAddRequestComponent();
    mockComponent.advancedMode.changeBetTypes = jest.fn();
    mockComponent.groupBetTypesModel.getAllBetTypes = jest.fn().mockReturnValue([]);
    mockComponent.primitiveProps = new PrimitiveProperty();
    mockComponent.eventLeagueComponent = new EventLeagueComponent(null, null, null);
    mockComponent.eventLeagueComponent.selectedMatch = new MatchModel();
    mockComponent.eventLeagueComponent.selectedMatch.matchId = 11;

    await mockComponent.renderDataBetTypesAdvancedMode();

    expect(mockComponent.getGroupBetTypes).toHaveBeenCalledTimes(1);
    expect(mockComponent.resetLogInfo).toHaveBeenCalledTimes(1);
    expect(mockComponent.advancedMode.changeBetTypes).toHaveBeenCalledTimes(1);
    expect(mockComponent.primitiveProps.isShowAdvancedModeBetTypes).toBeTruthy();
    expect(mockComponent.primitiveProps.isShowErrorNoBetType).toBeTruthy();
  });

  it('refreshEvent should not call #renderDataBetTypesAdvancedMode when validationService.validateCommonData false', async () => {
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(false);
    mockComponent.renderDataBetTypesAdvancedMode = jest.fn();
    await mockComponent.refreshEvent();

    expect(mockComponent.renderDataBetTypesAdvancedMode).toHaveBeenCalledTimes(0);
  });

  it('refreshEvent should call #renderDataBetTypesAdvancedMode', async () => {
    mockValidationService.validateCommonData = jest.fn().mockReturnValue(true);
    mockComponent.renderDataBetTypesAdvancedMode = jest.fn();
    await mockComponent.refreshEvent();

    expect(mockComponent.renderDataBetTypesAdvancedMode).toHaveBeenCalledTimes(1);
  });
});