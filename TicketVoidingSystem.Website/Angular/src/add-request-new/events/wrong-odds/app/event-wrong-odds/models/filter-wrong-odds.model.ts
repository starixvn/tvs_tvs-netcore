import { Selection } from "../../../../../../utility/models/selection.model";

export class FilterWrongOddsModel {
  filterFromTransTime: string;
  filterToTransTime: string;
  liveIndicator: number;
  filterFavoriteType?: string;
  favoriteValue?: string;
  wrongOU?: string;
  spread: string;
  maxBet: number;
  allowanceRate: string;
  correctOddsHomeOver: string;
  correctOddsAwayUnder: string;
  fromOddsNotVoidHomeOver: string;
  toOddsNotVoidHomeOver: string;
  fromOddsNotVoidAwayUnder: string;
  toOddsNotVoidAwayUnder: string;
  maxBetAndSpreadInfo: MaxBetAndSpreadInfo[]
}

export class FilterFavoriteType {
  items: Selection[] = [
    { name: 'Home Favorite', value: 'h' },
    { name: 'Away Favorite', value: 'a' }
  ];
}

export class FilterFavoriteTypeConstant {
  static readonly HOME = 'h';
  static readonly AWAY = 'a';
}

export class MaxBetAndSpreadInfo {
  subIssueTypeId: string;
  spread: string;
  maxBet: number;
}

export class MaxBetAndSpreadQuery {
  matchId: number;
  parentId: number;
  subtype: number;
}