import { inject, Injectable } from '@angular/core';
import { TemplateService } from '../../../../../utility/components/template-message/template-message/services/template.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { HttpService } from '../../../../../utility/services/http.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel, GetLogInfoViewModel } from '../../models/get-log-info.model';
import { LogInfoTicketsQuery } from '../../models/live-game-early-ticket.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { EventEarlyKickOffService } from './event-eko.service';
import { PrimitiveProperty } from '../models/primitive-property.model';

@Injectable()
export class LogInfoService {
  private readonly httpService = inject(HttpService);
  private readonly commonService = inject(CommonService);
  private readonly eventEarlyKickOffService = inject(EventEarlyKickOffService);
  private readonly templateService = inject(TemplateService);

  public async getTickets(logInfo: LogInfoEarlyKickOff, isEdit: boolean, requestId: number, filter: FilterModel): Promise<void> {
    if (!logInfo.logInfoDetail.logInfoTicketsJson) {
      const getLogInfoResult = await this.getLogInfo([logInfo], isEdit, requestId, filter);
      this.assignResultLogInfoToEvents([logInfo], getLogInfoResult.getLogInfoModels);
    }

    await this.getLogInfoTickets(logInfo, filter);
  }

  public initQueryGetTickets(pageIndex: number, pageSize: number, logInfo: LogInfoEarlyKickOff, filter: FilterModel): LogInfoTicketsQuery {
    return {
      logInfoTicketsJson: logInfo.logInfoDetail.logInfoTicketsJson,
      issueTypeId: Number(filter.issueTypeId),
      pageIndex: pageIndex,
      pageSize: pageSize
    };
  }

  public assignTemplateMessageValueToEvent(eventLogInfo: LogInfoEarlyKickOff): void {
    eventLogInfo.templateValue = this.templateService.initializeTemplateValue(eventLogInfo.matchModel);
    eventLogInfo.templateValue.groupPHAffected = eventLogInfo.tableTicketsModel.groupPHAffected;
    eventLogInfo.templateValue.checkSettled = eventLogInfo.tableTicketsModel.isHasSettledTicket;
    eventLogInfo.templateValue.kickOffTime = eventLogInfo.kickOffTime;
  }

  public async getLogInfo(selectedEvents: LogInfoEarlyKickOff[], isEdit: boolean, requestId: number, filter: FilterModel): Promise<GetLogInfoViewModel> {
    const getLogInfoQuery = this.initGetLogInfoEarlyKickOffQuery(isEdit, requestId, filter, selectedEvents);
    return this.commonService.getLogInfo(getLogInfoQuery);
  }

  public initGetLogInfoEarlyKickOffQuery(isEdit: boolean, requestId: number, filter: FilterModel, events: LogInfoEarlyKickOff[]): GetLogInfoQuery {
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.earlyKickOffModels = this.eventEarlyKickOffService.getEarlyKickOffModel(filter, events);

    return query;
  }

  public assignResultLogInfoToEvents(selectedEvents: LogInfoEarlyKickOff[], logInfoModels: GetLogInfoModel[]): void {
    selectedEvents.forEach(event => {
      const logInfoModel = logInfoModels.find(x => x.matchId === event.matchId);
      if (logInfoModel) {
        event.isInvalidTotalTickets = logInfoModel.validation.isInvalidTotalTickets;
        event.isHasSettledTicket = logInfoModel.validation.isHasSettledTicket;
        event.isHasInstantlySettledTicket = logInfoModel.validation.isHasInstantlySettledTicket;
        event.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
        event.logInfoDetail = logInfoModel.logInfoDetail;
        event.isCollapse = logInfoModel.validation.isInvalidTotalTickets ? false : event.isCollapse;
        if (logInfoModel.validation.isInvalidTotalTickets) {  // check note***
          event.isShowValidation = true;
        }
      }
    });
  }

  public resetLogInfoOfEvent(allSelectedEvents: LogInfoEarlyKickOff[]): void {
    allSelectedEvents.forEach(event => {
      event.isRenderedTickets = false;
      event.messageValidationLogInfo = null;
    });
  }

  private async getLogInfoTickets(logInfo: LogInfoEarlyKickOff, filter: FilterModel): Promise<void> {
    if (logInfo.isRenderedTickets) {
      return;
    }

    const query = this.initQueryGetTickets(logInfo.pagingModel.page - 1, logInfo.pagingModel.pageSize, logInfo, filter);
    const result = await this.httpService.postJson<{}, TableTicketsModel>(query, 'api/AddRequest/GetLogInfoTickets');
    logInfo.tableTicketsModel.initData(result);
    logInfo.isRenderedTickets = true;
    logInfo.isShowValidation = true;
    logInfo.pagingModel.total = result.total;
    logInfo.isCollapse = false;
  }
}