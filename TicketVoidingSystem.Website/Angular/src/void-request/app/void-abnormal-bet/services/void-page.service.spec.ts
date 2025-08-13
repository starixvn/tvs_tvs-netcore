import { TestBed } from '@angular/core/testing';
import { AbnormalBetModel } from '../../../../add-request/app/add-request/models/abnormal-bet.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../add-request/app/add-request/models/trans-info-add-request.model';
import { PlayerName, RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { MatchInfo } from '../../../../utility/models/event.model';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { Result } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { TicketsService } from '../../services/tickets.service';
import { VoidPageCommonService } from '../../services/void-page-common.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidAbnormalBetModel } from '../models/void-abnormal-bet.model';
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
  static readonly fakeAbnormalBetModel: AbnormalBetModel = {
    filterBy: null,
    matches: [ { matchId: 1 } as MatchInfo],
    isConfirmCalculator: false,
    subIssueTypeId: 1,
    subIssueTypeName: '',
    transIds: '1,2'
  }
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: 1,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    playerNames: [new PlayerName()],
    abnormalBetModel: Helper.fakeAbnormalBetModel
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
  let templateService: TemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
          providers: [
            VoidPageService,
            {
              provide: CommonService, useValue: {
                getIssueTypes: jest.fn().mockReturnValue(Helper.fakeIssueTypesModel),
                getMatch: jest.fn(), getVoidedReason: jest.fn().mockResolvedValue({reasonEnglish: "Void"} as VoidedReason)
              }
            },
            { provide: TicketsService, useValue: { initTicketQuery: jest.fn(), getVoidTicketsMini: jest.fn()} },
            { provide: TemplateService, useValue: { initializeTemplateValue: jest.fn().mockResolvedValue(new TemplateValue()) } },
            { provide: VoidPageCommonService, useValue: { getDisplayIssueTypeName: jest.fn() } }
          ]
        });
        ticketsService = TestBed.inject(TicketsService) as jest.Mocked<TicketsService>;
        commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
        templateService = TestBed.inject(TemplateService) as jest.Mocked<TemplateService>;
        voidPageService = TestBed.inject(VoidPageService);
  });

  it('#getIssueTypes should return issueTypesModel', async () => {
    const expected = new IssueTypesModel();
    commonService.getIssueTypes = jest.fn().mockReturnValue(expected);

    const actual = await voidPageService.getIssueTypes();

    expect(actual).toEqual(expected);
  });

  it('#getBasicVoidPageItemsData should call getMatch', async () => {
    commonService.getMatch = jest.fn().mockResolvedValue(new MatchModel());
    const result = await voidPageService.getBasicVoidPageItemsData(Helper.fakeIssueTypesModel, Helper.fakeRequestDetailViewModel);

    expect(commonService.getMatch).toHaveBeenCalledTimes(1);

    expect(result).toBeDefined();
  });

  it('#loadUnderneathVoidPageItemsData should call getVoidTicketsMini', async () => {
    const voidItem = new VoidAbnormalBetModel();
    voidItem.subIssueType = new SubIssueType();
    voidItem.matchModel = new MatchModel();
    voidItem.templateValue = new TemplateValue();
    voidItem.matchModel.matchId = 1;
    ticketsService.getVoidTicketsMini = jest.fn().mockResolvedValue(new TicketsModel());
    voidPageService['getTemplateValue'] = jest.fn().mockReturnValue(new TemplateValue());

    await voidPageService.loadUnderneathVoidPageItemsData([voidItem], Helper.fakeRequestDetailViewModel);

    expect(ticketsService.initTicketQuery).toHaveBeenCalledTimes(1);
    expect(ticketsService.getVoidTicketsMini).toHaveBeenCalledTimes(1);
    expect(commonService.getVoidedReason).toHaveBeenCalledTimes(1);
    expect(voidPageService['getTemplateValue']).toHaveBeenCalledTimes(1);
  });

  it('#getTemplateValue should called #templateService.getTemplateValue', async () => {
    const voidItem = new VoidAbnormalBetModel();
    voidItem.matchModel = new MatchModel();
    voidItem.voidTicketsMini = new TicketsModel();
    const spyGetTemplateValue = jest.spyOn(templateService, 'initializeTemplateValue').mockReturnValue(new TemplateValue());
    const actual = voidPageService['getTemplateValue'](voidItem, Helper.fakeRequestDetailViewModel);

    expect(spyGetTemplateValue).toHaveBeenCalledTimes(1);
    expect(actual.checkSettled).toBe(voidItem.voidTicketsMini.isHasSettledTicket);
  });
});