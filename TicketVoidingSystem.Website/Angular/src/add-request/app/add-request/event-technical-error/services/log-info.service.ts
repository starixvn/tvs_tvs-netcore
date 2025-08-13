import { inject, Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventTechnicalErrorService } from './event-technical-error.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly eventTechnicalErrorService = inject(EventTechnicalErrorService);

  async getLogInfo(logInfoEvent: LogInfoTechnicalError, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitivePropertyEvent): Promise<void> {
    const getLogInfoQuery = this.initTechnicalErrorGetLogInfoQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    primitiveProps.isShowBetTypeCount = false;
    primitiveProps.infoSiteDBDownModel = viewModel.infoSiteDBDownModel;
    
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  private initTechnicalErrorGetLogInfoQuery(isEdit: boolean, requestId: number, filter: FilterModel, logInfo: LogInfoTechnicalError): GetLogInfoQuery {
    const technicalErrorModels = this.eventTechnicalErrorService.getTechnicalErrorGetLogInfoModel(Number(filter.subIssueTypeId), logInfo);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.technicalErrorModel = technicalErrorModels;

    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoTechnicalError, logInfoModels: GetLogInfoModel[]): void {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
      logInfoEvent.betTypeCount = logInfoModel.betTypeCount;
    }
  }

  public resetLogInfoOfEvent(logInfoEvent: LogInfoTechnicalError): void {
    logInfoEvent.logInfoDetail = null;
    logInfoEvent.messageValidationLogInfo = null;
  }
}