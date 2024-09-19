import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";

export class WrongOuModel {
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
  actualMarket: string;
  wrongMarket: string;
  logInfoDetail: LogInfoDetail;
  
  poolHouseCheckedBetTypes : string;
  isPoolHouseAffected: boolean;
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  liveIndicator: number;
  sportType: number;
}