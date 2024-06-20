import { Selection } from "../../../../../utility/models/selection.model";

export class FilterWrongOddsModel {
  filterFromTransTime: string;
  filterToTransTime: string;
  filterOddsType: string;
  filterFavoriteType: string;
  filterOuType: string;
  oddsValue: string;
  fromOdds: string;
  toOdds: string;
  correctOdds: string;
  betTeam: string;
  ouValue: string;
  favoriteValue: string;
  liveIndicator: number;
  oddsInfo: OddsInfoModel;
}

export class FilterOddsType {
  items: Selection[] = [
    { name: 'Odds Value', value: 'value' },
    { name: 'Odds Range', value: 'range' }
  ];
}

export class FilterFavoriteType {
  items: Selection[] = [
    { name: 'Home Favorite', value: 'h' },
    { name: 'Away Favorite', value: 'a' }
  ];
}

export class FilterOuType {
  items: Selection[] = [
    { name: 'Over', value: 'h' },
    { name: 'Under', value: 'a' }
  ];
}

export class FilterOddsTypeConstant {
  static readonly VALUE = 'value';
  static readonly RANGE = 'range';
}

export class FilterFavoriteTypeConstant {
  static readonly HOME = 'h';
  static readonly AWAY = 'a';
}

export class FilterOuTypeConstant {
  static readonly OVER = 'h';
  static readonly UNDER = 'a';
}

export class FilterBetTeamConstant {
  static readonly HOME = 'h';
  static readonly AWAY = 'a';
}

export class OddsInfoModel {
  matchId: number;
  parentId: number;
  subtype: number;
  subIssueTypeId: string;
  spread: string;
  maxBet?: number;
  allowanceRate?: string;
  correctOddsHomeOver?: string;
  correctOddsAwayUnder?: string;
  fromOddsNotVoidHomeOver?: number;
  toOddsNotVoidHomeOver?: number;
  fromOddsNotVoidAwayUnder?: number;
  toOddsNotVoidAwayUnder?: number;
}