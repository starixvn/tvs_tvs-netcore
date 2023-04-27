import '../../../utility/extensions/string.extension';
import { CommonGroupTicketsModel } from '../../../utility/models/common.group-tickets.model';
import { TicketModel } from './ticket.model';

export class GroupModel extends CommonGroupTicketsModel<TicketModel> {

  constructor(
    name: string,
    tickets: Array<TicketModel>,
    displayTotalTickets: number) {
    super();
    this.mapTickets(tickets);
    this.setValue(name);
    this.displayTotalTickets = displayTotalTickets;
  }

  mapTickets(tickets: Array<TicketModel>) {
    this.tickets = [];
    tickets.forEach(item => {
      const ticket = new TicketModel(item);
      this.tickets.push(ticket);
    });
  }

  setValue(name: string) {
    this.setCommonValue(name);
  }

  getEnableSingleTickets(): string[] {
    const result = [];
    this.tickets.forEach(item => {
      if (item.isChecked && !item.isDisable && !item.isParlay) {
        result.push(item.value);
      }
    });

    return result;
  }

  getDisableBonusTickets(): string[] {
    const result = [];
    this.tickets.forEach(item => {
      if (item.isChecked && item.isDisable && item.isBonus) {
        result.push(item.value);
      }
    });

    return result;
  }

  getEnableParlayTickets(): string[] {
    const result = [];
    this.tickets.forEach(item => {
      if (item.isChecked && !item.isDisable && item.isParlay) {
        result.push(item.value);
      }
    });

    return result;
  }
}
