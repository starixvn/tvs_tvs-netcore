import { TemplateValue } from "../../../../../utility/components/template-message/template-message/template.model";
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { MatchModel } from "../../../../../utility/models/match.model";
import { VoidedReason } from "../../../../../utility/models/reason.model";
import { ValidationMessage } from "../../models/get-log-info.model";
import { TicketsModel } from "../../pool-house-ticket/tickets/tickets.model";
import { FilterWrongOfferedNameModel } from "./filter-wrong-offered-name.model";

export class LogInfoWrongOfferedName {
  matchId: number;
  filterWrongOfferedName: FilterWrongOfferedNameModel;
  messageValidationLogInfo?: ValidationMessage[];
  logInfoDetail = new LogInfoDetail();

  titleTableTicket: string;
  tableTicketsModel = new TicketsModel();
  voidReason = new VoidedReason();
  matchModel: MatchModel;
  isCollapse: boolean;

  isInvalidTotalTickets: boolean;
  isHasSettledTicket: boolean;
  isHasInstantlySettledTicket: boolean;
  templateValue?: TemplateValue;
}