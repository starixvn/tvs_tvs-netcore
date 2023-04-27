import { CommonTicketModel } from '../../../utility/models/common.ticket.model';

export class TicketModel extends CommonTicketModel {
  secondAcceptFlag: string;
  isParlay: boolean;
  isBonus: boolean;
  isMarked: boolean;
  constructor(item = null) {
    super(item);
  }
}
