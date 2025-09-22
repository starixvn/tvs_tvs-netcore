export class WrongOddsGetLogInfoQuery {
  matchId: number;
  subIssueTypeId: number;
  filterFromTransTime: string;
  filterToTransTime: string;
  poolHouseCheckedBetTypes: string;
  isLinkGroup1X2: boolean;
  isLinkGroupAIO: boolean;
  liveIndicator: number;

  filterFavoriteType?: string;  
  favoriteValue?: string;
  wrongOU?: string;

  spread?: string;
  allowanceRate?: string;
  correctOddsHomeOver?: string;
  correctOddsAwayUnder?: string;
  fromOddsNotVoidHomeOver?: string;
  toOddsNotVoidHomeOver?: string;
  fromOddsNotVoidAwayUnder?: string;
  toOddsNotVoidAwayUnder?: string;
}