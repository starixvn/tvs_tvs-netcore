import { inject, Injectable } from "@angular/core";
import { LogInfoRelatedEvent } from "../../components/log-info-related-event/log-info-related-event.model";
import { ChildMatchModel } from "../../models/related-event.model";
import { FilterTimeWithAllowance } from "../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";
import { Category, GroupButton } from "../../filter/sub-issue-type-dialog/sub-issue-type-json.model";
import SubIssueTypeWrongScoreConfig from '../../filter/sub-issue-type-dialog/sub-type-wrong-score.json';
import { WrongScoreModel } from "../../models/event-wrong-score.model";
import { SaveRequestArg } from "../models/save-request.model";
import { ValidationService } from "./validation.service";
import { GetLogInfoParams } from "../models/get-log-info-params.model";
import { AddRelatedEventArg } from "../models/add-related-event.model";
import { ValidationBusinessRuleArgs } from "../models/validation.model";

@Injectable()
export class CreateMapService {
  private readonly validationService = inject(ValidationService);

  createNewLogInfoRelatedEvent(childEvent: ChildMatchModel, defaultFilterTimeWithAllowance: FilterTimeWithAllowance, subIssueTypeId: number): LogInfoRelatedEvent {
    const newRelatedEvent = new LogInfoRelatedEvent();
    newRelatedEvent.matchId = childEvent.matchId;
    newRelatedEvent.subIssueTypeId = subIssueTypeId;
    newRelatedEvent.matchCode = childEvent.matchCode;
    newRelatedEvent.leagueName = childEvent.leagueName;
    newRelatedEvent.eventName = `${childEvent.matchId} - ${childEvent.matchEvent}`;
    newRelatedEvent.sportType = childEvent.sportType;
    newRelatedEvent.eventDate = childEvent.eventDate;
    newRelatedEvent.isMainMatch = false;
    
    const group = this.getGroupSubTypeIncludeAllowanceTime(subIssueTypeId);
    newRelatedEvent.voidTimeArea = new FilterTimeWithAllowance();
    newRelatedEvent.voidTimeArea.fromDateTime = defaultFilterTimeWithAllowance.fromDateTime;
    newRelatedEvent.voidTimeArea.toDateTime = defaultFilterTimeWithAllowance.toDateTime;
    newRelatedEvent.voidTimeArea.aaTime = Number(group.aa);
    newRelatedEvent.voidTimeArea.paTime = Number(group.pa);
    newRelatedEvent.voidTimeArea.saTime = Number(group.sa);

    return newRelatedEvent;
  }

  private getGroupSubTypeIncludeAllowanceTime(subIssueTypeId: number): GroupButton {
    let group = null;
    const subIssueTypeConfig = SubIssueTypeWrongScoreConfig as Category[];
    subIssueTypeConfig.forEach(x => {
      x.groups.forEach(y => {
        if (y.buttonSelectAll?.some(t => t.subIssueTypeId === subIssueTypeId) || y.buttonSelectHomeAway?.some(t => t.subIssueTypeId === subIssueTypeId)) {
          group = y;
        }
      });
    });

    return group;
  }

  mapRelatedEventToWrongScoreModel(logInfoRelatedEvent: LogInfoRelatedEvent, args: SaveRequestArg) {
    const wrongScoreModel = new WrongScoreModel();

    wrongScoreModel.matchId = logInfoRelatedEvent.matchId;
    wrongScoreModel.filterBy = args.primitiveProps.filterBy;
    wrongScoreModel.subIssueTypeId = logInfoRelatedEvent.subIssueTypeId;
    wrongScoreModel.logInfoDetail = logInfoRelatedEvent.logInfoDetail;
    wrongScoreModel.isMainMatch = logInfoRelatedEvent.isMainMatch;
    wrongScoreModel.filterFromTransTime = this.validationService.isHasAllowanceTime(logInfoRelatedEvent) || logInfoRelatedEvent.isMainMatch
      ? args.defaultFilterTimeWithAllowance.fromDateTime : logInfoRelatedEvent.voidTimeArea.fromDateTime;
    wrongScoreModel.filterToTransTime = this.validationService.isHasAllowanceTime(logInfoRelatedEvent) || logInfoRelatedEvent.isMainMatch
      ? args.defaultFilterTimeWithAllowance.toDateTime : logInfoRelatedEvent.voidTimeArea.toDateTime;
    wrongScoreModel.aaTime = logInfoRelatedEvent.isMainMatch ? args.defaultFilterTimeWithAllowance.aaTime : logInfoRelatedEvent.voidTimeArea.aaTime;
    wrongScoreModel.paTime = logInfoRelatedEvent.isMainMatch ? args.defaultFilterTimeWithAllowance.paTime : logInfoRelatedEvent.voidTimeArea.paTime;
    wrongScoreModel.saTime = logInfoRelatedEvent.isMainMatch ? args.defaultFilterTimeWithAllowance.saTime : logInfoRelatedEvent.voidTimeArea.saTime;
    wrongScoreModel.voidFromTime = logInfoRelatedEvent.logInfoDetail?.voidFromTime.toString();
    wrongScoreModel.voidToTime = logInfoRelatedEvent.logInfoDetail?.voidToTime.toString();
    wrongScoreModel.isChecked = true;
    wrongScoreModel.actualScore = args.primitiveProps.actualScore;
    wrongScoreModel.actualTime = args.tvDetectionModel.actualTime;
    wrongScoreModel.minuteOffset = args.tvDetectionModel.minuteOffset;
    wrongScoreModel.secondOffset = args.tvDetectionModel.secondOffset;
    wrongScoreModel.serviceAcceptTime = args.tvDetectionModel.serviceAcceptTime;
    wrongScoreModel.isCheckedVar = args.primitiveProps.isCheckedVar;
    wrongScoreModel.tvDetectionValue = args.tvDetectionModel.tvDetectionValue;

    return wrongScoreModel;
  }

  mapWrongScoreSaveRequestModel(wrongScoreModel: WrongScoreModel, args: SaveRequestArg) {
    wrongScoreModel.filterBy = args.primitiveProps.filterBy;
    wrongScoreModel.subIssueTypeId = Number(args.filter.subIssueTypeId);
    wrongScoreModel.isChecked = true;
    wrongScoreModel.actualScore = args.primitiveProps.actualScore;
    wrongScoreModel.isCheckedVar = args.primitiveProps.isCheckedVar;

    return wrongScoreModel;
  }

  assignMainEvent(event: WrongScoreModel): LogInfoRelatedEvent {
    const isHasAllowanceTime = this.validationService.isHasAllowanceTimeWrongScoreModel(event);

    const voidTimeArea = new FilterTimeWithAllowance();
    voidTimeArea.fromDateTime = isHasAllowanceTime ? event.voidFromTime : event.filterFromTransTime;
    voidTimeArea.toDateTime = isHasAllowanceTime ? event.voidToTime : event.filterToTransTime;
    voidTimeArea.aaTime = event.aaTime;
    voidTimeArea.paTime = event.paTime;
    voidTimeArea.saTime = event.saTime;

    const logInfoRelatedEventModel = {
      logInfoDetail: event.logInfoDetail,
      messageValidationLogInfo: event.messageValidationLogInfo,
      voidTimeArea: voidTimeArea,
      matchId: event.matchId,
      subIssueTypeId: event.subIssueTypeId,
      eventDate: event.eventDate,
      sportType: event.sportType,
      isMainMatch: true
    } as LogInfoRelatedEvent;

    return logInfoRelatedEventModel;
  }

  createGetLogInfoParams(args: AddRelatedEventArg | ValidationBusinessRuleArgs): GetLogInfoParams {
    const getLogInfoParams: GetLogInfoParams = {
      isEdit: args.isEdit,
      requestId: args.requestId,
      filter: args.filter,
      primitiveProps: args.primitiveProps,
      mainEvent: args.mainEvent,
      relatedEvents: args.relatedEvents,
      defaultFilterTimeWithAllowance: args.defaultFilterTimeWithAllowance
    };
    
    if(args instanceof ValidationBusinessRuleArgs) {
      getLogInfoParams.wrongScoreModels = args.wrongScoreModels;
    }

    return getLogInfoParams;
  }
}