import * as _ from 'lodash';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestStore } from '../../add-request.store';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../../filter/filter.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeValidationMessageError: ValidationMessage = {
    isError: true,
    reason: '',
    isShowPopup: true,
    transIds: '',
    requestId: 1,
  };
  static readonly fakeValidationMessageNotError: ValidationMessage = {
    isError: false,
    reason: '',
    isShowPopup: true,
    transIds: '',
    requestId: 1,
  };  
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
    tableTicketsModel: new TableTicketsModel(),
    messageValidationLogInfo: [Helper.fakeValidationMessageNotError]
  };
}

describe('ValidationService', () => {
  let validationService: ValidationService;
  let mockAddRequestStore: AddRequestStore;

  beforeEach(() => {
    validationService = new ValidationService();
    mockAddRequestStore = new AddRequestStore() as jest.Mocked<AddRequestStore>;
  });
  it('#validateCommonData should return false when #leagueEventComponent.isMatchIdValid return false', async () => {
    const leagueEventRedCardComponent = new LeagueEventRedCardComponent(null, null);
    const spyIsMatchIdValid = jest.spyOn(leagueEventRedCardComponent, 'isMatchIdValid').mockImplementation(() => false);

    const result = validationService.validateCommonData(leagueEventRedCardComponent, null, null);

    expect(spyIsMatchIdValid).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('#validateCommonData should return false when #kickOffTime invalid', async () => {
    const leagueEventRedCardComponent = new LeagueEventRedCardComponent(null, null);
    const spyisMatchIdValid = jest.spyOn(leagueEventRedCardComponent, 'isMatchIdValid').mockImplementation(() => true);
    const kickOffTimeComponent = new DateFullTimeNewComponent(null);
    const spyValidateWithTooltip = jest.spyOn(kickOffTimeComponent, 'validateWithTooltip').mockImplementation(() => false);
    
    const result = validationService.validateCommonData(leagueEventRedCardComponent, null, kickOffTimeComponent);

    expect(spyisMatchIdValid).toHaveBeenCalledTimes(1);
    expect(spyValidateWithTooltip).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });

  it('#validateCommonData should return true', async () => {
    const leagueEventRedCardComponent = new LeagueEventRedCardComponent(null, null);
    const spyisMatchIdValid = jest.spyOn(leagueEventRedCardComponent, 'isMatchIdValid').mockImplementation(() => true);
    const kickOffTimeComponent = new DateFullTimeNewComponent(null);
    const spyValidateWithTooltip = jest.spyOn(kickOffTimeComponent, 'validateWithTooltip').mockImplementation(() => true);
    
    const result = validationService.validateCommonData(leagueEventRedCardComponent, null, kickOffTimeComponent);

    expect(spyisMatchIdValid).toHaveBeenCalledTimes(1);
    expect(spyValidateWithTooltip).toHaveBeenCalledTimes(1);
    expect(result).toBeTruthy();
  });
  
  it('#isEventMatchValid should return false when mainMatch has error', async () => {
    const event = Helper.fakeLogInfoEarlyKickOff;
    event.isMainMatch = true;
    event.messageValidationLogInfo = [Helper.fakeValidationMessageError];

    const result = validationService.isAllEventsValid([event]);

    expect(result).toBe(false);
  });

  it('#isEventMatchValid should return false when is not mainMatch and has error NO_VALID_TICKETS_IN_RANGE', async () => {
    const event = Helper.fakeLogInfoEarlyKickOff;
    event.isMainMatch = false;
    event.messageValidationLogInfo = [Helper.fakeValidationMessageError];
    event.messageValidationLogInfo[0].reason = '';

    const result = validationService.isAllEventsValid([event]);

    expect(result).toBe(false);
  });
  
  it('#isEventMatchValid should return true', async () => {
    const event = Helper.fakeLogInfoEarlyKickOff;
    event.isMainMatch = false;
    event.messageValidationLogInfo = [Helper.fakeValidationMessageNotError];

    const result = validationService.isAllEventsValid([event]);

    expect(result).toBeTruthy();
  });
  
  it('#isValidInputRelatedEvent should return false when input mainMatchId', async () => {
    const event = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    event.isMainMatch = true;
    const toolTip = new Tooltip();
    toolTip.display = jest.fn();

    const result = validationService.isValidInputRelatedEvent(event.matchId, '', [event], toolTip);

    expect(result).toBe(false);
    expect(toolTip.display).toHaveBeenCalledTimes(1);
  });
  
  it('#isValidInputRelatedEvent should return false when input childMatchId', async () => {
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    mainEvent.isMainMatch = true;
    const event = new LogInfoEarlyKickOff();
    event.matchId = 999;
    event.isMainMatch = false;
    const events = [];
    events.push(event);
    events.push(mainEvent);
    const toolTip = new Tooltip();
    toolTip.display = jest.fn();

    const result = validationService.isValidInputRelatedEvent(999, '', events, toolTip);

    expect(result).toBe(false);
    expect(toolTip.display).toHaveBeenCalledTimes(1);
  });
  
  it('#isValidInputRelatedEvent should return true', async () => {
    const event = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    event.isMainMatch = true;
    const toolTip = new Tooltip();
    toolTip.display = jest.fn();

    const result = validationService.isValidInputRelatedEvent(9999, '', [event], toolTip);

    expect(result).toBe(true);
  });
  
  it('#isEditingByAnotherUser should return true', async () => {
    const result = validationService.isEditingByAnotherUser(true,1, 2);

    expect(result).toBe(true);
  });

  it('#checkCanShowConfirmationEarlyKickOff should return false', async () => {
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    mainEvent.messageValidationLogInfo = null;
    const childEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    childEvent.isMainMatch = false;
    childEvent.isInvalidTotalTickets = false;
    childEvent.messageValidationLogInfo = null;
    saveRequestArg.allEvents =  [mainEvent, childEvent];
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 1,
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const result = validationService.checkCanShowConfirmationEarlyKickOff(saveRequestArg);

    expect(result).toBeFalsy();
  });

  it('#checkCanShowConfirmationEarlyKickOff should return true', async () => {
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    mainEvent.messageValidationLogInfo = null;
    const childEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    childEvent.isMainMatch = false;
    childEvent.isInvalidTotalTickets = false;
    childEvent.messageValidationLogInfo = [];
    saveRequestArg.allEvents =  [mainEvent, childEvent];
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 1,
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.MANUAL_VOID_ID.toString();
    const result = validationService.checkCanShowConfirmationEarlyKickOff(saveRequestArg);

    expect(result).toBeTruthy();
  });
});