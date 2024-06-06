import { ItemsSelect } from '../../multiple-selection/items-select';
import { MultipleSelection } from '../../multiple-selection/multiple-selection';

export class Item {
  index: number;
  name: string;
  value: string;
  isDisabled: boolean;
  isChecked: boolean;
  isMultiple: boolean;
  xmlAttribute: string;

  constructor(index: number, name: string, value: string, isDisabled: boolean, isMultiple: boolean, xmlAttribute: string) {
    this.index = index;
    this.name = name;
    this.value = value;
    this.isDisabled = isDisabled;
    this.isMultiple = isMultiple;
    this.isChecked = false;
    this.xmlAttribute = xmlAttribute;
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

  constructor(index: number,name: string, value: string, items: Selection[], isMultiple: boolean, xmlAttribute: string) {
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
  isDisabled: boolean;
  id: string;
  team: string;
  hdp: string;
  wicket: string;
  over: string;
  player: string;
  quarter: string;
  set: string;
  game: string;
  map: string;
  round: string;
  point: string;
  kill: string;
  tower: string;
  turret: string;
  ball: string;
  delivery: string;
  playerAndOdds: string;
}

export class BetTeamAddRequest {
  index: number;
  name: string;
  value: string;
  type: number;
  betTypes: string;
  selections: Selection[];
  inputs: Item[];
  isChecked: boolean;

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
    this.isChecked = isChecked;
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
        const temp = new Item(index, input.name, input.value, input.isDisabled, input.isMultiple, input.xmlAttribute);
        this.inputs.push(temp);
      }
    }
  }
  resetChecked() {
    this.isChecked = true;
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
        this.updateResult(result, input.xmlAttribute, input.value ? input.value : '');
      });
    }
  }

  updateResult(result: BetTeamAddRequestResult, attribute: string, value: string) { // NOSONAR
    switch (attribute.toLowerCase()) {
      case 'team':
        result.team = value;
        break;
      case 'hdp':
        result.hdp = value;
        break;
      case 'over':
        result.over = value;
        break;
      case 'player':
        result.player = value;
        break;
      case 'quarter':
        result.quarter = value;
        break;
      case 'set':
        result.set = value;
        break;
      case 'game':
        result.game = value;
        break;
      case 'map':
        result.map = value;
        break;
      case 'round':
        result.round = value;
        break;
      case 'point':
        result.point = value;
        break;
      case 'kill':
        result.kill = value;
        break;
      case 'tower':
        result.tower = value;
        break;
      case 'turret':
        result.turret = value;
        break;
      case 'ball':
        result.ball = value;
        break;
      case 'delivery':
        result.delivery = value;
        break;
      case 'playerandodds':
        result.playerAndOdds = value;
        break;
    }
  }
}