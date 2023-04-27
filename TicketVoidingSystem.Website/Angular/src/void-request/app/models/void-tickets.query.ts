import { Message } from '../../../utility/components/template-message/messages/message';
import { BetID } from '../../../utility/models/bet-id.model';
import { Result } from '../../../utility/models/result';

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
