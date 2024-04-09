import { Component, ElementRef, Input, OnChanges, SimpleChange, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { LABELS } from '../../../../utility/constants/labels';
import { TEXT } from '../../../../utility/constants/text';
import { CommonService } from '../../../../utility/services/common.service';
import { StaticService } from '../../../../utility/services/static.service';
import { ItemsSelect } from '../../multiple-selection/items-select';
import { MultipleSelection } from '../../multiple-selection/multiple-selection';
import { Tooltip } from '../../tooltip/tooltip.model';
import { AdvancedModeConstants } from '../advanced-mode.constants';
import { BetType } from '../group-bettypes/group-bettypes.model';
import { BetTeam, CheckedBetType, GetPlayersQuery, OddsInfo, Player, Selection } from './advanced-mode.model';
import { AdvancedModeService } from './advanced-mode.service';

@Component({
  selector: 'advanced-mode',
  templateUrl: './advanced-mode.component.html',
  styleUrls: ['./advanced-mode.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvancedModeComponent implements OnChanges {
  @Input() getPlayerQuery: GetPlayersQuery;
  @Input() matchId: string;
  @Input() allBetTypes: BetType[];
  @Input() isHaveMultipleMapRound: boolean;

  baseBetTeam: BetTeam[] = [];
  betTeams: BetTeam[] = [];
  mapList: MultipleSelection;
  roundList: MultipleSelection;
  betTypesMoreHDP = AdvancedModeConstants.BETTYPES_MORE_HDP;
  baseSpecialBetTypeCricket: Selection[] = [];
  isShowAdvancedMode: boolean;
  isShowContent: boolean;
  isShowAllBetType: boolean;
  tooltip = new Tooltip();
  oddsInfo: OddsInfo[];

  constructor(
    private readonly service: AdvancedModeService,
    private readonly commonService: CommonService,
    private readonly element: ElementRef
    ) {
    this.tooltip.element = this.element;
  }

  renderBetTeams(data: BetTeam[]) {
    this.betTeams = [];
    data.forEach(item => {
      const betTeam = new BetTeam([item.name, item.value, item.type, item.enableBetTypes, item.betTypes],
        item.selections, item.items, item.inputs, this.isHaveMultipleMapRound);
      this.betTeams.push(betTeam);
    });
  }

  renderMapAndRound() {
    this.mapList = new MultipleSelection();
    this.mapList.checkAllCheckBoxText = 'All';
    this.mapList.allItemsCheckedText = 'All';
    this.mapList.noneItemCheckedText = 'Select options';
    this.mapList.maxWidth = '100px';
    this.mapList.items = AdvancedModeConstants.MAP_LIST;
    this.mapList.checkAllItems(true);

    this.roundList = new MultipleSelection();
    this.roundList.checkAllCheckBoxText = 'All';
    this.roundList.allItemsCheckedText = 'All';
    this.roundList.noneItemCheckedText = 'Select options';
    this.roundList.maxWidth = '90px';
    this.roundList.items = AdvancedModeConstants.ROUND_LIST;
    this.mapList.checkAllItems(true);
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
      await this.getSpecialBetTeamCricket(matchId);
    }
    this.renderBetTeams(this.baseBetTeam);
    this.renderMapAndRound();
  }

  public async getSpecialBetTeamCricket(matchId: string): Promise<void> {
    const data = await this.commonService.GetOddsInfoSpecialBetTypes({matchId: matchId, betTypes: AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER});
    this.updatePlayerCricket(data);
    this.oddsInfo = data;
  }

  private changedBetTypes() {
    this.isShowAdvancedMode = false;
    this.isShowContent = false;
    this.isShowAllBetType = false;
    if (this.allBetTypes !== undefined) {
      this.allBetTypes.forEach(betType => {
        this.handleBetTeam(betType);
      });
    }
  }

  private handleBetTeam(betType: BetType) {
    this.betTeams.forEach(betTeam => {
      this.changeBetTeam(betType, betTeam);
      betTeam.enableInput();
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
        this.addBetTypeName(betType.name, betTeam);
        betTeam.checkedBetTypes.push(betType.value);
      }
      if (betTeam.multiSelectionList.length > 0) {
        this.isShowAllBetType = true;
      }
    } else if (index !== -1) {
        this.removeBetTypeName(betType.name, betTeam);
        betTeam.checkedBetTypes.splice(index, 1);
      }

    if (AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER.split(',').includes(betType.id.toString()) && betType.isChecked) {
      betTeam.resetChecked();
      this.renderSelectionCricketWithPlayer(betTeam, this.baseSpecialBetTypeCricket);
    }
  }

  private changeCheckedBetTeam(betTeam: BetTeam) {
    if (betTeam.checkedBetTypes.length === 0) {
      betTeam.resetChecked();
    }
  }

  private addBetTypeName(name: string, betTeam: BetTeam) {
    if (betTeam.type === 1 || betTeam.type === 8) {
      betTeam.name = betTeam.name === '' ? name : betTeam.name + ', ' + name;
    }
  }

  private removeBetTypeName(name: string, betTeam: BetTeam) {
    if (betTeam.type === 1 || betTeam.type === 8) {
      const names = betTeam.name.split(', ');
      const index = names.indexOf(name);
      names.splice(index, 1);
      betTeam.name = names.join(', ');
    }
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
      const item = new ItemsSelect(i, players[i].betChoice, players[i].oddsInfo, true, true, true, []);
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
  }

  validate(): boolean {
    let result = true;
    for (let i = 0; i < this.betTeams.length && result; i++) {
      result = this.checkEmptyCheckbox(result, i);
    }

    let isValidOddsSpread = true;
    let isValidHDP = true;

    this.allBetTypes.filter(x => x.isChecked && (x.id === 228 || x.id === 229 || this.betTypesMoreHDP.includes(x.id.toString()))).forEach(y => {
      const betTeam = this.betTeams.find(x => x.checkedBetTypes.some(t => t.split(',').includes(y.id.toString())));
      if (betTeam) {
        if (this.isBetTypeSabaTimeMachine(y.id) && !this.validateInputMultipleDecimal(y.id.toString(), betTeam.inputs[0].value, 'bet-type-saba' + y.id.toString())) {
          isValidOddsSpread = false;
        } else if (this.isBetTypeMoreHDP(y.id) && !this.validateInputMultipleDecimal(y.id.toString(), betTeam.items[0].value, 'bet-type-more-hdp')) {
          isValidHDP = false;
        }
      }
    });

    return result && isValidHDP && isValidOddsSpread;
  }

  private isBetTypeSabaTimeMachine(id: number): boolean {
    return AdvancedModeConstants.BETTYPES_SABA_TIME_MACHINE.split(',').includes(id.toString());
  }

  private isBetTypeMoreHDP(id: number): boolean {
    return AdvancedModeConstants.BETTYPES_MORE_HDP.split(',').includes(id.toString());
  }

  onChangeInputMultipleDecimal(betTypeId: string, value: string, className: string) {
    if (!this.validateInputMultipleDecimal(betTypeId, value, className)) {
      return false;
    }
    this.tooltip.hide();

    return true;
  }

  private validateInputMultipleDecimal(betTypeId: string, value: string, className: string): boolean {
    const errorText = betTypeId === '228' ? LABELS.INVALID_VALUE : LABELS.INVALID_HDP;
    if (value && !StaticService.isCorrectRegexMultipleDecimal(value)) {
      this.tooltip.display(className, errorText);
      return false;
    }

    return true;
  }

  private checkMultiSelectionListBetTeam(betTeam: BetTeam): boolean {
    return betTeam.multiSelectionList?.filter(x => x.multipleSelect.items.length > 0)
      .some(y => y.multipleSelect.getValueItems() === '')
  }

  private checkMultiSelectionInSelection(betTeam: BetTeam): boolean {
    return (
      betTeam.selections.filter(x => x.multiSelection !== undefined && x.multiSelection?.multipleSelect.items.length > 0)
        .some(y => y.multiSelection.multipleSelect.getValueItems() === '')
    );
  }

  private checkCheckedBetTypesWithHDPBetType(betTeam: BetTeam) {
    return betTeam.checkedBetTypes.length > 0 && betTeam.type === 1;
  }

  private checkEmptyCheckbox(result: boolean, i: number): boolean { //NOSONAR
    const betTeam = this.betTeams[i];
    if (betTeam.checkedBetTypes.length > 0) {
      if (betTeam.getItemsValue() === '' && betTeam.type !== AdvancedModeConstants.BETTEAM_TYPE_4) {
        result = false;
        this.isShowContent = true;
        this.tooltip.display(`bet-team-${i}`, LABELS.NO_BET_TEAM);
      } else if (this.checkMultiSelectionListBetTeam(betTeam) && result) {
        const invalidSelection = betTeam.multiSelectionList.find(x => x.multipleSelect.getValueItems() === '')
        result = false;
        this.isShowContent = true;
        this.tooltip.display(`multiple-selection-${i}-selection-${betTeam.multiSelectionList.indexOf(invalidSelection)}`, LABELS.NO_BET_TEAM);
      } else if (this.checkMultiSelectionInSelection(betTeam) && result) {
        const invalidSelection = betTeam.selections.find(x => x.multiSelection.multipleSelect.getValueItems() === '')
        result = false;
        this.isShowContent = true;
        this.tooltip.display(`multiple-selection-${i}-selection-${betTeam.selections.indexOf(invalidSelection)}`, LABELS.NO_BET_TEAM);
      }
    }

    if (this.checkCheckedBetTypesWithHDPBetType(betTeam) && this.isHaveMultipleMapRound && result) {
      return this.checkEmptyCheckboxWithTicketListing(result, i);
    }

    return result;
  }

  private checkEmptyCheckboxWithTicketListing(result: boolean, i: number) {
    const betTeam = this.betTeams[i];
    if (betTeam.multiSelectionList?.length > 0) {
      for (let i = 0; i < betTeam.multiSelectionList.length && result; i++) {
        if (betTeam.multiSelectionList[i].multipleSelect !== undefined && betTeam.multiSelectionList[i].multipleSelect.getValueItems() === '' && result) {
          result = false;
          this.isShowContent = true;
          this.tooltip.display(`multiple-selection-list-${i}`, TEXT.NO_BET_TEAM);
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
          const betType: CheckedBetType = _.assignIn({ id: parseInt(id, 10) }, item.getResult(id));
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
        virtualHead: ''
      };
      betTypes.push(betType);
    });

    return betTypes;
  }

  updateAllMapAndRoundItemsSelection(itemList: string[], type: string) {
    if (this.betTeams.length > 0) {
      this.betTeams.forEach(item => {
        if (item.multiSelectionList.length > 0) {
          item.updateItemListMapAndRound(itemList, type);
        }
      });
    }
  }

  checkBetTypesMoreHDP(betTeam: BetTeam, isDivOfBetTypesMoreHDP: boolean) {
    if (betTeam.items.length > 0 && ((betTeam.enableBetTypes === this.betTypesMoreHDP && isDivOfBetTypesMoreHDP)
      || (betTeam.enableBetTypes !== this.betTypesMoreHDP && !isDivOfBetTypesMoreHDP))) {
      return true;
    }

    return false;
  }

  isShowTextBox(betTeam: BetTeam) {
    if (betTeam.inputs.length > 0) {
      return true;
    }

    return false;
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
    const groupBetTypes = _.groupBy(oddsInfo, 'betTypeId');
    for (const betTypeId in groupBetTypes) {
      const items = this.getItemsPlayerSelection(betTypeId, groupBetTypes[betTypeId]);
      this.baseSpecialBetTypeCricket.push(new Selection('', `${betTypeId}`, items, true, null));
    }
  }

  private getItemsPlayerSelection(betTypeId: string, odds: OddsInfo[]): Selection[] {
    const items: Selection[] = [];
    if (AdvancedModeConstants.BETTYPE_NEXT_MAN_OUT.split(',').includes(betTypeId)) {
      const groupsOdds = _.groupBy(odds, 'oddsId');
      for (const oddsId in groupsOdds) {
        const oddsName = groupsOdds[oddsId].map(y => y.playerName).join(' & ');
        groupsOdds[oddsId].forEach(x => {
          items.push(
            new Selection(`${x.playerName} - ${oddsName}`, `${x.betChoice},${x.oddsId}`, null, true, null)
          );
        });
      }
    } else {
      odds.forEach(x => {
        items.push(new Selection(x.playerName, x.playerId.toString(), null, true, null));
      });
    }

    return items;
  }

  private renderSelectionCricketWithPlayer(betTeam: BetTeam, baseBetType: Selection[]): void {
    const items: Selection[] = [];
    baseBetType.forEach(x => {
      if (betTeam.checkedBetTypes.includes(x.value)) {
        items.push(...x.items);
      }
    });
    const playerSelection = betTeam.selections.find(x => x.name === 'Player:');
    if (playerSelection) {
      playerSelection.items = betTeam.selections.find(x => x.name === 'Player:').items.filter(x => x.name === 'All');
      playerSelection.items.push(..._.uniqWith(items, _.isEqual));
    }
    betTeam.selections.forEach(x => {
      if (x.name === 'Player:') {
        x.isMultiple = true;
        betTeam.renderMultipleSelect(x);
        x.multiSelection = betTeam.multiSelection;
        delete betTeam.multiSelection;
      }
    });
  }
}
