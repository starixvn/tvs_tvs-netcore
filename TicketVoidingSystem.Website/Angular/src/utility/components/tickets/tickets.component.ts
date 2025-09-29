import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TicketsModel } from './tickets.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagingComponent } from '../paging/paging.component';
import { SanitizeHtmlPipe } from '../../modules/sanitize-html.pipe';
import { PagingModel } from '../paging/paging.model';
import { TicketsService } from './tickets.service';
import { GroupService } from './group.service';
import { GroupModel } from './group.model';
import { TicketModel } from './ticket.model';

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
    ticketsService = inject(TicketsService);
    groupService = inject(GroupService);
    
    ngOnInit() {
        this.clickBody();
    }

    showListCheckGroup() {
        if (this.ticketsModel.groups.length > 0) {
            this.isShowListCheckGroup = true;
            this.ticketsService.updatePositionListCheckGroup(this.element);
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
        this.ticketsChange.emit(this.ticketsService.getNumberOfCheckedTickets(this.ticketsModel.groups));
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

    checkGroups(){
        this.ticketsModel.iconCheckBox = this.ticketsService.checkGroups(this.ticketsModel.groups, this.ticketsModel.iconCheckBox);
    }

    checkAllTickets(group: GroupModel){
        this.groupService.checkAllTickets(group);
    }

    changeIconCheckBox(){
        this.ticketsModel.iconCheckBox = TicketsService.updateIconCheckBox(this.ticketsModel.groups);
    }

    changeTicketChecked(group: GroupModel, ticket: TicketModel){
        this.groupService.changeTicketChecked(group, ticket);
    }

    checkAllGroupsDropDown(){
        this.ticketsModel.iconCheckBox = this.ticketsService.checkAllGroupsDropDown(this.ticketsModel.groups, this.ticketsModel.iconCheckBox);
    }
}
