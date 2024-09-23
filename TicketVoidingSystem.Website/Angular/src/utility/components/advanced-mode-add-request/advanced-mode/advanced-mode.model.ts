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

  constructor(index: number, name: string, value: string, isRowSpan: boolean, isDisabled: boolean, isMultiple: boolean, xmlAttribute: string, format: string, isChecked: boolean) {
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
  wicket: string;
  over: string;
  player: string;
  playerAndOdds: string;
  betIdX: string;
  betIdY: string;
  filterBetIdX: string;
  filterBetIdY: string;

  // Add common key for all bet types
  first: string;
  second: string;
  third: string;
}

export class BetTeamAddRequest {
  index: number;
  name: string;
  value: string;
  type: number;
  betTypes: string;
  selections: Selection[]; // for dropdown
  inputs: Item[]; // for input
  items: Item[]; // for checkbox table
  isShow: boolean;
  isCheckedAllItems: boolean;

  constructor(
    commonInfo: [number, string, string, number, string],
    selections: Selection[],
    inputs: Item[],
    items: Item[],
    isChecked: boolean) {
    this.index = commonInfo[0];
    this.name = commonInfo[1];
    this.value = commonInfo[2];
    this.type = commonInfo[3];
    this.betTypes = commonInfo[4];
    this.renderSelections(selections);
    this.renderInputs(inputs);
    this.renderItems(items);
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

  private renderItems(items: Item[]) {
    this.items = [];
    this.isCheckedAllItems = true;
    if (items !== null) {
      for (const [index, item] of items.entries()) {
        const temp = new Item(index, item.name, item.value, item.isRowSpan, item.isDisabled, item.isMultiple, item.xmlAttribute, item.format, true);
        this.items.push(temp);
      }
      console.log(this.items);
    }
  }

  resetChecked() {
    this.isShow = true;
    this.resetSelections();
  }

  resetSelections() {
    this.selections.forEach(selection => {
      selection.value = 'All';
    });
  }

  getResult(betTypeId: string): BetTeamAddRequestResult {
    const result = new BetTeamAddRequestResult();
    this.updateBySelection(result);
    this.updateByInputs(result);
    this.updateByItems(result);

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

  updateByItems(result: BetTeamAddRequestResult) {
    if (this.items.length > 0) {
      this.updateResult(result, this.items[0].xmlAttribute, this.getItemsValue());
    }
  }

  getItemsValue(): string {
    return this.items.filter(item => item.isChecked).map(item => item.value).join(',');
  }

  updateResult(result: BetTeamAddRequestResult, attribute: string, value: string) { // NOSONAR
    switch (attribute.toLowerCase()) {
      case 'team':
        result.team = value;
        break;
      case 'hdp':
        result.hdp = value;
        break;
      case 'player':
        result.player = value;
        break;
      case 'playerandodds':
        result.playerAndOdds = value;
        break;
      case '_xxx':
        result.betIdX = value;
        result.filterBetIdX = this.getValueBetIdTypeXxx(value);
        break;
      case '_xx':
        result.betIdX = value;
        result.filterBetIdX = this.getValueBetIdTypeXx(value);
        break;
      case 'yy':
        result.betIdY = value;
        result.filterBetIdY = this.getValueBetIdTypeYy(value);
        break;
      case 'betidx':
        result.betIdX = value;
        result.filterBetIdX = value;
        break;
      case 'betidy':
        result.betIdY = value;
        result.filterBetIdY = value;
        break;
    }
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

  getValueBetIdTypeXx(value: string): string {
    if (!value) {
      return '___';
    }

    return value.split('&')
      .filter(Boolean)
      .map(x => `_${x.padStart(2, '0')}`)
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


  // TODO: Remove for type 2
  checkItems() {
    this.items.forEach(item => {
      item.isChecked = this.isCheckedAllItems;
    });
  }

  // TODO: Remove for type 2
  controlIsChecked() {
    let temp = true;
    for (let i = 0; i < this.items.length && temp; i++) {
      temp = this.items[i].isChecked;
    }
    this.isCheckedAllItems = temp;
  }


  updateBetTypeHalfFullTimeCorrectScore(result: BetTeamAddRequestResult, betTypeId) {
    if (betTypeId === AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE
        || betTypeId === AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE_AOS) {
      let temp = '';
      if (this.selections[0].value === 'All' && this.selections[1].value === 'All') {
        temp = 'All';
      } else if (this.selections[0].value === 'All') {
        for (let i = 1; i < this.selections[0].items.length; i++) {
          const value = this.selections[0].items[i].value + '/' + this.selections[1].value;
          temp = temp === '' ? value : temp + ',' + value;
        }
      } else if (this.selections[1].value === 'All') {
        for (let i = 1; i < this.selections[1].items.length; i++) {
          const value = this.selections[0].value + '/' + this.selections[1].items[i].value;
          temp = temp === '' ? value : temp + ',' + value;
        }
      } else {
        temp = this.selections[0].value + '/' + this.selections[1].value;
      }

      result.team = temp;
    }
  }

  private updateForPenaltyShootoutCombo376(result: BetTeamAddRequestResult, betTypeId: string): void {
    if (betTypeId === AdvancedModeConstants.BETTYPE_PENALTY_SHOOTOUT_COMBO) {
      const newBetTeam = `${result.first}-${result.second}`;
      result.team = newBetTeam;
    }
  }

  private updateForBetTypesCricketWithFancy(result: BetTeamAddRequestResult, betTypeId: string): void {
    if (AdvancedModeConstants.BETTYPES_CRICKET_UPDATE_FANCY.split(',').includes(betTypeId)) {
      if (result.team === 'n') {
        result.hdp1 = result.first;
      } else if (result.team === 'y') {
        result.hdp2 = result.first;
      }
      delete result.first;
    }
  }

  private updateForBetTypesWithRuns(result: BetTeamAddRequestResult, betTypeId: string): void {
    if (AdvancedModeConstants.BETTYPE_OVER_X_EXACT_RUNS.split(',').includes(betTypeId)) {
      const runesTransform = AdvancedModeConstants.RUNS_SELECTION.find(x => x.value === result.first);
      result.team = runesTransform.betTeam;
      result.hdp1 = runesTransform.valueHdp1;
      delete result.first;
    }
  }
}