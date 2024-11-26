import { ItemsSelect } from '../../multiple-selection/items-select';
import { AdvancedModeConstants } from '../../advanced-mode/advanced-mode.constants';
import { MultipleSelection } from '../../multiple-selection/multiple-selection';

export class ControlsAllBetTypes {
    type: string;
    values: string;
    items: MultipleSelection;
    isShow: boolean;

    static initSelectionAllBetType(items: ItemsSelect[]): MultipleSelection {
        const multiSelect = new MultipleSelection();
        multiSelect.checkAllCheckBoxText = 'All';
        multiSelect.allItemsCheckedText = 'All';
        multiSelect.noneItemCheckedText = 'Select options';
        multiSelect.maxWidth = '100%';
        multiSelect.items = items;
        multiSelect.checkAllItems(true);
    
        return multiSelect;
    }

    constructor(type: string, items: ItemsSelect[]){
        this.values = "";
        this.isShow = false;
        this.type = type;
        this.items = ControlsAllBetTypes.initSelectionAllBetType(items);
    }
}

export class ControlsAllBetTypesLists {
    static mapList = new ControlsAllBetTypes('Map', AdvancedModeConstants.MAP_LIST);
    static roundList = new ControlsAllBetTypes('Round', AdvancedModeConstants.ROUND_LIST);
    static quarterList = new ControlsAllBetTypes('Quarter', AdvancedModeConstants.QUARTER_LIST);
    static setList = new ControlsAllBetTypes('Set', AdvancedModeConstants.SET_LIST);
    static gameList = new ControlsAllBetTypes('Game', AdvancedModeConstants.GAME_LIST);
    static inningList = new ControlsAllBetTypes('Inning', AdvancedModeConstants.INNING_LIST);

    static MultipleSelectionList = [
        ControlsAllBetTypesLists.mapList,
        ControlsAllBetTypesLists.roundList,
        ControlsAllBetTypesLists.quarterList,
        ControlsAllBetTypesLists.setList,
        ControlsAllBetTypesLists.gameList,
        ControlsAllBetTypesLists.inningList
    ];
}