import { AffectedLicensee } from '../../../utility/components/licensee-affected-list/licensee-affected-list.model';
import { Message } from '../../../utility/components/template-message/messages/message';
import { BetID } from '../../../utility/models/bet-id.model';
import { CommonTicketsModel } from '../../../utility/models/common.tickets.model';
import { GroupModel } from './group-tickets.model';

export class TicketsModel extends CommonTicketsModel<GroupModel> {
  total: number;
  totalSingle: number;
  totalParlay: number;
  totalCancelCashOut: number;
  fromTime: Date;
  toTime: Date;
  fromDate: Date;
  toDate: Date;
  strFromTime: string;
  strToTime: string;
  singleTickets: BetID[];
  parlayTickets: BetID[];
  cancelCashOutTickets: BetID[];
  cricketTickets: BetID[];
  uncheckedTransIds: string[];
  betTypes: string;
  betTeam: string;
  hdpValues: string;
  isHasSettledTicket: boolean;
  isAllLiveTickets: boolean;
  isAllNonLiveTickets: boolean;
  checkPermissionTickets: BetID[];
  allCancelCashOutTickets: BetID[];
  groupPHAffected: number;
  licenseeAffectedList: AffectedLicensee[];
  betTypeNameReplaceMessage: Message;
  smallestMapTicket: string;
  groupBetTypeId: number;
  inning?: string;
}
