import * as _ from 'lodash';
import { NotParticipateModel } from '../../../add-request/app/add-request/models/event-not-participate.model';
import { RedCardModel } from '../../../add-request/app/add-request/models/event-red-card.model';
import { ReducedOverModel } from '../../../add-request/app/add-request/models/event-reduced-over.model';
import { WrongHdpModel } from '../../../add-request/app/add-request/models/event-wrong-hdp.model';
import { WrongOddsModel } from '../../../add-request/app/add-request/models/event-wrong-odds.model';
import { WrongOuModel } from '../../../add-request/app/add-request/models/event-wrong-ou.model';
import { WrongScoreModel } from '../../../add-request/app/add-request/models/event-wrong-score.model';
import { GetLogInfoModel, GetLogInfoViewModel, Validation } from '../../../add-request/app/add-request/models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../../add-request/app/add-request/models/trans-info-add-request.model';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../utility/services/common.service';
import { LogInfoArg } from '../models/log-info.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { RequestDetailModel, RequestDetailViewModel } from '../request.model';
import { LogInfoService } from './log-info.service';
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
    userId: 0,
    requestedBy: ''
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
    messages: [],
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
  };
  static fakeGetLogInfoModel: GetLogInfoModel = {
    scoreId: Helper.fakeScoreId,
    matchId: Helper.fakeMatchId,
    validation: new Validation(),
    ticketRequest: [ { transIds: '123456789', requestId: 11111 }],
    logInfoDetail: Helper.fakeLogInfoDetail
  };
  static fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    getLogInfoModels: [Helper.fakeGetLogInfoModel],
    transInfoAddRequestModel: new TransInfoAddRequestModel()
  };
}

describe('LogInfoService', () => {
  let validationService: ValidationService;
  let commonService: CommonService;
  let logInfoService: LogInfoService;

  beforeEach(() => {
    validationService = new ValidationService();
    commonService = new CommonService(null);
    logInfoService = new LogInfoService(commonService, validationService);
  });

  it('#getLogInfo should call expected function when isRedCard', async () => {
    // Arrange
    const spyIsRedCard = jest.spyOn(validationService, 'isRedCard').mockImplementation(() => true);
    logInfoService['createLogInfoArg'] = jest.fn();
    logInfoService['getLogInfoRedCard'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(null, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(logInfoService['createLogInfoArg']).toHaveBeenCalledTimes(1);
    expect(logInfoService['getLogInfoRedCard']).toHaveBeenCalledTimes(1);
    expect(spyIsRedCard).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isWrongHdp', async () => {
    // Arrange
    const spyIsWrongHdp = jest.spyOn(validationService, 'isWrongHdp').mockImplementation(() => true);
    logInfoService['getLogInfoWrongHdp'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(null, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(logInfoService['getLogInfoWrongHdp']).toHaveBeenCalledTimes(1);
    expect(spyIsWrongHdp).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isWrong1stHdp', async () => {
    // Arrange
    const spyIsWrong1stHdp = jest.spyOn(validationService, 'isWrong1stHdp').mockImplementation(() => true);
    logInfoService['getLogInfoWrongHdp'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(null, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(logInfoService['getLogInfoWrongHdp']).toHaveBeenCalledTimes(1);
    expect(spyIsWrong1stHdp).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isWrongOu', async () => {
    // Arrange
    const spyIsWrongOu = jest.spyOn(validationService, 'isWrongOu').mockImplementation(() => true);
    logInfoService['getLogInfoWrongOu'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(null, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(logInfoService['getLogInfoWrongOu']).toHaveBeenCalledTimes(1);
    expect(spyIsWrongOu).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isWrong1stOu', async () => {
    // Arrange
    const spyIsWrong1stOu = jest.spyOn(validationService, 'isWrong1stOu').mockImplementation(() => true);
    logInfoService['getLogInfoWrongOu'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(null, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(logInfoService['getLogInfoWrongOu']).toHaveBeenCalledTimes(1);
    expect(spyIsWrong1stOu).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isWrongScore', async () => {
    // Arrange
    const spyIsRedCard = jest.spyOn(validationService, 'isRedCard').mockImplementation(() => false);
    const spyIsWrongScore = jest.spyOn(validationService, 'isWrongScore').mockImplementation(() => true);

    logInfoService['createLogInfoArg'] = jest.fn();
    logInfoService['getLogInfoWrongScore'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(null, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(logInfoService['createLogInfoArg']).toHaveBeenCalledTimes(1);
    expect(logInfoService['getLogInfoWrongScore']).toHaveBeenCalledTimes(1);
    expect(spyIsRedCard).toHaveBeenCalledTimes(1);
    expect(spyIsWrongScore).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isDangerAccepted', async () => {
    // Arrange
    const spyIsRedCard = jest.spyOn(validationService, 'isRedCard').mockImplementation(() => false);
    const spyIsWrongScore = jest.spyOn(validationService, 'isWrongScore').mockImplementation(() => false);
    const spyIsDangerAccepted = jest.spyOn(validationService, 'isDangerAccepted').mockImplementation(() => true);

    logInfoService['createLogInfoArg'] = jest.fn();
    logInfoService['getLogInfoDangerAccepted'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(null, null);

    // Assert
    expect(logInfoService['createLogInfoArg']).toHaveBeenCalledTimes(1);
    expect(logInfoService['getLogInfoDangerAccepted']).toHaveBeenCalledTimes(1);
    expect(spyIsRedCard).toHaveBeenCalledTimes(1);
    expect(spyIsWrongScore).toHaveBeenCalledTimes(1);
    expect(spyIsDangerAccepted).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isWrongOdds', async () => {
    // Arrange
    logInfoService['createLogInfoArg'] = jest.fn();
    logInfoService['getLogInfoWrongOdds'] = jest.fn();
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_ODDS);

    // Action
    await logInfoService.getLogInfo(null, detailViewModel);

    // Assert
    expect(logInfoService['createLogInfoArg']).toHaveBeenCalledTimes(1);
    expect(logInfoService['getLogInfoWrongOdds']).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isReducedOver', async () => {
    // Arrange
    logInfoService['createLogInfoArg'] = jest.fn();
    logInfoService['getLogInfoReducedOver'] = jest.fn();
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.REDUCED_OVER);

    // Action
    await logInfoService.getLogInfo(null, detailViewModel);

    // Assert
    expect(logInfoService['createLogInfoArg']).toHaveBeenCalledTimes(1);
    expect(logInfoService['getLogInfoReducedOver']).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function when isNotParticipate', async () => {
    // Arrange
    logInfoService['createLogInfoArg'] = jest.fn();
    logInfoService['getLogInfoNotParticipate'] = jest.fn();
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);

    // Action
    await logInfoService.getLogInfo(null, detailViewModel);

    // Assert
    expect(logInfoService['createLogInfoArg']).toHaveBeenCalledTimes(1);
    expect(logInfoService['getLogInfoNotParticipate']).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call expected function', async () => {
    // Arrange
    const spyIsRedCard = jest.spyOn(validationService, 'isRedCard').mockImplementation(() => false);
    const spyIsWrongScore = jest.spyOn(validationService, 'isWrongScore').mockImplementation(() => false);
    const spyIsDangerAccepted = jest.spyOn(validationService, 'isDangerAccepted').mockImplementation(() => false);
    const spyIsWrongHdp = jest.spyOn(validationService, 'isWrongHdp').mockImplementation(() => false);
    const spyIsWrong1stHdp = jest.spyOn(validationService, 'isWrong1stHdp').mockImplementation(() => false);
    const spyIsWrongOu = jest.spyOn(validationService, 'isWrongOu').mockImplementation(() => false);
    const spyIsWrong1stOu = jest.spyOn(validationService, 'isWrong1stOu').mockImplementation(() => false);
    const spyIsWrongOdds = jest.spyOn(validationService, 'isWrongOdds').mockImplementation(() => false);
    const spyIsReducedOver = jest.spyOn(validationService, 'isReducedOver').mockImplementation(() => false);
    const spyIsNotParticipate = jest.spyOn(validationService, 'isNotParticipate').mockImplementation(() => false);

    logInfoService['createLogInfoArg'] = jest.fn();
    logInfoService['getLogInfoDangerAccepted'] = jest.fn();
    logInfoService['getLogInfoRedCard'] = jest.fn();
    logInfoService['getLogInfoWrongScore'] = jest.fn();
    logInfoService['isWrongHdp'] = jest.fn();
    logInfoService['isWrong1stHdp'] = jest.fn();
    logInfoService['isWrongOu'] = jest.fn();
    logInfoService['isWrong1stOu'] = jest.fn();
    logInfoService['isReducedOver'] = jest.fn();
    logInfoService['isNotParticipate'] = jest.fn();

    // Action
    await logInfoService.getLogInfo(null, null);

    // Assert
    expect(logInfoService['createLogInfoArg']).toHaveBeenCalledTimes(1);
    expect(logInfoService['getLogInfoDangerAccepted']).toHaveBeenCalledTimes(0);
    expect(logInfoService['getLogInfoRedCard']).toHaveBeenCalledTimes(0);
    expect(logInfoService['getLogInfoWrongScore']).toHaveBeenCalledTimes(0);
    expect(spyIsRedCard).toHaveBeenCalledTimes(1);
    expect(spyIsWrongScore).toHaveBeenCalledTimes(1);
    expect(spyIsDangerAccepted).toHaveBeenCalledTimes(1);
    expect(spyIsWrongHdp).toHaveBeenCalledTimes(1);
    expect(spyIsWrong1stHdp).toHaveBeenCalledTimes(1);
    expect(spyIsWrongOu).toHaveBeenCalledTimes(1);
    expect(spyIsWrong1stOu).toHaveBeenCalledTimes(1);
    expect(spyIsWrongOdds).toHaveBeenCalledTimes(1);
    expect(spyIsReducedOver).toHaveBeenCalledTimes(1);
    expect(spyIsNotParticipate).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfoRedCard should get correct info', async () => {
    // Arrange
    const spyCommonServiceGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const redCardModel = new RedCardModel();
    redCardModel.isMainMatch = true;
    redCardModel.matchId = Helper.fakeMatchId;
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.redCardModels = [redCardModel];
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.RED_CARD);
    const args = _.clone(Helper.fakeLogInfoArg);
    args.detailViewModel = detailViewModel;

    // Action
    await logInfoService['getLogInfoRedCard'](args);

    // Assert
    expect(args.detailViewModel.redCardModels[0].logInfoDetail).toStrictEqual(Helper.fakeGetLogInfoModel.logInfoDetail);
    expect(spyCommonServiceGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfoWrongScore should get correct info', async () => {
    // Arrange
    const spyCommonServiceGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const wrongScoreModel = new WrongScoreModel();
    wrongScoreModel.scoreId = Helper.fakeScoreId;
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.wrongScoreModels = [wrongScoreModel];
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_SCORE);
    const args = _.clone(Helper.fakeLogInfoArg);
    args.detailViewModel = detailViewModel;

    // Action
    await logInfoService['getLogInfoWrongScore'](args);

    // Assert
    expect(args.detailViewModel.wrongScoreModels[0].logInfoDetail).toStrictEqual(Helper.fakeGetLogInfoModel.logInfoDetail);
    expect(spyCommonServiceGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfoDangerAccepted should get correct info', async () => {
    // Arrange
    const spyCommonServiceGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const dangerAcceptedModel = new RedCardModel();
    dangerAcceptedModel.matchId = Helper.fakeMatchId;
    dangerAcceptedModel.isMainMatch = true;
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.dangerAcceptedModels = [dangerAcceptedModel];
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
    const args = _.clone(Helper.fakeLogInfoArg);
    args.detailViewModel = detailViewModel;

    // Action
    await logInfoService['getLogInfoDangerAccepted'](args);

    // Assert
    expect(args.detailViewModel.dangerAcceptedModels[0].logInfoDetail).toStrictEqual(Helper.fakeGetLogInfoModel.logInfoDetail);
    expect(spyCommonServiceGetLogInfo).toHaveBeenCalledTimes(1);
  });

  it('#createLogInfoArg should create correct model', async () => {
    // Action
    const result = logInfoService['createLogInfoArg'](Helper.fakePrimitiveProperty, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(result.detailViewModel).toStrictEqual(Helper.fakeRequestDetailViewModel);
    expect(result.primitiveProperty).toStrictEqual(Helper.fakePrimitiveProperty);
  });

  it('#getLogInfoWrongHdp should get correct info', async () => {
    // Arrange
    const spyCommonServiceGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const wrongHdpModel = new WrongHdpModel();
    wrongHdpModel.matchId = Helper.fakeMatchId;
    wrongHdpModel.isMainMatch = true;
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.wrongHdpModels = [wrongHdpModel];
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_HDP);
    const args = _.clone(Helper.fakeLogInfoArg);
    args.detailViewModel = detailViewModel;

    [true, false].forEach(async x => {
      const spyIsWrongHdp = jest.spyOn(validationService, 'isWrongHdp').mockImplementation(() => x);
      // Action
      await logInfoService['getLogInfoWrongHdp'](args);

      // Assert
      expect(args.detailViewModel.wrongHdpModels[0].logInfoDetail).toStrictEqual(Helper.fakeGetLogInfoModel.logInfoDetail);
      expect(spyCommonServiceGetLogInfo).toHaveBeenCalled();
      expect(spyIsWrongHdp).toHaveBeenCalled();
    });
  });

  it('#getLogInfoWrongOu should get correct info', async () => {
    // Arrange
    const spyCommonServiceGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const wrongOuModel = new WrongOuModel();
    wrongOuModel.matchId = Helper.fakeMatchId;
    wrongOuModel.isMainMatch = true;
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.wrongOuModels = [wrongOuModel];
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_OU);
    const args = _.clone(Helper.fakeLogInfoArg);
    args.detailViewModel = detailViewModel;
    [true, false].forEach(async x => {
      const spyIsWrongOu = jest.spyOn(validationService, 'isWrongOu').mockImplementation(() => x);

      // Action
      await logInfoService['getLogInfoWrongOu'](args);

      // Assert
      expect(args.detailViewModel.wrongOuModels[0].logInfoDetail).toStrictEqual(Helper.fakeGetLogInfoModel.logInfoDetail);
      expect(spyCommonServiceGetLogInfo).toHaveBeenCalled();
      expect(spyIsWrongOu).toHaveBeenCalled();
    });
  });

  it('#getLogInfoWrongOdds should get correct info', async () => {
    // Arrange
    const spyCommonServiceGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const wrongOddsModel = new WrongOddsModel();
    wrongOddsModel.matchId = Helper.fakeMatchId;
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.wrongOddsModels = [wrongOddsModel];
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.WRONG_ODDS);
    const args = _.clone(Helper.fakeLogInfoArg);
    args.detailViewModel = detailViewModel;

    // Action
    await logInfoService['getLogInfoWrongOdds'](args);

    // Assert
    expect(args.detailViewModel.wrongOddsModels[0].logInfoDetail).toStrictEqual(Helper.fakeGetLogInfoModel.logInfoDetail);
    expect(spyCommonServiceGetLogInfo).toHaveBeenCalled();
  });

  it('#getLogInfoReducedOver should get correct info', async () => {
    // Arrange
    const spyCommonServiceGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const reducedOverModel = new ReducedOverModel();
    reducedOverModel.matchId = Helper.fakeMatchId;
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.reducedOverModels = [reducedOverModel];
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.REDUCED_OVER);
    const args = _.clone(Helper.fakeLogInfoArg);
    args.detailViewModel = detailViewModel;

    // Action
    await logInfoService['getLogInfoReducedOver'](args);

    // Assert
    expect(args.detailViewModel.reducedOverModels[0].logInfoDetail).toStrictEqual(Helper.fakeGetLogInfoModel.logInfoDetail);
    expect(spyCommonServiceGetLogInfo).toHaveBeenCalled();
  });

  it('#getLogInfoNotParticipate should get correct info', async () => {
    // Arrange
    const spyCommonServiceGetLogInfo = jest.spyOn(commonService, 'getLogInfo').mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));
    const notParticipateModel = new NotParticipateModel();
    notParticipateModel.matchId = Helper.fakeMatchId;
    const detailViewModel = _.clone(Helper.fakeRequestDetailViewModel);
    detailViewModel.notParticipateModels = [notParticipateModel];
    detailViewModel.request.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    const args = _.clone(Helper.fakeLogInfoArg);
    args.detailViewModel = detailViewModel;

    // Action
    await logInfoService['getLogInfoNotParticipate'](args);

    // Assert
    expect(args.detailViewModel.notParticipateModels[0].logInfoDetail).toStrictEqual(Helper.fakeGetLogInfoModel.logInfoDetail);
    expect(spyCommonServiceGetLogInfo).toHaveBeenCalled();
  });
});
