import { SPECIALGROUP } from '../../../utility/constants/tickets-list.constant';
import '../../../utility/extensions/string.extension';
import { BetID } from '../../../utility/models/bet-id.model';
import { TicketModel } from './ticket.model';

export class GroupModel {
    name: string;
    isCheckAll: boolean;
    isExpanded: boolean;
    isDisabled: boolean;
    tickets: Array<TicketModel>;
    disabledTickets: Array<string>;

    constructor(
        name: string,
        tickets: Array<TicketModel>) {
        this.mapTickets(tickets);
        this.setValue(name);
    }

    mapTickets(tickets: Array<TicketModel>) {
        this.tickets = [];
        tickets.forEach(item => {
            const ticket = new TicketModel(item);
            this.tickets.push(ticket);
        });
    }

    setValue(name: string) {
        this.name = name;
        this.isExpanded = true;
        this.isCheckAll = this.tickets.length !== this.numberTicketDisable();
        this.isDisabled = this.tickets.length === this.numberTicketDisable();
        this.setDisabledTickets();
        this.checkDisableTickets();
        this.defaultSpecialGroup();
    }

    setDisabledTickets() {
        const list = this.tickets.map(function (item) {
            return item.mainTransId;
        });
        this.disabledTickets = list.filter(function (item, index) {
            return list.indexOf(item) === index && BigInt(item) > 0;
        });
    }

    checkDisableTickets() {
        this.tickets.forEach(ticket => {
            this.checkDisabledTicket(ticket);
        });
    }

    defaultSpecialGroup() {
        if (SPECIALGROUP.LOWERCASE.indexOf(this.name.toLowerCase()) !== -1) {
            this.isCheckAll = false;
            this.tickets.forEach(item => item.isChecked = false);
        }
    }

    checkDisabledTicket(ticket: TicketModel) {
        if (this.disabledTickets.indexOf(ticket.value) > -1) {
            this.tickets.forEach(item => {
                if (item.mainTransId === ticket.value) {
                    item.isChecked = ticket.isChecked;
                }
            });
        }
    }

    checkAllTickets() {
        this.tickets.forEach(ticket => {
            ticket.isChecked = ticket.isDisable ? ticket.isChecked : this.isCheckAll;
            this.checkDisabledTicket(ticket);
        });
    }

    changeTicketChecked(ticket: TicketModel) {
        this.setIsCheckAll();
        this.checkDisabledTicket(ticket);
    }

    numberTicketDisable(): number {
        let count = 0;
        this.tickets.forEach(ticket => {
            if (ticket.isDisable) {
                count++;
            }
        });

        return count;
    }

    setIsCheckAll() {
        let temp = true;
        for (let i = 0; i < this.tickets.length && temp; i++) {
            if (!this.tickets[i].isChecked && !this.tickets[i].isDisable) {
                temp = false;
            }
        }

        this.isCheckAll = temp;
    }

    getEnableTickets(): BetID[] {
        return this.tickets.filter(ticket => ticket.isChecked && !ticket.isDisable).map(ticket => {
            return {
                transId: ticket.value,
                siteDbGroupId: ticket.siteDbGroupId
            } as BetID;
        });
    }

    getTicketCricket(): string {
        let result = '';
        this.tickets.forEach(ticket => {
            result = ticket.isChecked && ticket.isCricket ?
                result !== '' ?
                    result + ',' + ticket.value : ticket.value
                    : result;
        });

        return result;
    }

    getTicketSold(): string {
        let result = '';
        this.tickets.forEach(ticket => {
            result = ticket.isChecked && ticket.status.toLowerCase().indexOf('sold') !== -1 ?
                result !== '' ?
                    result + ',' + ticket.value : ticket.value
                : result;
        });

        return result;
    }

    checkSettledTickets(): boolean {
        let result = false;
        for (let i = 0; i < this.tickets.length && !result; i++) {
            if (this.tickets[i].isChecked && this.tickets[i].status.isSettled()) {
                result = true;
            }
        }

        return result;
    }

    getCheckedTickets(): string[] {
        const result: string[] = [];
        this.tickets.forEach(item => {
            if (item.isChecked) {
                result.push(item.mainTransId);
            }
        });
        return result;
    }
}
