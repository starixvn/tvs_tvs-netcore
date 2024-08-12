import { Result } from '../../../../../utility/models/result';

export class LinkedLogsViewModel {
  groupLinkedLogs: GroupLinkedLog[];
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  result: Result<null>;
  
  constructor() {
    this.groupLinkedLogs = [];
  }
}

export class GroupLinkedLog {
  groupName: string;
  logsData: string[];
  isAffectedGroup: boolean;
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