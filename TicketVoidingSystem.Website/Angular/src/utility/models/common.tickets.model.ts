import { ElementRef } from '@angular/core';
import { CommonGroupTicketsModel } from './common.group-tickets.model';
import { CommonTicketModel } from './common.ticket.model';
import { GroupService } from '../components/tickets/group.service';

enum IconCheckBox {
    none = 0,
    any = 1,
    all = 2
}

export class CommonTicketsModel<T extends CommonGroupTicketsModel<CommonTicketModel>> {
    id: string;
    groups = Array<T>();
    groupOtherTickets = Array<T>();
    iconCheckBox: IconCheckBox;
    iconCheckBoxTop: string;
    
    getCheckedTickets(isChecked: boolean): string[] {
        const result: string[] = [];
        this.groups.forEach(group => {
            group.tickets.forEach(ticket => {
                if (ticket.isChecked === isChecked) {
                    result.push(ticket.value);
                }
            });
        });

        return result;
    }

    updatePositionListCheckGroup(element: ElementRef) {
        const className = 'list-check-groups-input';
        const targetElement = element.nativeElement.getElementsByClassName(className);
        const top = Number(targetElement[0].offsetParent.offsetTop) + Number(targetElement[0].offsetHeight);
        this.iconCheckBoxTop = `${top}px`;
    }

    updateTicketsByUncheckTransIds(uncheckTransIds: string[]): void {
        this.groups.forEach(group => {
            group.tickets.forEach(item => {
                item.isChecked = uncheckTransIds.indexOf(item.value) > -1 ? false : item.isChecked;
            });
            group.isCheckAll = GroupService.setIsCheckAll(group.tickets);
            group.checkDisableTickets();
        });
    }

    getSingleTransIds(): string {
        let result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getEnableSingleTickets();
            result = result.concat(ticketInGroup);
        });

        return result.join(',');
    }

    getDisableBonusTransIds(): string {
        let result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getDisableBonusTickets();
            result = result.concat(ticketInGroup);
        });

        return result.join(',');
    }

    getParlayTransIds(): string {
        let result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getEnableParlayTickets();
            result = result.concat(ticketInGroup);
        });

        return result.join(',');
    }

    getTicketEnable(): string {
        let result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getEnableTickets();
            result = result.concat(ticketInGroup);
        });

        return result.join(',');
    }

    getTicketCricket(): string {
        let result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getTicketCricket();
            result = result.concat(ticketInGroup);
        });

        return result.join(',');
    }

    getTicketSold(): string {
        let result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getTicketSold();
            result = result.concat(ticketInGroup);
        });

        return result.join(',') + this.getLastedSoldId();
    }

    getTicketCheckBalance(): string {
        let result = [];
        this.groups.forEach(group => {
            const ticketInGroup = group.getTicketCheckBalance();
            result = result.concat(ticketInGroup);
        });

        return `${result}${this.getLastedSoldId()}`;
    }

    getLastedSoldId(): string {
        const lastGroup = this.groups.length - 1;
        const lastedGroup = this.groups[lastGroup];
        const lastedTicket = lastedGroup.tickets[lastedGroup.tickets.length - 1];
        return lastedTicket.member.toLowerCase().indexOf('bettrade') !== -1 && lastedTicket.isChecked ?
            `,${lastedTicket.soldId}` : '';
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

    checkSettledTickets(): boolean {
        let result = false;
        this.groups.forEach(item => {
            if (item.checkSettledTickets()) {
                result = true;
            }
        });

        return result;
    }

    getNumberOfCheckedTickets(): number {
        let result = 0;
        this.groups.forEach(item => result += item.getCheckedTickets().length);
        return result;
    }
}
