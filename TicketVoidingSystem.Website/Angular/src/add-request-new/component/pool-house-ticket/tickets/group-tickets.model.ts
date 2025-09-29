import { CommonGroupTicketsModel } from '../../../../utility/models/common.group-tickets.model';
import { TicketModel } from './ticket.model';

export class GroupModel extends CommonGroupTicketsModel<TicketModel> {
  constructor(
    name: string,
    tickets: Array<TicketModel>,
    displayTotalTickets: number) {
    super();
    this.displayTotalTickets = displayTotalTickets;
    this.mapTickets(tickets);
    this.setValue(name);
  }

  mapTickets(ticketModel: Array<TicketModel>) {
    this.tickets = [];
    ticketModel.forEach(x => {
      const ticket = new TicketModel(x);
      this.tickets.push(ticket);
    });
  }

  setValue(value: string) {
    this.setCommonValue(value);
  }

  getEnableSingleTickets(): string[] {
    const result = [];
    this.tickets.forEach(x => {
      if (x.isChecked && !x.isDisable && !x.isParlay) {
        result.push(x.value);
      }
    });

    return result;
  }

  getEnableParlayTickets(): string[] {
    const result = [];
    this.tickets.forEach(x => {
      if (x.isChecked && !x.isDisable && x.isParlay) {
        result.push(x.value);
      }
    });

    return result;
  }
}
