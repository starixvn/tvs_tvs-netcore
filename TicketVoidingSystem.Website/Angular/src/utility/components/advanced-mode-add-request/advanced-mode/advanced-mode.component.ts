import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { LABELS } from '../../../../utility/constants/labels';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { AdvancedModeConstants } from '../../advanced-mode/advanced-mode.constants';
import { OddsInfo } from '../../advanced-mode/advanced-mode/advanced-mode.model';
import { AdvancedModeService } from '../../advanced-mode/advanced-mode/advanced-mode.service';
import { Tooltip } from '../../tooltip/tooltip.model';
import { AdvancedModeAddRequestModel } from '../advanced-mode-add-request.model';
import { BetTypeAddRequest } from '../group-bet-types/group-bet-types.model';
import { BetTeamAddRequest, BetTeamAddRequestResult, Item, Selection } from './advanced-mode.model';

@Component({
  selector: 'advanced-mode',
  templateUrl: './advanced-mode.component.html',
  styleUrls: ['./advanced-mode.component.scss']
})
export class AdvancedModeComponent {
  @Input() matchId: number;
  @Input() isShowAdvancedModeFilter: boolean;
  @Input() changedBetTypes: BetTypeAddRequest[] = [];
  @Input() advancedModeAddRequestModel: AdvancedModeAddRequestModel;
  @Output() changeFilterEvent = new EventEmitter();
  betTeams: BetTeamAddRequest[] = [];
  isCollapse = true;
  tooltip = new Tooltip();
  betTypesMoreHDP = AdvancedModeConstants.BETTYPES_MORE_HDP;
  baseSpecialBetTypeCricket: Selection[] = [];
  baseBetTeams: BetTeamAddRequest[] = [];

  constructor(

    private readonly service: AdvancedModeService,
    private readonly commonService: CommonService,
    private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.matchId && changes['changedBetTypes']) {
      if (this.betTeams.length === 0) {
        await this.getBetTeamAndRenderValue(this.matchId);
      }
      await this.handleChangedBetTypes();
    }
    if (this.advancedModeAddRequestModel !== undefined && changes['advancedModeAddRequestModel']) {
      await this.getBetTeamAndRenderValue(this.matchId);
      this.changedBetTypes = this.advancedModeAddRequestModel.checkedBetTypes;
      await this.handleChangedBetTypes();
      this.updateBetTeamByCheckedValue(this.advancedModeAddRequestModel.betTeamsResult);
    }
  }

  public async getBetTeamAndRenderValue(matchId: number): Promise<void> {
    await this.getBetTeam();
    this.baseBetTeams.forEach(x => {
      x.isShow = this.changedBetTypes.some(y => y.id.toString() === x.betTypes);
    })
    await this.getSpecialBetTeamCricket(matchId);
    this.renderBetTeams(this.baseBetTeams);
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

  unckeckedAllBetTeam() {
    this.betTeams.forEach(x => {
      x.isShow = false;
    });
  }

  public async getSpecialBetTeamCricket(matchId: number): Promise<void> {
    if (this.matchId && (this.baseSpecialBetTypeCricket === undefined || this.baseSpecialBetTypeCricket.length === 0)) {
      const data = await this.commonService.GetOddsInfoSpecialBetTypes({matchId: matchId.toString(), betTypes: AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER});
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
      if(y.isMultiple) {
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
        return checkedBetType.hdp;
      case 'wicket':
        return StaticService.undoConvertStringToBetId8xxx(checkedBetType.wicket);
      case 'over':
        return checkedBetType.over;
      case 'player':
        return checkedBetType.player;
      case 'playerandodds':
        return checkedBetType.playerAndOdds;
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
    const items: Selection[] = [];
    if (AdvancedModeConstants.BETTYPE_NEXT_MAN_OUT.split(',').includes(betTypeId)) {
      const groupsOdds = _.groupBy(odds, 'oddsId');
      for (const oddsId in groupsOdds) {
        const oddsName = groupsOdds[oddsId].map(y => y.playerName).join(' & ');
        for (const [index, x] of groupsOdds[oddsId].entries()) {
          items.push(
            new Selection(index, `${x.playerName} - ${oddsName}`, `${x.betChoice}$${x.oddsId}`, null, true, null)
          );
        }
      }
    } else {
      for (const [index, x] of odds.entries()) {
        items.push(new Selection(index, x.playerName, x.playerId.toString(), null, true, null));
      }
    }

    return items;
  }

  private renderSelectionCricketWithPlayer(betTeam: BetTeamAddRequest, baseBetType: Selection[]): void {
    const playerSelection = betTeam.selections.find(x => x.name === 'Player:');
    if (playerSelection.multiSelection?.multipleSelect.items.length === 0) {
      const items: Selection[] = [];
      baseBetType.forEach(x => {
        if (betTeam.betTypes.includes(x.value)) {
          items.push(...x.items);
        }
      });
      if (playerSelection) {
        playerSelection.items = [];
        playerSelection.items.push(..._.uniqWith(items, _.isEqual));
      }
      betTeam.selections.forEach(x => {
        if (x.name === 'Player:') {
          x.multiSelection = betTeam.renderMultipleSelection(x);
        }
      });
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
      const className = `bet-team-${betTeamIndex}-selection-${selection.index}`;
      this.tooltip.display(className, LABELS.SELECT_AT_LEAST_ONE_OPTION);
      return false;
    }

    return true;
  }

  private isValidInputWithToolTip(betTeamIndex: number, inputIndex: number, isMultiple: boolean, value: string): boolean {
    if (value && !this.isValidInputDecimalValue(isMultiple, value)) {
      const className = `bet-team-${betTeamIndex}-input-${inputIndex}`;
      this.tooltip.display(className, LABELS.INVALID_VALUE);
      return false;
    }

    return true;
  }

  private isValidItemWithToolTip(betTeamIndex: number, items: Item[]): boolean {
    if (items.every(x => !x.isChecked)) {
      const className = `bet-team-${betTeamIndex}`;
      this.tooltip.display(className, LABELS.SELECT_AT_LEAST_ONE_OPTION);
      return false;
    }

    return true;
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

  public isScrollStype(): boolean {
    return this.betTeams.filter(x => x.isShow).length > 10;
  }
}
