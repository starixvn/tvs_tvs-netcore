import { NotParticipateModel } from '../../../../add-request/app/add-request/models/event-not-participate.model';
import { RedCardModel } from '../../../../add-request/app/add-request/models/event-red-card.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../add-request/app/add-request/models/trans-info-add-request.model';
import { PlayerName, RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { Result } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { CommonPrimitiveProperty } from '../../models/common-primitive-property.model';
import { TicketsService } from '../../services/tickets.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidNotParticipateModel } from '../models/void-page-not-participate.model';
import { TemplateMessageService } from './template-message.service';
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
    requestId: 1,
    briefInfoNote: ''
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: 1,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    playerNames: [new PlayerName()],
    notParticipateModels: [new NotParticipateModel()]
  };

  static readonly fakeIssueTypeList: IssueType[] = [
    { issueTypeId: 1, issueTypeName: 'Danger Accepted'},
    { issueTypeId: 11, issueTypeName: 'Abnormal Bet'},
    { issueTypeId: 13, issueTypeName: 'Abnormal Account'},
    { issueTypeId: 8, issueTypeName: 'Early Kick Off'},
    { issueTypeId: 20, issueTypeName: 'Duplicate Tickets'},
    { issueTypeId: 21, issueTypeName: 'Not Participate'}
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
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 21,
      subIssueTypeName: 'Wrong Kick Off Time',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 12,
      subIssueTypeName: 'WMO',
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
    } as Validation,
    ticketRequest: [{
      transIds: '123456789',
      requestId: 123
    } as TicketRequest],
    logInfoDetail: new LogInfoDetail()
  };
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: 1,
  } as TicketRequest;
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
  let templateService: TemplateMessageService;

  beforeEach(() => {
    commonService = new CommonService(null);
    appService = new AppService(null);
    ticketsService = new TicketsService(null);
    templateService = new TemplateMessageService(null);
    voidPageService = new VoidPageService(commonService, ticketsService, templateService);
  });

  it('#getIssueTypes should return issueTypesModel', async () => {
    const expected = new IssueTypesModel();
    const commonService = new CommonService(null);
    commonService.getIssueTypes = jest.fn().mockReturnValue(expected);
    const mockVoidPageService = new VoidPageService(commonService, null, null);

    const actual = await mockVoidPageService.getIssueTypes();

    expect(actual).toEqual(expected);
  });

  it('#getBasicVoidPageItemsData should return call expected function', async () => {
    const getLogInfoModel = new GetLogInfoModel();
    getLogInfoModel.validation = new Validation();
    getLogInfoModel.logInfoDetail = new LogInfoDetail();
    getLogInfoModel.logInfoDetail.matchId = Helper.fakeMatchId;
    const dangerAcceptedModel = new RedCardModel();
    dangerAcceptedModel.matchId = Helper.fakeMatchId;
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;
    const spyGetMatch = jest.spyOn(commonService, 'getMatch').mockImplementation(() => Promise.resolve(new MatchModel()));
    const spyGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));

    voidPageService['getAllLogInfo'] = jest.fn().mockImplementation(() => [getLogInfoModel]);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(spyGetMatch).toHaveBeenCalledTimes(1);
    expect(spyGetLogInfo).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it('#getBasicVoidPageItemsData should call getMatch', async () => {
    const getLogInfoModel = new GetLogInfoModel();
    getLogInfoModel.validation = new Validation();
    getLogInfoModel.logInfoDetail = new LogInfoDetail();
    getLogInfoModel.logInfoDetail.matchId = Helper.fakeMatchId;
    const dangerAcceptedModel = new RedCardModel();
    dangerAcceptedModel.matchId = Helper.fakeMatchId;
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;
    const spyGetMatch = jest.spyOn(commonService, 'getMatch').mockImplementation(() => Promise.resolve(new MatchModel()));
    const spyGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(spyGetMatch).toHaveBeenCalledTimes(1);
    expect(spyGetLogInfo).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it('#loadUnderneathVoidPageItemsData should call getVoidTicketsMini', async () => {
    const voidItem = new VoidNotParticipateModel();
    voidItem.subIssueType = new SubIssueType();
    const getLogInfoModel = new GetLogInfoModel();
    getLogInfoModel.validation = new Validation();
    getLogInfoModel.logInfoDetail = new LogInfoDetail();
    getLogInfoModel.logInfoDetail.matchId = Helper.fakeMatchId;
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;
    const spyInitTicketQuery = jest.spyOn(ticketsService, 'initTicketQuery').mockImplementation();
    const spyGetVoidTicketsMini = jest.spyOn(ticketsService, 'getVoidTicketsMini').mockReturnValue(Promise.resolve(new TicketsModel()))
    const spyGetVoidedReason = jest.spyOn(commonService, 'getVoidedReason').mockReturnValue(Promise.resolve(new VoidedReason()));

    await voidPageService.loadUnderneathVoidPageItemsData(voidItem, fakeRequestDetailViewModel);

    expect(spyInitTicketQuery).toHaveBeenCalledTimes(1);
    expect(spyGetVoidTicketsMini).toHaveBeenCalledTimes(1);
    expect(spyGetVoidedReason).toHaveBeenCalledTimes(1);
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

  it('#getVoidedReason should called #getVoidedReason', async () => {
    const expected: VoidedReason = {
      reasonEnglish: 'En',
      reasonChineseSimplified: 'Cn'
    }
    const voidItem = new VoidNotParticipateModel();
    voidItem.matchModel = new MatchModel();
    voidItem.subIssueType = new SubIssueType();
    const spyGetVoidedReason = jest.spyOn(commonService, 'getVoidedReason').mockReturnValue(Promise.resolve(expected));

    const actual = await voidPageService['getVoidedReason'](voidItem);

    expect(spyGetVoidedReason).toHaveBeenCalledTimes(1);
    expect(actual).toStrictEqual(expected);
  });
});