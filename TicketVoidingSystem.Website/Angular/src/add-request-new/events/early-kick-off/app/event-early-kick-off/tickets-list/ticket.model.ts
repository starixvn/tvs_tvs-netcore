import { CommonTicketModel } from '../../../../../../utility/models/common.ticket.model';

export class TicketModel extends CommonTicketModel {
  isMarked: boolean;

  constructor(item = null) {
    super(item);
  }
}