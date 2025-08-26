import { inject, Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventNotParticipateService } from './event-not-participate.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly eventNotParticipateService = inject(EventNotParticipateService);

  async getLogInfo(logInfoEvent: LogInfoNotParticipate, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitivePropertyEvent): Promise<void> {
    const getLogInfoQuery = this.initNotParticipateGetLogInfoQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    primitiveProps.infoSiteDBDownModel = viewModel.infoSiteDBDownModel;
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  private initNotParticipateGetLogInfoQuery(isEdit: boolean, requestId: number, filter: FilterModel, logInfo: LogInfoNotParticipate): GetLogInfoQuery {
    const notParticipateModels = this.eventNotParticipateService.getNotParticipateGetLogInfoModel(Number(filter.subIssueTypeId), logInfo.matchId, logInfo.filterNotParticipates);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.notParticipateModels = notParticipateModels;

    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoNotParticipate, logInfoModels: GetLogInfoModel[]): void {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
    }
  }

  public resetLogInfoOfEvent(logInfoEvent: LogInfoNotParticipate): void {
    logInfoEvent.logInfoDetail = null;
    logInfoEvent.messageValidationLogInfo = null;
  }
}