import { inject, Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { CommonService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../../../../component/log-info-related-event/primitive-property.model';
import { GetLogInfoQuery } from '../../../../models/add-request.query';
import { RedCardGetLogInfoQuery } from '../../../../models/event-red-card.model';
import { GetLogInfoModel } from '../../../../models/get-log-info.model';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { ValidationService } from './validation.service';

@Injectable()
export class LogInfoService {
  private readonly validationService = inject(ValidationService);
  private readonly commonService = inject(CommonService);

  async getLogInfo(allEvents: LogInfoRelatedEvent[], primitiveProps: PrimitiveProperty, isEdit: boolean, requestId: number, filter: FilterModel,
    defaultFilterTimeWithAllowance: FilterTimeWithAllowance): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoRedCardQuery(primitiveProps.filterBy, isEdit, requestId, filter, allEvents, defaultFilterTimeWithAllowance);
    const logInfoViewModel = await this.commonService.getLogInfo(getLogInfoQuery);

    primitiveProps.transInfoAddRequestModel = logInfoViewModel.transInfoAddRequestModel;
    primitiveProps.infoSiteDBDownModel = logInfoViewModel.infoSiteDBDownModel;

    this.assignResultLogInfoToEvents(allEvents, logInfoViewModel.getLogInfoModels, defaultFilterTimeWithAllowance);
  }

  private initGetLogInfoRedCardQuery(filterBy: number, isEdit: boolean, requestId: number,
    filter: FilterModel, events: LogInfoRelatedEvent[], defaultFilterTimeWithAllowance: FilterTimeWithAllowance): GetLogInfoQuery {
    const getLogInfoQuery = this.getLogInfoModel(filterBy, events, defaultFilterTimeWithAllowance);

    const query = new GetLogInfoQuery();
    query.requestId = isEdit ? requestId : null;
    query.actionId = Number(filter.action);
    query.issueTypeId = Number(filter.issueTypeId);
    if (StaticService.isRedCard(filter.issueTypeId.toString())) {
      query.redCardModels = getLogInfoQuery;
    }
    if (StaticService.isDangerAccepted(filter.issueTypeId.toString())) {
      query.dangerAcceptedModels = getLogInfoQuery;
    }

    return query;
  }

  private getLogInfoModel(filterBy: number, events: LogInfoRelatedEvent[],
    defaultFilterTimeWithAllowance: FilterTimeWithAllowance): RedCardGetLogInfoQuery[] {
    return events.map(x => {
      const logInfoQuery = new RedCardGetLogInfoQuery();
      if (this.validationService.isHasAllowanceTime(x)) {
        logInfoQuery.filterFromTransTime = defaultFilterTimeWithAllowance.fromDateTime;
        logInfoQuery.filterToTransTime = defaultFilterTimeWithAllowance.toDateTime;
      } else {
        logInfoQuery.filterFromTransTime = x.voidTimeArea.fromDateTime;
        logInfoQuery.filterToTransTime = x.voidTimeArea.toDateTime;
      }
      logInfoQuery.matchId = x.matchId;
      logInfoQuery.filterBy = filterBy;
      logInfoQuery.subIssueTypeId = x.subIssueTypeId;
      logInfoQuery.aaTime = x.voidTimeArea.aaTime;
      logInfoQuery.paTime = x.voidTimeArea.paTime;
      logInfoQuery.saTime = x.voidTimeArea.saTime;

      return logInfoQuery;
    });
  }

  private assignResultLogInfoToEvents(allEvents: LogInfoRelatedEvent[], logInfoModels: GetLogInfoModel[], defaultFilterTimeWithAllowance: FilterTimeWithAllowance): void {
    allEvents.forEach(event => {
      const logInfo = logInfoModels.find(x => x.matchId === event.matchId);
      if (logInfo) {
        event.logInfoDetail = logInfo.logInfoDetail;
        if (logInfo.logInfoDetail && this.validationService.isHasAllowanceTime(event)) {
          event.voidTimeArea.toDateTime = moment(logInfo.logInfoDetail.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
          event.voidTimeArea.fromDateTime = moment(logInfo.logInfoDetail.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
        }
        event.messageValidationLogInfo = StaticService.getValidationMessageList(logInfo, defaultFilterTimeWithAllowance.fromDateTime, event.voidTimeArea.saTime);
      }
    });
  }

  public resetLogInfoOfEvent(events: LogInfoRelatedEvent[]): void {
    events.forEach(event => {
      event.logInfoDetail = null;
      event.messageValidationLogInfo = null;
    });
  }

  public resetIsCheckedVar(events: LogInfoRelatedEvent[]) {
    events.forEach(event => {
      event.isCheckedVar = null;
      event.isHighLightVarCheck = null;
    });
  }

  public resetVoidTimeArea(events: LogInfoRelatedEvent[], defaultFilter: FilterTimeWithAllowance) {
    events.forEach(event => {
      event.voidTimeArea = {
        saTime: defaultFilter.saTime,
        aaTime: defaultFilter.aaTime,
        paTime: defaultFilter.paTime,
        fromDateTime: defaultFilter.fromDateTime,
        toDateTime: defaultFilter.toDateTime
      } as FilterTimeWithAllowance;
    });
  }

  public updateIsCheckedVar(events: LogInfoRelatedEvent[], isVarChecked: boolean) {
    events.forEach(event => {
      event.isCheckedVar = StaticService.isShowVarCheck(event.subIssueTypeId) ? isVarChecked : null;
      event.isHighLightVarCheck = false;
    });
  }
}
