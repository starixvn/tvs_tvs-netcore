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

  filterOddsType: string;
  filterFavoriteType: string;
  filterOuType: string;
  oddsValue: string;
  fromOdds: string;
  toOdds: string;
  betTeam: string;
  ouValue: string;
  favoriteValue: string;
  correctOdds: string;
}