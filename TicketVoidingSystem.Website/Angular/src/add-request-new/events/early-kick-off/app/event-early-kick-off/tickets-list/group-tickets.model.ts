import { TicketModel } from './ticket.model';

export class GroupModel {
  name: string;
  isExpanded: boolean;
  tickets: Array<TicketModel>;
  displayTotalTickets: number;

  constructor(
    name: string,
    tickets: Array<TicketModel>,
    displayTotalTickets: number) {

    this.mapTickets(tickets);
    this.setCommonValue(name);
    this.displayTotalTickets = displayTotalTickets;
  }

  private setCommonValue(name: string): void {
    this.name = name;
    this.isExpanded = true;
  }

  mapTickets(tickets: Array<TicketModel>) {
    this.tickets = [];
    tickets.forEach(item => {
      const ticket = new TicketModel(item);
      this.tickets.push(ticket);
    });
  }
}
