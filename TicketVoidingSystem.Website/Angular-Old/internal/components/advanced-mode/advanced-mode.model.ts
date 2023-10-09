import { ItemsSelect } from '../../../external/components/multiple-selection/items-select';
import { MultipleSelect } from '../../../external/components/multiple-selection/multiple-select';
import { AdvancedModeConstants } from './advanced-mode.constants';

export class Item {
    name: string;
    value: string;
    flag: boolean;
    isChecked: boolean;
    xmlAttribute: string;

    constructor(name: string, value: string, flag: boolean, xmlAttribute: string) {
        this.name = name;
        this.value = value;
        this.flag = flag;
        this.isChecked = false;
        this.xmlAttribute = xmlAttribute;
    }
}

export class Selection {
    name: string;
    value: string;
    items: Selection[];
    isMultiple: boolean;
    xmlAttribute: string;

    constructor(name: string, value: string, items: Selection[], isMultiple: boolean, xmlAttribute: string) {
        this.name = name;
        this.value = value;
        this.renderItems(items);
        this.isMultiple = isMultiple;
        this.xmlAttribute = xmlAttribute;
    }

    renderItems(items: Selection[]) {
        this.items = [];
        if (items !== null) {
            items.forEach(item => {
                const temp = new Selection(item.name, item.value, item.items, item.isMultiple, item.xmlAttribute);
                this.items.push(temp);
            });
        }
    }
}

export class MultiSelection {
    name: string;
    value: string;
    xmlAttribute: string;
    multipleSelect: MultipleSelect;
}

export class BetTeamResult {
    betTeam: string;
    set: string;
    game: string;
    betOption: string;
    value: string;
    valueHdp1: string;
    valueHdp2: string;
    goal: string;
    oddsSpread: string;
    oddsId: string;
    transdesc: string;
}

export class BetTeam {
    name: string;
    value: string;
    type: number;
    enableBetTypes: string;
    betTypes: string;
    selections: Selection[];
    multiSelection: MultiSelection;
    multiSelectionList: MultiSelection[];
    items: Item[];
    inputs: Item[];
    checkedBetTypes: string[];
    isChecked: boolean;
    isTicketListing: boolean;

    constructor(
        name: string,
        value: string,
        type: number,
        enableBetTypes: string,
        betTypes: string,
        selections: Selection[],
        items: Item[],
        inputs: Item[],
        isTicketListing: boolean) {
        this.name = name;
        this.value = value;
        this.type = type;
        this.enableBetTypes = enableBetTypes;
        this.betTypes = betTypes;
        this.isTicketListing = isTicketListing;
        this.renderSelections(selections);
        this.renderItems(items);
        this.renderInputs(inputs);
        this.checkedBetTypes = [];
        this.isChecked = false;
    }

    renderSelections(selections: Selection[]) {
        this.selections = [];
        this.multiSelectionList = [];
        if (selections !== null) {
            this.renderValidSelection(selections);
        }
    }

    renderValidSelection(selections: Selection[]) {
        selections.forEach(item => {
            if (item.isMultiple) {
                this.renderMultipleSelect(item);
            }
            else {
                if (this.isTicketListing) {
                    if (item.name === AdvancedModeConstants.MAP || item.name === AdvancedModeConstants.ROUND) {
                        this.renderMultipleSelectWithMapAndRound(item);
                    } else {
                        const selection = new Selection(item.name, item.value, item.items, item.isMultiple, item.xmlAttribute);
                        this.selections.push(selection);
                    }
                } else {
                    const selection = new Selection(item.name, item.value, item.items, item.isMultiple, item.xmlAttribute);
                    this.selections.push(selection);
                }
            }
        });
    }

    renderItems(items: Item[]) {
        this.items = [];
        if (items !== null) {
            items.forEach(item => {
                const temp = new Item(item.name, item.value, item.flag, item.xmlAttribute);
                this.items.push(temp);
            });
        }
    }

    private renderInputs(inputs: Item[]) {
        this.inputs = [];
        if (inputs !== null) {
            inputs.forEach(input => {
                const temp = new Item(input.name, input.value, input.flag, input.xmlAttribute);
                this.inputs.push(temp);
            });
        }
    }

    renderMultipleSelect(item: Selection) {
        this.multiSelection = new MultiSelection();
        this.multiSelection.multipleSelect = new MultipleSelect();
        this.multiSelection.multipleSelect.checkAllCheckBoxText = 'Check All';
        this.multiSelection.multipleSelect.allItemsCheckedText = 'All';
        this.multiSelection.multipleSelect.noneItemCheckedText = 'Select options';
        this.multiSelection.multipleSelect.maxWidth = '170px';
        this.renderItemsMultipleSelect(item);
    }

    renderMultipleSelectWithMapAndRound(item: Selection) {
        this.multiSelection = new MultiSelection();
        this.multiSelection.multipleSelect = new MultipleSelect();
        this.multiSelection.multipleSelect.checkAllCheckBoxText = 'All';
        this.multiSelection.multipleSelect.allItemsCheckedText = 'All';
        this.multiSelection.multipleSelect.noneItemCheckedText = 'Select options';
        this.multiSelection.multipleSelect.maxWidth = '92px';
        this.renderItemsMultipleSelectWithMapAndRound(item);
    }

    renderItemsMultipleSelect(multi: Selection) {
        this.multiSelection.name = multi.name;
        this.multiSelection.value = multi.value;
        this.multiSelection.xmlAttribute = multi.xmlAttribute;
        this.multiSelection.multipleSelect.items = [];
        multi.items.forEach(item => {
            const temp = [];
            if (item.items !== null && item.items !== undefined) {
                item.items.forEach(itemSelect => {
                    temp.push(new ItemsSelect(0, itemSelect.value, itemSelect.name, true, true, true, []));
                });
            }
            this.multiSelection.multipleSelect.items.push(new ItemsSelect(0, item.value, item.name, true, true, true, temp));
        });
        this.multiSelection.multipleSelect.isCheckAll = this.multiSelection.multipleSelect.items.every(x => x.checked);
        this.multiSelection.multipleSelect.selectionTitle = this.multiSelection.multipleSelect.getItemsDisplay();
    }

    renderItemsMultipleSelectWithMapAndRound(multi: Selection) {
        this.multiSelection.name = multi.name;
        this.multiSelection.value = multi.value;
        this.multiSelection.xmlAttribute = multi.xmlAttribute;
        this.multiSelection.multipleSelect.items = [];
        multi.items.forEach(item => {
            if (item.name !== 'All' || item.value !== 'All') {
                this.multiSelection.multipleSelect.items.push(new ItemsSelect(0, item.value, item.name, true, true, true, []));
            }
        });
        this.multiSelectionList.push(this.multiSelection);
    }

    resetChecked() {
        this.isChecked = true;
        this.resetSelections();
        this.checkItems();
    }

    resetSelections() {
        this.selections.forEach(selection => {
            selection.value = 'All';
        });
    }

    handler416(item: Selection, name: string): boolean {
        if (item.name === 'All') {
            return true;
        }
        if (name === 'HT:') {
            return this.selections[1].value === 'All' ||
                item.value === 'AOS' &&
                ((parseInt(this.selections[1].value.charAt(0), 10) > 3) || (parseInt(this.selections[1].value.charAt(2), 10) > 3)) ||
                item.name.charAt(0) <= this.selections[1].value.charAt(0) && item.name.charAt(2) <= this.selections[1].value.charAt(2);
        }
        else {
            return this.selections[0].value === 'All' ||
                this.selections[0].value === 'AOS' &&
                ((parseInt(item.name.charAt(0), 10) > 3) || (parseInt(item.name.charAt(2), 10) > 3)) ||
                item.name.charAt(0) >= this.selections[0].value.charAt(0) && item.name.charAt(2) >= this.selections[0].value.charAt(2);
        }
    }

    isValidOptionForType5(item: Selection, name: string): boolean {
        if (this.checkedBetTypes.some(x => (x === AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE
            || x === AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE_AOS))) {
            return this.handler416(item, name);
        }

        return true;
    }

    checkItems() {
        this.items.forEach(item => {
            item.isChecked = this.isChecked;
        });
        if (this.type === 1 && this.enableBetTypes !== null) {
            this.items[0].value = '';
        }
    }

    controlIsChecked() {
        let temp = true;
        for (let i = 0; i < this.items.length && temp; i++) {
            temp = this.items[i].isChecked;
        }
        this.isChecked = temp;
    }

    enableInput() {
        if (this.type === 1 && this.enableBetTypes !== null && this.items[0].flag === true) {
            this.items[0].value = '';
        }
        if (this.type === 1 && this.enableBetTypes !== null && this.checkedBetTypes.length > 0) {
            this.items[0].flag = true;
            const enable = this.enableBetTypes.split(',');
            const checkedIds = this.checkedBetTypes.join(',').split(',');
            for (let i = 0; i < checkedIds.length && this.items[0].flag; i++) {
                this.items[0].flag = enable.indexOf(checkedIds[i].toString()) === -1;
            }
        }
    }

    getResult(id: string): BetTeamResult {
        const result = new BetTeamResult();
        this.updateBySelection(result);
        this.updateByMultipleSelection(result);
        this.updateByMultipleSelectionWithTicketListing(result);
        this.updateByItems(result, id);
        this.updateByInputs(result);
        if (this.type === 5 && id === (AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE
            || AdvancedModeConstants.BETTYPE_HALF_FULL_TIME_CORRECT_SCORE_AOS)) {
            result.betTeam = this.betTeamTypeFive();
        }
        this.updateForBetTypesCricketWithFancy(result, id);
        this.updateForBetTypesCricketWithBallDelivery(result, id);
        this.updateBetTypesCricketOverXBallYExactRuns(result, id);
        this.updateForBetType9089(result, id);
        this.updateForBetTypesCricketWithOverWicket(result, id);
        this.updateForBetTypesWithRuns(result, id);
        this.updateForBetTypesCricketNextManOut(result, id);
        
        return result;
    }

    isTicketListingAndBettypeMapOrRound(name: string): boolean {
        if (this.isTicketListing) {
            if (name === AdvancedModeConstants.MAP || name === AdvancedModeConstants.ROUND) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    updateBySelection(result: BetTeamResult) {
        this.selections.forEach(select => {
            this.updateResult(result, select.xmlAttribute, select.value);
        });
    }

    updateByMultipleSelection(result: BetTeamResult) {
        if (this.multiSelection !== undefined) {
            if (!this.isTicketListing || !this.isTicketListingAndBettypeMapOrRound(this.multiSelection.name)) {
                const value = this.multiSelection.multipleSelect.getValueItems();
                this.updateResult(result, this.multiSelection.xmlAttribute, value);
            }
        }
    }
    updateByMultipleSelectionWithTicketListing(result: BetTeamResult) {
        if (this.multiSelectionList !== undefined && this.isTicketListing) {
            this.multiSelectionList.forEach(item => {
                let value = item.multipleSelect.getValueItems();
                if (item.multipleSelect.selectionTitle === 'All' && (item.name === AdvancedModeConstants.MAP
                    || this.multiSelection.name === AdvancedModeConstants.ROUND)) {
                    value = 'All';
                }
                this.updateResult(result, item.xmlAttribute, value);
            });
        }
    }

    updateByItems(result: BetTeamResult, id: string) {
        if (this.items.length === 1) {
            if (this.type === 1 && this.enableBetTypes !== null) {
                this.updateResultForItemOfEnableBetTypes(result, id);
            }
            else {
                this.updateResult(result, this.items[0].xmlAttribute, this.items[0].value);
            }
        }
        else if (this.items.length > 0) {
            this.updateResult(result, this.items[0].xmlAttribute, this.getItemsValue());
        }
    }

    private updateResultForItemOfEnableBetTypes(result: BetTeamResult, id: string) {
        const LENGTH_OF_GAME_VALUE = 2;

        const enable = this.enableBetTypes.split(',');
        if (enable.indexOf(id) > -1) {
            let value = this.mappingDbValue(id);
            if (AdvancedModeConstants.BETTYPES_UPDATE_ONLY_GAME_ATTRIBUTE.split(',').includes(id)
                && value.length < LENGTH_OF_GAME_VALUE && value.length > 0) {
                value = '0' + value;
            }
            this.updateResult(result, this.items[0].xmlAttribute, value);
        } else {
            this.updateResult(result, this.items[0].xmlAttribute, '');
        }
    }

    updateByInputs(result: BetTeamResult) {
        if (this.inputs.length > 0) {
            this.inputs.forEach(input => {
                this.updateResult(result, input.xmlAttribute, input.value);
            });
        }
    }

    updateItemListMapAndRound(itemList: string[], type: string) {
        this.multiSelectionList.forEach(itemMultiSelection => {
            if (itemMultiSelection.name === type) {
                itemMultiSelection.multipleSelect.items.forEach(item => {
                    const object = itemList.find(f => f === item.value);
                    if (object !== undefined) {
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
                });
            }
            this.changeItemsOfMultipleSelection(itemMultiSelection.multipleSelect);
        });
    }

    changeItemsOfMultipleSelection(multipleSelect: MultipleSelect) {
        const rootItems = multipleSelect.items;
        let count = 0;
        let countChecked = 0;
        rootItems.forEach(item => {
            item.checkFromChilds();
            count += item.countChilds;
            countChecked += item.countChildsChecked();
        });
        multipleSelect.selectionTitle = multipleSelect.getItemsDisplay();
        multipleSelect.isCheckAll = count === countChecked;
    }

    mappingDbValue(id: string): string {
        if (this.items[0].xmlAttribute !== 'Goal') {
            return this.items[0].value;
        }
        else {
            const value = (id === '396') ? '800' : '8' + id + '00';
            return this.items[0].value === '' ?
                '' : (parseInt(value, 10) + parseInt(this.items[0].value, 10)).toString();
        }
    }

    getItemsValue(): string {
        let value = '';
        if (this.isChecked) {
            value = 'All';
        }
        else {
            this.items.forEach(item => {
                value = item.isChecked ? value === '' ? item.value : value + ',' + item.value : value;
            });
        }

        return value;
    }

    updateResult(result: BetTeamResult, attribute: string, value: string) {
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
        }
    }

    betTeamTypeFive(): string {
        let temp = '';
        if (this.selections[0].value === 'All' && this.selections[1].value === 'All') {
            temp = 'All';
        }
        else if (this.selections[0].value === 'All') {
            for (let i = 1; i < this.selections[0].items.length; i++) {
                const value = this.selections[0].items[i].value + '/' + this.selections[1].value;
                temp = temp === '' ? value : temp + ',' + value;
            }
        }
        else if (this.selections[1].value === 'All') {
            for (let i = 1; i < this.selections[1].items.length; i++) {
                const value = this.selections[0].value + '/' + this.selections[1].items[i].value;
                temp = temp === '' ? value : temp + ',' + value;
            }
        }
        else {
            temp = this.selections[0].value + '/' + this.selections[1].value;
        }

        return temp;
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

    private updateForBetTypesCricketWithBallDelivery(result: BetTeamResult, betTypeId: string): void {
        const LENGTH_OF_OVER = 3;
        const LENGTH_OF_BALL = 2;
        const PAD_OVER = '000';

        if (AdvancedModeConstants.BETTYPES_CRICKET_UPDATE_BALL_DELIVERY_AND_OVER.split(',').includes(betTypeId)) {
            let overValue = this.inputs.find(x => x.name === 'Over:').value;
            let ballValue = this.inputs.find(x => x.name === 'Ball/Delivery:').value;

            if (overValue.length < LENGTH_OF_OVER && overValue.length > 0) {
                overValue = PAD_OVER.slice(overValue.length) + overValue;
            }
            if (ballValue.length < LENGTH_OF_BALL && ballValue.length > 0) {
                ballValue = '0' + ballValue;
            }

            if (overValue.length === 0 && ballValue.length === 0) {
                result.set = 'All';
            } else if (overValue.length === 0) {
                result.set = `____${ballValue}`;
            } else if (ballValue.length === 0) {
                result.set = `_${overValue}__`;
            } else {
                result.set = `_${overValue}${ballValue}`;
            }
        }
    }
    
    private updateBetTypesCricketOverXBallYExactRuns(result: BetTeamResult, betTypeId: string): void {
        const LENGTH_OF_OVER = 3;
        const LENGTH_OF_BALL = 2;
        const PAD_OVER = '000';

        if (AdvancedModeConstants.BETTYPES_OVER_X_BALL_Y_EXACT_RUNS.split(',').includes(betTypeId)) {
            let overValue = this.inputs.find(x => x.name === 'Over:').value;
            let ballValue = this.inputs.find(x => x.name === 'Ball:').value;

            if (overValue.length < LENGTH_OF_OVER && overValue.length > 0) {
                overValue = PAD_OVER.slice(overValue.length) + overValue;
            }
            if (ballValue.length < LENGTH_OF_BALL && ballValue.length > 0) {
                ballValue = '0' + ballValue;
            }

            if (overValue.length === 0 && ballValue.length === 0) {
                result.set = 'All';
            } else if (overValue.length === 0) {
                result.set = `____${ballValue}`;
            } else if (ballValue.length === 0) {
                result.set = `_${overValue}__`;
            } else {
                result.set = `_${overValue}${ballValue}`;
            }
        }
    }

    private updateForBetType9089(result: BetTeamResult, betTypeId: string): void { //format "Set" attribute: 8XXYY
        if (AdvancedModeConstants.BETTYPE_MAP_X_FIRST_TO_Y_OVER_UNDER.split(',').includes(betTypeId)) {
            let mapValue = this.selections.find(x => x.name === 'Map:').value;
            let yValue = this.selections.find(x => x.name === 'Y value:').value;

            if (mapValue === 'All' && yValue === 'All') {
                result.set = 'All';
            } else if (mapValue === 'All') {
                result.set = `___${yValue}`;
            } else if (yValue === 'All') {
                result.set = `${mapValue}__`;
            } else {
                result.set = `${mapValue}${yValue}`;
            }
        }
    }

    private updateForBetTypesCricketWithOverWicket(result: BetTeamResult, betTypeId: string): void { //format "Over: Wicket: Over/Wicket:" value: 8XXX
        if (AdvancedModeConstants.BETTYPES_CRICKET_UPDATE_OVER_OR_WICKET.split(',').includes(betTypeId)) {

            const LENGTH_OF_OVER = 3;
            const PREFIX = '8';
            const PAD_OVER = '000';
            const input = this.inputs.find(x => x.xmlAttribute === 'Set');
            if (input) {
                let overValue = input.value;

                if (overValue.length === 0) {
                    result.set = overValue;
                    return;
                }

                if (overValue.length < LENGTH_OF_OVER && overValue.length > 0) {
                    overValue = PAD_OVER.slice(overValue.length) + overValue;
                }

                result.set = `${PREFIX}${overValue}`;
            }
        }
    }

    private updateForBetTypesWithRuns(result: BetTeamResult, betTypeId: string): void {
        if (AdvancedModeConstants.BETTYPE_OVER_X_EXACT_RUNS.split(',').includes(betTypeId)) {
            const runesValue = this.selections.find(x => x.name === 'Runs:').value;
            const runesTransform = AdvancedModeConstants.RUNS_SELECTION.find(x => x.value === runesValue);

            result.betTeam = runesTransform.betTeam;
            result.valueHdp1 = runesTransform.valueHdp1;
            delete result.value;
        }
    }

    private updateForBetTypesCricketNextManOut(result: BetTeamResult, betTypeId: string): void {
        if (AdvancedModeConstants.BETTYPE_NEXT_MAN_OUT.split(',').includes(betTypeId)) {
          const playerValue = this.selections.find(x => x.name === 'Player:').value;
          if (playerValue === 'All') {
            result.betTeam = 'All';
            result.oddsId = 'All';
          } else {
            const splitValue = playerValue.split(',');
            result.betTeam = splitValue[0];
            result.oddsId = splitValue[1];
          }
    
          delete result.value;
        }
      }
}

export class GetPlayersQuery {
    matchId: string;
    betType: string;

    constructor(matchId: string, betType: string) {
        this.matchId = matchId;
        this.betType = betType;
    }
}

export class Player {
    oddsInfo: string;
    betChoice: string;
}

export class CheckedBetType extends BetTeamResult {
    id: number;
}

export class GetOddsInfoQuery {
    matchId: number;
    betTypes: string;
}

export class OddsInfo {
    betTypeId: number;
    oddsId: string;
    playerId: string;
    playerName: string;
    betChoice: string;
}