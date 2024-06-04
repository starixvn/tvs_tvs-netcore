import { OperatorInfo } from "../../add-request/app/add-request/others/others.model";
import { LogInfoDetail } from "./log-info-detail.model";

export class CopyRequestInfoQuery {
  matchId: number;
  requestId: number;
  logInfoDetails?: LogInfoDetail[]
}

export class CopyRequestInfoResponse {
  requestInfo: RequestInfoForCopy;
  betTypeTickets: BetTypeTicketsInfo[];
}

export class RequestInfoForCopy {
  requestId: number;
  matchId: number;
  //IsNeutral: boolean;
  globalShowTime: Date;
  filterBy: number;
  issueTypeName: string;
  subIssueTypeName: string;
  isCheckedVar: boolean;
  provider: string;
  requestedBy: string;
  isHasSettledTicket: boolean;
  remark: string;
  matchEvent: string;
  leagueName: string;
  operators: OperatorInfo[];
  issueTypeId: number;
  voidFromTime: Date;
  voidToTime: Date;
  liveStatus: string;
  totalSingleCount: number;
  totalParlayCount: number;
  totalCancelCashOutCount: number;
}

export class BetTypeTicketsInfo {
  betTypeId: number;
  betTypeName: string;
  inputtedRuns: string;
  wicketOver: string;
  playerName: string;
  ticketsCount: number;
}