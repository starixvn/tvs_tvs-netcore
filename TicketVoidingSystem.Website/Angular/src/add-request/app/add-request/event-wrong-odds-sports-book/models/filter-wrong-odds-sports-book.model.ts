import { Selection } from "../../../../../utility/models/selection.model";

export class FilterWrongOddsSportsBookModel {
  fromDateTime: string;
  toDateTime: string;
  filterOddsType: string;
  oddsValue: string;
  fromOdds: string;
  toOdds: string;
  correctOdds: string;
  liveIndicator: number;
}

export class FilterOddsType {
  items: Selection[] = [
    { name: 'Odds Value', value: 'value' },
    { name: 'Odds Range', value: 'range' }
  ];
}

export class FilterOddsTypeConstant {
  static readonly VALUE = 'value';
  static readonly RANGE = 'range';
}