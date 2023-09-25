import { Component, ElementRef, Input, OnInit } from '@angular/core';

import { TicketsModel } from './tickets.model';

@Component({
    selector: 'tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss']
})

export class TicketsComponent implements OnInit {
    @Input() ticketsModel: TicketsModel;
    @Input() isShowTickets: boolean;

    isShowListCheckGroup: boolean;
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
}