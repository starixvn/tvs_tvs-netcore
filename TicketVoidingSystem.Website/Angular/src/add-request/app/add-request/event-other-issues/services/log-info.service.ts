import { Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventOtherIssuesService } from './event-other-issues.service';

@Injectable({
  providedIn: 'root'
})

export class LogInfoService {
  constructor(
    private readonly commonService: CommonService,
    private readonly eventOtherIssuesService: EventOtherIssuesService) {
  }

  resetLogInfoOfEvent(logInfoEvent: LogInfoOtherIssues): void {
    logInfoEvent.logInfoDetail = null;
    logInfoEvent.messageValidationLogInfo = null;
  }

  async getLogInfo(logInfoEvent: LogInfoOtherIssues, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoOtherIssuesQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  private initGetLogInfoOtherIssuesQuery(isEdit: boolean, requestId: number,
    filter: FilterModel, events: LogInfoOtherIssues): GetLogInfoQuery {
    const query = new GetLogInfoQuery();
    query.requestId = requestId;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.otherIssuesModel = this.eventOtherIssuesService.initOtherIssuesGetLogInfoModel(Number(filter.subIssueTypeId), events);

    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoOtherIssues, logInfoModels: GetLogInfoModel[]): void {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      logInfoEvent.isHasSettledTicket = logInfoModel.validation.isHasSettledTicket;
      logInfoEvent.isHasInstantlySettledTicket = logInfoModel.validation.isHasInstantlySettledTicket;
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
    }
  }
}