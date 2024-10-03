import { Injectable } from '@angular/core';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';

@Injectable({
  providedIn: 'root'
})

export class LogInfoService {
  constructor(
    private readonly commonService: CommonService,
    private readonly eventWrongOddsSportsBookService: EventWrongOddsSportsBookService) {
  }

  async getLogInfo(logInfoEvent: LogInfoWrongOddsSportsBook, isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoWrongOddsSportsBookQuery(isEdit, requestId, filter, logInfoEvent);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(logInfoEvent, viewModel.getLogInfoModels);
  }

  private initGetLogInfoWrongOddsSportsBookQuery(isEdit: boolean, requestId: number,
    filter: FilterModel, events: LogInfoWrongOddsSportsBook): GetLogInfoQuery {
    const query = new GetLogInfoQuery();
    query.requestId = requestId;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    query.wrongOddsSportsBookModel = this.eventWrongOddsSportsBookService.getWrongOddsSportsBookGetLogInfoModel(Number(filter.subIssueTypeId), events);

    return query;
  }

  private assignResultLogInfoToEvents(logInfoEvent: LogInfoWrongOddsSportsBook, logInfoModels: GetLogInfoModel[]): void {
    const logInfoModel = logInfoModels.find(x => x.matchId === logInfoEvent.matchId);
    if (logInfoModel) {
      logInfoEvent.isHasSettledTicket = logInfoModel.validation.isHasSettledTicket;
      logInfoEvent.isHasInstantlySettledTicket = logInfoModel.validation.isHasInstantlySettledTicket;
      logInfoEvent.logInfoDetail = logInfoModel.logInfoDetail;
      logInfoEvent.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
    }
  }

  resetLogInfoOfEvent(logInfoEvent: LogInfoWrongOddsSportsBook): void {
    logInfoEvent.logInfoDetail = null;
    logInfoEvent.messageValidationLogInfo = null;
  }
}