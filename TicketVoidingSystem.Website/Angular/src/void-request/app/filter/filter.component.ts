import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { CheckedBetType, GetPlayersQuery } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { MatchModel } from '../../../utility/models/match.model';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';

@Component({
  standalone: true,
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [AdvancedModeComponent, GroupBetTypesComponent]
})
export class FilterComponent implements OnChanges {
  @Input() groupBetTypes: GroupBetTypesModel;
  @Input() allBetTypes: BetType[];
  @Input() getPlayerQuery: GetPlayersQuery;
  @Input() match = new MatchModel();
  @Output() search = new EventEmitter<CheckedBetType[]>();
  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('advancedMode') advancedModelComponent: AdvancedModeComponent;

  isShowScoreControl = false;
  isShowSearch = true;

  ngOnChanges() {
    this.isShowSearch = this.groupBetTypes?.getCheckedBetTypes().length > 0;
  }

  changeBetTypes(betTypes: BetType[]): void {
    this.allBetTypes = betTypes;
  }

  getBetTypeModels(): void {
    if (!this.groupBetTypesComponent.validate() || !this.advancedModelComponent.validate()) {
      this.search.emit(null);
    } else {
      const checkedBetTypes = this.groupBetTypes.getValueCheckedBetTypes();
      const betTypeModels = this.advancedModelComponent.getBetTypeModels(checkedBetTypes);
      this.search.emit(betTypeModels);
    }
  }
}
