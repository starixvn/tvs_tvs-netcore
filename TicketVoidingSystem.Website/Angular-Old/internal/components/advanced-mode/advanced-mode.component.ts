import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { ItemsSelect } from '../../../external/components/multiple-selection/items-select';
import { MultipleSelect } from '../../../external/components/multiple-selection/multiple-select';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { BlockUIService } from '../../../external/services/block-ui.service';
import { TEXT } from '../../shared/text';
import { BetType } from '../group-bettypes/group-bettypes.model';
import { AdvancedModeConstants } from './advanced-mode.constants';
import { BetTeam, CheckedBetType, GetPlayersQuery, OddsInfo, Player, Selection } from './advanced-mode.model';
import { AdvancedModeService } from './advanced-mode.service';



@Component({
    selector: 'advanced-mode',
    templateUrl: './advanced-mode.component.html',
    styleUrls: ['./advanced-mode.component.scss']
})

export class AdvancedModelComponent implements OnChanges, AfterViewInit {
    @Input() getPlayerQuery: GetPlayersQuery;
    @Input() matchId: number;
    @Input() allBetTypes: BetType[];
    @Input() isTicketListing: boolean;
    @Input() isVoidEKO: boolean;

    baseBetTeam: BetTeam[] = [];
    betTeams: BetTeam[] = [];
    mapList: MultipleSelect;
    roundList: MultipleSelect;
    baseSpecialBetTypeCricket: Selection[] = [];
    isShowAdvancedMode: boolean;
    isShowContent: boolean;
    tooltip = new Tooltip;

    constructor(
        private readonly blockUIService: BlockUIService,
        private readonly service: AdvancedModeService,
        private readonly element: ElementRef) {
        this.tooltip.element = this.element;
    }

    renderBetTeams(data: BetTeam[]) {
        this.renderMapAndRound();
        this.betTeams = [];
        data.forEach(item => {
            const betTeam = new BetTeam(
                item.name,
                item.value,
                item.type,
                item.enableBetTypes,
                item.betTypes,
                item.selections,
                item.items,
                item.inputs,
                this.isTicketListing);
            this.betTeams.push(betTeam);
        });
    }

    renderMapAndRound() {
        this.mapList = new MultipleSelect();
        this.mapList.checkAllCheckBoxText = 'All';
        this.mapList.allItemsCheckedText = 'All';
        this.mapList.noneItemCheckedText = 'Select options';
        this.mapList.maxWidth = '100px';
        this.mapList.items = AdvancedModeConstants.MAP_LIST;
        this.mapList.checkAllItems(true);

        this.roundList = new MultipleSelect();
        this.roundList.checkAllCheckBoxText = 'All';
        this.roundList.allItemsCheckedText = 'All';
        this.roundList.noneItemCheckedText = 'Select options';
        this.roundList.maxWidth = '90px';
        this.roundList.items = AdvancedModeConstants.ROUND_LIST;
        this.mapList.checkAllItems(true);
    }

    ngAfterViewInit() {
        this.blockUIService.blockUIEvent.emit(false);
    }

    async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        if (this.matchId && changes['allBetTypes']) {
            if (this.baseBetTeam.length === 0) {
                await this.getBetTeamAndRenderValue(this.matchId);
            }

            this.changedBetTypes();
        }
        if (changes['getPlayerQuery']) {
            this.getPlayers();
        }
    }

    public async getBetTeamAndRenderValue(matchId: number): Promise<void> {
        this.baseBetTeam = await this.service.getBetTeams();
        if (matchId) {
            await this.getSpecialBetTeamCricket(matchId);
        }
        this.renderBetTeams(this.baseBetTeam);
        this.renderMapAndRound();
    }

    public async getSpecialBetTeamCricket(matchId: number): Promise<void> {
        const data = await this.service.GetOddsInfoSpecialBetTypes({ matchId: matchId, betTypes: AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER });
        this.updatePlayerCricket(data);
    }

    changedBetTypes() {
        this.isShowAdvancedMode = false;
        this.isShowContent = false;
        if (this.allBetTypes !== undefined) {
            this.allBetTypes.forEach(betType => {
                this.handleBetTeam(betType);
            });
        }
    }

    handleBetTeam(betType: BetType) {
        this.betTeams.forEach(betTeam => {
            this.changeBetTeam(betType, betTeam);
            betTeam.enableInput();
        });
    }

    changeBetTeam(betType: BetType, betTeam: BetTeam) {
        const betTypeIdsOfBetTeam = betTeam.betTypes.split(',');
        if (betTypeIdsOfBetTeam.indexOf(betType.id.toString()) > -1) {
            this.changeCheckedBetTypes(betType, betTeam);
        }
    }

    changeCheckedBetTypes(betType: BetType, betTeam: BetTeam) {
        const index = betTeam.checkedBetTypes.indexOf(betType.value);
        if (betType.isChecked) {
            this.changeCheckedBetTeam(betTeam);
            this.isShowAdvancedMode = true;
            this.isShowContent = true;
            if (index === -1) {
                this.addBetTypeName(betType.name, betTeam);
                betTeam.checkedBetTypes.push(betType.value);
            }
        } else {
            if (index !== -1) {
                this.removeBetTypeName(betType.name, betTeam);
                betTeam.checkedBetTypes.splice(index, 1);
            }
        }

        if (AdvancedModeConstants.BETTYPE_CRICKET_WITH_PLAYER.split(',').includes(betType.id.toString()) && betType.isChecked) {
            betTeam.resetChecked();
            this.renderSelectionCricketWithPlayer(betTeam, this.baseSpecialBetTypeCricket);
        }
    }

    changeCheckedBetTeam(betTeam: BetTeam) {
        if (betTeam.checkedBetTypes.length === 0) {
            betTeam.resetChecked();
        }
    }

    addBetTypeName(name: string, betTeam: BetTeam) {
        if (betTeam.type === 1 || betTeam.type === 8) {
            betTeam.name = betTeam.name === '' ? name : betTeam.name + ', ' + name;
        }
    }

    removeBetTypeName(name: string, betTeam: BetTeam) {
        if (betTeam.type === 1 || betTeam.type === 8) {
            const names = betTeam.name.split(', ');
            const index = names.indexOf(name);
            names.splice(index, 1);
            betTeam.name = names.join(', ');
        }
    }

    getPlayers() {
        if (this.getPlayerQuery !== undefined && this.getPlayerQuery.matchId !== '') {
            this.service.getPlayer(this.getPlayerQuery)
                .subscribe(data => {
                    this.renderPlayer(data);
                });
        }
    }

    renderPlayer(players: Player[]) {
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

        return result;
    }

    checkEmptyCheckbox(result: boolean, i: number): boolean {
        const betTeam = this.betTeams[i];
        if (betTeam.checkedBetTypes.length > 0 && betTeam.type !== 1) {
            if (betTeam.getItemsValue() === '' && betTeam.type !== 4) {
                result = false;
                this.isShowContent = true;
                this.tooltip.display('bet-team-' + i, TEXT.NO_BET_TEAM);
            }
            else if (betTeam.multiSelection !== undefined && betTeam.multiSelection.multipleSelect !== undefined &&
                betTeam.multiSelection.multipleSelect.items.length > 0 &&
                result && betTeam.multiSelection.multipleSelect.getValueItems() === '') {
                result = false;
                this.isShowContent = true;
                this.tooltip.display('multiple-selection-' + i, TEXT.NO_BET_TEAM);
            }
        }

        if (betTeam.checkedBetTypes.length > 0 && this.isTicketListing && betTeam.type === 1 && result) {
            return this.checkEmptyCheckboxWithTicketListing(result, i);
        }

        return result;
    }

    checkEmptyCheckboxWithTicketListing(result: boolean, i: number) {
        const betTeam = this.betTeams[i];
        if (betTeam.multiSelectionList !== undefined &&
            betTeam.multiSelectionList.length > 0) {
            betTeam.multiSelectionList.forEach(item => {
                if (item.multipleSelect !== undefined && item.multipleSelect.getValueItems() === '' && result) {
                    result = false;
                    this.isShowContent = true;
                    this.tooltip.display('multiple-selection-' + i, TEXT.NO_BET_TEAM);
                }
            });
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
                id: parseInt(id, 10), betTeam: '', game: '', set: '',
                value: '', valueHdp1: '', valueHdp2: '', betOption: '', goal: '', oddsSpread: '', oddsId: '', transdesc: ''
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
                items.push(new Selection(x.playerName, x.playerId, null, true, null));
            });
        }

        return items;
    }

    private renderSelectionCricketWithPlayer(betTeam: BetTeam, baseBetType: Selection[]): void {
        if (this.isVoidEKO) {
            this.renderSelectionCricketWithPlayerVoidEKO(betTeam, baseBetType);
        } else {
            this.renderSelectionCricketWithPlayerVoidParlay(betTeam, baseBetType);
        }
    }

    private renderSelectionCricketWithPlayerVoidEKO(betTeam: BetTeam, baseBetType: Selection[]): void {
        // update bet-team for Void EKO to type = 1
        betTeam.type = 1;
        const items = this.getItemsByCheckedBetTypes(betTeam, baseBetType);
        const playerSelection = betTeam.selections.find(x => x.name === 'Player:');
        playerSelection.items = [new Selection('All', 'All', null, false, null)];
        playerSelection.items.push(..._.uniqWith(items, _.isEqual));
    }

    private renderSelectionCricketWithPlayerVoidParlay(betTeam: BetTeam, baseBetType: Selection[]): void {
        const items = this.getItemsByCheckedBetTypes(betTeam, baseBetType);
        const playerSelection = betTeam.selections.find(x => x.name === 'Player:');
        if (playerSelection) {
            playerSelection.items = betTeam.selections.find(x => x.name === 'Player:').items.filter(x => x.name === 'All');
            playerSelection.items.push(..._.uniqWith(items, _.isEqual));
        }
        betTeam.selections.forEach(x => {
            if (x.name === 'Player:') {
                x.isMultiple = true;
                betTeam.renderMultipleSelect(x);
            }
        });
    }

    private getItemsByCheckedBetTypes(betTeam: BetTeam, baseBetType: Selection[]): Selection[] {
        const items: Selection[] = [];
        baseBetType.forEach(x => {
            if (betTeam.checkedBetTypes.includes(x.value)) {
                items.push(...x.items);
            }
        });

        return items;
    }
}