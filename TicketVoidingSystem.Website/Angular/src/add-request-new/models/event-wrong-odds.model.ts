import { OddsInfo } from '../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { LogInfoDetail } from "../../utility/models/log-info-detail.model";

export class WrongOddsModel {
  matchId: number;
  subIssueTypeId: number;
  eventDate?: Date;
  filterFromTransTime: string;
  filterToTransTime: string;
  logInfoDetail: LogInfoDetail;
  poolHouseCheckedBetTypes : string;
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  liveIndicator: number;
  oddsInfo: OddsInfo;
  filterFavoriteType?: string;
  wrongOU?: string;
  favoriteValue?: string;
  spread?: string;
  allowanceRate?: string;
  correctOddsHomeOver?: string;
  correctOddsAwayUnder?: string;
  fromOddsNotVoidHomeOver?: string;
  toOddsNotVoidHomeOver?: string;
  fromOddsNotVoidAwayUnder?: string;
  toOddsNotVoidAwayUnder?: string;
  voidFromTime?: string;
  voidToTime?: string;
  sportType: number;
}