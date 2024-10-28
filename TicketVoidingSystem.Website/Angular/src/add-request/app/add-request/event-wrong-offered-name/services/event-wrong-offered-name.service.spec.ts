import { TemplateService } from "../../../../../utility/components/template-message/template-message/services/template.service";
import { TemplateValue } from "../../../../../utility/components/template-message/template-message/template.model";
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from "../../../../../utility/models/match.model";
import { VoidedReason } from "../../../../../utility/models/reason.model";
import { CommonService } from '../../../../../utility/services/common.service';
import { AddRequestApiService } from "../../add-request-api.service";
import { AffectedTicketService } from "../../affected-ticket/affected-ticket.service";
import { FilterModel } from "../../filter/filter.model";
import { WrongOfferedNameModel } from '../../models/event-wrong-offered-name.model';
import { PermissionAddRequest } from "../../models/permission-add-request.model";
import { TicketsModel } from "../../pool-house-ticket/tickets/tickets.model";
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { EventWrongOfferedNameService } from './event-wrong-offered-name.service';
import { ValidationService } from "./validation.service";


class Helper {
  static readonly fakeWrongOfferedNameModel: WrongOfferedNameModel = {
    currencyIds: '1,2',
    licenseeNames: 'licensee1,licensee2',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    match: new MatchModel(),
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

describe('EventWrongOfferedNameService', () => {
  let mockService: EventWrongOfferedNameService;
  let mockCommonService: CommonService;
  let mockTemplateService: TemplateService;
  let mockAddRequestApiService: AddRequestApiService;
  let mockAffectedTicketService: AffectedTicketService;
  let validationService: ValidationService;

  beforeEach(() => {
    mockCommonService = new CommonService(null);
    mockTemplateService = new TemplateService();
    mockAddRequestApiService = new AddRequestApiService(null);
    mockAffectedTicketService = new AffectedTicketService(null);
    validationService = new ValidationService(null);
    mockService = new EventWrongOfferedNameService(mockCommonService, mockTemplateService,
      mockAddRequestApiService, mockAffectedTicketService, validationService);
  });

  it('getPermissionAddRequest should call #addRequestApiService.getPermissionAddRequest', async () => {
    const permission = { isAddSettledTickets: true } as PermissionAddRequest;
    mockAddRequestApiService.getPermissionAddRequest = jest.fn().mockReturnValue(permission);

    const actual = await mockService.getPermissionAddRequest();

    expect(mockAddRequestApiService.getPermissionAddRequest).toHaveBeenCalledTimes(1);
    expect(actual).toBe(permission);
  });

  it('initLogInfoEvent should return LogInfoWrongOfferedName', async () => {
    const logInfo = new LogInfoWrongOfferedName();
    logInfo.filterWrongOfferedName = new FilterWrongOfferedNameModel();
    const actual = mockService.initLogInfoEvent();

    expect(actual).toEqual(logInfo);
  });

  it('initWrongMarketOfferedModel should return WrongOfferedNameModel', async () => {
    const logInfo = new LogInfoWrongOfferedName();
    logInfo.filterWrongOfferedName = new FilterWrongOfferedNameModel();
    logInfo.matchId = 1;
    logInfo.filterWrongOfferedName.currencyIds = ['1', '2'];
    logInfo.filterWrongOfferedName.licenseeNames = ['licensee1', 'licensee2'];
    const model = new WrongOfferedNameModel();
    model.matchId = Helper.fakeLogInfoWrongOfferedName.matchId;
    model.subIssueTypeId = 1;
    model.currencyIds = '1,2';
    model.licenseeNames = 'licensee1,licensee2';

    const actual = mockService.initWrongMarketOfferedModel(1, logInfo);

    expect(actual).toEqual(model);
  });

  it('assignModelsToEvents should return LogInfoWrongOfferedName', async () => {
    const ticketTable = new TicketsModel();
    const voidedReason = new VoidedReason();
    const templateValue = new TemplateValue();
    mockService.getAffectedTickets = jest.fn().mockReturnValue(ticketTable);
    mockService['getVoidTime'] = jest.fn().mockReturnValue('');
    mockService.getTemplateMessageValue = jest.fn().mockReturnValue(templateValue);
    mockCommonService.getVoidedReason = jest.fn().mockReturnValue(voidedReason);
    const actual = await mockService.assignModelsToEvents(Helper.fakeFilterModel, Helper.fakeWrongOfferedNameModel);

    expect(mockService.getAffectedTickets).toHaveBeenCalledTimes(1);
    expect(mockService['getVoidTime']).toHaveBeenCalledTimes(2);
    expect(mockService.getTemplateMessageValue).toHaveBeenCalledTimes(1);
    expect(mockCommonService.getVoidedReason).toHaveBeenCalledTimes(1);
    expect(actual.matchId).toBe(Helper.fakeWrongOfferedNameModel.matchId);
    expect(actual.logInfoDetail).toBe(Helper.fakeWrongOfferedNameModel.logInfoDetail);
    expect(actual.matchModel).toBe(Helper.fakeWrongOfferedNameModel.match);
    expect(actual.tableTicketsModel).toBe(ticketTable);
    expect(actual.voidReason).toBe(voidedReason);
    expect(actual.templateValue).toBe(templateValue);
    expect(actual.isCollapse).toBe(Helper.fakeFilterModel.isVoided);
  });

  it('getVoidTime should return time type string', async () => {
    const date = new Date('2024-10-14T01:02:03');
    const actual = mockService['getVoidTime'](date);

    expect(actual).toBe('01:02:03 AM');
  });

  it('getTemplateMessageValue should return TemplateValue', async () => {
    const actual = mockService.getTemplateMessageValue(new MatchModel(), true, new FilterWrongOfferedNameModel());

    expect(actual.checkSettled).toBeTruthy();
  });

  it('getAffectedTickets should call #affectedTicketService.getAffectedTickets', async () => {
    const ticketTable = new TicketsModel();
    mockAffectedTicketService.getAffectedTickets = jest.fn().mockReturnValue(ticketTable);
    const actual = await mockService.getAffectedTickets(1, '');

    expect(actual).toEqual(ticketTable);
  });
});
