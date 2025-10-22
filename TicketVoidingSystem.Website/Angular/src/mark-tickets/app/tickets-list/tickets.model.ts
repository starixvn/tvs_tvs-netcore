import { BetID } from '../../../utility/models/bet-id.model';
import { CommonTicketsModel } from '../../../utility/models/common.tickets.model';
import { GroupModel } from './group-tickets.model';

export class TicketsModel extends CommonTicketsModel<GroupModel> {
  totalItems: number;
  fromTime: string;
  toTime: string;
  singleCount: number;
  parlayCount: number;
  totalItemsList: BetID[];
  invalidTransIds: string;
  markedTransIds: string;
  movedTransIds: string;
  licenseesName: string;
  checkedTotalItems: number;
  uncheckedTransIds: string[];
  tempUncheckedList = new Array<string>();
}
