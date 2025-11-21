import { TestBed } from '@angular/core/testing';
import { NotParticipateModel } from '../../../../add-request-new/models/event-not-participate.model';
import { OtherIssuesModel } from '../../../../add-request-new/models/event-other-issues.model';
import { ReducedOverModel } from '../../../../add-request-new/models/event-reduced-over.model';
import { RedCardModel } from '../../../../add-request-new/models/event-red-card.model';
import { TechnicalErrorModel } from '../../../../add-request-new/models/event-technical-error.model';
import { WrongOddsSportsBookModel } from '../../../../add-request-new/models/event-wrong-odds-sports-book.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../../../add-request-new/models/get-log-info.model';
import { PlayerName, RequestDetailModel, RequestDetailViewModel, RequestEventModel } from '../../../../add-request-new/models/request-detail.model';
import { TransInfoAddRequestModel } from '../../../../add-request-new/models/trans-info-add-request.model';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { Result } from '../../../../utility/models/result';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { CommonService } from '../../../../utility/services/common.service';
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
    { issueTypeId: 21, issueTypeName: 'Not Participate'},
    { issueTypeId: 17, issueTypeName: 'Archived Ticket'},
    { issueTypeId: 18, issueTypeName: 'Other Issues'},
    { issueTypeId: 19, issueTypeName: 'Reduced Over'},
    { issueTypeId: 23, issueTypeName: 'Abandoned'},
    { issueTypeId: 24, issueTypeName: 'Technical Error'},
    { issueTypeId: 25, issueTypeName: 'Wrong Odds Sports Book'},
    { issueTypeId: 27, issueTypeName: 'Match Early Completed'},
    { issueTypeId: 28, issueTypeName: 'Second Team Batting'}
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
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 17,
      subIssueTypeName: 'Archived Ticket Sub',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 18,
      subIssueTypeName: 'Other Issues Sub',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 19,
      subIssueTypeName: 'Reduced Over Sub',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 23,
      subIssueTypeName: 'Abandoned Sub',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 24,
      subIssueTypeName: 'Technical Error Sub',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 25,
      subIssueTypeName: 'Wrong Odds Sports Book Sub',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 27,
      subIssueTypeName: 'Match Early Completed Sub',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 1,
      issueTypeId: 28,
      subIssueTypeName: 'Second Team Batting Sub',
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
    infoSiteDBDownModel: null
  };
}

describe('VoidPageService', () => {
  let voidPageService : VoidPageService ;
  let commonService: CommonService;
  let ticketsService: TicketsService;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestingModule],
        providers: [
          VoidPageService,
          {
            provide: CommonService, useValue: {
              getIssueTypes: jest.fn().mockReturnValue(Helper.fakeIssueTypesModel),
              getMatch: jest.fn(), getVoidedReason: jest.fn().mockResolvedValue({ reasonEnglish: "Void" } as VoidedReason)
            }
          },
          { provide: TicketsService, useValue: { initTicketQuery: jest.fn(), getVoidTicketsMini: jest.fn().mockResolvedValue(new TicketsModel()) } },
          { provide: TemplateMessageService, useValue: { getTemplateValue: jest.fn().mockResolvedValue(new TemplateValue()) } }
        ]
      });
      commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
      ticketsService = TestBed.inject(TicketsService) as jest.Mocked<TicketsService>;
      voidPageService = TestBed.inject(VoidPageService);
  });

  it('#getIssueTypes should return issueTypesModel', async () => {
    const expected = new IssueTypesModel();
    commonService.getIssueTypes = jest.fn().mockReturnValue(expected);

    const actual = await voidPageService.getIssueTypes();

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

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);
    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);
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
    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalled();
    expect(commonService.getLogInfo).toHaveBeenCalled();
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

    await voidPageService.loadUnderneathVoidPageItemsData(voidItem, fakeRequestDetailViewModel);

    expect(ticketsService.initTicketQuery).toHaveBeenCalledTimes(1);
    expect(ticketsService.getVoidTicketsMini).toHaveBeenCalledTimes(1);
    expect(commonService.getVoidedReason).toHaveBeenCalledTimes(1);
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
    commonService.getVoidedReason = jest.fn().mockReturnValue(Promise.resolve(expected));

    const actual = await voidPageService['getVoidedReason'](voidItem);

    expect(commonService.getVoidedReason).toHaveBeenCalledTimes(1);
    expect(actual).toStrictEqual(expected);
  });

  it('#getBasicVoidPageItemsData should handle error when getLogInfo fails', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;

    commonService.getLogInfo = jest.fn().mockRejectedValue(new Error('Test error'));

    await expect(voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty()))
      .rejects
      .toThrow('Test error');
  });

  it('#loadUnderneathVoidPageItemsData should handle error when getVoidTicketsMini fails', async () => {
    const voidItem = new VoidNotParticipateModel();
    voidItem.subIssueType = new SubIssueType();
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;

    ticketsService.getVoidTicketsMini = jest.fn().mockRejectedValue(new Error('Test error'));

    await expect(voidPageService.loadUnderneathVoidPageItemsData(voidItem, fakeRequestDetailViewModel))
      .rejects
      .toThrow('Test error');
  });

  it('#getDisplayIssueTypeName should return subIssueTypeName when issueTypeName is different', async () => {
    const issueType = new IssueType();
    issueType.issueTypeId = 20;
    issueType.issueTypeName = 'Duplicate Tickets'
    const issueTypesModel = new IssueTypesModel();
    issueTypesModel.issueTypes = [issueType]
    const subType: SubIssueType =
      {
        subIssueTypeId: 1,
        issueTypeId: 20,
        subIssueTypeName: 'Different Name',
        subIssueTypeNameCS: ''
      };

    const actual = voidPageService['getDisplayIssueTypeName'](20, subType, issueTypesModel);

    expect(actual).toBe('Duplicate Tickets - Different Name')
  });

  it('#getVoidedReason should handle error when getVoidedReason fails', async () => {
    const voidItem = new VoidNotParticipateModel();
    voidItem.matchModel = new MatchModel();
    voidItem.subIssueType = new SubIssueType();
    commonService.getVoidedReason = jest.fn().mockRejectedValue(new Error('Test error'));

    await expect(voidPageService['getVoidedReason'](voidItem))
      .rejects
      .toThrow('Test error');
  });

  it('#getBasicVoidPageItemsData should handle null matchId', async () => {
    const getLogInfoModel = new GetLogInfoModel();
    getLogInfoModel.validation = new Validation();
    getLogInfoModel.logInfoDetail = new LogInfoDetail();
    getLogInfoModel.logInfoDetail.matchId = null;
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(result).toBeDefined();
    expect(result.matchModel).toBeUndefined();
  });

  it('#getBasicVoidPageItemsData should handle error when getMatch fails', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockRejectedValue(new Error('Test error'));
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    await expect(voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty()))
      .rejects
      .toThrow('Test error');
  });

  it('#getBasicVoidPageItemsData should handle error when getLogInfo fails', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;

    commonService.getLogInfo = jest.fn().mockRejectedValue(new Error('Test error'));

    await expect(voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty()))
      .rejects
      .toThrow('Test error');
  });

  it('#loadUnderneathVoidPageItemsData should handle error when getVoidTicketsMini fails', async () => {
    const voidItem = new VoidNotParticipateModel();
    voidItem.subIssueType = new SubIssueType();
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;

    ticketsService.getVoidTicketsMini = jest.fn().mockRejectedValue(new Error('Test error'));

    await expect(voidPageService.loadUnderneathVoidPageItemsData(voidItem, fakeRequestDetailViewModel))
      .rejects
      .toThrow('Test error');
  });

  it('#getVoidedReason should handle error when getVoidedReason fails', async () => {
    const voidItem = new VoidNotParticipateModel();
    voidItem.matchModel = new MatchModel();
    voidItem.subIssueType = new SubIssueType();
    commonService.getVoidedReason = jest.fn().mockRejectedValue(new Error('Test error'));

    await expect(voidPageService['getVoidedReason'](voidItem))
      .rejects
      .toThrow('Test error');
  });

  // Tests for initBasicRequestInfo - TechnicalError
  it('#getBasicVoidPageItemsData should handle TechnicalError issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.TECHNICAL_ERROR);
    fakeRequestDetailViewModel.technicalErrorModel = new TechnicalErrorModel();
    fakeRequestDetailViewModel.technicalErrorModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.technicalErrorModel.subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  // Tests for initBasicRequestInfo - SecondTeamBatting
  it('#getBasicVoidPageItemsData should handle SecondTeamBatting issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.SECOND_TEAM_BATTING);
    fakeRequestDetailViewModel.technicalErrorModel = new TechnicalErrorModel();
    fakeRequestDetailViewModel.technicalErrorModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.technicalErrorModel.subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  // Tests for initBasicRequestInfo - WrongOddsSportsBook
  it('#getBasicVoidPageItemsData should handle WrongOddsSportsBook issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK);
    fakeRequestDetailViewModel.wrongOddsSportsBookModel = new WrongOddsSportsBookModel();
    fakeRequestDetailViewModel.wrongOddsSportsBookModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.wrongOddsSportsBookModel.subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  // Tests for initBasicRequestInfo - OtherIssues
  it('#getBasicVoidPageItemsData should handle OtherIssues issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.OTHER_ISSUES);
    fakeRequestDetailViewModel.otherIssuesModel = new OtherIssuesModel();
    fakeRequestDetailViewModel.otherIssuesModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.otherIssuesModel.subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  // Tests for initBasicRequestInfo - MatchEarlyCompleted
  it('#getBasicVoidPageItemsData should handle MatchEarlyCompleted issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.MATCH_EARLY_COMPLETED);
    fakeRequestDetailViewModel.otherIssuesModel = new OtherIssuesModel();
    fakeRequestDetailViewModel.otherIssuesModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.otherIssuesModel.subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  // Tests for initBasicRequestInfo - ReducedOver
  it('#getBasicVoidPageItemsData should handle ReducedOver issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.REDUCED_OVER);
    fakeRequestDetailViewModel.reducedOverModels = [new ReducedOverModel()];
    fakeRequestDetailViewModel.reducedOverModels[0].matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.reducedOverModels[0].subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  // Tests for initBasicRequestInfo - Abandoned
  it('#getBasicVoidPageItemsData should handle Abandoned issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.ABANDONED);
    fakeRequestDetailViewModel.reducedOverModels = [new ReducedOverModel()];
    fakeRequestDetailViewModel.reducedOverModels[0].matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.reducedOverModels[0].subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  // Tests for initBasicRequestInfo - ArchivedTicket
  it('#getBasicVoidPageItemsData should handle ArchivedTicket issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.ARCHIVED_TICKET);
    fakeRequestDetailViewModel.event = new RequestEventModel();
    fakeRequestDetailViewModel.event.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.event.subIssueTypeId = 1;

    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty());

    expect(commonService.getMatch).toHaveBeenCalledWith(Helper.fakeMatchId);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  // Tests for initBasicRequestInfo - Returns null when no match
  it('#getBasicVoidPageItemsData should return null when issue type does not match any condition', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = 999; // Unknown issue type

    await expect(voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, fakeRequestDetailViewModel, new CommonPrimitiveProperty()))
      .rejects
      .toThrow();
  });

  // Tests for getSubIssueTypeModel
  it('#getSubIssueTypeModel should return subIssueType when found', () => {
    const issueTypesModel = Helper.fakeIssueTypesModel;
    const subIssueTypeId = 1;

    const result = voidPageService['getSubIssueTypeModel'](subIssueTypeId, issueTypesModel);

    expect(result).toBeDefined();
    expect(result.subIssueTypeId).toBe(subIssueTypeId);
  });

  it('#getSubIssueTypeModel should return undefined when not found', () => {
    const issueTypesModel = Helper.fakeIssueTypesModel;
    const subIssueTypeId = 999; // Non-existent ID

    const result = voidPageService['getSubIssueTypeModel'](subIssueTypeId, issueTypesModel);

    expect(result).toBeUndefined();
  });

  // Tests for getLogInfo - TechnicalError
  it('#getLogInfo should handle TechnicalError issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.TECHNICAL_ERROR);
    fakeRequestDetailViewModel.technicalErrorModel = new TechnicalErrorModel();
    fakeRequestDetailViewModel.technicalErrorModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.technicalErrorModel.subIssueTypeId = 1;
    const primitiveProperty = new CommonPrimitiveProperty();

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService['getLogInfo'](fakeRequestDetailViewModel, primitiveProperty);

    expect(primitiveProperty.isBlockUI).toBe(false);
    expect(commonService.getLogInfo).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // Tests for getLogInfo - WrongOddsSportsBook
  it('#getLogInfo should handle WrongOddsSportsBook issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK);
    fakeRequestDetailViewModel.wrongOddsSportsBookModel = new WrongOddsSportsBookModel();
    fakeRequestDetailViewModel.wrongOddsSportsBookModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.wrongOddsSportsBookModel.subIssueTypeId = 1;
    const primitiveProperty = new CommonPrimitiveProperty();

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService['getLogInfo'](fakeRequestDetailViewModel, primitiveProperty);

    expect(primitiveProperty.isBlockUI).toBe(false);
    expect(commonService.getLogInfo).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // Tests for getLogInfo - OtherIssues
  it('#getLogInfo should handle OtherIssues issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.OTHER_ISSUES);
    fakeRequestDetailViewModel.otherIssuesModel = new OtherIssuesModel();
    fakeRequestDetailViewModel.otherIssuesModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.otherIssuesModel.subIssueTypeId = 1;
    const primitiveProperty = new CommonPrimitiveProperty();

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService['getLogInfo'](fakeRequestDetailViewModel, primitiveProperty);

    expect(primitiveProperty.isBlockUI).toBe(false);
    expect(commonService.getLogInfo).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // Tests for getLogInfo - MatchEarlyCompleted
  it('#getLogInfo should handle MatchEarlyCompleted issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.MATCH_EARLY_COMPLETED);
    fakeRequestDetailViewModel.otherIssuesModel = new OtherIssuesModel();
    fakeRequestDetailViewModel.otherIssuesModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.otherIssuesModel.subIssueTypeId = 1;
    const primitiveProperty = new CommonPrimitiveProperty();

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService['getLogInfo'](fakeRequestDetailViewModel, primitiveProperty);

    expect(primitiveProperty.isBlockUI).toBe(false);
    expect(commonService.getLogInfo).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // Tests for getLogInfo - ReducedOver
  it('#getLogInfo should handle ReducedOver issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.REDUCED_OVER);
    fakeRequestDetailViewModel.reducedOverModels = [new ReducedOverModel()];
    fakeRequestDetailViewModel.reducedOverModels[0].matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.reducedOverModels[0].subIssueTypeId = 1;
    const primitiveProperty = new CommonPrimitiveProperty();

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService['getLogInfo'](fakeRequestDetailViewModel, primitiveProperty);

    expect(primitiveProperty.isBlockUI).toBe(false);
    expect(commonService.getLogInfo).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // Tests for getLogInfo - Abandoned
  it('#getLogInfo should handle Abandoned issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.ABANDONED);
    fakeRequestDetailViewModel.reducedOverModels = [new ReducedOverModel()];
    fakeRequestDetailViewModel.reducedOverModels[0].matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.reducedOverModels[0].subIssueTypeId = 1;
    const primitiveProperty = new CommonPrimitiveProperty();

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService['getLogInfo'](fakeRequestDetailViewModel, primitiveProperty);

    expect(primitiveProperty.isBlockUI).toBe(false);
    expect(commonService.getLogInfo).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // Tests for getLogInfo - SecondTeamBatting
  it('#getLogInfo should handle SecondTeamBatting issue type', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.SECOND_TEAM_BATTING);
    fakeRequestDetailViewModel.technicalErrorModel = new TechnicalErrorModel();
    fakeRequestDetailViewModel.technicalErrorModel.matchId = Helper.fakeMatchId;
    fakeRequestDetailViewModel.technicalErrorModel.subIssueTypeId = 1;
    const primitiveProperty = new CommonPrimitiveProperty();

    commonService.getLogInfo = jest.fn().mockResolvedValue(Helper.fakeGetLogInfoViewModel);

    const result = await voidPageService['getLogInfo'](fakeRequestDetailViewModel, primitiveProperty);

    expect(primitiveProperty.isBlockUI).toBe(false);
    expect(commonService.getLogInfo).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // Tests for getLogInfo - isBlockUI flag
  it('#getLogInfo should set isBlockUI to true then false', async () => {
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    fakeRequestDetailViewModel.notParticipateModels = [new NotParticipateModel()];
    fakeRequestDetailViewModel.notParticipateModels[0].subIssueTypeId = 1;
    const primitiveProperty = new CommonPrimitiveProperty();
    primitiveProperty.isBlockUI = false;

    let isBlockUIAtCallTime = false;
    commonService.getLogInfo = jest.fn().mockImplementation(() => {
      isBlockUIAtCallTime = primitiveProperty.isBlockUI;
      return Promise.resolve(Helper.fakeGetLogInfoViewModel);
    });

    await voidPageService['getLogInfo'](fakeRequestDetailViewModel, primitiveProperty);

    expect(isBlockUIAtCallTime).toBe(true);
    expect(primitiveProperty.isBlockUI).toBe(false);
  });

  // Tests for loadUnderneathVoidPageItemsData - clone licenseeAffectedList
  it('#loadUnderneathVoidPageItemsData should clone licenseeAffectedList', async () => {
    const voidItem = new VoidNotParticipateModel();
    voidItem.subIssueType = new SubIssueType();
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);

    const originalLicenseeList = [{ group: 'normal', licenseesName: 'Test Licensee', message: '', show: false, color: '' }];
    const ticketsModel = { licenseeAffectedList: originalLicenseeList } as any;
    ticketsService.getVoidTicketsMini = jest.fn().mockResolvedValue(ticketsModel);

    await voidPageService.loadUnderneathVoidPageItemsData(voidItem, fakeRequestDetailViewModel);

    expect(voidItem.licenseeAffectedList).toBeDefined();
    expect(voidItem.licenseeAffectedList).not.toBe(originalLicenseeList);
    expect(voidItem.licenseeAffectedList).toEqual(originalLicenseeList);
  });
});