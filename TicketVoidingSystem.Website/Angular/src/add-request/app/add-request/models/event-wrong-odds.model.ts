import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";
import { OddsInfo } from '../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';

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
  wrongOU: string;
  favoriteValue: string;
  logInfoDetail: LogInfoDetail;
  poolHouseCheckedBetTypes : string;
  isPoolHouseAffected: boolean;
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  liveIndicator: number;
  oddsInfo: OddsInfo;
}