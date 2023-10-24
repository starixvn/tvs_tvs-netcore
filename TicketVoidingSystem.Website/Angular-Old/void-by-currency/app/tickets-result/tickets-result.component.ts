import { Component, Input, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';

import { GroupTicketsViewModel } from './tickets.viewmodel';
import { PagingModel, PagingEvent } from '../../../internal/components/paging/paging.model';

@Component({
    selector: 'tickets-result',
    templateUrl: './tickets-result.component.html',
    styleUrls: ['./tickets-result.component.scss']
})

export class TicketsResultComponent implements OnInit {
    @Input() ticketsViewModel: GroupTicketsViewModel;
    @Input() isShowTickets: boolean;
    @Output() pagingSearchTicket = new EventEmitter<PagingEvent>();
    @Output() exportExcelEvent = new EventEmitter<boolean>();

    isShowListCheckGroup: boolean;
    showMessageBetTrade: boolean;
    pagingModel = new PagingModel;

    constructor(private element: ElementRef) {
    }

    ngOnInit() {
        this.clickBody();
    }

    showListCheckGroup() {
        if (this.ticketsViewModel.groups.length > 0) {
            this.isShowListCheckGroup = true;
            this.ticketsViewModel.updatePositionListCheckGroup(this.element);
        }
    }

    clickBody() {
        const body = document.querySelector('body');
        const className = 'list-check-groups-input';
        const listCheckGroupsElement = this.element.nativeElement.getElementsByClassName(className);
        body.addEventListener('click', e => {
            if (!this.isShowListCheckGroup || !e.target) { return; };
            if (listCheckGroupsElement[0] !== e.target && !listCheckGroupsElement[0].contains((<any>e.target))) {
                this.isShowListCheckGroup = false;
            }
        }, false);
    }

    exportExcel() {
        this.exportExcelEvent.emit();
    }

    changePagingEvent(pagingEvent: PagingEvent) {
        this.pagingSearchTicket.emit(pagingEvent);
    }

    showWarningBetTradeTicket() {
        if (this.ticketsViewModel.groups.length > 0) {
            const lastGroup = this.ticketsViewModel.groups.length - 1;
            const lastedGroup = this.ticketsViewModel.groups[lastGroup];
            const lastedTicket = lastedGroup.tickets[lastedGroup.tickets.length - 1];
            this.showMessageBetTrade = lastedTicket.member.toLowerCase().indexOf('bettrade') !== -1 && lastedTicket.isChecked;
        }
    }
}