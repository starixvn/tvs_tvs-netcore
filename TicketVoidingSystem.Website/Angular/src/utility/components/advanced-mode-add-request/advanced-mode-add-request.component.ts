import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AdvancedModeAddRequestModel } from './advanced-mode-add-request.model';
import { AdvancedModeComponent } from './advanced-mode/advanced-mode.component';
import { BetTeamAddRequestResult } from './advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from './group-bet-types/group-bet-types.component';
import { BetTypeAddRequest, GroupBetTypesAddRequestModel } from './group-bet-types/group-bet-types.model';

@Component({
  selector: 'advanced-mode-add-request',
  templateUrl: './advanced-mode-add-request.component.html',
  styleUrls: ['./advanced-mode-add-request.component.scss']
})
export class AdvancedModeAddRequestComponent implements OnInit {
  @Input() matchId: number;
  @Input() isShowAdvancedModeFilter: boolean;
  @Input() model: AdvancedModeAddRequestModel;
  @Input() groupBetTypes = new GroupBetTypesAddRequestModel([], false, '', false);
  @Output() checkExistBetTypeEvent = new EventEmitter<boolean>();
  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('advancedMode') advancedModeComponent: AdvancedModeComponent;
  allBetTypes: BetTypeAddRequest[] = [];

  constructor( ) {
  }

  ngOnInit(): void {
  }

  changeBetTypes(betTypes: BetTypeAddRequest[]) {
    this.allBetTypes = betTypes;
  }

  getCheckedBetTypes(): BetTeamAddRequestResult[] {
    const checkedBetTypes = this.groupBetTypes.getCheckedBetTypes();
    const betTypesHaveAdvancedMode = this.advancedModeComponent.getCheckedBetTypeModels();
    const betTypesHaveNotAdvancedMode = checkedBetTypes.filter(x => !betTypesHaveAdvancedMode.some(y => y.id === x.id.toString()))
      .map(x => {
        return {
          id: x.id.toString()
        } as BetTeamAddRequestResult;
      });

    return betTypesHaveAdvancedMode.concat(betTypesHaveNotAdvancedMode);
  }

  handleNoBetTypeEvent(isHaveBetType: boolean) {
    this.checkExistBetTypeEvent.emit(isHaveBetType);
  }

  resetBetTeam() {
    this.advancedModeComponent.resetBetTeam();
  }

  isValidity() {
    return this.groupBetTypesComponent.isValidity() && this.advancedModeComponent.isValidity();
  }
}
