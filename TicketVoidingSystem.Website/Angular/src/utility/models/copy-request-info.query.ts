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
  subIssueTypeId: number;
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
  filterFromTransTime: Date;
  serviceAcceptTime: string;
  minAllowanceTime: number;
  minAcceptType: string;

  //Wrong HDP/Wrong 1st HDP/Wrong OU / Wrong 1st OU
  wrongMarket?: string;
  actualMarket?: string;
  filterFavoriteType?: string;
  favoriteValue?: string;
  hdpValue?: string;
  homeName?: string;
  awayName?: string;

  //Wrong Odds
  fromOddsNotVoidHomeOver?: string;
  fromOddsNotVoidAwayUnder?: string;
  toOddsNotVoidHomeOver?: string;
  toOddsNotVoidAwayUnder?: string;
  correctOddsHomeOver?: string;
  correctOddsAwayUnder?: string;
}

export class BetTypeTicketsInfo {
  betTypeId: number;
  betId: number;
  betTypeName: string;
  inputtedRuns: string;
  playerName: string;
  ticketsCount: number;
}