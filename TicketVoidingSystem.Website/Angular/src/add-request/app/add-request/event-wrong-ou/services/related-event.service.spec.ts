import * as _ from 'lodash';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event-arg.model';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeChildMatches: ChildMatchModel[] = [
    {
      matchId: 12345,
      matchCode: '111',
      matchEvent: 'Test A vs Test B',
      isChecked: true,
      matchType: 1,
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
    }
  ];
  static readonly fakeFilterWithOuModel: FilterWrongOuModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    actualMarket: '1',
    wrongMarket: '',
    liveIndicator: 1
  };
  static readonly fakeLogInfoWrongOu: LogInfoWrongOu = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWrongOu: new FilterWrongOuModel(),
    logInfoDetail: null,
    messageValidationLogInfo: [],
    isPoolHouseAffected: true,
    linkedLogsViewModel: null,
    poolHouseCheckedBetTypes: '',
    isShowValidation: false,
    sportType: 0
  };
}

describe('RelatedEventService', () => {
  let service: RelatedEventService;

  beforeEach(() => {
    service = new RelatedEventService(null, null);
  });

  it('#getChildMatches should return data', async () => {
    const addRequestApiService = new AddRequestApiService(null);
    const spyGetChildMatches = jest.spyOn(addRequestApiService, 'getChildMatches').mockImplementation(() => Promise.resolve(Helper.fakeChildMatches));
    const relatedEventService = new RelatedEventService(addRequestApiService, null);

    const actual = await relatedEventService.getChildMatches(null);

    expect(spyGetChildMatches).toHaveBeenCalledTimes(1);
    expect(actual.length).toBe(Helper.fakeChildMatches.length);
  });

  it('#updateEvents should update data when defaultFilter empty', async () => {
    const childMatchModel = _.cloneDeep(Helper.fakeChildMatches);

    const actual = service.updateEvents(childMatchModel, new FilterWrongOuModel());

    expect(actual.length).toBe(Helper.fakeChildMatches.length);
  });

  it('#updateEvents should update data when defaultFilter has data', async () => {
    const childMatchModel = _.cloneDeep(Helper.fakeChildMatches);

    const actual = service.updateEvents(childMatchModel, Helper.fakeFilterWithOuModel);

    expect(actual.length).toBe(Helper.fakeChildMatches.length);
  });

  it('#addRelatedEventByInput should update AddRelatedEventArg', async () => {
    const arg = new AddRelatedEventArg();
    arg.allEvents = [];
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = '123';
    arg.filter = new FilterModel();
    arg.mainEvent = new LogInfoWrongOu();
    const validationService = new ValidationService();
    const spyIsValidInputRelatedEvent = jest.spyOn(validationService, 'isValidInputRelatedEvent').mockImplementation(() => true);
    const relatedEventService = new RelatedEventService(null, validationService);
    relatedEventService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeChildMatches));
    relatedEventService.updateEvents = jest.fn().mockImplementation(() => [Helper.fakeLogInfoWrongOu]);

    await relatedEventService.addRelatedEventByInput(arg);

    expect(spyIsValidInputRelatedEvent).toHaveBeenCalledTimes(1);
    expect(relatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should show tooltip when have not inputRelatedMatchId', async () => {
    const arg = new AddRelatedEventArg();
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = null;
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();

    await service.addRelatedEventByInput(arg);

    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#addRelatedEventByInput should return when does not pass validation', async () => {
    const arg = new AddRelatedEventArg();
    arg.allEvents = [];
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = '123';
    const validationService = new ValidationService();
    const spyIsValidInputRelatedEvent = jest.spyOn(validationService, 'isValidInputRelatedEvent').mockImplementation(() => false);
    const relatedEventService = new RelatedEventService(null, validationService);
    relatedEventService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeChildMatches));

    await relatedEventService.addRelatedEventByInput(arg);

    expect(spyIsValidInputRelatedEvent).toHaveBeenCalledTimes(1);
    expect(relatedEventService.getChildMatches).toHaveBeenCalledTimes(0);
  });

  it('#addRelatedEventByInput should show tooltip when have not any childMatches', async () => {
    const arg = new AddRelatedEventArg();
    arg.allEvents = [];
    arg.primitiveProps = new PrimitiveProperty();
    arg.primitiveProps.inputRelatedMatchId = '123';
    arg.tooltip = new Tooltip();
    arg.tooltip.display = jest.fn();
    arg.filter = new FilterModel();
    arg.mainEvent = {sportType: 2} as LogInfoWrongOu;
    const validationService = new ValidationService();
    const spyIsValidInputRelatedEvent = jest.spyOn(validationService, 'isValidInputRelatedEvent').mockImplementation(() => true);
    const relatedEventService = new RelatedEventService(null, validationService);
    relatedEventService.getChildMatches = jest.fn().mockImplementation(() => Promise.resolve([]));
    relatedEventService.updateEvents = jest.fn().mockImplementation(() => []);

    await relatedEventService.addRelatedEventByInput(arg);

    expect(spyIsValidInputRelatedEvent).toHaveBeenCalledTimes(1);
    expect(relatedEventService.getChildMatches).toHaveBeenCalledTimes(1);
    expect(arg.tooltip.display).toHaveBeenCalledTimes(1);
  });
});