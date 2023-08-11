import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { RedCardGetLogInfoQuery } from '../../models/event-red-card.model';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { PrimitiveProperty } from '../event-red-card.model';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCard } from '../log-info-red-card/log-info-red-card.model';
import { ValidationService } from './validation-service';

@Injectable({
  providedIn: 'root'
})
export class LogInfoService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly commonService: CommonService) {
  }

  async getLogInfo(allEvents: LogInfoRedCard[], primitiveProps: PrimitiveProperty, isEdit: boolean, requestId: number, filter: FilterModel,
    defaultFilterTimeWithAllowance: FilterTimeWithAllowance): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoRedCardQuery(primitiveProps.filterBy, isEdit, requestId, filter, allEvents, defaultFilterTimeWithAllowance);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);

    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    this.assignResultLogInfoToEvents(allEvents, viewModel.getLogInfoModels);
  }

  private initGetLogInfoRedCardQuery(filterBy: number, isEdit: boolean, requestId: number,
    filter: FilterModel, events: LogInfoRedCard[], defaultFilter: FilterTimeWithAllowance): GetLogInfoQuery {
    const redCardGetLogInfoQuery = this.getRedCardModel(filterBy, events, defaultFilter);
    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    if (StaticService.isRedCard(filter.issueTypeId.toString())) {
      query.redCardModels = redCardGetLogInfoQuery;
    } else if (StaticService.isDangerAccepted(filter.issueTypeId.toString())) {
      query.dangerAcceptedModels = redCardGetLogInfoQuery;
    }

    return query;
  }

  private getRedCardModel(filterBy: number, events: LogInfoRedCard[],
    defaultFilter: FilterTimeWithAllowance): RedCardGetLogInfoQuery[] {
    return events.map(x => {
      const logInfoQuery = new RedCardGetLogInfoQuery();
      logInfoQuery.matchId = x.matchId;
      logInfoQuery.filterBy = filterBy;
      logInfoQuery.subIssueTypeId = x.subIssueTypeId;
      logInfoQuery.aaTime = x.voidTimeArea.aaTime;
      logInfoQuery.paTime = x.voidTimeArea.paTime;
      logInfoQuery.saTime = x.voidTimeArea.saTime;

      if (this.validationService.isHasAllowanceTime(x)) {
        logInfoQuery.filterFromTransTime = defaultFilter.fromDateTime;
        logInfoQuery.filterToTransTime = defaultFilter.toDateTime;
      } else {
        logInfoQuery.filterFromTransTime = x.voidTimeArea.fromDateTime;
        logInfoQuery.filterToTransTime = x.voidTimeArea.toDateTime;
      }

      return logInfoQuery;
    });
  }

  private assignResultLogInfoToEvents(allEvents: LogInfoRedCard[], logInfoModels: GetLogInfoModel[]): void {
    allEvents.forEach(event => {
      const logInfo = logInfoModels.find(x => x.matchId === event.matchId);
      if (logInfo) {
        event.logInfoDetail = logInfo.logInfoDetail;
        if (logInfo.logInfoDetail && this.validationService.isHasAllowanceTime(event)) {
          event.voidTimeArea.fromDateTime = moment(logInfo.logInfoDetail.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
          event.voidTimeArea.toDateTime = moment(logInfo.logInfoDetail.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
        }
        event.messageValidationLogInfo = StaticService.getValidationMessageList(logInfo);
      }
    });
  }

  resetAllEventBeforeSearch(mainEvent: LogInfoRedCard, defaultFilter: FilterTimeWithAllowance, defaultSubIssueTypeId: number): void {
    this.resetSubIssueTypeOfEvent(mainEvent, defaultSubIssueTypeId);
    this.resetLogInfoOfEvent(mainEvent);
    this.resetVoidTimeArea(mainEvent, defaultFilter);
  }

  resetLogInfoOfEvent(event: LogInfoRedCard,): void {
    event.logInfoDetail = null;
    event.messageValidationLogInfo = null;
  }

  private resetSubIssueTypeOfEvent(event: LogInfoRedCard, subIssueType: number) {
    event.subIssueTypeId = subIssueType;
  }

  private resetVoidTimeArea(event: LogInfoRedCard, defaultFilter: FilterTimeWithAllowance) {
    event.voidTimeArea = {
      aaTime: defaultFilter.aaTime,
      paTime: defaultFilter.paTime,
      saTime: defaultFilter.saTime,
      fromDateTime: defaultFilter.fromDateTime,
      toDateTime: defaultFilter.toDateTime
    } as FilterTimeWithAllowance;
  }

  resetIsCheckedVar(event: LogInfoRedCard) {
    event.isCheckedVar = null;
    event.isHighLightVarCheck = null;
  }
}
