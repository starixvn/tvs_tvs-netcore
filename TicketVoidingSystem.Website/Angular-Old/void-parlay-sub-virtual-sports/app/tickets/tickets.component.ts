import { Component, Input, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';

import { TicketsModel } from './tickets.model';
import { PagingModel, PagingEvent } from '../../../internal/components/paging/paging.model';

@Component({
    selector: 'tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss']
})

export class TicketsComponent implements OnInit {
    @Input() ticketsModel: TicketsModel;
    @Input() isShowTickets: boolean;
    @Output() pagingSearchTicket = new EventEmitter<PagingEvent>();
    @Output() exportExcelEvent = new EventEmitter<boolean>();

    isShowListCheckGroup: boolean;
    pagingModel = new PagingModel;

    constructor(private element: ElementRef) {
    }

    ngOnInit() {
        this.clickBody();
    }

    showListCheckGroup() {
        if (this.ticketsModel.groups.length > 0) {
            this.isShowListCheckGroup = true;
            this.ticketsModel.updatePositionListCheckGroup(this.element);
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
}