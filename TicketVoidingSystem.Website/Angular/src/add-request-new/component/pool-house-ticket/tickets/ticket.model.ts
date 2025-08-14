import { CommonTicketModel } from '../../../../utility/models/common.ticket.model';

export class TicketModel extends CommonTicketModel {
  isParlay: boolean;
  isCashOut: boolean;
  isSettled: boolean;
  betTypeId: number;
  subBetTypeId: number;
  subBetType: string;
  isInstantSettlement: boolean;
  constructor(item = null) {
    super(item);
  }
}
