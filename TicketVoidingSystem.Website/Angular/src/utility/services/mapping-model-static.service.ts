import * as _ from "lodash";
import { WrongHdpGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-hdp/models/get-log-info.query";
import { WrongOuGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-ou/models/get-log-info.query";
import { WrongScoreGetLogInfoQuery } from "../../add-request/app/add-request/event-wrong-score/event-wrong-score.model";
import { RedCardGetLogInfoQuery, RedCardModel } from "../../add-request/app/add-request/models/event-red-card.model";
import { WrongHdpModel } from "../../add-request/app/add-request/models/event-wrong-hdp.model";
import { WrongOuModel } from "../../add-request/app/add-request/models/event-wrong-ou.model";
import { WrongScoreModel } from "../../add-request/app/add-request/models/event-wrong-score.model";

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
      wrongMarket: x.wrongMarket
    } as WrongOuGetLogInfoQuery));
  }
}
