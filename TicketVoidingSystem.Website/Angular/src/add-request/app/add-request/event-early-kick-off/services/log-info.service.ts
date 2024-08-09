import { Injectable } from '@angular/core';
import { PagingConstant } from '../../../../../utility/components/paging/paging/paging.model';
import { TemplateValue } from '../../../../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../../../../utility/components/template-message/template-message/template.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { HttpService } from '../../../../../utility/services/http.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { GetTicketsQuery } from '../../models/get-tickets.query';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { EventEarlyKickOffService } from './event-eko.service';

@Injectable({
  providedIn: 'root'
})

export class LogInfoService {
  constructor(
    private readonly httpService: HttpService,
    private readonly commonService: CommonService,
    private readonly eventEarlyKickOffService: EventEarlyKickOffService,
    private readonly templateService: TemplateService) {
  }

  public async getTickets(query: GetTicketsQuery, logInfo: LogInfoEarlyKickOff, isEdit: boolean,
    requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty): Promise<void> {
    this.resetLogInfoOfEvent([logInfo]);
    await this.getLogInfo([logInfo], isEdit, requestId, filter, primitiveProps);
    query.transInfoJson = primitiveProps.transInfoAddRequestModel.transInfoJson;
    logInfo.pagingModel.pageSize = PagingConstant.SIZE_ONE;
    const data = await this.httpService.postJson<GetTicketsQuery, TableTicketsModel>(query, 'api/VoidRequest/GetTickets');
    logInfo.tableTicketsModel.initData(data);
    logInfo.isShowValidation = true;
    logInfo.isCollapse = false;
    logInfo.pagingModel.total = data.total;
  }

  public initQuery(pageIndex: number, pageSize: number, logInfo: LogInfoEarlyKickOff, filter: FilterModel): GetTicketsQuery {
    const model = new GetTicketsQuery();
    model.pageIndex = pageIndex;
    model.pageSize = pageSize;
    model.match = logInfo.matchModel;
    model.kickOffDate = logInfo.kickOffTime;
    model.issueTypeId = Number(filter.issueTypeId);
    model.requestId = null;
    model.actionId = Number(filter.action);

    return model;
  }

  async getLogInfo(allEvents: LogInfoEarlyKickOff[], isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoEarlyKickOffQuery(isEdit, requestId, filter, allEvents);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);

    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(allEvents, viewModel.getLogInfoModels);
  }

  private initGetLogInfoEarlyKickOffQuery(isEdit: boolean, requestId: number,
    filter: FilterModel, events: LogInfoEarlyKickOff[]): GetLogInfoQuery {
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.earlyKickOffModels = this.eventEarlyKickOffService.getEarlyKickOffModel(filter, events);

    return query;
  }

  private assignResultLogInfoToEvents(allSelectedEvents: LogInfoEarlyKickOff[], logInfoModels: GetLogInfoModel[]): void {
    allSelectedEvents.forEach(event => {
      const logInfoModel = logInfoModels.find(x => x.matchId === event.matchId);
      if (logInfoModel) {
        event.isInvalidTotalTickets = logInfoModel.validation.isInvalidTotalTickets;
        event.isHasSettledTicket = logInfoModel.validation.isHasSettledTicket;
        event.isHasInstantlySettledTicket = logInfoModel.validation.isHasInstantlySettledTicket;
        event.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
        event.isCollapse = logInfoModel.validation.isInvalidTotalTickets ? false : event.isCollapse;
        if (logInfoModel.validation.isInvalidTotalTickets) {
          event.isShowValidation = true;
        }
      }
    });
  }

  resetLogInfoOfEvent(allSelectedEvents: LogInfoEarlyKickOff[]): void {
    allSelectedEvents.forEach(event => {
      event.messageValidationLogInfo = null;
    });
  }

  public getTemplateValue(match: LogInfoEarlyKickOff): TemplateValue {
    const templateValue = this.templateService.getTemplateValue(match.matchModel);
    templateValue.groupPHAffected = match.tableTicketsModel.groupPHAffected;
    templateValue.checkSettled = match.tableTicketsModel.isHasSettledTicket;
    return templateValue;
  }
}