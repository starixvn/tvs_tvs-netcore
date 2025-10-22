import { ItemsSelect } from '../../multiple-selection/items-select';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { inject, Injectable } from '@angular/core';
import { ControlsAllBetTypes } from './controls-all-bet-types.model';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';
import { AdvancedModeConstants } from '../../advanced-mode/advanced-mode.constants';

@Injectable({
  providedIn: 'root'
})
export class ControlsAllBetTypesService {
  private readonly multipleSelectionService = inject(MultipleSelectionService);

  initSelectionAllBetType(items: ItemsSelect[]): MultipleSelection {
    const multiSelect = new MultipleSelection();
    multiSelect.checkAllCheckBoxText = 'All';
    multiSelect.allItemsCheckedText = 'All';
    multiSelect.noneItemCheckedText = 'Select options';
    multiSelect.maxWidth = '100%';
    multiSelect.items = items;
    this.multipleSelectionService.checkAllItems(multiSelect, true);

    return multiSelect;
  }

  resetAllChecked(items: MultipleSelection) {
    this.multipleSelectionService.checkAllItems(items, true);
    items.isCheckAll = true;
  }

  initControlsAllBetTypes(type: string, items: ItemsSelect[]) {
    const controlsAllBetTypes = new ControlsAllBetTypes();
    controlsAllBetTypes.isShow = false;
    controlsAllBetTypes.type = type;
    controlsAllBetTypes.items = this.initSelectionAllBetType(items);

    return controlsAllBetTypes;
  }

  initControlsAllBetTypesLists(): ControlsAllBetTypes[] {
    const mapList = this.initControlsAllBetTypes('Map', AdvancedModeConstants.MAP_LIST);
    const roundList = this.initControlsAllBetTypes('Round', AdvancedModeConstants.ROUND_LIST);
    const quarterList = this.initControlsAllBetTypes('Quarter', AdvancedModeConstants.QUARTER_LIST);
    const setList = this.initControlsAllBetTypes('Set', AdvancedModeConstants.SET_LIST);
    const gameList = this.initControlsAllBetTypes('Game', AdvancedModeConstants.GAME_LIST);
    const inningList = this.initControlsAllBetTypes('Inning', AdvancedModeConstants.INNING_LIST);

    return [mapList, roundList, quarterList, setList, gameList, inningList];
  }
}
