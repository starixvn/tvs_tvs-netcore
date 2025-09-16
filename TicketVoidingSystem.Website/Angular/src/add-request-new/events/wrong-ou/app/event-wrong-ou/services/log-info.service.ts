import { inject, Injectable } from '@angular/core';
import { CommonService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { GetLogInfoQuery } from '../../../../../models/add-request.query';
import { GetLogInfoModel } from '../../../../../models/get-log-info.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOuService } from './event-wrong-ou.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly eventWrongOuService = inject(EventWrongOuService);

  async getLogInfo(allEvents: LogInfoWrongOu[], isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoWrongOuQuery(isEdit, requestId, filter, allEvents);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);

    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(allEvents, viewModel.getLogInfoModels);
  }

  private initGetLogInfoWrongOuQuery(isEdit: boolean, requestId: number,
    filter: FilterModel, events: LogInfoWrongOu[]): GetLogInfoQuery {
    const wrongOuInfo = this.eventWrongOuService.getWrongOuModel(filter, events);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    if (StaticService.isWrongOU(filter.issueTypeId)) {
      query.wrongOuModels = wrongOuInfo;
    } else {
      query.wrong1stOuModels = wrongOuInfo;
    }

    return query;
  }

  private assignResultLogInfoToEvents(allSelectedEvents: LogInfoWrongOu[], logInfoModels: GetLogInfoModel[]): void {
    allSelectedEvents.forEach(event => {
      const logInfoModel = logInfoModels.find(x => x.matchId === event.matchId);
      if (logInfoModel) {
        event.logInfoDetail = logInfoModel.logInfoDetail;
        event.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
      }
    });
  }

  resetLogInfoOfEvent(allSelectedEvents: LogInfoWrongOu[]): void {
    allSelectedEvents.forEach(event => {
      event.isShowValidation = false;
      event.logInfoDetail = null;
      event.messageValidationLogInfo = null;
    });
  }
}