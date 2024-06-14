import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AllowanceTime } from '../../../../../utility/models/allowance-time.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AddRelatedEventArg } from '../../models/add-related-event.model';
import { RedCardModel } from '../../models/event-red-card.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { PrimitiveProperty } from '../event-red-card.model';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCard } from '../log-info-red-card/log-info-red-card.model';
import { EventRedCardService } from './event-red-card.service';
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
  static readonly fakePrimitiveProperty: PrimitiveProperty = {
    isBlock: false,
    isShowLogInfoMainMatch: false,
    filterBy: 0,
    transInfoAddRequestModel: new TransInfoAddRequestModel,
    inputRelatedMatchId: 1
  };
  static readonly fakeAddRelatedEventArg: AddRelatedEventArg = {
    tooltip: new Tooltip,
    requestId: 0,
    isEdit: false,
    filter: Helper.fakeFilterModel,
    primitiveProps: Helper.fakePrimitiveProperty,
    defaultFilterTimeWithAllowance: new FilterTimeWithAllowance,
    allEvents: [],
    mainEvent: Helper.fakeLogInfoRedCard,
    addRequestStore: new AddRequestStore,
    inputMatchIdClass: '',
    originalRelatedEvents: []
  };
  static readonly fakeChildMatchModel: ChildMatchModel = {
    matchId: Helper.fakeMatchId,
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
}

describe('RelatedEventService', () => {
  let service: RelatedEventService;
  let addRequestApiService: AddRequestApiService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let eventRedCardService: EventRedCardService;
  let arg: AddRelatedEventArg;

  beforeEach(() => {
    addRequestApiService = new AddRequestApiService(null);
    validationService = new ValidationService();
    logInfoService = new LogInfoService(null, null);
    eventRedCardService = new EventRedCardService();
    service = new RelatedEventService(addRequestApiService, validationService, logInfoService, eventRedCardService);
    arg = Helper.fakeAddRelatedEventArg;

  });

  it('#getChildMatches should call #getChildMatches', async () => {
    // Arrange
    addRequestApiService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeChildMatchModel]));

    // Action
    const actual = await service.getChildMatches(1, new FilterModel(), true);

    // Assert
    expect(actual.length).toBe(1);
    expect(addRequestApiService.getChildMatches).toHaveBeenCalledTimes(1);
  });

  it('#assignChildMatchToLogInfoModel should return expected model', async () => {
    // Arrange
    addRequestApiService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeChildMatchModel]));

    // Action
    const actual = service.assignChildMatchToLogInfoModel([Helper.fakeChildMatchModel], new FilterTimeWithAllowance(), 1);

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
    await service.addRelatedEventByInput(arg);

    // Assert
    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should return when #isValidInputRelatedEvent is false', async () => {
    // Arrange
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => false);
    let arg = Helper.fakeAddRelatedEventArg;

    // Action
    await service.addRelatedEventByInput(arg);

    // Assert
    expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should called expected when #getChildMatches return no value', async () => {
    // Arrange
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => true);
    service.getChildMatches = jest.fn().mockReturnValue([]);
    let arg = Helper.fakeAddRelatedEventArg;
    arg.tooltip.display = jest.fn();

    // Action
    await service.addRelatedEventByInput(arg);

    // Assert
    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
    expect(arg.primitiveProps.isBlock).toBeFalsy();
  });

  it('#addRelatedEventByInput should called expected when #getChildMatches return value is valid', async () => {
    // Arrange
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => true);
    service.getChildMatches = jest.fn().mockReturnValue([Helper.fakeChildMatchModel]);
    service.assignChildMatchToLogInfoModel = jest.fn().mockReturnValue([Helper.fakeLogInfoRedCard]);
    eventRedCardService.updateSubIssueTypeAndAllowanceTime = jest.fn();
    logInfoService.getLogInfo = jest.fn();
    logInfoService.updateIsCheckedVar = jest.fn();
    let arg = Helper.fakeAddRelatedEventArg;

    // Action
    await service.addRelatedEventByInput(arg);

    // Assert
    expect(service.assignChildMatchToLogInfoModel).toHaveBeenCalledTimes(1);
    expect(eventRedCardService.updateSubIssueTypeAndAllowanceTime).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(logInfoService.updateIsCheckedVar).toHaveBeenCalledTimes(1);
    expect(arg.primitiveProps.isBlock).toBeFalsy();
    expect(arg.primitiveProps.inputRelatedMatchId).toBeNull();
  });

  it('#addRelatedEventByInput should tooltip.display when inputRelatedMatchId is Null', async () => {
    // Arrange
    let arg = Helper.fakeAddRelatedEventArg;
    arg.primitiveProps.inputRelatedMatchId = null;
    arg.tooltip.display = jest.fn();

    // Action
    await service.addRelatedEventByInput(arg);

    // Assert
    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#getDataWhenSearch should called expected method', async () => {
    // Arrange
    let fackLogInfoRedCard: LogInfoRedCard = {
      matchId: 1,
      isMainMatch: true,
      eventName: '',
      leagueName: '',
      subIssueTypeId: SubIssueTypeConstant.MAIN_CORNER,
      voidTimeArea: Helper.fakeFilterTimeWithAllowance,
      logInfoDetail: Helper.fakeLogInfoDetail,
      messageValidationLogInfo: Helper.fakeValidationMessage
    };
    let fackChildMatchModel = Helper.fakeChildMatchModel;
    fackChildMatchModel.matchId = 213;
    fackChildMatchModel.matchType = 2;
    service.assignChildMatchToLogInfoModel = jest.fn().mockReturnValueOnce([Helper.fakeLogInfoRedCard]);
    eventRedCardService.updateSubIssueTypeAndAllowanceTime = jest.fn();

    arg.allEvents.push(fackLogInfoRedCard);
    logInfoService.getLogInfo = jest.fn().mockImplementation();

    // Action
    await service.getDataWhenSearch([fackChildMatchModel], arg);

    // Assert
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(service.assignChildMatchToLogInfoModel).toHaveBeenCalledTimes(1);
    expect(eventRedCardService.updateSubIssueTypeAndAllowanceTime).toHaveBeenCalledTimes(1);
  });

  it('#getDataWhenSearch should addNewRelatedEventHaveTicket when fack preparingModelGetLogInfo', async () => {
    // Arrange
    let fackLogInfoRedCard: LogInfoRedCard = {
      matchId: 1,
      isMainMatch: true,
      eventName: '',
      leagueName: '',
      subIssueTypeId: SubIssueTypeConstant.MAIN_CORNER,
      voidTimeArea: Helper.fakeFilterTimeWithAllowance,
      logInfoDetail: Helper.fakeLogInfoDetail,
      messageValidationLogInfo: Helper.fakeValidationMessage
    };
    let fackChildMatchModel = Helper.fakeChildMatchModel;
    fackChildMatchModel.matchId = 213;
    fackChildMatchModel.matchType = 2;
    service['preparingModelGetLogInfo'] = jest.fn().mockReturnValue([Helper.fakeLogInfoRedCard]);

    arg.allEvents = [fackLogInfoRedCard];
    logInfoService.getLogInfo = jest.fn().mockImplementation();

    // Action
    await service.getDataWhenSearch([fackChildMatchModel], arg);

    // Assert
    expect(arg.allEvents.length).toBe(2);
  });
});
