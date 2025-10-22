import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrimaryBetType } from '../advanced-mode/group-bettypes/group-bettypes.model';
import { AdvancedModeAddRequestModel } from './advanced-mode-add-request.model';
import { AdvancedModeComponent } from './advanced-mode/advanced-mode.component';
import { BetTeamAddRequestResult } from './advanced-mode/advanced-mode.model';
import { GroupBetTypesComponent } from './group-bet-types/group-bet-types.component';
import { BetTypeAddRequest, GroupBetTypesAddRequestModel } from './group-bet-types/group-bet-types.model';
import { BetTeamAddRequestService } from './advanced-mode/bet-team-add-request.service';
import { BetTypeService } from './group-bet-types/bet-type.service';

@Component({
  standalone: true,
  selector: 'advanced-mode-add-request',
  templateUrl: './advanced-mode-add-request.component.html',
  styleUrls: ['./advanced-mode-add-request.component.scss'],
  imports: [CommonModule, FormsModule, GroupBetTypesComponent, AdvancedModeComponent]
})
export class AdvancedModeAddRequestComponent {
  @Input() matchId: number;
  @Input() model: AdvancedModeAddRequestModel;
  @Input() groupBetTypes = new GroupBetTypesAddRequestModel();
  @Output() checkExistBetTypeEvent = new EventEmitter<boolean>();
  @Output() changeFilterEvent = new EventEmitter();
  @Output() isLoadingData = new EventEmitter<boolean>();
  @ViewChild('groupBetTypesComponent') groupBetTypesComponent: GroupBetTypesComponent;
  @ViewChild('advancedMode') advancedModeComponent: AdvancedModeComponent;
  changedBetTypes: BetTypeAddRequest[] = [];
  
  private readonly betTeamService = inject(BetTeamAddRequestService);
  private readonly betTypeService = inject(BetTypeService);
  
  changeBetTypes(betTypes: BetTypeAddRequest[]) {
    this.changedBetTypes = betTypes;
  }

  changeFilter() {
    this.changeFilterEvent.emit();
  }

  checkingLoadDataAdvancedMode(isLoading: boolean): void {
    this.isLoadingData.emit(isLoading);
  }

  getCheckedBetTypes(): BetTeamAddRequestResult[] {
    const checkedBetTypes = this.betTypeService.getCheckedBetTypes(this.groupBetTypes.groupBetTypes);
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

  public resetAllBetTeams(){
    this.advancedModeComponent?.betTeams.forEach(x => this.betTeamService.resetAllChecked(x));
    this.advancedModeComponent?.resetControlsAllBetTypes();
  }
}
