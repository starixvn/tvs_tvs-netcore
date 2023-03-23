import * as moment from 'moment-timezone';
import { CheckedBetType } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { DateTimeFormat } from '../../../utility/constants/config';
import { BetID } from '../../../utility/models/bet-id.model';
import { MatchModel } from '../../../utility/models/match.model';
import { AllMarkedTicketModel } from '../mark-unmark-ticket/all-marked-ticket-list/all-marked-ticket.model';

export class GetTicketsQuery {
  status: string;
  searchBy: string;
  markedBy: string;
  matchId?: string;
  durations?: Duration[];
  liveHomeScore?: number;
  liveAwayScore?: number;
  liveIndicator?: number;
  currencyIds?: string;
  licenseeNames?: string;
  betTypes?: CheckedBetType[];
  match?: MatchModel;
  transIds?: string;
  bet?: string;
  pageIndex: number;
  pageSize: number;
}

export class GetLogsQuery {
  logDateFrom: string;
  logDateTo: string;
  matchId?: string;
  logActionIds: string;
  doneBy: string;

  pageIndex: number;
  pageSize: number;
}

export class RangeTime {
  from = moment(new Date()).tz('Etc/GMT-8').format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  to = this.from;

  
  isValid(): boolean {
    return this.isTimeValid(this.from) && this.isTimeValid(this.to);
  }

  isTimeValid(time: string): boolean {
    const timeMoment = moment(time.trim(), DateTimeFormat.FULL_DATE_TIME_FORMAT, true);
    if (!timeMoment.isValid()) {
      return false;
    }
    
    return true;
  }
}

export class Duration {
  fromTransDate: string;
  toTransDate: string;
}

export class MarkedTicketQuery {
  tickets: BetID[];
  status: string;
}


export class TicketDetailId {
  matchId: string;
  userId: number;
  createdDate: Date;
}

export class TicketDetailQuery extends TicketDetailId {
  match?: MatchModel;
  pageIndex: number;
  pageSize: number;
}

export class AllMarkedTicketQuery {
  matches: AllMarkedTicketModel[];
}
