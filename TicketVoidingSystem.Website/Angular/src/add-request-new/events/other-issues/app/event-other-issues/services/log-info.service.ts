import { inject, Injectable } from '@angular/core';
import { FilterModel } from 'src/add-request-new/component/filter/filter.model';
import { GetLogInfoQuery } from 'src/add-request-new/models/add-request.query';
import { GetLogInfoModel } from 'src/add-request-new/models/get-log-info.model';
import { CommonService } from 'src/utility/services/common.service';
import { StaticService } from 'src/utility/services/static.service';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventOtherIssuesService } from './event-other-issues.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly eventOtherIssuesService = inject(EventOtherIssuesService);

  resetLogInfoOfEvent(logInfoEvent: LogInfoOtherIssues): void {
    logInfoEvent.logInfoDetail = null;
    logInfoEvent.messageValidationLogInfo = null;
  }

  async getLogInfo(logInfoEvent: LogInfoOtherIssues, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoOtherIssuesQuery(requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    primitiveProps.infoSiteDBDownModel = viewModel.infoSiteDBDownModel;
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  private initGetLogInfoOtherIssuesQuery(requestId: number,
    filter: FilterModel, events: LogInfoOtherIssues): GetLogInfoQuery {
    const query = new GetLogInfoQuery();
    query.requestId = requestId;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    if (StaticService.isOtherIssues(filter.issueTypeId)) {
      query.otherIssuesModel = this.eventOtherIssuesService.initOtherIssuesGetLogInfoModel(filter.issueTypeId, Number(filter.subIssueTypeId), events);
    } else {
      query.matchEarlyCompletedModel = this.eventOtherIssuesService.initOtherIssuesGetLogInfoModel(filter.issueTypeId, Number(filter.subIssueTypeId), events);
    }
    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoOtherIssues, logInfoModels: GetLogInfoModel[]): void {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      logInfoEvent.isHasSettledTicket = logInfoModel.validation.isHasSettledTicket;
      logInfoEvent.isHasInstantlySettledTicket = logInfoModel.validation.isHasInstantlySettledTicket;
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
      logInfoEvent.betTypeCount = logInfoModel.betTypeCount;
    }
  }
}