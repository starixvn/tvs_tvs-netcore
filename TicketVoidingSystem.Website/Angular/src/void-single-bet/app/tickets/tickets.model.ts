import { ElementRef } from '@angular/core';
import { AffectedLicensee } from '../../../utility/components/licensee-affected-list/licensee-affected-list.model';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Message } from '../../../utility/components/template-message/messages/message';
import { BetID } from '../../../utility/models/bet-id.model';
import { GroupModel } from './group.model';

enum IconCheckBox {
    none = 0,
    any = 1,
    all = 2
}

export class TicketsModel {
    id: string;
    totalItems: number;
    singleCount: number;
    parlayCount: number;
    fromTransTime: Date;
    toTransTime: Date;
    fromCheckTime: Date;
    toCheckTime: Date;
    strFromTime: string;
    strToTime: string;
    licenseeAffectedList: AffectedLicensee[];
    betTypeNameReplaceMessage: Message;
    smallestMapTicket: string;
    groups: Array<GroupModel>;
    pagingModel: PagingModel;
    iconCheckBox: IconCheckBox;
    iconCheckBoxTop: string;

    updatePositionListCheckGroup(element: ElementRef) {
        const className = 'list-check-groups-input';
        const targetElement = element.nativeElement.getElementsByClassName(className);
        const top = targetElement[0].offsetParent.offsetTop * 1 + targetElement[0].offsetHeight * 1;
        this.iconCheckBoxTop = `${top}px`;
    }

    getTicketEnable(): BetID[] {
        return this.groups.flatMap(group => group.getEnableTickets());
    }

    getAllTicket(): BetID[] {
        return this.groups.flatMap(group => group.getTickets());
    }

    getTicketCricket(): BetID[] {
        return this.groups.flatMap(group => group.getTicketCricket());
    }

    getTicketSold(): string {
        const soldTickets = this.groups
            .map(group => group.getTicketSold())
            .filter(ticketSold => ticketSold !== '');
    
        return soldTickets.join(',') + this.getLastedSoldId();
    }
    

    changeIconCheckBox(): void {
        const numberTickets = this.groups.reduce((count, group) => count + group.tickets.length, 0);
        const numberTicketsChecked = this.groups.reduce((count, group) => count + group.tickets.filter(ticket => ticket.isChecked).length, 0);
    
        this.iconCheckBox = 
            numberTickets === 0 ? IconCheckBox.none :
            numberTickets === numberTicketsChecked ? IconCheckBox.all :
            numberTicketsChecked > 0 ? IconCheckBox.any : IconCheckBox.none;
    }

    getLastedSoldId(): string {
        const lastGroup = this.groups.length - 1;
        const lastedGroup = this.groups[lastGroup];
        const lastedTicket = lastedGroup.tickets[lastedGroup.tickets.length - 1];
        return lastedTicket.member.toLowerCase().indexOf('bettrade') !== -1 && lastedTicket.isChecked ?
            `,${lastedTicket.soldId}` : '';
    }

    checkAllGroupsDropDown(): void {
        const isCheckingAll = this.iconCheckBox !== IconCheckBox.all;
    
        this.groups.forEach(group => {
            group.isCheckAll = isCheckingAll ? !group.isDisabled : false;
            group.checkAllTickets();
        });
    
        this.iconCheckBox = isCheckingAll ? IconCheckBox.all : IconCheckBox.none;
    }

    checkGroups(): void {
        if (this.groups.length > 0) {
            const isAllUnchecked = this.iconCheckBox !== IconCheckBox.none;

            this.groups.forEach(group => {
                group.isCheckAll = isAllUnchecked ? false : !group.isDisabled;
                group.checkAllTickets();
            });

            this.iconCheckBox = isAllUnchecked ? IconCheckBox.none : IconCheckBox.all;
        }   
    }

    checkSettledTickets(): boolean {
        return this.groups.some(group => group.checkSettledTickets());
    }

    isAllItemsChecked(): boolean {
        return this.groups.every(group =>
            group.tickets.every(ticket => ticket.isChecked)
        );
    }

    getNumberOfCheckedTickets(): number {
        return this.groups.reduce((count, group) => count + group.getCheckedTickets().length, 0);
    }
}