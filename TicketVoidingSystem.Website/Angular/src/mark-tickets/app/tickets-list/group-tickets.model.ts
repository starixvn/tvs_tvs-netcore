import { SPECIALGROUP } from '../../../utility/constants/tickets-list.constant';
import '../../../utility/extensions/string.extension';
import { CommonGroupTicketsModel } from '../../../utility/models/common.group-tickets.model';
import { TicketModel } from './ticket.model';

export class GroupModel extends CommonGroupTicketsModel<TicketModel> {
  uncheckedTicketList: Array<string>;

  constructor(
    name: string,
    tickets: Array<TicketModel>,
    uncheckedTicketsList: Array<string>) {
    super();
    this.uncheckedTicketList = uncheckedTicketsList;
    this.mapTickets(tickets);
    this.setValue(name);
  }

  mapTickets(tickets: Array<TicketModel>) {
    this.tickets = [];
    tickets.forEach(item => {
      const ticket = new TicketModel(item);
      const indexTicket = this.uncheckedTicketList.indexOf(item.value);
      if (indexTicket >= 0) {
        ticket.isChecked = false;
      }
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

  defaultSpecialGroup() {
    if (SPECIALGROUP.LOWERCASE.indexOf(this.name.toLowerCase()) !== -1) {
        this.isCheckAll = false;
        this.tickets.forEach(item => item.isChecked = false);
    }
  }

  getEnableSingleTickets(): string[] {
    return super.getEnableSingleTickets();
  }

  getDisableBonusTickets(): string[] {
    return super.getDisableBonusTickets();
  }

  getEnableParlayTickets(): string[] {
    return this.getEnableSingleTickets();
  }
}
