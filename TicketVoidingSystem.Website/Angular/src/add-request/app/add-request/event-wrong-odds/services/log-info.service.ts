import { Injectable } from '@angular/core';
import { PoolHouseTicketValue } from '../../../../../utility/constants/config';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOddsService } from './event-wrong-odds.service';

@Injectable({
  providedIn: 'root'
})

export class LogInfoService {
  constructor(
    private readonly commonService: CommonService,
    private readonly eventWrongOddsService: EventWrongOddsService) {
  }

  async getLogInfo(logInfoEvent: LogInfoWrongOdds, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoWrongOddsQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  private initGetLogInfoWrongOddsQuery(isEdit: boolean, requestId: number,
    filter: FilterModel, events: LogInfoWrongOdds): GetLogInfoQuery {
    const wrongOddsInfo = this.eventWrongOddsService.getWrongOddsModel(filter, events);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.wrongOddsModels = [wrongOddsInfo];

    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoWrongOdds, logInfoModels: GetLogInfoModel[]): void {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
      logInfoEvent.isPoolHouseAffected = logInfoModel.validation.isPoolHouseAffected;
      if (!logInfoModel.validation.isPoolHouseAffected) {
        logInfoEvent.poolHouseCheckedBetTypes = PoolHouseTicketValue.NOT_AFFECTED;
      }
    }
  }

  resetLogInfoOfEvent(logInfoEvent: LogInfoWrongOdds): void {
    logInfoEvent.isShowValidation = false;
    logInfoEvent.logInfoDetail = null;
    logInfoEvent.messageValidationLogInfo = null;
  }

}