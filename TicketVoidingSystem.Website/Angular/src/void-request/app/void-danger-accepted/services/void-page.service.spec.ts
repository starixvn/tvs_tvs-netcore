import { TestBed } from '@angular/core/testing';
import _ from 'lodash';
import { RedCardModel } from '../../../../add-request/app/add-request/models/event-red-card.model';
import { WrongHdpModel } from '../../../../add-request/app/add-request/models/event-wrong-hdp.model';
import { WrongOuModel } from '../../../../add-request/app/add-request/models/event-wrong-ou.model';
import { GetLogInfoModel, GetLogInfoViewModel, Validation } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../add-request/app/add-request/models/trans-info-add-request.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { PagingModel } from '../../../../utility/components/paging/paging.model';
import { Message } from '../../../../utility/components/template-message/messages/message';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { SqlResult } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { GetTicketsQuery } from '../../models/get-tickets.query';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsService } from '../../services/tickets.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { TemplateMessageService } from './template-message.service';
import { VoidPageService } from './void-page.service';

class Helper {
  static readonly fakeRequestId = 50121;
  static readonly fakeMatchId = 90000;
  static readonly fakeVoidMatch: VoidMatch = {
    id: 1,
    subIssueType: new SubIssueType(),
    displayIssueTypeName: '',
    matchModel: new MatchModel(),
    voidTicketsMini: new TicketsModel(),
    voidReason: new VoidedReason(),
    templateValue: new TemplateValue(),
    logInfoDetail: new LogInfoDetail(),
    voidTicketsFull: new TicketsModel(),
    pagingVoidTickets: new PagingModel(),
    isShowTicketFull: true,
    isLoadedTicketFull: true,
    isBlockBetList: true,
    isShowTemplateMessage: true,
    templateMessage: new Message(),
    isAllLiveTickets: false,
    isCheckedEarlyEvent: false,
    isMainMatch: false,
    isAllNonLiveTickets: true,
    licenseeAffectedList: [],
    detailViewModel: new RequestDetailViewModel()
  };
  static readonly fakeSqlResultError: SqlResult = {
    errCode: 1,
    errMsg: 'error',
    isSuccessful: false,
  };
  static readonly fakeSqlResultSuccessful: SqlResult = {
    errCode: 0,
    errMsg: '',
    isSuccessful: true,
  };
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
    requestId: Helper.fakeRequestId,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    playerNames: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    duplicateTicketsModel: null,
    notParticipateModels: []
  };

  static readonly fakeIssueTypeList: IssueType[] = [
    { issueTypeId: 1, issueTypeName: 'Danger Accepted' },
    { issueTypeId: 11, issueTypeName: 'Abnormal Bet' },
    { issueTypeId: 13, issueTypeName: 'Abnormal Account' },
    { issueTypeId: 8, issueTypeName: 'Early Kick Off' },
    { issueTypeId: 9, issueTypeName: 'Wrong Kick Off Time' }
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
  let commonService: jest.Mocked<CommonService>;
  let ticketsService: jest.Mocked<TicketsService>;
  let templateMessageService: jest.Mocked<TemplateMessageService>;
  let voidPageService: VoidPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        VoidPageService,
        {
          provide: CommonService, useValue: {
            getIssueTypes: jest.fn().mockReturnValue(Helper.fakeIssueTypesModel), getLogInfo: jest.fn(),
            getMatch: jest.fn(), getVoidedReason: jest.fn().mockResolvedValue({ reasonEnglish: "Void" } as VoidedReason)
          }
        },
        { provide: TicketsService, useValue: { initTicketQuery: jest.fn(), getVoidTicketsMini: jest.fn() } },
        { provide: TemplateMessageService, useValue: { getTemplateValue: jest.fn().mockResolvedValue(new TemplateValue()) } }
      ]
    });
    ticketsService = TestBed.inject(TicketsService) as jest.Mocked<TicketsService>;
    commonService = TestBed.inject(CommonService) as jest.Mocked<CommonService>;
    templateMessageService = TestBed.inject(TemplateMessageService) as jest.Mocked<TemplateMessageService>;
    voidPageService = TestBed.inject(VoidPageService);
  });

  it('#getIssueTypes should return expected model', async () => {
    // Arrange & Action
    const result = await voidPageService.getIssueTypes();

    // Assert
    expect(commonService.getIssueTypes).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(Helper.fakeIssueTypesModel);
  });

  it('#getBasicVoidMatchesData should return call expected function', async () => {
    // Arrange
    const getLogInfoModel = new GetLogInfoModel();
    getLogInfoModel.validation = new Validation();
    getLogInfoModel.logInfoDetail = new LogInfoDetail();
    getLogInfoModel.logInfoDetail.matchId = Helper.fakeMatchId;
    const dangerAcceptedModel = new RedCardModel();
    dangerAcceptedModel.matchId = Helper.fakeMatchId;
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
    fakeRequestDetailViewModel.dangerAcceptedModels = [dangerAcceptedModel];

    voidPageService['getAllLogInfo'] = jest.fn().mockImplementation(() => [getLogInfoModel]);
    voidPageService['getSubIssueTypeModel'] = jest.fn();
    voidPageService['getDisplayIssueTypeName'] = jest.fn();

    // Action
    const result = await voidPageService.getBasicVoidMatchesData(null, fakeRequestDetailViewModel, new PrimitiveProperty());

    // Assert
    expect(commonService.getMatch).toHaveBeenCalledTimes(1);
    expect(voidPageService['getAllLogInfo']).toHaveBeenCalledTimes(1);
    expect(voidPageService['getSubIssueTypeModel']).toHaveBeenCalledTimes(1);
    expect(voidPageService['getDisplayIssueTypeName']).toHaveBeenCalledTimes(1);
    expect(voidPageService['getSubIssueTypeModel']).toHaveBeenCalledTimes(1);
    expect(result.length).toBeGreaterThan(0);
  });

  it('#loadUnderneathVoidMatchesData should update model', async () => {
    // Arrange
    const spyInitTicketQuery = jest.spyOn(ticketsService, 'initTicketQuery').mockImplementation(() => new GetTicketsQuery());
    const spyGetVoidTicketsMini = jest.spyOn(ticketsService, 'getVoidTicketsMini').mockImplementation(() => Promise.resolve(new TicketsModel()));
    const ISSUE_TYPE_ABNORMAL_ACCOUNT = IssueTypeConstant.ABNORMAL_ACCOUNT;
    const ISSUE_TYPE_DANGER_ACCEPTED = IssueTypeConstant.DANGER_ACCEPTED;
    const issueTypeIds = [ISSUE_TYPE_ABNORMAL_ACCOUNT, ISSUE_TYPE_DANGER_ACCEPTED];

    // Action
    issueTypeIds.forEach(async issueTypeId => {
      const fakeRequestDetailViewModel = _.cloneDeep(Helper.fakeRequestDetailViewModel);
      fakeRequestDetailViewModel.request.issueTypeId = Number(issueTypeId);
      await voidPageService.loadUnderneathVoidMatchesData([Helper.fakeVoidMatch], fakeRequestDetailViewModel);

      // Assert
      expect(spyInitTicketQuery).toHaveBeenCalledTimes(2);
      expect(spyGetVoidTicketsMini).toHaveBeenCalledTimes(2);
      expect(templateMessageService.getTemplateValue).toHaveBeenCalledTimes(2);
    });
  });

  it('#toggleTicketsArea should update model', async () => {
    // Arrange
    const currentVoidMatch = _.clone(Helper.fakeVoidMatch);
    const allVoidMatches = [_.clone(Helper.fakeVoidMatch)];

    // Action
    voidPageService.toggleTicketsArea(currentVoidMatch, allVoidMatches);

    // Assert
    expect(allVoidMatches[0].isShowTemplateMessage).toBe(false);
    expect(allVoidMatches[0].isShowTicketFull).toBe(false);
  });

  it('#toggleTemplateMessageArea should update model', async () => {
    // Arrange
    const currentVoidMatch = _.clone(Helper.fakeVoidMatch);
    const allVoidMatches = [_.clone(Helper.fakeVoidMatch)];

    // Action
    voidPageService.toggleTemplateMessageArea(currentVoidMatch, allVoidMatches);

    // Assert
    expect(allVoidMatches[0].isShowTemplateMessage).toBe(false);
    expect(allVoidMatches[0].isShowTicketFull).toBe(false);
  });

  it('#getAllLogInfo should return expected model', async () => {
    // Arrange
    const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;
    const getLogInfoModels = [new GetLogInfoModel()];
    const viewModel: GetLogInfoViewModel = {
      getLogInfoModels: getLogInfoModels,
      transInfoAddRequestModel: new TransInfoAddRequestModel(),
      infoSiteDBDownModel: null
    };
    commonService.getLogInfo = jest.fn().mockResolvedValue(viewModel);
    [
      IssueTypeConstant.DANGER_ACCEPTED,
      IssueTypeConstant.WRONG_HDP,
      IssueTypeConstant.WRONG_1ST_HDP,
      IssueTypeConstant.WRONG_OU,
      IssueTypeConstant.WRONG_1ST_OU,
    ].forEach(async x => {
      fakeRequestDetailViewModel.request.issueTypeId = Number(x);

      // Action
      const result = await voidPageService['getAllLogInfo'](fakeRequestDetailViewModel, new PrimitiveProperty());

      // Assert
      expect(commonService.getLogInfo).toHaveBeenCalled();
      expect(result).toStrictEqual(getLogInfoModels);
    });
  });

  it('#getSubIssueTypeModel should return expected model', async () => {
    // Arrange
    const issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
    const issueTypes = Helper.fakeIssueTypesModel;

    // Action
    const result = voidPageService['getSubIssueTypeModel'](issueTypeId, issueTypes);

    // Assert
    expect(result).toStrictEqual(issueTypes.subIssueTypes[0]);
  });

  it('#getDisplayIssueTypeName should return expected model', async () => {
    // Arrange
    const issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
    const subIssueTypeModel = Helper.fakeSubIssueTypeList;
    const issueTypes = Helper.fakeIssueTypesModel;

    // Action
    const result = voidPageService['getDisplayIssueTypeName'](issueTypeId, subIssueTypeModel[0], issueTypes);

    // Assert
    expect(result).toEqual('Danger Accepted - Goal');
  });

  it('#getDisplayIssueTypeName should return expected model', async () => {
    // Arrange
    const issueTypeId = Number(IssueTypeConstant.ABNORMAL_ACCOUNT);
    const subIssueTypeModel = Helper.fakeSubIssueTypeList[0];
    subIssueTypeModel.subIssueTypeName = 'Abnormal Account';
    const issueTypes = Helper.fakeIssueTypesModel;

    // Action
    const result = voidPageService['getDisplayIssueTypeName'](issueTypeId, subIssueTypeModel, issueTypes);

    // Assert
    expect(result).toEqual('Abnormal Account');
  });

  it('#initBasicRequestInfo should return expected when isWrongHDP', async () => {
    // Arrange
    const wrongOuModelHasHomeFavorite = new WrongHdpModel();
    wrongOuModelHasHomeFavorite.homeFavorite = '12';
    [
      IssueTypeConstant.WRONG_HDP,
      IssueTypeConstant.WRONG_1ST_HDP
    ].forEach(x => {
      const requestDetail = new RequestDetailViewModel();
      requestDetail.wrongHdpModels = [new WrongHdpModel(), wrongOuModelHasHomeFavorite];

      // Action
      const actual = voidPageService['initBasicRequestInfo'](x, requestDetail);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  it('#initBasicRequestInfo should return expected when isWrongOU', async () => {
    // Arrange
    [
      IssueTypeConstant.WRONG_OU,
      IssueTypeConstant.WRONG_1ST_OU
    ].forEach(x => {
      const requestDetail = new RequestDetailViewModel();
      requestDetail.wrongOuModels = [new WrongOuModel()];

      // Action
      const actual = voidPageService['initBasicRequestInfo'](x, requestDetail);

      // Assert
      expect(actual).toBeDefined();
    });
  });

  it('#initBasicRequestInfo should return []', async () => {
    // Arrange
    const requestDetail = new RequestDetailViewModel();

    // Action
    const actual = voidPageService['initBasicRequestInfo']('113123', requestDetail);

    // Assert
    expect(actual.length).toBe(0);
  });
});