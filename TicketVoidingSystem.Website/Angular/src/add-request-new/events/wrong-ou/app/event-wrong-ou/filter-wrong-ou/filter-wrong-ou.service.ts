import { Injectable } from '@angular/core';
import { OddsInfo } from '../../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { ItemsSelectService } from 'src/utility/components/multiple-selection/items-select.service';
import { StaticService } from 'src/utility/services/static.service';
import range from 'lodash/range';

@Injectable()
export class FilterWrongOuService {
  getBetChoiceSelection(oddsInfo: OddsInfo[], betTypeId: number) {
    const betChoiceSelection = StaticService.initDefaultMultipleSelection('120px', 1);
    const oddsInfoItems = oddsInfo.filter(x => x.betTypeId === betTypeId);
    const uniqueBetChoices = [...new Set(oddsInfoItems.map(x => x.betChoice))];
    uniqueBetChoices.forEach(betChoice => {
      betChoiceSelection.items.push(ItemsSelectService.initItemsSelect(0, betChoice, betChoice, true, true, true, []));
    });

    return betChoiceSelection;
  }

  isBetTypeHasBetChoiceSelection(betTypeId: number) {
    return range(653, 675).includes(betTypeId) || range(685, 689).includes(betTypeId);
  }
}
