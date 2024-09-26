import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PrimaryBetType } from '../advanced-mode/group-bettypes/group-bettypes.model';
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
  @Input() model: AdvancedModeAddRequestModel;
  @Input() groupBetTypes = new GroupBetTypesAddRequestModel([], false, '', false);
  @Output() checkExistBetTypeEvent = new EventEmitter<boolean>();
  @Output() changeFilterEvent = new EventEmitter();
  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('advancedMode') advancedModeComponent: AdvancedModeComponent;
  changedBetTypes: BetTypeAddRequest[] = [];

  constructor( ) {
  }

  ngOnInit(): void {
  }

  changeBetTypes(betTypes: BetTypeAddRequest[]) {
    this.changedBetTypes = betTypes;
  }

  changeFilter() {
    this.changeFilterEvent.emit();
  }

  getCheckedBetTypes(): BetTeamAddRequestResult[] {
    const checkedBetTypes = this.groupBetTypes.getCheckedBetTypes();
    const betTypesHaveAdvancedMode = this.advancedModeComponent.getCheckedBetTypeModels();
    const advancedModeIds = new Set(betTypesHaveAdvancedMode.map(betType => betType.id));

    const betTypesHaveNotAdvancedMode = checkedBetTypes
        .filter(betType => !advancedModeIds.has(betType.id.toString()))
        .map(betType => ({ id: betType.id.toString() } as BetTeamAddRequestResult));

    return this.getMoreBetTypeSameDisplayedId([...betTypesHaveAdvancedMode, ...betTypesHaveNotAdvancedMode]);
}

  getMoreBetTypeSameDisplayedId(inputModels: BetTeamAddRequestResult[]): BetTeamAddRequestResult[] {
    return inputModels.flatMap(x => this.getMoreBetTypeSameDisplayedIdByItem(x));
  }

  getMoreBetTypeSameDisplayedIdByItem(inputModel: BetTeamAddRequestResult): BetTeamAddRequestResult[] {
    const affectedBetTypes = PrimaryBetType.ROOT[inputModel.id] ?? inputModel.id;
    return affectedBetTypes.split(',').map(childId => ({
      ...inputModel,
      id: childId
    }));
  }

  handleNoBetTypeEvent(isHaveBetType: boolean) {
    this.checkExistBetTypeEvent.emit(isHaveBetType);
  }

  clearBetTeam() {
    this.advancedModeComponent.clearBetTeam();
  }

  isValidity() {
    return this.groupBetTypesComponent.isValidity() && this.advancedModeComponent.isValidity();
  }
}
