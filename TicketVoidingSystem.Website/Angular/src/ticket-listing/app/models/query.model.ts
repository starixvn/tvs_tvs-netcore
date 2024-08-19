import { CheckedBetType } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { Result } from '../../../utility/models/result';
import { TicketModel } from '../tickets/ticket.model';

export class CommonQuery {
  matchId: number;
  betTypes: string;
  selectionType: string;
  ballSequence: string;
  product: number;
  ticketType: number;
  eventType: number;
  liveHomeScore: number;
  liveAwayScore: number;
  fromTransDate: string;
  toTransDate: string;
  groupBy: number;
  betTeams?: CheckedBetType[];
  singleOrSubParlay: string;
  isReSettled:  boolean;
  selectionSubParlays: string;
}

export class GetSummaryQuery extends CommonQuery {
  licenseeId: number;
}

export class GetDetailQuery extends CommonQuery {
  licenseeName: string;
}

export class GetTicketsDetailQuery extends GetDetailQuery {
  pageIndex: number;
  pageSize: number;
}

export class GetTicketsDetailModel {
  totalItems: number;
  tickets: TicketModel[];
}

export class SendFileQuery extends GetDetailQuery {
  betTypeName: string;
  matchCode: string;
  eventDate: Date;
  globalShowTime: Date;
  startTime: Date;
  endTime: Date;
  matchEvent: string;
  title?: string;
  isChinaView: boolean;
  specialPlatform: number;
}

export class SendFileResult {
  fileName: string;
  result: Result<string>;
}

export class ExportExcelQuery extends SendFileQuery {
  isGroup: boolean;
  totalCreditTickets?: number;
}

export class LicenseeFile {
  name: string;
  file: string;

  constructor(name: string, file: string) {
    this.name = name;
    this.file = file;
  }
}

export class AmendmentApiQuery {
  licensees: LicenseeFile[];
  title: string;
  eventDate: Date;
}

export class AmendmentReponse {
  code: number;
  message: string;
  isChinaView: boolean;
  isSuccessful: boolean;
  isCanReSend: boolean;
  specialPlatform: number;
}
