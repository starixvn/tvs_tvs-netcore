import { PagingModel } from '../../../../../utility/components/paging/paging.model';
import { TemplateValue } from '../../../../../utility/components/template-message/template-message/template.model';
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
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
  messageValidationLogInfo?: ValidationMessage[];
  isInvalidTotalTickets: boolean;
  isHasSettledTicket: boolean;
  isHasInstantlySettledTicket: boolean;
  isShowValidation: boolean;
  templateValue?: TemplateValue;
  sportType: number;
  logInfoDetail = new LogInfoDetail();
  isRenderedTickets: boolean;
  pagingModel = new PagingModel();
}