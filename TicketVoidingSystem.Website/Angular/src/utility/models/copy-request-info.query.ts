import { OperatorInfo } from "src/add-request/app/add-request/others/others.model";
import { LogInfoDetail } from "./log-info-detail.model";

export class CopyRequestInfoQuery {
  matchId: number;
  requestId: number;
  logInfoDetails?: LogInfoDetail[]
}

export class CopyRequestInfoResponse {
  requestId: number;
  matchId: number;
  //IsNeutral: boolean;
  globalShowTime: Date;
  filterBy: number;
  startVoidTime: Date;
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
}