import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongOfferedNameModel } from '../models/event-wrong-offered-name.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { EventWrongOfferedNameComponent } from './event-wrong-offered-name.component';
import { FilterWrongOfferedNameModel } from './models/filter-wrong-offered-name.model';
import { LogInfoWrongOfferedName } from './models/log-info-wrong-offered-name.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { EventWrongOfferedNameService } from './services/event-wrong-offered-name.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
class Helper {
  static readonly fakeWrongOfferedNameModel: WrongOfferedNameModel = {
    currencyIds: '1,2',
    licenseeNames: 'licensee1,licensee2',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    subIssueTypeId: 1
  } as WrongOfferedNameModel;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '26',
    subIssueTypeId: '1',
    action: '5'
  } as FilterModel;
  static readonly fakeLogInfoWrongOfferedName: LogInfoWrongOfferedName = {
    matchId: 1,
    filterWrongOfferedName: new FilterWrongOfferedNameModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
  } as LogInfoWrongOfferedName;
  static readonly fakeFilterWrongOfferedName: FilterWrongOfferedNameModel = {
    currencyIds: [],
    licenseeNames: []
  } as FilterWrongOfferedNameModel;
}

describe('EventWrongOfferedNameComponent', () => {
  let mockComponent: EventWrongOfferedNameComponent;
  let mockLogInfoService: LogInfoService;
  let mockAddRequestStore: AddRequestStore;
  let mockValidationService: ValidationService;
  let mockSaveRequestService: SaveRequestService;
  let mockEventWrongOfferedNameService: EventWrongOfferedNameService;

  beforeEach(() => {
    mockLogInfoService = new LogInfoService(null, null);
    mockAddRequestStore = new AddRequestStore();
    mockValidationService = new ValidationService(null,);
    mockSaveRequestService = new SaveRequestService(null, null, null, null, null);
    mockEventWrongOfferedNameService = new EventWrongOfferedNameService(null, null, null, null, null);
    mockComponent = new EventWrongOfferedNameComponent(
      mockLogInfoService, mockAddRequestStore, mockValidationService, mockSaveRequestService, mockEventWrongOfferedNameService
    );
    mockComponent.logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    mockComponent.filter = Helper.fakeFilterModel;
    mockComponent.primitiveProps = new PrimitiveProperty();
  });

  it('EventWrongOfferedNameComponent init should match snapshot', async () => {
    expect(mockComponent).toMatchSnapshot();
  });

  it('ngOnInit should call #updateDataWhenEditRequest', async () => {
    const permission = { isAddSettledTickets: true } as PermissionAddRequest;
    mockComponent.isEdit = true;
    mockComponent.updateDataWhenEditRequest = jest.fn();
    mockEventWrongOfferedNameService.getPermissionAddRequest = jest.fn().mockReturnValue(permission);

    await mockComponent.ngOnInit();

    expect(mockComponent.updateDataWhenEditRequest).toHaveBeenCalledTimes(1);
    expect(mockEventWrongOfferedNameService.getPermissionAddRequest).toHaveBeenCalledTimes(1);
    expect(mockComponent.permission).toBe(permission);
  });

  it('ngOnInit should call #eventWrongOfferedNameService.initLogInfoEvent', async () => {
    const permission = { isAddSettledTickets: true } as PermissionAddRequest;
    mockComponent.isEdit = false;
    mockEventWrongOfferedNameService.initLogInfoEvent = jest.fn().mockReturnValue(Helper.fakeLogInfoWrongOfferedName);
    mockEventWrongOfferedNameService.getPermissionAddRequest = jest.fn().mockReturnValue(permission);

    await mockComponent.ngOnInit();

    expect(mockEventWrongOfferedNameService.initLogInfoEvent).toHaveBeenCalledTimes(1);
    expect(mockEventWrongOfferedNameService.getPermissionAddRequest).toHaveBeenCalledTimes(1);
    expect(mockComponent.permission).toBe(permission);
    expect(mockComponent.logInfoEvent).toBe(Helper.fakeLogInfoWrongOfferedName);
  });

  it('updateDataWhenEditRequest should call #eventWrongOfferedNameService.assignModelsToEvents', async () => {
    mockEventWrongOfferedNameService.assignModelsToEvents = jest.fn().mockReturnValue(Helper.fakeLogInfoWrongOfferedName);

    await mockComponent.updateDataWhenEditRequest();

    expect(mockEventWrongOfferedNameService.assignModelsToEvents).toHaveBeenCalledTimes(1);
    expect(mockComponent.primitiveProps.isShowLogInfo).toBeTruthy();
  });

  it('changeMatchEvent should call #logInfoService.resetLogInfoOfEvent & emit #updateMatchId & update matchModel', async () => {
    const matchModel = new MatchModel();
    mockLogInfoService.resetLogInfoOfEvent = jest.fn();
    mockComponent.updateMatchId.emit = jest.fn();
    mockEventWrongOfferedNameService.updateSelectedMatchToInput = jest.fn();
    mockComponent.eventLeagueComponent = new EventLeagueComponent(null, null, null);
    mockComponent.eventLeagueComponent.selectedMatch = matchModel;
    mockComponent.eventLeagueComponent.selectedMatch.matchId = 1;

    await mockComponent.changeMatchEvent();

    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockComponent.updateMatchId.emit).toHaveBeenCalledTimes(1);
    expect(mockEventWrongOfferedNameService.updateSelectedMatchToInput).toHaveBeenCalledTimes(1);
    expect(mockComponent.logInfoEvent.matchModel).toBe(matchModel);
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

    await mockComponent.handleSearchEvent();

    expect(mockLogInfoService.resetLogInfoOfEvent).toHaveBeenCalledTimes(1);
    expect(mockValidationService.validateCommonData).toHaveBeenCalledTimes(1);
    expect(mockAddRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(mockValidationService.isAccountHasAddRequestPermission).toHaveBeenCalledTimes(1);
    expect(mockComponent.primitiveProps.isShowLogInfo).toBeTruthy();
  });

  it('saveRequest should call #saveRequestService.saveRequest', async () => {
    mockSaveRequestService.saveRequest = jest.fn();
    mockComponent.initSaveRequestInput = jest.fn();

    await mockComponent.saveRequest();

    expect(mockSaveRequestService.saveRequest).toHaveBeenCalledTimes(1);
    expect(mockComponent.initSaveRequestInput).toHaveBeenCalledTimes(1);
  });

  it('onClickConfirmSaveRequest should call #saveRequestService.onClickConfirmSave', async () => {
    mockSaveRequestService.onClickConfirmSave = jest.fn();
    mockComponent.initSaveRequestInput = jest.fn();

    await mockComponent.onClickConfirmSaveRequest();

    expect(mockSaveRequestService.onClickConfirmSave).toHaveBeenCalledTimes(1);
    expect(mockComponent.initSaveRequestInput).toHaveBeenCalledTimes(1);
  });

  it('onClickCancelSaveRequest should call #mockAddRequestStore.changeSavingRequestStatus', async () => {
    mockAddRequestStore.changeSavingRequestStatus = jest.fn();
    mockComponent.onClickCancelSaveRequest();

    expect(mockAddRequestStore.changeSavingRequestStatus).toHaveBeenCalledTimes(1);
  });

  it('resetLogInfo should update isShowLogInfo false', async () => {
    mockComponent.resetLogInfo();

    expect(mockComponent.primitiveProps.isShowLogInfo).toBeFalsy();
  });

  it('initSaveRequestInput should return object', async () => {
    const actual = mockComponent.initSaveRequestInput();

    expect(actual.requestId).toBe(mockComponent.requestId);
    expect(actual.requestedBy).toBe(mockComponent.requestedBy);
    expect(actual.isEdit).toBe(mockComponent.isEdit);
    expect(actual.userId).toBe(mockComponent.userId);
    expect(actual.actionIdOfFirstTimeAccess).toBe(mockComponent.actionIdOfFirstTimeAccess);
    expect(actual.others).toBe(mockComponent.others);
    expect(actual.filter).toBe(mockComponent.filter);
    expect(actual.primitiveProps).toBe(mockComponent.primitiveProps);
    expect(actual.filterWrongOfferedNameComponent).toBe(mockComponent.filterWrongOfferedNameComponent);
    expect(actual.eventLeagueComponent).toBe(mockComponent.eventLeagueComponent);
    expect(actual.logInfoEvent).toBe(mockComponent.logInfoEvent);
    expect(actual.confirmAddRequest).toBe(mockComponent.confirmAddRequest);
    expect(actual.permission).toBe(mockComponent.permission);
  });
});