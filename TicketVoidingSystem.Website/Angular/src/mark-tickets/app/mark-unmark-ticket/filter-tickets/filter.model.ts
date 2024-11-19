import { Currency } from '../../../../utility/models/currency.model';
import { Selection } from '../../../../utility/models/selection.model';

export class FilterSearchBy {
  static readonly MATCH_ID = '0';
  static readonly BETIDS = '1';
  static readonly ALL_MARKED = '2';

  value = '1';
  items: Selection[] = [
    { name: 'BetID(s)', value: '1' },
    { name: 'MatchID', value: '0' },
    { name: 'All Marked Tickets', value: '2', hidden: true }
  ];
}

export class EventType {
  value = '2';
  items: Selection[] = [
    { name: 'All', value: '2' },
    { name: 'Dead Ball', value: '0' },
    { name: 'Live Ball', value: '1' }
  ];
}

export class Currencies {
  items: Currency[];
  selected: number[];
}
