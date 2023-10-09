import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { InputBetIdsComponent } from '../../../internal/components/input-betids/input-betids.component';
import { GetTicketsQuery } from '../models/query.model';

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
    @Output() searchEvent = new EventEmitter<GetTicketsQuery>();
    query = new GetTicketsQuery();

    searchTicket() {
        if (this.checkValidationBeforeSearch()) {
            this.changeSearchEvent();
            this.searchEvent.emit(this.query);
        }
    }

    private checkValidationBeforeSearch() {
        return this.inputBetIds.isHasBetId();
    }

    changeSearchEvent() {
        this.query = {
            transIds: this.inputBetIds.groupNumber.getValue()
        };
    }

    resetFilter() {
        this.inputBetIds.groupNumber.items = [];
    }
}