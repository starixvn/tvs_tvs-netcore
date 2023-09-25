import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { InputBetIdsComponent } from '../../../internal/components/input-betids/input-betids.component';
import { MatchViewModel } from '../../../internal/components/match-detail/match.viewmodel';
import { TEXT } from '../../../internal/shared/text';

import { AppService } from '../app.service';
import { Query } from '../models/query.model';

export class FILTERCONST {
    public static get SINGE(): string { return 'Single'; };
    public static get PARLAY(): string { return 'Mix Parlay'; };
    public static get SUB(): string { return 'Sub'; };
    public static get MAIN(): string { return 'Main'; };
}

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})

export class FilterComponent {
    @ViewChild('betIds') inputBetIds: InputBetIdsComponent;
    @Output() searchEvent = new EventEmitter<Query>();
    @Output() changeFilter = new EventEmitter<boolean>();
    query = new Query();
    tooltip = new Tooltip;

    ticketsType = [FILTERCONST.SINGE, FILTERCONST.PARLAY];
    types = [FILTERCONST.SUB, FILTERCONST.MAIN];
    ticketType = FILTERCONST.SINGE;
    type: string;
    matchId: string;
    preMatchId: string;
    matchViewModel: MatchViewModel;
    isSuccessMatch = false;

    constructor(
        private element: ElementRef,
        private appService: AppService) {
        this.tooltip.element = this.element;
    }

    changedTicketType() {
        this.type = this.ticketType === FILTERCONST.SINGE ? '' : FILTERCONST.SUB;
        this.resetFilter();
        this.changeFilter.emit(true);
    }

    changedType(value: string) {
        this.type = value;
        this.resetFilter();
        this.changeFilter.emit(true);
    }

    blurMatchId() {
        if (this.matchId !== '' && this.matchId !== this.preMatchId) {
            this.getMatchDetail();
            this.changeFilter.emit(true);
        }
    }

    getMatchDetail() {
        this.appService.getMatchDetail(this.matchId)
            .subscribe(match => {
                this.matchViewModel = match;
                this.checkMatch();
            });
        this.preMatchId = this.matchId;
    }

    checkMatch() {
        if (this.matchViewModel === null) {
            this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
            this.isSuccessMatch = false;
        }
        else {
            this.isSuccessMatch = true;
        }
    }

    searchTicket() {
        if (this.checkValidaitonBeforeSearch()) {
            this.changeSearchEvent();
            this.searchEvent.emit(this.query);
        }
    }

    checkValidaitonBeforeSearch() {
        if (this.type === FILTERCONST.SUB) {
            if (this.matchId === '') {
                this.tooltip.display('match-id', TEXT.REQUIRED_MATCHID);
                return false;
            }
            if ((this.matchViewModel === null || this.matchViewModel === undefined)) {
                this.tooltip.display('match-id', TEXT.INVALID_MATCHID);
                return false;
            }
        }
        if (this.inputBetIds.groupNumber.getValue() === '') {
            this.tooltip.display('invalid-betid', TEXT.REQUIRED_BETIDS);
            return false;
        }

        return true;
    }

    changeSearchEvent() {
        this.query = {
            matchId: parseInt(this.matchId, 10),
            ticketType: this.ticketType,
            type: this.type,
            transIds: this.inputBetIds.groupNumber.getValue()
        };
    }

    resetFilter() {
        this.matchId = '';
        this.preMatchId = '';
        this.isSuccessMatch = false;
        this.inputBetIds.groupNumber.items = [];
    }
}