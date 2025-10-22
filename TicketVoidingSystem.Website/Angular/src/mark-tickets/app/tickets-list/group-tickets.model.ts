import { CommonGroupTicketsModel } from '../../../utility/models/common.group-tickets.model';
import { TicketModel } from './ticket.model';

export class GroupModel extends CommonGroupTicketsModel<TicketModel> {
  uncheckedTicketList: Array<string>;

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
