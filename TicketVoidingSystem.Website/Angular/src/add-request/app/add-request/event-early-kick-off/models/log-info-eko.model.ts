import { PagingModel } from "../../../../../utility/components/paging/paging/paging.model";
import { TemplateValue } from '../../../../../utility/components/template-message/template-message/template.model';
import { MatchModel } from "../../../../../utility/models/match.model";
import { ValidationMessage } from "../../models/get-log-info.model";
import { TableTicketsModel } from "../tickets-list/table-tickets.model";

export class LogInfoEarlyKickOff {
  matchId: number;
  matchCode?: string;
  leagueName: string;
  isMainMatch: boolean;
  kickOffTime: string;
  eventName: string;

  tableTicketsModel = new TableTicketsModel();
  matchModel: MatchModel;
  isCollapse: boolean;
  pagingModel = new PagingModel();

  messageValidationLogInfo?: ValidationMessage[];
  isInvalidTotalTickets: boolean;
  isHasSettledTicket: boolean;
  isHasInstantlySettledTicket: boolean;
  isShowValidation: boolean;
  templateValue?: TemplateValue;
}