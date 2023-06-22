import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AdvancedModeComponent } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.component';
import { CheckedBetType, GetPlayersQuery } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.component';
import { BetType, GroupBetTypesModel } from '../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { MatchModel } from '../../../utility/models/match.model';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() groupBetTypes: GroupBetTypesModel;
  @Input() allBetTypes: BetType[];
  @Input() getPlayerQuery: GetPlayersQuery;
  @Input() match = new MatchModel();
  @Output() search = new EventEmitter<CheckedBetType[]>();

  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('advancedMode') advancedModelComponent: AdvancedModeComponent;

  isShowScoreControl = false;
  isShowSearch = true;

  constructor() { }

  ngOnChanges() {
    this.isShowSearch = this.groupBetTypes?.getCheckedBetTypes().length > 0;
  }

  ngOnInit(): void {
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
