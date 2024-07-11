import { Result } from "../../../models/result";

export class LinkedLogsViewModel {
  poolHouseLinkedLogsData: PoolHouseLinkedLogsData[];
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  result: Result<null>;
  
  constructor() {
    this.poolHouseLinkedLogsData = [];
  }
}

export class PoolHouseLinkedLogsData {
  groupName: string;
  logsData: string[];
  isShow: boolean;
}

export class GetLinkedLogQuery {
  matchId: number;
  issueTypeId: number;
  subIssueTypeId: number;
  filterFromTransTime: string;
  filterToTransTime: string;
  homeFavorite: string;
  awayFavorite: string;
  hdpValue: string;
  wrongMarket: string;
  liveIndicator: number;

  filterFavoriteType?: string;
  favoriteValue?: string;
  wrongOU?: string;

  spread: string;
  allowanceRate?: string;
  correctOddsHomeOver?: string;
  correctOddsAwayUnder?: string;
  fromOddsNotVoidHomeOver?: string;
  toOddsNotVoidHomeOver?: string;
  fromOddsNotVoidAwayUnder?: string;
  toOddsNotVoidAwayUnder?: string;
}