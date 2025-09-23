import { inject, Injectable } from "@angular/core";
import moment from 'moment-timezone';
import { TemplateService } from "../../../../../../utility/components/template-message/template-message/services/template.service";
import { MatchModel } from "../../../../../../utility/models/match.model";
import { CommonService } from "../../../../../../utility/services/common.service";
import { StaticService } from "../../../../../../utility/services/static.service";
import { AddRequestApiService } from "../../../../../services/add-request-api.service";
import { AffectedTicketService } from "../../../../../component/affected-ticket/affected-ticket.service";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { WrongOfferedNameModel } from "../../../../../models/event-wrong-offered-name.model";
import { TicketsModel } from "../../../../../component/pool-house-ticket/tickets/tickets.model";
import { FilterWrongOfferedNameModel } from "../models/filter-wrong-offered-name.model";
import { LogInfoWrongOfferedName } from "../models/log-info-wrong-offered-name.model";
import { ValidationService } from "./validation.service";

@Injectable()
export class EventWrongOfferedNameService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly commonService = inject(CommonService);
  private readonly templateService = inject(TemplateService);
  private readonly affectedTicketService = inject(AffectedTicketService);
  private readonly validationService = inject(ValidationService);

  getPermissionAddRequest() {
    return this.addRequestApiService.getPermissionAddRequest();
  }

  initLogInfoEvent(): LogInfoWrongOfferedName {
    const event = new LogInfoWrongOfferedName();
    event.filterWrongOfferedName = new FilterWrongOfferedNameModel();
    return event;
  }

  initWrongMarketOfferedModel(subIssueTypeId: number, events: LogInfoWrongOfferedName): WrongOfferedNameModel {
    const model = new WrongOfferedNameModel();
    model.matchId = events.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.licenseeNames = events.filterWrongOfferedName.licenseeNames.join(',');
    model.currencyIds = events.filterWrongOfferedName.currencyIds.join(',');
    model.wrongName = events.filterWrongOfferedName.wrongName;
    model.actualName = events.filterWrongOfferedName.actualName;
    model.wrongNameT = events.filterWrongOfferedName.wrongNameT;
    model.actualNameT = events.filterWrongOfferedName.actualNameT;
    model.wrongNameS = events.filterWrongOfferedName.wrongNameS;
    model.actualNameS = events.filterWrongOfferedName.actualNameS;

    return model;
  }

  async assignModelsToEvents(filter: FilterModel, inputModel: WrongOfferedNameModel) {
    const ticketTable = await this.getAffectedTickets(Number(filter.issueTypeId), inputModel.logInfoDetail.logInfoTicketsJson);
    const voidedReason = await this.commonService.getVoidedReason(Number(filter.subIssueTypeId), inputModel.match.sportType);
    const filterWrongOfferedName = this.getFilterWrongOfferedNameModel(inputModel);
    const event = new LogInfoWrongOfferedName();
    event.matchId = inputModel.matchId;
    event.logInfoDetail = inputModel.logInfoDetail;
    event.matchModel = inputModel.match;
    event.tableTicketsModel = ticketTable;
    event.titleTableTicket = this.getTitleTableTicket(filter, ticketTable);
    event.voidReason = voidedReason;
    event.templateValue = this.getTemplateMessageValue(inputModel.match, ticketTable.isHasSettledTicket, filterWrongOfferedName);
    event.isCollapse = filter.isVoided;
    event.filterWrongOfferedName = filterWrongOfferedName;

    return event;
  }

  getFilterWrongOfferedNameModel(inputModel: WrongOfferedNameModel) {
    return {
      licenseeNames: inputModel.licenseeNames.split(','),
      currencyIds: inputModel.currencyIds.split(','),
      wrongName: inputModel.wrongName ?? `${inputModel.match.homeName} - vs - ${inputModel.match.awayName}`,
      actualName: inputModel.actualName ?? `${inputModel.match.homeName} - vs - ${inputModel.match.awayName}`,
      wrongNameT: inputModel.wrongNameT ?? `${inputModel.match.homeNameTraditional} - vs - ${inputModel.match.awayNameTraditional}`,
      actualNameT: inputModel.actualNameT ?? `${inputModel.match.homeNameTraditional} - vs - ${inputModel.match.awayNameTraditional}`,
      wrongNameS: inputModel.wrongNameS ?? `${inputModel.match.homeNameSimplified} - vs - ${inputModel.match.awayNameSimplified}`,
      actualNameS: inputModel.actualNameS ?? `${inputModel.match.homeNameSimplified} - vs - ${inputModel.match.awayNameSimplified}`
    } as FilterWrongOfferedNameModel;
  }

  getTitleTableTicket(filter: FilterModel, ticketTable: TicketsModel): string {
    return StaticService.getTitleVoidTicket(filter.issueTypeId, ticketTable.totalSingle, ticketTable.totalParlay, 0,
      this.getVoidTime(ticketTable.fromTime),
      this.getVoidTime(ticketTable.toTime));
  }

  getTemplateMessageValue(matchModel: MatchModel, isHasSettledTicket: boolean, filterWrongOfferedName: FilterWrongOfferedNameModel) {
    const templateValue = this.templateService.initializeTemplateValue(matchModel);
    templateValue.checkSettled = isHasSettledTicket;
    templateValue.wrongName = filterWrongOfferedName.wrongName;
    templateValue.actualName = filterWrongOfferedName.actualName;
    templateValue.wrongNameT = filterWrongOfferedName.wrongNameT;
    templateValue.actualNameT = filterWrongOfferedName.actualNameT;
    templateValue.wrongNameS = filterWrongOfferedName.wrongNameS;
    templateValue.actualNameS = filterWrongOfferedName.actualNameS;

    return templateValue;
  }

  getAffectedTickets(issueTypeId: number, logInfoTicketsJson: string) {
    return this.affectedTicketService.getAffectedTickets(issueTypeId, logInfoTicketsJson);
  }

  updateSelectedMatchToInput(match: MatchModel, filter: FilterWrongOfferedNameModel, subIssueTypeId: string) {
    if (this.validationService.isSubTypeOfLeague(subIssueTypeId)) {
      this.updateLeagueName(match, filter);
    } else {
      this.updateTeamName(match, filter);
    }
  }

  updateTeamName(match: MatchModel, filter: FilterWrongOfferedNameModel) {
    filter.wrongName = `${match.homeName} - vs - ${match.awayName}`;
    filter.actualName = `${match.homeName} - vs - ${match.awayName}`;
    filter.wrongNameT = `${match.homeNameTraditional} - vs - ${match.awayNameTraditional}`;
    filter.actualNameT = `${match.homeNameTraditional} - vs - ${match.awayNameTraditional}`;
    filter.wrongNameS = `${match.homeNameSimplified} - vs - ${match.awayNameSimplified}`;
    filter.actualNameS = `${match.homeNameSimplified} - vs - ${match.awayNameSimplified}`;
  }

  updateLeagueName(match: MatchModel, filter: FilterWrongOfferedNameModel) {
    filter.wrongName = match.leagueName
    filter.actualName = match.leagueName
    filter.wrongNameT = match.leagueNameTraditional
    filter.actualNameT = match.leagueNameTraditional
    filter.wrongNameS = match.leagueNameSimplified
    filter.actualNameS = match.leagueNameSimplified
  }


  private getVoidTime(date: Date): string {
    return moment(new Date(date)).format('hh:mm:ss A');
  }
}