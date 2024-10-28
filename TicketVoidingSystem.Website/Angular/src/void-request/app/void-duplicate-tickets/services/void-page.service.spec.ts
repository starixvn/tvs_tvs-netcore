import { DuplicateTicketsModel } from '../../../../add-request/app/add-request/models/event-duplicate-tickets.model';
import { RedCardModel } from '../../../../add-request/app/add-request/models/event-red-card.model';
import { GetLogInfoModel, Validation } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { Result } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { TicketsService } from '../../services/tickets.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { BasicRequestInfo } from '../models/basic-request-info.model';
import { VoidPageDuplicateTicketsModel } from '../models/void-page-duplicate-tickets.model';
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
    playerNames: [],
    duplicateTicketsModel: new DuplicateTicketsModel()
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
    voidPageService = new VoidPageService(appService, commonService, ticketsService, templateService);
  });

  it('#getIssueTypes should return issueTypesModel', async () => {
    const expected = new IssueTypesModel();
    commonService.getIssueTypes = jest.fn().mockReturnValue(expected);
    const mockVoidPageService = new VoidPageService(null, commonService, null, null);

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
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    fakeRequestDetailViewModel.duplicateTicketsModel = new DuplicateTicketsModel();
    fakeRequestDetailViewModel.duplicateTicketsModel.subIssueTypeId = 1;
    const spyGetMatch = jest.spyOn(commonService, 'getMatch').mockImplementation(() => Promise.resolve(new MatchModel()));

    voidPageService['getAllLogInfo'] = jest.fn().mockImplementation(() => [getLogInfoModel]);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel);

    expect(spyGetMatch).toHaveBeenCalledTimes(1);
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
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    fakeRequestDetailViewModel.duplicateTicketsModel = new DuplicateTicketsModel();
    fakeRequestDetailViewModel.duplicateTicketsModel.subIssueTypeId = 1;
    const spyGetMatch = jest.spyOn(commonService, 'getMatch').mockImplementation(() => Promise.resolve(new MatchModel()));

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel);

    expect(spyGetMatch).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
  });

  it('#loadUnderneathVoidPageItemsData should call getVoidTicketsMini', async () => {
    const voidItem = new VoidPageDuplicateTicketsModel();
    voidItem.subIssueType = new SubIssueType();
    const getLogInfoModel = new GetLogInfoModel();
    getLogInfoModel.validation = new Validation();
    getLogInfoModel.logInfoDetail = new LogInfoDetail();
    getLogInfoModel.logInfoDetail.matchId = Helper.fakeMatchId;
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    fakeRequestDetailViewModel.duplicateTicketsModel = new DuplicateTicketsModel();
    fakeRequestDetailViewModel.duplicateTicketsModel.subIssueTypeId = 1;
    const spyInitTicketQuery = jest.spyOn(ticketsService, 'initTicketQuery').mockImplementation();
    const spyGetVoidTicketsMini = jest.spyOn(ticketsService, 'getVoidTicketsMini').mockReturnValue(Promise.resolve(new TicketsModel()))
    const spyGetVoidedReason = jest.spyOn(commonService, 'getVoidedReason').mockReturnValue(Promise.resolve(new VoidedReason()));

    await voidPageService.loadUnderneathVoidPageItemsData(voidItem, fakeRequestDetailViewModel);

    expect(spyInitTicketQuery).toHaveBeenCalledTimes(1);
    expect(spyGetVoidTicketsMini).toHaveBeenCalledTimes(1);
    expect(spyGetVoidedReason).toHaveBeenCalledTimes(1);
  });

  it('#getBasicVoidPageItemsData should update matchModel to null when isDuplicateTicketsMixParlay', async () => {
    const voidItem = new VoidPageDuplicateTicketsModel();
    voidItem.subIssueType = new SubIssueType();
    voidPageService['initBasicRequestInfo'] = jest.fn().mockReturnValue(new BasicRequestInfo());
    voidPageService['getSubIssueTypeModel'] = jest.fn().mockReturnValue(new SubIssueType());
    voidPageService['getDisplayIssueTypeName'] = jest.fn().mockReturnValue('');
    voidPageService['isDuplicateTicketsMixParlay'] = jest.fn().mockReturnValue(true);

    const actual = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, Helper.fakeRequestDetailViewModel);

    expect(actual.matchModel).toBeNull();
  });

  it('#getTemplateValue should called #templateService.getTemplateValue', async () => {
    const voidItem = new VoidPageDuplicateTicketsModel();
    voidItem.matchModel = new MatchModel();
    voidItem.voidTicketsMini = new TicketsModel();
    const spyGetTemplateValue = jest.spyOn(templateService, 'initializeTemplateValue').mockReturnValue(new TemplateValue());
    const actual = voidPageService['getTemplateValue'](voidItem, Helper.fakeRequestDetailViewModel);

    expect(spyGetTemplateValue).toHaveBeenCalledTimes(1);
    expect(actual.checkSettled).toBe(voidItem.voidTicketsMini.isHasSettledTicket);
  });

  it('#getTemplateValue should return DisplayIssueTypeName when issueTypeName = subIssueTypeName ', async () => {
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

  it('#getVoidedReason should called #getVoidedReason when has matchModel & isDuplicateTicketsMixParlay false', async () => {
    const expected: VoidedReason = {
      reasonEnglish: 'Mix Parlay - En',
      reasonChineseSimplified: '串关 - Cn'
    }
    const mockResult: VoidedReason ={
      reasonEnglish: 'En',
      reasonChineseSimplified: 'Cn'
    };
    const voidItem = new VoidPageDuplicateTicketsModel();
    voidItem.matchModel = new MatchModel();
    voidItem.subIssueType = new SubIssueType();
    voidItem.filterBy = 1;
    const spyGetVoidedReason = jest.spyOn(commonService, 'getVoidedReason').mockReturnValue(Promise.resolve(mockResult));

    const actual = await voidPageService['getVoidedReason'](voidItem);

    expect(spyGetVoidedReason).toHaveBeenCalledTimes(1);
    expect(actual).toStrictEqual(expected);
  });
});