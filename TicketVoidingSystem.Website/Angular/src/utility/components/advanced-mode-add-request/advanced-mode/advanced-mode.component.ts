import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import * as _ from 'lodash';
import { Subscription, timer } from 'rxjs';
import { LABELS } from '../../../../utility/constants/labels';
import { TEXT } from '../../../../utility/constants/text';
import { Selection as AllBetTypesSelection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AdvancedModeConstants } from '../../advanced-mode/advanced-mode.constants';
import { OddsInfo } from '../../advanced-mode/advanced-mode/advanced-mode.model';
import { AdvancedModeService } from '../../advanced-mode/advanced-mode/advanced-mode.service';
import { Tooltip } from '../../tooltip/tooltip.model';
import { AdvancedModeAddRequestModel } from '../advanced-mode-add-request.model';
import { ControlsAllBetTypesLists } from '../controls-all-bet-types/controls-all-bet-types.model';
import { BetTypeAddRequest } from '../group-bet-types/group-bet-types.model';
import { BetTeamAddRequest, BetTeamAddRequestResult, Selection } from './advanced-mode.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { MultipleSelectComponent } from '../../advanced-mode/multiple-selection/multiple-select.component';
import { ControlsAllBetTypesComponent } from '../controls-all-bet-types/controls-all-bet-types.component';

@Component({
  standalone: true,
  selector: 'advanced-mode',
  templateUrl: './advanced-mode.component.html',
  styleUrls: ['./advanced-mode.component.scss'],
  imports: [TooltipComponent, FormsModule, CommonModule, MultipleSelectComponent, ControlsAllBetTypesComponent],
  providers: [AdvancedModeService]
})
export class AdvancedModeComponent {
  @Input() matchId: number;
  @Input() changedBetTypes: BetTypeAddRequest[] = [];
  @Input() advancedModeAddRequestModel: AdvancedModeAddRequestModel;
  @Output() changeFilterEvent = new EventEmitter();
  @Output() isLoadingData = new EventEmitter<boolean>();

  betTeams: BetTeamAddRequest[] = [];
  isCollapse = true;
  tooltip = new Tooltip();
  betTypesMoreHDP = AdvancedModeConstants.BETTYPES_MORE_HDP;
  baseSpecialBetTypeCricket: Selection[] = [];
  baseBetTeams: BetTeamAddRequest[] = [];
  isShowAdvancedModeFilter: boolean;
  controlsAllBetTypesLists = ControlsAllBetTypesLists.MultipleSelectionList;
  private delayForSearchSubscription: Subscription;
  private readonly observableTimer = timer(500);
  
  commonService = inject(CommonService);
  service = inject(AdvancedModeService);
  element = inject(ElementRef);
  constructor() {
    this.tooltip.element = this.element;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.matchId && changes['changedBetTypes']) {
      this.isLoadingData.emit(true);
      if (this.betTeams.length === 0) {
        await this.getBetTeamAndRenderValue(this.matchId);
      }
      await this.handleChangedBetTypes();
      this.isLoadingData.emit(false);
    }
    if (this.advancedModeAddRequestModel !== undefined && changes['advancedModeAddRequestModel']) {
      this.isLoadingData.emit(true);
      await this.getBetTeamAndRenderValue(this.matchId);
      this.changedBetTypes = this.advancedModeAddRequestModel.checkedBetTypes;
      await this.handleChangedBetTypes();
      this.updateBetTeamByCheckedValue(this.advancedModeAddRequestModel.betTeamsResult);
      this.isLoadingData.emit(false);
    }
  }
  
  public async getBetTeamAndRenderValue(matchId: number): Promise<void> {
    await this.getBetTeam();
    this.baseBetTeams.forEach(x => {
      x.isShow = this.changedBetTypes.some(y => y.id.toString() === x.betTypes);
    })
    await this.getSpecialBetTeamCricket(matchId);
    this.renderBetTeams(this.baseBetTeams);
    this.isLoadingData.emit(false);
  }

  expandAndValidate() {
    this.isCollapse = !this.isCollapse;
    this.validateWithDelay();
  }

  changeFilter() {
    this.changeFilterEvent.emit();
  }

  async getBetTeam() {
    this.baseBetTeams = this.baseBetTeams.length > 0
      ? this.baseBetTeams
      : await this.service.getBetTeamsAddRequest();
  }

  clearBetTeam() {
    this.isShowAdvancedModeFilter = false;
    this.isCollapse = true;
    this.betTeams = [];
  }

  public async getSpecialBetTeamCricket(matchId: number): Promise<void> {
    if (this.matchId && (this.baseSpecialBetTypeCricket === undefined || this.baseSpecialBetTypeCricket.length === 0)) {
      const data = await this.commonService.getOddsInfoSpecialBetTypes({ matchId: matchId.toString(), betTypes: AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER });
      this.updatePlayerCricket(data);
    }
  }

  private updateBetTeamByCheckedValue(checkedBetTypesAddRequest: BetTeamAddRequestResult[]) {
    checkedBetTypesAddRequest.forEach(x => {
      const betTeam = this.betTeams.find(y => y.betTypes === x.id);
      if (betTeam) {
        betTeam.isShow = true;
        this.updateSelectionsByCheckedValue(betTeam, x);
        this.updateInputsByCheckedValue(betTeam, x);
      }
    })
  }

  private updateSelectionsByCheckedValue(betTeam: BetTeamAddRequest, checkedBetType: BetTeamAddRequestResult) {
    betTeam.selections.forEach(y => {
      y.isDisabled = checkedBetType.isDisabled;
      if (y.isMultiple) {
        const value = this.getValueUpdateControlFilterByAttribute(y.xmlAttribute, checkedBetType)
        y.multiSelection.updateItemChecked(value.split(','));
        y.multiSelection.updateDisabledStatus(checkedBetType.isDisabled);
      } else {
        y.value = this.getValueUpdateControlFilterByAttribute(y.xmlAttribute, checkedBetType);
      }
    });
  }

  private updateInputsByCheckedValue(betTeam: BetTeamAddRequest, checkedBetType: BetTeamAddRequestResult) {
    betTeam.inputs.forEach(y => {
      y.isDisabled = checkedBetType.isDisabled;
      y.value = this.getValueUpdateControlFilterByAttribute(y.xmlAttribute, checkedBetType)
    });
  }

  private getValueUpdateControlFilterByAttribute(attribute: string, checkedBetType: BetTeamAddRequestResult): string { //NOSONAR
    switch (attribute.toLowerCase()) {
      case 'team':
        return checkedBetType.team;
      case 'hdp':
      case 'hdp1':
      case 'hdp2':
        return checkedBetType.hdp;
      case 'player':
        return checkedBetType.player;
      case 'playerandodds':
        return checkedBetType.playerAndOdds;
      case 'oddsspread':
        return checkedBetType.oddsSpread;
      case '_xx':
      case '_xxx':
      case 'betidx':
        return checkedBetType.betIdX;
      case 'yy':
      case 'betidy':
        return checkedBetType.betIdY;
      case 'firstvalue':
        return checkedBetType.firstValue;
      case 'secondvalue':
        return checkedBetType.secondValue;
    }
  }

  private async handleChangedBetTypes() {
    if (this.changedBetTypes?.length > 0) {
      for (const betType of this.changedBetTypes) {
        await this.handleBetTeam(betType);
      }
    }
    this.isShowAdvancedModeFilter = this.betTeams.some(x => x.isShow);
    this.updateControlsAllBetTypes();
  }

  private async handleBetTeam(betType: BetTypeAddRequest) {
    const betTeam = this.betTeams.find(x => x.betTypes === betType.id.toString());
    if (betTeam) {
      await this.changeBetTeam(betType, betTeam);
    }
  }

  private async changeBetTeam(betType: BetTypeAddRequest, betTeam: BetTeamAddRequest) {
    betTeam.isShow = betType.isChecked;
    if (betTeam.isShow) {
      await this.changeCheckedBetTypes(betType, betTeam);
    } else {
      betTeam.name = "";
    }
  }

  private async changeCheckedBetTypes(betType: BetTypeAddRequest, betTeam: BetTeamAddRequest) {
    this.isShowAdvancedModeFilter = true;
    betTeam.name = betType.name;
    if (AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER.split(',').includes(betType.id.toString()) && betType.isChecked) {
      await this.getSpecialBetTeamCricket(this.matchId);
      this.renderSelectionCricketWithPlayer(betTeam, this.baseSpecialBetTypeCricket);
    }
  }

  renderBetTeams(data: BetTeamAddRequest[]) {
    this.betTeams = [];
    for (const [index, item] of data.entries()) {
      const betteam = new BetTeamAddRequest([index, item.name, item.value, item.type, item.betTypes],
        item.selections, item.inputs, item.isShow);
      this.betTeams.push(betteam);
    }
  }

  onChangeInputMultipleDecimal(betTeamIndex: number, inputIndex: number, isMultiple: boolean, value: string) {
    if (!this.isValidInputWithToolTip(betTeamIndex, inputIndex, isMultiple, value)) {
      return false;
    }
    this.tooltip.hide();
    return true;
  }

  getCheckedBetTypeModels(): BetTeamAddRequestResult[] {
    return this.betTeams
      .filter(x => x.isShow)
      .map(y => y.getResult(y.betTypes));
  }

  private updatePlayerCricket(oddsInfo: OddsInfo[]): void {
    const groupBetTypes = _.groupBy(oddsInfo, 'betTypeId');
    for (const betTypeId in groupBetTypes) {
      const items = this.getItemsPlayerSelection(betTypeId, groupBetTypes[betTypeId]);
      this.baseSpecialBetTypeCricket.push(new Selection(0, '', `${betTypeId}`, items, true, null));
    }
  }

  private getItemsPlayerSelection(betTypeId: string, odds: OddsInfo[]): Selection[] {
    const isNextManOut = AdvancedModeConstants.BETTYPE_NEXT_MAN_OUT.split(',').includes(betTypeId);
    if (isNextManOut) {
      return odds.reduce((acc, current, index) => {
        const group = odds.filter(x => x.oddsId === current.oddsId);
        const oddsName = group.map(x => x.playerName).join(' & ');
        return acc.concat(group.map((x, i) => new Selection(i, `${x.playerName} - ${oddsName}`, `${x.betChoice}$${x.oddsId}`, null, true, null)));
      }, []);
    }

    return odds.map((x, index) => new Selection(index, x.playerName, x.playerId.toString(), null, true, null));
  }

  private renderSelectionCricketWithPlayer(betTeam: BetTeamAddRequest, baseBetType: Selection[]): void {
    const playerSelection = betTeam.selections.find(x => x.name === 'Player');
    if (playerSelection.multiSelection?.multipleSelect.items.length === 0) {
      const validItems = baseBetType
        .filter(x => betTeam.betTypes.includes(x.value))
        .flatMap(x => x.items);

      playerSelection.items = _.uniqWith(validItems, _.isEqual);

      betTeam.selections
        .filter(x => x.name === 'Player')
        .forEach(x => x.multiSelection = betTeam.renderMultipleSelection(x));
    }
  }

  validateWithDelay() {
    this.unsubscribeFromDelay();
    this.delayForSearchSubscription = this.observableTimer.subscribe(() => {
      if (!this.isCollapse) {
        this.isValidity();
      }
    });
  }

  private unsubscribeFromDelay(): void {
    if (this.delayForSearchSubscription) {
      this.delayForSearchSubscription.unsubscribe();
    }
  }

  isValidity(): boolean {
    return this.betTeams
      .filter(x => x.isShow)
      .every(x => this.isValidSelections(x) && this.isValidInputs(x));
  }

  isValidSelections(betTeam: BetTeamAddRequest): boolean {
    return betTeam.selections.every(x => this.isValidSelectionWithToolTip(betTeam.index, x));
  }

  isValidInputs(betTeam: BetTeamAddRequest): boolean {
    return betTeam.inputs.every(x => this.isValidInputWithToolTip(betTeam.index, x.index, x.isMultiple, x.value));
  }

  private isValidSelectionWithToolTip(betTeamIndex: number, selection: Selection): boolean {
    if (!this.isValidSelectionValue(selection)) {
      if (this.isCollapse) {
        this.showTooltipWhenCollapsed();
      } else {
        const className = `bet-team-${betTeamIndex}-selection-${selection.index}`;
        this.tooltip.display(className, LABELS.SELECT_AT_LEAST_ONE_OPTION);
      }
      return false;
    }

    return true;
  }

  private isValidInputWithToolTip(betTeamIndex: number, inputIndex: number, isMultiple: boolean, value: string): boolean {
    if (value && !this.isValidInputDecimalValue(isMultiple, value)) {
      if (this.isCollapse) {
        this.showTooltipWhenCollapsed();
      } else {
        const className = `bet-team-${betTeamIndex}-input-${inputIndex}`;
        this.tooltip.display(className, LABELS.INVALID_VALUE);
      }
      return false;
    }

    return true;
  }

  private showTooltipWhenCollapsed() {
      this.tooltip.display('advanced-mode-header-label', TEXT.THERE_ARE_INVALID_FIELDS);
  }

  private isValidInputDecimalValue(isMultiple: boolean, value: string): boolean {
    return isMultiple
      ? StaticService.isCorrectRegexMultipleDecimal(value)
      : StaticService.isCorrectRegexSingleDecimal(value);
  }

  private isValidSelectionValue(selection: Selection): boolean {
    return selection.isMultiple
      ? selection.multiSelection.multipleSelect.getValueItems() !== ''
      : selection.value !== '';
  } 

  public updateControlsAllBetTypes(){
    if(this.advancedModeAddRequestModel?.selectedAllBetTypes.length > 0){
      this.advancedModeAddRequestModel.selectedAllBetTypes.forEach(x => {
        const selectedAllBetTypes = this.controlsAllBetTypesLists.find(item => item.type === x.name);
        if(selectedAllBetTypes){
          selectedAllBetTypes.items.updateItemChecked(x.value.split(','));
          selectedAllBetTypes.isShow = true;
        }
      })

      this.advancedModeAddRequestModel.selectedAllBetTypes = [];
    }
    else {
      this.updateShowControlsAllBetTypes()
    }
  }

  private updateShowControlsAllBetTypes(){
    this.controlsAllBetTypesLists.forEach(x => {
      x.isShow = this.checkShowAllBetType(x.type);
    })
  }

  public changeByControlAllBetType(event: { itemList: string[], type: string }) {
    this.betTeams.forEach(betTeam => {
      const selection = betTeam.selections.find(x => x.name === event.type);
      if(selection) {
        this.updateBetTeam(betTeam, event.type, event.itemList)
      } 
    });
  }

  private updateBetTeam(betTeam: BetTeamAddRequest, type: string, itemList: string[]){
    betTeam.selections.find(x => x.name === type).multiSelection.updateItemChecked(itemList);
  }

  private checkShowAllBetType(type: string): boolean{
    return this.betTeams.filter(betTeam => betTeam.isShow && betTeam.selections.find(y => y.name === type)).length > 0;
  }

  public getAllBetTypesSelection(): AllBetTypesSelection[]{
    return this.controlsAllBetTypesLists.filter(x => x.isShow).map(y => { return {name: y.type, value: y.items.getValueItems()} as AllBetTypesSelection });;
  }

  public resetControlsAllBetTypes() {
    this.controlsAllBetTypesLists.forEach(x => x.resetAllChecked())
  }
}
