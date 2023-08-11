import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";

export class WrongHdpModel {
  matchId: number;
  matchCode?: string;
  leagueName?: string;
  name?: string;
  subIssueTypeId: number;
  isMainMatch: boolean;
  eventDate?: Date;
  filterFromTransTime: string;
  filterToTransTime: string;
  voidFromTime?: string;
  voidToTime?: string;
  homeFavorite: string;
  awayFavorite: string;
  actualMarket: string;
  hdpValue: string;
  poolHouseCheckedBetTypes : string;
  isPoolHouseAffected: boolean;
  logInfoDetail: LogInfoDetail;
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  liveIndicator: number;
}