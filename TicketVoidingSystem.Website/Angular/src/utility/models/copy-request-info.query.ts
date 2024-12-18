import { OperatorInfo } from "../../add-request/app/add-request/others/others.model";
import { LogInfoDetail } from "./log-info-detail.model";

export class CopyRequestInfoQuery {
  matchId: number;
  requestId: number;
  logInfoDetails?: LogInfoDetail[];
  requestDetailId?: number;
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
  mistakenBy: string;
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
  filterOddsType: string;
  oddsValue: string;
  fromOdds: string;
  toOdds: string;
  correctOdds: string;
  tvDetectionValue: number;
  minuteOffset: string;
  secondOffset: string;
}

export class BetTypeTicketsInfo {
  betTypeId: number;
  betId: number;
  betTypeName: string;
  inputtedRuns: string;
  playerName: string;
  ticketsCount: number;
}