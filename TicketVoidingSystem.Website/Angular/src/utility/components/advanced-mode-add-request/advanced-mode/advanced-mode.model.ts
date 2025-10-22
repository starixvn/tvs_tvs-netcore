import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';

export class Item {
  index: number;
  name: string;
  value: string;
  isRowSpan: boolean;
  isDisabled: boolean;
  isChecked: boolean;
  isMultiple: boolean;
  xmlAttribute: string;
  format: string;

  constructor(index: number, name: string, value: string, isRowSpan: boolean, isDisabled: boolean, isMultiple: boolean, xmlAttribute: string, format: string, isChecked: boolean) { // NOSONAR
    this.index = index;
    this.name = name;
    this.value = value;
    this.isRowSpan = isRowSpan;
    this.isDisabled = isDisabled;
    this.isMultiple = isMultiple;
    this.isChecked = isChecked;
    this.xmlAttribute = xmlAttribute;
    this.format = format;
  }
}

export class Selection {
  index: number;
  name: string;
  value: string;
  items: Selection[];
  multiSelection: MultiSelection;
  isMultiple: boolean;
  xmlAttribute: string;
  isDisabled: boolean;
}

export class MultiSelection {
  name: string;
  value: string;
  xmlAttribute: string;
  multipleSelect: MultipleSelection;
}

export class BetTeamAddRequestResult {
  id: string;
  isDisabled: boolean;
  team: string;
  hdp: string;
  hdp1: string;
  hdp2: string;
  player: string;
  playerAndOdds: string;
  oddsSpread: string;
  betIdX: string; // store selected value
  betIdY: string; // store selected value
  filterBetIdX: string; // filter data in SPs only
  filterBetIdY: string; // filter data in SPs only

  // Add common key for all bet types
  firstValue: string;
  secondValue: string;
}

export class BetTeamAddRequest {
  index: number;
  name: string;
  value: string;
  type: number;
  betTypes: string;
  selections: Selection[]; // for dropdown
  inputs: Item[]; // for input
  isShow: boolean;
  isCheckedAllItems: boolean;
}