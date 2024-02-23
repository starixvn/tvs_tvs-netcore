import * as _ from 'lodash';
import { MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { PrimitiveProperty } from '../../event-red-card/event-red-card.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCard } from '../../event-red-card/log-info-red-card/log-info-red-card.model';
import { FilterModel } from '../../filter/filter.model';
import { GroupButton } from '../../filter/sub-issue-type-dialog/sub-issue-type-json.model';
import { RedCardModel } from '../../models/event-red-card.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { SubIssueTypeLinkMatch } from '../../models/sub-type-link-match.model';
import { EventDangerAcceptedService } from './event-danger-accepted.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeAllowanceTime: AllowanceTime = {
    aaTime: 1,
    paTime: 1,
    saTime: 1,
  };
  static readonly fakeRedCardModel: RedCardModel = {
    matchId: Helper.fakeMatchId,
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
    isChangeSubTypeManual: true,
    isAbnormal: false
  };
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: Helper.fakeMatchId,
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
    matchId: Helper.fakeMatchId,
    isMainMatch: true,
    eventName: '',
    leagueName: '',
    subIssueTypeId: SubIssueTypeConstant.MAIN_CORNER,
    voidTimeArea: Helper.fakeFilterTimeWithAllowance,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: Helper.fakeValidationMessage
  };
  static readonly fakeChildMatchModel: ChildMatchModel = {
    matchId: Helper.fakeMatchId,
    matchCode: '222',
    matchEvent: 'TestC - vs - Real Madrid (V)',
    isChecked: true,
    matchType: MatchType.LINK,
    leagueName: '',
    name: ''
  };
  static readonly fakeSubIssueTypeLinkMatch: SubIssueTypeLinkMatch = {
    matchId: Helper.fakeMatchId,
    subIssueTypeId: 26
  };
  static readonly fakeGroupButton: GroupButton = {
    name: 'Home',
    iconClass: '',
    buttonSelectHomeAway: [],
    buttonSelectAll: [],
    aa: '4',
    pa: '4',
    sa: '4',
    description: [],
    groupId: 1,
    note: '',
    noteEditable: false
  };
}

describe('EventDangerAcceptedService', () => {
  let eventDangerAcceptedService: EventDangerAcceptedService;

  beforeEach(() => {
    eventDangerAcceptedService = new EventDangerAcceptedService(null);
  });

  it('#assignModelsToEvents should update correct model', async () => {
    // Arrange
    const allEvents = [];
    const primitiveProps = new PrimitiveProperty();
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeAllowanceTime = jest.fn();

    // Action
    eventDangerAcceptedService.assignModelsToEvents(allEvents, [Helper.fakeRedCardModel], primitiveProps, addRequestStore);

    // Assert
    expect(allEvents.length).toBe(1);
    expect(primitiveProps.filterBy).toBe(Helper.fakeRedCardModel.filterBy);
    expect(addRequestStore.changeAllowanceTime).toHaveBeenCalledTimes(1);
  });

  it('#updateDefaultFilterTime should update correct model', async () => {
    // Arrange
    const defaultFilter = new FilterTimeWithAllowance();

    // Action
    eventDangerAcceptedService.updateDefaultFilterTime(defaultFilter, [Helper.fakeRedCardModel]);

    // Assert
    expect(defaultFilter.fromDateTime).toBe(Helper.fakeRedCardModel.filterFromTransTime);
    expect(defaultFilter.toDateTime).toBe(Helper.fakeRedCardModel.filterToTransTime);
  });

  it('#initDefaultFilterTime should update correct model', async () => {
    // Arrange
    const defaultFilter = new FilterTimeWithAllowance();

    // Action
    eventDangerAcceptedService.initDefaultFilterTime(defaultFilter);

    // Assert
    expect(defaultFilter.fromDateTime).toBeDefined();
    expect(defaultFilter.toDateTime).toBeDefined();
  });

  it('#initDefaultMainEvent should return main event', async () => {
    // Arrange
    const allSelectedEvents = [];

    // Action
    const actual = eventDangerAcceptedService.initDefaultMainEvent(allSelectedEvents);

    // Assert
    expect(actual.isMainMatch).toBeTruthy();
    expect(allSelectedEvents.length).toBe(1);
  });

  it('#updateSubIssueTypeAndAllowanceTime should call #getSubIssueTypeLinkMatch', async () => {
    // Arrange
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.subIssueTypeId = 11;
    eventDangerAcceptedService['getSubIssueTypeLinkMatch'] = jest.fn();
    eventDangerAcceptedService['updateSubIssueType'] = jest.fn();
    eventDangerAcceptedService['updateAllowanceTime'] = jest.fn();

    // Action
    await eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime([Helper.fakeLogInfoRedCard], mainEvent, [Helper.fakeChildMatchModel], null);

    // Assert
    expect(eventDangerAcceptedService['getSubIssueTypeLinkMatch']).toHaveBeenCalledTimes(0);
    expect(eventDangerAcceptedService['updateSubIssueType']).toHaveBeenCalledTimes(1);
    expect(eventDangerAcceptedService['updateAllowanceTime']).toHaveBeenCalledTimes(1);
  });

  it('#updateSubIssueTypeAndAllowanceTime should not call #getSubIssueTypeLinkMatch', async () => {
    // Arrange
    eventDangerAcceptedService['getSubIssueTypeLinkMatch'] = jest.fn();
    eventDangerAcceptedService['updateSubIssueType'] = jest.fn();
    eventDangerAcceptedService['updateAllowanceTime'] = jest.fn();

    // Action
    await eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime([Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard, [Helper.fakeChildMatchModel], null);

    // Assert
    expect(eventDangerAcceptedService['getSubIssueTypeLinkMatch']).toHaveBeenCalledTimes(1);
    expect(eventDangerAcceptedService['updateSubIssueType']).toHaveBeenCalledTimes(1);
    expect(eventDangerAcceptedService['updateAllowanceTime']).toHaveBeenCalledTimes(1);
  });

  it('#getSubIssueTypeId should return expected issue type id when have SubIssueTypeLinkMatch', async () => {
    // Action
    const actual = eventDangerAcceptedService['getSubIssueTypeId'](Helper.fakeMatchId, [Helper.fakeSubIssueTypeLinkMatch], [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(actual).toBe(Helper.fakeSubIssueTypeLinkMatch.subIssueTypeId);
  });

  it('#getSubIssueTypeId should return expected issue type id when SubIssueTypeLinkMatch.subIssueTypeId is Null', async () => {
    // Arrange
    const fakeSubIssueTypeLinkMatch = _.cloneDeep(Helper.fakeSubIssueTypeLinkMatch);
    fakeSubIssueTypeLinkMatch.subIssueTypeId = null;

    // Action
    const actual = eventDangerAcceptedService['getSubIssueTypeId'](Helper.fakeMatchId, [fakeSubIssueTypeLinkMatch], [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(actual).toBe(Helper.fakeLogInfoRedCard.subIssueTypeId);
  });

  it('#getSubIssueTypeId should return expected issue type id', async () => {
    // Arrange
    const fakeSubIssueTypeLinkMatch = _.cloneDeep(Helper.fakeSubIssueTypeLinkMatch);
    fakeSubIssueTypeLinkMatch.subIssueTypeId = null;

    // Action
    const actual = eventDangerAcceptedService['getSubIssueTypeId'](Helper.fakeMatchId, [], [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(actual).toBe(Helper.fakeLogInfoRedCard.subIssueTypeId);
  });

  it('#getSubIssueTypeId should return expected issue type id when handling matchId is not same', async () => {
    // Arrange
    const fakeSubIssueTypeLinkMatch = _.cloneDeep(Helper.fakeSubIssueTypeLinkMatch);
    fakeSubIssueTypeLinkMatch.subIssueTypeId = null;

    // Action
    const actual = eventDangerAcceptedService['getSubIssueTypeId'](1119, [], [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(actual).toBe(Helper.fakeLogInfoRedCard.subIssueTypeId);
  });

  it('#updateSubIssueType should update correct data ', async () => {
    // Arrange
    eventDangerAcceptedService['getSubIssueTypeId'] = jest.fn();

    // Action
    eventDangerAcceptedService['updateSubIssueType']([Helper.fakeLogInfoRedCard], [Helper.fakeSubIssueTypeLinkMatch],
      [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(eventDangerAcceptedService['getSubIssueTypeId']).toHaveBeenCalled();
  });

  it('#updateAllowanceTime should update correct data ', async () => {
    // Arrange
    eventDangerAcceptedService['getNewFilterTimeWithAllowanceBySubIssueType'] = jest.fn();

    // Action
    eventDangerAcceptedService['updateAllowanceTime']([Helper.fakeLogInfoRedCard], null);

    // Assert
    expect(eventDangerAcceptedService['getNewFilterTimeWithAllowanceBySubIssueType']).toHaveBeenCalled();
  });

  it('#getNewFilterTimeWithAllowanceBySubIssueType should return VoidTimeArea ', async () => {
    // Arrange
    eventDangerAcceptedService['getGroupSubTypeIncludeAllowanceTime'] = jest.fn().mockImplementation(() => Helper.fakeGroupButton);

    // Action
    const actual = eventDangerAcceptedService['getNewFilterTimeWithAllowanceBySubIssueType'](Helper.fakeLogInfoRedCard, new FilterTimeWithAllowance());

    // Assert
    expect(actual.aaTime.toString()).toBe(Helper.fakeGroupButton.aa);
    expect(actual.paTime.toString()).toBe(Helper.fakeGroupButton.pa);
    expect(actual.saTime.toString()).toBe(Helper.fakeGroupButton.sa);
  });

  it('#getSubIssueTypeLinkMatch should return VoidTimeArea ', async () => {
    // Arrange
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getSubIssueTypeLinkMatch = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeSubIssueTypeLinkMatch]));
    const mockEventDangerAcceptedService = new EventDangerAcceptedService(addRequestApiService);
    mockEventDangerAcceptedService['getGroupSubTypeIncludeAllowanceTime'] = jest.fn().mockImplementation(() => Helper.fakeGroupButton);

    // Action
    const actual = await mockEventDangerAcceptedService['getSubIssueTypeLinkMatch'](55, '1,2');

    // Assert
    expect(actual).toEqual([Helper.fakeSubIssueTypeLinkMatch]);
  });
});
