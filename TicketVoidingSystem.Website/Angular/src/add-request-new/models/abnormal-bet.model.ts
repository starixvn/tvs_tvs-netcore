import { MatchInfo } from "../../utility/models/event.model";
import { SendLetstalkModel } from "../events/abnormal-bet/app/event-abnormal-bet/event-abnormal-bet.model";

export class AbnormalBetModel {
  matches?: MatchInfo[];
  sendLetstalkModels?: SendLetstalkModel[];
  transIds: string;
  filterBy: number;
  subIssueTypeId: number;
  isConfirmCalculator: boolean;
  subIssueTypeName: string;
  abWhiteListTransIds?: string;
}