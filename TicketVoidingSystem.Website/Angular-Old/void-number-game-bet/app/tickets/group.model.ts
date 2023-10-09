import { BetId } from '../../../internal/models/bet-id.model';
import { TicketModel } from './ticket.model';

export class GroupModel {
    name: string;
    isCheckAll: boolean;
    isExpanded: boolean;
    tickets: Array<TicketModel>;
    isDisabled: boolean;

    constructor(
        name: string,
        tickets: Array<TicketModel>) {
        this.name = name;
        this.mapTickets(tickets);
        this.isCheckAll = this.tickets.length !== this.numberTicketDisable();
        this.isDisabled = this.tickets.length === this.numberTicketDisable();
        this.isExpanded = true;
    }

    mapTickets(tickets: Array<TicketModel>) {
        this.tickets = [];
        tickets.forEach(item => {
            const ticket = new TicketModel(
                item.no,
                item.betId,
                item.member,
                item.transDate,
                item.betType,
                item.odds,
                item.stake,
                item.winLost,
                item.currencyName,
                item.status,
                item.creator,
                item.ballSequence,
                item.choice,
                item.isDisable,
                item.siteDbGroupId);
            this.tickets.push(ticket);
        });
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

    checkTickets() {
        this.tickets.forEach(ticket => {
            ticket.isChecked = ticket.isDisable ? ticket.isChecked : this.isCheckAll;
        });
    }

    changeTickets(ticket: TicketModel) {
        let temp = true;
        for (let i = 0; i < this.tickets.length && temp; i++) {
            if (!this.tickets[i].isChecked && !this.tickets[i].isDisable) {
                temp = false;
            }
        }

        this.isCheckAll = temp;
    }

    getCheckedTickets(): BetId[] {
        return this.tickets.filter(ticket => ticket.isChecked && !ticket.isDisable).map(ticket => {
            return {
                transId: ticket.betId,
                siteDbGroupId: ticket.siteDbGroupId
            } as BetId;
        });
    }
}