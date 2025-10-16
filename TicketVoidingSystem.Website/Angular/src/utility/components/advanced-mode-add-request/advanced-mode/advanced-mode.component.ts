import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import groupBy from 'lodash/groupBy';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { Subscription, timer } from 'rxjs';
import { TEXT} from '../../../../utility/constants/text';
import { Selection as AllBetTypesSelection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AdvancedModeConstants } from '../../advanced-mode/advanced-mode.constants';
import { OddsInfo } from '../../advanced-mode/advanced-mode/advanced-mode.model';
import { AdvancedModeApiService } from '../../advanced-mode/advanced-mode/advanced-mode-api.service';
import { MultipleSelectComponent } from '../../advanced-mode/multiple-selection/multiple-select.component';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { Tooltip } from '../../tooltip/tooltip.model';
import { AdvancedModeAddRequestModel } from '../advanced-mode-add-request.model';
import { ControlsAllBetTypesComponent } from '../controls-all-bet-types/controls-all-bet-types.component';
import { ControlsAllBetTypes } from '../controls-all-bet-types/controls-all-bet-types.model';
import { BetTypeAddRequest } from '../group-bet-types/group-bet-types.model';
import { BetTeamAddRequest, BetTeamAddRequestResult, Selection } from './advanced-mode.model';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';
import { BetTeamAddRequestService } from './bet-team-add-request.service';
import { ControlsAllBetTypesService } from '../controls-all-bet-types/controls-all-bet-types.service';
import { AdvancedModeService } from '../../advanced-mode/advanced-mode/advanced-mode.service';

@Component({
  standalone: true,
  selector: 'advanced-mode',
  templateUrl: './advanced-mode.component.html',
  styleUrls: ['./advanced-mode.component.scss'],
  imports: [TooltipComponent, FormsModule, CommonModule, MultipleSelectComponent, ControlsAllBetTypesComponent],
  providers: [AdvancedModeApiService]
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
  baseSpecialBetTypeBasketball: Selection[] = [];
  baseBetTeams: BetTeamAddRequest[] = [];
  isShowAdvancedModeFilter: boolean;
  controlsAllBetTypesLists: ControlsAllBetTypes[] = [];
  oddsInfo: OddsInfo[] = [];
  private delayForSearchSubscription: Subscription;

  private readonly observableTimer = timer(500);
  private readonly element = inject(ElementRef);
  private readonly commonService = inject(CommonService);
  private readonly service = inject(AdvancedModeApiService);
  private readonly multipleSelectionService = inject(MultipleSelectionService);
  private readonly betTeamService = inject(BetTeamAddRequestService);
  private readonly controlsBetTypesService = inject(ControlsAllBetTypesService);
  private readonly advancedModeService = inject(AdvancedModeService);
  
  async ngOnChanges(changes: SimpleChanges) {
    if (this.matchId && changes['changedBetTypes']) {
      this.isLoadingData.emit(true);

      if (this.betTeams.length === 0 && this.changedBetTypes.length > 0) {
        await this.getBetTeamAndRenderValue(this.matchId);
      }
      await this.handleChangedBetTypes();
      this.isLoadingData.emit(false);
    }
    if (this.advancedModeAddRequestModel !== undefined && changes['advancedModeAddRequestModel']) {
      this.isLoadingData.emit(true);
      this.changedBetTypes = this.advancedModeAddRequestModel.checkedBetTypes;
      await this.getBetTeamAndRenderValue(this.matchId);
      await this.handleChangedBetTypes();
      this.updateBetTeamByCheckedValue(this.advancedModeAddRequestModel.betTeamsResult);
      this.isLoadingData.emit(false);
    }
  }

  private async getBetTeamAndRenderValue(matchId: number): Promise<void> {
    await this.getBetTeam();
    this.baseBetTeams.forEach(x => {
      x.isShow = this.changedBetTypes.some(y => y.id.toString() === x.betTypes);
    })

    const allSpecialBetTypes = AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER + ',' + AdvancedModeConstants.BETTYPE_SPECIAL_BASKETBALL;
    this.oddsInfo = await this.commonService.getOddsInfoSpecialBetTypes({ matchId: matchId.toString(), betTypes: allSpecialBetTypes });
    this.updatePlayerCricket(this.oddsInfo);
    this.updatePlayerBasketball(this.oddsInfo);

    this.renderBetTeams(this.baseBetTeams);
  }

  expandAndValidate() {
    this.isCollapse = !this.isCollapse;
    this.validateWithDelay();
  }

  changeFilter() {
    this.changeFilterEvent.emit();
  }

  private async getBetTeam() {
    if (this.baseBetTeams.length > 0) {
      return;
    }

    const result = await this.service.getBetTeamsAddRequest();
    this.baseBetTeams = result || [];
  }

  clearBetTeam() {
    this.isShowAdvancedModeFilter = false;
    this.isCollapse = true;
    this.betTeams = [];
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
        this.betTeamService.updateItemChecked(y.multiSelection.multipleSelect, value.split(','));
        this.betTeamService.updateDisabledStatus(y.multiSelection.multipleSelect, checkedBetType.isDisabled);
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
      case 'performance':
        return checkedBetType.performance;
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
      this.renderSelectionWithPlayer(betTeam, this.baseSpecialBetTypeCricket, 'Player');

    }
    this.renderSelectionBasketBallBetTypes(betTeam, this.baseSpecialBetTypeBasketball, betType);
  }

  private renderBetTeams(data: BetTeamAddRequest[]) {
    this.betTeams = [];
    for (const [index, item] of data.entries()) {
      const betTeam = this.betTeamService.initBetTeamAddRequest([index, item.name, item.value, item.type, item.betTypes],
        item.selections, item.inputs, item.isShow);
      this.betTeams.push(betTeam);
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
      .map(y => this.betTeamService.getResult(y, y.betTypes));
  }

  private updatePlayerCricket(oddsInfo: OddsInfo[]): void {
    const groupBetTypes = groupBy(oddsInfo, 'betTypeId');
    for (const betTypeId in groupBetTypes) {
      const items = this.advancedModeService.getItemsPlayerSelectionAddRequest(betTypeId, groupBetTypes[betTypeId]);
      this.baseSpecialBetTypeCricket.push(this.betTeamService.initSelectionAdvancedMode(0, 'Player', `${betTypeId}`, items, true, null));
    }
  }

  private updatePlayerBasketball(oddsInfo: OddsInfo[]): void {
    const groupBetTypes = groupBy(oddsInfo, 'betTypeId');
    this.baseSpecialBetTypeBasketball = [];
    for (const betTypeId in groupBetTypes) {
      const playerItems = this.advancedModeService.getItemsPlayerSelectionAddRequest(betTypeId, groupBetTypes[betTypeId]);
      this.baseSpecialBetTypeBasketball.push(this.betTeamService.initSelectionAdvancedMode(0, 'Player', `${betTypeId}`, playerItems, true, null));
      if (AdvancedModeConstants.BETTYPE_POINTS_BASKETBALL.split(',').includes(betTypeId)) {
        const pointsItems = this.advancedModeService.getItemsBetChoiceSelectionAddRequest(groupBetTypes[betTypeId]);
        this.baseSpecialBetTypeBasketball.push(this.betTeamService.initSelectionAdvancedMode(0, 'Points', `${betTypeId}`, pointsItems, true, null));
      }
      if (AdvancedModeConstants.BETTYPE_OTHERS_BASKETBALL.split(',').includes(betTypeId)) {
        const pointsItems = this.advancedModeService.getItemsOtherSelectionAddRequest(groupBetTypes[betTypeId]);
        this.baseSpecialBetTypeBasketball.push(this.betTeamService.initSelectionAdvancedMode(0, 'Others', `${betTypeId}`, pointsItems, true, null));
      }
    }
  }

  private renderSelectionWithPlayer(betTeam: BetTeamAddRequest, baseBetType: Selection[], selectionName: string): void {
    const playerSelection = betTeam.selections.find(x => x.name === selectionName);
    if (playerSelection.multiSelection?.multipleSelect.items.length === 0) {
      const validItems = baseBetType
        .filter(x => betTeam.betTypes.includes(x.value))
        .flatMap(x => x.items);

      playerSelection.items = uniqWith(validItems, isEqual);

      betTeam.selections
        .filter(x => x.name === selectionName)
        .forEach(x => x.multiSelection = this.betTeamService.renderMultipleSelection(x));
    }
  }

  private validateWithDelay() {
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

  private isValidInputs(betTeam: BetTeamAddRequest): boolean {
    return betTeam.inputs.every(x => this.isValidInputWithToolTip(betTeam.index, x.index, x.isMultiple, x.value));
  }

  private isValidSelectionWithToolTip(betTeamIndex: number, selection: Selection): boolean {
    if (!this.isValidSelectionValue(selection)) {
      if (this.isCollapse) {
        this.showTooltipWhenCollapsed();
      } else {
        const className = `bet-team-${betTeamIndex}-selection-${selection.index}`;
        this.tooltip.display(className, TEXT.SELECT_AT_LEAST_ONE_OPTION);
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
        this.tooltip.display(className, TEXT.INVALID_VALUE);
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
    ? this.multipleSelectionService.getValueItems(selection.multiSelection.multipleSelect) !== ''
    : selection.value !== '';
  }

  private updateControlsAllBetTypes() {
    if (this.advancedModeAddRequestModel?.selectedAllBetTypes.length > 0) {
      this.advancedModeAddRequestModel.selectedAllBetTypes.forEach(x => {
        const selectedAllBetTypes = this.controlsAllBetTypesLists.find(item => item.type === x.name);
        if (selectedAllBetTypes) {
          this.multipleSelectionService.updateChildItemsChecked(selectedAllBetTypes.items, x.value.split(','));
          selectedAllBetTypes.isShow = true;
        }
      })

      this.advancedModeAddRequestModel.selectedAllBetTypes = [];
    }
    else {
      this.updateShowControlsAllBetTypes()
    }
  }

  private updateShowControlsAllBetTypes() {
    this.controlsAllBetTypesLists.forEach(x => {
      x.isShow = this.checkShowAllBetType(x.type);
    })
  }

  public changeByControlAllBetType(event: { itemList: string[], type: string }) {
    this.betTeams.forEach(betTeam => {
      const selection = betTeam.selections.find(x => x.name === event.type);
      if (selection) {
        this.updateBetTeam(betTeam, event.type, event.itemList)
      }
    });
  }

  private updateBetTeam(betTeam: BetTeamAddRequest, type: string, itemList: string[]) {
    this.betTeamService.updateItemChecked(betTeam.selections.find(x => x.name === type).multiSelection.multipleSelect, itemList);
  }

  private checkShowAllBetType(type: string): boolean {
    return this.betTeams.filter(betTeam => betTeam.isShow && betTeam.selections.find(y => y.name === type)).length > 0;
  }

  public getAllBetTypesSelection(): AllBetTypesSelection[] {
    return this.controlsAllBetTypesLists.filter(x => x.isShow).map(y => { return { name: y.type, value: this.multipleSelectionService.getValueItems(y.items) } as AllBetTypesSelection });;
  }

  public resetControlsAllBetTypes() {
    this.controlsAllBetTypesLists.forEach(x => this.controlsBetTypesService.resetAllChecked(x.items))
  }

  updateOtherSelection(betTeam: BetTeamAddRequest, selection: Selection): void {
    if (selection.name === 'Performance') {
      betTeam.selections.find(x => x.name === 'Others').multiSelection.multipleSelect.items = [];
      const allCheckedItems = this.multipleSelectionService.getValueItems(selection.multiSelection.multipleSelect);
      const itemsSelectionOthers = this.advancedModeService.getItemsOtherSelectionAddRequest(this.oddsInfo, allCheckedItems);
      this.baseSpecialBetTypeBasketball = [...this.baseSpecialBetTypeBasketball.filter(x => x.value !== betTeam.betTypes || x.name !== 'Others'), ...itemsSelectionOthers];
      const othersSelection = [] as Selection[];
      othersSelection.push(this.betTeamService.initSelectionAdvancedMode(0, 'Others', `${betTeam.betTypes}`, itemsSelectionOthers, true, null));

      this.renderSelectionWithPlayer(betTeam, othersSelection, 'Others');
    }
  }

  private renderSelectionBasketBallBetTypes(betTeam: BetTeamAddRequest, baseSpecialBetTypeBasketball: Selection[], betType: BetTypeAddRequest) {
    if (AdvancedModeConstants.BETTYPE_SPECIAL_BASKETBALL.split(',').includes(betType.id.toString()) && betType.isChecked) {
      this.renderSelectionWithPlayer(betTeam, baseSpecialBetTypeBasketball.filter(x => x.name === 'Player'), 'Player');
    }
    if (AdvancedModeConstants.BETTYPE_POINTS_BASKETBALL.split(',').includes(betType.id.toString()) && betType.isChecked) {
      this.renderSelectionWithPlayer(betTeam, baseSpecialBetTypeBasketball.filter(x => x.name === 'Points'), 'Points');
    }
    if (AdvancedModeConstants.BETTYPE_OTHERS_BASKETBALL.split(',').includes(betType.id.toString()) && betType.isChecked) {
      this.renderSelectionWithPlayer(betTeam, baseSpecialBetTypeBasketball.filter(x => x.name === 'Others'), 'Others');
    }
  }
}
