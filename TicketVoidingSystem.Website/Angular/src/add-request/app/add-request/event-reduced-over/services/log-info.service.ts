import { Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventReducedOverService } from './event-reduced-over.service';

@Injectable({
  providedIn: 'root'
})

export class LogInfoService {
  constructor(
    private readonly commonService: CommonService,
    private readonly eventReducedOverService: EventReducedOverService) {
  }

  async getLogInfo(logInfoEvent: LogInfoReducedOver, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitivePropertyEvent): Promise<void> {
    const getLogInfoQuery = this.initReducedOverGetLogInfoQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  private initReducedOverGetLogInfoQuery(isEdit: boolean, requestId: number, filter: FilterModel, logInfo: LogInfoReducedOver): GetLogInfoQuery {
    const reducedOverInfo = this.eventReducedOverService.getReducedOverGetLogInfoModel(Number(filter.subIssueTypeId), logInfo.matchId, logInfo.filterReducedOvers);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.reducedOverModels = reducedOverInfo;

    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoReducedOver, logInfoModels: GetLogInfoModel[]): void {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
    }
  }

  public resetLogInfoOfEvent(logInfoEvent: LogInfoReducedOver): void {
    logInfoEvent.logInfoDetail = null;
    logInfoEvent.messageValidationLogInfo = null;
  }
}