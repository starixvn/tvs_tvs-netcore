import { EarlyKickOffModel } from '../../../../add-request/app/add-request/models/event-eko.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../add-request/app/add-request/models/trans-info-add-request.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { Message } from '../../../../utility/components/template-message/messages/message';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/template.service';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { Result } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { TicketsService } from '../../services/tickets.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidPageEarlyKickOffModel } from '../models/void-page-early-kick-off.model';
import { VoidPageService } from './void-page.service';

class Helper {
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 111111,
    errorMsg: '',
  };
  static readonly fakeMatchId = 90000;
  static readonly fakeRequestDetailModel: RequestDetailModel = {
    actionId: 1,
    decidedBy: null,
    isTest: false,
    isVoided: false,
    issueTypeId: 11,
    mistakenBy: null,
    operators: [],
    provider: null,
    remark: 'test',
    requestedBy: "sa",
    source: null,
    sportType: 2,
    voidedBy: null,
    userId: 0,
    requestId: 1
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: 1,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    messages: [new Message()],
    earlyKickOffModels: [new EarlyKickOffModel()]
  };

  static readonly fakeIssueTypeList: IssueType[] = [
    { issueTypeId: 1, issueTypeName: 'Danger Accepted'},
    { issueTypeId: 11, issueTypeName: 'Abnormal Bet'},
    { issueTypeId: 13, issueTypeName: 'Abnormal Account'},
    { issueTypeId: 8, issueTypeName: 'Early Kick Off'},
    { issueTypeId: 20, issueTypeName: 'Duplicate Tickets'}
  ];
  static readonly fakeSubIssueTypeList: SubIssueType[] = [
    {
      subIssueTypeId: 1,
      issueTypeId: 1,
      subIssueTypeName: 'Goal',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 2,
      issueTypeId: 1,
      subIssueTypeName: 'Corner',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    },
    {
      subIssueTypeId: 12,
      issueTypeId: 8,
      subIssueTypeName: 'Non Live',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 14,
      issueTypeId: 9,
      subIssueTypeName: 'Wrong Kick Off Time',
      subIssueTypeNameCS: ''
    }
  ];
  static readonly fakeIssueTypesModel: IssueTypesModel = {
    issueTypes: Helper.fakeIssueTypeList,
    subIssueTypes: Helper.fakeSubIssueTypeList
  };
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: 1,
    validation: {
      isInvalidTotalTickets: false,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: false
    },
    ticketRequest: [{
      transIds: '123456789',
      requestId: 123
    }],
    logInfoDetail: new LogInfoDetail()
  };
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: 1,
  };
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    getLogInfoModels: [Helper.fakeGetLogInfoModel],
  };
}

describe('VoidPageService', () => {
  let voidPageService : VoidPageService ;
  let commonService: CommonService;
  let ticketsService: TicketsService;
  let appService: AppService;
  let templateService: TemplateService;

  beforeEach(() => {
    commonService = new CommonService(null);
    appService = new AppService(null);
    ticketsService = new TicketsService(null);
    templateService = new TemplateService();
    voidPageService = new VoidPageService(commonService, appService, ticketsService, templateService);
  });

  it('#getIssueTypes should return issueTypesModel', async () => {
    const expected = new IssueTypesModel();
    const commonService = new CommonService(null);
    commonService.getIssueTypes = jest.fn().mockReturnValue(expected);
    const mockVoidPageService = new VoidPageService(commonService, null, null, null);

    const actual = await mockVoidPageService.getIssueTypes();

    expect(actual).toEqual(expected);
  });

  it('#getBasicVoidPageItemsData should call getMatch', async () => {
    const spyGetMatch = jest.spyOn(commonService, 'getMatch').mockImplementation(() => Promise.resolve(new MatchModel()));
    voidPageService['getDisplayIssueTypeName'] = jest.fn();
    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, Helper.fakeRequestDetailViewModel);

    expect(spyGetMatch).toHaveBeenCalledTimes(1);
    expect(voidPageService['getDisplayIssueTypeName']).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it('#loadUnderneathVoidPageItemsData should call getVoidTicketsMini', async () => {
    const voidItem = new VoidPageEarlyKickOffModel();
    voidItem.subIssueType = new SubIssueType();
    voidItem.matchModel = new MatchModel();
    voidItem.templateValue = new TemplateValue();
    voidItem.matchModel.matchId = Helper.fakeRequestDetailViewModel.earlyKickOffModels[0].matchId;
    const spyInitTicketQuery = jest.spyOn(ticketsService, 'initTicketQuery').mockImplementation();
    const spyGetVoidTicketsMini = jest.spyOn(ticketsService, 'getVoidTicketsMini').mockReturnValue(Promise.resolve(new TicketsModel()))
    const spyGetVoidedReason = jest.spyOn(appService, 'getVoidedReason').mockReturnValue(Promise.resolve(new VoidedReason()));
    voidPageService['getTemplateValue'] = jest.fn().mockReturnValue(new TemplateValue());

    await voidPageService.loadUnderneathVoidPageItemsData([voidItem], Helper.fakeRequestDetailViewModel);

    expect(spyInitTicketQuery).toHaveBeenCalledTimes(1);
    expect(spyGetVoidTicketsMini).toHaveBeenCalledTimes(1);
    expect(spyGetVoidedReason).toHaveBeenCalledTimes(1);
    expect(voidPageService['getTemplateValue']).toHaveBeenCalledTimes(1);
  });

  it('#getTemplateValue should called #templateService.getTemplateValue', async () => {
    const voidItem = new VoidPageEarlyKickOffModel();
    voidItem.matchModel = new MatchModel();
    voidItem.voidTicketsMini = new TicketsModel();
    const spyGetTemplateValue = jest.spyOn(templateService, 'getTemplateValue').mockReturnValue(new TemplateValue());
    const actual = voidPageService['getTemplateValue'](voidItem);

    expect(spyGetTemplateValue).toHaveBeenCalledTimes(1);
    expect(actual.checkSettled).toBe(voidItem.voidTicketsMini.isHasSettledTicket);
  });

  it('#getDisplayIssueTypeName should return DisplayIssueTypeName when issueTypeName = subIssueTypeName ', async () => {
    const issueType = new IssueType();
    issueType.issueTypeId = 20;
    issueType.issueTypeName = 'Sub Duplicate'
    const issueTypesModel = new IssueTypesModel();
    issueTypesModel.issueTypes = [issueType]
    const subType: SubIssueType =
      {
        subIssueTypeId: 1,
        issueTypeId: 20,
        subIssueTypeName: issueType.issueTypeName,
        subIssueTypeNameCS: ''
      };

    const actual = voidPageService['getDisplayIssueTypeName'](20, subType, issueTypesModel);

    expect(actual).toBe('Sub Duplicate')
  });

  it('#getDisplayIssueTypeName should return DisplayIssueTypeName when issueTypeName !== subIssueTypeName ', async () => {
    const issueType = new IssueType();
    issueType.issueTypeId = 20;
    issueType.issueTypeName = 'IssueTypeName'
    const issueTypesModel = new IssueTypesModel();
    issueTypesModel.issueTypes = [issueType]
    const subType: SubIssueType =
      {
        subIssueTypeId: 1,
        issueTypeId: 20,
        subIssueTypeName: 'SubIssueTypeName',
        subIssueTypeNameCS: ''
      };

    const actual = voidPageService['getDisplayIssueTypeName'](20, subType, issueTypesModel);

    expect(actual).toBe('IssueTypeName - SubIssueTypeName')
  });
});