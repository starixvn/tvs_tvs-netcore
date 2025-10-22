import { CommonTicketsModel } from '../../../../utility/models/common.tickets.model';
import { GroupModel } from './group-tickets.model';

export class TicketsModel extends CommonTicketsModel<GroupModel> {
  totalSingle: number;
  totalParlay: number;
  selectedSingle: number;
  selectedParlay: number;
  isHasSettledTicket: boolean;
  fromTime: Date;
  toTime: Date;
}
