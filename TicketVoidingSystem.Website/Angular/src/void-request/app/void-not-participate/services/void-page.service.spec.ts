import { TestBed } from '@angular/core/testing';
import { NotParticipateModel } from '../../../../add-request-new/models/event-not-participate.model';
import { RedCardModel } from '../../../../add-request-new/models/event-red-card.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../../../add-request-new/models/get-log-info.model';
import { PlayerName, RequestDetailModel, RequestDetailViewModel } from '../../../../add-request-new/models/request-detail.model';
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
});