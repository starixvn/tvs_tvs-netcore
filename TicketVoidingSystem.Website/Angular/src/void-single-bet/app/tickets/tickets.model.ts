import { ElementRef } from '@angular/core';
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
    licenseesName: string;
    instantLicenseesName: string;
    cashOutLicenseesName: string;
    chinaViewLicenseesName: string;
    betTypeNameReplaceMessage: Message;

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
        const result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getEnableTickets();
            result.push(...ticketInGroup);
        });

        return result;
    }

    getTicketCricket(): string {
        let result = '';
        this.groups.forEach(group => {
            const ticketInGroup = group.getTicketCricket();
            result = ticketInGroup !== '' ?
                result !== '' ? result + ',' + ticketInGroup : ticketInGroup
                : result;
        });

        return result;
    }

    getTicketSold(): string {
        let result = '';
        this.groups.forEach(group => {
            const ticketInGroup = group.getTicketSold();
            result = ticketInGroup !== '' ?
                result !== '' ? result + ',' + ticketInGroup : ticketInGroup
                : result;
        });

        return result + this.getLastedSoldId();
    }

    changeIconCheckBox() {
        let numberTickets = 0;
        let numberTicketsChecked = 0;
        this.groups.forEach(group => {
            group.tickets.forEach(ticket => {
                numberTickets++;
                if (ticket.isChecked) {
                    numberTicketsChecked++;
                }
            });
        });
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

    checkAllGroupsDropDown() {
        if (this.iconCheckBox !== IconCheckBox.all) {
            this.groups.forEach(group => {
                group.isCheckAll = !group.isDisabled;
                group.checkAllTickets();
            });
            this.iconCheckBox = IconCheckBox.all;
        } else {
            this.groups.forEach(group => {
                group.isCheckAll = false;
                group.checkAllTickets();
            });
            this.iconCheckBox = IconCheckBox.none;
        }
    }

    checkGroups() {
        const groupLength = this.groups.length;
        if (groupLength > 0) {
            if (this.iconCheckBox !== IconCheckBox.none) {
                this.groups.forEach(group => {
                    group.isCheckAll = false;
                    group.checkAllTickets();
                });
                this.iconCheckBox = IconCheckBox.none;
            } else {
                this.groups.forEach(group => {
                    group.isCheckAll = !group.isDisabled;
                    group.checkAllTickets();
                });
                this.iconCheckBox = IconCheckBox.all;
            }
        }
    }

    checkSettledTickets(): boolean {
        let result = false;
        this.groups.forEach(item => {
            if (item.checkSettledTickets()) {
                result = true;
            }
        });

        return result;
    }

    isAllItemsChecked(): boolean {
        let result = true;
        for (let i = 0; i < this.groups.length && result; i++) {
            for (let j = 0; j < this.groups[i].tickets.length && result; j++) {
                const ticket = this.groups[i].tickets[j];
                result = ticket.isChecked;
            }
        }

        return result;
    }

    getNumberOfCheckedTickets(): number {
        let result = 0;
        this.groups.forEach(item => result += item.getCheckedTickets().length);
        return result;
    }
}