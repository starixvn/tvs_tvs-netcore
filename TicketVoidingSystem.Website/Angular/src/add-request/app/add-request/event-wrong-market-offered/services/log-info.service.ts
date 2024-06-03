import { Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventWrongMarketOfferedService } from './event-wrong-market-offfered.service';

@Injectable({
  providedIn: 'root'
})

export class LogInfoService {
  constructor(
    private readonly commonService: CommonService,
    private readonly eventWrongMarketOfferedService: EventWrongMarketOfferedService) {
  }

  async getLogInfo(logInfoEvent: LogInfoWrongMarketOffered, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitivePropertyEvent): Promise<void> {
    const getLogInfoQuery = this.initWrongMarketOfferedGetLogInfoQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  private initWrongMarketOfferedGetLogInfoQuery(isEdit: boolean, requestId: number, filter: FilterModel, logInfo: LogInfoWrongMarketOffered): GetLogInfoQuery {
    const WrongMarketOfferedModels = this.eventWrongMarketOfferedService.getWrongMarketOfferedGetLogInfoModel(Number(filter.subIssueTypeId), logInfo);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.wrongMarketOfferedModel = WrongMarketOfferedModels;

    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoWrongMarketOffered, logInfoModels: GetLogInfoModel[]): void {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
      logInfoEvent.betTypeCount = logInfoModel.betTypeCount;
    }
  }

  public resetLogInfoOfEvent(logInfoEvent: LogInfoWrongMarketOffered): void {
    logInfoEvent.logInfoDetail = null;
    logInfoEvent.messageValidationLogInfo = null;
  }
}