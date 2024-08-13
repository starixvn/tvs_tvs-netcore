import * as _ from 'lodash';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { LogInfoRedCard } from '../../event-red-card/log-info-red-card/log-info-red-card.model';
import { FilterModel } from '../../filter/filter.model';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { RedCardModel } from '../../models/event-red-card.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { TemplateValue } from './../../../../../utility/components/template-message/template-message/template.model';
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
    leagueName: ''
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
    subIssueTypeId: 1,
    isInvalidTotalTickets: false,
    tableTicketsModel: new TableTicketsModel()
  };
  static readonly fakeEarlyKickOffModel: EarlyKickOffModel = {
    eventDate: new Date(),
    isMainMatch: true,
    kickOffTime: '',
    matchId: 1,
    subIssueTypeId: 1
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

  it('#getChildMatches should call #getChildMatches', async () => {
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getChildMatchesInfo = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeChildMatchModel]));
    const mockRelatedEventService = new RelatedEventService(addRequestApiService, null, null);

    const actual = await mockRelatedEventService.getChildMatches(1, new FilterModel(), true);

    expect(actual.length).toBe(1);
    expect(addRequestApiService.getChildMatchesInfo).toHaveBeenCalledTimes(1);
  });

  it('#assignChildMatchToLogInfoModel should return expected model', async () => {
    const addRequestApiService = new AddRequestApiService(null);
    const logInfoService = new LogInfoService(null, null, null,null);
    logInfoService.getTemplateValue = jest.fn().mockReturnValue(new TemplateValue())
    addRequestApiService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([Helper.fakeChildMatchModel]));
    const mockRelatedEventService = new RelatedEventService(addRequestApiService, null, logInfoService);

    const actual = mockRelatedEventService.mapChildMatchesToEvents([Helper.fakeChildMatchModel], Helper.fakeLogInfoEarlyKickOff, '1');

    expect(actual).toBeDefined();
    expect(actual[0].messageValidationLogInfo).toBeNull();
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
    const validationService = new ValidationService();
    validationService.isValidInputRelatedEvent = jest.fn().mockImplementation(() => true);
    const mockRelatedEventService = new RelatedEventService(null, validationService, null);
    mockRelatedEventService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([]));

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
    logInfoService.getLogInfo = jest.fn();
    const mockRelatedEventService = new RelatedEventService(null, validationService, logInfoService);
    mockRelatedEventService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([new ChildMatchModel()]));
    mockRelatedEventService.mapChildMatchesToEvents = jest.fn().mockImplementation(() => [Helper.fakeLogInfoEarlyKickOff]);

    await mockRelatedEventService.addRelatedEventByInput(arg);

    expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledTimes(1);
    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService.mapChildMatchesToEvents).toHaveBeenCalledTimes(1);
  });

  it('#addNewRelatedEventHaveTicketOrUpdateExistedEvent should add new related event', async () => {
    const originalAllEvents: LogInfoEarlyKickOff[] = [];
    const events = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);
    const mockRelatedEventService = new RelatedEventService(null, null, null);

    mockRelatedEventService['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](events, originalAllEvents);

    expect(originalAllEvents.length).toBe(events.length);
  });

  it('#addNewRelatedEventHaveTicketOrUpdateExistedEvent should update model', async () => {
    const originalAllEvents =_.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);
    const events = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);
    const mockRelatedEventService = new RelatedEventService(null, null, null);

    mockRelatedEventService['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](events, originalAllEvents);

    expect(originalAllEvents[0].messageValidationLogInfo).toEqual(events[0].messageValidationLogInfo);
    expect(originalAllEvents[0].subIssueTypeId).toEqual(events[0].subIssueTypeId);
  });

  it('#preparingModelGetLogInfo should return expected model', async () => {
    const childMatchModel = new ChildMatchModel();
    childMatchModel.matchType = MatchType.LINK;
    childMatchModel.matchId = 100000000;
    const args = new AddRelatedEventArg();
    args.filter = new FilterModel();
    args.mainEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    args.allEvents = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);
    const logInfoService = new LogInfoService(null, null, null,null);
    logInfoService.getTemplateValue = jest.fn().mockReturnValue(new TemplateValue())
    const mockRelatedEventService = new RelatedEventService(null, null, logInfoService);
    mockRelatedEventService['assignChildMatchToLogInfoModel'] = jest.fn().mockImplementation(() => [new LogInfoRedCard()]);

    const actual = await mockRelatedEventService['preparingModelGetLogInfo']([childMatchModel], args);

    expect(actual.length).toBe(2);
  });

  it('#getDataWhenSearch should called expected method', async () => {
    const args = new AddRelatedEventArg();
    const logInfoService = new LogInfoService(null, null, null, null);
    logInfoService.getLogInfo = jest.fn().mockImplementation();
    const mockRelatedEventService = new RelatedEventService(null, null, logInfoService);
    mockRelatedEventService['preparingModelGetLogInfo'] = jest.fn();
    mockRelatedEventService['addNewRelatedEventHaveTicketOrUpdateExistedEvent'] = jest.fn();

    await mockRelatedEventService['getDataWhenSearch'](null, args);

    expect(logInfoService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService['preparingModelGetLogInfo']).toHaveBeenCalledTimes(1);
    expect(mockRelatedEventService['addNewRelatedEventHaveTicketOrUpdateExistedEvent']).toHaveBeenCalledTimes(1);
  });
});
