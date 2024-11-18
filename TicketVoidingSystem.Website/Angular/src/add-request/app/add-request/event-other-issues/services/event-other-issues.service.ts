import { Injectable } from "@angular/core";
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { GroupBetTypesAddRequestModel } from "../../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model";
import { GetBetTypesQuery } from "../../../../../utility/components/advanced-mode/group-bettypes/group-bettypes.model";
import { DateTimeFormat, ModeType } from "../../../../../utility/constants/config";
import { CommonService } from "../../../../../utility/services/common.service";
import { OtherIssuesModel } from "../../models/event-other-issues.model";
import { FilterOtherIssuesModel } from "../models/filter-other-isssues.model";
import { OtherIssuesGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoOtherIssues } from "../models/log-info-other-issues.model";
import { ValidationService } from "./validation.service";

@Injectable({
  providedIn: 'root'
})

export class EventOtherIssuesService {
  constructor(
    private readonly commonService: CommonService,
    private readonly validationService: ValidationService
  ) { }

  async getGroupBetTypes(matchId: number, filterOtherIssuesModel: FilterOtherIssuesModel, subIssueTypeId: string): Promise<GroupBetTypesAddRequestModel> {
    const query: GetBetTypesQuery = {
      mode: ModeType.SPORT_BOOK,
      matchId: matchId
    };
    if (this.validationService.isSubTypeRestart(subIssueTypeId)) {
      query.fromTransDate = filterOtherIssuesModel.fromDateTime;
      query.toTransDate = filterOtherIssuesModel.toDateTime;
    }
    const data = await this.commonService.getGroupBetTypesTvs(query);
    const groupBetTypesModel = new GroupBetTypesAddRequestModel(_.assignIn([], data.groupBetTypes), true, '', false);

    return groupBetTypesModel;
  }

  initDefaultFilter(): FilterOtherIssuesModel {
    const currentMoment = moment.utc().tz('America/Caracas');
    return {
      fromDateTime: currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT),
      toDateTime: currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT)
    } as FilterOtherIssuesModel;
  }

  initDefaultLogInfoOtherIssues(): LogInfoOtherIssues {
    const event = new LogInfoOtherIssues();
    event.filterOtherIssues = this.initDefaultFilter();

    return event;
  }

  getOtherIssuesModel(logInfoOtherIssues: LogInfoOtherIssues, subIssueTypeId: string): OtherIssuesModel {
    const model = new OtherIssuesModel();
    model.matchId = logInfoOtherIssues.matchId;
    model.betTeamsResult = logInfoOtherIssues.betTeamsResult;
    model.logInfoDetail = logInfoOtherIssues.logInfoDetail;
    model.subIssueTypeId = Number(subIssueTypeId);
    model.allBetTypesSelection = logInfoOtherIssues.allBetTypesSelection;
    if (this.validationService.isSubTypeRestart(subIssueTypeId.toString())) {
      model.filterFromTransTime = logInfoOtherIssues.filterOtherIssues.fromDateTime;
      model.filterToTransTime = logInfoOtherIssues.filterOtherIssues.toDateTime;
    }

    return model;
  }

  assignModelsToEvents(inputModels: OtherIssuesModel): LogInfoOtherIssues {
    const event = new LogInfoOtherIssues();
    event.matchId = inputModels.matchId;
    event.logInfoDetail = inputModels.logInfoDetail;
    event.allBetTypesSelection = inputModels.allBetTypesSelection;
    event.filterOtherIssues = {
      fromDateTime: inputModels.filterFromTransTime,
      toDateTime: inputModels.filterToTransTime
    } as FilterOtherIssuesModel;

    return event;
  }

  initOtherIssuesGetLogInfoModel(subIssueTypeId: number, logInfo: LogInfoOtherIssues): OtherIssuesGetLogInfoQuery {
    const model = new OtherIssuesGetLogInfoQuery();
    model.matchId = logInfo.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.betTeamsResult = logInfo.betTeamsResult;
    if (this.validationService.isSubTypeRestart(subIssueTypeId.toString())) {
      model.filterFromTransTime = logInfo.filterOtherIssues.fromDateTime;
      model.filterToTransTime = logInfo.filterOtherIssues.toDateTime;
    }

    return model;
  }
}