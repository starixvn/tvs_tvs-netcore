import { inject, Injectable } from '@angular/core';
import { CommonService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoQuery } from '../../../../../models/add-request.query';
import { GetLogInfoModel } from '../../../../../models/get-log-info.model';
import { WrongOfferedNameGetLogInfoQuery } from '../models/get-log-info.query';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOfferedNameService } from './event-wrong-offered-name.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly eventWrongOfferedNameService = inject(EventWrongOfferedNameService);

  async getLogInfo(logInfoEvent: LogInfoWrongOfferedName, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty) {
    const getLogInfoQuery = this.initGetLogInfoWrongOfferedName(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequest = viewModel.transInfoAddRequestModel;
    primitiveProps.infoSiteDBDownModel = viewModel.infoSiteDBDownModel;
    await this.assignResultLogInfoToEvents(filter, logInfoEvent, viewModel.getLogInfoModels);
  }

  async assignResultLogInfoToEvents(filter: FilterModel, logInfoEvent: LogInfoWrongOfferedName, logInfoModels: GetLogInfoModel[]) {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      const ticketTable = await this.eventWrongOfferedNameService.getAffectedTickets(Number(filter.issueTypeId), logInfoModel.logInfoDetail.logInfoTicketsJson);
      const voidReason = await this.getVoidedReason(logInfoModel.validation.isInvalidTotalTickets, Number(filter.subIssueTypeId), logInfoEvent.matchModel.sportType);
      const templateValue = this.eventWrongOfferedNameService.getTemplateMessageValue(logInfoEvent.matchModel, ticketTable.isHasSettledTicket, logInfoEvent.filterWrongOfferedName);
      logInfoEvent.tableTicketsModel = ticketTable;
      logInfoEvent.titleTableTicket = this.eventWrongOfferedNameService.getTitleTableTicket(filter, ticketTable);
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
      logInfoEvent.voidReason = voidReason;
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.isHasSettledTicket = logInfoModel.validation.isHasSettledTicket;
      logInfoEvent.isHasInstantlySettledTicket = logInfoModel.validation.isHasInstantlySettledTicket;
      logInfoEvent.isInvalidTotalTickets = logInfoModel.validation.isInvalidTotalTickets;
      logInfoEvent.templateValue = templateValue
    };
  }

  async getVoidedReason(isInvalidTotalTickets: boolean, subIssueTypeId: number, sportType: number) {
    return isInvalidTotalTickets ? null
      : this.commonService.getVoidedReason(Number(subIssueTypeId), sportType);
  }

  resetLogInfoOfEvent(logInfoEvent: LogInfoWrongOfferedName): void {
    logInfoEvent.messageValidationLogInfo = null;
  }

  private initGetLogInfoWrongOfferedName(isEdit: boolean, requestId: number, filter: FilterModel, logInfoEvent: LogInfoWrongOfferedName): GetLogInfoQuery {
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.wrongOfferedNameModel = this.initWrongMarketOfferedModelGetLogInfoQuery(Number(filter.subIssueTypeId), logInfoEvent);

    return query;
  }

  private initWrongMarketOfferedModelGetLogInfoQuery(subIssueTypeId: number, events: LogInfoWrongOfferedName): WrongOfferedNameGetLogInfoQuery {
    const query = new WrongOfferedNameGetLogInfoQuery();
    query.matchId = events.matchId;
    query.subIssueTypeId = subIssueTypeId;
    query.licenseeNames = events.filterWrongOfferedName.licenseeNames.join(',');
    query.currencyIds = events.filterWrongOfferedName.currencyIds.join(',');

    return query;
  }
}