import { inject, Injectable } from '@angular/core';
import { BetTeam, BetTeamResult, Item, MultiSelection, OddsInfo, Selection } from './advanced-mode.model';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { AdvancedModeConstants } from '../advanced-mode.constants';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';
import { ItemsSelectService } from '../../multiple-selection/items-select.service';
import { BetType } from '../group-bettypes/group-bettypes.model';
import { groupBy, isEqual, uniqBy, uniqWith } from 'lodash';
import { Selection as SelectionAddRequest } from '../../advanced-mode-add-request/advanced-mode/advanced-mode.model';
import { BetTeamAddRequestService } from '../../advanced-mode-add-request/advanced-mode/bet-team-add-request.service';
import { StaticService } from '../../../services/static.service';

@Injectable({
  providedIn: 'root'
})
export class AdvancedModeService {
  private readonly multipleSelectionService = inject(MultipleSelectionService);
  private readonly itemsSelectService = inject(ItemsSelectService);
  private readonly betTeamAddRequestService = inject(BetTeamAddRequestService);

  initBetTeam(commonInfo: [number, string, string, number, string], selections: Selection[], items: Item[],
    inputs: Item[], isShowMultiSelectionList: boolean) {
    const betTeam = new BetTeam();
    betTeam.index = commonInfo[0];
    betTeam.name = commonInfo[1];
    betTeam.value = commonInfo[2];
    betTeam.type = commonInfo[3];
    betTeam.betTypes = commonInfo[4];
    betTeam.isShowMultiSelectionList = isShowMultiSelectionList;
    this.renderSelections(betTeam, selections);
    this.renderItems(betTeam, items);
    this.renderInputs(betTeam, inputs);
    betTeam.checkedBetTypes = [];
    betTeam.isChecked = false;

    return betTeam;
  }

  initSelection(name: string, value: string, items: Selection[], isMultiple: boolean, xmlAttribute: string, //NOSONAR
    isCanSelectMapFromOutside: boolean, isCanSelectRoundFromOutside: boolean, isCanSelectQuarterFromOutside: boolean,
    isCanSelectSetFromOutside: boolean, isCanSelectGameFromOutside: boolean, isCanSelectInningFromOutside: boolean) {
    const selection = new Selection();
    selection.name = name;
    selection.value = value;
    this.renderSelectionItems(selection, items);
    selection.isMultiple = isMultiple;
    selection.xmlAttribute = xmlAttribute;
    selection.isCanSelectMapFromOutside = isCanSelectMapFromOutside;
    selection.isCanSelectRoundFromOutside = isCanSelectRoundFromOutside;
    selection.isCanSelectQuarterFromOutside = isCanSelectQuarterFromOutside;
    selection.isCanSelectSetFromOutside = isCanSelectSetFromOutside;
    selection.isCanSelectGameFromOutside = isCanSelectGameFromOutside;
    selection.isCanSelectInningFromOutside = isCanSelectInningFromOutside;

    return selection;
  }

  private renderSelectionItems(selection: Selection, items: Selection[]) {
    selection.items = [];
    if (items !== null) {
      items.forEach(item => {
        const temp = this.initSelection(item.name, item.value, item.items, item.isMultiple, item.xmlAttribute,
          item.isCanSelectMapFromOutside, item.isCanSelectRoundFromOutside, item.isCanSelectQuarterFromOutside,
          item.isCanSelectSetFromOutside, item.isCanSelectGameFromOutside, item.isCanSelectInningFromOutside);
        selection.items.push(temp);
      });
    }
  }

  private renderSelections(betTeam: BetTeam, selections: Selection[]) {
    betTeam.selections = [];
    betTeam.multiSelectionList = [];
    if (selections !== null) {
      this.renderValidSelection(betTeam, selections);
    }
  }

  private renderValidSelection(betTeam: BetTeam, selections: Selection[]) {
    selections.forEach(item => {
      if (betTeam.isShowMultiSelectionList &&
        (item.isCanSelectMapFromOutside || item.isCanSelectRoundFromOutside || item.isCanSelectQuarterFromOutside
          || item.isCanSelectSetFromOutside || item.isCanSelectGameFromOutside || item.isCanSelectInningFromOutside)) {
        this.renderMultipleSelectWithAllBetType(betTeam.multiSelectionList, item);
      } else if (item.isMultiple) {
        item.multiSelection = this.renderMultipleSelect(item);
        betTeam.selections.push(item);
      } else {
        const selection = this.initSelection(item.name, item.value, item.items, item.isMultiple, item.xmlAttribute,
          item.isCanSelectMapFromOutside, item.isCanSelectRoundFromOutside, item.isCanSelectQuarterFromOutside,
          item.isCanSelectSetFromOutside, item.isCanSelectGameFromOutside, item.isCanSelectInningFromOutside);
        betTeam.selections.push(selection);
      }
    });
  }

  private renderItems(betTeam: BetTeam, items: Item[]) {
    betTeam.items = [];
    if (items !== null) {
      for (const [index, item] of items.entries()) {
        const temp = new Item(index, item.name, item.value, item.flag, item.xmlAttribute, item.isMultiple);
        betTeam.items.push(temp);
      };
    }
  }

  private renderInputs(betTeam: BetTeam, inputs: Item[]) {
    betTeam.inputs = [];
    if (inputs !== null) {
      for (const [index, input] of inputs.entries()) {
        const temp = new Item(index, input.name, input.value, input.flag, input.xmlAttribute, input.isMultiple);
        betTeam.inputs.push(temp);
      };
    }
  }

  renderMultipleSelect(item: Selection): MultiSelection {
    const multiSelection = new MultiSelection();
    multiSelection.multipleSelect = new MultipleSelection();
    multiSelection.multipleSelect.checkAllCheckBoxText = 'All';
    multiSelection.multipleSelect.allItemsCheckedText = 'All';
    multiSelection.multipleSelect.noneItemCheckedText = 'Select options';
    multiSelection.multipleSelect.maxWidth = '100%';
    return this.renderItemsMultipleSelect(multiSelection, item);
  }

  private renderMultipleSelectWithAllBetType(multiSelectionList: MultiSelection[], item: Selection) {
    const multiSelection = new MultiSelection();
    multiSelection.multipleSelect = new MultipleSelection();
    multiSelection.multipleSelect.checkAllCheckBoxText = 'All';
    multiSelection.multipleSelect.allItemsCheckedText = 'All';
    multiSelection.multipleSelect.noneItemCheckedText = 'Select options';
    multiSelection.multipleSelect.maxWidth = '100%';
    const model = this.renderItemsMultipleSelectWithAllBetType(multiSelection, item);
    multiSelectionList.push(model);
  }

  private renderItemsMultipleSelect(multiSelection: MultiSelection, selection: Selection): MultiSelection {
    multiSelection.name = selection.name;
    multiSelection.value = selection.value;
    multiSelection.xmlAttribute = selection.xmlAttribute;
    multiSelection.multipleSelect.items = [];
    selection.items.forEach(item => {
      const temp = [];
      if (item.items !== null && item.items !== undefined) {
        item.items.forEach(itemSelect => {
          temp.push(ItemsSelectService.initItemsSelect(0, itemSelect.value, itemSelect.name, true, true, true, []));
        });
      }
      multiSelection.multipleSelect.items.push(ItemsSelectService.initItemsSelect(0, item.value, item.name, true, true, true, temp));
    });
    multiSelection.multipleSelect.isCheckAll = multiSelection.multipleSelect.items.every(x => x.checked);
    multiSelection.multipleSelect.selectionTitle = this.multipleSelectionService.getDisplayedItems(multiSelection.multipleSelect);

    return multiSelection;
  }

  private renderItemsMultipleSelectWithAllBetType(multiSelection: MultiSelection, multi: Selection): MultiSelection {
    multiSelection.name = multi.name;
    multiSelection.value = multi.value;
    multiSelection.xmlAttribute = multi.xmlAttribute;
    multiSelection.multipleSelect.items = [];
    multi.items.forEach(item => {
      if (item.name !== 'All' || item.value !== 'All') {
        multiSelection.multipleSelect.items.push(ItemsSelectService.initItemsSelect(0, item.value, item.name, true, true, true, []));
      }
    });
    if (multi.isCanSelectMapFromOutside) {
      multiSelection.type = "map";
    } else if (multi.isCanSelectRoundFromOutside) {
      multiSelection.type = "round";
    } else if (multi.isCanSelectQuarterFromOutside) {
      multiSelection.type = "quarter";
    } else if (multi.isCanSelectSetFromOutside) {
      multiSelection.type = "set";
    } else if (multi.isCanSelectGameFromOutside) {
      multiSelection.type = "game";
    } else if (multi.isCanSelectInningFromOutside) {
      multiSelection.type = "inning";
    }

    return multiSelection;
  }

  resetChecked(betTeam: BetTeam) {
    betTeam.isChecked = true;
    this.resetSelections(betTeam.selections);
    this.checkItems(betTeam);
  }

  private resetSelections(selections: Selection[]) {
    selections.forEach(selection => {
      selection.value = 'All';
    });
  }

  private handler416WithNameIsHT(selections: Selection[], item: Selection): boolean {
    const MARKED_SCORE = 3;
    const SECOND_SCORE_INDEX = 2;
    return selections[1].value === 'All' ||
      item.value === 'AOS' &&
      ((parseInt(selections[1].value.charAt(0), 10) > MARKED_SCORE) ||
        (parseInt(selections[1].value.charAt(SECOND_SCORE_INDEX), 10) > MARKED_SCORE)) ||
      item.name.charAt(0) <= selections[1].value.charAt(0) &&
      item.name.charAt(SECOND_SCORE_INDEX) <= selections[1].value.charAt(SECOND_SCORE_INDEX);
  }

  private handler416WithNameIsNotHT(selections: Selection[], item: Selection): boolean {
    const MARKED_SCORE = 3;
    const SECOND_SCORE_INDEX = 2;
    return selections[0].value === 'All' ||
      selections[0].value === 'AOS' &&
      ((parseInt(item.name.charAt(0), 10) > MARKED_SCORE) || (parseInt(item.name.charAt(SECOND_SCORE_INDEX), 10) > MARKED_SCORE)) ||
      item.name.charAt(0) >= selections[0].value.charAt(0) &&
      item.name.charAt(SECOND_SCORE_INDEX) >= selections[0].value.charAt(SECOND_SCORE_INDEX);
  }

  private handler416(betTeam: BetTeam, item: Selection, name: string): boolean {
    if (item.name === 'All') {
      return true;
    }

    return name === 'HT:' ? this.handler416WithNameIsHT(betTeam.selections, item) : this.handler416WithNameIsNotHT(betTeam.selections, item);
  }

  isValidOptionForType5(betTeam: BetTeam, item: Selection, name: string): boolean {
    if (betTeam.checkedBetTypes.some(x => (x === AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE
      || x === AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE_AOS))) {
      return this.handler416(betTeam, item, name);
    }

    return true;
  }

  checkItems(betTeam: BetTeam) {
    betTeam.items.forEach(item => {
      item.isChecked = betTeam.isChecked;
    });
  }

  controlIsChecked(betTeam: BetTeam) {
    let temp = true;
    for (let i = 0; i < betTeam.items.length && temp; i++) {
      temp = betTeam.items[i].isChecked;
    }
    betTeam.isChecked = temp;
  }

  getResult(betTeam: BetTeam, id: string): BetTeamResult {
    const result = new BetTeamResult();
    this.updateBySelection(betTeam, result);
    this.updateByMultipleSelectionWithTicketListing(betTeam, result);
    this.updateByItems(betTeam, result, id);
    this.updateByInputs(betTeam.inputs, result, id);
    if (betTeam.type === AdvancedModeConstants.BETTEAM_TYPE_5
      && id === (AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE
        || AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE_AOS)) {
      result.betTeam = this.betTeamTypeFive(betTeam.selections);
    }
    this.updateForPenaltyShootoutCombo376(result, id);
    this.updateForBetTypesCricketWithFancy(result, id);
    this.updateForBetTypesCricketWithBallDelivery(betTeam.inputs, result, id);
    this.updateBetTypesCricketOverXBallYExactRuns(betTeam.inputs, result, id);
    this.updateForBetType9089(betTeam, result, id);
    this.updateForBetTypesCricketWithOverWicket(betTeam.inputs, result, id);
    this.updateForBetTypesWithRuns(betTeam.selections, result, id);

    return result;
  }

  private isShowMultiSelectionListAndBettypeMapOrRound(isShowMultiSelectionList: boolean, name: string): boolean {
    return isShowMultiSelectionList && (name === AdvancedModeConstants.MAP || name === AdvancedModeConstants.ROUND);
  }

  private updateBySelection(betTeam: BetTeam, result: BetTeamResult) {
    betTeam.selections.forEach(select => {
      this.updateResult(result, select.xmlAttribute, select.value);
      if (select.multiSelection !== undefined && (!betTeam.isShowMultiSelectionList ||
        !this.isShowMultiSelectionListAndBettypeMapOrRound(betTeam.isShowMultiSelectionList, select.multiSelection.name))) {
        const value = this.multipleSelectionService.getValueItems(select.multiSelection.multipleSelect);
        this.updateResult(result, select.multiSelection.xmlAttribute, value);
      }
    });
  }

  private updateByMultipleSelectionWithTicketListing(betTeam: BetTeam, result: BetTeamResult) {
    if (betTeam.multiSelectionList !== undefined && betTeam.isShowMultiSelectionList) {
      betTeam.multiSelectionList.forEach(item => {
        let value = this.multipleSelectionService.getValueItems(item.multipleSelect);
        if (item.multipleSelect.selectionTitle === 'All' &&
          (item.name === AdvancedModeConstants.MAP
            || item.name === AdvancedModeConstants.ROUND
            || item.name === AdvancedModeConstants.QUARTER
            || item.name === AdvancedModeConstants.SET
            || item.name === AdvancedModeConstants.GAME
            || item.name === AdvancedModeConstants.INNING)) {
          value = 'All';
        }
        this.updateResult(result, item.xmlAttribute, value);
      });
    }
  }

  private updateByItems(betTeam: BetTeam, result: BetTeamResult, id: string) {
    if (betTeam.items.length === 1) {
      if (betTeam.type === 1 || betTeam.type === 8) {
        this.updateResultForItemOfEnableBetTypes(betTeam.items, result, id);
      } else {
        this.updateResult(result, betTeam.items[0].xmlAttribute, betTeam.items[0].value);
      }
    } else if (betTeam.items.length > 0) {
      this.updateResult(result, betTeam.items[0].xmlAttribute, this.getItemsValue(betTeam));
    }
  }

  private updateResultForItemOfEnableBetTypes(items: Item[], result: BetTeamResult, id: string) {
    const LENGTH_OF_GAME_VALUE = 2;
    let value = this.mappingDbValue(items, id);

    if (AdvancedModeConstants.BETTYPES_MORE_HDP.split(',').includes(id)) {
      value = value.replace(/&/g, ',');
    }
    if (AdvancedModeConstants.BETTYPES_UPDATE_ONLY_GAME_ATTRIBUTE.split(',').includes(id)
      && value.length < LENGTH_OF_GAME_VALUE && value.length > 0) {
      value = value.padStart(LENGTH_OF_GAME_VALUE, '0');
    }

    this.updateResult(result, items[0].xmlAttribute, value);
  }

  private updateByInputs(inputs: Item[], result: BetTeamResult, id: string) {
    if (inputs.length > 0) {
      inputs.forEach(input => {
        let value = input.value;
        value = value.replace(/&/g, ',');
        this.updateResult(result, input.xmlAttribute, value);
      });
    }
  }

  updateItemByControlAllBetType(multiSelectionList: MultiSelection[], itemList: string[], type: string) {
    const multiSelectOfType = multiSelectionList.filter(x => x.type === type);
    multiSelectOfType.forEach(itemMultiSelection => {
      itemMultiSelection.multipleSelect.items.forEach(item => {
        const object = itemList.find(f => f === item.value);
        item.checked = object !== undefined ? true : false;
      });
      this.changeItemsOfMultipleSelection(itemMultiSelection.multipleSelect);
    });
  }

  private changeItemsOfMultipleSelection(multipleSelect: MultipleSelection) {
    const rootItems = multipleSelect.items;
    let count = 0;
    let countChecked = 0;
    rootItems.forEach(item => {
      this.itemsSelectService.checkFromChilds(item);
      count += item.countChilds;
      countChecked += this.itemsSelectService.countChildsChecked(item);
    });
    multipleSelect.selectionTitle = this.multipleSelectionService.getDisplayedItems(multipleSelect);
    multipleSelect.isCheckAll = count === countChecked;
  }

  private mappingDbValue(items: Item[], id: string): string {
    if (items[0].xmlAttribute !== 'Goal') {
      return items[0].value;
    }

    const value = (id === AdvancedModeConstants.BETTYPE_EXTRA_TIME_NEXT_GOAL_OWN) ? '800' : '8' + id + '00';
    return items[0].value === '' ?
      '' : (parseInt(value, 10) + parseInt(items[0].value, 10)).toString();
  }

  getItemsValue(betTeam: BetTeam): string {
    if (betTeam.isChecked) {
      return 'All';
    }

    return betTeam.items
      .filter(item => item.isChecked)
      .map(item => item.value)
      .join(',');
  }

  private updateResult(result: BetTeamResult, attribute: string, value: string) { // NOSONAR
    switch (attribute) {
      case 'BetTeam':
        result.betTeam = value;
        break;
      case 'Set':
        result.set = value;
        break;
      case 'Game':
        result.game = value;
        break;
      case 'Value':
        result.value = value;
        break;
      case 'ValueHdp1':
        result.valueHdp1 = value;
        break;
      case 'ValueHdp2':
        result.valueHdp2 = value;
        break;
      case 'Goal':
        result.goal = value;
        break;
      case 'BetOption':
        result.betOption = value;
        break;
      case 'OddsSpread':
        result.oddsSpread = value;
        break;
      case 'OddsId':
        result.oddsId = value;
        break;
      case 'Transdesc':
        result.transdesc = value;
        break;
      case 'VirtualHead':
        result.virtualHead = value;
        break;
      case 'Performance':
        result.performance = value;
        break;
      case 'PlayerAndOdds':
        result.playerAndOdds = value;
        break;
    }
  }

  private betTeamTypeFive(selections: Selection[]): string {
    if (selections[0].value === 'All' && selections[1].value === 'All') {
      return 'All';
    }
    if (selections[0].value === 'All') {
      return selections[0].items
        .slice(1) // Skip the first item
        .map(item => `${item.value}/${selections[1].value}`)
        .join(',');
    }
    if (selections[1].value === 'All') {
      return selections[1].items
        .slice(1) // Skip the first item
        .map(item => `${selections[0].value}/${item.value}`)
        .join(',');
    }

    return `${selections[0].value}/${selections[1].value}`;
  }

  private updateForPenaltyShootoutCombo376(result: BetTeamResult, betTypeId: string): void {
    if (betTypeId === AdvancedModeConstants.BETTYPE_PENALTY_SHOOTOUT_COMBO) {
      const newBetTeam = `${result.game}-${result.betTeam}`;
      result.betTeam = newBetTeam;
      result.game = 'All';
    }
  }

  private updateForBetTypesCricketWithFancy(result: BetTeamResult, betTypeId: string): void {
    if (AdvancedModeConstants.BETTYPES_CRICKET_UPDATE_FANCY.split(',').includes(betTypeId)) {
      if (result.betTeam === 'n') {
        result.valueHdp1 = result.value;
      } else if (result.betTeam === 'y') {
        result.valueHdp2 = result.value;
      }
      delete result.value;
    }
  }

  private updateForBetTypesCricketWithBallDelivery(inputs: Item[], result: BetTeamResult, betTypeId: string): void { // format "Set" attribute: 8XXXYY
    if (AdvancedModeConstants.BETTYPES_CRICKET_UPDATE_BALL_DELIVERY_AND_OVER.split(',').includes(betTypeId)) {
      result.set = this.getSetValue(inputs, 'Ball/Delivery:');
    }
  }

  private updateBetTypesCricketOverXBallYExactRuns(inputs: Item[], result: BetTeamResult, betTypeId: string): void { // format "Set" attribute: 8XXXYY
    if (AdvancedModeConstants.BETTYPES_OVER_X_BALL_Y_EXACT_RUNS.split(',').includes(betTypeId)) {
      result.set = this.getSetValue(inputs, 'Ball:');
    }
  }

  private getSetValue(inputs: Item[], ballName: string) {
    const overValue = inputs.find(x => x.name === 'Over:').value;
    const ballValue = inputs.find(x => x.name === ballName).value;

    if (overValue.length === 0 && ballValue.length === 0) {
      return 'All';
    }
    const updatedBallValue = this.getSingleBallValue(ballValue);
    if (overValue.length === 0) {
      return `____${updatedBallValue}`;
    }

    const updatedOverValues = this.getMultipleSetValueSeparateByAnd(overValue, '_');
    return updatedOverValues.map(x => `${x}${updatedBallValue}`).join(',');
  }

  private getSingleBallValue(ballValue: string): string {
    const LENGTH_OF_BALL = 2;
    if (ballValue.length === 0) {
      return '__';
    } else if (ballValue.length < LENGTH_OF_BALL && ballValue.length > 0) {
      ballValue = ballValue.padStart(LENGTH_OF_BALL, '0');
    }
    return ballValue;
  }

  private updateForBetType9089(betTeam: BetTeam, result: BetTeamResult, betTypeId: string): void { // format "Set" attribute: 8XXYY
    if (AdvancedModeConstants.BETTYPE_MAP_X_FIRST_TO_Y_OVER_UNDER.split(',').includes(betTypeId)) {
      let mapValues = '';
      const yValue = betTeam.selections.find(x => x.name === 'Y value:').value;
      if (betTeam.isShowMultiSelectionList) {
        mapValues = this.multipleSelectionService.getValueItems(betTeam.multiSelectionList.find(x => x.name === 'Map:').multipleSelect);
      } else {
        mapValues = this.multipleSelectionService.getValueItems(betTeam.selections.find(x => x.name === 'Map:').multiSelection.multipleSelect);
      }

      this.updateSetValueForBetType9089(result, mapValues, yValue);
    }
  }

  private updateSetValueForBetType9089(result: BetTeamResult, mapValues: string, yValue: string): void { // format "Set" attribute: 8XXYY
    if (mapValues === 'All' && yValue === 'All') {
      result.set = 'All';
    }

    const tempSets = [];
    mapValues.split(',').forEach(mapValue => {
      if (mapValue === 'All') {
        tempSets.push(`___${yValue}`);
      } else if (yValue === 'All') {
        tempSets.push(`${mapValue}__`);
      } else {
        tempSets.push(`${mapValue}${yValue}`);
      }
    });

    result.set = tempSets.join(',');
  }

  private updateForBetTypesCricketWithOverWicket(inputs: Item[], result: BetTeamResult, betTypeId: string): void { //format "Over: Wicket: Over/Wicket:" value: 8XXX
    if (AdvancedModeConstants.BETTYPES_CRICKET_UPDATE_OVER_OR_WICKET.split(',').includes(betTypeId)) {
      const input = inputs.find(x => x.xmlAttribute === 'Set');
      if (input) {
        if (input.value.length === 0) {
          result.set = input.value;
          return;
        }
        result.set = this.getMultipleSetValueSeparateByAnd(input.value, '8').join(',');
      }
    }
  }

  private getMultipleSetValueSeparateByAnd(overValue: string, prefix: string): string[] {
    const LENGTH_OF_OVER = 3;
    return overValue.split('&').map(x => {
      if (x.length < LENGTH_OF_OVER && x.length > 0) {
        x = x.padStart(LENGTH_OF_OVER, '0');
      }
      return `${prefix}${x}`;
    });
  }

  private updateForBetTypesWithRuns(selections: Selection[], result: BetTeamResult, betTypeId: string): void {
    if (AdvancedModeConstants.BETTYPE_OVER_X_EXACT_RUNS.split(',').includes(betTypeId)) {
      const runesValue = selections.find(x => x.name === 'Runs:').value;
      const runesTransform = AdvancedModeConstants.RUNS_SELECTION.find(x => x.value === runesValue);

      result.betTeam = runesTransform.betTeam;
      result.valueHdp1 = runesTransform.valueHdp1;
      delete result.value;
    }
  }

  renderSelectionWithPlayer(betTeam: BetTeam, baseBetType: Selection[], selectionName: string): void {
    const items: Selection[] = [];
    baseBetType.forEach(x => {
      if (betTeam.checkedBetTypes.includes(x.value)) {
        items.push(...x.items);
      }
    });
    const playerSelection = betTeam.selections.find(x => x.name === selectionName);
    if (playerSelection) {
      playerSelection.items = betTeam.selections.find(x => x.name === selectionName).items.filter(x => x.name === 'All');
      playerSelection.items.push(...uniqWith(items, isEqual));
    }
    betTeam.selections.forEach(x => {
      if (x.name === selectionName) {
        x.isMultiple = true;
        x.multiSelection = this.renderMultipleSelect(x);
      }
    });
  }

  isValidInputDecimalValue(isMultiple: boolean, value: string): boolean {
    return isMultiple ? StaticService.isCorrectRegexMultipleDecimal(value)
      : StaticService.isCorrectRegexSingleDecimal(value);
  }

  removeBetTypeName(name: string, betTeam: BetTeam) {
    const names = betTeam.name.split(', ');
    const index = names.indexOf(name);
    names.splice(index, 1);
    betTeam.name = names.join(', ');
  }


  getItemsPlayerSelection(betTypeId: string, odds: OddsInfo[]): Selection[] {
    const items: Selection[] = [];
    const groupOddsIdBetTypes = [...AdvancedModeConstants.BETTYPE_NEXT_MAN_OUT.split(','), ...AdvancedModeConstants.BETTYPE_MOST_BASKETBALL.split(',')];
    if (groupOddsIdBetTypes.includes(betTypeId)) {
      const groupsOdds = groupBy(odds, 'oddsId');
      for (const oddsId in groupsOdds) {
        const oddsName = groupsOdds[oddsId].map(y => y.playerName).join(' & ');
        groupsOdds[oddsId].forEach(x => {
          items.push(
            this.initSelection(`${x.playerName} - ${oddsName}`, `${x.betChoice}$${x.oddsId}`, null, true, null, false, false, false, false, false, false)
          );
        });
      }
    } else {
      odds.forEach(x => {
        items.push(this.initSelection(x.playerName, x.playerId.toString(), null, true, null, false, false, false, false, false, false));
      });
    }

    return uniqBy(items, x => x.value);
  }


  getItemsPlayerSelectionAddRequest(betTypeId: string, odds: OddsInfo[]): SelectionAddRequest[] {
    const groupOddsIdBetTypes = [...AdvancedModeConstants.BETTYPE_NEXT_MAN_OUT.split(','), ...AdvancedModeConstants.BETTYPE_MOST_BASKETBALL.split(',')];
    if (groupOddsIdBetTypes.includes(betTypeId)) {
      return odds.reduce((acc, current, _) => {
        const group = odds.filter(x => x.oddsId === current.oddsId);
        const oddsName = group.map(x => x.playerName).join(' & ');
        const items = acc.concat(group.map((x, i) => this.betTeamAddRequestService.initSelectionAdvancedMode(i, `${x.playerName} - ${oddsName}`, `${x.betChoice}$${x.oddsId}`, null, true, null)));

        return uniqBy(items, x => x.value);
      }, []);
    }

    return uniqBy(odds, x => x.playerId).map((x, index) => this.betTeamAddRequestService.initSelectionAdvancedMode(index, x.playerName, x.playerId.toString(), null, true, null));
  }

  getItemsBetChoiceSelection(odds: OddsInfo[]): Selection[] {
    const items: Selection[] = [];
    uniqBy(odds, x => x.betChoice).forEach(x => {
      items.push(this.initSelection(x.betChoice, x.betChoice, null, true, null, false, false, false, false, false, false));
    });

    return items;
  }


  getItemsBetChoiceSelectionAddRequest(odds: OddsInfo[]): SelectionAddRequest[] {
    const items: SelectionAddRequest[] = [];
    uniqBy(odds, x => x.betChoice).forEach(x => {
      items.push(this.betTeamAddRequestService.initSelectionAdvancedMode(0, x.betChoice, x.betChoice, null, true, null));
    });

    return items;
  }

  getItemsOtherSelectionAddRequest(odds: OddsInfo[], performance = null): SelectionAddRequest[] {
    const items: SelectionAddRequest[] = [];
    if (performance !== null) {
      odds = odds.filter(x => performance.split(',').includes(x.performance));
    }
    uniqBy(odds, x => x.betChoice).forEach(x => {
      items.push(this.betTeamAddRequestService.initSelectionAdvancedMode(0, x.oddsInfo, x.betChoice, null, true, null));
    });

    return items;
  }

  getItemsOtherSelection(odds: OddsInfo[], performance = null): Selection[] {
    const items: Selection[] = [];
    if (performance !== null) {
      odds = odds.filter(x => performance.split(',').includes(x.performance));
    }
    uniqBy(odds, x => x.betChoice).forEach(x => {
      items.push(this.initSelection(x.oddsInfo, x.betChoice, null, true, null, false, false, false, false, false, false));
    });

    return items;
  }

  renderSelectionBasketBallBetTypes(betTeam: BetTeam, baseSpecialBetTypeBasketball: Selection[], betType: BetType): void {
    if (AdvancedModeConstants.BETTYPE_SPECIAL_BASKETBALL.split(',').includes(betType.id.toString()) && betType.isChecked) {
      this.resetChecked(betTeam);
      this.renderSelectionWithPlayer(betTeam, baseSpecialBetTypeBasketball.filter(x => x.name === 'Player'), 'Player:');
    }
    if (AdvancedModeConstants.BETTYPE_POINTS_BASKETBALL.split(',').includes(betType.id.toString()) && betType.isChecked) {
      this.renderSelectionWithPlayer(betTeam, baseSpecialBetTypeBasketball.filter(x => x.name === 'Points'), 'Points:');
    }
    if (AdvancedModeConstants.BETTYPE_OTHERS_BASKETBALL.split(',').includes(betType.id.toString()) && betType.isChecked) {
      this.renderSelectionWithPlayer(betTeam, baseSpecialBetTypeBasketball.filter(x => x.name === 'Others'), 'Others:');
    }
  }
}
