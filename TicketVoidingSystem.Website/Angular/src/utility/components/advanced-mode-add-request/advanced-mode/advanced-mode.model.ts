import { AdvancedModeConstants } from '../../advanced-mode/advanced-mode.constants';
import { ItemsSelect } from '../../multiple-selection/items-select';
import { MultipleSelection } from '../../multiple-selection/multiple-selection';

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

  constructor(index: number, name: string, value: string, items: Selection[], isMultiple: boolean, xmlAttribute: string) {
    this.index = index;
    this.name = name;
    this.value = value;
    this.renderItems(items);
    this.isMultiple = isMultiple;
    this.xmlAttribute = xmlAttribute;
  }

  renderItems(items: Selection[]) {
    this.items = [];
    if (items !== null) {
      for (const [index, item] of items.entries()) {
        const temp = new Selection(index, item.name, item.value, item.items, item.isMultiple, item.xmlAttribute);
        this.items.push(temp);
      }
    }
  }
}

export class MultiSelection {
  name: string;
  value: string;
  xmlAttribute: string;
  multipleSelect: MultipleSelection;

  updateItemChecked(checkedItems: string[]) {
    this.multipleSelect.updateItemChecked(checkedItems);
  }

  resetAllChecked() {
    this.multipleSelect.checkAllItems(true);
    this.multipleSelect.isCheckAll = true;
  }

  updateDisabledStatus(isDisabled: boolean) {
    this.multipleSelect.updateDisableStatus(isDisabled);
    this.multipleSelect.isDisabled = isDisabled;
  }
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

  constructor(
    commonInfo: [number, string, string, number, string],
    selections: Selection[],
    inputs: Item[],
    isChecked: boolean) {
    this.index = commonInfo[0];
    this.name = commonInfo[1];
    this.value = commonInfo[2];
    this.type = commonInfo[3];
    this.betTypes = commonInfo[4];
    this.renderSelections(selections);
    this.renderInputs(inputs);
    this.isShow = isChecked;
  }

  renderSelections(selections: Selection[]) {
    this.selections = [];
    if (selections !== null) {
      this.renderValidSelection(selections);
    }
  }

  renderValidSelection(selections: Selection[]) {
    for (const [index, item] of selections.entries()) {
      if (item.isMultiple) {
        item.index = index;
        item.multiSelection = this.renderMultipleSelection(item);
        this.selections.push(item);
      } else {
        const selection = new Selection(index, item.name, item.value, item.items, item.isMultiple, item.xmlAttribute);
        this.selections.push(selection);
      }
    }
  }

  renderMultipleSelection(item: Selection): MultiSelection {
    const model = new MultiSelection();
    model.multipleSelect = new MultipleSelection();
    model.multipleSelect.checkAllCheckBoxText = 'All';
    model.multipleSelect.allItemsCheckedText = 'All';
    model.multipleSelect.noneItemCheckedText = 'Select options';
    model.multipleSelect.maxWidth = '100%';
    this.renderItemsMultipleSelection(item, model);

    return model;
  }

  renderItemsMultipleSelection(multi: Selection, model: MultiSelection) {
    model.name = multi.name;
    model.value = multi.value;
    model.xmlAttribute = multi.xmlAttribute;
    model.multipleSelect.items = [];
    multi.items?.forEach(item => {
      const temp = [];
      if (item.items !== null && item.items !== undefined) {
        item.items.forEach(itemSelect => {
          temp.push(new ItemsSelect(0, itemSelect.value, itemSelect.name, true, true, true, []));
        });
      }
      model.multipleSelect.items.push(new ItemsSelect(0, item.value, item.name, true, true, true, temp));
    });
    model.multipleSelect.isCheckAll = model.multipleSelect.items.every(x => x.checked);
    model.multipleSelect.selectionTitle = model.multipleSelect.getDisplayedItems();
  }

  private renderInputs(inputs: Item[]) {
    this.inputs = [];
    if (inputs !== null) {
      for (const [index, input] of inputs.entries()) {
        const temp = new Item(index, input.name, input.value, input.isRowSpan, input.isDisabled, input.isMultiple, input.xmlAttribute, input.format, false);
        this.inputs.push(temp);
      }
    }
  }

  resetAllChecked(){
    this.selections.forEach(selection => {
      selection.multiSelection?.resetAllChecked();
    });
  }

  getResult(betTypeId: string): BetTeamAddRequestResult {
    const result = new BetTeamAddRequestResult();
    this.updateBySelection(result);
    this.updateByInputs(result);
    this.updateBetTypeHalfFullTimeCorrectScore(result, betTypeId)
    this.updateForPenaltyShootoutCombo376(result, betTypeId);
    this.updateForBetTypesCricketWithFancy(result, betTypeId);
    this.updateForBetTypesWithRuns(result, betTypeId);
    result.id = betTypeId;

    return result;
  }

  updateBySelection(result: BetTeamAddRequestResult) {
    this.selections.forEach(selection => {
      const value = selection.isMultiple
        ? selection.multiSelection.multipleSelect.getValueItems()
        : selection.value;
      this.updateResult(result, selection.xmlAttribute, value);
    });
  }

  updateByInputs(result: BetTeamAddRequestResult) {
    if (this.inputs.length > 0) {
      this.inputs.forEach(input => {
        this.updateResult(result, input.xmlAttribute, input.value ?? '');
      });
    }
  }

  updateResult(result: BetTeamAddRequestResult, attribute: string, value: string) { // NOSONAR
    switch (attribute.toLowerCase()) {
      case 'team':
        result.team = value;
        break;
      case 'hdp':
      case 'hdp1':
      case 'hdp2':
        result.hdp = value;
        break;
      case 'player':
        result.player = value;
        break;
      case 'playerandodds':
        result.playerAndOdds = value;
        break;
      case 'oddsspread':
        result.oddsSpread = value;
        break;
      case '_xx': // use for input: XX value & selections round: XX in betid type 8XX; link to column betId
        result.betIdX = value;
        result.filterBetIdX = this.getValueBetIdTypeXx(value);
        break;
      case '_xxx': // use for input: XXX value in betid type 8XXX, 8XXXYY; link to column betId
        result.betIdX = value;
        result.filterBetIdX = this.getValueBetIdTypeXxx(value); // value = 1 => _001; value = 11 => _011; value = 1111 => _1111
        break;
      case 'yy': // use for input: YY value in betid type (8XXYY, 8XXXYY); link to column betId
        result.betIdY = value;
        result.filterBetIdY = this.getValueBetIdTypeYy(value); // value = 1 => 01; value = 11 => 11; value = 111 => 111
        break;
      case 'betidx': // use for selection: value is configured in the json file; link to column betId
        result.betIdX = value;
        result.filterBetIdX = value;
        break;
      case 'betidy': // use for selection: value is configured in the json file; link to column betId
        result.betIdY = value;
        result.filterBetIdY = value;
        break;
      case 'firstvalue':
        result.firstValue = value;
        break;
      case 'secondvalue':
        result.secondValue = value;
        break;
    }
  }

  getValueBetIdTypeXx(value: string): string {
    if (!value) {
      return '___';
    }

    const newValue = value.replaceAll(',','&'); //replace values selection

    return newValue.split('&')
      .filter(Boolean)
      .map(x => `_${x.padStart(2, '0')}`)
      .join('&');
  }

  getValueBetIdTypeXxx(value: string): string {
    if (!value) {
      return '____';
    }

    return value.split('&')
      .filter(Boolean)
      .map(x => `_${x.padStart(3, '0')}`)
      .join('&');
  }

  getValueBetIdTypeYy(value: string): string {
    if (!value) {
      return '';
    }

    return value.split('&')
      .filter(Boolean)
      .map(y => y ? y.padStart(2, '0') : '__')
      .join('&');
  }

  private updateBetTypeHalfFullTimeCorrectScore(result: BetTeamAddRequestResult, betTypeId: string): void {
    if (this.isHalfFullTimeCorrectScoreBet(betTypeId)) {
      const [selection1, selection2] = this.selections;
      const team = this.getCombinedSelectionValueBetTypeFullTimeCorrectScore(selection1, selection2);
      result.team = team;
    }
  }

  private isHalfFullTimeCorrectScoreBet(betTypeId: string) {
    return [
      AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE,
      AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE_AOS,
    ].includes(betTypeId);
  }

  private getCombinedSelectionValueBetTypeFullTimeCorrectScore(selection1: Selection, selection2: Selection) {
    if (selection1.value?.toLowerCase() === 'all' && selection2.value?.toLowerCase() === 'all') {
      return 'All';
    }
    if (selection1.value?.toLowerCase() === 'all') {
      return selection1.items.slice(1).map(item1 => `${item1.value}/${selection2.value}`).join(',');
    }
    if (selection2.value?.toLowerCase() === 'all') {
      return selection2.items.slice(1).map(item2 => `${selection1.value}/${item2.value}`).join(',');
    }

    return `${selection1.value}/${selection2.value}`;
  }

  private updateForPenaltyShootoutCombo376(result: BetTeamAddRequestResult, betTypeId: string): void {
    if (betTypeId === AdvancedModeConstants.BETTYPE_PENALTY_SHOOTOUT_COMBO) {
      result.team = `${result.firstValue}-${result.secondValue}`;
    }
  }

  private updateForBetTypesCricketWithFancy(result: BetTeamAddRequestResult, betTypeId: string): void {
    if (AdvancedModeConstants.BETTYPES_CRICKET_UPDATE_FANCY.split(',').includes(betTypeId)) {
      if (result.team?.toLowerCase() === 'all') {
        result.hdp = result.firstValue;
      } else if(result.team?.toLowerCase() === 'n') {
        result.hdp1 = result.firstValue;
      } else if (result.team?.toLowerCase() === 'y') {
        result.hdp2 = result.firstValue;
      }
    }
  }

  private updateForBetTypesWithRuns(result: BetTeamAddRequestResult, betTypeId: string): void {
    if (AdvancedModeConstants.BETTYPE_OVER_X_EXACT_RUNS.split(',').includes(betTypeId)) {
      const runesTransform = AdvancedModeConstants.RUNS_SELECTION.find(x => x.value === result.firstValue);
      result.team = runesTransform.betTeam;
      result.hdp1 = runesTransform.valueHdp1;
    }
  }
}