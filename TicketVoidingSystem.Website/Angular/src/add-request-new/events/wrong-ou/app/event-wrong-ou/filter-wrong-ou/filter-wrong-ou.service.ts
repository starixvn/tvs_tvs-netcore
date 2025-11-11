import { Injectable } from '@angular/core';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { ItemsSelectService } from '../../../../../../utility/components/multiple-selection/items-select.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AdvancedModeConstants } from '../../../../../../utility/components/advanced-mode/advanced-mode.constants';

@Injectable()
export class FilterWrongOuService {
  getBetChoiceSelection(oddsInfo: OddsInfo[], betTypeId: number, selectedItems: string[] = []) {
    const betChoiceSelection = StaticService.initDefaultMultipleSelection('120px', 1);
    const oddsInfoItems = oddsInfo.filter(x => x.betTypeId === betTypeId);
    const uniqueBetChoices = [...new Set(oddsInfoItems.map(x => x.betChoice))];
    uniqueBetChoices.forEach(betChoice => {
      const isChecked = selectedItems.includes(betChoice);
      betChoiceSelection.items.push(ItemsSelectService.initItemsSelect(0, betChoice, betChoice, isChecked, true, true, []));
    });

    return betChoiceSelection;
  }

  isBetTypeHasBetChoiceSelection(betTypeId: string) {
    return AdvancedModeConstants.BETTYPE_BASKETBALL_SELECT_BETCHOICE.split(',').includes(betTypeId);
  }
}
