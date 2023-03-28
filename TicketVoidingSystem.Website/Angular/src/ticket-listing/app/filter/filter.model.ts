import { GetSummaryQuery } from '../models/query.model';
import { MatchModel } from '../../../utility/models/match.model';

export class Type {
  value: number;
  items: Item[];
}

export class Item {
  value: number;
  name: string;
  constructor(value: number, name: string) {
    this.value = value;
    this.name = name;
  }
}

export class Licensee {
  id: number;
  name: string;
}

export class FilterEvent {
  query: GetSummaryQuery;
  match: MatchModel;
}

export class SelectionTypeModel {
  selectionType: number;
  selectionName: string;
}
