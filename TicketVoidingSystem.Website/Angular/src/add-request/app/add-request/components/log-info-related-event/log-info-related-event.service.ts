import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { BaseLogInfoQuery, LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { PrimitiveProperty } from './primitive-property.model';
import { RedCardGetLogInfoQuery } from '../../models/event-red-card.model';
import { WrongScoreGetLogInfoQuery } from '../../event-wrong-score/event-wrong-score.model';

@Injectable({
    providedIn: 'root'
})
export class LogInfoRelatedEventService {
    constructor(
        private readonly commonService: CommonService) { }

    async refreshLogInfoForRelatedEvent(isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty,
        logInfoRelatedEvent: LogInfoRelatedEvent, defaultFilterTimeWithAllowance: FilterTimeWithAllowance): Promise<void> {
        const getLogInfoQuery = this.initGetLogInfoQueries(primitiveProps.filterBy, isEdit, requestId, filter, logInfoRelatedEvent, defaultFilterTimeWithAllowance);
        const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
        const evenLogInfo = viewModel.getLogInfoModels[0];

        primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
        logInfoRelatedEvent.logInfoDetail = evenLogInfo.logInfoDetail;
        logInfoRelatedEvent.messageValidationLogInfo = StaticService.getValidationMessageList(viewModel.getLogInfoModels[0], logInfoRelatedEvent.voidTimeArea.fromDateTime, logInfoRelatedEvent.voidTimeArea.saTime);
        if (this.isHasAllowanceTime(logInfoRelatedEvent) && evenLogInfo.logInfoDetail) {
            logInfoRelatedEvent.voidTimeArea.fromDateTime = moment(evenLogInfo.logInfoDetail.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
            logInfoRelatedEvent.voidTimeArea.toDateTime = moment(evenLogInfo.logInfoDetail.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
            logInfoRelatedEvent.logInfoDetail.isHasWarningRangeTime = this.isHasWarningRangeTime(defaultFilterTimeWithAllowance.fromDateTime, logInfoRelatedEvent.logInfoDetail?.transVoidToTime);
        }
    }

    private initGetLogInfoQueries(filterBy: number, isEdit: boolean, requestId: number, filter: FilterModel,
        logInfoRelatedEvent: LogInfoRelatedEvent, defaultFilterTimeWithAllowance: FilterTimeWithAllowance): GetLogInfoQuery {
        const query: GetLogInfoQuery = {
            requestId: isEdit ? requestId : null,
            actionId: Number(filter.action),
            issueTypeId: Number(filter.issueTypeId),
            subIssueTypeId: Number(filter.subIssueTypeId),
            isShowLogOnly: false,
        };

        const logInfoQuery = this.createBaseLogInfoQuery(logInfoRelatedEvent, filterBy, defaultFilterTimeWithAllowance);
        if (StaticService.isWrongScore(filter.issueTypeId.toString())) {
            query.wrongScoreModels = this.getLogInfoWrongScoreModel(logInfoQuery);
        }
        else if (StaticService.isRedCard(filter.issueTypeId.toString())) {
            query.redCardModels = this.getLogInfoRedCardModel(logInfoQuery);
        }
        else if (StaticService.isDangerAccepted(filter.issueTypeId.toString())) {
            query.dangerAcceptedModels = this.getLogInfoRedCardModel(logInfoQuery);
        }

        return query;
    }

    private createBaseLogInfoQuery(event: LogInfoRelatedEvent, filterBy: number, defaultFilterTimeWithAllowance: FilterTimeWithAllowance): BaseLogInfoQuery {
        const logInfoQuery: BaseLogInfoQuery = {
            filterFromTransTime: this.isHasAllowanceTime(event) ? defaultFilterTimeWithAllowance.fromDateTime : event.voidTimeArea.fromDateTime,
            filterToTransTime: this.isHasAllowanceTime(event) ? defaultFilterTimeWithAllowance.toDateTime : event.voidTimeArea.toDateTime,
            matchId: event.matchId,
            filterBy: filterBy,
            subIssueTypeId: event.subIssueTypeId,
            aaTime: event.voidTimeArea.aaTime,
            paTime: event.voidTimeArea.paTime,
            saTime: event.voidTimeArea.saTime
        };
        return logInfoQuery;
    }

    private getLogInfoRedCardModel(logInfoQuery: BaseLogInfoQuery): RedCardGetLogInfoQuery[] {
        const logInfoRedCardQuery = new RedCardGetLogInfoQuery();
        Object.assign(logInfoRedCardQuery, logInfoQuery);
        return [logInfoRedCardQuery];
    }

    private getLogInfoWrongScoreModel(logInfoQuery: BaseLogInfoQuery): WrongScoreGetLogInfoQuery[] {
        const logInfoWrongScoreQuery = new WrongScoreGetLogInfoQuery();
        Object.assign(logInfoWrongScoreQuery, logInfoQuery);
        return [logInfoWrongScoreQuery];
    }

    private isHasAllowanceTime(event: LogInfoRelatedEvent): boolean {
        if (event.voidTimeArea.aaTime || event.voidTimeArea.paTime || event.voidTimeArea.saTime ||
            (event.voidTimeArea.aaTime === 0 && event.voidTimeArea.paTime === 0 && event.voidTimeArea.saTime === 0)) {
            return true;
        }

        return false;
    }

    private isHasWarningRangeTime(fromDateTime: string, toDateTime: Date) {
        if (!fromDateTime || !toDateTime) {
            return false;
        }

        const MILLISECONDS_IN_A_MINUTE = 60000;
        const fromTimeFilter = moment(fromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
        const toTimeLogInfo = moment(toDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
        const diffMilliseconds = toTimeLogInfo.diff(fromTimeFilter);

        return diffMilliseconds > MILLISECONDS_IN_A_MINUTE;
    }
}
