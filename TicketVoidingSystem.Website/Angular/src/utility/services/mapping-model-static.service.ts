import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { EarlyKickOffGetLogInfoQuery } from "../../add-request/app/add-request/event-early-kick-off/models/get-log-info.query";
import { NotParticipateGetLogInfoQuery } from "../../add-request/app/add-request/event-not-participate/models/get-log-info.query";
import { OtherIssuesGetLogInfoQuery } from "../../add-request/app/add-request/event-other-issues/models/get-log-info.query";
import { ReducedOverGetLogInfoQuery } from "../../add-request/app/add-request/event-reduced-over/models/get-log-info.query";
import { TechnicalErrorGetLogInfoQuery } from "../../add-request/app/add-request/event-technical-error/models/get-log-info.query";
import { WrongHdpGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-hdp/models/get-log-info.query";
import { WrongMarketOfferedGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-market-offered/models/get-log-info.query";
import { WrongOddsSportsBookGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-odds-sports-book/models/get-log-info.query";
import { WrongOddsGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-odds/models/get-log-info.query";
import { WrongOfferedNameGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-offered-name/models/get-log-info.query";
import { WrongOuGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-ou/models/get-log-info.query";
import { WrongScoreGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-score/event-wrong-score.model";
import { EarlyKickOffModel } from "../../add-request/app/add-request/models/event-eko.model";
import { NotParticipateModel } from "../../add-request/app/add-request/models/event-not-participate.model";
import { OtherIssuesModel } from "../../add-request/app/add-request/models/event-other-issues.model";
import { RedCardGetLogInfoQuery, RedCardModel } from "../../add-request/app/add-request/models/event-red-card.model";
import { ReducedOverModel } from "../../add-request/app/add-request/models/event-reduced-over.model";
import { TechnicalErrorModel } from "../../add-request/app/add-request/models/event-technical-error.model";
import { WrongHdpModel } from "../../add-request/app/add-request/models/event-wrong-hdp.model";
import { WrongMarketOfferedModel } from "../../add-request/app/add-request/models/event-wrong-market-offered.model";
import { WrongOddsSportsBookModel } from "../../add-request/app/add-request/models/event-wrong-odds-sports-book.model";
import { WrongOddsModel } from "../../add-request/app/add-request/models/event-wrong-odds.model";
import { WrongOfferedNameModel } from "../../add-request/app/add-request/models/event-wrong-offered-name.model";
import { WrongOuModel } from "../../add-request/app/add-request/models/event-wrong-ou.model";
import { WrongScoreModel } from "../../add-request/app/add-request/models/event-wrong-score.model";
import { SubIssueTypeConstant } from "../constants/sub-issue-type.constant";
import { StaticService } from "./static.service";

export class MappingModelStaticService {
  static buildRedCardGetLogInfoModel(redCardModels: RedCardModel[]): RedCardGetLogInfoQuery[] {
    if (isNull(redCardModels) || isUndefined(redCardModels)) {
      return null;
    }

    return redCardModels.map(x => ({
      matchId: x.matchId,
      filterBy: x.filterBy,
      filterFromTransTime: x.voidFromTime,
      filterToTransTime: x.voidToTime,
      subIssueTypeId: x.subIssueTypeId
    } as RedCardGetLogInfoQuery));
  }

  static buildWrongScoreGetLogInfoModel(wrongScoreModels: WrongScoreModel[]): WrongScoreGetLogInfoQuery[] {
    if (isNull(wrongScoreModels) || isUndefined(wrongScoreModels)) {
      return null;
    }

    return wrongScoreModels.map(x => ({
      scoreId: x.scoreId,
      matchId: x.matchId,
      wrongScore: x.wrongScore,
      filterBy: x.filterBy,
      filterFromTransTime: x.voidFromTime,
      filterToTransTime: x.voidToTime,
      subIssueTypeId: x.subIssueTypeId
    } as WrongScoreGetLogInfoQuery));
  }

  static buildWrongHdpGetLogInfoModel(wrongHdpModels: WrongHdpModel[]): WrongHdpGetLogInfoQuery[] {
    if (isNull(wrongHdpModels) || isUndefined(wrongHdpModels)) {
      return null;
    }

    return wrongHdpModels.map(x => ({
      matchId: x.matchId,
      subIssueTypeId: x.subIssueTypeId,
      filterFromTransTime: x.voidFromTime,
      filterToTransTime: x.voidToTime,
      homeFavorite: x.homeFavorite,
      awayFavorite: x.awayFavorite,
      hdpValue: x.hdpValue,
      poolHouseCheckedBetTypes: x.poolHouseCheckedBetTypes,
      isLinkGroup1X2: x.isLinkGroup1X2,
      isLinkGroupAIO: x.isLinkGroupAIO,
      isMainMatch: x.isMainMatch,
      liveIndicator: x.liveIndicator,
      filterBetIdX: x.filterBetIdX,
      filterBetIdY: x.filterBetIdY,
      filterBetTypeId: x.filterBetTypeId
    } as WrongHdpGetLogInfoQuery));
  }

  static buildWrongOuGetLogInfoModel(wrongOuModels: WrongOuModel[]): WrongOuGetLogInfoQuery[] {
    if (isNull(wrongOuModels) || isUndefined(wrongOuModels)) {
      return null;
    }

    return wrongOuModels.map(x => ({
      matchId: x.matchId,
      subIssueTypeId: x.subIssueTypeId,
      filterFromTransTime: x.voidFromTime,
      filterToTransTime: x.voidToTime,
      wrongMarket: x.wrongMarket,
      poolHouseCheckedBetTypes: x.poolHouseCheckedBetTypes,
      isLinkGroup1X2: x.isLinkGroup1X2,
      isLinkGroupAIO: x.isLinkGroupAIO,
      isMainMatch: x.isMainMatch,
      liveIndicator: x.liveIndicator,
      filterBetIdX: x.filterBetIdX,
      filterBetIdY: x.filterBetIdY,
      filterBetTypeId: x.filterBetTypeId
    } as WrongOuGetLogInfoQuery));
  }

  static buildWrongOddsGetLogInfoModel(wrongOuModels: WrongOddsModel[]): WrongOddsGetLogInfoQuery[] {
    if (isNull(wrongOuModels) || isUndefined(wrongOuModels)) {
      return null;
    }

    return wrongOuModels.map(x => ({
      matchId: x.matchId,
      subIssueTypeId: x.subIssueTypeId,
      filterFromTransTime: x.voidFromTime,
      filterToTransTime: x.voidToTime,
      poolHouseCheckedBetTypes: x.poolHouseCheckedBetTypes,
      isLinkGroup1X2: x.isLinkGroup1X2,
      isLinkGroupAIO: x.isLinkGroupAIO,
      liveIndicator: x.liveIndicator,
      spread: x.spread.toString(),
      allowanceRate: x.allowanceRate,
      correctOddsHomeOver: x.correctOddsHomeOver,
      correctOddsAwayUnder: x.correctOddsAwayUnder,
      fromOddsNotVoidHomeOver: x.fromOddsNotVoidHomeOver,
      toOddsNotVoidHomeOver: x.toOddsNotVoidHomeOver,
      fromOddsNotVoidAwayUnder: x.fromOddsNotVoidAwayUnder,
      toOddsNotVoidAwayUnder: x.toOddsNotVoidAwayUnder,
      filterFavoriteType: x.filterFavoriteType,
      wrongOU: x.wrongOU,
      favoriteValue: x.favoriteValue
    } as WrongOddsGetLogInfoQuery));
  }

  static buildReducedOverGetLogInfoModel(reducedOverModels: ReducedOverModel[]): ReducedOverGetLogInfoQuery[] {
    if (isNull(reducedOverModels) || isUndefined(reducedOverModels)) {
      return null;
    }

    return reducedOverModels.map(x => ({
      matchId: x.matchId,
      subIssueTypeId: x.subIssueTypeId,
      betTypeIds: x.betTypeIds,
      wicketOver: x.wicketOver,
      filterWicketOver: StaticService.convertStringToBetId8xxx(x.wicketOver),
      playerIds: x.playerIds,
      runs: x.runs,
      live: x.live,
      nonLive: x.nonLive
    } as ReducedOverGetLogInfoQuery));
  }

  static buildNotParticipateGetLogInfoModel(notParticipateModels: NotParticipateModel[]): NotParticipateGetLogInfoQuery[] {
    if (isNull(notParticipateModels) || isUndefined(notParticipateModels)) {
      return null;
    }

    return notParticipateModels.map(x => ({
      matchId: x.matchId,
      subIssueTypeId: x.subIssueTypeId,
      betTypeIds: x.betTypeIds,
      playerId: x.playerId,
    } as NotParticipateGetLogInfoQuery));
  }

  static buidEarlyKickOffGetLogInfoModel(earlyKickOffModels: EarlyKickOffModel[]): EarlyKickOffGetLogInfoQuery[] {
    if (isNull(earlyKickOffModels) || isUndefined(earlyKickOffModels)) {
      return null;
    }

    return earlyKickOffModels.map(x => ({
      matchId: x.matchId,
      subIssueTypeId: x.subIssueTypeId,
      isMainMatch: x.isMainMatch,
      kickOffTime: x.kickOffTime
    } as EarlyKickOffGetLogInfoQuery));
  }

  static buildWrongMarketOfferedGetLogInfoModels(models: WrongMarketOfferedModel[]): WrongMarketOfferedGetLogInfoQuery[] {
    if (isNull(models) || isUndefined(models)) {
      return null;
    }

    return models.map(x => ({
      id: x.id,
      matchId: x.matchId,
      subIssueTypeId: x.subIssueTypeId,
      filterFromTransTime: x.voidFromTime,
      filterToTransTime: x.voidToTime,
      betTeamsResult: x.betTeamsResult
    } as WrongMarketOfferedGetLogInfoQuery));
  }

  static buildWrongOfferedNameGetLogInfoModel(model: WrongOfferedNameModel): WrongOfferedNameGetLogInfoQuery {
    if (isNull(model) || isUndefined(model)) {
      return null;
    }

    return {
      matchId: model.matchId,
      subIssueTypeId: model.subIssueTypeId,
      currencyIds: model.currencyIds,
      licenseeNames: model.licenseeNames
    } as WrongOfferedNameGetLogInfoQuery;
  }

  static buildWrongOddsSportsBookGetLogInfoModel(model: WrongOddsSportsBookModel): WrongOddsSportsBookGetLogInfoQuery {
    if (isNull(model) || isUndefined(model)) {
      return null;
    }

    return {
      matchId: model.matchId,
      subIssueTypeId: model.subIssueTypeId,
      filterFromTransTime: model.voidFromTime,
      filterToTransTime: model.voidToTime,
      betTeamsResult: model.betTeamsResult,
      filterOddsType: model.filterOddsType,
      correctOdds: model.correctOdds,
      oddsValue: model.oddsValue,
      fromOdds: model.fromOdds,
      toOdds: model.toOdds,
      liveIndicator: model.liveIndicator
    } as WrongOddsSportsBookGetLogInfoQuery;
  }

  static buildOtherIssuesGetLogInfoModel(model: OtherIssuesModel): OtherIssuesGetLogInfoQuery {
    if (isNull(model) || isUndefined(model)) {
      return null;
    }

    const query = new OtherIssuesGetLogInfoQuery();
    query.matchId = model.matchId;
    query.subIssueTypeId = model.subIssueTypeId;
    query.betTeamsResult = model.betTeamsResult;
    if (model.subIssueTypeId === SubIssueTypeConstant.RESTART) {
      query.filterFromTransTime = model.voidFromTime;
      query.filterToTransTime = model.voidToTime;
    }

    return query;
  }

  static buildTechnicalErrorGetLogInfoModel(model: TechnicalErrorModel): TechnicalErrorGetLogInfoQuery {
    if (isNull(model) || isUndefined(model)) {
      return null;
    }

    return {
      matchId: model.matchId,
      subIssueTypeId: model.subIssueTypeId,
      filterFromTransTime: model.voidFromTime,
      filterToTransTime: model.voidToTime,
      betTeamsResult: model.betTeamsResult
    } as TechnicalErrorGetLogInfoQuery;
  }
}
