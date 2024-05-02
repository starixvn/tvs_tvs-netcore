import * as _ from 'lodash';
import { FilterModel } from '../../../add-request/app/add-request/filter/filter.model';
import { AbnormalAccountModel } from '../../../add-request/app/add-request/models/abnormal-account.model';
import { AbnormalBetModel } from '../../../add-request/app/add-request/models/abnormal-bet.model';
import { EventDetailModel } from '../../../add-request/app/add-request/models/event-detail.model';
import { DuplicateTicketsModel } from '../../../add-request/app/add-request/models/event-duplicate-tickets.model';
import { NotParticipateModel } from '../../../add-request/app/add-request/models/event-not-participate.model';
import { RedCardModel } from '../../../add-request/app/add-request/models/event-red-card.model';
import { ReducedOverModel } from '../../../add-request/app/add-request/models/event-reduced-over.model';
import { WrongHdpModel } from '../../../add-request/app/add-request/models/event-wrong-hdp.model';
import { WrongOddsModel } from '../../../add-request/app/add-request/models/event-wrong-odds.model';
import { WrongOuModel } from '../../../add-request/app/add-request/models/event-wrong-ou.model';
import { WrongScoreModel } from '../../../add-request/app/add-request/models/event-wrong-score.model';
import { GetLogInfoModel, TicketRequest, Validation } from '../../../add-request/app/add-request/models/get-log-info.model';
import { RequestModel } from '../../../add-request/app/add-request/models/request.model';
import { OthersModel } from '../../../add-request/app/add-request/others/others.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { LogInfoArg } from '../models/log-info.model';
import { MapEventArg } from '../models/map-event.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { RequestDetailModel, RequestDetailViewModel, RequestEventModel } from '../request.model';
import { ObjectService } from './object.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeScoreId = 28291;
  static readonly fakeRequestId = 50121;
  static readonly fakeMatchId = 90000;
  static readonly fakeDate = '2020-11-09 12:08:49.737';
  static readonly fakePrimitiveProperty: PrimitiveProperty = {
    matchId: Helper.fakeMatchId,
    requestId: Helper.fakeRequestId,
    sportType: 1,
    actionIdOfFirstTimeAccess: '2',
    requestedBy: '',
    userId: 0
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
    requestId: 1
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
  static readonly fakeLogInfoArg: LogInfoArg = {
    primitiveProperty: Helper.fakePrimitiveProperty,
    detailViewModel: Helper.fakeRequestDetailViewModel,
  };
  static readonly fakeLogInfoDetail: LogInfoDetail = {
    matchId: Helper.fakeMatchId,
    liveScores: '0 - 0',
    voidFromTime: new Date('2020-11-06 00:00:00.000'),
    voidToTime: new Date('2020-11-06 00:00:00.000'),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    scoreOfMatch: '',
    scoreNormalTicket: '',
    instantlySettleCount: 2,
    cancelCashOutCount: 1
  } as LogInfoDetail;
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    scoreId: Helper.fakeScoreId,
    matchId: Helper.fakeMatchId,
    validation: new Validation(),
    ticketRequest: [ { transIds: '123456789', requestId: 11111 } as TicketRequest],
    logInfoDetail: Helper.fakeLogInfoDetail
  };
  static readonly fakeRequestModel: RequestModel = {
    filter: new FilterModel(),
    eventDetail: new EventDetailModel(),
    abnormalAccountModel: null,
    abnormalBetModel: null,
    eventTicket14Model: null,
    redCardModel: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    others: new OthersModel(),
    duplicateTicketsModel: null,
    notParticipateModels: [],
    earlyKickOffModels: [],
    recoverTicketModel: null
  };
  static readonly fakeMapEventArg: MapEventArg = {
    primitiveProperty: Helper.fakePrimitiveProperty,
    requestModel: Helper.fakeRequestModel,
    detailViewModel: Helper.fakeRequestDetailViewModel,
  };
}

describe('ObjectService', () => {
  let validationService: ValidationService;
  let objectService: ObjectService;

  beforeEach(() => {
    validationService = new ValidationService();
    objectService = new ObjectService(validationService);
  });

  it('#mapRequestModel should call expected methods', async () => {
    objectService['createMapEventArg'] = jest.fn();
    objectService['mapFilter'] = jest.fn();
    objectService['mapEvent'] = jest.fn();
    objectService['mapOthers'] = jest.fn();

    objectService.mapRequestModel(null, null, null);

    expect(objectService['createMapEventArg']).toHaveBeenCalledTimes(1);
    expect(objectService['mapFilter']).toHaveBeenCalledTimes(1);
    expect(objectService['mapEvent']).toHaveBeenCalledTimes(1);
    expect(objectService['mapOthers']).toHaveBeenCalledTimes(1);
  });

  it('#getPrimitiveProperty should return correct model', async () => {
    const results = objectService.getPrimitiveProperty(Helper.fakeRequestDetailViewModel, Helper.fakeRequestId);

    expect(results.sportType).toEqual(Helper.fakeRequestDetailViewModel.request.sportType);
    expect(results.requestId).toEqual(Helper.fakeRequestId);
    expect(results.actionIdOfFirstTimeAccess).toEqual(Helper.fakeRequestDetailViewModel.request.actionId.toString());
  });

  it('#mapFilter should update correct model', async () => {
    const requestModel = _.clone(Helper.fakeRequestModel);
    const eventDate = [null, new Date()];

    eventDate.forEach(item => {
      const fakeRequestDetailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
      fakeRequestDetailViewModel.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);
      fakeRequestDetailViewModel.event = new RequestEventModel();
      fakeRequestDetailViewModel.event.subIssueTypeId = 11;
      fakeRequestDetailViewModel.event.eventDate = item;

      objectService['mapFilter'](requestModel, fakeRequestDetailViewModel);

      expect(requestModel.filter.sportType).toEqual(Helper.fakeRequestDetailViewModel.request.sportType);
      expect(requestModel.filter.action).toEqual(Helper.fakeRequestDetailViewModel.request.actionId.toString());
      expect(requestModel.filter.isTest).toEqual(Helper.fakeRequestDetailViewModel.request.isTest);
      expect(requestModel.filter.isVoided).toEqual(Helper.fakeRequestDetailViewModel.request.isVoided);
    });
  });

  it('#mapEvent should update correct model when isWrongScore', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_SCORE);
    args.detailViewModel.wrongScoreModels = [new WrongScoreModel()];
    objectService['mapEvent'](args);

    expect(args.requestModel.wrongScoreModels).toStrictEqual(args.detailViewModel.wrongScoreModels);
    expect(args.primitiveProperty.matchId).toBe(args.detailViewModel.wrongScoreModels[0].matchId);
  });

  it('#mapEvent should update correct model when isDangerAccepted', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    const dangerAcceptedModel = new RedCardModel();
    dangerAcceptedModel.isMainMatch = true;
    dangerAcceptedModel.matchId = Helper.fakeMatchId;
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
    args.detailViewModel.dangerAcceptedModels = [dangerAcceptedModel];
    objectService['mapEvent'](args);

    expect(args.requestModel.dangerAcceptedModels).toStrictEqual(args.detailViewModel.dangerAcceptedModels);
    expect(args.primitiveProperty.matchId).toBe(Helper.fakeMatchId);
  });

  it('#mapEvent should update correct model when isRedCard', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    const redCardModel = new RedCardModel();
    redCardModel.isMainMatch = true;
    redCardModel.matchId = Helper.fakeMatchId;
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.RED_CARD);
    args.detailViewModel.redCardModels = [redCardModel];
    objectService['mapEvent'](args);

    expect(args.requestModel.redCardModel).toStrictEqual(args.detailViewModel.redCardModels);
    expect(args.primitiveProperty.matchId).toBe(Helper.fakeMatchId);
  });

  it('#mapEvent should update correct model when isLikelyAbnormalBet', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    const abnormalBetModel = new AbnormalBetModel();
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);
    objectService['createEventForAbnormalBet'] = jest.fn().mockImplementation(() => abnormalBetModel);

    objectService['mapEvent'](args);

    expect(args.requestModel.abnormalBetModel).toStrictEqual(abnormalBetModel);
    expect(args.primitiveProperty.matchId).toBe(Helper.fakeMatchId);
  });

  it('#mapEvent should update correct model when isArchivedTicket', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    args.detailViewModel.event = new RequestEventModel();
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.ARCHIVED_TICKET);

    objectService['mapEvent'](args);

    expect(args.requestModel.eventTicket14Model.transIds).toBe(args.detailViewModel.event.transIds);
  });

  it('#mapEvent should update correct model when isLikelyAbnormalBet', async () => {
    const dates = [new Date('2021-09-29 00:00:00.000'), new Date('1752-09-29 00:00:00.000'), null];
    dates.forEach(item => {
      const args = _.clone(Helper.fakeMapEventArg);
      const event = new RequestEventModel();
      event.matchId = Helper.fakeMatchId;
      event.kickOffTime = item;
      args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);
      args.detailViewModel.event = event;
      objectService['mapEventDetailModel'] = jest.fn();

      objectService['mapEvent'](args);

      expect(args.primitiveProperty.matchId).toBe(Helper.fakeMatchId);
    });
  });

  it('#mapEvent should update correct model when isWrongHdp', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    const wrongHdpModel = new WrongHdpModel();
    wrongHdpModel.isMainMatch = true;
    wrongHdpModel.matchId = Helper.fakeMatchId;
    args.detailViewModel.wrongHdpModels = [wrongHdpModel];
    [
      IssueTypeConstant.WRONG_HDP,
      IssueTypeConstant.WRONG_1ST_HDP
    ].forEach(x => {
      args.detailViewModel.request.issueTypeId = Number(x);
      objectService['mapEvent'](args);

      expect(args.requestModel.wrongHdpModels).toStrictEqual(args.detailViewModel.wrongHdpModels);
      expect(args.primitiveProperty.matchId).toBe(Helper.fakeMatchId);
    });
  });

  it('#mapEvent should update correct model when isWrongOu', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    const wrongOuModel = new WrongOuModel();
    wrongOuModel.isMainMatch = true;
    wrongOuModel.matchId = Helper.fakeMatchId;
    args.detailViewModel.wrongOuModels = [wrongOuModel];
    [
      IssueTypeConstant.WRONG_OU,
      IssueTypeConstant.WRONG_1ST_OU
    ].forEach(x => {
      args.detailViewModel.request.issueTypeId = Number(x);
      objectService['mapEvent'](args);

      expect(args.requestModel.wrongOuModels).toStrictEqual(args.detailViewModel.wrongOuModels);
      expect(args.primitiveProperty.matchId).toBe(Helper.fakeMatchId);
    });
  });

  it('#mapEvent should update correct model when isAbnormalAccount', async () => {
    const abnormalAccountModel = new AbnormalAccountModel();
    const args = _.clone(Helper.fakeMapEventArg);
    args.detailViewModel.event = new RequestEventModel();
    args.detailViewModel.abnormalAccountModel = abnormalAccountModel;
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_ACCOUNT);

    objectService['mapEvent'](args);

    expect(args.requestModel.abnormalAccountModel).toBe(abnormalAccountModel);
  });

  it('#mapEvent should update correct model when isWrongOdds', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    args.detailViewModel.event = new RequestEventModel();
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_ODDS);
    args.detailViewModel.wrongOddsModels = [new WrongOddsModel()];

    objectService['mapEvent'](args);

    expect(args.requestModel.wrongOddsModels).toBe(args.detailViewModel.wrongOddsModels);
  });

  it('#mapEvent should update correct model when isReducedOver', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    args.detailViewModel.event = new RequestEventModel();
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.REDUCED_OVER);
    args.detailViewModel.reducedOverModels = [new ReducedOverModel()];

    objectService['mapEvent'](args);

    expect(args.requestModel.reducedOverModels).toBe(args.detailViewModel.reducedOverModels);
  });

  it('#mapEvent should update correct model when isNotParticipate', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    args.detailViewModel.event = new RequestEventModel();
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    args.detailViewModel.notParticipateModels = [new NotParticipateModel()];

    objectService['mapEvent'](args);

    expect(args.requestModel.notParticipateModels).toBe(args.detailViewModel.notParticipateModels);
  });

  it('#mapEvent should update correct model when isDuplicateTickets', async () => {
    const args = _.clone(Helper.fakeMapEventArg);
    args.detailViewModel.event = new RequestEventModel();
    args.detailViewModel.request.issueTypeId = Number(IssueTypeConstant.DUPLICATE_TICKETS);
    args.detailViewModel.duplicateTicketsModel = new DuplicateTicketsModel();

    objectService['mapEvent'](args);

    expect(args.requestModel.duplicateTicketsModel).toBe(args.detailViewModel.duplicateTicketsModel);
  });

  it('#mapOthers should update correct model', async () => {
    const requestModel = _.clone(Helper.fakeRequestModel);

    objectService['mapOthers'](requestModel, Helper.fakeRequestDetailViewModel);

    expect(requestModel.others.mistakenBy).toBe(Helper.fakeRequestDetailViewModel.request.mistakenBy);
    expect(requestModel.others.decidedBy).toBe(Helper.fakeRequestDetailViewModel.request.decidedBy);
    expect(requestModel.others.operatorsList).toBe(Helper.fakeRequestDetailViewModel.request.operators);
    expect(requestModel.others.provider).toBe(Helper.fakeRequestDetailViewModel.request.provider);
    expect(requestModel.others.source).toBe(Helper.fakeRequestDetailViewModel.request.source);
    expect(requestModel.others.remark).toBe(Helper.fakeRequestDetailViewModel.request.remark);
  });

  it('#createMapEventArg should return correct model', async () => {
    const results = objectService['createMapEventArg'](Helper.fakeRequestModel, Helper.fakeRequestDetailViewModel, Helper.fakePrimitiveProperty);

    expect(results.primitiveProperty).toStrictEqual(Helper.fakePrimitiveProperty);
    expect(results.requestModel).toStrictEqual(Helper.fakeRequestModel);
    expect(results.detailViewModel).toStrictEqual(Helper.fakeRequestDetailViewModel);
  });

  it('#createEventForAbnormalBet should return correct model', async () => {
    const results = objectService['createEventForAbnormalBet'](Helper.fakeRequestDetailViewModel);

    expect(results.matchId).toBe(Helper.fakeRequestDetailViewModel.event.matchId);
    expect(results.transIds).toBe(Helper.fakeRequestDetailViewModel.event.transIds);
  });
});
