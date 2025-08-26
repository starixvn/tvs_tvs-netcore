import { LogInfoDetail } from "../../utility/models/log-info-detail.model";
import { MatchModel } from "../../utility/models/match.model";

export class WrongOfferedNameModel {
  matchId: number;
  subIssueTypeId: number;
  logInfoDetail: LogInfoDetail;
  licenseeNames: string;
  currencyIds: string;
  match?: MatchModel;
  wrongName: string;
  actualName: string;
  wrongNameT: string;
  actualNameT: string;
  wrongNameS: string;
  actualNameS: string;
}