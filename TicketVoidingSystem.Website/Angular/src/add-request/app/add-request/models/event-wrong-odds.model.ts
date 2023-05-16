import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";

export class WrongOddsModel {
  matchId: number;
  subIssueTypeId: number;
  eventDate?: Date;
  filterFromTransTime: string;
  filterToTransTime: string;
  voidFromTime?: string;
  voidToTime?: string;
  filterOddsType: string;
  filterFavoriteType: string;
  filterOuType: string;
  oddsValue: string;
  fromOdds: string;
  toOdds: string;
  correctOdds: string;
  betTeam: string;
  ouValue: string;
  favoriteValue: string;
  logInfoDetail: LogInfoDetail;
  poolHouseCheckedBetTypes : string;
  isPoolHouseAffected: boolean;
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  liveIndicator: number;
}
