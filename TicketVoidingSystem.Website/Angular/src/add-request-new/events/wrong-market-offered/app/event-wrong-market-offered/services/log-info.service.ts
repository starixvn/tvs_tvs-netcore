import { inject, Injectable } from '@angular/core';
import { CommonService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoQuery } from '../../../../../models/add-request.query';
import { GetLogInfoModel } from '../../../../../models/get-log-info.model';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { LogInfoItem, LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { EventWrongMarketOfferedService } from './event-wrong-market-offfered.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly eventWrongMarketOfferedService = inject(EventWrongMarketOfferedService);

  async getLogInfo(logInfoEvent: LogInfoWrongMarketOffered, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitivePropertyEvent): Promise<void> {
    const getLogInfoQuery = this.initWrongMarketOfferedGetLogInfoQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    primitiveProps.isShowBetTypeCount = false;
    primitiveProps.infoSiteDBDownModel = viewModel.infoSiteDBDownModel;
    
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  resetLogInfoOfEvent(logInfoEvent: LogInfoWrongMarketOffered): void {
    logInfoEvent.logInfoItems = [];
  }

  private initWrongMarketOfferedGetLogInfoQuery(isEdit: boolean, requestId: number, filter: FilterModel, logInfo: LogInfoWrongMarketOffered): GetLogInfoQuery {
    const wrongMarketOfferedModels = this.eventWrongMarketOfferedService.getWrongMarketOfferedGetLogInfoModel(Number(filter.subIssueTypeId), logInfo);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.wrongMarketOfferedModels = wrongMarketOfferedModels;

    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoWrongMarketOffered, logInfoModels: GetLogInfoModel[]): void {
    logInfoEvent.logInfoItems = logInfoModels.map(logInfoModel => this.createLogInfoItem(logInfoModel, logInfoEvent.filterWrongMarketOfferedModels));
  }

  private createLogInfoItem(logInfoModel: GetLogInfoModel, filterItems: FilterWrongMarketOfferedModel[]): LogInfoItem {
    return {
      id: logInfoModel.id,
      filterTime: filterItems.find(filterItem => filterItem.id === logInfoModel.id),
      logInfoDetail: logInfoModel.logInfoDetail,
      messageValidationLogInfo: StaticService.getValidationMessageList(logInfoModel),
      betTypeCount: logInfoModel.betTypeCount
    }
  }
}