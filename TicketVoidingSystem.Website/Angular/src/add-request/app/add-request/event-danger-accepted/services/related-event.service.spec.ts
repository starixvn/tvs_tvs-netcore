import * as _ from 'lodash';
import { MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Tooltip } from '../../../../../utility/modules/tooltip/tooltip.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { PrimitiveProperty } from '../../event-red-card/event-red-card.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCard } from '../../event-red-card/log-info-red-card/log-info-red-card.model';
import { FilterModel } from '../../filter/filter.model';
import { RedCardModel } from '../../models/event-red-card.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../event-danger-accepted.model';
import { EventDangerAcceptedService } from './event-danger-accepted.service';
import { LogInfoService } from './log-info.service';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

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
  };
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
}

describe('RelatedEventService', () => {
  let relatedEventService: RelatedEventService;

  beforeEach(() => {
    relatedEventService = new RelatedEventService(null, null, null, null);
  });

  it('#getChildMatches should call #getChildMatches', async () => {
    // Arrange
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeChildMatchModel]));
    const mockRelatedEventService = new RelatedEventService(addRequestApiService, null, null, null);

    // Action
    const actual = await mockRelatedEventService.getChildMatches(1, new FilterModel(), true);

    // Assert
    expect(actual.length).toBe(1);
    expect(addRequestApiService.getChildMatches).toHaveBeenCalledTimes(1);
  });

  it('#updateEvents should return expected model', async () => {
    // Arrange
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeChildMatchModel]));
    const mockRelatedEventService = new RelatedEventService(addRequestApiService, null, null, null);

    // Action
    const actual = mockRelatedEventService.assignChildMatchToLogInfoModel([Helper.fakeChildMatchModel], new FilterTimeWithAllowance(), 1);

    // Assert
    expect(actual).toBeDefined();
    expect(actual[0].logInfoDetail).toBeNull();
    expect(actual[0].messageValidationLogInfo).toBeNull();
  });

  it('#addRelatedEventByInput should call #tooltip.display', async () => {
    // Arrange
    const arg = new AddRelatedEventArg();
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = null;

    // Action
    await relatedEventService.addRelatedEventByInput(arg);

    // Assert
    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should return when #validationService.isValidInputRelatedEvent is false', async () => {
    // Arrange
    const arg = new AddRelatedEventArg();
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = 111;

    const validationService = new ValidationService();
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => false);
    const mockRelatedEventService = new RelatedEventService(null, validationService, null, null);

    // Action
    await mockRelatedEventService.addRelatedEventByInput(arg);

    // Assert
    expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should return when #getChildMatches return null', async () => {
    // Arrange
    const arg = new AddRelatedEventArg();
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = 111;

    const validationService = new ValidationService();
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => true);
    const mockRelatedEventService = new RelatedEventService(null, validationService, null, null);
    mockRelatedEventService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([]));

    // Action
    await mockRelatedEventService.addRelatedEventByInput(arg);

    // Assert
    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
    expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should call #getLogInfo', async () => {
    // Arrange
    const arg = new AddRelatedEventArg();
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = 111;
    arg.mainEvent = Helper.fakeLogInfoRedCard;
    arg.allEvents = [];
    const validationService = new ValidationService();
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => true);
    const eventDangerAcceptedService = new EventDangerAcceptedService(null);
    eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime = jest.fn();
    const logInfoService = new LogInfoService(null, null);
    logInfoService.getLogInfo = jest.fn();
    const mockRelatedEventService = new RelatedEventService(null, validationService, logInfoService, eventDangerAcceptedService);
    mockRelatedEventService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([new ChildMatchModel()]));
    mockRelatedEventService.assignChildMatchToLogInfoModel = jest.fn().mockImplementation(() => [Helper.fakeLogInfoRedCard]);

    // Action
    await mockRelatedEventService.addRelatedEventByInput(arg);

    // Assert
    expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledTimes(1);
    expect(eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService.assignChildMatchToLogInfoModel).toHaveBeenCalledTimes(1);
  });

  it('#addNewRelatedEventHaveTicketOrUpdateExistedEvent should add new related event', async () => {
    // Arrange
    const originalAllEvents: LogInfoRedCard[] = [];
    const events = _.cloneDeep([Helper.fakeLogInfoRedCard]);
    events.forEach(x => x.logInfoDetail = new LogInfoDetail());
    const mockRelatedEventService = new RelatedEventService(null, null, null, null);

    // Action
    mockRelatedEventService['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](events, originalAllEvents);

    // Assert
    expect(originalAllEvents.length).toBe(events.length);
  });

  it('#addNewRelatedEventHaveTicketOrUpdateExistedEvent should update model', async () => {
    // Arrange
    const originalAllEvents =_.cloneDeep([Helper.fakeLogInfoRedCard]);
    const events = _.cloneDeep([Helper.fakeLogInfoRedCard]);
    events.forEach(x => x.logInfoDetail = new LogInfoDetail());
    const mockRelatedEventService = new RelatedEventService(null, null, null, null);

    // Action
    mockRelatedEventService['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](events, originalAllEvents);

    // Assert
    expect(originalAllEvents[0].logInfoDetail).toEqual(events[0].logInfoDetail);
    expect(originalAllEvents[0].messageValidationLogInfo).toEqual(events[0].messageValidationLogInfo);
    expect(originalAllEvents[0].voidTimeArea).toEqual(events[0].voidTimeArea );
    expect(originalAllEvents[0].subIssueTypeId).toEqual(events[0].subIssueTypeId);
  });

  it('#preparingModelGetLogInfo should return expected model', async () => {
    // Arrange
    const childMatchModel = new ChildMatchModel();
    childMatchModel.matchType = MatchType.LINK;
    childMatchModel.matchId = 100000000;
    const args = new AddRelatedEventArg();
    args.mainEvent = _.cloneDeep(Helper.fakeLogInfoRedCard);
    args.allEvents = _.cloneDeep([Helper.fakeLogInfoRedCard]);
    const eventDangerAcceptedService = new EventDangerAcceptedService(null);
    eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime = jest.fn().mockImplementation();
    const mockRelatedEventService = new RelatedEventService(null, null, null, eventDangerAcceptedService);
    mockRelatedEventService['assignChildMatchToLogInfoModel'] = jest.fn().mockImplementation(() => [new LogInfoRedCard()]);

    // Action
    const actual = await mockRelatedEventService['preparingModelGetLogInfo']([childMatchModel], args);

    // Assert
    expect(actual.length).toBe(2);
  });

  it('#getDataWhenSearch should called expected method', async () => {
    // Arrange
    const args = new AddRelatedEventArg();
    args.primitiveProps = new PrimitiveProperty();
    const logInfoService = new LogInfoService(null, null);
    logInfoService.getLogInfo = jest.fn().mockImplementation();
    const mockRelatedEventService = new RelatedEventService(null, null, logInfoService, null);
    mockRelatedEventService['preparingModelGetLogInfo'] = jest.fn();
    mockRelatedEventService['addNewRelatedEventHaveTicketOrUpdateExistedEvent'] = jest.fn();

    // Action
    await mockRelatedEventService['getDataWhenSearch'](null, args);

    // Assert
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService['preparingModelGetLogInfo']).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService['addNewRelatedEventHaveTicketOrUpdateExistedEvent']).toHaveBeenCalledTimes(1);
  });
});
