import { SendLetstalkModel } from "../../add-request/app/add-request/event-abnormal-bet/event-abnormal-bet.model";
import { MatchInfo } from "../../utility/models/event.model";

export class AbnormalBetModel {
  matches?: MatchInfo[];
  sendLetstalkModels?: SendLetstalkModel[];
  transIds: string;
  filterBy: number;
  subIssueTypeId: number;
  isConfirmCalculator: boolean;
  subIssueTypeName: string;
}