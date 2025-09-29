import '../extensions/string.extension';
import { CommonTicketModel } from './common.ticket.model';

export class CommonGroupTicketsModel<T extends CommonTicketModel> {
    name: string;
    isCheckAll: boolean;
    isExpanded: boolean;
    isDisabled: boolean;
    tickets: Array<T>;
    displayTotalTickets: number;
    disabledTickets: Array<string>;

    setCommonValue(name: string) {
        this.name = name;
        this.isExpanded = true;
        this.isCheckAll = this.tickets.length !== this.numberTicketDisable();
        this.isDisabled = this.tickets.length === this.numberTicketDisable();
        this.setDisabledTickets();
        this.checkDisableTickets();
    }

    setDisabledTickets() {
        const list = this.tickets.map(function (item) {
            return item.mainTransId;
        });
        this.disabledTickets = list.filter(function (item, index) {
            return list.indexOf(item) === index && item && BigInt(item) > 0;
        });
    }

    checkDisableTickets() {
        this.tickets.forEach(ticket => {
            this.checkDisabledTicket(ticket);
        });
    }

    checkDisabledTicket(ticket: T) {
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

    changeTicketChecked(ticket: T) {
        this.setIsCheckAll();
        this.checkDisabledTicket(ticket);
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

    numberTicketDisable(): number {
        let count = 0;
        this.tickets.forEach(ticket => {
            if (ticket.isDisable) {
                count++;
            }
        });

        return count;
    }

    getEnableTickets(): string[] {
        const result = [];
        this.tickets.forEach(ticket => {
            if (ticket.isChecked && !ticket.isDisable) {
                result.push(ticket.value);
            }
        });

        return result;
    }

    getTicketCricket(): string[] {
        const result = [];
        this.tickets.forEach(ticket => {
            if (ticket.isChecked && ticket.isCricket) {
                result.push(ticket.value);
            }
        });

        return result;
    }

    getTicketSold(): string[] {
        const result = [];
        this.tickets.forEach(ticket => {
            if (ticket.isChecked && ticket.status.toLowerCase().indexOf('sold') !== -1) {
                result.push(ticket.value);
            }
        });

        return result;
    }

    getTicketCheckBalance(): string[] {
        const soldIds = this.getTicketSold();
        const enableTickets = this.getEnableTickets();
        return enableTickets.concat(soldIds);
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

    checkSettledTickets(): boolean {
        let result = false;
        for (let i = 0; i < this.tickets.length && !result; i++) {
            if (this.tickets[i].isChecked && this.tickets[i].status.isSettled()) {
                result = true;
            }
        }

        return result;
    }

     getEnableSingleTickets(): string[] {
        const result = [];
        this.tickets.forEach(item => {
            if (item.isChecked && !item.isDisable) {
                result.push(item.value);
            }
        });

        return result;
    }

    getDisableBonusTickets(): string[] {
        const result = [];
        this.tickets.forEach(item => {
            if (item.isChecked && item.isDisable) {
                result.push(item.value);
            }
        });

        return result;
    }

    getEnableParlayTickets(): string[] {
        return this.getEnableSingleTickets();
    }
}
