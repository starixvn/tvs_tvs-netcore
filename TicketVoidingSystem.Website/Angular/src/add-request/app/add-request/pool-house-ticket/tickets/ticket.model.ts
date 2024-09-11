import { CommonTicketModel } from '../../../../../utility/models/common.ticket.model';

export class TicketModel extends CommonTicketModel {
  isParlay: boolean;
  isCashOut: boolean;
  isSettled: boolean;
  betTypeId: number;
  subBetTypeId: number;
  isInstantSettlement: boolean;
  groupBetTypeId?: number;
  constructor(item = null) {
    super(item);
  }
}
