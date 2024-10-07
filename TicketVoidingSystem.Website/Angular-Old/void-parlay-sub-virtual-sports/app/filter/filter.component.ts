import { Component, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { TEXT } from '../../../internal/shared/text';
import { PagingText } from '../../../internal/components/paging/setting';
import { MatchViewModel } from '../../../internal/components/match-detail/match.viewmodel';
import { InputBetIdsComponent } from '../../../internal/components/input-betids/input-betids.component';
import { BetTypesVirtualSportComponent } from '../../../internal/components/bettypes-virtualsports/bettypes-virtualsports.component';
import { GroupBetTypeVirtualSport } from '../../../internal/components/bettypes-virtualsports/bettypes-virtualsports.model';
import { AppService } from '../app.service';
import { FilterEvent } from './filter.model';

export class Mode {
    static readonly MATCH_ID = 'MatchId';
    static readonly SUB_BET_ID = 'Sub BetID(s)';
}

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})

export class FilterComponent {
    @ViewChild('betIds') inputBetIds: InputBetIdsComponent;
    @ViewChild('betTypesVSComponent') betTypesVSComponent: BetTypesVirtualSportComponent;
    @Output() searchEvent = new EventEmitter<FilterEvent>();
    @Output() changeMatchEvent = new EventEmitter<string>();
    filterEvent = new FilterEvent();
    tooltip = new Tooltip;
    mode = [Mode.MATCH_ID, Mode.SUB_BET_ID];
    filterByMatchId = true;
    matchId: string;
    preMatchId: string;
    groupsBetTypes: Array<GroupBetTypeVirtualSport>;
    sportType: number;
    isSuccessMatch = false;

    match: MatchViewModel;

    constructor(
        private element: ElementRef,
        private appService: AppService) {
        this.tooltip.element = this.element;
        this.getBetTypes();
    }

    getBetTypes() {
        this.appService.getBetTypes()
            .subscribe(data => {
                data.forEach(item => { item.betTypes.splice(-1, 1); });
                this.renderBetTypes(data);
            });
    }

    renderBetTypes(data: Array<GroupBetTypeVirtualSport>) {
        this.groupsBetTypes = [];
        data.forEach(group => {
            const item = new GroupBetTypeVirtualSport(group.sportTypes, group.betTypes);
            this.groupsBetTypes.push(item);
        });
    }

    controlFilter(value: string) {
        this.filterByMatchId = value === Mode.MATCH_ID;
        this.resetFilter();
    }

    blurMatchId() {
        if (this.matchId !== undefined && this.matchId !== this.preMatchId) {
            this.getMatchDetail();
            this.changeMatchEvent.emit(this.matchId);
            this.resetBetTypes();
        }
    }

    getMatchDetail() {
        this.appService.getMatchDetail(this.matchId)
            .subscribe(match => {
                this.match = match;
                this.checkMatch();
            });
        this.preMatchId = this.matchId;
    }

    private inValidSportTypeVirtualSport2(sportType: number){
      return ((sportType < 190 || sportType > 199) && sportType !== 177);
    }

    private inValidSportTypeVirtualSport4(sportType: number){
      return sportType !== 188 && sportType !== 9908 ;
    }

    private inValidSportTypeVirtualSport5(sportType: number){
      return sportType !== 147;
    }

    checkMatch() {
        if (this.match === null) {
            this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
            this.isSuccessMatch = false;
        }
        else if (this.inValidSportTypeVirtualSport2(this.match.sportType) && this.inValidSportTypeVirtualSport4(this.match.sportType)
          && this.inValidSportTypeVirtualSport5(this.match.sportType)) {
            this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
            this.isSuccessMatch = false;
        }
        else {
            this.isSuccessMatch = true;
            this.sportType = this.match.sportType;
        }
    }

    searchTicket() {
        if (this.checkValidaitonBeforeSearch()) {
            this.changeFilterEvent();
            this.searchEvent.emit(this.filterEvent);
        }
    }

    checkValidaitonBeforeSearch(): boolean {
        if (this.filterByMatchId) {
            return this.checkFilterByMatchId();
        }
        else {
            return this.checkFilterBySubTransIds();
        }
    }

    checkFilterByMatchId(): boolean {
        if (this.matchId === '' || this.matchId === undefined) {
            this.tooltip.display('match-id', TEXT.REQUIRED_MATCHID);
            return false;
        }
        else if (this.match === null || this.match === undefined) {
            this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
            return false;
        }
        else if (this.inValidSportTypeVirtualSport2(this.match.sportType) && this.inValidSportTypeVirtualSport4(this.match.sportType)
          && this.inValidSportTypeVirtualSport5(this.match.sportType)) {
            this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
            return false;
        }
        else {
            return this.betTypesVSComponent.validate();
        }
    }

    checkFilterBySubTransIds(): boolean {
        if (this.inputBetIds.groupNumber.getValue() === '') {
            this.tooltip.display('invalid-betid', TEXT.REQUIRED_BETIDS);
            return false;
        }

        return true;
    }

    changeFilterEvent() {
        this.filterEvent.getTicketsQuery = {
            matchId: parseInt(this.matchId, 10),
            betTypes: this.filterByMatchId ? this.betTypesVSComponent.getCheckedBetTypes() : '',
            subTransIds: this.filterByMatchId ? '' : this.inputBetIds.groupNumber.getValue(),
            pageIndex: PagingText.INDEX_ZERO,
            pageSize: PagingText.SIZE_DEFAULT
        };
        this.filterEvent.matchViewModel = this.match;
    }

    resetFilter() {
        this.matchId = '';
        this.preMatchId = '';
        this.match = null;
        this.isSuccessMatch = false;
        this.resetBetTypes();
        if (!this.filterByMatchId && this.inputBetIds !== undefined) {
            this.inputBetIds.groupNumber.items = [];
        }
    }

    resetBetTypes() {
        this.sportType = null;
        this.renderBetTypes(this.groupsBetTypes);
    }
}
