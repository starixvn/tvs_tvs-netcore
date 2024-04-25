import { MatchInfo } from "../../../../utility/models/event.model";
import { SendLetstalkModel } from "../event-abnormal-bet/event-abnormal-bet.model";

export class AbnormalBetModel {
  matches?: MatchInfo[];
  sendLetstalkModels: SendLetstalkModel[];
  transIds: string;
  filterBy: number;
  subIssueTypeId: number;
  isHasUusTickets: boolean;
  isConfirmCalculator: boolean;
  subIssueTypeName: string;
  listBetTeam: string;
  listBetType: string;
}