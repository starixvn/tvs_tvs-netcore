import { inject, Injectable } from '@angular/core';
import { CommonService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoQuery } from '../../../../../models/add-request.query';
import { GetLogInfoModel } from '../../../../../models/get-log-info.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongHdpService } from './event-wrong-hdp.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly eventWrongHdpService = inject(EventWrongHdpService);

  async getLogInfo(allEvents: LogInfoWrongHdp[], isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoWrongHdpQuery(isEdit, requestId, filter, allEvents);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);

    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(allEvents, viewModel.getLogInfoModels);
  }

  private initGetLogInfoWrongHdpQuery(isEdit: boolean, requestId: number,
    filter: FilterModel, events: LogInfoWrongHdp[]): GetLogInfoQuery {
    const wrongHdpInfo = this.eventWrongHdpService.getWrongHdpModel(filter, events);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    if (StaticService.isWrongHDP(filter.issueTypeId)) {
      query.wrongHdpModels = wrongHdpInfo;
    } else {
      query.wrong1stHdpModels = wrongHdpInfo;
    }

    return query;
  }

  private assignResultLogInfoToEvents(allEvents: LogInfoWrongHdp[], logInfoModels: GetLogInfoModel[]): void {
    allEvents.forEach(event => {
      const logInfo = logInfoModels.find(x => x.matchId === event.matchId);
      if (logInfo) {
        event.logInfoDetail = logInfo.logInfoDetail;
        event.messageValidationLogInfo = StaticService.getValidationMessageList(logInfo);
      }
    });
  }

  resetLogInfoOfEvent(events: LogInfoWrongHdp[]): void {
    events.forEach(event => {
      event.isShowValidation = false;
      event.logInfoDetail = null;
      event.messageValidationLogInfo = null;
    });
  }
}