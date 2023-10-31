import * as _ from 'lodash';
import { RedCardModel } from '../../../../add-request/app/add-request/models/event-red-card.model';
import { GetLogInfoModel, GetLogInfoViewModel, Validation } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../../add-request/app/add-request/models/trans-info-add-request.model';
import { RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { Message } from '../../../../utility/components/template-message/messages/message';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { AffectedLicensee } from '../../../../utility/models/affected-licensee.model';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { SqlResult } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { AppService } from '../../app.service';
import { BasicRequestInfo } from '../../models/basic-request-info.model';
import { GetTicketsQuery } from '../../models/get-tickets.query';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsService } from '../../services/tickets.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { DuplicateTicketsModel } from './../../../../add-request/app/add-request/models/event-duplicate-tickets.model';
import { TemplateMessageService } from './template-message.service';
import { VoidPageService } from './void-page.service';

class Helper {
    static readonly fakeRequestId = 50121;
    static readonly fakeMatchId = 90000;
    static readonly fakeVoidMatch: VoidMatch = {
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
        affectedLicensee: new AffectedLicensee(),
        affectedInstantLicensee: new AffectedLicensee(),
        chinaViewLicensee: new AffectedLicensee(),
        cashOutLicensee: new AffectedLicensee(),
        isShowTemplateMessage: true,
        templateMessage: new Message(),
        isAllLiveTickets: false,
        isCheckedEarlyEvent: false,
        isMainMatch: false,
        isPoolHouseAffected: false,
        jollyViewLicensee: new AffectedLicensee,
        cancelCashOutLicensee: new AffectedLicensee,
        isAllNonLiveTickets: true
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
        requestId: 0
    };
    static readonly fakeredCardModel: RedCardModel = {
        matchId: 0,
        matchEvent: '',
        leagueName: '',
        isMainMatch: false,
        filterBy: 0,
        filterFromTransTime: '',
        filterToTransTime: '',
        subIssueTypeId: 0,
        subIssueTypeName: '',
        matchType: 0,
        logInfoDetail: new LogInfoDetail
    };
    static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
        requestId: Helper.fakeRequestId,
        lastModifiedDate: null,
        request: Helper.fakeRequestDetailModel,
        event: null,
        messages: [],
        wrongScoreModels: [],
        dangerAcceptedModels: [],
        redCardModels: [Helper.fakeredCardModel],
        wrongHdpModels: [],
        wrongOuModels: [],
        wrongOddsModels: [],
        reducedOverModels: [],
        duplicateTicketsModel: new DuplicateTicketsModel
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
    static readonly fakeBasicRequestInfo: BasicRequestInfo = {
        matchId: 11,
        subIssueTypeId: 0,
        isMainMatch: false
    };
}

describe('VoidPageService', () => {
    let commonService: CommonService;
    let appService: AppService;
    let ticketsService: TicketsService;
    let templateMessageService: TemplateMessageService;
    let voidPageService: VoidPageService;

    beforeEach(() => {
        appService = new AppService(null);
        ticketsService = new TicketsService(null);
        templateMessageService = new TemplateMessageService(null);
        commonService = new CommonService(null);
        voidPageService = new VoidPageService(commonService, appService, ticketsService, templateMessageService);
    });

    it('#getIssueTypes should return expected model', async () => {
        // Arrange
        const issueTypesModel = new IssueTypesModel();
        const spyGetIssueTypes = jest.spyOn(commonService, 'getIssueTypes').mockImplementation(() => Promise.resolve(issueTypesModel));

        // Action
        const result = await voidPageService.getIssueTypes();

        // Assert
        expect(spyGetIssueTypes).toHaveBeenCalledTimes(1);
        expect(result).toStrictEqual(issueTypesModel);
    });

    it('#getBasicVoidMatchesData should return call expected function', async () => {
        // Arrange
        const getLogInfoModel = new GetLogInfoModel();
        getLogInfoModel.validation = new Validation();
        getLogInfoModel.logInfoDetail = new LogInfoDetail();
        getLogInfoModel.logInfoDetail.matchId = 11;
        const fakeRequestDetailViewModel = Helper.fakeRequestDetailViewModel;

        voidPageService['getAllLogInfo'] = jest.fn().mockReturnValue([getLogInfoModel]);
        voidPageService['initBasicRequestInfo'] = jest.fn().mockReturnValue([Helper.fakeBasicRequestInfo]);
        voidPageService['getSubIssueTypeModel'] = jest.fn().mockReturnValue(1);
        voidPageService['getDisplayIssueTypeName'] = jest.fn().mockReturnValue('11');
        commonService.getMatch = jest.fn().mockReturnValue(new MatchModel());

        // Action
        const result = await voidPageService.getBasicVoidMatchesData(null, fakeRequestDetailViewModel, new PrimitiveProperty());

        // Assert
        expect(commonService.getMatch).toHaveBeenCalledTimes(1);
        expect(voidPageService['getAllLogInfo']).toHaveBeenCalledTimes(1);
        expect(voidPageService['initBasicRequestInfo']).toHaveBeenCalledTimes(1);
        expect(voidPageService['getSubIssueTypeModel']).toHaveBeenCalledTimes(1);
        expect(voidPageService['getDisplayIssueTypeName']).toHaveBeenCalledTimes(1);
        expect(voidPageService['getSubIssueTypeModel']).toHaveBeenCalledTimes(1);
        expect(result.length).toBeGreaterThan(0);
    });

    it('#loadUnderneathVoidMatchesData should update model', async () => {
        // Arrange
        const spyInitTicketQuery = jest.spyOn(ticketsService, 'initTicketQuery').mockImplementation(() => new GetTicketsQuery());
        const spyGetVoidTicketsMini = jest.spyOn(ticketsService, 'getVoidTicketsMini').mockImplementation(() => Promise.resolve(new TicketsModel()));
        const spyGetTemplateValue = jest.spyOn(templateMessageService, 'getTemplateValue').mockImplementation(() => new TemplateValue());
        const spyGetVoidedReason = jest.spyOn(appService, 'getVoidedReason').mockImplementation(() => Promise.resolve(new VoidedReason()));
        const issueTypeIds = [IssueTypeConstant.ABNORMAL_ACCOUNT, IssueTypeConstant.DANGER_ACCEPTED];
        // Action
        issueTypeIds.forEach(async issueTypeId => {
            const fakeRequestDetailViewModel = _.cloneDeep(Helper.fakeRequestDetailViewModel);
            fakeRequestDetailViewModel.request.issueTypeId = Number(issueTypeId);
            await voidPageService.loadUnderneathVoidMatchesData([Helper.fakeVoidMatch], fakeRequestDetailViewModel);

            // Assert
            expect(spyInitTicketQuery).toHaveBeenCalledTimes(2);
            expect(spyGetVoidTicketsMini).toHaveBeenCalledTimes(2);
            expect(spyGetTemplateValue).toHaveBeenCalledTimes(2);
            expect(spyGetVoidedReason).toHaveBeenCalledTimes(2);
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
            transInfoAddRequestModel: new TransInfoAddRequestModel()
        };
        const spyGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(viewModel));
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
            expect(spyGetLogInfo).toHaveBeenCalled();
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

    it('#initBasicRequestInfo should return expected', async () => {
        // Arrange
        const requestDetail = Helper.fakeRequestDetailViewModel;
        // Action
        const actual = voidPageService['initBasicRequestInfo'](requestDetail);

        // Assert
        expect(actual).toBeDefined();
    });
});