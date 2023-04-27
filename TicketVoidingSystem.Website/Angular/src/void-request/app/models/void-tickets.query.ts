import { BetID } from '../../../utility/models/bet-id.mode';
import { Result } from '../../../utility/models/result';
import { Message } from '../../../utility/modules/template-message/messages/message';

export class VoidTicketsQuery {
  requestId: number;
  singleTickets?: BetID[];
  parlayTickets?: BetID[];
  cancelCashOutTickets?: BetID[];
  cricketTickets?: BetID[];
  userName: string;
  userPassword: string;
  reason: string;
  reasonSC: string;
  message: Message;
  matchId: number;
  subIssueTypeId?: number;
  subIssueTypeName: string;
  subIssueTypeNameCS: string;
  issueTypeId?: number;
  voidingHistoryId?: number;
  historyStatusId?: number;
  negativeBalanceUsers?: string;
  voidFromTime: string;
  voidToTime: string;
  voidFromDate: string;
  voidToDate: string;
  decidedBy?: string;
  guid?: string;
}

export class InsertQueueResult {
  historyId: number;
  netposition?: Result<string>;
}
