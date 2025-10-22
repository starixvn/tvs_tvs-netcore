import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnChanges, SimpleChange, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import assignIn from 'lodash/assignIn';
import groupBy from 'lodash/groupBy';
import { TEXT} from '../../../../utility/constants/text';
import { DecimalOnlyDirective, MultipleDecimalDirective, } from '../../../../utility/directives/numbers-only.directive';
import { CommonService } from '../../../../utility/services/common.service';
import { ItemsSelect } from '../../multiple-selection/items-select';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { TooltipComponent } from '../../tooltip/tooltip.component';
import { Tooltip } from '../../tooltip/tooltip.model';
import { AdvancedModeConstants } from '../advanced-mode.constants';
import { BetType } from '../group-bettypes/group-bettypes.model';
import { MultipleSelectComponent } from '../multiple-selection/multiple-select.component';
import { BetTeam, CheckedBetType, GetPlayersQuery, OddsInfo, Player, Selection } from './advanced-mode.model';
import { AdvancedModeApiService } from './advanced-mode-api.service';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';
import { AdvancedModeService } from './advanced-mode.service';
import { ControlsAllBetTypesService } from '../../advanced-mode-add-request/controls-all-bet-types/controls-all-bet-types.service';
import { ItemsSelectService } from '../../multiple-selection/items-select.service';

@Component({
  standalone: true,
  selector: 'advanced-mode',
  templateUrl: './advanced-mode.component.html',
  styleUrls: ['./advanced-mode.component.scss'],
  imports: [TooltipComponent, FormsModule, CommonModule, DecimalOnlyDirective, MultipleDecimalDirective, MultipleSelectComponent],
  providers: [AdvancedModeService],
  encapsulation: ViewEncapsulation.None
})
export class AdvancedModeComponent implements OnChanges {
  @Input() getPlayerQuery: GetPlayersQuery;
  @Input() matchId: string;
  @Input() allBetTypes: BetType[];
  @Input() isShowMultiSelectionList: boolean;
  
  baseBetTeam: BetTeam[] = [];
  betTeams: BetTeam[] = [];
  mapList: MultipleSelection;
  roundList: MultipleSelection;
  quarterList: MultipleSelection;
  setList: MultipleSelection;
  gameList: MultipleSelection;
  inningList: MultipleSelection;
  betTypesMoreHDP = AdvancedModeConstants.BETTYPES_MORE_HDP;
  baseSpecialBetTypeCricket: Selection[] = [];
  baseSpecialBetTypeBasketball: Selection[] = [];
  isShowAdvancedMode: boolean;
  isShowContent: boolean;
  isShowAllBetTypeMapRound: boolean;
  isShowAllBetTypeQuarter: boolean;
  isShowAllBetTypeSet: boolean;
  isShowAllBetTypeGame: boolean;
  isShowAllBetTypeInning: boolean;
  tooltip = new Tooltip();
  oddsInfo: OddsInfo[] = [];

  service = inject(AdvancedModeApiService);
  commonService = inject(CommonService);
  element = inject(ElementRef);
  multipleSelectionService = inject(MultipleSelectionService);
  advancedModeService = inject(AdvancedModeService);
  controlsBetTypesService = inject(ControlsAllBetTypesService);

  constructor() {
    this.tooltip.element = this.element;
  }

  renderBetTeams(data: BetTeam[]) {
    this.betTeams = [];
    for (const [index, item] of data.entries()) {
      const betTeam = this.advancedModeService.initBetTeam([index, item.name, item.value, item.type, item.betTypes],
        item.selections, item.items, item.inputs, this.isShowMultiSelectionList);
      this.betTeams.push(betTeam);
    }
  }

  renderMapAndRound() {
    this.mapList = this.controlsBetTypesService.initSelectionAllBetType(AdvancedModeConstants.MAP_LIST);
    this.roundList = this.controlsBetTypesService.initSelectionAllBetType(AdvancedModeConstants.ROUND_LIST);
    this.quarterList = this.controlsBetTypesService.initSelectionAllBetType(AdvancedModeConstants.QUARTER_LIST);
    this.setList = this.controlsBetTypesService.initSelectionAllBetType(AdvancedModeConstants.SET_LIST);
    this.gameList = this.controlsBetTypesService.initSelectionAllBetType(AdvancedModeConstants.GAME_LIST);
    this.inningList = this.controlsBetTypesService.initSelectionAllBetType(AdvancedModeConstants.INNING_LIST);
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.matchId && changes['allBetTypes']) {
      if (this.baseBetTeam.length === 0) {
        await this.getBetTeamAndRenderValue(this.matchId);
      }

      this.changedBetTypes();
    }
    if (changes['getPlayerQuery']) {
      await this.getPlayers();
    }
  }

  public async getBetTeamAndRenderValue(matchId: string): Promise<void> {
    this.baseBetTeam = await this.service.getBetTeams();
    if (matchId) {
      const allSpecialBetTypes = AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER + ',' + AdvancedModeConstants.BETTYPE_SPECIAL_BASKETBALL;
      this.oddsInfo = await this.commonService.getOddsInfoSpecialBetTypes({ matchId: matchId, betTypes: allSpecialBetTypes });
      this.updatePlayerCricket(this.oddsInfo);
      this.updatePlayerBasketball(this.oddsInfo);
    }
    this.renderBetTeams(this.baseBetTeam);
    this.renderMapAndRound();
  }

  private changedBetTypes() {
    this.isShowAdvancedMode = false;
    this.isShowContent = false;
    this.isShowAllBetTypeMapRound = false;
    this.isShowAllBetTypeQuarter = false;
    this.isShowAllBetTypeSet = false;
    this.isShowAllBetTypeGame = false;
    this.isShowAllBetTypeInning = false;
    if (this.allBetTypes !== undefined) {
      this.allBetTypes.forEach(betType => {
        this.handleBetTeam(betType);
      });
    }
  }

  private handleBetTeam(betType: BetType) {
    this.betTeams.forEach(betTeam => {
      this.changeBetTeam(betType, betTeam);
      this.handleChangeFancyBetTypeCricket(betTeam);
    });
  }

  private changeBetTeam(betType: BetType, betTeam: BetTeam) {
    const betTypeIdsOfBetTeam = betTeam.betTypes.split(',');
    if (betTypeIdsOfBetTeam.indexOf(betType.id.toString()) > -1) {
      this.changeCheckedBetTypes(betType, betTeam);
    }
  }

  private changeCheckedBetTypes(betType: BetType, betTeam: BetTeam) {
    const index = betTeam.checkedBetTypes.indexOf(betType.value);
    if (betType.isChecked) {
      this.changeCheckedBetTeam(betTeam);
      this.isShowAdvancedMode = true;
      this.isShowContent = true;
      if (index === -1) {
        betTeam.name = betType.name;
        betTeam.checkedBetTypes.push(betType.value);
      }
      this.updateAllBetTypeSelection(betTeam);
    } else if (index !== -1) {
      this.advancedModeService.removeBetTypeName(betType.name, betTeam);
      betTeam.checkedBetTypes.splice(index, 1);
    }

    if (AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER.split(',').includes(betType.id.toString()) && betType.isChecked) {
      this.advancedModeService.resetChecked(betTeam);
      this.advancedModeService.renderSelectionWithPlayer(betTeam, this.baseSpecialBetTypeCricket, 'Player:');
    }

    this.advancedModeService.renderSelectionBasketBallBetTypes(betTeam, this.baseSpecialBetTypeBasketball, betType);
  }

  private updateAllBetTypeSelection(betTeam: BetTeam) {
    this.isShowAllBetTypeMapRound = this.isShowAllBetTypeMapRound === true ? true : betTeam.multiSelectionList.filter(x => x.type ==='map' || x.type ==='round').length > 0;
    this.isShowAllBetTypeQuarter = this.isShowAllBetTypeQuarter === true ? true : betTeam.multiSelectionList.filter(x => x.type ==='quarter').length > 0;
    this.isShowAllBetTypeSet = this.isShowAllBetTypeSet === true ? true : betTeam.multiSelectionList.filter(x => x.type ==='set').length > 0;
    this.isShowAllBetTypeGame = this.isShowAllBetTypeGame === true ? true : betTeam.multiSelectionList.filter(x => x.type ==='game').length > 0;
    this.isShowAllBetTypeInning = this.isShowAllBetTypeInning === true ? true : betTeam.multiSelectionList.filter(x => x.type ==='inning').length > 0;
  }

  private changeCheckedBetTeam(betTeam: BetTeam) {
    if (betTeam.checkedBetTypes.length === 0) {
      this.advancedModeService.resetChecked(betTeam);
    }
  }

  isValidOptionForType5(betTeam: BetTeam, item: Selection, name: string): boolean {
    return this.advancedModeService.isValidOptionForType5(betTeam, item, name);
  }

  checkBetTeamItems(betTeam: BetTeam) {
    this.advancedModeService.checkItems(betTeam);
  }

  controlIsCheckedBetTeam(betTeam: BetTeam) {
    this.advancedModeService.controlIsChecked(betTeam);
  }

  async getPlayers() {
    if (this.getPlayerQuery !== undefined && this.getPlayerQuery.matchId !== '') {
      const data = await this.service.getPlayer(this.getPlayerQuery);
      this.renderPlayer(data);
    }
  }

  private renderPlayer(players: Player[]) {
    const itemSelects: Array<ItemsSelect> = [];
    for (let i = 0; i < players.length; i++) {
      const item = ItemsSelectService.initItemsSelect(i, players[i].betChoice, players[i].oddsInfo, true, true, true, []);
      itemSelects.push(item);
    }

    const betTeam216 = this.betTeams.find(x => x.betTypes === '216');
    betTeam216.multiSelection.multipleSelect.items = [];
    betTeam216.multiSelection.multipleSelect.items = itemSelects;
  }

  resetBetTeam() {
    this.isShowAdvancedMode = false;
    this.isShowContent = false;
    this.baseBetTeam = [];
    this.betTeams = [];
    this.baseSpecialBetTypeCricket = [];
    this.baseSpecialBetTypeBasketball = [];
  }

  validate(): boolean {
    return this.betTeams.every(x => this.validateBetTeam(x));
  }

  isValidInputs(betTeam: BetTeam): boolean {
    return betTeam.inputs.every(x => this.isValidInputWithToolTip(betTeam.index, x.index, x.isMultiple, x.value));
  }

  private isValidInputWithToolTip(betTeamIndex: number, inputIndex: number, isMultiple: boolean, value: string): boolean {
    if (value && !this.advancedModeService.isValidInputDecimalValue(isMultiple, value)) {
      if (!this.isShowContent) {
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
    this.tooltip.display('advanced-mode-collapsed', TEXT.THERE_ARE_INVALID_FIELDS);
  }

  private checkMultiSelectionListBetTeam(betTeam: BetTeam): boolean {
    return betTeam.multiSelectionList?.filter(x => x.multipleSelect.items.length > 0)
      .some(y => this.multipleSelectionService.getValueItems(y.multipleSelect) === '')
  }

  private checkMultiSelectionInSelection(betTeam: BetTeam): boolean {
    return (
      betTeam.selections.filter(x => x.multiSelection !== undefined && x.multiSelection?.multipleSelect.items.length > 0)
        .some(y => this.multipleSelectionService.getValueItems(y.multiSelection.multipleSelect) === '')
    );
  }

  private checkCheckedBetTypesWithHDPBetType(betTeam: BetTeam) {
    return betTeam.checkedBetTypes.length > 0 && betTeam.type === 1;
  }

  private validateBetTeam(betTeam: BetTeam): boolean { //NOSONAR
    let result = true;
    if (betTeam.checkedBetTypes.length > 0) {
      if (this.advancedModeService.getItemsValue(betTeam) === '' && betTeam.type !== AdvancedModeConstants.BETTEAM_TYPE_4) {
        result = false;
        this.isShowContent = true;
        this.tooltip.display(`bet-team-${betTeam.index}`, TEXT.SELECT_AT_LEAST_ONE_OPTION);
      } else if (this.checkMultiSelectionListBetTeam(betTeam) && result) {
        const invalidSelection = betTeam.multiSelectionList.find(x => this.multipleSelectionService.getValueItems(x.multipleSelect) === '')
        result = false;
        this.isShowContent = true;
        this.tooltip.display(`multiple-selection-${betTeam.index}-selection-${betTeam.multiSelectionList.indexOf(invalidSelection)}`, TEXT.SELECT_AT_LEAST_ONE_OPTION);
      } else if (this.checkMultiSelectionInSelection(betTeam) && result) {
        const invalidSelection = betTeam.selections.find(x => this.multipleSelectionService.getValueItems(x.multiSelection.multipleSelect) === '')
        result = false;
        this.isShowContent = true;
        this.tooltip.display(`multiple-selection-${betTeam.index}-selection-${betTeam.selections.indexOf(invalidSelection)}`, TEXT.SELECT_AT_LEAST_ONE_OPTION);
      } else if (!this.isValidInputs(betTeam) && result) {
        result = false;
        this.isShowContent = true;
      }
    }

    if (this.checkCheckedBetTypesWithHDPBetType(betTeam) && this.isShowMultiSelectionList && result) {
      return this.checkEmptyCheckboxWithTicketListing(result, betTeam);
    }

    return result;
  }

  private checkEmptyCheckboxWithTicketListing(result: boolean, betTeam: BetTeam) {
    if (betTeam.multiSelectionList?.length > 0) {
      for (let i = 0; i < betTeam.multiSelectionList.length && result; i++) {
        if (betTeam.multiSelectionList[i].multipleSelect !== undefined && this.multipleSelectionService.getValueItems(betTeam.multiSelectionList[i].multipleSelect) === '' && result) {
          result = false;
          this.isShowContent = true;
          this.tooltip.display(`multiple-selection-list-${i}`, TEXT.SELECT_AT_LEAST_ONE_OPTION);
        }
      }
    }
    return result;
  }

  getBetTypeModels(value: string): CheckedBetType[] {
    const betTypes = [];
    const betTypeIds = value.split(',');
    this.betTeams.forEach(item => {
      if (item.checkedBetTypes.length > 0) {
        const checkedIds = item.checkedBetTypes.join(',').split(',');
        checkedIds.forEach(id => {
          const index = betTypeIds.indexOf(id.toString());
          betTypeIds.splice(index, 1);
          const betType: CheckedBetType = assignIn({ id: parseInt(id, 10) }, this.advancedModeService.getResult(item, id));
          betTypes.push(betType);
        });
      }
    });

    betTypeIds.forEach(id => {
      const betType: CheckedBetType = {
        id: parseInt(id, 10),
        betTeam: '',
        game: '',
        set: '',
        value: '',
        valueHdp1: '',
        valueHdp2: '',
        betOption: '',
        goal: '',
        oddsSpread: '',
        oddsId: '',
        transdesc: '',
        virtualHead: '',
        performance: '',
        playerAndOdds: ''
      };
      betTypes.push(betType);
    });

    return betTypes;
  }

  updateOtherSelection(betTeam: BetTeam, selection: Selection): void {
    if (selection.name === 'Performance:') {
      const allCheckedItems = this.multipleSelectionService.getValueItems(selection.multiSelection.multipleSelect);
      const itemsSelectionOthers = this.advancedModeService.getItemsOtherSelection(this.oddsInfo, allCheckedItems);
      const othersSelection = [] as Selection[];
      othersSelection.push(this.advancedModeService.initSelection('Others', `${betTeam.betTypes}`, itemsSelectionOthers, true, null, false, false, false, false, false, false));
      this.baseSpecialBetTypeBasketball = [...this.baseSpecialBetTypeBasketball.filter(x => x.value !== betTeam.betTypes || x.name !== 'Others'), ...othersSelection];
      this.advancedModeService.renderSelectionWithPlayer(betTeam, othersSelection, 'Others:');
    }
  }

  updateByControlAllBetType(itemList: string[], type: string) {
    const betTeamOfType = this.betTeams.filter(x => x.multiSelectionList.some(y => y.type === type));
    if (betTeamOfType.length > 0) {
      betTeamOfType.forEach(item => {
        this.advancedModeService.updateItemByControlAllBetType(item.multiSelectionList, itemList, type);
      });
    }
  }

  checkBetTypesMoreHDP(betTeam: BetTeam) {
    return betTeam.items.length > 0 && betTeam.items[0].value !== '' && this.betTypesMoreHDP.split(',').includes(betTeam.betTypes);
  }

  isShowTextBox(betTeam: BetTeam) {
    return betTeam.inputs.length > 0;
  }

  handleChangeFancyBetTypeCricket(betTeam: BetTeam): void {
    if (betTeam.checkedBetTypes.some(x => AdvancedModeConstants.BETTYPES_CRICKET_UPDATE_FANCY.split(',').includes(x))) {
      const input = betTeam.inputs.find(x => x.xmlAttribute === 'Value');
      const selectionFancy = betTeam.selections.find(x => x.name === "Fancy:");
      if (selectionFancy && selectionFancy.value === 'All') {
        input.flag = true;
        input.value = '';
      } else {
        input.flag = false;
      }
    }
  }

  private updatePlayerCricket(oddsInfo: OddsInfo[]): void {
    const groupBetTypes = groupBy(oddsInfo, 'betTypeId');
    for (const betTypeId in groupBetTypes) {
      const items = this.advancedModeService.getItemsPlayerSelection(betTypeId, groupBetTypes[betTypeId]);
      this.baseSpecialBetTypeCricket.push(this.advancedModeService.initSelection('', `${betTypeId}`, items, true, null, false, false, false, false, false, false));
    }
  }

  private getItemsPlayerSelection(betTypeId: string, odds: OddsInfo[]): Selection[] {
    const items: Selection[] = [];
    if (AdvancedModeConstants.BETTYPE_NEXT_MAN_OUT.split(',').includes(betTypeId)) {
      const groupsOdds = groupBy(odds, 'oddsId');
      for (const oddsId in groupsOdds) {
        const oddsName = groupsOdds[oddsId].map(y => y.playerName).join(' & ');
        groupsOdds[oddsId].forEach(x => {
          items.push(
            this.advancedModeService.initSelection(`${x.playerName} - ${oddsName}`, `${x.betChoice},${x.oddsId}`, null, true, null, false, false, false, false, false, false)
          );
        });
      }
    } else {
      odds.forEach(x => {
        items.push(this.advancedModeService.initSelection(x.playerName, x.playerId.toString(), null, true, null, false, false, false, false, false, false));
      });
    }

    return items;
  }
  private updatePlayerBasketball(oddsInfo: OddsInfo[]): void {
    const groupBetTypes = groupBy(oddsInfo, 'betTypeId');
    for (const betTypeId in groupBetTypes) {
      const playerItems = this.advancedModeService.getItemsPlayerSelection(betTypeId, groupBetTypes[betTypeId]);
      this.baseSpecialBetTypeBasketball.push(this.advancedModeService.initSelection('Player', `${betTypeId}`, playerItems, true, null, false, false, false, false, false, false));
      if (AdvancedModeConstants.BETTYPE_POINTS_BASKETBALL.split(',').includes(betTypeId)) {
        const pointsItems = this.advancedModeService.getItemsBetChoiceSelection(groupBetTypes[betTypeId]);
        this.baseSpecialBetTypeBasketball.push(this.advancedModeService.initSelection('Points', `${betTypeId}`, pointsItems, true, null, false, false, false, false, false, false));
      }
      if (AdvancedModeConstants.BETTYPE_OTHERS_BASKETBALL.split(',').includes(betTypeId)) {
        const pointsItems = this.advancedModeService.getItemsOtherSelection(groupBetTypes[betTypeId]);
        this.baseSpecialBetTypeBasketball.push(this.advancedModeService.initSelection('Others', `${betTypeId}`, pointsItems, true, null, false, false, false, false, false, false));
      }
    }
  }

  isShowALLBetTypesSelection() {
    return this.isShowAllBetTypeMapRound || this.isShowAllBetTypeQuarter || this.isShowAllBetTypeSet || this.isShowAllBetTypeGame || this.isShowAllBetTypeInning;
  }
}
