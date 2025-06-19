import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TicketsModel } from './tickets.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagingComponent } from '../paging/paging.component';
import { SanitizeHtmlPipe } from '../../modules/sanitize-html.pipe';
import { PagingModel } from '../paging/paging.model';

@Component({
    standalone: true,
    selector: 'tickets',
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss'],
    imports: [CommonModule, SanitizeHtmlPipe, FormsModule, PagingComponent]
})

export class TicketsComponent implements OnInit {
    @Input() ticketsModel: TicketsModel;
    @Input() isShowTickets: boolean;
    @Input() isHasPaging = true;
    @Output() pagingSearchTicket = new EventEmitter<PagingModel>();
    @Output() exportExcelEvent = new EventEmitter<boolean>();
    @Output() ticketsChange = new EventEmitter<number>();
    isShowListCheckGroup: boolean;
    showMessageBetTrade: boolean;
    element = inject(ElementRef);

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
            if (!this.isShowListCheckGroup || !e.target) {
                return;
            }

            if (listCheckGroupsElement[0] !== e.target && !listCheckGroupsElement[0].contains(e.target)) {
                this.isShowListCheckGroup = false;
            }
        }, false);
    }

    exportExcel() {
        this.exportExcelEvent.emit();
    }

    changePagingEvent() {
        this.pagingSearchTicket.emit(this.ticketsModel.pagingModel);
    }

    changeTickets() {
        this.ticketsChange.emit(this.ticketsModel.getNumberOfCheckedTickets());
        this.showWarningBetTradeTicket();
    }

    showWarningBetTradeTicket() {
        if (this.ticketsModel.groups.length > 0) {
            const lastGroup = this.ticketsModel.groups.length - 1;
            const lastedGroup = this.ticketsModel.groups[lastGroup];
            const lastedTicket = lastedGroup.tickets[lastedGroup.tickets.length - 1];
            this.showMessageBetTrade = lastedTicket.member.toLowerCase().indexOf('bettrade') !== -1 && lastedTicket.isChecked;
        }
    }
}
