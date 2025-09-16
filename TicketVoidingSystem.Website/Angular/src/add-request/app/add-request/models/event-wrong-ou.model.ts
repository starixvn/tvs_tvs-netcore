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
  filterBetIdX: string;
  filterBetIdY: string;
  filterBetTypeId: string;
  poolHouseCheckedBetTypes : string;
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  liveIndicator: number;
  sportType: number;
}