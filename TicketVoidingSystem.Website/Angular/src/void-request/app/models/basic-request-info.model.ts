
export class BasicRequestInfo {
  id: number;
  matchId: number;
  subIssueTypeId: number;
  wrongMarket?: string;
  actualMarket?: string;
  hdpValue?: string;
  isCheckedVar?: boolean;
  isMainMatch?: boolean;

  // Wrong Odds
  filterFavoriteType?: string;
  wrongOU?: string;
  favoriteValue?: string;
  correctOddsHomeOver?: string;
  correctOddsAwayUnder?: string;

  // Wrong Score
  actualScore?: string;
  filterBy?: number;
  wrongScore?: string;
}