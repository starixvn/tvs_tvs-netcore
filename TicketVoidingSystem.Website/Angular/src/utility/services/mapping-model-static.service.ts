import * as _ from "lodash";
import { NotParticipateGetLogInfoQuery } from "src/add-request/app/add-request/event-not-participate/models/get-log-info.query";
import { NotParticipateModel } from "src/add-request/app/add-request/models/event-not-participate.model";
import { ReducedOverGetLogInfoQuery } from "../../add-request/app/add-request/event-reduced-over/models/get-log-info.query";
import { WrongHdpGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-hdp/models/get-log-info.query";
import { WrongOddsGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-odds/models/get-log-info.query";
import { WrongOuGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-ou/models/get-log-info.query";
import { WrongScoreGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-score/event-wrong-score.model";
import { RedCardGetLogInfoQuery, RedCardModel } from "../../add-request/app/add-request/models/event-red-card.model";
import { ReducedOverModel } from "../../add-request/app/add-request/models/event-reduced-over.model";
import { WrongHdpModel } from "../../add-request/app/add-request/models/event-wrong-hdp.model";
import { WrongOddsModel } from "../../add-request/app/add-request/models/event-wrong-odds.model";
import { WrongOuModel } from "../../add-request/app/add-request/models/event-wrong-ou.model";
import { WrongScoreModel } from "../../add-request/app/add-request/models/event-wrong-score.model";
import { StaticService } from "./static.service";

export class MappingModelStaticService {
  static buidRedCardGetLogInfoModel(redCardModels: RedCardModel[]): RedCardGetLogInfoQuery[] {
    if (_.isNull(redCardModels) || _.isUndefined(redCardModels)) {
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

  static buidWrongScoreGetLogInfoModel(wrongScoreModels: WrongScoreModel[]): WrongScoreGetLogInfoQuery[] {
    if (_.isNull(wrongScoreModels) || _.isUndefined(wrongScoreModels)) {
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

  static buidWrongHdpGetLogInfoModel(wrongHdpModels: WrongHdpModel[]): WrongHdpGetLogInfoQuery[] {
    if (_.isNull(wrongHdpModels) || _.isUndefined(wrongHdpModels)) {
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
      liveIndicator: x.liveIndicator
    } as WrongHdpGetLogInfoQuery));
  }

  static buidWrongOuGetLogInfoModel(wrongOuModels: WrongOuModel[]): WrongOuGetLogInfoQuery[] {
    if (_.isNull(wrongOuModels) || _.isUndefined(wrongOuModels)) {
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
      liveIndicator: x.liveIndicator
    } as WrongOuGetLogInfoQuery));
  }

  static buidWrongOddsGetLogInfoModel(wrongOuModels: WrongOddsModel[]): WrongOddsGetLogInfoQuery[] {
    if (_.isNull(wrongOuModels) || _.isUndefined(wrongOuModels)) {
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
      filterOddsType: x.filterOddsType,
      filterFavoriteType: x.filterFavoriteType,
      filterOuType: x.filterOuType,
      oddsValue: x.oddsValue,
      fromOdds: x.fromOdds,
      toOdds: x.toOdds,
      correctOdds: x.correctOdds,
      betTeam: x.betTeam,
      ouValue: x.ouValue,
      favoriteValue: x.favoriteValue
    } as WrongOddsGetLogInfoQuery));
  }

  static buidReducedOverGetLogInfoModel(reducedOverModels: ReducedOverModel[]): ReducedOverGetLogInfoQuery[] {
    if (_.isNull(reducedOverModels) || _.isUndefined(reducedOverModels)) {
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

  static buidNotParticipateGetLogInfoModel(notParticipateModels: NotParticipateModel[]): NotParticipateGetLogInfoQuery[] {
    if (_.isNull(notParticipateModels) || _.isUndefined(notParticipateModels)) {
      return null;
    }

    return notParticipateModels.map(x => ({
      matchId: x.matchId,
      subIssueTypeId: x.subIssueTypeId,
      betTypeId: x.betTypeId,
      playerIds: x.playerIds,
    } as NotParticipateGetLogInfoQuery));
  }
}
