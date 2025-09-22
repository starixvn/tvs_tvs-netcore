import { inject, Injectable } from '@angular/core';
import { FilterModel } from 'src/add-request-new/component/filter/filter.model';
import { GetLogInfoQuery } from 'src/add-request-new/models/add-request.query';
import { GetLogInfoModel } from 'src/add-request-new/models/get-log-info.model';
import { CommonService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventReducedOverService } from './event-reduced-over.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly eventReducedOverService = inject(EventReducedOverService);

  async getLogInfo(logInfoEvent: LogInfoReducedOver, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitivePropertyEvent): Promise<void> {
    const getLogInfoQuery = this.initReducedOverGetLogInfoQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    primitiveProps.infoSiteDBDownModel = viewModel.infoSiteDBDownModel;
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