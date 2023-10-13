import { BetId } from '../../../internal/models/bet-id.model';
import { SPECIALGROUP } from '../../../internal/shared/special-group';
import { TicketViewModel } from './ticket.viewmodel';

export class GroupViewModel {
  name: string;
  isCheckAll: boolean;
  isExpanded: boolean;
  isDisabled: boolean;
  tickets: Array<TicketViewModel>;
  disabledTickets: Array<string>;

  constructor(
    name: string,
    tickets: Array<TicketViewModel>) {
    this.name = name;
    this.tickets = tickets;
    this.setValue();
  }

  setValue() {
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
      return list.indexOf(item) === index && parseInt(item) > 0;
    });
  }

  checkDisableTickets() {
    this.tickets.forEach(ticket => {
      this.checkDisabledTicket(ticket);
    });
  }

  checkDisabledTicket(ticket: TicketViewModel) {
    if (this.disabledTickets.indexOf(ticket.betId) > -1) {
      this.tickets.forEach(item => {
        if (item.mainTransId === ticket.betId) {
          item.isChecked = ticket.isChecked;
        }
      });
    }
  }

  defaultSpecialGroup() {
    if (SPECIALGROUP.LOWERCASE.indexOf(this.name.toLowerCase()) !== -1) {
      this.isCheckAll = false;
      this.tickets.forEach(item => item.isChecked = false);
    }
  }

  checkAllTickets() {
    this.tickets.forEach(ticket => {
      ticket.isChecked = ticket.isDisable ? ticket.isChecked : this.isCheckAll;
      this.checkDisabledTicket(ticket);
    });
  }

  changeTicketChecked(ticket: TicketViewModel) {
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

  getEnableTickets(): BetId[] {
    return this.tickets.filter(ticket => ticket.isChecked && !ticket.isDisable).map(ticket => {
      return {
        transId: ticket.subTransId,
        siteDbGroupId: ticket.siteDbGroupId
      } as BetId;
    });
  }

  getTickets(): BetId[] {
    return this.tickets.map(ticket => {
      return {
        transId: ticket.subTransId,
        siteDbGroupId: ticket.siteDbGroupId
      } as BetId;
    });
  }

  getTicketCricket(): BetId[] {
    return this.tickets.filter(ticket => ticket.isChecked && ticket.isCricket).map(ticket => {
      return {
        transId: ticket.subTransId,
        siteDbGroupId: ticket.siteDbGroupId
      } as BetId;
  });
}

  getTicketSold(): string {
    let result = '';
    this.tickets.forEach(ticket => {
      result = ticket.isChecked && ticket.status.toLowerCase().indexOf('sold') !== -1 ?
        result !== '' ?
          result + ',' + ticket.subTransId.toString() : ticket.subTransId.toString()
        : result;
    });

    return result;
  }
}
