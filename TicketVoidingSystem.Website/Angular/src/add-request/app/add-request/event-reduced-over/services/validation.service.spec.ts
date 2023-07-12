import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Tooltip } from '../../../../../utility/modules/tooltip/tooltip.model';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../../filter/filter.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { PrimitivePropertyItem } from '../filter-reduced-over-item/filter-reduced-over-item.model';
import { FilterReducedOverComponent } from '../filter-reduced-over/filter-reduced-over.component';
import { ReducedOverBetType } from '../models/bet-type-reduced-over-json.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeReducedOverBetTypes: ReducedOverBetType[] = [
    {
      betTypeId: 1,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    },
    {
      betTypeId: 2,
      betTypeName: '',
      isHasOverWicket: true,
      isHasPlayer: true,
      isHasRuns: true,
      parentId: 0,
      items: []
    }
  ];
  static readonly fakeLogInfoReducedOver: LogInfoReducedOver = {
    matchId: 1,
    filterReducedOvers: [],
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  };
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  it('#validateCommonData should return false when match invalid', async () => {
    const leagueEvent = new LeagueEventRedCardComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => false);
    const actual = service.validateCommonData(leagueEvent, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when filterReducedOverComponent invalid', async () => {
    const leagueEvent = new LeagueEventRedCardComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterReducedOverComponent = new FilterReducedOverComponent(null);
    filterReducedOverComponent.isValid = jest.fn().mockReturnValue(false);

    const actual = service.validateCommonData(leagueEvent, filterReducedOverComponent);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const leagueEvent = new LeagueEventRedCardComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterReducedOverComponent = new FilterReducedOverComponent(null);
    filterReducedOverComponent.isValid = jest.fn().mockReturnValue(true);

    const actual = service.validateCommonData(leagueEvent, filterReducedOverComponent);

    expect(actual).toBeTruthy();
  });

  it('#isAllFieldsHaveValue should return false when have not betTypeIds', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filterModel = new FilterReducedOverModel();
    filterModel.betTypeIds = [];
    const actual = service.isAllFieldsHaveValue(filterModel, 1, new PrimitivePropertyItem(), tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isAllFieldsHaveValue should return false when isValidWicketOver invalid', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const primitiveProps = new PrimitivePropertyItem();
    primitiveProps.isDisabledWicketOver = false;
    const filterModel = new FilterReducedOverModel();
    filterModel.betTypeIds = ['1'];
    filterModel.wicketOver = '';
    const actual = service.isAllFieldsHaveValue(filterModel, 1, primitiveProps, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isAllFieldsHaveValue should return false when playerIds invalid', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const primitiveProps = new PrimitivePropertyItem();
    primitiveProps.isDisabledWicketOver = false;
    primitiveProps.isDisabledPlayer = false;
    const filterModel = new FilterReducedOverModel();
    filterModel.betTypeIds = ['1'];
    filterModel.wicketOver = '1';
    filterModel.playerIds = [];
    const actual = service.isAllFieldsHaveValue(filterModel, 1, primitiveProps, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isAllFieldsHaveValue should return false when Runs invalid', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const primitiveProps = new PrimitivePropertyItem();
    primitiveProps.isDisabledWicketOver = false;
    primitiveProps.isDisabledPlayer = false;
    primitiveProps.isDisabledRuns = false;
    const filterModel = new FilterReducedOverModel();
    filterModel.betTypeIds = ['1'];
    filterModel.wicketOver = '1';
    filterModel.playerIds = ['1'];
    filterModel.runs = '';
    const actual = service.isAllFieldsHaveValue(filterModel, 1, primitiveProps, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isAllFieldsHaveValue should return false when not select live nonLive', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const primitiveProps = new PrimitivePropertyItem();
    primitiveProps.isDisabledWicketOver = false;
    primitiveProps.isDisabledPlayer = false;
    primitiveProps.isDisabledRuns = false;
    const filterModel = new FilterReducedOverModel();
    filterModel.betTypeIds = ['1'];
    filterModel.wicketOver = '1';
    filterModel.playerIds = ['1'];
    filterModel.runs = '1';
    filterModel.live = false;
    filterModel.nonLive = false;
    const actual = service.isAllFieldsHaveValue(filterModel, 1, primitiveProps, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  })

  it('#isAllFieldsHaveValue should return true', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const primitiveProps = new PrimitivePropertyItem();
    primitiveProps.isDisabledWicketOver = false;
    primitiveProps.isDisabledPlayer = false;
    primitiveProps.isDisabledRuns = false;
    const filterModel = new FilterReducedOverModel();
    filterModel.betTypeIds = ['1'];
    filterModel.wicketOver = '1';
    filterModel.playerIds = ['1'];
    filterModel.runs = '1';
    filterModel.live = true;
    filterModel.nonLive = false;
    const actual = service.isAllFieldsHaveValue(filterModel, 1, primitiveProps, tooltip);

    expect(actual).toBeTruthy();
  })

  it('#checkCanShowConfirmationWrongOdds should return false', async () => {
    const element = document.createElement('body');
    element.setAttribute("user-id", "2");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.logInfoEvent = new LogInfoReducedOver();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = null;
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 2;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actual = service.checkCanShowConfirmationReducedOver(saveRequestArg);

    expect(actual).toBeFalsy();
  });

  it('#checkCanShowConfirmationWrongOdds should return true', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = false;

    const element = document.createElement('body');
    element.setAttribute("user-id", "2");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.logInfoEvent = new LogInfoReducedOver();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = [errorMsg];
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 2;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actual = service.checkCanShowConfirmationReducedOver(saveRequestArg);

    expect(actual).toBeTruthy();
  });

  it('#isValidLogInfoEvent should return false', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = true;
    const logInfoEvent = new LogInfoReducedOver();
    logInfoEvent.messageValidationLogInfo = [errorMsg];
    const actual = service.isValidLogInfoEvent(logInfoEvent);

    expect(actual).toBeFalsy();
  });

  it('#isValidWicketOver should return false when value has text', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const primitiveProps = new PrimitivePropertyItem();
    primitiveProps.isDisabledWicketOver = false;
    const filterModel = new FilterReducedOverModel();
    filterModel.wicketOver = '1a';
    const actual = service['isValidWicketOver'](filterModel, 1, primitiveProps, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidRuns should return false when value has text', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const primitiveProps = new PrimitivePropertyItem();
    primitiveProps.isDisabledRuns = false;
    const filterModel = new FilterReducedOverModel();
    filterModel.runs = '1a';
    const actual = service['isValidRuns'](filterModel, 1, primitiveProps, tooltip);

    expect(actual).toBeFalsy();
  });
});
