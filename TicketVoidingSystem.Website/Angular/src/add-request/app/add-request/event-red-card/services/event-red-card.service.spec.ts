import * as _ from 'lodash';
import { MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestStore } from '../../add-request.store';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property.model';
import { FilterModel } from '../../filter/filter.model';
import { GroupButton } from '../../filter/sub-issue-type-dialog/sub-issue-type-json.model';
import { RedCardModel } from '../../models/event-red-card.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { SubIssueTypeLinkMatch } from '../../models/sub-type-link-match.model';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { EventRedCardService } from './event-red-card.service';

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
    leagueName: '',
    sportType: 0
  } as RedCardModel;
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
  static readonly fakeLogInfoRedCard: LogInfoRelatedEvent = {
    matchId: Helper.fakeMatchId,
    isMainMatch: true,
    eventName: '',
    leagueName: '',
    subIssueTypeId: SubIssueTypeConstant.MAIN_CORNER,
    voidTimeArea: Helper.fakeFilterTimeWithAllowance,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: Helper.fakeValidationMessage,
    sportType: 0
  } as LogInfoRelatedEvent;
  static readonly fakeChildMatchModel = {
    matchId: Helper.fakeMatchId,
    matchCode: '222',
    matchEvent: 'TestC - vs - Real Madrid (V)',
    isChecked: true,
    matchType: MatchType.LINK,
    homeId: 0,
    awayId: 0,
    leagueId: 0,
    leagueGroupId: 0,
    sportType: 0,
  } as ChildMatchModel;
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

describe('service', () => {
  let service: EventRedCardService;

  beforeEach(() => {
    service = new EventRedCardService();
  });

  it('#assignModelsToEvents should update correct model', async () => {
    // Arrange
    const allEvents = [];
    const primitiveProps = new PrimitiveProperty();
    const addRequestStore = new AddRequestStore();
    addRequestStore.changeAllowanceTime = jest.fn();

    // Action
    service.assignModelsToEvents(allEvents, [Helper.fakeRedCardModel], primitiveProps, addRequestStore);

    // Assert
    expect(allEvents.length).toBe(1);
    expect(primitiveProps.filterBy).toBe(Helper.fakeRedCardModel.filterBy);
    expect(addRequestStore.changeAllowanceTime).toHaveBeenCalledTimes(1);
  });

  it('#updateDefaultFilterTime should update correct model', async () => {
    // Arrange
    const defaultFilter = new FilterTimeWithAllowance();

    // Action
    service.updateDefaultFilterTime(defaultFilter, [Helper.fakeRedCardModel]);

    // Assert
    expect(defaultFilter.fromDateTime).toBe(Helper.fakeRedCardModel.filterFromTransTime);
    expect(defaultFilter.toDateTime).toBe(Helper.fakeRedCardModel.filterToTransTime);
  });

  it('#initDefaultFilterTime should update correct model', async () => {
    // Arrange
    const defaultFilter = new FilterTimeWithAllowance();

    // Action
    service.initDefaultFilterTime(defaultFilter);

    // Assert
    expect(defaultFilter.fromDateTime).toBeDefined();
    expect(defaultFilter.toDateTime).toBeDefined();
  });

  it('#initDefaultMainEvent should return main event', async () => {
    // Arrange
    const allSelectedEvents = [];

    // Action
    const actual = service.initDefaultMainEvent(allSelectedEvents);

    // Assert
    expect(actual.isMainMatch).toBeTruthy();
    expect(allSelectedEvents.length).toBe(1);
  });

  it('#updateSubIssueTypeAndAllowanceTime should call #getSubIssueTypeLinkMatch', async () => {
    // Arrange
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    mainEvent.subIssueTypeId = 11;
    service['getSubIssueTypeLinkMatch'] = jest.fn();
    service['updateSubIssueType'] = jest.fn();
    service['updateAllowanceTime'] = jest.fn();

    // Action
    await service.updateSubIssueTypeAndAllowanceTime([Helper.fakeLogInfoRedCard], mainEvent, [Helper.fakeChildMatchModel], null);

    // Assert
    expect(service['getSubIssueTypeLinkMatch']).toHaveBeenCalledTimes(0);
    expect(service['updateSubIssueType']).toHaveBeenCalledTimes(1);
    expect(service['updateAllowanceTime']).toHaveBeenCalledTimes(1);
  });

  it('#updateSubIssueTypeAndAllowanceTime should not call #getSubIssueTypeLinkMatch', async () => {
    // Arrange
    service['updateSubIssueType'] = jest.fn();
    service['updateAllowanceTime'] = jest.fn();

    // Action
    await service.updateSubIssueTypeAndAllowanceTime([Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard, [Helper.fakeChildMatchModel], null);

    // Assert
    expect(service['updateSubIssueType']).toHaveBeenCalledTimes(1);
    expect(service['updateAllowanceTime']).toHaveBeenCalledTimes(1);
  });

  it('#getSubIssueTypeId should return expected issue type id when have SubIssueTypeLinkMatch', async () => {
    // Action
    const actual = service['getSubIssueTypeId'](Helper.fakeMatchId, [Helper.fakeSubIssueTypeLinkMatch], [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(actual).toBe(Helper.fakeSubIssueTypeLinkMatch.subIssueTypeId);
  });

  it('#getSubIssueTypeId should return expected issue type id when SubIssueTypeLinkMatch.subIssueTypeId is Null', async () => {
    // Arrange
    const fakeSubIssueTypeLinkMatch = _.cloneDeep(Helper.fakeSubIssueTypeLinkMatch);
    fakeSubIssueTypeLinkMatch.subIssueTypeId = null;

    // Action
    const actual = service['getSubIssueTypeId'](Helper.fakeMatchId, [fakeSubIssueTypeLinkMatch], [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(actual).toBe(Helper.fakeLogInfoRedCard.subIssueTypeId);
  });

  it('#getSubIssueTypeId should return expected issue type id', async () => {
    // Arrange
    const fakeSubIssueTypeLinkMatch = _.cloneDeep(Helper.fakeSubIssueTypeLinkMatch);
    fakeSubIssueTypeLinkMatch.subIssueTypeId = null;

    // Action
    const actual = service['getSubIssueTypeId'](Helper.fakeMatchId, [], [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(actual).toBe(Helper.fakeLogInfoRedCard.subIssueTypeId);
  });

  it('#getSubIssueTypeId should return expected issue type id when handling matchId is not same', async () => {
    // Arrange
    const fakeSubIssueTypeLinkMatch = _.cloneDeep(Helper.fakeSubIssueTypeLinkMatch);
    fakeSubIssueTypeLinkMatch.subIssueTypeId = null;

    // Action
    const actual = service['getSubIssueTypeId'](1119, [], [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(actual).toBe(Helper.fakeLogInfoRedCard.subIssueTypeId);
  });

  it('#updateSubIssueType should update correct data ', async () => {
    // Arrange
    service['getSubIssueTypeId'] = jest.fn();

    // Action
    service['updateSubIssueType']([Helper.fakeLogInfoRedCard], [Helper.fakeSubIssueTypeLinkMatch],
      [Helper.fakeLogInfoRedCard], Helper.fakeLogInfoRedCard);

    // Assert
    expect(service['getSubIssueTypeId']).toHaveBeenCalled();
  });

  it('#updateAllowanceTime should update correct data ', async () => {
    // Arrange
    service['getNewFilterTimeWithAllowanceBySubIssueType'] = jest.fn();

    // Action
    service['updateAllowanceTime']([Helper.fakeLogInfoRedCard], null);

    // Assert
    expect(service['getNewFilterTimeWithAllowanceBySubIssueType']).toHaveBeenCalled();
  });

  it('#getNewFilterTimeWithAllowanceBySubIssueType should return VoidTimeArea ', async () => {
    // Arrange
    service['getGroupSubTypeIncludeAllowanceTime'] = jest.fn().mockImplementation(() => Helper.fakeGroupButton);

    // Action
    const actual = service['getNewFilterTimeWithAllowanceBySubIssueType'](Helper.fakeLogInfoRedCard, new FilterTimeWithAllowance());

    // Assert
    expect(actual.aaTime.toString()).toBe(Helper.fakeGroupButton.aa);
    expect(actual.paTime.toString()).toBe(Helper.fakeGroupButton.pa);
    expect(actual.saTime.toString()).toBe(Helper.fakeGroupButton.sa);
  });

  it('#getGroupSubTypeIncludeAllowanceTime should return VoidTimeArea when only have buttonSelectHomeAway', async () => {
    // Arrange
    // Action
    const actual = service['getGroupSubTypeIncludeAllowanceTime'](17);

    // Assert
    expect(actual.aa).toBe('3');
    expect(actual.pa).toBe('3');
    expect(actual.sa).toBe('9');
  });

  it('#getGroupSubTypeIncludeAllowanceTime should return VoidTimeArea when only have buttonSelectAll', async () => {
    // Arrange
    // Action
    const actual = service['getGroupSubTypeIncludeAllowanceTime'](21);

    // Assert
    expect(actual.aa).toBe('0');
    expect(actual.pa).toBe('0');
    expect(actual.sa).toBe('0');
  });

});
