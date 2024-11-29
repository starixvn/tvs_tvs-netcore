import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { RedCardModel } from '../../models/event-red-card.model';
import { GetLogInfoViewModel, ValidationMessage } from '../../models/get-log-info.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { LogInfoService } from './log-info.service';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
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
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeValidationMessage: ValidationMessage[] = [
    {
      isError: false,
      reason: '',
    }
  ];
  static readonly fakeLogInfoEarlyKickOff: LogInfoEarlyKickOff = {
    matchId: 1,
    eventName: '',
    isCollapse: false,
    isMainMatch: true,
    isShowValidation: false,
    kickOffTime: '',
    leagueName: '',
    matchModel: new MatchModel(),
    pagingModel: new PagingModel(),
    isInvalidTotalTickets: false,
    tableTicketsModel: new TableTicketsModel(),
    isHasSettledTicket: false,
    isHasInstantlySettledTicket: false,
    sportType: 0
  };
  static readonly fakeEarlyKickOffModel: EarlyKickOffModel = {
    eventDate: new Date(),
    isMainMatch: true,
    kickOffTime: '',
    matchId: 1,
    subIssueTypeId: 1,
    sportType: 0
  }
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
  let relatedEventService: RelatedEventService;

  beforeEach(() => {
    relatedEventService = new RelatedEventService(null, null, null);
  });

  it('#addRelatedEventByInput should call #tooltip.display', async () => {
    const arg = new AddRelatedEventArg();
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = null;

    await relatedEventService.addRelatedEventByInput(arg);

    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should return when #validationService.isValidInputRelatedEvent is false', async () => {
    const arg = new AddRelatedEventArg();
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = '1';
    const validationService = new ValidationService();
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => false);
    const mockRelatedEventService = new RelatedEventService(null, validationService, null);

    await mockRelatedEventService.addRelatedEventByInput(arg);

    expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should return when #getChildMatches return null', async () => {
    const arg = new AddRelatedEventArg();
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = '1';
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();
    arg.filter = {} as FilterModel;
    arg.mainEvent = Helper.fakeLogInfoEarlyKickOff;
    arg.allEvents = [];
    const validationService = new ValidationService();
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => true);
    const mockRelatedEventService = new RelatedEventService(null, validationService, null);
    mockRelatedEventService.getChildMatches = jest.fn().mockReturnValue([]);

    await mockRelatedEventService.addRelatedEventByInput(arg);

    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
    expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should call #getLogInfo', async () => {
    const arg = new AddRelatedEventArg();
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.mainEvent = Helper.fakeLogInfoEarlyKickOff;
    arg.allEvents = [];
    arg.filter = new FilterModel();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = '1';
    arg.addRequestStore = new AddRequestStore();
    arg.addRequestStore.changeBlockingUiStatus = jest.fn();

    const validationService = new ValidationService();
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => true);
    const logInfoService = new LogInfoService(null, null, null, null);
    logInfoService.getLogInfo = jest.fn().mockReturnValue({getLogInfoModels: null} as GetLogInfoViewModel);
    logInfoService.assignResultLogInfoToEvents = jest.fn();
    const mockRelatedEventService = new RelatedEventService(null, validationService, logInfoService);
    mockRelatedEventService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([new ChildMatchModel()]));
    mockRelatedEventService.mapChildMatchesToEvents = jest.fn().mockImplementation(() => [Helper.fakeLogInfoEarlyKickOff]);

    await mockRelatedEventService.addRelatedEventByInput(arg);

    expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService.mapChildMatchesToEvents).toHaveBeenCalledTimes(1);
  });
});
